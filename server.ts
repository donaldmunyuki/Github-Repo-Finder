import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for correct protocol/host detection
  app.set('trust proxy', true);

  // Helper to get redirect URI
  const getRedirectUri = (req: express.Request) => {
    // Always prefer the host header to support both dev and pre URLs dynamically
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    return `${protocol}://${host}/api/auth/github/callback`;
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // GitHub OAuth URL endpoint
  app.get('/api/auth/github/url', (req, res) => {
    const redirectUri = getRedirectUri(req);
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    if (!clientId) {
      return res.status(500).json({ error: 'GITHUB_CLIENT_ID not configured' });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      allow_signup: 'true',
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.json({ url: authUrl });
  });

  // GitHub OAuth Callback endpoint
  app.get('/api/auth/github/callback', async (req, res) => {
    console.log('Callback hit!');
    const { code } = req.query;
    const redirectUri = getRedirectUri(req);
    console.log('Using redirect_uri:', redirectUri);
    
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!code || !clientId || !clientSecret) {
      console.error('Missing code or config');
      return res.status(400).send('Missing code or configuration');
    }

    try {
      console.log('Exchanging code for token...');
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const { access_token, error } = tokenResponse.data;

      if (error || !access_token) {
        throw new Error(error || 'No access token received');
      }

      // Fetch user data
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const userData = userResponse.data;

      // Send success message to opener
      const script = `
        <script>
          const message = {
            type: 'OAUTH_AUTH_SUCCESS',
            user: ${JSON.stringify(userData)},
            token: "${access_token}"
          };
          if (window.opener) {
            window.opener.postMessage(message, '*');
            window.close();
          } else {
            document.body.innerHTML = 'Authentication successful. You can close this window.';
          }
        </script>
      `;
      res.send(script);

    } catch (error) {
      console.error('OAuth error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if needed, though usually handled by build output)
    // For this environment, we rely on Vite middleware mostly, or static serving from dist
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    if (!process.env.GITHUB_CLIENT_ID) {
      console.warn('WARNING: GITHUB_CLIENT_ID is not set. GitHub OAuth will fail.');
    }
  });
}

startServer();

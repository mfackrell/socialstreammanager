export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // 2. Get the code from the request body or query
    // Vercel parses JSON automatically, so we try/catch just in case
    let code;
    let redirectUri;
    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            code = body.code;
            redirectUri = body.redirect_uri;
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON' });
        }
    } else if (req.method === 'GET') {
        code = req.query?.code;
        redirectUri = req.query?.redirect_uri;
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!code) {
        return res.status(400).json({ error: 'Missing code parameter' });
    }

    // 3. Send to Stripe
    const params = new URLSearchParams();
    params.append('client_secret', process.env.STRIPE_SECRET_KEY);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    if (redirectUri) {
        params.append('redirect_uri', redirectUri);
    }

    try {
        const stripeResponse = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            body: params
        });
        
        const data = await stripeResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

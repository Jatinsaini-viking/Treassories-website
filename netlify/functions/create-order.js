/* =========================================================
   ZEVAR — order creation (runs on Netlify's server, not in
   the browser). This is the only "backend" this project
   needs. Your Razorpay Key Secret lives here as an
   environment variable — it never reaches the customer's
   browser, which is what keeps this safe.

   You do not need to edit this file. Just set these two
   environment variables in Netlify:
     RAZORPAY_KEY_ID
     RAZORPAY_KEY_SECRET
   (Site settings → Environment variables, in your Netlify
   dashboard.) Full steps: README.md → "Making payments work".
========================================================= */

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Razorpay keys are not set in Netlify yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET under Site settings → Environment variables, then redeploy.' })
    };
  }

  let amountRupees;
  try {
    const body = JSON.parse(event.body || '{}');
    amountRupees = Number(body.amount);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!amountRupees || amountRupees <= 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amountRupees * 100), // Razorpay wants paise
        currency: 'INR',
        receipt: 'zevar_' + Date.now()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = (data && data.error && data.error.description) || 'Razorpay rejected the order request.';
      return { statusCode: 400, body: JSON.stringify({ error: message }) };
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not reach Razorpay: ' + err.message }) };
  }
};

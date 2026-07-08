/* =========================================================
   ZEVAR — checkout + Razorpay payment
   ---------------------------------------------------------
   IMPORTANT — please read this before going live:
   Razorpay requires every payment to be tied to an "Order"
   created on a SERVER (this is how Razorpay stops payment
   amounts being tampered with in the browser). A pure
   front-end-only site cannot do this safely — Razorpay will
   actually auto-refund any payment that isn't linked to a
   server-created order.

   So this project includes one small, ready-made serverless
   function that does that tiny bit of server work for you —
   you don't need to write any backend code, just deploy it.
   Full steps are in README.md under "Making payments work".
   Short version:
     1. Get your Key Id + Key Secret from
        https://dashboard.razorpay.com → Settings → API Keys.
     2. Paste the Key Id below (safe to expose — it's public).
     3. Deploy this whole folder to Netlify (free) and add
        RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET as environment
        variables in Netlify's site settings (the secret key
        never touches the browser this way).
   Until you do this, the Pay button will show a clear
   message instead of silently failing.
========================================================= */

const RAZORPAY_KEY_ID = "REPLACE_WITH_YOUR_RAZORPAY_KEY_ID"; // starts with rzp_test_ or rzp_live_

document.getElementById('goToCheckoutBtn').addEventListener('click', () => {
  if(window.Zevar.cart.length === 0) return;
  closeOverlay('cartOverlay');
  renderCheckoutSummary();
  openOverlay('checkoutOverlay');
});

function renderCheckoutSummary(){
  const box = document.getElementById('checkoutSummary');
  box.innerHTML = window.Zevar.cart.map(line => {
    const p = window.Zevar.products.find(p => p.id === line.id);
    if(!p) return '';
    return `<div><span>${p.name} × ${line.qty}</span><span>${window.Zevar.formatPrice(p.price * line.qty)}</span></div>`;
  }).join('');
  document.getElementById('checkoutTotal').textContent = window.Zevar.formatPrice(window.Zevar.cartTotal());
}

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('ckName').value;
  const phone = document.getElementById('ckPhone').value;
  const address = document.getElementById('ckAddress').value;
  const city = document.getElementById('ckCity').value;
  const pincode = document.getElementById('ckPincode').value;
  const amountRupees = window.Zevar.cartTotal();

  if(!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.startsWith('REPLACE')){
    showToast("Payment isn't connected yet — add your Razorpay key in checkout.js");
    return;
  }
  if(typeof Razorpay === 'undefined'){
    showToast('Payment script failed to load — check your internet connection.');
    return;
  }

  const payBtn = document.getElementById('payBtn');
  payBtn.disabled = true;
  payBtn.textContent = 'Preparing payment…';

  let order;
  try{
    const res = await fetch('/.netlify/functions/create-order', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ amount: amountRupees })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Could not create order');
    order = data;
  } catch(err){
    payBtn.disabled = false;
    payBtn.textContent = 'Pay with Razorpay';
    showToast("Payment setup isn't live yet — see README (needs Netlify + env vars).");
    return;
  }

  payBtn.disabled = false;
  payBtn.textContent = 'Pay with Razorpay';

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: 'Treassories',
    description: `Order for ${name} — ${window.Zevar.cartCount()} item(s)`,
    prefill: { name: name, contact: phone },
    notes: { address: `${address}, ${city} - ${pincode}` },
    theme: { color: '#C9A24B' },
    handler: function(response){
      showToast('Payment successful! We\u2019ll confirm your order shortly.');
      window.Zevar.cart = [];
      updateCartUI();
      closeOverlay('checkoutOverlay');
      document.getElementById('checkoutForm').reset();
    },
    modal: {
      ondismiss: function(){ showToast('Payment cancelled.'); }
    }
  };

  const rzp = new Razorpay(options);
  rzp.on('payment.failed', function(response){
    showToast('Payment failed — please try again.');
  });
  rzp.open();
});

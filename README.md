# Zevar — artificial jewellery website

Everything is already built: 3D-tilt product showcase, shop grid with
filters, cart, checkout, and 4-way login (Email, Google, Facebook,
Phone OTP). This file walks you through the handful of things that
**must** use your own free accounts (nobody can pre-fill these for
you — they're tied to your identity/business).

## What's in this folder

```
index.html                     the whole site (one page)
styles.css                     all styling
app.js                         product catalogue, cart, 3D tilt effects
firebase-config.js             ← edit this for login
auth.js                        login logic (don't need to edit)
checkout.js                    ← edit this for payments
netlify/functions/create-order.js   tiny server function (don't need to edit)
netlify.toml                   tells Netlify where the function lives
```

## 1. Preview it right now (no setup)

Open `index.html` directly in a browser, or better, run a local
server so nothing is blocked:

```
cd this-folder
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Everything works except login and
payments (see below) — you can browse, filter, add to cart, and open
checkout.

## 2. Add your own product photos

Open `app.js` and find the `PRODUCTS` list near the top. Each item has
an `icon` field showing a placeholder graphic. To use a real photo
instead, replace the product's visual in `styles.css`/`app.js` — the
simplest approach:

1. Put your photos in a new `images/` folder (e.g. `images/necklace-1.jpg`).
2. In `app.js`, add an `image: 'images/necklace-1.jpg'` field to that product.
3. In the `renderProducts()` and `openQuickView()` functions, swap the
   `<svg><use href="#${p.icon}"/></svg>` line for
   `<img src="${p.image}" alt="${p.name}">` when `p.image` exists.

Also update the hero product on line ~78 of `index.html`
(`caseProductIcon`) the same way.

## 3. Making login work (Firebase — free)

Open **`firebase-config.js`** — every step is explained inline as
comments. Short version: create a free project at
[console.firebase.google.com](https://console.firebase.google.com),
register a "Web app", paste the 6 config values it gives you into that
file, then turn on Email/Password, Google, Facebook and Phone sign-in
under **Authentication → Sign-in method**.

Two things worth knowing:
- **Facebook** login needs a free Facebook Developer app (App ID +
  App Secret) from [developers.facebook.com](https://developers.facebook.com).
- **Phone OTP** is the one method that isn't 100% free — Firebase
  requires linking a billing card (their "Blaze" plan) before phone
  sign-in works in production, because Google pays telecom carriers
  per SMS. You won't be charged unless real customers verify real
  numbers, and it's a few paisa per SMS, but the card does need to be
  on file. Email, Google and Facebook stay free with no card at all.

## 4. Making payments work (Razorpay — free)

Razorpay requires every payment to be linked to an "Order" created on
a server — this is what stops someone from tampering with the price
in their browser. A plain static site can't do this by itself, so this
project ships one tiny ready-made server function
(`netlify/functions/create-order.js`) that does it for you. You don't
need to write or understand the code — just:

1. Sign up at [razorpay.com](https://razorpay.com) (free). You can
   test everything in **Test Mode** with no KYC; switch to **Live
   Mode** (needs basic KYC) when you're ready to accept real money.
2. Dashboard → **Settings → API Keys** → generate a key. Copy the
   **Key Id** and **Key Secret**.
3. Paste the **Key Id** into `checkout.js` (near the top —
   it's public, safe to put in front-end code).
4. Deploy this folder to **Netlify** (see step 5 below) — this is
   what lets the server function run.
5. In Netlify: **Site settings → Environment variables**, add:
   - `RAZORPAY_KEY_ID` = your Key Id
   - `RAZORPAY_KEY_SECRET` = your Key Secret
   Then redeploy the site (Netlify does this automatically after you
   save environment variables in most cases; if not, trigger "Deploy
   site" manually).

Until this is set up, the Pay button shows a friendly message instead
of failing silently.

**Note on order tracking:** this project has no database, so once a
payment succeeds you won't automatically get an order list anywhere
except the Razorpay Dashboard (Payments tab). For a small shop this is
fine to manage manually at first — check Razorpay after each sale and
message the customer. When you're ready to grow, the next upgrade is
usually a simple orders database (Firebase Firestore, which is also
free at this scale).

## 5. Hosting it for free

Netlify is the easiest option because it also runs the payment
function above.

1. Create a free account at [netlify.com](https://netlify.com).
2. Put this whole folder in a GitHub repository (create a free GitHub
   account if you don't have one, create a new repo, upload these
   files).
3. In Netlify: **Add new site → Import an existing project → connect
   to GitHub** → pick your repo → Deploy.
4. Your site goes live at a free `something.netlify.app` address
   immediately. You can add your own domain name later (domains
   themselves cost money, but connecting one to Netlify is free).

If you only want to preview the design without payments/login working
yet, you can skip GitHub entirely and just drag-and-drop this folder
onto [app.netlify.com/drop](https://app.netlify.com/drop) — but the
payment function needs the GitHub route to run.

## 6. Things worth knowing

- The cart lives in memory only — refreshing the page clears it (no
  browser storage is used on purpose, to keep things simple and
  reliable). This is normal for a starter site; a "remember my cart"
  feature is a natural next upgrade.
- Brand name "Zevar", colours, and all copy are placeholders — search
  for "Zevar" across the files to rename, and edit the `:root` colour
  variables at the top of `styles.css` to re-theme.
- This is a solid starting point, not a finished enterprise store —
  as you grow you'll likely want a real product database, order
  history, and inventory tracking rather than editing `app.js` by
  hand for every new piece.

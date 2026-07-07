/* =========================================================
   ZEVAR — authentication (Email, Google, Facebook, Phone OTP)
   Powered by Firebase Authentication. See firebase-config.js
   to connect your own free project — until you do, these
   buttons will show a friendly "not configured yet" message.
========================================================= */

function authReady(){
  return typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;
}

function friendlyAuthError(err){
  const code = err && err.code ? err.code : '';
  if(!authReady() || code.includes('invalid-api-key') || code.includes('api-key-not-valid')){
    return "Login isn't connected yet — add your free Firebase keys in firebase-config.js (see the instructions in that file).";
  }
  const map = {
    'auth/email-already-in-use': 'That email already has an account — try logging in instead.',
    'auth/invalid-email': 'That email address doesn’t look right.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/wrong-password': 'Incorrect password — try again.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/popup-closed-by-user': 'Popup closed before finishing — try again.',
    'auth/invalid-phone-number': 'Enter a valid 10-digit mobile number.',
    'auth/too-many-requests': 'Too many attempts — please wait a bit and try again.',
    'auth/invalid-verification-code': 'That OTP doesn’t match — check and try again.',
    'auth/operation-not-allowed': 'This sign-in method isn’t switched on yet in your Firebase project.',
  };
  return map[code] || (err && err.message) || 'Something went wrong — please try again.';
}

function showAuthError(msg){
  document.getElementById('authError').textContent = msg;
}
function clearAuthError(){
  document.getElementById('authError').textContent = '';
}

/* ---------- tabs & panes ---------- */
function setAuthPane(name){
  document.querySelectorAll('.auth-pane').forEach(p => p.classList.toggle('is-active', p.dataset.pane === name));
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === name));
  clearAuthError();
}
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => setAuthPane(tab.dataset.tab));
});

document.getElementById('acctBtn').addEventListener('click', () => {
  openOverlay('authOverlay');
  if(authReady() && firebase.auth().currentUser){
    showAccountPane(firebase.auth().currentUser);
  } else {
    setAuthPane('login');
  }
});

function showAccountPane(user){
  document.querySelectorAll('.auth-pane').forEach(p => p.classList.toggle('is-active', p.dataset.pane === 'account'));
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('is-active'));
  const label = user.displayName || user.email || user.phoneNumber || 'there';
  document.getElementById('accountGreeting').textContent = `Signed in as ${label}`;
}

/* ---------- email/password ---------- */
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  clearAuthError();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if(!authReady()){ showAuthError(friendlyAuthError({})); return; }
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(cred => { showToast('Welcome back!'); closeOverlay('authOverlay'); })
    .catch(err => showAuthError(friendlyAuthError(err)));
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  clearAuthError();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  if(!authReady()){ showAuthError(friendlyAuthError({})); return; }
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(cred => cred.user.updateProfile({displayName: name}))
    .then(() => { showToast('Account created!'); closeOverlay('authOverlay'); })
    .catch(err => showAuthError(friendlyAuthError(err)));
});

/* ---------- google & facebook (same handler for login/signup tabs) ---------- */
function socialSignIn(providerName){
  clearAuthError();
  if(!authReady()){ showAuthError(friendlyAuthError({})); return; }
  const provider = providerName === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(() => { showToast('Signed in!'); closeOverlay('authOverlay'); })
    .catch(err => showAuthError(friendlyAuthError(err)));
}
document.getElementById('loginGoogleBtn').addEventListener('click', () => socialSignIn('google'));
document.getElementById('signupGoogleBtn').addEventListener('click', () => socialSignIn('google'));
document.getElementById('loginFbBtn').addEventListener('click', () => socialSignIn('facebook'));
document.getElementById('signupFbBtn').addEventListener('click', () => socialSignIn('facebook'));

/* ---------- phone OTP ---------- */
let recaptchaVerifier = null;
let confirmationResult = null;

function ensureRecaptcha(){
  if(recaptchaVerifier || !authReady()) return;
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
}

function openPhonePane(){
  setAuthPane('phone');
  document.getElementById('phoneNumberStep').style.display = 'block';
  document.getElementById('phoneOtpStep').style.display = 'none';
  document.getElementById('phoneStepLabel').textContent = 'Enter your phone number';
  ensureRecaptcha();
}
document.getElementById('loginPhoneBtn').addEventListener('click', openPhonePane);
document.getElementById('signupPhoneBtn').addEventListener('click', openPhonePane);
document.getElementById('phoneBackBtn').addEventListener('click', () => setAuthPane('login'));

document.getElementById('sendOtpBtn').addEventListener('click', () => {
  clearAuthError();
  if(!authReady()){ showAuthError(friendlyAuthError({})); return; }
  const digits = document.getElementById('phoneInput').value.trim();
  if(!/^[0-9]{10}$/.test(digits)){ showAuthError('Enter a valid 10-digit mobile number.'); return; }
  const fullNumber = '+91' + digits; // change +91 if targeting a different country
  ensureRecaptcha();
  firebase.auth().signInWithPhoneNumber(fullNumber, recaptchaVerifier)
    .then(result => {
      confirmationResult = result;
      document.getElementById('phoneNumberStep').style.display = 'none';
      document.getElementById('phoneOtpStep').style.display = 'block';
      document.getElementById('phoneStepLabel').textContent = `Code sent to ${fullNumber}`;
    })
    .catch(err => showAuthError(friendlyAuthError(err)));
});

document.getElementById('verifyOtpBtn').addEventListener('click', () => {
  clearAuthError();
  const code = document.getElementById('otpInput').value.trim();
  if(!confirmationResult){ showAuthError('Please request an OTP first.'); return; }
  confirmationResult.confirm(code)
    .then(() => { showToast('Phone verified!'); closeOverlay('authOverlay'); })
    .catch(err => showAuthError(friendlyAuthError(err)));
});

/* ---------- logout ---------- */
document.getElementById('logoutBtn').addEventListener('click', () => {
  if(authReady()) firebase.auth().signOut();
  closeOverlay('authOverlay');
  showToast('Logged out');
});

/* ---------- keep UI in sync with auth state ---------- */
if(authReady()){
  firebase.auth().onAuthStateChanged(user => {
    if(user && document.getElementById('authOverlay').classList.contains('is-open')){
      showAccountPane(user);
    }
  });
}

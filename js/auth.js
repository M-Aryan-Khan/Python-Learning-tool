/* Accounts: sign-up (with the "are you a school student?" question), e-mail code (OTP) verification,
   sign-in, password reset, the user menu in the header, and the gates that keep guests from running code. */
(function () {
  const { h } = PP;
  const B = PP.backend;
  const SCHOOL = (window.PP_CONFIG && window.PP_CONFIG.school) || 'our school';
  const EMAIL_CODES = !!B.emailCodes;
  const listeners = [];
  const state = { session: null, profile: null, ready: false };

  const ROLE_LABEL = { super_admin: 'Super admin', coordinator: 'Coordinator', campus_admin: 'Campus admin', section_admin: 'Section admin', student: 'Student' };
  const campusName = (c) => ({ maymar: 'Maymar', kda: 'KDA' }[c] || c || '');

  const auth = (PP.auth = {
    get user() { return state.session && state.session.user; },
    get profile() { return state.profile; },
    get isAdmin() { return !!state.profile && state.profile.role !== 'student'; },
    get isSuper() { return !!state.profile && state.profile.role === 'super_admin'; },
    /* only learners have tracked progress; admins just look around */
    get tracks() { return !!state.session && !(state.profile && state.profile.role !== 'student'); },
    get ready() { return state.ready; },
    ROLE_LABEL, campusName,
    onChange(fn) { listeners.push(fn); },
    roleLine(p) {
      p = p || state.profile; if (!p) return '';
      if (p.role === 'campus_admin') return `Campus admin · ${campusName(p.admin_campus)}`;
      if (p.role !== 'student') return ROLE_LABEL[p.role];
      if (p.school_status !== 'none' && p.campus) return `Student · ${campusName(p.campus)}`;
      return 'Learner';
    },
  });

  function emit() { listeners.forEach((f) => { try { f(auth.user, state.profile); } catch (e) { console.error(e); } }); }

  async function adopt(session) {
    state.session = session;
    state.profile = null;
    if (session) {
      try { state.profile = await B.getMyProfile(); } catch (e) { /* profile row may take a moment right after sign-up */ }
      if (!state.profile) { try { await new Promise((r) => setTimeout(r, 700)); state.profile = await B.getMyProfile(); } catch (e) { /* ignore */ } }
      if (session && state.profile && state.profile.active === false) { await B.signOut(); state.session = null; state.profile = null; PP.store.switchUser(null); emit(); return; }
      PP.store.switchUser(state.profile && state.profile.role !== 'student' ? null : session.user.id);   // admins get a throw-away, never-saved slot
    } else PP.store.switchUser(null);
    state.ready = true;
    emit();
  }

  auth.init = async function () {
    B.onAuth((s) => { if ((s && s.user.id) !== (state.session && state.session.user.id)) adopt(s); });
    try { await adopt(await B.getSession()); } catch (e) { state.ready = true; emit(); }
  };

  /* ---------------------------------------------------------------- guards */
  auth.gate = function (what) {
    if (auth.user) return true;
    auth.openModal('signin', { reason: what ? `Please sign in to ${what}.` : 'Please sign in to continue.' });
    return false;
  };

  auth.lockPage = function (title, text) {
    return h('div', { class: 'page' },
      h('div', { class: 'lockpage' },
        h('div', { class: 'lock-ico', html: LOCK_SVG }),
        h('h1', null, title),
        h('p', { class: 'lede' }, text),
        h('div', { class: 'lock-actions' },
          h('button', { class: 'btn primary lg', onclick: () => auth.openModal('signin') }, 'Sign in'),
          h('button', { class: 'btn lg', onclick: () => auth.openModal('signup') }, 'Create an account')),
        h('p', { class: 'lock-note' }, 'Lessons can always be read without signing in.')));
  };
  const LOCK_SVG = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  /* ---------------------------------------------------------------- modal */
  let modal = null, lastFocus = null;
  function closeModal() {
    if (!modal) return;
    modal.remove(); modal = null;
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  auth.closeModal = closeModal;
  document.addEventListener('keydown', (e) => { if (modal && e.key === 'Escape') closeModal(); });

  function field(label, input, hint) {
    return h('label', { class: 'af' }, h('span', { class: 'af-l' }, label), input, hint ? h('span', { class: 'af-h' }, hint) : null);
  }
  const text = (type, name, ph, extra) => h('input', Object.assign({ type, name, placeholder: ph || '', class: 'ain', autocomplete: 'off', spellcheck: 'false' }, extra || {}));

  function errBox() { return h('div', { class: 'a-err', role: 'alert', hidden: true }); }
  const showErr = (box, msg) => { box.textContent = msg; box.hidden = !msg; };
  function busy(btn, on, label) { btn.disabled = on; if (label) btn.textContent = on ? 'Please wait…' : label; }

  const PW_RULE = 'Minimum 8 characters.';
  function passwordField(label, name, extra, hint) {
    const input = text('password', name, 'At least 8 characters', Object.assign({ autocomplete: 'current-password', minlength: 8 }, extra || {}));
    const eye = h('button', { type: 'button', class: 'a-eye', 'aria-label': 'Show password', onclick: () => { const show = input.type === 'password'; input.type = show ? 'text' : 'password'; eye.textContent = show ? 'Hide' : 'Show'; eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); } }, 'Show');
    const note = hint ? h('span', { class: 'af-h a-rule' }, hint) : null;
    if (note) input.addEventListener('input', () => { note.classList.toggle('ok', input.value.length >= 8); note.classList.toggle('bad', input.value.length > 0 && input.value.length < 8); });
    return { el: h('label', { class: 'af' }, h('span', { class: 'af-l' }, label), h('span', { class: 'a-pw' }, input, eye), note), input };
  }

  auth.openModal = function (mode, ctx) {
    ctx = ctx || {};
    lastFocus = document.activeElement;
    if (!modal) {
      modal = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === modal) closeModal(); } });
      document.body.append(modal);
      document.body.classList.add('modal-open');
    }
    const screens = { signin: viewSignIn, signup: viewSignUp, verify: viewVerify, forgot: viewForgot, reset: viewReset };
    const card = h('div', { class: 'a-card', role: 'dialog', 'aria-modal': 'true' });
    screens[mode](card, ctx);
    modal.replaceChildren(card);
    const first = card.querySelector('input,select,button.primary');
    if (first) setTimeout(() => first.focus(), 30);
  };

  function head(card, title, sub) {
    card.append(
      h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: closeModal }, '×'),
      h('div', { class: 'a-brand' }, 'Python Path'),
      h('h2', { class: 'a-title', id: 'a-title' }, title),
      sub ? h('p', { class: 'a-sub' }, sub) : null);
    card.setAttribute('aria-labelledby', 'a-title');
    if (B.mode === 'demo') card.append(h('div', { class: 'a-demo' }, h('strong', null, 'Demo mode. '), 'No database is connected yet, so accounts and data stay in this browser only. The e-mail code is always ', h('code', null, B.demoCode), '.'));
  }

  /* ---- sign in ---- */
  function viewSignIn(card, ctx) {
    head(card, 'Sign in', ctx.reason || 'Welcome back. Sign in to run code, use the animations and save your progress.');
    const email = text('email', 'email', 'you@example.com', { autocomplete: 'email', inputmode: 'email', value: ctx.email || '' });
    const pw = passwordField('Password', 'password');
    const err = errBox();
    const go = h('button', { class: 'btn primary lg a-full', type: 'submit' }, 'Sign in');
    const form = h('form', { class: 'a-form', novalidate: true, onsubmit: async (e) => {
      e.preventDefault(); showErr(err, '');
      if (!email.value.trim() || !pw.input.value) return showErr(err, 'Enter your email and password.');
      busy(go, true, 'Sign in');
      try { await B.signIn(email.value.trim(), pw.input.value); closeModal(); }
      catch (ex) {
        if (ex.message === 'EMAIL_NOT_CONFIRMED') { try { await B.resendSignup(email.value.trim()); } catch (e2) { /* ignore */ } return auth.openModal('verify', { email: email.value.trim(), password: pw.input.value, fromSignIn: true }); }
        showErr(err, ex.message);
      } finally { if (modal) busy(go, false, 'Sign in'); }
    } }, field('Email', email), pw.el, err, go);
    card.append(form,
      h('div', { class: 'a-links' },
        h('button', { class: 'a-link', type: 'button', onclick: () => auth.openModal('forgot', { email: email.value }) }, 'Forgot your password?'),
        h('span', null, 'New here? ', h('button', { class: 'a-link', type: 'button', onclick: () => auth.openModal('signup') }, 'Create an account'))));
    if (B.mode === 'demo') card.append(h('div', { class: 'a-try' }, h('div', { class: 'a-try-t' }, 'Try a demo account'),
      [['Super admin', 'admin@demo.test', 'admin123'], ['Coordinator', 'coordinator@demo.test', 'coord123'], ['KDA admin', 'kda@demo.test', 'kda12345'], ['Student', 'student1@demo.test', 'student123']].map(([l, e, p]) => h('button', { type: 'button', class: 'an-chip', onclick: () => { email.value = e; pw.input.value = p; } }, l))));
  }

  /* ---- sign up ---- */
  function viewSignUp(card) {
    head(card, 'Create your account', EMAIL_CODES ? 'It takes a minute. We will email you a 6-digit code to confirm your address.' : 'It takes a minute. You can start learning straight away.');
    const name = text('text', 'name', 'Your full name', { autocomplete: 'name', maxlength: 80 });
    const email = text('email', 'email', 'you@example.com', { autocomplete: 'email', inputmode: 'email' });
    const pw = passwordField('Choose a password', 'new-password', { autocomplete: 'new-password' }, PW_RULE + ' Use something you will remember.');
    const err = errBox();
    const yes = h('input', { type: 'radio', name: 'school', value: 'yes' }), no = h('input', { type: 'radio', name: 'school', value: 'no' });
    const school = h('fieldset', { class: 'a-q' },
      h('legend', null, `Are you a student of ${SCHOOL}?`),
      h('label', { class: 'a-radio' }, yes, h('span', null, 'Yes, I am')),
      h('label', { class: 'a-radio' }, no, h('span', null, 'No, I am learning on my own')));
    const gr = text('text', 'gr', 'e.g. 2401', { maxlength: 30, inputmode: 'text' });
    const campus = h('select', { class: 'ain', 'aria-label': 'Campus' }, h('option', { value: '' }, 'Choose your campus'));
    const section = h('select', { class: 'ain', 'aria-label': 'Section' }, h('option', { value: '' }, 'Choose your section'));
    const note = h('p', { class: 'a-note' });
    const extra = h('div', { class: 'a-extra', hidden: true }, field('GR number (roll number)', gr), field('Campus', campus), field('Section', section), note,
      h('p', { class: 'a-note' }, 'Your teacher will check these details. If something is wrong they can correct it.'));
    let sections = [];
    Promise.all([B.getCampuses(), B.getSections()]).then(([cs, ss]) => {
      sections = ss;
      cs.forEach((c) => campus.append(h('option', { value: c.code }, c.name)));
    }).catch(() => showErr(err, 'Could not load the campus list. Check your connection and reopen this window.'));
    const fillSections = () => {
      section.replaceChildren(h('option', { value: '' }, 'Choose your section'));
      const list = sections.filter((s) => s.campus === campus.value);
      list.forEach((s) => section.append(h('option', { value: s.id }, s.name)));
      note.textContent = campus.value && !list.length ? 'No sections are listed for this campus yet. Ask your teacher, or sign up as "No" and ask to be moved to your class later.' : '';
    };
    campus.addEventListener('change', fillSections);
    [yes, no].forEach((r) => r.addEventListener('change', () => { extra.hidden = !yes.checked; }));
    const go = h('button', { class: 'btn primary lg a-full', type: 'submit' }, 'Create account');
    const form = h('form', { class: 'a-form', novalidate: true, onsubmit: async (e) => {
      e.preventDefault(); showErr(err, '');
      const em = email.value.trim();
      if (name.value.trim().length < 2) return showErr(err, 'Please enter your full name.');
      if (!/^\S+@\S+\.\S+$/.test(em)) return showErr(err, 'Enter a valid email address.');
      if (pw.input.value.length < 8) return showErr(err, 'Your password must be at least 8 characters long.');
      if (!yes.checked && !no.checked) return showErr(err, `Please tell us whether you are a student of ${SCHOOL}.`);
      const meta = { full_name: name.value.trim(), school: yes.checked };
      if (yes.checked) {
        if (!gr.value.trim()) return showErr(err, 'Enter your GR number.');
        if (!campus.value) return showErr(err, 'Choose your campus.');
        if (!section.value) return showErr(err, 'Choose your section.');
        Object.assign(meta, { gr_number: gr.value.trim(), campus: campus.value, section_id: section.value });
      }
      busy(go, true, 'Create account');
      try {
        const r = await B.signUp(em, pw.input.value, meta);
        if (r.needsOtp) auth.openModal('verify', { email: em, password: pw.input.value });
        else closeModal();
      } catch (ex) { showErr(err, ex.message); } finally { if (modal) busy(go, false, 'Create account'); }
    } }, field('Full name', name), field('Email', email, EMAIL_CODES ? 'We only use it for your login and codes.' : 'Any email address works. You will use it to sign in.'), pw.el, school, extra, err, go);
    card.append(form, h('div', { class: 'a-links' }, h('span', null, 'Already have an account? ', h('button', { class: 'a-link', type: 'button', onclick: () => auth.openModal('signin') }, 'Sign in'))));
  }

  /* ---- verify e-mail code ---- */
  function viewVerify(card, ctx) {
    head(card, 'Check your email', `We sent a 6-digit code to ${ctx.email}. Type it below. It can take a minute to arrive; check spam too.`);
    const code = text('text', 'code', '123456', { inputmode: 'numeric', maxlength: 8, class: 'ain a-code', autocomplete: 'one-time-code' });
    const err = errBox();
    const ok = h('div', { class: 'a-ok', hidden: true });
    const go = h('button', { class: 'btn primary lg a-full', type: 'submit' }, 'Confirm');
    const resend = h('button', { class: 'a-link', type: 'button' }, 'Send a new code');
    let cool = 0, timer = null;
    const tick = () => { if (cool > 0) { cool--; resend.disabled = true; resend.textContent = `Send a new code (${cool}s)`; } else { resend.disabled = false; resend.textContent = 'Send a new code'; clearInterval(timer); } };
    const startCool = () => { cool = 30; clearInterval(timer); timer = setInterval(tick, 1000); tick(); };
    startCool();
    resend.addEventListener('click', async () => { showErr(err, ''); try { await B.resendSignup(ctx.email); ok.hidden = false; ok.textContent = 'A new code is on its way.'; startCool(); } catch (ex) { showErr(err, ex.message); } });
    const form = h('form', { class: 'a-form', novalidate: true, onsubmit: async (e) => {
      e.preventDefault(); showErr(err, '');
      if (!/^\d{4,8}$/.test(code.value.trim())) return showErr(err, 'Type the code from your email (numbers only).');
      busy(go, true, 'Confirm');
      try {
        await B.verifySignup(ctx.email, code.value.trim());
        if (ctx.fromSignIn && ctx.password && !auth.user) await B.signIn(ctx.email, ctx.password);
        closeModal();
      } catch (ex) { showErr(err, ex.message); } finally { if (modal) busy(go, false, 'Confirm'); }
    } }, field('6-digit code', code), ok, err, go);
    card.append(form, h('div', { class: 'a-links' }, resend, h('button', { class: 'a-link', type: 'button', onclick: () => auth.openModal('signup') }, 'Use a different email')));
  }

  /* ---- forgot password ---- */
  function viewForgot(card, ctx) {
    if (!EMAIL_CODES) {
      head(card, 'Forgot your password?', 'No problem. Your teacher can set a new one for you.');
      card.append(h('div', { class: 'a-info' }, h('p', null, 'Tell your teacher the email address you signed up with. They will give you a temporary password, and you can change it afterwards from My progress.')),
        h('div', { class: 'a-links' }, h('button', { class: 'a-link', type: 'button', onclick: () => auth.openModal('signin', { email: ctx.email }) }, 'Back to sign in')));
      return;
    }
    head(card, 'Reset your password', 'Enter your email and we will send a 6-digit code.');
    const email = text('email', 'email', 'you@example.com', { autocomplete: 'email', inputmode: 'email', value: ctx.email || '' });
    const err = errBox();
    const go = h('button', { class: 'btn primary lg a-full', type: 'submit' }, 'Send code');
    card.append(h('form', { class: 'a-form', novalidate: true, onsubmit: async (e) => {
      e.preventDefault(); showErr(err, '');
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) return showErr(err, 'Enter a valid email address.');
      busy(go, true, 'Send code');
      try { await B.requestReset(email.value.trim()); auth.openModal('reset', { email: email.value.trim() }); }
      catch (ex) { showErr(err, ex.message); } finally { if (modal) busy(go, false, 'Send code'); }
    } }, field('Email', email), err, go), h('div', { class: 'a-links' }, h('button', { class: 'a-link', type: 'button', onclick: () => auth.openModal('signin') }, 'Back to sign in')));
  }

  function viewReset(card, ctx) {
    head(card, 'Choose a new password', `Enter the code we sent to ${ctx.email} and your new password.`);
    const code = text('text', 'code', '123456', { inputmode: 'numeric', maxlength: 8, class: 'ain a-code', autocomplete: 'one-time-code' });
    const pw = passwordField('New password', 'new-password', { autocomplete: 'new-password' }, PW_RULE);
    const err = errBox();
    const go = h('button', { class: 'btn primary lg a-full', type: 'submit' }, 'Save password');
    card.append(h('form', { class: 'a-form', novalidate: true, onsubmit: async (e) => {
      e.preventDefault(); showErr(err, '');
      if (!/^\d{4,8}$/.test(code.value.trim())) return showErr(err, 'Type the code from your email.');
      if (pw.input.value.length < 8) return showErr(err, 'Your password needs at least 8 characters.');
      busy(go, true, 'Save password');
      try { await B.confirmReset(ctx.email, code.value.trim(), pw.input.value); closeModal(); }
      catch (ex) { showErr(err, ex.message); } finally { if (modal) busy(go, false, 'Save password'); }
    } }, field('6-digit code', code), pw.el, err, go));
  }

  /* ---------------------------------------------------------------- header user menu */
  function passwordDialog() {
    const a = h('input', { class: 'ain', type: 'password', autocomplete: 'new-password', placeholder: 'New password (minimum 8 characters)', 'aria-label': 'New password' });
    const b = h('input', { class: 'ain', type: 'password', autocomplete: 'new-password', placeholder: 'Type it again', 'aria-label': 'Repeat new password' });
    const err = h('div', { class: 'a-err', hidden: true, role: 'alert' });
    const ov = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === ov) ov.remove(); } });
    const go = h('button', { class: 'btn primary', type: 'button' }, 'Change password');
    go.addEventListener('click', async () => {
      err.hidden = true;
      const fail = (m) => { err.textContent = m; err.hidden = false; };
      if (a.value.length < 8) return fail('Use at least 8 characters.');
      if (a.value !== b.value) return fail('The two passwords are not the same.');
      go.disabled = true;
      try { await B.changePassword(a.value); ov.remove(); const t = h('div', { class: 'toast', role: 'status' }, 'Password changed'); document.body.append(t); setTimeout(() => t.classList.add('on'), 10); setTimeout(() => t.remove(), 3200); }
      catch (e) { fail(B.friendly ? B.friendly(e) : e.message); go.disabled = false; }
    });
    ov.append(h('div', { class: 'a-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Change password' },
      h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: () => ov.remove() }, '×'),
      h('h2', { class: 'a-title' }, 'Change password'), h('p', { class: 'a-sub' }, 'No email code is needed while you are signed in.'),
      h('div', { class: 'a-form' }, a, b, err, h('div', { class: 'btnrow' }, go, h('button', { class: 'btn', type: 'button', onclick: () => ov.remove() }, 'Cancel')))));
    document.body.append(ov); setTimeout(() => a.focus(), 30);
  }

  function initials(name) { return String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'; }
  auth.mountMenu = function (slot) {
    let closeMenu = () => {};
    document.addEventListener('click', (e) => { if (!slot.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    function draw() {
      slot.replaceChildren();
      if (!auth.user) {
        slot.append(h('button', { class: 'btn small a-signin', onclick: () => auth.openModal('signin') }, 'Sign in'));
        return;
      }
      const p = state.profile;
      const label = p ? p.full_name : auth.user.email;
      const btn = h('button', { class: 'a-avatar', type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false', title: label }, initials(label));
      const menu = h('div', { class: 'a-menu', role: 'menu', hidden: true },
        h('div', { class: 'a-menu-h' }, h('strong', null, label), h('span', null, auth.roleLine()), p && p.school_status === 'claimed' ? h('em', null, 'Waiting for your teacher to confirm') : null),
        auth.isAdmin ? h('a', { href: '#/admin', role: 'menuitem', onclick: () => close() }, 'Admin dashboard') : h('a', { href: '#/me', role: 'menuitem', onclick: () => close() }, 'My progress'),
        h('button', { type: 'button', role: 'menuitem', onclick: () => { close(); passwordDialog(); } }, 'Change password'),
        h('button', { type: 'button', role: 'menuitem', onclick: async () => { close(); await B.signOut(); if (B.mode === 'supabase') { /* onAuth handles it */ } else adopt(null); location.hash = '#/'; } }, 'Sign out'));
      function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
      closeMenu = close;
      btn.addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); });
      slot.append(btn, menu);
    }
    draw();
    auth.onChange(draw);
  };
})();

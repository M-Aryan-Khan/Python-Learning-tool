/* PP.backend: everything the site needs from a server, behind one small interface.
 *   - Supabase mode: real accounts, real database (see backend/schema.sql), enforced by row level security.
 *   - Demo mode (no keys in config.js): the same interface backed by this browser's localStorage with sample data,
 *     so every screen can be tried before the database is connected. Demo data never leaves the browser.
 * All methods return Promises and throw Error(message) with a student-friendly message.
 */
window.PP = window.PP || {};

PP.backend = (function () {
  const cfg = window.PP_CONFIG || {};
  // add ?demo=1 to the address to try the sample data without touching the real database
  const forceDemo = /[?&]demo=1(&|$)/.test(location.search);
  const live = !forceDemo && !!(cfg.supabaseUrl && cfg.supabaseKey && window.supabase);
  const EMAIL_CODES = !!cfg.emailCodes;
  // 9-A, 9-B ... before 10-A, 10-B (numbers sort as numbers)
  const sortSections = (list) => list.slice().sort((a, b) => (a.campus + '|' + a.name).localeCompare(b.campus + '|' + b.name, undefined, { numeric: true }));

  const friendly = (e) => {
    let m = String((e && e.message) || e || 'Something went wrong');
    const status = e && e.status;
    // a timeout from the e-mail service arrives as an empty message such as "{}"
    if (status >= 500 || /^\s*\{\s*\}?\s*$/.test(m) || /gateway|timeout|timed out|unexpected_failure|error sending/i.test(m)) return 'We could not send your code by email right now. Please wait a minute and try again. If you already tried once, press Sign in with the same email and password: it will send a new code. If it keeps failing, tell your teacher.';
    if (/Invalid login credentials/i.test(m)) return 'Wrong email or password.';
    if (/Email not confirmed/i.test(m)) return 'EMAIL_NOT_CONFIRMED';
    if (/account with that email already exists/i.test(m)) return 'That email address already has an account.';
    if (/already registered|already exists/i.test(m)) return 'An account with this email already exists. Press Sign in. If you never entered your code, signing in will send a new one.';
    if (/rate limit|too many/i.test(m)) return 'Too many attempts or emails. Please wait a few minutes and try again.';
    if (/expired|invalid.*(token|otp)|token.*invalid|otp/i.test(m)) return 'That code is wrong or has expired. Check it and try again, or ask for a new one.';
    if (/password.*(at least|short|weak)/i.test(m)) return 'Choose a longer password (at least 8 characters).';
    if (/Failed to fetch|NetworkError|network/i.test(m)) return 'Could not reach the server. Check your internet connection.';
    if (/only the super admin/i.test(m)) return 'Only the super admin can do that.';
    return m;
  };

  /* ======================================================================
     SUPABASE
     ====================================================================== */
  function makeSupabase() {
    const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
    const ok = (r) => { if (r.error) throw new Error(friendly(r.error)); return r.data; };
    const PAGE = 1000;
    async function all(build) {   // fetch every row of a query, 1000 at a time
      const out = [];
      for (let from = 0; ; from += PAGE) {
        const rows = ok(await build().range(from, from + PAGE - 1));
        out.push(...rows);
        if (rows.length < PAGE) break;
      }
      return out;
    }
    const sess = (s) => (s && s.user ? { user: { id: s.user.id, email: s.user.email } } : null);
    const api = {
      mode: 'supabase',
      async getSession() { const { data } = await sb.auth.getSession(); return sess(data.session); },
      onAuth(cb) { sb.auth.onAuthStateChange((evt, s) => cb(sess(s), evt)); },
      async signUp(email, password, meta) {
        const r = await sb.auth.signUp({ email, password, options: { data: meta } });
        if (r.error) throw new Error(friendly(r.error));
        if (r.data.user && r.data.user.identities && r.data.user.identities.length === 0) throw new Error('An account with this email already exists. Press Sign in. If you never entered your code, signing in will send a new one.');
        return { needsOtp: !r.data.session };
      },
      async verifySignup(email, code) { ok(await sb.auth.verifyOtp({ email, token: code.trim(), type: 'signup' })); },
      async resendSignup(email) { ok(await sb.auth.resend({ type: 'signup', email })); },
      async signIn(email, password) { ok(await sb.auth.signInWithPassword({ email, password })); },
      async signOut() { await sb.auth.signOut(); },
      async requestReset(email) { ok(await sb.auth.resetPasswordForEmail(email)); },
      async changePassword(pw) { ok(await sb.auth.updateUser({ password: pw })); },
      async setPassword(userId, pw) { ok(await sb.rpc('admin_set_password', { p_user: userId, p_password: pw })); },
      async confirmReset(email, code, password) {
        ok(await sb.auth.verifyOtp({ email, token: code.trim(), type: 'recovery' }));
        ok(await sb.auth.updateUser({ password }));
      },
      async getCampuses() { return ok(await sb.from('campuses').select('code,name').order('name')); },
      async getSections(opts) {
        let q = sb.from('sections').select('id,campus,name,active');
        if (!(opts && opts.all)) q = q.eq('active', true);
        return sortSections(ok(await q));
      },
      async getMyProfile() { const { data } = await sb.auth.getUser(); if (!data.user) return null; return ok(await sb.from('profiles').select('*').eq('id', data.user.id).single()); },
      async updateMyName(name) { ok(await sb.rpc('update_my_name', { p_name: name })); },
      async myProgress() { const { data } = await sb.auth.getUser(); return all(() => sb.from('progress').select('item_id,lesson_id,kind,attempts,passes,completed_at,last_attempt_at,code').eq('user_id', data.user.id).order('item_id')); },
      async saveProgress(p) { ok(await sb.rpc('save_progress', { p_item: p.item_id, p_lesson: p.lesson_id || null, p_kind: p.kind || null, p_code: p.code || null, p_passed: !!p.passed })); },
      async bumpLesson(lessonId, views, runs) { ok(await sb.rpc('bump_lesson', { p_lesson: lessonId, p_views: views || 0, p_runs: runs || 0 })); },

      /* ---- admin ---- */
      async listProfiles() {
        const profiles = await all(() => sb.from('profiles').select('*').order('created_at', { ascending: false }).order('id'));
        const sum = await all(() => sb.from('student_summary').select('*').order('user_id'));
        const by = {}; sum.forEach((s) => { by[s.user_id] = s; });
        return profiles.map((p) => Object.assign({ done_items: 0, touched_items: 0, attempts: 0, last_activity: p.last_seen }, by[p.id] ? { done_items: by[p.id].done_items, touched_items: by[p.id].touched_items, attempts: by[p.id].attempts, last_activity: by[p.id].last_activity } : {}, p));
      },
      async progressFor(userIds) {
        const out = [];
        for (let i = 0; i < userIds.length; i += 40) {
          const chunk = userIds.slice(i, i + 40);
          out.push(...await all(() => sb.from('progress').select('user_id,item_id,lesson_id,kind,attempts,passes,completed_at,first_attempt_at,last_attempt_at').in('user_id', chunk).order('user_id').order('item_id')));
        }
        return out;
      },
      async studentDetail(userId) {
        const progress = await all(() => sb.from('progress').select('*').eq('user_id', userId).order('item_id'));
        const stats = ok(await sb.from('lesson_stats').select('*').eq('user_id', userId));
        return { progress, stats };
      },
      async recentProgress(limit) { return ok(await sb.from('progress').select('user_id,item_id,lesson_id,kind,attempts,completed_at,last_attempt_at').order('last_attempt_at', { ascending: false }).limit(limit || 30)); },
      async myManagedSections() { const { data } = await sb.auth.getUser(); return ok(await sb.from('admin_sections').select('section_id').eq('user_id', data.user.id)).map((r) => r.section_id); },
      async listAdminSections() { return all(() => sb.from('admin_sections').select('user_id,section_id').order('user_id').order('section_id')); },
      async setSections(userId, ids) { ok(await sb.rpc('admin_set_sections', { p_user: userId, p_sections: ids })); },
      async createAdmin(f) { return ok(await sb.rpc('admin_create_admin', { p_email: f.email, p_password: f.password, p_name: f.full_name, p_role: f.role, p_campus: f.campus || null, p_sections: f.sections || [] })); },
      async createStudent(f) { return ok(await sb.rpc('admin_create_student', { p_email: f.email, p_password: f.password, p_name: f.full_name, p_gr: f.gr_number, p_section: f.section_id })); },
      async setRole(userId, role, campus) { ok(await sb.rpc('admin_set_role', { p_user: userId, p_role: role, p_campus: campus || null })); },
      async updateProfile(userId, f) { ok(await sb.rpc('admin_update_profile', { p_user: userId, p_name: f.full_name, p_gr: f.gr_number || null, p_status: f.school_status, p_campus: f.campus || null, p_section: f.section_id || null, p_active: f.active })); },
      async upsertSection(s) {
        if (s.id) ok(await sb.from('sections').update({ name: s.name, active: s.active }).eq('id', s.id));
        else ok(await sb.from('sections').insert({ campus: s.campus, name: s.name, active: true }));
      },
    };
    return api;
  }

  /* ======================================================================
     DEMO (localStorage)
     ====================================================================== */
  function makeDemo() {
    const KEY = 'pp.demo.v3';
    const SKEY = 'pp.demo.session';
    const uid = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'u' + Math.random().toString(36).slice(2) + Date.now().toString(36));
    const now = () => new Date().toISOString();
    const DEMO_CODE = '123456';
    let db = null;
    let listeners = [];
    let pending = {};   // email -> {kind, meta, password}

    function seed() {
      const rand = (() => { let s = 12345; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
      const d = { users: [], profiles: [], sections: [], progress: [], stats: [], admin_sections: [] };
      const sec = (campus, name) => { const s = { id: uid(), campus, name, active: true }; d.sections.push(s); return s; };
      const kb = sec('kda', '10-B'), kc = sec('kda', '10-C'), ma = sec('maymar', '10-A'), mb = sec('maymar', '10-B');
      sec('kda', '9-B'); sec('kda', '9-C'); sec('maymar', '9-A'); sec('maymar', '9-C');
      const person = (email, password, name, extra) => {
        const id = uid();
        d.users.push({ id, email, password, verified: true });
        d.profiles.push(Object.assign({ id, email, full_name: name, role: 'student', admin_campus: null, school_status: 'none', campus: null, section_id: null, gr_number: null, active: true, created_at: now(), last_seen: null }, extra));
        return id;
      };
      person('admin@demo.test', 'admin123', 'Sir Aryan (demo super admin)', { role: 'super_admin' });
      person('coordinator@demo.test', 'coord123', 'Ms Coordinator (demo)', { role: 'coordinator' });
      person('kda@demo.test', 'kda12345', 'KDA Teacher (demo)', { role: 'campus_admin', admin_campus: 'kda' });
      person('maymar@demo.test', 'maymar123', 'Maymar Teacher (demo)', { role: 'campus_admin', admin_campus: 'maymar' });
      const teacher = person('teacher@demo.test', 'teacher123', 'Section Teacher 10-B (demo)', { role: 'section_admin' });
      const first = ['Ayaan', 'Zara', 'Hamza', 'Fatima', 'Bilal', 'Hira', 'Usman', 'Sana', 'Daniyal', 'Maryam', 'Rayyan', 'Ayesha', 'Taha', 'Noor', 'Owais', 'Laiba', 'Saad', 'Iqra', 'Huzaifa', 'Anaya', 'Faizan', 'Mahnoor', 'Shayan', 'Hoor', 'Arham', 'Eman', 'Zain', 'Areeba', 'Moiz', 'Rida'];
      const last = ['Khan', 'Ahmed', 'Ali', 'Siddiqui', 'Hussain', 'Malik', 'Sheikh', 'Qureshi', 'Memon', 'Baig'];
      d.admin_sections.push({ user_id: teacher, section_id: kb.id });
      const secs = [kb, kc, ma, mb];
      const items = PP.catalog.items;
      const t0 = Date.now();
      first.forEach((fn, i) => {
        const s = secs[i % 4];
        const status = i === 7 ? 'claimed' : 'confirmed';
        const id = person(`student${i + 1}@demo.test`, 'student123', `${fn} ${last[i % last.length]}`, { school_status: status, campus: s.campus, section_id: s.id, gr_number: String(2400 + i * 7), created_at: new Date(t0 - (60 - i) * 864e5).toISOString() });
        const ability = rand(), engaged = i % 9 !== 4;   // a few inactive students
        const done = Math.floor(items.length * (engaged ? ability * 0.75 : ability * 0.15));
        const lastActive = t0 - Math.floor((engaged ? rand() * 6 : 12 + rand() * 20) * 864e5);
        items.slice(0, done).forEach((it, k) => {
          const attempts = 1 + Math.floor(rand() * (it.kind === 'exercise' || it.kind === 'debug' || it.kind === 'exam' ? 5 : 2));
          const when = new Date(lastActive - (done - k) * 36e5 * 2).toISOString();
          d.progress.push({ user_id: id, item_id: it.id, lesson_id: it.lessonId, kind: it.kind, attempts, passes: 1, completed_at: when, first_attempt_at: when, last_attempt_at: when, code: ['exercise', 'debug', 'exam'].includes(it.kind) ? '# demo submission\nprint("hello")' : null });
        });
        // a few attempted-but-stuck exercises
        items.slice(done, done + 3).filter((it) => ['exercise', 'debug', 'exam'].includes(it.kind)).forEach((it) => {
          const when = new Date(lastActive).toISOString();
          d.progress.push({ user_id: id, item_id: it.id, lesson_id: it.lessonId, kind: it.kind, attempts: 3 + Math.floor(rand() * 5), passes: 0, completed_at: null, first_attempt_at: when, last_attempt_at: when, code: '# still working on it\nprint(' });
        });
        const p = d.profiles.find((x) => x.id === id); p.last_seen = new Date(lastActive).toISOString();
      });
      return d;
    }
    function load() { if (db) return db; try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { db = null; } if (!db) { db = seed(); save(); } db.admin_sections = db.admin_sections || []; return db; }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* storage full or blocked */ } }
    const sessionId = () => { try { return localStorage.getItem(SKEY); } catch (e) { return null; } };
    const setSession = (id) => { try { if (id) localStorage.setItem(SKEY, id); else localStorage.removeItem(SKEY); } catch (e) { /* ignore */ } };
    const me = () => { load(); return db.profiles.find((p) => p.id === sessionId() && p.active); };
    const sessOf = (p) => (p ? { user: { id: p.id, email: p.email } } : null);
    const emit = () => { const s = sessOf(me()); listeners.forEach((f) => f(s)); };
    const isAdmin = (p) => p && p.role !== 'student';
    function canView(t) {
      const m = me(); if (!m) return false;
      if (t.id === m.id || m.role === 'super_admin') return true;
      if (t.school_status === 'none' || !t.campus) return false;
      return m.role === 'coordinator' || (m.role === 'campus_admin' && m.admin_campus === t.campus) || canManageSec(m, t.section_id);
    }
    const canManageSec = (m, secId) => !!m && m.active && (m.role === 'super_admin' || (m.role !== 'student' && !!secId && db.admin_sections.some((a) => a.user_id === m.id && a.section_id === secId)));
    const canManageUser = (m, t) => !!m && (m.role === 'super_admin' || (t.role === 'student' && t.school_status !== 'none' && canManageSec(m, t.section_id)));
    const needSuper = () => { const m = me(); if (!m || m.role !== 'super_admin') throw new Error('Only the super admin can do that.'); return m; };
    const delay = (v) => new Promise((r) => setTimeout(() => r(v), 60));
    const summary = (id) => {
      const rows = db.progress.filter((r) => r.user_id === id);
      const p = db.profiles.find((x) => x.id === id);
      const la = rows.reduce((a, r) => (r.last_attempt_at > a ? r.last_attempt_at : a), p.last_seen || '');
      return { done_items: rows.filter((r) => r.completed_at).length, touched_items: rows.length, attempts: rows.reduce((a, r) => a + r.attempts, 0), last_activity: la || null };
    };
    function createProfile(user, meta) {
      let claim = !!meta.school, camp = null, sec = null, gr = null;
      if (claim) {
        camp = meta.campus; sec = meta.section_id; gr = String(meta.gr_number || '').trim().slice(0, 30);
        if (!gr || !db.sections.some((s) => s.id === sec && s.campus === camp && s.active)) { claim = false; camp = null; sec = null; gr = null; }
      }
      db.profiles.push({ id: user.id, email: user.email, full_name: String(meta.full_name || user.email.split('@')[0]).trim().slice(0, 80), role: 'student', admin_campus: null, school_status: claim ? 'claimed' : 'none', campus: camp, section_id: sec, gr_number: gr, active: true, created_at: now(), last_seen: null });
    }

    const api = {
      mode: 'demo', demoCode: DEMO_CODE,
      async getSession() { load(); return delay(sessOf(me())); },
      onAuth(cb) { listeners.push(cb); },
      async signUp(email, password, meta) {
        load(); email = email.trim().toLowerCase();
        if (db.users.some((u) => u.email === email)) throw new Error('An account with this email already exists. Try signing in instead.');
        if (!EMAIL_CODES) {   // free setup: no e-mail step, the account is usable immediately
          const user = { id: uid(), email, password, verified: true };
          db.users.push(user); createProfile(user, meta); save(); setSession(user.id); emit();
          return delay({ needsOtp: false });
        }
        pending[email] = { kind: 'signup', meta, password };
        return delay({ needsOtp: true });
      },
      async verifySignup(email, code) {
        load(); email = email.trim().toLowerCase();
        const p = pending[email];
        if (!p || code.trim() !== DEMO_CODE) throw new Error(friendly('invalid token'));
        const user = { id: uid(), email, password: p.password, verified: true };
        db.users.push(user); createProfile(user, p.meta); delete pending[email]; save(); setSession(user.id); emit();
      },
      async resendSignup() { return delay(); },
      async signIn(email, password) {
        load(); email = email.trim().toLowerCase();
        const u = db.users.find((x) => x.email === email && x.password === password);
        if (!u) throw new Error('Wrong email or password.');
        const p = db.profiles.find((x) => x.id === u.id);
        if (!p.active) throw new Error('This account has been disabled. Please ask your teacher.');
        setSession(u.id); emit(); return delay();
      },
      async signOut() { setSession(null); emit(); },
      async requestReset(email) { load(); email = email.trim().toLowerCase(); pending[email] = { kind: 'reset' }; return delay(); },
      async changePassword(pw) { load(); const p = me(); const u = db.users.find((x) => x.id === p.id); u.password = pw; save(); },
      async setPassword(userId, pw) { load(); const m = me(), t = db.profiles.find((x) => x.id === userId); if (!t || !canManageUser(m, t)) throw new Error('You can only set passwords for learners in your own sections.'); if (pw.length < 8) throw new Error('Choose a longer password (at least 8 characters).'); const u = db.users.find((x) => x.id === userId); u.password = pw; save(); },
      async confirmReset(email, code, password) {
        load(); email = email.trim().toLowerCase();
        if (!pending[email] || code.trim() !== DEMO_CODE) throw new Error(friendly('invalid token'));
        const u = db.users.find((x) => x.email === email); if (!u) throw new Error('No account with that email.');
        u.password = password; delete pending[email]; save(); setSession(u.id); emit();
      },
      async getCampuses() { return delay([{ code: 'maymar', name: 'Maymar' }, { code: 'kda', name: 'KDA' }]); },
      async getSections(o) { load(); return delay(sortSections(db.sections.filter((s) => (o && o.all) || s.active).map((s) => Object.assign({}, s)))); },
      async getMyProfile() { load(); const p = me(); return delay(p ? Object.assign({}, p) : null); },
      async updateMyName(name) { load(); const p = me(); if (!p) throw new Error('Not signed in.'); p.full_name = name.trim().slice(0, 80); save(); },
      async myProgress() { load(); const p = me(); return delay(db.progress.filter((r) => r.user_id === p.id).map((r) => Object.assign({}, r))); },
      async saveProgress(x) {
        load(); const p = me(); if (!p) throw new Error('Not signed in.');
        if (p.role !== 'student') return;
        let r = db.progress.find((q) => q.user_id === p.id && q.item_id === x.item_id);
        if (!r) { r = { user_id: p.id, item_id: x.item_id, lesson_id: x.lesson_id || null, kind: x.kind || null, attempts: 0, passes: 0, completed_at: null, first_attempt_at: now(), last_attempt_at: now(), code: null }; db.progress.push(r); }
        r.attempts += 1; if (x.passed) { r.passes += 1; if (!r.completed_at) r.completed_at = now(); }
        r.last_attempt_at = now(); if (x.code) r.code = String(x.code).slice(0, 8000);
        p.last_seen = now(); save();
      },
      async bumpLesson(lessonId, views, runs) {
        load(); const p = me(); if (!p || p.role !== 'student') return;
        let s = db.stats.find((q) => q.user_id === p.id && q.lesson_id === lessonId);
        if (!s) { s = { user_id: p.id, lesson_id: lessonId, views: 0, runs: 0, first_seen: now(), last_seen: now() }; db.stats.push(s); }
        s.views += views || 0; s.runs += runs || 0; s.last_seen = now(); p.last_seen = now(); save();
      },

      async listProfiles() { load(); const m = me(); if (!isAdmin(m)) throw new Error('Not allowed.'); return delay(db.profiles.filter(canView).map((p) => Object.assign({}, p, summary(p.id)))); },
      async progressFor(ids) { load(); const set = new Set(ids); return delay(db.progress.filter((r) => set.has(r.user_id) && canView(db.profiles.find((p) => p.id === r.user_id))).map((r) => Object.assign({}, r, { code: undefined }))); },
      async studentDetail(id) { load(); const t = db.profiles.find((p) => p.id === id); if (!t || !canView(t)) throw new Error('Not allowed.'); return delay({ progress: db.progress.filter((r) => r.user_id === id).map((r) => Object.assign({}, r)), stats: db.stats.filter((s) => s.user_id === id).map((s) => Object.assign({}, s)) }); },
      async recentProgress(limit) { load(); return delay(db.progress.filter((r) => canView(db.profiles.find((p) => p.id === r.user_id))).sort((a, b) => (a.last_attempt_at < b.last_attempt_at ? 1 : -1)).slice(0, limit || 30).map((r) => Object.assign({}, r, { code: undefined }))); },
      async setRole(userId, role, campus) {
        const m = needSuper(); if (userId === m.id) throw new Error('You cannot change your own role.');
        const t = db.profiles.find((p) => p.id === userId); if (!t) throw new Error('No such user.');
        if (role === 'campus_admin' && !campus) throw new Error('A campus admin needs a campus.');
        t.role = role; t.admin_campus = role === 'campus_admin' ? campus : null;
        if (role === 'student') db.admin_sections = db.admin_sections.filter((a) => a.user_id !== userId);
        save();
      },
      async updateProfile(userId, f) {
        load(); const m = me(); const t = db.profiles.find((p) => p.id === userId); if (!t) throw new Error('No such user.');
        if (m.role !== 'super_admin') {
          if (!canManageUser(m, t)) throw new Error('You can only change learners in your own sections.');
          if (f.school_status === 'none') throw new Error('Only the super admin can remove someone from the school.');
          if (!canManageSec(m, f.section_id)) throw new Error('That section is not one of yours.');
        }
        t.full_name = String(f.full_name).trim().slice(0, 80); t.active = f.active !== false;
        if (f.school_status === 'none') { t.school_status = 'none'; t.campus = null; t.section_id = null; t.gr_number = null; }
        else {
          if (!db.sections.some((s) => s.id === f.section_id && s.campus === f.campus)) throw new Error('That section does not belong to that campus.');
          t.school_status = f.school_status; t.campus = f.campus; t.section_id = f.section_id; t.gr_number = String(f.gr_number || '').trim().slice(0, 30);
        }
        save();
      },
      async upsertSection(s) {
        needSuper();
        if (s.id) { const r = db.sections.find((x) => x.id === s.id); if (r) { r.name = s.name; r.active = s.active; } }
        else { if (db.sections.some((x) => x.campus === s.campus && x.name === s.name)) throw new Error('That section already exists.'); db.sections.push({ id: uid(), campus: s.campus, name: s.name, active: true }); }
        save();
      },
      async myManagedSections() { load(); const m = me(); return delay(db.admin_sections.filter((a) => a.user_id === m.id).map((a) => a.section_id)); },
      async listAdminSections() { load(); needSuper(); return delay(db.admin_sections.map((a) => Object.assign({}, a))); },
      async setSections(userId, ids) { load(); needSuper(); const t = db.profiles.find((p) => p.id === userId); if (!t || t.role === 'student') throw new Error('That person is not an admin.'); db.admin_sections = db.admin_sections.filter((a) => a.user_id !== userId).concat(ids.filter((id) => db.sections.some((s) => s.id === id)).map((id) => ({ user_id: userId, section_id: id }))); save(); },
      async createAdmin(f) {
        load(); needSuper();
        const email = String(f.email || '').trim().toLowerCase();
        if (!['super_admin', 'coordinator', 'campus_admin', 'section_admin'].includes(f.role)) throw new Error('Unknown role.');
        if (f.role === 'campus_admin' && !f.campus) throw new Error('A campus admin needs a campus.');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('That email address is not valid.');
        if (String(f.full_name || '').trim().length < 2) throw new Error('Name too short.');
        if (String(f.password || '').length < 8) throw new Error('Password too short (at least 8 characters).');
        if (db.users.some((u) => u.email === email)) throw new Error('That email address already has an account.');
        const user = { id: uid(), email, password: f.password, verified: true };
        db.users.push(user);
        createProfile(user, { full_name: f.full_name });
        const pr = db.profiles.find((p) => p.id === user.id);
        pr.role = f.role; pr.admin_campus = f.role === 'campus_admin' ? f.campus : null;
        if (f.role !== 'super_admin') (f.sections || []).forEach((id) => { if (db.sections.some((x) => x.id === id)) db.admin_sections.push({ user_id: user.id, section_id: id }); });
        save(); return delay(user.id);
      },
      async createStudent(f) {
        load(); const m = me();
        if (!canManageSec(m, f.section_id)) throw new Error('You cannot add learners to that section.');
        const sec = db.sections.find((x) => x.id === f.section_id && x.active); if (!sec) throw new Error('Unknown or hidden section.');
        const email = String(f.email || '').trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('That email address is not valid.');
        if (String(f.full_name || '').trim().length < 2) throw new Error('Name too short.');
        if (!String(f.gr_number || '').trim()) throw new Error('GR number is required.');
        if (String(f.password || '').length < 8) throw new Error('Password too short (at least 8 characters).');
        if (db.users.some((u) => u.email === email)) throw new Error('That email address already has an account.');
        const user = { id: uid(), email, password: f.password, verified: true };
        db.users.push(user);
        createProfile(user, { school: true, campus: sec.campus, section_id: sec.id, gr_number: f.gr_number, full_name: f.full_name });
        db.profiles.find((p) => p.id === user.id).school_status = 'confirmed';
        save(); return delay(user.id);
      },
      resetDemo() { try { localStorage.removeItem(KEY); localStorage.removeItem(SKEY); } catch (e) { /* ignore */ } db = null; load(); emit(); },
    };
    return api;
  }

  const impl = live ? makeSupabase() : makeDemo();
  impl.friendly = friendly;
  impl.live = live;
  impl.emailCodes = EMAIL_CODES;
  return impl;
})();

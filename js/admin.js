/* Admin portal (#/admin) and the student's own progress page (#/me).
   Roles:  super admin = everything, can edit students and manage admins/sections.
           coordinator = view both campuses.   campus admin = view their own campus.
   Viewers can only LOOK: every change goes through super-admin-only database functions. */
(function () {
  const { h, esc } = PP;
  const B = PP.backend;
  const CAT = PP.catalog;
  const DAY = 864e5;

  /* ---------------------------------------------------------------- helpers */
  const pctOf = (done, total) => (total ? Math.min(100, Math.round((100 * done) / total)) : 0);
  const ago = (iso) => {
    if (!iso) return 'Never';
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (d < 90) return 'Just now';
    if (d < 3600) return Math.round(d / 60) + ' min ago';
    if (d < 86400) return Math.round(d / 3600) + ' h ago';
    if (d < 86400 * 14) return Math.round(d / 86400) + ' days ago';
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const dateOf = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '-');
  const initials = (n) => String(n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const campusName = (c) => PP.auth.campusName(c);
  const STATUS = { confirmed: ['Confirmed', 'ok'], claimed: ['Unconfirmed', 'warn'], none: ['Not in school', 'mute'] };
  const badge = (text, kind) => h('span', { class: 'bdg bdg-' + (kind || 'mute') }, text);
  const statusBadge = (p) => badge(STATUS[p.school_status][0], STATUS[p.school_status][1]);
  function bar(p, tone) { return h('span', { class: 'pbar' + (tone ? ' ' + tone : ''), role: 'img', 'aria-label': p + ' percent' }, h('i', { style: `width:${p}%` })); }
  const inactive = (p) => !p.last_activity || Date.now() - new Date(p.last_activity).getTime() > 7 * DAY;
  const toast = (msg, bad) => { const t = h('div', { class: 'toast' + (bad ? ' bad' : ''), role: 'status' }, msg); document.body.append(t); setTimeout(() => t.classList.add('on'), 10); setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 300); }, 3200); };
  const loading = (txt) => h('div', { class: 'adm-loading' }, h('span', { class: 'spin' }), txt || 'Loading…');
  const errorBox = (e) => h('div', { class: 'adm-error' }, h('strong', null, 'Something went wrong. '), e.message || String(e));

  function downloadCsv(name, rows) {
    const cell = (v) => { v = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.append(a); a.click(); a.remove();
  }

  /* ---------------------------------------------------------------- data */
  const D = { profiles: null, sections: null, campuses: null, at: 0, progress: {}, };
  async function ensure(force) {
    if (!force && D.profiles && Date.now() - D.at < 60000) return D;
    const [profiles, sections, campuses] = await Promise.all([B.listProfiles(), B.getSections({ all: true }), B.getCampuses()]);
    D.profiles = profiles; D.sections = sections; D.campuses = campuses; D.at = Date.now(); D.progress = {};
    D.secById = {}; sections.forEach((s) => { D.secById[s.id] = s; });
    D.byId = {}; profiles.forEach((p) => { D.byId[p.id] = p; });
    D.mySecs = new Set(); D.adminSecs = {};
    if (PP.auth.isSuper) (await B.listAdminSections()).forEach((r) => { const l = (D.adminSecs[r.user_id] = D.adminSecs[r.user_id] || []); if (!l.includes(r.section_id)) l.push(r.section_id); });
    else (await B.myManagedSections()).forEach((id) => D.mySecs.add(id));
    return D;
  }
  const secName = (p) => (p.section_id && D.secById[p.section_id] ? D.secById[p.section_id].name : '');
  const classLabel = (p) => (p.school_status === 'none' || !p.campus ? 'Not in school' : `${campusName(p.campus)} · ${secName(p) || 'no section'}`);
  const learners = () => D.profiles.filter((p) => p.role === 'student');
  const canManageSec = (id) => PP.auth.isSuper || (!!id && D.mySecs.has(id));
  const canManage = (p) => PP.auth.isSuper || (p.role === 'student' && p.school_status !== 'none' && D.mySecs.has(p.section_id));
  const manageableSections = () => D.sections.filter((s) => s.active && canManageSec(s.id)).sort((a, b) => (a.campus + a.name).localeCompare(b.campus + b.name, undefined, { numeric: true }));
  const secLabel = (s) => `${campusName(s.campus)} · ${s.name}`;
  async function progressMap(ids) {   // user -> {item_id -> row}
    const need = ids.filter((i) => !D.progress[i]);
    if (need.length) {
      const rows = await B.progressFor(need);
      need.forEach((i) => { D.progress[i] = {}; });
      rows.forEach((r) => { D.progress[r.user_id][r.item_id] = r; });
    }
    return D.progress;
  }

  /* ---------------------------------------------------------------- shell */
  const NAV = [
    ['overview', 'Overview', 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10'],
    ['students', 'Students', 'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0'],
    ['sections', 'Classes', 'M4 5h16v4H4zM4 11h7v8H4zM13 11h7v8h-7z'],
    ['admins', 'Admins', 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', true],
    ['settings', 'Sections', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2', true],
  ];
  const icon = (d) => h('span', { class: 'adm-ico', html: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>` });

  function scopeText() {
    const p = PP.auth.profile;
    const mine = D.sections ? manageableSections() : [];
    const mgr = mine.length && p.role !== 'super_admin' ? ' · you manage ' + mine.map((s) => s.name).join(', ') : '';
    if (p.role === 'super_admin') return 'Everyone: all campuses and all learners';
    if (p.role === 'section_admin') return (mine.length ? 'Your sections: ' + mine.map(secLabel).join(', ') : 'No sections assigned yet. Ask the super admin.');
    if (p.role === 'coordinator') return 'Both campuses' + (mgr ? mgr : ' (view only)');
    return `${campusName(p.admin_campus)} campus` + (mgr ? mgr : ' (view only)');
  }

  async function render(view, parts) {
    if (!PP.auth.user) { view.replaceChildren(PP.auth.lockPage('Admin portal', 'Please sign in with your admin account.')); return; }
    if (!PP.auth.ready || !PP.auth.profile) { view.replaceChildren(loading('Checking your account…')); return; }
    if (!PP.auth.isAdmin) { view.replaceChildren(h('div', { class: 'page' }, h('h1', null, 'Admin portal'), h('p', { class: 'lede' }, 'This area is only for teachers and coordinators. Your account is a student account.'), h('a', { class: 'btn', href: '#/' }, 'Back to the course'))); return; }
    const page = parts[1] || 'overview';
    const sup = PP.auth.isSuper;
    const nav = h('nav', { class: 'adm-nav', 'aria-label': 'Admin sections' },
      h('div', { class: 'adm-who' }, h('div', { class: 'adm-who-n' }, 'Admin portal'), h('div', { class: 'adm-who-s' }, scopeText())),
      NAV.filter((n) => !n[3] || sup).map(([id, label, d]) => h('a', { href: '#/admin/' + (id === 'overview' ? '' : id), class: 'adm-link' + ((page === id || (id === 'students' && page === 'student')) ? ' on' : '') }, icon(d), label)));
    const body = h('div', { class: 'adm-body' }, loading());
    view.replaceChildren(h('div', { class: 'adm' }, nav, body));
    document.title = 'Admin · By Sir Aryan';
    try {
      await ensure(false);
      const whoS = nav.querySelector('.adm-who-s'); if (whoS) whoS.textContent = scopeText();
      const pages = { overview, students, student: (b, p) => studentPage(b, parts[2], p), sections, admins, settings };
      if ((page === 'admins' || page === 'settings') && !sup) { body.replaceChildren(h('div', { class: 'adm-error' }, 'Only the super admin can open this page.')); return; }
      const fn = pages[page] || overview;
      await fn(body, page);
    } catch (e) { body.replaceChildren(errorBox(e)); }
  }

  function pageHead(title, sub, actions) {
    return h('header', { class: 'adm-head' }, h('div', null, h('h1', null, title), sub ? h('p', { class: 'adm-sub' }, sub) : null), h('div', { class: 'adm-actions' }, actions));
  }
  const refreshBtn = () => h('button', { class: 'btn small', onclick: async () => { D.at = 0; await ensure(true); PP.admin.rerender(); toast('Updated'); } }, 'Refresh');

  /* ---------------------------------------------------------------- overview */
  async function overview(body) {
    const list = learners();
    const schoolish = list.filter((p) => p.school_status !== 'none');
    const active = list.filter((p) => !inactive(p));
    const avg = list.length ? Math.round(list.reduce((a, p) => a + pctOf(p.done_items, CAT.total), 0) / list.length) : 0;
    const attention = list.filter((p) => p.school_status !== 'none' && inactive(p)).sort((a, b) => (a.last_activity || '') < (b.last_activity || '') ? -1 : 1);
    const unconfirmed = schoolish.filter((p) => p.school_status === 'claimed').length;
    const kpi = (label, value, sub, tone) => h('div', { class: 'kpi' + (tone ? ' ' + tone : '') }, h('div', { class: 'kpi-v' }, value), h('div', { class: 'kpi-l' }, label), sub ? h('div', { class: 'kpi-s' }, sub) : null);
    // by section
    const groups = {};
    schoolish.forEach((p) => { const k = p.campus + '|' + p.section_id; (groups[k] = groups[k] || []).push(p); });
    const secRows = Object.keys(groups).map((k) => { const ps = groups[k]; const f = ps[0]; return { campus: f.campus, sec: secName(f), n: ps.length, avg: Math.round(ps.reduce((a, p) => a + pctOf(p.done_items, CAT.total), 0) / ps.length), act: ps.filter((p) => !inactive(p)).length, id: f.section_id }; })
      .sort((a, b) => (a.campus + a.sec).localeCompare(b.campus + b.sec));
    const feedHost = h('div', { class: 'feed' }, loading('Loading activity…'));
    const me = PP.auth.profile, sup = PP.auth.isSuper;
    const notInSchool = D.profiles.filter((p) => p.role === 'student' && p.school_status === 'none').length;
    const canAddHere = manageableSections().length > 0;
    const addItem = canAddHere ? ['Add students', 'Create accounts for your learners: type each person\u2019s email, password and section, or paste a whole class.', null, 'Add'] : null;
    const todo = (sup || canAddHere) ? [
      addItem,
      unconfirmed ? ['Confirm school students', `${unconfirmed} learner${unconfirmed === 1 ? ' is' : 's are'} waiting for you to check their class details.`, '#/admin/students?status=claimed', 'Review'] : null,
      notInSchool ? ['People outside the school', `${notInSchool} account${notInSchool === 1 ? '' : 's'} not placed in a campus. Move any students into their class.`, '#/admin/students?status=none', 'Open list'] : null,
      sup ? ['Sections and admins', 'Add Maymar or KDA sections, and give teachers access.', '#/admin/settings', 'Manage'] : null,
    ].filter(Boolean) : null;
    const hello = h('section', { class: 'welcome' },
      h('div', null, h('div', { class: 'welcome-h' }, 'Welcome back, ', (me.full_name || '').split(' ')[0] || 'there'), h('div', { class: 'welcome-s' }, badge(PP.auth.ROLE_LABEL[me.role], me.role === 'super_admin' ? 'accent' : 'ok'), ' ', scopeText())),
      todo ? h('div', { class: 'todo' }, todo.map(([t, d, href, cta]) => h('a', Object.assign({ class: 'todo-i', href: href || '#' }, href ? {} : { onclick: (e) => { e.preventDefault(); addStudentsDialog(); } }), h('span', null, h('strong', null, t), h('small', null, d)), h('span', { class: 'todo-go' }, cta + ' →')))) : h('p', { class: 'adm-sub' }, 'You can see progress for your learners. Only the super admin, or the admin of a learner\u2019s section, can change a learner.'));
    body.replaceChildren(
      pageHead('Dashboard', null, [refreshBtn()]),
      hello,
      h('div', { class: 'kpis' },
        kpi('Learners', String(list.length), unconfirmed ? `${unconfirmed} waiting for confirmation` : 'in your view'),
        kpi('Active this week', String(active.length), list.length ? pctOf(active.length, list.length) + '% of learners' : ''),
        kpi('Average completion', avg + '%', `of ${CAT.total} activities`),
        kpi('Need attention', String(attention.length), 'no activity for 7+ days', attention.length ? 'warn' : '')),
      h('div', { class: 'adm-grid2' },
        h('section', { class: 'panel' }, h('h2', null, 'By class'),
          secRows.length ? h('table', { class: 'tbl-a' }, h('thead', null, h('tr', null, ['Class', 'Learners', 'Average completion', 'Active (7 days)'].map((t) => h('th', null, t)))),
            h('tbody', null, secRows.map((r) => h('tr', { class: 'rowlink', onclick: () => { location.hash = '#/admin/sections?s=' + r.id; } },
              h('td', null, h('strong', null, `${campusName(r.campus)} · ${r.sec || '-'}`)), h('td', null, String(r.n)),
              h('td', null, h('span', { class: 'pc' }, bar(r.avg), h('span', null, r.avg + '%'))), h('td', null, `${r.act} of ${r.n}`)))))
            : h('p', { class: 'empty' }, 'No school learners yet.')),
        h('section', { class: 'panel' }, h('h2', null, 'Needs attention'),
          attention.length ? h('ul', { class: 'plain-list' }, attention.slice(0, 8).map((p) => h('li', null, h('a', { href: '#/admin/student/' + p.id }, h('span', { class: 'av' }, initials(p.full_name)), h('span', { class: 'li-main' }, h('strong', null, p.full_name), h('small', null, classLabel(p))), h('span', { class: 'li-side' }, p.last_activity ? ago(p.last_activity) : 'Never started'))))) : h('p', { class: 'empty' }, 'Everyone has been active this week.'),
          attention.length > 8 ? h('a', { class: 'more', href: '#/admin/students?act=inactive' }, `See all ${attention.length}`) : null)),
      h('section', { class: 'panel' }, h('h2', null, 'Recent activity'), feedHost));
    try {
      const rows = await B.recentProgress(40);
      const items = rows.filter((r) => D.byId[r.user_id]).slice(0, 14);
      feedHost.replaceChildren(items.length ? h('ul', { class: 'plain-list' }, items.map((r) => {
        const p = D.byId[r.user_id], it = CAT.byId[r.item_id];
        return h('li', null, h('a', { href: '#/admin/student/' + p.id }, h('span', { class: 'av' }, initials(p.full_name)),
          h('span', { class: 'li-main' }, h('strong', null, p.full_name), h('small', null, `${r.completed_at ? 'Completed' : 'Tried'} ${it ? (it.title || it.kind) : r.item_id}${it && CAT.lessons[it.lessonId] ? ' · ' + CAT.lessons[it.lessonId].title : ''}`)),
          h('span', { class: 'li-side' }, ago(r.last_attempt_at))));
      })) : h('p', { class: 'empty' }, 'No activity yet.'));
    } catch (e) { feedHost.replaceChildren(errorBox(e)); }
  }

  /* ---------------------------------------------------------------- students list */
  const Q = { search: '', campus: '', section: '', status: '', act: '', sort: 'name', dir: 1, page: 0 };
  async function students(body) {
    const q = new URLSearchParams((location.hash.split('?')[1]) || '');
    if (q.get('act')) { Q.act = q.get('act'); Q.page = 0; }
    if (q.get('status')) { Q.status = q.get('status'); Q.page = 0; }
    const sup = PP.auth.isSuper;
    const campuses = [...new Set(learners().map((p) => p.campus).filter(Boolean))];
    const search = h('input', { type: 'search', class: 'ain', placeholder: 'Search name, GR number or email', value: Q.search, 'aria-label': 'Search students' });
    const sel = (label, key, opts) => { const s = h('select', { class: 'ain', 'aria-label': label }, opts.map(([v, t]) => h('option', { value: v }, t))); s.value = Q[key]; s.addEventListener('change', () => { Q[key] = s.value; if (key === 'campus') Q.section = ''; Q.page = 0; draw(); if (key === 'campus') secSel.replaceWith(makeSecSel()); }); return s; };
    const makeSecSel = () => { const list = D.sections.filter((s) => !Q.campus || s.campus === Q.campus); const s = h('select', { class: 'ain', 'aria-label': 'Section' }, h('option', { value: '' }, 'All sections'), list.map((x) => h('option', { value: x.id }, (Q.campus ? '' : campusName(x.campus) + ' · ') + x.name))); s.value = Q.section; s.addEventListener('change', () => { Q.section = s.value; Q.page = 0; draw(); }); return s; };
    let secSel = makeSecSel();
    const campusSel = campuses.length > 1 || sup ? sel('Campus', 'campus', [['', 'All campuses']].concat(D.campuses.map((c) => [c.code, c.name]))) : null;
    const statusSel = sel('Status', 'status', [['', 'Any status'], ['confirmed', 'Confirmed'], ['claimed', 'Unconfirmed']].concat(sup ? [['none', 'Not in school']] : []));
    const actSel = sel('Activity', 'act', [['', 'Any activity'], ['active', 'Active this week'], ['inactive', 'Inactive 7+ days'], ['none', 'Not started']]);
    const tableHost = h('div'); const count = h('span', { class: 'adm-count' });
    let t;
    search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { Q.search = search.value; Q.page = 0; draw(); }, 200); });
    const exportBtn = h('button', { class: 'btn small', onclick: () => {
      const rows = filtered();
      downloadCsv('python-path-students.csv', [['Name', 'GR number', 'Email', 'Campus', 'Section', 'Status', 'Completion %', 'Activities done', 'Attempts', 'Last active']].concat(rows.map((p) => [p.full_name, p.gr_number || '', p.email || '', p.campus ? campusName(p.campus) : '', secName(p), STATUS[p.school_status][0], pctOf(p.done_items, CAT.total), p.done_items, p.attempts, p.last_activity || ''])));
    } }, 'Export CSV');
    const addBtn = manageableSections().length ? h('button', { class: 'btn primary small', onclick: () => addStudentsDialog() }, 'Add students') : null;
    body.replaceChildren(pageHead('Students', scopeText(), [addBtn, exportBtn, refreshBtn()]),
      h('div', { class: 'filters' }, search, campusSel, secSel, statusSel, actSel, h('button', { class: 'btn small ghost', onclick: () => { Object.assign(Q, { search: '', campus: '', section: '', status: '', act: '', page: 0 }); students(body); } }, 'Clear')),
      count, tableHost);

    const dup = {};
    learners().forEach((p) => { if (p.gr_number && p.campus) { const k = p.campus + '|' + p.gr_number; dup[k] = (dup[k] || 0) + 1; } });
    function filtered() {
      const s = Q.search.trim().toLowerCase();
      let rows = learners().filter((p) => (!Q.campus || p.campus === Q.campus) && (!Q.section || p.section_id === Q.section) && (!Q.status || p.school_status === Q.status)
        && (!s || [p.full_name, p.gr_number, p.email].some((v) => v && String(v).toLowerCase().includes(s)))
        && (!Q.act || (Q.act === 'active' && !inactive(p)) || (Q.act === 'inactive' && inactive(p) && p.last_activity) || (Q.act === 'none' && !p.touched_items)));
      const key = { name: (p) => p.full_name.toLowerCase(), class: (p) => classLabel(p), progress: (p) => p.done_items, last: (p) => p.last_activity || '', gr: (p) => p.gr_number || '' }[Q.sort] || ((p) => p.full_name.toLowerCase());
      rows.sort((a, b) => (key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0) * Q.dir);
      return rows;
    }
    function draw() {
      const rows = filtered(), PAGE = 25, pages = Math.max(1, Math.ceil(rows.length / PAGE));
      Q.page = Math.min(Q.page, pages - 1);
      count.textContent = `${rows.length} learner${rows.length === 1 ? '' : 's'}`;
      const th = (label, key) => h('th', { class: 'sortable' + (Q.sort === key ? ' on' : ''), 'aria-sort': Q.sort === key ? (Q.dir > 0 ? 'ascending' : 'descending') : 'none' },
        h('button', { type: 'button', onclick: () => { if (Q.sort === key) Q.dir *= -1; else { Q.sort = key; Q.dir = key === 'progress' || key === 'last' ? -1 : 1; } draw(); } }, label, Q.sort === key ? (Q.dir > 0 ? ' ↑' : ' ↓') : ''));
      if (!rows.length) { tableHost.replaceChildren(h('div', { class: 'empty-big' }, h('strong', null, 'No learners match these filters.'), h('p', null, 'Try clearing a filter or changing your search.'))); return; }
      const pageRows = rows.slice(Q.page * PAGE, Q.page * PAGE + PAGE);
      const put = (...kids) => tableHost.replaceChildren(...kids.filter(Boolean));
      put(
        h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl-a stack-sm' },
          h('thead', null, h('tr', null, th('Learner', 'name'), th('Class', 'class'), h('th', null, 'Status'), th('Progress', 'progress'), th('Last active', 'last'), h('th', { class: 'sr' }, 'Open'))),
          h('tbody', null, pageRows.map((p) => {
            const pc = pctOf(p.done_items, CAT.total);
            const isDup = p.campus && p.gr_number && dup[p.campus + '|' + p.gr_number] > 1;
            return h('tr', { class: 'rowlink' + (!p.active ? ' off' : ''), tabindex: 0, onclick: () => { location.hash = '#/admin/student/' + p.id; }, onkeydown: (e) => { if (e.key === 'Enter') location.hash = '#/admin/student/' + p.id; } },
              h('td', { 'data-label': 'Learner' }, h('div', { class: 'who' }, h('span', { class: 'av' }, initials(p.full_name)), h('div', null, h('strong', null, p.full_name), h('small', null, [p.gr_number && 'GR ' + p.gr_number, p.email].filter(Boolean).join(' · ')), isDup ? h('small', { class: 'dupe' }, 'Same GR number as another learner') : null))),
              h('td', { 'data-label': 'Class' }, classLabel(p)),
              h('td', { 'data-label': 'Status' }, statusBadge(p), !p.active ? badge('Disabled', 'bad') : null),
              h('td', { 'data-label': 'Progress' }, h('span', { class: 'pc' }, bar(pc), h('span', null, pc + '%')), h('small', { class: 'sub' }, `${p.done_items} of ${CAT.total}`)),
              h('td', { 'data-label': 'Last active' }, ago(p.last_activity)),
              h('td', { class: 'chev', 'aria-hidden': 'true' }, '›'));
          })))),
        pages > 1 ? h('div', { class: 'pager' }, h('button', { class: 'btn small', disabled: Q.page === 0, onclick: () => { Q.page--; draw(); } }, '← Previous'), h('span', null, `Page ${Q.page + 1} of ${pages}`), h('button', { class: 'btn small', disabled: Q.page >= pages - 1, onclick: () => { Q.page++; draw(); } }, 'Next →')) : null);
    }
    draw();
  }

  /* ---------------------------------------------------------------- one student */
  async function studentPage(body, id) {
    const p = D.byId[id];
    if (!p) { body.replaceChildren(h('div', { class: 'adm-error' }, 'That learner is not in your view.'), h('a', { class: 'btn', href: '#/admin/students' }, 'Back to students')); return; }
    body.replaceChildren(h('a', { class: 'back', href: '#/admin/students' }, '← All students'), loading('Loading progress…'));
    const det = await B.studentDetail(id);
    const rows = {}; det.progress.forEach((r) => { rows[r.item_id] = r; });
    const stats = {}; det.stats.forEach((s) => { stats[s.lesson_id] = s; });
    const done = det.progress.filter((r) => r.completed_at).length;
    const pc = pctOf(done, CAT.total);
    const attempts = det.progress.reduce((a, r) => a + r.attempts, 0);
    const sup = PP.auth.isSuper;
    const kpi = (v, l) => h('div', { class: 'kpi sm' }, h('div', { class: 'kpi-v' }, v), h('div', { class: 'kpi-l' }, l));

    // modules accordion
    const modEls = CAT.modules.map((m) => {
      const d = m.lessons.reduce((a, l) => a + l.items.filter((i) => rows[i] && rows[i].completed_at).length, 0);
      const mp = pctOf(d, m.total);
      const det2 = h('details', { class: 'mod' },
        h('summary', null, h('span', { class: 'mod-n' }, String(m.index).padStart(2, '0')), h('span', { class: 'mod-t' }, m.title), h('span', { class: 'pc' }, bar(mp, mp === 100 ? 'full' : ''), h('span', null, `${d}/${m.total}`))),
        h('div', { class: 'mod-body' }, m.lessons.map((l) => {
          const ld = l.items.filter((i) => rows[i] && rows[i].completed_at).length;
          const st = stats[l.id];
          return h('div', { class: 'lsn' },
            h('div', { class: 'lsn-h' }, h('strong', null, l.title), h('span', { class: 'sub' }, [`${ld}/${l.items.length} done`, st ? `${st.views} view${st.views === 1 ? '' : 's'}, ${st.runs} run${st.runs === 1 ? '' : 's'}` : null].filter(Boolean).join(' · '))),
            h('ul', { class: 'items' }, l.items.map((iid) => {
              const it = CAT.byId[iid], r = rows[iid];
              const state = r && r.completed_at ? 'done' : r ? 'tried' : 'todo';
              const label = it.title || (it.kind === 'read' ? 'Reading lesson' : it.kind);
              return h('li', { class: 'it ' + state },
                h('span', { class: 'dot', title: { done: 'Completed', tried: 'Attempted, not completed', todo: 'Not started' }[state] }),
                h('span', { class: 'it-t' }, label, h('small', null, it.kind === 'read' ? '' : it.kind)),
                h('span', { class: 'it-m' }, r ? `${r.attempts} attempt${r.attempts === 1 ? '' : 's'}${r.completed_at ? ' · ' + dateOf(r.completed_at) : ''}` : ''),
                r && r.code ? h('button', { class: 'btn small ghost', onclick: () => showCode(label, r) }, 'View code') : null);
            })));
        })));
      return det2;
    });
    // stuck + recent
    const stuck = det.progress.filter((r) => !r.completed_at && r.attempts >= 2).sort((a, b) => b.attempts - a.attempts).slice(0, 6);
    const recent = det.progress.slice().sort((a, b) => (a.last_attempt_at < b.last_attempt_at ? 1 : -1)).slice(0, 8);
    const titleOf = (iid) => { const it = CAT.byId[iid]; return it ? (it.title || (it.kind === 'read' ? 'Reading lesson' : it.kind)) + (CAT.lessons[it.lessonId] ? ' · ' + CAT.lessons[it.lessonId].title : '') : iid; };

    const manage = canManage(p) ? manageCard(p) : h('div', { class: 'viewonly' }, h('strong', null, 'View only. '), 'A learner can be changed by the super admin or by the admin of their section.');
    body.replaceChildren(
      h('a', { class: 'back', href: '#/admin/students' }, '← All students'),
      h('section', { class: 'sthead' }, h('span', { class: 'av lg' }, initials(p.full_name)),
        h('div', { class: 'sthead-m' }, h('h1', null, p.full_name), h('div', { class: 'meta-row' }, statusBadge(p), !p.active ? badge('Disabled', 'bad') : null, h('span', null, classLabel(p)), p.gr_number ? h('span', null, 'GR ' + p.gr_number) : null, p.email ? h('span', null, p.email) : null))),
      h('div', { class: 'kpis sm' }, kpi(pc + '%', 'Completion'), kpi(`${done}/${CAT.total}`, 'Activities done'), kpi(String(attempts), 'Attempts'), kpi(ago(Math.max(...[p.last_activity, ...det.progress.map((r) => r.last_attempt_at)].filter(Boolean).map((x) => +new Date(x)), 0) ? new Date(Math.max(...[p.last_activity, ...det.progress.map((r) => r.last_attempt_at)].filter(Boolean).map((x) => +new Date(x)))).toISOString() : null), 'Last active'), kpi(dateOf(p.created_at), 'Joined')),
      h('div', { class: 'adm-grid3' },
        h('div', { class: 'col-main' },
          h('section', { class: 'panel' }, h('h2', null, 'Progress by module'), h('p', { class: 'adm-sub' }, 'Open a module to see each lesson and activity.'), h('div', { class: 'mods' }, modEls)),
          ),
        h('div', { class: 'col-side' },
          manage,
          h('section', { class: 'panel' }, h('h2', null, 'Stuck on'), stuck.length ? h('ul', { class: 'plain-list tight' }, stuck.map((r) => h('li', null, h('div', { class: 'li-main' }, h('strong', null, titleOf(r.item_id)), h('small', null, `${r.attempts} attempts, not yet passed`))))) : h('p', { class: 'empty' }, 'Nothing: no activity with repeated failed attempts.')),
          h('section', { class: 'panel' }, h('h2', null, 'Recent activity'), recent.length ? h('ul', { class: 'plain-list tight' }, recent.map((r) => h('li', null, h('div', { class: 'li-main' }, h('strong', null, titleOf(r.item_id)), h('small', null, `${r.completed_at ? 'Completed' : 'Tried'} · ${ago(r.last_attempt_at)}`))))) : h('p', { class: 'empty' }, 'No activity yet.')))));
    document.title = p.full_name + ' · Admin';
  }

  function showCode(title, r) {
    const ov = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === ov) ov.remove(); } },
      h('div', { class: 'a-card wide', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Submitted code' },
        h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: () => ov.remove() }, '×'),
        h('h2', { class: 'a-title' }, title), h('p', { class: 'a-sub' }, `Last code saved by the learner · ${r.completed_at ? 'passed' : 'not passing yet'} · ${r.attempts} attempt${r.attempts === 1 ? '' : 's'}`),
        h('pre', { class: 'code-view' }, r.code)));
    document.body.append(ov);
    document.addEventListener('keydown', function esc2(e) { if (e.key === 'Escape') { ov.remove(); document.removeEventListener('keydown', esc2); } });
  }

  function genPassword() { const w = 'abcdefghjkmnpqrstuvwxyz', d = '23456789'; const pick = (set, n) => Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join(''); return pick(w, 5) + '-' + pick(d, 3) + pick(w, 2); }
  function passwordDialog(p) {
    const pw = h('input', { class: 'ain mono', value: genPassword(), spellcheck: 'false', autocomplete: 'off', 'aria-label': 'New password' });
    const ov = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === ov) ov.remove(); } });
    const note = h('div', { class: 'a-ok', hidden: true }, 'Done. Give this password to the learner. They are signed out of other devices and can change it under My progress.');
    const go = h('button', { class: 'btn primary', onclick: async () => {
      if (pw.value.length < 8) return toast('Use at least 8 characters.', true);
      go.disabled = true;
      try { await B.setPassword(p.id, pw.value); go.textContent = 'Password set'; note.hidden = false; }
      catch (e) { toast(e.message, true); go.disabled = false; }
    } }, 'Set this password');
    ov.append(h('div', { class: 'a-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Set password' },
      h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: () => ov.remove() }, '\u00d7'),
      h('h2', { class: 'a-title' }, 'New password for ' + p.full_name), h('p', { class: 'a-sub' }, p.email || ''),
      h('div', { class: 'a-form' }, h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Temporary password (minimum 8 characters)'), pw),
        h('div', { class: 'btnrow' }, h('button', { class: 'btn small', type: 'button', onclick: () => { pw.value = genPassword(); } }, 'Make another'), h('button', { class: 'btn small', type: 'button', onclick: () => { try { navigator.clipboard.writeText(pw.value); toast('Copied'); } catch (e) { toast('Select and copy it by hand.', true); } } }, 'Copy')),
        go, note)));
    document.body.append(ov);
  }


  /* ---------------------------------------------------------------- add students (one, or a pasted class list) */
  function addStudentsDialog() {
    const secs = manageableSections();
    if (!secs.length) { toast('You have no sections to add students to.', true); return; }
    const secSel = h('select', { class: 'ain', 'aria-label': 'Section' }, secs.map((s) => h('option', { value: s.id }, secLabel(s))));
    const ov = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === ov) done(); } });
    let created = 0;
    function done() { ov.remove(); if (created) { D.at = 0; ensure(true).then(() => PP.admin.rerender()); } }
    const one = { name: h('input', { class: 'ain', maxlength: 80, placeholder: 'Full name', 'aria-label': 'Full name' }), email: h('input', { class: 'ain', type: 'email', placeholder: 'student@example.com', 'aria-label': 'Email' }), gr: h('input', { class: 'ain', maxlength: 30, placeholder: 'e.g. 2401', 'aria-label': 'GR number' }), pw: h('input', { class: 'ain mono', value: genPassword(), 'aria-label': 'Password' }) };
    const out = h('div');
    const err = h('div', { class: 'a-err', hidden: true, role: 'alert' });
    const mode = { v: 'one' };
    const oneForm = h('div', { class: 'a-form' }, mf('Full name', one.name), mf('Email (used to sign in)', one.email), mf('GR number', one.gr), mf('Password (minimum 8 characters)', one.pw));
    const bulk = h('textarea', { class: 'ain an-ta', rows: 7, placeholder: 'One student per line:\nFull name, email, GR number\nAyaan Khan, ayaan@example.com, 2401\nZara Ahmed, zara@example.com, 2402', 'aria-label': 'Students to add' });
    const bulkForm = h('div', { class: 'a-form', hidden: true }, h('p', { class: 'a-note' }, 'Passwords are made for you (a different one each). You will get a list to give out or download.'), bulk);
    function mf(l, el) { return h('label', { class: 'af' }, h('span', { class: 'af-l' }, l), el); }
    const tOne = h('button', { class: 'on', type: 'button', onclick: () => sw('one') }, 'Add one student'), tMany = h('button', { type: 'button', onclick: () => sw('many') }, 'Add several at once');
    function sw(m) { mode.v = m; oneForm.hidden = m !== 'one'; bulkForm.hidden = m !== 'many'; tOne.classList.toggle('on', m === 'one'); tMany.classList.toggle('on', m === 'many'); out.replaceChildren(); err.hidden = true; go.textContent = m === 'one' ? 'Create account' : 'Create accounts'; }
    const go = h('button', { class: 'btn primary', type: 'button' }, 'Create account');
    function askConfirm(jobs, sec) {
      return new Promise((resolve) => {
        const box = h('div', { class: 'a-confirm', role: 'alertdialog', 'aria-label': 'Confirm new accounts' },
          h('h3', null, jobs.length === 1 ? 'Create this account?' : `Create ${jobs.length} accounts?`),
          h('p', { class: 'a-note' }, `Section: ${secLabel(sec)}. The account is made straight away: no email code is sent, and the learner signs in with the email and password.`),
          h('ul', { class: 'plain-list tight' }, jobs.slice(0, 8).map((j) => h('li', null, h('strong', null, j.full_name || '(no name)'), ' · ', j.email || '(no email)', j.gr_number ? ' · GR ' + j.gr_number : ''))),
          jobs.length > 8 ? h('p', { class: 'a-note' }, `…and ${jobs.length - 8} more.`) : null,
          h('div', { class: 'btnrow' },
            h('button', { class: 'btn primary', type: 'button', onclick: () => { box.remove(); go.hidden = false; resolve(true); } }, 'Confirm and create'),
            h('button', { class: 'btn', type: 'button', onclick: () => { box.remove(); go.hidden = false; resolve(false); } }, 'Go back')));
        go.hidden = true; out.replaceChildren(box);
      });
    }
    const results = [];
    go.addEventListener('click', async () => {
      err.hidden = true; out.replaceChildren(); results.length = 0;
      const section_id = secSel.value;
      const jobs = [];
      if (mode.v === 'one') jobs.push({ full_name: one.name.value.trim(), email: one.email.value.trim(), gr_number: one.gr.value.trim(), password: one.pw.value });
      else {
        bulk.value.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line, i) => {
          const parts = line.split(/\t|,/).map((x) => x.trim());
          if (/^(full\s*name|name)$/i.test(parts[0]) && i === 0) return;   // header row
          jobs.push({ full_name: parts[0] || '', email: parts[1] || '', gr_number: parts[2] || '', password: genPassword(), line });
        });
        if (!jobs.length) { err.textContent = 'Paste at least one line: Full name, email, GR number.'; err.hidden = false; return; }
        if (jobs.length > 80) { err.textContent = 'Please add at most 80 students at a time.'; err.hidden = false; return; }
      }
      if (mode.v === 'one') {
        if (!jobs[0].full_name || !/^\S+@\S+\.\S+$/.test(jobs[0].email)) { err.textContent = 'Enter the learner’s name and a valid email.'; err.hidden = false; return; }
        if (jobs[0].password.length < 8) { err.textContent = 'The password needs at least 8 characters.'; err.hidden = false; return; }
      }
      const okGo = await askConfirm(jobs, D.secById[section_id]);
      if (!okGo) return;
      go.disabled = true; go.textContent = 'Creating…';
      for (const j of jobs) {
        try { await B.createStudent(Object.assign({}, j, { section_id })); created++; results.push(Object.assign({ ok: true }, j)); }
        catch (e) { results.push(Object.assign({ ok: false, msg: e.message }, j)); }
      }
      go.disabled = false; go.textContent = mode.v === 'one' ? 'Create account' : 'Create accounts';
      const okRows = results.filter((r) => r.ok), bad = results.filter((r) => !r.ok);
      if (mode.v === 'one' && bad.length) { err.textContent = bad[0].msg; err.hidden = false; return; }
      const sec = D.secById[section_id];
      out.replaceChildren(
        h('div', { class: bad.length ? 'a-note' : 'a-ok' }, `${okRows.length} account${okRows.length === 1 ? '' : 's'} created in ${secLabel(sec)}.${bad.length ? ' ' + bad.length + ' could not be created.' : ''} Give each learner their email and password. They can change it under My progress.`),
        h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl-a' }, h('thead', null, h('tr', null, ['Name', 'Email', 'Password', ''].map((x) => h('th', null, x)))),
          h('tbody', null, results.map((r) => h('tr', null, h('td', null, r.full_name || '-'), h('td', null, r.email || '-'), h('td', { class: 'mono' }, r.ok ? r.password : ''), h('td', { class: r.ok ? '' : 'bad-t' }, r.ok ? '\u2713' : r.msg)))))),
        h('div', { class: 'btnrow' },
          h('button', { class: 'btn small', type: 'button', onclick: () => { try { navigator.clipboard.writeText(okRows.map((r) => `${r.full_name}\t${r.email}\t${r.password}`).join('\n')); toast('Copied'); } catch (e) { toast('Copy by hand.', true); } } }, 'Copy list'),
          h('button', { class: 'btn small', type: 'button', onclick: () => downloadCsv('new-students.csv', [['Name', 'Email', 'Password', 'Section']].concat(okRows.map((r) => [r.full_name, r.email, r.password, secLabel(sec)]))) }, 'Download CSV')));
      if (mode.v === 'one') { one.name.value = ''; one.email.value = ''; one.gr.value = ''; one.pw.value = genPassword(); }
    });
    ov.append(h('div', { class: 'a-card wide', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Add students' },
      h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: done }, '\u00d7'),
      h('h2', { class: 'a-title' }, 'Add students'), h('p', { class: 'a-sub' }, 'The account is ready straight away: no email code is needed. They sign in with the email and password you set.'),
      h('div', { class: 'a-form' }, mf('Section', secSel),
        h('div', { class: 'tabs', role: 'tablist' }, tOne, tMany), oneForm, bulkForm, err, h('div', { class: 'btnrow' }, go, h('button', { class: 'btn', type: 'button', onclick: done }, 'Close')), out)));
    document.body.append(ov);
    setTimeout(() => one.name.focus(), 30);
  }

  function manageCard(p) {
    const name = h('input', { class: 'ain', value: p.full_name, maxlength: 80, 'aria-label': 'Name' });
    const gr = h('input', { class: 'ain', value: p.gr_number || '', maxlength: 30, 'aria-label': 'GR number' });
    const sup2 = PP.auth.isSuper;
    const status = h('select', { class: 'ain', 'aria-label': 'Status' }, [['none', 'Not a school student'], ['claimed', 'Unconfirmed school student'], ['confirmed', 'Confirmed school student']].filter((o) => sup2 || o[0] !== 'none').map(([v, t]) => h('option', { value: v }, t)));
    status.value = p.school_status;
    const allowedCampuses = sup2 ? D.campuses : D.campuses.filter((c) => manageableSections().some((s) => s.campus === c.code));
    const campus = h('select', { class: 'ain', 'aria-label': 'Campus' }, allowedCampuses.map((c) => h('option', { value: c.code }, c.name)));
    campus.value = p.campus && allowedCampuses.some((c) => c.code === p.campus) ? p.campus : allowedCampuses[0].code;
    const section = h('select', { class: 'ain', 'aria-label': 'Section' });
    const fillSec = () => { const list = D.sections.filter((s) => s.campus === campus.value && (s.active || s.id === p.section_id) && canManageSec(s.id)); section.replaceChildren(...(list.length ? list.map((s) => h('option', { value: s.id }, s.name)) : [h('option', { value: '' }, 'No sections for this campus')])); if (p.section_id && list.some((s) => s.id === p.section_id) && campus.value === p.campus) section.value = p.section_id; };
    fillSec(); campus.addEventListener('change', fillSec);
    const active = h('input', { type: 'checkbox' }); active.checked = p.active;
    const schoolBox = h('div', { class: 'mg-school' }, mfield('GR number', gr), mfield('Campus', campus), mfield('Section', section));
    const syncVis = () => { schoolBox.hidden = status.value === 'none'; };
    status.addEventListener('change', syncVis); syncVis();
    const save = h('button', { class: 'btn primary', onclick: async () => {
      save.disabled = true;
      try {
        await B.updateProfile(p.id, { full_name: name.value.trim(), gr_number: gr.value.trim(), school_status: status.value, campus: campus.value, section_id: section.value, active: active.checked });
        await ensure(true); toast('Saved'); PP.admin.rerender();
      } catch (e) { toast(e.message, true); } finally { save.disabled = false; }
    } }, 'Save changes');
    const reset = h('button', { class: 'btn', onclick: () => passwordDialog(p) }, 'Set a new password');
    const mail = B.emailCodes ? h('button', { class: 'btn', onclick: async () => { if (!p.email) return toast('No email on record.', true); if (!confirm('Email a reset code to ' + p.email + '?')) return; try { await B.requestReset(p.email); toast('Code sent to ' + p.email); } catch (e) { toast(e.message, true); } } }, 'Email a reset code') : null;
    function mfield(l, el) { return h('label', { class: 'af' }, h('span', { class: 'af-l' }, l), el); }
    return h('section', { class: 'panel manage' }, h('h2', null, 'Manage learner'), h('p', { class: 'adm-sub' }, PP.auth.isSuper ? 'Only you can see and use this.' : 'You can change this learner because they are in your section.'),
      mfield('Full name', name), mfield('Status', status), schoolBox,
      h('label', { class: 'a-radio sw' }, active, h('span', null, 'Account is active')),
      h('div', { class: 'mg-actions' }, save, reset, mail));
  }

  /* ---------------------------------------------------------------- classes (heatmap) */
  async function sections(body) {
    const q = new URLSearchParams((location.hash.split('?')[1]) || '');
    const all = D.sections.filter((s) => learners().some((p) => p.section_id === s.id));
    if (!all.length) { body.replaceChildren(pageHead('Classes', scopeText(), []), h('p', { class: 'empty-big' }, 'No learners are in a class yet.')); return; }
    let cur = q.get('s') || all[0].id;
    const selector = h('select', { class: 'ain', 'aria-label': 'Choose a class' }, all.map((s) => h('option', { value: s.id }, `${campusName(s.campus)} · ${s.name}`)));
    selector.value = all.some((s) => s.id === cur) ? cur : all[0].id;
    const host = h('div');
    selector.addEventListener('change', () => { cur = selector.value; history.replaceState(null, '', '#/admin/sections?s=' + cur); draw(); });
    body.replaceChildren(pageHead('Classes', 'See every learner in a class against every module.', [selector, refreshBtn()]), host);
    async function draw() {
      cur = selector.value;
      const ps = learners().filter((p) => p.section_id === cur).sort((a, b) => a.full_name.localeCompare(b.full_name));
      host.replaceChildren(loading('Loading class progress…'));
      const pm = await progressMap(ps.map((p) => p.id));
      const doneBy = (p) => { const m = {}; Object.values(pm[p.id] || {}).forEach((r) => { if (r.completed_at) m[r.item_id] = 1; }); return m; };
      const cells = ps.map((p) => { const d = doneBy(p); return { p, mods: CAT.modules.map((m) => m.lessons.reduce((a, l) => a + l.items.filter((i) => d[i]).length, 0)) }; });
      const avgMod = CAT.modules.map((m, mi) => (cells.length ? Math.round(cells.reduce((a, c) => a + pctOf(c.mods[mi], m.total), 0) / cells.length) : 0));
      const tone = (v) => `--v:${v}`;
      const matrix = h('div', { class: 'heat-wrap' }, h('table', { class: 'heat' },
        h('thead', null, h('tr', null, h('th', { class: 'hn' }, 'Learner'), CAT.modules.map((m) => h('th', { title: m.title }, String(m.index).padStart(2, '0'))), h('th', null, 'Total'))),
        h('tbody', null, cells.map(({ p, mods }) => h('tr', { class: 'rowlink', onclick: () => { location.hash = '#/admin/student/' + p.id; } },
          h('th', { class: 'hn' }, h('strong', null, p.full_name), h('small', null, p.school_status === 'claimed' ? 'Unconfirmed' : (p.gr_number ? 'GR ' + p.gr_number : ''))),
          mods.map((d, mi) => { const v = pctOf(d, CAT.modules[mi].total); return h('td', { class: 'hc', style: tone(v), title: `${CAT.modules[mi].title}: ${d}/${CAT.modules[mi].total}` }, h('span', null, v ? v + '' : '')); }),
          h('td', { class: 'ht' }, pctOf(p.done_items, CAT.total) + '%')))),
        h('tfoot', null, h('tr', null, h('th', { class: 'hn' }, 'Class average'), avgMod.map((v) => h('td', { class: 'hc avg', style: tone(v) }, h('span', null, v + ''))), h('td', { class: 'ht' }, cells.length ? Math.round(cells.reduce((a, c) => a + pctOf(c.p.done_items, CAT.total), 0) / cells.length) + '%' : '-')))));
      // hardest activities
      const agg = {};
      ps.forEach((p) => Object.values(pm[p.id] || {}).forEach((r) => { const a = (agg[r.item_id] = agg[r.item_id] || { tried: 0, passed: 0, attempts: 0 }); a.tried++; a.attempts += r.attempts; if (r.completed_at) a.passed++; }));
      const hard = Object.keys(agg).map((k) => Object.assign({ id: k }, agg[k])).filter((a) => a.tried - a.passed > 0).sort((a, b) => (b.tried - b.passed) - (a.tried - a.passed) || b.attempts - a.attempts).slice(0, 8);
      host.replaceChildren(
        h('div', { class: 'legend-row' }, h('span', null, 'Cell shade = share of the module completed.'), h('span', { class: 'lg-scale' }, h('i', { style: '--v:0' }), h('i', { style: '--v:35' }), h('i', { style: '--v:70' }), h('i', { style: '--v:100' })), h('small', null, 'Columns are modules. Hover a column number for its name.')),
        matrix,
        h('div', { class: 'adm-grid2' },
          h('section', { class: 'panel' }, h('h2', null, 'Where this class is stuck'), hard.length ? h('ul', { class: 'plain-list tight' }, hard.map((a) => { const it = CAT.byId[a.id]; return h('li', null, h('div', { class: 'li-main' }, h('strong', null, it ? (it.title || it.kind) : a.id), h('small', null, `${it && CAT.lessons[it.lessonId] ? CAT.lessons[it.lessonId].title + ' · ' : ''}${a.tried - a.passed} of ${a.tried} who tried it have not passed`))); })) : h('p', { class: 'empty' }, 'Nobody is stuck right now.')),
          h('section', { class: 'panel' }, h('h2', null, 'Modules'), h('ol', { class: 'modlist' }, CAT.modules.map((m) => h('li', null, h('span', { class: 'mod-n' }, String(m.index).padStart(2, '0')), m.title))))));
    }
    draw();
  }

  /* ---------------------------------------------------------------- admins (super admin) */
  async function admins(body) {
    const me = PP.auth.profile;
    const admins = D.profiles.filter((p) => p.role !== 'student');
    const results = h('div', { class: 'finder-results' });
    const search = h('input', { type: 'search', class: 'ain', placeholder: 'Search by name or email', 'aria-label': 'Find a person' });
    let t;
    search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(find, 200); });
    function find() {
      const s = search.value.trim().toLowerCase();
      if (s.length < 2) { results.replaceChildren(h('p', { class: 'empty' }, 'Type at least two letters.')); return; }
      const hits = D.profiles.filter((p) => p.role === 'student' && [p.full_name, p.email].some((v) => v && v.toLowerCase().includes(s))).slice(0, 8);
      results.replaceChildren(hits.length ? h('ul', { class: 'plain-list' }, hits.map((p) => h('li', null, h('div', { class: 'row' }, h('span', { class: 'av' }, initials(p.full_name)), h('span', { class: 'li-main' }, h('strong', null, p.full_name), h('small', null, [p.email, classLabel(p)].filter(Boolean).join(' · '))), h('button', { class: 'btn small', onclick: () => roleDialog(p) }, 'Make admin'))))) : h('p', { class: 'empty' }, 'No registered person matches. They must create an account on the site first.'));
    }
    function roleDialog(p) {
      const role = h('select', { class: 'ain', 'aria-label': 'Role' }, h('option', { value: 'section_admin' }, 'Section admin: sees and manages only their sections'), h('option', { value: 'campus_admin' }, 'Campus admin: sees one campus'), h('option', { value: 'coordinator' }, 'Coordinator: sees both campuses'), h('option', { value: 'super_admin' }, 'Super admin: full control'));
      role.value = p.role !== 'student' ? p.role : 'section_admin';
      const campus = h('select', { class: 'ain', 'aria-label': 'Campus' }, D.campuses.map((c) => h('option', { value: c.code }, c.name)));
      if (p.admin_campus) campus.value = p.admin_campus;
      const cw = h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Campus'), campus);
      const chosen = new Set(D.adminSecs[p.id] || []);
      const boxes = [];
      const secBox = h('fieldset', { class: 'a-q secpick' }, h('legend', null, 'Sections this person manages'),
        h('p', { class: 'a-note' }, 'They can add learners, edit their details and set passwords for learners in these sections. A section admin sees only these sections.'),
        D.campuses.map((c) => h('div', { class: 'secgrp' }, h('strong', null, c.name), h('div', { class: 'seclist' }, D.sections.filter((s) => s.campus === c.code && s.active).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).map((s) => { const cb = h('input', { type: 'checkbox', value: s.id }); cb.checked = chosen.has(s.id); boxes.push(cb); return h('label', { class: 'chk' }, cb, h('span', null, s.name)); })))));
      const syncRole = () => { cw.hidden = role.value !== 'campus_admin'; secBox.hidden = role.value === 'super_admin'; };
      role.addEventListener('change', syncRole);
      syncRole();
      const ov = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === ov) ov.remove(); } });
      const go = h('button', { class: 'btn primary', onclick: async () => {
        go.disabled = true;
        try {
          await B.setRole(p.id, role.value, role.value === 'campus_admin' ? campus.value : null);
          await B.setSections(p.id, role.value === 'super_admin' ? [] : boxes.filter((b) => b.checked).map((b) => b.value));
          await ensure(true); ov.remove(); toast('Role updated'); PP.admin.rerender();
        }
        catch (e) { toast(e.message, true); go.disabled = false; }
      } }, 'Save role');
      ov.append(h('div', { class: 'a-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Set role' }, h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: () => ov.remove() }, '×'),
        h('h2', { class: 'a-title' }, `Role for ${p.full_name}`), h('p', { class: 'a-sub' }, p.email || ''),
        h('div', { class: 'a-form' }, h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Role'), role), cw, secBox, h('p', { class: 'a-note' }, 'Campus admins and coordinators can view progress. Only the sections you tick above give them the power to change learners.'), go)));
      document.body.append(ov);
    }

    function addAdminDialog() {
      const nm = h('input', { class: 'ain', maxlength: 80, placeholder: 'Full name', 'aria-label': 'Full name' });
      const em = h('input', { class: 'ain', type: 'email', placeholder: 'teacher@school.edu', 'aria-label': 'Email' });
      const pw = h('input', { class: 'ain mono', value: genPassword(), 'aria-label': 'Password' });
      const role = h('select', { class: 'ain', 'aria-label': 'Role' }, [['section_admin', 'Section admin: sees and manages only their sections'], ['campus_admin', 'Campus admin: sees one campus'], ['coordinator', 'Coordinator: sees both campuses'], ['super_admin', 'Super admin: full control']].map(([v, t]) => h('option', { value: v }, t)));
      const campus = h('select', { class: 'ain', 'aria-label': 'Campus' }, D.campuses.map((c) => h('option', { value: c.code }, c.name)));
      const cw = h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Campus'), campus);
      const boxes = [];
      const secBox = h('fieldset', { class: 'a-q secpick' }, h('legend', null, 'Sections this person manages'),
        h('p', { class: 'a-note' }, 'They can add learners, edit details and set passwords for learners in these sections.'),
        D.campuses.map((c) => h('div', { class: 'secgrp' }, h('strong', null, c.name), h('div', { class: 'seclist' }, D.sections.filter((s) => s.campus === c.code && s.active).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).map((s) => { const cb = h('input', { type: 'checkbox', value: s.id }); boxes.push(cb); return h('label', { class: 'chk' }, cb, h('span', null, s.name)); })))));
      const syncRole = () => { cw.hidden = role.value !== 'campus_admin'; secBox.hidden = role.value === 'super_admin'; };
      role.addEventListener('change', syncRole); syncRole();
      const err = h('div', { class: 'a-err', hidden: true, role: 'alert' });
      const out = h('div');
      const ov = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === ov) close(); } });
      let made = false;
      function close() { ov.remove(); if (made) { D.at = 0; ensure(true).then(() => PP.admin.rerender()); } }
      const go = h('button', { class: 'btn primary', type: 'button' }, 'Create admin');
      go.addEventListener('click', () => {
        err.hidden = true;
        const f = { full_name: nm.value.trim(), email: em.value.trim(), password: pw.value, role: role.value, campus: campus.value, sections: boxes.filter((b) => b.checked).map((b) => b.value) };
        if (f.full_name.length < 2 || !/^\S+@\S+\.\S+$/.test(f.email)) { err.textContent = 'Enter the person\u2019s name and a valid email.'; err.hidden = false; return; }
        if (f.password.length < 8) { err.textContent = 'The password needs at least 8 characters.'; err.hidden = false; return; }
        const secs = f.sections.map((id) => D.secById[id]).filter(Boolean).map(secLabel).join(', ');
        const box = h('div', { class: 'a-confirm', role: 'alertdialog', 'aria-label': 'Confirm new admin' },
          h('h3', null, 'Create this admin account?'),
          h('p', { class: 'a-note' }, 'The account is made straight away: no sign-up and no email code. They sign in with this email and password.'),
          h('ul', { class: 'plain-list tight' }, h('li', null, h('strong', null, f.full_name), ' \u00b7 ', f.email), h('li', null, 'Role: ' + PP.auth.ROLE_LABEL[f.role] + (f.role === 'campus_admin' ? ' (' + campusName(f.campus) + ')' : '')), f.role !== 'super_admin' ? h('li', null, 'Manages: ' + (secs || 'no sections yet')) : null),
          h('div', { class: 'btnrow' },
            h('button', { class: 'btn primary', type: 'button', onclick: async () => {
              box.remove(); go.hidden = false; go.disabled = true; go.textContent = 'Creating\u2026';
              try {
                await B.createAdmin(f); made = true;
                form.hidden = true; go.hidden = true;
                out.replaceChildren(h('div', { class: 'a-ok' }, `${f.full_name} is now ${PP.auth.ROLE_LABEL[f.role]}. Give them this to sign in:`),
                  h('p', null, h('strong', null, 'Email: '), f.email, h('br'), h('strong', null, 'Password: '), h('span', { class: 'mono' }, f.password)),
                  h('div', { class: 'btnrow' }, h('button', { class: 'btn small', type: 'button', onclick: () => { try { navigator.clipboard.writeText(`${f.email}\t${f.password}`); toast('Copied'); } catch (e) { toast('Copy by hand.', true); } } }, 'Copy'), h('button', { class: 'btn', type: 'button', onclick: close }, 'Done')));
              } catch (e) { err.textContent = e.message; err.hidden = false; go.disabled = false; go.textContent = 'Create admin'; }
            } }, 'Confirm and create'),
            h('button', { class: 'btn', type: 'button', onclick: () => { box.remove(); go.hidden = false; } }, 'Go back')));
        go.hidden = true; out.replaceChildren(box);
      });
      const mf = (l, el) => h('label', { class: 'af' }, h('span', { class: 'af-l' }, l), el);
      const form = h('div', { class: 'a-form' }, mf('Full name', nm), mf('Email (used to sign in)', em), mf('Password (minimum 8 characters)', pw), mf('Role', role), cw, secBox, err, h('div', { class: 'btnrow' }, go, h('button', { class: 'btn', type: 'button', onclick: close }, 'Close')));
      ov.append(h('div', { class: 'a-card wide', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Add an admin' },
        h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: close }, '\u00d7'),
        h('h2', { class: 'a-title' }, 'Add an admin'), h('p', { class: 'a-sub' }, 'No sign-up needed. You create the account and set the password.'), form, out));
      document.body.append(ov); setTimeout(() => nm.focus(), 30);
    }
    body.replaceChildren(pageHead('Admins', 'Who can open this portal, and what they can see.', [h('button', { class: 'btn primary small', onclick: addAdminDialog }, 'Add an admin'), refreshBtn()]),
      h('section', { class: 'panel' }, h('h2', null, 'Current admins'),
        h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl-a stack-sm' }, h('thead', null, h('tr', null, ['Name', 'Role', 'Can see', 'Manages', ''].map((x) => h('th', null, x)))),
          h('tbody', null, admins.map((p) => h('tr', null,
            h('td', { 'data-label': 'Name' }, h('div', { class: 'who' }, h('span', { class: 'av' }, initials(p.full_name)), h('div', null, h('strong', null, p.full_name, p.id === me.id ? h('span', { class: 'you' }, ' (you)') : null), h('small', null, p.email || '')))),
            h('td', { 'data-label': 'Role' }, badge(PP.auth.ROLE_LABEL[p.role], p.role === 'super_admin' ? 'accent' : 'ok')),
            h('td', { 'data-label': 'Can see' }, p.role === 'campus_admin' ? campusName(p.admin_campus) + ' campus' : p.role === 'section_admin' ? 'Only their sections' : 'All campuses'),
            h('td', { 'data-label': 'Manages' }, p.role === 'super_admin' ? 'Everything' : ((D.adminSecs[p.id] || []).map((id) => D.secById[id]).filter(Boolean).map(secLabel).join(', ') || '\u2014')),
            h('td', { class: 'act' }, p.id === me.id ? h('small', { class: 'sub' }, 'You cannot change your own role') : h('span', { class: 'btnrow' }, h('button', { class: 'btn small', onclick: () => roleDialog(p) }, 'Change'), h('button', { class: 'btn small danger', onclick: async () => { if (!confirm(`Remove admin access from ${p.full_name}? They will become a normal learner.`)) return; try { await B.setRole(p.id, 'student', null); await ensure(true); toast('Admin removed'); PP.admin.rerender(); } catch (e) { toast(e.message, true); } } }, 'Remove'))))))))),
      h('section', { class: 'panel' }, h('h2', null, 'Already have an account?'), h('p', { class: 'adm-sub' }, 'To make an existing learner an admin, find them here and choose their role. For anyone new, use the Add an admin button above.'), search, results));
    find();
  }

  /* ---------------------------------------------------------------- sections settings (super admin) */
  async function settings(body) {
    const secsBy = (c) => D.sections.filter((s) => s.campus === c).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const count = (s) => D.profiles.filter((p) => p.section_id === s.id && p.role === 'student').length;
    const cards = D.campuses.map((c) => {
      const input = h('input', { class: 'ain', placeholder: 'New section name, e.g. 10-B', maxlength: 20, 'aria-label': 'New section name for ' + c.name });
      const add = h('button', { class: 'btn primary', onclick: async () => {
        const n = input.value.trim(); if (!n) return toast('Type a section name first.', true);
        add.disabled = true;
        try { await B.upsertSection({ campus: c.code, name: n }); await ensure(true); toast('Section added'); PP.admin.rerender(); } catch (e) { toast(/duplicate|already/i.test(e.message) ? 'That section already exists.' : e.message, true); add.disabled = false; }
      } }, 'Add section');
      onEnter(input, () => add.click());
      const list = secsBy(c.code);
      return h('section', { class: 'panel' }, h('h2', null, c.name + ' campus'),
        list.length ? h('ul', { class: 'plain-list sec-list' }, list.map((s) => {
          const nm = h('input', { class: 'ain inline', value: s.name, maxlength: 20, 'aria-label': 'Section name' });
          const dirty = () => nm.value.trim() && nm.value.trim() !== s.name;
          const saveBtn = h('button', { class: 'btn small', hidden: true, onclick: async () => { try { await B.upsertSection({ id: s.id, name: nm.value.trim(), active: s.active }); await ensure(true); toast('Renamed'); PP.admin.rerender(); } catch (e) { toast(e.message, true); } } }, 'Save');
          nm.addEventListener('input', () => { saveBtn.hidden = !dirty(); });
          return h('li', { class: s.active ? '' : 'off' }, h('div', { class: 'row' }, nm, saveBtn, h('span', { class: 'sub' }, `${count(s)} learner${count(s) === 1 ? '' : 's'}`),
            h('button', { class: 'btn small ghost', onclick: async () => { try { await B.upsertSection({ id: s.id, name: s.name, active: !s.active }); await ensure(true); toast(s.active ? 'Section hidden from sign-up' : 'Section visible again'); PP.admin.rerender(); } catch (e) { toast(e.message, true); } } }, s.active ? 'Hide from sign-up' : 'Show again')));
        })) : h('p', { class: 'empty' }, 'No sections yet. Add the sections students can choose when they sign up.'),
        h('div', { class: 'add-row' }, input, add));
    });
    body.replaceChildren(pageHead('Sections', 'The classes students choose from when they sign up. Hidden sections stay in the records but are not offered to new students.', [refreshBtn()]),
      h('div', { class: 'adm-grid2' }, cards),
      B.mode === 'demo' ? h('section', { class: 'panel' }, h('h2', null, 'Demo data'), h('p', { class: 'adm-sub' }, 'You are in demo mode. Reset to restore the original sample learners.'), h('button', { class: 'btn danger', onclick: () => { if (confirm('Erase all demo data and start again?')) { B.resetDemo(); D.at = 0; location.hash = '#/'; location.reload(); } } }, 'Reset demo data')) : null);
  }
  function onEnter(el, fn) { el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); fn(); } }); }

  /* ---------------------------------------------------------------- the student's own page */
  async function me(view) {
    if (!PP.auth.user) { view.replaceChildren(PP.auth.lockPage('My progress', 'Sign in to see your progress and keep it safe.')); return; }
    if (PP.auth.isAdmin) { location.hash = '#/admin'; return; }
    const p = PP.auth.profile;
    const page = h('div', { class: 'page wide me' });
    view.replaceChildren(page);
    page.append(h('div', { class: 'eyebrow' }, 'My progress'), h('h1', null, p ? p.full_name : 'Your account'));
    if (p) {
      page.append(h('div', { class: 'meta-row' }, statusBadge(p), h('span', null, p.school_status !== 'none' ? `${campusName(p.campus)}` : 'Independent learner'), p.gr_number ? h('span', null, 'GR ' + p.gr_number) : null, h('span', null, p.email || '')));
      if (p.school_status === 'claimed') page.append(h('div', { class: 'note' }, h('div', { class: 'nt' }, 'Waiting for confirmation'), h('div', null, 'Your teacher will check your class details. Your progress is already being saved.')));
      if (p.school_status === 'none') page.append(h('div', { class: 'note' }, h('div', { class: 'nt' }, 'Are you a school student?'), h('div', null, 'If you study at the school, ask your teacher to add you to your class so they can see your progress.')));
    }
    const done = CAT.items.filter((i) => PP.store.isDone(i.id)).length;
    const pc = pctOf(done, CAT.total);
    page.append(h('div', { class: 'kpis sm' }, h('div', { class: 'kpi sm' }, h('div', { class: 'kpi-v' }, pc + '%'), h('div', { class: 'kpi-l' }, 'Course complete')), h('div', { class: 'kpi sm' }, h('div', { class: 'kpi-v' }, `${done}/${CAT.total}`), h('div', { class: 'kpi-l' }, 'Activities done'))));
    page.append(h('h2', null, 'By module'));
    page.append(h('div', { class: 'mods' }, CAT.modules.map((m) => {
      const d = m.lessons.reduce((a, l) => a + l.items.filter((i) => PP.store.isDone(i)).length, 0);
      const first = m.lessons.find((l) => l.items.some((i) => !PP.store.isDone(i))) || m.lessons[0];
      return h('a', { class: 'mod flat', href: '#/learn/' + first.id }, h('span', { class: 'mod-n' }, String(m.index).padStart(2, '0')), h('span', { class: 'mod-t' }, m.title), h('span', { class: 'pc' }, bar(pctOf(d, m.total), d === m.total ? 'full' : ''), h('span', null, `${d}/${m.total}`)));
    })));
    const name = h('input', { class: 'ain', value: p ? p.full_name : '', maxlength: 80, 'aria-label': 'Your name' });
    const save = h('button', { class: 'btn', onclick: async () => { try { await B.updateMyName(name.value); toast('Name updated'); PP.auth.profile.full_name = name.value.trim(); } catch (e) { toast(e.message, true); } } }, 'Save name');
    const npw = h('input', { class: 'ain', type: 'password', placeholder: 'New password (minimum 8 characters)', autocomplete: 'new-password', 'aria-label': 'New password' });
    const chg = h('button', { class: 'btn', onclick: async () => { if (npw.value.length < 8) return toast('Use at least 8 characters.', true); try { await B.changePassword(npw.value); npw.value = ''; toast('Password changed'); } catch (e) { toast(e.message, true); } } }, 'Change password');
    page.append(h('h2', null, 'Your details'), h('div', { class: 'me-form' }, h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Display name'), name), save,
      h('p', { class: 'a-note' }, 'To change your GR number, campus or section, ask your teacher.'),
      h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Change your password'), npw), chg));
  }

  /* never let one person's cached data (or filters) leak into the next person's session on a shared computer */
  PP.auth.onChange(() => { D.profiles = null; D.sections = null; D.campuses = null; D.at = 0; D.progress = {}; Object.assign(Q, { search: '', campus: '', section: '', status: '', act: '', sort: 'name', dir: 1, page: 0 }); });

  PP.admin = {
    render, me,
    rerender() { const y = window.scrollY; window.dispatchEvent(new HashChangeEvent('hashchange')); window.scrollTo(0, y); },
  };
})();

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
    return D;
  }
  const secName = (p) => (p.section_id && D.secById[p.section_id] ? D.secById[p.section_id].name : '');
  const classLabel = (p) => (p.school_status === 'none' || !p.campus ? 'Not in school' : `${campusName(p.campus)} · ${secName(p) || 'no section'}`);
  const learners = () => D.profiles.filter((p) => p.role === 'student');
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
    if (p.role === 'super_admin') return 'Everyone: all campuses and all learners';
    if (p.role === 'coordinator') return 'Both campuses (view only)';
    return `${campusName(p.admin_campus)} campus (view only)`;
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
    body.replaceChildren(
      pageHead('Overview', scopeText(), [refreshBtn()]),
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
    body.replaceChildren(pageHead('Students', scopeText(), [exportBtn, refreshBtn()]),
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
      tableHost.replaceChildren(
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

    const manage = sup ? manageCard(p) : h('div', { class: 'viewonly' }, h('strong', null, 'View only. '), 'Only the super admin can change a learner’s details.');
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

  function manageCard(p) {
    const name = h('input', { class: 'ain', value: p.full_name, maxlength: 80, 'aria-label': 'Name' });
    const gr = h('input', { class: 'ain', value: p.gr_number || '', maxlength: 30, 'aria-label': 'GR number' });
    const status = h('select', { class: 'ain', 'aria-label': 'Status' }, [['none', 'Not a school student'], ['claimed', 'Unconfirmed school student'], ['confirmed', 'Confirmed school student']].map(([v, t]) => h('option', { value: v }, t)));
    status.value = p.school_status;
    const campus = h('select', { class: 'ain', 'aria-label': 'Campus' }, D.campuses.map((c) => h('option', { value: c.code }, c.name)));
    campus.value = p.campus || D.campuses[0].code;
    const section = h('select', { class: 'ain', 'aria-label': 'Section' });
    const fillSec = () => { const list = D.sections.filter((s) => s.campus === campus.value && (s.active || s.id === p.section_id)); section.replaceChildren(...(list.length ? list.map((s) => h('option', { value: s.id }, s.name)) : [h('option', { value: '' }, 'No sections for this campus')])); if (p.section_id && list.some((s) => s.id === p.section_id) && campus.value === p.campus) section.value = p.section_id; };
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
    return h('section', { class: 'panel manage' }, h('h2', null, 'Manage learner'), h('p', { class: 'adm-sub' }, 'Only you can see and use this.'),
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
      const role = h('select', { class: 'ain', 'aria-label': 'Role' }, h('option', { value: 'campus_admin' }, 'Campus admin: sees one campus'), h('option', { value: 'coordinator' }, 'Coordinator: sees both campuses'), h('option', { value: 'super_admin' }, 'Super admin: full control'));
      role.value = p.role !== 'student' ? p.role : 'campus_admin';
      const campus = h('select', { class: 'ain', 'aria-label': 'Campus' }, D.campuses.map((c) => h('option', { value: c.code }, c.name)));
      if (p.admin_campus) campus.value = p.admin_campus;
      const cw = h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Campus'), campus);
      role.addEventListener('change', () => { cw.hidden = role.value !== 'campus_admin'; });
      cw.hidden = role.value !== 'campus_admin';
      const ov = h('div', { class: 'a-overlay', onmousedown: (e) => { if (e.target === ov) ov.remove(); } });
      const go = h('button', { class: 'btn primary', onclick: async () => {
        go.disabled = true;
        try { await B.setRole(p.id, role.value, role.value === 'campus_admin' ? campus.value : null); await ensure(true); ov.remove(); toast('Role updated'); PP.admin.rerender(); }
        catch (e) { toast(e.message, true); go.disabled = false; }
      } }, 'Save role');
      ov.append(h('div', { class: 'a-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Set role' }, h('button', { class: 'a-x', type: 'button', 'aria-label': 'Close', onclick: () => ov.remove() }, '×'),
        h('h2', { class: 'a-title' }, `Role for ${p.full_name}`), h('p', { class: 'a-sub' }, p.email || ''),
        h('div', { class: 'a-form' }, h('label', { class: 'af' }, h('span', { class: 'af-l' }, 'Role'), role), cw, h('p', { class: 'a-note' }, 'Campus admins and coordinators can view progress only. They cannot change anything about a learner.'), go)));
      document.body.append(ov);
    }
    body.replaceChildren(pageHead('Admins', 'Who can open this portal, and what they can see.', [refreshBtn()]),
      h('section', { class: 'panel' }, h('h2', null, 'Current admins'),
        h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl-a stack-sm' }, h('thead', null, h('tr', null, ['Name', 'Role', 'Can see', ''].map((x) => h('th', null, x)))),
          h('tbody', null, admins.map((p) => h('tr', null,
            h('td', { 'data-label': 'Name' }, h('div', { class: 'who' }, h('span', { class: 'av' }, initials(p.full_name)), h('div', null, h('strong', null, p.full_name, p.id === me.id ? h('span', { class: 'you' }, ' (you)') : null), h('small', null, p.email || '')))),
            h('td', { 'data-label': 'Role' }, badge(PP.auth.ROLE_LABEL[p.role], p.role === 'super_admin' ? 'accent' : 'ok')),
            h('td', { 'data-label': 'Can see' }, p.role === 'campus_admin' ? campusName(p.admin_campus) + ' campus' : 'All campuses'),
            h('td', { class: 'act' }, p.id === me.id ? h('small', { class: 'sub' }, 'You cannot change your own role') : h('span', { class: 'btnrow' }, h('button', { class: 'btn small', onclick: () => roleDialog(p) }, 'Change'), h('button', { class: 'btn small danger', onclick: async () => { if (!confirm(`Remove admin access from ${p.full_name}? They will become a normal learner.`)) return; try { await B.setRole(p.id, 'student', null); await ensure(true); toast('Admin removed'); PP.admin.rerender(); } catch (e) { toast(e.message, true); } } }, 'Remove'))))))))),
      h('section', { class: 'panel' }, h('h2', null, 'Add an admin'), h('p', { class: 'adm-sub' }, 'The person must first create an account on the site. Then find them here and choose their role.'), search, results));
    find();
  }

  /* ---------------------------------------------------------------- sections settings (super admin) */
  async function settings(body) {
    const secsBy = (c) => D.sections.filter((s) => s.campus === c).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const count = (s) => D.profiles.filter((p) => p.section_id === s.id).length;
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

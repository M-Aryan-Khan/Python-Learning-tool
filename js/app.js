/* Router, sidebar and the page-level views (home, lessons, playground, reference). */
(function () {
  const { h } = PP;
  const view = document.getElementById('view');
  const side = document.getElementById('side');
  const openMods = new Set();
  const descEl = document.querySelector('meta[name="description"]');
  const DEFAULT_DESC = descEl ? descEl.content : '';
  const setDesc = (t) => { if (descEl) descEl.content = (t || DEFAULT_DESC).slice(0, 300); };


  /* ---------- light / dark theme ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  const ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function storedTheme() { try { const t = localStorage.getItem('pp.theme'); return t === 'light' || t === 'dark' ? t : null; } catch (e) { return null; } }
  function applyTheme(t, animate) {
    const root = document.documentElement;
    if (animate) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 400); }
    root.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.innerHTML = t === 'dark' ? ICON_SUN : ICON_MOON;
      const next = t === 'dark' ? 'light' : 'dark';
      themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      themeBtn.title = 'Switch to ' + next + ' mode';
    }
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#14171a' : '#ffffff');
  }
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('pp.theme', next); } catch (e) { /* private mode */ }
    applyTheme(next, true);
  });
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSys = (e) => { if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light', true); };
    if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys);
  }

  /* ---------- accounts ---------- */
  const userSlot = document.getElementById('userSlot');
  if (userSlot) {
    if (PP.backend.mode === 'demo') userSlot.before(h('span', { class: 'demo-pill', title: 'No database is connected. Accounts and data stay in this browser.' }, 'DEMO'));
    PP.auth.mountMenu(userSlot);
  }
  let wasSignedIn = false;
  PP.auth.onChange((user) => {
    const justSignedIn = !!user && !wasSignedIn; wasSignedIn = !!user;
    // admins land on their dashboard when they sign in from the home page
    if (justSignedIn && PP.auth.isAdmin && (!location.hash || location.hash === '#/')) { location.hash = '#/admin'; return; }
    const y = window.scrollY; renderRoute(); window.scrollTo(0, y);
  });
  PP.auth.init().then(() => renderRoute());

  /* ---------- runner status pill ---------- */
  PP.onRunnerState((s, msg) => {
    const pill = document.getElementById('pystate');
    const label = { loading: 'Starting Python…', ready: 'Python ready', error: 'Python failed to load' }[s];
    pill.innerHTML = '';
    pill.append(h('span', { class: 'dot ' + s }), h('span', null, label));
    if (msg) pill.title = msg;
  });

  /* ---------- sidebar ---------- */
  function buildSide(currentId) {
    side.innerHTML = '';
    PP.modules.forEach((m, mi) => {
      const lessons = m.lessons;
      const done = lessons.filter((l) => PP.lessonComplete(l)).length;
      const isCur = lessons.some((l) => l.id === currentId);
      if (isCur) openMods.add(m.id);
      const wrap = h('div', { class: 'side-mod' + (openMods.has(m.id) ? ' open' : '') });
      const btn = h('button', { onclick: () => { wrap.classList.toggle('open'); if (wrap.classList.contains('open')) openMods.add(m.id); else openMods.delete(m.id); } },
        h('span', { class: 'num' }, String(mi).padStart(2, '0')), h('span', null, m.title), h('span', { class: 'count' }, `${done}/${lessons.length}`));
      const list = h('div', { class: 'side-lessons' }, lessons.map((l) => {
        const p = PP.lessonProgress(l);
        const cls = p.done >= p.total ? 'done' : p.done > 0 ? 'part' : '';
        return h('a', { href: '#/learn/' + l.id, class: l.id === currentId ? 'on' : '', onclick: () => document.body.classList.remove('menu-open') }, h('span', { class: 'tick ' + cls }), h('span', null, l.title));
      }));
      wrap.append(btn, list);
      side.append(wrap);
    });
  }

  function updateOverall() {
    const pill = document.getElementById('overall');
    pill.textContent = PP.overall() + '% complete';
    pill.hidden = !!(PP.auth && PP.auth.isAdmin);   // admins do not have course progress
  }
  PP.store.onChange(() => {
    updateOverall();
    const m = location.hash.match(/#\/learn\/(.+)/);
    buildSide(m ? m[1] : null);
  });

  /* ---------- home ---------- */
  function nextLesson() {
    const all = PP.allLessons();
    return all.find(({ l }) => !PP.lessonComplete(l)) || all[0];
  }

  function moduleCard(m, mi) {
    const done = m.lessons.filter((l) => PP.lessonComplete(l)).length;
    const pct = Math.round((100 * done) / m.lessons.length);
    return h('a', { class: 'mcard', href: '#/learn/' + m.lessons[0].id },
      h('div', { class: 'mn' }, 'MODULE ' + String(mi).padStart(2, '0')), h('h3', null, m.title), h('p', null, m.blurb),
      h('div', { class: 'bar' }, h('i', { style: `width:${pct}%` })), h('div', { class: 'ms' }, h('span', null, `${m.lessons.length} lessons`), h('span', null, `${done} done`)));
  }

  function renderHome() {
    const nl = nextLesson();
    const started = PP.overall() > 0;
    const page = h('div', { class: 'page wide' });
    page.append(h('section', { class: 'hero' },
      h('div', { class: 'eyebrow' }, 'Edexcel International GCSE Computer Science · Paper 2'),
      h('h1', null, 'Learn Python… ', h('span', { class: 'hero-by' }, 'By Sir Aryan')),
      h('p', { class: 'hero-school' }, 'Specially crafted for ', h('strong', null, 'Beacon Light Academy')),
      h('p', { class: 'lede' }, 'Start from your very first line of code and build up to everything Paper 2 asks. Every idea is shown in all its forms, then you run it, change it, trace it and test yourself - right here in the browser.'),
      h('div', { class: 'hero-actions' },
        PP.auth.isAdmin ? h('a', { class: 'btn primary lg', href: '#/admin' }, 'Open the admin dashboard') : null,
        h('a', { class: PP.auth.isAdmin ? 'btn lg' : 'btn primary lg', href: '#/learn/' + (PP.auth.isAdmin ? PP.modules[0].lessons[0].id : nl.l.id) }, PP.auth.isAdmin ? 'Preview the course' : (started ? 'Continue: ' + nl.l.title : 'Start with lesson 1')),
        h('a', { class: 'btn lg', href: '#/play' }, 'Open the playground'))));

    page.append(h('h2', { style: 'margin-top:44px' }, 'How each lesson works'));
    page.append(h('div', { class: 'grid2' },
      h('div', null, h('h4', null, '1. Read a little'), h('p', null, 'Short explanations with the exact words the exam uses.')),
      h('div', null, h('h4', null, '2. Run every case'), h('p', null, 'Tabs show the same idea in all its variations. Every example is live: edit it and press Run.')),
      h('div', null, h('h4', null, '3. Trace it'), h('p', null, 'The Trace button walks through your code one line at a time and builds the trace table for you.')),
      h('div', null, h('h4', null, '4. Prove it'), h('p', null, 'Predict outputs, fix broken code and write programs that are checked against hidden tests.'))));

    page.append(h('h2', null, 'The course'));
    page.append(h('div', { class: 'mods' }, PP.modules.map(moduleCard)));

    page.append(h('h2', null, 'Where it matches your planner'));
    page.append(h('p', null, 'The order below follows the Beacon Light Academy plan for the programming units. Page numbers refer to the Pearson textbook.'));
    const map = PP.plannerMap || [];
    const t = h('table', { class: 'map stack-sm' }, h('thead', null, h('tr', null, h('th', null, 'Planner topic'), h('th', null, 'Book'), h('th', null, 'Python Path lessons'))),
      h('tbody', null, map.map((r) => h('tr', null, h('td', null, r[0]), h('td', { 'data-label': 'Textbook' }, r[1]), h('td', { 'data-label': 'Lessons' }, r[2].map((id, k) => {
        const f = PP.allLessons().find((x) => x.l.id === id);
        return f ? [k ? ', ' : '', h('a', { href: '#/learn/' + id }, f.l.title)] : null;
      }))))));
    page.append(h('div', { class: 'tbl' }, t));
    page.append(h('p', { style: 'margin-top:36px;color:var(--ink-3);font-size:13.5px' }, 'Progress is saved in this browser only. ', h('a', { href: '#', onclick: (e) => { e.preventDefault(); if (confirm('Erase all saved progress and your saved code in this browser?')) { PP.store.reset(); renderRoute(); } } }, 'Reset my progress')));
    view.replaceChildren(page);
  }

  function renderCourse() {
    const page = h('div', { class: 'page wide' });
    page.append(h('div', { class: 'eyebrow' }, 'All lessons'), h('h1', null, 'The whole course'), h('p', { class: 'lede' }, 'Work through the modules in order, or jump to the topic you need.'));
    PP.modules.forEach((m, mi) => {
      page.append(h('h2', null, `${String(mi).padStart(2, '0')}  ${m.title}`), h('p', null, m.blurb));
      page.append(h('div', { class: 'tbl' }, h('table', { class: 'stack-sm' }, h('tbody', null, m.lessons.map((l) => {
        const p = PP.lessonProgress(l);
        return h('tr', null,
          h('td', { style: 'width:28px', class: 'hide-s' }, h('span', { class: 'tick ' + (p.done >= p.total ? 'done' : p.done ? 'part' : '') })),
          h('td', null, h('a', { href: '#/learn/' + l.id }, l.title)),
          h('td', { style: 'color:var(--ink-3)' }, l.summary || ''),
          h('td', { style: 'color:var(--ink-3);white-space:nowrap' }, l.time || ''));
      })))));
    });
    view.replaceChildren(page);
  }

  /* ---------- lesson ---------- */
  function renderLesson(id) {
    const all = PP.allLessons();
    const idx = all.findIndex((x) => x.l.id === id);
    if (idx < 0) { view.replaceChildren(h('div', { class: 'page' }, h('h1', null, 'Lesson not found'), h('p', null, h('a', { href: '#/learn' }, 'Back to all lessons')))); return; }
    const { m, mi, l } = all[idx];
    const page = h('div', { class: 'page' });
    const chips = h('div', { class: 'meta' });
    if (l.time) chips.append(h('span', { class: 'chip' }, l.time));
    if (l.book) chips.append(h('span', { class: 'chip book' }, 'Textbook ' + l.book));
    if (l.exam) chips.append(h('span', { class: 'chip' }, 'Exam: ' + l.exam));
    const shareBtn = h('button', { class: 'chip share', title: 'Copy a link that shows a preview card when shared', onclick: () => {
      const link = location.origin + '/learn/' + l.id + '/';
      const done = () => { shareBtn.textContent = 'Link copied'; setTimeout(() => { shareBtn.textContent = 'Copy share link'; }, 1800); };
      try { navigator.clipboard.writeText(link).then(done, () => window.prompt('Copy this link:', link)); } catch (e) { window.prompt('Copy this link:', link); }
    } }, 'Copy share link');
    chips.append(shareBtn);
    const prog = h('div', { class: 'progress-line' });
    page.append(h('header', { class: 'lesson-head' },
      h('div', { class: 'eyebrow' }, `Module ${String(mi).padStart(2, '0')} · ${m.title}`),
      h('h1', null, l.title), l.intro && h('p', { class: 'lede', html: PP.ui.rich(l.intro) }), chips, prog));
    const mount = h('div');
    page.append(mount);

    function updateProg() {
      const p = PP.lessonProgress(l);
      const pct = Math.round((100 * p.done) / p.total);
      prog.replaceChildren(h('span', null, PP.lessonItems(l).length ? `${p.done} of ${p.total} activities complete` : 'Reading lesson'), h('div', { class: 'bar' }, h('i', { style: `width:${pct}%` })));
    }
    updateProg();
    const refresh = PP.ui.renderBlocks(l, mount);
    PP.sync.currentLesson = l.id;
    if (PP.auth.tracks) {
      PP.sync.view(l.id);
      if (!PP.lessonItems(l).length && !PP.store.isDone(l.id)) { PP.store.markDone(l.id); PP.sync.record({ id: l.id, kind: 'read', passed: true }); }
    }
    if (PP.auth.isAdmin) page.prepend(h('div', { class: 'admin-preview' }, h('strong', null, 'Admin preview. '), 'You can read and run everything here, but nothing you do is saved or counted as progress.', h('a', { href: '#/admin' }, 'Back to the admin dashboard')));

    const prev = all[idx - 1], next = all[idx + 1];
    page.append(h('nav', { class: 'prev-next' },
      prev ? h('a', { class: 'pn', href: '#/learn/' + prev.l.id }, h('small', null, '← Previous'), prev.l.title) : h('span', { class: 'pn disabled' }),
      next ? h('a', { class: 'pn next', href: '#/learn/' + next.l.id }, h('small', null, 'Next →'), next.l.title) : h('span', { class: 'pn disabled' })));
    view.replaceChildren(page);
    refresh();
    PP._lessonUpdate = updateProg;
    window.scrollTo(0, 0);
    buildSide(id);
    document.title = `${l.title} · By Sir Aryan`;
    setDesc(`${l.title}: ${l.summary || ''}. ${String(l.intro || '').replace(/`/g, '').replace(/<[^>]+>/g, '')}`);
  }
  PP.store.onChange(() => { if (PP._lessonUpdate && /#\/learn\//.test(location.hash)) PP._lessonUpdate(); });

  /* ---------- playground ---------- */
  const TEMPLATES = {
    'Blank': '# Write your program here\n',
    'Input and output': 'name = input("What is your name? ")\nage = int(input("How old are you? "))\nprint("Hello,", name)\nprint("Next year you will be", age + 1)\n',
    'Menu with functions': 'def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\nchoice = ""\nwhile choice != "3":\n    print("1. Add")\n    print("2. Subtract")\n    print("3. Quit")\n    choice = input("Choose: ")\n    if choice == "1" or choice == "2":\n        x = int(input("First number: "))\n        y = int(input("Second number: "))\n        if choice == "1":\n            print("Answer:", add(x, y))\n        else:\n            print("Answer:", subtract(x, y))\nprint("Goodbye")\n',
    'Read a text file': 'file = open("names.txt", "r")\nfor line in file:\n    print(line.strip())\nfile.close()\n',
    'Write a text file': 'file = open("scores.txt", "w")\nfor n in range(1, 4):\n    file.write("Player " + str(n) + "\n")\nfile.close()\nprint("Saved!")\n',
    '2D list (grid)': 'grid = [[1, 2, 3],\n        [4, 5, 6],\n        [7, 8, 9]]\nfor row in grid:\n    print(row)\nprint("Middle:", grid[1][1])\n',
  };

  function renderPlay() {
    if (!PP.auth.user) { view.replaceChildren(PP.auth.lockPage('Playground', 'Sign in to write and run your own Python programs.')); document.title = 'Playground · By Sir Aryan'; return; }
    const saved = PP.store.play || {};
    const state = { code: saved.code != null ? saved.code : TEMPLATES['Input and output'], stdin: saved.stdin || '', files: saved.files || [{ name: 'names.txt', content: 'Asha\nBen\nChloe\n' }] };
    const persist = () => { PP.store.play = { code: card.getCode(), stdin: state.stdin, files: state.files }; };
    const stdinTa = h('textarea', { rows: 3, placeholder: 'Optional: type input lines here (one per line) and they will be fed to input() automatically', style: 'width:100%;font-family:var(--mono);font-size:13px;border:1px solid var(--line-2);border-radius:4px;padding:6px 8px', oninput: (e) => { state.stdin = e.target.value; persist(); } });
    stdinTa.value = state.stdin;
    const filesBox = h('div');
    function drawFiles() {
      filesBox.innerHTML = '';
      state.files.forEach((f, i) => {
        const nm = h('input', { class: 'fname', value: f.name, 'aria-label': 'File name', oninput: (e) => { f.name = e.target.value; persist(); } });
        const ta = h('textarea', { 'aria-label': 'File contents', oninput: (e) => { f.content = e.target.value; persist(); } });
        ta.value = f.content;
        filesBox.append(h('div', { class: 'pf' }, nm, ' ', h('button', { class: 'btn small ghost', onclick: () => { state.files.splice(i, 1); drawFiles(); persist(); } }, 'Remove'), ta));
      });
    }
    drawFiles();
    const card = PP.ui.codeCard({
      code: state.code, title: 'main.py', sub: 'Press Ctrl+Enter to run',
      stdin: () => (state.stdin.trim() ? state.stdin.split('\n') : []),
      files: () => { const o = {}; state.files.forEach((f) => { if (f.name.trim()) o[f.name.trim()] = f.content; }); return o; },
      onChange: persist, reset: false,
    });
    const tpl = h('select', { class: 'sel', 'aria-label': 'Starter template', onchange: (e) => { if (e.target.value) { card.cm.setValue(TEMPLATES[e.target.value]); e.target.value = ''; } } },
      h('option', { value: '' }, 'Load a starter…'), Object.keys(TEMPLATES).map((k) => h('option', { value: k }, k)));
    card.el.querySelector('.tools').append(h('span', { class: 'sp' }), tpl);
    const page = h('div', { class: 'page wide' },
      h('div', { class: 'eyebrow' }, 'Playground'), h('h1', null, 'Try anything'), h('p', { class: 'lede' }, 'A free editor running real Python. Your code is saved in this browser.'),
      h('div', { class: 'play', style: 'margin-top:28px' },
        card.el,
        h('div', { class: 'play-side' },
          h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('span', { class: 'ttl' }, 'Input lines'), h('span', { class: 'sub' }, 'for input()')), h('div', { style: 'padding:10px 12px' }, stdinTa)),
          h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('span', { class: 'ttl' }, 'Text files'), h('span', { class: 'sub' }, 'for open()'), h('button', { class: 'btn small sp', onclick: () => { state.files.push({ name: 'data' + (state.files.length + 1) + '.txt', content: '' }); drawFiles(); persist(); } }, 'Add file')), filesBox))));
    view.replaceChildren(page);
    card.refresh();
    document.title = 'Playground · By Sir Aryan';
  }

  /* ---------- past-paper finder ---------- */
  function renderPapers() {
    if (!PP.auth.user) { view.replaceChildren(PP.auth.lockPage('Past-paper finder', 'Sign in to find past-paper questions and the lessons and practice that go with them.')); document.title = 'Past papers · By Sir Aryan'; return; }
    const data = PP.pastPapers || [];
    const topics = [...new Set(data.map((d) => d.topic))].sort();
    const papers = [...new Set(data.map((d) => d.paper))].sort();
    const fTopic = h('select', { class: 'sel', 'aria-label': 'Topic' }, h('option', { value: '' }, 'All topics'), topics.map((t) => h('option', { value: t }, t)));
    const fPaper = h('select', { class: 'sel', 'aria-label': 'Paper' }, h('option', { value: '' }, 'All papers'), papers.map((t) => h('option', { value: t }, t === 'P2' ? 'Paper 2 (practical)' : t === 'P1' ? 'Paper 1 (theory)' : t)));
    const fText = h('input', { class: 'vin', type: 'search', placeholder: 'Search, e.g. 2021 or bubble', size: 22, 'aria-label': 'Search' });
    const body = h('tbody');
    const idToLesson = {};
    PP.allLessons().forEach(({ l }) => { idToLesson[l.id] = l; });
    const idToEx = {};
    PP.allLessons().forEach(({ l }) => l.blocks.forEach((b) => { if (b.id) idToEx[b.id] = { l, b }; }));
    function draw() {
      body.innerHTML = '';
      const q = fText.value.trim().toLowerCase();
      const rows = data.filter((d) => (!fTopic.value || d.topic === fTopic.value) && (!fPaper.value || d.paper === fPaper.value) && (!q || JSON.stringify(d).toLowerCase().includes(q)));
      rows.forEach((d) => {
        const ls = (d.lessons || []).filter((id) => idToLesson[id]).map((id, k) => [k ? ', ' : '', h('a', { href: '#/learn/' + id }, idToLesson[id].title)]);
        const pr = (d.practice || []).filter((id) => idToEx[id]).map((id, k) => [k ? ', ' : '', h('a', { href: '#/learn/' + idToEx[id].l.id }, idToEx[id].b.title || id), PP.store.isDone(id) ? ' ✓' : '']);
        body.append(h('tr', null,
          h('td', { style: 'white-space:nowrap' }, h('strong', null, d.session), h('div', { style: 'color:var(--ink-3);font-size:13px' }, `${d.paper} ${d.q}${d.marks ? ' · ' + d.marks + (d.marks === 1 ? ' mark' : ' marks') : ''}`)),
          h('td', { 'data-label': 'What it asks' }, d.skill, h('div', { style: 'color:var(--ink-3);font-size:13px' }, d.topic)),
          h('td', { style: 'white-space:nowrap;color:var(--ink-2);font-size:14px', 'data-label': 'Booklet' }, d.page || ''),
          h('td', { 'data-label': 'Learn first' }, ls.length ? ls : '-'),
          h('td', { 'data-label': 'Practise' }, pr.length ? pr : '-')));
      });
      count.textContent = `${rows.length} of ${data.length} questions`;
    }
    const count = h('span', { class: 'vhint' });
    [fTopic, fPaper].forEach((e) => e.addEventListener('change', draw));
    fText.addEventListener('input', draw);
    const page = h('div', { class: 'page wide' },
      h('div', { class: 'eyebrow' }, 'Past papers'), h('h1', null, 'Past-paper finder'),
      h('p', { class: 'lede' }, 'Find any question from your topical booklet, see what skill it tests, and jump to the lessons and original practice tasks that prepare you for it.'),
      h('div', { class: 'note' }, h('div', { class: 'nt' }, 'About these tasks'), h('div', { html: 'The original questions belong to Pearson Edexcel, so this site does not copy them. Open your booklet at the page shown, and use the practice tasks here, which are written in the same style.' })),
      h('div', { class: 'vopts', style: 'margin-top:22px' }, fPaper, fTopic, fText, count),
      h('div', { class: 'tbl' }, h('table', { class: 'stack-sm' }, h('thead', null, h('tr', null, ['Session / question', 'What it asks', 'Booklet', 'Learn first', 'Practise'].map((x) => h('th', null, x)))), body)));
    view.replaceChildren(page);
    draw();
    document.title = 'Past papers · By Sir Aryan';
  }

  /* ---------- animations / explainers gallery ---------- */
  function renderExplore() {
    const page = h('div', { class: 'page wide' },
      h('div', { class: 'eyebrow' }, 'Animations'), h('h1', null, 'See it move'),
      h('p', { class: 'lede' }, 'Interactive explainers for the ideas students find hardest. Every one also appears inside its lesson.'));
    const nav = h('div', { class: 'refnav' });
    page.append(nav);
    PP.allLessons().forEach(({ m, l }) => {
      l.blocks.filter((b) => b.t === 'viz').forEach((b, k) => {
        const anchor = 'viz-' + l.id + '-' + k;
        const titleMap = { range: 'range()', nested: 'Nested loops', slice: 'String slicing', list: 'List operations', grid: '2D lists', search: b.mode === 'linear' ? 'Linear search' : 'Binary search', bubble: 'Bubble sort', merge: 'Merge sort', binary: b.title || 'Binary numbers', denary2bin: 'Denary to binary', binadd: 'Binary addition', caesar: 'Caesar cipher', rle: 'Run-length encoding', memory: 'Memory visualiser' };
        const name = titleMap[b.kind] || b.kind;
        nav.append(h('a', { href: '#', onclick: (e) => { e.preventDefault(); document.getElementById(anchor).scrollIntoView({ behavior: 'smooth' }); } }, name));
        page.append(h('h2', { id: anchor, style: 'margin-top:44px' }, name), h('p', { style: 'margin-top:-6px' }, 'From the lesson ', h('a', { href: '#/learn/' + l.id }, l.title), '.'), PP.ui.extra.viz(Object.assign({}, b, { caption: b.caption })));
      });
    });
    view.replaceChildren(page);
    document.title = 'Animations · By Sir Aryan';
  }

  /* ---------- reference ---------- */
  function renderRef(id) {
    const items = PP.reference;
    const cur = items.find((r) => r.id === id) || items[0];
    const page = h('div', { class: 'page' },
      h('div', { class: 'eyebrow' }, 'Reference'), h('h1', null, cur ? cur.title : 'Reference'),
      h('div', { class: 'refnav' }, items.map((r) => h('a', { href: '#/ref/' + r.id, class: r === cur ? 'on' : '' }, r.title))));
    if (cur) { const mount = h('div'); page.append(mount); const rf = PP.ui.renderBlocks({ id: 'ref-' + cur.id, blocks: cur.blocks }, mount); view.replaceChildren(page); rf(); }
    else view.replaceChildren(page);
    document.title = 'Reference · By Sir Aryan';
  }

  /* ---------- header height, drawer, backdrop ---------- */
  const topEl = document.querySelector('.top');
  const setTop = () => document.documentElement.style.setProperty('--top-h', topEl.offsetHeight + 'px');
  setTop();
  if (window.ResizeObserver) new ResizeObserver(setTop).observe(topEl); else window.addEventListener('resize', setTop);
  const menuBtn = document.getElementById('menuBtn');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { const cur = side.querySelector('a.on'); if (cur) cur.scrollIntoView({ block: 'center' }); }
  }
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.getElementById('backdrop').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- router ---------- */
  function renderRoute() {
    PP.ui.editors.length = 0;
    setDesc();
    const hash = location.hash || '#/';
    const r = hash.split('/');
    const area = r[1] || '';
    setMenu(false);
    document.querySelectorAll('#topnav a').forEach((a) => a.classList.toggle('on', a.dataset.r === (area === '' ? 'home' : area)));
    const hasSide = area === 'learn' && r[2];
    side.style.display = hasSide ? '' : 'none';
    document.getElementById('menuBtn').style.display = hasSide ? '' : 'none';
    if (area === 'learn' && r[2]) renderLesson(decodeURIComponent(r[2]));
    else if (area === 'learn') { renderCourse(); document.title = 'Lessons · By Sir Aryan'; }
    else if (area === 'play') renderPlay();
    else if (area === 'papers') renderPapers();
    else if (area === 'explore') renderExplore();
    else if (area === 'me') { if (!PP.auth.ready) view.replaceChildren(h('p', { class: 'page' }, 'Loading…')); else PP.admin.me(view); document.title = 'My progress · By Sir Aryan'; }
    else if (area === 'admin') { if (!PP.auth.ready) view.replaceChildren(h('p', { class: 'page' }, 'Loading…')); else PP.admin.render(view, r.slice(1).map((x) => x.split('?')[0])); }
    else if (area === 'ref') renderRef(r[2]);
    else { renderHome(); document.title = 'Python Path · By Sir Aryan'; }
    if (area !== 'learn' || !r[2]) window.scrollTo(0, 0);
    updateOverall();
  }
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();

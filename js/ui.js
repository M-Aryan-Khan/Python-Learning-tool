/* UI components: editor cards, console, trace player, activities, block renderer. */
(function () {
  const { h, esc } = PP;
  const ui = (PP.ui = {});

  /* ---------- lightweight inline markup for authored text ---------- */
  const escBare = (s) => s.replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  ui.rich = function (s) {
    if (s == null) return '';
    return String(s)
      .replace(/`([^`]+)`/g, (_, c) => '<code>' + escBare(c) + '</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  };
  const rich = ui.rich;

  /* ---------- CodeMirror ---------- */
  ui.editors = [];
  ui.extra = {};   // extra block renderers (js/blocks2.js, js/viz.js)
  ui.makeEditor = function (parent, code, opts) {
    opts = opts || {};
    const cm = CodeMirror(parent, {
      value: code,
      mode: 'python',
      theme: 'pp',
      lineNumbers: opts.lineNumbers !== false,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: !opts.readOnly,
      readOnly: opts.readOnly ? 'nocursor' : false,
      viewportMargin: Infinity,
      extraKeys: {
        Tab: (c) => { if (c.somethingSelected()) c.indentSelection('add'); else c.replaceSelection('    ', 'end'); },
        'Shift-Tab': (c) => c.indentSelection('subtract'),
        'Ctrl-Enter': () => opts.onRun && opts.onRun(),
        'Cmd-Enter': () => opts.onRun && opts.onRun(),
      },
    });
    if (opts.onChange) cm.on('change', () => opts.onChange(cm.getValue()));
    ui.editors.push(cm);
    return cm;
  };

  /* ---------- console ---------- */
  function makeConsole() {
    const pre = h('pre', { 'aria-live': 'polite' });
    const status = h('span', { class: 'sp' });
    const head = h('div', { class: 'console-head' }, 'Output', status);
    const slot = h('div');
    const el = h('div', { class: 'console', hidden: true }, head, pre, slot);
    let pendingInput = null;
    const api = {
      el, slot,
      show() { el.hidden = false; },
      setText(s) { pre.textContent = s; pre.scrollTop = pre.scrollHeight; pendingInput = null; },
      setStatus(s) { status.textContent = s || ''; },
      clearSlot() { slot.innerHTML = ''; },
      askInput() {
        return new Promise((resolve) => {
          const inp = h('input', { class: 'stdin', type: 'text', 'aria-label': 'Type your answer and press Enter', size: 18, autocomplete: 'off', spellcheck: 'false' });
          pre.append(inp);
          inp.focus();
          pre.scrollTop = pre.scrollHeight;
          pendingInput = resolve;
          inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); pendingInput = null; resolve(inp.value); }
          });
        });
      },
      cancelInput() { if (pendingInput) { const r = pendingInput; pendingInput = null; r(null); } },
    };
    return api;
  }

  function errorBox(e, code) {
    const hint = PP.explainError(e);
    const box = h('div', { class: 'errbox' });
    box.append(h('div', { class: 'et' }, `${e.type}: ${e.msg}`));
    if (e.line) box.append(h('div', { class: 'eline' }, `line ${e.line}:  ${(e.text || code.split('\n')[e.line - 1] || '').trim()}`));
    if (hint) box.append(h('p', { html: '<span class="why">What this usually means: </span>' + hint }));
    return box;
  }
  ui.errorBox = errorBox;

  function filesBox(files, provided) {
    const names = Object.keys(files || {});
    if (!names.length) return null;
    const d = h('details', { class: 'filebox' });
    d.open = true;
    d.append(h('summary', null, `Files in the program's folder (${names.length})`));
    names.forEach((n) => {
      const tag = provided && provided[n] !== undefined ? (provided[n] === files[n] ? 'input file' : 'changed by your program') : 'created by your program';
      d.append(h('div', { class: 'f' }, h('div', { class: 'fn' }, n, h('span', null, tag)), h('pre', null, files[n] === '' ? '(empty)' : files[n])));
    });
    return d;
  }

  /* ---------- trace player ---------- */
  function tracePanel(cm, steps, stdout, code, onClose) {
    const root = h('div', { class: 'tracepanel' });
    let i = 0, timer = null, mode = 'step';
    const info = h('span', { class: 'info' });
    const range = h('input', { type: 'range', min: 0, max: Math.max(0, steps.length - 1), value: 0, 'aria-label': 'Step' });
    const globBox = h('div'), locBox = h('div'), outBox = h('pre', { class: 'trace-out' });
    const btn = (label, fn, title) => h('button', { class: 'btn small', onclick: fn, title: title || label }, label);
    const playBtn = btn('Play', () => togglePlay());
    const tableBtn = btn('Trace table', () => toggleMode());
    const ctl = h('div', { class: 'trace-ctl' },
      btn('|<', () => go(0), 'First'), btn('Back', () => go(i - 1)), btn('Step', () => go(i + 1)), btn('>|', () => go(steps.length - 1), 'Last'),
      playBtn, range, info, tableBtn, btn('Close', () => close()));
    const stepView = h('div', null, h('div', { class: 'trace-vars' }, h('div', null, h('h5', null, 'Variables'), globBox), h('div', null, h('h5', { class: 'lh' }, 'Inside the function'), locBox)), outBox);
    const tableView = h('div', { hidden: true });
    root.append(ctl, stepView, tableView);

    let lastLine = -1;
    function varTable(vars, prev) {
      const names = Object.keys(vars || {});
      if (!names.length) return h('p', { style: 'color:var(--ink-3);font-size:13.5px;margin:0' }, '(none yet)');
      const t = h('table', { class: 'vartbl' });
      names.forEach((n) => t.append(h('tr', { class: !prev || prev[n] !== vars[n] ? 'chg' : '' }, h('th', null, n), h('td', null, vars[n]))));
      return t;
    }
    function go(n) {
      if (!steps.length) return;
      i = Math.max(0, Math.min(steps.length - 1, n));
      const s = steps[i], prev = i > 0 ? steps[i - 1] : null;
      range.value = i;
      if (lastLine >= 0) { cm.removeLineClass(lastLine, 'background', 'cm-trace-line'); }
      lastLine = s.line - 1;
      cm.addLineClass(lastLine, 'background', 'cm-trace-line');
      cm.scrollIntoView({ line: lastLine, ch: 0 }, 60);
      const what = s.kind === 'return' ? (s.fn ? `leaving ${s.fn}()` : 'program finished') : 'about to run';
      info.textContent = `Step ${i + 1} of ${steps.length} · ${what} line ${s.line}`;
      globBox.replaceChildren(varTable(s.glob, prev && prev.glob));
      locBox.replaceChildren(s.loc ? varTable(s.loc, prev && prev.fn === s.fn ? prev.loc : null) : h('p', { style: 'color:var(--ink-3);font-size:13.5px;margin:0' }, 'Not inside a function.'));
      locBox.previousSibling.textContent = s.fn ? `Inside ${s.fn}()` : 'Inside a function';
      let outTxt = stdout.slice(0, s.out);
      if (s.kind === 'return' && s.ret !== undefined && s.fn) outTxt += (outTxt ? '\n' : '') + `[${s.fn}() returns ${s.ret}]`;
      outBox.textContent = outTxt;
    }
    function togglePlay() {
      if (timer) { clearInterval(timer); timer = null; playBtn.textContent = 'Play'; return; }
      if (i >= steps.length - 1) go(0);
      playBtn.textContent = 'Pause';
      timer = setInterval(() => { if (i >= steps.length - 1) { togglePlay(); } else go(i + 1); }, 550);
    }
    range.addEventListener('input', () => go(+range.value));

    function buildTable() {
      const rows = steps.map((s, k) => ({ s, nxt: steps[k + 1] })).filter((r) => r.s.kind === 'line' && r.nxt);
      const cols = [];
      const colKey = (fn, n) => (fn ? `${fn}:${n}` : n);
      const seen = new Set();
      const add = (fn, n) => { const k = colKey(fn, n); if (!seen.has(k)) { seen.add(k); cols.push({ k, n, fn }); } };
      rows.forEach(({ nxt }) => { Object.keys(nxt.glob).forEach((n) => add(null, n)); if (nxt.loc) Object.keys(nxt.loc).forEach((n) => add(nxt.fn, n)); });
      const limit = 400;
      const t = h('table');
      t.append(h('tr', null, h('th', null, 'Line'), cols.map((c) => h('th', { title: c.fn ? 'in ' + c.fn + '()' : 'global' }, c.fn ? `${c.n} (${c.fn})` : c.n)), h('th', null, 'Output')));
      let prevVals = {}, prevOut = 0;
      rows.slice(0, limit).forEach(({ s, nxt }) => {
        const vals = {};
        Object.keys(nxt.glob).forEach((n) => { vals[n] = nxt.glob[n]; });
        if (nxt.loc) Object.keys(nxt.loc).forEach((n) => { vals[colKey(nxt.fn, n)] = nxt.loc[n]; });
        const tr = h('tr', null, h('td', null, String(s.line)));
        cols.forEach((c) => {
          const v = vals[c.k];
          const changed = v !== undefined && prevVals[c.k] !== v;
          tr.append(h('td', { class: changed ? 'chg' : '' }, changed ? v : ''));
        });
        const o = stdout.slice(prevOut, nxt.out).replace(/\n$/, '');
        tr.append(h('td', { style: 'text-align:left' }, o));
        prevOut = nxt.out;
        prevVals = Object.assign({}, prevVals, vals);
        t.append(tr);
      });
      const wrap = h('div', { class: 'tt-wrap' }, t);
      const note = h('p', { style: 'padding:8px 14px;margin:0;font-size:13px;color:var(--ink-2)' },
        'Each row is one line that ran. A value is shown only when that line changed it (highlighted) - exactly how you fill in a trace table in the exam.' + (rows.length > limit ? ` Only the first ${limit} rows are shown.` : ''));
      return [note, wrap];
    }
    function toggleMode() {
      if (mode === 'step') {
        mode = 'table'; if (timer) togglePlay();
        tableView.replaceChildren(...buildTable());
        tableView.hidden = false; stepView.hidden = true; tableBtn.textContent = 'Step view';
      } else {
        mode = 'step'; tableView.hidden = true; stepView.hidden = false; tableBtn.textContent = 'Trace table';
      }
    }
    function close() {
      if (timer) clearInterval(timer);
      if (lastLine >= 0) cm.removeLineClass(lastLine, 'background', 'cm-trace-line');
      root.remove(); if (onClose) onClose();
    }
    go(0);
    root.close = close;
    return root;
  }

  /* ---------- the runnable code card ---------- */
  ui.stdinNote = function (list) {
    return h('div', { class: 'stdin-note' }, h('strong', null, list.length === 1 ? 'The user types: ' : 'The user types, in order: '),
      list.map((v, i) => h('span', { class: 'stdin-chip' }, h('small', null, list.length > 1 ? (i + 1) + '.' : ''), h('code', null, String(v) === '' ? '(just Enter)' : String(v)))));
  };

  ui.codeCard = function (o) {
    const startCode = o.code;
    const saved = o.id ? PP.store.getCode(o.id) : undefined;
    const con = makeConsole();
    const body = h('div', { class: 'card-body' });
    const runBtn = h('button', { class: 'btn primary', title: 'Run (Ctrl+Enter)' }, 'Run');
    const traceBtn = h('button', { class: 'btn', title: 'Run one line at a time and watch the variables' }, 'Trace');
    const stopBtn = h('button', { class: 'btn', hidden: true }, 'Stop');
    const resetBtn = h('button', { class: 'btn ghost sp', title: 'Put the original code back' }, 'Reset code');
    const tools = h('div', { class: 'tools' }, runBtn);
    if (o.trace !== false) tools.append(traceBtn);
    tools.append(stopBtn);
    if (o.extra) o.extra.forEach((x) => tools.append(x));
    if (o.reset !== false) tools.append(resetBtn);
    const head = o.title || o.sub ? h('div', { class: 'card-head' }, o.title && h('span', { class: 'ttl' }, o.title), o.sub && h('span', { class: 'sub' }, o.sub)) : null;
    const note = Array.isArray(o.stdin) && o.stdin.length ? ui.stdinNote(o.stdin) : null;
    const card = h('div', { class: 'card' }, head, body, note, tools, con.el);

    let cm, token = 0, currentRun = null, trace = null;

    function clearMarks() {
      if (cm._errLine != null) { cm.removeLineClass(cm._errLine, 'background', 'cm-err-line'); cm._errLine = null; }
    }
    function closeTrace() { if (trace) { trace.close(); trace = null; } }

    async function go(mode) {
      if (!PP.auth.gate(mode === 'trace' ? 'trace your code' : 'run code')) return;
      if (PP.sync) PP.sync.run();
      token++;
      const my = token;
      con.cancelInput();
      clearMarks(); closeTrace();
      con.clearSlot();
      const code = cm.getValue();
      const files = typeof o.files === 'function' ? o.files() : o.files;
      const inputs = (typeof o.stdin === 'function' ? o.stdin() : o.stdin || []).slice();
      const seed = Math.floor(Math.random() * 1e6);
      con.show(); con.setText(''); con.setStatus('running…');
      runBtn.disabled = traceBtn.disabled = true; stopBtn.hidden = false;
      let res;
      for (; ;) {
        const p = PP.runner.run({ mode, code, inputs, files, seed, echo: true }, { onOut: (s) => { if (my === token) con.setText(s); }, timeout: 8000 });
        currentRun = p;
        res = await p;
        if (my !== token) return;
        con.setText(res.stdout || '');
        if (res.need !== null && res.need !== undefined && !res.timeout && !res.stopped) {
          con.setStatus('waiting for your input');
          const v = await con.askInput();
          if (my !== token) return;
          if (v === null) { res = { stdout: res.stdout, files: {}, stopped: true }; break; }
          inputs.push(v);
          con.setStatus('running…');
          continue;
        }
        break;
      }
      runBtn.disabled = traceBtn.disabled = false; stopBtn.hidden = true; currentRun = null;
      con.setStatus('');
      if (res.fatal) { con.slot.append(h('div', { class: 'timebox' }, 'Python could not start: ' + res.fatal)); return; }
      if (res.timeout) con.slot.append(h('div', { class: 'timebox' }, 'Stopped: your program ran for more than 8 seconds. This usually means an infinite loop - check that the loop condition can become False, and that the variable it tests is being changed inside the loop.'));
      else if (res.stopped) con.setStatus('stopped');
      else if (res.truncated === 'output') con.slot.append(h('div', { class: 'timebox' }, 'Stopped: your program printed far too much output. Check for an infinite loop that prints.'));
      else if (res.truncated === 'steps') con.slot.append(h('div', { class: 'timebox' }, 'The trace stopped after 1500 steps. Use a smaller example (fewer loop repeats) to trace.'));
      if (res.error) {
        con.slot.append(errorBox(res.error, code));
        if (res.error.line && res.error.line <= cm.lineCount()) { cm._errLine = res.error.line - 1; cm.addLineClass(cm._errLine, 'background', 'cm-err-line'); }
      }
      const fb = filesBox(res.files, files);
      if (fb) con.slot.append(fb);
      if (mode === 'trace' && res.trace && res.trace.length) {
        trace = tracePanel(cm, res.trace, res.stdout || '', code, () => { trace = null; });
        con.slot.append(trace);
      }
      if (o.onRan) o.onRan(res);
    }

    runBtn.addEventListener('click', () => go('run'));
    traceBtn.addEventListener('click', () => go('trace'));
    stopBtn.addEventListener('click', () => { token++; con.cancelInput(); if (currentRun && currentRun.stop) currentRun.stop(); runBtn.disabled = traceBtn.disabled = false; stopBtn.hidden = true; con.setStatus('stopped'); });
    resetBtn.addEventListener('click', () => {
      token++; con.cancelInput(); closeTrace(); clearMarks();
      cm.setValue(startCode); if (o.id) PP.store.clearCode(o.id);
      con.el.hidden = true; con.clearSlot(); runBtn.disabled = traceBtn.disabled = false; stopBtn.hidden = true;
    });

    cm = ui.makeEditor(body, saved !== undefined ? saved : startCode, {
      readOnly: o.readOnly,
      onRun: () => go('run'),
      onChange: (v) => { if (o.id && !o.readOnly) PP.store.setCode(o.id, v); clearMarks(); if (o.onChange) o.onChange(v); },
    });
    if (!o.readOnly) {
      /* symbol bar: only visible on touch devices (CSS), where ( ) : " are slow to find */
      const bar = h('div', { class: 'symbar', role: 'toolbar', 'aria-label': 'Code symbols' });
      [['Tab', '    '], [':', ':'], ['(', '('], [')', ')'], ['[', '['], [']', ']'], ['"', '"'], ["'", "'"], ['=', '='], ['==', '=='], ['#', '#'], ['_', '_'], ['{', '{'], ['}', '}']].forEach(([label, txt]) => {
        const b = h('button', { type: 'button', 'aria-label': label === 'Tab' ? 'Indent' : 'Insert ' + label, onpointerdown: (e) => e.preventDefault(), onclick: () => { cm.replaceSelection(txt, 'end'); cm.focus(); } }, label);
        if (label === 'Tab') b.classList.add('wide');
        bar.append(b);
      });
      [['←', 'goCharLeft'], ['→', 'goCharRight']].forEach(([label, cmd]) => bar.append(h('button', { type: 'button', 'aria-label': cmd, onpointerdown: (e) => e.preventDefault(), onclick: () => { cm.execCommand(cmd); cm.focus(); } }, label)));
      card.insertBefore(bar, tools);
    }
    if (o.readOnly) { tools.hidden = !o.showRun; }
    return { el: card, cm, con, run: () => go('run'), getCode: () => cm.getValue(), refresh: () => cm.refresh(), reset: () => resetBtn.click() };
  };

  /* ---------- helpers for activities ---------- */
  function actShell(kind, title, level, id) {
    const state = h('span', { class: 'state' }, PP.store.isDone(id) ? 'Done' : 'To do');
    const lvl = level ? h('span', { class: 'lvl' }, ['', 'Starter', 'Core', 'Stretch'][level] || '') : null;
    const head = h('div', { class: 'act-head' }, h('span', { class: 'kind' }, kind), title && h('span', { class: 'ttl' }, title), lvl, state);
    const body = h('div', { class: 'act-body' });
    const el = h('div', { class: 'act' + (PP.store.isDone(id) ? ' done' : '') }, head, body);
    return {
      el, body, head,
      setDone() { PP.store.markDone(id); el.classList.add('done'); state.textContent = 'Done'; },
    };
  }

  function fb(kind, html) { return h('div', { class: 'feedback ' + kind, html }); }
  ui.actShell = actShell;
  ui.fb = fb;

  /* ---------- exercise ---------- */
  function describeInput(t) {
    if (!t.in || !t.in.length) return 'no input';
    return t.in.map((x) => JSON.stringify(x)).join(', ');
  }
  ui.exercise = function (b, id) {
    const shell = actShell(b.kind === 'debug' ? 'Fix the bugs' : b.kind === 'exam' ? 'Exam-style task' : 'Exercise', b.title, b.level, id);
    shell.body.append(h('div', { html: rich(b.prompt) }));
    const files = b.files;
    const card = ui.codeCard({ code: b.starter, id, files, stdin: b.stdin, reset: true, title: b.filename || 'your_code.py' });
    shell.body.append(card.el);
    const result = h('div');
    const hints = h('div', { class: 'hintbox' });
    const sol = h('div', { class: 'solbox' });
    let hintN = 0, failed = 0;
    const checkBtn = h('button', { class: 'btn primary' }, 'Check my answer');
    const hintBtn = h('button', { class: 'btn', hidden: !(b.hints && b.hints.length) }, 'Give me a hint');
    const solBtn = h('button', { class: 'btn ghost', hidden: true }, 'Show a model answer');
    const actions = h('div', { class: 'act-actions' }, checkBtn, hintBtn, solBtn);
    shell.el.append(actions, result, hints, sol);

    hintBtn.addEventListener('click', () => {
      if (hintN < b.hints.length) {
        hints.append(h('div', { class: 'hint', html: `<b>Hint ${hintN + 1}.</b> ${rich(b.hints[hintN])}` }));
        hintN++;
        if (hintN >= b.hints.length) hintBtn.disabled = true;
        if (hintN >= 1) solBtn.hidden = false;
      }
    });
    solBtn.addEventListener('click', () => {
      if (sol.childNodes.length) { sol.innerHTML = ''; solBtn.textContent = 'Show a model answer'; return; }
      sol.append(h('div', { class: 'feedback info', html: 'A model answer. Read it, then close this and try to write your own version from memory.' }), h('pre', null, b.solution));
      if (b.explain) sol.append(h('div', { html: rich(b.explain) }));
      solBtn.textContent = 'Hide model answer';
    });

    checkBtn.addEventListener('click', async () => {
      if (!PP.auth.gate('check your answer')) return;
      checkBtn.disabled = true;
      result.replaceChildren(fb('info', 'Checking…'));
      const code = card.getCode();
      const list = h('ul', { class: 'tests' });
      let allOk = true, shownFail = 0;
      for (const rq of b.requires || []) {
        const ok = new RegExp(rq.re, rq.flags || 'm').test(code);
        const bad = rq.not ? ok : !ok;
        if (bad) allOk = false;
        list.append(h('li', { class: bad ? 'fail' : 'pass' }, h('span', { class: 'mk' }, bad ? '✗' : '✓'), h('div', null, h('div', { html: rich(rq.msg) }))));
      }
      if (b.compute) {   // the answer must be worked out by the program, not typed inside quotes
        const lits = (code.match(/(["'])(?:\\.|(?!\1).)*\1/g) || []).join('\n');
        const typed = (b.tests || []).some((t) => typeof t.out === 'string' && t.out.split('\n').some((ln) => ln.trim().length >= 2 && lits.includes(ln.trim())));
        if (typed) allOk = false;
        list.append(h('li', { class: typed ? 'fail' : 'pass' }, h('span', { class: 'mk' }, typed ? '✗' : '✓'), h('div', null, h('div', { html: rich(b.computeMsg || 'Work the answer out with code. Do not type the finished answer inside quotes.') }))));
      }
      let n = 0;
      for (const t of b.tests || []) {
        n++;
        const res = await PP.runner.grade(code, t);
        const label = t.label || (t.py && !t.in ? (t.msg || 'Check ' + n) : (t.in && t.in.length ? `Test ${n}: input ${describeInput(t)}` : `Test ${n}`));
        let detail = null;
        if (res.timeout) { detail = h('div', { class: 'd' }, 'Your program took too long (infinite loop?).'); }
        else if (res.fatal) { detail = h('div', { class: 'd' }, res.fatal); }
        else if (!res.ok) {
          if (res.reason === 'error') {
            const e = res.error;
            detail = h('div', null, h('div', { class: 'd' }, `${e.type}: ${e.msg}${e.line ? '  (line ' + e.line + ')' : ''}`), PP.explainError(e) ? h('div', { class: 'lab', html: PP.explainError(e) }) : null);
          } else if (res.reason === 'output') {
            detail = t.hidden ? h('div', { class: 'd' }, 'Your program printed:\n' + (res.got || '(nothing)'))
              : h('div', null, h('div', { class: 'lab' }, 'Expected output'), h('div', { class: 'd' }, t.out), h('div', { class: 'lab' }, 'Your output'), h('div', { class: 'd' }, res.got || '(nothing printed)'));
          } else if (res.reason === 'has') {
            detail = h('div', { class: 'd' }, `Your output should include: ${res.missing}\nYour output: ${res.got || '(nothing printed)'}`);
          } else if (res.reason === 'hasNot') {
            detail = h('div', { class: 'd' }, `Your output should NOT include: ${res.missing}\nYour output: ${res.got}`);
          } else if (res.reason === 'file') {
            detail = h('div', null, h('div', { class: 'lab' }, `Expected contents of ${res.missing}`), h('div', { class: 'd' }, res.expected_file), h('div', { class: 'lab' }, 'What your program wrote'), h('div', { class: 'd' }, (res.files || {})[res.missing] || '(file missing)'));
          } else {
            detail = h('div', { class: 'd' }, (t.msg ? t.msg + '\n' : '') + (res.detail || ''));
          }
        }
        if (!res.ok) { allOk = false; shownFail++; }
        list.append(h('li', { class: res.ok ? 'pass' : 'fail' }, h('span', { class: 'mk' }, res.ok ? '✓' : '✗'), h('div', null, h('div', null, t.hidden ? 'Hidden test ' + n : label), !res.ok && detail)));
      }
      checkBtn.disabled = false;
      PP.sync.record({ id, kind: b.kind || 'exercise', passed: allOk, code });
      if (allOk) {
        shell.setDone();
        result.replaceChildren(fb('ok', '<strong>All checks passed.</strong> ' + (b.after ? rich(b.after) : 'Well done - this exercise is complete.')), h('div', { style: 'margin:0 16px 14px' }, list));
      } else {
        failed++;
        if (failed >= 1 && b.solution) solBtn.hidden = false;
        result.replaceChildren(fb('bad', `<strong>Not yet.</strong> ${shownFail} check${shownFail === 1 ? '' : 's'} failed. Read the failed ones below, fix your code, and try again.`), h('div', { style: 'margin:0 16px 14px' }, list));
      }
    });
    return shell.el;
  };

  /* ---------- predict the output ---------- */
  ui.predict = function (b, id) {
    const shell = actShell('Predict', b.title || 'What will this print?', 0, id);
    shell.body.append(h('div', { html: rich(b.question || 'Read the code carefully and type exactly what it will print. Do not run it first!') }));
    const card = ui.codeCard({ code: b.code, readOnly: true, showRun: false, trace: false, reset: false });
    shell.body.append(card.el);
    if (b.stdin && b.stdin.length) shell.body.append(ui.stdinNote(b.stdin));
    const ta = h('textarea', { class: 'ans', rows: Math.min(8, Math.max(2, (b.rows || 3))), placeholder: 'Type the output here, one line per print', 'aria-label': 'Your predicted output', spellcheck: 'false' });
    shell.body.append(ta);
    const result = h('div');
    const checkBtn = h('button', { class: 'btn primary' }, 'Check');
    const revealBtn = h('button', { class: 'btn ghost', hidden: true }, 'Reveal the answer');
    const runBtn = h('button', { class: 'btn', hidden: true }, 'Run the code');
    shell.el.append(h('div', { class: 'act-actions' }, checkBtn, revealBtn, runBtn), result);
    let tries = 0, expected = null;
    async function getExpected() {
      if (expected !== null) return expected;
      const res = await PP.runner.run({ mode: 'test', code: b.code, inputs: b.stdin || [], files: b.files, echo: false }, { timeout: 6000 });
      expected = res.error ? `${res.error.type}: ${res.error.msg}` : res.stdout;
      return expected;
    }
    const showRun = () => {
      runBtn.hidden = false;
    };
    runBtn.addEventListener('click', () => {
      const c = ui.codeCard({ code: b.code, stdin: b.stdin, files: b.files, trace: true, reset: false, title: 'Run it and compare' });
      result.append(c.el); c.cm.refresh(); c.run(); runBtn.hidden = true;
    });
    checkBtn.addEventListener('click', async () => {
      if (!PP.auth.gate('check your answer')) return;
      const exp = await getExpected();
      const got = ta.value;
      tries++;
      const flat = (s) => PP.norm(s).split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n');
      const okp = flat(got) === flat(exp);
      PP.sync.record({ id, kind: 'predict', passed: okp, code: got });
      if (okp) {
        shell.setDone(); showRun();
        result.replaceChildren(fb('ok', '<strong>Correct.</strong> ' + (b.why ? rich(b.why) : 'You traced it exactly right.')));
      } else {
        revealBtn.hidden = tries < 2;
        let msg = '<strong>Not quite.</strong> ';
        if (PP.norm(got).replace(/\s+/g, '') === PP.norm(exp).replace(/\s+/g, '')) msg += 'The characters are right but the spacing or line breaks are different.';
        else if (PP.norm(got).toLowerCase() === PP.norm(exp).toLowerCase()) msg += 'Capital letters matter in Python output.';
        else msg += 'Trace the code line by line again, writing down the value of each variable as it changes.';
        if (b.hint) msg += '<br>Hint: ' + rich(b.hint);
        result.replaceChildren(fb('bad', msg));
      }
    });
    revealBtn.addEventListener('click', async () => {
      const exp = await getExpected();
      result.replaceChildren(fb('info', '<strong>The program prints:</strong>'), h('pre', { style: 'margin:0 16px 14px;font-family:var(--mono);font-size:13.5px;background:var(--code-bg);padding:10px 14px;border:1px solid var(--line);border-radius:6px;white-space:pre-wrap' }, exp || '(nothing)'), b.why ? fb('info', rich(b.why)) : '');
      showRun();
    });
    return shell.el;
  };

  /* ---------- multiple choice ---------- */
  ui.quiz = function (b, id) {
    const multi = Array.isArray(b.answer);
    const shell = actShell('Quick check', b.title, 0, id);
    shell.body.append(h('div', { html: rich(b.q) }));
    if (b.code) shell.body.append(ui.codeCard({ code: b.code, readOnly: true, trace: false, reset: false }).el);
    const name = 'q' + Math.random().toString(36).slice(2);
    const ul = h('ul', { class: 'opts' });
    const inputs = b.options.map((o, i) => {
      const inp = h('input', { type: multi ? 'checkbox' : 'radio', name, value: i });
      ul.append(h('li', null, h('label', null, inp, h('span', { html: rich(o) }))));
      return inp;
    });
    shell.body.append(ul);
    if (multi) shell.body.append(h('p', { style: 'font-size:13.5px;color:var(--ink-3)' }, 'Choose all that apply.'));
    const result = h('div');
    const btn = h('button', { class: 'btn primary' }, 'Check');
    shell.el.append(h('div', { class: 'act-actions' }, btn), result);
    btn.addEventListener('click', () => {
      if (!PP.auth.gate('check your answer')) return;
      const want = new Set(multi ? b.answer : [b.answer]);
      const got = new Set(inputs.filter((x) => x.checked).map((x) => +x.value));
      if (!got.size) { result.replaceChildren(fb('info', 'Choose an answer first.')); return; }
      const ok = want.size === got.size && [...want].every((x) => got.has(x));
      PP.sync.record({ id, kind: 'quiz', passed: ok });
      inputs.forEach((inp, i) => {
        const li = inp.closest('li'); li.className = '';
        if (ok && want.has(i)) li.classList.add('right');
        if (!ok && got.has(i) && !want.has(i)) li.classList.add('wrong');
      });
      if (ok) { shell.setDone(); result.replaceChildren(fb('ok', '<strong>Correct.</strong> ' + rich(b.why || ''))); }
      else result.replaceChildren(fb('bad', '<strong>Not quite.</strong> ' + (b.hint ? rich(b.hint) : 'Look again at each option and try once more.')));
    });
    return shell.el;
  };

  /* ---------- sort / classify ---------- */
  ui.sort = function (b, id) {
    const shell = actShell('Classify', b.title, 0, id);
    shell.body.append(h('div', { html: rich(b.prompt) }));
    const list = h('div', { class: 'sortlist' });
    const sels = b.items.map((it) => {
      const sel = h('select', { 'aria-label': 'Category' }, h('option', { value: '' }, 'Choose…'), b.cats.map((c, i) => h('option', { value: i }, c)));
      const row = h('div', { class: 'sortrow' }, h('div', { class: 'tx', html: rich(it.text) }), sel);
      list.append(row);
      return { sel, row, it };
    });
    shell.body.append(list);
    const result = h('div');
    const btn = h('button', { class: 'btn primary' }, 'Check');
    shell.el.append(h('div', { class: 'act-actions' }, btn), result);
    btn.addEventListener('click', () => {
      if (!PP.auth.gate('check your answer')) return;
      let ok = true, blank = false;
      sels.forEach(({ sel, row, it }) => {
        const want = typeof it.cat === 'number' ? it.cat : b.cats.indexOf(it.cat);
        row.className = 'sortrow';
        if (sel.value === '') { blank = true; ok = false; return; }
        if (+sel.value === want) row.classList.add('right'); else { row.classList.add('wrong'); ok = false; }
      });
      if (!blank) PP.sync.record({ id, kind: 'sort', passed: ok });
      if (blank) result.replaceChildren(fb('info', 'Choose a category for every row first.'));
      else if (ok) { shell.setDone(); result.replaceChildren(fb('ok', '<strong>All correct.</strong> ' + rich(b.why || ''))); }
      else result.replaceChildren(fb('bad', 'Some are wrong (red). ' + (b.hint ? rich(b.hint) : 'Change them and check again.')));
    });
    return shell.el;
  };

  /* ---------- parsons (put lines in order) ---------- */
  function seededShuffle(arr, seedStr) {
    let s = 0;
    for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const a = arr.slice();
    for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1));[a[k], a[j]] = [a[j], a[k]]; }
    return a;
  }
  ui.parsons = function (b, id) {
    const shell = actShell('Put the lines in order', b.title, 0, id);
    shell.body.append(h('div', { html: rich(b.prompt) }));
    const idx = b.lines.map((_, i) => i);
    let order = seededShuffle(idx, id);
    if (order.every((v, i) => v === i)) order.reverse();
    const box = h('div', { class: 'parsons' });
    shell.body.append(box);
    const result = h('div');
    function draw(mark) {
      box.innerHTML = '';
      order.forEach((li, pos) => {
        const row = h('div', { class: 'pline' + (mark ? (li === pos ? ' right' : ' wrong') : '') },
          h('div', { class: 'code' }, b.lines[li]),
          h('div', { class: 'mv' },
            h('button', { title: 'Move up', 'aria-label': 'Move up', onclick: () => { if (pos > 0) { [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]]; draw(); } } }, '▲'),
            h('button', { title: 'Move down', 'aria-label': 'Move down', onclick: () => { if (pos < order.length - 1) { [order[pos + 1], order[pos]] = [order[pos], order[pos + 1]]; draw(); } } }, '▼')));
        box.append(row);
      });
    }
    draw();
    const btn = h('button', { class: 'btn primary' }, 'Check order');
    shell.el.append(h('div', { class: 'act-actions' }, btn), result);
    btn.addEventListener('click', () => {
      if (!PP.auth.gate('check your answer')) return;
      const ok = order.every((v, i) => v === i);
      PP.sync.record({ id, kind: 'parsons', passed: ok });
      draw(true);
      if (ok) { shell.setDone(); result.replaceChildren(fb('ok', '<strong>Correct order.</strong> ' + rich(b.why || ''))); }
      else result.replaceChildren(fb('bad', 'Green lines are in the right place, red ones are not. Remember: indentation shows which lines belong inside a block.'));
    });
    return shell.el;
  };

  /* ---------- block renderer ---------- */
  ui.renderBlocks = function (lesson, mount) {
    const refreshers = [];
    const firstEditor = ui.editors.length;
    lesson.blocks.forEach((b, i) => {
      const id = b.id || `${lesson.id}:${i}`;
      let el = null;
      switch (b.t) {
        case 'h': el = h('h3', { html: rich(b.text) }); break;
        case 'h2': el = h('h2', { html: rich(b.text) }); break;
        case 'p': el = h('p', { html: rich(b.html) }); break;
        case 'list': el = h(b.ordered ? 'ol' : 'ul', null, b.items.map((x) => h('li', { html: rich(x) }))); break;
        case 'note': {
          const k = b.kind || 'tip';
          const label = { tip: 'Good to know', warn: 'Watch out', exam: 'In the exam', key: 'Key idea' }[k];
          el = h('div', { class: 'note ' + k }, h('div', { class: 'nt' }, b.title || label), h('div', { html: rich(b.html) }));
          break;
        }
        case 'table': {
          const t = h('table', null,
            b.head && h('thead', null, h('tr', null, b.head.map((x) => h('th', { html: rich(x) })))),
            h('tbody', null, b.rows.map((r) => h('tr', null, r.map((c) => h('td', { html: rich(c) }))))));
          el = h('div', { class: 'tbl' }, t);
          break;
        }
        case 'html': el = h('div', { html: b.html }); break;
        case 'code': {
          const c = ui.codeCard({ code: b.code, stdin: b.stdin, files: b.files, id, title: b.title, sub: b.sub, trace: b.trace !== false });
          el = h('div', null, c.el, b.caption && h('p', { style: 'font-size:14.5px;color:var(--ink-2);margin-top:-8px', html: rich(b.caption) }));
          refreshers.push(c.refresh);
          break;
        }
        case 'cases': {
          const wrap = h('div', { class: 'cases' }, h('div', { class: 'cases-head' }, b.title || 'Every case'));
          const tabs = h('div', { class: 'tabs', role: 'tablist' });
          const panes = [];
          b.items.forEach((it, k) => {
            const pane = h('div', { hidden: k !== 0 });
            const built = { c: null };
            const build = () => {
              if (built.c) return;
              built.c = ui.codeCard({ code: it.code, stdin: it.stdin, files: it.files, id: `${id}:${k}`, title: it.title || undefined });
              if (it.intro) pane.append(h('div', { class: 'case-intro', html: rich(it.intro) }));
              pane.append(built.c.el);
            };
            panes.push({ pane, build, built });
            const tb = h('button', {
              role: 'tab', class: k === 0 ? 'on' : '', onclick: () => {
                [...tabs.children].forEach((x, j) => { x.classList.toggle('on', j === k); panes[j].pane.hidden = j !== k; });
                build(); built.c.refresh();
              }
            }, it.label);
            tabs.append(tb);
          });
          wrap.append(tabs, ...panes.map((p) => p.pane));
          panes[0].build();
          refreshers.push(() => panes[0].built.c && panes[0].built.c.refresh());
          el = wrap;
          break;
        }
        case 'exercise': el = ui.exercise(b, id); break;
        case 'predict': el = ui.predict(b, id); break;
        case 'quiz': el = ui.quiz(b, id); break;
        case 'sort': el = ui.sort(b, id); break;
        case 'parsons': el = ui.parsons(b, id); break;
        default: el = ui.extra[b.t] ? ui.extra[b.t](b, id, refreshers) : h('p', null, `[unknown block ${b.t}]`);
      }
      mount.append(el);
    });
    return () => { refreshers.forEach((f) => f()); ui.editors.slice(firstEditor).forEach((cm) => cm.refresh()); };
  };
})();

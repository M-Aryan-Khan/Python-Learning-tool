/* Extra block types: flowchart (drawn from a structured spec) and tracetable (student fills in a trace table). */
(function () {
  const { h } = PP;
  const ui = PP.ui;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs, text) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  };

  /* ================= flowchart ================= */
  const G = 28;           // vertical gap between shapes
  const CHAR = 7.4;       // average character width (px) at 13px
  const lines = (t) => String(t).split('\n');
  const textW = (t) => Math.max(...lines(t).map((l) => l.length)) * CHAR;

  function label(g, cx, cy, t) {
    const ls = lines(t);
    ls.forEach((l, i) => g.append(svg('text', { x: cx, y: cy + (i - (ls.length - 1) / 2) * 16 + 4.5, 'text-anchor': 'middle', class: 'fc-t' }, l)));
  }
  function arrow(g, x1, y1, x2, y2, head = true) {
    g.append(svg('path', { d: `M${x1},${y1} L${x2},${y2}`, class: 'fc-l', 'marker-end': head ? 'url(#fc-arrow)' : '' }));
  }
  function path(g, d, head = true) { g.append(svg('path', { d, class: 'fc-l', 'marker-end': head ? 'url(#fc-arrow)' : '' })); }
  function tag(g, x, y, t, anchor) { g.append(svg('text', { x, y, class: 'fc-tag', 'text-anchor': anchor || 'middle' }, t)); }

  function node(item) {
    let kind, text;
    if (item.start !== undefined) { kind = 'term'; text = item.start || 'Start'; }
    else if (item.end !== undefined) { kind = 'term'; text = item.end || 'End'; }
    else if (item.io !== undefined) { kind = 'io'; text = item.io; }
    else if (item.p !== undefined) { kind = 'proc'; text = item.p; }
    else if (item.sub !== undefined) { kind = 'sub'; text = item.sub; }
    else throw new Error('bad flowchart item ' + JSON.stringify(item));
    const tw = textW(text), n = lines(text).length;
    const w = Math.max(kind === 'term' ? 96 : 130, tw + (kind === 'io' ? 64 : 34));
    const hgt = Math.max(40, n * 16 + 20);
    return {
      w, h: hgt,
      draw(g, cx, y) {
        const x = cx - w / 2;
        if (kind === 'term') g.append(svg('rect', { x, y, width: w, height: hgt, rx: hgt / 2, class: 'fc-s' }));
        else if (kind === 'io') g.append(svg('polygon', { points: `${x + 18},${y} ${x + w},${y} ${x + w - 18},${y + hgt} ${x},${y + hgt}`, class: 'fc-s' }));
        else if (kind === 'sub') {
          g.append(svg('rect', { x, y, width: w, height: hgt, class: 'fc-s' }));
          g.append(svg('path', { d: `M${x + 10},${y} V${y + hgt} M${x + w - 10},${y} V${y + hgt}`, class: 'fc-l' }));
        } else g.append(svg('rect', { x, y, width: w, height: hgt, class: 'fc-s' }));
        label(g, cx, y + hgt / 2, text);
      },
    };
  }

  function diamond(text) {
    const tw = textW(text), n = lines(text).length;
    const w = Math.max(150, tw * 1.55 + 20), hgt = Math.max(66, n * 16 + 46);
    return {
      w, h: hgt,
      draw(g, cx, y) {
        g.append(svg('polygon', { points: `${cx},${y} ${cx + w / 2},${y + hgt / 2} ${cx},${y + hgt} ${cx - w / 2},${y + hgt / 2}`, class: 'fc-s' }));
        label(g, cx, y + hgt / 2, text);
      },
    };
  }

  function seq(items) {
    const parts = items.map(build);
    const w = parts.length ? Math.max(...parts.map((p) => p.w)) : 0;
    const hgt = parts.reduce((a, p) => a + p.h, 0) + G * Math.max(0, parts.length - 1);
    return {
      w, h: hgt, empty: !parts.length,
      draw(g, cx, y) {
        let cy = y;
        parts.forEach((p, i) => {
          p.draw(g, cx, cy);
          cy += p.h;
          if (i < parts.length - 1) { arrow(g, cx, cy, cx, cy + G); cy += G; }
        });
      },
    };
  }

  function build(item) {
    if (item.if !== undefined) return ifNode(item);
    if (item.while !== undefined) return whileNode(item);
    if (item.until !== undefined) return untilNode(item);
    return node(item);
  }

  function ifNode(item) {
    const d = diamond(item.if), a = seq(item.then || []), b = seq(item.else || []);
    const yes = item.yes || 'Yes', no = item.no || 'No';
    const bw = Math.max(a.w, b.w, 90);
    const W = Math.max(d.w, 2 * bw + 50);
    const bh = Math.max(a.h, b.h);
    const hgt = d.h + G + bh + G;
    return {
      w: W, h: hgt,
      draw(g, cx, y) {
        d.draw(g, cx, y);
        const ym = y + d.h / 2, top = y + d.h + G, merge = top + bh + G / 2 + 6;
        const lx = cx - bw / 2 - 25, rx = cx + bw / 2 + 25;
        path(g, `M${cx - d.w / 2},${ym} H${lx} V${top}`, !a.empty);
        path(g, `M${cx + d.w / 2},${ym} H${rx} V${top}`, !b.empty);
        tag(g, cx - d.w / 2 - 8, ym - 6, yes, 'end');
        tag(g, cx + d.w / 2 + 8, ym - 6, no, 'start');
        a.draw(g, lx, top); b.draw(g, rx, top);
        path(g, `M${lx},${top + (a.empty ? 0 : a.h)} V${merge} H${cx}`, false);
        path(g, `M${rx},${top + (b.empty ? 0 : b.h)} V${merge} H${cx}`, false);
        g.append(svg('circle', { cx, cy: merge, r: 2.5, class: 'fc-dot' }));
        arrow(g, cx, merge, cx, y + hgt, false);
      },
    };
  }

  function whileNode(item) {
    const d = diamond(item.while), body = seq(item.body || []);
    const yes = item.yes || 'Yes', no = item.no || 'No';
    const core = Math.max(d.w, body.w);
    const W = core + 130;
    const hgt = d.h + G + body.h + 44;
    return {
      w: W, h: hgt, leadIn: G / 2,
      draw(g, cx, y) {
        d.draw(g, cx, y);
        const top = y + d.h + G, bodyBottom = top + body.h, ym = y + d.h / 2;
        const xl = cx - core / 2 - 34, xr = cx + core / 2 + 40;
        arrow(g, cx, y + d.h, cx, top);
        tag(g, cx + 8, y + d.h + 14, yes, 'start');
        body.draw(g, cx, top);
        path(g, `M${cx},${bodyBottom} V${bodyBottom + 16} H${xl} V${y - G / 2} H${cx}`, true);
        path(g, `M${cx + d.w / 2},${ym} H${xr} V${y + hgt} H${cx}`, false);
        tag(g, cx + d.w / 2 + 8, ym - 6, no, 'start');
      },
    };
  }

  function untilNode(item) {
    const d = diamond(item.until), body = seq(item.body || []);
    const yes = item.yes || 'Yes', no = item.no || 'No';
    const core = Math.max(d.w, body.w);
    const W = core + 130;
    const hgt = body.h + G + d.h + G;
    return {
      w: W, h: hgt, leadIn: G / 2,
      draw(g, cx, y) {
        body.draw(g, cx, y);
        const dy = y + body.h + G, ym = dy + d.h / 2;
        arrow(g, cx, y + body.h, cx, dy);
        d.draw(g, cx, dy);
        const xl = cx - core / 2 - 34;
        path(g, `M${cx - d.w / 2},${ym} H${xl} V${y - G / 2} H${cx}`, true);
        tag(g, cx - d.w / 2 - 8, ym - 6, no, 'end');
        arrow(g, cx, dy + d.h, cx, y + hgt, false);
        tag(g, cx + 8, dy + d.h + 14, yes, 'start');
      },
    };
  }

  ui.flowchart = function (spec) {
    const root = seq(spec);
    const pad = 24, W = root.w + pad * 2 + 40, H = root.h + pad * 2 + 14;
    const el = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: W, class: 'flow-svg', role: 'img' });
    const defs = svg('defs');
    const m = svg('marker', { id: 'fc-arrow', viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' });
    m.append(svg('path', { d: 'M0,0 L10,5 L0,10 z', class: 'fc-head' }));
    defs.append(m); el.append(defs);
    const g = svg('g');
    el.append(g);
    root.draw(g, W / 2, pad + 14);
    return el;
  };

  ui.extra.flowchart = function (b) {
    const wrap = h('figure', { class: 'flow' });
    if (b.title) wrap.append(h('figcaption', { class: 'flow-title' }, b.title));
    wrap.append(h('div', { class: 'flow-scroll' }, ui.flowchart(b.flow)));
    if (b.caption) wrap.append(h('figcaption', { class: 'flow-cap', html: ui.rich(b.caption) }));
    return wrap;
  };

  /* ================= trace table (student fills in) ================= */
  function traceRows(steps, stdout, wantCols) {
    const rows = steps.map((s, k) => ({ s, nxt: steps[k + 1] })).filter((r) => r.s.kind === 'line' && r.nxt);
    const cols = [];
    rows.forEach(({ nxt }) => Object.keys(nxt.glob).forEach((n) => { if (!cols.includes(n) && (!wantCols || wantCols.includes(n))) cols.push(n); }));
    const orderedCols = wantCols ? wantCols.filter((c) => cols.includes(c)) : cols;
    let prev = {}, prevOut = 0;
    const out = [];
    rows.forEach(({ s, nxt }) => {
      const vals = {}, chg = {};
      orderedCols.forEach((c) => {
        const v = nxt.glob[c];
        vals[c] = v === undefined ? '' : v;
        chg[c] = v !== undefined && prev[c] !== v;
        if (v !== undefined) prev[c] = v;
      });
      const o = stdout.slice(prevOut, nxt.out).replace(/\n$/, '');
      prevOut = nxt.out;
      out.push({ line: s.line, vals, chg, out: o });
    });
    return { cols: orderedCols, rows: out };
  }
  ui.traceRows = traceRows;

  const clean = (v) => String(v).trim().replace(/^(['"])(.*)\1$/, '$2');

  ui.extra.tracetable = function (b, id) {
    const shell = ui.actShell('Complete the trace table', b.title, b.level || 2, id);
    shell.body.append(h('div', { html: ui.rich(b.prompt || 'Work through the program line by line. In each row, write a variable\'s value only in the row where it **changes**, and anything printed in the Output column. Leave other cells empty.') }));
    const card = ui.codeCard({ code: b.code, readOnly: true, trace: false, reset: false });
    shell.body.append(card.el);
    if (b.stdin && b.stdin.length) shell.body.append(ui.stdinNote(b.stdin));
    const holder = h('div', { class: 'tt-fill' }, h('p', { style: 'color:var(--ink-3)' }, 'Preparing the table…'));
    shell.body.append(holder);
    const result = h('div');
    const checkBtn = h('button', { class: 'btn primary', disabled: true }, 'Check my table');
    const showBtn = h('button', { class: 'btn ghost', hidden: true }, 'Show the answers');
    shell.el.append(h('div', { class: 'act-actions' }, checkBtn, showBtn), result);

    let table = null, inputs = [];
    PP.runner.run({ mode: 'trace', code: b.code, inputs: b.stdin || [], echo: false }, { timeout: 8000 }).then((res) => {
      if (!res.trace || !res.trace.length) { holder.textContent = 'Could not build this table.'; return; }
      table = traceRows(res.trace, res.stdout || '', b.cols);
      let rows = table.rows;
      if (b.rows !== 'all') rows = rows.filter((r) => table.cols.some((c) => r.chg[c]) || (b.output !== false && r.out));
      table.rows = rows;
      const showOut = b.output !== false && rows.some((r) => r.out);
      const t = h('table', null, h('tr', null, h('th', null, 'Line'), table.cols.map((c) => h('th', null, c)), showOut && h('th', null, 'Output')));
      rows.forEach((r) => {
        const tr = h('tr', null, h('td', null, String(r.line)));
        const rowIn = {};
        table.cols.forEach((c) => {
          const inp = h('input', { type: 'text', 'aria-label': `${c} at line ${r.line}`, size: 6, spellcheck: 'false', autocomplete: 'off' });
          rowIn[c] = inp; tr.append(h('td', null, inp));
        });
        if (showOut) { const inp = h('input', { type: 'text', size: 10, 'aria-label': `output at line ${r.line}`, spellcheck: 'false', autocomplete: 'off' }); rowIn.__out = inp; tr.append(h('td', null, inp)); }
        inputs.push({ r, rowIn });
        t.append(tr);
      });
      holder.replaceChildren(h('div', { class: 'tt-wrap tt-edit' }, t));
      checkBtn.disabled = false;
    });

    checkBtn.addEventListener('click', () => {
      if (!PP.auth.gate('check your table')) return;
      let wrong = 0;
      inputs.forEach(({ r, rowIn }) => {
        table.cols.forEach((c) => {
          const want = r.chg[c] ? clean(r.vals[c]) : '';
          const got = clean(rowIn[c].value);
          const ok = want === got;
          rowIn[c].className = ok ? (want ? 'ok' : '') : 'bad';
          if (!ok) wrong++;
        });
        if (rowIn.__out) {
          const ok = clean(rowIn.__out.value) === clean(r.out);
          rowIn.__out.className = ok ? (r.out ? 'ok' : '') : 'bad';
          if (!ok) wrong++;
        }
      });
      PP.sync.record({ id, kind: 'tracetable', passed: !wrong });
      if (!wrong) { shell.setDone(); result.replaceChildren(ui.fb('ok', '<strong>Table complete.</strong> ' + ui.rich(b.why || ''))); }
      else { result.replaceChildren(ui.fb('bad', `<strong>${wrong} cell${wrong === 1 ? ' is' : 's are'} wrong or misplaced</strong> (red). Remember: write a value only on the row where it changes, and strings can be written with or without quotes.`)); showBtn.hidden = false; }
    });
    showBtn.addEventListener('click', () => {
      inputs.forEach(({ r, rowIn }) => {
        table.cols.forEach((c) => { rowIn[c].value = r.chg[c] ? clean(r.vals[c]) : ''; rowIn[c].className = ''; });
        if (rowIn.__out) { rowIn.__out.value = r.out; rowIn.__out.className = ''; }
      });
    });
    return shell.el;
  };
})();

/* Visual explainers, part 2: range(), slicing, list operations, 2D grid, nested loops. */
(function () {
  const { h } = PP;
  const ui = PP.ui;
  const A = PP.anim;
  const V = PP.viz;

  const inp = (v, w, extra) => h('input', Object.assign({ type: 'text', value: v, size: w || 14, class: 'vin', spellcheck: 'false', autocomplete: 'off' }, extra || {}));
  const field = (label, el) => h('label', { class: 'vf' }, h('span', null, label), el);
  const applyBtn = (fn, label) => h('button', { class: 'btn primary', onclick: fn }, label || 'Animate');
  const onEnter = (el, fn) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); fn(); } });
  const q = (s) => JSON.stringify(s);
  const isInt = (s) => /^[+-]?\d+$/.test(s);

  /* =====================================================================
     range()
     ===================================================================== */
  V.range = function (b) {
    const a = inp(b.start !== undefined ? b.start : '0', 5, { 'aria-label': 'start' });
    const z = inp(b.stop !== undefined ? b.stop : '6', 5, { 'aria-label': 'stop' });
    const s = inp(b.step !== undefined ? b.step : '1', 5, { 'aria-label': 'step' });
    let stage;
    const run = () => stage.rebuild();
    const set = (x, y, w) => { a.value = x; z.value = y; s.value = w; run(); };
    stage = new PP.Stage({
      title: b.title || 'range(): watch the loop variable hop', caption: b.caption, output: true, quiz: false, aria: 'Animated range',
      legend: [['cmp', 'Value used'], ['out', 'Stop (never used)']],
      controls: [field('start', a), field('stop', z), field('step', s)],
      presets: [
        { label: 'range(5)', apply: () => set('', '5', '') },
        { label: 'range(2, 7)', apply: () => set('2', '7', '') },
        { label: 'range(0, 10, 3)', apply: () => set('0', '10', '3') },
        { label: 'Count down', apply: () => set('5', '0', '-1') },
        { label: 'Empty: start ≥ stop', apply: () => set('5', '5', '') },
        { label: 'Wrong direction', apply: () => set('5', '0', '') },
        { label: 'Negatives', apply: () => set('-4', '3', '2') },
        { label: 'step 0 (error)', apply: () => set('0', '5', '0') },
        { label: 'Decimal (error)', apply: () => set('0', '2.5', '') },
      ],
      edge: '* **`range(n)`** starts at 0 and stops *before* n, so it makes exactly n numbers.\n* **The stop value is never used.** `range(1, 6)` makes 1 to 5.\n* **Empty ranges:** if the step can never reach the stop (`range(5, 0)` goes the wrong way) the loop body runs **zero times**. No error!\n* **Counting down** needs a **negative step**, and then the start must be **bigger** than the stop.\n* **step 0** is an error (it would loop forever). **Decimals** are not allowed: `range(0, 2.5)` is a `TypeError`.\n* In Edexcel pseudocode `FOR i FROM 0 TO 9` **includes** 9, so it is `range(0, 10)` in Python.',
      build: (W) => {
        const A0 = a.value.trim(), Z0 = z.value.trim(), S0 = s.value.trim();
        if (Z0 === '') return { error: 'range() needs at least one number: the **stop** value. `range()` with nothing inside is a `TypeError`.' };
        for (const [nm, v] of [['start', A0], ['stop', Z0], ['step', S0]]) {
          if (v !== '' && !isInt(v)) return { error: `**TypeError:** \`range()\` only accepts whole numbers, but ${nm} is <code>${PP.esc(v)}</code>. For a decimal step, loop over whole numbers and multiply, e.g. <code>i * 0.5</code>.` };
        }
        const start = A0 === '' ? 0 : +A0, stop = +Z0, step = S0 === '' ? 1 : +S0;
        if (step === 0) return { error: '**ValueError:** `range()` arg 3 must not be zero. A step of 0 would never move, so Python refuses.' };
        if (Math.abs(stop) > 100000 || Math.abs(start) > 100000) return { error: 'Please use numbers between -100000 and 100000.' };
        const args = [A0 === '' && S0 === '' ? null : (A0 === '' ? '0' : A0), Z0, S0 === '' ? null : S0].filter((x) => x !== null).join(', ');
        const head = `for i in range(${args}):`;
        const vals = [];
        for (let v = start; step > 0 ? v < stop : v > stop; v += step) { vals.push(v); if (vals.length > 200) break; }
        const CAP = 14, shown = vals.slice(0, CAP), trunc = vals.length > CAP;
        const code = [head, '    print(i)'];
        const nextV = (shown.length ? shown[shown.length - 1] : start) + (shown.length ? step : 0);
        const pts = shown.concat([start, stop, nextV]);
        let lo = Math.min(...pts), hi = Math.max(...pts);
        if (hi - lo < 4) { hi += 2; lo -= 1; }
        const pad = 34, span = hi - lo, ax = W - pad * 2;
        const X = (v) => pad + ((v - lo) / span) * ax;
        const tickEvery = span <= 26 ? 1 : (span <= 60 ? 2 : (span <= 130 ? 5 : 10));
        const axisY = 92, H = 214;
        const base = () => {
          const marks = [{ id: 'axis', k: 'line', x: pad - 12, y: axisY, w: ax + 24, h: 2 }];
          for (let v = Math.ceil(lo / tickEvery) * tickEvery; v <= hi; v += tickEvery) {
            marks.push({ id: 'tk' + v, k: 'tick', x: X(v), y: axisY - 5, w: 2, h: 11 });
            marks.push({ id: 'tl' + v, k: 'lbl', x: X(v) - 16, y: axisY + 9, w: 32, h: 16, t: String(v) });
          }
          marks.push({ id: 'fs', k: 'flag', x: Math.max(2, Math.min(W - 62, X(start) - 30)), y: axisY - 48, w: 60, h: 36, html: '<span>start</span><span>▼</span>' });
          marks.push({ id: 'fe', k: 'flag', x: Math.max(2, Math.min(W - 98, X(stop) - 48)), y: axisY - 48, w: 96, h: 36, html: '<span>' + (W < 420 ? 'stop (excluded)' : 'stop (never used)') + '</span><span>▼</span>', cls: 'stop' });
          return marks;
        };
        const F = [];
        const chipW = Math.max(24, Math.min(40, (W - 24) / Math.max(shown.length, 1)));
        const chip = (k, from) => ({ id: 'v' + k, k: 'tok', x: 12 + k * chipW, y: 160, w: chipW - 4, h: 30, t: String(shown[k]), cls: 'pick', from });
        const out = (n) => shown.slice(0, n).join('\n');
        F.push({ h: H, marks: base(), items: [], line: 1, vars: [['start', start], ['stop', stop], ['step', step]], text: vals.length ? `<code>${head}</code> will start at <strong>${start}</strong>, add <strong>${step}</strong> each time, and stop <strong>before</strong> ${stop}.` : `<code>${head}</code> makes <strong>no numbers at all</strong>: starting at ${start} and adding ${step} moves ${step > 0 ? 'up' : 'down'}, but ${stop} is ${step > 0 ? 'already at or below' : 'already at or above'} the start. The loop body runs <strong>0 times</strong> (not an error).`, out: '' });
        shown.forEach((v, k) => {
          const tokX = X(v) - 16;
          F.push({
            h: H, marks: base(), items: [{ id: 'i', k: 'tok', x: tokX, y: axisY - 40, w: 32, h: 32, t: String(v), cls: 'cmp s-big' }].concat(shown.slice(0, k).map((_, m) => chip(m))), line: 1, vars: [['i', v], ['repeats so far', k]], out: out(k),
            text: `<strong>Repeat ${k + 1}:</strong> <code>i = ${v}</code>. ${step > 0 ? `${v} < ${stop}` : `${v} > ${stop}`} is True, so run the loop body.`
          });
          F.push({ h: H, marks: base(), items: [{ id: 'i', k: 'tok', x: tokX, y: axisY - 40, w: 32, h: 32, t: String(v), cls: 'cmp s-big' }].concat(shown.slice(0, k).map((_, m) => chip(m)), [chip(k, { x: tokX, y: axisY - 40 })]), line: 2, vars: [['i', v], ['repeats so far', k + 1]], out: out(k + 1), text: `<code>print(i)</code> shows <strong>${v}</strong>.` });
        });
        if (trunc) F.push({ h: H, marks: base(), items: shown.map((_, m) => chip(m)), line: 1, vars: [['repeats', vals.length]], out: out(shown.length) + '\n…', text: `…and so on. In total the loop runs <strong>${vals.length}</strong> times. (Only the first ${CAP} are drawn.)` });
        else if (vals.length) {
          const nx = nextV;
          F.push({
            h: H, marks: base(), items: [{ id: 'i', k: 'tok', x: X(nx) - 16, y: axisY - 40, w: 32, h: 32, t: String(nx), cls: 'out' }].concat(shown.map((_, m) => chip(m))), line: 1, vars: [['i (next)', nx], ['repeats', vals.length]], out: out(shown.length),
            text: `The next value would be <strong>${nx}</strong>, but ${step > 0 ? `${nx} < ${stop}` : `${nx} > ${stop}`} is <strong>False</strong>, so the loop stops. The stop value (${stop}) is never used. The body ran <strong>${vals.length}</strong> time${vals.length === 1 ? '' : 's'}.`, hold: 2
          });
        }
        return { frames: F, code };
      },
    });
    [a, z, s].forEach((e) => onEnter(e, run));
    return stage.el;
  };

  /* =====================================================================
     String slicing
     ===================================================================== */
  function pyIndices(len, A0, Z0, S0) {
    const step = S0 === null ? 1 : S0;
    const lower = step > 0 ? 0 : -1, upper = step > 0 ? len : len - 1;
    const notes = [];
    const adj = (v, dflt, name) => {
      if (v === null) { notes.push(`<code>${name}</code> left blank → default <strong>${dflt}</strong>`); return dflt; }
      let r = v;
      if (v < 0) { r = v + len; if (r < lower) { notes.push(`<code>${name} = ${v}</code> counts from the end: ${len} + (${v}) = ${v + len}, which is before the start, so it is clamped to <strong>${lower}</strong>`); r = lower; } else notes.push(`<code>${name} = ${v}</code> counts from the end: ${len} + (${v}) = <strong>${r}</strong>`); }
      else if (v > upper) { r = upper; notes.push(`<code>${name} = ${v}</code> is past the end, so Python clamps it to <strong>${upper}</strong> (no error)`); }
      return r;
    };
    const start = adj(A0, step > 0 ? lower : upper, 'start');
    const stop = adj(Z0, step > 0 ? upper : lower, 'stop');
    const idx = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) idx.push(i);
    return { start, stop, step, idx, notes };
  }

  V.slice = function (b) {
    const text = inp(b.text || 'Computing', 14, { maxlength: 16, 'aria-label': 'Text' });
    const a = inp(b.start !== undefined ? b.start : '', 4, { 'aria-label': 'start' });
    const z = inp(b.stop !== undefined ? b.stop : '', 4, { 'aria-label': 'stop' });
    const s = inp(b.step !== undefined ? b.step : '', 4, { 'aria-label': 'step' });
    let stage;
    const run = () => stage.rebuild();
    const set = (x, y, w, t) => { a.value = x; z.value = y; s.value = w; if (t) text.value = t; run(); };
    stage = new PP.Stage({
      title: b.title || 'Slicing: text[start:stop:step]', caption: b.caption, output: false, aria: 'Animated string slice',
      legend: [['cmp', 'Taken'], ['out', 'Skipped']],
      controls: [field('text', text), field('start', a), field('stop', z), field('step', s)],
      presets: [
        { label: '[:3]', apply: () => set('', '3', '') }, { label: '[2:]', apply: () => set('2', '', '') },
        { label: '[2:6]', apply: () => set('2', '6', '') }, { label: '[-3:]', apply: () => set('-3', '', '') },
        { label: '[::2]', apply: () => set('', '', '2') }, { label: '[::-1] reverse', apply: () => set('', '', '-1') },
        { label: '[-1:-5:-1]', apply: () => set('-1', '-5', '-1') }, { label: '[3:100] past the end', apply: () => set('3', '100', '') },
        { label: '[5:2] empty', apply: () => set('5', '2', '') }, { label: '[::0] error', apply: () => set('', '', '0') },
      ],
      edge: '* **The stop is not included.** `text[2:5]` takes indexes 2, 3, 4.\n* **Blank means default:** `[:3]` starts at the front, `[3:]` runs to the end, `[:]` copies everything.\n* **Negative numbers count from the end:** `-1` is the last character.\n* **Too big is fine for slices:** `text[3:100]` stops at the end. (A single index like `text[100]` is an `IndexError`.)\n* **Wrong direction gives `""`:** `text[5:2]` is an empty string, not an error.\n* **Negative step walks backwards** and then start must be *bigger* than stop. `[::-1]` reverses.\n* **step 0** is a `ValueError`.',
      build: (W) => {
        const t = text.value;
        if (t.length === 0) return { error: '**Empty string.** `len("") = 0`, so every slice of it is `""` and no error is raised. Type some text to see slicing.' };
        const parts = [['start', a.value.trim()], ['stop', z.value.trim()], ['step', s.value.trim()]];
        for (const [nm, v] of parts) if (v !== '' && !isInt(v)) return { error: `**TypeError:** slice indices must be whole numbers, but ${nm} is <code>${PP.esc(v)}</code>.` };
        const num = (v) => (v === '' ? null : +v);
        const A0 = num(parts[0][1]), Z0 = num(parts[1][1]), S0 = num(parts[2][1]);
        if (S0 === 0) return { error: '**ValueError:** slice step cannot be zero. A step of 0 would never move along the string.' };
        const n = t.length;
        const r = pyIndices(n, A0, Z0, S0);
        const sw = A.slot(n, W, 46, 22), x0 = A.x0(n, W, sw), H = 258;
        const cy = 66;
        const code = [`text = ${q(t)}`, `result = text[${A0 === null ? '' : A0}:${Z0 === null ? '' : Z0}${S0 === null ? '' : ':' + S0}]`, 'print(result)'];
        const taken = new Set(r.idx);
        const marks = (extra) => {
          const m = [];
          for (let i = 0; i < n; i++) {
            m.push({ id: 'pi' + i, k: 'lbl', x: x0 + i * sw, y: cy + 46, w: sw, h: 16, t: String(i) });
            m.push({ id: 'ni' + i, k: 'lbl', x: x0 + i * sw, y: cy - 22, w: sw, h: 16, t: String(i - n) });
          }
          m.push({ id: 'lp', k: 'lbl strong', x: 0, y: cy + 46, w: Math.max(10, x0 - 2), h: 16, t: '' });
          return m.concat(extra || []);
        };
        const cells = (cls) => [...t].map((ch, i) => ({ id: 'c' + i, k: 'box', x: x0 + i * sw + 1, y: cy, w: sw - 2, h: 42, t: ch === ' ' ? '␣' : ch, cls: cls ? cls(i) : '' }));
        const flagX = (i) => Math.min(W - 40, Math.max(40, x0 + i * sw + sw / 2));
        const F = [];
        const resSoFar = (m) => r.idx.slice(0, m).map((i) => t[i]).join('');
        const res = (m, from) => r.idx.slice(0, m).map((i, k) => ({ id: 'r' + k, k: 'tok', x: 12 + k * Math.min(30, (W - 24) / Math.max(r.idx.length, 1)), y: 196, w: Math.min(28, (W - 24) / Math.max(r.idx.length, 1) - 2), h: 34, t: t[i] === ' ' ? '␣' : t[i], cls: 'pick', from: k === m - 1 && from ? from : undefined }));
        F.push({ h: H, items: cells(), marks: marks(), line: 2, vars: [['len(text)', n]], text: `<code>text[${A0 === null ? '' : A0}:${Z0 === null ? '' : Z0}${S0 === null ? '' : ':' + S0}]</code> on a string of length <strong>${n}</strong>. Positive numbers (blue) count from the front, negative numbers (grey) from the back.` });
        F.push({
          h: H, items: cells(), marks: marks([
            { id: 'fs', k: 'flag', x: flagX(Math.max(-1, Math.min(n, r.start))) - 30, y: 2, w: 60, h: 34, html: '<span>start</span><span>▼</span>' },
            { id: 'fe', k: 'flag', x: flagX(Math.max(-1, Math.min(n, r.stop))) - 44, y: 2, w: 88, h: 34, html: '<span>stop (excluded)</span><span>▼</span>', cls: 'stop' }]), line: 2,
          vars: [['start', r.start], ['stop', r.stop], ['step', r.step]],
          text: `<strong>Working out the positions:</strong><br>${r.notes.concat([`<code>step</code> ${S0 === null ? 'left blank → default <strong>1</strong>' : `= <strong>${S0}</strong> (${S0 > 0 ? 'walk forwards' : 'walk backwards'})`}`]).join('<br>')}`, hold: 1.6
        });
        r.idx.forEach((i, k) => {
          F.push({
            h: H, items: cells((j) => (j === i ? 'cmp' : (taken.has(j) && r.idx.indexOf(j) < k ? 'pick' : ''))), marks: marks([
              { id: 'fs', k: 'flag', x: flagX(Math.max(-1, Math.min(n, r.start))) - 30, y: 2, w: 60, h: 34, html: '<span>start</span><span>▼</span>', cls: 'ghost' },
              { id: 'fe', k: 'flag', x: flagX(Math.max(-1, Math.min(n, r.stop))) - 44, y: 2, w: 88, h: 34, html: '<span>stop (excluded)</span><span>▼</span>', cls: 'stop ghost' },
              { id: 'pt', k: 'ptr', x: x0 + i * sw, y: cy + 62, w: sw, h: 30, html: '<span>▲</span><b>i</b>' }]), line: 2,
            vars: [['i', i], ['result so far', q(resSoFar(k + 1))]], text: `Take <code>text[${i}]</code> = <strong>${PP.esc(t[i])}</strong>${k < r.idx.length - 1 ? `, then jump ${Math.abs(r.step)} place${Math.abs(r.step) === 1 ? '' : 's'} ${r.step > 0 ? 'right' : 'left'}.` : '.'}`
          });
          F[F.length - 1].items = F[F.length - 1].items.concat(res(k + 1, { x: x0 + i * sw + 1, y: cy }));
        });
        const final = r.idx.map((i) => t[i]).join('');
        F.push({
          h: H, items: cells((j) => (taken.has(j) ? 'pick' : 'out')).concat(res(r.idx.length)), marks: marks(), line: 3, vars: [['result', q(final)], ['len(result)', final.length]], hold: 2,
          text: r.idx.length ? `<code>result = ${q(final)}</code> (${final.length} character${final.length === 1 ? '' : 's'}). The original string is unchanged: slicing makes a <strong>new</strong> string.` : `<code>result = ""</code>: <strong>nothing</strong> was taken. ${r.step > 0 ? 'With a positive step, start must be before stop.' : 'With a negative step, start must be after stop.'} Python does <strong>not</strong> raise an error for an empty slice.`
        });
        return { frames: F, code };
      },
    });
    [text, a, z, s].forEach((e) => onEnter(e, run));
    return stage.el;
  };

  /* =====================================================================
     List operations (interactive: every click animates)
     ===================================================================== */
  V.list = function (b) {
    let seq = 0;
    const mkTok = (v) => ({ id: 'L' + (seq++), v });
    const start0 = (b.data || [10, 20, 30, 40]);
    let toks = start0.map(mkTok);
    let hist = [`nums = [${start0.join(', ')}]`];
    let pending = null;            // {pre, mid, post, texts}
    const val = inp('99', 5, { 'aria-label': 'Value' });
    const idx = inp('1', 4, { 'aria-label': 'Index' });
    const LIM = 12;
    let stage;

    function layout(tokens, W, o) {
      o = o || {};
      const sw = Math.min(58, (W - 24) / Math.max(tokens.length + (o.extra || 0), 8)), x0 = 12, cy = 62;
      const slotOf = o.slotOf || ((t, s) => s);
      const items = tokens.map((t, s) => ({ id: t.id, k: 'box', x: x0 + slotOf(t, s) * sw + 1, y: cy + ((o.lift && o.lift.has(t.id)) ? -22 : 0), w: sw - 2, h: 44, t: String(t.v), cls: (o.cls && o.cls[t.id]) || '', op: o.fade && o.fade.has(t.id) ? 0.35 : 1, from: o.from && o.from[t.id] }));
      const marks = [];
      const count = (o.slots || tokens.length);
      for (let s = 0; s < count; s++) {
        marks.push({ id: 'ix' + s, k: 'lbl', x: x0 + s * sw, y: cy + 50, w: sw, h: 16, t: String(s) });
        marks.push({ id: 'nx' + s, k: 'lbl', x: x0 + s * sw, y: cy - 22, w: sw, h: 16, t: String(s - count) });
      }
      marks.push({ id: 'len', k: 'lbl strong', x: 12, y: cy + 80, w: 140, h: 18, t: `len(nums) = ${tokens.length}` });
      (o.marks || []).forEach((m) => marks.push(m(x0, sw, cy)));
      return { items, marks, sw, x0, cy };
    }
    const frame = (W, tokens, o, extra) => { const L = layout(tokens, W, o); return Object.assign({ h: 190, items: L.items, marks: L.marks, vars: [['len(nums)', tokens.length]] }, extra); };
    const snapVars = (tokens) => [['nums', '[' + tokens.map((t) => t.v).join(', ') + ']'], ['len(nums)', tokens.length]];
    const plain = (tokens) => '[' + tokens.map((t) => t.v).join(', ') + ']';
    const errMark = (i, n, label) => (x0, sw, cy) => ({ id: 'bad', k: 'ptr', x: x0 + Math.min(i, n + 1) * sw, y: cy + 66, w: sw, h: 30, html: `<span>▲</span><b>${label}</b>`, cls: 'bad' });

    stage = new PP.Stage({
      title: b.title || 'List operations: press a button and watch the indexes', liveInputs: false, autoplayOnChange: true, caption: b.caption, aria: 'Animated list operations',
      controls: [field('value x', val), field('index i', idx)],
      legend: [['cmp', 'Being looked at'], ['swp', 'Changing'], ['done', 'Found']],
      code: () => hist,
      edge: '* **`append`** adds to the end; **`insert`** shifts everything after the index one place right.\n* **`pop(i)`** returns the item and shifts everything after it left. **`pop()`** with no index removes the last item.\n* **`remove(x)`** deletes the **first** item equal to x. If there is no such item: `ValueError`.\n* **Index out of range** (e.g. `pop(9)` on 4 items): `IndexError`. The valid indexes are `0` to `len - 1`, or `-1` to `-len`.\n* **Negative indexes** count from the end: `-1` is the last item.\n* **`insert` is forgiving:** an index past the end just appends, a very negative index inserts at the front.\n* **Empty list:** `pop()` on `[]` is an `IndexError`.\n* **`sort()` changes the list and returns `None`.** Use `sorted(nums)` for a new list.',
      build: (W) => {
        if (!pending) {
          const f = frame(W, toks, { cls: {} }, { line: hist.length, text: `The list <code>nums</code> holds <strong>${toks.length}</strong> item${toks.length === 1 ? '' : 's'}. Pick an operation below and watch what happens to the items and their indexes.`, vars: snapVars(toks) });
          return { frames: [f], code: hist };
        }
        const p = pending;
        return { frames: p.make(W), code: p.code };
      },
    });

    function parseV() { const t = val.value.trim(); if (t === '' || !/^-?\d+(\.\d+)?$/.test(t)) return null; return +t; }
    function parseI() { const t = idx.value.trim(); if (t === '') return { blank: true }; if (!/^-?\d+$/.test(t)) return null; return +t; }
    function say(msg) { pending = { code: hist, make: (W) => [frame(W, toks, {}, { line: hist.length, text: msg, vars: snapVars(toks) })] }; stage.rebuild(); }
    function commit(stmt, make) {
      const before = toks.slice();
      hist = hist.concat([stmt]).slice(-9);
      pending = { code: hist, make: (W) => make(W, before) };
      stage.rebuild();
    }

    const ops = [
      ['append(x)', () => {
        const x = parseV(); if (x === null) return say('Type a <strong>number</strong> in the <em>value x</em> box first.');
        if (toks.length >= LIM) return say(`To keep the picture readable this explainer limits lists to ${LIM} items.`);
        const t = mkTok(x); const pre = toks.slice(); toks = toks.concat([t]);
        commit(`nums.append(${x})`, (W) => [
          frame(W, pre, {}, { line: hist.length, text: `<code>nums.append(${x})</code> adds ${x} at the <strong>end</strong>.`, vars: snapVars(pre) }),
          frame(W, toks, { cls: { [t.id]: 'swp' }, from: { [t.id]: { x: 12 + pre.length * Math.min(58, (W - 24) / Math.max(toks.length, 8)), y: 0, op: 0 } } }, { line: hist.length, text: `${x} now sits at index <strong>${pre.length}</strong>, the old length. Nothing else moved.`, vars: snapVars(toks) })]);
      }],
      ['insert(i, x)', () => {
        const x = parseV(), iv = parseI(); if (x === null) return say('Type a <strong>number</strong> in the <em>value x</em> box first.');
        if (iv === null || iv.blank) return say('Type a whole-number <strong>index i</strong> first.');
        if (toks.length >= LIM) return say(`To keep the picture readable this explainer limits lists to ${LIM} items.`);
        const n = toks.length; let pos = iv < 0 ? Math.max(0, n + iv) : Math.min(iv, n);
        const t = mkTok(x); const pre = toks.slice(); toks = pre.slice(0, pos).concat([t], pre.slice(pos));
        const why = iv > n ? ` (index ${iv} is past the end, so it is added at the end)` : (iv < -n ? ` (index ${iv} is before the front, so it goes at the front)` : '');
        commit(`nums.insert(${iv}, ${x})`, (W) => [
          frame(W, pre, {}, { line: hist.length, text: `<code>nums.insert(${iv}, ${x})</code> puts ${x} at index <strong>${pos}</strong>${why}.`, vars: snapVars(pre) }),
          frame(W, pre, { slotOf: (tk, s) => (s >= pos ? s + 1 : s), slots: pre.length + 1, cls: Object.fromEntries(pre.slice(pos).map((tk) => [tk.id, 'swp'])) }, { line: hist.length, text: `Everything from index ${pos} onwards <strong>shifts one place right</strong> to make a gap.`, vars: snapVars(pre) }),
          frame(W, toks, { cls: { [t.id]: 'found' }, from: { [t.id]: { x: 12 + pos * Math.min(58, (W - 24) / Math.max(toks.length, 8)), y: -20, op: 0 } } }, { line: hist.length, text: `${x} drops into the gap. The items after it now have indexes one higher.`, vars: snapVars(toks) })]);
      }],
      ['pop(i)', () => removal('pop')],
      ['del nums[i]', () => removal('del')],
      ['remove(x)', () => {
        const x = parseV(); if (x === null) return say('Type a <strong>number</strong> in the <em>value x</em> box first.');
        const pre = toks.slice(), k = pre.findIndex((t) => t.v === x);
        if (k < 0) {
          commit(`nums.remove(${x})  # ValueError`, (W) => pre.map((t, s) => frame(W, pre, { cls: { [t.id]: 'cmp' } }, { line: hist.length, text: `Looking for ${x}: is <code>nums[${s}] == ${x}</code>? ${t.v} - no.`, vars: snapVars(pre) }))
            .concat([frame(W, pre, { cls: {}, marks: [errMark(pre.length, pre.length, 'none')] }, { line: hist.length, text: `<strong>ValueError:</strong> <code>list.remove(x): x not in list</code>. The list has no ${x}, and <code>remove</code> does not ignore that. Use <code>if x in nums:</code> first.`, vars: snapVars(pre) })]));
          return;
        }
        toks = pre.slice(0, k).concat(pre.slice(k + 1));
        const gone = pre[k], dup = pre.filter((t) => t.v === x).length > 1;
        commit(`nums.remove(${x})`, (W) => pre.slice(0, k + 1).map((t, s) => frame(W, pre, { cls: { [t.id]: s === k ? 'found' : 'cmp' } }, { line: hist.length, text: s === k ? `<code>nums[${s}] == ${x}</code> - <strong>found</strong> the first ${x}.` : `Is <code>nums[${s}] == ${x}</code>? ${t.v} - no, keep looking.`, vars: snapVars(pre) }))
          .concat([
            frame(W, pre, { cls: { [gone.id]: 'swp' }, lift: new Set([gone.id]), fade: new Set([gone.id]) }, { line: hist.length, text: `That item is taken out.${dup ? ' <strong>Only the first</strong> match is removed; later copies stay.' : ''}`, vars: snapVars(pre) }),
            frame(W, toks, {}, { line: hist.length, text: `The items after it shift left to close the gap. New length: ${toks.length}.`, vars: snapVars(toks) })]));
      }],
      ['nums[i] = x', () => {
        const x = parseV(), iv = parseI(); if (x === null) return say('Type a <strong>number</strong> in the <em>value x</em> box first.');
        if (iv === null || iv.blank) return say('Type a whole-number <strong>index i</strong> first.');
        const n = toks.length;
        if (iv >= n || iv < -n) { const pre = toks.slice(); commit(`nums[${iv}] = ${x}  # IndexError`, (W) => [frame(W, pre, { marks: [errMark(iv < 0 ? 0 : iv, n, `[${iv}]`)] }, { line: hist.length, text: `<strong>IndexError:</strong> <code>list assignment index out of range</code>. The list has ${n} item${n === 1 ? '' : 's'}, so valid indexes are 0 to ${n - 1} (or -1 to -${n}). <strong>Assignment can never create a new slot</strong>: use <code>append</code>.`, vars: snapVars(pre) })]); return; }
        const pos = iv < 0 ? n + iv : iv, old = toks[pos], nt = { id: old.id, v: x };
        const pre = toks.slice(); toks = toks.slice(); toks[pos] = nt;
        commit(`nums[${iv}] = ${x}`, (W) => [
          frame(W, pre, { cls: { [old.id]: 'cmp' } }, { line: hist.length, text: `<code>nums[${iv}]</code> is index <strong>${pos}</strong>, which currently holds ${old.v}.`, vars: snapVars(pre) }),
          frame(W, toks, { cls: { [old.id]: 'swp' } }, { line: hist.length, text: `The value at index ${pos} is <strong>replaced</strong> by ${x}. The list keeps the same length.`, vars: snapVars(toks) })]);
      }],
      ['sort()', () => {
        const pre = toks.slice(); const sorted = pre.slice().sort((p, q2) => p.v - q2.v); toks = sorted;
        commit('nums.sort()', (W) => [
          frame(W, pre, {}, { line: hist.length, text: '<code>nums.sort()</code> puts the items in ascending order, <strong>in place</strong>.', vars: snapVars(pre) }),
          frame(W, sorted, { cls: Object.fromEntries(sorted.map((t) => [t.id, 'done'])) }, { line: hist.length, text: `Sorted: ${plain(sorted)}. The method <strong>changes the list itself</strong> and returns <code>None</code> - so <code>nums = nums.sort()</code> would destroy your list.`, vars: snapVars(sorted) })]);
      }],
      ['reverse()', () => {
        const pre = toks.slice(); toks = pre.slice().reverse();
        commit('nums.reverse()', (W) => [
          frame(W, pre, {}, { line: hist.length, text: '<code>nums.reverse()</code> flips the order of the items in place.', vars: snapVars(pre) }),
          frame(W, toks, { cls: Object.fromEntries(toks.map((t) => [t.id, 'swp'])) }, { line: hist.length, text: `Reversed: ${plain(toks)}. (It does not sort: it just flips the order.)`, vars: snapVars(toks) })]);
      }],
      ['index(x)', () => scan(false)],
      ['x in nums', () => scan(true)],
    ];

    function removal(kind) {
      const iv = parseI(); const n = toks.length;
      const stmtBase = kind === 'pop' ? 'nums.pop' : 'del nums';
      if (iv === null) return say('Type a whole-number <strong>index i</strong> first.');
      if (n === 0) { commit(kind === 'pop' ? 'nums.pop()  # IndexError' : `del nums[${iv.blank ? 0 : iv}]  # IndexError`, (W) => [frame(W, [], { marks: [errMark(0, 0, 'none')] }, { line: hist.length, text: `<strong>IndexError:</strong> ${kind === 'pop' ? '<code>pop from empty list</code>' : '<code>list assignment index out of range</code>'}. There is nothing to remove from an empty list. Check <code>if nums:</code> first.`, vars: snapVars([]) })]); return; }
      const use = iv.blank ? -1 : iv;
      if (use >= n || use < -n) { commit(`${stmtBase}${kind === 'pop' ? `(${use})` : `[${use}]`}  # IndexError`, (W) => [frame(W, toks, { marks: [errMark(use < 0 ? 0 : use, n, `[${use}]`)] }, { line: hist.length, text: `<strong>IndexError:</strong> <code>${kind === 'pop' ? 'pop index out of range' : 'list assignment index out of range'}</code>. With ${n} item${n === 1 ? '' : 's'} the valid indexes are 0 to ${n - 1} (or -1 to -${n}).`, vars: snapVars(toks) })]); return; }
      const pos = use < 0 ? n + use : use, pre = toks.slice(), gone = pre[pos];
      toks = pre.slice(0, pos).concat(pre.slice(pos + 1));
      const stmt = kind === 'pop' ? (iv.blank ? 'nums.pop()' : `nums.pop(${use})`) : `del nums[${use}]`;
      commit(stmt, (W) => [
        frame(W, pre, { cls: { [gone.id]: 'cmp' } }, { line: hist.length, text: `<code>${stmt}</code> targets index <strong>${pos}</strong>${use < 0 ? ` (negative ${use} counts from the end)` : ''}, which holds ${gone.v}.`, vars: snapVars(pre) }),
        frame(W, pre, { cls: { [gone.id]: 'swp' }, lift: new Set([gone.id]), fade: new Set([gone.id]) }, { line: hist.length, text: kind === 'pop' ? `The item is lifted out. <code>pop</code> <strong>returns</strong> ${gone.v} so you can use it.` : `The item is deleted. (<code>del</code> does not give the value back.)`, vars: snapVars(pre) }),
        frame(W, toks, {}, { line: hist.length, text: `Everything after it shifts <strong>left</strong> to close the gap. New length: ${toks.length}.`, vars: snapVars(toks) })]);
    }
    function scan(isIn) {
      const x = parseV(); if (x === null) return say('Type a <strong>number</strong> in the <em>value x</em> box first.');
      const pre = toks.slice(), k = pre.findIndex((t) => t.v === x);
      const stmt = isIn ? `${x} in nums` : `nums.index(${x})`;
      const upto = k < 0 ? pre.length : k + 1;
      commit(isIn || k >= 0 ? stmt : stmt + '  # ValueError', (W) => {
        const fr = pre.slice(0, upto).map((t, s) => frame(W, pre, { cls: { [t.id]: s === k ? 'found' : 'cmp' } }, { line: hist.length, text: s === k ? `<code>nums[${s}] == ${x}</code> - match!` : `Is <code>nums[${s}] == ${x}</code>? ${t.v} - no.`, vars: snapVars(pre) }));
        const last = k >= 0
          ? { text: isIn ? `<code>${stmt}</code> is <strong>True</strong>.` : `<code>${stmt}</code> returns <strong>${k}</strong>, the index of the <strong>first</strong> match.` }
          : { text: isIn ? `Reached the end with no match: <code>${stmt}</code> is <strong>False</strong>.` : `<strong>ValueError:</strong> <code>${x} is not in list</code>. <code>index</code> raises an error when the value is missing; <code>in</code> just gives False.` };
        fr.push(frame(W, pre, { cls: k >= 0 ? { [pre[k].id]: 'found' } : {}, marks: k < 0 && !isIn ? [errMark(pre.length, pre.length, 'none')] : [] }, { line: hist.length, text: last.text, vars: snapVars(pre) }));
        return fr;
      });
    }
    const bar = h('div', { class: 'an-ops' }, ops.map(([label, fn]) => h('button', { class: 'btn small', onclick: fn }, label)),
      h('button', { class: 'btn small ghost', onclick: () => { toks = start0.map(mkTok); hist = [`nums = [${start0.join(', ')}]`]; pending = null; stage.rebuild({ autoplay: false }); } }, 'Reset'),
      h('button', { class: 'btn small ghost', onclick: () => { toks = []; hist = ['nums = []']; pending = null; stage.rebuild({ autoplay: false }); } }, 'Empty it'));
    const el = stage.el;
    const ctl = el.querySelector('.an-controls');
    ctl.append(h('div', { class: 'an-ops-wrap' }, h('span', { class: 'an-tl' }, 'Run'), bar));
    return el;
  };

  /* =====================================================================
     2D grid
     ===================================================================== */
  V.grid = function (b) {
    const dflt = b.data || [[3, 8, 1, 6], [4, 5, 9, 2], [7, 0, 2, 5]];
    const ta = h('textarea', { class: 'vin an-ta', rows: 3, spellcheck: 'false', 'aria-label': 'Grid values, one row per line' });
    ta.value = dflt.map((r) => r.join(', ')).join('\n');
    const mode = h('select', { class: 'sel', 'aria-label': 'What to do' },
      [['row', 'Visit every cell, row by row'], ['col', 'Visit every cell, column by column'], ['rowsum', 'Row totals'], ['colsum', 'Column totals'], ['max', 'Find the biggest value'], ['diag', 'Main diagonal'], ['access', 'Access one cell: grid[r][c]']].map(([v, l]) => h('option', { value: v }, l)));
    const rI = inp('1', 3, { 'aria-label': 'row index' }), cI = inp('2', 3, { 'aria-label': 'column index' });
    const accessBox = h('span', { class: 'vf vf-inline' }, field('r', rI), field('c', cI));
    let stage;
    const sync = () => { accessBox.hidden = mode.value !== 'access'; };
    const run = () => { sync(); stage.rebuild(); };
    const set = (txt, m) => { if (txt !== null) ta.value = txt; if (m) mode.value = m; run(); };
    stage = new PP.Stage({
      title: b.title || '2D lists: how nested loops walk a grid', caption: b.caption, output: true, quiz: false, aria: 'Animated 2D list',
      legend: [['cmp', 'Current cell'], ['seen', 'Already visited'], ['found', 'Result']],
      controls: [field('Grid: one row per line', ta), field('Task', mode), accessBox],
      presets: [
        { label: 'Row totals', apply: () => set(null, 'rowsum') }, { label: 'Biggest value', apply: () => set(null, 'max') },
        { label: 'Square grid + diagonal', apply: () => set('1, 2, 3\n4, 5, 6\n7, 8, 9', 'diag') },
        { label: 'grid[2][3] (last cell)', apply: () => { rI.value = '2'; cI.value = '3'; set(null, 'access'); } },
        { label: 'grid[-1][-1]', apply: () => { rI.value = '-1'; cI.value = '-1'; set(null, 'access'); } },
        { label: 'grid[3][0] (error)', apply: () => { rI.value = '3'; cI.value = '0'; set(null, 'access'); } },
        { label: 'One row', apply: () => set('4, 8, 15, 16', 'row') },
        { label: 'Uneven rows (error)', apply: () => set('1, 2, 3\n4, 5\n6, 7, 8', 'col') },
      ],
      edge: '* **`grid[r][c]`:** the **first** index picks the row (down), the **second** picks the column (across).\n* **Rows × columns:** `len(grid)` is the number of rows; `len(grid[0])` is the number of columns in row 0.\n* **Last valid index** is `len - 1` in each direction. `grid[3][0]` on a 3-row grid is an `IndexError`.\n* **Negative indexes work** here too: `grid[-1][-1]` is the bottom-right cell.\n* **Uneven rows** are legal in Python but loops that assume equal rows crash with `IndexError`. Try the preset.\n* **Diagonal** `grid[i][i]` only makes sense for square grids; for others stop at `min(rows, cols)`.\n* The **outer** loop is the one that changes more slowly.',
      build: (W) => {
        const lines = ta.value.split('\n').map((l) => l.trim()).filter((l) => l !== '');
        if (!lines.length) return { error: '**The grid is empty.** `grid = []` has zero rows, so `len(grid)` is 0, loops do nothing, and `grid[0]` would be an `IndexError`. Type some rows to continue.' };
        if (lines.length > 6) return { error: 'Please use at most 6 rows to keep the picture readable.' };
        const grid = [];
        for (const l of lines) { const r = A.parseNums(l, { max: 8, range: [-999, 9999] }); if (r.error) return { error: r.error }; if (!r.values.length) return { error: 'A row cannot be empty.' }; grid.push(r.values); }
        const R = grid.length, Cmax = Math.max(...grid.map((r) => r.length));
        const m = mode.value;
        const cs = Math.max(34, Math.min(54, (W - 120) / Cmax)), gx = 56, gy = 40, H = gy + R * cs + 70;
        const uneven = grid.some((r) => r.length !== grid[0].length);
        const codes = {
          row: ['for r in range(len(grid)):', '    for c in range(len(grid[r])):', '        print(grid[r][c])'],
          col: ['for c in range(len(grid[0])):', '    for r in range(len(grid)):', '        print(grid[r][c])'],
          rowsum: ['for r in range(len(grid)):', '    total = 0', '    for c in range(len(grid[r])):', '        total += grid[r][c]', '    print("row", r, "total:", total)'],
          colsum: ['for c in range(len(grid[0])):', '    total = 0', '    for r in range(len(grid)):', '        total += grid[r][c]', '    print("column", c, "total:", total)'],
          max: ['biggest = grid[0][0]', 'for r in range(len(grid)):', '    for c in range(len(grid[r])):', '        if grid[r][c] > biggest:', '            biggest = grid[r][c]', '            where = (r, c)'],
          diag: ['for i in range(min(len(grid), len(grid[0]))):', '    print(grid[i][i])'],
          access: ['r = ' + rI.value.trim(), 'c = ' + cI.value.trim(), 'print(grid[r][c])'],
        };
        const code = codes[m];
        const cellId = (r, c) => 'g' + r + '_' + c;
        const base = (st) => {
          const items = [];
          grid.forEach((row, r) => row.forEach((v, c) => items.push({ id: cellId(r, c), k: 'box', x: gx + c * cs + 1, y: gy + r * cs + 1, w: cs - 2, h: cs - 2, t: String(v), cls: (st.cls && st.cls[r + '_' + c]) || '' })));
          (st.extra || []).forEach((e) => items.push(e));
          const marks = [];
          for (let c = 0; c < Cmax; c++) marks.push({ id: 'cl' + c, k: 'lbl' + (st.col === c ? ' strong' : ''), x: gx + c * cs, y: gy - 22, w: cs, h: 18, t: 'col ' + c, cls: st.col === c ? 'cmp' : '' });
          for (let r = 0; r < R; r++) marks.push({ id: 'rl' + r, k: 'lbl' + (st.row === r ? ' strong' : ''), x: 0, y: gy + r * cs + cs / 2 - 9, w: gx - 6, h: 18, t: 'row ' + r, cls: st.row === r ? 'cmp' : '' });
          return { items, marks };
        };
        const F = [];
        const cls = {};
        let outTxt = '';
        const push = (st, extra) => { const o = base(st); F.push(Object.assign({ h: H, items: o.items, marks: o.marks, out: outTxt }, extra)); };
        const seen = (r, c) => { cls[r + '_' + c] = 'seen'; };
        const cur = (r, c) => Object.assign({}, cls, { [r + '_' + c]: 'cmp' });
        push({ cls }, { line: 1, vars: [['rows', R], ['columns', Cmax]], text: `A 2D list is a list of lists: <code>len(grid)</code> = <strong>${R}</strong> rows${uneven ? ', but the rows have <strong>different lengths</strong>' : `, each with <code>len(grid[0])</code> = <strong>${Cmax}</strong> columns`}. ${m === 'access' ? 'Watch how the two indexes narrow down to one cell.' : 'The <strong>outer</strong> loop picks a row or column; the <strong>inner</strong> loop walks along it.'}` });
        const fail = (r, c, why) => { push({ cls: Object.assign({}, cls, { [r + '_' + c]: 'bad' }), row: r, col: c }, { line: m === 'col' ? 3 : 3, vars: [['r', r], ['c', c]], text: `<strong>IndexError:</strong> <code>list index out of range</code>. ${why} A loop that assumes every row is as long as the first one crashes on uneven data.`, hold: 2 }); };
        if (m === 'row' || m === 'rowsum') {
          for (let r = 0; r < R; r++) {
            push({ cls, row: r }, { line: 1, vars: [['r', r]], text: `<code>r = ${r}</code>: start on <strong>row ${r}</strong>.` });
            let total = 0;
            if (m === 'rowsum') push({ cls, row: r }, { line: 2, vars: [['r', r], ['total', 0]], text: '<code>total = 0</code> before adding up this row.' });
            for (let c = 0; c < grid[r].length; c++) {
              total += grid[r][c];
              if (m === 'row') outTxt += grid[r][c] + '\n';
              push({ cls: cur(r, c), row: r, col: c }, { line: m === 'row' ? [2, 3] : [3, 4], vars: [['r', r], ['c', c], ['grid[r][c]', grid[r][c]]].concat(m === 'rowsum' ? [['total', total]] : []), text: `<code>grid[${r}][${c}]</code> is <strong>${grid[r][c]}</strong>.${m === 'rowsum' ? ` <code>total</code> is now ${total}.` : ''}` });
              seen(r, c);
            }
            if (m === 'rowsum') { outTxt += `row ${r} total: ${total}\n`; push({ cls, row: r, extra: Array.from({ length: r + 1 }, (_, k) => ({ id: 'tot' + k, k: 'tok', x: gx + Cmax * cs + 10, y: gy + k * cs + 4, w: 50, h: cs - 8, t: '= ' + grid[k].reduce((s, v) => s + v, 0), cls: k === r ? 'found' : 'pick' })) }, { line: 5, vars: [['r', r], ['total', total]], text: `Row ${r} adds up to <strong>${total}</strong>. The inner loop is finished, so the outer loop moves to the next row.` }); }
          }
        } else if (m === 'col' || m === 'colsum') {
          let broke = false;
          for (let c = 0; c < Cmax && !broke; c++) {
            if (c >= grid[0].length) break;
            push({ cls, col: c }, { line: 1, vars: [['c', c]], text: `<code>c = ${c}</code>: start on <strong>column ${c}</strong>.` });
            let total = 0;
            if (m === 'colsum') push({ cls, col: c }, { line: 2, vars: [['c', c], ['total', 0]], text: '<code>total = 0</code> before adding up this column.' });
            for (let r = 0; r < R; r++) {
              if (c >= grid[r].length) { fail(r, c, `Row ${r} only has ${grid[r].length} item${grid[r].length === 1 ? '' : 's'} (indexes 0 to ${grid[r].length - 1}), so <code>grid[${r}][${c}]</code> does not exist.`); broke = true; break; }
              total += grid[r][c];
              if (m === 'col') outTxt += grid[r][c] + '\n';
              push({ cls: cur(r, c), row: r, col: c }, { line: m === 'col' ? [2, 3] : [3, 4], vars: [['c', c], ['r', r], ['grid[r][c]', grid[r][c]]].concat(m === 'colsum' ? [['total', total]] : []), text: `<code>grid[${r}][${c}]</code> is <strong>${grid[r][c]}</strong>. Now the <strong>row</strong> changes while the column stays the same.` });
              seen(r, c);
            }
            if (!broke && m === 'colsum') { outTxt += `column ${c} total: ${total}\n`; push({ cls, col: c, extra: Array.from({ length: c + 1 }, (_, k) => ({ id: 'ctot' + k, k: 'tok', x: gx + k * cs + 2, y: gy + R * cs + 8, w: cs - 4, h: 30, t: '= ' + grid.reduce((s, row) => s + row[k], 0), cls: k === c ? 'found' : 'pick' })) }, { line: 5, vars: [['c', c], ['total', total]], text: `Column ${c} adds up to <strong>${total}</strong>.` }); }
          }
        } else if (m === 'max') {
          let best = grid[0][0], where = [0, 0];
          push({ cls: cur(0, 0), row: 0, col: 0 }, { line: 1, vars: [['biggest', best]], text: `Start by assuming the first cell is the biggest: <code>biggest = grid[0][0]</code> = ${best}.` });
          for (let r = 0; r < R; r++) for (let c = 0; c < grid[r].length; c++) {
            const bigger = grid[r][c] > best;
            push({ cls: cur(r, c), row: r, col: c }, { line: 4, vars: [['r', r], ['c', c], ['grid[r][c]', grid[r][c]], ['biggest', best]], text: `Is <code>${grid[r][c]} > ${best}</code>? <strong>${bigger ? 'Yes' : 'No'}</strong>${bigger ? ': a new biggest!' : '.'}` });
            if (bigger) { best = grid[r][c]; where = [r, c]; push({ cls: cur(r, c), row: r, col: c }, { line: [5, 6], vars: [['biggest', best], ['where', `(${r}, ${c})`]], text: `<code>biggest = ${best}</code> and remember its position <code>(${r}, ${c})</code>.` }); }
            seen(r, c);
          }
          outTxt = `biggest = ${best} at (${where[0]}, ${where[1]})`;
          push({ cls: { [where[0] + '_' + where[1]]: 'found' }, row: where[0], col: where[1] }, { line: 1, vars: [['biggest', best], ['where', `(${where[0]}, ${where[1]})`]], text: `Finished: the biggest value is <strong>${best}</strong> at row ${where[0]}, column ${where[1]}. <code>grid[${where[0]}][${where[1]}]</code>.`, hold: 2 });
        } else if (m === 'diag') {
          const k = Math.min(R, grid[0].length);
          for (let i = 0; i < k; i++) { outTxt += grid[i][i] + '\n'; push({ cls: cur(i, i), row: i, col: i }, { line: [1, 2], vars: [['i', i], ['grid[i][i]', grid[i][i]]], text: `<code>grid[${i}][${i}]</code> = <strong>${grid[i][i]}</strong>. Row and column are the <strong>same number</strong> on the diagonal.` }); seen(i, i); }
          push({ cls, }, { line: 1, vars: [['cells on diagonal', k]], text: R === Cmax ? `Done: ${k} diagonal cells (square grid).` : `Done. The grid is ${R}×${Cmax}, not square, so the diagonal stops after <code>min(${R}, ${Cmax}) = ${k}</code> cells. Without <code>min</code> the loop would run off the end.`, hold: 2 });
        } else {
          const rs = rI.value.trim(), cstr = cI.value.trim();
          if (!isInt(rs) || !isInt(cstr)) return { error: 'Type whole numbers for <code>r</code> and <code>c</code> (negative numbers are allowed).' };
          const r0 = +rs, c0 = +cstr;
          if (r0 >= R || r0 < -R) {
            push({ cls }, { line: 3, vars: [['r', r0], ['len(grid)', R]], text: `<code>grid[${r0}]</code>: ${R} row${R === 1 ? '' : 's'} means valid row indexes are <strong>0 to ${R - 1}</strong> (or -1 to -${R}). Row ${r0} does not exist.` });
            F.push(Object.assign({}, F[F.length - 1], { marks: F[F.length - 1].marks.concat([{ id: 'badrow', k: 'lbl strong', x: 0, y: gy + R * cs + 8, w: 220, h: 20, t: `✗ no row ${r0}`, cls: 'bad' }]), text: `<strong>IndexError:</strong> <code>list index out of range</code>. The error happens at the <strong>first</strong> index, before the column is even looked at.`, hold: 2 }));
          } else {
            const r1 = r0 < 0 ? R + r0 : r0;
            const rowCls = {}; grid[r1].forEach((_, c) => { rowCls[r1 + '_' + c] = 'seen'; });
            push({ cls: rowCls, row: r1 }, { line: 3, vars: [['r', r0], ['grid[r]', '[' + grid[r1].join(', ') + ']']], text: `<code>grid[${r0}]</code> picks <strong>row ${r1}</strong>${r0 < 0 ? ` (negative ${r0} counts from the bottom)` : ''}: the list <code>[${grid[r1].join(', ')}]</code>.` });
            if (c0 >= grid[r1].length || c0 < -grid[r1].length) {
              F.push(Object.assign({}, F[F.length - 1], { text: `<strong>IndexError:</strong> row ${r1} has only ${grid[r1].length} item${grid[r1].length === 1 ? '' : 's'} (columns 0 to ${grid[r1].length - 1}), so <code>[${c0}]</code> is out of range.`, hold: 2, marks: F[F.length - 1].marks.concat([{ id: 'badcol', k: 'lbl strong', x: 0, y: gy + R * cs + 8, w: 240, h: 20, t: `✗ no column ${c0} in row ${r1}`, cls: 'bad' }]) }));
            } else {
              const c1 = c0 < 0 ? grid[r1].length + c0 : c0;
              outTxt = String(grid[r1][c1]);
              push({ cls: Object.assign({}, rowCls, { [r1 + '_' + c1]: 'found' }), row: r1, col: c1 }, { line: 3, vars: [['r', r0], ['c', c0], ['grid[r][c]', grid[r1][c1]]], text: `Then <code>[${c0}]</code> picks <strong>column ${c1}</strong> inside that row: <code>grid[${r0}][${c0}]</code> = <strong>${grid[r1][c1]}</strong>.`, hold: 2 });
            }
          }
        }
        return { frames: F, code, note: uneven && m !== 'row' && m !== 'rowsum' && m !== 'access' ? 'The rows have different lengths. Loops that assume equal rows will crash with an <code>IndexError</code>: watch for the red cell.' : '' };
      },
    });
    mode.addEventListener('change', run);
    [rI, cI].forEach((e) => onEnter(e, run));
    sync();
    return stage.el;
  };

  /* =====================================================================
     Nested loops
     ===================================================================== */
  V.nested = function (b) {
    const R = inp(b.rows !== undefined ? b.rows : '3', 3, { 'aria-label': 'outer loop count' });
    const C = inp(b.cols !== undefined ? b.cols : '4', 3, { 'aria-label': 'inner loop count' });
    const pat = h('select', { class: 'sel', 'aria-label': 'Pattern' }, [['coords', 'Print row, col'], ['rect', 'Rectangle of stars'], ['tri', 'Triangle of stars'], ['table', 'Times table']].map(([v, l]) => h('option', { value: v }, l)));
    let stage;
    const run = () => stage.rebuild();
    const set = (r, c, p) => { R.value = r; C.value = c; if (p) pat.value = p; run(); };
    stage = new PP.Stage({
      title: b.title || 'Nested loops: the inner loop finishes first', caption: b.caption, output: true, aria: 'Animated nested loops',
      legend: [['cmp', 'Running now'], ['seen', 'Done'], ['out', 'Never reached']],
      controls: [field('Outer loop count', R), field('Inner loop count', C), field('Pattern', pat)],
      presets: [
        { label: '3 × 4 coordinates', apply: () => set('3', '4', 'coords') }, { label: 'Star triangle', apply: () => set('4', '4', 'tri') },
        { label: 'Times table 5 × 5', apply: () => set('5', '5', 'table') }, { label: '1 × 1', apply: () => set('1', '1', 'coords') },
        { label: 'Outer = 0 (nothing runs)', apply: () => set('0', '4', 'coords') }, { label: 'Inner = 0', apply: () => set('3', '0', 'rect') }, { label: '2 × 6 rectangle', apply: () => set('2', '6', 'rect') },
      ],
      edge: '* **Total repeats** of the inner body = outer × inner (for 3 and 4 that is 12).\n* **The inner loop restarts from the beginning** every time the outer loop moves on.\n* **A count of 0** means that loop body never runs. If the *outer* count is 0 nothing at all happens; if the *inner* count is 0 the outer loop still runs but each row is empty.\n* **Triangle:** the inner loop count depends on the outer variable: `range(row + 1)`.\n* **Loop variables are independent:** changing `col` inside the loop does not affect `range`.',
      build: (W) => {
        const rs = R.value.trim(), cs0 = C.value.trim();
        if (!/^\d+$/.test(rs) || !/^\d+$/.test(cs0)) return { error: 'Type whole numbers from 0 to 8 for both loop counts.' };
        const rows = +rs, cols = +cs0, p = pat.value;
        if (rows > 8 || cols > 8) return { error: 'Please use counts of at most 8 so the grid stays readable.' };
        const code = {
          coords: [`for row in range(${p === 'table' ? '' : ''}${rows}):`, `    for col in range(${cols}):`, '        print(row, col)'],
          rect: [`for row in range(${rows}):`, `    for col in range(${cols}):`, '        print("*", end="")', '    print()'],
          tri: [`for row in range(${rows}):`, '    for col in range(row + 1):', '        print("*", end="")', '    print()'],
          table: [`for row in range(1, ${rows} + 1):`, `    for col in range(1, ${cols} + 1):`, '        print(row * col, end=" ")', '    print()'],
        }[p];
        const counts = Array.from({ length: rows }, (_, r) => (p === 'tri' ? r + 1 : cols));
        const maxC = Math.max(cols, p === 'tri' ? rows : 0, 1);
        const gx = 56, gy = 34, cs = Math.max(30, Math.min(48, (W - 80) / maxC)), H = gy + Math.max(rows, 1) * cs + 16;
        const cellOrder = {};
        const F = [];
        let outTxt = '', step = 0, inner = 0;
        const items = (cur) => { const it = []; for (let r = 0; r < rows; r++) for (let c = 0; c < maxC; c++) { const reach = c < counts[r]; const k = r + '_' + c; it.push({ id: 'n' + k, k: 'box', x: gx + c * cs + 1, y: gy + r * cs + 1, w: cs - 2, h: cs - 2, t: cellOrder[k] ? String(cellOrder[k]) : '', cls: cur === k ? 'cmp' : (cellOrder[k] ? 'seen' : (reach ? '' : 'out')) }); } return it; };
        const marks = (cr, cc) => { const m = []; for (let c = 0; c < maxC; c++) m.push({ id: 'cl' + c, k: 'lbl' + (cc === c ? ' strong' : ''), x: gx + c * cs, y: gy - 20, w: cs, h: 16, t: 'col ' + (p === 'table' ? c + 1 : c) }); for (let r = 0; r < rows; r++) m.push({ id: 'rl' + r, k: 'lbl' + (cr === r ? ' strong' : ''), x: 0, y: gy + r * cs + cs / 2 - 9, w: gx - 6, h: 18, t: 'row ' + (p === 'table' ? r + 1 : r) }); return m; };
        const push = (cur, cr, cc, extra) => F.push(Object.assign({ h: H, items: items(cur), marks: marks(cr, cc), out: outTxt }, extra));
        if (rows === 0) { return { frames: [Object.assign({ h: 80, items: [], marks: [], out: '', line: 1, vars: [['row', '-']], text: `<code>range(0)</code> is empty, so the <strong>outer loop body never runs</strong>: the inner loop is never even started. Nothing is printed.` })], code }; }
        push(null, null, null, { line: 1, vars: [['outer count', rows], ['inner count', cols]], text: `The <strong>outer</strong> loop runs ${rows} time${rows === 1 ? '' : 's'}. Each time it runs, the <strong>inner</strong> loop starts again and runs ${p === 'tri' ? 'a growing number of times' : `${cols} time${cols === 1 ? '' : 's'}`}.` });
        for (let r = 0; r < rows; r++) {
          const rv = p === 'table' ? r + 1 : r;
          push(null, r, null, { line: 1, vars: [['row', rv], ['inner runs so far', inner]], text: `<strong>Outer loop:</strong> <code>row = ${rv}</code>. Now the inner loop will run all the way through.` });
          if (counts[r] === 0) { push(null, r, null, { line: 2, vars: [['row', rv], ['inner runs so far', inner]], text: `<code>range(0)</code> is empty: the inner loop body is <strong>skipped</strong> for this row.` }); }
          for (let c = 0; c < counts[r]; c++) {
            step++; inner++; cellOrder[r + '_' + c] = step;
            const cv = p === 'table' ? c + 1 : c;
            if (p === 'coords') outTxt += `${rv} ${cv}\n`; else if (p === 'table') outTxt += `${rv * cv}${c < counts[r] - 1 ? ' ' : ''}`; else outTxt += '*';
            push(r + '_' + c, r, c, { line: [2, 3], vars: [['row', rv], ['col', cv], ['inner runs so far', inner]], text: `<strong>Inner loop:</strong> <code>col = ${cv}</code>. ${p === 'coords' ? `Prints <code>${rv} ${cv}</code>.` : p === 'table' ? `<code>${rv} * ${cv}</code> = ${rv * cv}.` : 'Prints a star on the same line (<code>end=""</code>).'} That is repeat number <strong>${step}</strong> overall.` });
          }
          if (p !== 'coords') { outTxt += '\n'; push(null, r, null, { line: 4, vars: [['row', rv], ['inner runs so far', inner]], text: `The inner loop has finished. <code>print()</code> starts a new line. Then the outer loop moves on.` }); }
        }
        push(null, null, null, { line: 1, vars: [['total inner runs', inner]], text: `Finished. The inner body ran <strong>${inner}</strong> times in total${p === 'tri' ? ` (1 + 2 + … + ${rows})` : ` (${rows} × ${cols})`}.`, hold: 2 });
        return { frames: F, code };
      },
    });
    [R, C].forEach((e) => onEnter(e, run));
    return stage.el;
  };
})();

/* Visual explainers, part 3: binary (bits, conversion, addition), Caesar cipher, run-length encoding,
 * and the memory visualiser powered by the real Python tracer. */
(function () {
  const { h } = PP;
  const ui = PP.ui;
  const A = PP.anim;
  const V = PP.viz;

  const inp = (v, w, extra) => h('input', Object.assign({ type: 'text', value: v, size: w || 14, class: 'vin', spellcheck: 'false', autocomplete: 'off' }, extra || {}));
  const field = (label, el) => h('label', { class: 'vf' }, h('span', null, label), el);
  const applyBtn = (fn, label) => h('button', { class: 'btn primary', onclick: fn }, label || 'Animate');
  const onEnter = (el, fn) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); fn(); } });
  const bin8 = (n) => (n & 255).toString(2).padStart(8, '0');
  const hex2 = (n) => (n & 255).toString(16).toUpperCase().padStart(2, '0');

  /* =====================================================================
     8-bit binary explorer (click bits, shift, add 1)
     ===================================================================== */
  V.binary = function (b) {
    let seq = 0;
    const mk = (v) => ({ id: 'b' + (seq++), v });
    let bits = (b.bits || [0, 1, 0, 0, 1, 0, 1, 1]).map(mk);
    let hist = ['n = 0b' + bits.map((x) => x.v).join('')];
    let pending = null;
    const num = inp('', 5, { 'aria-label': 'Denary number' });
    const signed = h('input', { type: 'checkbox' });
    let stage;
    const val = (bs) => bs.reduce((s, x) => s * 2 + x.v, 0);
    const readout = (bs) => { const v = val(bs); return [['Binary', bs.map((x) => x.v).join('')], ['Denary', v], ['Signed (two\'s complement)', bs[0].v ? v - 256 : v], ['Hex', hex2(v)], ['ASCII', v >= 32 && v < 127 ? JSON.stringify(String.fromCharCode(v)) : '(not printable)']]; };

    function layout(bs, W, o) {
      o = o || {};
      const sw = Math.min(60, (W - 20) / 8), x0 = (W - sw * 8) / 2, y = 78;
      const items = bs.map((t, s) => ({ id: t.id, k: 'box', x: x0 + (o.slotOf ? o.slotOf(t, s) : s) * sw + 2, y, w: sw - 4, h: 50, t: String(t.v), cls: ((o.cls && o.cls[t.id]) || '') + (t.v ? ' one' : ''), op: o.op && o.op[t.id] !== undefined ? o.op[t.id] : 1, from: o.from && o.from[t.id], click: o.click ? () => o.click(t, s) : null }));
      (o.extra || []).forEach((e) => items.push(e(x0, sw, y)));
      const marks = [];
      for (let s = 0; s < 8; s++) marks.push({ id: 'pv' + s, k: 'lbl strong', x: x0 + s * sw, y: y - 24, w: sw, h: 18, t: String(128 >> s) });
      marks.push({ id: 'nb1', k: 'brk', x: x0 + 2, y: y + 58, w: sw * 4 - 4, h: 30, t: 'hex digit ' + (val(bs) >> 4).toString(16).toUpperCase() });
      marks.push({ id: 'nb2', k: 'brk', x: x0 + sw * 4 + 2, y: y + 58, w: sw * 4 - 4, h: 30, t: 'hex digit ' + (val(bs) & 15).toString(16).toUpperCase() });
      return { items, marks, sw, x0, y };
    }
    const frame = (W, bs, o, extra) => { const L = layout(bs, W, o); return Object.assign({ h: 178, items: L.items, marks: L.marks, vars: readout(bs) }, extra); };

    stage = new PP.Stage({
      title: b.title || '8-bit binary: click bits, shift, add', liveInputs: false, autoplayOnChange: true, caption: b.caption, quiz: false, aria: 'Animated binary number',
      legend: [['one', 'Bit is 1'], ['swp', 'Changing'], ['bad', 'Lost off the end']],
      controls: [field('Set a number (0-255, or −128-127 if signed)', num), h('button', { class: 'btn', onclick: () => setNum() }, 'Set'), h('label', { class: 'vf vf-inline' }, signed, h('span', null, 'Treat as signed'))],
      code: () => hist,
      edge: '* **Place values** double each step: 1, 2, 4, 8, 16, 32, 64, 128. A bit that is 1 adds its place value.\n* **Largest 8-bit number:** `11111111` = 255. 8 bits make `2 ** 8 = 256` different values.\n* **Shift left** doubles the number, **but** a 1 that falls off the left end is lost: that is **overflow**.\n* **Shift right** halves the number and rounds **down**. The bit that falls off the right end is the remainder.\n* **Arithmetic shift right** keeps the sign bit, so negative two\'s complement numbers stay negative.\n* **Add 1 to 255** wraps round to `00000000` in 8 bits.\n* **Two\'s complement:** the left-most bit is worth **−128**, so `10000000` is −128 and `11111111` is −1.\n* **Each hex digit is exactly one group of 4 bits:** see the brackets under the bits.',
      build: (W) => (pending ? { frames: pending.make(W), code: hist } : { frames: [frame(W, bits, { click: toggle }, { line: hist.length, text: 'Each box is one <strong>bit</strong>. Click a bit to flip it, or use the buttons. The number above each bit is its <strong>place value</strong>: add up the place values of the 1s.' })], code: hist }),
    });
    function commit(stmt, make) { hist = hist.concat([stmt]).slice(-9); pending = { make }; stage.rebuild(); }
    const clickable = { click: null };
    function toggle(t, s) {
      const before = bits.slice(); const nt = { id: t.id, v: 1 - t.v };
      bits = bits.map((x) => (x.id === t.id ? nt : x));
      commit(`n = n ^ ${128 >> s}   # flip the ${128 >> s} bit`, (W) => [frame(W, bits, { cls: { [t.id]: 'swp' }, click: toggle }, { line: hist.length, text: `Bit worth <strong>${128 >> s}</strong> changed from ${t.v} to ${nt.v}, so the number ${nt.v ? 'went up' : 'went down'} by ${128 >> s}. It is now <strong>${val(bits)}</strong>.` })]);
    }
    function setNum() {
      const t = num.value.trim();
      if (!/^-?\d+$/.test(t)) { pending = { make: (W) => [frame(W, bits, { click: toggle }, { line: hist.length, text: 'Type a <strong>whole number</strong> first.' })] }; stage.rebuild(); return; }
      let n = +t;
      const lo = signed.checked ? -128 : 0, hi = signed.checked ? 127 : 255;
      if (n < lo || n > hi) { pending = { make: (W) => [frame(W, bits, { click: toggle }, { line: hist.length, text: `<strong>${n} does not fit in 8 bits.</strong> The range is ${lo} to ${hi}. ${n > hi ? `${n} needs ${n.toString(2).length} bits: <code>${n.toString(2)}</code>.` : 'Tick or untick “signed” to change the range.'}` })] }; stage.rebuild(); return; }
      const before = bits.slice();
      bits = bin8(n < 0 ? n + 256 : n).split('').map((c) => mk(+c));
      commit(`n = ${n}   # = 0b${bin8(n < 0 ? n + 256 : n)}`, (W) => [frame(W, before, {}, { line: hist.length, text: `Setting the number to <strong>${n}</strong>…` }), frame(W, bits, { click: toggle, cls: Object.fromEntries(bits.map((x) => [x.id, 'swp'])) }, { line: hist.length, text: `${n}${n < 0 ? ` in two's complement` : ''} is <code>${bin8(n < 0 ? n + 256 : n)}</code>.` })]);
    }
    function shift(dir, arith) {
      const pre = bits.slice(), n = val(pre);
      let post, gone, entering;
      if (dir === 'L') { gone = pre[0]; entering = mk(0); post = pre.slice(1).concat([entering]); }
      else { gone = pre[7]; entering = mk(arith ? pre[0].v : 0); post = [entering].concat(pre.slice(0, 7)); }
      bits = post;
      const stmt = dir === 'L' ? '(n << 1) & 255' : (arith ? 'n >> 1   # arithmetic: sign bit copied' : 'n >> 1   # logical: zero fills in');
      const lost = gone.v === 1;
      commit(stmt, (W) => {
        const sw = Math.min(60, (W - 20) / 8);
        const f1 = frame(W, pre, {}, { line: hist.length, text: `<strong>${dir === 'L' ? 'Shift left' : (arith ? 'Arithmetic shift right' : 'Logical shift right')}</strong>: every bit moves one place ${dir === 'L' ? 'left' : 'right'}.` });
        const slotOf = (t, s) => (t.id === gone.id ? (dir === 'L' ? -1.2 : 8.2) : (dir === 'L' ? s - 1 : s + 1));
        const f2 = frame(W, pre.concat([entering]), { slotOf: (t, s) => (t.id === entering.id ? (dir === 'L' ? 7 : 0) : slotOf(t, s)), cls: { [gone.id]: lost ? 'bad' : '' }, op: { [gone.id]: 0.15 }, from: { [entering.id]: { x: 0, y: 78, op: 0 } } }, { line: hist.length, text: lost ? `The bit that falls off the ${dir === 'L' ? 'left' : 'right'} end is a <strong>1</strong>, and it is <strong>lost</strong>.` : `The bit that falls off the ${dir === 'L' ? 'left' : 'right'} end is a 0, so nothing important is lost.` });
        const nn = val(post);
        const f3 = frame(W, post, {}, {
          line: hist.length, text: dir === 'L'
            ? (lost ? `<strong>Overflow:</strong> a 1 was pushed out, so ${n} × 2 does <strong>not</strong> fit. The result is ${nn} instead of ${n * 2}.` : `A 0 comes in on the right. The number <strong>doubled</strong>: ${n} → ${nn}.`)
            : (arith && pre[0].v ? `The sign bit (1) was copied in, so a negative number stays negative: ${n - 256} → ${nn - 256} (signed).` : `A ${entering.v} comes in on the left. The number was <strong>halved and rounded down</strong>: ${n} → ${nn}${lost ? ' (the lost 1 was the remainder)' : ''}.`)
        });
        return [f1, f2, f3];
      });
    }
    function add1() {
      const pre = bits.slice(); let cur = pre.slice(); const frames = [];
      let carry = true, i = 7; const steps = [];
      while (carry && i >= 0) { if (cur[i].v === 1) { steps.push({ i, from: 1, to: 0 }); cur = cur.map((x, k) => (k === i ? { id: x.id, v: 0 } : x)); i--; } else { steps.push({ i, from: 0, to: 1 }); cur = cur.map((x, k) => (k === i ? { id: x.id, v: 1 } : x)); carry = false; } }
      const overflow = carry;
      bits = cur;
      commit('n = (n + 1) & 255', (W) => {
        const out = [frame(W, pre, {}, { line: hist.length, text: `<strong>Add 1</strong>. Work from the right: a 1 plus 1 is 10 in binary, so write 0 and <strong>carry</strong> 1 to the next place.` })];
        let tmp = pre.slice();
        steps.forEach((s) => { tmp = tmp.map((x, k) => (k === s.i ? { id: x.id, v: s.to } : x)); out.push(frame(W, tmp, { cls: { [tmp[s.i].id]: 'swp' } }, { line: hist.length, text: s.from === 1 ? `Bit ${128 >> s.i}: 1 + carry = 10, so write <strong>0</strong> and carry 1 on.` : `Bit ${128 >> s.i}: 0 + carry = 1. Write <strong>1</strong>. No carry left: finished.` })); });
        if (overflow) out.push(frame(W, tmp, {}, { line: hist.length, text: '<strong>Overflow!</strong> The carry has nowhere to go: the 9th bit does not exist in 8 bits. 255 + 1 wraps round to 0.', hold: 2 }));
        else out.push(frame(W, tmp, {}, { line: hist.length, text: `Result: <strong>${val(tmp)}</strong>.` }));
        return out;
      });
    }
    function flipAll() { const pre = bits.slice(); bits = pre.map((x) => ({ id: x.id, v: 1 - x.v })); commit('n = n ^ 255   # flip every bit', (W) => [frame(W, pre, {}, { line: hist.length, text: 'Flip every bit (this is the <strong>one\'s complement</strong>).' }), frame(W, bits, { cls: Object.fromEntries(bits.map((x) => [x.id, 'swp'])), click: toggle }, { line: hist.length, text: `${val(pre)} became ${val(bits)}. Add 1 to this and you get the <strong>two's complement</strong> (the negative).` })]); }
    function twos() { const pre = bits.slice(); const nv = (256 - val(pre)) & 255; bits = bin8(nv).split('').map((c, i) => ({ id: pre[i].id, v: +c })); commit('n = (~n + 1) & 255   # negate (two\'s complement)', (W) => [frame(W, pre, {}, { line: hist.length, text: `<strong>Negate</strong> using two's complement: flip all the bits, then add 1.` }), frame(W, bits, { cls: Object.fromEntries(bits.map((x) => [x.id, 'swp'])), click: toggle }, { line: hist.length, text: `As a signed number ${pre[0].v ? val(pre) - 256 : val(pre)} became ${bits[0].v ? val(bits) - 256 : val(bits)}.` })]); }
    const bar = h('div', { class: 'an-ops' }, [['Shift left  <<', () => shift('L')], ['Logical shift right  >>', () => shift('R', false)], ['Arithmetic shift right', () => shift('R', true)], ['Add 1', add1], ['Flip all bits', flipAll], ['Negate (two\'s complement)', twos]].map(([l, f]) => h('button', { class: 'btn small', onclick: f }, l)),
      h('button', { class: 'btn small ghost', onclick: () => { bits = [0, 1, 0, 0, 1, 0, 1, 1].map(mk); hist = ['n = 0b01001011']; pending = null; stage.rebuild({ autoplay: false }); } }, 'Reset'),
      h('button', { class: 'btn small ghost', onclick: () => { bits = Array.from({ length: 8 }, () => mk(0)); hist = ['n = 0']; pending = null; stage.rebuild({ autoplay: false }); } }, 'All zeros'));
    stage.el.querySelector('.an-controls').append(h('div', { class: 'an-ops-wrap' }, h('span', { class: 'an-tl' }, 'Do'), bar));
    onEnter(num, setNum);
    return stage.el;
  };

  /* =====================================================================
     Denary -> binary by place values
     ===================================================================== */
  V.denary2bin = function (b) {
    const num = inp(b.value !== undefined ? b.value : '77', 6, { 'aria-label': 'Denary number', inputmode: 'numeric' });
    let stage;
    const run = () => stage.rebuild();
    const set = (v) => { num.value = v; run(); };
    stage = new PP.Stage({
      title: b.title || 'Denary → binary, one place value at a time', caption: b.caption, quiz: true, aria: 'Animated denary to binary conversion',
      legend: [['cmp', 'Checking this place'], ['done', 'Bit is 1'], ['out', 'Bit is 0']],
      controls: [field('Denary number (0-255)', num)],
      presets: [{ label: '77', apply: () => set('77') }, { label: '255 (all ones)', apply: () => set('255') }, { label: '0', apply: () => set('0') }, { label: '128 (one bit)', apply: () => set('128') }, { label: '170 (alternating)', apply: () => set('170') }, { label: '256 (too big)', apply: () => set('256') }, { label: '−5 (negative)', apply: () => set('-5') }, { label: '3.5 (decimal)', apply: () => set('3.5') }],
      edge: '* **0** has no 1s: all eight bits are 0.\n* **255** is the biggest 8-bit number: every bit is 1.\n* **Powers of 2** (1, 2, 4, 8 … 128) have exactly one 1.\n* **256 or more** needs 9 or more bits. It does not fit in one byte (overflow).\n* **Negative numbers** need a different method: two\'s complement (see the explorer above).\n* **Decimals** (`3.5`) need a binary fraction or floating-point representation: not covered by this method.',
      build: (W) => {
        const t = num.value.trim();
        if (!/^-?\d+$/.test(t)) return { error: `**${PP.esc(t || 'Nothing')}** is not a whole number. This method converts whole numbers (integers). Decimals and fractions are stored with a different system (floating point).` };
        const n0 = +t;
        if (n0 < 0) return { error: `**${n0} is negative.** The place-value method only makes positive numbers. Negative numbers are stored in <strong>two's complement</strong>: flip the bits of ${-n0} and add 1. For ${n0}: <code>${bin8(n0 + 256)}</code>. Try the explorer above with “signed” ticked.` };
        if (n0 > 255) return { error: `**${n0} does not fit in 8 bits.** The biggest 8-bit number is 255. ${n0} needs <strong>${n0.toString(2).length} bits</strong>: <code>${n0.toString(2)}</code>. Computers use more bytes for bigger numbers.` };
        let rem = n0;
        const sw = Math.min(60, (W - 90) / 8), x0 = 84, y = 98;
        const places = [128, 64, 32, 16, 8, 4, 2, 1];
        const code = ['remaining = number', 'result = ""', 'for place in [128, 64, 32, 16, 8, 4, 2, 1]:', '    if remaining >= place:', '        result += "1"', '        remaining -= place', '    else:', '        result += "0"'];
        const bitsSoFar = [];
        const F = [];
        const snap = (o) => {
          const items = [{ id: 'rem', k: 'tok', x: 6, y: y - 6, w: 66, h: 56, t: String(rem), cls: o.remCls || 'pick s-big' }];
          places.forEach((pv, i) => items.push({ id: 'bit' + i, k: 'box', x: x0 + i * sw + 2, y, w: sw - 4, h: 46, t: i < bitsSoFar.length ? String(bitsSoFar[i]) : '', cls: i === o.cur ? 'cmp' : (i < bitsSoFar.length ? (bitsSoFar[i] ? 'done' : 'out') : '') }));
          const marks = [{ id: 'rl', k: 'lbl strong', x: 4, y: y - 30, w: 72, h: 18, t: 'remaining' }].concat(places.map((pv, i) => ({ id: 'pv' + i, k: 'lbl strong', x: x0 + i * sw, y: y - 26, w: sw, h: 18, t: String(pv), cls: i === o.cur ? 'cmp' : '' })));
          if (o.nibble) { marks.push({ id: 'n1', k: 'brk', x: x0 + 2, y: y + 58, w: sw * 4 - 4, h: 30, t: 'hex ' + (n0 >> 4).toString(16).toUpperCase() }); marks.push({ id: 'n2', k: 'brk', x: x0 + sw * 4 + 2, y: y + 58, w: sw * 4 - 4, h: 30, t: 'hex ' + (n0 & 15).toString(16).toUpperCase() }); }
          F.push({ h: 190, items, marks, line: o.line, text: o.text, ask: o.ask, hold: o.hold, vars: [['number', n0], ['place', o.cur != null ? places[o.cur] : '-'], ['remaining', rem], ['result', '"' + bitsSoFar.join('') + '"']] });
        };
        snap({ line: [1, 2], text: `Convert <strong>${n0}</strong> to 8-bit binary. For each place value from the left, ask: <em>does it fit into what is left?</em> If yes, write 1 and subtract it. If no, write 0.` });
        places.forEach((pv, i) => {
          const fits = rem >= pv;
          snap({ line: [3, 4], cur: i, text: `Place value <strong>${pv}</strong>. Is <code>${rem} >= ${pv}</code>? <strong>${fits ? 'Yes' : 'No'}</strong>.`, ask: { q: `${rem} is left. Does ${pv} fit into it?`, opts: ['Yes: write 1 and subtract', 'No: write 0'], ans: fits ? 0 : 1 } });
          bitsSoFar.push(fits ? 1 : 0);
          if (fits) { const before = rem; rem -= pv; snap({ line: [5, 6], cur: i, text: `Write <strong>1</strong>. Take ${pv} away: ${before} − ${pv} = <strong>${rem}</strong> left.` }); }
          else snap({ line: [7, 8], cur: i, text: `${pv} is too big, so write <strong>0</strong>. Still <strong>${rem}</strong> left.` });
        });
        snap({ line: 3, nibble: true, remCls: 'done s-big', hold: 2, text: `Done: <strong>${n0}</strong> = <code>${bitsSoFar.join('')}</code> in binary. Nothing is left over (remaining = 0). Split into groups of 4 bits for hex: <strong>${hex2(n0)}</strong>.` });
        return { frames: F, code };
      },
    });
    onEnter(num, run);
    return stage.el;
  };

  /* =====================================================================
     Binary addition with carries and overflow
     ===================================================================== */
  V.binadd = function (b) {
    const a = inp(b.a || '01101101', 10, { 'aria-label': 'First binary number', maxlength: 8 });
    const c = inp(b.b || '00110111', 10, { 'aria-label': 'Second binary number', maxlength: 8 });
    let stage;
    const run = () => stage.rebuild();
    const set = (x, y) => { a.value = x; c.value = y; run(); };
    stage = new PP.Stage({
      title: b.title || 'Binary addition: carries and overflow', caption: b.caption, quiz: true, aria: 'Animated binary addition',
      legend: [['cmp', 'Adding this column'], ['swp', 'Carry'], ['bad', 'Overflow']],
      controls: [field('First number (up to 8 bits)', a), field('Second number', c)],
      presets: [{ label: 'No carries', apply: () => set('00010010', '00100100') }, { label: 'Carries ripple', apply: () => set('01101101', '00110111') }, { label: 'Overflow (255 + 1)', apply: () => set('11111111', '00000001') }, { label: 'Big overflow', apply: () => set('11000000', '10100000') }, { label: 'Zero + zero', apply: () => set('0', '0') }, { label: 'Short numbers', apply: () => set('101', '11') }, { label: 'Not binary (error)', apply: () => set('1021', '11') }],
      edge: '* **Rules:** 0+0=0, 0+1=1, 1+1=**10** (write 0, carry 1), 1+1+1=**11** (write 1, carry 1).\n* **Carry-in:** each column adds three things: the two bits and the carry from the column on its right.\n* **Overflow:** if there is still a carry after the **left-most** column, the answer needs a 9th bit that an 8-bit register does not have. The stored answer is wrong.\n* **Short numbers** are padded with leading zeros to 8 bits.\n* **Only 0 and 1** are allowed: anything else is not binary.',
      build: (W) => {
        const x = a.value.trim(), y = c.value.trim();
        if (!x || !y) return { error: 'Type a binary number in both boxes (only the digits 0 and 1, up to 8 of them).' };
        if (!/^[01]{1,8}$/.test(x) || !/^[01]{1,8}$/.test(y)) return { error: `Binary numbers contain only <code>0</code> and <code>1</code>, with at most 8 digits. <code>${PP.esc(!/^[01]{1,8}$/.test(x) ? x : y)}</code> is not valid.` };
        const X = x.padStart(8, '0').split('').map(Number), Y = y.padStart(8, '0').split('').map(Number);
        const sw = Math.min(56, (W - 90) / 9), x0 = 78, yc = 22, ya = 64, yb = 104, yr = 160;
        const colX = (i) => x0 + sw * (i + 1);
        const code = ['carry = 0', 'for i in range(7, -1, -1):', '    total = a[i] + b[i] + carry', '    result[i] = total % 2', '    carry = total // 2', 'if carry == 1:', '    print("Overflow!")'];
        const F = [];
        const res = Array(8).fill(null), carries = Array(9).fill(null);
        let carry = 0;
        const snap = (o) => {
          const items = [];
          for (let i = 0; i < 8; i++) {
            items.push({ id: 'a' + i, k: 'box', x: colX(i) + 2, y: ya, w: sw - 4, h: 36, t: String(X[i]), cls: o.col === i ? 'cmp' : '' });
            items.push({ id: 'b' + i, k: 'box', x: colX(i) + 2, y: yb, w: sw - 4, h: 36, t: String(Y[i]), cls: o.col === i ? 'cmp' : '' });
            if (res[i] !== null) items.push({ id: 'r' + i, k: 'box', x: colX(i) + 2, y: yr, w: sw - 4, h: 40, t: String(res[i]), cls: o.col === i ? 'swp' : 'done', from: o.col === i ? { x: colX(i) + 2, y: yb + 20, op: 0 } : undefined });
          }
          for (let i = 0; i < 9; i++) if (carries[i] !== null && carries[i] !== undefined) items.push({ id: 'cy' + i, k: 'tok', x: colX(i - 1) + 6 + (i === 0 ? 0 : 0), y: yc, w: sw - 12, h: 26, t: String(carries[i]), cls: (o.over && i === 0) ? 'bad' : (carries[i] ? 'swp' : ''), from: o.col === i ? { x: colX(i) + 6, y: yc + 20, op: 0 } : undefined });
          const marks = [{ id: 'lc', k: 'lbl strong', x: 0, y: yc + 4, w: x0 - 6, h: 18, t: 'carry' }, { id: 'la', k: 'lbl strong', x: 0, y: ya + 9, w: x0 - 6, h: 18, t: 'A' }, { id: 'lb', k: 'lbl strong', x: 0, y: yb + 9, w: x0 - 6, h: 18, t: '+ B' }, { id: 'lr', k: 'lbl strong', x: 0, y: yr + 11, w: x0 - 6, h: 18, t: 'sum' }, { id: 'ln', k: 'line', x: x0 + sw - 2, y: yb + 44, w: sw * 8 + 4, h: 2 }];
          for (let i = 0; i < 8; i++) marks.push({ id: 'pv' + i, k: 'lbl', x: colX(i), y: yr + 44, w: sw, h: 16, t: String(128 >> i) });
          if (o.over) marks.push({ id: 'ov', k: 'lbl strong', x: x0 - 4, y: yr + 62, w: 320, h: 18, t: '✗ a 9th bit would be needed: lost', cls: 'bad' });
          F.push({ h: 252, items, marks, line: o.line, text: o.text, ask: o.ask, hold: o.hold, vars: [['carry', carry], ['column', o.col == null ? '-' : 'bit ' + (128 >> o.col)], ['a', X.join('')], ['b', Y.join('')], ['result', res.map((v) => (v === null ? '_' : v)).join('')]] });
        };
        carries[8] = 0;
        snap({ line: 1, text: `Add <code>${X.join('')}</code> (${parseInt(X.join(''), 2)}) and <code>${Y.join('')}</code> (${parseInt(Y.join(''), 2)}). Start at the <strong>right-hand</strong> column with <code>carry = 0</code>.` });
        for (let i = 7; i >= 0; i--) {
          const cin = carry, tot = X[i] + Y[i] + cin, bit = tot % 2, cout = tot >> 1;
          snap({ line: 3, col: i, text: `Column <strong>${128 >> i}</strong>: <code>${X[i]} + ${Y[i]}${cin ? ' + 1 (carry)' : ''} = ${tot}</code>.`, ask: { q: `Column ${128 >> i}: ${X[i]} + ${Y[i]}${cin ? ' + carry 1' : ''}. What is the <strong>sum bit</strong> to write down?`, opts: ['0', '1'], ans: bit } });
          res[i] = bit; carry = cout; carries[i] = cout;
          snap({ line: [4, 5], col: i, text: tot === 0 ? 'Zero: write <strong>0</strong>, nothing to carry.' : tot === 1 ? 'One: write <strong>1</strong>, nothing to carry.' : tot === 2 ? `Two is <code>10</code> in binary: write <strong>0</strong> and <strong>carry 1</strong> to the next column.` : `Three is <code>11</code> in binary: write <strong>1</strong> and <strong>carry 1</strong>.` });
        }
        const sumVal = parseInt(res.join(''), 2), real = parseInt(X.join(''), 2) + parseInt(Y.join(''), 2);
        if (carry) snap({ line: [6, 7], over: true, hold: 2, text: `<strong>Overflow!</strong> There is still a carry of 1 out of the left-most column, but an 8-bit number has no 9th place. The stored result <code>${res.join('')}</code> is ${sumVal}, but the real answer is <strong>${real}</strong>.` });
        else snap({ line: 6, hold: 2, text: `No carry left over, so no overflow. <code>${res.join('')}</code> = <strong>${sumVal}</strong>, which matches ${parseInt(X.join(''), 2)} + ${parseInt(Y.join(''), 2)}.` });
        return { frames: F, code };
      },
    });
    [a, c].forEach((e) => onEnter(e, run));
    return stage.el;
  };

  /* =====================================================================
     Caesar cipher: sliding alphabet
     ===================================================================== */
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  V.caesar = function (b) {
    const text = inp(b.text || 'HELLO WORLD', 16, { maxlength: 18, 'aria-label': 'Message' });
    const key = inp(b.key !== undefined ? b.key : '3', 4, { 'aria-label': 'Key', inputmode: 'numeric' });
    const mode = h('select', { class: 'sel', 'aria-label': 'Mode' }, [['e', 'Encrypt'], ['d', 'Decrypt'], ['x', 'Crack: try every key']].map(([v, l]) => h('option', { value: v }, l)));
    let stage;
    const run = () => stage.rebuild();
    const set = (t, k, m) => { text.value = t; key.value = k; mode.value = m || 'e'; run(); };
    const WORDS = ['THE', 'AND', 'IS', 'FUN', 'HELLO', 'WORLD', 'THIS', 'PYTHON', 'CODE', 'SECRET', 'MESSAGE', 'ATTACK', 'DAWN', 'MEET', 'AT', 'NOON', 'COMPUTER', 'SCIENCE', 'LOVE', 'YOU'];
    const shiftText = (t, s) => [...t].map((ch) => { const u = ch.toUpperCase(), i = ALPHA.indexOf(u); if (i < 0) return ch; const r = ALPHA[(i + s + 260) % 26]; return ch === u ? r : r.toLowerCase(); }).join('');
    stage = new PP.Stage({
      title: b.title || 'Caesar cipher: slide the alphabet', caption: b.caption, quiz: false, output: true, minW: 520, aria: 'Animated Caesar cipher',
      legend: [['cmp', 'Letter being converted'], ['swp', 'Its replacement']],
      controls: [field('Message', text), field('Key (0-25)', key), field('Mode', mode)],
      presets: [{ label: 'Encrypt HELLO, key 3', apply: () => set('HELLO', '3', 'e') }, { label: 'Wrap-around (XYZ)', apply: () => set('XYZ', '3', 'e') }, { label: 'Spaces and punctuation', apply: () => set('Hi, there!', '5', 'e') }, { label: 'Key 0 (no change)', apply: () => set('SAME', '0', 'e') }, { label: 'Key 26 (full circle)', apply: () => set('SAME', '26', 'e') }, { label: 'Decrypt WKLV LV IXQ', apply: () => set('WKLV LV IXQ', '3', 'd') }, { label: 'Crack WKLV LV IXQ', apply: () => set('WKLV LV IXQ', '0', 'x') }, { label: 'Lower case', apply: () => set('Python', '7', 'e') }],
      edge: '* **Wrap-around:** after Z comes A again. Python does this with `% 26`: `(23 + 3) % 26 = 0`.\n* **Non-letters** (spaces, digits, punctuation) are left unchanged.\n* **Upper and lower case** are kept: the code uses `isupper()` to pick the right base (65 or 97).\n* **Key 0 and key 26** do nothing (a full circle). Keys 27+ repeat keys 1+, which is why `% 26` is used.\n* **Decrypting** is the same shift in the opposite direction: shift by `26 - key`.\n* **Only 25 useful keys exist**, so the cipher is easy to break by trying them all: choose *Crack*.',
      build: (W) => {
        const msg = text.value;
        if (!msg.trim()) return { error: '**The message is empty.** An empty string has no letters, so the loop does nothing and the result is also `""`. Type some text.' };
        const kt = key.value.trim();
        if (!/^-?\d+$/.test(kt)) return { error: 'The key must be a whole number from 0 to 25 (for example <code>3</code>).' };
        let k = +kt;
        let note = '';
        if (k < 0 || k > 25) { const k2 = ((k % 26) + 26) % 26; note = `A key of ${k} is the same as ${k2} (because <code>% 26</code>). The animation uses ${k2}.`; k = k2; }
        const m = mode.value;
        const lw = Math.max(18, Math.min(30, (W - 100) / 26)), x0 = 66;
        const yTop = 44, yBot = 96, H = 232;
        const code = ['for ch in text:', '    if ch.isalpha():', '        base = 65 if ch.isupper() else 97', '        pos = ord(ch) - base', '        new_pos = (pos + key) % 26', '        result += chr(new_pos + base)', '    else:', '        result += ch'];
        const topLabel = m === 'd' ? 'cipher' : 'plain', botLabel = m === 'd' ? 'plain' : 'cipher';
        const F = [];
        const strip = (shift, hi) => {
          const items = [], marks = [];
          for (let i = 0; i < 26; i++) {
            const isHi = hi != null && hi === i;
            items.push({ id: 'T' + i, k: 'box', x: x0 + i * lw, y: yTop, w: lw - 1, h: 30, t: ALPHA[i], cls: isHi ? 'cmp' : '' });
          }
          for (let j = 0; j < 26; j++) for (const cp of [-1, 0, 1]) {
            const p = j - shift + 26 * cp;
            const vis = p >= -0.01 && p <= 25.01;
            const isHi = hi != null && ((hi + shift) % 26 === j) && cp === 0 ? true : (hi != null && ((hi + shift) % 26 === j) && vis);
            items.push({ id: 'B' + j + '_' + cp, k: 'box', x: x0 + p * lw, y: yBot, w: lw - 1, h: 30, t: ALPHA[j], cls: vis && isHi ? 'swp' : '', op: vis ? 1 : 0 });
          }
          marks.push({ id: 'l1', k: 'lbl strong', x: 0, y: yTop + 7, w: x0 - 6, h: 18, t: topLabel });
          marks.push({ id: 'l2', k: 'lbl strong', x: 0, y: yBot + 7, w: x0 - 6, h: 18, t: botLabel });
          if (hi != null) marks.push({ id: 'ln', k: 'tick', x: x0 + hi * lw + lw / 2 - 1, y: yTop + 30, w: 2, h: yBot - yTop - 30 });
          return { items, marks };
        };
        const outTok = (res, fromHi) => res.map((ch, n) => ({ id: 'o' + n, k: 'tok', x: 10 + n * Math.min(26, (W - 20) / Math.max(msg.length, 1)), y: 156, w: Math.min(24, (W - 20) / Math.max(msg.length, 1) - 2), h: 30, t: ch === ' ' ? '␣' : ch, cls: n === res.length - 1 && fromHi ? 'pick' : '' }));
        if (m === 'x') {
          const cipher = msg;
          F.push(Object.assign({ h: H }, strip(0, null), { items: strip(0, null).items, line: 1, out: '', text: `Someone gave us the secret message <code>${PP.esc(cipher)}</code> but not the key. There are only <strong>25</strong> possible keys, so try <strong>all of them</strong> and look for the one that reads like English.`, vars: [['key', 0]] }));
          for (let kk = 1; kk <= 25; kk++) {
            const dec = shiftText(cipher, -kk);
            const words = dec.toUpperCase().split(/[^A-Z]+/).filter((w) => w && WORDS.includes(w));
            const hit = words.length > 0;
            const S = strip((26 - kk) % 26, null);
            F.push({ h: H, items: S.items.concat(outTok([...dec])), marks: S.marks, line: [5, 6], out: dec, hold: hit ? 2.2 : 0.55, vars: [['key', kk], ['decrypted', dec]], text: hit ? `Key <strong>${kk}</strong> gives <code>${PP.esc(dec)}</code>: <strong>that reads as English!</strong> This is the key. Only 25 tries were needed: a Caesar cipher is very weak.` : `Key ${kk}: <code>${PP.esc(dec)}</code> - gibberish.` });
          }
          return { frames: F, code, note };
        }
        const s = m === 'e' ? k : (26 - k) % 26;
        const base = strip(0, null);
        F.push({ h: H, items: base.items, marks: base.marks, line: 1, out: '', vars: [['key', k], ['shift', 0]], text: `A Caesar cipher <strong>${m === 'e' ? 'replaces each letter with the one' : 'undoes the shift: each letter is replaced by the one'} ${m === 'e' ? k : k} place${k === 1 ? '' : 's'} ${m === 'e' ? 'later' : 'earlier'}</strong> in the alphabet. Watch the bottom alphabet slide.` });
        const S1 = strip(s, null);
        F.push({ h: H, items: S1.items, marks: S1.marks, line: 5, out: '', vars: [['key', k], ['shift', s]], text: k === 0 || k === 26 ? '<strong>Key 0 does not move the alphabet at all</strong>, so every letter is replaced by itself.' : `The bottom alphabet slides <strong>${s}</strong> place${s === 1 ? '' : 's'} to the left. Now every letter on top sits above its ${m === 'e' ? 'cipher' : 'plain'} letter.`, hold: 1.4 });
        const res = [];
        [...msg].forEach((ch) => {
          const u = ch.toUpperCase(), i = ALPHA.indexOf(u);
          if (i < 0) {
            res.push(ch);
            F.push({ h: H, items: S1.items.concat(outTok(res)), marks: S1.marks, line: [7, 8], out: res.join(''), vars: [['ch', JSON.stringify(ch)], ['isalpha', 'False']], text: `<code>${PP.esc(JSON.stringify(ch))}</code> is <strong>not a letter</strong>, so it is copied across unchanged.` });
            return;
          }
          const ni = (i + s) % 26, wrap = i + s >= 26;
          const out = ch === u ? ALPHA[ni] : ALPHA[ni].toLowerCase();
          const S2 = strip(s, i);
          res.push(out);
          F.push({
            h: H, items: S2.items.concat(outTok(res, true)), marks: S2.marks, line: [3, 4, 5, 6], out: res.join(''), vars: [['ch', ch], ['pos', i], ['(pos + shift) % 26', ni], ['result', res.join('')]],
            text: `<code>${ch}</code> is position <strong>${i}</strong> (A = 0). <code>(${i} + ${s}) % 26 = ${ni}</code> → <strong>${out}</strong>.${wrap ? ' <strong>It wrapped round past Z back to the start.</strong>' : ''}${ch !== u ? ' (Lower case is kept.)' : ''}`
          });
        });
        const finalS = strip(s, null);
        F.push({ h: H, items: finalS.items.concat(outTok(res).map((o) => Object.assign(o, { cls: 'done' }))), marks: finalS.marks, line: 6, out: res.join(''), vars: [['result', res.join('')]], hold: 2, text: `Result: <code>${PP.esc(res.join(''))}</code>. To ${m === 'e' ? 'decrypt, run the same code with the key <code>26 - key</code> (or choose Decrypt).' : 'encrypt again, use the original key.'}` });
        return { frames: F, code, note };
      },
    });
    [text, key].forEach((e) => onEnter(e, run));
    mode.addEventListener('change', run);
    return stage.el;
  };

  /* =====================================================================
     Run-length encoding
     ===================================================================== */
  V.rle = function (b) {
    const text = inp(b.text || 'WWWWBBBWWWWWWWBB', 26, { maxlength: 26, 'aria-label': 'Data to compress' });
    let stage;
    const run = () => stage.rebuild();
    const set = (t) => { text.value = t; run(); };
    stage = new PP.Stage({
      title: b.title || 'Run-length encoding: count the repeats', caption: b.caption, quiz: true, output: true, aria: 'Animated run-length encoding',
      legend: [['cmp', 'Comparing'], ['pick', 'Current run'], ['done', 'Written to result']],
      controls: [field('Data (up to 26 characters)', text), h('button', { class: 'btn', onclick: () => set(Array.from({ length: 4 }, () => 'WBGR'[Math.floor(Math.random() * 4)].repeat(1 + Math.floor(Math.random() * 5))).join('')) }, 'Random')],
      presets: [{ label: 'Long runs', apply: () => set('WWWWBBBWWWWWWWBB') }, { label: 'No repeats (grows!)', apply: () => set('ABCDEF') }, { label: 'One long run', apply: () => set('AAAAAAAAAAAAAA') }, { label: 'Single character', apply: () => set('Q') }, { label: 'Run of 12 (two digits)', apply: () => set('XXXXXXXXXXXXYZ') }, { label: 'Contains digits', apply: () => set('AA111BB') }, { label: 'Upper vs lower case', apply: () => set('aaAAaa') }, { label: 'Empty', apply: () => set('') }],
      edge: '* **No repeats:** every run has length 1, so `ABC` becomes `1A1B1C`, **twice as long**. RLE only helps when there are **long runs**.\n* **One long run** compresses best: 14 A\'s become `14A`.\n* **Runs of 10 or more** need a multi-digit count (`12X`), which a simple decoder must handle.\n* **Digits in the data** make decoding ambiguous: is `31` "three 1s" or "thirty-one"? That is why RLE suits data like pixels, not arbitrary text.\n* **Case matters:** `a` and `A` are different characters, so `aaAAaa` is three runs.\n* **Empty input:** nothing to encode, so the result is empty. The code needs a guard so `text[-1]` is not read.\n* **The last run** must be written after the loop, because the loop only writes a run when it sees a *different* character.',
      build: (W) => {
        const t = text.value;
        if (t === '') return { error: '**Empty data.** There are no characters, so there are no runs and the encoded result is empty (`""`). The code must check `if text:` before using `text[-1]`, otherwise it crashes with an `IndexError`.' };
        const n = t.length;
        const sw = Math.max(16, Math.min(36, (W - 24) / n)), x0 = Math.max(6, (W - sw * n) / 2), H = 292;
        const code = ['result = ""', 'count = 1', 'for i in range(1, len(text)):', '    if text[i] == text[i - 1]:', '        count += 1', '    else:', '        result += str(count) + text[i - 1]', '        count = 1', 'if text:', '    result += str(count) + text[-1]'];
        const F = [];
        const done = Array(n).fill(false);
        const runStart = { v: 0 };
        let result = [], count = 1, i = 1;
        const tokensOut = () => result.map((r, k) => ({ id: 'rt' + k, k: 'tok', x: 10 + r.x, y: 170, w: r.w, h: 34, t: r.t, cls: 'done', from: r.from }));
        const barUnit = Math.max(4, Math.min(16, (W - 120) / Math.max(n, 6)));
        const snap = (o) => {
          const items = [];
          for (let k = 0; k < n; k++) items.push({ id: 'c' + k, k: 'box', x: x0 + k * sw + 1, y: 56, w: sw - 2, h: 38, t: t[k], cls: done[k] ? 'done' : (o.cmp && o.cmp.includes(k) ? 'cmp' : (k >= runStart.v && k < (o.runEnd != null ? o.runEnd : i) ? 'pick' : '')) });
          const out = tokensOut();
          const lenOut = result.reduce((s, r) => s + r.t.length, 0);
          items.push(...out);
          items.push({ id: 'bo', k: 'box', x: 96, y: 232, w: n * barUnit, h: 20, t: String(n), cls: 'pick' });
          items.push({ id: 'bc', k: 'box', x: 96, y: 258, w: Math.max(lenOut, 0.0001) * barUnit, h: 20, t: lenOut ? String(lenOut) : '', cls: o.final ? (lenOut < n ? 'done' : (lenOut === n ? '' : 'bad')) : 'swp', op: lenOut ? 1 : 0.2 });
          const marks = [{ id: 'l1', k: 'lbl strong', x: 4, y: 40, w: 200, h: 14, t: 'data' }, { id: 'l2', k: 'lbl strong', x: 4, y: 154, w: 200, h: 14, t: 'result so far', cls: '' }, { id: 'l3', k: 'lbl strong', x: 4, y: 234, w: 90, h: 16, t: 'original' }, { id: 'l4', k: 'lbl strong', x: 4, y: 260, w: 90, h: 16, t: 'compressed' }];
          if (o.ptr != null) marks.push({ id: 'pi', k: 'ptr', x: x0 + o.ptr * sw, y: 96, w: sw, h: 30, html: '<span>▲</span><b>i</b>' });
          if (o.ptr != null && o.ptr - 1 >= 0) marks.push({ id: 'pp', k: 'ptr', x: x0 + (o.ptr - 1) * sw, y: 96, w: sw, h: 30, html: '<span>▲</span><b>i-1</b>', cls: 'swp' });
          F.push({ h: H, items, marks, line: o.line, text: o.text, ask: o.ask, hold: o.hold, out: result.map((r) => r.t).join(''), vars: [['i', o.ptr == null ? '-' : o.ptr], ['count', count], ['result', '"' + result.map((r) => r.t).join('') + '"']] });
        };
        const tw = (s) => Math.max(26, s.length * 12 + 12);
        const place = () => { let x = 0; result.forEach((r) => { r.x = x; r.w = tw(r.t); x += r.w + 4; }); };
        snap({ line: [1, 2], ptr: null, text: `<strong>Run-length encoding</strong> replaces each run of identical characters with <em>how many</em> followed by <em>which character</em>. Start with <code>count = 1</code> for the first character, <code>${PP.esc(t[0])}</code>.`, runEnd: 1 });
        for (i = 1; i < n; i++) {
          const same = t[i] === t[i - 1];
          snap({ line: [3, 4], ptr: i, cmp: [i, i - 1], runEnd: i, text: `Is <code>text[${i}] == text[${i - 1}]</code>? <code>${PP.esc(t[i])} == ${PP.esc(t[i - 1])}</code> is <strong>${same ? 'True' : 'False'}</strong>.`, ask: { q: `Compare <code>${PP.esc(t[i])}</code> with the one before it, <code>${PP.esc(t[i - 1])}</code>. What happens?`, opts: ['Same: add 1 to count', 'Different: write the run'], ans: same ? 0 : 1 } });
          if (same) { count++; snap({ line: 5, ptr: i, runEnd: i + 1, text: `Same character, so the run gets longer: <code>count = ${count}</code>.` }); }
          else {
            const piece = String(count) + t[i - 1];
            for (let k = runStart.v; k < i; k++) done[k] = true;
            result.push({ t: piece, x: 0, w: 0, from: { x: 10 + (x0 + runStart.v * sw), y: 56, op: 0 } }); place();
            snap({ line: [6, 7], ptr: i, runEnd: i, text: `Different! The run of <strong>${count}</strong> × <code>${PP.esc(t[i - 1])}</code> is over. Write <code>str(count) + text[i - 1]</code> = <strong>${PP.esc(piece)}</strong> into the result.` });
            count = 1; runStart.v = i;
            snap({ line: 8, ptr: i, runEnd: i + 1, text: `Start counting the new run: <code>count = 1</code>.` });
          }
        }
        const piece = String(count) + t[n - 1];
        for (let k = runStart.v; k < n; k++) done[k] = true;
        result.push({ t: piece, x: 0, w: 0, from: { x: 10 + (x0 + runStart.v * sw), y: 56, op: 0 } }); place();
        snap({ line: [9, 10], ptr: null, runEnd: n, text: `The loop ends while the <strong>last run</strong> is still unwritten, so after the loop: <code>result += str(count) + text[-1]</code> = <strong>${PP.esc(piece)}</strong>.` });
        const enc = result.map((r) => r.t).join('');
        snap({ line: 10, final: true, runEnd: n, hold: 2, text: `<strong>${PP.esc(enc)}</strong>: ${n} characters became ${enc.length}. ${enc.length < n ? `Saved ${n - enc.length} (${Math.round((1 - enc.length / n) * 100)}% smaller).` : enc.length === n ? 'No saving at all.' : `<strong>The data got ${enc.length - n} longer!</strong> RLE only helps when there are long runs.`}` });
        const notes = [];
        if (/\d/.test(t)) notes.push('Your data contains <strong>digits</strong>, so the result cannot be decoded reliably: is <code>31</code> "three 1s" or "thirty-one"?');
        if (result.some((r) => r.t.length > 2 && /^\d{2,}/.test(r.t))) notes.push('A run of 10 or more gives a <strong>multi-digit count</strong>, so a decoder must read all the digits before the character.');
        return { frames: F, code, note: notes.join(' ') };
      },
    });
    onEnter(text, run);
    return stage.el;
  };

  /* =====================================================================
     Memory visualiser: real Python, real tracer
     ===================================================================== */
  const MEM_PRESETS = {
    'Variables and updates': 'x = 5\ny = x\nx = x + 1\nname = "Asha"\nname = name + "!"\nprint(x, y, name)',
    'Swap two values': 'a = 4\nb = 9\ntemp = a\na = b\nb = temp\nprint(a, b)',
    'Loop with a total': 'total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)',
    'while loop': 'count = 3\nwhile count > 0:\n    count = count - 1\nprint("done")',
    'List changes': 'nums = [10, 20, 30]\nnums.append(40)\nnums[0] = 99\nlast = nums.pop()\nprint(nums)',
    'Two names, one list (aliasing)': 'a = [1, 2, 3]\nb = a\na.append(4)\nprint(b)\nc = a.copy()\nc.append(5)',
    'Function call': 'def double(n):\n    result = n * 2\n    return result\n\nanswer = double(7)\nprint(answer)',
    'Strings are immutable': 'word = "cat"\nupper = word.upper()\nword = word + "s"\nprint(word, upper)',
  };
  V.memory = function (b) {
    const preset = b.preset && MEM_PRESETS[b.preset] ? b.preset : 'Variables and updates';
    const ta = h('textarea', { class: 'vin an-ta an-code-ta', rows: 7, spellcheck: 'false', 'aria-label': 'Python code to visualise', autocapitalize: 'off' });
    ta.value = b.code || MEM_PRESETS[preset];
    const sel = h('select', { class: 'sel', 'aria-label': 'Example programs' }, h('option', { value: '' }, 'Load an example…'), Object.keys(MEM_PRESETS).map((k) => h('option', { value: k }, k)));
    let trace = null, running = false;
    let stage;
    const lines = () => ta.value.replace(/\s+$/, '').split('\n');
    function go() {
      if (running) return;
      running = true; trace = null; stage.rebuild({ autoplay: false });
      PP.runner.run({ mode: 'trace', code: ta.value, inputs: [], echo: false }, { timeout: 8000 }).then((res) => { running = false; trace = res; stage.rebuild(); });
    }
    stage = new PP.Stage({
      title: b.title || 'Memory visualiser: see what Python stores', liveInputs: false, caption: b.caption, quiz: false, output: true, vars: false, aria: 'Animated variable boxes',
      code: () => lines(),
      legend: [['new', 'New variable'], ['chg', 'Value just changed']],
      controls: [field('Your own Python (module-level code, no input()): the picture updates as you type', ta), sel],
      edge: '* **A variable is a labelled box** holding a value. Reassigning replaces the value: the old one is gone.\n* **`y = x` copies the value** for numbers and strings: changing `x` later does not change `y`.\n* **Lists are different:** `b = a` makes **two names for the same list**. The badge (A, B…) shows names that share one list, so `a.append(4)` also changes `b`. Use `a.copy()` to get a separate list.\n* **Strings never change in place:** methods like `.upper()` give a **new** string.\n* **Loops:** watch the loop variable and totals change on every repeat.\n* **Functions:** the second column shows the function\'s own **local** variables, which vanish when it returns.\n* **Errors** stop the animation at the line that failed. **`input()`** cannot be used here: replace it with a value.',
      build: (W) => {
        const src = lines();
        const L = (n) => (src[n - 1] || '').trim();
        if (running) return { frames: [{ h: 90, items: [], marks: [], line: null, text: 'Running your code…' }], code: src };
        if (!trace) return { frames: [{ h: 90, items: [], marks: [], line: null, text: 'Press <strong>Visualise my code</strong>.' }], code: src };
        if (trace.timeout) return { error: '**Your code took too long** (8 seconds). It may have an infinite loop. Try a smaller example.' };
        if (trace.need !== null && trace.need !== undefined) return { error: '**This visualiser cannot ask for input.** Your code calls <code>input()</code>. Replace it with a fixed value, for example <code>age = 15</code>.' };
        if (trace.error && trace.error.type === 'SyntaxError' || (trace.error && /^(IndentationError|TabError)/.test(trace.error.type))) return { error: `**${PP.esc(trace.error.type)}** on line ${trace.error.line}: ${PP.esc(trace.error.msg)}. Fix the code and visualise again.` };
        const steps = trace.trace || [];
        if (!steps.length) return { error: 'Nothing ran. Type some Python code first.' };
        const order = [], lorder = [];
        steps.forEach((s) => { Object.keys(s.glob).forEach((k) => { if (!order.includes(k)) order.push(k); }); if (s.loc) Object.keys(s.loc).forEach((k) => { if (!lorder.includes(s.fn + ':' + k)) lorder.push(s.fn + ':' + k); }); });
        const cols = W < 480 ? 1 : 2;
        const bw = Math.floor((W - 12 - (cols - 1) * 12) / cols), bh = 62;
        const parse = (r) => {
          if (typeof r !== 'string') return null;
          if (r.length > 1 && r[0] === '[' && r[r.length - 1] === ']' && !r.endsWith('...]')) {
            const inner = r.slice(1, -1); const parts = []; let depth = 0, cur = '', q2 = null;
            for (const ch of inner) { if (q2) { cur += ch; if (ch === q2) q2 = null; continue; } if (ch === '"' || ch === "'") { q2 = ch; cur += ch; continue; } if ('[({'.includes(ch)) depth++; if ('])}'.includes(ch)) depth--; if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch; }
            if (cur.trim() !== '') parts.push(cur.trim());
            return parts;
          }
          return null;
        };
        const F = [];
        const hasOut = steps.length ? steps[steps.length - 1].out : 0;
        const stdout = trace.stdout || '';
        const html = (name, val, tag) => { const cells = parse(val); return `<div class="vn"><span>${PP.esc(name)}</span>${tag ? `<span class="tag">${tag}</span>` : ''}</div><div class="vv">${cells ? (cells.length ? cells.map((c2) => `<i>${PP.esc(c2)}</i>`).join('') : '<em>empty list</em>') : PP.esc(val)}</div>`; };
        let prev = null;
        steps.forEach((s, si) => {
          // alias tags
          const groups = {};
          Object.keys(s.gid || {}).forEach((k) => { (groups[s.gid[k]] = groups[s.gid[k]] || []).push(k); });
          const tagOf = {}; let ti = 0;
          Object.values(groups).filter((g) => g.length > 1).forEach((g) => { const letter = String.fromCharCode(65 + ti++); g.forEach((k) => { tagOf[k] = letter; }); });
          const items = []; const marks = [];
          const globs = order.filter((k) => s.glob[k] !== undefined);
          globs.forEach((k, idx) => {
            const changed = prev && prev.glob[k] !== undefined && prev.glob[k] !== s.glob[k];
            const isNew = !prev ? true : prev.glob[k] === undefined;
            const col = idx % cols, row = Math.floor(idx / cols);
            items.push({ id: 'v_' + k, k: 'var', x: 6 + col * (bw + 12), y: 26 + row * (bh + 12), w: bw, h: bh, html: html(k, s.glob[k], tagOf[k]), cls: si > 0 && changed ? 'chg' : (si > 0 && isNew ? 'new' : ''), from: isNew && si > 0 ? { x: 6 + col * (bw + 12), y: 26 + row * (bh + 12) - 18, op: 0 } : undefined });
          });
          const rowsUsed = Math.ceil(globs.length / cols);
          marks.push({ id: 'gt', k: 'lbl strong', x: 6, y: 4, w: 160, h: 18, t: 'Global variables' });
          let y2 = 26 + rowsUsed * (bh + 12) + 6;
          if (s.loc) {
            marks.push({ id: 'ft', k: 'lbl strong', x: 6, y: y2, w: 220, h: 18, t: `Inside ${s.fn}()` });
            y2 += 22;
            Object.keys(s.loc).forEach((k, idx) => {
              const col = idx % cols, row = Math.floor(idx / cols);
              const pl = prev && prev.fn === s.fn && prev.loc ? prev.loc[k] : undefined;
              items.push({ id: 'l_' + s.fn + '_' + k, k: 'var', x: 6 + col * (bw + 12), y: y2 + row * (bh + 12), w: bw, h: bh, html: html(k, s.loc[k], null), cls: pl === undefined ? 'new' : (pl !== s.loc[k] ? 'chg' : ''), from: pl === undefined ? { x: 6 + col * (bw + 12), y: y2 + row * (bh + 12) - 14, op: 0 } : undefined });
            });
            y2 += Math.ceil(Object.keys(s.loc).length / cols) * (bh + 12);
          }
          // narration: effect of previous line
          const diffs = [];
          if (prev) {
            Object.keys(s.glob).forEach((k) => { if (prev.glob[k] === undefined) diffs.push(`<code>${PP.esc(k)}</code> is created with the value <strong>${PP.esc(s.glob[k])}</strong>`); else if (prev.glob[k] !== s.glob[k]) diffs.push(`<code>${PP.esc(k)}</code> changed from ${PP.esc(prev.glob[k])} to <strong>${PP.esc(s.glob[k])}</strong>`); });
          }
          const aliasNote = Object.values(groups).filter((g) => g.length > 1).map((g) => `<strong>${g.map((k) => PP.esc(k)).join(' and ')}</strong> are two names for the <strong>same list</strong>`).join('; ');
          const isLast = s.kind === 'return' && !s.fn;
          let text;
          const done = si > 0 ? steps[si - 1] : null;
          if (si === 0) text = 'Nothing has run yet. Press <strong>Play</strong> (or Next) to run the first line.';
          else if (s.kind === 'return' && s.fn) text = `<code>${PP.esc(s.fn)}()</code> is returning <strong>${PP.esc(s.ret)}</strong>. Its local variables disappear once it has returned.`;
          else text = `<strong>Line ${done.line}</strong> <code>${PP.esc(L(done.line))}</code> just ran. ` + (diffs.length ? diffs.join('; ') + '.' : 'No variable changed.') + (isLast ? ' <strong>The program has finished.</strong>' : '');
          if (aliasNote) text += `<br>${aliasNote}.`;
          F.push({ h: Math.max(130, y2 + 12), items, marks, line: si === 0 ? null : steps[si - 1].line, text, out: stdout.slice(0, s.out), hold: 1 });
          prev = s;
        });
        if (trace.error) F.push(Object.assign({}, F[F.length - 1], { line: trace.error.line, text: `<strong>${PP.esc(trace.error.type)}:</strong> ${PP.esc(trace.error.msg)}${trace.error.line ? ` (line ${trace.error.line})` : ''}. The program stops here.`, hold: 2 }));
        return { frames: F, code: src, note: trace.truncated === 'steps' ? 'The animation stops after 1500 steps. Use fewer loop repeats to see the whole run.' : '' };
      },
    });
    let typing;
    ta.addEventListener('input', () => { clearTimeout(typing); typing = setTimeout(go, 700); });
    sel.addEventListener('change', () => { if (sel.value) { ta.value = MEM_PRESETS[sel.value]; sel.value = ''; go(); } });
    setTimeout(go, 200);
    return stage.el;
  };
})();

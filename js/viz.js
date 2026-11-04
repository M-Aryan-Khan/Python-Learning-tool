/* Visual explainers, part 1: shared helpers, bubble sort, searching, merge sort.
 * Block: {t:'viz', kind:'bubble'|'search'|'merge'|…, title?, caption?, …options}
 * Every explainer is built on PP.Stage (js/anim.js): real motion, autoplay, linked code, narration, quiz mode.
 */
(function () {
  const { h } = PP;
  const ui = PP.ui;
  const A = PP.anim;
  const V = (PP.viz = {});

  /* ---------- tiny form helpers ---------- */
  const inp = (v, w, extra) => h('input', Object.assign({ type: 'text', value: v, size: w || 14, class: 'vin', spellcheck: 'false', autocomplete: 'off', inputmode: 'text' }, extra || {}));
  const field = (label, el) => h('label', { class: 'vf' }, h('span', null, label), el);
  const check = (label, el) => h('label', { class: 'vf vf-inline' }, el, h('span', null, label));
  const applyBtn = (fn, label) => h('button', { class: 'btn primary', onclick: fn }, label || 'Animate');
  const onEnter = (el, fn) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); fn(); } });
  const rnd = (n, lo, hi) => Array.from({ length: n }, () => lo + Math.floor(Math.random() * (hi - lo + 1)));
  const join = (a) => '[' + a.join(', ') + ']';

  ui.extra.viz = function (b) {
    const f = V[b.kind];
    return f ? f(b) : h('p', null, '[unknown explainer ' + b.kind + ']');
  };

  /* =====================================================================
     BUBBLE SORT
     ===================================================================== */
  function bubbleFrames(arr, W, early) {
    const n = arr.length, sw = A.slot(n, W, 62, 30), x0 = A.x0(n, W, sw), H = 268, base = 178;
    const mn = Math.min(...arr), mx = Math.max(...arr);
    const bh = (v) => (mx === mn ? 82 : 26 + ((v - mn) / (mx - mn)) * 120);
    const ord = arr.map((v, i) => ({ id: 'e' + i, v }));
    const code = early
      ? ['n = len(nums)', 'for p in range(n - 1):', '    swapped = False', '    for j in range(n - 1 - p):', '        if nums[j] > nums[j + 1]:', '            nums[j], nums[j + 1] = nums[j + 1], nums[j]', '            swapped = True', '    if not swapped:', '        break']
      : ['n = len(nums)', 'for p in range(n - 1):', '    for j in range(n - 1 - p):', '        if nums[j] > nums[j + 1]:', '            nums[j], nums[j + 1] = nums[j + 1], nums[j]'];
    const L = early ? { n: 1, outer: 2, flag: 3, inner: 4, cmp: 5, swap: 6, set: 7, chk: 8, brk: 9 } : { n: 1, outer: 2, inner: 3, cmp: 4, swap: 5 };
    let comps = 0, swaps = 0;
    const F = [];
    function snap(o) {
      const items = ord.map((e, s) => ({ id: e.id, k: 'bar', x: x0 + s * sw + 3, y: base - bh(e.v), w: sw - 6, h: bh(e.v), t: String(e.v), cls: s >= o.sorted ? 'done' : (o.hi && o.hi.includes(s) ? (o.cls || 'cmp') : '') }));
      const marks = ord.map((_, s) => ({ id: 'ix' + s, k: 'lbl', x: x0 + s * sw, y: base + 5, w: sw, h: 16, t: String(s) }));
      if (o.hi) o.hi.forEach((pos, q) => marks.push({ id: q ? 'pj1' : 'pj', k: 'ptr', x: x0 + pos * sw, y: base + 24, w: sw, h: 34, html: `<span>▲</span><b>${q ? 'j+1' : 'j'}</b>`, cls: o.cls === 'swp' ? 'swp' : '' }));
      if (o.sorted < n) marks.push({ id: 'srt', k: 'brk', x: x0 + o.sorted * sw + 2, y: base + 62, w: (n - o.sorted) * sw - 4, h: 26, t: 'sorted: final place', cls: 'done' });
      F.push({ h: H, items, marks, line: o.line, text: o.text, ask: o.ask, hold: o.hold, vars: [['n', n], ['p', o.p == null ? '-' : o.p], ['j', o.j == null ? '-' : o.j], ['comparisons', comps], ['swaps', swaps]].concat(early ? [['swapped', o.sw == null ? '-' : o.sw]] : []) });
    }
    snap({ sorted: n, line: L.n, text: `The list has <strong>${n}</strong> items. Bubble sort makes repeated passes. Each pass compares neighbours and swaps them when the left one is bigger.` });
    let finished = false, passes = 0;
    for (let p = 0; p < n - 1 && !finished; p++) {
      passes++;
      const sorted = n - p;
      snap({ sorted, p, line: L.outer, text: `<strong>Pass ${p + 1}.</strong> Compare each neighbouring pair, left to right. The biggest unsorted value will bubble to position ${n - 1 - p}.` });
      let swapped = false;
      if (early) snap({ sorted, p, sw: 'False', line: L.flag, text: 'Before the pass, assume nothing will need swapping: <code>swapped = False</code>.' });
      for (let j = 0; j < n - 1 - p; j++) {
        comps++;
        const a = ord[j].v, bb = ord[j + 1].v, need = a > bb;
        snap({
          sorted, p, j, sw: early ? (swapped ? 'True' : 'False') : null, hi: [j, j + 1], cls: 'cmp', line: L.cmp,
          text: `Is <code>${a} > ${bb}</code>? <strong>${need ? 'Yes' : 'No'}</strong> - ${need ? 'they are in the wrong order, so swap them.' : (a === bb ? 'they are equal, so leave them (equal values are never swapped).' : 'they are already in order, so leave them.')}`,
          ask: { q: `Neighbours <code>${a}</code> and <code>${bb}</code>. Does bubble sort swap them?`, opts: ['Yes, swap', 'No, leave'], ans: need ? 0 : 1 }
        });
        if (need) {
          swaps++; swapped = true;
          const t = ord[j]; ord[j] = ord[j + 1]; ord[j + 1] = t;
          snap({ sorted, p, j, sw: early ? 'False' : null, hi: [j, j + 1], cls: 'swp', line: L.swap, text: `Swap: <code>${bb}</code> moves left and <code>${a}</code> moves right. The list is now ${join(ord.map((e) => e.v))}.` });
          if (early) snap({ sorted, p, j, sw: 'True', hi: [j, j + 1], cls: 'swp', line: L.set, text: 'Remember that a swap happened: <code>swapped = True</code>.' });
        }
      }
      snap({ sorted: n - 1 - p, p, line: L.inner, sw: early ? (swapped ? 'True' : 'False') : null, text: `End of pass ${p + 1}: <strong>${ord[n - 1 - p].v}</strong> is now in its final place (shaded).` });
      if (early) {
        snap({ sorted: n - 1 - p, p, sw: swapped ? 'True' : 'False', line: L.chk, text: swapped ? '<code>swapped</code> is True, so something moved. Do another pass.' : '<code>swapped</code> is False: <strong>nothing moved in that whole pass</strong>, so the list must already be sorted.' });
        if (!swapped) { snap({ sorted: 0, p, line: L.brk, text: '<code>break</code> leaves the loop early. This is the efficiency improvement.' }); finished = true; }
      }
    }
    const worst = (n * (n - 1)) / 2;
    snap({ sorted: 0, line: L.n, text: `<strong>Sorted:</strong> ${join(ord.map((e) => e.v))}. It took ${passes} pass${passes === 1 ? '' : 'es'}, <strong>${comps}</strong> comparisons and <strong>${swaps}</strong> swaps. The most comparisons possible for ${n} items is ${worst}.`, hold: 2 });
    return { frames: F, code };
  }

  V.bubble = function (b) {
    const st = { text: (b.data || [5, 2, 9, 1, 7, 3]).join(', '), early: !!b.early };
    const data = inp(st.text, 24, { 'aria-label': 'List to sort' });
    const early = h('input', { type: 'checkbox' });
    early.checked = st.early;
    let stage;
    const run = () => stage.rebuild();
    const set = (t, e) => { data.value = t; if (e !== undefined) early.checked = e; run(); };
    stage = new PP.Stage({
      title: b.title || 'Bubble sort, one comparison at a time', caption: b.caption, quiz: true, output: false,
      aria: 'Animated bubble sort',
      code: () => (early.checked ? bubbleFrames([2, 1], 300, true).code : bubbleFrames([2, 1], 300, false).code),
      legend: [['cmp', 'Comparing'], ['swp', 'Swapping'], ['done', 'In final place']],
      controls: [field('Your list (numbers, commas)', data), check('Stop early if no swaps', early), h('button', { class: 'btn', onclick: () => set(rnd(7, -20, 60).join(', ')) }, 'Random list')],
      presets: [
        { label: 'Reversed (worst case)', apply: () => set('9, 7, 5, 3, 1') },
        { label: 'Already sorted + early stop', apply: () => set('1, 2, 3, 4, 5, 6', true) },
        { label: 'Duplicates', apply: () => set('4, 2, 4, 1, 2') },
        { label: 'Negatives', apply: () => set('3, -1, -5, 0, 2') },
        { label: 'All equal', apply: () => set('6, 6, 6, 6') },
        { label: 'One item', apply: () => set('7') },
        { label: 'Empty', apply: () => set('') },
      ],
      edge: '* **Already sorted:** without the early-stop flag the program still does every comparison. Tick *Stop early* and try the sorted preset: one pass, no swaps, finished.\n* **Reversed list:** every comparison causes a swap: the slowest case.\n* **Duplicates and equal values:** `>` means equal neighbours are **not** swapped. Using `>=` would swap them pointlessly.\n* **One item or an empty list:** the loops run zero times and nothing happens. The code does not crash.\n* **Negative numbers** work exactly the same: only the order matters.',
      build: (W) => {
        const raw = data.value.trim();
        if (raw === '') return { error: '**The list is empty.** Python still runs the code: `range(n - 1)` with n = 0 is empty, so nothing is compared and nothing is swapped. There is nothing to animate. Type some numbers to see a sort.' };
        const r = A.parseNums(raw, { max: 12, range: [-999, 9999] });
        if (r.error) return { error: r.error };
        const arr = r.values;
        if (arr.length === 1) return { note: 'A list with one item is already sorted, so the loops do nothing.', frames: [{ h: 130, items: [{ id: 'e0', k: 'bar', x: W / 2 - 28, y: 30, w: 56, h: 60, t: String(arr[0]), cls: 'done' }], line: 1, text: 'With <code>n = 1</code>, <code>range(n - 1)</code> is <code>range(0)</code>: the outer loop never runs. One item is already sorted.', vars: [['n', 1]] }], code: bubbleFrames([2, 1], 300, early.checked).code };
        return bubbleFrames(arr, W, early.checked);
      },
    });
    [data].forEach((e) => onEnter(e, run));
    early.addEventListener('change', run);
    return stage.el;
  };

  /* =====================================================================
     SEARCHING (linear + binary)
     ===================================================================== */
  function searchFrames(arr, t, W, mode, note) {
    const n = arr.length, sw = A.slot(n, W, 62, 34), x0 = A.x0(n, W, sw), H = 226, by = 74, bh = 46;
    const F = [];
    let comps = 0;
    const binary = mode === 'binary';
    const code = binary
      ? ['low = 0', 'high = len(nums) - 1', 'while low <= high:', '    mid = (low + high) // 2', '    if nums[mid] == target:', '        return mid', '    elif nums[mid] < target:', '        low = mid + 1', '    else:', '        high = mid - 1', 'return -1']
      : ['for i in range(len(nums)):', '    if nums[i] == target:', '        return i', 'return -1'];
    function snap(o) {
      const items = arr.map((v, k) => {
        let cls = '';
        if (o.found === k) cls = 'found';
        else if (binary) cls = o.low != null && !o.nowin && (k < o.low || k > o.high) ? 'out' : (k === o.mid ? 'cmp' : '');
        else cls = k === o.i ? 'cmp' : (o.i != null && k < o.i ? 'seen' : '');
        return { id: 'c' + k, k: 'box', x: x0 + k * sw + 2, y: by, w: sw - 4, h: bh, t: String(v), cls };
      });
      const marks = arr.map((_, k) => ({ id: 'ix' + k, k: 'lbl', x: x0 + k * sw, y: by + bh + 4, w: sw, h: 16, t: String(k) }));
      if (binary && o.low != null && o.low <= o.high) marks.push({ id: 'win', k: 'brk', x: x0 + o.low * sw + 1, y: by + bh + 54, w: (o.high - o.low + 1) * sw - 2, h: 24, t: 'search window' });
      if (binary && o.low != null) {
        if (o.low <= n) marks.push({ id: 'plow', k: 'ptr', x: x0 + Math.min(o.low, n - 1) * sw, y: by + bh + 22, w: sw, h: 30, html: '<span>▲</span><b>low</b>' });
        if (o.high >= 0 && o.high < n) marks.push({ id: 'phigh', k: 'ptr', x: x0 + o.high * sw, y: by + bh + 22, w: sw, h: 30, html: '<span>▲</span><b>high</b>', cls: o.high === o.low ? '' : '' });
        if (o.mid != null && o.mid >= 0 && o.mid < n) marks.push({ id: 'pmid', k: 'ptr', x: x0 + o.mid * sw, y: by - 34, w: sw, h: 30, html: '<b>mid</b><span>▼</span>', cls: o.found === o.mid ? '' : 'swp' });
      }
      if (!binary && o.i != null && o.i < n) marks.push({ id: 'pi', k: 'ptr', x: x0 + o.i * sw, y: by - 34, w: sw, h: 30, html: '<b>i</b><span>▼</span>' });
      F.push({ h: H, items, marks, line: o.line, text: o.text, ask: o.ask, hold: o.hold, vars: o.vars || [] });
    }
    const tgt = `target = ${t}`;
    if (binary) {
      let low = 0, high = n - 1;
      snap({ line: 1, low: 0, nowin: true, text: `We are looking for <strong>${t}</strong> in a sorted list of ${n} items. Binary search keeps a <em>search window</em>. It starts with <code>low = 0</code>.`, vars: [['target', t], ['low', 0]] });
      snap({ line: 2, low, high, text: `<code>high = len(nums) - 1 = ${high}</code>. The window covers the whole list.`, vars: [['target', t], ['low', low], ['high', high]] });
      let found = -1;
      while (low <= high) {
        snap({ line: 3, low, high, text: `<code>low (${low}) <= high (${high})</code> is True, so something is left to search: <strong>${high - low + 1}</strong> item${high - low ? 's' : ''}.`, vars: [['target', t], ['low', low], ['high', high], ['comparisons', comps]] });
        const mid = Math.floor((low + high) / 2), m = arr[mid];
        snap({ line: 4, low, high, mid, text: `Look at the middle: <code>mid = (${low} + ${high}) // 2 = ${mid}</code>, which holds <strong>${m}</strong>.`, vars: [['target', t], ['low', low], ['high', high], ['mid', mid], ['comparisons', comps]] });
        comps++;
        const rel = m === t ? 0 : (m < t ? 1 : 2);
        snap({
          line: rel === 0 ? 5 : (rel === 1 ? 7 : 9), low, high, mid, vars: [['target', t], ['low', low], ['high', high], ['mid', mid], ['nums[mid]', m], ['comparisons', comps]],
          text: rel === 0 ? `<code>${m} == ${t}</code>: <strong>found it!</strong>` : (rel === 1 ? `<code>${m} < ${t}</code>: the middle is too small, so the target must be in the <strong>right</strong> half.` : `<code>${m} > ${t}</code>: the middle is too big, so the target must be in the <strong>left</strong> half.`),
          ask: { q: `The middle value is <code>${m}</code> and the target is <code>${t}</code>. What should we do?`, opts: ['It is equal: found', 'Target is bigger: search right', 'Target is smaller: search left'], ans: rel }
        });
        if (rel === 0) { found = mid; snap({ line: 6, low, high, mid, found: mid, text: `<code>return ${mid}</code>. Found <strong>${t}</strong> at index ${mid} after only <strong>${comps}</strong> comparison${comps === 1 ? '' : 's'}. Linear search could need up to ${n}.`, vars: [['target', t], ['mid', mid], ['comparisons', comps]], hold: 2 }); break; }
        if (rel === 1) { low = mid + 1; snap({ line: 8, low, high, text: `<code>low = mid + 1 = ${low}</code>. Everything up to index ${mid} is thrown away without looking at it.`, vars: [['target', t], ['low', low], ['high', high], ['comparisons', comps]] }); }
        else { high = mid - 1; snap({ line: 10, low, high, text: `<code>high = mid - 1 = ${high}</code>. Everything from index ${mid} on is thrown away.`, vars: [['target', t], ['low', low], ['high', high], ['comparisons', comps]] }); }
      }
      if (found < 0) snap({ line: 11, low, high, text: `<code>low (${low}) <= high (${high})</code> is now False: the window is empty. <strong>${t} is not in the list</strong>, so the function returns <code>-1</code> after ${comps} comparison${comps === 1 ? '' : 's'}.`, vars: [['target', t], ['low', low], ['high', high], ['comparisons', comps]], hold: 2 });
    } else {
      let found = -1;
      for (let i = 0; i < n; i++) {
        comps++;
        const hit = arr[i] === t;
        snap({ line: 2, i, vars: [['target', t], ['i', i], ['nums[i]', arr[i]], ['comparisons', comps]], text: `<code>nums[${i}] == ${t}</code> → <code>${arr[i]} == ${t}</code> is <strong>${hit ? 'True' : 'False'}</strong>.${hit ? '' : ' Move on to the next item.'}`, ask: { q: `Is <code>nums[${i}]</code> (which is <code>${arr[i]}</code>) equal to the target <code>${t}</code>?`, opts: ['Yes', 'No'], ans: hit ? 0 : 1 } });
        if (hit) { found = i; snap({ line: 3, i, found: i, vars: [['target', t], ['i', i], ['comparisons', comps]], text: `<code>return ${i}</code>. Found at index <strong>${i}</strong> after ${comps} comparison${comps === 1 ? '' : 's'}. (Linear search stops at the <em>first</em> match.)`, hold: 2 }); break; }
      }
      if (found < 0) snap({ line: 4, vars: [['target', t], ['comparisons', comps]], text: `The loop ended without a match, so <code>return -1</code>. We had to check <strong>all ${n}</strong> items to be sure ${t} is not there.`, hold: 2 });
    }
    return { frames: F, code, note };
  }

  V.search = function (b) {
    const mode = h('select', { class: 'sel', 'aria-label': 'Algorithm' }, h('option', { value: 'binary' }, 'Binary search'), h('option', { value: 'linear' }, 'Linear search'));
    mode.value = b.mode || 'binary';
    const data = inp((b.data || [3, 8, 12, 17, 21, 26, 34, 40]).join(', '), 24, { 'aria-label': 'List to search' });
    const target = inp(b.target !== undefined ? b.target : 26, 5, { 'aria-label': 'Target value' });
    const raw = h('input', { type: 'checkbox' });
    let stage;
    const run = () => stage.rebuild();
    const set = (d, t, m, r) => { data.value = d; target.value = t; if (m) mode.value = m; if (r !== undefined) raw.checked = r; run(); };
    stage = new PP.Stage({
      title: b.title || 'Searching: how many looks does it take?', caption: b.caption, quiz: true, aria: 'Animated search',
      code: () => searchFrames([1, 2], 2, 300, mode.value, '').code,
      legend: [['cmp', 'Being checked'], ['out', 'Ruled out'], ['found', 'Found']],
      controls: [field('Algorithm', mode), field('List (numbers, commas)', data), field('Find', target), check('Do not sort my list', raw)],
      presets: [
        { label: 'Target is first', apply: () => set('3, 8, 12, 17, 21, 26, 34, 40', 3) },
        { label: 'Target is last', apply: () => set('3, 8, 12, 17, 21, 26, 34, 40', 40) },
        { label: 'Target is missing', apply: () => set('3, 8, 12, 17, 21, 26, 34, 40', 15) },
        { label: 'Duplicates', apply: () => set('2, 5, 5, 5, 9, 12', 5) },
        { label: 'One item', apply: () => set('7', 7) },
        { label: 'Empty list', apply: () => set('', 4) },
        { label: 'Unsorted list breaks binary search', apply: () => set('9, 2, 14, 5, 20, 1, 7', 2, 'binary', true) },
        { label: 'Big list: 1000 items (summary)', apply: () => set('', 'big') },
      ],
      edge: '* **First or last item:** linear search finds the first item in one look, the last only after checking everything. Binary search is quick on both.\n* **Missing target:** linear search must check **every** item. Binary search ends when `low > high` (the window is empty).\n* **Duplicates:** linear search returns the **first** match. Binary search returns whichever copy it lands on.\n* **Unsorted data:** binary search **assumes sorted data**. Tick *Do not sort my list* and run it: it can discard the half that holds the target and wrongly return `-1`.\n* **Empty list:** `high = len(nums) - 1 = -1`, so `low <= high` is False straight away.\n* **Big lists:** with 1000 items binary search needs at most 10 looks. With 1 000 000 items, at most 20.',
      build: (W) => {
        if (String(target.value).trim().toLowerCase() === 'big') {
          const n = 1000, steps = Math.floor(Math.log2(n)) + 1;
          return { error: `**1000 sorted items.** Linear search could need up to **1000** looks. Binary search needs at most **${steps}**, because each look halves the window: 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1. Doubling the list adds only <strong>one</strong> extra look.` };
        }
        const r = A.parseNums(data.value.trim(), { max: 14, range: [-999, 9999] });
        if (r.error) return { error: r.error };
        let arr = r.values;
        const t = String(target.value).trim();
        if (!/^-?\d+(\.\d+)?$/.test(t)) return { error: 'The value to find must be a number, for example <code>26</code>.' };
        if (arr.length === 0) return { error: `**The list is empty.** ${mode.value === 'binary' ? '`high = len(nums) - 1 = -1`, so `low <= high` (0 <= -1) is False immediately' : '`range(len(nums))` is `range(0)`, so the loop never runs'}, and the function returns <code>-1</code>: not found. No comparisons are made.` };
        let note = '';
        if (mode.value === 'binary' && arr.some((v, i) => i && v < arr[i - 1])) {
          if (!raw.checked) { arr = arr.slice().sort((x, y) => x - y); note = 'Binary search only works on **sorted** data, so your list was sorted first. Tick <em>Do not sort my list</em> to see what goes wrong.'; }
          else note = '**Warning:** this list is not sorted. Binary search assumes smaller values are on the left, so it can throw away the wrong half and give a wrong answer.';
        }
        return searchFrames(arr, +t, W, mode.value, note);
      },
    });
    [data, target].forEach((e) => onEnter(e, run));
    mode.addEventListener('change', run);
    return stage.el;
  };

  /* =====================================================================
     MERGE SORT
     ===================================================================== */
  function mergeFrames(arr, W) {
    const n = arr.length;
    const mk = (lo, hi, d) => { const nd = { lo, hi, d }; if (hi - lo > 1) { const m = Math.floor((lo + hi) / 2); nd.l = mk(lo, m, d + 1); nd.r = mk(m, hi, d + 1); } return nd; };
    const root = mk(0, n, 0);
    const all = [];
    (function walk(nd) { all.push(nd); if (nd.l) { walk(nd.l); walk(nd.r); } })(root);
    const D = Math.max(...all.map((x) => x.d));
    const leafDepth = Array(n).fill(0);
    all.filter((x) => !x.l).forEach((x) => { leafDepth[x.lo] = x.d; });
    const groupsAt = Array.from({ length: D + 1 }, (_, r) => all.filter((x) => x.d === r).sort((a, b) => a.lo - b.lo));
    const maxG = Math.max(...groupsAt.map((g) => g.length));
    const sw = A.slot(n, W - (maxG - 1) * 12, 54, 26), gap = 12;
    const x0 = Math.max(4, (W - (n * sw + (maxG - 1) * gap)) / 2);
    const rowH = 60, yRow = (r) => 16 + r * rowH, H = 16 + (D + 1) * rowH + 18;
    const xOf = (row, slot) => { const g = groupsAt[row].findIndex((x) => slot >= x.lo && slot < x.hi); return x0 + slot * sw + Math.max(0, g) * gap; };
    const tk = arr.map((v, i) => ({ id: 't' + i, v, row: 0, slot: i, i }));
    for (let i = 0; i < n; i++) tk[i].row = 0;
    const code = ['def merge_sort(a):', '    if len(a) <= 1:', '        return a', '    mid = len(a) // 2', '    left = merge_sort(a[:mid])', '    right = merge_sort(a[mid:])', '    return merge(left, right)', '', 'def merge(left, right):', '    result = []', '    i = j = 0', '    while i < len(left) and j < len(right):', '        if left[i] <= right[j]:', '            result.append(left[i]); i += 1', '        else:', '            result.append(right[j]); j += 1', '    result += left[i:] + right[j:]', '    return result'];
    const F = [];
    let shown = [];   // nodes whose group box is displayed
    function snap(o) {
      const items = tk.map((t) => ({ id: t.id, k: 'tok', x: xOf(t.row, t.slot) + 2, y: yRow(t.row), w: sw - 4, h: 40, t: String(t.v), cls: (o.cls && o.cls[t.id]) || '' }));
      const marks = shown.map((nd, q) => ({ id: 'g' + nd.lo + '_' + nd.hi, k: 'grp', x: xOf(nd.d, nd.lo) - 3, y: yRow(nd.d) - 4, w: (nd.hi - nd.lo) * sw + 2, h: 48, cls: (o.gcls && o.gcls[nd.lo + '_' + nd.hi]) || '' }));
      (o.ptrs || []).forEach((p) => marks.push({ id: p.id, k: 'ptr', x: xOf(p.t.row, p.t.slot), y: yRow(p.t.row) + 42, w: sw, h: 30, html: `<span>▲</span><b>${p.label}</b>` }));
      F.push({ h: H, items, marks, line: o.line, text: o.text, ask: o.ask, hold: o.hold, vars: o.vars || [] });
    }
    const V0 = (a) => '[' + a.map((t) => t.v).join(', ') + ']';
    // ---- split phase
    shown = [root];
    snap({ line: 1, text: `We start with <strong>one group</strong> holding all ${n} items: ${join(arr)}. Merge sort works by <em>divide and conquer</em>: split, sort the halves, merge them.` });
    for (let d = 1; d <= D; d++) {
      shown = all.filter((x) => x.d === d || (!x.l && x.d < d));
      tk.forEach((t) => { t.row = Math.min(d, leafDepth[t.i]); });
      snap({ line: [4, 5, 6], text: d < D ? `<strong>Split</strong> each group with more than one item into two halves (<code>mid = len(a) // 2</code>).` : `One more split. Each remaining group is cut in half again.` });
    }
    snap({ line: [2, 3], text: 'Every group now holds <strong>one item</strong>. A list of one item is already sorted: that is the <strong>base case</strong> (<code>if len(a) <= 1: return a</code>). Now we merge back up.', hold: 1.3 });
    // ---- merge phase
    const listOf = new Map();
    all.filter((x) => !x.l).forEach((x) => listOf.set(x, [tk[x.lo]]));
    for (let d = D - 1; d >= 0; d--) {
      for (const nd of groupsAt[d].filter((x) => x.l)) {
        const Lt = listOf.get(nd.l).slice(), Rt = listOf.get(nd.r).slice();
        const res = [];
        let i = 0, j = 0;
        const key = nd.lo + '_' + nd.hi;
        shown = shown.concat([nd]);
        const vv = () => [['left', V0(Lt)], ['right', V0(Rt)], ['result', V0(res)], ['i', i], ['j', j]];
        snap({ line: 7, gcls: { [key]: 'cmp' }, text: `<strong>Merge</strong> the sorted groups <code>${V0(Lt)}</code> and <code>${V0(Rt)}</code> into one sorted group.`, vars: vv() });
        while (i < Lt.length && j < Rt.length) {
          const a = Lt[i], c = Rt[j], takeLeft = a.v <= c.v, taken = takeLeft ? a : c;
          snap({
            line: 13, gcls: { [key]: 'cmp' }, cls: { [a.id]: 'cmp', [c.id]: 'cmp' }, ptrs: [{ id: 'pi', t: a, label: 'i' }, { id: 'pj', t: c, label: 'j' }], vars: vv(),
            text: `Compare the front of each side: <code>${a.v} <= ${c.v}</code> is <strong>${takeLeft ? 'True' : 'False'}</strong>, so take <strong>${taken.v}</strong> from the ${takeLeft ? 'left' : 'right'}.${a.v === c.v ? ' (Equal: the left one goes first, which keeps equal items in their original order.)' : ''}`,
            ask: { q: `Front of the left side is <code>${a.v}</code>, front of the right side is <code>${c.v}</code>. Which goes into the merged group first?`, opts: [`${a.v} (left)`, `${c.v} (right)`], ans: takeLeft ? 0 : 1 }
          });
          taken.row = d; taken.slot = nd.lo + res.length; res.push(taken);
          if (takeLeft) i++; else j++;
          snap({ line: takeLeft ? 14 : 16, gcls: { [key]: 'cmp' }, cls: { [taken.id]: 'swp' }, vars: vv(), text: `<strong>${taken.v}</strong> moves up into the merged group. <code>result = ${V0(res)}</code>` });
        }
        const rest = Lt.slice(i).concat(Rt.slice(j));
        if (rest.length) {
          rest.forEach((t) => { t.row = d; t.slot = nd.lo + res.length; res.push(t); });
          i = Lt.length; j = Rt.length;
          snap({ line: 17, gcls: { [key]: 'cmp' }, cls: Object.fromEntries(rest.map((t) => [t.id, 'swp'])), vars: vv(), text: `One side has run out, so the rest of the other side is already in order: copy <code>${V0(rest)}</code> across.` });
        }
        listOf.set(nd, res);
        shown = shown.filter((x) => x !== nd.l && x !== nd.r);
        snap({ line: 18, gcls: { [key]: 'done' }, cls: Object.fromEntries(res.map((t) => [t.id, d === 0 ? 'done' : ''])), vars: vv(), text: `Merged group: <code>${V0(res)}</code>.${d === 0 ? ' That is the whole list, sorted!' : ''}`, hold: d === 0 ? 2 : 1 });
      }
    }
    return { frames: F, code };
  }

  V.merge = function (b) {
    const data = inp((b.data || [38, 27, 43, 3, 9, 82, 10]).join(', '), 24, { 'aria-label': 'List to sort' });
    let stage;
    const run = () => stage.rebuild();
    const set = (t) => { data.value = t; run(); };
    stage = new PP.Stage({
      title: b.title || 'Merge sort: split, then merge', caption: b.caption, quiz: true, aria: 'Animated merge sort',
      code: () => mergeFrames([2, 1], 300).code,
      legend: [['cmp', 'Being compared'], ['swp', 'Moving up'], ['done', 'Sorted']],
      controls: [field('Your list (numbers, commas)', data), h('button', { class: 'btn', onclick: () => set(rnd(7, 1, 99).join(', ')) }, 'Random list')],
      presets: [
        { label: 'Odd length (7)', apply: () => set('38, 27, 43, 3, 9, 82, 10') },
        { label: 'Already sorted', apply: () => set('1, 2, 3, 4, 5, 6') },
        { label: 'Reversed', apply: () => set('8, 7, 6, 5, 4, 3, 2, 1') },
        { label: 'Duplicates', apply: () => set('5, 3, 5, 1, 3, 1') },
        { label: 'Two items', apply: () => set('9, 4') },
        { label: 'One item', apply: () => set('4') },
        { label: 'Empty', apply: () => set('') },
      ],
      edge: '* **Odd lengths:** the halves are not equal (e.g. 3 and 4). `len(a) // 2` rounds down.\n* **Already sorted or reversed:** merge sort does about the same amount of work: it always splits all the way down.\n* **Duplicates:** `<=` takes the left value on a tie, so equal items stay in their original order (a *stable* sort).\n* **One item or none:** this is the base case. The function returns straight away.\n* **Cost:** merge sort needs about `n × log₂ n` steps, far fewer than bubble sort for big lists, but it uses extra memory for the merged lists.',
      build: (W) => {
        const raw = data.value.trim();
        if (raw === '') return { error: '**Empty list.** `len(a) <= 1` is True, so `merge_sort([])` just returns `[]` (the base case). Nothing to split or merge.' };
        const r = A.parseNums(raw, { max: 10, range: [-999, 9999] });
        if (r.error) return { error: r.error };
        if (r.values.length === 1) return { frames: [{ h: 110, items: [{ id: 't0', k: 'tok', x: W / 2 - 24, y: 30, w: 48, h: 40, t: String(r.values[0]), cls: 'done' }], line: [2, 3], text: 'One item: <code>len(a) <= 1</code> is True, so it is returned as it is. A list of one is already sorted.', vars: [['a', join(r.values)]] }], code: mergeFrames([2, 1], 300).code };
        return mergeFrames(r.values, W);
      },
    });
    onEnter(data, run);
    return stage.el;
  };
})();

/* Animation engine used by every explainer.
 *
 * A visualiser describes its animation as a list of FRAMES. Every frame is a full snapshot:
 *   { h, items:[{id,k,x,y,w,h,t|html,cls,op,from,click}], marks:[…same…], line, text, vars, out, code, ask, hold }
 * The Stage keeps one DOM element per item id and moves it with CSS transitions between frames, so
 * things genuinely slide, grow and fade instead of jumping. It also provides play / pause / step / back /
 * speed / scrubber, keyboard control, autoplay when scrolled into view, linked code highlighting,
 * a variables panel, narration, an optional "predict the next step" quiz mode, and respects reduced motion.
 */
(function () {
  const { h } = PP;
  const ui = PP.ui;
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const esc = PP.esc;

  const ICON = {
    first: 'M5 4v16M19 5l-9 7 9 7z',
    prev: 'M16 5l-9 7 9 7z',
    next: 'M8 5l9 7-9 7z',
    last: 'M19 4v16M5 5l9 7-9 7z',
    play: 'M7 4l13 8-13 8z',
    pause: 'M7 4v16M17 4v16',
    replay: 'M4 12a8 8 0 1 0 3-6.2M4 4v5h5',
  };
  function icon(name) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', '16'); s.setAttribute('height', '16'); s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', ICON[name]);
    const filled = name === 'play' || name === 'prev' || name === 'next';
    p.setAttribute('fill', filled ? 'currentColor' : 'none'); p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '2.2'); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    s.append(p);
    return s;
  }
  PP.icon = icon;

  PP.Stage = function (cfg) {
    let frames = [], idx = 0, playing = false, timer = null, speed = 1, quiz = false;
    let W = 0, started = false, userTouched = false, lastVarsKey = '', lastCodeKey = '', askDone = new Set();
    let score = { ok: 0, n: 0 }, erroring = false, askFor = -1, resumeAfterAsk = false, curCode = null;
    const els = new Map();

    const stage = h('div', { class: 'an-stage', role: 'img', 'aria-label': cfg.aria || cfg.title || 'Animation' });
    const wrap = h('div', { class: 'an-stagewrap' }, stage);
    const nar = h('div', { class: 'an-nar', 'aria-live': 'off' });
    const askBox = h('div', { class: 'an-ask', hidden: true });
    const errBox = h('div', { class: 'an-err', hidden: true });
    const noteBox = h('div', { class: 'an-note', hidden: true });

    /* transport */
    const bFirst = h('button', { class: 'an-b', 'aria-label': 'Back to start', title: 'Back to start (Home)', onclick: () => { touch(); pause(); go(0, { fast: true }); } }, icon('first'));
    const bPrev = h('button', { class: 'an-b', 'aria-label': 'Previous step', title: 'Previous step (←)', onclick: () => { touch(); pause(); go(idx - 1); } }, icon('prev'));
    const bPlay = h('button', { class: 'an-b an-play', 'aria-label': 'Play', title: 'Play / pause (Space)', onclick: () => { touch(); togglePlay(); } }, icon('play'));
    const bNext = h('button', { class: 'an-b', 'aria-label': 'Next step', title: 'Next step (→)', onclick: () => { touch(); pause(); go(idx + 1); } }, icon('next'));
    const bLast = h('button', { class: 'an-b', 'aria-label': 'Jump to the end', title: 'Jump to the end (End)', onclick: () => { touch(); pause(); go(frames.length - 1, { fast: true }); } }, icon('last'));
    const range = h('input', { type: 'range', min: 0, max: 0, value: 0, 'aria-label': 'Animation position', class: 'an-range' });
    const count = h('span', { class: 'an-count' });
    const spd = h('select', { class: 'an-speed', 'aria-label': 'Speed', onchange: (e) => { speed = +e.target.value; setDur(); } },
      [[0.5, 'Slow'], [1, 'Normal'], [2, 'Fast'], [4, 'Very fast']].map(([v, l]) => h('option', { value: v, selected: v === 1 }, l)));
    const quizBox = cfg.quiz ? h('label', { class: 'an-quiz' }, h('input', { type: 'checkbox', onchange: (e) => { quiz = e.target.checked; touch(); score = { ok: 0, n: 0 }; askDone = new Set(); updateScore(); if (quiz) { pause(); go(Math.max(0, idx)); } else { askBox.hidden = true; nar.hidden = false; } } }), h('span', null, 'Quiz me')) : null;
    const scoreEl = h('span', { class: 'an-score', hidden: true });
    const transport = h('div', { class: 'an-transport' }, bFirst, bPrev, bPlay, bNext, bLast, range, count, spd, quizBox, scoreEl);

    /* side panels */
    const codeEl = h('div', { class: 'an-code', 'aria-label': 'Python code' });
    const varsEl = h('div', { class: 'an-vars' });
    const outEl = h('pre', { class: 'an-out', hidden: true });
    const right = h('div', { class: 'an-right' },
      cfg.code ? h('div', { class: 'an-panel' }, h('div', { class: 'an-ph' }, 'Python'), codeEl) : null,
      cfg.vars !== false ? h('div', { class: 'an-panel' }, h('div', { class: 'an-ph' }, 'Variables'), varsEl) : null,
      cfg.output ? h('div', { class: 'an-panel' }, h('div', { class: 'an-ph' }, 'Output'), outEl) : null);

    const legend = cfg.legend ? h('div', { class: 'an-legend' }, cfg.legend.map(([c, l]) => h('span', { class: 'an-lg' }, h('i', { class: 'an-sw s-' + c }), l))) : null;
    const left = h('div', { class: 'an-left' }, wrap, errBox, nar, askBox, transport, legend, noteBox);
    const main = h('div', { class: 'an-main' + (cfg.code || cfg.vars !== false || cfg.output ? '' : ' an-solo') }, left, right);
    const presets = cfg.presets && cfg.presets.length ? h('div', { class: 'an-presets' }, h('span', { class: 'an-tl' }, 'Try'), cfg.presets.map((p) => h('button', { class: 'an-chip', title: p.hint || '', onclick: () => { touch(); p.apply(); } }, p.label))) : null;
    const edge = cfg.edge ? h('details', { class: 'an-edge' }, h('summary', null, 'Edge cases and what to notice'), h('div', { html: ui.rich(cfg.edge) })) : null;
    const root = h('figure', { class: 'viz an', tabindex: -1 },
      h('div', { class: 'viz-head' }, h('span', { class: 'viz-kind' }, 'Animation'), h('span', { class: 'viz-title' }, cfg.title)),
      h('div', { class: 'viz-body' }, cfg.controls ? h('div', { class: 'an-controls' }, cfg.controls) : null, presets, main, edge),
      cfg.caption ? h('figcaption', { class: 'viz-cap', html: ui.rich(cfg.caption) }) : null);

    function touch() { userTouched = true; }
    function setDur() { root.style.setProperty('--dur', (RM ? 0 : Math.round(420 / speed)) + 'ms'); }
    setDur();

    /* ---------- apply one frame ---------- */
    function applyFrame(f, fast) {
      root.style.setProperty('--dur', (RM ? 0 : fast ? 100 : Math.round(420 / speed)) + 'ms');
      if (f.h) stage.style.height = f.h + 'px';
      const seen = new Set();
      [].concat(f.items || [], f.marks || []).forEach((it, order) => {
        seen.add(it.id);
        let el = els.get(it.id);
        if (!el) {
          el = h('div', { class: 'an-i' });
          els.set(it.id, el);
          stage.append(el);
          const fx = it.from ? it.from.x : it.x, fy = it.from ? it.from.y : it.y;
          el.style.transform = `translate(${fx}px,${fy}px)`;
          el.style.width = (it.w || 0) + 'px'; el.style.height = (it.h || 0) + 'px';
          el.style.opacity = it.from && it.from.op !== undefined ? it.from.op : 0;
          void el.offsetWidth;
        }
        el.className = 'an-i k-' + (it.k || 'box') + (it.cls ? ' ' + it.cls.split(' ').map((c) => 's-' + c).join(' ') : '');
        const key = it.html != null ? 'h' + it.html : 't' + (it.t == null ? '' : it.t);
        if (el._key !== key) { if (it.html != null) el.innerHTML = it.html; else el.textContent = it.t == null ? '' : it.t; el._key = key; }
        el.style.transform = `translate(${it.x}px,${it.y}px)`;
        if (it.w != null) el.style.width = it.w + 'px';
        if (it.h != null) el.style.height = it.h + 'px';
        el.style.opacity = it.op !== undefined ? it.op : 1;
        el.style.zIndex = it.z != null ? it.z : (it.k === 'ptr' || it.k === 'lbl' ? 3 : (it.k === 'grp' || it.k === 'line' || it.k === 'tick' ? 1 : 2));
        el.onclick = it.click || null;
        el.style.cursor = it.click ? 'pointer' : '';
        if (it.click) { el.setAttribute('role', 'button'); el.tabIndex = 0; el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.click(); } }; } else { el.removeAttribute('role'); el.removeAttribute('tabindex'); el.onkeydown = null; }
      });
      els.forEach((el, id) => {
        if (!seen.has(id)) {
          el.classList.add('an-gone');
          setTimeout(() => { if (el.classList.contains('an-gone')) { el.remove(); if (els.get(id) === el) els.delete(id); } }, 650);
        }
      });

      /* code */
      const code = f.code || curCode;
      if (code) {
        const ck = code.join('\n');
        if (ck !== lastCodeKey) {
          lastCodeKey = ck;
          codeEl.replaceChildren(...code.map((ln, i) => h('div', { class: 'an-cl' }, h('span', { class: 'n' }, String(i + 1)), h('span', { class: 't' }, ln === '' ? ' ' : ln))));
        }
        const act = [].concat(f.line == null ? [] : f.line);
        [...codeEl.children].forEach((c, i) => c.classList.toggle('on', act.includes(i + 1)));
        const on = codeEl.querySelector('.on');
        if (on) { const top = on.offsetTop; if (top < codeEl.scrollTop || top > codeEl.scrollTop + codeEl.clientHeight - 30) codeEl.scrollTop = Math.max(0, top - 40); }
      }
      /* variables */
      const vs = f.vars ? (Array.isArray(f.vars) ? f.vars : Object.entries(f.vars)) : [];
      const vk = JSON.stringify(vs);
      if (cfg.vars !== false && vk !== lastVarsKey) {
        let prev = {};
        try { JSON.parse(lastVarsKey || '[]').forEach(([k, v]) => { prev[k] = v; }); } catch (e) { prev = {}; }
        lastVarsKey = vk;
        varsEl.replaceChildren(vs.length ? h('table', null, vs.map(([k, v]) => h('tr', { class: prev[k] !== undefined && prev[k] !== v || prev[k] === undefined ? 'chg' : '' }, h('th', null, k), h('td', null, String(v))))) : h('p', { class: 'an-none' }, 'No variables yet'));
      }
      if (cfg.output) { outEl.hidden = false; outEl.textContent = f.out || ''; }
      /* narration / question */
      renderNarration(f);
    }

    function renderNarration(f) {
      const asking = quiz && f.ask && !askDone.has(idx);
      askBox.hidden = !asking;
      nar.hidden = asking;
      if (asking) {
        askFor = idx;
        const a = f.ask;
        askBox.replaceChildren(h('div', { class: 'an-q', html: ui.rich(a.q) }),
          h('div', { class: 'an-opts' }, a.opts.map((o, i) => h('button', { class: 'btn small', onclick: () => answer(i) }, o))),
          h('div', { class: 'an-fb' }));
        return;
      }
      nar.innerHTML = f.text ? ui.rich(f.text) : '';
      nar.setAttribute('aria-live', playing ? 'off' : 'polite');
    }

    function answer(i) {
      const f = frames[idx];
      if (!f || !f.ask || askDone.has(idx)) return;
      askDone.add(idx);
      score.n++;
      const ok = i === f.ask.ans;
      if (ok) score.ok++;
      updateScore();
      const fb = askBox.querySelector('.an-fb');
      [...askBox.querySelectorAll('.an-opts button')].forEach((b, k) => { b.disabled = true; if (k === f.ask.ans) b.classList.add('right'); else if (k === i) b.classList.add('wrong'); });
      fb.innerHTML = (ok ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> ') + ui.rich(f.text || '');
      fb.className = 'an-fb ' + (ok ? 'ok' : 'bad');
      if (resumeAfterAsk) { resumeAfterAsk = false; clearTimeout(timer); timer = setTimeout(() => { playing = true; syncPlay(); advance(); }, 2200 / speed); }
    }
    function updateScore() { scoreEl.hidden = !quiz || !score.n; scoreEl.textContent = `Score ${score.ok}/${score.n}`; }

    /* ---------- navigation ---------- */
    function syncPlay() {
      bPlay.replaceChildren(icon(playing ? 'pause' : (idx >= frames.length - 1 && frames.length > 1 ? 'replay' : 'play')));
      bPlay.setAttribute('aria-label', playing ? 'Pause' : (idx >= frames.length - 1 ? 'Replay' : 'Play'));
      bPrev.disabled = idx <= 0; bFirst.disabled = idx <= 0; bNext.disabled = idx >= frames.length - 1; bLast.disabled = idx >= frames.length - 1;
      bPlay.disabled = frames.length < 2;
      transport.classList.toggle('single', frames.length < 2);
    }
    function go(i, o) {
      if (!frames.length) return;
      o = o || {};
      const fast = o.fast || Math.abs(i - idx) > 1;
      idx = Math.max(0, Math.min(frames.length - 1, i));
      range.value = idx; count.textContent = `${idx + 1} / ${frames.length}`;
      applyFrame(frames[idx], fast);
      syncPlay();
      if (quiz && frames[idx].ask && !askDone.has(idx) && playing) { resumeAfterAsk = true; playing = false; clearTimeout(timer); syncPlay(); }
    }
    function advance() {
      clearTimeout(timer);
      if (!playing) return;
      if (idx >= frames.length - 1) { playing = false; syncPlay(); return; }
      go(idx + 1);
      if (!playing) return;           // paused for a question
      const f = frames[idx];
      timer = setTimeout(advance, (f.hold || 1) * 1250 / speed + 120);
    }
    function play() {
      if (frames.length < 2) return;
      if (idx >= frames.length - 1) go(0, { fast: true });
      playing = true; syncPlay();
      clearTimeout(timer);
      timer = setTimeout(advance, 450 / speed);
    }
    function pause() { playing = false; resumeAfterAsk = false; clearTimeout(timer); syncPlay(); renderNarration(frames[idx] || {}); }
    function togglePlay() { if (playing) pause(); else play(); }
    range.addEventListener('input', () => { touch(); pause(); go(+range.value, { fast: true }); });

    root.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input[type=text],input:not([type]),textarea,select')) return;
      if (e.key === ' ' && e.target === root || (e.key === ' ' && e.target === stage)) { e.preventDefault(); touch(); togglePlay(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); touch(); pause(); go(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); touch(); pause(); go(idx - 1); }
      else if (e.key === 'Home') { e.preventDefault(); touch(); pause(); go(0, { fast: true }); }
      else if (e.key === 'End') { e.preventDefault(); touch(); pause(); go(frames.length - 1, { fast: true }); }
    });
    stage.tabIndex = 0;

    /* ---------- (re)build ---------- */
    function clearStage() { els.forEach((el) => el.remove()); els.clear(); lastVarsKey = ''; lastCodeKey = ''; }
    function rebuild(o) {
      o = o || {};
      if (!W) W = Math.max(280, wrap.clientWidth || 600);
      let res;
      const effW = Math.max(W, cfg.minW || 0);
      stage.style.width = cfg.minW && W < cfg.minW ? cfg.minW + 'px' : '';
      wrap.style.overflowX = cfg.minW && W < cfg.minW ? 'auto' : '';
      try { res = cfg.build(effW); } catch (e) { res = { error: 'Something went wrong building this animation: ' + e.message }; }
      load(res, o);
    }
    function load(res, o) {
      o = o || {};
      noteBox.hidden = !res.note; if (res.note) noteBox.innerHTML = ui.rich(res.note);
      if (res.error) {
        erroring = true; frames = []; pause(); clearStage();
        errBox.hidden = false; errBox.innerHTML = ui.rich(res.error);
        nar.hidden = true; askBox.hidden = true; stage.style.height = '0px'; wrap.hidden = true; transport.classList.add('off');
        range.max = 0; count.textContent = '';
        codeEl.replaceChildren(); varsEl.replaceChildren(); lastCodeKey = ''; lastVarsKey = '';
        return;
      }
      curCode = res.code || (typeof cfg.code === 'function' ? cfg.code() : cfg.code) || null;
      erroring = false; errBox.hidden = true; wrap.hidden = false; transport.classList.remove('off');
      const keepIdx = o.keep ? idx : 0;
      const was = playing;
      clearTimeout(timer);
      frames = res.frames;
      if (!o.keep) { askDone = new Set(); score = { ok: 0, n: 0 }; updateScore(); }
      clearStage();
      range.max = Math.max(0, frames.length - 1);
      idx = Math.min(keepIdx, frames.length - 1);
      go(idx, { fast: true });
      playing = false; syncPlay();
      if (o.keep) { if (was) play(); }
      else if (o.autoplay !== false && !RM) { playing = true; syncPlay(); timer = setTimeout(advance, 600); }
    }

    /* responsive width + autoplay when scrolled into view */
    if (window.ResizeObserver) {
      let t;
      new ResizeObserver(() => {
        const w = wrap.clientWidth;
        root.classList.toggle('an-narrow', root.clientWidth < 760);
        if (!w || (W && Math.abs(w - W) < 8)) return;
        clearTimeout(t); t = setTimeout(() => { W = w; if (frames.length || erroring) rebuild({ keep: true }); }, 120);
      }).observe(wrap);
    }
    let vis = false;
    function maybeAuto() { /* animations never start on their own: the learner presses Play */ }
    if (window.IntersectionObserver) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          vis = en.isIntersecting && en.intersectionRatio >= 0.5;
          if (vis) maybeAuto();
          else if (!en.isIntersecting && playing && started && !userTouched) pause();
        });
      }, { threshold: [0, 0.5] }).observe(root);
    }

    /* initial build happens once the element is in the page (needs a measured width) */
    const mo = new MutationObserver(() => { if (document.body.contains(root)) { mo.disconnect(); requestAnimationFrame(() => { W = Math.max(280, wrap.clientWidth || 600); rebuild({ autoplay: false }); maybeAuto(); }); } });
    mo.observe(document.body, { childList: true, subtree: true });

    let rbT;
    const api = {
      el: root,
      rebuild: (o) => { touch(); clearTimeout(rbT); rbT = setTimeout(() => rebuild(Object.assign({ autoplay: cfg.autoplayOnChange === true }, o)), 30); },
      load: (res, o) => { touch(); load(res, Object.assign({ autoplay: cfg.autoplayOnChange === true }, o)); },
      get playing() { return playing; }, goTo: (i) => go(i),
    };
    /* no "Animate" button: the picture follows whatever the learner types or picks */
    if (cfg.liveInputs !== false && cfg.controls) {
      let lt;
      root.querySelectorAll('.an-controls input[type=text], .an-controls textarea').forEach((e) => e.addEventListener('input', () => { clearTimeout(lt); lt = setTimeout(() => api.rebuild(), 400); }));
      root.querySelectorAll('.an-controls select, .an-controls input[type=checkbox]').forEach((e) => e.addEventListener('change', () => api.rebuild()));
    }
    return api;
  };

  /* small shared layout helpers for explainers */
  PP.anim = {
    slot: (n, W, max, min) => Math.max(min || 34, Math.min(max || 64, (W - 16) / Math.max(n, 1))),
    x0: (n, W, sw) => Math.max(4, (W - n * sw) / 2),
    parseNums(s, opt) {
      opt = opt || {};
      const parts = String(s).split(/[,\s]+/).filter((x) => x !== '');
      const out = [];
      for (const p of parts) {
        if (!/^-?\d+(\.\d+)?$/.test(p)) return { error: `"${esc(p)}" is not a number. Type numbers separated by commas, for example <code>5, 2, 9</code>.` };
        out.push(+p);
      }
      if (opt.max && out.length > opt.max) return { error: `That is ${out.length} numbers. To keep the animation readable, please use at most ${opt.max}.` };
      if (opt.int && out.some((v) => !Number.isInteger(v))) return { error: 'Please use whole numbers (integers) here.' };
      if (opt.range && out.some((v) => v < opt.range[0] || v > opt.range[1])) return { error: `Please keep the numbers between ${opt.range[0]} and ${opt.range[1]}.` };
      return { values: out };
    },
  };
})();

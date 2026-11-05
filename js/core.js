/* Shared helpers: content registry, progress storage, DOM helper, friendly error text. */
window.PP = window.PP || {};

PP.modules = [];
PP.reference = [];
PP.addModule = (m) => { PP.modules.push(m); };

/* Tagged template for code and expected output: keeps backslashes literally
   (so "\n" stays \n for Python), removes the leading newline and common indent. */
PP.C = function (strings, ...vals) {
  let s = String.raw({ raw: strings.raw }, ...vals).replace(/^\r?\n/, '').replace(/\s+$/, '');
  const lines = s.split('\n');
  let min = Infinity;
  lines.forEach((l) => { if (l.trim()) min = Math.min(min, l.match(/^ */)[0].length); });
  if (!isFinite(min)) min = 0;
  return lines.map((l) => l.slice(min)).join('\n');
};
PP.addReference = (r) => { PP.reference.push(r); };

/* ---------- DOM ---------- */
PP.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

PP.h = function (tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
  }
  kids.flat(Infinity).forEach((c) => {
    if (c == null || c === false) return;
    e.append(c.nodeType ? c : document.createTextNode(c));
  });
  return e;
};

/* ---------- progress (localStorage, always wrapped) ---------- */
PP.store = (function () {
  /* Progress cache. One slot per signed-in student (so a shared lab PC never mixes two students up);
     the real record lives in the database. Guests have an empty, never-saved slot. */
  let user = 'guest';
  const keyFor = (u) => 'pythonpath.v2.' + u;
  let data = { done: {}, code: {}, play: null };
  let timer;
  const listeners = [];
  function load() {
    data = { done: {}, code: {}, play: null };
    if (user === 'guest') return;
    try { const raw = localStorage.getItem(keyFor(user)); if (raw) data = Object.assign(data, JSON.parse(raw)); } catch (e) { /* private mode */ }
  }
  function save() {
    if (user === 'guest') return;
    clearTimeout(timer);
    timer = setTimeout(() => { try { localStorage.setItem(keyFor(user), JSON.stringify(data)); } catch (e) { /* ignore */ } }, 250);
  }
  return {
    get user() { return user; },
    switchUser(u) { user = u || 'guest'; load(); listeners.forEach((f) => f(null)); },
    isDone: (id) => !!data.done[id],
    markDone(id, silent) { if (!data.done[id]) { data.done[id] = 1; save(); if (!silent) listeners.forEach((f) => f(id)); } },
    bulkDone(ids) { let n = 0; ids.forEach((id) => { if (!data.done[id]) { data.done[id] = 1; n++; } }); if (n) { save(); listeners.forEach((f) => f(null)); } },
    getCode: (id) => data.code[id],
    setCode(id, c) { if (user === 'guest') return; data.code[id] = c; save(); },
    clearCode(id) { delete data.code[id]; save(); },
    get play() { return data.play; },
    set play(v) { data.play = v; save(); },
    reset() { data = { done: {}, code: {}, play: null }; try { localStorage.removeItem(keyFor(user)); } catch (e) { /* ignore */ } listeners.forEach((f) => f(null)); },
    onChange: (f) => listeners.push(f),
  };
})();

/* ---------- lesson / activity bookkeeping ---------- */
PP.itemTypes = ['exercise', 'predict', 'quiz', 'sort', 'parsons', 'tracetable'];

PP.lessonItems = function (lesson) {
  const ids = [];
  lesson.blocks.forEach((b, i) => {
    if (PP.itemTypes.includes(b.t)) ids.push(b.id || `${lesson.id}:${i}`);
  });
  return ids;
};
PP.lessonProgress = function (lesson) {
  const ids = PP.lessonItems(lesson);
  const done = ids.filter((id) => PP.store.isDone(id)).length;
  if (!ids.length) return { done: PP.store.isDone(lesson.id) ? 1 : 0, total: 1 };
  return { done, total: ids.length };
};
PP.lessonComplete = (lesson) => { const p = PP.lessonProgress(lesson); return p.done >= p.total; };
PP.allLessons = function () {
  const out = [];
  PP.modules.forEach((m, mi) => m.lessons.forEach((l) => { out.push({ m, mi, l }); }));
  return out;
};
PP.overall = function () {
  let done = 0, total = 0;
  PP.allLessons().forEach(({ l }) => { const p = PP.lessonProgress(l); done += p.done; total += p.total; });
  return total ? Math.round((100 * done) / total) : 0;
};

/* ---------- friendly error explanations ---------- */
PP.explainError = function (e) {
  const t = e.type, m = e.msg || '';
  const rules = [
    [/SyntaxError/, /was never closed/, 'A bracket or quote was opened but never closed. Count your ( ) [ ] and quote marks on or above this line.'],
    [/SyntaxError/, /expected ':'/, 'Lines that start with if, elif, else, for, while, def or try must end with a colon <code>:</code>.'],
    [/SyntaxError/, /invalid syntax. Maybe you meant '=='/, 'To compare two values use <code>==</code>. A single <code>=</code> stores a value in a variable.'],
    [/SyntaxError/, /unterminated string/, 'A string was started with a quote mark but not finished. Add the closing quote on the same line.'],
    [/SyntaxError/, /unmatched/, 'There is a closing bracket with no matching opening bracket.'],
    [/IndentationError/, /expected an indented block/, 'After a line ending in a colon, the next line must be indented (4 spaces).'],
    [/IndentationError/, /unexpected indent/, 'This line is indented but nothing above it asked for an indent. Remove the extra spaces.'],
    [/IndentationError/, /unindent/, 'The indentation does not line up with an earlier line. Make lines in the same block start in the same column.'],
    [/SyntaxError/, /./, 'Python could not understand the shape of this line. Check for missing colons, brackets, quotes, or a misspelt keyword.'],
    [/NameError/, /./, 'Python does not know this name. Check the spelling (capital letters matter), and make sure the variable was created <em>before</em> this line runs.'],
    [/TypeError/, /can only concatenate str/, 'You tried to join a string and a number with <code>+</code>. Convert the number with <code>str()</code>, or use an f-string.'],
    [/TypeError/, /unsupported operand/, 'You tried to do arithmetic on values of the wrong type. <code>input()</code> always gives a string, so use <code>int()</code> or <code>float()</code> first.'],
    [/TypeError/, /not callable/, 'You put brackets after something that is not a function. Did you use a variable name that is also a function (like <code>sum</code> or <code>str</code>)?'],
    [/TypeError/, /missing \d+ required positional argument/, 'You called a function with too few arguments. Check how many values the <code>def</code> line expects.'],
    [/TypeError/, /takes \d+ positional argument/, 'You called a function with the wrong number of arguments.'],
    [/TypeError/, /object does not support item assignment/, 'Strings cannot be changed in place. Build a new string instead.'],
    [/TypeError/, /./, 'An operation was used with a value of the wrong type. Check what type each value is with <code>type()</code>.'],
    [/ValueError/, /invalid literal for int/, 'The text could not be turned into a whole number. <code>int()</code> only accepts digits like "42", not "4.5" or "hello".'],
    [/ValueError/, /could not convert string to float/, 'The text could not be turned into a decimal number.'],
    [/ValueError/, /./, 'The value has the right type but an unacceptable content.'],
    [/IndexError/, /string index/, 'You asked for a character position that does not exist. The last valid index is <code>len(text) - 1</code>.'],
    [/IndexError/, /./, 'You asked for a list position that does not exist. Indexes start at 0, so the last valid index is <code>len(list) - 1</code>.'],
    [/KeyError/, /./, 'That key is not in the dictionary.'],
    [/ZeroDivisionError/, /./, 'You divided (or used %) by zero. Check the value of the divisor before dividing.'],
    [/FileNotFoundError/, /./, 'Python could not find that file. Check the spelling of the file name, and that it exists in the same folder (mode <code>"r"</code> never creates a file).'],
    [/AttributeError/, /./, 'This value does not have that method or attribute. Check the spelling and the type of the value (a list has <code>.append</code>, a string does not).'],
    [/UnboundLocalError/, /./, 'You changed a variable inside a function that was created outside it. Either pass it in, return a new value, or declare it <code>global</code>.'],
    [/RecursionError/, /./, 'A function kept calling itself without stopping. Make sure there is a stopping case.'],
    [/EOFError/, /./, 'The program asked for more input than was available.'],
  ];
  for (const [te, me, text] of rules) if (te.test(t) && me.test(m)) return text;
  return '';
};

PP.norm = function (s, loose) {
  const lines = String(s).replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  let r = lines.join('\n');
  if (loose) r = r.toLowerCase().split(/\s+/).filter(Boolean).join(' ');
  return r;
};

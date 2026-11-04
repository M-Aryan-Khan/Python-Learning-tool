#!/usr/bin/env node
/* Verifies the whole course with REAL Python:
 *   node tools/verify.js [content/m05.js ...]      (no args = every file in content/)
 *  - every exercise's reference `solution` must pass all of its tests and `requires`
 *  - every exercise's `starter` must NOT already pass (otherwise it is not an exercise)
 *  - every runnable code block / case / predict must run without an error
 *    (unless it is marked  expectError: true)
 *  - quizzes, sorts, parsons, ids and structure are sanity checked
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const os = require('os');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
let files = args.length ? args : fs.readdirSync(path.join(root, 'content')).filter((f) => f.endsWith('.js')).sort().map((f) => path.join('content', f));

const ctx = vm.createContext({ console });
ctx.window = ctx;
vm.runInContext(fs.readFileSync(path.join(root, 'js', 'core.js'), 'utf8'), ctx, { filename: 'core.js' });
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { console.error(`LOAD ERROR in ${f}: ${e.message}`); process.exit(2); }
}
const PP = ctx.PP;

const problems = [];
const warn = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);
const jobs = [];
const stats = { lessons: 0, exercises: 0, predicts: 0, quizzes: 0, runnable: 0, blocks: 0 };
const seenIds = new Set();
const seenLessons = new Set();
const uniq = (id, where) => { if (seenIds.has(id)) bad(where, `duplicate id "${id}"`); seenIds.add(id); };

const lessonsOf = [];
PP.modules.forEach((m) => {
  if (!m.id || !m.title || !m.blurb) bad('module ' + m.id, 'needs id, title and blurb');
  m.lessons.forEach((l) => lessonsOf.push({ m, l }));
});
PP.reference.forEach((r) => lessonsOf.push({ m: { id: 'ref' }, l: { id: 'ref-' + r.id, title: r.title, blocks: r.blocks } }));

lessonsOf.forEach(({ m, l }) => {
  stats.lessons++;
  const where0 = `${m.id}/${l.id}`;
  if (seenLessons.has(l.id)) bad(where0, 'duplicate lesson id');
  seenLessons.add(l.id);
  if (!l.title || !Array.isArray(l.blocks) || !l.blocks.length) bad(where0, 'lesson needs title and blocks');
  l.blocks.forEach((b, i) => {
    stats.blocks++;
    const id = b.id || `${l.id}:${i}`;
    const where = `${where0} #${i} (${b.t}${b.title ? ' "' + b.title + '"' : ''})`;
    const needStr = (k) => { if (typeof b[k] !== 'string' || !b[k].trim()) bad(where, `missing ${k}`); };
    switch (b.t) {
      case 'code':
        needStr('code');
        stats.runnable++;
        jobs.push({ kind: 'run', where, code: b.code, inputs: b.stdin || [], files: b.files, expectError: !!b.expectError });
        break;
      case 'cases':
        if (!b.items || b.items.length < 2) bad(where, 'cases needs at least 2 items');
        (b.items || []).forEach((it, k) => {
          if (!it.label || !it.code) bad(where, `case ${k} needs label and code`);
          stats.runnable++;
          jobs.push({ kind: 'run', where: where + ` > ${it.label}`, code: it.code, inputs: it.stdin || [], files: it.files, expectError: !!it.expectError });
        });
        break;
      case 'predict':
        stats.predicts++; uniq(id, where); needStr('code');
        jobs.push({ kind: 'run', where, code: b.code, inputs: b.stdin || [], files: b.files, expectError: false, mustPrint: true });
        break;
      case 'quiz':
        stats.quizzes++; uniq(id, where); needStr('q');
        if (!Array.isArray(b.options) || b.options.length < 2) bad(where, 'quiz needs >=2 options');
        else {
          const ans = Array.isArray(b.answer) ? b.answer : [b.answer];
          if (!ans.length || ans.some((a) => !Number.isInteger(a) || a < 0 || a >= b.options.length)) bad(where, 'quiz answer index out of range');
        }
        if (!b.why) bad(where, 'quiz needs a why explanation');
        break;
      case 'sort':
        uniq(id, where);
        if (!b.cats || !b.items) bad(where, 'sort needs cats and items');
        else b.items.forEach((it, k) => { const c = typeof it.cat === 'number' ? it.cat : b.cats.indexOf(it.cat); if (!(c >= 0 && c < b.cats.length)) bad(where, `item ${k} has an invalid cat`); });
        break;
      case 'parsons':
        uniq(id, where);
        if (!b.lines || b.lines.length < 3) bad(where, 'parsons needs >=3 lines');
        break;
      case 'exercise': {
        stats.exercises++; uniq(id, where);
        ['prompt', 'starter', 'solution'].forEach(needStr);
        if (!b.id) bad(where, 'exercises must have an explicit unique id');
        if (!(b.tests && b.tests.length)) bad(where, 'exercise needs tests');
        if (!b.hints || !b.hints.length) warn.push(`${where}: no hints`);
        (b.requires || []).forEach((rq) => {
          const ok = new RegExp(rq.re, rq.flags || 'm').test(b.solution);
          if (rq.not ? ok : !ok) bad(where, `reference solution fails requirement: ${rq.msg}`);
        });
        const starterFailsReq = (b.requires || []).some((rq) => { const ok = new RegExp(rq.re, rq.flags || 'm').test(b.starter); return rq.not ? ok : !ok; });
        (b.tests || []).forEach((t, k) => {
          jobs.push({ kind: 'grade', where: where + ` test ${k + 1}`, code: b.solution, test: t, role: 'solution' });
          jobs.push({ kind: 'grade', where: where + ` test ${k + 1}`, code: b.starter, test: t, role: 'starter', group: where, starterFailsReq });
        });
        break;
      }
      case 'flowchart': if (!Array.isArray(b.flow) || !b.flow.length) bad(where, 'flowchart needs flow[]'); break;
      case 'viz': if (!['bubble', 'search', 'merge', 'range', 'slice', 'list', 'grid', 'nested', 'binary', 'denary2bin', 'binadd', 'caesar', 'rle', 'memory'].includes(b.kind)) bad(where, 'unknown viz kind ' + b.kind); break;
      case 'tracetable': uniq(id, where); needStr('code'); jobs.push({ kind: 'run', where, code: b.code, inputs: b.stdin || [], files: b.files, expectError: false }); break;
      case 'h': case 'h2': case 'p': case 'list': case 'note': case 'table': case 'html': break;
      default: bad(where, `unknown block type "${b.t}"`);
    }
  });
});

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ppv-'));
const jf = path.join(tmp, 'jobs.json'), rf = path.join(tmp, 'res.json');
fs.writeFileSync(jf, JSON.stringify(jobs));
const py = spawnSync('python', [path.join(__dirname, 'verify_run.py'), jf, rf], { encoding: 'utf8', timeout: 600000 });
if (py.status !== 0) { console.error(py.stderr || py.stdout); process.exit(2); }
const results = JSON.parse(fs.readFileSync(rf, 'utf8'));

const starterPass = {}; // group -> [all pass?]
jobs.forEach((j, k) => {
  const r = results[k];
  if (j.kind === 'run') {
    if (r.error && !j.expectError) bad(j.where, `code raised ${r.error.type}: ${r.error.msg} (line ${r.error.line}). Mark it expectError:true if intentional.`);
    if (!r.error && j.expectError) bad(j.where, 'marked expectError but ran without error');
    if (r.truncated) bad(j.where, 'ran too long / too much output');
  } else if (j.role === 'solution') {
    if (!r.ok) bad(j.where, `REFERENCE SOLUTION FAILS (${r.reason}) got=${JSON.stringify(r.got)} ${r.detail || ''} ${r.error ? r.error.type + ': ' + r.error.msg : ''} ${r.missing ? 'missing=' + r.missing : ''}`);
  } else {
    (starterPass[j.group] = starterPass[j.group] || []).push(r.ok && !j.starterFailsReq);
  }
});
Object.keys(starterPass).forEach((g) => { if (starterPass[g].every(Boolean)) bad(g, 'the starter code already passes every test - students would get a free pass'); });

console.log(`Checked ${stats.lessons} lessons, ${stats.blocks} blocks: ${stats.exercises} exercises, ${stats.predicts} predicts, ${stats.quizzes} quizzes, ${stats.runnable} runnable examples.`);
warn.slice(0, 20).forEach((w) => console.log('  warn  ' + w));
if (problems.length) { console.log(`\n${problems.length} PROBLEM(S):`); problems.forEach((p) => console.log('  ✗ ' + p)); process.exit(1); }
console.log('All good ✓');

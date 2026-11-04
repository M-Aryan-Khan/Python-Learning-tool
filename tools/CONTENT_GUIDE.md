# Python Path - content authoring guide

Audience: Year 10 students (14-15) on the Edexcel International GCSE Computer Science (4CP0) course who are
**weak in Python basics**. Paper 2 is a *practical, on-computer Python exam*: students amend broken code, write
programs, trace, test, validate, use subprograms, arrays, files, strings, sorting/searching and encryption.
Teaching must start gently and grow. Every concept must be shown **in all its forms and edge cases**, never just one.

Reference lesson to imitate: `content/m00.js` (read it fully first). Engine and renderer: `js/ui.js`.

## File shape

```js
(function () {
  const C = PP.C;            // tagged template: keeps backslashes, strips leading newline + common indent
  PP.addModule({
    id: 'm05', title: 'Lists (1D arrays)', blurb: 'One sentence for the module card.',
    lessons: [
      { id: 'list-basics', title: '…', time: '30 min', book: 'Ch 2 · p.67', exam: 'Paper 2 Q3',
        summary: 'short phrase for the lesson table', intro: 'one or two sentences under the title',
        blocks: [ /* see below */ ] },
    ],
  });
})();
```
Lesson ids are global and must be unique and kebab-case. Exercise ids must be explicit, unique, e.g. `m05-ex-maxlist`.
Use `C` for **every** multi-line code string and for expected output (`C\`...\``). Never use a normal quote
string for code containing `\n` - write `C\`print("a\nb")\`` and the backslash-n reaches Python intact.
Normal JS strings (used for prose) need `\\` for a literal backslash.
Prose strings accept: `` `code` `` (auto-escaped, you can write `x < 5` inside backticks), `**bold**`, and plain HTML (`<em>`, `<br>`, `<pre>`).

## Block types

| block | fields |
|---|---|
| `{t:'h', text}` / `{t:'h2', text}` | sub-heading |
| `{t:'p', html}` | paragraph |
| `{t:'list', items:[…], ordered?}` | list |
| `{t:'note', kind:'tip'\|'warn'\|'exam'\|'key', html, title?}` | callout. `exam` = how Edexcel words/marks it; `warn` = common mistake; `key` = the idea to remember |
| `{t:'table', head:[…], rows:[[…]]}` | cells accept the inline markup |
| `{t:'html', html}` | raw HTML. For list index diagrams use `<div class="cells"><div class="c"><b>10</b><i>0</i><i>-3</i></div>…</div>` (value box, then index, then optional negative index) |
| `{t:'code', code, title?, caption?, stdin?:[…], files?:{name:text}, expectError?, trace?:false}` | editable, runnable example with Run + Trace buttons. `stdin` pre-answers `input()` calls |
| `{t:'cases', title, items:[{label, intro?, code, stdin?, files?, expectError?}]}` | **tabs**: the same idea in all its variants. Use this heavily - it is how we "cover all cases" |
| `{t:'predict', code, rows?, stdin?, files?, why?, hint?}` | student types the output; checked against *real* Python (so you cannot get the answer wrong) |
| `{t:'quiz', q, options:[…], answer:n \| [n,…], why, code?, hint?}` | multiple choice (array answer = tick all that apply) |
| `{t:'sort', prompt, cats:[…], items:[{text, cat:index}], why?}` | classify each row into a category (e.g. Normal / Boundary / Erroneous test data; data types; error types) |
| `{t:'parsons', prompt, lines:[…correct order, keep indentation…], why?}` | put shuffled lines in order (≥3 lines) |
| `{t:'exercise', id, title, level:1\|2\|3, kind?:'debug'\|'exam', prompt, starter, solution, tests:[…], hints:[…], requires?:[…], files?, stdin?, explain?, after?}` | a graded coding task |

`code`/`cases`/`predict` blocks are executed by the verifier: they must run **without error**. If an example
*intentionally* crashes (to show an error message), set `expectError: true`. Examples that call `input()` should
supply `stdin` so the example is meaningful.

### Exercise tests (each test runs the student's program fresh)

```js
tests: [
  { in: ['5', '3'], out: '8' },                  // typed inputs; exact printed output (whitespace at line ends and trailing blank lines ignored)
  { out: 'Hello' },                              // no input
  { in: ['7'], has: ['odd'], loose: true },      // output must contain these substrings (case-insensitive)
  { in: ['x'], hasNot: ['error'] },
  { lines: 3 },                                  // exactly 3 non-empty output lines
  { py: 'assert double(4) == 8, "double(4) should return 8"', label: 'double(4) returns 8' },   // runs AFTER the student code, in the same namespace
  { files: {'in.txt': 'a\nb\n'}, py: 'assert open("out.txt").read() == "a\\nb\\n"', label: '…' },
  { files: {'in.txt': 'a\nb\n'}, files_out: {'out.txt': 'A\nB\n'} },  // check a file the program wrote
  { in: [...], out: '…', hidden: true },         // hidden test: failure shows only what the student printed, not the expected value
  { seed: 5, … }                                 // random.seed before running (use if the program uses random)
]
```
* **The text passed to `input("prompt")` is NOT part of the captured output in tests.** So `out` contains only what `print()` produced.
* `loose: true` compares lowercase with all whitespace collapsed. Use it for wording-tolerant checks.
* Always write at least **3 tests** with *different* inputs (include an edge case) so students cannot hard-code the answer. Mark one or two `hidden: true`.
* For function tasks use `py` tests with asserts - the student code at module level should not need `input`.
* `requires: [{re:'regex', msg:'…', not?:true}]` are static checks on the student's source (e.g. "must use a for loop": `{re:'\\bfor\\b', msg:'Use a `for` loop.'}`). `not:true` means the pattern must be absent. JS regex strings: double the backslashes.
* `starter` must **fail** at least one test or `requires` (the verifier checks), and `solution` must pass all (verifier checks).
* `level`: 1 = starter (one idea), 2 = core (combine ideas), 3 = stretch (exam-hard). `kind:'debug'`: starter contains planted bugs ("There are three errors" is the Paper 2 style). `kind:'exam'`: written like a Paper 2 scenario with marks-style phrasing.
* `hints`: 2-3 progressive hints, from nudge to near-answer.
* Never produce non-deterministic output in a test (no unseeded random, no time).

## Verify before finishing

```
node tools/verify.js content/m05.js
```
It runs every reference solution through real Python and every example through the same engine as the website. Fix
everything it reports; a module is not done until it prints `All good ✓`.

## Quality bar (what "good" looks like)

1. **Gentle ramp.** Assume the student does not understand the previous idea until shown it twice. Define every new word in plain English the first time (and give the exam word: e.g. "iteration", "concatenation", "parameter").
2. **All cases.** For each concept show the whole family via `cases`: normal use, boundary use, the variation students forget, and the *error* version (with `expectError`). Examples: `range(5)`, `range(2,6)`, `range(10,0,-2)`, empty range; `if` alone, `if/else`, chain, nested; negative index; slicing with missing parts; a list that is empty; a file that does not exist.
3. **Common mistakes** get a `note` of kind `warn` plus a runnable broken example where possible.
4. **Edexcel link.** Where a concept appears in exams, add a `note` of kind `exam` (command words, what marks are for, the Edexcel pseudocode form `SET x TO …`, `SEND … TO DISPLAY`, `RECEIVE x FROM (STRING) KEYBOARD`, `IF … THEN … ELSE … END IF`, `WHILE … DO … END WHILE`, `REPEAT … UNTIL …`, `FOR i FROM 0 TO 9 DO … END FOR`, `FOR EACH x FROM list DO`, `PROCEDURE`/`FUNCTION` … `END`, `MOD`, `DIV`) next to the Python version. Do **not** copy actual past-paper text or textbook text; write original tasks *in the style of* the exam.
5. **Every lesson** has: ≥2 `cases` blocks (or equivalent coverage), ≥1 `predict`, ≥1 `quiz` or `sort`/`parsons`, and **≥3 exercises** rising in level (at least one at level 2+). Each module has at least one `kind:'debug'` exercise ("find the N errors") and at least one scenario-style exercise with `input()`.
6. **Real contexts** a 15-year-old recognises: school, games, shops, phones, sport scores, temperatures, bank PINs. No trivia, no jokes at students' expense. British English. No emojis. Plain, calm tone.
7. Use the Trace button idea: tell students to press **Trace** on loops and functions so they see variable values change.
8. Keep lessons digestible: roughly 15-35 blocks, 20-40 minutes. More lessons beats overlong lessons.
9. Python version is 3.12. Use only the standard library. Avoid anything needing the network, GUI, `turtle`, `time.sleep`, or real clocks.
10. Text file tasks: provide input files through `files:{…}`; the Output panel shows files the program writes.
11. Be correct. If unsure whether Python behaves a certain way, put it in a `code` block and let the verifier run it; never assert behaviour you have not checked.

## Module / lesson map (ids must match so the planner map and sidebar links work)

* **m00 Start here** (done): `first-program`, `print-in-depth`, `comments-style`, `errors-debugging`
* **m01 Variables and data types** (done by lead): `variables`, `data-types`, `arithmetic`, `input-casting`, `formatting-output`, `random-math`
* **m02 Selection**: `comparisons`, `if-else`, `elif-chains`, `logical-operators`, `nested-if`, `selection-patterns`
* **m03 Iteration**: `while-loops`, `for-loops`, `loop-patterns`, `nested-loops`, `break-continue`, `repeat-until`
* **m04 Strings**: `string-basics`, `string-slicing`, `string-methods`, `string-traversal`, `string-patterns`
* **m05 Lists (1D arrays)**: `list-basics`, `list-methods`, `list-loops`, `list-algorithms`, `list-pitfalls`
* **m06 2D lists and records**: `two-d-basics`, `two-d-loops`, `two-d-algorithms`, `records`
* **m07 Subprograms**: `functions-intro`, `parameters-return`, `procedures-functions`, `scope`, `functions-and-lists`, `menus`
* **m08 Validation, testing and tracing**: `validation`, `input-validation`, `test-data`, `trace-tables`, `amend-the-code`
* **m09 More Python tools**: `tuples-dicts`, `comprehensions`, `enumerate-zip`, `recursion`
* **m10 Text files**: `files-reading`, `files-writing`, `files-with-lists`, `files-2d`, `files-subprograms`
* **m11 Searching and sorting**: `linear-search`, `binary-search`, `bubble-sort`, `merge-sort`, `algorithm-efficiency`
* **m12 Data, binary and encryption**: `binary-hex`, `bitwise-shifts`, `ascii-ord-chr`, `caesar-cipher`, `rle`
* **m13 Exam practice**: `pseudocode-to-python`, `exam-programs`, `exam-debugging`, `mini-projects`

## What each module must cover (checklist - be exhaustive)

**m02 Selection** - comparison operators `== != < > <= >=` on numbers, strings, (`"apple" < "banana"`, case matters), results are `bool`; `=` vs `==`; `if` alone; `if/else`; indentation errors; `elif` chains and **order matters** (grade boundaries, first match wins, no `else`); `and/or/not` with truth tables, precedence (`not` > `and` > `or`), brackets, `x == 1 or 2` bug, range test `0 <= x <= 100`, `in` / `not in` for strings and lists; De Morgan; nested `if` vs combined `and`; common patterns: even/odd (`%`), leap year, simple menu with `if/elif/else`, min/max of three numbers without `max()`, validating a choice, comparing strings case-insensitively with `.lower()`; one-line conditional expression as an extension; Edexcel `IF … THEN … ELSE … END IF` equivalents; truthiness (`if name:`) briefly.

**m03 Iteration** - `while` (counter-controlled, sentinel-controlled, condition-controlled), infinite loops and how to stop them, `for` with `range(n)`, `range(a,b)`, `range(a,b,step)`, negative step, empty ranges, looping over a string and a list, loop variable after loop; accumulator (running total), counter (counting matches), average, max/min tracking, factorial, powers, multiplication table, digit sum, `while True` with `break`; `continue`; `else` on loops only as a short extension; nested loops (rectangle/triangle star patterns, tables, nested counting) with Trace; `REPEAT … UNTIL` ↔ `while True … if cond: break` and Edexcel `FOR i FROM 0 TO 9` ↔ `range(0, 10)` (note upper bound difference!); input loops until valid; off-by-one errors; modifying loop variable inside `for` has no effect.

**m04 Strings** - a string is a sequence of characters; `len`; index from 0, negative index; `IndexError`; immutability; slicing `[a:b]`, `[:b]`, `[a:]`, `[:]`, `[::2]`, `[::-1]`, out-of-range slice is safe; concatenation, repetition, comparison; `in`; methods `upper lower title capitalize strip lstrip rstrip replace find index count split join startswith endswith isdigit isalpha isalnum isupper islower isspace`; method calls do not change the original (return new string); traversal by character and by index (`for i in range(len(s))`), building a new string in a loop; counting vowels, reversing, palindrome, first-letter capitalisation by hand, case conversion by hand with `ord/chr` (as an extension), word count with `split`, removing spaces, character frequency, f-strings with strings; escape sequences recap; multi-line strings; `str` ↔ numbers (`int("12")`, `str(12)`); comparing user input safely (`.strip().lower()`).

**m05 Lists** - create (literal, `[]`, `[0]*5`, `list(range())`, from `split`), index/negative index/slice, `len`, change an element, `append insert extend remove pop del sort sorted reverse index count`, `in`, `min max sum`, loops by value / by index / `enumerate`, building a list in a loop, filling from `input`, running total/average/max/min/second largest manually, linear count of matches, copying vs aliasing (`b = a` vs `b = a[:]`/`.copy()`), `sort()` returns None, removing while looping pitfall, list of strings vs list of numbers, parallel lists, Edexcel zero-indexed arrays and `LENGTH(arr)`, `IndexError`, `ValueError` from `remove`, empty list pitfalls (`max([])`, average of nothing), swapping two elements (`a[i], a[j] = a[j], a[i]`) and via temp variable.

**m06 2D lists and records** - nested list literal, `grid[row][col]`, rows vs columns, dimensions with `len(grid)` and `len(grid[0])`, nested loops (by row, by index), row total, column total, whole-grid total, max/min with position, diagonal, transposing, search for a value (return row/col), building a grid (`[[0]*3 for _ in range(3)]` and the shared-row pitfall `[[0]*3]*3`), append/remove a row, modifying a cell, printing a grid neatly (`" ".join`, `end=""`), tables like a timetable/seating plan/noughts-and-crosses/gradebook, records as list-of-lists and as parallel lists, short intro to dictionaries as records (full coverage in m09), sorting a 2D list by a column (bubble sort on rows).

**m07 Subprograms** - why use them (reuse, readability, testing); `def`, call, indentation; parameters vs arguments; **procedure** (no return) vs **function** (returns); `return` ends the function; returning a value vs printing it (classic mistake); function with no params; multiple params; positional vs keyword; default parameter; multiple return values (tuple) gently; built-in (`print len int range abs round max min sum`) vs user-defined; calling a function inside another; **scope**: local vs global, `global` keyword (and why avoid), shadowing, `UnboundLocalError`; functions that take/return lists, modify lists passed in; boolean-returning helpers (`is_prime`, `is_even`, `is_leap`), `dice()` with `random`, docstrings; flowchart/pseudocode `PROCEDURE`/`FUNCTION` equivalents; **menus**: loop with options 1-N + quit, each option a function, validating the choice, calculator menu; passing results between functions; testing functions with asserts.

**m08 Validation, testing, tracing** - validation (range, length, type, presence, format, lookup, check digit as extension) vs verification (double entry); input-validation loops (`while` until valid), `try/except ValueError`, `isdigit()`, `.strip()`, empty input; **test data**: normal, boundary (both sides of each limit), erroneous (wrong type/out of range) - use `sort` blocks and tables with "expected output" columns exactly like the exam; writing a test plan; **trace tables**: how to fill one for loops, selection and functions (use code blocks with the Trace button, explain row = line run, columns = variables + output); iterative testing; **error types** syntax/runtime/logic recap; **amend-the-code**: Paper-2 style "There are N errors" tasks of increasing difficulty (missing colon, `=` vs `==`, wrong operator, off-by-one, wrong variable, missing `int()`, indentation, wrong loop bound, forgot `return`), plus defensive programming and meaningful messages; authentication example (PIN with 3 tries).

**m09 More Python tools** - tuples (immutable, unpack, return), dictionaries (create, access, `KeyError`, `.get`, add/update/delete, `in`, loop over keys/values/items, count frequencies, records as dict, list of dicts), list comprehensions (map, filter, with condition) *presented as optional power tools*, `enumerate`, `zip`, `sorted` with `key`/`reverse`, `min/max` with key, `any/all`, simple recursion (factorial, countdown, sum of list, why a base case) with Trace.

**m10 Text files** - open modes `"r" "w" "a"`, `close()` (and `with` as the tidy way, but also show the explicit `open/close` that the Edexcel book uses), `read()`, `readline()`, `readlines()`, looping `for line in file`, the trailing `\n` and `.strip()`, `write()` needs strings and does not add `\n`, `w` erases, `a` appends, writing numbers with `str()`, reading numbers with `int()`, counting lines/words/characters, searching a file for a word, `FileNotFoundError` and handling it, file → 1D list, list → file, file of records (`name,score` with `split(",")`) → 2D list, 2D list → file with `join`, appending a new record, updating a record (read all, modify, rewrite), files + subprograms (`read_scores(filename)`, `save_scores(filename, data)`), average/highest score from a file, ending-of-file blank-line pitfalls. All tasks supply files through `files`.

**m11 Searching and sorting** - linear search (found/not found, return index or -1, first vs all matches, early exit, trace with Trace), binary search (needs sorted data, low/high/mid, `//`, trace, why it halves, worst-case steps, off-by-one, not-found case, on strings), counting comparisons to compare the two, bubble sort (swap with temp and with tuple swap, passes, early-stop flag optimisation, count swaps, descending order, sort strings, sort 2D by column), merge sort (split, merge two sorted lists, recursive version, trace the merges; keep it understandable), efficiency discussion (best/worst case, steps table for n=8,16,1000, why binary search needs sorting first), choosing the right algorithm; Edexcel pseudocode forms; max/min without `max()`.

**m12 Data, binary and encryption** - binary ↔ denary by hand-code (loop) and with `bin()` / `int(s, 2)` / `format(n, "08b")`; hex ↔ denary (`hex`, `int(s,16)`, `format(n,"X")`), why hex is used; bits needed / number of combinations (`2**n`); binary addition with overflow check in 8 bits; two's complement in code (8-bit); logical shifts with `<<` `>>` and their effect (×2, ÷2) and arithmetic shift idea; `&` `|` `^` as extension; `ord()`/`chr()` and ASCII table by loop (`A`=65, `a`=97, `0`=48), case conversion with `ord`, character arithmetic; Caesar cipher: shift with wrap-around using `%`, upper/lower/non-letters, encrypt, decrypt, brute-force all 25 keys, finding the key; RLE compression for strings (`WWWBBB` → `3W3B`), decompression, compression ratio, what happens when data has no runs (can expand), Edexcel flowchart/pseudocode forms of these.

**m13 Exam practice** - a table-driven `pseudocode-to-python` lesson mapping every Edexcel pseudocode construct to Python with runnable pairs, then **tracing a pseudocode program in Python**; `exam-programs`: Paper-2-style scenario tasks (several, graded, multi-part like "(a) complete the code (b) amend (c) write"), each with tests; `exam-debugging`: 6+ "amend the code - N errors" tasks across all topics; `mini-projects`: 5-6 bigger programs (quiz game, number guessing with random, ATM/PIN, class gradebook with 2D list, student record file manager with menu, Caesar tool) built from menu + functions + files, graded by tests (project tasks may have 6-10 tests).

## Style of prose

Short paragraphs. Second person ("you"). One idea per paragraph. Show, then name it. Avoid walls of text; use `cases`, `table`, `note`. Do not apologise, do not say "simply" or "just" or "obviously".

## Additional block types (added later)

* `{t:'flowchart', title?, caption?, flow:[…]}` - draws a standard flowchart from a *structured* spec (no coordinates). Items:
  `{start:'Start'}`, `{end:'End'}`, `{io:'INPUT mark'}` (parallelogram), `{p:'total = 0'}` (process), `{sub:'checkPrime(n)'}` (subprogram),
  `{if:'mark >= 50?', then:[…], else:[…], yes?:'Yes', no?:'No'}` (decision; `else` optional),
  `{while:'count < 5?', body:[…]}` (test first; Yes → body, No → exit),
  `{until:'guess == secret?', body:[…]}` (body first, then test; No → loops back, Yes → exit).
  Use `\n` inside a label to break lines. Keep each label under ~28 characters per line. Always begin with `{start}` and end with `{end}`.
* `{t:'tracetable', id, code, stdin?, cols?:['x','total'], output?:true, rows?:'all', prompt?, why?, level?}` - the student fills in an exam-style
  trace table for a **module-level** program (no `def` needed; variables are the columns). The app runs the code and builds the answer key itself:
  one row per line that changes a tracked variable or prints; students enter a value only on the row where it changes. Keep programs short
  (≤ 12 rows). `id` must be explicit and unique. The verifier runs the code.
* `{t:'viz', kind:'…'}` - visual explainers are placed by the lead; do not use.
* The design lessons should still use the usual `cases`, `predict`, `quiz`, `sort`, `parsons`, `exercise` blocks.

## Source material for authors

`tools/source/planner.txt` (Beacon Light Academy lesson planner, text), `tools/source/b1.txt` (Booklet 1 topical past papers, text - Paper 1 theory pages and Paper 2
practical pages; many practical pages lose their figures in text form), `tools/source/b2.txt` (Booklet 2, theory ch 4/5 - ignore). The PDFs themselves are in
`C:\Users\OVRLOD\Downloads\` (`Booklet 1 redacted (1).pdf`, `edexcel-international-gcse-9-1-computer-science-student-book-pdf-free.pdf`); `pymupdf` is installed
(`python -c "import pymupdf"`) so you may render a page to PNG and look at it with the Read tool. **Never copy past-paper or textbook wording into the course** - it is
Pearson's copyright and the site will be public. Write original tasks in the same *style* and reference the original only by session/question/page.

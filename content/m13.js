(function () {
  const C = PP.C;
  // Shows pseudocode in a <pre> block (escapes < > &).
  const PRE = (s) => '<pre>' + s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
  PP.addModule({
    id: 'm13',
    title: 'Exam practice',
    blurb: 'Turn Edexcel pseudocode into Python, then tackle Paper 2 style scenarios, amend-the-code tasks and mini-projects.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'pseudocode-to-python',
        title: 'Pseudocode to Python',
        time: '40 min',
        book: 'Ch 2 · pseudocode',
        exam: 'Paper 2 · all questions',
        summary: 'Every Edexcel pseudocode construct and its Python twin',
        intro: 'The exam describes algorithms in Edexcel pseudocode, but you must answer in Python. If you can translate line by line, you can solve any question that arrives in pseudocode form.',
        blocks: [
          { t: 'h', text: 'The translation table' },
          { t: 'p', html: 'Pseudocode uses capital-letter keywords and an `END` line to close each block. Python uses a colon and **indentation** instead. Learn this table: it is the whole lesson in one place.' },
          {
            t: 'table', head: ['Edexcel pseudocode', 'Python', 'Watch for'], rows: [
              ['`SET total TO 0`', '`total = 0`', 'One `=` assigns. Pseudocode `=` in a condition means comparison.'],
              ['`SET total TO total + 5`', '`total = total + 5`', 'Right side is worked out first.'],
              ['`SEND "Hi" TO DISPLAY`', '`print("Hi")`', 'Any value can be displayed.'],
              ['`RECEIVE name FROM (STRING) KEYBOARD`', '`name = input()`', '`input()` always gives a string.'],
              ['`RECEIVE age FROM (INTEGER) KEYBOARD`', '`age = int(input())`', 'The type in brackets tells you to convert.'],
              ['`IF a = b THEN`', '`if a == b:`', 'Comparison is `==` in Python.'],
              ['`ELSE IF c THEN`', '`elif c:`', 'Python spells it `elif`.'],
              ['`ELSE`', '`else:`', 'Colon, then an indented block.'],
              ['`END IF`', '(nothing)', 'The end of the indentation is the end of the block.'],
              ['`WHILE c DO … END WHILE`', '`while c:`', 'Condition is checked before each go.'],
              ['`REPEAT … UNTIL c`', '`while True:` … `if c: break`', 'Always runs at least once. Stops when `c` becomes true.'],
              ['`FOR i FROM 1 TO 5 DO`', '`for i in range(1, 6):`', 'Pseudocode `TO` is **included**. `range` stops one early.'],
              ['`FOR EACH x FROM items DO`', '`for x in items:`', 'Takes each item in turn.'],
              ['`SET marks TO [4, 9, 7]`', '`marks = [4, 9, 7]`', 'Arrays are lists.'],
              ['`marks[0]`', '`marks[0]`', 'Index starts at 0 in both.'],
              ['`LENGTH(marks)`', '`len(marks)`', 'Last index is `len(marks) - 1`.'],
              ['`PROCEDURE show(x) … END PROCEDURE`', '`def show(x):`', 'A procedure does not return a value.'],
              ['`FUNCTION add(a, b) … RETURN r … END FUNCTION`', '`def add(a, b):` … `return r`', 'A function hands a value back.'],
              ['`CALL show(5)`', '`show(5)`', 'Calling a function: use its result.'],
              ['`a MOD b`', '`a % b`', 'The remainder.'],
              ['`a DIV b`', '`a // b`', 'Whole-number division.'],
              ['`AND`, `OR`, `NOT`', '`and`, `or`, `not`', 'Lower case in Python.'],
              ['`≠`, `≤`, `≥`', '`!=`, `<=`, `>=`', 'Typed symbols.'],
              ['`"Score: " & score`', '`"Score: " + str(score)`', 'Numbers must be converted before joining.'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'The exam writes pseudocode with <em>lines of the exact style above</em>. You never have to guess a keyword, but you do have to turn it into correct Python: right colons, right indentation, right `range` end.' },

          { t: 'h', text: 'Input and output' },
          {
            t: 'cases', title: 'SET, SEND, RECEIVE', items: [
              {
                label: 'SET and SEND', intro: 'Pseudocode shown in comments, Python below it.', code: C`
              # SET price TO 12
              # SET qty TO 3
              # SEND price * qty TO DISPLAY
              price = 12
              qty = 3
              print(price * qty)
            ` },
              {
                label: 'RECEIVE (STRING)', code: C`
              # RECEIVE name FROM (STRING) KEYBOARD
              # SEND "Hello " & name TO DISPLAY
              name = input("Name: ")
              print("Hello " + name)
            `, stdin: ['Asha']
              },
              {
                label: 'RECEIVE (INTEGER)', code: C`
              # RECEIVE age FROM (INTEGER) KEYBOARD
              # SEND age + 1 TO DISPLAY
              age = int(input("Age: "))
              print(age + 1)
            `, stdin: ['15']
              },
              {
                label: 'Forgot int()', expectError: true, intro: 'The classic loss of marks. `input()` gives text, so the sum fails.', code: C`
              age = input("Age: ")
              print(age + 1)
            `, stdin: ['15']
              },
            ]
          },

          { t: 'h', text: 'Selection' },
          {
            t: 'cases', title: 'IF in all its shapes', items: [
              {
                label: 'IF only', code: C`
              # IF temp > 30 THEN
              #   SEND "Hot" TO DISPLAY
              # END IF
              temp = 33
              if temp > 30:
                  print("Hot")
            ` },
              {
                label: 'IF / ELSE', code: C`
              # IF mark >= 50 THEN SEND "Pass" ... ELSE SEND "Fail"
              mark = 42
              if mark >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
              {
                label: 'ELSE IF chain', code: C`
              # IF s >= 70 THEN ... ELSE IF s >= 50 THEN ... ELSE ...
              s = 58
              if s >= 70:
                  print("High")
              elif s >= 50:
                  print("Medium")
              else:
                  print("Low")
            ` },
              {
                label: 'AND / OR / NOT', code: C`
              # IF age >= 12 AND age <= 17 THEN
              age = 15
              member = False
              if age >= 12 and age <= 17:
                  print("Teen price")
              if age < 5 or age > 65:
                  print("Free")
              if not member:
                  print("Offer a membership")
            ` },
              {
                label: 'Equals sign trap', expectError: true, intro: 'Pseudocode writes `=` for a comparison. Python needs `==`.', code: C`
              x = 5
              if x = 5:
                  print("five")
            ` },
            ]
          },

          { t: 'h', text: 'Iteration' },
          {
            t: 'cases', title: 'WHILE, REPEAT UNTIL, FOR, FOR EACH', items: [
              {
                label: 'WHILE', intro: 'Press **Trace** to watch the counter change.', code: C`
              # SET n TO 1
              # WHILE n <= 3 DO
              #   SEND n TO DISPLAY
              #   SET n TO n + 1
              # END WHILE
              n = 1
              while n <= 3:
                  print(n)
                  n = n + 1
            ` },
              {
                label: 'REPEAT UNTIL', intro: 'Python has no `repeat`. Use `while True` and `break` when the UNTIL condition is true.', code: C`
              # REPEAT
              #   RECEIVE n FROM (INTEGER) KEYBOARD
              # UNTIL n > 0
              while True:
                  n = int(input("Positive number: "))
                  if n > 0:
                      break
              print("Thanks", n)
            `, stdin: ['-4', '0', '6']
              },
              {
                label: 'FOR (inclusive end)', intro: '`FROM 1 TO 5` means 1, 2, 3, 4, 5, so the Python end value is 6.', code: C`
              # FOR i FROM 1 TO 5 DO
              #   SEND i TO DISPLAY
              # END FOR
              for i in range(1, 6):
                  print(i)
            ` },
              {
                label: 'FOR from 0', code: C`
              # FOR i FROM 0 TO 3 DO ... END FOR
              for i in range(0, 4):
                  print(i)
            ` },
              {
                label: 'FOR EACH', code: C`
              # SET names TO ["Asha", "Ben", "Cy"]
              # FOR EACH name FROM names DO
              #   SEND name TO DISPLAY
              # END FOR
              names = ["Asha", "Ben", "Cy"]
              for name in names:
                  print(name)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'The most common slip is `FOR i FROM 1 TO 10` written as `range(1, 10)`. That stops at 9. The end of a pseudocode `FOR` is always <strong>end + 1</strong> in `range`.' },

          { t: 'h', text: 'Arrays and subprograms' },
          {
            t: 'cases', title: 'Arrays, LENGTH, PROCEDURE, FUNCTION', items: [
              {
                label: 'Arrays and LENGTH', code: C`
              # SET marks TO [40, 55, 70]
              # SEND marks[1] TO DISPLAY
              # SEND LENGTH(marks) TO DISPLAY
              # SET marks[0] TO 45
              marks = [40, 55, 70]
              print(marks[1])
              print(len(marks))
              marks[0] = 45
              print(marks)
            ` },
              {
                label: 'FOR with an index', code: C`
              # FOR i FROM 0 TO LENGTH(marks) - 1 DO
              #   SEND marks[i] TO DISPLAY
              marks = [40, 55, 70]
              for i in range(0, len(marks)):
                  print(i, marks[i])
            ` },
              {
                label: 'PROCEDURE', intro: 'A procedure does a job. It does not give back a value.', code: C`
              # PROCEDURE greet(name)
              # BEGIN PROCEDURE
              #   SEND "Hi " & name TO DISPLAY
              # END PROCEDURE
              def greet(name):
                  print("Hi " + name)

              greet("Asha")
              greet("Ben")
            ` },
              {
                label: 'FUNCTION', intro: 'A function sends a value back with `RETURN`.', code: C`
              # FUNCTION area(w, h)
              # BEGIN FUNCTION
              #   RETURN w * h
              # END FUNCTION
              def area(w, h):
                  return w * h

              result = area(4, 5)
              print(result)
              print(area(2, 3) + 1)
            ` },
            ]
          },

          { t: 'h', text: 'Operators, strings and files' },
          {
            t: 'cases', title: 'MOD, DIV, & and files', items: [
              {
                label: 'MOD and DIV', code: C`
              # SEND 17 DIV 5 TO DISPLAY
              # SEND 17 MOD 5 TO DISPLAY
              print(17 // 5)
              print(17 % 5)
              minutes = 135
              print(minutes // 60, "hours", minutes % 60, "minutes")
            ` },
              {
                label: 'String join (&)', code: C`
              # SET msg TO "Score: " & score
              score = 9
              msg = "Score: " + str(score)
              print(msg)
              print("Score:", score)
            ` },
              {
                label: 'Read a file', intro: 'Edexcel wording for files varies. The ideas are always: open, read each line, close.', files: { 'names.txt': 'Asha\nBen\nCy\n' }, code: C`
              # OPEN names.txt
              # FOR EACH line FROM names.txt DO SEND line TO DISPLAY
              # CLOSE names.txt
              file = open("names.txt", "r")
              for line in file:
                  print(line.strip())
              file.close()
            ` },
              {
                label: 'Write a file', code: C`
              # WRITE "Hello" TO out.txt
              file = open("out.txt", "w")
              file.write("Hello\n")
              file.write("World\n")
              file.close()
              print(open("out.txt").read())
            ` },
            ]
          },

          { t: 'h', text: 'Tracing a pseudocode program in Python' },
          { t: 'p', html: 'Here is a pseudocode program, then its Python. Press **Trace table** to get the table you would draw in the exam.' },
          {
            t: 'html', html: PRE(C`
            SET total TO 0
            FOR i FROM 1 TO 4 DO
              IF i MOD 2 = 0 THEN
                SET total TO total + i
              END IF
            END FOR
            SEND total TO DISPLAY
          `)
          },
          {
            t: 'code', title: 'trace_me.py', code: C`
            total = 0
            for i in range(1, 5):
                if i % 2 == 0:
                    total = total + i
            print(total)
          ` },
          {
            t: 'predict', title: 'What does it print if FROM 1 TO 6?', code: C`
            total = 0
            for i in range(1, 7):
                if i % 2 == 0:
                    total = total + i
            print(total)
          `, rows: 1, why: 'The even numbers 2, 4 and 6 are added: 12.'
          },
          {
            t: 'predict', title: 'DIV and MOD', code: C`
            seconds = 200
            print(seconds // 60)
            print(seconds % 60)
          `, rows: 2, why: '200 seconds is 3 whole minutes (180) with 20 seconds left.'
          },

          {
            t: 'sort', prompt: 'Which kind of statement is each pseudocode line?', cats: ['Input/Output', 'Selection', 'Iteration', 'Subprogram'], items: [
              { text: '`SEND total TO DISPLAY`', cat: 0 },
              { text: '`RECEIVE n FROM (INTEGER) KEYBOARD`', cat: 0 },
              { text: '`ELSE IF mark >= 50 THEN`', cat: 1 },
              { text: '`FOR i FROM 0 TO 9 DO`', cat: 2 },
              { text: '`REPEAT`', cat: 2 },
              { text: '`FUNCTION area(w, h)`', cat: 3 },
              { text: '`RETURN total`', cat: 3 },
              { text: '`IF x > 3 AND y < 8 THEN`', cat: 1 },
              { text: '`WHILE count < 5 DO`', cat: 2 },
            ], why: 'Selection chooses, iteration repeats, subprograms package code, and input/output talks to the user.'
          },
          {
            t: 'parsons', prompt: 'Put the Python translation of this pseudocode in order: SET total TO 0, FOR i FROM 1 TO 5 DO, SET total TO total + i, END FOR, SEND total TO DISPLAY.', lines: [
              'total = 0', 'for i in range(1, 6):', '    total = total + i', 'print(total)'], why: 'The loop body is indented. The print is not indented, so it runs once, after the loop.'
          },
          { t: 'quiz', q: 'Which is the correct Python for <code>FOR i FROM 2 TO 8 DO</code>?', options: ['for i in range(2, 8):', 'for i in range(2, 9):', 'for i in range(8):', 'for i in 2 to 8:'], answer: 1, why: 'Pseudocode includes the end value, so range needs 9 to stop after 8.' },
          { t: 'quiz', q: 'Pseudocode: <code>SEND 14 MOD 4 TO DISPLAY</code>. What is displayed?', options: ['3', '2', '3.5', '56'], answer: 1, why: '14 divided by 4 is 3 remainder 2. MOD gives the remainder.' },

          { t: 'h', text: 'Your turn: convert these' },
          {
            t: 'exercise', id: 'm13-ex-p2p-age', title: 'Age band', level: 1,
            prompt: 'Convert this pseudocode into Python. Remember to convert the keyboard input to an integer.' + PRE(C`
              RECEIVE age FROM (INTEGER) KEYBOARD
              IF age < 13 THEN
                SEND "Child" TO DISPLAY
              ELSE IF age < 65 THEN
                SEND "Adult" TO DISPLAY
              ELSE
                SEND "Senior" TO DISPLAY
              END IF
            `),
            starter: C`
              # Write the Python here

            `,
            solution: C`
              age = int(input())
              if age < 13:
                  print("Child")
              elif age < 65:
                  print("Adult")
              else:
                  print("Senior")
            `,
            tests: [{ in: ['12'], out: 'Child' }, { in: ['13'], out: 'Adult' }, { in: ['64'], out: 'Adult' }, { in: ['65'], out: 'Senior', hidden: true }, { in: ['0'], out: 'Child', hidden: true }],
            hints: ['`RECEIVE … (INTEGER)` becomes `int(input())`.', '`ELSE IF` is spelled `elif`. Do not forget the colons.']
          },
          {
            t: 'exercise', id: 'm13-ex-p2p-evens', title: 'Add the evens', level: 2,
            prompt: 'Convert to Python.' + PRE(C`
              RECEIVE n FROM (INTEGER) KEYBOARD
              SET total TO 0
              FOR i FROM 1 TO n DO
                IF i MOD 2 = 0 THEN
                  SET total TO total + i
                END IF
              END FOR
              SEND total TO DISPLAY
            `),
            starter: C`
              n = int(input())
              total = 0
              # finish the loop
              print(total)
            `,
            solution: C`
              n = int(input())
              total = 0
              for i in range(1, n + 1):
                  if i % 2 == 0:
                      total = total + i
              print(total)
            `,
            tests: [{ in: ['10'], out: '30' }, { in: ['1'], out: '0' }, { in: ['7'], out: '12' }, { in: ['0'], out: '0', hidden: true }, { in: ['12'], out: '42', hidden: true }],
            hints: ['`FROM 1 TO n` becomes `range(1, n + 1)`.', '`MOD` is `%` and a comparison needs `==`.']
          },
          {
            t: 'exercise', id: 'm13-ex-p2p-pin', title: 'Three tries', level: 2,
            prompt: 'Convert to Python. The secret PIN is 4821.' + PRE(C`
              SET tries TO 0
              REPEAT
                RECEIVE pin FROM (INTEGER) KEYBOARD
                SET tries TO tries + 1
              UNTIL pin = 4821 OR tries = 3
              IF pin = 4821 THEN
                SEND "Welcome" TO DISPLAY
              ELSE
                SEND "Locked" TO DISPLAY
              END IF
            `),
            starter: C`
              tries = 0
              # REPEAT ... UNTIL goes here
            `,
            solution: C`
              tries = 0
              while True:
                  pin = int(input())
                  tries = tries + 1
                  if pin == 4821 or tries == 3:
                      break
              if pin == 4821:
                  print("Welcome")
              else:
                  print("Locked")
            `,
            tests: [{ in: ['4821'], out: 'Welcome' }, { in: ['1111', '2222', '4821'], out: 'Welcome' }, { in: ['1', '2', '3'], out: 'Locked' }, { in: ['1', '4821'], out: 'Welcome', hidden: true }, { in: ['1', '2', '3', '4821'], out: 'Locked', hidden: true }],
            requires: [{ re: 'break', msg: 'Use `while True` with `break` for REPEAT … UNTIL.' }],
            hints: ['The loop must run at least once, so use `while True:`.', 'Put `if <UNTIL condition>: break` as the last thing in the loop.']
          },
          {
            t: 'exercise', id: 'm13-ex-p2p-time', title: 'Clock time function', level: 2,
            prompt: 'Convert to a Python function named <code>clock_time</code>. It should return text like <code>2h 5m</code>.' + PRE(C`
              FUNCTION clockTime(minutes)
              BEGIN FUNCTION
                SET h TO minutes DIV 60
                SET m TO minutes MOD 60
                RETURN h & "h " & m & "m"
              END FUNCTION
            `),
            starter: C`
              def clock_time(minutes):
                  pass
            `,
            solution: C`
              def clock_time(minutes):
                  h = minutes // 60
                  m = minutes % 60
                  return str(h) + "h " + str(m) + "m"
            `,
            tests: [{ py: 'assert clock_time(125) == "2h 5m", "clock_time(125) should be 2h 5m"', label: '125 minutes' }, { py: 'assert clock_time(59) == "0h 59m"', label: '59 minutes' }, { py: 'assert clock_time(60) == "1h 0m"', label: '60 minutes' }, { py: 'assert clock_time(0) == "0h 0m"', label: '0 minutes', hidden: true }],
            hints: ['`DIV` is `//` and `MOD` is `%`.', 'The `&` joins text; with numbers you need `str()` around them.']
          },
          {
            t: 'exercise', id: 'm13-ex-p2p-show', title: 'Show the marks', level: 2,
            prompt: 'Convert the procedure and the main program to Python.' + PRE(C`
              PROCEDURE showMarks(marks)
              BEGIN PROCEDURE
                FOR i FROM 0 TO LENGTH(marks) - 1 DO
                  SEND (i + 1) & ": " & marks[i] TO DISPLAY
                END FOR
              END PROCEDURE

              RECEIVE a FROM (INTEGER) KEYBOARD
              RECEIVE b FROM (INTEGER) KEYBOARD
              RECEIVE c FROM (INTEGER) KEYBOARD
              SET list TO [a, b, c]
              CALL showMarks(list)
            `),
            starter: C`
              # def showMarks ...
            `,
            solution: C`
              def show_marks(marks):
                  for i in range(0, len(marks)):
                      print(str(i + 1) + ": " + str(marks[i]))

              a = int(input())
              b = int(input())
              c = int(input())
              marks = [a, b, c]
              show_marks(marks)
            `,
            tests: [{ in: ['70', '55', '80'], out: '1: 70\n2: 55\n3: 80' }, { in: ['0', '0', '0'], out: '1: 0\n2: 0\n3: 0' }, { in: ['9', '8', '7'], out: '1: 9\n2: 8\n3: 7', hidden: true }],
            hints: ['`LENGTH(marks) - 1` is the last index, so `range(0, len(marks))` covers it.', 'Use `str()` around numbers before joining with `+`.']
          },
          {
            t: 'exercise', id: 'm13-ex-p2p-above', title: 'Count above the limit', level: 3,
            prompt: 'Convert to a Python function <code>count_above(scores, limit)</code>.' + PRE(C`
              FUNCTION countAbove(scores, limit)
              BEGIN FUNCTION
                SET count TO 0
                FOR EACH s FROM scores DO
                  IF s > limit THEN
                    SET count TO count + 1
                  END IF
                END FOR
                RETURN count
              END FUNCTION
            `),
            starter: C`
              def count_above(scores, limit):
                  pass
            `,
            solution: C`
              def count_above(scores, limit):
                  count = 0
                  for s in scores:
                      if s > limit:
                          count = count + 1
                  return count
            `,
            tests: [{ py: 'assert count_above([5, 9, 12, 3], 4) == 3', label: 'three above 4' }, { py: 'assert count_above([5, 9], 9) == 0', label: 'equal is not above' }, { py: 'assert count_above([], 1) == 0', label: 'empty list' }, { py: 'assert count_above([1, 1, 1], 0) == 3', label: 'all above', hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop (FOR EACH).' }],
            hints: ['`FOR EACH s FROM scores` is `for s in scores:`.', 'Return after the loop finishes, not inside it.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'exam-programs',
        title: 'Paper 2 style programs',
        time: '60 min',
        book: 'Paper 2 practice',
        exam: 'Paper 2 · Q1-Q8',
        summary: 'Scenario-led, multi-part programming questions',
        intro: 'Paper 2 questions start with a short scenario and then ask for several parts. This lesson trains the habit: read the scenario, list the rules, write the code, test it.',
        blocks: [
          { t: 'h', text: 'How to attack a scenario question' },
          {
            t: 'list', ordered: true, items: [
              '**Underline the rules.** Numbers, limits, words like "at least", "more than", "no more than".',
              '**List the inputs and the outputs.** What does the user type? Exactly what must be shown?',
              '**Choose the structure.** Selection, a loop, a list, a function, a file?',
              '**Write it in small steps** and run after each step.',
              '**Test with normal, boundary and erroneous data.**',
            ]
          },
          { t: 'note', kind: 'exam', html: 'Command words: <strong>complete</strong> means fill the gaps; <strong>amend</strong> means fix what is there; <strong>write</strong> means build it from nothing; <strong>state the output</strong> means what the program displays. Marks are usually one per correct idea (input, calculation, condition, output).' },

          { t: 'h', text: 'Scenario 1: cinema tickets' },
          { t: 'p', html: 'A cinema booking allows **1 to 4 adults** and **0 to 6 children**. An adult ticket costs 9 and a child ticket costs 5. The program should display `Invalid number of adults` or `Invalid number of children` for bad data, otherwise `Total: ` followed by the cost.' },
          { t: 'p', html: '**(a)** Sort this test data for the number of adults. (3 marks)' },
          {
            t: 'sort', prompt: 'Classify each test value for the number of adults (valid range 1 to 4).', cats: ['Normal', 'Boundary', 'Erroneous'], items: [
              { text: '`2`', cat: 0 },
              { text: '`1`', cat: 1 },
              { text: '`4`', cat: 1 },
              { text: '`0`', cat: 1 },
              { text: '`5`', cat: 1 },
              { text: '`three`', cat: 2 },
              { text: '`-6`', cat: 2 },
              { text: '`3`', cat: 0 },
            ], why: 'Boundary data sits on and just beyond each limit (0, 1, 4, 5). Erroneous data is the wrong type, or wildly outside the range.'
          },
          {
            t: 'table', head: ['Test', 'Adults', 'Children', 'Expected output'], rows: [
              ['Normal', '2', '3', '`Total: 33`'],
              ['Boundary', '4', '6', '`Total: 66`'],
              ['Boundary', '5', '0', '`Invalid number of adults`'],
              ['Boundary', '2', '7', '`Invalid number of children`'],
            ]
          },
          { t: 'p', html: '**(b)** Write the program. (6 marks)' },
          {
            t: 'exercise', id: 'm13-ex-tickets', title: 'Cinema bookings', level: 2, kind: 'exam',
            prompt: 'Write the cinema program described above. Read the adults first, then the children, as whole numbers. Check the adults first: if both are invalid, only the adults message is shown.',
            starter: C`
              adults = int(input("Adults: "))
              children = int(input("Children: "))
              # check the limits, then work out the cost
            `,
            solution: C`
              adults = int(input("Adults: "))
              children = int(input("Children: "))
              if adults < 1 or adults > 4:
                  print("Invalid number of adults")
              elif children < 0 or children > 6:
                  print("Invalid number of children")
              else:
                  cost = adults * 9 + children * 5
                  print("Total:", cost)
            `,
            tests: [{ in: ['2', '3'], out: 'Total: 33' }, { in: ['4', '6'], out: 'Total: 66' }, { in: ['1', '0'], out: 'Total: 9' }, { in: ['0', '2'], out: 'Invalid number of adults' }, { in: ['5', '0'], out: 'Invalid number of adults', hidden: true }, { in: ['2', '7'], out: 'Invalid number of children' }, { in: ['2', '-1'], out: 'Invalid number of children', hidden: true }],
            hints: ['Use `or` to say "too low or too high".', 'Use `if` / `elif` / `else` so only one message shows.', 'Total = adults times 9 plus children times 5.']
          },

          { t: 'h', text: 'Scenario 2: shoe shop bonus' },
          { t: 'p', html: 'A shoe shop pays a monthly bonus on pairs sold. Rules are checked in this order: 100 or more pairs earns 50. Otherwise 60 or more earns 30 for full-time staff and 20 for part-time. Otherwise 30 or more earns 10 if the member is full-time **or** has sold at least 45. Anything else earns 0.' },
          {
            t: 'cases', title: 'Reading the rules as code', items: [
              {
                label: 'First match wins', intro: 'Order matters. Press Trace with different values of `pairs`.', code: C`
              pairs = 62
              contract = "part"
              if pairs >= 100:
                  bonus = 50
              elif pairs >= 60 and contract == "full":
                  bonus = 30
              elif pairs >= 60:
                  bonus = 20
              else:
                  bonus = 0
              print(bonus)
            ` },
              {
                label: 'and then or', intro: 'Brackets are needed when `and` and `or` mix. `and` binds tighter than `or`.', code: C`
              pairs = 40
              contract = "part"
              print(pairs >= 30 and (contract == "full" or pairs >= 45))
              print(pairs >= 30 and contract == "full" or pairs >= 45)
            ` },
            ]
          },
          {
            t: 'exercise', id: 'm13-ex-bonus', title: 'Shoe shop bonus', level: 2, kind: 'exam',
            prompt: 'Read the number of pairs sold (integer), then the contract as text: <code>full</code> or <code>part</code>. Display <code>Bonus: </code> followed by the bonus using the rules above. (6 marks)',
            starter: C`
              pairs = int(input("Pairs sold: "))
              contract = input("Contract (full/part): ")
              # work out bonus, then print it
            `,
            solution: C`
              pairs = int(input("Pairs sold: "))
              contract = input("Contract (full/part): ")
              if pairs >= 100:
                  bonus = 50
              elif pairs >= 60 and contract == "full":
                  bonus = 30
              elif pairs >= 60:
                  bonus = 20
              elif pairs >= 30 and (contract == "full" or pairs >= 45):
                  bonus = 10
              else:
                  bonus = 0
              print("Bonus:", bonus)
            `,
            tests: [{ in: ['100', 'part'], out: 'Bonus: 50' }, { in: ['99', 'full'], out: 'Bonus: 30' }, { in: ['60', 'part'], out: 'Bonus: 20' }, { in: ['59', 'full'], out: 'Bonus: 10' }, { in: ['45', 'part'], out: 'Bonus: 10', hidden: true }, { in: ['44', 'part'], out: 'Bonus: 0' }, { in: ['30', 'full'], out: 'Bonus: 10', hidden: true }, { in: ['29', 'full'], out: 'Bonus: 0', hidden: true }],
            hints: ['Write the branches in the order the rules are given.', 'The last branch needs `and` with a bracketed `or`.']
          },

          { t: 'h', text: 'Scenario 3: car registrations' },
          { t: 'p', html: 'A valid registration is **two letters, two digits, a space, then three letters**, for example `KT65 HJD`. It is 8 characters long.' },
          {
            t: 'cases', title: 'Checking one rule at a time', items: [
              {
                label: 'Length and slices', code: C`
              reg = "KT65 HJD"
              print(len(reg) == 8)
              print(reg[0:2], reg[2:4], repr(reg[4]), reg[5:])
            ` },
              {
                label: 'Character tests', code: C`
              print("KT".isalpha(), "65".isdigit(), "6A".isdigit(), "HJ4".isalpha())
            ` },
              {
                label: 'Early return', intro: 'Return `False` as soon as one rule fails. Return `True` only at the end.', code: C`
              def is_even_length(text):
                  if len(text) % 2 != 0:
                      return False
                  return True

              print(is_even_length("abcd"), is_even_length("abc"))
            ` },
            ]
          },
          {
            t: 'exercise', id: 'm13-ex-reg', title: 'Valid registration', level: 2, kind: 'exam',
            prompt: 'Write a function <code>valid_reg(reg)</code> that returns <code>True</code> for a valid registration and <code>False</code> otherwise. (5 marks)',
            starter: C`
              def valid_reg(reg):
                  pass
            `,
            solution: C`
              def valid_reg(reg):
                  if len(reg) != 8:
                      return False
                  if not reg[0:2].isalpha():
                      return False
                  if not reg[2:4].isdigit():
                      return False
                  if reg[4] != " ":
                      return False
                  if not reg[5:8].isalpha():
                      return False
                  return True
            `,
            tests: [{ py: 'assert valid_reg("KT65 HJD") == True', label: 'valid example' }, { py: 'assert valid_reg("KT65HJD") == False', label: 'missing space' }, { py: 'assert valid_reg("K765 HJD") == False', label: 'digit in letters' }, { py: 'assert valid_reg("KT6A HJD") == False', label: 'letter in digits' }, { py: 'assert valid_reg("KT65 HJ4") == False', label: 'digit at end' }, { py: 'assert valid_reg("KT65 HJDX") == False', label: 'too long', hidden: true }, { py: 'assert valid_reg("") == False', label: 'empty', hidden: true }],
            hints: ['Check the length first so that indexing cannot go out of range.', 'Slices: `reg[0:2]`, `reg[2:4]`, `reg[4]`, `reg[5:]`.']
          },

          { t: 'h', text: 'Scenario 4: cargo ship loads' },
          { t: 'p', html: 'A ship loads containers one at a time. The list holds each container weight in tonnes. The ship must stop loading when the **running total goes above** the ship limit.' },
          {
            t: 'code', title: 'cargo.py (press Trace table)', code: C`
            loads = [30, 25, 40, 20]
            limit = 90
            total = 0
            position = 0
            for i in range(len(loads)):
                total = total + loads[i]
                if total > limit and position == 0:
                    position = i + 1
            print(total, position)
          `, caption: 'Fill your own trace table first, then check it against the Trace table button.'
          },
          {
            t: 'predict', title: 'State the output', code: C`
            loads = [10, 40, 30, 25]
            limit = 80
            total = 0
            position = 0
            for i in range(len(loads)):
                total = total + loads[i]
                if total > limit and position == 0:
                    position = i + 1
            print(total, position)
          `, rows: 1, why: 'Totals run 10, 50, 80, 105. 80 is not above 80, so the first overload is container 4. Output: `105 4`.'
          },
          {
            t: 'exercise', id: 'm13-ex-cargo', title: 'First overload', level: 2, kind: 'exam',
            prompt: 'Write a function <code>first_overload(loads, limit)</code> that returns the **position** (counting from 1) of the container at which the running total first goes above <code>limit</code>. Return <code>0</code> if the limit is never exceeded. (5 marks)',
            starter: C`
              def first_overload(loads, limit):
                  pass
            `,
            solution: C`
              def first_overload(loads, limit):
                  total = 0
                  for i in range(len(loads)):
                      total = total + loads[i]
                      if total > limit:
                          return i + 1
                  return 0
            `,
            tests: [{ py: 'assert first_overload([10, 20, 30], 50) == 3' }, { py: 'assert first_overload([10, 20, 30], 60) == 0', label: 'total equal to limit is fine' }, { py: 'assert first_overload([100], 50) == 1' }, { py: 'assert first_overload([], 5) == 0', label: 'empty list' }, { py: 'assert first_overload([5, 5, 5, 5], 12) == 3', hidden: true }],
            hints: ['Keep a running total. Add each weight inside the loop.', '`>` not `>=`: equal to the limit is allowed.', 'Return `0` only after the loop has finished.']
          },

          { t: 'h', text: 'Scenario 5: train punctuality' },
          { t: 'p', html: 'A list holds how many minutes each train was away from its timetable. **Negative** means early, **0** means on time, **positive** means late.' },
          {
            t: 'cases', title: 'Three counters in one loop', items: [
              {
                label: 'Count with if/elif', code: C`
              delays = [-2, 0, 5, 0, 12, -1]
              early = 0
              on_time = 0
              late = 0
              for d in delays:
                  if d < 0:
                      early = early + 1
                  elif d == 0:
                      on_time = on_time + 1
                  else:
                      late = late + 1
              print(early, on_time, late)
            ` },
              {
                label: 'Return several values', code: C`
              def pair(a, b):
                  return a, b

              x, y = pair(3, 4)
              print(x, y)
              print(pair(1, 2))
            ` },
            ]
          },
          {
            t: 'exercise', id: 'm13-ex-trains', title: 'Early, on time, late', level: 2, kind: 'exam',
            prompt: 'Write a function <code>count_trains(delays)</code> that returns three values in this order: the number of early trains, on-time trains, late trains. (5 marks)',
            starter: C`
              def count_trains(delays):
                  pass
            `,
            solution: C`
              def count_trains(delays):
                  early = 0
                  on_time = 0
                  late = 0
                  for d in delays:
                      if d < 0:
                          early = early + 1
                      elif d == 0:
                          on_time = on_time + 1
                      else:
                          late = late + 1
                  return early, on_time, late
            `,
            tests: [{ py: 'assert count_trains([-2, 0, 5, 0, 12, -1]) == (2, 2, 2)' }, { py: 'assert count_trains([]) == (0, 0, 0)', label: 'no trains' }, { py: 'assert count_trains([3, 3, 3]) == (0, 0, 3)' }, { py: 'assert count_trains([-1]) == (1, 0, 0)', hidden: true }],
            hints: ['Three counters, all starting at 0 before the loop.', 'An `if` / `elif` / `else` chain ensures each train is counted once.']
          },

          { t: 'h', text: 'Scenario 6: scores in a file' },
          { t: 'p', html: 'A file `scores.txt` has one player per line in the form `name,score`. Read it into two lists, then report the highest scorer and the mean score.' },
          {
            t: 'code', title: 'Reading into two lists', files: { 'scores.txt': 'Asha,92\nBen,67\nChloe,81\n' }, code: C`
            names = []
            scores = []
            file = open("scores.txt", "r")
            for line in file:
                parts = line.strip().split(",")
                names.append(parts[0])
                scores.append(int(parts[1]))
            file.close()
            print(names)
            print(scores)
          `, caption: '`strip()` removes the newline, `split(",")` cuts the line into a list of two pieces, and `int()` converts the score.'
          },
          {
            t: 'exercise', id: 'm13-ex-scorefile', title: 'Score file report', level: 2, kind: 'exam',
            prompt: 'Read <code>scores.txt</code> into two lists. Display <code>Highest: </code> then the name and score of the top player, then <code>Average: </code> then the mean score rounded to 1 decimal place. If scores tie, the first player listed wins. (8 marks)',
            starter: C`
              names = []
              scores = []
              file = open("scores.txt", "r")
              # read every line into the lists
              file.close()
            `,
            solution: C`
              names = []
              scores = []
              file = open("scores.txt", "r")
              for line in file:
                  parts = line.strip().split(",")
                  names.append(parts[0])
                  scores.append(int(parts[1]))
              file.close()
              best = 0
              for i in range(len(scores)):
                  if scores[i] > scores[best]:
                      best = i
              print("Highest:", names[best], scores[best])
              print("Average:", round(sum(scores) / len(scores), 1))
            `,
            tests: [
              { files: { 'scores.txt': 'Asha,92\nBen,67\nChloe,81\n' }, out: 'Highest: Asha 92\nAverage: 80.0' },
              { files: { 'scores.txt': 'Dev,50\nEmi,75\n' }, out: 'Highest: Emi 75\nAverage: 62.5' },
              { files: { 'scores.txt': 'Zed,10\n' }, out: 'Highest: Zed 10\nAverage: 10.0' },
              { files: { 'scores.txt': 'Al,40\nBo,90\nCy,90\nDi,10\n' }, out: 'Highest: Bo 90\nAverage: 57.5', hidden: true },
            ],
            hints: ['Follow the pattern in the example above.', 'Find the position of the biggest score, then use that same position in `names`.', '`round(value, 1)` gives one decimal place.']
          },

          { t: 'h', text: 'Scenario 7: 2D gradebook' },
          { t: 'p', html: 'A teacher stores results as a 2D list. Each row is one student: the name, then three test marks. Rows are indexed from 0 and column 1 is the first test.' },
          {
            t: 'code', title: 'Rows and columns', code: C`
            table = [["Asha", 70, 80, 90],
                     ["Ben", 55, 60, 65],
                     ["Chloe", 88, 92, 79]]
            print(table[1][0], table[1][3])
            row_total = 0
            for col in range(1, 4):
                row_total = row_total + table[0][col]
            print(row_total)
          ` },
          {
            t: 'exercise', id: 'm13-ex-gradebook', title: 'Gradebook functions', level: 3, kind: 'exam',
            prompt: 'Write two functions. <code>best_student(table)</code> returns the name of the student with the highest <strong>total</strong> across the three tests (first listed wins a tie). <code>test_average(table, col)</code> returns the mean of column <code>col</code> (1, 2 or 3). (8 marks)',
            starter: C`
              def best_student(table):
                  pass

              def test_average(table, col):
                  pass
            `,
            solution: C`
              def best_student(table):
                  best_name = table[0][0]
                  best_total = table[0][1] + table[0][2] + table[0][3]
                  for row in table:
                      total = row[1] + row[2] + row[3]
                      if total > best_total:
                          best_total = total
                          best_name = row[0]
                  return best_name

              def test_average(table, col):
                  total = 0
                  for row in table:
                      total = total + row[col]
                  return total / len(table)
            `,
            tests: [{ py: 'assert best_student([["A", 1, 2, 3], ["B", 9, 9, 9], ["C", 5, 5, 5]]) == "B"', label: 'best student' }, { py: 'assert best_student([["A", 5, 5, 5], ["B", 5, 5, 5]]) == "A"', label: 'tie goes to first' }, { py: 'assert best_student([["Solo", 0, 0, 0]]) == "Solo"', label: 'one student' }, { py: 'assert test_average([["A", 10, 20, 30], ["B", 20, 40, 60]], 1) == 15', label: 'test 1 average' }, { py: 'assert test_average([["A", 10, 20, 30], ["B", 20, 40, 60]], 3) == 45', label: 'test 3 average' }, { py: 'assert test_average([["A", 1, 2, 3]], 2) == 2', hidden: true }],
            hints: ['`row[0]` is the name, `row[1]` to `row[3]` are marks.', 'For the column, add `row[col]` for every row, then divide by the number of rows.']
          },

          { t: 'h', text: 'Scenario 8: sorting and searching from pseudocode' },
          { t: 'p', html: 'Edexcel gives the algorithm; you write it. Translate every line, including the swap with a temporary variable.' },
          {
            t: 'code', title: 'Swap, with a temporary variable', code: C`
            a = [4, 9, 2]
            temp = a[0]
            a[0] = a[1]
            a[1] = temp
            print(a)
            a[1], a[2] = a[2], a[1]
            print(a)
          `, caption: 'Both ways swap two items. The second is the short Python form.'
          },
          {
            t: 'exercise', id: 'm13-ex-bubble', title: 'Bubble sort from pseudocode', level: 3, kind: 'exam',
            prompt: 'Write <code>bubble_sort(arr)</code> so that it sorts the list <strong>in place</strong>, lowest first. Do not use <code>sort()</code> or <code>sorted()</code>. (6 marks)' + PRE(C`
              PROCEDURE bubbleSort(arr)
              BEGIN PROCEDURE
                SET n TO LENGTH(arr)
                FOR pass FROM 1 TO n - 1 DO
                  FOR i FROM 0 TO n - 2 DO
                    IF arr[i] > arr[i + 1] THEN
                      SET temp TO arr[i]
                      SET arr[i] TO arr[i + 1]
                      SET arr[i + 1] TO temp
                    END IF
                  END FOR
                END FOR
              END PROCEDURE
            `),
            starter: C`
              def bubble_sort(arr):
                  pass
            `,
            solution: C`
              def bubble_sort(arr):
                  n = len(arr)
                  for p in range(1, n):
                      for i in range(0, n - 1):
                          if arr[i] > arr[i + 1]:
                              temp = arr[i]
                              arr[i] = arr[i + 1]
                              arr[i + 1] = temp
            `,
            tests: [{ py: 'a = [5, 2, 9, 1]\nbubble_sort(a)\nassert a == [1, 2, 5, 9], "got " + str(a)', label: 'unsorted list' }, { py: 'a = [1, 2, 3]\nbubble_sort(a)\nassert a == [1, 2, 3]', label: 'already sorted' }, { py: 'a = []\nbubble_sort(a)\nassert a == []', label: 'empty list' }, { py: 'a = [3, 1, 3, 2, 1]\nbubble_sort(a)\nassert a == [1, 1, 2, 3, 3]', label: 'duplicates' }, { py: 'a = ["pear", "apple", "fig"]\nbubble_sort(a)\nassert a == ["apple", "fig", "pear"]', label: 'strings', hidden: true }],
            requires: [{ re: '\\.sort\\(|sorted\\(', not: true, msg: 'Write the algorithm yourself. Do not use `sort()` or `sorted()`.' }],
            hints: ['`FOR pass FROM 1 TO n - 1` is `range(1, n)`. `FOR i FROM 0 TO n - 2` is `range(0, n - 1)`.', 'The swap needs three lines with `temp`.']
          },
          {
            t: 'exercise', id: 'm13-ex-binsearch', title: 'Binary search from pseudocode', level: 3, kind: 'exam',
            prompt: 'Write <code>binary_search(arr, target)</code> for a **sorted** list. Return the index of <code>target</code>, or <code>-1</code> if it is not there. (6 marks)' + PRE(C`
              FUNCTION binarySearch(arr, target)
              BEGIN FUNCTION
                SET low TO 0
                SET high TO LENGTH(arr) - 1
                WHILE low <= high DO
                  SET mid TO (low + high) DIV 2
                  IF arr[mid] = target THEN
                    RETURN mid
                  ELSE IF arr[mid] < target THEN
                    SET low TO mid + 1
                  ELSE
                    SET high TO mid - 1
                  END IF
                END WHILE
                RETURN -1
              END FUNCTION
            `),
            starter: C`
              def binary_search(arr, target):
                  pass
            `,
            solution: C`
              def binary_search(arr, target):
                  low = 0
                  high = len(arr) - 1
                  while low <= high:
                      mid = (low + high) // 2
                      if arr[mid] == target:
                          return mid
                      elif arr[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return -1
            `,
            tests: [{ py: 'assert binary_search([2, 4, 6, 8, 10], 8) == 3' }, { py: 'assert binary_search([2, 4, 6, 8, 10], 2) == 0', label: 'first item' }, { py: 'assert binary_search([2, 4, 6, 8, 10], 10) == 4', label: 'last item' }, { py: 'assert binary_search([2, 4, 6, 8, 10], 5) == -1', label: 'not present' }, { py: 'assert binary_search([], 1) == -1', label: 'empty list', hidden: true }, { py: 'assert binary_search(["ant", "bee", "cat"], "cat") == 2', hidden: true }],
            hints: ['`DIV` is `//`.', 'Keep looping while `low <= high`.', 'Return `-1` only after the loop.']
          },

          { t: 'h', text: 'Scenario 9: encryption and compression' },
          {
            t: 'cases', title: 'The tools you need', items: [
              {
                label: 'ord and chr', code: C`
              print(ord("A"), ord("a"), chr(66))
              print(ord("D") - ord("A"))
            ` },
              {
                label: 'Wrap-around with %', code: C`
              position = 24
              shift = 5
              print((position + shift) % 26)
            ` },
              {
                label: 'Counting a run', code: C`
              text = "WWBBB"
              print(text[0] == text[1], text[1] == text[2])
              print(len(text))
            ` },
            ]
          },
          {
            t: 'exercise', id: 'm13-ex-caesar', title: 'Caesar encrypt', level: 3, kind: 'exam',
            prompt: 'Write <code>encrypt(text, shift)</code>. Shift each <strong>upper-case</strong> letter forward by <code>shift</code> places, wrapping from Z to A. Leave every other character unchanged. (6 marks)',
            starter: C`
              def encrypt(text, shift):
                  pass
            `,
            solution: C`
              def encrypt(text, shift):
                  result = ""
                  for ch in text:
                      if ch.isupper():
                          result = result + chr((ord(ch) - 65 + shift) % 26 + 65)
                      else:
                          result = result + ch
                  return result
            `,
            tests: [{ py: 'assert encrypt("HELLO", 3) == "KHOOR"' }, { py: 'assert encrypt("XYZ", 3) == "ABC"', label: 'wraps round' }, { py: 'assert encrypt("Hi, ZED!", 1) == "Ii, AFE!"', label: 'keeps other characters' }, { py: 'assert encrypt("ABC", 0) == "ABC"', label: 'shift of zero' }, { py: 'assert encrypt("", 5) == ""', hidden: true }],
            hints: ['Convert with `ord(ch) - 65` so that A becomes 0.', 'Add the shift, use `% 26`, then add 65 and use `chr()`.']
          },
          {
            t: 'exercise', id: 'm13-ex-rle', title: 'Run length encoding', level: 3, kind: 'exam',
            prompt: 'Write <code>rle(text)</code> that compresses repeated characters. <code>"WWWBBA"</code> becomes <code>"3W2B1A"</code>: a count, then the character. An empty string gives an empty string. (6 marks)',
            starter: C`
              def rle(text):
                  pass
            `,
            solution: C`
              def rle(text):
                  if text == "":
                      return ""
                  result = ""
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == text[i - 1]:
                          count = count + 1
                      else:
                          result = result + str(count) + text[i - 1]
                          count = 1
                  result = result + str(count) + text[-1]
                  return result
            `,
            tests: [{ py: 'assert rle("WWWBBA") == "3W2B1A"' }, { py: 'assert rle("A") == "1A"', label: 'one character' }, { py: 'assert rle("") == ""', label: 'empty string' }, { py: 'assert rle("aaaa") == "4a"', label: 'one long run' }, { py: 'assert rle("abab") == "1a1b1a1b"', label: 'no runs', hidden: true }],
            hints: ['Compare each character with the one before it.', 'When the character changes, store the count and the old character, then reset the count.', 'The final run is not stored inside the loop. Store it after the loop.']
          },

          { t: 'quiz', q: 'A test value just outside the allowed range is called…', options: ['normal data', 'boundary data', 'erroneous data only', 'verification'], answer: 1, why: 'Boundary data tests the edges of a range: the limit values and the values just either side.' },
          { t: 'quiz', q: 'Which of these are marks you might earn for the cinema program?', options: ['Two correct inputs converted to integer', 'A correct condition for invalid adults', 'A correct cost calculation', 'A comment on every line'], answer: [0, 1, 2], why: 'Marks reward the main ideas: input, condition, calculation, output. A comment on every line is not required.' },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'exam-debugging',
        title: 'Amend the code',
        time: '50 min',
        book: 'Paper 2 practice',
        exam: 'Paper 2 · amend the code',
        summary: 'Find and fix the planted errors, topic by topic',
        intro: 'The exam gives you a program that does not work and tells you how many errors it has. This lesson shows the bug patterns that appear again and again, then lets you practise on nine programs.',
        blocks: [
          { t: 'h', text: 'A method that finds bugs quickly' },
          {
            t: 'list', ordered: true, items: [
              '**Run it first.** A syntax error stops everything. Fix those until the program starts.',
              '**Read the error message.** The type and line number point at the cause.',
              '**Check the scenario.** After it runs, compare each output with what the question says it should do.',
              '**Look at the usual suspects:** a missing colon, `=` for `==`, missing `int()`, wrong operator, off-by-one in a loop, a variable reset in the wrong place, a missing `return`.',
              '**Count.** If the question says four errors, keep looking until you have four.',
            ]
          },
          { t: 'note', kind: 'exam', html: 'In "amend the code" you gain marks for each error fixed and lose none for the ones you leave. Never rewrite the whole program: change the smallest thing that makes it correct.' },

          { t: 'h', text: 'Bug patterns in action' },
          {
            t: 'cases', title: 'Syntax and runtime bugs', items: [
              {
                label: 'Missing colon', expectError: true, code: C`
              n = 5
              if n > 3
                  print("big")
            ` },
              {
                label: 'Bad indentation', expectError: true, code: C`
              for i in range(3):
              print(i)
            ` },
              {
                label: 'Missing int()', expectError: true, intro: 'A very common one. The program crashes when it tries to compare text with a number.', code: C`
              qty = input("Quantity: ")
              if qty > 5:
                  print("Bulk order")
            `, stdin: ['8']
              },
              {
                label: 'Off the end of a list', expectError: true, code: C`
              marks = [4, 8, 6]
              for i in range(len(marks) + 1):
                  print(marks[i])
            ` },
              {
                label: 'Name typo', expectError: true, code: C`
              total = 10
              print(totl)
            ` },
            ]
          },
          {
            t: 'cases', title: 'Logic bugs (no error message)', items: [
              {
                label: 'Reset inside the loop', intro: 'The total is thrown away on every pass. Press Trace.', code: C`
              total = 0
              for n in [3, 4, 5]:
                  total = 0
                  total = total + n
              print(total)
            ` },
              {
                label: 'Boundary: > or >=', intro: 'The rule says 18 or over. 18 itself is wrongly rejected.', code: C`
              age = 18
              if age > 18:
                  print("Allowed")
              else:
                  print("Not allowed")
            ` },
              {
                label: 'Print instead of return', intro: 'The function shows the answer but gives nothing back.', code: C`
              def double(x):
                  print(x * 2)

              result = double(4)
              print(result)
            ` },
              {
                label: 'Wrong loop end', intro: 'Meant to print 1 to 5.', code: C`
              for i in range(1, 5):
                  print(i)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'A logic error will not stop the program, so check the **output**, not just whether it ran. Compare with a result you worked out by hand.' },
          {
            t: 'predict', title: 'What does the buggy loop print?', code: C`
            total = 0
            for n in [3, 4, 5]:
                total = 0
                total = total + n
            print(total)
          `, rows: 1, why: 'Total is reset to 0 each time round, so only the last value survives: 5.'
          },
          {
            t: 'sort', prompt: 'Which kind of error is each of these?', cats: ['Syntax', 'Runtime', 'Logic'], items: [
              { text: 'A missing colon after `else`', cat: 0 },
              { text: 'Using `>` where `>=` was needed', cat: 2 },
              { text: 'Indexing past the end of a list', cat: 1 },
              { text: 'Adding text to a number without `str()`', cat: 1 },
              { text: 'A function that prints but never returns', cat: 2 },
              { text: 'Opening a file that does not exist', cat: 1 },
              { text: 'Unmatched bracket in a `print`', cat: 0 },
            ], why: 'Syntax errors stop the program starting, runtime errors crash it, logic errors give the wrong answer.'
          },
          { t: 'quiz', q: 'A program runs without any message but prints a total that is too small by the first number. What is the most likely cause?', options: ['A missing colon', 'A loop starting at index 1 instead of 0', 'A missing bracket', 'Using `print` instead of `Print`'], answer: 1, why: 'Starting at 1 skips the item at index 0, so no error is raised but the answer is short.' },

          { t: 'h', text: 'Practice: amend these programs' },
          {
            t: 'exercise', id: 'm13-ex-dbg-chips', title: 'Chip shop stock', level: 2, kind: 'debug',
            prompt: 'The shop starts with 20 portions of chips. A customer orders some portions at 2.5 each. Orders of 5 or more get 10% off. If there is not enough stock the program says so. There are <strong>four</strong> errors. Amend the code.',
            starter: C`
              stock = 20
              portions = input("Portions: ")
              if portions > stock:
                  print("Not enough stock")
              else
                  stock = stock + portions
                  cost = portions * 2.5
                  if portions > 5:
                      cost = cost * 0.9
                  print("Cost:", cost)
                  print("Stock left:", stock)
            `,
            solution: C`
              stock = 20
              portions = int(input("Portions: "))
              if portions > stock:
                  print("Not enough stock")
              else:
                  stock = stock - portions
                  cost = portions * 2.5
                  if portions >= 5:
                      cost = cost * 0.9
                  print("Cost:", cost)
                  print("Stock left:", stock)
            `,
            tests: [{ in: ['3'], out: 'Cost: 7.5\nStock left: 17' }, { in: ['5'], out: 'Cost: 11.25\nStock left: 15' }, { in: ['25'], out: 'Not enough stock' }, { in: ['20'], out: 'Cost: 45.0\nStock left: 0', hidden: true }, { in: ['4'], out: 'Cost: 10.0\nStock left: 16', hidden: true }],
            hints: ['Run it. The first problem Python reports is a syntax error.', 'Stock should go down when chips are sold. Is it `+` or `-`?', 'Compare the discount rule "5 or more" with the condition in the code.']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-average', title: 'Average of five marks', level: 2, kind: 'debug',
            prompt: 'The program reads five marks and displays their average. There are <strong>four</strong> errors.',
            starter: C`
              for i in range(5):
                  total = 0
                  mark = input("Mark: ")
                  total = total + mark
              average = total / 4
              print("Average:" average)
            `,
            solution: C`
              total = 0
              for i in range(5):
                  mark = int(input("Mark: "))
                  total = total + mark
              average = total / 5
              print("Average:", average)
            `,
            tests: [{ in: ['10', '20', '30', '40', '50'], out: 'Average: 30.0' }, { in: ['4', '4', '4', '4', '4'], out: 'Average: 4.0' }, { in: ['0', '0', '0', '0', '0'], out: 'Average: 0.0' }, { in: ['7', '8', '9', '10', '6'], out: 'Average: 8.0', hidden: true }],
            hints: ['Where should `total` be set to 0: inside or outside the loop?', 'Marks are typed as text. What converts them?', 'How many marks are added up?']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-highest', title: 'Highest score and position', level: 2, kind: 'debug',
            prompt: 'The function <code>find_highest(scores)</code> should return two values: the highest score and its index. There are <strong>four</strong> errors.',
            starter: C`
              def find_highest(scores):
                  highest = 0
                  position = 0
                  for i in range(1, len(scores) - 1):
                      if scores[i] < highest:
                          highest = scores[i]
                          position = i
                  return highest
            `,
            solution: C`
              def find_highest(scores):
                  highest = scores[0]
                  position = 0
                  for i in range(1, len(scores)):
                      if scores[i] > highest:
                          highest = scores[i]
                          position = i
                  return highest, position
            `,
            tests: [{ py: 'assert find_highest([45, 78, 92, 61, 88]) == (92, 2)', label: 'normal list' }, { py: 'assert find_highest([5, 9]) == (9, 1)', label: 'last item is highest' }, { py: 'assert find_highest([-3, -1, -8]) == (-1, 1)', label: 'negative numbers' }, { py: 'assert find_highest([7]) == (7, 0)', label: 'one item', hidden: true }],
            hints: ['Why is starting `highest` at 0 risky when the scores can be negative?', 'The loop stops one item too early.', 'The comparison sign and the return value both need attention.']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-vowels', title: 'Count the vowels', level: 2, kind: 'debug',
            prompt: 'The function <code>count_vowels(word)</code> should count the vowels in a word, in capitals or lower case. There are <strong>four</strong> errors.',
            starter: C`
              def count_vowels(word):
                  count = 1
                  for letter in word:
                      if letter == "aeiou":
                          count = count + 1
            `,
            solution: C`
              def count_vowels(word):
                  count = 0
                  for letter in word.lower():
                      if letter in "aeiou":
                          count = count + 1
                  return count
            `,
            tests: [{ py: 'assert count_vowels("hello") == 2' }, { py: 'assert count_vowels("SKY") == 0', label: 'no vowels' }, { py: 'assert count_vowels("Education") == 5', label: 'mixed case' }, { py: 'assert count_vowels("") == 0', label: 'empty word', hidden: true }],
            hints: ['A new counter starts at 0.', 'A single letter is never equal to a five-letter string. Which operator tests membership?', 'Capital letters are not in "aeiou". Convert the word first.', 'What does the function give back?']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-grade', title: 'Grade boundaries', level: 2, kind: 'debug',
            prompt: 'The function <code>grade(mark)</code> returns <code>Distinction</code> for 70 or more, <code>Merit</code> for 50 or more, <code>Pass</code> for 40 or more, and <code>Fail</code> otherwise. There are <strong>three</strong> errors.',
            starter: C`
              def grade(mark):
                  if mark > 70:
                      return "Distinction"
                  elif mark >= 50
                      return "Merit"
                  elif mark >= 40:
                      return "Pass"
                  else:
                      print("Fail")
            `,
            solution: C`
              def grade(mark):
                  if mark >= 70:
                      return "Distinction"
                  elif mark >= 50:
                      return "Merit"
                  elif mark >= 40:
                      return "Pass"
                  else:
                      return "Fail"
            `,
            tests: [{ py: 'assert grade(70) == "Distinction"', label: '70' }, { py: 'assert grade(69) == "Merit"', label: '69' }, { py: 'assert grade(50) == "Merit"', label: '50' }, { py: 'assert grade(49) == "Pass"', label: '49' }, { py: 'assert grade(40) == "Pass"', label: '40' }, { py: 'assert grade(39) == "Fail"', label: '39' }, { py: 'assert grade(0) == "Fail"', hidden: true }],
            hints: ['Run it for the first error.', 'The test data at 70 is a boundary value.', 'The last branch must hand back a value, not just show it.']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-file', title: 'Total from a file', level: 2, kind: 'debug',
            prompt: 'The program reads whole numbers from <code>numbers.txt</code> (one per line) and shows how many there are and their total. There are <strong>four</strong> errors.',
            starter: C`
              file = open("number.txt", "w")
              total = 0
              count = 0
              for line in file:
                  total = total + line
              count = count + 1
              file.close()
              print("Count:", count)
              print("Total:", total)
            `,
            solution: C`
              file = open("numbers.txt", "r")
              total = 0
              count = 0
              for line in file:
                  total = total + int(line)
                  count = count + 1
              file.close()
              print("Count:", count)
              print("Total:", total)
            `,
            files: { 'numbers.txt': '4\n6\n10\n' },
            tests: [{ files: { 'numbers.txt': '4\n6\n10\n' }, out: 'Count: 3\nTotal: 20' }, { files: { 'numbers.txt': '5\n' }, out: 'Count: 1\nTotal: 5' }, { files: { 'numbers.txt': '-2\n2\n' }, out: 'Count: 2\nTotal: 0' }, { files: { 'numbers.txt': '' }, out: 'Count: 0\nTotal: 0', hidden: true }],
            hints: ['Check the file name carefully, and the mode: read is `"r"`.', 'Lines are text. Convert them before adding.', 'The counter must be inside the loop body.']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-bubble', title: 'Broken bubble sort', level: 3, kind: 'debug',
            prompt: 'This <code>bubble_sort(arr)</code> should sort the list into ascending order, in place. There are <strong>three</strong> errors.',
            starter: C`
              def bubble_sort(arr):
                  n = len(arr)
                  for p in range(n - 1):
                      for i in range(n):
                          if arr[i] < arr[i + 1]:
                              arr[i] = arr[i + 1]
                              arr[i + 1] = arr[i]
            `,
            solution: C`
              def bubble_sort(arr):
                  n = len(arr)
                  for p in range(n - 1):
                      for i in range(n - 1):
                          if arr[i] > arr[i + 1]:
                              temp = arr[i]
                              arr[i] = arr[i + 1]
                              arr[i + 1] = temp
            `,
            tests: [{ py: 'a = [5, 2, 9, 1]\nbubble_sort(a)\nassert a == [1, 2, 5, 9], "got " + str(a)', label: 'unsorted list' }, { py: 'a = [1, 2, 3]\nbubble_sort(a)\nassert a == [1, 2, 3]', label: 'already sorted' }, { py: 'a = [3, 1, 3, 2, 1]\nbubble_sort(a)\nassert a == [1, 1, 2, 3, 3]', label: 'duplicates' }, { py: 'a = [2, 1]\nbubble_sort(a)\nassert a == [1, 2]', label: 'two items', hidden: true }],
            hints: ['`arr[i + 1]` must always exist. How far should `i` go?', 'Which comparison sign puts the smaller number first?', 'A swap needs a temporary variable. Otherwise both slots end up equal.']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-rowtotals', title: 'Row totals', level: 3, kind: 'debug',
            prompt: 'The function <code>row_totals(grid)</code> should return a list with the total of each row of a 2D list. There are <strong>two</strong> errors, both about where lines sit in the loops.',
            starter: C`
              def row_totals(grid):
                  totals = []
                  total = 0
                  for row in grid:
                      for value in row:
                          total = total + value
                  totals.append(total)
                  return totals
            `,
            solution: C`
              def row_totals(grid):
                  totals = []
                  for row in grid:
                      total = 0
                      for value in row:
                          total = total + value
                      totals.append(total)
                  return totals
            `,
            tests: [{ py: 'assert row_totals([[1, 2], [3, 4]]) == [3, 7]' }, { py: 'assert row_totals([[5]]) == [5]', label: 'single cell' }, { py: 'assert row_totals([[1, 1, 1], [0, 0, 0], [2, 2, 2]]) == [3, 0, 6]' }, { py: 'assert row_totals([]) == []', label: 'empty grid', hidden: true }],
            hints: ['Each row needs its own fresh total.', 'Where should the total be stored: once per row, or once overall?']
          },
          {
            t: 'exercise', id: 'm13-ex-dbg-caesar', title: 'Faulty cipher', level: 3, kind: 'debug',
            prompt: 'The function <code>encrypt(text, shift)</code> should shift upper-case letters forward (wrapping from Z to A) and leave other characters alone. There are <strong>three</strong> errors.',
            starter: C`
              def encrypt(text, shift):
                  result = ""
                  for ch in text:
                      if ch.isupper():
                          result = result + chr((ord(ch) - 65 + shift) % 25 + 65)
                      else:
                          result = ch
                      return result
            `,
            solution: C`
              def encrypt(text, shift):
                  result = ""
                  for ch in text:
                      if ch.isupper():
                          result = result + chr((ord(ch) - 65 + shift) % 26 + 65)
                      else:
                          result = result + ch
                  return result
            `,
            tests: [{ py: 'assert encrypt("HELLO", 3) == "KHOOR"' }, { py: 'assert encrypt("XYZ", 3) == "ABC"', label: 'wrap-around' }, { py: 'assert encrypt("Hi, ZED!", 1) == "Ii, AFE!"', label: 'other characters kept' }, { py: 'assert encrypt("ABC", 0) == "ABC"', hidden: true }],
            hints: ['How many letters are in the alphabet?', 'In the `else` branch the other characters are being thrown away.', 'Look at how far the `return` is indented.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'mini-projects',
        title: 'Mini projects',
        time: '70 min',
        book: 'Projects',
        exam: 'Paper 2 · extended programs',
        summary: 'Six bigger programs built from menus, functions and files',
        intro: 'Real programs combine everything: input, decisions, loops, lists, functions and files. Each project below is a little larger than an exam question and is checked with several tests.',
        blocks: [
          { t: 'h', text: 'How to build a bigger program' },
          {
            t: 'list', items: [
              '**Plan first.** Write the steps as comments before any code.',
              '**One job per function.** A function that does one thing is easy to test.',
              '**Build and test in layers.** Get the first menu option working before the second.',
              '**Keep the main program short.** It should mostly call functions.',
            ]
          },
          { t: 'note', kind: 'tip', html: 'In the projects that follow, the tests ignore the text inside `input("...")`. Put menus and prompts there, and use `print()` only for the results the project describes.' },
          {
            t: 'cases', title: 'The skeleton of a menu program', items: [
              {
                label: 'Menu loop', intro: 'Press Trace to follow the inputs.', code: C`
              def show_report():
                  print("Report shown")

              choice = ""
              while choice != "2":
                  choice = input("1 report, 2 quit: ")
                  if choice == "1":
                      show_report()
                  elif choice != "2":
                      print("Invalid choice")
            `, stdin: ['1', '7', '2']
              },
              {
                label: 'Functions pass results', code: C`
              def read_number():
                  return int(input("Number: "))

              def double(n):
                  return n * 2

              print(double(read_number()))
            `, stdin: ['21']
              },
              {
                label: 'File-backed data', files: { 'data.txt': 'a\nb\n' }, code: C`
              def load(filename):
                  items = []
                  file = open(filename, "r")
                  for line in file:
                      items.append(line.strip())
                  file.close()
                  return items

              print(load("data.txt"))
            ` },
            ]
          },
          {
            t: 'predict', title: 'Menu trace', code: C`
            choice = ""
            count = 0
            for typed in ["1", "9", "1", "2"]:
                choice = typed
                if choice == "1":
                    count = count + 1
                elif choice != "2":
                    print("Invalid choice")
            print(count)
          `, rows: 2, why: 'The 9 is invalid and shown as such. Two "1" choices make count 2.'
          },
          { t: 'quiz', q: 'In a menu loop, what is the best reason to put each option in its own function?', options: ['It makes the program run faster', 'Each part can be written and tested on its own', 'Python requires it', 'It removes the need for variables'], answer: 1, why: 'Subprograms break a problem into parts that can be tested separately and reused.' },

          { t: 'h', text: 'Project 1: quiz game' },
          {
            t: 'exercise', id: 'm13-ex-proj-quiz', title: 'Three-question quiz', level: 2,
            prompt: 'Ask these three questions in order. Answers are not case-sensitive and spaces at either end are ignored.<br>1. <code>7 x 8 = ?</code> (56)<br>2. <code>Capital of France?</code> (paris)<br>3. <code>Bits in a byte?</code> (8)<br>After each answer display <code>Correct</code> or <code>Wrong</code>. At the end display <code>You scored X out of 3</code>. Use a function <code>ask(question, answer)</code> that returns <code>True</code> or <code>False</code>.',
            starter: C`
              def ask(question, answer):
                  pass

              score = 0
              # ask the three questions
            `,
            solution: C`
              def ask(question, answer):
                  reply = input(question + " ").strip().lower()
                  if reply == answer:
                      print("Correct")
                      return True
                  print("Wrong")
                  return False

              score = 0
              if ask("7 x 8 = ?", "56"):
                  score = score + 1
              if ask("Capital of France?", "paris"):
                  score = score + 1
              if ask("Bits in a byte?", "8"):
                  score = score + 1
              print("You scored", score, "out of 3")
            `,
            tests: [{ in: ['56', 'Paris', '8'], out: 'Correct\nCorrect\nCorrect\nYou scored 3 out of 3' }, { in: ['55', 'london', '9'], out: 'Wrong\nWrong\nWrong\nYou scored 0 out of 3' }, { in: ['56', ' PARIS ', '7'], out: 'Correct\nCorrect\nWrong\nYou scored 2 out of 3' }, { in: ['1', 'paris', '8'], out: 'Wrong\nCorrect\nCorrect\nYou scored 2 out of 3', hidden: true }],
            requires: [{ re: 'def\\s+ask', msg: 'Define the function `ask`.' }],
            hints: ['Inside `ask`: read the reply, `strip().lower()` it, compare, print, return.', 'In the main program use `if ask(...):` to add to the score.']
          },

          { t: 'h', text: 'Project 2: number guessing' },
          {
            t: 'exercise', id: 'm13-ex-proj-guess', title: 'Guess the number', level: 2,
            prompt: 'Import <code>random</code> and choose a secret whole number from 1 to 50 with <code>random.randint(1, 50)</code>. Give the player up to <strong>5</strong> guesses. After each wrong guess display <code>Too low</code> or <code>Too high</code>. For a right guess display <code>Correct! Guesses: N</code> and stop. If all 5 are wrong display <code>Out of guesses. The number was S</code>.',
            starter: C`
              import random

              secret = random.randint(1, 50)
              # up to 5 guesses
            `,
            solution: C`
              import random

              secret = random.randint(1, 50)
              guesses = 0
              found = False
              while guesses < 5 and not found:
                  guess = int(input("Guess: "))
                  guesses = guesses + 1
                  if guess == secret:
                      found = True
                      print("Correct! Guesses:", guesses)
                  elif guess < secret:
                      print("Too low")
                  else:
                      print("Too high")
              if not found:
                  print("Out of guesses. The number was", secret)
            `,
            tests: [{ seed: 1, in: ['5', '12', '9'], out: 'Too low\nToo high\nCorrect! Guesses: 3' }, { seed: 2, in: ['4'], out: 'Correct! Guesses: 1' }, { seed: 3, in: ['1', '2', '3', '4', '5'], out: 'Too low\nToo low\nToo low\nToo low\nToo low\nOut of guesses. The number was 16' }, { seed: 7, in: ['30', '25', '22', '21'], out: 'Too high\nToo high\nToo high\nCorrect! Guesses: 4', hidden: true }],
            hints: ['Keep a counter of guesses and a flag `found`.', 'Loop `while guesses < 5 and not found`.', 'After the loop, show the failure message only if `found` is still `False`.']
          },

          { t: 'h', text: 'Project 3: cash machine' },
          {
            t: 'exercise', id: 'm13-ex-proj-atm', title: 'ATM with a PIN', level: 3,
            prompt: 'The correct PIN is <code>4821</code> and the balance starts at <code>250</code>. The user gets <strong>3</strong> PIN attempts: each wrong PIN displays <code>Wrong PIN</code>. After 3 wrong attempts display <code>Card blocked</code> and end the program. After a correct PIN show a menu (use <code>input()</code> prompts): 1 = display <code>Balance: N</code>, 2 = withdraw (read the amount; if it is more than the balance display <code>Insufficient funds</code>, otherwise reduce the balance and display <code>Withdrawn N</code>), 3 = display <code>Goodbye</code> and end. Any other choice displays <code>Invalid choice</code>. PIN entries and menu choices are read as text.',
            starter: C`
              PIN = "4821"
              balance = 250
              # check the PIN, then run the menu
            `,
            solution: C`
              PIN = "4821"
              balance = 250
              attempts = 0
              ok = False
              while attempts < 3 and not ok:
                  entry = input("PIN: ")
                  if entry == PIN:
                      ok = True
                  else:
                      print("Wrong PIN")
                      attempts = attempts + 1
              if not ok:
                  print("Card blocked")
              else:
                  choice = ""
                  while choice != "3":
                      choice = input("1 balance, 2 withdraw, 3 exit: ")
                      if choice == "1":
                          print("Balance:", balance)
                      elif choice == "2":
                          amount = int(input("Amount: "))
                          if amount > balance:
                              print("Insufficient funds")
                          else:
                              balance = balance - amount
                              print("Withdrawn", amount)
                      elif choice == "3":
                          print("Goodbye")
                      else:
                          print("Invalid choice")
            `,
            tests: [{ in: ['4821', '1', '3'], out: 'Balance: 250\nGoodbye' }, { in: ['0000', '1234', '9999'], out: 'Wrong PIN\nWrong PIN\nWrong PIN\nCard blocked' }, { in: ['1111', '4821', '2', '100', '1', '3'], out: 'Wrong PIN\nWithdrawn 100\nBalance: 150\nGoodbye' }, { in: ['4821', '2', '300', '3'], out: 'Insufficient funds\nGoodbye' }, { in: ['4821', '7', '3'], out: 'Invalid choice\nGoodbye', hidden: true }, { in: ['4821', '2', '250', '1', '3'], out: 'Withdrawn 250\nBalance: 0\nGoodbye', hidden: true }],
            hints: ['Two loops: one for the PIN (maximum 3 attempts), one for the menu.', 'A flag such as `ok` tells you if the PIN was accepted.', 'The menu loop ends when the choice is `"3"`.']
          },

          { t: 'h', text: 'Project 4: class gradebook' },
          { t: 'p', html: 'This project uses a 2D list. Each row is `[name, test1, test2, test3]`. Write four functions that work on any table.' },
          {
            t: 'exercise', id: 'm13-ex-proj-gradebook', title: 'Class gradebook', level: 3,
            prompt: 'Write: <code>averages(table)</code> returns a list of each student\'s mean mark rounded to 1 decimal place, in row order. <code>top_student(table)</code> returns the name with the highest mean (first wins a tie). <code>test_max(table, col)</code> returns the highest mark in column <code>col</code> (1 to 3). <code>add_student(table, name, marks)</code> appends a new row built from the name and the list of three marks (change the table in place).',
            starter: C`
              def averages(table):
                  pass

              def top_student(table):
                  pass

              def test_max(table, col):
                  pass

              def add_student(table, name, marks):
                  pass
            `,
            solution: C`
              def averages(table):
                  result = []
                  for row in table:
                      mean = (row[1] + row[2] + row[3]) / 3
                      result.append(round(mean, 1))
                  return result

              def top_student(table):
                  means = averages(table)
                  best = 0
                  for i in range(len(means)):
                      if means[i] > means[best]:
                          best = i
                  return table[best][0]

              def test_max(table, col):
                  highest = table[0][col]
                  for row in table:
                      if row[col] > highest:
                          highest = row[col]
                  return highest

              def add_student(table, name, marks):
                  table.append([name] + marks)
            `,
            tests: [
              { py: 'T = [["Asha", 70, 80, 90], ["Ben", 55, 60, 65], ["Chloe", 88, 92, 79]]\nassert averages(T) == [80.0, 60.0, 86.3], str(averages(T))', label: 'averages' },
              { py: 'T = [["Asha", 70, 80, 90], ["Ben", 55, 60, 65], ["Chloe", 88, 92, 79]]\nassert top_student(T) == "Chloe"', label: 'top student' },
              { py: 'T = [["A", 1, 2, 3], ["B", 3, 2, 1]]\nassert top_student(T) == "A"', label: 'tie goes to first' },
              { py: 'T = [["Asha", 70, 80, 90], ["Ben", 55, 60, 65], ["Chloe", 88, 92, 79]]\nassert test_max(T, 1) == 88 and test_max(T, 2) == 92 and test_max(T, 3) == 90', label: 'test maxima' },
              { py: 'T = [["A", 1, 2, 3]]\nadd_student(T, "B", [4, 5, 6])\nassert T == [["A", 1, 2, 3], ["B", 4, 5, 6]]', label: 'add student' },
              { py: 'T = [["Solo", 10, 10, 10]]\nassert averages(T) == [10.0] and test_max(T, 2) == 10 and top_student(T) == "Solo"', label: 'one student', hidden: true },
            ],
            hints: ['`row[1] + row[2] + row[3]` divided by 3 gives a mean.', '`top_student` can reuse `averages`.', '`[name] + marks` makes a new list starting with the name.']
          },

          { t: 'h', text: 'Project 5: student record manager' },
          {
            t: 'exercise', id: 'm13-ex-proj-records', title: 'Record file manager', level: 3,
            prompt: 'The file <code>students.txt</code> holds one student per line as <code>name,score</code>. Write a menu program (menu text goes in the <code>input()</code> prompt). Choice <code>1</code>: display each record as <code>name: score</code>. Choice <code>2</code>: read a name, then a score, and append <code>name,score</code> as a new line of the file. Choice <code>3</code>: display <code>Average: X</code> (mean score, 1 decimal place), or <code>No records</code> if the file is empty. Choice <code>4</code>: end. Anything else: display <code>Invalid choice</code>. Use functions to read and to save.',
            starter: C`
              def read_records():
                  pass

              choice = ""
              while choice != "4":
                  choice = input("1 list, 2 add, 3 average, 4 quit: ")
            `,
            solution: C`
              def read_records():
                  records = []
                  file = open("students.txt", "r")
                  for line in file:
                      parts = line.strip().split(",")
                      records.append([parts[0], int(parts[1])])
                  file.close()
                  return records

              def add_record(name, score):
                  file = open("students.txt", "a")
                  file.write(name + "," + str(score) + "\n")
                  file.close()

              choice = ""
              while choice != "4":
                  choice = input("1 list, 2 add, 3 average, 4 quit: ")
                  if choice == "1":
                      for rec in read_records():
                          print(rec[0] + ": " + str(rec[1]))
                  elif choice == "2":
                      name = input("Name: ")
                      score = int(input("Score: "))
                      add_record(name, score)
                  elif choice == "3":
                      records = read_records()
                      if len(records) == 0:
                          print("No records")
                      else:
                          total = 0
                          for rec in records:
                              total = total + rec[1]
                          print("Average:", round(total / len(records), 1))
                  elif choice != "4":
                      print("Invalid choice")
            `,
            tests: [
              { files: { 'students.txt': 'Asha,80\nBen,60\n' }, in: ['1', '4'], out: 'Asha: 80\nBen: 60' },
              { files: { 'students.txt': 'Asha,80\nBen,60\n' }, in: ['3', '4'], out: 'Average: 70.0' },
              { files: { 'students.txt': 'Asha,80\nBen,60\n' }, in: ['2', 'Cal', '75', '4'], files_out: { 'students.txt': 'Asha,80\nBen,60\nCal,75\n' } },
              { files: { 'students.txt': 'Asha,80\n' }, in: ['2', 'Cal', '75', '3', '4'], out: 'Average: 77.5' },
              { files: { 'students.txt': '' }, in: ['3', '4'], out: 'No records' },
              { files: { 'students.txt': 'Asha,80\n' }, in: ['9', '4'], out: 'Invalid choice', hidden: true },
            ],
            hints: ['Write `read_records()` first and test option 1 before the rest.', 'Open with `"a"` to add a line without erasing the others. End the written line with `\\n`.', 'Check for an empty list before dividing.']
          },

          { t: 'h', text: 'Project 6: Caesar tool' },
          {
            t: 'exercise', id: 'm13-ex-proj-caesar', title: 'Caesar cipher tool', level: 3,
            prompt: 'Write a menu program: <code>1</code> encrypt, <code>2</code> decrypt, <code>3</code> quit. For 1 and 2 read the message, then the shift (an integer) and display the result. Letters keep their case and wrap around the alphabet; every other character is unchanged. Anything else displays <code>Invalid choice</code>. Write a function <code>shift_text(text, shift)</code> and use it for both: decrypting is shifting by the negative amount.',
            starter: C`
              def shift_text(text, shift):
                  pass

              choice = ""
              while choice != "3":
                  choice = input("1 encrypt, 2 decrypt, 3 quit: ")
            `,
            solution: C`
              def shift_text(text, shift):
                  result = ""
                  for ch in text:
                      if ch.isupper():
                          result = result + chr((ord(ch) - 65 + shift) % 26 + 65)
                      elif ch.islower():
                          result = result + chr((ord(ch) - 97 + shift) % 26 + 97)
                      else:
                          result = result + ch
                  return result

              choice = ""
              while choice != "3":
                  choice = input("1 encrypt, 2 decrypt, 3 quit: ")
                  if choice == "1":
                      message = input("Message: ")
                      key = int(input("Shift: "))
                      print(shift_text(message, key))
                  elif choice == "2":
                      message = input("Message: ")
                      key = int(input("Shift: "))
                      print(shift_text(message, -key))
                  elif choice != "3":
                      print("Invalid choice")
            `,
            tests: [{ in: ['1', 'HELLO', '3', '3'], out: 'KHOOR' }, { in: ['2', 'KHOOR', '3', '3'], out: 'HELLO' }, { in: ['1', 'Hi there', '1', '3'], out: 'Ij uifsf' }, { in: ['1', 'xyz', '3', '2', 'abc', '3', '3'], out: 'abc\nxyz' }, { in: ['5', '3'], out: 'Invalid choice', hidden: true }, { in: ['1', 'Go on, win!', '13', '2', 'Tb ba, jva!', '13', '3'], out: 'Tb ba, jva!\nGo on, win!', hidden: true }],
            requires: [{ re: 'def\\s+shift_text', msg: 'Define `shift_text`.' }],
            hints: ['Handle upper and lower case separately: bases are 65 and 97.', 'Python `%` always gives a result from 0 up, even for a negative number, so decrypting works.']
          },
        ],
      },
    ],
  });
})();

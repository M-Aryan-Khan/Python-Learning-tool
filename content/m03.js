(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm03',
    title: 'Iteration (loops)',
    blurb: 'Repeat instructions with while and for loops, build totals and counters, nest loops, and stop early with break.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'while-loops',
        title: 'while loops',
        time: '35 min',
        book: 'Ch 2 · p.67-70',
        exam: 'Paper 2 Q2-Q6',
        summary: 'Counter, sentinel and condition-controlled loops; infinite loops',
        intro: 'Iteration means repeating a block of code. A `while` loop keeps repeating for as long as its condition is True, checking the condition before every pass.',
        blocks: [
          { t: 'h', text: 'Your first loop' },
          { t: 'p', html: 'A `while` loop looks like an `if`: a condition, a colon and an indented block. The difference is that when the block finishes, Python goes **back to the condition** and tests it again.' },
          {
            t: 'code', title: 'count.py', code: C`
            count = 1
            while count <= 5:
                print(count)
                count = count + 1
            print("Finished")
          `, caption: 'Press **Trace** and step through it. Watch `count` change. Each trip round the loop is one **iteration**.'
          },
          { t: 'note', kind: 'key', html: 'Every well-behaved `while` loop has three parts: (1) a variable **set up before** the loop, (2) a **condition** using that variable, (3) a line **inside** the loop that changes the variable so the condition can eventually become False.' },

          { t: 'h', text: 'Three kinds of while loop' },
          {
            t: 'cases', title: 'Why we loop', items: [
              {
                label: 'Counter-controlled', intro: 'You know **how many** times to repeat. A counter counts up (or down) to the limit.', code: C`
              count = 1
              while count <= 3:
                  print("Hello number", count)
                  count = count + 1
            ` },
              {
                label: 'Counting down', code: C`
              seconds = 5
              while seconds > 0:
                  print(seconds)
                  seconds = seconds - 1
              print("Lift off!")
            ` },
              {
                label: 'Sentinel-controlled', intro: 'You repeat until the user types a special **sentinel** value that means "stop". Here it is 0.', stdin: ['12', '7', '30', '0'], code: C`
              total = 0
              number = int(input("Number (0 to stop): "))
              while number != 0:
                  total = total + number
                  number = int(input("Number (0 to stop): "))
              print("Total:", total)
            `, caption: 'The `input` appears twice: once before the loop (to give the condition a value) and once at the end of the loop (to get the next value).'
              },
              {
                label: 'Condition-controlled', intro: 'You do not know how many times. You repeat until something happens.', code: C`
              money = 1
              years = 0
              while money < 100:
                  money = money * 2
                  years = years + 1
              print("Money:", money, "after", years, "years")
            ` },
              {
                label: 'Text condition', stdin: ['no', 'maybe', 'yes'], code: C`
              answer = input("Ready? (yes/no): ")
              while answer != "yes":
                  print("Take your time")
                  answer = input("Ready? (yes/no): ")
              print("Let us begin")
            ` },
            ]
          },

          { t: 'h', text: 'Edge cases' },
          {
            t: 'cases', title: 'The loop that never runs, runs once, or goes one too far', items: [
              {
                label: 'Never runs', intro: 'The condition is checked **first**. If it starts False, the block is skipped completely.', code: C`
              count = 10
              while count < 5:
                  print("This never prints")
                  count = count + 1
              print("Done, count is", count)
            ` },
              {
                label: 'Runs exactly once', code: C`
              count = 4
              while count < 5:
                  print("Run for count =", count)
                  count = count + 1
            ` },
              {
                label: '< or <=', intro: 'Off-by-one: `<` stops before the limit, `<=` includes it.', code: C`
              n = 1
              while n < 4:
                  print("A", n)
                  n = n + 1
              n = 1
              while n <= 4:
                  print("B", n)
                  n = n + 1
            ` },
              {
                label: 'Changing by more than 1', code: C`
              n = 0
              while n < 20:
                  print(n)
                  n = n + 5
            `, caption: '`n = n + 5` can also be written `n += 5`.'
              },
              {
                label: 'Shorthand operators', code: C`
              total = 0
              total += 10
              total += 5
              total -= 3
              total *= 2
              print(total)
            ` },
            ]
          },

          { t: 'h', text: 'Infinite loops' },
          { t: 'p', html: 'If nothing inside the loop ever makes the condition False, the loop never ends. This is an **infinite loop**, and the program appears to freeze. This example is shown but not run:' },
          { t: 'html', html: '<pre>count = 1\nwhile count &lt;= 5:\n    print(count)\n    # forgot: count = count + 1</pre>' },
          {
            t: 'list', items: [
              'In an editor on your own computer press **Ctrl + C** to stop a runaway program.',
              'In this site, the Run button will stop a program that runs for too long and report that it was stopped.',
              'Check the three parts: is the variable set up, is the condition right, and does something inside the loop change the variable?',
              'Beware the wrong direction: `while n > 0:` with `n = n + 1` never ends.',
            ]
          },
          { t: 'note', kind: 'warn', html: 'Forgetting to update the counter is the number one cause of infinite loops. Using `=` instead of `==` in the condition is a syntax error, and a missing colon is a syntax error.' },
          {
            t: 'cases', title: 'Syntax errors in while', items: [
              {
                label: 'Missing colon', expectError: true, code: C`
              n = 1
              while n < 3
                  print(n)
                  n = n + 1
            ` },
              {
                label: 'Not indented', expectError: true, code: C`
              n = 1
              while n < 3:
              print(n)
              n = n + 1
            ` },
              {
                label: 'Name not set up', expectError: true, code: C`
              while count < 3:
                  print(count)
                  count = count + 1
            `, caption: 'NameError: `count` must exist **before** the loop checks it.'
              },
            ]
          },

          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode:<pre>SET count TO 1\nWHILE count ≤ 5 DO\n    SEND count TO DISPLAY\n    SET count TO count + 1\nEND WHILE</pre>In the exam you may be asked to <em>explain why a loop never ends</em> (the condition never becomes False) or to <em>complete a trace table</em> that records `count` after each iteration. Use the **Trace table** button here to practise.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Counting loop', code: C`
            n = 2
            while n < 20:
                print(n)
                n = n * 3
            print("end", n)
          `, rows: 4, why: 'n goes 2, 6, 18, then becomes 54 which is not below 20, so the loop stops and prints `end 54`.'
          },
          {
            t: 'predict', title: 'Does it run?', code: C`
            x = 10
            while x < 3:
                print("in loop")
                x = x + 1
            print(x)
          `, rows: 1, why: 'The condition is False straight away, so the body is skipped.'
          },
          { t: 'quiz', q: 'Which statement about a <code>while</code> loop is correct?', options: ['The condition is checked after each pass, so the body always runs at least once', 'The condition is checked before each pass, so the body may never run', 'The loop always runs exactly as many times as the starting value', 'The loop stops automatically after 100 passes'], answer: 1, why: 'A `while` loop is "check first, then run".' },
          {
            t: 'quiz', q: 'Why is this loop infinite?', code: C`
            n = 10
            while n > 0:
                print(n)
                n = n + 1
          `, options: ['The condition has a syntax error', 'n goes up, so n > 0 never becomes False', 'print() cannot be used in loops', 'n starts too high'], answer: 1, why: 'The counter moves away from the stopping point.'
          },
          {
            t: 'parsons', title: 'Sentinel total', prompt: 'Put the lines in order to add up numbers until the user enters -1.', lines: [
              'total = 0',
              'number = int(input("Number: "))',
              'while number != -1:',
              '    total = total + number',
              '    number = int(input("Number: "))',
              'print(total)',
            ], why: 'The first input gives the condition a value; the second one, at the end of the block, gets the next value.'
          },

          {
            t: 'exercise', id: 'm03-ex-countdown', title: 'Countdown', level: 1,
            prompt: 'Using a <code>while</code> loop, print the numbers <code>5</code> down to <code>1</code>, one per line, then print <code>Go!</code>.',
            starter: C`
              # use a while loop
            `,
            solution: C`
              n = 5
              while n >= 1:
                  print(n)
                  n = n - 1
              print("Go!")
            `,
            tests: [{ out: '5\n4\n3\n2\n1\nGo!' }],
            requires: [{ re: '\\bwhile\\b', msg: 'Use a `while` loop.' }],
            hints: ['Start a variable at 5 and subtract 1 each time.', 'The condition should still be True when the variable is 1.']
          },
          {
            t: 'exercise', id: 'm03-ex-sum-until-zero', title: 'Total until zero', level: 2,
            prompt: 'Read whole numbers, one per line, until the user enters <code>0</code>. Then print the total of the numbers entered (not counting the 0), for example <code>Total: 15</code>.',
            starter: C`
              total = 0
            `,
            solution: C`
              total = 0
              number = int(input("Number: "))
              while number != 0:
                  total = total + number
                  number = int(input("Number: "))
              print("Total:", total)
            `,
            tests: [{ in: ['5', '10', '0'], out: 'Total: 15' }, { in: ['0'], out: 'Total: 0' }, { in: ['3', '-1', '0'], out: 'Total: 2', hidden: true }],
            requires: [{ re: '\\bwhile\\b', msg: 'Use a `while` loop.' }],
            hints: ['Read a number before the loop, and again at the end of each pass.', 'The loop condition is `number != 0`.']
          },
          {
            t: 'exercise', id: 'm03-ex-savings', title: 'Saving up', level: 2,
            prompt: 'You have some savings and want to reach a goal. Each month you add 50. Read the starting amount, then the goal (both whole numbers). Print the number of months needed (print just the number; print <code>0</code> if you already have enough).',
            starter: C`
              balance = int(input("Starting amount: "))
              goal = int(input("Goal: "))
            `,
            solution: C`
              balance = int(input("Starting amount: "))
              goal = int(input("Goal: "))
              months = 0
              while balance < goal:
                  balance = balance + 50
                  months = months + 1
              print(months)
            `,
            tests: [{ in: ['100', '200'], out: '2' }, { in: ['0', '0'], out: '0' }, { in: ['10', '125'], out: '3' }, { in: ['500', '100'], out: '0', hidden: true }],
            requires: [{ re: '\\bwhile\\b', msg: 'Use a `while` loop.' }],
            hints: ['Keep a `months` counter starting at 0.', 'Repeat while the balance is still below the goal.']
          },
          {
            t: 'exercise', id: 'm03-ex-pin-tries', kind: 'exam', title: 'PIN with three tries', level: 3,
            prompt: 'The correct PIN is <code>4321</code>. Read PINs (as text). For each wrong PIN print <code>Wrong PIN</code>. If the correct PIN is entered print <code>Access granted</code> and stop asking. If three wrong PINs have been entered, print <code>Card locked</code> and stop.',
            starter: C`
              tries = 0
            `,
            solution: C`
              tries = 0
              granted = False
              while tries < 3 and not granted:
                  pin = input("PIN: ")
                  if pin == "4321":
                      granted = True
                  else:
                      print("Wrong PIN")
                      tries = tries + 1
              if granted:
                  print("Access granted")
              else:
                  print("Card locked")
            `,
            tests: [{ in: ['4321'], out: 'Access granted' }, { in: ['0000', '4321'], out: 'Wrong PIN\nAccess granted' }, { in: ['1', '2', '3'], out: 'Wrong PIN\nWrong PIN\nWrong PIN\nCard locked' }, { in: ['1', '2', '4321'], out: 'Wrong PIN\nWrong PIN\nAccess granted', hidden: true }],
            hints: ['Use two variables: a counter `tries` and a flag `granted`.', 'The loop continues while `tries < 3 and not granted`.', 'After the loop, decide which message to print from the flag.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'for-loops',
        title: 'for loops and range()',
        time: '35 min',
        book: 'Ch 2 · p.70-74',
        exam: 'Paper 2 Q2-Q6',
        summary: 'for with range(n), range(a,b), step, negative step, strings',
        intro: 'When you know how many times to repeat, a `for` loop is neater than a `while` loop: Python makes the counter, changes it and tests it for you.',
        blocks: [
          { t: 'h', text: 'for with range' },
          { t: 'p', html: '`for i in range(5):` runs the block five times. `i` is the **loop variable**; it takes the values `0, 1, 2, 3, 4` in turn. `range(5)` produces the numbers from 0 up to but **not including** 5.' },
          {
            t: 'code', title: 'for.py', code: C`
            for i in range(5):
                print("Pass number", i)
            print("Done")
          `, caption: 'Press **Trace**: Python sets `i` for you at the start of each pass.'
          },
          { t: 'note', kind: 'key', html: 'The range **stops before** the last number. `range(5)` has 5 values: 0 to 4. This is the most common source of off-by-one errors, so check the first and last values every time.' },
          {
            t: 'cases', title: 'Every form of range', items: [
              {
                label: 'range(stop)', intro: 'Starts at 0, stops before `stop`.', code: C`
              for i in range(4):
                  print(i)
            ` },
              {
                label: 'range(start, stop)', intro: 'Starts at `start`. Still stops before `stop`.', code: C`
              for i in range(2, 6):
                  print(i)
            ` },
              {
                label: 'Counting 1 to 5', intro: 'To include 5, stop at 6.', code: C`
              for i in range(1, 6):
                  print(i)
            ` },
              {
                label: 'range(start, stop, step)', intro: 'The third number is how much to add each time.', code: C`
              for i in range(0, 20, 5):
                  print(i)
              print("--")
              for i in range(1, 10, 2):
                  print(i)
            ` },
              {
                label: 'Counting down', intro: 'A **negative step** counts downwards. The start must be larger than the stop.', code: C`
              for i in range(10, 0, -2):
                  print(i)
              print("--")
              for i in range(5, 0, -1):
                  print(i)
            ` },
              {
                label: 'Empty range', intro: 'If the range cannot reach the stop, the loop body never runs. There is no error.', code: C`
              for i in range(5, 2):
                  print("never printed")
              for i in range(0):
                  print("never printed")
              for i in range(3, 0):
                  print("never printed")
              print("The loops ended without printing anything")
            ` },
              {
                label: 'Seeing the numbers', intro: '`list()` shows what a range contains. (Lists are covered properly in a later module.)', code: C`
              print(list(range(5)))
              print(list(range(2, 6)))
              print(list(range(10, 0, -3)))
              print(list(range(5, 2)))
            ` },
            ]
          },
          {
            t: 'cases', title: 'Common range mistakes', items: [
              {
                label: 'A decimal', expectError: true, code: C`
              for i in range(2.5):
                  print(i)
            `, caption: '`range` only accepts whole numbers (ints).'
              },
              {
                label: 'Input not converted', expectError: true, stdin: ['3'], code: C`
              n = input("How many? ")
              for i in range(n):
                  print(i)
            `, caption: '`input()` gives text. Use `range(int(n))`.'
              },
              {
                label: 'for on a number', expectError: true, code: C`
              for i in 5:
                  print(i)
            ` },
              {
                label: 'Wrong direction', code: C`
              for i in range(1, 10, -1):
                  print(i)
              print("nothing happened")
            ` },
              {
                label: 'Step of zero', expectError: true, code: C`
              for i in range(1, 5, 0):
                  print(i)
            ` },
            ]
          },

          { t: 'h', text: 'The loop variable' },
          {
            t: 'cases', title: 'What is i, really?', items: [
              {
                label: 'Use it in the body', code: C`
              for i in range(1, 6):
                  print(i, "squared is", i * i)
            ` },
              {
                label: 'Ignore it', intro: 'If you only want to repeat something, you may not use `i` at all.', code: C`
              for i in range(3):
                  print("Hip hip hooray")
            ` },
              {
                label: 'After the loop', intro: 'The loop variable keeps its last value after the loop finishes.', code: C`
              for i in range(4):
                  pass
              print("Last value of i:", i)
            ` },
              {
                label: 'Changing it has no effect', intro: 'Python resets `i` from the range at the start of every pass, so assigning to it inside the loop does not change how many times the loop runs.', code: C`
              for i in range(3):
                  print("start", i)
                  i = i * 10
                  print("changed", i)
            ` },
              {
                label: 'Variables in the range', stdin: ['4'], code: C`
              n = int(input("How many stars? "))
              for i in range(n):
                  print("*")
            ` },
            ]
          },

          { t: 'h', text: 'for over text and tiny lists' },
          { t: 'p', html: 'A `for` loop can also go through the **characters of a string**, one at a time. It can go through the items of a list too. A **list** is values in square brackets separated by commas, for example `["red", "green"]`. You only need to read a list here; lists have their own module later.' },
          {
            t: 'cases', title: 'Looping over things', items: [
              {
                label: 'Characters', code: C`
              for ch in "Hello":
                  print(ch)
            ` },
              {
                label: 'Characters of input', stdin: ['cat'], code: C`
              word = input("Word: ")
              for letter in word:
                  print(letter, "-", letter.upper())
            ` },
              {
                label: 'Same line', code: C`
              for ch in "abc":
                  print(ch, end=" ")
              print()
            ` },
              {
                label: 'A small list', code: C`
              for colour in ["red", "green", "blue"]:
                  print("I like", colour)
            ` },
              {
                label: 'Numbers in a list', code: C`
              for score in [12, 7, 30]:
                  print(score * 2)
            ` },
              {
                label: 'Index and letter', intro: '`len()` gives the length, so `range(len(word))` produces every index.', code: C`
              word = "dog"
              for i in range(len(word)):
                  print(i, word[i])
            ` },
            ]
          },

          { t: 'h', text: 'for or while?' },
          {
            t: 'table', head: ['Use a for loop when...', 'Use a while loop when...'], rows: [
              ['you know the number of repeats in advance', 'you do not know how many repeats there will be'],
              ['you go through every character or item', 'you repeat until something happens (a PIN is right, 0 is typed)'],
              ['a counter is all you need', 'the stopping condition is complicated'],
            ]
          },
          {
            t: 'cases', title: 'The same job both ways', items: [
              {
                label: 'for', code: C`
              for i in range(1, 6):
                  print(i)
            ` },
              {
                label: 'while', code: C`
              i = 1
              while i <= 5:
                  print(i)
                  i = i + 1
            ` },
            ]
          },

          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode counts with an **inclusive** upper bound: <pre>FOR i FROM 0 TO 9 DO\n    SEND i TO DISPLAY\nEND FOR</pre>That prints 0 to 9, so in Python it is `range(0, 10)`. The pseudocode limit is 9, but the Python stop value is 10: add one to the last wanted number. Looping over a collection is written <pre>FOR EACH ch FROM word DO\n    SEND ch TO DISPLAY\nEND FOR</pre>which is `for ch in word:`.' },

          { t: 'h', text: 'Check your understanding' },
          { t: 'viz', kind: 'range', title: 'What does range() produce? Try your own numbers', caption: 'Try: start 1, stop 10, step 3. Then step -1 with start 5 and stop 0. Then start 5, stop 5.' },
          {
            t: 'predict', title: 'range(a, b, step)', code: C`
            for n in range(3, 20, 6):
                print(n)
          `, rows: 3, why: '3, 9, 15, and the next value 21 would pass the stop of 20.'
          },
          {
            t: 'predict', title: 'Countdown', code: C`
            for n in range(4, 0, -1):
                print(n, end=" ")
            print("go")
          `, rows: 1, why: 'The values are 4, 3, 2, 1. `end=" "` keeps them on one line.'
          },
          {
            t: 'predict', title: 'Loop variable afterwards', code: C`
            for i in range(1, 4):
                total = i * 2
            print(i, total)
          `, rows: 1, why: 'After the loop `i` is 3 (the last value) and `total` is 6.'
          },
          { t: 'quiz', q: 'Which loop prints the numbers 1 to 10 inclusive?', options: ['for i in range(10):', 'for i in range(1, 10):', 'for i in range(1, 11):', 'for i in range(0, 10):'], answer: 2, why: 'Stop must be one more than the last number wanted.' },
          { t: 'quiz', q: 'How many times does <code>for i in range(2, 12, 3):</code> run its block?', options: ['3', '4', '5', '10'], answer: 1, why: 'The values are 2, 5, 8, 11: four passes.' },
          {
            t: 'sort', prompt: 'Which kind of loop suits each task best?', cats: ['for loop', 'while loop'], items: [
              { text: 'Print a times table for 7 up to 12', cat: 0 },
              { text: 'Keep asking until the user types "quit"', cat: 1 },
              { text: 'Go through every letter of a word', cat: 0 },
              { text: 'Double an amount until it passes 1000 (unknown number of doublings)', cat: 1 },
              { text: 'Print 20 lines of dashes', cat: 0 },
            ], why: 'Known number of passes: `for`. Repeat until a condition: `while`.'
          },

          {
            t: 'exercise', id: 'm03-ex-one-to-ten', title: '1 to 10', level: 1,
            prompt: 'Use a <code>for</code> loop to print the numbers 1 to 10, each on its own line.',
            starter: C`
              # for loop here
            `,
            solution: C`
              for i in range(1, 11):
                  print(i)
            `,
            tests: [{ out: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10' }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['`range(1, 11)` stops before 11.']
          },
          {
            t: 'exercise', id: 'm03-ex-times-table', title: 'Times table', level: 2,
            prompt: 'Read a whole number <code>n</code> and print its times table from 1 to 12, one line each in the form <code>3 x 4 = 12</code>.',
            starter: C`
              n = int(input("Table of: "))
            `,
            solution: C`
              n = int(input("Table of: "))
              for i in range(1, 13):
                  print(n, "x", i, "=", n * i)
            `,
            tests: [{ in: ['3'], out: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n3 x 11 = 33\n3 x 12 = 36' }, { in: ['12'], has: ['12 x 12 = 144'], hidden: true }, { in: ['0'], has: ['0 x 5 = 0'], hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['Loop `i` from 1 to 12.', 'Print `n`, the text `"x"`, `i`, `"="` and `n * i`, separated by commas.']
          },
          {
            t: 'exercise', id: 'm03-ex-debug-sum', kind: 'debug', title: 'Three errors in a loop', level: 2,
            prompt: 'This program should print <code>Sum of 1 to 5: 15</code>. There are <strong>three</strong> errors. Find and fix them.',
            starter: C`
              total = 0
              for i in range(1, 5)
                  total = total + i
              print("Sum of 1 to 5:" total)
            `,
            solution: C`
              total = 0
              for i in range(1, 6):
                  total = total + i
              print("Sum of 1 to 5:", total)
            `,
            tests: [{ out: 'Sum of 1 to 5: 15' }],
            hints: ['The `for` line is missing something at the end.', 'Does `range(1, 5)` include 5?', 'Look at the `print` line: two things need a separator.']
          },
          {
            t: 'exercise', id: 'm03-ex-count-down-step', title: 'Count down in threes', level: 3,
            prompt: 'Read a positive whole number <code>n</code>. Print <code>n</code>, then <code>n - 3</code>, <code>n - 6</code> and so on, one per line, stopping before you reach zero or below. For example, 10 prints 10, 7, 4, 1. Use <code>range</code> with a negative step.',
            starter: C`
              n = int(input("Start: "))
            `,
            solution: C`
              n = int(input("Start: "))
              for i in range(n, 0, -3):
                  print(i)
            `,
            tests: [{ in: ['10'], out: '10\n7\n4\n1' }, { in: ['9'], out: '9\n6\n3' }, { in: ['1'], out: '1', hidden: true }],
            requires: [{ re: 'range\\([^)]*-3', msg: 'Use `range` with a step of -3.' }],
            hints: ['The three values are start, stop and step.', 'To stop before zero, the stop value is 0.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'loop-patterns',
        title: 'Loop patterns: totals, counts, max and more',
        time: '40 min',
        book: 'Ch 2 · p.74-78',
        exam: 'Paper 2 Q3-Q6',
        summary: 'Accumulator, counter, average, max/min, factorial, digit sum',
        intro: 'Most loops in exam programs follow a few standard shapes. Learn each pattern once and you can adapt it to any scenario.',
        blocks: [
          { t: 'h', text: 'Accumulator: a running total' },
          { t: 'p', html: 'An **accumulator** is a variable that starts at 0 and has something added on each pass. Set it up **before** the loop, update it **inside**, and use it **after**.' },
          {
            t: 'cases', title: 'Totals', items: [
              {
                label: 'Add 1 to 10', code: C`
              total = 0
              for i in range(1, 11):
                  total = total + i
              print("Total:", total)
            ` },
              {
                label: 'Add typed numbers', stdin: ['4', '8', '15'], code: C`
              total = 0
              for i in range(3):
                  number = int(input("Number: "))
                  total = total + number
              print("Total:", total)
            ` },
              {
                label: 'Show the total growing', code: C`
              total = 0
              for price in [3, 5, 2]:
                  total = total + price
                  print("So far:", total)
            `, caption: 'Press **Trace** to watch `total` change.'
              },
              {
                label: 'Mistake: total reset inside', code: C`
              for i in range(1, 4):
                  total = 0
                  total = total + i
              print(total)
            `, caption: 'Putting `total = 0` inside the loop wipes the total every time. Only the last number survives.'
              },
              {
                label: 'Mistake: print inside', code: C`
              total = 0
              for i in range(1, 4):
                  total = total + i
                  print("Total:", total)
            `, caption: 'This prints three lines. If you want only the final answer, un-indent the `print`.'
              },
            ]
          },

          { t: 'h', text: 'Counter and average' },
          {
            t: 'cases', title: 'Counting matches, and averages', items: [
              {
                label: 'Count matches', intro: 'A **counter** goes up by 1 only when a condition is True.', code: C`
              count = 0
              for number in range(1, 21):
                  if number % 3 == 0:
                      count = count + 1
              print("Multiples of 3 up to 20:", count)
            ` },
              {
                label: 'Count letters', stdin: ['banana'], code: C`
              word = input("Word: ")
              count = 0
              for ch in word:
                  if ch == "a":
                      count = count + 1
              print("Number of a:", count)
            ` },
              {
                label: 'Average', stdin: ['70', '85', '90'], code: C`
              total = 0
              for i in range(3):
                  mark = int(input("Mark: "))
                  total = total + mark
              average = total / 3
              print("Average:", average)
            ` },
              {
                label: 'Average of n numbers', stdin: ['4', '2', '4', '6', '9'], code: C`
              n = int(input("How many numbers? "))
              total = 0
              for i in range(n):
                  total = total + int(input("Number: "))
              print("Average:", total / n)
            `, caption: 'If `n` were 0 this would crash with a `ZeroDivisionError`. Check for it when the count comes from the user.'
              },
              {
                label: 'Average of nothing', expectError: true, code: C`
              total = 0
              count = 0
              print(total / count)
            ` },
            ]
          },

          { t: 'h', text: 'Largest and smallest' },
          { t: 'p', html: 'Keep a variable holding the best value **so far**. Start it with the **first** value (not with 0, because every value might be negative), then replace it whenever something better appears.' },
          {
            t: 'cases', title: 'Max and min', items: [
              {
                label: 'Largest', stdin: ['5', '12', '3', '12', '9'], code: C`
              largest = int(input("Number: "))
              for i in range(4):
                  number = int(input("Number: "))
                  if number > largest:
                      largest = number
              print("Largest:", largest)
            ` },
              {
                label: 'Smallest', stdin: ['5', '12', '3', '12', '9'], code: C`
              smallest = int(input("Number: "))
              for i in range(4):
                  number = int(input("Number: "))
                  if number < smallest:
                      smallest = number
              print("Smallest:", smallest)
            ` },
              {
                label: 'Starting at 0 is a trap', stdin: ['-5', '-2', '-9'], code: C`
              largest = 0
              for i in range(3):
                  number = int(input("Number: "))
                  if number > largest:
                      largest = number
              print("Largest:", largest)
            `, caption: 'All numbers are negative, but the answer is 0, which was never entered. Start with the first value instead.'
              },
              {
                label: 'Both at once', code: C`
              largest = 10
              smallest = 10
              for number in [10, 4, 17, 8]:
                  if number > largest:
                      largest = number
                  if number < smallest:
                      smallest = number
              print(smallest, largest)
            ` },
            ]
          },

          { t: 'h', text: 'Products, powers and factorials' },
          { t: 'p', html: 'Same idea as a running total, but multiply. A running product must start at **1**, not 0 (anything times 0 is 0).' },
          {
            t: 'cases', title: 'Multiplying loops', items: [
              {
                label: 'Factorial', intro: '5! = 5 x 4 x 3 x 2 x 1.', stdin: ['5'], code: C`
              n = int(input("n: "))
              result = 1
              for i in range(1, n + 1):
                  result = result * i
              print(result)
            ` },
              {
                label: 'Power by repeated multiplying', code: C`
              base = 2
              exponent = 8
              result = 1
              for i in range(exponent):
                  result = result * base
              print(result)
            ` },
              {
                label: 'Trap: starting at 0', code: C`
              result = 0
              for i in range(1, 6):
                  result = result * i
              print(result)
            ` },
              {
                label: 'Doubling table', code: C`
              value = 1
              for step in range(8):
                  print(step, value)
                  value = value * 2
            ` },
            ]
          },

          { t: 'h', text: 'Tables and digits' },
          {
            t: 'cases', title: 'Two classic programs', items: [
              {
                label: 'Multiplication table', stdin: ['6'], code: C`
              n = int(input("Table of: "))
              for i in range(1, 11):
                  print(i, "x", n, "=", i * n)
            ` },
              {
                label: 'Digit sum with while', intro: '`n % 10` is the last digit, `n // 10` removes it. Repeat while digits remain.', stdin: ['4529'], code: C`
              n = int(input("Number: "))
              total = 0
              while n > 0:
                  digit = n % 10
                  total = total + digit
                  n = n // 10
              print("Digit sum:", total)
            `, caption: 'Trace it: n goes 4529, 452, 45, 4, 0.'
              },
              {
                label: 'Digit sum with a string', stdin: ['4529'], code: C`
              number = input("Number: ")
              total = 0
              for ch in number:
                  total = total + int(ch)
              print("Digit sum:", total)
            ` },
              {
                label: 'Count the digits', stdin: ['90210'], code: C`
              n = int(input("Number: "))
              digits = 0
              while n > 0:
                  n = n // 10
                  digits = digits + 1
              print("Digits:", digits)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Check **where** each variable is set up and where output happens. Typical bugs: the total reset inside the loop, the counter updated in the wrong branch, `print` indented into the loop, a product started at 0, and a max started at 0.' },
          { t: 'note', kind: 'exam', html: 'Typical Paper 2 tasks: <em>read 10 test marks and output the average</em>, <em>count how many numbers are above 50</em>, <em>find the highest score</em>. In pseudocode the accumulator looks like <pre>SET total TO 0\nFOR i FROM 1 TO 10 DO\n    RECEIVE mark FROM (INTEGER) KEYBOARD\n    SET total TO total + mark\nEND FOR\nSEND total / 10 TO DISPLAY</pre>' },

          { t: 'h', text: 'Check your understanding' },
          { t: 'viz', kind: 'memory', preset: 'Loop with a total', title: 'Watch a loop update its variables' },
          {
            t: 'predict', title: 'Accumulate and count', code: C`
            total = 0
            count = 0
            for n in [4, 9, 2, 7]:
                if n > 3:
                    total = total + n
                    count = count + 1
            print(total, count)
          `, rows: 1, why: '4, 9 and 7 are above 3: total 20, count 3.'
          },
          {
            t: 'predict', title: 'Running product', code: C`
            p = 1
            for i in range(1, 5):
                p = p * i
                print(p)
          `, rows: 4, why: '1, 2, 6, 24 (factorials).'
          },
          { t: 'quiz', q: 'A program finds the largest of several marks. Which starting value is **safest** for the variable <code>largest</code>?', options: ['0', '-1', 'the first mark entered', '100'], answer: 2, why: 'Starting with a real value from the data always works, whatever the numbers are.' },
          { t: 'quiz', q: 'Which line, placed **before** the loop, makes a running product work?', options: ['product = 0', 'product = 1', 'product = ""', 'product = -1'], answer: 1, why: 'Multiplying by 1 changes nothing, so 1 is the starting value for a product.' },
          {
            t: 'parsons', title: 'Average of five', prompt: 'Order the lines to read five numbers and print their average.', lines: [
              'total = 0',
              'for i in range(5):',
              '    number = int(input("Number: "))',
              '    total = total + number',
              'print(total / 5)',
            ], why: 'The total is set up before the loop; the average is worked out after it.'
          },

          {
            t: 'exercise', id: 'm03-ex-average', title: 'Average of n numbers', level: 2,
            prompt: 'Read a whole number <code>n</code> (at least 1), then read <code>n</code> numbers. Print their average (use <code>/</code>, so 18 numbers adding to 36 gives <code>2.0</code>).',
            starter: C`
              n = int(input("How many? "))
            `,
            solution: C`
              n = int(input("How many? "))
              total = 0
              for i in range(n):
                  total = total + int(input("Number: "))
              print(total / n)
            `,
            tests: [{ in: ['3', '4', '6', '8'], out: '6.0' }, { in: ['2', '5', '6'], out: '5.5' }, { in: ['1', '7'], out: '7.0', hidden: true }],
            hints: ['Set `total = 0` before the loop.', 'Divide by `n` after the loop.']
          },
          {
            t: 'exercise', id: 'm03-ex-highest', title: 'Highest score', level: 2,
            prompt: 'Read a whole number <code>n</code> (at least 1), then read <code>n</code> scores. Print the highest score. Scores can be negative. Do not use <code>max()</code>.',
            starter: C`
              n = int(input("How many? "))
            `,
            solution: C`
              n = int(input("How many? "))
              highest = int(input("Score: "))
              for i in range(n - 1):
                  score = int(input("Score: "))
                  if score > highest:
                      highest = score
              print(highest)
            `,
            tests: [{ in: ['4', '12', '30', '7', '30'], out: '30' }, { in: ['3', '-5', '-2', '-9'], out: '-2' }, { in: ['1', '8'], out: '8', hidden: true }],
            requires: [{ re: '\\bmax\\s*\\(', not: true, msg: 'Do not use `max()`.' }],
            hints: ['Read the first score before the loop and treat it as the highest so far.', 'Then loop `n - 1` more times.']
          },
          {
            t: 'exercise', id: 'm03-ex-factorial', title: 'Factorial', level: 2,
            prompt: 'Read a whole number <code>n</code> (0 or more) and print n factorial: the product of all whole numbers from 1 to n. (0 factorial is 1.)',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              result = 1
              for i in range(1, n + 1):
                  result = result * i
              print(result)
            `,
            tests: [{ in: ['5'], out: '120' }, { in: ['1'], out: '1' }, { in: ['0'], out: '1' }, { in: ['10'], out: '3628800', hidden: true }],
            hints: ['Start `result` at 1.', 'The loop must include `n`, so the stop value is `n + 1`.']
          },
          {
            t: 'exercise', id: 'm03-ex-vowel-count', title: 'Count the vowels', level: 2,
            prompt: 'Read a word (lower case) and print how many vowels (a, e, i, o, u) it contains.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              count = 0
              for ch in word:
                  if ch in "aeiou":
                      count = count + 1
              print(count)
            `,
            tests: [{ in: ['banana'], out: '3' }, { in: ['rhythm'], out: '0' }, { in: ['education'], out: '5' }, { in: ['aeiou'], out: '5', hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop over the letters.' }],
            hints: ['Loop over the letters with `for ch in word:`.', 'Add 1 to a counter when `ch in "aeiou"`.']
          },
          {
            t: 'exercise', id: 'm03-ex-digit-sum', title: 'Digit sum', level: 3,
            prompt: 'Read a whole number (0 or more) and print the sum of its digits. For example 4529 gives 20. Use <code>%</code> and <code>//</code> in a <code>while</code> loop (not a string).',
            starter: C`
              n = int(input("Number: "))
            `,
            solution: C`
              n = int(input("Number: "))
              total = 0
              while n > 0:
                  total = total + n % 10
                  n = n // 10
              print(total)
            `,
            tests: [{ in: ['4529'], out: '20' }, { in: ['9'], out: '9' }, { in: ['1005'], out: '6' }, { in: ['0'], out: '0', hidden: true }],
            requires: [{ re: '\\bwhile\\b', msg: 'Use a `while` loop.' }, { re: '%', msg: 'Use `%` to get the last digit.' }],
            hints: ['`n % 10` is the last digit.', '`n // 10` removes the last digit.', 'Repeat while `n > 0`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'nested-loops',
        title: 'Loops inside loops',
        time: '35 min',
        book: 'Ch 2 · p.78',
        exam: 'Paper 2 Q4-Q6',
        summary: 'Nested for loops, patterns, tables, trace',
        intro: 'A loop can contain another loop. The inner loop runs **completely** for every single pass of the outer loop. This is how you draw grids, patterns and tables.',
        blocks: [
          { t: 'h', text: 'How a nested loop runs' },
          {
            t: 'code', title: 'nested.py', code: C`
            for row in range(1, 4):
                for col in range(1, 3):
                    print("row", row, "col", col)
          `, caption: 'Press **Trace**. The outer variable `row` stays the same while `col` runs through all its values. Then `row` moves on. 3 rows x 2 columns = 6 lines.'
          },
          { t: 'note', kind: 'key', html: 'Total passes of the inner block = (outer passes) x (inner passes). The inner loop **restarts** every time the outer loop moves on.' },
          {
            t: 'cases', title: 'Rows and columns', items: [
              {
                label: 'A rectangle of stars', intro: '`end=""` keeps the stars on one line; the empty `print()` starts a new row.', code: C`
              for row in range(3):
                  for col in range(5):
                      print("*", end="")
                  print()
            ` },
              {
                label: 'Using string repetition', intro: 'The inner loop can be replaced by `"*" * 5`. Both are fine; nested loops are what the exam expects you to understand.', code: C`
              for row in range(3):
                  print("*" * 5)
            ` },
              {
                label: 'Right-angled triangle', intro: 'The inner range depends on the outer variable, so rows get longer.', code: C`
              for row in range(1, 6):
                  for col in range(row):
                      print("*", end="")
                  print()
            ` },
              {
                label: 'Upside-down triangle', code: C`
              for row in range(5, 0, -1):
                  for col in range(row):
                      print("*", end="")
                  print()
            ` },
              {
                label: 'Numbers pyramid (left)', code: C`
              for row in range(1, 5):
                  for n in range(1, row + 1):
                      print(n, end=" ")
                  print()
            ` },
              {
                label: 'Same number in each row', code: C`
              for row in range(1, 5):
                  for col in range(row):
                      print(row, end=" ")
                  print()
            ` },
            ]
          },
          { t: 'h', text: 'Tables' },
          {
            t: 'cases', title: 'Grids of numbers', items: [
              {
                label: 'Multiplication grid', code: C`
              for row in range(1, 6):
                  for col in range(1, 6):
                      print(row * col, end="\t")
                  print()
            `, caption: '`\\t` is a tab, which lines the columns up.'
              },
              {
                label: 'All pairs', intro: 'Every combination of two dice.', code: C`
              for first in range(1, 4):
                  for second in range(1, 4):
                      print(first, second)
            ` },
              {
                label: 'Counting how many', code: C`
              count = 0
              for a in range(1, 7):
                  for b in range(1, 7):
                      if a + b == 7:
                          count = count + 1
              print("Ways to roll 7 with two dice:", count)
            ` },
              {
                label: 'Chessboard', code: C`
              for row in range(4):
                  for col in range(8):
                      if (row + col) % 2 == 0:
                          print("#", end="")
                      else:
                          print(".", end="")
                  print()
            ` },
            ]
          },

          { t: 'h', text: 'Nested loop mistakes' },
          {
            t: 'cases', title: 'What goes wrong', items: [
              {
                label: 'Forgot the new line', code: C`
              for row in range(3):
                  for col in range(4):
                      print("*", end="")
            `, caption: 'Everything ends up on a single line, because nothing prints a line break.'
              },
              {
                label: 'print() at the wrong level', code: C`
              for row in range(3):
                  for col in range(4):
                      print("*", end="")
                      print()
            `, caption: 'The empty `print()` is inside the inner loop, so every star gets its own line.'
              },
              {
                label: 'Same variable name', code: C`
              for i in range(3):
                  for i in range(2):
                      print("inner", i)
                  print("outer", i)
            `, caption: 'The inner loop overwrote `i`, so the outer value is lost. Use different names (`row` and `col`).'
              },
              {
                label: 'Indentation error', expectError: true, code: C`
              for row in range(2):
              for col in range(2):
                  print(row, col)
            ` },
            ]
          },

          { t: 'note', kind: 'exam', html: 'Pseudocode shows a nested loop with two <code>FOR ... END FOR</code> pairs:<pre>FOR row FROM 1 TO 3 DO\n    FOR col FROM 1 TO 4 DO\n        SEND "*" TO DISPLAY\n    END FOR\nEND FOR</pre>Tracing questions give you a nested loop and ask for the exact output or for how many times a line runs. Work out the outer value, then run the inner loop fully, then move the outer value on.' },

          { t: 'h', text: 'Check your understanding' },
          { t: 'viz', kind: 'nested' },
          {
            t: 'predict', title: 'How many lines?', code: C`
            for a in range(2):
                for b in range(3):
                    print(a, b)
          `, rows: 6, why: '2 x 3 = 6 lines: (0,0) (0,1) (0,2) (1,0) (1,1) (1,2).'
          },
          {
            t: 'predict', title: 'Triangle', code: C`
            for i in range(1, 4):
                for j in range(i):
                    print("#", end="")
                print()
          `, rows: 3, why: 'Row sizes are 1, 2 and 3.'
          },
          {
            t: 'predict', title: 'Count the passes', code: C`
            count = 0
            for i in range(4):
                for j in range(5):
                    count = count + 1
            print(count)
          `, rows: 1, why: '4 x 5 = 20.'
          },
          { t: 'quiz', q: 'A nested loop has an outer <code>range(6)</code> and an inner <code>range(4)</code>. How many times does the inner body run in total?', options: ['10', '24', '6', '4'], answer: 1, why: '6 x 4 = 24.' },
          {
            t: 'parsons', title: 'A square of hashes', prompt: 'Order the lines to print a square of # that is 4 by 4.', lines: [
              'for row in range(4):',
              '    for col in range(4):',
              '        print("#", end="")',
              '    print()',
            ], why: 'The `print()` that ends each row is indented to the level of the inner `for`, not inside it.'
          },

          {
            t: 'exercise', id: 'm03-ex-rectangle', title: 'Rectangle', level: 2,
            prompt: 'Read the number of rows and the number of columns (whole numbers). Print a rectangle of <code>*</code> using two nested <code>for</code> loops.',
            starter: C`
              rows = int(input("Rows: "))
              cols = int(input("Columns: "))
            `,
            solution: C`
              rows = int(input("Rows: "))
              cols = int(input("Columns: "))
              for r in range(rows):
                  for c in range(cols):
                      print("*", end="")
                  print()
            `,
            tests: [{ in: ['2', '3'], out: '***\n***' }, { in: ['1', '5'], out: '*****' }, { in: ['4', '1'], out: '*\n*\n*\n*', hidden: true }],
            requires: [{ re: '\\bfor\\b[\\s\\S]*\\bfor\\b', msg: 'Use two nested `for` loops.' }],
            hints: ['The outer loop runs once per row; the inner loop prints one row.', 'Finish each row with an empty `print()`.']
          },
          {
            t: 'exercise', id: 'm03-ex-number-steps', title: 'Number staircase', level: 2,
            prompt: 'Read a whole number <code>n</code>. Print n lines: line 1 is <code>1</code>, line 2 is <code>1 2</code>, line 3 is <code>1 2 3</code> and so on up to n.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              for i in range(1, n + 1):
                  for j in range(1, i + 1):
                      print(j, end=" ")
                  print()
            `,
            tests: [{ in: ['3'], out: '1\n1 2\n1 2 3' }, { in: ['1'], out: '1' }, { in: ['5'], out: '1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5', hidden: true }],
            requires: [{ re: '\\bfor\\b[\\s\\S]*\\bfor\\b', msg: 'Use two nested `for` loops.' }],
            hints: ['The inner loop goes from 1 up to the current row number.', 'End each line with `print()`.']
          },
          {
            t: 'exercise', id: 'm03-ex-grid-table', title: 'Multiplication square', level: 3,
            prompt: 'Read a size <code>n</code>. Print an n by n multiplication square: row <code>r</code> and column <code>c</code> hold <code>r * c</code>, separated by single spaces. For n = 3 the output is <code>1 2 3</code>, <code>2 4 6</code>, <code>3 6 9</code> on three lines.',
            starter: C`
              n = int(input("Size: "))
            `,
            solution: C`
              n = int(input("Size: "))
              for r in range(1, n + 1):
                  for c in range(1, n + 1):
                      print(r * c, end=" ")
                  print()
            `,
            tests: [{ in: ['3'], out: '1 2 3\n2 4 6\n3 6 9' }, { in: ['1'], out: '1' }, { in: ['4'], out: '1 2 3 4\n2 4 6 8\n3 6 9 12\n4 8 12 16', hidden: true }],
            requires: [{ re: '\\bfor\\b[\\s\\S]*\\bfor\\b', msg: 'Use two nested `for` loops.' }],
            hints: ['Both loops run from 1 to n inclusive.', 'Print `r * c` with `end=" "`, then an empty `print()` after the inner loop.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'break-continue',
        title: 'break, continue and while True',
        time: '30 min',
        book: 'Ch 2 · p.70',
        exam: 'Paper 2 Q4-Q6',
        summary: 'Leaving a loop early, skipping one pass, infinite loops done safely',
        intro: 'Sometimes you want to leave a loop in the middle, or skip the rest of one pass. `break` and `continue` give you that control.',
        blocks: [
          { t: 'h', text: 'break: leave the loop now' },
          { t: 'p', html: '`break` ends the **innermost** loop immediately. Python carries on with the first line after the loop.' },
          {
            t: 'cases', title: 'break in action', items: [
              {
                label: 'Stop on a match', code: C`
              for n in range(1, 100):
                  print("Checking", n)
                  if n % 7 == 0:
                      print("First multiple of 7 is", n)
                      break
              print("Done")
            ` },
              {
                label: 'Without break', code: C`
              for n in range(1, 11):
                  if n % 7 == 0:
                      print("Found", n)
              print("Done")
            `, caption: 'This version keeps looking after it has found one. `break` saves work.'
              },
              {
                label: 'Stop on a bad letter', code: C`
              word = "hello world"
              for ch in word:
                  if ch == " ":
                      break
                  print(ch)
            ` },
              {
                label: 'break only leaves one loop', code: C`
              for a in range(1, 4):
                  for b in range(1, 4):
                      if b == 2:
                          break
                      print(a, b)
            `, caption: '`break` stops the inner loop only; the outer loop carries on.'
              },
              {
                label: 'break outside a loop', expectError: true, code: C`
              print("hello")
              break
            ` },
            ]
          },

          { t: 'h', text: 'while True: a loop you leave with break' },
          { t: 'p', html: '`while True:` means "repeat forever". It is only safe when something inside the loop uses `break`. This is the standard way to ask for input until it is acceptable.' },
          {
            t: 'cases', title: 'Input loops', items: [
              {
                label: 'Stop on a word', stdin: ['apple', 'banana', 'quit', 'cherry'], code: C`
              while True:
                  item = input("Item (quit to stop): ")
                  if item == "quit":
                      break
                  print("Added", item)
              print("Finished")
            ` },
              {
                label: 'Until a valid number', stdin: ['150', '-3', '42'], code: C`
              while True:
                  number = int(input("Enter 1 to 100: "))
                  if number >= 1 and number <= 100:
                      break
                  print("Not valid, try again")
              print("You entered", number)
            ` },
              {
                label: 'Running total with sentinel', stdin: ['10', '20', '-1'], code: C`
              total = 0
              while True:
                  n = int(input("Number (-1 to finish): "))
                  if n == -1:
                      break
                  total = total + n
              print("Total:", total)
            `, caption: 'Only one `input` line is needed, compared with the sentinel version of `while`.'
              },
            ]
          },

          { t: 'h', text: 'continue: skip the rest of this pass' },
          { t: 'p', html: '`continue` jumps straight back to the top of the loop, skipping any lines below it for this pass. The loop itself keeps going.' },
          {
            t: 'cases', title: 'continue in action', items: [
              {
                label: 'Skip multiples of 3', code: C`
              for n in range(1, 11):
                  if n % 3 == 0:
                      continue
                  print(n)
            ` },
              {
                label: 'Skip spaces', code: C`
              for ch in "a b c":
                  if ch == " ":
                      continue
                  print(ch, end="")
              print()
            ` },
              {
                label: 'continue vs break', code: C`
              for n in range(1, 8):
                  if n == 4:
                      continue
                  print("continue version", n)
              for n in range(1, 8):
                  if n == 4:
                      break
                  print("break version", n)
            ` },
              {
                label: 'Beware: continue in while', intro: 'In a `while` loop, make sure the counter is updated **before** `continue`, or the loop never ends. This version is safe.', code: C`
              n = 0
              while n < 6:
                  n = n + 1
                  if n % 2 == 0:
                      continue
                  print(n)
            ` },
            ]
          },

          { t: 'h', text: 'Extension: else on a loop' },
          { t: 'p', html: 'A loop may have an `else` block. It runs only when the loop finishes **without** meeting a `break`. This is handy for "search and report not found". You do not need it for the exam, since a flag variable does the same job.' },
          {
            t: 'cases', title: 'Searching with else (optional)', items: [
              {
                label: 'Prime check', stdin: ['13'], code: C`
              n = int(input("Number (2 or more): "))
              for d in range(2, n):
                  if n % d == 0:
                      print("Not prime, divisible by", d)
                      break
              else:
                  print("Prime")
            ` },
              {
                label: 'Same with a flag', stdin: ['12'], code: C`
              n = int(input("Number (2 or more): "))
              is_prime = True
              for d in range(2, n):
                  if n % d == 0:
                      is_prime = False
                      break
              if is_prime:
                  print("Prime")
              else:
                  print("Not prime")
            `, caption: 'This flag form is the one to use if you prefer; it is clearer to read.'
              },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode has no `break` or `continue`. Exam loops stop through their condition. If you meet a program using `break`, treat it as "leave the loop now". In your own answers, writing the condition properly in <code>WHILE ... DO</code> is always safe.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'break', code: C`
            for n in range(10):
                if n * n > 20:
                    break
                print(n)
          `, rows: 5, why: '5 x 5 = 25 is above 20, so the loop breaks when n is 5. It printed 0 to 4.'
          },
          {
            t: 'predict', title: 'continue', code: C`
            for n in range(6):
                if n % 2 == 1:
                    continue
                print(n)
          `, rows: 3, why: 'Odd numbers are skipped. The even ones are printed.'
          },
          {
            t: 'predict', title: 'while True', code: C`
            n = 1
            while True:
                n = n * 2
                if n > 30:
                    break
            print(n)
          `, rows: 1, why: 'n doubles: 2, 4, 8, 16, 32. 32 is above 30, so it stops there.'
          },
          { t: 'quiz', q: 'What is the difference between <code>break</code> and <code>continue</code>?', options: ['break ends the loop; continue skips to the next pass', 'break skips to the next pass; continue ends the loop', 'They do the same thing', 'break stops the program; continue pauses it'], answer: 0, why: 'break leaves the loop; continue only skips the rest of the current pass.' },
          {
            t: 'sort', prompt: 'What does each loop do when n is 3?', cats: ['The loop ends', 'The pass is skipped'], items: [
              { text: '<code>if n == 3: break</code>', cat: 0 },
              { text: '<code>if n == 3: continue</code>', cat: 1 },
              { text: 'the `while` condition becomes False', cat: 0 },
              { text: 'lines after `continue` in the body', cat: 1 },
            ], why: 'break and a false condition end the loop; continue only skips the lines after it.'
          },

          {
            t: 'exercise', id: 'm03-ex-stop-negative', title: 'Stop at a negative', level: 2,
            prompt: 'Read whole numbers one per line. Add each one to a total, but stop (and do not add it) when a negative number is entered. Print the total. Use <code>while True</code> and <code>break</code>.',
            starter: C`
              total = 0
            `,
            solution: C`
              total = 0
              while True:
                  n = int(input("Number: "))
                  if n < 0:
                      break
                  total = total + n
              print(total)
            `,
            tests: [{ in: ['4', '6', '-1'], out: '10' }, { in: ['-5'], out: '0' }, { in: ['0', '9', '1', '-9'], out: '10', hidden: true }],
            requires: [{ re: '\\bbreak\\b', msg: 'Use `break`.' }],
            hints: ['Read inside the loop, check for negative, `break` if so.']
          },
          {
            t: 'exercise', id: 'm03-ex-skip-vowels', title: 'Skip the vowels', level: 2,
            prompt: 'Read a lower-case word and print it again with all the vowels (a, e, i, o, u) removed, on one line. Use <code>continue</code> in a <code>for</code> loop.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              for ch in word:
                  if ch in "aeiou":
                      continue
                  print(ch, end="")
              print()
            `,
            tests: [{ in: ['banana'], out: 'bnn' }, { in: ['rhythm'], out: 'rhythm' }, { in: ['education'], out: 'dctn', hidden: true }],
            requires: [{ re: '\\bcontinue\\b', msg: 'Use `continue`.' }],
            hints: ['If the letter is a vowel, `continue`. Otherwise print it with `end=""`.']
          },
          {
            t: 'exercise', id: 'm03-ex-prime', kind: 'exam', title: 'Is it prime?', level: 3,
            prompt: 'Read a whole number that is 2 or more. Print <code>Prime</code> if it has no divisors other than 1 and itself, otherwise <code>Not prime</code>. Stop searching as soon as you find a divisor.',
            starter: C`
              n = int(input("Number: "))
            `,
            solution: C`
              n = int(input("Number: "))
              is_prime = True
              for d in range(2, n):
                  if n % d == 0:
                      is_prime = False
                      break
              if is_prime:
                  print("Prime")
              else:
                  print("Not prime")
            `,
            tests: [{ in: ['2'], out: 'Prime' }, { in: ['13'], out: 'Prime' }, { in: ['9'], out: 'Not prime' }, { in: ['10'], out: 'Not prime' }, { in: ['49'], out: 'Not prime', hidden: true }, { in: ['97'], out: 'Prime', hidden: true }],
            requires: [{ re: '\\bbreak\\b', msg: 'Use `break` to stop at the first divisor.' }],
            hints: ['Try every divisor `d` from 2 up to `n - 1`.', 'Use a flag `is_prime = True` and set it to False if `n % d == 0`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'repeat-until',
        title: 'Repeat until: input loops and exam pseudocode',
        time: '35 min',
        book: 'Ch 2 · p.70-72',
        exam: 'Paper 2 Q3-Q6',
        summary: 'REPEAT ... UNTIL in Python, validation loops, menus, guessing games',
        intro: 'Many programs must do something at least once and then repeat until a condition is met: ask for a PIN, show a menu, guess a number. Edexcel pseudocode calls this REPEAT ... UNTIL, and Python has no keyword for it, so we build it.',
        blocks: [
          { t: 'h', text: 'REPEAT ... UNTIL, translated' },
          { t: 'p', html: 'A `REPEAT ... UNTIL` loop checks its condition at the **end**, so the body always runs at least once. It stops when the condition becomes **True**. A `while` loop is the opposite: it checks at the **start** and keeps going while the condition is True.' },
          {
            t: 'table', head: ['', 'Edexcel pseudocode', 'Python'], rows: [
              ['Check at start, repeat while True', '`WHILE x < 10 DO ... END WHILE`', '`while x < 10:`'],
              ['Check at end, repeat until True', '`REPEAT ... UNTIL x ≥ 10`', '`while True:` + `if x >= 10: break`'],
            ]
          },
          {
            t: 'cases', title: 'The same loop written three ways', items: [
              {
                label: 'Pseudocode (read only)', intro: 'Here is the pseudocode as a text comment. It is not runnable Python.', code: C`
              # REPEAT
              #     RECEIVE guess FROM (INTEGER) KEYBOARD
              # UNTIL guess = 7
              print("Pseudocode shown above")
            ` },
              {
                label: 'while True + break', stdin: ['3', '9', '7'], code: C`
              while True:
                  guess = int(input("Guess: "))
                  if guess == 7:
                      break
              print("Correct")
            `, caption: 'Exactly the pseudocode. "Until guess = 7" means "break when guess is 7".'
              },
              {
                label: 'while with the opposite condition', stdin: ['3', '9', '7'], code: C`
              guess = 0
              while guess != 7:
                  guess = int(input("Guess: "))
              print("Correct")
            `, caption: 'Also works, if you give `guess` a starting value that is not 7. The condition is the **opposite** of the UNTIL condition.'
              },
              {
                label: 'Flipping a condition', code: C`
              # UNTIL x >= 10   becomes   while x < 10
              # UNTIL ok == "y" becomes   while ok != "y"
              # UNTIL a > 0 AND b > 0   becomes   while a <= 0 or b <= 0
              print("De Morgan applies when flipping and/or")
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'To turn `UNTIL cond` into a Python `while`, put the **opposite** of `cond` in the `while` line. With `while True:` and `break`, put `cond` itself in the `if`.' },

          { t: 'h', text: 'Input loops until valid' },
          { t: 'p', html: 'Never trust what the user types. An **input validation** loop keeps asking until the answer is acceptable. Start with a message that explains the rule.' },
          {
            t: 'cases', title: 'Validation loops', items: [
              {
                label: 'Number in a range', stdin: ['200', '0', '14'], code: C`
              while True:
                  age = int(input("Age (1 to 120): "))
                  if age >= 1 and age <= 120:
                      break
                  print("Invalid age, try again")
              print("Age accepted:", age)
            ` },
              {
                label: 'Compact version', stdin: ['200', '0', '14'], code: C`
              age = int(input("Age (1 to 120): "))
              while age < 1 or age > 120:
                  print("Invalid age, try again")
                  age = int(input("Age (1 to 120): "))
              print("Age accepted:", age)
            `, caption: 'This one repeats the `input` line, but the condition is the "invalid" test which many people find natural.'
              },
              {
                label: 'Yes or no', stdin: ['maybe', 'Y', 'yes'], code: C`
              answer = input("Continue (yes/no): ").lower()
              while answer != "yes" and answer != "no":
                  print("Please type yes or no")
                  answer = input("Continue (yes/no): ").lower()
              print("You chose", answer)
            `, caption: 'Notice `and` between the two `!=` tests: it must be wrong for **both** to keep asking.'
              },
              {
                label: 'Non-empty text', stdin: ['', '', 'Asha'], code: C`
              name = input("Name: ")
              while name == "":
                  print("Name cannot be empty")
                  name = input("Name: ")
              print("Hello", name)
            ` },
              {
                label: 'Password twice', stdin: ['abc', 'abd', 'hello', 'hello'], code: C`
              while True:
                  first = input("New password: ")
                  second = input("Repeat password: ")
                  if first == second:
                      break
                  print("Passwords do not match")
              print("Password set")
            ` },
            ]
          },

          { t: 'h', text: 'Menus and games that repeat' },
          {
            t: 'cases', title: 'Loop until the user quits', items: [
              {
                label: 'A menu loop', stdin: ['1', '2', '7', '3'], code: C`
              while True:
                  print("1. Say hello")
                  print("2. Show score")
                  print("3. Quit")
                  choice = input("Choose: ")
                  if choice == "1":
                      print("Hello!")
                  elif choice == "2":
                      print("Score: 10")
                  elif choice == "3":
                      print("Goodbye")
                      break
                  else:
                      print("Invalid choice")
            ` },
              {
                label: 'Number guessing', stdin: ['50', '20', '35', '30'], code: C`
              secret = 30
              guesses = 0
              while True:
                  guess = int(input("Guess: "))
                  guesses = guesses + 1
                  if guess < secret:
                      print("Too low")
                  elif guess > secret:
                      print("Too high")
                  else:
                      print("Correct in", guesses, "guesses")
                      break
            ` },
              {
                label: 'Limited tries', stdin: ['a', 'b', 'c'], code: C`
              tries = 0
              while tries < 3:
                  word = input("Password: ")
                  if word == "open":
                      print("Welcome")
                      break
                  tries = tries + 1
              else:
                  print("Too many attempts")
            `, caption: 'The loop `else` runs when the loop ended without `break` (the extension from the last lesson).'
              },
            ]
          },

          { t: 'h', text: 'Loop bugs to look for' },
          {
            t: 'table', head: ['Symptom', 'Likely cause'], rows: [
              ['Loop never ends', 'Counter not updated, condition never False, input not re-read inside the loop'],
              ['Loop runs one time too many or too few', '`<` vs `<=`, `range(n)` vs `range(1, n + 1)`, start at 0 vs 1'],
              ['Total is wrong', 'Accumulator reset inside the loop, or not started at 0'],
              ['Loop never runs', 'Condition False from the start'],
              ['Output on the wrong lines', '`print()` indented at the wrong level, or missing `end=""`'],
              ['Loop accepts bad input', '`and`/`or` mixed up in the validation condition'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'Questions often ask you to <em>write an algorithm using REPEAT ... UNTIL (or WHILE) that asks the user for a number between 1 and 10 until a valid one is entered</em>. Marks: a loop construct, a correct condition, an input inside the loop, and sensible output. Stating the loop <strong>type</strong> (condition-controlled iteration) is also worth knowing.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Repeat until', stdin: ['5', '12', '8'], code: C`
            while True:
                n = int(input("n: "))
                print("got", n)
                if n > 10:
                    break
            print("end")
          `, rows: 3, why: 'It reads 5, then 12. 12 is above 10, so it stops.'
          },
          {
            t: 'predict', title: 'Validation', stdin: ['x', 'ok'], code: C`
            word = input("Word: ")
            while word != "ok":
                print("again")
                word = input("Word: ")
            print("fine")
          `, rows: 2, why: 'The first answer is not "ok", so it prints again, then reads "ok" and finishes.'
          },
          { t: 'quiz', q: 'The pseudocode loop ends with <code>UNTIL score > 100</code>. Which Python <code>while</code> condition is equivalent?', options: ['while score > 100:', 'while score < 100:', 'while score <= 100:', 'while score != 100:'], answer: 2, why: 'The loop continues while the UNTIL condition is False, which is `score <= 100`.' },
          { t: 'quiz', q: 'Why does a <code>REPEAT ... UNTIL</code> loop always run at least once?', options: ['Its condition is checked at the end', 'It cannot have a condition', 'It is always a for loop', 'Python skips the first check'], answer: 0, why: 'The test comes after the body, so the body runs first.' },
          {
            t: 'parsons', title: 'Repeat until valid', prompt: 'Order the lines to ask for a mark from 0 to 100 until it is valid, then print it.', lines: [
              'while True:',
              '    mark = int(input("Mark (0-100): "))',
              '    if mark >= 0 and mark <= 100:',
              '        break',
              '    print("Invalid")',
              'print("Mark:", mark)',
            ], why: 'The `break` leaves the loop when the mark is valid; otherwise the error message prints and it repeats.'
          },

          {
            t: 'exercise', id: 'm03-ex-valid-age', title: 'Age validation', level: 2,
            prompt: 'Read an age until it is from 1 to 120 (inclusive). For each invalid age print <code>Invalid</code>. When a valid age is entered print <code>Age accepted: </code> followed by the age.',
            starter: C`
              age = int(input("Age: "))
            `,
            solution: C`
              age = int(input("Age: "))
              while age < 1 or age > 120:
                  print("Invalid")
                  age = int(input("Age: "))
              print("Age accepted:", age)
            `,
            tests: [{ in: ['15'], out: 'Age accepted: 15' }, { in: ['150', '0', '15'], out: 'Invalid\nInvalid\nAge accepted: 15' }, { in: ['1'], out: 'Age accepted: 1' }, { in: ['121', '120'], out: 'Invalid\nAge accepted: 120', hidden: true }],
            requires: [{ re: '\\bwhile\\b', msg: 'Use a `while` loop.' }],
            hints: ['Keep looping while the age is too small or too large.', 'Remember to read the age again inside the loop.']
          },
          {
            t: 'exercise', id: 'm03-ex-guess', title: 'Guessing game', level: 3,
            prompt: 'The secret number is 42. Read guesses until the player is right. For a guess that is too low print <code>Too low</code>, too high print <code>Too high</code>. When correct print <code>Correct in N guesses</code> where N is how many guesses were made.',
            starter: C`
              secret = 42
              guesses = 0
            `,
            solution: C`
              secret = 42
              guesses = 0
              while True:
                  guess = int(input("Guess: "))
                  guesses = guesses + 1
                  if guess < secret:
                      print("Too low")
                  elif guess > secret:
                      print("Too high")
                  else:
                      print("Correct in", guesses, "guesses")
                      break
            `,
            tests: [{ in: ['42'], out: 'Correct in 1 guesses' }, { in: ['10', '90', '42'], out: 'Too low\nToo high\nCorrect in 3 guesses' }, { in: ['50', '41', '42'], out: 'Too high\nToo low\nCorrect in 3 guesses', hidden: true }],
            hints: ['Add 1 to `guesses` every time a guess is read.', 'Use an `if / elif / else` chain inside the loop.']
          },
          {
            t: 'exercise', id: 'm03-ex-menu-loop', kind: 'exam', title: 'Menu until quit', level: 3,
            prompt: 'Show a menu loop that reads a choice each time. <code>1</code> prints <code>Hello</code>, <code>2</code> prints <code>Score: 10</code>, <code>3</code> prints <code>Goodbye</code> and ends the program. Any other choice prints <code>Invalid choice</code> and the menu repeats. (Do not print the menu itself, only the responses.)',
            starter: C`
              choice = ""
            `,
            solution: C`
              choice = ""
              while choice != "3":
                  choice = input("Choice: ")
                  if choice == "1":
                      print("Hello")
                  elif choice == "2":
                      print("Score: 10")
                  elif choice == "3":
                      print("Goodbye")
                  else:
                      print("Invalid choice")
            `,
            tests: [{ in: ['3'], out: 'Goodbye' }, { in: ['1', '2', '3'], out: 'Hello\nScore: 10\nGoodbye' }, { in: ['9', '1', '3'], out: 'Invalid choice\nHello\nGoodbye' }, { in: ['x', 'x', '3'], out: 'Invalid choice\nInvalid choice\nGoodbye', hidden: true }],
            hints: ['Keep looping until the choice is "3".', 'The choice is text, so compare with `"1"`, `"2"`, `"3"`.']
          },
          {
            t: 'exercise', id: 'm03-ex-double-check', title: 'Debug: the endless menu', kind: 'debug', level: 2,
            prompt: 'This program should keep adding numbers until the user types <code>0</code>, then print the total. There are <strong>three</strong> errors. Find and fix them.',
            starter: C`
              total = 0
              number = int(input("Number: "))
              while number = 0
                  total = total + number
              print("Total:", total)
            `,
            solution: C`
              total = 0
              number = int(input("Number: "))
              while number != 0:
                  total = total + number
                  number = int(input("Number: "))
              print("Total:", total)
            `,
            tests: [{ in: ['5', '10', '0'], out: 'Total: 15' }, { in: ['0'], out: 'Total: 0' }, { in: ['7', '-2', '0'], out: 'Total: 5', hidden: true }],
            hints: ['The `while` line has a wrong operator and something missing at its end.', 'The loop never asks for the next number, so it would never end.']
          },
        ],
      },
    ],
  });
})();

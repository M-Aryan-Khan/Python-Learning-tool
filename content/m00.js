(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm00',
    title: 'Start here',
    blurb: 'Your first program, printing, comments and what to do when Python complains.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'first-program',
        title: 'Your first program',
        time: '25 min',
        book: 'Ch 2 · p.40',
        summary: 'What a program is, running code, print()',
        intro: 'A program is a list of instructions. Python reads them from the top, one line at a time, and does exactly what each one says. Nothing more, nothing less.',
        blocks: [
          { t: 'h', text: 'Run something right now' },
          { t: 'p', html: 'The box below is a real Python editor. Press **Run** (or Ctrl+Enter) and look at the **Output** panel that appears underneath.' },
          {
            t: 'code', title: 'hello.py', code: C`
            print("Hello, world!")
          `, caption: 'You have just run a program. `print()` is a **function** that displays whatever you put inside the brackets.'
          },
          { t: 'p', html: 'Now change the text between the quote marks and run it again. Python does not mind what you write there - it only matters that you keep the quotes and the brackets.' },
          { t: 'note', kind: 'key', html: 'Python runs your lines **in order, from top to bottom**. If a line is wrong, nothing below it runs.' },

          { t: 'h', text: 'Many lines, many outputs' },
          { t: 'p', html: 'Each `print()` starts a new line of output. Click Trace to watch Python move through the lines one at a time.' },
          {
            t: 'code', title: 'order.py', code: C`
            print("First")
            print("Second")
            print("Third")
          ` },

          { t: 'h', text: 'Everything you can print' },
          { t: 'p', html: '`print()` can show text, numbers, the result of a calculation, or several things at once. Look at each case in turn.' },
          {
            t: 'cases', title: 'Every way to use print()', items: [
              {
                label: 'Text', intro: 'Text goes inside quote marks. Text in code is called a **string**.', code: C`
              print("I am learning Python")
            ` },
              {
                label: 'Numbers', intro: 'Numbers do **not** need quotes.', code: C`
              print(42)
              print(3.14)
              print(-7)
            ` },
              {
                label: 'Calculations', intro: 'Python works out the answer before printing it.', code: C`
              print(6 * 7)
              print(100 - 58)
              print(10 / 4)
            ` },
              {
                label: 'Several things', intro: 'Separate items with commas. Python puts a space between them for you.', code: C`
              print("My age is", 15)
              print("Total:", 4 + 5, "points")
            ` },
              {
                label: 'A blank line', intro: 'Empty brackets print an empty line. Useful for spacing out output.', code: C`
              print("Above the gap")
              print()
              print("Below the gap")
            ` },
            ]
          },

          { t: 'h', text: 'Quote marks: what goes wrong' },
          { t: 'p', html: 'A string starts and ends with the **same** kind of quote. You can use `"double"` or `\'single\'` quotes, as long as you are consistent.' },
          {
            t: 'cases', title: 'Quotes, apostrophes and numbers-as-text', items: [
              {
                label: 'Double or single', code: C`
              print("Double quotes work")
              print('Single quotes work too')
            ` },
              {
                label: 'Apostrophe inside', intro: 'If the text contains an apostrophe, wrap it in double quotes so Python does not get confused.', code: C`
              print("It's a lovely day")
              print('She said "hello"')
            ` },
              {
                label: 'Text vs maths', intro: 'With quotes, Python prints the characters. Without quotes, it calculates.', code: C`
              print("5 + 3")
              print(5 + 3)
            ` },
              {
                label: 'The classic mistake', expectError: true, intro: 'Run this one. Python tells you what is wrong - read the message, then fix the quote.', code: C`
              print("Hello)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: '`Print("hi")` with a capital P does **not** work. Python is case-sensitive: `print`, `Print` and `PRINT` are three different names.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Predict the output', code: C`
            print("A")
            print("B", "C")
            print(1 + 1)
            print("1 + 1")
          `, rows: 4, why: 'Strings in quotes are printed as written; `1 + 1` without quotes is calculated first.'
          },
          { t: 'quiz', q: 'Which line prints the text <code>Good luck</code> correctly?', options: ['print(Good luck)', 'print("Good luck")', 'Print("Good luck")', 'print("Good luck)'], answer: 1, why: 'Text must be inside matching quotes, and `print` is written in lowercase.' },
          {
            t: 'parsons', title: 'Arrange the program', prompt: 'These lines make a program that prints a greeting, then a blank line, then a goodbye. Put them in the right order using the arrows.', lines: [
              'print("Hello!")', 'print()', 'print("Goodbye!")'], why: 'Python runs lines top to bottom, so the order you write them is the order of the output.'
          },

          {
            t: 'exercise', id: 'm00-ex-hello', title: 'Say hello', level: 1,
            prompt: 'Write one line of code that prints exactly: <code>Hello, Python!</code>',
            starter: C`
              # Write your print line below

            `,
            solution: C`
              print("Hello, Python!")
            `,
            tests: [{ out: 'Hello, Python!' }],
            hints: ['Use `print()` with the text inside quote marks.', 'Check the comma, the capital letters and the exclamation mark. Output must match exactly.']
          },
          {
            t: 'exercise', id: 'm00-ex-card', title: 'Name card', level: 1,
            prompt: 'Print three lines: your first name on line 1, your class on line 2, and the word <code>Python</code> on line 3. (Use any name and class you like - we only check there are exactly three lines and the third is Python.)',
            starter: C`
              # three print() lines, please

            `,
            solution: C`
              print("Sam")
              print("Class 10")
              print("Python")
            `,
            tests: [{ lines: 3, has: ['Python'], label: 'Prints exactly three lines, one of them is Python' }],
            requires: [{ re: '^\\s*print\\(.+\\)\\s*\\n\\s*print\\(.+\\)\\s*\\n\\s*print\\(\\s*["\']Python["\']\\s*\\)\\s*$', msg: 'Use exactly three `print()` lines, with the last one printing `Python`.' }],
            hints: ['Three lines of output need three `print()` statements.']
          },
          {
            t: 'exercise', id: 'm00-ex-sum', title: 'Let Python do the sum', level: 1,
            prompt: 'Use a single <code>print()</code> to display the result of <code>365 * 24</code> (the number of hours in a year). Do not type the answer yourself - make Python calculate it.',
            starter: C`
              # print the result of 365 * 24

            `,
            solution: C`
              print(365 * 24)
            `,
            tests: [{ out: '8760' }],
            requires: [{ re: '365\\s*\\*\\s*24', msg: 'Write the calculation `365 * 24` inside your print().' }],
            hints: ['A calculation does not need quotes.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'print-in-depth',
        title: 'Controlling your output',
        time: '25 min',
        book: 'Ch 2',
        summary: 'sep, end, escape characters, joining text',
        intro: 'Once you can print, you need to control how it looks. Real programs print tidy tables, menus and messages - not a jumble.',
        blocks: [
          { t: 'h', text: 'Escape characters' },
          { t: 'p', html: 'Inside a string, a backslash `\\` followed by a letter is a special instruction. These are called **escape characters**.' },
          {
            t: 'table', head: ['Write this', 'Python prints', 'Use it for'], rows: [
              ['`\\n`', 'a new line', 'Several lines from one print()'],
              ['`\\t`', 'a tab (a wide gap)', 'Lining up columns'],
              ['`\\\\`', 'a single backslash `\\`', 'File paths such as C:\\\\folder'],
              ['`\\"`', 'a double quote mark', 'Quotes inside a double-quoted string'],
              ['`\\\'`', 'a single quote mark', 'Quotes inside a single-quoted string'],
            ]
          },
          {
            t: 'cases', title: 'Escape characters in action', items: [
              {
                label: 'New line \\n', code: C`
              print("Line one\nLine two\nLine three")
            ` },
              {
                label: 'Tab \\t', code: C`
              print("Name\tScore")
              print("Asha\t90")
              print("Benedict\t85")
            ` },
              {
                label: 'Backslash and quotes', code: C`
              print("C:\\Users\\Asha")
              print("She said \"well done\"")
              print('It\'s fine')
            ` },
            ]
          },

          { t: 'h', text: 'sep and end: two hidden settings' },
          { t: 'p', html: '`print()` has two optional settings. **sep** is what goes *between* items (default: a space). **end** is what goes at the *end* (default: a new line).' },
          {
            t: 'cases', title: 'Changing sep and end', items: [
              {
                label: 'Default behaviour', code: C`
              print("a", "b", "c")
              print("d")
            ` },
              {
                label: 'sep', intro: 'Change what goes between items.', code: C`
              print("2026", "11", "03", sep="-")
              print("Asha", "Ben", "Chloe", sep=", ")
              print("no", "gaps", sep="")
            ` },
              {
                label: 'end', intro: 'Stop print() from starting a new line.', code: C`
              print("Loading", end="")
              print("...", end="")
              print(" done")
            ` },
              {
                label: 'Both together', code: C`
              print("A", "B", "C", sep="*", end="!")
              print()
              print("next line")
            ` },
            ]
          },

          { t: 'h', text: 'Joining text with +' },
          { t: 'p', html: 'You can glue two strings together with `+`. This is called **concatenation**. Python adds no space for you, so put the space inside the quotes.' },
          {
            t: 'cases', title: 'Concatenation and repetition', items: [
              {
                label: 'Joining', code: C`
              print("Good" + "bye")
              print("Hello, " + "Asha")
            ` },
              {
                label: 'Repeating with *', intro: 'A string multiplied by a whole number repeats. Great for drawing lines.', code: C`
              print("-" * 20)
              print("MENU")
              print("-" * 20)
              print("ab" * 3)
            ` },
              {
                label: 'The error', expectError: true, intro: 'You cannot join text and a number with `+`. Run it and read the message. Then try the comma version.', code: C`
              print("Age: " + 15)
            ` },
              {
                label: 'The fix', code: C`
              print("Age:", 15)
              print("Age: " + str(15))
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: '`str(15)` converts the number 15 into the text `"15"`. You will meet this properly in the lesson on data types.' },

          {
            t: 'predict', title: 'sep and end', code: C`
            print("x", "y", sep="-")
            print("p", end="")
            print("q")
          `, rows: 2, why: 'The first print puts `-` between items. The second does not end the line, so `q` continues on the same line.'
          },
          {
            t: 'predict', title: 'Escape characters', code: C`
            print("a\tb\nc")
          `, rows: 2, why: '`\\t` is a tab (shown as a gap) and `\\n` starts a new line.', hint: 'There is a tab between a and b. Type it as spaces.'
          },

          {
            t: 'exercise', id: 'm00-ex-dashes', title: 'A divider line', level: 1,
            prompt: 'Print a line of exactly 30 dash characters (<code>-</code>) using repetition. Do not type 30 dashes by hand.',
            starter: C`
              # print a line of 30 dashes

            `,
            solution: C`
              print("-" * 30)
            `,
            tests: [{ out: '------------------------------' }],
            requires: [{ re: '\\*', msg: 'Use `*` to repeat the string.' }],
            hints: ['A string times a number repeats the string.']
          },
          {
            t: 'exercise', id: 'm00-ex-date', title: 'Format a date', level: 1,
            prompt: 'Using a single <code>print()</code> with <code>sep</code>, display the date <code>03/11/2026</code> from the three separate items <code>"03"</code>, <code>"11"</code> and <code>"2026"</code>.',
            starter: C`
              print("03", "11", "2026")
            `,
            solution: C`
              print("03", "11", "2026", sep="/")
            `,
            tests: [{ out: '03/11/2026' }],
            requires: [{ re: 'sep\\s*=', msg: 'Use the `sep` setting.' }],
            hints: ['Add `sep="/"` as the last item inside the brackets.']
          },
          {
            t: 'exercise', id: 'm00-ex-table', title: 'A tidy table', level: 2,
            prompt: 'Print this table using tabs, with exactly one <code>print()</code> per row:<pre>Item\tPrice\nPen\t2\nBook\t5</pre>',
            starter: C`
              # three print() lines, one for each row

            `,
            solution: C`
              print("Item\tPrice")
              print("Pen\t2")
              print("Book\t5")
            `,
            tests: [{ out: 'Item\tPrice\nPen\t2\nBook\t5' }],
            hints: ['Write `\\t` between the two words in each line.']
          },
          {
            t: 'exercise', id: 'm00-ex-oneline', title: 'One print, three lines', level: 2,
            prompt: 'Use only <strong>one</strong> <code>print()</code> and the <code>\\n</code> escape character to display:<pre>Red\nGreen\nBlue</pre>',
            starter: C`
              print("Red", "Green", "Blue")
            `,
            solution: C`
              print("Red\nGreen\nBlue")
            `,
            tests: [{ out: 'Red\nGreen\nBlue' }],
            requires: [{ re: '^(?:(?!print)[\\s\\S])*print\\((?:(?!print)[\\s\\S])*$', msg: 'Use exactly one `print()`.' }],
            hints: ['Put `\\n` between the colour names, all inside one pair of quotes.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'comments-style',
        title: 'Comments and readable code',
        time: '20 min',
        book: 'Ch 2 · p.51-52',
        summary: 'Comments, good names, indentation, white space',
        intro: 'Code is read far more often than it is written. The exam gives marks for readable programs, and so will you the day you come back to your own work after a week.',
        blocks: [
          { t: 'h', text: 'Comments' },
          { t: 'p', html: 'A **comment** is a note for humans. Python ignores everything from a `#` to the end of the line.' },
          {
            t: 'cases', title: 'Where comments go', items: [
              {
                label: 'On their own line', code: C`
              # Show a welcome message
              print("Welcome to the quiz")
            ` },
              {
                label: 'At the end of a line', code: C`
              print("Score:", 10 * 5)   # ten questions, five marks each
            ` },
              {
                label: 'Switching code off', intro: 'Putting `#` in front of a line "comments it out" - handy for testing. Run it: only one line prints.', code: C`
              # print("This line is switched off")
              print("This line runs")
            ` },
              {
                label: 'Several lines', code: C`
              # Program: Area of a rectangle
              # Author: your name
              # Date: 3 November 2026

              print(4 * 6)
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'In Paper 2 you are asked to give a reason for using comments. A full-mark answer: <em>comments explain what the code does, so it is easier for another programmer (or you later) to understand, maintain and debug.</em>' },

          { t: 'h', text: 'The four techniques for readable programs' },
          {
            t: 'table', head: ['Technique', 'Why it helps'], rows: [
              ['Comments', 'Explain the purpose of each part of the program'],
              ['Descriptive names', '`total_price` tells you more than `x`'],
              ['Indentation', 'Shows which lines belong inside which block'],
              ['White space', 'Blank lines separate sections so they stand out'],
            ]
          },
          { t: 'p', html: 'Both programs below do exactly the same job. Run each one.' },
          {
            t: 'cases', title: 'Hard to read vs easy to read', items: [
              {
                label: 'Hard to read', code: C`
              a=12
              b=3.5
              c=a*b
              print(c)
            ` },
              {
                label: 'Easy to read', code: C`
              # Calculate the cost of a drinks order
              number_of_bottles = 12
              price_per_bottle = 3.5

              total_cost = number_of_bottles * price_per_bottle

              print(total_cost)
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'Names can contain letters, digits and underscores, but cannot start with a digit or contain spaces. The style used in this course is `lower_case_with_underscores`.' },

          { t: 'quiz', q: 'Which of these is the **best** variable name for the number of students in a class?', options: ['n', 'x1', 'number_of_students', 'NumberOfStudents ThisYear'], answer: 2, why: 'It is descriptive and a legal name. The last option contains a space, which is not allowed.' },

          {
            t: 'exercise', id: 'm00-ex-comment', title: 'Make it readable', level: 2,
            prompt: 'This program works but is hard to read. Without changing what it prints, <strong>rename</strong> <code>a</code>, <code>b</code> and <code>c</code> to descriptive names, <strong>add at least two comments</strong>, and put a blank line between the inputs and the output.',
            starter: C`
              a=7
              b=9.5
              c=a*b
              print(c)
            `,
            solution: C`
              # Cost of buying tickets
              tickets = 7
              price = 9.5

              # Work out and show the total
              total = tickets * price
              print(total)
            `,
            tests: [{ out: '66.5' }],
            requires: [
              { re: '(^|\\n)\\s*#[^\\n]*\\n[\\s\\S]*#[^\\n]*', msg: 'Add at least two comments (lines or line-endings starting with `#`).' },
              { re: '\\b[abc]\\s*=', not: true, msg: 'Rename the one-letter variables `a`, `b`, `c`.' },
              { re: '\\n\\s*\\n', msg: 'Add at least one blank line to separate sections.' },
            ],
            hints: ['Variables could be `tickets`, `price` and `total`.', 'A comment looks like `# explain here`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'errors-debugging',
        title: 'Errors, and how to fix them',
        time: '30 min',
        book: 'Ch 2 · Unit 2',
        summary: 'Syntax, runtime and logic errors; reading messages; tracing',
        intro: 'Every programmer, including professionals, spends a lot of time fixing mistakes. The skill is not avoiding errors - it is reading what Python tells you and finding the cause calmly.',
        blocks: [
          { t: 'h', text: 'Three kinds of error' },
          {
            t: 'table', head: ['Error type', 'What happens', 'Example'], rows: [
              ['**Syntax error**', 'You broke the rules of the language. The program **will not start**.', 'A missing bracket, quote or colon'],
              ['**Runtime error**', 'The program starts, then **crashes** when it reaches an impossible instruction.', 'Dividing by zero, using a name that does not exist'],
              ['**Logic error**', 'The program runs to the end **without crashing** but the answer is wrong.', 'Using `+` when you meant `*`'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel definition: a **logic error** is a mistake in the design of the program which makes it produce unexpected or incorrect results, but it does not stop the program running. Syntax errors are found by the translator; logic errors are found by testing.' },
          { t: 'p', html: 'Run each example. For every one, work out which kind of error it is **before** you read Python\'s message.' },
          {
            t: 'cases', title: 'One of each', items: [
              {
                label: 'Syntax', expectError: true, intro: 'Python refuses to run any of this program, not even the first line.', code: C`
              print("This should print first")
              print("Missing a bracket"
            ` },
              {
                label: 'Runtime', expectError: true, intro: 'The first line prints, then the program crashes.', code: C`
              print("Starting")
              print(10 / 0)
              print("Never reached")
            ` },
              {
                label: 'Runtime: name', expectError: true, intro: 'Python does not know the name `scor`.', code: C`
              score = 10
              print(scor)
            ` },
              {
                label: 'Logic', intro: 'No crash - and no warning - but the answer is wrong. The average of 4 and 6 should be 5.', code: C`
              a = 4
              b = 6
              average = a + b / 2
              print(average)
            ` },
            ]
          },

          { t: 'h', text: 'How to read an error message' },
          { t: 'p', html: 'When Python crashes, the error box under the editor gives you three things:' },
          {
            t: 'list', ordered: true, items: [
              'the **type** of error, e.g. `NameError`',
              'the **line number** where it happened (that line is also highlighted red in the editor)',
              'a **message** explaining what it found',
            ]
          },
          { t: 'note', kind: 'tip', html: 'The mistake is usually on the line Python reports - but for syntax errors it can be on the line *above* (for example, a bracket that was never closed).' },

          {
            t: 'sort', title: 'Name that error', prompt: 'Decide which type of error each situation causes.', cats: ['Syntax error', 'Runtime error', 'Logic error'], items: [
              { text: 'A program prints `Total: 7` when the total should be 12.', cat: 2 },
              { text: 'You write <code>print("Hi"</code> and forget the closing bracket.', cat: 0 },
              { text: 'A program tries to divide a number by zero.', cat: 1 },
              { text: 'You use a variable that you never created.', cat: 1 },
              { text: 'You write <code>if x > 5</code> without the colon at the end.', cat: 0 },
              { text: 'A program that should add 10% to a price subtracts it instead.', cat: 2 },
            ], why: 'Syntax errors stop the program starting; runtime errors crash it part-way; logic errors give wrong answers silently.'
          },

          { t: 'h', text: 'Finding logic errors with the Trace button' },
          { t: 'p', html: 'A logic error produces no message, so you have to watch the values. Press **Trace** and use **Step** to move one line at a time. Watch how `average` becomes `7.0` instead of `5.0`. Then press **Trace table** to see the same information as an exam-style trace table.' },
          {
            t: 'code', title: 'Trace me', code: C`
            a = 4
            b = 6
            total = a + b
            average = total / 2
            print(average)
          `, caption: 'Yellow cells show the variable that just changed.'
          },
          { t: 'note', kind: 'key', html: 'To debug: (1) **predict** what each line should do, (2) **trace** what it actually does, (3) the first place they differ is the bug.' },

          {
            t: 'exercise', id: 'm00-ex-debug1', kind: 'debug', title: 'Three errors', level: 2,
            prompt: 'This program should print <code>Welcome to Python</code> on one line, then the result of 8 times 5 on the next. There are <strong>three</strong> errors. Find and fix them all. (This is exactly the kind of task in Paper 2.)',
            starter: C`
              print("Welcome to Python"
              Print(8 + 5)
              print("done)
            `,
            solution: C`
              print("Welcome to Python")
              print(8 * 5)
            `,
            tests: [{ out: 'Welcome to Python\n40' }],
            hints: ['Look for a missing bracket on line 1.', 'Python is case-sensitive.', 'The calculation must multiply, and the last line is not needed at all.']
          },
          {
            t: 'exercise', id: 'm00-ex-debug2', kind: 'debug', title: 'The wrong answer', level: 2,
            prompt: 'The program should print the <strong>perimeter</strong> of a rectangle 7 wide and 3 tall (the distance around it). It runs without errors but prints the wrong number. Fix the logic error.',
            starter: C`
              width = 7
              height = 3
              perimeter = width + height * 2
              print(perimeter)
            `,
            solution: C`
              width = 7
              height = 3
              perimeter = (width + height) * 2
              print(perimeter)
            `,
            tests: [{ out: '20' }],
            hints: ['Multiplication happens before addition. How can you make the addition happen first?']
          },
        ],
      },
    ],
  });
})();

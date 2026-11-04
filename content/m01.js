(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm01',
    title: 'Variables and data types',
    blurb: 'Storing values, the four basic types, arithmetic, input(), type casting and random numbers.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'variables',
        title: 'Variables: storing values',
        time: '30 min',
        book: 'Ch 2 · p.42',
        summary: 'Assignment, naming rules, changing and swapping values',
        intro: 'A variable is a named box in the computer\'s memory. You put a value in the box, and later you can look at it, use it, or replace it.',
        blocks: [
          { t: 'h', text: 'Creating a variable' },
          { t: 'p', html: 'The equals sign in Python does **not** mean "is equal to". It means **store**: work out the right-hand side, then put the result in the box named on the left. This is called **assignment**.' },
          {
            t: 'code', title: 'assignment.py', code: C`
            score = 10
            player = "Asha"
            print(player)
            print(score)
          `, caption: 'Press **Trace**, then **Step**: watch `score` and `player` appear in the Variables panel as each line runs.'
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode writes assignment as `SET score TO 10`. In Python it is `score = 10`. Same meaning, different spelling.' },

          { t: 'h', text: 'Using and changing variables' },
          {
            t: 'cases', title: 'Everything a variable can do', items: [
              {
                label: 'Use in print', intro: 'No quotes round a variable name - quotes would print the *word*.', code: C`
              age = 15
              print(age)
              print("age")
              print("I am", age, "years old")
            ` },
              {
                label: 'Change the value', intro: 'Assigning again replaces the old value. The old value is lost.', code: C`
              lives = 3
              print(lives)
              lives = 2
              print(lives)
            ` },
              {
                label: 'Use the old value', intro: 'The right side is worked out first, using the *old* value, then stored.', code: C`
              score = 10
              score = score + 5
              print(score)
              score = score * 2
              print(score)
            ` },
              {
                label: 'Copy a variable', intro: 'Copying stores the current value. Changing one afterwards does not change the other.', code: C`
              a = 7
              b = a
              a = 100
              print(a, b)
            ` },
              {
                label: 'Several at once', code: C`
              x, y = 3, 4
              p = q = 0
              print(x, y, p, q)
            ` },
              {
                label: 'Swap two values', intro: 'You need a third box to hold one value safely - or use Python\'s shortcut.', code: C`
              a = 1
              b = 2
              temp = a
              a = b
              b = temp
              print(a, b)

              c, d = 10, 20
              c, d = d, c
              print(c, d)
            ` },
              {
                label: 'The mistake', intro: 'A variable must exist **before** you use it.', expectError: true, code: C`
              print(total)
              total = 5
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: '`score = score + 5` looks impossible in maths, but it is perfectly normal in code: "take the current score, add 5, store it back in `score`".' },

          { t: 'h', text: 'Naming rules' },
          {
            t: 'table', head: ['Rule', 'Good', 'Not allowed'], rows: [
              ['Letters, digits, underscores only', '`high_score`, `player2`', '`high-score`, `my score`, `price$`'],
              ['Cannot start with a digit', '`item1`', '`1item`'],
              ['Cannot be a Python keyword', '`total`, `count`', '`if`, `for`, `while`, `True`'],
              ['Capital letters matter', '`Score` and `score` are two variables', '-'],
            ]
          },
          {
            t: 'cases', title: 'Names: what Python accepts', items: [
              {
                label: 'Good names', code: C`
              first_name = "Maya"
              total_cost = 49.99
              number_of_lives = 3
              print(first_name, total_cost, number_of_lives)
            ` },
              {
                label: 'Capital letters', intro: 'These are three different variables.', code: C`
              score = 1
              Score = 2
              SCORE = 3
              print(score, Score, SCORE)
            ` },
              {
                label: 'Space in a name', expectError: true, code: C`
              my score = 10
            ` },
              {
                label: 'Starts with digit', expectError: true, code: C`
              2players = 10
            ` },
              {
                label: 'Keyword as name', expectError: true, code: C`
              for = 3
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'A **constant** is a value that should never change, such as `PI` or `VAT_RATE`. Python does not enforce this, so by convention we write constants in CAPITALS and never assign to them again.' },

          { t: 'viz', kind: 'memory', preset: 'Variables and updates', title: 'See your variables as boxes', caption: 'Edit the code in the box and press Visualise. Every line you write is animated using real Python.' },

          {
            t: 'predict', title: 'Follow the values', code: C`
            a = 4
            b = 9
            a = a + b
            b = a - b
            print(a, b)
          `, rows: 1, why: 'a becomes 13; then b = 13 - 9 = 4.'
          },
          {
            t: 'predict', title: 'Does copying link them?', code: C`
            x = 5
            y = x
            x = x + 1
            print(x, y)
          `, rows: 1, why: '`y` kept the old value 5 - it is a separate box.'
          },
          { t: 'quiz', q: 'After <code>n = 3</code> then <code>n = n * n</code>, what is stored in <code>n</code>?', options: ['3', '6', '9', 'Error'], answer: 2, why: 'The right side `3 * 3 = 9` is calculated first, then stored back in n.' },
          {
            t: 'sort', title: 'Legal or not?', prompt: 'Can each of these be used as a variable name?', cats: ['Legal', 'Illegal'], items: [
              { text: '`total_score`', cat: 0 }, { text: '`2nd_place`', cat: 1 }, { text: '`first name`', cat: 1 },
              { text: '`Player1`', cat: 0 }, { text: '`while`', cat: 1 }, { text: '`_hidden`', cat: 0 }, { text: '`best-time`', cat: 1 },
            ], why: 'Names use letters, digits and underscores, cannot start with a digit, and cannot be a keyword.'
          },

          {
            t: 'exercise', id: 'm01-ex-vars1', title: 'Store and show', level: 1,
            prompt: 'Create variables <code>name</code> (set it to <code>"Zara"</code>) and <code>age</code> (set it to <code>14</code>). Then print them on one line as: <code>Zara is 14</code> (use commas in print).',
            starter: C`
              # create name and age, then print them
            `,
            solution: C`
              name = "Zara"
              age = 14
              print(name, "is", age)
            `,
            tests: [{ out: 'Zara is 14' }, { py: 'assert name == "Zara" and age == 14', label: 'name is "Zara" and age is 14' }],
            hints: ['`print(name, "is", age)` puts spaces between the three items.']
          },
          {
            t: 'exercise', id: 'm01-ex-vars2', title: 'Level up', level: 1,
            prompt: 'A game starts with <code>level = 1</code> and <code>points = 0</code>. Write code to: add 50 to <code>points</code>, add 1 to <code>level</code>, then print the level and the points on two separate lines (level first).',
            starter: C`
              level = 1
              points = 0
            `,
            solution: C`
              level = 1
              points = 0
              points = points + 50
              level = level + 1
              print(level)
              print(points)
            `,
            tests: [{ out: '2\n50' }],
            hints: ['`points = points + 50` updates the variable.']
          },
          {
            t: 'exercise', id: 'm01-ex-swap', title: 'Swap the cups', level: 2,
            prompt: 'The variables <code>cup1</code> and <code>cup2</code> hold <code>"tea"</code> and <code>"milk"</code>. Swap their contents <strong>without typing the words again</strong>, then print cup1 and cup2 on separate lines.',
            starter: C`
              cup1 = "tea"
              cup2 = "milk"
              # swap here

              print(cup1)
              print(cup2)
            `,
            solution: C`
              cup1 = "tea"
              cup2 = "milk"
              temp = cup1
              cup1 = cup2
              cup2 = temp
              print(cup1)
              print(cup2)
            `,
            tests: [{ out: 'milk\ntea' }],
            requires: [{ re: '"tea".*[\\s\\S]*"tea"|\'tea\'[\\s\\S]*\'tea\'', not: true, msg: 'Do not type the words again; move the values between variables.' }],
            hints: ['You need a third variable to hold one of the values for a moment.', 'Or use `cup1, cup2 = cup2, cup1`.']
          },
          {
            t: 'exercise', id: 'm01-ex-vars-debug', kind: 'debug', title: 'Three errors', level: 2,
            prompt: 'This program should print <code>Total: 30</code>. There are <strong>three</strong> errors. Find and fix them all.',
            starter: C`
              first number = 10
              second_number = 20
              total = first_number + second_numbr
              print("Total:", Total)
            `,
            solution: C`
              first_number = 10
              second_number = 20
              total = first_number + second_number
              print("Total:", total)
            `,
            tests: [{ out: 'Total: 30' }],
            hints: ['Variable names cannot contain spaces.', 'Check the spelling of every name, and capital letters.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'data-types',
        title: 'Data types',
        time: '30 min',
        book: 'Ch 2 · p.43',
        summary: 'int, float, str, bool; type(); why types matter',
        intro: 'Every value has a type, and the type decides what you are allowed to do with it. You can multiply two numbers but not two names.',
        blocks: [
          {
            t: 'table', head: ['Python type', 'Edexcel name', 'Holds', 'Examples'], rows: [
              ['`int`', 'integer', 'whole numbers', '`7`, `-2`, `0`, `1000000`'],
              ['`float`', 'real', 'numbers with a decimal point', '`3.14`, `-0.5`, `2.0`'],
              ['`str`', 'string / character', 'text (a character is a string of length 1)', '`"hello"`, `"A"`, `"2026"`'],
              ['`bool`', 'Boolean', 'only `True` or `False`', '`True`, `False`'],
            ]
          },
          { t: 'p', html: 'The built-in function `type()` tells you which type a value has. Try each case.' },
          {
            t: 'cases', title: 'Meet the four types', items: [
              {
                label: 'int', code: C`
              print(type(7))
              print(type(-2))
              print(type(0))
            ` },
              {
                label: 'float', intro: 'A decimal point makes it a float - even `2.0` with nothing after the point.', code: C`
              print(type(3.14))
              print(type(2.0))
              print(type(2))
              print(2 == 2.0)
            ` },
              {
                label: 'str', intro: 'Anything in quotes is a string, even if it looks like a number.', code: C`
              print(type("hello"))
              print(type("A"))
              print(type("2026"))
              print(type(""))
            ` },
              {
                label: 'bool', intro: 'Only two possible values. Capital first letter!', code: C`
              print(type(True))
              print(type(False))
              print(5 > 3)
              print(type(5 > 3))
            ` },
            ]
          },

          { t: 'h', text: 'Why types matter' },
          {
            t: 'cases', title: 'Same symbols, different meanings', items: [
              {
                label: 'Numbers add', code: C`
              print(5 + 3)
              print(2.5 + 1)
            ` },
              {
                label: 'Strings join', code: C`
              print("5" + "3")
              print("ab" + "cd")
            ` },
              {
                label: 'Mixing fails', intro: 'Text and a number cannot be added. Python will not guess what you meant.', expectError: true, code: C`
              print("5" + 3)
            ` },
              {
                label: 'Strings repeat', code: C`
              print("5" * 3)
              print(5 * 3)
            ` },
              {
                label: 'Cannot subtract text', expectError: true, code: C`
              print("10" - "3")
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'A variable does not have a fixed type - its **value** does. `x = 5` makes `x` hold an int. A moment later `x = "five"` makes it hold a string.' },

          { t: 'h', text: 'Changing a value\'s type (casting)' },
          { t: 'p', html: 'Three built-in functions convert between types. This is called **type casting** and it is one of the most useful tools in Paper 2.' },
          {
            t: 'cases', title: 'int(), float(), str() and bool()', items: [
              {
                label: 'str → int', code: C`
              n = int("42")
              print(n + 1)
            ` },
              {
                label: 'str → float', code: C`
              price = float("3.50")
              print(price * 2)
            ` },
              {
                label: 'number → str', code: C`
              score = 90
              print("Score: " + str(score))
            ` },
              {
                label: 'float → int', intro: '`int()` **chops off** the decimal part. It does not round.', code: C`
              print(int(3.99))
              print(int(-3.99))
              print(int(7.0))
            ` },
              {
                label: 'int → float', code: C`
              print(float(5))
            ` },
              {
                label: 'bad conversions', intro: 'The text must really look like the number you ask for.', expectError: true, code: C`
              print(int("4.5"))
            ` },
              {
                label: 'bool()', intro: 'Zero and empty text are `False`; everything else is `True`.', code: C`
              print(bool(0))
              print(bool(5))
              print(bool(""))
              print(bool("False"))
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Typical Paper 2 question: <em>"Identify the most appropriate data type for the value 4.5"</em> → real/float. Learn the table at the top of this lesson using **both** names.' },

          {
            t: 'sort', title: 'Pick the type', prompt: 'Choose the most appropriate data type for each value.', cats: ['int', 'float', 'str', 'bool'], items: [
              { text: 'A student\'s age in whole years', cat: 0 }, { text: 'The price of a pen: 1.25', cat: 1 },
              { text: 'A postcode such as "SW1A 1AA"', cat: 2 }, { text: 'Whether a door is open', cat: 3 },
              { text: 'The phone number "0300 123 4567" (we never calculate with it)', cat: 2 }, { text: 'The height of a tree in metres: 12.7', cat: 1 },
              { text: 'The number of goals in a match', cat: 0 },
            ], why: 'Use int for counting, float for measuring, str for text (including numbers you never calculate with) and bool for yes/no.'
          },
          {
            t: 'predict', title: 'Type check', code: C`
            a = "12"
            b = 12
            print(a + a)
            print(b + b)
            print(int(a) + b)
          `, rows: 3, why: 'Two strings join, two ints add, and `int(a)` turns the text into a number first.'
          },
          { t: 'quiz', q: 'What does <code>print(int(9.99))</code> display?', options: ['10', '9', '9.99', '9.0'], answer: 1, why: '`int()` removes the decimal part (truncates). It never rounds up.' },

          {
            t: 'exercise', id: 'm01-ex-types1', title: 'Make it add up', level: 1,
            prompt: 'The variables <code>a</code> and <code>b</code> hold numbers stored as text. Print their <strong>numeric</strong> sum (it should print <code>57</code>).',
            starter: C`
              a = "25"
              b = "32"
              print(a + b)
            `,
            solution: C`
              a = "25"
              b = "32"
              print(int(a) + int(b))
            `,
            tests: [{ out: '57' }],
            hints: ['Convert each variable with `int()` before adding.']
          },
          {
            t: 'exercise', id: 'm01-ex-types2', title: 'Label the output', level: 2,
            prompt: 'Using <code>str()</code> and <code>+</code> (not commas), print exactly <code>Items: 4</code> using the variable <code>items</code>.',
            starter: C`
              items = 4
              print("Items: " + items)
            `,
            solution: C`
              items = 4
              print("Items: " + str(items))
            `,
            tests: [{ out: 'Items: 4' }],
            requires: [{ re: 'str\\(', msg: 'Use `str()` to convert the number.' }],
            hints: ['`+` can only join two strings, so convert the number first.']
          },
          {
            t: 'exercise', id: 'm01-ex-types3', title: 'Real or whole?', level: 2,
            prompt: 'The variable <code>height</code> holds <code>1.78</code>. Print its type, then print it converted to an integer, on two lines. Expected: <pre>&lt;class \'float\'&gt;\n1</pre>',
            starter: C`
              height = 1.78
            `,
            solution: C`
              height = 1.78
              print(type(height))
              print(int(height))
            `,
            tests: [{ out: "<class 'float'>\n1" }],
            hints: ['`type(height)` returns the type; `print` it.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'arithmetic',
        title: 'Arithmetic and operators',
        time: '35 min',
        book: 'Ch 2 · p.44-46',
        summary: '+ - * / // % **, precedence, shortcuts, round()',
        intro: 'Python is a very capable calculator. Seven operators cover everything; two of them (`//` and `%`) appear in almost every Paper 2 question about digits, time or even/odd.',
        blocks: [
          {
            t: 'table', head: ['Operator', 'Meaning', 'Example', 'Result'], rows: [
              ['`+`', 'add', '`7 + 2`', '`9`'],
              ['`-`', 'subtract', '`7 - 2`', '`5`'],
              ['`*`', 'multiply', '`7 * 2`', '`14`'],
              ['`/`', 'divide (always gives a float)', '`7 / 2`', '`3.5`'],
              ['`//`', 'integer division (Edexcel **DIV**)', '`7 // 2`', '`3`'],
              ['`%`', 'remainder / modulus (Edexcel **MOD**)', '`7 % 2`', '`1`'],
              ['`**`', 'power', '`7 ** 2`', '`49`'],
            ]
          },
          {
            t: 'cases', title: 'Each operator, with edge cases', items: [
              {
                label: '+ - *', code: C`
              print(12 + 5)
              print(12 - 5)
              print(12 * 5)
              print(12 - 20)
              print(2.5 * 4)
            ` },
              {
                label: '/ divide', intro: '`/` always gives a float, even when the answer is whole.', code: C`
              print(10 / 4)
              print(10 / 5)
              print(type(10 / 5))
              print(-7 / 2)
            ` },
              {
                label: '// DIV', intro: 'Integer division: how many **whole** times does it go in? The remainder is thrown away. Note what happens with negatives: it rounds **down**.', code: C`
              print(17 // 5)
              print(10 // 5)
              print(3 // 5)
              print(-7 // 2)
            ` },
              {
                label: '% MOD', intro: 'The remainder after dividing. `n % 2` is 0 for even numbers; `n % 10` is the last digit.', code: C`
              print(17 % 5)
              print(10 % 5)
              print(3 % 5)
              print(1234 % 10)
              print(9 % 2, 8 % 2)
            ` },
              {
                label: '** power', code: C`
              print(2 ** 3)
              print(5 ** 2)
              print(2 ** 10)
              print(9 ** 0.5)
            ` },
              {
                label: 'Divide by zero', expectError: true, intro: 'Never allowed: `/`, `//` and `%` all fail.', code: C`
              print(10 / 0)
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: '`//` and `%` work as a pair: `17 // 5 = 3` and `17 % 5 = 2` because `5 × 3 + 2 = 17`.' },

          { t: 'h', text: 'What are `//` and `%` good for?' },
          {
            t: 'cases', title: 'Real uses', items: [
              {
                label: 'Minutes → hours', code: C`
              total_minutes = 135
              hours = total_minutes // 60
              minutes = total_minutes % 60
              print(hours, "hours", minutes, "minutes")
            ` },
              {
                label: 'Even or odd', code: C`
              number = 7
              print(number % 2)
              number = 10
              print(number % 2)
            ` },
              {
                label: 'Digits of a number', code: C`
              n = 4825
              last_digit = n % 10
              rest = n // 10
              print(last_digit, rest)
            ` },
              {
                label: 'Change from a shop', code: C`
              pence = 187
              pounds = pence // 100
              left = pence % 100
              print(pounds, "pounds and", left, "pence")
            ` },
            ]
          },

          { t: 'h', text: 'Order of operations' },
          { t: 'p', html: 'Python follows the maths rule (BIDMAS). Brackets first, then `**`, then `*` `/` `//` `%` (left to right), then `+` `-`. When in doubt, add brackets - they cost nothing.' },
          {
            t: 'cases', title: 'Precedence', items: [
              {
                label: 'Multiply first', code: C`
              print(2 + 3 * 4)
              print((2 + 3) * 4)
            ` },
              {
                label: 'Power first', code: C`
              print(2 * 3 ** 2)
              print((2 * 3) ** 2)
              print(-3 ** 2)
              print((-3) ** 2)
            ` },
              {
                label: 'Left to right', code: C`
              print(20 - 5 - 3)
              print(100 / 10 * 2)
              print(100 / (10 * 2))
            ` },
              {
                label: 'The classic average bug', intro: 'The average of 4 and 6 is 5. Which line is right?', code: C`
              print(4 + 6 / 2)
              print((4 + 6) / 2)
            ` },
            ]
          },

          { t: 'h', text: 'Shortcut operators' },
          {
            t: 'code', title: 'augmented assignment', code: C`
            score = 10
            score += 5     # same as score = score + 5
            print(score)
            score -= 3
            print(score)
            score *= 2
            print(score)
            score //= 4
            print(score)
            score %= 4
            print(score)
          `, caption: 'Each shortcut means "update the variable using its own value". The same works with `/=` and `**=`.'
          },

          { t: 'h', text: 'Built-in helpers for numbers' },
          {
            t: 'cases', title: 'abs, round, min, max, sum', items: [
              {
                label: 'abs()', code: C`
              print(abs(-8))
              print(abs(8))
              print(abs(-2.5))
            ` },
              {
                label: 'round()', intro: '`round(x)` gives a whole number; `round(x, 2)` keeps 2 decimal places. Careful: .5 rounds to the nearest **even** whole number.', code: C`
              print(round(3.7))
              print(round(3.14159, 2))
              print(round(2.5))
              print(round(3.5))
              print(round(7.0, 1))
            ` },
              {
                label: 'min / max', code: C`
              print(min(4, 9, 2))
              print(max(4, 9, 2))
              print(max(-1, -5))
            ` },
              {
                label: 'Float surprises', intro: 'Computers store decimals in binary, so tiny errors can appear. This is normal - use `round()` when displaying.', code: C`
              print(0.1 + 0.2)
              print(round(0.1 + 0.2, 2))
            ` },
            ]
          },

          {
            t: 'predict', title: 'Operators', code: C`
            print(17 // 4)
            print(17 % 4)
            print(2 + 3 * 2 ** 2)
            print(10 / 4)
          `, rows: 4, why: '17 // 4 = 4 remainder 1; 2 ** 2 = 4 first, then 3 * 4 = 12, then 2 + 12 = 14; `/` gives 2.5.'
          },
          {
            t: 'predict', title: 'Shortcut maths', code: C`
            x = 20
            x -= 8
            x *= 2
            x //= 5
            print(x)
          `, rows: 1, why: '20 - 8 = 12, times 2 = 24, 24 // 5 = 4.'
          },
          { t: 'quiz', q: 'Which expression gives the **last digit** of the whole number <code>n</code>?', options: ['n // 10', 'n % 10', 'n / 10', 'n - 10'], answer: 1, why: '`n % 10` is the remainder after dividing by 10 - exactly the last digit.' },
          { t: 'quiz', q: 'Which of these is **always** a float?', options: ['6 // 2', '6 % 4', '6 / 2', '6 * 2'], answer: 2, why: 'Division with `/` always gives a float, even when it divides exactly.' },

          {
            t: 'exercise', id: 'm01-ex-arith1', title: 'Rectangle', level: 1,
            prompt: 'A rectangle has <code>width = 8</code> and <code>height = 5</code>. Print its area on the first line and its perimeter on the second line.',
            starter: C`
              width = 8
              height = 5
            `,
            solution: C`
              width = 8
              height = 5
              print(width * height)
              print((width + height) * 2)
            `,
            tests: [{ out: '40\n26' }],
            hints: ['Area = width x height.', 'Perimeter needs brackets: `(width + height) * 2`.']
          },
          {
            t: 'exercise', id: 'm01-ex-arith2', title: 'Seconds converter', level: 2,
            prompt: 'The variable <code>seconds</code> is <code>3725</code>. Print the time as <code>1 h 2 min 5 s</code> by working out the hours, minutes and seconds with <code>//</code> and <code>%</code>.',
            starter: C`
              seconds = 3725
            `,
            solution: C`
              seconds = 3725
              hours = seconds // 3600
              minutes = (seconds % 3600) // 60
              secs = seconds % 60
              print(hours, "h", minutes, "min", secs, "s")
            `,
            tests: [{ out: '1 h 2 min 5 s' }, { py: 'assert seconds == 3725', label: 'you did not change seconds' }],
            requires: [{ re: '//', msg: 'Use `//` for whole hours/minutes.' }, { re: '%', msg: 'Use `%` for the remainder.' }],
            hints: ['hours = seconds // 3600', 'What is left after removing the hours? `seconds % 3600`. Divide that by 60 for minutes.']
          },
          {
            t: 'exercise', id: 'm01-ex-arith3', title: 'Sum of two digits', level: 2,
            prompt: 'Ask for a two-digit whole number (for example <code>47</code>) and print the sum of its two digits (<code>11</code>). Do not convert it to text - use <code>//</code> and <code>%</code>.',
            starter: C`
              number = int(input("Two-digit number: "))
            `,
            solution: C`
              number = int(input("Two-digit number: "))
              tens = number // 10
              units = number % 10
              print(tens + units)
            `,
            tests: [{ in: ['47'], out: '11' }, { in: ['90'], out: '9' }, { in: ['10'], out: '1', hidden: true }],
            requires: [{ re: '//', msg: 'Use `//` to find the tens digit.' }, { re: '%', msg: 'Use `%` to find the units digit.' }],
            hints: ['The tens digit is `number // 10`.', 'The units digit is `number % 10`.']
          },
          {
            t: 'exercise', id: 'm01-ex-arith4', kind: 'debug', title: 'The wrong average', level: 2,
            prompt: 'This program should print the <strong>average</strong> of three test marks (<code>78.0</code>). It runs, but prints the wrong value. Fix it with minimal changes.',
            starter: C`
              mark1 = 70
              mark2 = 80
              mark3 = 84
              average = mark1 + mark2 + mark3 / 3
              print(average)
            `,
            solution: C`
              mark1 = 70
              mark2 = 80
              mark3 = 84
              average = (mark1 + mark2 + mark3) / 3
              print(round(average, 1))
            `,
            tests: [{ out: '78.0' }],
            hints: ['Division happens before addition. Brackets fix the order.', 'The exact value is 78.0 - check the output format.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'input-casting',
        title: 'Getting input from the user',
        time: '35 min',
        book: 'Ch 2 · p.47-48',
        summary: 'input(), why it gives text, int()/float() conversions',
        intro: 'Programs become useful when they respond to the person using them. `input()` pauses the program, shows a message, and waits for the user to type something.',
        blocks: [
          { t: 'p', html: 'Run this program. When the console shows a blinking box, type something and press **Enter**.' },
          {
            t: 'code', title: 'input.py', code: C`
            name = input("What is your name? ")
            print("Hello,", name)
          `, caption: 'The text in the brackets is the **prompt**. Whatever the user types is stored in `name`.'
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode: `RECEIVE name FROM (STRING) KEYBOARD`. In Python: `name = input()`. Always add a prompt so the user knows what to type.' },

          { t: 'h', text: 'The big surprise: input() always gives a string' },
          { t: 'p', html: 'Even if the user types `15`, Python receives the **text** `"15"`. If you want to calculate with it, you must convert it.' },
          {
            t: 'cases', title: 'Text vs numbers from input()', items: [
              {
                label: 'Looks right, but isn\'t', intro: 'Type 3 and then 4. The answer is `34`, not `7`.', stdin: ['3', '4'], code: C`
              a = input("First number: ")
              b = input("Second number: ")
              print(a + b)
            ` },
              {
                label: 'Convert with int()', intro: 'Whole numbers: wrap `input()` in `int()`.', stdin: ['3', '4'], code: C`
              a = int(input("First number: "))
              b = int(input("Second number: "))
              print(a + b)
            ` },
              {
                label: 'Convert with float()', intro: 'Numbers with decimals (prices, heights, temperatures).', stdin: ['2.5', '4'], code: C`
              price = float(input("Price: "))
              quantity = int(input("Quantity: "))
              print(price * quantity)
            ` },
              {
                label: 'Two steps', intro: 'You can also convert after reading - useful if you want to keep the original text.', stdin: ['21'], code: C`
              text = input("Your age: ")
              age = int(text)
              print(type(text), type(age))
              print("Next year:", age + 1)
            ` },
              {
                label: 'int() of a decimal', intro: 'Typing `4.5` into an `int(input())` crashes. Run it and type 4.5.', expectError: true, stdin: ['4.5'], code: C`
              n = int(input("Whole number: "))
              print(n)
            ` },
              {
                label: 'Empty input', intro: 'Just pressing Enter gives an empty string, which cannot become a number.', expectError: true, stdin: [''], code: C`
              n = int(input("Number: "))
              print(n)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Typing letters into an `int(input())` crashes the program with a `ValueError`. You will learn to **validate** input so this never happens (module 08). For now, assume the user types sensible values.' },

          { t: 'h', text: 'A complete input → process → output program' },
          {
            t: 'code', title: 'tip calculator', stdin: ['40', '15'], code: C`
            bill = float(input("Bill amount: "))
            percent = float(input("Tip percentage: "))

            tip = bill * percent / 100
            total = bill + tip

            print("Tip:", tip)
            print("Total:", total)
          `, caption: 'Notice the shape: **input** (two questions), **process** (two calculations), **output** (two prints). Every program in the course follows it.'
          },

          {
            t: 'predict', title: 'What gets printed?', code: C`
            a = input("a: ")
            b = input("b: ")
            print(a * 2)
            print(int(b) * 2)
          `, stdin: ['6', '6'], rows: 2, why: 'The text `"6"` repeated twice is `66`; the number 6 doubled is 12.'
          },
          { t: 'quiz', q: 'A user types <code>12</code>. What is the **type** of <code>x</code> after <code>x = input("Number: ")</code>?', options: ['int', 'float', 'str', 'bool'], answer: 2, why: '`input()` always returns a string. Use `int()` or `float()` to convert.' },
          {
            t: 'parsons', title: 'Build the program', prompt: 'Arrange the lines so the program asks for a number and prints double it.', lines: [
              'number = int(input("Enter a number: "))', 'double = number * 2', 'print("Double is", double)'], why: 'Input first, then the calculation, then the output.'
          },

          {
            t: 'exercise', id: 'm01-ex-input1', title: 'Greeter', level: 1,
            prompt: 'Ask the user for their name (<code>input</code>), then print <code>Welcome, </code> followed by the name - e.g. <code>Welcome, Maya</code>.',
            starter: C`
              # ask for a name and greet them
            `,
            solution: C`
              name = input("What is your name? ")
              print("Welcome, " + name)
            `,
            tests: [{ in: ['Maya'], out: 'Welcome, Maya' }, { in: ['Li'], out: 'Welcome, Li' }, { in: ['Sam Jones'], out: 'Welcome, Sam Jones', hidden: true }],
            hints: ['`name = input("...")` stores what they type.', 'Use `+` to join `"Welcome, "` and `name`, or use a comma and remember the extra space is added for you.']
          },
          {
            t: 'exercise', id: 'm01-ex-input2', title: 'Add two numbers', level: 1,
            prompt: 'Ask for two whole numbers and print their sum.',
            starter: C`
              first = input("First: ")
              second = input("Second: ")
              print(first + second)
            `,
            solution: C`
              first = int(input("First: "))
              second = int(input("Second: "))
              print(first + second)
            `,
            tests: [{ in: ['3', '4'], out: '7' }, { in: ['10', '-4'], out: '6' }, { in: ['0', '0'], out: '0', hidden: true }],
            hints: ['The inputs are strings; convert them with `int()`.']
          },
          {
            t: 'exercise', id: 'm01-ex-input3', title: 'Area of a circle', level: 2,
            prompt: 'Ask for a radius (it may have decimals) and print the area using <code>3.14 * radius ** 2</code>. Print only the number.',
            starter: C`
              # radius -> area
            `,
            solution: C`
              radius = float(input("Radius: "))
              area = 3.14 * radius ** 2
              print(area)
            `,
            tests: [{ in: ['2'], out: '12.56' }, { in: ['1'], out: '3.14' }, { in: ['10'], out: '314.0', hidden: true }],
            hints: ['Use `float()` because the radius may have decimals.']
          },
          {
            t: 'exercise', id: 'm01-ex-input4', title: 'Pocket money', level: 2,
            prompt: 'A student gets <strong>weekly</strong> pocket money. Ask for the weekly amount (a whole number of pounds) and print how much they get in a <strong>year</strong> (52 weeks) on one line as <code>Yearly: 260</code>.',
            starter: C`
              # weekly -> yearly
            `,
            solution: C`
              weekly = int(input("Weekly pocket money: "))
              yearly = weekly * 52
              print("Yearly:", yearly)
            `,
            tests: [{ in: ['5'], out: 'Yearly: 260' }, { in: ['12'], out: 'Yearly: 624' }, { in: ['0'], out: 'Yearly: 0', hidden: true }]
          },
          {
            t: 'exercise', id: 'm01-ex-input5', title: 'Clock maths', level: 3,
            prompt: 'Ask for a number of minutes (whole number). Print how many <strong>hours</strong> and <strong>minutes</strong> that is in the form <code>2 hours 15 minutes</code>.',
            starter: C`
              # total minutes -> hours and minutes
            `,
            solution: C`
              total = int(input("Minutes: "))
              hours = total // 60
              minutes = total % 60
              print(hours, "hours", minutes, "minutes")
            `,
            tests: [{ in: ['135'], out: '2 hours 15 minutes' }, { in: ['59'], out: '0 hours 59 minutes' }, { in: ['120'], out: '2 hours 0 minutes', hidden: true }],
            hints: ['Whole hours: `//`. Leftover minutes: `%`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'formatting-output',
        title: 'Formatting output with f-strings',
        time: '25 min',
        book: 'Ch 2 · p.45',
        summary: 'f-strings, decimals, alignment, str.format',
        intro: 'Joining text and numbers with `+` and `str()` gets messy. An **f-string** lets you drop variables straight into a sentence.',
        blocks: [
          {
            t: 'cases', title: 'Four ways to combine text and values', items: [
              {
                label: 'Commas', intro: 'Easy, but adds a space between everything.', code: C`
              name = "Asha"
              score = 87
              print("Player", name, "scored", score)
            ` },
              {
                label: 'Plus and str()', intro: 'Full control of spaces, but you must convert numbers yourself.', code: C`
              name = "Asha"
              score = 87
              print("Player " + name + " scored " + str(score))
            ` },
              {
                label: 'f-string', intro: 'Put `f` before the opening quote, and write variables inside `{ }`. Cleanest.', code: C`
              name = "Asha"
              score = 87
              print(f"Player {name} scored {score}")
            ` },
              {
                label: 'Expressions inside {}', intro: 'Anything Python can calculate can go in the braces.', code: C`
              price = 4.5
              qty = 3
              print(f"{qty} items cost {price * qty}")
              print(f"Half of 9 is {9 / 2}")
              print(f"Next year you will be {int('14') + 1}")
            ` },
              {
                label: 'Forgot the f', intro: 'Without the `f` the braces are printed literally.', code: C`
              name = "Asha"
              print("Hello {name}")
              print(f"Hello {name}")
            ` },
            ]
          },

          { t: 'h', text: 'Controlling decimal places' },
          { t: 'p', html: 'After the value, add a colon and a **format code**. `.2f` means "a float with 2 digits after the point". This is exactly what you need for money.' },
          {
            t: 'cases', title: 'Format codes', items: [
              {
                label: '.2f money', code: C`
              price = 4.5
              print(f"Price: {price}")
              print(f"Price: {price:.2f}")
              print(f"Total: £{price * 3:.2f}")
            ` },
              {
                label: 'Other precisions', code: C`
              pi = 3.14159265
              print(f"{pi:.0f}")
              print(f"{pi:.1f}")
              print(f"{pi:.3f}")
            ` },
              {
                label: 'Percent', code: C`
              ratio = 0.375
              print(f"{ratio:.1%}")
              print(f"{ratio * 100:.0f} percent")
            ` },
              {
                label: 'Thousands', code: C`
              big = 1234567
              print(f"{big:,}")
            ` },
              {
                label: 'round() vs format', intro: '`round()` changes the number; `:.2f` only changes how it is shown (and keeps trailing zeros).', code: C`
              x = 2.5
              print(round(x, 2))
              print(f"{x:.2f}")
            ` },
            ]
          },

          { t: 'h', text: 'Tidy columns' },
          {
            t: 'cases', title: 'Width and alignment', items: [
              {
                label: 'Width', intro: '`:10` makes the field 10 characters wide. Text aligns left, numbers right.', code: C`
              print(f"{'Item':10}{'Price':>8}")
              print(f"{'Pen':10}{2.5:8.2f}")
              print(f"{'Notebook':10}{12.0:8.2f}")
            ` },
              {
                label: 'Alignment', code: C`
              print(f"[{'left':<10}]")
              print(f"[{'right':>10}]")
              print(f"[{'mid':^10}]")
            ` },
              {
                label: 'Leading zeros', code: C`
              hour, minute = 7, 5
              print(f"{hour:02}:{minute:02}")
            ` },
              {
                label: 'Older style', intro: '`.format()` does the same job; you may see it in textbooks.', code: C`
              print("Hello {}, you are {}".format("Sam", 15))
              print("{:.2f}".format(3.14159))
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'For Paper 2 you do not *have* to use f-strings. Commas or `+` with `str()` always earn the marks. Use whichever you can write correctly under pressure.' },

          {
            t: 'predict', title: 'f-string output', code: C`
            item = "cake"
            n = 3
            cost = 2.5
            print(f"{n} x {item} = £{n * cost:.2f}")
          `, rows: 1, why: '3 × 2.5 = 7.5, shown with two decimals as 7.50.'
          },
          { t: 'quiz', q: 'Which prints <code>Total: 4.50</code> when <code>total = 4.5</code>?', options: ['print(f"Total: {total}")', 'print(f"Total: {total:.2f}")', 'print("Total: {total:.2f}")', 'print(f"Total: {total:2}")'], answer: 1, why: 'The `.2f` format code gives exactly two decimal places. Option 3 forgot the `f` prefix.' },

          {
            t: 'exercise', id: 'm01-ex-fmt1', title: 'Receipt line', level: 1,
            prompt: 'Using an f-string, print <code>Coffee costs £2.50</code> using the variables <code>drink</code> and <code>price</code> (two decimals).',
            starter: C`
              drink = "Coffee"
              price = 2.5
            `,
            solution: C`
              drink = "Coffee"
              price = 2.5
              print(f"{drink} costs £{price:.2f}")
            `,
            tests: [{ out: 'Coffee costs £2.50' }],
            hints: ['Start the string with `f` and use `{price:.2f}`.']
          },
          {
            t: 'exercise', id: 'm01-ex-fmt2', title: 'Shop total', level: 2,
            prompt: 'Ask for the price of one item (float) and how many are bought (int). Print <code>Total: £x.xx</code> with exactly 2 decimal places.',
            starter: C`
              # price and quantity -> total
            `,
            solution: C`
              price = float(input("Price: "))
              quantity = int(input("Quantity: "))
              total = price * quantity
              print(f"Total: £{total:.2f}")
            `,
            tests: [{ in: ['1.5', '4'], out: 'Total: £6.00' }, { in: ['0.99', '3'], out: 'Total: £2.97' }, { in: ['10', '1'], out: 'Total: £10.00', hidden: true }],
            hints: ['Convert the price with `float()` and the quantity with `int()`.', 'Use `{total:.2f}` inside an f-string.']
          },
          {
            t: 'exercise', id: 'm01-ex-fmt3', title: 'Temperature converter', level: 2,
            prompt: 'Ask for a temperature in Celsius (float). Print the Fahrenheit value to <strong>1 decimal place</strong> as <code>36.6 C = 97.9 F</code>. Formula: <code>F = C * 9 / 5 + 32</code>.',
            starter: C`
              # celsius -> fahrenheit
            `,
            solution: C`
              c = float(input("Celsius: "))
              f = c * 9 / 5 + 32
              print(f"{c} C = {f:.1f} F")
            `,
            tests: [{ in: ['36.6'], out: '36.6 C = 97.9 F' }, { in: ['0'], out: '0.0 C = 32.0 F' }, { in: ['100'], out: '100.0 C = 212.0 F', hidden: true }],
            hints: ['Print the Celsius value as typed after converting with `float()` - it displays `36.6` or `0.0`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'random-math',
        title: 'Random numbers and the math module',
        time: '25 min',
        book: 'Ch 2 · p.49',
        summary: 'import, random.randint, choice, math.sqrt, pi, floor',
        intro: 'Python comes with extra toolboxes called **modules**. You bring one in with `import`. Two of them appear everywhere: `random` for games of chance and `math` for extra maths.',
        blocks: [
          { t: 'h', text: 'import and the random module' },
          { t: 'p', html: 'Random numbers drive dice, coin flips, card games and quizzes. Because they are random, your output will differ each time you press Run.' },
          {
            t: 'cases', title: 'The random toolbox', items: [
              {
                label: 'randint', intro: '`random.randint(a, b)` gives a random **whole** number from a to b, **including both ends**.', code: C`
              import random

              dice = random.randint(1, 6)
              print("You rolled", dice)
            ` },
              {
                label: 'Roll many times', intro: 'Run it several times. Can you ever get a 0 or a 7? (The `for` loop repeats the line 8 times - you will learn it soon.)', code: C`
              import random

              for roll in range(8):
                  print(random.randint(1, 6), end=" ")
            ` },
              {
                label: 'choice', intro: '`random.choice(list)` picks one item from a list.', code: C`
              import random

              colours = ["red", "green", "blue"]
              print(random.choice(colours))
              print(random.choice("abcdef"))
            ` },
              {
                label: 'random()', intro: '`random.random()` gives a float from 0 up to (but not including) 1.', code: C`
              import random

              r = random.random()
              print(r)
              print(r * 100)
            ` },
              {
                label: 'randrange', intro: '`randrange` works like `range`: the end value is **excluded**.', code: C`
              import random

              print(random.randrange(10))          # 0 to 9
              print(random.randrange(5, 10))       # 5 to 9
              print(random.randrange(0, 100, 10))  # 0, 10, 20 ... 90
            ` },
              {
                label: 'shuffle', code: C`
              import random

              cards = ["A", "K", "Q", "J"]
              random.shuffle(cards)
              print(cards)
            ` },
              {
                label: 'Forgot import', expectError: true, code: C`
              dice = random.randint(1, 6)
              print(dice)
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'In Paper 2 code, the line `import random` must come **before** you use `random.` anything. Put all imports at the very top of the program.' },
          { t: 'note', kind: 'tip', html: 'Testing random programs: when you debug, add `random.seed(1)` after the import. The "random" numbers will then be the same every run, so you can follow what happens. Remove it afterwards.' },
          {
            t: 'code', title: 'seed demo', code: C`
            import random

            random.seed(42)
            print(random.randint(1, 100), random.randint(1, 100), random.randint(1, 100))
            random.seed(42)
            print(random.randint(1, 100), random.randint(1, 100), random.randint(1, 100))
          `, caption: 'The same seed gives the same sequence. That is why computer "random" numbers are really **pseudo-random**.'
          },

          { t: 'h', text: 'The math module' },
          {
            t: 'cases', title: 'Useful maths tools', items: [
              {
                label: 'sqrt and pi', code: C`
              import math

              print(math.sqrt(49))
              print(math.sqrt(2))
              print(math.pi)
              radius = 3
              print(math.pi * radius ** 2)
            ` },
              {
                label: 'floor and ceil', intro: '`floor` rounds down, `ceil` rounds up - always to a whole number.', code: C`
              import math

              print(math.floor(4.9))
              print(math.ceil(4.1))
              print(math.floor(-4.1))
              print(math.ceil(7))
            ` },
              {
                label: 'pow, factorial, gcd', code: C`
              import math

              print(math.pow(2, 5))
              print(math.factorial(5))
              print(math.gcd(12, 18))
            ` },
              {
                label: 'import styles', intro: 'Three ways to write the same thing. This course uses the first.', code: C`
              import math
              print(math.sqrt(16))

              from math import sqrt
              print(sqrt(16))

              import math as m
              print(m.sqrt(16))
            ` },
              {
                label: 'sqrt of a negative', expectError: true, code: C`
              import math
              print(math.sqrt(-4))
            ` },
            ]
          },

          {
            t: 'predict', title: 'Range check', code: C`
            import random
            random.seed(7)
            n = random.randint(1, 3)
            print(n >= 1 and n <= 3)
          `, rows: 1, why: '`randint(1, 3)` can only give 1, 2 or 3, so the test is always `True`.'
          },
          { t: 'quiz', q: 'Which call can produce <b>both</b> 1 and 10?', options: ['random.randint(1, 10)', 'random.randrange(1, 10)', 'random.random() * 10', 'random.randint(1, 9)'], answer: 0, why: '`randint` includes both end values. `randrange(1, 10)` stops at 9.' },

          {
            t: 'exercise', id: 'm01-ex-rand1', title: 'Roll a die', level: 1,
            prompt: 'Write a function-free program that sets <code>dice</code> to a random whole number from 1 to 6 (inclusive) and prints it.',
            starter: C`
              # import random, then pick dice
            `,
            solution: C`
              import random

              dice = random.randint(1, 6)
              print(dice)
            `,
            tests: [{ seed: 1, py: 'assert 1 <= dice <= 6', label: 'dice is between 1 and 6' }, { seed: 99, py: 'assert 1 <= dice <= 6 and isinstance(dice, int)', label: 'dice is a whole number (another run)' }, { seed: 5, lines: 1, label: 'prints one line' }],
            requires: [{ re: 'import random', msg: 'Start with `import random`.' }, { re: 'randint', msg: 'Use `random.randint`.' }],
            hints: ['`random.randint(1, 6)`.']
          },
          {
            t: 'exercise', id: 'm01-ex-rand2', title: 'Hypotenuse', level: 2,
            prompt: 'Ask for the two shorter sides of a right-angled triangle (floats) and print the hypotenuse rounded to 2 decimal places. Use <code>math.sqrt</code>.',
            starter: C`
              import math
              # read a and b, print hypotenuse
            `,
            solution: C`
              import math

              a = float(input("Side a: "))
              b = float(input("Side b: "))
              print(round(math.sqrt(a ** 2 + b ** 2), 2))
            `,
            tests: [{ in: ['3', '4'], out: '5.0' }, { in: ['1', '1'], out: '1.41' }, { in: ['5', '12'], out: '13.0', hidden: true }],
            requires: [{ re: 'sqrt', msg: 'Use `math.sqrt`.' }],
            hints: ['hypotenuse = sqrt(a squared plus b squared).']
          },
          {
            t: 'exercise', id: 'm01-ex-rand3', title: 'Coin flip', level: 2,
            prompt: 'Use <code>random.choice</code> to print either <code>Heads</code> or <code>Tails</code>.',
            starter: C`
              import random
            `,
            solution: C`
              import random

              print(random.choice(["Heads", "Tails"]))
            `,
            tests: [{ seed: 1, anyOf: ['Heads', 'Tails'], label: 'Prints Heads or Tails (run 1)' }, { seed: 2, anyOf: ['Heads', 'Tails'], label: 'Prints Heads or Tails (run 2)' }, { seed: 3, anyOf: ['Heads', 'Tails'], label: 'Prints Heads or Tails (run 3)' }],
            requires: [{ re: 'choice', msg: 'Use `random.choice`.' }],
            hints: ['Give `choice` a list: `["Heads", "Tails"]`.']
          },
        ],
      },
    ],
  });
})();

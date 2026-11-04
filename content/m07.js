(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm07',
    title: 'Subprograms',
    blurb: 'Procedures, functions, parameters, return values, scope and menu-driven programs.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'functions-intro',
        title: 'Your first subprograms',
        time: '30 min',
        book: 'Ch 2 · p.82',
        summary: 'Why subprograms, def, calling, indentation',
        intro: 'A subprogram is a named block of code that you write once and run whenever you need it. You have already used some: `print()` and `len()` are subprograms somebody else wrote.',
        blocks: [
          { t: 'h', text: 'The problem: copy and paste' },
          { t: 'p', html: 'Imagine a game that shows the same title banner at the start, after each level and at the end. Without subprograms you would copy the same three lines three times.' },
          {
            t: 'cases', title: 'Repeating yourself vs a subprogram', items: [
              {
                label: 'Copy and paste', intro: 'This works, but if you want to change the banner you must edit it in three places.', code: C`
              print("=====")
              print("QUIZ")
              print("=====")
              print("Level 1 ...")
              print("=====")
              print("QUIZ")
              print("=====")
              print("Level 2 ...")
            ` },
              {
                label: 'With a subprogram', intro: 'The banner is written once, inside `def show_banner():`. Each call runs it again.', code: C`
              def show_banner():
                  print("=====")
                  print("QUIZ")
                  print("=====")

              show_banner()
              print("Level 1 ...")
              show_banner()
              print("Level 2 ...")
            ` },
            ]
          },
          {
            t: 'table', head: ['Benefit', 'What it means'], rows: [
              ['**Reuse**', 'Write once, use many times'],
              ['**Readability**', 'A name like `show_banner()` explains what the line does'],
              ['**Easier testing**', 'Test one small piece on its own before joining it to the rest'],
              ['**Easier changes**', 'Fix or improve it in one place and every call benefits'],
            ]
          },

          { t: 'h', text: 'Defining and calling' },
          { t: 'p', html: 'There are two separate steps. **Defining** a subprogram with `def` only stores the instructions. **Calling** it (writing its name with brackets) actually runs them. Press **Trace** and watch Python jump into the subprogram and back out again.' },
          {
            t: 'code', title: 'define then call', code: C`
            def say_hello():
                print("Hello!")
                print("Welcome to Python Path")

            print("Before")
            say_hello()
            print("After")
          `, caption: 'Python reads the `def` block first but does not run it. The call on line 6 is what runs it.'
          },
          {
            t: 'list', items: [
              '`def` is the keyword that starts a definition.',
              'The name follows the same rules as a variable name: letters, digits, underscores, no spaces.',
              'The brackets `()` are always needed, even when empty.',
              'The colon `:` ends the first line.',
              'Every line in the body is **indented** (4 spaces). The first unindented line ends the subprogram.',
            ]
          },

          {
            t: 'cases', title: 'All the ways it can go (right and wrong)', items: [
              {
                label: 'Called many times', intro: 'One definition, as many calls as you like.', code: C`
              def line():
                  print("-" * 15)

              line()
              print("Menu")
              line()
              line()
            ` },
              {
                label: 'Never called', intro: 'Defining does nothing visible. This program prints nothing at all.', code: C`
              def say_hello():
                  print("You will never see this")

              print("The program ends here")
            ` },
              {
                label: 'Call before define', expectError: true, intro: 'Python reads top to bottom. At the moment of the call it has not met the definition yet.', code: C`
              say_hello()

              def say_hello():
                  print("Hello")
            ` },
              {
                label: 'Forgot the brackets', intro: 'Without `()` you are only naming the subprogram, not running it. Nothing happens, and Python does not complain. This is a silent mistake.', code: C`
              def say_hello():
                  print("Hello")

              say_hello
              print("Nothing was printed above")
            ` },
              {
                label: 'Missing indentation', expectError: true, code: C`
              def say_hello():
              print("Hello")

              say_hello()
            ` },
              {
                label: 'Missing colon', expectError: true, code: C`
              def say_hello()
                  print("Hello")

              say_hello()
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Define a subprogram **above** the place you first call it. Put all your `def` blocks at the top, then the main program underneath.' },

          { t: 'h', text: 'Parameters: giving a subprogram information' },
          { t: 'p', html: 'A **parameter** is a variable in the brackets of the definition. It receives a value each time the subprogram is called. The value you actually send is called the **argument**.' },
          {
            t: 'cases', title: 'Parameters', items: [
              {
                label: 'One parameter', code: C`
              def greet(name):
                  print("Hello,", name)

              greet("Asha")
              greet("Ben")
            ` },
              {
                label: 'Two parameters', intro: 'Arguments are matched to parameters **in order**.', code: C`
              def show_score(player, score):
                  print(player, "scored", score)

              show_score("Chloe", 42)
              show_score("Dev", 17)
            ` },
              {
                label: 'Variables as arguments', intro: 'The argument can be a variable or a calculation. Python works out the value first.', code: C`
              def stars(n):
                  print("*" * n)

              size = 4
              stars(size)
              stars(size + 3)
            ` },
              {
                label: 'Wrong number', expectError: true, intro: 'Two parameters need two arguments.', code: C`
              def show_score(player, score):
                  print(player, "scored", score)

              show_score("Chloe")
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'In the exam, **parameter** = the name in the definition, **argument** = the value in the call. Edexcel pseudocode writes a procedure as <code>PROCEDURE greet(name)</code> … <code>END PROCEDURE</code>, and the call is just <code>greet("Asha")</code>.' },

          { t: 'viz', kind: 'memory', preset: 'Function call', title: 'What happens inside a function call' },

          {
            t: 'predict', title: 'What order do things happen?', code: C`
            def show(x):
                print("x is", x)

            print("start")
            show(5)
            show(2 + 1)
            print("end")
          `, rows: 4, why: 'The definition prints nothing. Output follows the order of the calls: start, then two calls, then end.'
          },
          { t: 'quiz', q: 'What does the line <code>def draw_line(length):</code> do?', options: ['Runs draw_line and prints a line', 'Stores a subprogram called draw_line that has one parameter, without running it', 'Creates a variable called length equal to draw_line', 'Calls draw_line with the argument length'], answer: 1, why: '`def` only defines. Nothing runs until a call such as `draw_line(10)` appears.' },
          {
            t: 'parsons', title: 'Build the subprogram', prompt: 'Put these lines in order to define `thanks()`, then call it once.', lines: [
              'def thanks():', '    print("Thank you for playing")', 'thanks()'], why: 'Header with colon, indented body, then an unindented call.'
          },

          {
            t: 'exercise', id: 'm07-ex-banner', title: 'A banner subprogram', level: 1,
            prompt: 'Define a subprogram called <code>banner()</code> that prints the two lines <code>*****</code> and <code>WELCOME</code>. Then call it twice so the output shows the pair of lines twice.',
            starter: C`
              # define banner() here

              # call it twice
            `,
            solution: C`
              def banner():
                  print("*****")
                  print("WELCOME")

              banner()
              banner()
            `,
            tests: [{ out: '*****\nWELCOME\n*****\nWELCOME' }],
            requires: [{ re: 'def\\s+banner\\s*\\(\\s*\\)\\s*:', msg: 'Define `banner()` with `def`.' }, { re: 'banner\\(\\)[\\s\\S]*banner\\(\\)', msg: 'Call `banner()` twice.' }],
            hints: ['The header is `def banner():` and the two print lines are indented underneath.', 'The calls are unindented lines that say `banner()`.']
          },
          {
            t: 'exercise', id: 'm07-ex-stars', title: 'Rows of stars', level: 1,
            prompt: 'Write a subprogram <code>stars(n)</code> that prints <code>n</code> asterisks on one line. The program should ask the user for a number, then call <code>stars</code> with it.',
            starter: C`
              # define stars(n)

              size = int(input("How many stars? "))
              # call stars
            `,
            solution: C`
              def stars(n):
                  print("*" * n)

              size = int(input("How many stars? "))
              stars(size)
            `,
            tests: [{ in: ['3'], out: '***' }, { in: ['1'], out: '*' }, { in: ['8'], out: '********', hidden: true }],
            requires: [{ re: 'def\\s+stars\\s*\\(\\s*n\\s*\\)', msg: 'Define `stars` with a parameter called `n`.' }],
            hints: ['`"*" * n` repeats the star n times.', 'Do the printing inside the subprogram, not outside it.']
          },
          {
            t: 'exercise', id: 'm07-ex-greetings', title: 'Greet the team', level: 2,
            prompt: 'Write a subprogram <code>greet(name, team)</code> that prints <code>Welcome NAME to the TEAM team</code> (for example <code>Welcome Asha to the Red team</code>). The program must ask for a name and a team three times, using a loop, and call <code>greet</code> each time.',
            starter: C`
              # define greet(name, team)

              for i in range(3):
                  # ask for name and team, then call greet
                  pass
            `,
            solution: C`
              def greet(name, team):
                  print("Welcome", name, "to the", team, "team")

              for i in range(3):
                  n = input("Name: ")
                  t = input("Team: ")
                  greet(n, t)
            `,
            tests: [
              { in: ['Asha', 'Red', 'Ben', 'Blue', 'Cy', 'Green'], out: 'Welcome Asha to the Red team\nWelcome Ben to the Blue team\nWelcome Cy to the Green team' },
              { in: ['A', 'x', 'B', 'y', 'C', 'z'], out: 'Welcome A to the x team\nWelcome B to the y team\nWelcome C to the z team', hidden: true },
            ],
            requires: [{ re: 'def\\s+greet\\s*\\(\\s*name\\s*,\\s*team\\s*\\)', msg: 'Define `greet(name, team)`.' }],
            hints: ['Inside the loop use two `input()` calls and store each answer.', 'Pass the answers in the same order as the parameters: name first, team second.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'parameters-return',
        title: 'Parameters and return values',
        time: '35 min',
        book: 'Ch 2 · p.82-84',
        summary: 'return, print vs return, multiple parameters, defaults, tuples',
        intro: 'A subprogram can also hand an answer back to the code that called it. That answer is the **return value**, and it is the most important idea in this module.',
        blocks: [
          { t: 'h', text: 'return gives a value back' },
          { t: 'p', html: 'A **function** is a subprogram that returns a value. The call itself becomes that value, so you can store it, print it or use it in a calculation.' },
          {
            t: 'code', title: 'double.py', code: C`
            def double(n):
                return n * 2

            answer = double(7)
            print(answer)
            print(double(10) + 1)
          `, caption: 'Trace it. When `return` runs, Python leaves the function and puts the value where the call was.'
          },
          {
            t: 'cases', title: 'Where can a call go?', items: [
              {
                label: 'Store it', code: C`
              def square(n):
                  return n * n

              result = square(6)
              print(result)
            ` },
              {
                label: 'Print it', code: C`
              def square(n):
                  return n * n

              print(square(6))
              print("Square of 9 is", square(9))
            ` },
              {
                label: 'Use in a calculation', code: C`
              def square(n):
                  return n * n

              print(square(3) + square(4))
            ` },
              {
                label: 'As an argument', intro: 'A call can be inside another call.', code: C`
              def square(n):
                  return n * n

              print(square(square(2)))
            ` },
              {
                label: 'In a condition', code: C`
              def square(n):
                  return n * n

              if square(5) > 20:
                  print("Big")
              else:
                  print("Small")
            ` },
            ]
          },

          { t: 'h', text: 'return ends the function' },
          { t: 'p', html: 'The moment `return` runs, the function stops. Lines after it in the same path never run. This is useful: you can return early.' },
          {
            t: 'cases', title: 'return and early exit', items: [
              {
                label: 'Code after return', intro: 'The second line is never reached.', code: C`
              def test():
                  return 1
                  print("never printed")

              print(test())
            ` },
              {
                label: 'Early return', intro: 'Different paths return different answers. Only one `return` runs per call.', code: C`
              def sign(n):
                  if n > 0:
                      return "positive"
                  if n < 0:
                      return "negative"
                  return "zero"

              print(sign(5))
              print(sign(-2))
              print(sign(0))
            ` },
              {
                label: 'No return at all', intro: 'A function that never reaches `return` hands back the special value `None`.', code: C`
              def broken(n):
                  answer = n * 2

              x = broken(4)
              print(x)
            ` },
              {
                label: 'None in a calculation', expectError: true, intro: 'Because `x` is `None`, using it in a sum crashes.', code: C`
              def broken(n):
                  answer = n * 2

              print(broken(4) + 1)
            ` },
            ]
          },

          { t: 'h', text: 'The classic mistake: print instead of return' },
          { t: 'p', html: 'Both versions below *show* 10 when you call them with a plain `double(5)`. Only one of them can be used in a calculation. Run both.' },
          {
            t: 'cases', title: 'print vs return', items: [
              {
                label: 'Uses print', intro: 'This is a **procedure**. It shows the answer but does not hand it back.', code: C`
              def double(n):
                  print(n * 2)

              double(5)
              total = double(5)
              print("total is", total)
            ` },
              {
                label: 'Uses return', intro: 'This is a **function**. The caller decides what to do with the value.', code: C`
              def double(n):
                  return n * 2

              double(5)
              total = double(5)
              print("total is", total)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: '`return` does **not** show anything on the screen. `double(5)` on a line by itself throws the answer away. To see it you must `print(double(5))` or store it.' },
          { t: 'note', kind: 'key', html: '**print** = show something to the person. **return** = give something to the rest of the program.' },

          { t: 'h', text: 'More than one parameter, and keywords' },
          {
            t: 'cases', title: 'Multiple, keyword and default parameters', items: [
              {
                label: 'Two parameters', code: C`
              def rectangle_area(width, height):
                  return width * height

              print(rectangle_area(4, 5))
            ` },
              {
                label: 'Order matters', intro: 'The first argument goes to the first parameter. Swapping them changes the result here.', code: C`
              def subtract(a, b):
                  return a - b

              print(subtract(10, 3))
              print(subtract(3, 10))
            ` },
              {
                label: 'Keyword arguments', intro: 'You can name the parameters in the call. Then the order does not matter.', code: C`
              def subtract(a, b):
                  return a - b

              print(subtract(b=3, a=10))
            ` },
              {
                label: 'Default value', intro: 'A parameter with `=` has a default. If the call leaves it out, the default is used.', code: C`
              def add_vat(price, rate=20):
                  return price + price * rate / 100

              print(add_vat(50))
              print(add_vat(50, 5))
            ` },
              {
                label: 'Defaults go last', expectError: true, intro: 'A parameter without a default cannot come after one that has a default.', code: C`
              def add_vat(rate=20, price):
                  return price + price * rate / 100
            ` },
              {
                label: 'Too few arguments', expectError: true, code: C`
              def rectangle_area(width, height):
                  return width * height

              print(rectangle_area(4))
            ` },
            ]
          },

          { t: 'h', text: 'Returning two values' },
          { t: 'p', html: 'A function can return several values separated by commas. Python packs them into a **tuple**. On the calling side, list that many variables to unpack them.' },
          {
            t: 'cases', title: 'Returning more than one value', items: [
              {
                label: 'Unpack into variables', code: C`
              def min_and_max(a, b):
                  if a < b:
                      return a, b
                  return b, a

              low, high = min_and_max(9, 4)
              print("low:", low, "high:", high)
            ` },
              {
                label: 'Keep as one tuple', code: C`
              def min_and_max(a, b):
                  if a < b:
                      return a, b
                  return b, a

              both = min_and_max(9, 4)
              print(both)
              print(both[0])
            ` },
              {
                label: 'Wrong count', expectError: true, code: C`
              def min_and_max(a, b):
                  return a, b

              x, y, z = min_and_max(1, 2)
            ` },
            ]
          },

          { t: 'h', text: 'Built-in and user-defined' },
          {
            t: 'table', head: ['Built-in (already exists)', 'User-defined (you write it)'], rows: [
              ['`print()`, `input()`, `len()`, `int()`, `range()`', '`double()`, `greet()`, `is_prime()`'],
              ['`abs()`, `round()`, `max()`, `min()`, `sum()`', 'Created with `def`'],
              ['Part of Python', 'Part of your program'],
            ]
          },
          {
            t: 'cases', title: 'Built-in functions return values too', items: [
              {
                label: 'abs, round, max, min', code: C`
              print(abs(-7))
              print(round(3.14159, 2))
              print(max(4, 9, 2))
              print(min(4, 9, 2))
            ` },
              {
                label: 'len and sum', code: C`
              marks = [5, 8, 6]
              print(len(marks))
              print(sum(marks))
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode: <code>FUNCTION double(n)</code> … <code>RETURN n * 2</code> … <code>END FUNCTION</code>. A question may ask you to state the difference between a procedure and a function, or the difference between a parameter and an argument. Mention that a function **returns a value**.' },

          {
            t: 'predict', title: 'Trace the values', code: C`
            def f(a, b):
                return a * 2 + b

            print(f(3, 1))
            print(f(1, 3))
            x = f(2, 2)
            print(x + 1)
          `, rows: 3, why: 'f(3,1) = 6+1 = 7; f(1,3) = 2+3 = 5; f(2,2) = 6 then 6+1 = 7.'
          },
          {
            t: 'predict', title: 'Return vs print', code: C`
            def a(n):
                print(n + 1)

            def b(n):
                return n + 1

            a(1)
            b(1)
            print(b(1))
            y = a(1)
            print(y)
          `, rows: 5, why: '`a(1)` prints 2. `b(1)` returns 2 but nothing shows. `print(b(1))` shows 2. Then `a(1)` prints 2 again and returns `None`, which is printed.'
          },
          { t: 'quiz', q: 'A function should work out the total cost so that the program can then add a tip. Which version is correct?', options: ['def cost(p, q): print(p * q)', 'def cost(p, q): return p * q', 'def cost(p, q): p * q', 'def cost(): return p * q'], answer: 1, why: 'Only `return` hands the value back for the next calculation. The third has no return, and the fourth has no parameters.' },
          { t: 'quiz', q: 'Which statements are true about <code>return</code>? (tick all that apply)', options: ['It stops the function immediately', 'It prints the value on the screen', 'The caller can store the value in a variable', 'A function can have several return lines on different paths'], answer: [0, 2, 3], why: 'Return does not print anything; the caller has to print it if needed.' },

          {
            t: 'exercise', id: 'm07-ex-double', title: 'Write a function', level: 1,
            prompt: 'Write a function <code>triple(n)</code> that <strong>returns</strong> three times <code>n</code>. Do not print inside it.',
            starter: C`
              def triple(n):
                  # fill this in
                  pass
            `,
            solution: C`
              def triple(n):
                  return n * 3
            `,
            tests: [
              { py: 'assert triple(4) == 12, "triple(4) should return 12"', label: 'triple(4) returns 12' },
              { py: 'assert triple(0) == 0, "triple(0) should return 0"', label: 'triple(0) returns 0' },
              { py: 'assert triple(-2) == -6, "triple(-2) should return -6"', label: 'triple(-2) returns -6', hidden: true },
              { out: '' },
            ],
            hints: ['Use the keyword `return`.', '`return n * 3`']
          },
          {
            t: 'exercise', id: 'm07-ex-rectangle', title: 'Area and perimeter', level: 2,
            prompt: 'Write a function <code>rect_info(width, height)</code> that returns <strong>two</strong> values: the area first, then the perimeter.',
            starter: C`
              def rect_info(width, height):
                  # return area, perimeter
                  pass
            `,
            solution: C`
              def rect_info(width, height):
                  return width * height, 2 * (width + height)
            `,
            tests: [
              { py: 'assert rect_info(3, 4) == (12, 14), "rect_info(3, 4) should return (12, 14)"', label: 'rect_info(3,4) = (12, 14)' },
              { py: 'a, p = rect_info(5, 5)\nassert a == 25 and p == 20', label: 'unpacks into a and p' },
              { py: 'assert rect_info(1, 10) == (10, 22)', hidden: true, label: 'hidden check' },
            ],
            hints: ['Separate two values with a comma after `return`.', 'Perimeter is `2 * (width + height)`.']
          },
          {
            t: 'exercise', id: 'm07-ex-debug-return', kind: 'debug', title: 'Three errors in a function', level: 2,
            prompt: 'The function should return the price after a percentage discount, and the program should print it. For example <code>sale_price(80, 25)</code> should be <code>60.0</code>. There are <strong>three</strong> errors. Find and fix them.',
            starter: C`
              def sale_price(price, percent)
                  discount = price * percent / 100
                  print(price - discount)

              cost = sale_price(80, 25)
              print("Sale price:", cost)
            `,
            solution: C`
              def sale_price(price, percent):
                  discount = price * percent / 100
                  return price - discount

              cost = sale_price(80, 25)
              print("Sale price:", cost)
            `,
            tests: [{ out: 'Sale price: 60.0' }, { py: 'assert sale_price(200, 10) == 180', label: 'sale_price(200, 10) returns 180' }],
            hints: ['Line 1 is missing something at the end.', 'The function prints instead of returning: what is `cost` set to?', 'Replace the `print(...)` with `return ...`.']
          },
          {
            t: 'exercise', id: 'm07-ex-delivery', title: 'Delivery cost', level: 3, kind: 'exam',
            prompt: 'A shop charges a delivery fee per item. Write a function <code>delivery_cost(items, fee=2)</code> that returns <code>items * fee</code>. Orders of 10 or more items have free delivery (return 0). The main program must ask for the number of items, call the function, and print <code>Delivery: £</code> followed by the cost (for example <code>Delivery: £6</code>).',
            starter: C`
              def delivery_cost(items, fee=2):
                  pass

              n = int(input("Number of items: "))
            `,
            solution: C`
              def delivery_cost(items, fee=2):
                  if items >= 10:
                      return 0
                  return items * fee

              n = int(input("Number of items: "))
              print("Delivery: £" + str(delivery_cost(n)))
            `,
            tests: [{ in: ['3'], out: 'Delivery: £6' }, { in: ['10'], out: 'Delivery: £0' }, { in: ['9'], out: 'Delivery: £18', hidden: true }, { in: ['1'], py: 'assert delivery_cost(4, 3) == 12', label: 'fee argument is used' }],
            hints: ['Check the free delivery condition first and `return 0`.', 'Join the pound sign and the number with `str()`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'procedures-functions',
        title: 'Procedures, functions and helper subprograms',
        time: '35 min',
        book: 'Ch 2 · p.82-86',
        summary: 'Procedure vs function, boolean helpers, dice(), calling one from another',
        intro: 'Real programs are built from many small subprograms that each do one job. This lesson shows the common patterns you will meet in Paper 2: yes/no helpers, a dice roller and prime-number checkers.',
        blocks: [
          { t: 'h', text: 'Procedure or function?' },
          {
            t: 'table', head: ['', 'Procedure', 'Function'], rows: [
              ['Returns a value?', 'No', 'Yes, with `return`'],
              ['Typical job', 'Display something, change a list', 'Calculate or decide something'],
              ['Called as', '`show_menu()` on its own line', '`x = area(3, 4)` or `print(area(3, 4))`'],
              ['Edexcel pseudocode', '`PROCEDURE … END PROCEDURE`', '`FUNCTION … RETURN … END FUNCTION`'],
            ]
          },
          { t: 'p', html: 'Python uses `def` for both. The difference is only whether the body returns something. A good rule: if you need the answer later in the program, write a function. If the job ends with a message on the screen, write a procedure.' },
          {
            t: 'sort', title: 'Procedure or function?', prompt: 'Which kind of subprogram would you write for each job?', cats: ['Procedure', 'Function'], items: [
              { text: 'Print the title screen of a game', cat: 0 },
              { text: 'Work out the average of three marks so it can be used again', cat: 1 },
              { text: 'Decide whether a number is even', cat: 1 },
              { text: 'Display a menu of five options', cat: 0 },
              { text: 'Return the larger of two numbers', cat: 1 },
              { text: 'Print a row of dashes of a given length', cat: 0 },
            ], why: 'If the program needs a value back, use a function; if the job ends in displaying something, use a procedure.'
          },

          { t: 'h', text: 'Boolean helpers' },
          { t: 'p', html: 'A function can return `True` or `False`. Give it a name that reads like a question: `is_even`, `is_leap`, `is_adult`. The calling code then reads almost like English.' },
          {
            t: 'cases', title: 'Functions that return True or False', items: [
              {
                label: 'is_even', code: C`
              def is_even(n):
                  return n % 2 == 0

              print(is_even(10))
              print(is_even(7))
              if is_even(24):
                  print("24 is even")
            ` },
              {
                label: 'Long version', intro: 'You can write it with `if`, but the one-line version above does the same. Notice the comparison already gives `True` or `False`.', code: C`
              def is_even(n):
                  if n % 2 == 0:
                      return True
                  else:
                      return False

              print(is_even(10))
            ` },
              {
                label: 'is_leap', code: C`
              def is_leap(year):
                  return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0

              print(is_leap(2024))
              print(is_leap(1900))
              print(is_leap(2000))
              print(is_leap(2027))
            ` },
              {
                label: 'Range check', code: C`
              def in_range(value, low, high):
                  return low <= value <= high

              print(in_range(5, 1, 10))
              print(in_range(0, 1, 10))
              print(in_range(10, 1, 10))
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Writing `if is_even(n) == True:` works but is clumsy. Write `if is_even(n):` and use `if not is_even(n):` for the opposite.' },

          { t: 'h', text: 'A prime checker' },
          { t: 'p', html: 'A prime number has exactly two factors: 1 and itself. To test a number `n`, try dividing by every whole number from 2 up to `n - 1`. If any divides exactly, it is not prime. Trace this version to watch `divisor` change.' },
          {
            t: 'code', title: 'is_prime.py', code: C`
            def is_prime(n):
                if n < 2:
                    return False
                for divisor in range(2, n):
                    if n % divisor == 0:
                        return False
                return True

            for number in [1, 2, 9, 13, 15]:
                print(number, is_prime(number))
          `, caption: 'The `return False` inside the loop stops the whole function as soon as one factor is found. `return True` only runs if the loop finishes with no factor.'
          },
          {
            t: 'cases', title: 'Using a boolean function', items: [
              {
                label: 'Print the primes', code: C`
              def is_prime(n):
                  if n < 2:
                      return False
                  for divisor in range(2, n):
                      if n % divisor == 0:
                          return False
                  return True

              for number in range(1, 21):
                  if is_prime(number):
                      print(number, end=" ")
              print()
            ` },
              {
                label: 'Count the primes', code: C`
              def is_prime(n):
                  if n < 2:
                      return False
                  for divisor in range(2, n):
                      if n % divisor == 0:
                          return False
                  return True

              count = 0
              for number in range(1, 51):
                  if is_prime(number):
                      count = count + 1
              print("Primes up to 50:", count)
            ` },
              {
                label: 'Bug: return in the wrong place', intro: 'If `return True` is indented inside the loop, the function answers after checking only the first divisor. Read the output: 9 is wrongly reported as prime.', code: C`
              def is_prime_bad(n):
                  for divisor in range(2, n):
                      if n % divisor == 0:
                          return False
                      else:
                          return True
                  return True

              print(is_prime_bad(9))
              print(is_prime_bad(7))
            ` },
            ]
          },

          { t: 'h', text: 'The dice function' },
          { t: 'p', html: 'The `random` module gives you random numbers. `random.randint(1, 6)` picks a whole number from 1 to 6, **including both ends**. Wrapping it in a function lets any part of the game roll a die.' },
          {
            t: 'cases', title: 'dice()', items: [
              {
                label: 'Fixed six-sided die', intro: 'Your numbers will differ every time you run it.', code: C`
              import random

              def dice():
                  return random.randint(1, 6)

              print("You rolled", dice())
              print("You rolled", dice())
            ` },
              {
                label: 'Any number of sides', intro: 'A parameter with a default makes it flexible.', code: C`
              import random

              def roll(sides=6):
                  return random.randint(1, sides)

              print(roll())
              print(roll(20))
            ` },
              {
                label: 'Two dice', intro: 'Calling a function from another function. `roll_two` uses `dice` twice.', code: C`
              import random

              def dice():
                  return random.randint(1, 6)

              def roll_two():
                  first = dice()
                  second = dice()
                  return first + second

              total = roll_two()
              print("Total:", total)
              print("Double!" if dice() == dice() else "Not a double")
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'Put `import random` at the very top of the file, once. A subprogram can use anything that was imported above it.' },

          { t: 'h', text: 'Docstrings and testing with assert' },
          { t: 'p', html: 'A **docstring** is a text in triple quotes as the first line of a subprogram. It says what the subprogram does. An `assert` line checks that a call gives the answer you expect and stops with an error if not.' },
          {
            t: 'cases', title: 'Docstring and assert', items: [
              {
                label: 'Docstring', code: C`
              def average(a, b):
                  """Return the mean of two numbers."""
                  return (a + b) / 2

              print(average(4, 6))
              print(average.__doc__)
            ` },
              {
                label: 'Passing asserts', intro: 'Nothing is printed when all checks are true. Silence means success.', code: C`
              def average(a, b):
                  return (a + b) / 2

              assert average(4, 6) == 5
              assert average(0, 0) == 0
              assert average(-2, 2) == 0
              print("All tests passed")
            ` },
              {
                label: 'Failing assert', expectError: true, intro: 'This function has a bug (missing brackets). The assert finds it.', code: C`
              def average(a, b):
                  return a + b / 2

              assert average(4, 6) == 5, "average(4, 6) should be 5"
            ` },
            ]
          },

          {
            t: 'predict', title: 'Calling one function from another', code: C`
            def add_one(n):
                return n + 1

            def add_two(n):
                return add_one(add_one(n))

            print(add_two(5))
            print(add_one(add_two(0)))
          `, rows: 2, why: 'add_two(5) calls add_one twice: 6 then 7. add_two(0) is 2, then add_one makes 3.'
          },
          {
            t: 'predict', title: 'Prime or not?', code: C`
            def check(n):
                for d in range(2, n):
                    if n % d == 0:
                        return "no"
                return "yes"

            print(check(7))
            print(check(8))
            print(check(2))
          `, rows: 3, why: 'For n = 2 the range is empty, so the loop never runs and the function reaches `return "yes"`.'
          },
          { t: 'quiz', q: 'Why does <code>is_prime</code> put <code>return True</code> after the loop, not inside it?', options: ['Because return must always be the last line', 'Because True can only be decided after every divisor has been tried', 'Because loops cannot contain return', 'It makes the function faster'], answer: 1, why: 'Any one divisor proves the number is not prime, but you need to try all of them before you can say it is.' },
          {
            t: 'parsons', title: 'Build is_even_digit_sum', prompt: 'Arrange the function that returns True if a number between 10 and 99 has digits adding up to an even number.', lines: [
              'def even_digit_sum(n):', '    tens = n // 10', '    ones = n % 10', '    return (tens + ones) % 2 == 0'], why: '`//` gives the tens digit and `%` the ones digit; the total is tested for evenness.'
          },

          {
            t: 'exercise', id: 'm07-ex-iseven', title: 'Even or odd', level: 1,
            prompt: 'Write a function <code>is_even(n)</code> that returns <code>True</code> if <code>n</code> is even and <code>False</code> otherwise.',
            starter: C`
              def is_even(n):
                  pass
            `,
            solution: C`
              def is_even(n):
                  return n % 2 == 0
            `,
            tests: [
              { py: 'assert is_even(4) is True', label: 'is_even(4) is True' },
              { py: 'assert is_even(7) is False', label: 'is_even(7) is False' },
              { py: 'assert is_even(0) is True', label: 'zero is even' },
              { py: 'assert is_even(-3) is False', hidden: true, label: 'hidden check' },
            ],
            hints: ['A number is even when dividing by 2 leaves remainder 0.', '`return n % 2 == 0`']
          },
          {
            t: 'exercise', id: 'm07-ex-isprime', title: 'Check prime', level: 2,
            prompt: 'Write a function <code>check_prime(n)</code> that returns <code>True</code> if <code>n</code> is prime. Numbers below 2 are not prime. Then ask the user for a number and print <code>Prime</code> or <code>Not prime</code>.',
            starter: C`
              def check_prime(n):
                  pass

              num = int(input("Enter a number: "))
            `,
            solution: C`
              def check_prime(n):
                  if n < 2:
                      return False
                  for d in range(2, n):
                      if n % d == 0:
                          return False
                  return True

              num = int(input("Enter a number: "))
              if check_prime(num):
                  print("Prime")
              else:
                  print("Not prime")
            `,
            tests: [{ in: ['13'], out: 'Prime' }, { in: ['15'], out: 'Not prime' }, { in: ['2'], out: 'Prime' }, { in: ['1'], out: 'Not prime', hidden: true }, { in: ['0'], out: 'Not prime', hidden: true }],
            hints: ['Handle numbers below 2 first.', 'Loop `d` from 2 up to `n - 1` and `return False` if `n % d == 0`.', '`return True` goes after the loop, not inside it.']
          },
          {
            t: 'exercise', id: 'm07-ex-dice', title: 'Roll the dice', level: 2,
            prompt: 'Write a function <code>roll_dice(sides)</code> that returns a random whole number from 1 to <code>sides</code> inclusive. Remember to <code>import random</code>.',
            starter: C`
              import random

              def roll_dice(sides):
                  pass
            `,
            solution: C`
              import random

              def roll_dice(sides):
                  return random.randint(1, sides)
            `,
            tests: [
              { py: 'for _ in range(200):\n    assert 1 <= roll_dice(6) <= 6', label: 'always between 1 and 6' },
              { py: 'seen = {roll_dice(4) for _ in range(300)}\nassert seen == {1, 2, 3, 4}', label: 'a 4-sided die produces 1 to 4' },
              { py: 'assert all(roll_dice(1) == 1 for _ in range(20))', hidden: true, label: 'a 1-sided die' },
            ],
            hints: ['`random.randint(a, b)` includes both a and b.', '`return random.randint(1, sides)`']
          },
          {
            t: 'exercise', id: 'm07-ex-leap-scenario', title: 'Leap year checker', level: 3, kind: 'exam',
            prompt: 'A calendar app needs to know whether a year is a leap year. A leap year is divisible by 4, except century years (divisible by 100), which must also be divisible by 400. Write <code>is_leap(year)</code> returning <code>True</code>/<code>False</code>. The program reads a year and prints <code>YEAR is a leap year</code> or <code>YEAR is not a leap year</code> (for example <code>2024 is a leap year</code>).',
            starter: C`
              def is_leap(year):
                  pass

              y = int(input("Year: "))
            `,
            solution: C`
              def is_leap(year):
                  return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0

              y = int(input("Year: "))
              if is_leap(y):
                  print(y, "is a leap year")
              else:
                  print(y, "is not a leap year")
            `,
            tests: [{ in: ['2024'], out: '2024 is a leap year' }, { in: ['1900'], out: '1900 is not a leap year' }, { in: ['2000'], out: '2000 is a leap year' }, { in: ['2023'], out: '2023 is not a leap year', hidden: true }],
            hints: ['Write the three rules with `and` / `or`: (div by 4 and not by 100) or div by 400.', 'Use brackets around the first pair.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'scope',
        title: 'Scope: local and global variables',
        time: '30 min',
        book: 'Ch 2 · p.86-87',
        summary: 'Local vs global, shadowing, global keyword, UnboundLocalError',
        intro: 'A variable does not exist everywhere. Where a variable can be used is called its **scope**. Understanding scope clears up most of the errors students meet when they first write functions.',
        blocks: [
          { t: 'h', text: 'Local variables' },
          { t: 'p', html: 'A variable created **inside** a subprogram is **local**. It is born when the subprogram starts and disappears when it ends. Nothing outside can see it. Parameters are local too.' },
          {
            t: 'cases', title: 'Local variables', items: [
              {
                label: 'Works inside', code: C`
              def total_cost(price, qty):
                  cost = price * qty
                  print("Inside:", cost)

              total_cost(3, 4)
            ` },
              {
                label: 'Not visible outside', expectError: true, intro: '`cost` was local to the function, so the main program has never heard of it.', code: C`
              def total_cost(price, qty):
                  cost = price * qty

              total_cost(3, 4)
              print(cost)
            ` },
              {
                label: 'Parameter outside', expectError: true, intro: 'Parameters are also local.', code: C`
              def show(x):
                  print(x)

              show(5)
              print(x)
            ` },
              {
                label: 'The fix: return', intro: 'To get a value out, return it and store the result in a variable outside.', code: C`
              def total_cost(price, qty):
                  return price * qty

              cost = total_cost(3, 4)
              print(cost)
            ` },
            ]
          },

          { t: 'h', text: 'Global variables' },
          { t: 'p', html: 'A variable created in the main program (not inside any `def`) is **global**. A subprogram can **read** a global variable. Global values that never change, such as a tax rate, are called constants and are written in capitals by convention.' },
          {
            t: 'cases', title: 'Reading a global', items: [
              {
                label: 'A constant', code: C`
              TAX_RATE = 0.2

              def add_tax(price):
                  return price + price * TAX_RATE

              print(add_tax(50))
              print(add_tax(10))
            ` },
              {
                label: 'A global read at call time', intro: 'The function sees the value that the global has **when it is called**.', code: C`
              greeting = "Hello"

              def welcome(name):
                  print(greeting, name)

              welcome("Asha")
              greeting = "Hi"
              welcome("Asha")
            ` },
            ]
          },

          { t: 'h', text: 'Same name, different variable (shadowing)' },
          { t: 'p', html: 'If a subprogram assigns to a name, Python makes a **new local** variable, even if a global has the same name. The global is untouched.' },
          {
            t: 'code', title: 'shadowing.py', code: C`
            score = 10

            def reset():
                score = 0
                print("inside:", score)

            reset()
            print("outside:", score)
          `, caption: 'Trace this. There are two different variables called `score`, one in each scope.'
          },

          { t: 'h', text: 'Changing a global: the error and the keyword' },
          {
            t: 'cases', title: 'Trying to change a global', items: [
              {
                label: 'UnboundLocalError', expectError: true, intro: 'Assigning to `counter` inside makes it local for the whole function, so reading it first fails.', code: C`
              counter = 0

              def add_one():
                  counter = counter + 1

              add_one()
              print(counter)
            ` },
              {
                label: 'Fix with global', intro: 'The `global` keyword says: use the outside variable, do not make a new one.', code: C`
              counter = 0

              def add_one():
                  global counter
                  counter = counter + 1

              add_one()
              add_one()
              print(counter)
            ` },
              {
                label: 'Better: parameter and return', intro: 'No `global` needed. Data goes in through a parameter and comes out through `return`. This is easier to test and what examiners expect.', code: C`
              def add_one(counter):
                  return counter + 1

              count = 0
              count = add_one(count)
              count = add_one(count)
              print(count)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Avoid `global` for changing values. Many subprograms changing the same global makes bugs hard to find. Prefer passing values in with parameters and getting results out with `return`.' },
          { t: 'note', kind: 'exam', html: 'Typical exam wording: <em>"State the difference between a local variable and a global variable."</em> Answer: a local variable can only be used inside the subprogram where it was created; a global variable can be used throughout the program. Also expect questions about why local variables make a program easier to maintain (the same name can be reused without clashes).' },

          {
            t: 'table', head: ['Situation', 'Result'], rows: [
              ['Read a global inside a function', 'Works'],
              ['Assign to a name inside a function', 'Creates a new local variable'],
              ['Read a local from outside the function', '`NameError`'],
              ['Read then assign a global name inside a function, without `global`', '`UnboundLocalError`'],
              ['Use `global name` first', 'Changes the real global'],
            ]
          },

          {
            t: 'predict', title: 'Which score?', code: C`
            score = 5

            def change():
                score = 99
                return score

            print(change())
            print(score)
          `, rows: 2, why: 'The `score` inside `change` is a separate local variable. The global stays 5.'
          },
          {
            t: 'predict', title: 'With global', code: C`
            total = 0

            def add(n):
                global total
                total = total + n

            add(4)
            add(6)
            print(total)
          `, rows: 1, why: '`global total` makes the function change the outside variable, so the two calls add up to 10.'
          },
          {
            t: 'quiz', q: 'Which of these will cause a <code>NameError</code>?', options: ['Using a global constant inside a function', 'Using a parameter inside its own function', 'Printing a variable outside the function where it was created', 'Calling a function that has been defined above'], answer: 2, why: 'Local variables vanish when the function ends. Printing one afterwards finds no such name.', code: C`
            def f():
                x = 1
            f()
            print(x)
          ` },
          {
            t: 'sort', title: 'Local or global?', prompt: 'In this program, classify each variable.<pre>MAX_TRIES = 3\ndef check(guess):\n    result = guess == 7\n    return result\nname = "Sam"</pre>', cats: ['Local', 'Global'], items: [
              { text: '`MAX_TRIES`', cat: 1 },
              { text: '`guess`', cat: 0 },
              { text: '`result`', cat: 0 },
              { text: '`name`', cat: 1 },
            ], why: 'Variables created in the main program are global. The parameter and anything assigned inside `check` are local.'
          },

          {
            t: 'exercise', id: 'm07-ex-debug-scope', kind: 'debug', title: 'Why is it not working?', level: 2,
            prompt: 'This program should print <code>Total: 18</code>. There are <strong>two</strong> scope errors. Fix them without using the <code>global</code> keyword.',
            starter: C`
              def add_up(a, b, c):
                  total = a + b + c

              add_up(5, 6, 7)
              print("Total:", total)
            `,
            solution: C`
              def add_up(a, b, c):
                  total = a + b + c
                  return total

              total = add_up(5, 6, 7)
              print("Total:", total)
            `,
            tests: [{ out: 'Total: 18' }, { py: 'assert add_up(1, 2, 3) == 6', label: 'add_up returns the sum' }],
            requires: [{ re: '\\bglobal\\b', not: true, msg: 'Do not use `global`.' }],
            hints: ['`total` only exists inside the function.', 'Return it, and catch it in a variable in the main program.']
          },
          {
            t: 'exercise', id: 'm07-ex-tax', title: 'Add the tax', level: 1,
            prompt: 'Create a global constant <code>TAX_RATE = 0.2</code>. Write a function <code>with_tax(price)</code> that uses it to return the price plus tax. Read a price (a number) from the user and print the result.',
            starter: C`
              # constant and function here

              p = float(input("Price: "))
            `,
            solution: C`
              TAX_RATE = 0.2

              def with_tax(price):
                  return price + price * TAX_RATE

              p = float(input("Price: "))
              print(with_tax(p))
            `,
            tests: [{ in: ['100'], out: '120.0' }, { in: ['50'], out: '60.0' }, { in: ['0'], out: '0.0', hidden: true }],
            requires: [{ re: 'TAX_RATE\\s*=\\s*0\\.2', msg: 'Define `TAX_RATE = 0.2` outside any function.' }],
            hints: ['The function reads `TAX_RATE` directly; it does not need it as a parameter.']
          },
          {
            t: 'exercise', id: 'm07-ex-lives', title: 'Lives left', level: 2,
            prompt: 'A game starts with 3 lives. Write a function <code>lose_life(lives)</code> that returns <code>lives - 1</code> but never less than 0. In the main program keep a variable <code>lives = 3</code> and call the function 5 times in a loop, printing the lives after each call. Do not use <code>global</code>.',
            starter: C`
              def lose_life(lives):
                  pass

              lives = 3
            `,
            solution: C`
              def lose_life(lives):
                  if lives > 0:
                      return lives - 1
                  return 0

              lives = 3
              for i in range(5):
                  lives = lose_life(lives)
                  print(lives)
            `,
            tests: [{ out: '2\n1\n0\n0\n0' }, { py: 'assert lose_life(0) == 0 and lose_life(2) == 1', label: 'lose_life behaves at the edges' }],
            requires: [{ re: '\\bglobal\\b', not: true, msg: 'Do not use `global`.' }],
            hints: ['Pass `lives` in, return the new value, and store it back with `lives = lose_life(lives)`.', 'Check `lives > 0` before subtracting.']
          },
          {
            t: 'exercise', id: 'm07-ex-pin-scenario', title: 'Entry attempts', level: 3, kind: 'exam',
            prompt: 'A door keypad allows a limited number of tries. Define a global constant <code>MAX_TRIES = 3</code>. Write a function <code>tries_left(used)</code> returning <code>MAX_TRIES - used</code>. The program asks for a PIN up to three times: the correct PIN is <code>4821</code>. After a wrong PIN print <code>Wrong. Tries left: N</code>. After a correct PIN print <code>Open</code> and stop asking. If all tries are used print <code>Locked</code>.',
            starter: C`
              MAX_TRIES = 3

              def tries_left(used):
                  pass

              used = 0
            `,
            solution: C`
              MAX_TRIES = 3

              def tries_left(used):
                  return MAX_TRIES - used

              used = 0
              opened = False
              while used < MAX_TRIES and not opened:
                  pin = input("PIN: ")
                  if pin == "4821":
                      print("Open")
                      opened = True
                  else:
                      used = used + 1
                      print("Wrong. Tries left:", tries_left(used))
              if not opened:
                  print("Locked")
            `,
            tests: [
              { in: ['1111', '2222', '4821'], out: 'Wrong. Tries left: 2\nWrong. Tries left: 1\nOpen' },
              { in: ['4821'], out: 'Open' },
              { in: ['1', '2', '3'], out: 'Wrong. Tries left: 2\nWrong. Tries left: 1\nWrong. Tries left: 0\nLocked', hidden: true },
            ],
            hints: ['Count wrong attempts in `used` and loop while `used < MAX_TRIES`.', 'Use a flag such as `opened` to know whether to print Locked at the end.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'functions-and-lists',
        title: 'Subprograms and lists',
        time: '35 min',
        book: 'Ch 2 · p.88',
        summary: 'Passing lists in, returning lists, changing lists inside functions',
        intro: 'Lists are the most common thing to hand to a subprogram. Here you will write the standard list functions from the exam: total, average, largest, count matches and filter.',
        blocks: [
          { t: 'h', text: 'Passing a list in' },
          {
            t: 'cases', title: 'Functions that read a list', items: [
              {
                label: 'Total', code: C`
              def total(numbers):
                  running = 0
                  for n in numbers:
                      running = running + n
                  return running

              print(total([4, 8, 3]))
              print(total([]))
            ` },
              {
                label: 'Average', intro: 'Dividing by `len` of an empty list would crash, so guard it.', code: C`
              def average(numbers):
                  if len(numbers) == 0:
                      return 0
                  return sum(numbers) / len(numbers)

              print(average([4, 8, 3]))
              print(average([]))
            ` },
              {
                label: 'Largest', code: C`
              def largest(numbers):
                  best = numbers[0]
                  for n in numbers:
                      if n > best:
                          best = n
                  return best

              print(largest([4, 19, 3, 8]))
              print(largest([-5, -2, -9]))
            ` },
              {
                label: 'Count matches', code: C`
              def count_above(numbers, limit):
                  count = 0
                  for n in numbers:
                      if n > limit:
                          count = count + 1
                  return count

              marks = [45, 72, 88, 60, 91]
              print(count_above(marks, 70))
              print(count_above(marks, 100))
            ` },
              {
                label: 'Position of a value', intro: 'Return the index, or -1 when it is not there.', code: C`
              def find(items, target):
                  for i in range(len(items)):
                      if items[i] == target:
                          return i
                  return -1

              names = ["Asha", "Ben", "Chloe"]
              print(find(names, "Chloe"))
              print(find(names, "Zed"))
            ` },
              {
                label: 'Empty list error', expectError: true, intro: '`largest([])` tries to read `numbers[0]` and there is nothing there.', code: C`
              def largest(numbers):
                  best = numbers[0]
                  for n in numbers:
                      if n > best:
                          best = n
                  return best

              print(largest([]))
            ` },
            ]
          },

          { t: 'h', text: 'Returning a new list' },
          { t: 'p', html: 'A function can build a list and return it. Start with an empty list, `append` inside a loop, then `return` after the loop.' },
          {
            t: 'cases', title: 'Functions that build lists', items: [
              {
                label: 'Filter', code: C`
              def pass_marks(marks, boundary):
                  passed = []
                  for m in marks:
                      if m >= boundary:
                          passed.append(m)
                  return passed

              print(pass_marks([34, 56, 78, 40, 91], 50))
            ` },
              {
                label: 'Transform', code: C`
              def doubled(numbers):
                  result = []
                  for n in numbers:
                      result.append(n * 2)
                  return result

              original = [1, 2, 3]
              print(doubled(original))
              print(original)
            ` },
              {
                label: 'Return inside the loop', intro: 'A very common mistake: `return` inside the loop ends the function after the first item.', code: C`
              def doubled_bad(numbers):
                  result = []
                  for n in numbers:
                      result.append(n * 2)
                      return result

              print(doubled_bad([1, 2, 3]))
            ` },
            ]
          },

          { t: 'h', text: 'Changing a list inside a function' },
          { t: 'p', html: 'When you pass a list, the function receives the **same list**, not a copy. If it changes the list (with `append`, `sort`, `x[i] = …`), the caller sees the change. Reassigning the parameter to a new list does **not** affect the caller.' },
          {
            t: 'cases', title: 'Does the original change?', items: [
              {
                label: 'Changed in place', code: C`
              def add_bonus(scores):
                  for i in range(len(scores)):
                      scores[i] = scores[i] + 5

              marks = [10, 20, 30]
              add_bonus(marks)
              print(marks)
            ` },
              {
                label: 'append', code: C`
              def add_name(names, new):
                  names.append(new)

              team = ["Asha"]
              add_name(team, "Ben")
              print(team)
            ` },
              {
                label: 'Reassigned: no effect', intro: '`items = []` creates a new local list. The original is untouched.', code: C`
              def clear_bad(items):
                  items = []

              stuff = [1, 2, 3]
              clear_bad(stuff)
              print(stuff)
            ` },
              {
                label: 'Work on a copy', intro: 'If you must keep the original safe, copy it first.', code: C`
              def sorted_copy(numbers):
                  result = numbers[:]
                  result.sort()
                  return result

              data = [5, 1, 4]
              print(sorted_copy(data))
              print(data)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'A function that changes a list in place usually has no `return`. Do not write `marks = add_bonus(marks)` for such a function: it would store `None` and destroy your list.' },
          { t: 'note', kind: 'exam', html: 'Typical Paper 2 tasks: <em>"Write a function that takes a list of marks and returns the average"</em>, <em>"the highest"</em>, <em>"how many are above a boundary"</em>. Marks are for: correct header with parameter, loop through the list, correct accumulator or comparison, and <strong>returning</strong> (not printing) the result.' },

          {
            t: 'predict', title: 'In place or new list?', code: C`
            def a(lst):
                lst.append(0)

            def b(lst):
                lst = lst + [9]
                return lst

            x = [1]
            a(x)
            print(x)
            y = b(x)
            print(x, y)
          `, rows: 2, why: '`append` changes the shared list so x becomes [1, 0]. `lst + [9]` makes a new list, so x stays [1, 0] while y is [1, 0, 9].'
          },
          {
            t: 'predict', title: 'Count function', code: C`
            def count(items, target):
                c = 0
                for item in items:
                    if item == target:
                        c += 1
                return c

            print(count([3, 1, 3, 3], 3))
            print(count("banana", "a"))
            print(count([], 5))
          `, rows: 3, why: 'The same function works on lists and on strings, and returns 0 for an empty list.'
          },
          { t: 'quiz', q: 'A function receives <code>nums</code> and runs <code>nums.sort()</code>. What happens to the list in the main program?', options: ['Nothing; the function has its own copy', 'It is now sorted too, because the list is shared', 'An error occurs because nums is local', 'It becomes None'], answer: 1, why: 'The parameter refers to the same list object, and `sort()` changes it in place.' },
          {
            t: 'parsons', title: 'Count the passes', prompt: 'Arrange the function that returns how many marks in a list are at least 50.', lines: [
              'def count_passes(marks):', '    count = 0', '    for m in marks:', '        if m >= 50:', '            count = count + 1', '    return count'], why: 'Set the counter before the loop, update it inside the `if`, return after the loop.'
          },

          {
            t: 'exercise', id: 'm07-ex-listsum', title: 'Total without sum()', level: 1,
            prompt: 'Write a function <code>add_all(numbers)</code> that returns the total of a list. Use a loop; do not use the built-in <code>sum</code>.',
            starter: C`
              def add_all(numbers):
                  pass
            `,
            solution: C`
              def add_all(numbers):
                  total = 0
                  for n in numbers:
                      total = total + n
                  return total
            `,
            tests: [{ py: 'assert add_all([1, 2, 3]) == 6', label: '[1,2,3] -> 6' }, { py: 'assert add_all([]) == 0', label: 'empty list -> 0' }, { py: 'assert add_all([-5, 5, 10]) == 10', hidden: true, label: 'hidden check' }],
            requires: [{ re: '\\bsum\\s*\\(', not: true, msg: 'Do not use `sum()`.' }, { re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['Start a running total at 0 before the loop.', 'Return after the loop finishes.']
          },
          {
            t: 'exercise', id: 'm07-ex-countabove', title: 'How many above?', level: 2,
            prompt: 'Write <code>count_above(numbers, limit)</code> returning how many items are strictly greater than <code>limit</code>.',
            starter: C`
              def count_above(numbers, limit):
                  pass
            `,
            solution: C`
              def count_above(numbers, limit):
                  count = 0
                  for n in numbers:
                      if n > limit:
                          count += 1
                  return count
            `,
            tests: [{ py: 'assert count_above([5, 10, 15], 9) == 2' }, { py: 'assert count_above([5, 10, 15], 15) == 0', label: 'equal is not above' }, { py: 'assert count_above([], 3) == 0', label: 'empty list' }, { py: 'assert count_above([1, 1, 1], 0) == 3', hidden: true }],
            hints: ['Counter starts at 0.', 'Use `>` not `>=`.']
          },
          {
            t: 'exercise', id: 'm07-ex-evens', title: 'Keep the evens', level: 2,
            prompt: 'Write <code>only_evens(numbers)</code> that returns a <strong>new</strong> list containing just the even numbers in the original order. The original list must not change.',
            starter: C`
              def only_evens(numbers):
                  pass
            `,
            solution: C`
              def only_evens(numbers):
                  result = []
                  for n in numbers:
                      if n % 2 == 0:
                          result.append(n)
                  return result
            `,
            tests: [{ py: 'assert only_evens([1, 2, 3, 4, 6]) == [2, 4, 6]' }, { py: 'assert only_evens([1, 3]) == []', label: 'no evens' }, { py: 'x = [2, 3]\nonly_evens(x)\nassert x == [2, 3]', label: 'original unchanged' }, { py: 'assert only_evens([0, -2, -3]) == [0, -2]', hidden: true }],
            hints: ['Start with `result = []`.', 'Append inside the `if`, return after the loop.']
          },
          {
            t: 'exercise', id: 'm07-ex-marks-scenario', title: 'Class results', level: 3, kind: 'exam',
            prompt: 'A teacher enters five test marks. Write a function <code>summary(marks)</code> that returns three values: the highest mark, the lowest mark and the mean. The program reads five marks with <code>input()</code>, calls the function and prints <code>Highest: H</code>, <code>Lowest: L</code> and <code>Mean: M</code> on three lines. Do not use <code>max</code>, <code>min</code> or <code>sum</code>.',
            starter: C`
              def summary(marks):
                  pass

              marks = []
              for i in range(5):
                  marks.append(int(input("Mark: ")))
            `,
            solution: C`
              def summary(marks):
                  high = marks[0]
                  low = marks[0]
                  total = 0
                  for m in marks:
                      if m > high:
                          high = m
                      if m < low:
                          low = m
                      total = total + m
                  return high, low, total / len(marks)

              marks = []
              for i in range(5):
                  marks.append(int(input("Mark: ")))
              high, low, mean = summary(marks)
              print("Highest:", high)
              print("Lowest:", low)
              print("Mean:", mean)
            `,
            tests: [
              { in: ['50', '60', '70', '80', '90'], out: 'Highest: 90\nLowest: 50\nMean: 70.0' },
              { in: ['5', '5', '5', '5', '5'], out: 'Highest: 5\nLowest: 5\nMean: 5.0' },
              { in: ['10', '99', '0', '45', '46'], out: 'Highest: 99\nLowest: 0\nMean: 40.0', hidden: true },
            ],
            requires: [{ re: '\\b(max|min|sum)\\s*\\(', not: true, msg: 'Do not use max, min or sum.' }],
            hints: ['Set `high` and `low` to the first mark, then compare in a loop.', 'Return three values separated by commas and unpack them into three variables.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'menus',
        title: 'Menu-driven programs',
        time: '40 min',
        book: 'Ch 2 · p.89-90',
        summary: 'Build a full calculator menu step by step',
        intro: 'Most programs you use show a menu, wait for a choice, do the job, then show the menu again. In this lesson you will build a complete menu-driven calculator one stage at a time.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          {
            t: 'list', ordered: true, items: [
              'Show the menu.',
              'Ask for a choice.',
              'Do the job for that choice (each job is its own subprogram).',
              'Go back to step 1, until the user chooses Quit.',
            ]
          },
          { t: 'note', kind: 'key', html: 'A menu is a **loop** that contains an **if/elif/else** chain, and each branch **calls a subprogram**. You already know all three parts.' },

          { t: 'h', text: 'Stage 1: show the menu' },
          { t: 'p', html: 'Start with a procedure that only displays the options. Nothing else.' },
          {
            t: 'code', title: 'calculator stage 1', code: C`
            def show_menu():
                print()
                print("--- Calculator ---")
                print("1. Add")
                print("2. Subtract")
                print("3. Multiply")
                print("4. Divide")
                print("5. Quit")

            show_menu()
          ` },

          { t: 'h', text: 'Stage 2: read a choice and react' },
          { t: 'p', html: 'Add an `if/elif/else` chain. For now each branch just prints a message, so you can test the menu before the maths exists. Choices are compared as **strings** (`"1"`) because `input()` returns text.' },
          {
            t: 'cases', title: 'Stage 2: the choice chain', items: [
              {
                label: 'One go', stdin: ['2'], code: C`
              def show_menu():
                  print("1. Add")
                  print("2. Subtract")
                  print("5. Quit")

              show_menu()
              choice = input("Choose: ")
              if choice == "1":
                  print("You chose add")
              elif choice == "2":
                  print("You chose subtract")
              elif choice == "5":
                  print("Goodbye")
              else:
                  print("Not a valid choice")
            ` },
              {
                label: 'Invalid choice', stdin: ['9'], code: C`
              choice = input("Choose: ")
              if choice == "1":
                  print("You chose add")
              elif choice == "5":
                  print("Goodbye")
              else:
                  print("Not a valid choice")
            ` },
              {
                label: 'int vs string trap', intro: 'If you convert the choice with `int()`, you must compare with numbers. A mismatch (`int` against `"1"`) is never equal, so it falls through to `else`.', stdin: ['1'], code: C`
              choice = int(input("Choose: "))
              if choice == "1":
                  print("add")
              else:
                  print("else branch ran, even though you typed 1")
            ` },
            ]
          },

          { t: 'h', text: 'Stage 3: keep going until Quit' },
          { t: 'p', html: 'Wrap the chain in a loop. The loop keeps running while the choice is not the quit option. Setting `choice` to an empty string before the loop makes the first test true.' },
          {
            t: 'cases', title: 'Stage 3: the loop', items: [
              {
                label: 'while choice != "5"', stdin: ['1', '2', '7', '5'], code: C`
              choice = ""
              while choice != "5":
                  print("1. Add   2. Subtract   5. Quit")
                  choice = input("Choose: ")
                  if choice == "1":
                      print("(adding)")
                  elif choice == "2":
                      print("(subtracting)")
                  elif choice == "5":
                      print("Goodbye")
                  else:
                      print("Please choose 1, 2 or 5")
            ` },
              {
                label: 'while True with break', intro: 'The same menu using the other common style. `break` leaves the loop.', stdin: ['1', '5'], code: C`
              while True:
                  print("1. Add   5. Quit")
                  choice = input("Choose: ")
                  if choice == "1":
                      print("(adding)")
                  elif choice == "5":
                      print("Goodbye")
                      break
                  else:
                      print("Please choose 1 or 5")
            ` },
              {
                label: 'Forgot the loop update', expectError: false, intro: 'Do not run this one with a real keyboard: if `choice` is never re-read inside the loop, the menu repeats forever. Here the guard `count` stops it.', code: C`
              choice = "1"
              count = 0
              while choice != "5" and count < 3:
                  print("menu shown again, choice is still", choice)
                  count = count + 1
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'The `input()` for the choice must be **inside** the loop. If it is before the loop, the user never gets another chance to choose and the loop never ends.' },

          { t: 'h', text: 'Stage 4: one subprogram per option' },
          { t: 'p', html: 'Now write the real work. Each operation is a **function** that takes two numbers and returns the answer. A separate procedure reads the numbers. The menu loop only decides which one to call.' },
          {
            t: 'cases', title: 'Stage 4: the calculator functions', items: [
              {
                label: 'The four operations', code: C`
              def add(a, b):
                  return a + b

              def subtract(a, b):
                  return a - b

              def multiply(a, b):
                  return a * b

              def divide(a, b):
                  return a / b

              print(add(8, 4), subtract(8, 4), multiply(8, 4), divide(8, 4))
            ` },
              {
                label: 'Reading two numbers', intro: 'A function that returns **two** values: the numbers typed by the user.', stdin: ['6', '3'], code: C`
              def get_numbers():
                  a = float(input("First number: "))
                  b = float(input("Second number: "))
                  return a, b

              x, y = get_numbers()
              print(x, y)
            ` },
              {
                label: 'Divide by zero', expectError: true, intro: 'The function crashes if `b` is 0. We must protect against that.', code: C`
              def divide(a, b):
                  return a / b

              print(divide(5, 0))
            ` },
              {
                label: 'Protected divide', intro: 'Return `None` to mean "no answer" and let the caller check it.', code: C`
              def divide(a, b):
                  if b == 0:
                      return None
                  return a / b

              print(divide(5, 0))
              print(divide(5, 2))
            ` },
            ]
          },

          { t: 'h', text: 'Stage 5: the complete calculator' },
          { t: 'p', html: 'Join the pieces. The inputs below are pre-filled so you can run it: add 8 and 4, divide 5 by 0, divide 9 by 2, enter an invalid choice, then quit. Edit the stdin by changing the numbers, or click **Trace** to follow a single pass.' },
          {
            t: 'code', title: 'calculator.py', stdin: ['1', '8', '4', '4', '5', '0', '4', '9', '2', '8', '5'], code: C`
            def show_menu():
                print()
                print("--- Calculator ---")
                print("1. Add")
                print("2. Subtract")
                print("3. Multiply")
                print("4. Divide")
                print("5. Quit")

            def get_numbers():
                a = float(input("First number: "))
                b = float(input("Second number: "))
                return a, b

            def add(a, b):
                return a + b

            def subtract(a, b):
                return a - b

            def multiply(a, b):
                return a * b

            def divide(a, b):
                if b == 0:
                    return None
                return a / b

            choice = ""
            while choice != "5":
                show_menu()
                choice = input("Choose 1-5: ")
                if choice == "1":
                    x, y = get_numbers()
                    print("Answer:", add(x, y))
                elif choice == "2":
                    x, y = get_numbers()
                    print("Answer:", subtract(x, y))
                elif choice == "3":
                    x, y = get_numbers()
                    print("Answer:", multiply(x, y))
                elif choice == "4":
                    x, y = get_numbers()
                    answer = divide(x, y)
                    if answer is None:
                        print("You cannot divide by zero")
                    else:
                        print("Answer:", answer)
                elif choice == "5":
                    print("Goodbye")
                else:
                    print("Please choose a number from 1 to 5")
          `, caption: 'Notice how short the main loop is. Each branch is one or two lines because the real work lives in subprograms.'
          },

          { t: 'h', text: 'Stage 6: improvements' },
          {
            t: 'cases', title: 'Make it more robust', items: [
              {
                label: 'Validate the choice', intro: 'Ask again until the choice is one of the allowed options. Python\'s `in` makes the test short.', stdin: ['9', 'x', '3'], code: C`
              def get_choice():
                  choice = input("Choose 1-5: ")
                  while choice not in ["1", "2", "3", "4", "5"]:
                      print("Invalid. Try again.")
                      choice = input("Choose 1-5: ")
                  return choice

              print("You picked", get_choice())
            ` },
              {
                label: 'Validate a number', intro: 'Catch text that is not a number with `try` / `except`.', stdin: ['abc', '4.5'], code: C`
              def get_number(prompt):
                  while True:
                      try:
                          return float(input(prompt))
                      except ValueError:
                          print("That is not a number")

              print(get_number("Number: "))
            ` },
              {
                label: 'Keep a history', intro: 'A list can remember each answer, and a procedure can show it.', stdin: ['1', '2', '3', '4', '5'], code: C`
              history = []

              def show_history():
                  print("Answers so far:")
                  for item in history:
                      print(item)

              while True:
                  entry = input("Add a number or type q: ")
                  if entry == "q":
                      break
                  history.append(float(entry))
                  if len(history) == 3:
                      show_history()
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'In an exam, a menu question usually gives you part of the program and asks you to complete a missing branch, add a new option, or fix an error such as comparing with the wrong type. Remember the steps: show menu, input choice (inside the loop), `if/elif/else`, call the subprogram, quit option ends the loop.' },

          {
            t: 'predict', title: 'Menu trace', code: C`
            choice = ""
            count = 0
            while choice != "q":
                choice = input()
                if choice == "a":
                    count += 1
                elif choice == "q":
                    print("bye")
                else:
                    print("?")
            print(count)
          `, stdin: ['a', 'x', 'a', 'a', 'q'], rows: 4, why: 'Three `a` choices add to the count, `x` prints a question mark, and `q` prints bye then ends the loop before the final count of 3.'
          },
          { t: 'quiz', q: 'A menu loop never lets the user pick again. Which is the most likely cause?', options: ['The if chain uses elif', 'The input() for the choice is placed before the loop', 'The functions use return', 'The menu uses a procedure'], answer: 1, why: 'If the choice is read only once before the loop, the loop condition never changes.' },
          {
            t: 'parsons', title: 'Order a small menu', prompt: 'Arrange a menu that shows options, reads a choice inside a loop, and stops on 2.', lines: [
              'choice = ""', 'while choice != "2":', '    print("1. Hello   2. Quit")', '    choice = input("Choose: ")', '    if choice == "1":', '        print("Hello!")'], why: 'The loop variable is set first, the input is inside the loop, and the branch comes after the input.'
          },

          {
            t: 'exercise', id: 'm07-ex-temp-menu', title: 'Temperature menu', level: 2,
            prompt: 'Write a menu with three options: <code>1</code> Celsius to Fahrenheit (<code>c * 9 / 5 + 32</code>), <code>2</code> Fahrenheit to Celsius (<code>(f - 32) * 5 / 9</code>), <code>3</code> Quit. Use two functions <code>c_to_f</code> and <code>f_to_c</code>. After option 1 or 2, ask for the temperature as a number, then print <code>Result: </code> followed by the answer. Any other choice prints <code>Invalid</code>. The menu repeats until Quit.',
            starter: C`
              def c_to_f(c):
                  pass

              def f_to_c(f):
                  pass

              choice = ""
              while choice != "3":
                  print("1. C to F  2. F to C  3. Quit")
                  choice = input("Choose: ")
            `,
            solution: C`
              def c_to_f(c):
                  return c * 9 / 5 + 32

              def f_to_c(f):
                  return (f - 32) * 5 / 9

              choice = ""
              while choice != "3":
                  print("1. C to F  2. F to C  3. Quit")
                  choice = input("Choose: ")
                  if choice == "1":
                      t = float(input("Celsius: "))
                      print("Result:", c_to_f(t))
                  elif choice == "2":
                      t = float(input("Fahrenheit: "))
                      print("Result:", f_to_c(t))
                  elif choice == "3":
                      pass
                  else:
                      print("Invalid")
            `,
            tests: [
              { in: ['1', '100', '3'], has: ['Result: 212.0'], loose: true },
              { in: ['2', '212', '9', '3'], has: ['Result: 100.0', 'Invalid'], loose: true },
              { in: ['3'], hasNot: ['Result'] },
              { in: ['1', '0', '2', '32', '3'], has: ['Result: 32.0', 'Result: 0.0'], loose: true, hidden: true },
              { in: ['3'], py: 'assert c_to_f(0) == 32 and f_to_c(32) == 0', label: 'functions return correct values' },
            ],
            hints: ['Both functions need a `return`.', 'Each option reads a temperature with `float(input(...))`, then prints `"Result:"` and the returned value.', 'The final `else:` is the Invalid branch.']
          },
          {
            t: 'exercise', id: 'm07-ex-debug-menu', kind: 'debug', title: 'Broken menu', level: 2,
            prompt: 'This menu should let the user add names to a list (option 1), show the list (option 2) or quit (option 3). There are <strong>four</strong> errors: find and fix them all.',
            starter: C`
              def show(names):
                  for n in names:
                      print(n)

              names = []
              choice = input("1 add, 2 show, 3 quit: ")
              while choice != 3:
                  if choice == "1":
                      names.append(input("Name: "))
                  elif choice = "2":
                      show(names)
                  else:
                      print("Invalid")
            `,
            solution: C`
              def show(names):
                  for n in names:
                      print(n)

              names = []
              choice = ""
              while choice != "3":
                  choice = input("1 add, 2 show, 3 quit: ")
                  if choice == "1":
                      names.append(input("Name: "))
                  elif choice == "2":
                      show(names)
                  elif choice != "3":
                      print("Invalid")
            `,
            tests: [
              { in: ['1', 'Asha', '1', 'Ben', '2', '3'], out: 'Asha\nBen' },
              { in: ['9', '3'], out: 'Invalid' },
              { in: ['3'], out: '' },
            ],
            hints: ['There is a syntax error on one `elif` line: `=` vs `==`.', '`choice` is text, so compare with `"3"`, not `3`.', 'The `input` must be inside the loop. Also, quitting should not print Invalid.']
          },
          {
            t: 'exercise', id: 'm07-ex-shop-menu', title: 'Shopping basket', level: 3, kind: 'exam',
            prompt: 'Write a shopping basket program. Menu: <code>1</code> Add item (ask for an item name and append it to a list), <code>2</code> Show count (print <code>Items: N</code> using a function <code>count_items(basket)</code> that returns the length), <code>3</code> Remove last item (print <code>Basket is empty</code> if there is nothing to remove, using a function <code>remove_last(basket)</code>), <code>4</code> Quit. Invalid choices print <code>Invalid</code>.',
            starter: C`
              def count_items(basket):
                  pass

              def remove_last(basket):
                  pass

              basket = []
              choice = ""
            `,
            solution: C`
              def count_items(basket):
                  return len(basket)

              def remove_last(basket):
                  if len(basket) == 0:
                      print("Basket is empty")
                  else:
                      basket.pop()

              basket = []
              choice = ""
              while choice != "4":
                  choice = input("1 add 2 count 3 remove 4 quit: ")
                  if choice == "1":
                      basket.append(input("Item: "))
                  elif choice == "2":
                      print("Items:", count_items(basket))
                  elif choice == "3":
                      remove_last(basket)
                  elif choice != "4":
                      print("Invalid")
            `,
            tests: [
              { in: ['1', 'milk', '1', 'eggs', '2', '4'], out: 'Items: 2' },
              { in: ['3', '4'], out: 'Basket is empty' },
              { in: ['1', 'tea', '3', '2', '3', '7', '4'], out: 'Items: 0\nBasket is empty\nInvalid', hidden: true },
              { in: ['4'], py: 'b = ["a", "b"]\nremove_last(b)\nassert b == ["a"]', label: 'remove_last removes the last item' },
              { in: ['4'], py: 'assert count_items([1, 2, 3]) == 3', label: 'count_items returns the length' },
            ],
            hints: ['`len(basket)` gives the count; `basket.pop()` removes the last item.', 'Check the basket is not empty before popping.', 'Use `elif choice != "4":` for the Invalid branch so Quit does not print it.']
          },
        ],
      },
    ],
  });
})();

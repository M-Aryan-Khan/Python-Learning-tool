(function () {
  const C = PP.C;
  const PRE = (s) => '<pre>' + s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
  // Compact exercise builder: X(id, title, level, kind, prompt, starter, solution, tests, hints, extra)
  const X = (id, title, level, kind, prompt, starter, solution, tests, hints, extra) =>
    Object.assign({ t: 'exercise', id, title, level, kind, prompt, starter, solution, tests, hints }, extra || {});
  const MENU = '1. Add\n2. Subtract\n3. Multiply\n4. Quit';
  const GYM = '1. Low visits\n2. Active members\n3. Quit';
  const PARK = '1. Calculate fee\n2. Show takings\n3. Quit';
  PP.addModule({
    id: 'm15',
    title: 'Past-paper practice',
    blurb: 'Eleven recurring Paper 2 patterns, each with a worked example and original exam-style tasks, finishing with a timed mixed test.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-test-data-tables',
        title: 'Test data tables',
        time: '35 min',
        book: 'Ch 2 · testing',
        exam: 'Paper 2 · test data questions',
        summary: 'Normal, boundary and erroneous data for a stated rule',
        intro: 'Almost every Paper 2 has a table asking for normal, boundary and erroneous test data. The skill is always the same: read the rule, find its limits, then choose values on each side.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'You are given a rule such as "a locker number is a whole number from 1 to 120". You must fill a table with **three kinds** of test data. Each kind earns its own mark, so every box matters.' },
          { t: 'table', head: ['Kind', 'Meaning', 'For lockers 1 to 120'], rows: [
            ['Normal', 'Typical valid data, safely inside the limits', '`57`, `90`'],
            ['Boundary', 'The most extreme values that are still **accepted**', '`1` and `120`'],
            ['Erroneous', 'Data the program must reject: outside the range or the wrong type', '`0`, `121`, `-5`, `"abc"`'],
          ] },
          { t: 'note', kind: 'exam', html: 'Mark schemes treat boundary data as the extreme values that **pass** (here 1 and 120). Many teachers also like testing the first failing value on each side (here 0 and 121). Put those in the erroneous row if there is room. Never give the same value twice in one table: "each example must be different" is a common instruction.' },
          { t: 'note', kind: 'warn', html: 'When a table has **two fields** (for example pizzas and toppings), every row must give a value for both fields. A boundary row puts one field at its extreme while the other stays valid. An erroneous row should break only the rule you are testing.' },

          { t: 'h', text: 'Worked example: one rule, three lists' },
          { t: 'code', title: 'Testing a validation function with all three kinds of data', caption: 'Press Run. The function is the rule; each list is one row of the exam table.', code: C`
            def locker_ok(n):
                return 1 <= n <= 120

            normal = [57, 90]
            boundary = [1, 120]
            erroneous = [0, 121, -5]

            for label, data in [("Normal", normal), ("Boundary", boundary), ("Erroneous", erroneous)]:
                for value in data:
                    if locker_ok(value):
                        print(label, value, "-> accepted")
                    else:
                        print(label, value, "-> rejected")
          ` },
          { t: 'cases', title: 'The same idea for different kinds of rule', items: [
            { label: 'Whole-number range', intro: 'Rule: a swimmer lane is from 1 to 8.', code: C`
              def lane_ok(n):
                  return 1 <= n <= 8
              for n in [4, 1, 8, 0, 9]:
                  print(n, lane_ok(n))
            ` },
            { label: 'Two fields', intro: 'Rule: a booking has 1 to 10 pizzas and 0 to 4 extra toppings. Each row of test data is a pair.', code: C`
              def order_ok(pizzas, toppings):
                  return 1 <= pizzas <= 10 and 0 <= toppings <= 4
              rows = [(3, 2), (1, 0), (10, 4), (0, 2), (4, 5)]
              for pizzas, toppings in rows:
                  print(pizzas, toppings, order_ok(pizzas, toppings))
            ` },
            { label: 'Text length', intro: 'Rule: a memorable word has 5 to 12 characters. Boundary data is a 5-letter and a 12-letter word.', code: C`
              def word_ok(w):
                  return 5 <= len(w) <= 12
              for w in ["planet", "tiger", "extraordinary", "cat", ""]:
                  print(repr(w), len(w), word_ok(w))
            ` },
            { label: 'Expected output', intro: 'Some tables ask for the expected output too. Work it out from the rule, then check by running.', code: C`
              def depth_msg(d):
                  if d < 30:
                      return "Too shallow"
                  elif d <= 150:
                      return "Safe"
                  return "Too deep"
              for d in [29, 30, 150, 151]:
                  print(d, depth_msg(d))
            ` },
          ] },
          { t: 'sort', prompt: 'Rule: a locker number is a whole number from 1 to 120. Sort each test value.', cats: ['Normal', 'Boundary', 'Erroneous'], items: [
            { text: '57', cat: 0 }, { text: '1', cat: 1 }, { text: '120', cat: 1 }, { text: '0', cat: 2 }, { text: '121', cat: 2 }, { text: '-4', cat: 2 }, { text: '"abc"', cat: 2 }, { text: '64', cat: 0 }, { text: '2', cat: 0 },
          ], why: 'Normal data is typical and valid. Boundary data is the extreme valid values (1 and 120). Anything the program must reject is erroneous.' },
          { t: 'predict', code: C`
            def ok(n):
                return 5 <= n <= 20
            print(ok(5), ok(20), ok(4), ok(21))
          `, why: '5 and 20 are the extreme accepted values, so they pass. 4 and 21 are just outside.' },
          { t: 'quiz', q: 'A program accepts ages from 11 to 16 inclusive. Which pair is the boundary test data?', options: ['11 and 16', '10 and 17', '13 and 14', '0 and 100'], answer: 0, why: 'Boundary data is the extreme accepted values: 11 and 16. 10 and 17 would be erroneous.' },
          { t: 'tracetable', id: 'm15-tt-testdata', code: C`
            n = 120
            ok = n >= 1 and n <= 120
            n = 121
            ok = n >= 1 and n <= 120
          `, cols: ['n', 'ok'], prompt: 'Trace the check at the top limit of the locker rule.' },

          { t: 'h', text: 'Your turn' },
          { t: 'p', html: 'In these tasks you write the rule as code **and** build the test data. The checker tests both.' },
          X('m15-ex-td-locker', 'Locker numbers', 1, 'exam',
            'A school has lockers numbered 1 to 120 inclusive.<br>(a) Write the function <code>locker_ok(n)</code> that returns <code>True</code> when <code>n</code> is a valid number. (2 marks)<br>(b) Fill the lists <code>normal</code>, <code>boundary</code> and <code>erroneous</code> with test data: at least two normal values, the two boundary values and at least two erroneous values. (3 marks)',
            C`
              def locker_ok(n):
                  pass

              normal = []
              boundary = []
              erroneous = []
            `,
            C`
              def locker_ok(n):
                  return 1 <= n <= 120

              normal = [57, 90]
              boundary = [1, 120]
              erroneous = [0, 121, -5]
            `,
            [
              { py: 'assert locker_ok(1) and locker_ok(120) and locker_ok(60), "valid numbers should return True"', label: 'valid lockers accepted' },
              { py: 'assert not locker_ok(0) and not locker_ok(121) and not locker_ok(-3), "invalid numbers should return False"', label: 'invalid lockers rejected' },
              { py: 'assert len(normal) >= 2 and all(1 < x < 120 and locker_ok(x) for x in normal), "normal data must be valid and not at the limits"', label: 'normal data' },
              { py: 'assert sorted(boundary) == [1, 120], "boundary data is the extreme valid values"', label: 'boundary data', hidden: true },
              { py: 'assert len(erroneous) >= 2 and len(set(erroneous)) == len(erroneous) and not any(locker_ok(x) for x in erroneous), "erroneous data must all be rejected and different"', label: 'erroneous data' },
            ],
            ['A range check can be written `1 <= n <= 120`.', 'Boundary data is the smallest and largest values that are still accepted.', 'Erroneous values must make `locker_ok` return False. Use numbers outside the range.']),
          X('m15-ex-td-pizza', 'Pizza orders', 2, 'exam',
            'An order has 1 to 10 pizzas and 0 to 4 extra toppings, both whole numbers.<br>(a) Write <code>order_ok(pizzas, toppings)</code>. (2 marks)<br>(b) Fill the three lists with pairs <code>(pizzas, toppings)</code>. Normal pairs must be valid and away from every limit. Boundary pairs must be valid and use an extreme value in at least one field; together they must cover 1 and 10 pizzas and 0 and 4 toppings. Erroneous pairs must each be rejected. (4 marks)',
            C`
              def order_ok(pizzas, toppings):
                  pass

              normal = []
              boundary = []
              erroneous = []
            `,
            C`
              def order_ok(pizzas, toppings):
                  return 1 <= pizzas <= 10 and 0 <= toppings <= 4

              normal = [(3, 2), (6, 1)]
              boundary = [(1, 0), (10, 4), (1, 4), (10, 0)]
              erroneous = [(0, 2), (11, 2), (4, -1), (4, 5)]
            `,
            [
              { py: 'assert order_ok(1,0) and order_ok(10,4) and order_ok(5,2), "valid orders"', label: 'valid orders accepted' },
              { py: 'assert not order_ok(0,2) and not order_ok(11,2) and not order_ok(4,5) and not order_ok(4,-1), "invalid orders"', label: 'invalid orders rejected' },
              { py: 'assert len(normal) >= 2 and all(order_ok(p,t) and 1 < p < 10 and 0 < t < 4 for p,t in normal), "normal pairs"', label: 'normal pairs' },
              { py: 'assert len(boundary) >= 2 and all(order_ok(p,t) and (p in (1,10) or t in (0,4)) for p,t in boundary), "each boundary pair is valid and uses an extreme"\nassert {p for p,t in boundary} >= {1,10} and {t for p,t in boundary} >= {0,4}, "cover 1, 10 pizzas and 0, 4 toppings"', label: 'boundary pairs' },
              { py: 'assert len(erroneous) >= 2 and not any(order_ok(p,t) for p,t in erroneous) and len(set(erroneous)) == len(erroneous), "erroneous pairs"', label: 'erroneous pairs', hidden: true },
            ],
            ['Join two tests with `and`: `1 <= pizzas <= 10 and 0 <= toppings <= 4`.', 'A boundary pair such as `(1, 2)` is valid and uses the lowest pizza count.', 'Each erroneous pair should break just one rule.']),
          X('m15-ex-td-depth', 'Pool depth messages', 2, 'exam',
            'A pool sensor reports the water depth in whole centimetres.<br>Under 30: <code>Too shallow</code>. From 30 to 150 inclusive: <code>Safe</code>. Over 150: <code>Too deep</code>.<br>(a) Write <code>depth_msg(d)</code> that returns the message. (3 marks)<br>(b) Complete the dictionary <code>expected</code> to show the expected message for each of the four boundary inputs 29, 30, 150 and 151. (2 marks)',
            C`
              def depth_msg(d):
                  pass

              expected = {29: "", 30: "", 150: "", 151: ""}
            `,
            C`
              def depth_msg(d):
                  if d < 30:
                      return "Too shallow"
                  elif d <= 150:
                      return "Safe"
                  else:
                      return "Too deep"

              expected = {29: "Too shallow", 30: "Safe", 150: "Safe", 151: "Too deep"}
            `,
            [
              { py: 'assert depth_msg(29) == "Too shallow" and depth_msg(30) == "Safe", "lower limit"', label: 'lower limit' },
              { py: 'assert depth_msg(150) == "Safe" and depth_msg(151) == "Too deep", "upper limit"', label: 'upper limit' },
              { py: 'assert depth_msg(0) == "Too shallow" and depth_msg(90) == "Safe" and depth_msg(400) == "Too deep", "typical values"', label: 'typical values', hidden: true },
              { py: 'assert expected == {29: "Too shallow", 30: "Safe", 150: "Safe", 151: "Too deep"}, "the expected table is not correct"', label: 'expected table' },
            ],
            ['Use `if` / `elif` / `else`: shallow first, then safe, then too deep.', '"From 30 to 150 inclusive" means `<= 150`.', 'The expected table is what your function returns for 29, 30, 150 and 151.']),
          X('m15-ex-td-passlen', 'Password length', 1, 'exam',
            'A password must be 8 to 16 characters long. Write a program that inputs a password and displays <code>Too short</code>, <code>Too long</code> or <code>Accepted</code>. (3 marks)',
            C`
              password = input("Password: ")
              # complete the program
            `,
            C`
              password = input("Password: ")
              if len(password) < 8:
                  print("Too short")
              elif len(password) > 16:
                  print("Too long")
              else:
                  print("Accepted")
            `,
            [{ in: ['sunshine'], out: 'Accepted' }, { in: ['abc'], out: 'Too short' }, { in: ['1234567'], out: 'Too short' }, { in: ['abcdefghijklmnop'], out: 'Accepted', hidden: true }, { in: ['abcdefghijklmnopq'], out: 'Too long' }, { in: [''], out: 'Too short', hidden: true }],
            ['`len(password)` gives the number of characters.', 'Test the two failing cases first, then use `else` for accepted.', '8 and 16 are both accepted, so use `< 8` and `> 16`.']),
          X('m15-ex-td-weight', 'Parcel weight checker', 3, 'exam',
            'A parcel service accepts weights up to 30 kg. A program inputs the weight as text and displays one message:<br>• nothing typed (or only spaces): <code>Weight missing</code><br>• not a number: <code>Not a number</code><br>• zero or negative: <code>Must be above zero</code><br>• over 30: <code>Too heavy</code><br>• exactly 30: <code>Maximum weight</code><br>• otherwise: <code>Accepted</code> (6 marks)',
            C`
              text = input("Weight in kg: ")
              # check the text before you try to convert it
            `,
            C`
              text = input("Weight in kg: ")
              if text.strip() == "":
                  print("Weight missing")
              else:
                  try:
                      w = float(text)
                      if w <= 0:
                          print("Must be above zero")
                      elif w > 30:
                          print("Too heavy")
                      elif w == 30:
                          print("Maximum weight")
                      else:
                          print("Accepted")
                  except ValueError:
                      print("Not a number")
            `,
            [{ in: ['12.5'], out: 'Accepted' }, { in: [''], out: 'Weight missing' }, { in: ['   '], out: 'Weight missing', hidden: true }, { in: ['heavy'], out: 'Not a number' }, { in: ['-2'], out: 'Must be above zero' }, { in: ['0'], out: 'Must be above zero' }, { in: ['30'], out: 'Maximum weight' }, { in: ['30.1'], out: 'Too heavy', hidden: true }, { in: ['29.9'], out: 'Accepted' }],
            ['Deal with the empty text first using `.strip()`.', 'Use `try` / `except ValueError` around `float(text)`.', 'Check zero or below, then over 30, then exactly 30.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-amend-errors',
        title: 'Amend the code: find the errors',
        time: '35 min',
        book: 'Ch 2 · debugging',
        exam: 'Paper 2 · "There are N errors"',
        summary: 'Three or four planted errors in a short program',
        intro: 'This is the easiest set of marks on Paper 2 if you are methodical. The question tells you how many errors there are, so you know when to stop looking.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'You open a short program, you are told "there are **three** errors", and you must save a corrected version. One mark is usually given per error fixed. The errors are almost always a mixture of the three types.' },
          { t: 'table', head: ['Error type', 'What happens', 'Typical plants'], rows: [
            ['Syntax', 'Python refuses to run the program', 'Missing `:` after `if` / `else` / `for`; a missing bracket or comma; `=` where `==` is needed'],
            ['Runtime', 'The program starts, then crashes', 'No `int()` around `input()` before arithmetic; a misspelt variable name; using a module without `import`'],
            ['Logic', 'It runs but gives the wrong answer', 'Wrong operator (`+` for `-`); `>` instead of `>=`; `range` stopping one early; a reset in the wrong place'],
          ] },
          { t: 'note', kind: 'exam', html: 'Method that works under time pressure: (1) run the program and read the **first** error message; (2) fix it and run again; (3) once it runs, test it with the example values in the question and compare with what it should print; (4) hunt only for the remaining logic errors. Do not change anything that already works: "do not add any further functionality".' },
          { t: 'cases', title: 'One planted error of each type', items: [
            { label: 'Syntax: missing colon', expectError: true, intro: 'Python points at the line after the problem.', code: C`
              score = 12
              if score > 10
                  print("High")
            ` },
            { label: 'Runtime: no int()', expectError: true, code: C`
              tickets = input("Tickets: ")
              print(tickets * 5 + 1)
            `, stdin: ['3'] },
            { label: 'Logic: wrong operator', intro: 'No error message at all. Only the output tells you.', code: C`
              price = 12
              discount = 2
              print("You pay", price + discount)
            ` },
            { label: 'Logic: boundary', intro: 'Anyone aged exactly 65 should get the discount.', code: C`
              age = 65
              if age > 65:
                  print("Discount")
              else:
                  print("Full price")
            ` },
          ] },
          { t: 'predict', code: C`
            total = 0
            for n in range(1, 4):
                total = total + n
            print(total)
          `, why: 'range(1, 4) gives 1, 2, 3. If the question wants 1 to 4, the bug is the end value.' },
          { t: 'quiz', q: 'A program should add up the numbers 1 to 10 but prints 45. Which is the most likely error?', options: ['`range(1, 10)` should be `range(1, 11)`', 'A missing colon', 'A missing `int()`', 'A misspelt variable'], answer: 0, why: '1 + 2 + ... + 9 = 45, so the loop stopped one early. The program ran, so it is a logic error, not a syntax error.' },
          { t: 'h', text: 'Your turn' },
          { t: 'p', html: 'Each task has a broken program and tests. Read the number of errors in the prompt and fix exactly that many. Press **Run** to see crashes before you press Check.' },
          X('m15-ex-ae-stock', 'Flour stock', 2, 'debug',
            'A bakery counts bags of flour. The program should work out how many bags are left and warn when fewer than 5 remain. There are <strong>three</strong> errors in the code. Amend the code to correct them. (3 marks)',
            C`
              bags = input("Bags in stock: ")
              used = int(input("Bags used today: "))
              left = bags + used
              if left < 5
                  print("Order more flour")
              else:
                  print("Stock is fine")
              print("Bags left:", left)
            `,
            C`
              bags = int(input("Bags in stock: "))
              used = int(input("Bags used today: "))
              left = bags - used
              if left < 5:
                  print("Order more flour")
              else:
                  print("Stock is fine")
              print("Bags left:", left)
            `,
            [{ in: ['20', '3'], out: 'Stock is fine\nBags left: 17' }, { in: ['8', '4'], out: 'Order more flour\nBags left: 4' }, { in: ['5', '0'], out: 'Stock is fine\nBags left: 5' }, { in: ['10', '10'], out: 'Order more flour\nBags left: 0', hidden: true }],
            ['Run it first: Python reports a syntax error on the `if` line.', '`input()` returns text, so one of the two numbers is not converted.', 'Flour left is stock **minus** used.']),
          X('m15-ex-ae-discount', 'Ticket discount', 2, 'debug',
            'A cinema sells tickets at 8.00. Anyone aged 65 or over pays 60% of the price. Otherwise students pay 75%. Everyone else pays full price. There are <strong>three</strong> errors in the code. Amend the code to correct them. (3 marks)',
            C`
              age = int(input("Age: "))
              student = input("Student (yes/no): ")
              price = 8.00
              if age > 65:
                  price = price * 0.6
              elif student = "yes":
                  price = price * 0.75
              print("Ticket price: " + price)
            `,
            C`
              age = int(input("Age: "))
              student = input("Student (yes/no): ")
              price = 8.00
              if age >= 65:
                  price = price * 0.6
              elif student == "yes":
                  price = price * 0.75
              print("Ticket price: " + format(price, ".2f"))
            `,
            [{ in: ['70', 'no'], out: 'Ticket price: 4.80' }, { in: ['20', 'yes'], out: 'Ticket price: 6.00' }, { in: ['65', 'no'], out: 'Ticket price: 4.80' }, { in: ['30', 'no'], out: 'Ticket price: 8.00', hidden: true }],
            ['Comparing two values needs `==`, not `=`.', 'Joining text and a number with `+` fails. Convert the price first: `format(price, ".2f")` or `str(price)`.', 'Age 65 must get the discount, so the comparison needs `>=`.']),
          X('m15-ex-ae-temps', 'Average temperature', 2, 'debug',
            'The program should input three temperatures (they may have decimals) and display their mean to 1 decimal place. There are <strong>three</strong> errors in the code. Amend the code to correct them. (3 marks)',
            C`
              total = 0
              for day in range(1, 3):
                  t = int(input("Temperature: "))
                  total = total + t
              average = total / 3
              print("Average:" round(average, 1))
            `,
            C`
              total = 0
              for day in range(3):
                  t = float(input("Temperature: "))
                  total = total + t
              average = total / 3
              print("Average:", round(average, 1))
            `,
            [{ in: ['10', '12.5', '11.5'], out: 'Average: 11.3' }, { in: ['20', '20', '20'], out: 'Average: 20.0' }, { in: ['-3', '0', '2.5'], out: 'Average: -0.2' }, { in: ['7.5', '8.5', '9'], out: 'Average: 8.3', hidden: true }],
            ['The `print` line is missing a comma between the text and `round(...)`.', '`range(1, 3)` only repeats twice. You need three temperatures.', '`int()` rejects values like 12.5. Use `float()`.']),
          X('m15-ex-ae-bill', 'Restaurant bill', 3, 'debug',
            'A restaurant adds a 10% service charge to parties of 6 or more. The program displays the total bill and what each person pays. There are <strong>four</strong> errors in the code. Amend the code to correct them. Use the data in the tests to help you. (4 marks)',
            C`
              SERVICE_RATE = 0.10
              diners = input("Number of diners: ")
              cost_each = float(input("Cost per diner: "))
              bill = diners * cost_each
              if diners > 6:
                  bill = bill * SERVICE_RATE
              print("Total bill:", round(bill, 2))
              print("Each person pays:", round(bill / diner, 2))
            `,
            C`
              SERVICE_RATE = 0.10
              diners = int(input("Number of diners: "))
              cost_each = float(input("Cost per diner: "))
              bill = diners * cost_each
              if diners >= 6:
                  bill = bill + bill * SERVICE_RATE
              print("Total bill:", round(bill, 2))
              print("Each person pays:", round(bill / diners, 2))
            `,
            [{ in: ['4', '10.5'], out: 'Total bill: 42.0\nEach person pays: 10.5' }, { in: ['6', '10'], out: 'Total bill: 66.0\nEach person pays: 11.0' }, { in: ['8', '12.5'], out: 'Total bill: 110.0\nEach person pays: 13.75' }, { in: ['1', '9.99'], out: 'Total bill: 9.99\nEach person pays: 9.99', hidden: true }],
            ['The first run crashes: `diners` is still text when you multiply.', 'A party of exactly 6 gets the charge, so the comparison needs `>=`.', 'Adding a charge means `bill + bill * SERVICE_RATE`, not replacing the bill. Check the spelling of `diners` in the last line.']),
          X('m15-ex-ae-multiples', 'Sum of multiples of three', 3, 'debug',
            'The program inputs a number n and should display the total of every multiple of 3 from 3 up to and including n. There are <strong>three</strong> errors in the code. Amend the code to correct them. (3 marks)',
            C`
              n = int(input("Up to: "))
              total = 0
              for number in range(3, n, 3):
                  total = total + 1
                  print("Total:", total)
            `,
            C`
              n = int(input("Up to: "))
              total = 0
              for number in range(3, n + 1, 3):
                  total = total + number
              print("Total:", total)
            `,
            [{ in: ['10'], out: 'Total: 18' }, { in: ['9'], out: 'Total: 18' }, { in: ['2'], out: 'Total: 0' }, { in: ['30'], out: 'Total: 165', hidden: true }],
            ['Test with 9: should 9 be included? `range` stops one before its end value.', 'The accumulator should add the loop variable, not 1.', 'Look at the indentation of `print`. Should it run every time round the loop?']),
          X('m15-ex-ae-rectangle', 'Random rectangle', 3, 'debug',
            'A program picks a random width from 1 to 10 for a rectangle whose length is always 4. It should display the width, the length and the perimeter. There are <strong>three</strong> errors in the code. Amend the code to correct them. (3 marks)',
            C`
              width = random.randint(1, 10)
              length = 4
              perimeter = 2 * width + length
              print("Width:", Width)
              print("Length:", length)
              print("Perimeter:", perimeter)
            `,
            C`
              import random
              width = random.randint(1, 10)
              length = 4
              perimeter = 2 * (width + length)
              print("Width:", width)
              print("Length:", length)
              print("Perimeter:", perimeter)
            `,
            [{ seed: 5, out: 'Width: 10\nLength: 4\nPerimeter: 28' }, { seed: 1, out: 'Width: 3\nLength: 4\nPerimeter: 14' }, { seed: 2, out: 'Width: 1\nLength: 4\nPerimeter: 10' }, { seed: 9, py: 'assert perimeter == 2 * (width + length), "perimeter wrong"', hidden: true, has: ['Perimeter'] }],
            ['The first error message mentions `random`. A module must be imported before use.', 'Python variable names are case sensitive: `Width` and `width` are different.', 'The perimeter is two lots of (width + length). Brackets matter.']),
          { t: 'note', kind: 'key', title: 'Check before you stop', html: 'After fixing the stated number of errors, run the program with the example data in the question. If the output still does not match, a logic error is left even if the count seems complete: re-read the question for the rule you have not yet checked.' },
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-selection-bonus',
        title: 'Selection with and / or (bonus and tier rules)',
        time: '35 min',
        book: 'Ch 2 · selection',
        exam: 'Paper 2 · "complete the if statement"',
        summary: 'Turning a condition/output table into if / elif / else',
        intro: 'A table of conditions and outputs is turned into code. The marks come from the right comparison, the right and / or, the right order and not adding anything extra.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'The question gives a table: each row has a **condition** and an **output**. Read the rows top to bottom. In Python the first matching `if` / `elif` wins, so the order of the rows is part of the answer.' },
          { t: 'table', head: ['Table wording', 'Python'], rows: [
            ['"at least 10"', '`>= 10`'],
            ['"more than 10" / "over 10"', '`> 10`'],
            ['"10 or less" / "no more than 10"', '`<= 10`'],
            ['"A **and** B"', '`a_test and b_test`'],
            ['"A **or** B"', '`a_test or b_test`'],
            ['"all other inputs"', '`else:`'],
          ] },
          { t: 'note', kind: 'exam', html: 'Put the **strictest** rule first. If a row is a special case of another (for example "over 20 and profit at least 20" sits inside "at least 5 and profit at least 10"), test the special case first or it will never be reached. Write only the outputs in the table: extra text loses the mark.' },
          { t: 'note', kind: 'warn', html: '`and` is checked before `or`. If a row mixes both, use brackets to say what you mean: `a > 3 and (b > 2 or c > 5)`.' },
          { t: 'cases', title: 'One table, read three ways', intro: 'Rules: stall takings of at least 50 and at least 10 cakes sold gives "Good"; over 100 takings and over 30 cakes gives "Excellent"; otherwise "Check".', items: [
            { label: 'Wrong order', intro: 'Excellent can never be shown here, because every excellent day is also a good day.', code: C`
              takings = 120
              cakes = 35
              if takings >= 50 and cakes >= 10:
                  print("Good")
              elif takings > 100 and cakes > 30:
                  print("Excellent")
              else:
                  print("Check")
            ` },
            { label: 'Right order', code: C`
              takings = 120
              cakes = 35
              if takings > 100 and cakes > 30:
                  print("Excellent")
              elif takings >= 50 and cakes >= 10:
                  print("Good")
              else:
                  print("Check")
            ` },
            { label: 'With or', intro: 'Add a rule: poor day if takings are under 20 **or** fewer than 5 cakes.', code: C`
              takings = 15
              cakes = 40
              if takings < 20 or cakes < 5:
                  print("Poor")
              elif takings >= 50 and cakes >= 10:
                  print("Good")
              else:
                  print("Check")
            ` },
            { label: 'Mixed and / or', code: C`
              height = 125
              age = 9
              print(height >= 120 and (age >= 8 or height >= 140))
              print(height >= 120 and age >= 8 or height >= 140)
            ` },
          ] },
          { t: 'predict', code: C`
            takings = 80
            cakes = 12
            if takings < 20 or cakes < 5:
                print("Poor")
            elif takings >= 50 and cakes >= 10:
                print("Good")
            else:
                print("Check")
          `, why: 'Not poor (80 is not below 20 and 12 is not below 5). Both parts of the good rule are true.' },
          { t: 'parsons', prompt: 'Put the lines in order for: 8 percent bonus if takings are at least 1500 or plants sold at least 40; otherwise 4 percent if takings are at least 700 and plants at least 20; otherwise none.', lines: [
            'if takings >= 1500 or plants >= 40:',
            '    rate = 0.08',
            'elif takings >= 700 and plants >= 20:',
            '    rate = 0.04',
            'else:',
            '    rate = 0',
          ], why: 'The special top rule comes first; `elif` covers the second row; `else` is "all other cases".' },
          { t: 'tracetable', id: 'm15-tt-bonus', code: C`
            takings = 900
            plants = 25
            if takings >= 1500 or plants >= 40:
                rate = 0.08
            elif takings >= 700 and plants >= 20:
                rate = 0.04
            else:
                rate = 0
            bonus = 1000 * rate
          `, cols: ['takings', 'plants', 'rate', 'bonus'], prompt: 'Trace the bonus program for these values.' },
          { t: 'h', text: 'Your turn' },
          X('m15-ex-sb-garden', 'Garden centre bonus', 2, 'exam',
            'A garden centre pays staff a bonus based on the day\'s takings and plants sold. Input takings (whole pounds), plants sold, and the member of staff\'s wage (whole pounds).<br>• Takings of at least 1500 <strong>or</strong> at least 40 plants sold: bonus is 8% of the wage.<br>• Otherwise, takings of at least 700 <strong>and</strong> at least 20 plants sold: bonus is 4% of the wage.<br>• Otherwise no bonus.<br>Display <code>Bonus: </code> followed by the amount rounded to 2 decimal places. (5 marks)',
            C`
              takings = int(input("Takings: "))
              plants = int(input("Plants sold: "))
              wage = int(input("Wage: "))
              # complete the if statement
            `,
            C`
              takings = int(input("Takings: "))
              plants = int(input("Plants sold: "))
              wage = int(input("Wage: "))
              if takings >= 1500 or plants >= 40:
                  bonus = wage * 0.08
              elif takings >= 700 and plants >= 20:
                  bonus = wage * 0.04
              else:
                  bonus = 0
              print("Bonus:", round(bonus, 2))
            `,
            [{ in: ['1600', '10', '1000'], out: 'Bonus: 80.0' }, { in: ['500', '45', '1000'], out: 'Bonus: 80.0' }, { in: ['700', '20', '1000'], out: 'Bonus: 40.0' }, { in: ['699', '20', '1000'], out: 'Bonus: 0' }, { in: ['900', '19', '500'], out: 'Bonus: 0', hidden: true }, { in: ['1499', '39', '1250'], out: 'Bonus: 50.0', hidden: true }],
            ['Rule one uses `or`, rule two uses `and`.', 'Start with the 8% rule; `elif` for the 4% rule; `else` for no bonus.', '`round(x, 2)` rounds to two decimal places.']),
          X('m15-ex-sb-results', 'Music and drama results', 2, 'exam',
            'A teacher enters a pupil\'s Music mark and Drama mark (whole numbers out of 100). Display one message:<br>• both marks under 40: <code>Both subjects failed</code><br>• only one mark under 40: <code>One subject failed</code><br>• both marks at least 75: <code>Distinction in both</code><br>• anything else: <code>Both subjects passed</code> (6 marks)',
            C`
              music = int(input("Music mark: "))
              drama = int(input("Drama mark: "))
              # one message only
            `,
            C`
              music = int(input("Music mark: "))
              drama = int(input("Drama mark: "))
              if music < 40 and drama < 40:
                  print("Both subjects failed")
              elif music < 40 or drama < 40:
                  print("One subject failed")
              elif music >= 75 and drama >= 75:
                  print("Distinction in both")
              else:
                  print("Both subjects passed")
            `,
            [{ in: ['30', '20'], out: 'Both subjects failed' }, { in: ['39', '60'], out: 'One subject failed' }, { in: ['80', '39'], out: 'One subject failed', hidden: true }, { in: ['75', '90'], out: 'Distinction in both' }, { in: ['74', '90'], out: 'Both subjects passed' }, { in: ['40', '40'], out: 'Both subjects passed' }],
            ['"Both failed" is the special case of "one failed", so it must be tested first.', 'Use `and` for both, `or` for at least one.', 'After the failure rules, check distinction, then `else`.']),
          X('m15-ex-sb-cakes', 'Cake stall report', 2, 'exam',
            'A school stall inputs the number of cakes sold and the takings in pounds (both whole numbers) and displays one message:<br>• over 30 cakes and takings of at least 40: <code>Excellent day</code><br>• at least 10 cakes and takings of at least 15: <code>Good day</code><br>• under 10 cakes or takings under 5: <code>Poor day</code><br>• all other inputs: <code>Check the stall</code> (5 marks)',
            C`
              cakes = int(input("Cakes sold: "))
              takings = int(input("Takings: "))
              # complete the if statement
            `,
            C`
              cakes = int(input("Cakes sold: "))
              takings = int(input("Takings: "))
              if cakes > 30 and takings >= 40:
                  print("Excellent day")
              elif cakes >= 10 and takings >= 15:
                  print("Good day")
              elif cakes < 10 or takings < 5:
                  print("Poor day")
              else:
                  print("Check the stall")
            `,
            [{ in: ['31', '40'], out: 'Excellent day' }, { in: ['30', '60'], out: 'Good day' }, { in: ['10', '15'], out: 'Good day' }, { in: ['9', '50'], out: 'Poor day' }, { in: ['20', '4'], out: 'Poor day', hidden: true }, { in: ['20', '10'], out: 'Check the stall' }, { in: ['10', '5'], out: 'Check the stall', hidden: true }],
            ['"Excellent" is inside "Good", so test it first.', '"Over 30" means `> 30`; "at least 10" means `>= 10`.', 'The poor rule uses `or`. Anything left is `else`.']),
          X('m15-ex-sb-word', 'Alphabetical order', 2, 'exam',
            'The secret word is stored as <code>mango</code>. Input a word and compare it with the secret word, ignoring upper and lower case. Display the word the user typed (in lower case) followed by one of: <code>comes before mango</code>, <code>comes after mango</code> or <code>is the same word as mango</code>. For example <code>apple comes before mango</code>. (4 marks)',
            C`
              secret = "mango"
              word = input("Enter a word: ")
              # compare word with secret
            `,
            C`
              secret = "mango"
              word = input("Enter a word: ").lower()
              if word < secret:
                  print(word, "comes before", secret)
              elif word > secret:
                  print(word, "comes after", secret)
              else:
                  print(word, "is the same word as", secret)
            `,
            [{ in: ['apple'], out: 'apple comes before mango' }, { in: ['Orange'], out: 'orange comes after mango' }, { in: ['MANGO'], out: 'mango is the same word as mango' }, { in: ['mangoes'], out: 'mangoes comes after mango', hidden: true }, { in: ['Lime'], out: 'lime comes before mango', hidden: true }],
            ['`.lower()` makes both words comparable.', 'Python compares strings alphabetically with `<` and `>`.', 'Three outcomes: `<`, `>` and `else` (equal).']),
          X('m15-ex-sb-stickers', 'Sticker pack prices', 2, 'exam',
            'A shop sells stickers. The price of one sticker depends on the quantity bought: 1 to 9 stickers cost 3.00 each; 10 to 49 cost 2.50 each; 50 or more cost 2.00 each. Input the quantity (a whole number of 1 or more) and display <code>Price each: </code> then the price, and <code>Total: </code> then the total cost, both with 2 decimal places. (6 marks)',
            C`
              quantity = int(input("Quantity: "))
              # work out the price each, then the total
            `,
            C`
              quantity = int(input("Quantity: "))
              if quantity >= 50:
                  price = 2.00
              elif quantity >= 10:
                  price = 2.50
              else:
                  price = 3.00
              total = price * quantity
              print("Price each:", format(price, ".2f"))
              print("Total:", format(total, ".2f"))
            `,
            [{ in: ['5'], out: 'Price each: 3.00\nTotal: 15.00' }, { in: ['10'], out: 'Price each: 2.50\nTotal: 25.00' }, { in: ['9'], out: 'Price each: 3.00\nTotal: 27.00' }, { in: ['49'], out: 'Price each: 2.50\nTotal: 122.50', hidden: true }, { in: ['50'], out: 'Price each: 2.00\nTotal: 100.00' }, { in: ['1'], out: 'Price each: 3.00\nTotal: 3.00', hidden: true }],
            ['Start from the largest band so each `elif` is simple.', 'Total = price each multiplied by the quantity.', '`format(x, ".2f")` shows two decimal places.']),
          X('m15-ex-sb-ride', 'Theme park ride', 3, 'exam',
            'A ride has these rules. A rider 140 cm or taller is always allowed. A rider from 120 cm up to (but not including) 140 cm is allowed if they are 10 or older <strong>or</strong> are with an adult. Nobody under 120 cm is allowed. Input the height in cm, the age and whether an adult is with them (<code>yes</code> or <code>no</code>). Display <code>Allowed</code> or <code>Not allowed</code>. (6 marks)',
            C`
              height = int(input("Height in cm: "))
              age = int(input("Age: "))
              adult = input("With an adult (yes/no): ")
              # display Allowed or Not allowed
            `,
            C`
              height = int(input("Height in cm: "))
              age = int(input("Age: "))
              adult = input("With an adult (yes/no): ")
              if height >= 140:
                  print("Allowed")
              elif height >= 120 and (age >= 10 or adult == "yes"):
                  print("Allowed")
              else:
                  print("Not allowed")
            `,
            [{ in: ['150', '8', 'no'], out: 'Allowed' }, { in: ['125', '11', 'no'], out: 'Allowed' }, { in: ['125', '9', 'yes'], out: 'Allowed' }, { in: ['125', '9', 'no'], out: 'Not allowed' }, { in: ['119', '14', 'yes'], out: 'Not allowed', hidden: true }, { in: ['140', '5', 'no'], out: 'Allowed', hidden: true }, { in: ['120', '10', 'no'], out: 'Allowed', hidden: true }],
            ['Deal with the "always allowed" height first.', 'The middle rule needs brackets: height AND (age OR adult).', 'Everything else is not allowed.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-validation-formats',
        title: 'Validating formats and rejecting entries',
        time: '40 min',
        book: 'Ch 2 · validation',
        exam: 'Paper 2 · format codes, Error.txt tasks',
        summary: 'Format checks for IDs, emails and passwords; writing rejects to a file',
        intro: 'Two question styles keep returning: describe two extra validation tests for a code with a stated format, and write a program that checks a list of entries and sends the bad ones to an error file.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'A "format" rule says what each position of the text must be: letters, digits, one of a few allowed characters, or a fixed length. Break the rule into **separate small checks**. Each check can then be tested alone with one erroneous example that fails only that check.' },
          { t: 'table', head: ['Check', 'Python idea', 'Fails for'], rows: [
            ['Length is 7', '`len(code) == 7`', '`AB12CD`'],
            ['First two are capital letters', '`code[:2].isalpha() and code[:2].isupper()`', '`ab123xy`'],
            ['Characters 3 to 5 are digits', '`code[2:5].isdigit()`', '`ABx23yz`'],
            ['Last character is x or y', '`code[-1] in "xy"`', '`AB123xz`'],
            ['Contains one @', '`email.count("@") == 1`', '`ann.mail.com`'],
          ] },
          { t: 'note', kind: 'exam', html: 'In the "two additional validation tests" question, write the **test** as a question ("Are characters 3 to 5 digits?") and give example data that fails **only** that test. If your erroneous example also has the wrong length, it fails two tests and earns nothing.' },
          { t: 'cases', title: 'Format checks one at a time', items: [
            { label: 'Length and type', code: C`
              pin = "4821"
              print(len(pin) == 4, pin.isdigit())
              pin = "48a1"
              print(len(pin) == 4, pin.isdigit())
            ` },
            { label: 'Slices for positions', intro: 'Rule: two capital letters, then three digits, then x or y.', code: C`
              code = "KD207y"
              print(len(code) == 6)
              print(code[:2].isalpha() and code[:2].isupper())
              print(code[2:5].isdigit())
              print(code[-1] in "xy")
            ` },
            { label: 'Combining checks', code: C`
              def valid(code):
                  if len(code) != 6:
                      return False
                  if not (code[:2].isalpha() and code[:2].isupper()):
                      return False
                  if not code[2:5].isdigit():
                      return False
                  return code[-1] in "xy"
              for c in ["KD207y", "kD207y", "KD20y", "KD2o7y", "KD207z"]:
                  print(c, valid(c))
            ` },
            { label: 'Looping until valid', intro: 'A validation loop repeats the question until the answer passes.', code: C`
              while True:
                  pin = input("PIN: ")
                  if len(pin) == 4 and pin.isdigit():
                      break
                  print("Try again")
              print("Accepted")
            `, stdin: ['12', 'abcd', '4821'] },
          ] },
          { t: 'h', text: 'Worked example: rejects go to a file' },
          { t: 'p', html: 'The pattern for "write the failing entries to Error.txt": open the input file to read and the error file to write; for each line **strip** it, test it, and write the line (with a newline) only if it fails.' },
          { t: 'code', title: 'Emails without an @ are written to Error.txt', caption: 'Look at the Output panel: it shows the file the program wrote.', files: { 'emails.txt': 'ann@mail.com\nbob.mail.com\ncy@home.org\n' }, code: C`
            infile = open("emails.txt", "r")
            errors = open("Error.txt", "w")
            for line in infile:
                email = line.strip()
                if "@" not in email:
                    errors.write(email + "\n")
            infile.close()
            errors.close()
          ` },
          { t: 'note', kind: 'warn', html: 'Forget `"\\n"` and all the rejects run together on one line. Forget `.strip()` and each email still carries the newline from the input file, so the output file gets blank lines.' },
          { t: 'sort', prompt: 'Sort each check by what it tests.', cats: ['Length check', 'Type check', 'Format check', 'Range check'], items: [
            { text: 'len(pin) == 4', cat: 0 }, { text: 'pin.isdigit()', cat: 1 }, { text: 'code[-1] in "xy"', cat: 2 }, { text: '1 <= age <= 120', cat: 3 }, { text: 'len(name) <= 20', cat: 0 }, { text: 'email.count("@") == 1', cat: 2 },
          ], why: 'Length checks use len(). Type checks ask what kind of characters or number it is. Format checks look at positions or required characters. Range checks use comparison limits.' },
          { t: 'predict', code: C`
            code = "AB123x"
            print(code[:2].isalpha(), code[2:5].isdigit(), code[-1] in "xy")
          `, why: '"AB" is letters, "123" is digits, and the last character x is in "xy".' },
          { t: 'quiz', q: 'A code is two capital letters then three digits. Which input fails ONLY the "three digits" test?', options: ['AB12', 'AB12C', 'ab123', 'AB1x3'], answer: 3, why: '"AB1x3" has the right length (5) and the right letters, but the characters at positions 3 to 5 are not all digits. "AB12" fails length too; "ab123" fails the capital-letter test.' },
          { t: 'tracetable', id: 'm15-tt-pin', code: C`
            pin = "12"
            ok = len(pin) == 4 and pin.isdigit()
            pin = "4821"
            ok = len(pin) == 4 and pin.isdigit()
          `, cols: ['pin', 'ok'], prompt: 'Trace the PIN check twice.' },
          { t: 'h', text: 'Your turn' },
          X('m15-ex-vf-code', 'Locker code checker', 2, 'exam',
            'A gym locker code has 7 characters: three capital letters, then three digits, then the letter <code>x</code> or <code>y</code>. For example <code>ABC123x</code>. Write the function <code>check_code(code)</code> that returns the first rule that fails, checking in this order: <code>Wrong length</code>, <code>First three must be capital letters</code>, <code>Next three must be digits</code>, <code>Last character must be x or y</code>. If every rule passes it returns <code>Valid</code>. (7 marks)',
            C`
              def check_code(code):
                  pass
            `,
            C`
              def check_code(code):
                  if len(code) != 7:
                      return "Wrong length"
                  if not (code[:3].isalpha() and code[:3].isupper()):
                      return "First three must be capital letters"
                  if not code[3:6].isdigit():
                      return "Next three must be digits"
                  if code[6] not in "xy":
                      return "Last character must be x or y"
                  return "Valid"
            `,
            [
              { py: 'assert check_code("ABC123x") == "Valid" and check_code("QRS000y") == "Valid", "valid codes"', label: 'valid codes' },
              { py: 'assert check_code("ABC12x") == "Wrong length" and check_code("ABC1234x") == "Wrong length", "length"', label: 'length rule' },
              { py: 'assert check_code("AbC123x") == "First three must be capital letters" and check_code("AB1123x") == "First three must be capital letters", "letters"', label: 'letters rule' },
              { py: 'assert check_code("ABCx23y") == "Next three must be digits" and check_code("ABC1 3x") == "Next three must be digits", "digits"', label: 'digits rule' },
              { py: 'assert check_code("ABC123z") == "Last character must be x or y", "last"', label: 'last character rule', hidden: true },
              { py: 'assert check_code("abc123z") == "First three must be capital letters", "order of checks"', label: 'order of checks', hidden: true },
            ],
            ['Use `return` in each `if`, so the first failing rule ends the function.', 'Slices: `code[:3]` is the letters, `code[3:6]` the digits, `code[6]` the last character.', 'Capital letters: both `.isalpha()` and `.isupper()` are needed, because `"A1B".isupper()` is True.']),
          X('m15-ex-vf-emails', 'Email list checker', 2, 'exam',
            '<code>emails.txt</code> holds one email address per line. An address is valid if it contains exactly one <code>@</code> and at least one <code>.</code> after the <code>@</code>. Write a program that writes every invalid address (one per line, no blank lines) to <code>Error.txt</code> and then displays <code>Rejected: </code> followed by how many were rejected. Ignore blank lines in the input. (7 marks)',
            C`
              infile = open("emails.txt", "r")
              # check each address
              infile.close()
            `,
            C`
              infile = open("emails.txt", "r")
              errors = open("Error.txt", "w")
              count = 0
              for line in infile:
                  email = line.strip()
                  if email == "":
                      continue
                  valid = False
                  if email.count("@") == 1:
                      after = email.split("@")[1]
                      if "." in after:
                          valid = True
                  if not valid:
                      errors.write(email + "\n")
                      count = count + 1
              infile.close()
              errors.close()
              print("Rejected:", count)
            `,
            [
              { files: { 'emails.txt': 'ann@mail.com\nbob.mail.com\ncy@school\ndi@x@y.com\neve@home.org\n' }, out: 'Rejected: 3', files_out: { 'Error.txt': 'bob.mail.com\ncy@school\ndi@x@y.com\n' } },
              { files: { 'emails.txt': 'a@b.co\nc@d.org\n' }, out: 'Rejected: 0', files_out: { 'Error.txt': '' } },
              { files: { 'emails.txt': 'nodomain\n\n@\nx@y.z\n' }, out: 'Rejected: 2', files_out: { 'Error.txt': 'nodomain\n@\n' }, hidden: true },
              { files: { 'emails.txt': 'only@one\n' }, out: 'Rejected: 1', files_out: { 'Error.txt': 'only@one\n' } },
            ],
            ['`email.count("@")` tells you how many @ symbols there are.', '`email.split("@")[1]` is the part after the @.', 'Write rejects with `errors.write(email + "\\n")` and keep a counter.']),
          X('m15-ex-vf-passwords', 'Weak password finder', 2, 'exam',
            '<code>passwords.txt</code> holds one password per line. A password is <strong>weak</strong> if it is shorter than 8 characters, or contains no digit, or contains a space. For each weak password display <code>Weak: </code> then the password. After all passwords have been checked display <code>Weak passwords: </code> and the count. (6 marks)',
            C`
              file = open("passwords.txt", "r")
              # check each password
              file.close()
            `,
            C`
              file = open("passwords.txt", "r")
              weak = 0
              for line in file:
                  pw = line.strip()
                  has_digit = False
                  for ch in pw:
                      if ch.isdigit():
                          has_digit = True
                  if len(pw) < 8 or not has_digit or " " in pw:
                      print("Weak:", pw)
                      weak = weak + 1
              file.close()
              print("Weak passwords:", weak)
            `,
            [
              { files: { 'passwords.txt': 'sunshine1\nabc123\nlongpassword\nhello wor1d\nGoodOne99\n' }, out: 'Weak: abc123\nWeak: longpassword\nWeak: hello wor1d\nWeak passwords: 3' },
              { files: { 'passwords.txt': 'Strong2pass\nAnother8ok\n' }, out: 'Weak passwords: 0' },
              { files: { 'passwords.txt': '1234567\n12345678\n' }, out: 'Weak: 1234567\nWeak passwords: 1', hidden: true },
            ],
            ['Loop through each character of the password to look for a digit.', 'Use `or` to join the three weak conditions.', 'Remember `.strip()` on each line before you test it.']),
          X('m15-ex-vf-pin', 'PIN entry loop', 1, 'exam',
            'A phone lock needs a PIN of exactly 4 digits. Repeatedly input a PIN. If it is not valid display <code>Invalid PIN, try again</code>. When a valid PIN is entered display <code>PIN accepted</code> and then <code>Attempts: </code> followed by the number of attempts taken. (5 marks)',
            C`
              attempts = 0
              # repeat until the PIN is valid
            `,
            C`
              attempts = 0
              while True:
                  pin = input("PIN: ")
                  attempts = attempts + 1
                  if len(pin) == 4 and pin.isdigit():
                      break
                  print("Invalid PIN, try again")
              print("PIN accepted")
              print("Attempts:", attempts)
            `,
            [{ in: ['4821'], out: 'PIN accepted\nAttempts: 1' }, { in: ['12', 'abcd', '5555'], out: 'Invalid PIN, try again\nInvalid PIN, try again\nPIN accepted\nAttempts: 3' }, { in: ['123', '12345', '0000'], out: 'Invalid PIN, try again\nInvalid PIN, try again\nPIN accepted\nAttempts: 3', hidden: true }, { in: ['12a4', '1234'], out: 'Invalid PIN, try again\nPIN accepted\nAttempts: 2' }],
            ['Use `while True` and `break` once the PIN is valid.', 'Add 1 to `attempts` straight after each input.', 'A valid PIN passes both `len(pin) == 4` and `pin.isdigit()`.']),
          X('m15-ex-vf-studentid', 'Student ID check digit', 3, 'exam',
            'A student ID has 6 digits. The last digit is a check digit: it equals the total of the first five digits, divided by 10, remainder only. For example <code>123455</code> is valid because 1+2+3+4+5 = 15 and the remainder after dividing by 10 is 5. Write <code>valid_id(s)</code> that returns <code>True</code> only if <code>s</code> is exactly 6 characters, all digits, and the check digit is correct. (6 marks)',
            C`
              def valid_id(s):
                  pass
            `,
            C`
              def valid_id(s):
                  if len(s) != 6 or not s.isdigit():
                      return False
                  total = 0
                  for ch in s[:5]:
                      total = total + int(ch)
                  return total % 10 == int(s[5])
            `,
            [
              { py: 'assert valid_id("123455") is True and valid_id("000000") is True and valid_id("999995") is True, "valid ids"', label: 'valid IDs accepted' },
              { py: 'assert valid_id("123456") is False and valid_id("999999") is False, "wrong check digit"', label: 'wrong check digit' },
              { py: 'assert valid_id("12345") is False and valid_id("1234555") is False, "length"', label: 'wrong length' },
              { py: 'assert valid_id("12a455") is False and valid_id("12 455") is False, "type"', label: 'non-digits', hidden: true },
            ],
            ['Check the length and `isdigit()` first, so `int(ch)` can never crash.', 'Add up `int(ch)` for each of the first five characters, `s[:5]`.', 'Compare `total % 10` with `int(s[5])`.']),
          X('m15-ex-vf-date', 'Date format', 3, 'exam',
            'A form needs dates in the form <code>dd/mm/yyyy</code>, for example <code>25/12/2024</code>. Write <code>valid_date(s)</code> that returns <code>True</code> only when: the text is 10 characters; characters 3 and 6 are <code>/</code>; all other characters are digits; the day is 1 to 31; the month is 1 to 12; the year is 1900 to 2100. You do not need to check the number of days in each month. (8 marks)',
            C`
              def valid_date(s):
                  pass
            `,
            C`
              def valid_date(s):
                  if len(s) != 10:
                      return False
                  if s[2] != "/" or s[5] != "/":
                      return False
                  day, month, year = s[:2], s[3:5], s[6:]
                  if not (day.isdigit() and month.isdigit() and year.isdigit()):
                      return False
                  if not 1 <= int(day) <= 31:
                      return False
                  if not 1 <= int(month) <= 12:
                      return False
                  return 1900 <= int(year) <= 2100
            `,
            [
              { py: 'assert valid_date("25/12/2024") and valid_date("01/01/1900") and valid_date("31/12/2100"), "valid dates"', label: 'valid dates' },
              { py: 'assert not valid_date("5/12/2024") and not valid_date("25/12/24"), "length"', label: 'wrong length' },
              { py: 'assert not valid_date("25-12-2024") and not valid_date("25/12-2024"), "separators"', label: 'separators' },
              { py: 'assert not valid_date("32/01/2024") and not valid_date("00/05/2024") and not valid_date("15/13/2024") and not valid_date("15/00/2024"), "ranges"', label: 'day and month ranges' },
              { py: 'assert not valid_date("15/06/1899") and not valid_date("15/06/2101") and not valid_date("ab/06/2024") and not valid_date("15/06/20x4"), "year and digits"', label: 'year and digits', hidden: true },
            ],
            ['Check the length and the two slashes first.', 'Slice the three parts: `s[:2]`, `s[3:5]`, `s[6:]`. Check `isdigit()` before `int()`.', 'Chain range checks like `1 <= int(day) <= 31`.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-arrays-1d',
        title: 'One-dimensional arrays: counts, totals and extremes',
        time: '40 min',
        book: 'Ch 2 · arrays',
        exam: 'Paper 2 · data analysis programs',
        summary: 'Counts, totals, averages, highest and lowest, and searching a list',
        intro: 'Big analysis questions (12 to 20 marks) are made of small list patterns. Learn each pattern separately and the long question becomes a checklist.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'You are given data in a list (or told the data is in a file) and asked to display several results. Each bullet in the question is usually one of five patterns. The words "should work even if the number of items changes" mean you must use `len()` and loops, never a fixed number like `5`.' },
          { t: 'table', head: ['The question says…', 'Pattern', 'Core idea'], rows: [
            ['"total" / "average"', 'Accumulator', '`total = total + x` then `total / len(items)`'],
            ['"how many are over / under …"', 'Counter', '`if x > limit: count = count + 1`'],
            ['"highest" / "lowest"', 'Max / min tracking', 'start with the first item; replace when you find a better one'],
            ['"which position / which pupil"', 'Remember the index', 'track the index `i` as well as the value'],
            ['"display all that…"', 'Filter', 'loop and `print` only when the test passes'],
          ] },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode names these as `FOR EACH x FROM items DO`, `LENGTH(items)` and `items[i]`. In Python: `for x in items:`, `len(items)` and `items[i]`. Indexes start at 0 in both, so item "number 3" in a story is `items[2]`.' },
          { t: 'cases', title: 'The five patterns on one list', items: [
            { label: 'Total and average', code: C`
              delays = [3, 0, 12, 7, 5]
              total = 0
              for d in delays:
                  total = total + d
              print("Total:", total)
              print("Average:", total / len(delays))
            ` },
            { label: 'Counting matches', code: C`
              delays = [3, 0, 12, 7, 5]
              late = 0
              for d in delays:
                  if d > 5:
                      late = late + 1
              print("Late:", late)
            ` },
            { label: 'Highest and its position', intro: 'Start with the first item, not with 0.', code: C`
              delays = [3, 0, 12, 7, 5]
              highest = delays[0]
              where = 0
              for i in range(len(delays)):
                  if delays[i] > highest:
                      highest = delays[i]
                      where = i
              print("Highest", highest, "at index", where)
            ` },
            { label: 'Display all that match', code: C`
              delays = [3, 0, 12, 7, 5]
              for d in delays:
                  if d == 0:
                      print("A train was on time")
                  elif d > 5:
                      print("Late by", d)
            ` },
            { label: 'Empty list trap', expectError: true, intro: 'Dividing by `len(items)` fails on an empty list, and `items[0]` fails too.', code: C`
              items = []
              print(sum(items) / len(items))
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'Starting `highest = 0` fails if every value is negative (for example temperatures in winter). Starting with `highest = items[0]` works for any data.' },
          { t: 'predict', code: C`
            scores = [4, 9, 2, 9, 5]
            best = scores[0]
            for i in range(1, len(scores)):
                if scores[i] > best:
                    best = scores[i]
            print(best, scores.index(best))
          `, why: '`>` only replaces the best on a strictly higher value, so the first 9 (index 1) stays. `index` also returns the first position.' },
          { t: 'quiz', q: 'Which loop gives the correct average of the list `marks`?', options: ['`total = 0` before the loop, then `average = total / len(marks)` after the loop', '`total = 0` inside the loop', 'Divide by 5 every time', '`average = total / len(marks)` inside the loop'], answer: 0, why: 'The total must be set once before the loop and divided once after it. Dividing by `len(marks)` (not 5) keeps the program correct if the list changes length.' },
          { t: 'tracetable', id: 'm15-tt-delays', code: C`
            delays = [3, 0, 12]
            total = 0
            for d in delays:
                total = total + d
            print(total)
          `, cols: ['d', 'total'], output: true, prompt: 'Trace the total of three train delays.' },
          { t: 'h', text: 'Your turn' },
          { t: 'p', html: 'These programs read their data from one line typed by the user, separated by commas, so the same program works for any number of items. The first lines that turn the text into a list are given.' },
          X('m15-ex-a1-delays', 'Train delays summary', 2, 'exam',
            'The delays (in whole minutes) of a day\'s trains are entered on one line separated by commas. Complete the program to display on separate lines: <code>Total delay: </code> and the total; <code>Average delay: </code> and the mean to 1 decimal place; <code>Late trains: </code> and the number of trains delayed by more than 5 minutes. The program must work for any number of trains. (6 marks)',
            C`
              text = input("Delays: ")
              delays = []
              for item in text.split(","):
                  delays.append(int(item))
              # complete the program
            `,
            C`
              text = input("Delays: ")
              delays = []
              for item in text.split(","):
                  delays.append(int(item))
              total = 0
              late = 0
              for d in delays:
                  total = total + d
                  if d > 5:
                      late = late + 1
              print("Total delay:", total)
              print("Average delay:", round(total / len(delays), 1))
              print("Late trains:", late)
            `,
            [{ in: ['3,0,12,7,5'], out: 'Total delay: 27\nAverage delay: 5.4\nLate trains: 2' }, { in: ['10,10'], out: 'Total delay: 20\nAverage delay: 10.0\nLate trains: 2' }, { in: ['0,0,0'], out: 'Total delay: 0\nAverage delay: 0.0\nLate trains: 0' }, { in: ['6'], out: 'Total delay: 6\nAverage delay: 6.0\nLate trains: 1', hidden: true }, { in: ['5,5,5,5'], out: 'Total delay: 20\nAverage delay: 5.0\nLate trains: 0', hidden: true }],
            ['Use one loop to build the total and the count together.', '"More than 5" is `> 5`.', 'Use `len(delays)` for the average, never a fixed number.']),
          X('m15-ex-a1-extremes', 'Best and worst score', 2, 'exam',
            'Quiz scores are entered on one line, separated by commas. Complete the program to display <code>Highest: </code> followed by the highest score, <code>at position </code> and its position counting from 1 (the first one if there is a tie). Then display the lowest score and its position in the same style. Example: <code>Highest: 72 at position 2</code>. (6 marks)',
            C`
              scores = []
              for item in input("Scores: ").split(","):
                  scores.append(int(item))
              # find the highest and the lowest
            `,
            C`
              scores = []
              for item in input("Scores: ").split(","):
                  scores.append(int(item))
              high = scores[0]
              high_pos = 1
              low = scores[0]
              low_pos = 1
              for i in range(len(scores)):
                  if scores[i] > high:
                      high = scores[i]
                      high_pos = i + 1
                  if scores[i] < low:
                      low = scores[i]
                      low_pos = i + 1
              print("Highest:", high, "at position", high_pos)
              print("Lowest:", low, "at position", low_pos)
            `,
            [{ in: ['40,72,15,72,15'], out: 'Highest: 72 at position 2\nLowest: 15 at position 3' }, { in: ['9'], out: 'Highest: 9 at position 1\nLowest: 9 at position 1' }, { in: ['-5,-2,-9,-2'], out: 'Highest: -2 at position 2\nLowest: -9 at position 3' }, { in: ['1,2,3,4,5'], out: 'Highest: 5 at position 5\nLowest: 1 at position 1', hidden: true }],
            ['Start both `high` and `low` from the first score, not from 0.', 'Loop with `range(len(scores))` so you know `i`.', 'Positions count from 1, so store `i + 1`.']),
          X('m15-ex-a1-medals', 'Top scorers', 3, 'exam',
            'A football club enters each player and goals on one line like <code>Ann:4,Raj:1,Mei:7</code>. The program turns this into two lists, <code>names</code> and <code>goals</code> (given). Complete it to display the gold, silver and bronze medal winners (the three highest goals; assume no ties) in the form <code>Gold: Mei (7)</code>, then <code>Fewer than 3 goals: </code> followed by the names of players with fewer than 3 goals in the original order, separated by commas and a space, or <code>none</code>. At least three players are entered. (10 marks)',
            C`
              names = []
              goals = []
              for pair in input("Players: ").split(","):
                  parts = pair.split(":")
                  names.append(parts[0])
                  goals.append(int(parts[1]))
              # medals, then the players with fewer than 3 goals
            `,
            C`
              names = []
              goals = []
              for pair in input("Players: ").split(","):
                  parts = pair.split(":")
                  names.append(parts[0])
                  goals.append(int(parts[1]))
              used = []
              medals = ["Gold", "Silver", "Bronze"]
              for medal in medals:
                  best = -1
                  for i in range(len(goals)):
                      if i not in used and (best == -1 or goals[i] > goals[best]):
                          best = i
                  used.append(best)
                  print(medal + ":", names[best], "(" + str(goals[best]) + ")")
              low = []
              for i in range(len(goals)):
                  if goals[i] < 3:
                      low.append(names[i])
              if len(low) == 0:
                  print("Fewer than 3 goals: none")
              else:
                  print("Fewer than 3 goals: " + ", ".join(low))
            `,
            [{ in: ['Ann:4,Raj:1,Mei:7,Tom:2,Zoe:5'], out: 'Gold: Mei (7)\nSilver: Zoe (5)\nBronze: Ann (4)\nFewer than 3 goals: Raj, Tom' }, { in: ['A:9,B:8,C:7'], out: 'Gold: A (9)\nSilver: B (8)\nBronze: C (7)\nFewer than 3 goals: none' }, { in: ['Lia:0,Max:3,Nia:10,Ola:6,Pat:2,Quin:8'], out: 'Gold: Nia (10)\nSilver: Quin (8)\nBronze: Ola (6)\nFewer than 3 goals: Lia, Pat', hidden: true }, { in: ['X:1,Y:2,Z:3'], out: 'Gold: Z (3)\nSilver: Y (2)\nBronze: X (1)\nFewer than 3 goals: X, Y', hidden: true }],
            ['To find the best three, find the highest index, remember it, then find the best of the rest.', 'Keep a list `used` of indexes already given a medal.', 'Build the low scorers in a new list, then use `", ".join(low)`.']),
          X('m15-ex-a1-findall', 'Find every match', 2, 'exam',
            'A list of sensor readings is entered on the first line (comma separated) and a reading to look for on the second line. Display <code>Found at index: </code> followed by every index (counting from 0) where it appears, separated by a comma and a space, then <code>Times found: </code> and the count. If it does not appear display <code>Not found</code> only. (6 marks)',
            C`
              readings = []
              for item in input("Readings: ").split(","):
                  readings.append(int(item))
              target = int(input("Look for: "))
              # find every position
            `,
            C`
              readings = []
              for item in input("Readings: ").split(","):
                  readings.append(int(item))
              target = int(input("Look for: "))
              found = []
              for i in range(len(readings)):
                  if readings[i] == target:
                      found.append(str(i))
              if len(found) == 0:
                  print("Not found")
              else:
                  print("Found at index: " + ", ".join(found))
                  print("Times found:", len(found))
            `,
            [{ in: ['4,9,2,9,7,9', '9'], out: 'Found at index: 1, 3, 5\nTimes found: 3' }, { in: ['4,9,2', '5'], out: 'Not found' }, { in: ['7', '7'], out: 'Found at index: 0\nTimes found: 1' }, { in: ['1,2,3,2', '3'], out: 'Found at index: 2\nTimes found: 1', hidden: true }],
            ['Collect the matching indexes in a list called `found`.', '`", ".join(...)` needs strings, so store `str(i)`.', 'Test `len(found) == 0` after the loop for "Not found".']),
          X('m15-ex-a1-below', 'Below the average', 2, 'exam',
            'Daily temperatures are entered on one line, separated by commas, as whole numbers. Display <code>Average: </code> and the mean to 1 decimal place. Then display <code>Below average: </code> and each temperature that is lower than the mean, in the original order, one per line. Finally display <code>Count: </code> and how many were below average. (7 marks)',
            C`
              temps = []
              for item in input("Temperatures: ").split(","):
                  temps.append(int(item))
              # average, then the values below it
            `,
            C`
              temps = []
              for item in input("Temperatures: ").split(","):
                  temps.append(int(item))
              mean = sum(temps) / len(temps)
              print("Average:", round(mean, 1))
              count = 0
              for t in temps:
                  if t < mean:
                      print("Below average:", t)
                      count = count + 1
              print("Count:", count)
            `,
            [{ in: ['12,15,9,20'], out: 'Average: 14.0\nBelow average: 12\nBelow average: 9\nCount: 2' }, { in: ['5,5,5'], out: 'Average: 5.0\nCount: 0' }, { in: ['1,2,2,11'], out: 'Average: 4.0\nBelow average: 1\nBelow average: 2\nBelow average: 2\nCount: 3', hidden: true }, { in: ['-4,0,4'], out: 'Average: 0.0\nBelow average: -4\nCount: 1' }],
            ['Work out the mean first: `sum(temps) / len(temps)`.', 'Compare each value with the **unrounded** mean.', 'A counter and a `print` can live inside the same `if`.']),
          X('m15-ex-a1-rises', 'Rising temperatures', 3, 'exam',
            'Daily temperatures are entered on one line (whole numbers, comma separated, days numbered from 1). A day is a "rise" if it is warmer than the day before. Display <code>Rise on day N</code> for each rise, then <code>Total rises: </code> and the count, then <code>Longest rising run: </code> and the greatest number of rises in a row (0 if none). (9 marks)',
            C`
              temps = []
              for item in input("Temperatures: ").split(","):
                  temps.append(int(item))
              # compare each day with the one before
            `,
            C`
              temps = []
              for item in input("Temperatures: ").split(","):
                  temps.append(int(item))
              total = 0
              run = 0
              longest = 0
              for i in range(1, len(temps)):
                  if temps[i] > temps[i - 1]:
                      print("Rise on day", i + 1)
                      total = total + 1
                      run = run + 1
                      if run > longest:
                          longest = run
                  else:
                      run = 0
              print("Total rises:", total)
              print("Longest rising run:", longest)
            `,
            [{ in: ['14,16,15,18,19,17'], out: 'Rise on day 2\nRise on day 4\nRise on day 5\nTotal rises: 3\nLongest rising run: 2' }, { in: ['5,4,3'], out: 'Total rises: 0\nLongest rising run: 0' }, { in: ['1,2,3,4'], out: 'Rise on day 2\nRise on day 3\nRise on day 4\nTotal rises: 3\nLongest rising run: 3' }, { in: ['9'], out: 'Total rises: 0\nLongest rising run: 0', hidden: true }, { in: ['3,3,4,2,5,6'], out: 'Rise on day 3\nRise on day 5\nRise on day 6\nTotal rises: 3\nLongest rising run: 2', hidden: true }],
            ['Loop `for i in range(1, len(temps))` so `temps[i - 1]` always exists.', 'Day number = `i + 1`.', 'A run counter goes up on a rise and resets to 0 otherwise; keep the largest value seen.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-arrays-2d',
        title: 'Two-dimensional arrays: tables of data',
        time: '40 min',
        book: 'Ch 2 · 2D arrays',
        exam: 'Paper 2 · tables, grids and pairs',
        summary: 'Row totals, column totals, searching a grid and processing pairs',
        intro: 'A 2D array is a table: a list of rows, where each row is itself a list. Past papers use it for sales tables, seating plans, word pairs and test results.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'Every 2D question comes down to **which way you walk the table**. Row by row means one loop over the rows and (usually) an inner loop over the items in that row. Column by column means the outer loop counts column numbers and the inner loop visits each row.' },
          { t: 'html', html: '<div class="cells"><div class="c"><b>10</b><i>[0][0]</i></div><div class="c"><b>20</b><i>[0][1]</i></div><div class="c"><b>30</b><i>[0][2]</i></div></div><div class="cells"><div class="c"><b>5</b><i>[1][0]</i></div><div class="c"><b>25</b><i>[1][1]</i></div><div class="c"><b>5</b><i>[1][2]</i></div></div>' },
          { t: 'table', head: ['Task', 'Loop shape', 'Reset needed?'], rows: [
            ['Total of each row', 'for each row: total = 0, then for each item', 'Yes: `total = 0` at the start of every row'],
            ['Total of each column', 'for col in range(len(grid[0])): total = 0, then for each row', 'Yes: at the start of every column'],
            ['Search for a value', 'row loop, column loop, stop when found', 'No'],
            ['Process a pair at a time', 'one loop over the rows; use `row[0]` and `row[1]`', 'No'],
          ] },
          { t: 'note', kind: 'exam', html: '"The program should work even if the number of rows or columns changes" means: never write `range(4)`. Use `len(grid)` for the number of rows and `len(grid[0])` for the number of columns.' },
          { t: 'cases', title: 'Walking a table', items: [
            { label: 'Row totals', intro: 'Press **Trace**: watch `total` reset for each row.', code: C`
              sales = [[10, 20, 30], [5, 25, 5]]
              for r in range(len(sales)):
                  total = 0
                  for c in range(len(sales[r])):
                      total = total + sales[r][c]
                  print("Row", r, "total", total)
            ` },
            { label: 'Column totals', code: C`
              sales = [[10, 20, 30], [5, 25, 5]]
              for c in range(len(sales[0])):
                  total = 0
                  for r in range(len(sales)):
                      total = total + sales[r][c]
                  print("Column", c, "total", total)
            ` },
            { label: 'Search a grid', code: C`
              grid = [[3, 8, 1], [9, 4, 6]]
              target = 4
              found = False
              for r in range(len(grid)):
                  for c in range(len(grid[r])):
                      if grid[r][c] == target:
                          print("Found at row", r, "column", c)
                          found = True
              if not found:
                  print("Not found")
            ` },
            { label: 'Pairs of words', code: C`
              pairs = [["apple", "banana"], ["wrist", "leg"]]
              for row in pairs:
                  first = row[0]
                  second = row[1]
                  if first > second:
                      print(first, second, "is out of order")
                  else:
                      print(first, second, "is in order")
            ` },
            { label: 'Shared-row trap', intro: 'Building a grid with `*` copies the same row. Changing one cell changes every row.', code: C`
              wrong = [[0] * 3] * 2
              wrong[0][1] = 9
              print(wrong)
              right = [[0] * 3 for r in range(2)]
              right[0][1] = 9
              print(right)
            ` },
          ] },
          { t: 'predict', code: C`
            table = [[1, 2], [3, 4], [5, 6]]
            total = 0
            for row in table:
                total = total + row[1]
            print(total, len(table), len(table[0]))
          `, why: 'Column 1 holds 2, 4 and 6 (total 12). There are 3 rows and 2 columns.' },
          { t: 'quiz', q: 'What does `grid[2][0]` mean?', options: ['Row 2, column 0 (the third row, first item)', 'Row 0, column 2', 'The first two rows', 'The item at position 20'], answer: 0, why: 'The first index chooses the row, the second chooses the item within that row. Both count from 0.' },
          { t: 'tracetable', id: 'm15-tt-rowtotals', code: C`
            grid = [[2, 3], [4, 1]]
            for row in grid:
                total = 0
                for x in row:
                    total = total + x
                print(total)
          `, cols: ['total', 'x'], output: true, prompt: 'Trace the row totals.' },
          { t: 'h', text: 'Your turn' },
          { t: 'p', html: 'The first lines of each program (which read the table from the keyboard) are given. You write the analysis.' },
          X('m15-ex-a2-gradebook', 'Class gradebook', 2, 'exam',
            'The number of students is entered first, then one line of test marks per student (comma separated). The program stores them in the 2D list <code>marks</code>. Complete it to display <code>Student N: </code> and each student\'s total (N counts from 1), then <code>Class total: </code> and the total of all marks, then <code>Top student: </code> and the number of the student with the highest total (the first one if there is a tie). (8 marks)',
            C`
              rows = int(input("Number of students: "))
              marks = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  marks.append(row)
              # totals, class total and top student
            `,
            C`
              rows = int(input("Number of students: "))
              marks = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  marks.append(row)
              class_total = 0
              best = -1
              best_student = 0
              for r in range(len(marks)):
                  total = 0
                  for c in range(len(marks[r])):
                      total = total + marks[r][c]
                  print("Student " + str(r + 1) + ":", total)
                  class_total = class_total + total
                  if total > best:
                      best = total
                      best_student = r + 1
              print("Class total:", class_total)
              print("Top student:", best_student)
            `,
            [{ in: ['3', '10,20,30', '5,5,5', '40,0,1'], out: 'Student 1: 60\nStudent 2: 15\nStudent 3: 41\nClass total: 116\nTop student: 1' }, { in: ['2', '1,1', '2,2'], out: 'Student 1: 2\nStudent 2: 4\nClass total: 6\nTop student: 2' }, { in: ['1', '7,8,9'], out: 'Student 1: 24\nClass total: 24\nTop student: 1', hidden: true }, { in: ['3', '5,5', '5,5', '1,1'], out: 'Student 1: 10\nStudent 2: 10\nStudent 3: 2\nClass total: 22\nTop student: 1', hidden: true }],
            ['Reset the row total to 0 at the start of each row.', 'Add each row total to a running `class_total`.', 'Compare with `>` (not `>=`) so the first student wins a tie. Student number is `r + 1`.']),
          X('m15-ex-a2-columns', 'Monthly sales', 2, 'exam',
            'Each row of a table holds one product\'s sales for several months. The number of products is entered first, then one comma separated line per product. Complete the program to display <code>Month M: </code> and the total sales of all products for that month (M counts from 1) and finally <code>Best month: </code> and the number of the month with the highest total (the first if there is a tie). The program must work for any number of products and months. (8 marks)',
            C`
              rows = int(input("Number of products: "))
              sales = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  sales.append(row)
              # column totals
            `,
            C`
              rows = int(input("Number of products: "))
              sales = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  sales.append(row)
              best = -1
              best_month = 0
              for c in range(len(sales[0])):
                  total = 0
                  for r in range(len(sales)):
                      total = total + sales[r][c]
                  print("Month " + str(c + 1) + ":", total)
                  if total > best:
                      best = total
                      best_month = c + 1
              print("Best month:", best_month)
            `,
            [{ in: ['2', '10,20,30', '5,25,5'], out: 'Month 1: 15\nMonth 2: 45\nMonth 3: 35\nBest month: 2' }, { in: ['1', '4,9,2,9'], out: 'Month 1: 4\nMonth 2: 9\nMonth 3: 2\nMonth 4: 9\nBest month: 2' }, { in: ['3', '1,1', '1,1', '1,3'], out: 'Month 1: 3\nMonth 2: 5\nBest month: 2', hidden: true }, { in: ['2', '8,1,1', '8,2,1'], out: 'Month 1: 16\nMonth 2: 3\nMonth 3: 2\nBest month: 1' }],
            ['The outer loop is over **columns**: `range(len(sales[0]))`.', 'Reset `total` for every column, then add `sales[r][c]` for every row.', 'Month number is `c + 1`.']),
          X('m15-ex-a2-seats', 'Cinema seating plan', 3, 'exam',
            'A cinema plan shows seats as <code>0</code> (free) or <code>1</code> (taken). The number of rows is entered first, then one comma separated line per row. Complete the program to display <code>Row R: F free</code> for each row (R from 1), <code>Total free: </code> and the total, <code>Emptiest row: </code> and the first row with the most free seats, and then either <code>Three together in row R</code> for the first row containing three free seats side by side, or <code>No three seats together</code>. (10 marks)',
            C`
              rows = int(input("Number of rows: "))
              plan = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  plan.append(row)
              # free seats, emptiest row, three together
            `,
            C`
              rows = int(input("Number of rows: "))
              plan = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  plan.append(row)
              total_free = 0
              most = -1
              emptiest = 0
              three_row = 0
              for r in range(len(plan)):
                  free = 0
                  streak = 0
                  for seat in plan[r]:
                      if seat == 0:
                          free = free + 1
                          streak = streak + 1
                          if streak >= 3 and three_row == 0:
                              three_row = r + 1
                      else:
                          streak = 0
                  print("Row " + str(r + 1) + ": " + str(free) + " free")
                  total_free = total_free + free
                  if free > most:
                      most = free
                      emptiest = r + 1
              print("Total free:", total_free)
              print("Emptiest row:", emptiest)
              if three_row > 0:
                  print("Three together in row", three_row)
              else:
                  print("No three seats together")
            `,
            [{ in: ['3', '0,1,0,0,0', '1,1,0,1,1', '0,0,0,1,0'], out: 'Row 1: 4 free\nRow 2: 1 free\nRow 3: 4 free\nTotal free: 9\nEmptiest row: 1\nThree together in row 1' }, { in: ['2', '1,0,1,0,1', '0,1,0,1,0'], out: 'Row 1: 2 free\nRow 2: 3 free\nTotal free: 5\nEmptiest row: 2\nNo three seats together' }, { in: ['2', '1,0,1,1', '0,0,0,1'], out: 'Row 1: 1 free\nRow 2: 3 free\nTotal free: 4\nEmptiest row: 2\nThree together in row 2' }, { in: ['1', '1,1,1'], out: 'Row 1: 0 free\nTotal free: 0\nEmptiest row: 1\nNo three seats together', hidden: true }],
            ['Use a `streak` counter that grows on a free seat and resets to 0 on a taken seat.', 'Remember the first row where the streak reaches 3, and do not overwrite it later.', 'Keep `most` starting below 0 so a row with 0 free can still be recorded.']),
          X('m15-ex-a2-find', 'Find a value in the grid', 2, 'exam',
            'A lab records a sensor reading in each cell of a grid. The number of rows is entered first, then each row (comma separated), then the reading to find. Search row by row, left to right. Display <code>Found at row R, column C</code> (both counting from 1) for the **first** match, or <code>Not found</code>. (6 marks)',
            C`
              rows = int(input("Number of rows: "))
              grid = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  grid.append(row)
              target = int(input("Reading to find: "))
              # search the grid
            `,
            C`
              rows = int(input("Number of rows: "))
              grid = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  grid.append(row)
              target = int(input("Reading to find: "))
              found = False
              for r in range(len(grid)):
                  for c in range(len(grid[r])):
                      if grid[r][c] == target and not found:
                          print("Found at row " + str(r + 1) + ", column " + str(c + 1))
                          found = True
              if not found:
                  print("Not found")
            `,
            [{ in: ['2', '3,8,1', '9,4,6', '4'], out: 'Found at row 2, column 2' }, { in: ['2', '3,8,1', '9,4,6', '7'], out: 'Not found' }, { in: ['2', '5,5', '5,5', '5'], out: 'Found at row 1, column 1' }, { in: ['3', '1', '2', '3', '3'], out: 'Found at row 3, column 1', hidden: true }],
            ['Two loops: rows on the outside, columns on the inside.', 'Use a `found` flag so only the first match is reported.', 'Add 1 to both indexes when you print.']),
          X('m15-ex-a2-pairs', 'Word pairs in order', 3, 'exam',
            'The number of pairs is entered first, then one line per pair: two words separated by a comma. The program stores the pairs in a 2D list. For each pair (numbered from 1) display the number and both words separated by spaces. On the next line display the longer word indented by 4 spaces (the first word if they are the same length). If the pair is not in alphabetical order (ignoring case) display a further line, indented by 4 spaces: <code>reordered: </code> followed by the pair in alphabetical order. (10 marks)',
            C`
              count = int(input("Number of pairs: "))
              pairs = []
              for i in range(count):
                  pairs.append(input().split(","))
              # display each pair
            `,
            C`
              count = int(input("Number of pairs: "))
              pairs = []
              for i in range(count):
                  pairs.append(input().split(","))
              for i in range(len(pairs)):
                  first = pairs[i][0]
                  second = pairs[i][1]
                  print(i + 1, first, second)
                  if len(second) > len(first):
                      print("    " + second)
                  else:
                      print("    " + first)
                  if first.lower() > second.lower():
                      print("    reordered:", second, first)
            `,
            [{ in: ['3', 'apple,banana', 'wrist,leg', 'blue,yellow'], out: '1 apple banana\n    banana\n2 wrist leg\n    wrist\n    reordered: leg wrist\n3 blue yellow\n    yellow' }, { in: ['1', 'Zebra,ant'], out: '1 Zebra ant\n    Zebra\n    reordered: ant Zebra' }, { in: ['2', 'cat,dog', 'Bob,alf'], out: '1 cat dog\n    cat\n2 Bob alf\n    Bob\n    reordered: alf Bob', hidden: true }],
            ['Each pair is a list: `pairs[i][0]` and `pairs[i][1]`.', 'Compare lengths with `len()`; use `>` so a tie keeps the first word.', 'Compare `.lower()` versions to ignore case.']),
          X('m15-ex-a2-grid', 'Booking a seating grid', 1, 'exam',
            'A small hall has 3 rows of 4 seats. Create a 2D list with every seat shown as <code>.</code>. Input the number of seats to book, then for each booking input a row and column as <code>row,column</code> (counting from 1) and mark that seat <code>X</code>. Finally display the grid, one row per line, with a space between the seats. (6 marks)',
            C`
              seats = int(input("Seats to book: "))
              # build the grid, mark the seats, then display it
            `,
            C`
              seats = int(input("Seats to book: "))
              grid = []
              for r in range(3):
                  grid.append(["."] * 4)
              for i in range(seats):
                  parts = input().split(",")
                  row = int(parts[0]) - 1
                  col = int(parts[1]) - 1
                  grid[row][col] = "X"
              for row in grid:
                  print(" ".join(row))
            `,
            [{ in: ['2', '1,1', '3,4'], out: 'X . . .\n. . . .\n. . . X' }, { in: ['0'], out: '. . . .\n. . . .\n. . . .' }, { in: ['3', '2,2', '2,3', '3,1'], out: '. . . .\n. X X .\nX . . .', hidden: true }],
            ['Build the grid with a loop so each row is a separate list: `grid.append(["."] * 4)`.', 'Subtract 1 from the row and column the user types.', '`" ".join(row)` joins one row of strings.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-subprograms-menus',
        title: 'Subprograms and menus',
        time: '40 min',
        book: 'Ch 2 · subprograms',
        exam: 'Paper 2 · menu programs and function tasks',
        summary: 'Functions, procedures and menus built from them',
        intro: 'Long Paper 2 questions often arrive with a menu already written and ask you to complete the subprograms behind each option. Short ones ask for a single function: prime test, dice roll, calculator.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'A **subprogram** is a named block of code. A **procedure** does a job (usually printing). A **function** gives a value back with `return`. The exam asks you to tell them apart, to name parameters, and to write both.' },
          { t: 'table', head: ['Edexcel pseudocode', 'Python', 'Notes'], rows: [
            ['`PROCEDURE show(x)` … `END PROCEDURE`', '`def show(x):` (no `return`)', 'Called as a statement: `show(5)`'],
            ['`FUNCTION add(a, b)` … `RETURN r` … `END FUNCTION`', '`def add(a, b):` … `return r`', 'Called inside an expression: `total = add(2, 3)`'],
            ['`SET result TO add(2, 3)`', '`result = add(2, 3)`', '`2` and `3` are the **arguments**; `a` and `b` are the **parameters**'],
          ] },
          { t: 'note', kind: 'exam', html: 'Local variable: made inside a subprogram and only usable there. Global variable: made in the main program and usable anywhere. A constant never changes while the program runs (written in CAPITALS by convention). If a question asks "why use subprograms", write one of: code can be reused, program is easier to read and test, different people can write different parts.' },
          { t: 'cases', title: 'Subprogram shapes', items: [
            { label: 'Procedure', code: C`
              def show_total(items, price):
                  print("Total:", items * price)
              show_total(3, 2.5)
            ` },
            { label: 'Function that returns', code: C`
              def area(w, h):
                  return w * h
              print(area(3, 4))
              print(area(2, 5) + area(1, 1))
            ` },
            { label: 'Boolean function', code: C`
              def is_even(n):
                  return n % 2 == 0
              for n in [4, 7]:
                  if is_even(n):
                      print(n, "is even")
                  else:
                      print(n, "is odd")
            ` },
            { label: 'Print instead of return', intro: 'The classic mistake: the function prints, so the caller gets `None`.', code: C`
              def double(n):
                  print(n * 2)
              result = double(4)
              print(result)
            ` },
          ] },
          { t: 'h', text: 'Menu skeleton' },
          { t: 'p', html: 'A menu program is a loop that shows the options, reads a choice, and calls one subprogram. The loop ends on the quit option. Keep each option\'s work **inside its own subprogram**.' },
          { t: 'code', title: 'A complete menu loop', stdin: ['1', '9', '2', '3'], code: C`
            def option_one():
                print("You chose one")

            def option_two():
                print("You chose two")

            while True:
                print("1. First")
                print("2. Second")
                print("3. Quit")
                choice = input("Choice: ")
                if choice == "1":
                    option_one()
                elif choice == "2":
                    option_two()
                elif choice == "3":
                    print("Goodbye")
                    break
                else:
                    print("Invalid choice")
          ` },
          { t: 'parsons', prompt: 'Put the function in order: it returns True when a number is greater than 1 and has no divisor from 2 up to one less than itself.', lines: [
            'def is_prime(n):',
            '    if n < 2:',
            '        return False',
            '    for d in range(2, n):',
            '        if n % d == 0:',
            '            return False',
            '    return True',
          ], why: 'Numbers below 2 are not prime. A single divisor proves a number is not prime. `return True` comes after the loop, because only then have all divisors been tried.' },
          { t: 'predict', code: C`
            def triple(n):
                return n * 3
            x = triple(2)
            y = triple(x)
            print(x, y)
          `, why: 'x is 6; then triple(6) is 18.' },
          { t: 'quiz', q: 'Which statement about a function is correct?', options: ['It sends a value back to the caller with `return`', 'It must always print something', 'It can only have one parameter', 'It runs as soon as it is defined'], answer: 0, why: '`def` only defines the function. It runs when it is called, and `return` hands the value back.' },
          { t: 'tracetable', id: 'm15-tt-sub', code: C`
            def add(a, b):
                return a + b
            x = add(2, 3)
            y = add(x, 4)
          `, cols: ['x', 'y'], prompt: 'Trace the two calls.' },
          { t: 'h', text: 'Your turn' },
          X('m15-ex-sm-bmi', 'BMI subprograms', 1, 'exam',
            'The main program is written. Complete the two subprograms. <code>calc_bmi(weight, height)</code> is a function that returns weight divided by height squared, rounded to 1 decimal place. <code>show_category(bmi)</code> is a procedure that displays <code>Underweight</code> (under 18.5), <code>Healthy</code> (under 25), <code>Overweight</code> (under 30) or <code>Obese</code>. (7 marks)',
            C`
              def calc_bmi(weight, height):
                  pass

              def show_category(bmi):
                  pass

              weight = float(input("Weight in kg: "))
              height = float(input("Height in m: "))
              b = calc_bmi(weight, height)
              print("BMI:", b)
              show_category(b)
            `,
            C`
              def calc_bmi(weight, height):
                  return round(weight / (height ** 2), 1)

              def show_category(bmi):
                  if bmi < 18.5:
                      print("Underweight")
                  elif bmi < 25:
                      print("Healthy")
                  elif bmi < 30:
                      print("Overweight")
                  else:
                      print("Obese")

              weight = float(input("Weight in kg: "))
              height = float(input("Height in m: "))
              b = calc_bmi(weight, height)
              print("BMI:", b)
              show_category(b)
            `,
            [{ in: ['50', '1.6'], out: 'BMI: 19.5\nHealthy' }, { in: ['45', '1.7'], out: 'BMI: 15.6\nUnderweight' }, { in: ['90', '1.75'], out: 'BMI: 29.4\nOverweight' }, { in: ['100', '1.7'], out: 'BMI: 34.6\nObese', hidden: true }, { in: ['72', '1.7'], out: 'BMI: 24.9\nHealthy', hidden: true }],
            ['Square the height with `height ** 2`; use brackets in the division.', '`calc_bmi` uses `return`, `show_category` uses `print`.', 'Check the smallest band first and use `elif` for each next band.']),
          X('m15-ex-sm-prime', 'Prime numbers', 2, 'exam',
            'Write the function <code>is_prime(n)</code> that returns <code>True</code> if the whole number <code>n</code> is prime (larger than 1 and divisible only by 1 and itself) and <code>False</code> otherwise. Then write <code>primes_up_to(n)</code> that returns a list of all the primes from 2 up to and including <code>n</code>. (7 marks)',
            C`
              def is_prime(n):
                  pass

              def primes_up_to(n):
                  pass
            `,
            C`
              def is_prime(n):
                  if n < 2:
                      return False
                  for d in range(2, n):
                      if n % d == 0:
                          return False
                  return True

              def primes_up_to(n):
                  found = []
                  for x in range(2, n + 1):
                      if is_prime(x):
                          found.append(x)
                  return found
            `,
            [
              { py: 'assert is_prime(2) and is_prime(3) and is_prime(13) and is_prime(97), "primes"', label: 'primes accepted' },
              { py: 'assert not is_prime(1) and not is_prime(0) and not is_prime(9) and not is_prime(100), "not primes"', label: 'non-primes rejected' },
              { py: 'assert primes_up_to(20) == [2, 3, 5, 7, 11, 13, 17, 19], "primes up to 20"', label: 'list of primes' },
              { py: 'assert primes_up_to(2) == [2] and primes_up_to(1) == [], "edge cases"', label: 'edge cases', hidden: true },
              { py: 'assert is_prime(4) is False and is_prime(5) is True, "must return booleans"', label: 'returns booleans', hidden: true },
            ],
            ['Anything below 2 is not prime: return `False` straight away.', 'Try every divisor `d` in `range(2, n)`. One that divides exactly means not prime.', '`primes_up_to` can call `is_prime` for each number from 2 to `n`.']),
          X('m15-ex-sm-calc', 'Calculator menu', 2, 'exam',
            'Write three functions <code>add(a, b)</code>, <code>subtract(a, b)</code> and <code>multiply(a, b)</code> that return the result. Then complete the main program. It repeats this menu: <code>1. Add</code>, <code>2. Subtract</code>, <code>3. Multiply</code>, <code>4. Quit</code>. For options 1 to 3 it inputs two whole numbers and displays <code>Result: </code> and the answer. Option 4 displays <code>Goodbye</code> and stops. Any other choice displays <code>Invalid choice</code>. (10 marks)',
            C`
              def add(a, b):
                  pass

              def subtract(a, b):
                  pass

              def multiply(a, b):
                  pass

              def show_menu():
                  print("1. Add")
                  print("2. Subtract")
                  print("3. Multiply")
                  print("4. Quit")

              # main program: repeat the menu
            `,
            C`
              def add(a, b):
                  return a + b

              def subtract(a, b):
                  return a - b

              def multiply(a, b):
                  return a * b

              def show_menu():
                  print("1. Add")
                  print("2. Subtract")
                  print("3. Multiply")
                  print("4. Quit")

              while True:
                  show_menu()
                  choice = input("Choice: ")
                  if choice == "4":
                      print("Goodbye")
                      break
                  elif choice in ["1", "2", "3"]:
                      a = int(input("First number: "))
                      b = int(input("Second number: "))
                      if choice == "1":
                          print("Result:", add(a, b))
                      elif choice == "2":
                          print("Result:", subtract(a, b))
                      else:
                          print("Result:", multiply(a, b))
                  else:
                      print("Invalid choice")
            `,
            [
              { in: ['4'], out: MENU + '\nGoodbye' },
              { in: ['1', '3', '4', '4'], out: MENU + '\nResult: 7\n' + MENU + '\nGoodbye' },
              { in: ['2', '10', '4', '3', '6', '7', '4'], out: MENU + '\nResult: 6\n' + MENU + '\nResult: 42\n' + MENU + '\nGoodbye' },
              { in: ['9', '4'], out: MENU + '\nInvalid choice\n' + MENU + '\nGoodbye', hidden: true },
              { py: 'assert add(2, 3) == 5 and subtract(2, 3) == -1 and multiply(4, 5) == 20, "functions must return values"', in: ['4'], label: 'functions return values' },
            ],
            ['Each function should `return` its answer, not print it.', 'Use `while True` and `break` for the quit option.', 'Only ask for the two numbers when the choice is 1, 2 or 3.']),
          X('m15-ex-sm-dice', 'Dice functions', 2, 'exam',
            'The <code>random</code> module is imported for you. (a) Write <code>roll_dice(n)</code> that rolls <code>n</code> six-sided dice and returns the total (0 for no dice). (4 marks) (b) Write <code>rolls_until_six()</code> that keeps rolling one die until a six appears and returns how many rolls it took. (4 marks)',
            C`
              import random

              def roll_dice(n):
                  pass

              def rolls_until_six():
                  pass
            `,
            C`
              import random

              def roll_dice(n):
                  total = 0
                  for i in range(n):
                      total = total + random.randint(1, 6)
                  return total

              def rolls_until_six():
                  count = 0
                  while True:
                      count = count + 1
                      if random.randint(1, 6) == 6:
                          return count
            `,
            [
              { py: 'assert roll_dice(0) == 0, "no dice give 0"', label: 'no dice' },
              { py: 'for _ in range(200):\n    assert 3 <= roll_dice(3) <= 18, "three dice total 3 to 18"', label: 'three dice stay in range' },
              { py: 'assert {roll_dice(1) for _ in range(400)} == {1,2,3,4,5,6}, "one die should give each value 1 to 6"', label: 'one die gives 1 to 6' },
              { py: 'r = [rolls_until_six() for _ in range(200)]\nassert all(type(x) is int and x >= 1 for x in r), "a whole number of rolls, at least 1"\nassert max(r) > 1, "sometimes it takes more than one roll"', label: 'rolls until six', hidden: true },
            ],
            ['Add `random.randint(1, 6)` to a running total inside a loop of `n` repeats.', 'A `while` loop with a counter works for part (b).', 'In (b) you can `return` the counter as soon as the roll is 6.']),
          X('m15-ex-sm-username', 'Username builder', 2, 'exam',
            'A school builds usernames from three pieces of data. Write <code>make_username(first, last, year)</code> that returns: the first letter of the first name, then the last name truncated to its first 6 letters, then the last two digits of the birth year (a whole number); everything in lower case. For example <code>("Maria", "Johnson", 2009)</code> gives <code>mjohnso09</code>. (6 marks)',
            C`
              def make_username(first, last, year):
                  pass
            `,
            C`
              def make_username(first, last, year):
                  return first[0].lower() + last[:6].lower() + str(year)[-2:]
            `,
            [
              { py: 'assert make_username("Maria", "Johnson", 2009) == "mjohnso09", "Maria Johnson 2009"', label: 'long surname' },
              { py: 'assert make_username("Ali", "Khan", 2010) == "akhan10", "short surname"', label: 'short surname' },
              { py: 'assert make_username("ZOE", "Armstrong", 1999) == "zarmstr99", "capitals and 1990s"', label: 'capitals and 1999' },
              { py: 'assert make_username("Bo", "Li", 2000) == "bli00", "year ending 00"', label: 'year ending 00', hidden: true },
            ],
            ['`first[0]` is the first letter; `last[:6]` is at most six letters.', 'Convert the year with `str(year)` then slice `[-2:]`.', 'Use `.lower()` on the letters.']),
          X('m15-ex-sm-gym', 'Gym visits menu', 3, 'exam',
            'A gym stores member names and monthly visits in two lists (given). Complete the program. Menu: <code>1. Low visits</code>, <code>2. Active members</code>, <code>3. Quit</code>. Option 1 calls the procedure <code>show_low()</code>, which displays the name of every member with fewer than 4 visits, one per line. Option 2 calls the function <code>count_active()</code>, which returns how many members have 12 or more visits, and the program displays <code>Active members: </code> and the count. Option 3 displays <code>Goodbye</code> and stops; any other choice displays <code>Invalid choice</code>. (12 marks)',
            C`
              members = ["Asha", "Ben", "Cara", "Dev", "Ella", "Femi"]
              visits = [3, 14, 8, 2, 12, 20]

              def show_low():
                  pass

              def count_active():
                  pass

              # main program with the menu
            `,
            C`
              members = ["Asha", "Ben", "Cara", "Dev", "Ella", "Femi"]
              visits = [3, 14, 8, 2, 12, 20]

              def show_low():
                  for i in range(len(members)):
                      if visits[i] < 4:
                          print(members[i])

              def count_active():
                  count = 0
                  for v in visits:
                      if v >= 12:
                          count = count + 1
                  return count

              while True:
                  print("1. Low visits")
                  print("2. Active members")
                  print("3. Quit")
                  choice = input("Choice: ")
                  if choice == "1":
                      show_low()
                  elif choice == "2":
                      print("Active members:", count_active())
                  elif choice == "3":
                      print("Goodbye")
                      break
                  else:
                      print("Invalid choice")
            `,
            [
              { in: ['1', '3'], out: GYM + '\nAsha\nDev\n' + GYM + '\nGoodbye' },
              { in: ['2', '3'], out: GYM + '\nActive members: 3\n' + GYM + '\nGoodbye' },
              { in: ['7', '3'], out: GYM + '\nInvalid choice\n' + GYM + '\nGoodbye' },
              { in: ['3'], out: GYM + '\nGoodbye', py: 'assert count_active() == 3, "count_active should return 3 for the given data"', hidden: true },
            ],
            ['`show_low` is a procedure: it prints. `count_active` is a function: it returns.', 'Use the index `i` to match each name with its visits.', 'In the menu loop print the three options each time, then read the choice.'],
            { requires: [{ re: 'def show_low', msg: 'Keep the procedure show_low.' }, { re: 'return', msg: 'count_active must return its result.' }] }),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-text-files',
        title: 'Text files: records, searches and reports',
        time: '40 min',
        book: 'Ch 2 · files',
        exam: 'Paper 2 · reading and writing text files',
        summary: 'Read records, search, append, check passwords, write a summary',
        intro: 'In the practical paper the data you work with is often in a text file. The marks are for opening it correctly, handling each line properly, and writing results back out.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'table', head: ['Job', 'Python', 'Watch for'], rows: [
            ['Read every line', '`for line in file:`', 'Each line ends with `\\n`. Use `.strip()`.'],
            ['Split a record', '`parts = line.strip().split(",")`', 'Fields are strings: `int(parts[1])` for numbers'],
            ['Add to the end', '`open(name, "a")`', '`"w"` would erase the file'],
            ['Create or replace', '`open(name, "w")`', '`write()` needs a string and no automatic newline'],
            ['Finish', '`file.close()`', 'Data may not be saved until the file is closed'],
          ] },
          { t: 'note', kind: 'exam', html: 'Most questions give you a starter file with `open` lines already written. Your marks are for what happens **inside the loop**: stripping, splitting, converting, testing, counting, writing. Read the bullet list in the question and tick each bullet off against your code.' },
          { t: 'cases', title: 'File patterns', items: [
            { label: 'Read and count', files: { 'names.txt': 'Asha\nBen\nCara\n' }, code: C`
              file = open("names.txt", "r")
              count = 0
              for line in file:
                  print(line.strip())
                  count = count + 1
              file.close()
              print(count, "names")
            ` },
            { label: 'Records with commas', files: { 'scores.txt': 'Ann,50\nBen,70\nCy,65\n' }, code: C`
              file = open("scores.txt", "r")
              best = 0
              for line in file:
                  parts = line.strip().split(",")
                  name = parts[0]
                  score = int(parts[1])
                  if score > best:
                      best = score
                      best_name = name
              file.close()
              print(best_name, best)
            ` },
            { label: 'Append a record', files: { 'scores.txt': 'Ann,50\n' }, code: C`
              file = open("scores.txt", "a")
              file.write("Dev,88\n")
              file.close()
              file = open("scores.txt", "r")
              print(file.read())
              file.close()
            ` },
            { label: 'Write a summary file', files: { 'rain.txt': '1,2,3\n4,0,0\n' }, code: C`
              infile = open("rain.txt", "r")
              outfile = open("report.txt", "w")
              week = 0
              for line in infile:
                  week = week + 1
                  total = 0
                  for item in line.strip().split(","):
                      total = total + int(item)
                  outfile.write("Week " + str(week) + ": " + str(total) + "\n")
              infile.close()
              outfile.close()
            ` },
            { label: 'File does not exist', expectError: true, code: C`
              file = open("missing.txt", "r")
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'Mode `"w"` wipes the file the moment it is opened. If a question says "add a new record", you need `"a"`. Also: only strings can be written. `file.write(score)` fails for a number; write `str(score)`.' },
          { t: 'predict', files: { 'data.txt': '4\n8\n15\n' }, code: C`
            file = open("data.txt", "r")
            total = 0
            for line in file:
                total = total + int(line)
            file.close()
            print(total)
          `, why: 'int() ignores the newline at the end of each line, so 4 + 8 + 15 = 27.' },
          { t: 'sort', prompt: 'Which open mode do you use?', cats: ['"r" read', '"w" write (replace)', '"a" append'], items: [
            { text: 'Show every name in a file', cat: 0 }, { text: 'Create Error.txt for rejected entries', cat: 1 }, { text: 'Add one new score to the end of a scores file', cat: 2 }, { text: 'Count the lines in a file', cat: 0 }, { text: 'Save a report that replaces last week\'s', cat: 1 }, { text: 'Log one more login at the end of a history file', cat: 2 },
          ], why: 'Read is for taking data in. Write creates or replaces. Append adds to the end and keeps what is there.' },
          { t: 'quiz', q: 'A scores file holds `Ann,50`. What does `line.strip().split(",")` give?', options: ['`["Ann", "50"]`', '`["Ann,50"]`', '`["Ann", 50]`', '`("Ann", "50\\n")`'], answer: 0, why: '`strip()` removes the newline; `split(",")` cuts at each comma and gives a list of **strings**. Convert the 50 with `int()` if you need a number.' },
          { t: 'tracetable', id: 'm15-tt-fileline', code: C`
            total = 0
            for n in [2, 5]:
                total = total + n
            average = total / 2
          `, cols: ['n', 'total', 'average'], prompt: 'Trace a total and average of two file values (the values are shown as a list here).' },
          { t: 'h', text: 'Your turn' },
          X('m15-ex-tf-findname', 'Is the name on the list?', 1, 'exam',
            '<code>names.txt</code> holds one name per line. Input a name and search the file, ignoring upper and lower case. Display <code>Found at line N</code> (N counts from 1) for the first match, or <code>Not found</code>. (5 marks)',
            C`
              target = input("Name: ")
              file = open("names.txt", "r")
              # search the file
              file.close()
            `,
            C`
              target = input("Name: ").strip().lower()
              file = open("names.txt", "r")
              line_number = 0
              found = 0
              for line in file:
                  line_number = line_number + 1
                  if line.strip().lower() == target and found == 0:
                      found = line_number
              file.close()
              if found > 0:
                  print("Found at line", found)
              else:
                  print("Not found")
            `,
            [{ files: { 'names.txt': 'Asha\nBen\nCara\nBen\n' }, in: ['ben'], out: 'Found at line 2' }, { files: { 'names.txt': 'Asha\nBen\nCara\nBen\n' }, in: ['Zed'], out: 'Not found' }, { files: { 'names.txt': 'Asha\nBen\nCara\nBen\n' }, in: ['CARA'], out: 'Found at line 3' }, { files: { 'names.txt': 'Dev\n' }, in: ['dev'], out: 'Found at line 1', hidden: true }],
            ['Keep a line counter that goes up for every line.', 'Compare `.strip().lower()` of the line with the lowercase target.', 'Record the line number of the first match only.']),
          X('m15-ex-tf-append', 'Add a score', 2, 'exam',
            '<code>scores.txt</code> holds one record per line in the form <code>name,score</code>. Input a name and a score, then add the new record to the end of the file. Finally read the whole file and display <code>Records: </code> and the number of records, then <code>Highest: </code> followed by the name and in brackets the score of the highest scorer (the first if tied). Example <code>Highest: Ben (70)</code>. (8 marks)',
            C`
              name = input("Name: ")
              score = input("Score: ")
              # add the record, then read the file
            `,
            C`
              name = input("Name: ")
              score = input("Score: ")
              file = open("scores.txt", "a")
              file.write(name + "," + score + "\n")
              file.close()
              file = open("scores.txt", "r")
              count = 0
              best = -1
              best_name = ""
              for line in file:
                  parts = line.strip().split(",")
                  count = count + 1
                  if int(parts[1]) > best:
                      best = int(parts[1])
                      best_name = parts[0]
              file.close()
              print("Records:", count)
              print("Highest: " + best_name + " (" + str(best) + ")")
            `,
            [{ files: { 'scores.txt': 'Ann,50\nBen,70\n' }, in: ['Cy', '65'], out: 'Records: 3\nHighest: Ben (70)', files_out: { 'scores.txt': 'Ann,50\nBen,70\nCy,65\n' } }, { files: { 'scores.txt': 'Zed,90\n' }, in: ['Amy', '90'], out: 'Records: 2\nHighest: Zed (90)', files_out: { 'scores.txt': 'Zed,90\nAmy,90\n' } }, { files: { 'scores.txt': 'A,1\nB,2\nC,3\n' }, in: ['D', '10'], out: 'Records: 4\nHighest: D (10)', files_out: { 'scores.txt': 'A,1\nB,2\nC,3\nD,10\n' }, hidden: true }],
            ['Open with `"a"` to add, close, then open again with `"r"` to read.', 'Write `name + "," + score + "\\n"`.', 'Convert `parts[1]` with `int()` before comparing.']),
          X('m15-ex-tf-login', 'Login from a file', 2, 'exam',
            '<code>users.txt</code> holds one account per line as <code>username,password</code>. The user has up to three attempts. Each attempt inputs a username then a password. If both match one line display <code>Welcome </code> and the username and stop. If not, display <code>Wrong username or password</code>. After three failed attempts display <code>Account locked</code>. (9 marks)',
            C`
              attempts = 0
              # up to three attempts
            `,
            C`
              attempts = 0
              logged_in = False
              while attempts < 3 and not logged_in:
                  user = input("Username: ")
                  password = input("Password: ")
                  attempts = attempts + 1
                  file = open("users.txt", "r")
                  for line in file:
                      parts = line.strip().split(",")
                      if parts[0] == user and parts[1] == password:
                          logged_in = True
                  file.close()
                  if logged_in:
                      print("Welcome", user)
                  else:
                      print("Wrong username or password")
              if not logged_in:
                  print("Account locked")
            `,
            [{ files: { 'users.txt': 'asha,pw1\nben,secret\n' }, in: ['ben', 'secret'], out: 'Welcome ben' }, { files: { 'users.txt': 'asha,pw1\nben,secret\n' }, in: ['ben', 'x', 'asha', 'pw1'], out: 'Wrong username or password\nWelcome asha' }, { files: { 'users.txt': 'asha,pw1\nben,secret\n' }, in: ['a', 'b', 'c', 'd', 'e', 'f'], out: 'Wrong username or password\nWrong username or password\nWrong username or password\nAccount locked' }, { files: { 'users.txt': 'asha,pw1\nben,secret\n' }, in: ['asha', 'secret', 'ben', 'pw1', 'ben', 'secret'], out: 'Wrong username or password\nWrong username or password\nWelcome ben', hidden: true }],
            ['Count attempts; stop when the count reaches 3 or the login works.', 'Both the username **and** the password must match the same line.', 'Use a flag such as `logged_in` and check it after the loop.']),
          X('m15-ex-tf-weekly', 'Weekly rainfall report', 3, 'exam',
            '<code>rain.txt</code> holds one week per line: the daily rainfall in whole millimetres separated by commas. For each week display <code>Week N: </code> and its total (N counts from 1). Then display <code>Grand total: </code> and the total of all weeks. Write exactly the same lines to <code>report.txt</code>. The program must work for any number of weeks. (9 marks)',
            C`
              infile = open("rain.txt", "r")
              outfile = open("report.txt", "w")
              # process each week
              infile.close()
              outfile.close()
            `,
            C`
              infile = open("rain.txt", "r")
              outfile = open("report.txt", "w")
              week = 0
              grand = 0
              for line in infile:
                  week = week + 1
                  total = 0
                  for item in line.strip().split(","):
                      total = total + int(item)
                  grand = grand + total
                  text = "Week " + str(week) + ": " + str(total)
                  print(text)
                  outfile.write(text + "\n")
              text = "Grand total: " + str(grand)
              print(text)
              outfile.write(text + "\n")
              infile.close()
              outfile.close()
            `,
            [{ files: { 'rain.txt': '1,2,3\n4,0,0\n10,10,5\n' }, out: 'Week 1: 6\nWeek 2: 4\nWeek 3: 25\nGrand total: 35', files_out: { 'report.txt': 'Week 1: 6\nWeek 2: 4\nWeek 3: 25\nGrand total: 35\n' } }, { files: { 'rain.txt': '5\n' }, out: 'Week 1: 5\nGrand total: 5', files_out: { 'report.txt': 'Week 1: 5\nGrand total: 5\n' } }, { files: { 'rain.txt': '0,0\n0,1,1,1\n' }, out: 'Week 1: 0\nWeek 2: 3\nGrand total: 3', files_out: { 'report.txt': 'Week 1: 0\nWeek 2: 3\nGrand total: 3\n' }, hidden: true }],
            ['An outer loop over lines, an inner loop over the numbers on each line.', 'Reset the week total to 0 for every line, but keep one grand total outside the loop.', 'Build the text once, then both `print` it and `write` it with `"\\n"`.']),
          X('m15-ex-tf-records', 'Save fish records', 3, 'exam',
            'A researcher enters the number of fish, then for each fish a line like <code>Perch,30,2</code> (species, length in cm, age in years). Write each fish to <code>Fish.txt</code> as one record with a code number as the first field. Code numbers start at 201 and go up by 1. Fields are separated by commas, for example <code>201,Perch,30,2</code>. Finally display <code>Records written: </code> and how many. (8 marks)',
            C`
              count = int(input("Number of fish: "))
              file = open("Fish.txt", "w")
              # write each record
              file.close()
            `,
            C`
              count = int(input("Number of fish: "))
              file = open("Fish.txt", "w")
              code = 201
              for i in range(count):
                  details = input()
                  file.write(str(code) + "," + details + "\n")
                  code = code + 1
              file.close()
              print("Records written:", count)
            `,
            [{ in: ['2', 'Perch,30,2', 'Pike,80,5'], out: 'Records written: 2', files_out: { 'Fish.txt': '201,Perch,30,2\n202,Pike,80,5\n' } }, { in: ['1', 'Roach,20,3'], out: 'Records written: 1', files_out: { 'Fish.txt': '201,Roach,20,3\n' } }, { in: ['0'], out: 'Records written: 0', files_out: { 'Fish.txt': '' }, hidden: true }, { in: ['3', 'A,1,1', 'B,2,2', 'C,3,3'], out: 'Records written: 3', files_out: { 'Fish.txt': '201,A,1,1\n202,B,2,2\n203,C,3,3\n' }, hidden: true }],
            ['Start a `code` variable at 201 and add 1 after each record.', 'Convert the code with `str()` before joining it to the text.', 'Add `"\\n"` to the end of every record.']),
          X('m15-ex-tf-longest', 'Longest word', 2, 'exam',
            '<code>words.txt</code> holds one word per line. Input a letter. Display <code>Longest word: </code> and the longest word in the file (the first if tied), then <code>Words starting with X: </code> and how many words start with that letter, ignoring case, where X is the letter in lower case. Example <code>Words starting with a: 2</code>. (7 marks)',
            C`
              letter = input("Letter: ")
              file = open("words.txt", "r")
              # find the longest word and count the matches
              file.close()
            `,
            C`
              letter = input("Letter: ").lower()
              file = open("words.txt", "r")
              longest = ""
              count = 0
              for line in file:
                  word = line.strip()
                  if len(word) > len(longest):
                      longest = word
                  if word.lower().startswith(letter):
                      count = count + 1
              file.close()
              print("Longest word:", longest)
              print("Words starting with " + letter + ":", count)
            `,
            [{ files: { 'words.txt': 'apple\nBanana\navocado\ncherry\n' }, in: ['a'], out: 'Longest word: avocado\nWords starting with a: 2' }, { files: { 'words.txt': 'apple\nBanana\navocado\ncherry\n' }, in: ['B'], out: 'Longest word: avocado\nWords starting with b: 1' }, { files: { 'words.txt': 'xy\nzzz\n' }, in: ['q'], out: 'Longest word: zzz\nWords starting with q: 0' }, { files: { 'words.txt': 'cat\ndog\nant\n' }, in: ['c'], out: 'Longest word: cat\nWords starting with c: 1', hidden: true }],
            ['Start `longest` as an empty string and replace it only when a word is **longer**.', '`word.lower().startswith(letter)` handles upper-case words.', 'Remember to `.strip()` each line first.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-sorting-searching',
        title: 'Sorting and searching from a description',
        time: '45 min',
        book: 'Ch 1 and 2 · algorithms',
        exam: 'Paper 2 · bubble sort, binary and linear search',
        summary: 'Bubble sort passes, binary search tables, counting comparisons',
        intro: 'Paper 2 asks you to complete tables showing how an algorithm behaves and to code it from pseudocode. Both are easy once you can trace the algorithm one step at a time.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'Three question styles: (1) **fill a table** to show the list after each pass of a bubble sort, or the `low`, `high` and `mid` values of a binary search; (2) **explain** an advantage or limit (binary search needs sorted data; linear search works on any data); (3) **write the code** from pseudocode or a description.' },
          { t: 'html', html: PRE('SET low TO 0\nSET high TO LENGTH(items) - 1\nSET found TO FALSE\nWHILE low <= high AND NOT found DO\n  SET mid TO (low + high) DIV 2\n  IF items[mid] = target THEN\n    SET found TO TRUE\n  ELSE IF target < items[mid] THEN\n    SET high TO mid - 1\n  ELSE\n    SET low TO mid + 1\n  END IF\nEND WHILE') },
          { t: 'note', kind: 'exam', html: 'In a trace table, **write a row each time the loop runs**, even on the last pass when nothing changes. For bubble sort, a pass in which no swap happens is the pass that proves the list is sorted. For binary search, the loop ends when `low` becomes greater than `high` (not found) or the target is found.' },
          { t: 'cases', title: 'Algorithms on a small list', items: [
            { label: 'Bubble sort with pass printing', intro: 'Press **Trace** to see the neighbours swap.', code: C`
              items = [5, 3, 8, 1]
              swapped = True
              passes = 0
              while swapped:
                  swapped = False
                  passes = passes + 1
                  for i in range(len(items) - 1):
                      if items[i] > items[i + 1]:
                          items[i], items[i + 1] = items[i + 1], items[i]
                          swapped = True
                  print("Pass", passes, items)
            ` },
            { label: 'Linear search', code: C`
              items = [4, 9, 2, 9]
              target = 2
              position = -1
              for i in range(len(items)):
                  if items[i] == target:
                      position = i
                      break
              print(position)
            ` },
            { label: 'Binary search', code: C`
              items = [3, 8, 12, 17, 21, 25, 30]
              target = 21
              low = 0
              high = len(items) - 1
              found = False
              while low <= high and not found:
                  mid = (low + high) // 2
                  print("low", low, "high", high, "mid", mid)
                  if items[mid] == target:
                      found = True
                  elif target < items[mid]:
                      high = mid - 1
                  else:
                      low = mid + 1
              print(found)
            ` },
            { label: 'Binary search on unsorted data', intro: 'It runs but cannot be trusted: 17 is in the list, yet it is not found.', code: C`
              items = [30, 3, 17, 8]
              target = 17
              low = 0
              high = len(items) - 1
              found = False
              while low <= high and not found:
                  mid = (low + high) // 2
                  if items[mid] == target:
                      found = True
                  elif target < items[mid]:
                      high = mid - 1
                  else:
                      low = mid + 1
              print(found)
            ` },
          ] },
          { t: 'table', head: ['List size', 'Linear search, worst case', 'Binary search, worst case'], rows: [
            ['5 items', '5 checks', '3 checks'],
            ['15 items', '15 checks', '4 checks'],
            ['1000 items', '1000 checks', '10 checks'],
          ] },
          { t: 'predict', code: C`
            items = [4, 2, 5, 1]
            for i in range(len(items) - 1):
                if items[i] > items[i + 1]:
                    items[i], items[i + 1] = items[i + 1], items[i]
            print(items)
          `, why: 'One pass: (4,2) swap gives 2,4,5,1; (4,5) stay; (5,1) swap gives 2,4,1,5. The biggest value has reached the end, but the list is not yet sorted.' },
          { t: 'quiz', q: 'Why must a list be sorted before a binary search?', options: ['Each check discards half the list by assuming the order', 'Python refuses to search an unsorted list', 'The `mid` formula only works for sorted data types', 'It makes the list shorter'], answer: 0, why: 'If the middle item is bigger than the target, binary search throws away everything above it. That is only correct if the list is in order.' },
          { t: 'tracetable', id: 'm15-tt-binary', code: C`
            items = [3, 8, 12, 17, 21]
            target = 8
            low = 0
            high = 4
            mid = (low + high) // 2
            high = mid - 1
            mid = (low + high) // 2
          `, cols: ['low', 'high', 'mid'], prompt: 'Trace the first two passes of a binary search for 8.' },
          { t: 'h', text: 'Your turn' },
          X('m15-ex-ss-bubble', 'Bubble sort passes', 2, 'exam',
            'A list of whole numbers is entered on one line, separated by commas. Sort it with a bubble sort. After **every pass** display <code>Pass N: </code> and the list as Python shows it, for example <code>Pass 1: [3, 5, 1, 8]</code>. Stop after the first pass in which no swap happens (that pass is displayed too). Finally display <code>Swaps: </code> and the total number of swaps. Do not use <code>sort()</code> or <code>sorted()</code>. (9 marks)',
            C`
              items = []
              for item in input("Numbers: ").split(","):
                  items.append(int(item))
              # bubble sort with a display after each pass
            `,
            C`
              items = []
              for item in input("Numbers: ").split(","):
                  items.append(int(item))
              swaps = 0
              passes = 0
              swapped = True
              while swapped:
                  swapped = False
                  passes = passes + 1
                  for i in range(len(items) - 1):
                      if items[i] > items[i + 1]:
                          temp = items[i]
                          items[i] = items[i + 1]
                          items[i + 1] = temp
                          swaps = swaps + 1
                          swapped = True
                  print("Pass " + str(passes) + ":", items)
              print("Swaps:", swaps)
            `,
            [{ in: ['5,3,8,1'], out: 'Pass 1: [3, 5, 1, 8]\nPass 2: [3, 1, 5, 8]\nPass 3: [1, 3, 5, 8]\nPass 4: [1, 3, 5, 8]\nSwaps: 4' }, { in: ['3,2,1'], out: 'Pass 1: [2, 1, 3]\nPass 2: [1, 2, 3]\nPass 3: [1, 2, 3]\nSwaps: 3' }, { in: ['1,2,3'], out: 'Pass 1: [1, 2, 3]\nSwaps: 0' }, { in: ['7'], out: 'Pass 1: [7]\nSwaps: 0', hidden: true }, { in: ['2,2,1'], out: 'Pass 1: [2, 1, 2]\nPass 2: [1, 2, 2]\nPass 3: [1, 2, 2]\nSwaps: 2', hidden: true }],
            ['Use a `swapped` flag set to False at the start of each pass.', 'The inner loop compares `items[i]` with `items[i + 1]`, so it runs to `len(items) - 2`.', 'Print after the inner loop finishes, so you display one line per pass.'],
            { requires: [{ re: '\\.sort\\(|\\bsorted\\(', not: true, msg: 'Write the sort yourself: do not use sort() or sorted().' }] }),
          X('m15-ex-ss-desc', 'Descending name order', 2, 'exam',
            'Write the function <code>bubble_desc(names)</code> that uses a bubble sort to put a list of strings into **descending** alphabetical order. It changes the list it is given and also returns it. Do not use <code>sort()</code> or <code>sorted()</code>. (6 marks)',
            C`
              def bubble_desc(names):
                  pass
            `,
            C`
              def bubble_desc(names):
                  swapped = True
                  while swapped:
                      swapped = False
                      for i in range(len(names) - 1):
                          if names[i] < names[i + 1]:
                              names[i], names[i + 1] = names[i + 1], names[i]
                              swapped = True
                  return names
            `,
            [
              { py: 'x = ["Bigeye","Blackfin","Albacore","Longtail","Bluefin"]\nassert bubble_desc(list(x)) == sorted(x, reverse=True), "descending order"', label: 'five names' },
              { py: 'assert bubble_desc([]) == [] and bubble_desc(["a"]) == ["a"], "short lists"', label: 'empty and single' },
              { py: 'x = ["b","a","c","a"]\nassert bubble_desc(x) == ["c","b","a","a"] and x == ["c","b","a","a"], "changes the original list"', label: 'changes the list', hidden: true },
            ],
            ['Ascending bubble sort swaps when the left item is **bigger**. Descending swaps when it is **smaller**.', 'Keep the `swapped` flag so you stop when a pass makes no swap.', 'Finish with `return names`.'],
            { requires: [{ re: '\\.sort\\(|\\bsorted\\(', not: true, msg: 'Write the sort yourself: do not use sort() or sorted().' }] }),
          X('m15-ex-ss-leaderboard', 'Sorted leaderboard', 3, 'exam',
            'Players and scores are entered on one line like <code>Ann:40,Raj:75,Mei:60</code>. The program (partly written) stores them in two parallel lists. Complete it so that a bubble sort puts the players in order of score, highest first, **moving the name and the score together**. Then display each player on a line as <code>1. Raj 75</code>, <code>2. Mei 60</code> and so on. (9 marks)',
            C`
              names = []
              scores = []
              for pair in input("Players: ").split(","):
                  parts = pair.split(":")
                  names.append(parts[0])
                  scores.append(int(parts[1]))
              # sort both lists together, then display
            `,
            C`
              names = []
              scores = []
              for pair in input("Players: ").split(","):
                  parts = pair.split(":")
                  names.append(parts[0])
                  scores.append(int(parts[1]))
              swapped = True
              while swapped:
                  swapped = False
                  for i in range(len(scores) - 1):
                      if scores[i] < scores[i + 1]:
                          scores[i], scores[i + 1] = scores[i + 1], scores[i]
                          names[i], names[i + 1] = names[i + 1], names[i]
                          swapped = True
              for i in range(len(names)):
                  print(str(i + 1) + ".", names[i], scores[i])
            `,
            [{ in: ['Ann:40,Raj:75,Mei:60'], out: '1. Raj 75\n2. Mei 60\n3. Ann 40' }, { in: ['Zed:9'], out: '1. Zed 9' }, { in: ['A:5,B:5,C:9'], out: '1. C 9\n2. A 5\n3. B 5' }, { in: ['P:1,Q:2,R:3,S:4'], out: '1. S 4\n2. R 3\n3. Q 2\n4. P 1', hidden: true }],
            ['Compare the **scores**, but swap in both lists every time.', 'Use `>` / `<` (not `<=`), so equal scores keep their original order.', 'Number the output with `i + 1`.'],
            { requires: [{ re: '\\.sort\\(|\\bsorted\\(', not: true, msg: 'Write the sort yourself: do not use sort() or sorted().' }] }),
          X('m15-ex-ss-linear', 'Linear search with a count', 2, 'exam',
            'A list of numbers is entered on one line (comma separated), then a number to find on the next line. Search from the start of the list, stopping as soon as it is found. Display <code>Items checked: </code> and how many items you looked at, then <code>Found at index </code> and the index (from 0) or <code>Not found</code>. (7 marks)',
            C`
              items = []
              for item in input("Numbers: ").split(","):
                  items.append(int(item))
              target = int(input("Find: "))
              # linear search
            `,
            C`
              items = []
              for item in input("Numbers: ").split(","):
                  items.append(int(item))
              target = int(input("Find: "))
              checked = 0
              position = -1
              for i in range(len(items)):
                  checked = checked + 1
                  if items[i] == target:
                      position = i
                      break
              print("Items checked:", checked)
              if position >= 0:
                  print("Found at index", position)
              else:
                  print("Not found")
            `,
            [{ in: ['4,9,2,9', '9'], out: 'Items checked: 2\nFound at index 1' }, { in: ['4,9,2,9', '5'], out: 'Items checked: 4\nNot found' }, { in: ['7', '7'], out: 'Items checked: 1\nFound at index 0' }, { in: ['1,2,3,4,5', '5'], out: 'Items checked: 5\nFound at index 4', hidden: true }],
            ['Add 1 to `checked` before testing each item.', '`break` leaves the loop once you have found it.', 'Start `position` at -1 to mean "not found".']),
          X('m15-ex-ss-binary', 'Binary search table', 3, 'exam',
            'A sorted list of whole numbers is entered on one line, then the target on the next. Perform a binary search using <code>mid = (low + high) // 2</code>. On every pass display <code>low=L high=H mid=M</code>. Afterwards display <code>Found at index X</code> or <code>Not found</code>. (10 marks)',
            C`
              items = []
              for item in input("Sorted numbers: ").split(","):
                  items.append(int(item))
              target = int(input("Find: "))
              # binary search
            `,
            C`
              items = []
              for item in input("Sorted numbers: ").split(","):
                  items.append(int(item))
              target = int(input("Find: "))
              low = 0
              high = len(items) - 1
              position = -1
              while low <= high and position == -1:
                  mid = (low + high) // 2
                  print("low=" + str(low), "high=" + str(high), "mid=" + str(mid))
                  if items[mid] == target:
                      position = mid
                  elif target < items[mid]:
                      high = mid - 1
                  else:
                      low = mid + 1
              if position >= 0:
                  print("Found at index", position)
              else:
                  print("Not found")
            `,
            [{ in: ['3,8,12,17,21,25,30', '25'], out: 'low=0 high=6 mid=3\nlow=4 high=6 mid=5\nFound at index 5' }, { in: ['3,8,12,17,21,25,30', '4'], out: 'low=0 high=6 mid=3\nlow=0 high=2 mid=1\nlow=0 high=0 mid=0\nNot found' }, { in: ['3,8,12,17,21,25,30', '3'], out: 'low=0 high=6 mid=3\nlow=0 high=2 mid=1\nlow=0 high=0 mid=0\nFound at index 0' }, { in: ['7', '7'], out: 'low=0 high=0 mid=0\nFound at index 0', hidden: true }, { in: ['2,4,6,8', '9'], out: 'low=0 high=3 mid=1\nlow=2 high=3 mid=2\nlow=3 high=3 mid=3\nNot found', hidden: true }],
            ['Use `low`, `high` and `mid` exactly as in the pseudocode.', 'Display the line **before** deciding which half to keep.', 'If the target is smaller than the middle item, `high = mid - 1`; otherwise `low = mid + 1`.']),
          X('m15-ex-ss-merge', 'Merging sorted lists', 3, 'exam',
            '(a) Write <code>merge(a, b)</code> that takes two lists that are already in ascending order and returns one new sorted list containing every item from both, without using <code>sort()</code> or <code>sorted()</code>. (6 marks)<br>(b) Using <code>merge</code>, write the recursive function <code>merge_sort(items)</code> that returns a new sorted list: split the list in half, sort each half, and merge them. A list of 0 or 1 items is already sorted. (4 marks)',
            C`
              def merge(a, b):
                  pass

              def merge_sort(items):
                  pass
            `,
            C`
              def merge(a, b):
                  result = []
                  i = 0
                  j = 0
                  while i < len(a) and j < len(b):
                      if a[i] <= b[j]:
                          result.append(a[i])
                          i = i + 1
                      else:
                          result.append(b[j])
                          j = j + 1
                  while i < len(a):
                      result.append(a[i])
                      i = i + 1
                  while j < len(b):
                      result.append(b[j])
                      j = j + 1
                  return result

              def merge_sort(items):
                  if len(items) <= 1:
                      return items
                  middle = len(items) // 2
                  left = merge_sort(items[:middle])
                  right = merge_sort(items[middle:])
                  return merge(left, right)
            `,
            [
              { py: 'assert merge([1,4,9],[2,3,10,11]) == [1,2,3,4,9,10,11], "merge"', label: 'merge two lists' },
              { py: 'assert merge([],[5,6]) == [5,6] and merge([5,6],[]) == [5,6] and merge([],[]) == [], "empty lists"', label: 'empty lists' },
              { py: 'assert merge([2,2,5],[2,3]) == [2,2,2,3,5], "duplicates"', label: 'duplicates', hidden: true },
              { py: 'assert merge_sort([9,1,7,6,3,5,2,8]) == [1,2,3,5,6,7,8,9], "merge_sort"', label: 'merge sort eight items' },
              { py: 'assert merge_sort([]) == [] and merge_sort([4]) == [4] and merge_sort([3,3,1]) == [1,3,3], "edge cases"', label: 'merge sort edge cases', hidden: true },
            ],
            ['Keep an index into each list and always take the smaller front item.', 'When one list runs out, add everything left in the other.', 'For `merge_sort`, split with `items[:middle]` and `items[middle:]`.'],
            { requires: [{ re: '\\.sort\\(|\\bsorted\\(', not: true, msg: 'Write the algorithm yourself: do not use sort() or sorted().' }] }),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-ciphers-encoding',
        title: 'Ciphers and encoding',
        time: '45 min',
        book: 'Ch 3 · data and encryption',
        exam: 'Paper 2 · Caesar, Vigenère, compression, binary',
        summary: 'Caesar and Vigenère ciphers, rail fence, run-length decoding, binary and hex helpers',
        intro: 'Chapter 3 questions on encryption appear on both papers. On Paper 2 you code them: take text, change it letter by letter, and keep everything else (spaces, capitals, punctuation) correct.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'Almost every cipher program has the same skeleton: **loop over the characters**, **decide what kind of character it is**, **change letters only**, and **build a new string**. The marks are for each of those four ideas, plus any validation the question asks for (for example a key from 1 to 25).' },
          { t: 'note', kind: 'exam', html: 'Learn these four character tools: `ord("A")` is 65 and `ord("a")` is 97; `chr(65)` is `"A"`; `ch.isalpha()` is True for letters only; `ch.isupper()` tells you which alphabet to use. A shift wraps around with `% 26`.' },
          { t: 'cases', title: 'Caesar shift, step by step', items: [
            { label: 'One letter', code: C`
              ch = "d"
              key = 3
              position = ord(ch) - ord("a")
              new_position = (position + key) % 26
              print(chr(new_position + ord("a")))
            ` },
            { label: 'Wrapping past z', code: C`
              for ch in "xyz":
                  position = ord(ch) - ord("a")
                  print(ch, "->", chr((position + 3) % 26 + ord("a")))
            ` },
            { label: 'A whole message', code: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      if ch.isupper():
                          result = result + chr((ord(ch) - 65 + key) % 26 + 65)
                      elif ch.islower():
                          result = result + chr((ord(ch) - 97 + key) % 26 + 97)
                      else:
                          result = result + ch
                  return result
              print(encrypt("Hello, World!", 3))
            ` },
            { label: 'Decrypt', intro: 'Shifting by the negative key undoes the encryption. Python\'s `%` keeps the answer positive.', code: C`
              def shift(text, key):
                  result = ""
                  for ch in text:
                      if ch.isalpha():
                          base = 65 if ch.isupper() else 97
                          result = result + chr((ord(ch) - base + key) % 26 + base)
                      else:
                          result = result + ch
                  return result
              secret = shift("Hello, World!", 3)
              print(secret)
              print(shift(secret, -3))
            ` },
          ] },
          { t: 'h', text: 'Vigenère, rail fence, RLE and binary' },
          { t: 'cases', title: 'Other encodings in code', items: [
            { label: 'Vigenère (idea)', intro: 'Each plaintext letter is shifted by the matching letter of the keyword (a = 0, b = 1 ...). The keyword repeats along the message.', code: C`
              plain = "attack"
              key = "lemon"
              out = ""
              for i in range(len(plain)):
                  shift = ord(key[i % len(key)]) - 97
                  out = out + chr((ord(plain[i]) - 97 + shift) % 26 + 97)
              print(out)
            ` },
            { label: 'Rail fence (3 rails)', intro: 'Write the text in a zigzag over the rails, then read each rail from top to bottom.', code: C`
              text = "WEAREDISCOVERED"
              rows = ["", "", ""]
              row = 0
              step = 1
              for ch in text:
                  rows[row] = rows[row] + ch
                  if row == 0:
                      step = 1
                  elif row == 2:
                      step = -1
                  row = row + step
              print(rows)
              print("".join(rows))
            ` },
            { label: 'Run-length decoding', intro: 'Digits build up a count; the next non-digit is the character to repeat.', code: C`
              encoded = "3W2B1A"
              result = ""
              count = ""
              for ch in encoded:
                  if ch.isdigit():
                      count = count + ch
                  else:
                      result = result + ch * int(count)
                      count = ""
              print(result)
            ` },
            { label: 'Binary and hex helpers', code: C`
              n = 45
              print(format(n, "08b"))
              print(format(n, "X"))
              print(int("00101101", 2), int("2D", 16))
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'Caesar shifts have **two** alphabets. Using `ord("a")` for a capital letter gives a negative number and the wrong result. Test your function with a capital letter, a lower-case letter, a space and a full stop.' },
          { t: 'predict', code: C`
            ch = "Y"
            print(chr((ord(ch) - 65 + 4) % 26 + 65))
          `, why: 'Y is position 24. 24 + 4 = 28, and 28 % 26 = 2, which is the letter C.' },
          { t: 'quiz', q: 'A Caesar program gives the wrong answer for capital letters only. What is the most likely cause?', options: ['It uses `ord("a")` as the base for every letter', 'It forgot the `% 26`', 'It forgot to add the key', 'It used `isalpha()`'], answer: 0, why: 'Capital letters start at 65, lower-case at 97. Using 97 as the base for a capital gives a negative position and a wrong letter.' },
          { t: 'tracetable', id: 'm15-tt-caesar', code: C`
            key = 3
            ch = "x"
            position = ord(ch) - 97
            new_position = (position + key) % 26
            result = chr(new_position + 97)
          `, cols: ['position', 'new_position', 'result'], prompt: 'Trace one Caesar letter.' },
          { t: 'h', text: 'Your turn' },
          X('m15-ex-ce-caesarfile', 'Caesar to a file', 2, 'exam',
            'Write a program that inputs a plaintext message and then a key. The key must be a whole number from 1 to 25: if it is not, display <code>Key must be 1 to 25</code> and input the key again. Encrypt the message with a Caesar cipher (letters wrap around and keep their case; other characters are unchanged), write the ciphertext to <code>Cipher.txt</code> and display it. (10 marks)',
            C`
              text = input("Message: ")
              # input and validate the key
              # encrypt, write to Cipher.txt and display
            `,
            C`
              text = input("Message: ")
              while True:
                  key_text = input("Key: ")
                  if key_text.isdigit() and 1 <= int(key_text) <= 25:
                      key = int(key_text)
                      break
                  print("Key must be 1 to 25")
              cipher = ""
              for ch in text:
                  if ch.isupper():
                      cipher = cipher + chr((ord(ch) - 65 + key) % 26 + 65)
                  elif ch.islower():
                      cipher = cipher + chr((ord(ch) - 97 + key) % 26 + 97)
                  else:
                      cipher = cipher + ch
              file = open("Cipher.txt", "w")
              file.write(cipher + "\n")
              file.close()
              print(cipher)
            `,
            [{ in: ['Hello, World!', '3'], out: 'Khoor, Zruog!', files_out: { 'Cipher.txt': 'Khoor, Zruog!\n' } }, { in: ['xyz ABC', '30', '0', '2'], out: 'Key must be 1 to 25\nKey must be 1 to 25\nzab CDE', files_out: { 'Cipher.txt': 'zab CDE\n' } }, { in: ['Zebra 99', '25'], out: 'Ydaqz 99', files_out: { 'Cipher.txt': 'Ydaqz 99\n' }, hidden: true }, { in: ['abc', 'x', '1'], out: 'Key must be 1 to 25\nbcd', hidden: true }],
            ['Use `while True` and `break` for the key, with `isdigit()` before `int()`.', 'Two cases: upper-case base 65, lower-case base 97. Everything else is copied.', 'Write `cipher + "\\n"` to the file, then display `cipher`.']),
          X('m15-ex-ce-decrypt', 'Decrypt and crack', 2, 'exam',
            '(a) Write <code>decrypt(text, key)</code> that reverses a Caesar cipher with that key (keep case; leave other characters alone). (5 marks)<br>(b) Write <code>crack(cipher, known)</code> that tries every key from 1 to 25 and returns the first key for which the decrypted text contains the word <code>known</code>, or <code>None</code> if there is no such key. (4 marks)',
            C`
              def decrypt(text, key):
                  pass

              def crack(cipher, known):
                  pass
            `,
            C`
              def decrypt(text, key):
                  result = ""
                  for ch in text:
                      if ch.isupper():
                          result = result + chr((ord(ch) - 65 - key) % 26 + 65)
                      elif ch.islower():
                          result = result + chr((ord(ch) - 97 - key) % 26 + 97)
                      else:
                          result = result + ch
                  return result

              def crack(cipher, known):
                  for key in range(1, 26):
                      if known in decrypt(cipher, key):
                          return key
                  return None
            `,
            [
              { py: 'assert decrypt("Khoor, Zruog!", 3) == "Hello, World!", "basic"', label: 'basic decrypt' },
              { py: 'assert decrypt("zab CDE", 2) == "xyz ABC" and decrypt("Ydaqz 99", 25) == "Zebra 99", "wrap-around"', label: 'wrap-around' },
              { py: 'assert crack("Khoor Zruog", "Hello") == 3 and crack("Ymj vznhp gwtbs ktc", "quick") == 5, "crack"', label: 'cracking' },
              { py: 'assert crack("Khoor", "zzzz") is None, "no key found"', label: 'not found', hidden: true },
            ],
            ['To undo a shift of `key`, subtract it before `% 26`.', 'Use the same two bases (65 and 97) as for encrypting.', 'In `crack` loop `for key in range(1, 26)` and `return` as soon as the word appears.']),
          X('m15-ex-ce-vigenere', 'Vigenère cipher', 3, 'exam',
            'Write <code>vigenere_encrypt(text, keyword)</code> and <code>vigenere_decrypt(text, keyword)</code>. The text and keyword are lower-case letters; the text may also contain spaces. Each letter of the text is shifted by the matching letter of the keyword (a = 0, b = 1, ..., z = 25). The keyword repeats, but only letters use up a keyword letter: spaces are copied unchanged and do not advance the keyword. For example <code>vigenere_encrypt("attack at dawn", "lemon")</code> returns <code>"lxfopv ef rnhr"</code>. (12 marks)',
            C`
              def vigenere_encrypt(text, keyword):
                  pass

              def vigenere_decrypt(text, keyword):
                  pass
            `,
            C`
              def vigenere(text, keyword, direction):
                  result = ""
                  k = 0
                  for ch in text:
                      if ch.isalpha():
                          shift = ord(keyword[k % len(keyword)]) - 97
                          result = result + chr((ord(ch) - 97 + direction * shift) % 26 + 97)
                          k = k + 1
                      else:
                          result = result + ch
                  return result

              def vigenere_encrypt(text, keyword):
                  return vigenere(text, keyword, 1)

              def vigenere_decrypt(text, keyword):
                  return vigenere(text, keyword, -1)
            `,
            [
              { py: 'assert vigenere_encrypt("attack at dawn", "lemon") == "lxfopv ef rnhr", "known example"', label: 'known example' },
              { py: 'assert vigenere_decrypt("lxfopv ef rnhr", "lemon") == "attack at dawn", "decrypt"', label: 'decrypt' },
              { py: 'assert vigenere_encrypt("zebra", "b") == "afcsb", "single-letter keyword"', label: 'one-letter keyword' },
              { py: 'assert vigenere_encrypt("hello", "a") == "hello" and vigenere_decrypt(vigenere_encrypt("meet me here", "key"), "key") == "meet me here", "round trip"', label: 'round trip', hidden: true },
            ],
            ['The shift for a letter is `ord(keyword_letter) - 97`.', 'Keep a separate counter `k` for the keyword, and add 1 only after a letter.', 'Decrypting is the same as encrypting with the shift subtracted.']),
          X('m15-ex-ce-rledecode', 'Run-length decoding', 2, 'exam',
            'A compressed string stores each run as a count followed by the character, for example <code>3W2B1A</code>. Counts may have several digits, such as <code>12x</code>. (a) Write <code>rle_decode(s)</code> that returns the original text (an empty string gives an empty string). (6 marks) (b) Write <code>saved(original, encoded)</code> that returns how many characters the compression saved (it can be negative). (2 marks)',
            C`
              def rle_decode(s):
                  pass

              def saved(original, encoded):
                  pass
            `,
            C`
              def rle_decode(s):
                  result = ""
                  count = ""
                  for ch in s:
                      if ch.isdigit():
                          count = count + ch
                      else:
                          result = result + ch * int(count)
                          count = ""
                  return result

              def saved(original, encoded):
                  return len(original) - len(encoded)
            `,
            [
              { py: 'assert rle_decode("3W2B1A") == "WWWBBA", "basic"', label: 'basic decode' },
              { py: 'assert rle_decode("12x") == "x" * 12 and rle_decode("") == "", "long counts and empty"', label: 'long counts and empty' },
              { py: 'assert rle_decode("1a1b1c") == "abc", "no runs"', label: 'no runs', hidden: true },
              { py: 'assert saved("WWWBBA", "3W2B1A") == 0 and saved("x" * 12, "12x") == 9 and saved("abc", "1a1b1c") == -3, "saved"', label: 'characters saved' },
            ],
            ['Digits are collected into a string until a non-digit arrives.', 'Repeat the character with `ch * int(count)`, then reset `count`.', '`saved` is the difference in lengths.']),
          X('m15-ex-ce-binary', 'Denary to binary and hex', 2, 'exam',
            'Write a program that inputs a whole number from 0 to 255. If the input is not a whole number in that range display <code>Enter a whole number from 0 to 255</code> and input again. When it is valid display <code>Binary: </code> followed by the 8-bit binary pattern, and <code>Hex: </code> followed by the two-digit hexadecimal value in capitals. (8 marks)',
            C`
              # repeat until the number is valid
            `,
            C`
              while True:
                  text = input("Number: ")
                  if text.isdigit() and int(text) <= 255:
                      break
                  print("Enter a whole number from 0 to 255")
              n = int(text)
              print("Binary:", format(n, "08b"))
              print("Hex:", format(n, "02X"))
            `,
            [{ in: ['45'], out: 'Binary: 00101101\nHex: 2D' }, { in: ['300', 'abc', '255'], out: 'Enter a whole number from 0 to 255\nEnter a whole number from 0 to 255\nBinary: 11111111\nHex: FF' }, { in: ['0'], out: 'Binary: 00000000\nHex: 00' }, { in: ['-4', '16'], out: 'Enter a whole number from 0 to 255\nBinary: 00010000\nHex: 10', hidden: true }],
            ['`text.isdigit()` is False for negative numbers and words, so check it before `int()`.', '`format(n, "08b")` gives 8 binary digits.', '`format(n, "02X")` gives two upper-case hex digits.']),
          X('m15-ex-ce-railfence', 'Rail fence cipher', 3, 'exam',
            'Write <code>rail_fence(text, rails)</code> that encrypts <code>text</code> with a rail fence cipher with the given number of rails. The letters are written in a zigzag down and up the rails, then each rail is read from top to bottom and the rails are joined. With 3 rails <code>"WEAREDISCOVEREDFLEEATONCE"</code> becomes <code>"WECRLTEERDSOEEFEAOCAIVDEN"</code>. One rail returns the text unchanged. (8 marks)',
            C`
              def rail_fence(text, rails):
                  pass
            `,
            C`
              def rail_fence(text, rails):
                  if rails == 1:
                      return text
                  rows = [""] * rails
                  row = 0
                  step = 1
                  for ch in text:
                      rows[row] = rows[row] + ch
                      if row == 0:
                          step = 1
                      elif row == rails - 1:
                          step = -1
                      row = row + step
                  return "".join(rows)
            `,
            [
              { py: 'assert rail_fence("WEAREDISCOVEREDFLEEATONCE", 3) == "WECRLTEERDSOEEFEAOCAIVDEN", "3 rails"', label: 'three rails' },
              { py: 'assert rail_fence("abcdef", 2) == "acebdf", "2 rails"', label: 'two rails' },
              { py: 'assert rail_fence("hello", 1) == "hello" and rail_fence("", 3) == "", "edge cases"', label: 'one rail and empty' },
              { py: 'assert rail_fence("abcdefgh", 4) == "agbfhced", "four rails"', label: 'four rails', hidden: true },
            ],
            ['Make a list of empty strings, one per rail, and a `row` index that starts at 0.', 'The direction changes at the top rail (go down) and the bottom rail (go up).', 'Finally `"".join(rows)`.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-games',
        title: 'Games: guessing, word and dice programs',
        time: '40 min',
        book: 'Ch 2 · programs with random',
        exam: 'Paper 2 · guessing games and scoring',
        summary: 'Random numbers and words, lives, repeat-until loops and scoring rules',
        intro: 'A guessing game is a favourite Paper 2 setting because it needs everything at once: random choice, a loop that repeats, selection, counting, and a message at the end.',
        blocks: [
          { t: 'h', text: 'The pattern' },
          { t: 'p', html: 'Read the game rules and break them into four parts: **setup** (pick the secret, set the counter or lives), **the loop** (repeat until the player wins or runs out), **the check** (compare the guess with the secret) and **the ending message**. Write each part as a comment first, then fill them in.' },
          { t: 'html', html: PRE('SET answer TO RANDOM(9) + 1\nSET counter TO 1\nRECEIVE guess FROM (INTEGER) KEYBOARD\nWHILE guess <> answer DO\n  SET counter TO counter + 1\n  IF guess > answer THEN\n    SEND "Too high" TO DISPLAY\n  ELSE\n    SEND "Too low" TO DISPLAY\n  END IF\n  RECEIVE guess FROM (INTEGER) KEYBOARD\nEND WHILE') },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode shows `RANDOM(9) + 1` for "a random number from 1 to 10". In Python use `random.randint(1, 10)`. Remember `import random` at the top: forgetting it is a classic planted error.' },
          { t: 'cases', title: 'The building blocks', items: [
            { label: 'Random number and word', code: C`
              import random
              number = random.randint(1, 10)
              word = random.choice(["tiger", "panda", "koala"])
              print(1 <= number <= 10, word in ["tiger", "panda", "koala"])
            ` },
            { label: 'Guess loop', stdin: ['5', '9', '7'], code: C`
              secret = 7
              guesses = 0
              while True:
                  guess = int(input("Guess: "))
                  guesses = guesses + 1
                  if guess < secret:
                      print("Too low")
                  elif guess > secret:
                      print("Too high")
                  else:
                      print("Correct in", guesses)
                      break
            ` },
            { label: 'Lives', stdin: ['x', 'y', 'z'], code: C`
              lives = 3
              while lives > 0:
                  letter = input("Letter: ")
                  if letter != "a":
                      lives = lives - 1
                      print("Wrong. Lives left:", lives)
              print("Game over")
            ` },
            { label: 'Masked word', code: C`
              word = "panda"
              guessed = ["a", "n"]
              shown = []
              for ch in word:
                  if ch in guessed:
                      shown.append(ch)
                  else:
                      shown.append("_")
              print(" ".join(shown))
            ` },
            { label: 'Seeding for testing', intro: 'The checker uses a fixed seed so a "random" game gives the same answer every time. Running twice with the same seed repeats the numbers.', code: C`
              import random
              random.seed(3)
              print(random.randint(1, 50), random.randint(1, 50))
              random.seed(3)
              print(random.randint(1, 50), random.randint(1, 50))
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'Do not call `random.randint` **inside** the loop when you want one secret number: that picks a new secret every time round, so nobody can ever win.' },
          { t: 'predict', code: C`
            lives = 3
            for letter in "xyz":
                if letter != "z":
                    lives = lives - 1
            print(lives)
          `, why: 'x and y are wrong guesses (two lives lost). z is correct, so no life is lost.' },
          { t: 'quiz', q: 'A guessing game starts with `counter = 0` and adds 1 after every input. Where must `counter = 0` be written?', options: ['Before the loop', 'Inside the loop, first line', 'After the loop', 'Inside the `if` for a correct guess'], answer: 0, why: 'Setup happens once. Inside the loop it would reset to 0 every time round and the final count would be wrong.' },
          { t: 'tracetable', id: 'm15-tt-guess', code: C`
            secret = 7
            counter = 0
            guess = 5
            counter = counter + 1
            guess = 9
            counter = counter + 1
            guess = 7
            counter = counter + 1
          `, cols: ['guess', 'counter'], prompt: 'Trace a three-guess game where the secret is 7.' },
          { t: 'h', text: 'Your turn' },
          X('m15-ex-g-higherlower', 'Higher or lower', 2, 'exam',
            'The computer picks a secret whole number from 1 to 50 (given in the starter). The player has up to 6 guesses. After each guess display <code>Too low</code> or <code>Too high</code>. If the guess is right display <code>Correct! Guesses: </code> and the number of guesses, and stop. If all 6 guesses are used without success display <code>Out of guesses. The number was </code> and the secret. (9 marks)',
            C`
              import random
              secret = random.randint(1, 50)
              # play the game
            `,
            C`
              import random
              secret = random.randint(1, 50)
              guesses = 0
              won = False
              while guesses < 6 and not won:
                  guess = int(input("Guess: "))
                  guesses = guesses + 1
                  if guess < secret:
                      print("Too low")
                  elif guess > secret:
                      print("Too high")
                  else:
                      print("Correct! Guesses:", guesses)
                      won = True
              if not won:
                  print("Out of guesses. The number was", secret)
            `,
            [{ seed: 1, in: ['20', '5', '9'], out: 'Too high\nToo low\nCorrect! Guesses: 3' }, { seed: 2, in: ['4'], out: 'Correct! Guesses: 1' }, { seed: 5, in: ['1', '2', '3', '4', '5', '6'], out: 'Too low\nToo low\nToo low\nToo low\nToo low\nToo low\nOut of guesses. The number was 40' }, { seed: 1, in: ['9'], out: 'Correct! Guesses: 1', hidden: true }, { seed: 5, in: ['41', '40'], out: 'Too high\nCorrect! Guesses: 2', hidden: true }],
            ['Pick the secret **once**, before the loop.', 'Stop the loop when the guess is right or when 6 guesses have been used.', 'Use a flag such as `won` to decide whether to show the "out of guesses" message.']),
          X('m15-ex-g-wordguess', 'Guess the animal', 3, 'exam',
            'A word is chosen at random (given). The player has 6 lives. Each turn input one letter. If it is in the word display <code>Correct</code>; otherwise lose a life and display <code>Wrong. Lives left: </code> and the number. After each turn display <code>Word: </code> and the word with unguessed letters shown as <code>_</code>, all separated by single spaces. When every letter has been guessed display <code>You won! The word was </code> and the word. If lives reach 0 display <code>You lost! The word was </code> and the word. A wrong letter guessed twice costs a life twice. (12 marks)',
            C`
              import random
              words = ["tiger", "panda", "koala", "zebra", "camel"]
              word = random.choice(words)
              lives = 6
              # play the game
            `,
            C`
              import random
              words = ["tiger", "panda", "koala", "zebra", "camel"]
              word = random.choice(words)
              lives = 6
              guessed = []
              while True:
                  letter = input("Letter: ")
                  guessed.append(letter)
                  if letter in word:
                      print("Correct")
                  else:
                      lives = lives - 1
                      print("Wrong. Lives left:", lives)
                  shown = []
                  for ch in word:
                      if ch in guessed:
                          shown.append(ch)
                      else:
                          shown.append("_")
                  print("Word:", " ".join(shown))
                  if "_" not in shown:
                      print("You won! The word was", word)
                      break
                  if lives == 0:
                      print("You lost! The word was", word)
                      break
            `,
            [{ seed: 1, in: ['p', 'a', 'n', 'd'], out: 'Correct\nWord: p _ _ _ _\nCorrect\nWord: p a _ _ a\nCorrect\nWord: p a n _ a\nCorrect\nWord: p a n d a\nYou won! The word was panda' }, { seed: 1, in: ['x', 'y', 'z', 'q', 'w', 'e'], out: 'Wrong. Lives left: 5\nWord: _ _ _ _ _\nWrong. Lives left: 4\nWord: _ _ _ _ _\nWrong. Lives left: 3\nWord: _ _ _ _ _\nWrong. Lives left: 2\nWord: _ _ _ _ _\nWrong. Lives left: 1\nWord: _ _ _ _ _\nWrong. Lives left: 0\nWord: _ _ _ _ _\nYou lost! The word was panda' }, { seed: 5, in: ['c', 'z', 'a', 'm', 'e', 'l'], out: 'Correct\nWord: c _ _ _ _\nWrong. Lives left: 5\nWord: c _ _ _ _\nCorrect\nWord: c a _ _ _\nCorrect\nWord: c a m _ _\nCorrect\nWord: c a m e _\nCorrect\nWord: c a m e l\nYou won! The word was camel', hidden: true }],
            ['Keep a list of the letters guessed so far.', 'To build the display, loop over the secret word and show a letter only if it is in `guessed`.', 'The player wins when no `_` is left; they lose when `lives` is 0. Check both after each display.']),
          X('m15-ex-g-dice', 'Dice game scoring', 2, 'exam',
            'In a dice game each round a player rolls two dice. The round score is the total of the two dice, but a double (both dice the same) scores double the total, and a total of exactly 7 scores 0. (a) Write <code>round_score(d1, d2)</code>. (4 marks) (b) Write <code>play(rolls)</code> that takes a list of rounds, each a pair <code>(d1, d2)</code>, and returns the player\'s total score. (3 marks) (c) Write <code>winner(a_rolls, b_rolls)</code> that returns <code>"Player A wins"</code>, <code>"Player B wins"</code> or <code>"Draw"</code>. (3 marks)',
            C`
              def round_score(d1, d2):
                  pass

              def play(rolls):
                  pass

              def winner(a_rolls, b_rolls):
                  pass
            `,
            C`
              def round_score(d1, d2):
                  total = d1 + d2
                  if total == 7:
                      return 0
                  if d1 == d2:
                      return total * 2
                  return total

              def play(rolls):
                  score = 0
                  for d1, d2 in rolls:
                      score = score + round_score(d1, d2)
                  return score

              def winner(a_rolls, b_rolls):
                  a = play(a_rolls)
                  b = play(b_rolls)
                  if a > b:
                      return "Player A wins"
                  elif b > a:
                      return "Player B wins"
                  return "Draw"
            `,
            [
              { py: 'assert round_score(1, 2) == 3 and round_score(5, 6) == 11, "plain totals"', label: 'plain totals' },
              { py: 'assert round_score(2, 2) == 8 and round_score(6, 6) == 24, "doubles"', label: 'doubles' },
              { py: 'assert round_score(3, 4) == 0 and round_score(1, 6) == 0, "seven scores 0"', label: 'a total of 7' },
              { py: 'assert play([(3, 4), (2, 2), (1, 2)]) == 11 and play([]) == 0, "play"', label: 'play a game' },
              { py: 'assert winner([(6, 6)], [(5, 5), (1, 1)]) == "Draw" and winner([(1, 2)], [(1, 3)]) == "Player B wins" and winner([(6, 5)], [(1, 2)]) == "Player A wins", "winner"', label: 'winner', hidden: true },
            ],
            ['Check for a total of 7 before checking for a double.', 'In `play`, loop over the rounds and add `round_score(d1, d2)` for each one.', '`winner` can call `play` twice and compare.']),
          X('m15-ex-g-picker', 'Question picker', 2, 'exam',
            'A quiz has three questions and answers (given). The player chooses a question number from 1 to 3, and each question can only be chosen once. If the number is not 1 to 3 display <code>Choose 1 to 3</code>; if the question was already used display <code>Already used</code>; neither counts as an attempt. Otherwise display the question, input the answer and display <code>Correct</code> or <code>Wrong, the answer is </code> and the answer (ignore upper and lower case). After all three questions have been answered display <code>Score: X out of 3</code>. (10 marks)',
            C`
              questions = ["Sound a cow makes?", "Sound a duck makes?", "Sound a sheep makes?"]
              answers = ["moo", "quack", "baa"]
              # run the quiz
            `,
            C`
              questions = ["Sound a cow makes?", "Sound a duck makes?", "Sound a sheep makes?"]
              answers = ["moo", "quack", "baa"]
              used = []
              score = 0
              while len(used) < 3:
                  choice = int(input("Question number: "))
                  if choice < 1 or choice > 3:
                      print("Choose 1 to 3")
                  elif choice in used:
                      print("Already used")
                  else:
                      used.append(choice)
                      print(questions[choice - 1])
                      reply = input("Answer: ")
                      if reply.strip().lower() == answers[choice - 1]:
                          print("Correct")
                          score = score + 1
                      else:
                          print("Wrong, the answer is", answers[choice - 1])
              print("Score:", score, "out of 3")
            `,
            [{ in: ['2', 'quack', '1', 'MOO', '3', 'woof'], out: 'Sound a duck makes?\nCorrect\nSound a cow makes?\nCorrect\nSound a sheep makes?\nWrong, the answer is baa\nScore: 2 out of 3' }, { in: ['4', '1', 'moo', '1', '2', 'x', '3', 'baa'], out: 'Choose 1 to 3\nSound a cow makes?\nCorrect\nAlready used\nSound a duck makes?\nWrong, the answer is quack\nSound a sheep makes?\nCorrect\nScore: 2 out of 3' }, { in: ['0', '3', 'baa', '2', 'quack', '1', 'moo'], out: 'Choose 1 to 3\nSound a sheep makes?\nCorrect\nSound a duck makes?\nCorrect\nSound a cow makes?\nCorrect\nScore: 3 out of 3', hidden: true }],
            ['Keep a list `used`. The loop runs until it holds three question numbers.', 'Use `questions[choice - 1]` because the list starts at index 0.', 'Only add to `used` (and score) for a valid, unused choice.']),
          X('m15-ex-g-rps', 'Rock, paper, scissors', 1, 'exam',
            'Write <code>rps_winner(a, b)</code> that takes two moves, each <code>"rock"</code>, <code>"paper"</code> or <code>"scissors"</code>, and returns <code>"Player 1"</code>, <code>"Player 2"</code> or <code>"Draw"</code>. Rock beats scissors, scissors beats paper, paper beats rock. If either move is anything else return <code>"Invalid"</code>. (6 marks)',
            C`
              def rps_winner(a, b):
                  pass
            `,
            C`
              def rps_winner(a, b):
                  moves = ["rock", "paper", "scissors"]
                  if a not in moves or b not in moves:
                      return "Invalid"
                  if a == b:
                      return "Draw"
                  if (a == "rock" and b == "scissors") or (a == "scissors" and b == "paper") or (a == "paper" and b == "rock"):
                      return "Player 1"
                  return "Player 2"
            `,
            [
              { py: 'assert rps_winner("rock", "scissors") == "Player 1" and rps_winner("paper", "rock") == "Player 1" and rps_winner("scissors", "paper") == "Player 1", "player 1 wins"', label: 'Player 1 wins' },
              { py: 'assert rps_winner("scissors", "rock") == "Player 2" and rps_winner("rock", "paper") == "Player 2" and rps_winner("paper", "scissors") == "Player 2", "player 2 wins"', label: 'Player 2 wins' },
              { py: 'assert rps_winner("rock", "rock") == "Draw" and rps_winner("paper", "paper") == "Draw", "draws"', label: 'draws' },
              { py: 'assert rps_winner("lizard", "rock") == "Invalid" and rps_winner("rock", "") == "Invalid", "invalid moves"', label: 'invalid moves', hidden: true },
            ],
            ['Deal with invalid moves first, then draws.', 'There are three winning pairs for Player 1. Join them with `or` and use brackets.', 'Anything left must be a win for Player 2.']),
        ],
      },
      /* ------------------------------------------------------------------ */
      {
        id: 'pp-mixed-test',
        title: 'Timed practice: mixed test',
        time: '90 min',
        book: 'Ch 1 to 3 · mixed',
        exam: 'Paper 2 · exam conditions',
        summary: 'Six mixed tasks of 8 to 12 marks to attempt under time',
        intro: 'This is a timed practice. Six tasks, 60 marks in total. Aim for about one and a half minutes per mark: 90 minutes for the whole test. The site has no timer, so use a clock or phone.',
        blocks: [
          { t: 'h', text: 'How to run the test' },
          { t: 'list', ordered: true, items: [
            'Set a clock for 90 minutes and do not look at the hints. In the real exam there are none.',
            'Read each question once, **underline the bullet points** (what the program must do) and tick them off as you code them.',
            'If a task is not working after about ten minutes, leave it, move on, and come back. Partly working code still earns marks.',
            'Press **Check** only when you have run the program yourself with at least one example.',
            'After the clock stops, mark yourself honestly: list the tasks that failed a test and read the matching earlier lesson.',
          ] },
          { t: 'table', head: ['Task', 'Skills', 'Marks'], rows: [
            ['1 School shop', 'Validation loop, selection tiers, formatting', '8'],
            ['2 Attendance file', 'Reading records, percentages, writing a file', '10'],
            ['3 Temperature log', 'List analysis: extremes, range, count above average', '8'],
            ['4 Test results table', '2D list, averages, most improved', '10'],
            ['5 Car park menu', 'Function plus menu loop, running total', '12'],
            ['6 Word search', 'Bubble sort and binary search', '12'],
          ] },
          { t: 'note', kind: 'exam', html: 'Mark scheme thinking: for a 10-mark programming question about half the marks are for the **main requirement** working, a quarter for **correct handling of the edge cases** (empty, boundary, repeat) and a quarter for **good structure** (meaningful names, comments, no unnecessary code). Comment the tricky lines: the 2022 paper explicitly asked for comments to explain the logic.' },
          { t: 'quiz', q: 'You have 20 minutes left and one task is only half finished. What gives the most marks?', options: ['Check that the half you have runs without errors, then start the next task', 'Rewrite the half-finished task from scratch', 'Add extra features to a finished task', 'Stop and review the hints'], answer: 0, why: 'Working partial code earns method marks. Spending the remaining time on a new task usually earns more than perfecting one.' },
          { t: 'h', text: 'Task 1: School shop (8 marks)' },
          X('m15-ex-mt-shop', 'School shop order', 2, 'exam',
            'A school shop sells pens. Input the number of pens wanted. It must be a whole number from 1 to 50; if not display <code>Enter 1 to 50</code> and ask again (3 marks). The price of one pen depends on the number bought: 1 to 9 pens cost 1.20 each; 10 to 24 cost 1.00 each; 25 or more cost 0.80 each (3 marks). Display <code>Total: </code> and the total cost to 2 decimal places, and, if the total is at least 20, a second line <code>Free ruler included</code> (2 marks).',
            C`
              # validate the number of pens, work out the total, display the results
            `,
            C`
              while True:
                  text = input("Number of pens: ")
                  if text.isdigit() and 1 <= int(text) <= 50:
                      break
                  print("Enter 1 to 50")
              pens = int(text)
              if pens >= 25:
                  price = 0.80
              elif pens >= 10:
                  price = 1.00
              else:
                  price = 1.20
              total = pens * price
              print("Total:", format(total, ".2f"))
              if total >= 20:
                  print("Free ruler included")
            `,
            [{ in: ['5'], out: 'Total: 6.00' }, { in: ['0', '51', '10'], out: 'Enter 1 to 50\nEnter 1 to 50\nTotal: 10.00' }, { in: ['25'], out: 'Total: 20.00\nFree ruler included' }, { in: ['abc', '9'], out: 'Enter 1 to 50\nTotal: 10.80', hidden: true }, { in: ['24'], out: 'Total: 24.00\nFree ruler included', hidden: true }, { in: ['50'], out: 'Total: 40.00\nFree ruler included', hidden: true }],
            ['Validation first with `while True` and `break`.', 'Test 25 or more first, then 10 or more.', '`format(total, ".2f")` gives two decimal places.']),
          { t: 'h', text: 'Task 2: Attendance file (10 marks)' },
          X('m15-ex-mt-attendance', 'Attendance report', 3, 'exam',
            '<code>attendance.txt</code> holds one pupil per line as <code>name,sessions attended,total sessions</code>. For each pupil display <code>name: </code> and the percentage attended to 1 decimal place followed by <code>%</code>, for example <code>Asha: 90.0%</code> (5 marks). Write the names of pupils whose attendance is below 80%, one per line, to <code>Low.txt</code> (3 marks). Finally display <code>Below 80%: </code> and how many pupils were below 80% (2 marks).',
            C`
              file = open("attendance.txt", "r")
              low = open("Low.txt", "w")
              # process each pupil
              file.close()
              low.close()
            `,
            C`
              file = open("attendance.txt", "r")
              low = open("Low.txt", "w")
              below = 0
              for line in file:
                  parts = line.strip().split(",")
                  percent = int(parts[1]) / int(parts[2]) * 100
                  print(parts[0] + ":", str(round(percent, 1)) + "%")
                  if percent < 80:
                      low.write(parts[0] + "\n")
                      below = below + 1
              file.close()
              low.close()
              print("Below 80%:", below)
            `,
            [{ files: { 'attendance.txt': 'Asha,18,20\nBen,12,20\nCara,15,20\n' }, out: 'Asha: 90.0%\nBen: 60.0%\nCara: 75.0%\nBelow 80%: 2', files_out: { 'Low.txt': 'Ben\nCara\n' } }, { files: { 'attendance.txt': 'Dev,16,20\n' }, out: 'Dev: 80.0%\nBelow 80%: 0', files_out: { 'Low.txt': '' } }, { files: { 'attendance.txt': 'Eli,1,3\nFay,10,10\n' }, out: 'Eli: 33.3%\nFay: 100.0%\nBelow 80%: 1', files_out: { 'Low.txt': 'Eli\n' }, hidden: true }],
            ['Split each line, then convert fields 1 and 2 with `int()`.', 'Percentage = attended / total * 100.', 'Compare the unrounded percentage with 80. Write `name + "\\n"` for each low pupil.']),
          { t: 'h', text: 'Task 3: Temperature log (8 marks)' },
          X('m15-ex-mt-temps', 'Temperature log', 2, 'exam',
            'A weather station enters readings on one line separated by commas (whole numbers, may be negative). Display <code>Highest: </code>, <code>Lowest: </code> and <code>Range: </code> (highest minus lowest) on separate lines (4 marks). Display <code>Average: </code> to 1 decimal place (2 marks). Display <code>Above average: </code> and how many readings are above the average (2 marks). Do not use <code>max()</code> or <code>min()</code>.',
            C`
              readings = []
              for item in input("Readings: ").split(","):
                  readings.append(int(item))
              # analyse the readings
            `,
            C`
              readings = []
              for item in input("Readings: ").split(","):
                  readings.append(int(item))
              high = readings[0]
              low = readings[0]
              total = 0
              for r in readings:
                  if r > high:
                      high = r
                  if r < low:
                      low = r
                  total = total + r
              mean = total / len(readings)
              above = 0
              for r in readings:
                  if r > mean:
                      above = above + 1
              print("Highest:", high)
              print("Lowest:", low)
              print("Range:", high - low)
              print("Average:", round(mean, 1))
              print("Above average:", above)
            `,
            [{ in: ['12,15,9,20'], out: 'Highest: 20\nLowest: 9\nRange: 11\nAverage: 14.0\nAbove average: 2' }, { in: ['-5,-2,-9'], out: 'Highest: -2\nLowest: -9\nRange: 7\nAverage: -5.3\nAbove average: 2' }, { in: ['8'], out: 'Highest: 8\nLowest: 8\nRange: 0\nAverage: 8.0\nAbove average: 0' }, { in: ['1,1,1,5'], out: 'Highest: 5\nLowest: 1\nRange: 4\nAverage: 2.0\nAbove average: 1', hidden: true }],
            ['Start `high` and `low` with the first reading.', 'One loop can find highest, lowest and total.', 'You need the average before you can count readings above it, so use a second loop.'],
            { requires: [{ re: '\\bmax\\(|\\bmin\\(', not: true, msg: 'Do not use max() or min().' }] }),
          { t: 'h', text: 'Task 4: Test results table (10 marks)' },
          X('m15-ex-mt-results', 'Improving pupils', 3, 'exam',
            'The number of pupils is entered, then one line per pupil of three or more test marks, comma separated. For each pupil display <code>Pupil N: </code> and the average mark to 1 decimal place (N from 1) (5 marks). Then display <code>Most improved: pupil N</code>, the pupil whose last mark minus first mark is the greatest (the first if tied) (5 marks). Your program must work for any number of pupils and tests.',
            C`
              rows = int(input("Number of pupils: "))
              marks = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  marks.append(row)
              # averages and most improved
            `,
            C`
              rows = int(input("Number of pupils: "))
              marks = []
              for r in range(rows):
                  row = []
                  for item in input().split(","):
                      row.append(int(item))
                  marks.append(row)
              best_gain = None
              best_pupil = 0
              for r in range(len(marks)):
                  total = 0
                  for c in range(len(marks[r])):
                      total = total + marks[r][c]
                  print("Pupil " + str(r + 1) + ":", round(total / len(marks[r]), 1))
                  gain = marks[r][-1] - marks[r][0]
                  if best_gain is None or gain > best_gain:
                      best_gain = gain
                      best_pupil = r + 1
              print("Most improved: pupil", best_pupil)
            `,
            [{ in: ['3', '50,60,70', '80,70,60', '40,50,90'], out: 'Pupil 1: 60.0\nPupil 2: 70.0\nPupil 3: 60.0\nMost improved: pupil 3' }, { in: ['2', '10,10,10,10', '5,6,7,9'], out: 'Pupil 1: 10.0\nPupil 2: 6.8\nMost improved: pupil 2' }, { in: ['1', '9,8,7'], out: 'Pupil 1: 8.0\nMost improved: pupil 1', hidden: true }, { in: ['2', '1,5', '2,6'], out: 'Pupil 1: 3.0\nPupil 2: 4.0\nMost improved: pupil 1', hidden: true }],
            ['Total each row (reset the total for every pupil), then divide by the row length.', 'The improvement is `marks[r][-1] - marks[r][0]`. It can be negative, so do not start your best at 0.', 'Use `>` so the first pupil wins a tie.']),
          { t: 'h', text: 'Task 5: Car park menu (12 marks)' },
          X('m15-ex-mt-carpark', 'Car park charges', 3, 'exam',
            'A car park charges as follows: the first hour is free; each further hour up to 4 hours in total costs 2.50; more than 4 hours is a flat day rate of 12.00. (a) Write the function <code>fee(hours)</code> that returns the fee for a whole number of hours (4 marks). (b) Write a menu program that repeats <code>1. Calculate fee</code>, <code>2. Show takings</code>, <code>3. Quit</code>. Option 1 inputs the hours, displays <code>Fee: </code> and the fee to 2 decimal places and adds it to the takings (4 marks). Option 2 displays <code>Takings: </code> and the total to 2 decimal places (2 marks). Option 3 displays <code>Goodbye</code> and stops; any other choice displays <code>Invalid choice</code> (2 marks).',
            C`
              def fee(hours):
                  pass

              # menu program
            `,
            C`
              def fee(hours):
                  if hours <= 1:
                      return 0.0
                  elif hours <= 4:
                      return (hours - 1) * 2.50
                  else:
                      return 12.00

              takings = 0
              while True:
                  print("1. Calculate fee")
                  print("2. Show takings")
                  print("3. Quit")
                  choice = input("Choice: ")
                  if choice == "1":
                      hours = int(input("Hours: "))
                      charge = fee(hours)
                      print("Fee:", format(charge, ".2f"))
                      takings = takings + charge
                  elif choice == "2":
                      print("Takings:", format(takings, ".2f"))
                  elif choice == "3":
                      print("Goodbye")
                      break
                  else:
                      print("Invalid choice")
            `,
            [{ in: ['3'], out: PARK + '\nGoodbye', py: 'assert fee(1) == 0 and fee(2) == 2.5 and fee(4) == 7.5 and fee(5) == 12 and fee(10) == 12, "fee function"' }, { in: ['1', '3', '1', '6', '2', '3'], out: PARK + '\nFee: 5.00\n' + PARK + '\nFee: 12.00\n' + PARK + '\nTakings: 17.00\n' + PARK + '\nGoodbye' }, { in: ['2', '3'], out: PARK + '\nTakings: 0.00\n' + PARK + '\nGoodbye' }, { in: ['8', '1', '1', '3'], out: PARK + '\nInvalid choice\n' + PARK + '\nFee: 0.00\n' + PARK + '\nGoodbye', hidden: true }],
            ['Write and test `fee` on its own first: it must `return`, not print.', 'Keep `takings` as a variable outside the loop and add each fee to it.', 'Print the menu at the top of each pass of `while True`.'],
            { requires: [{ re: 'def fee', msg: 'Define the function fee(hours).' }] }),
          { t: 'h', text: 'Task 6: Word search (12 marks)' },
          X('m15-ex-mt-wordsearch', 'Sort then search', 3, 'exam',
            'Words are entered on one line separated by commas. Sort them into ascending alphabetical order using a bubble sort that you write yourself (5 marks) and display <code>Sorted: </code> followed by the words separated by single spaces (1 mark). Then input a word to find and search the sorted list with a binary search (4 marks). Display <code>Found at position P</code> (counting from 1) or <code>Not found</code>, then <code>Checks: </code> and the number of middle items examined (2 marks).',
            C`
              words = input("Words: ").split(",")
              # bubble sort, then binary search
            `,
            C`
              words = input("Words: ").split(",")
              swapped = True
              while swapped:
                  swapped = False
                  for i in range(len(words) - 1):
                      if words[i] > words[i + 1]:
                          words[i], words[i + 1] = words[i + 1], words[i]
                          swapped = True
              print("Sorted: " + " ".join(words))
              target = input("Word to find: ")
              low = 0
              high = len(words) - 1
              position = 0
              checks = 0
              while low <= high and position == 0:
                  mid = (low + high) // 2
                  checks = checks + 1
                  if words[mid] == target:
                      position = mid + 1
                  elif target < words[mid]:
                      high = mid - 1
                  else:
                      low = mid + 1
              if position > 0:
                  print("Found at position", position)
              else:
                  print("Not found")
              print("Checks:", checks)
            `,
            [{ in: ['pear,apple,fig,kiwi,mango', 'kiwi'], out: 'Sorted: apple fig kiwi mango pear\nFound at position 3\nChecks: 1' }, { in: ['pear,apple,fig,kiwi,mango', 'pear'], out: 'Sorted: apple fig kiwi mango pear\nFound at position 5\nChecks: 3' }, { in: ['pear,apple,fig,kiwi,mango', 'banana'], out: 'Sorted: apple fig kiwi mango pear\nNot found\nChecks: 3' }, { in: ['solo', 'solo'], out: 'Sorted: solo\nFound at position 1\nChecks: 1', hidden: true }, { in: ['b,a', 'c'], out: 'Sorted: a b\nNot found\nChecks: 2', hidden: true }],
            ['Bubble sort: repeat passes comparing neighbours until a pass makes no swap.', 'Binary search needs `low`, `high` and `mid = (low + high) // 2`.', 'Add 1 to `checks` every time you look at a middle item.'],
            { requires: [{ re: '\\.sort\\(|\\bsorted\\(', not: true, msg: 'Write the sort yourself: do not use sort() or sorted().' }] }),
          { t: 'note', kind: 'key', title: 'After the test', html: 'Count the tasks that passed all tests first time. Anything below five out of six: pick the earlier lesson that matches the task that failed (validation, files, 2D arrays, subprograms, sorting) and redo two of its exercises.' },
        ],
      },
    ],
  });
})();

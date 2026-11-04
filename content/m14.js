(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm14',
    title: 'Design, flowcharts and evaluation',
    blurb: 'Break problems down, draw and read flowcharts, answer questions about code, complete skeleton programs and judge your own work.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'decomposition-abstraction',
        title: 'Decomposition and abstraction',
        time: '35 min',
        book: 'Ch 1 · computational thinking',
        exam: 'Paper 1 and Paper 2 design',
        summary: 'Breaking problems into parts, hiding detail, and doing both in Python',
        intro: 'Big problems are hard. Good programmers do not attack them in one piece: they split them up (decomposition) and ignore the details that do not matter (abstraction). Both ideas appear in your code every time you write a function.',
        blocks: [
          { t: 'h', text: 'Decomposition: break it into smaller problems' },
          { t: 'p', html: '**Decomposition** means breaking a complex problem down into smaller, simpler sub-problems that can each be solved on their own. When every sub-problem is solved, the pieces are put together to solve the whole thing.' },
          { t: 'table', head: ['Big problem', 'Sub-problems it breaks into'], rows: [
            ['Make a sandwich', 'Get the ingredients, slice the bread, spread the butter, add the filling, close and cut'],
            ['Build a school timetable', 'List the subjects, list the teachers, list the rooms, place each lesson in a free slot, check for clashes'],
            ['Write a quiz game', 'Store the questions, ask one question, check the answer, keep the score, show the final result'],
            ['Run a shop till', 'Scan items, add up the prices, apply any discount, take payment, print a receipt'],
          ] },
          { t: 'note', kind: 'exam', title: 'Exam wording', html: 'A typical definition mark scheme wants two ideas: the problem is **broken down** and the parts are **smaller / simpler / easier to solve**. Write a sentence such as: <em>decomposition is splitting a large problem into smaller sub-problems that are easier to understand, solve and test.</em>' },

          { t: 'h', text: 'Abstraction: keep what matters, hide the rest' },
          { t: 'p', html: '**Abstraction** means removing or hiding the detail that is not needed so you can focus on what is important for the task. You use abstraction all the time without noticing.' },
          { t: 'cases', title: 'Abstraction in the real world and in code', items: [
            { label: 'A map', intro: 'A bus map shows stops and lines. It leaves out buildings, trees and the shape of the roads, because a passenger does not need them. The map is an abstraction of the town.', code: C`
              # A tiny "map": only the stops and the order matter
              route = ["School", "Library", "Market", "Station"]
              for stop in route:
                  print(stop)
            ` },
            { label: 'A function hides detail', intro: 'To use `calculate_total()` you only need to know what goes in and what comes out. The working inside is hidden from the person who calls it.', code: C`
              def calculate_total(prices):
                  total = 0
                  for price in prices:
                      total = total + price
                  return total

              basket = [2.5, 4.0, 1.5]
              print(calculate_total(basket))
            ` },
            { label: 'A built-in', intro: 'You have used abstraction since your first lesson. You never see how `len()` counts characters. You only use it.', code: C`
              word = "decomposition"
              print(len(word))
              print(word.upper())
            ` },
            { label: 'A variable name', intro: 'A variable is an abstraction of a memory location. You say `score`, not "address 4F2A in memory".', code: C`
              score = 8
              bonus = 2
              print(score + bonus)
            ` },
          ] },
          { t: 'note', kind: 'exam', title: 'Exam wording', html: 'Abstraction: <em>removing unnecessary detail so that only the important features of a problem are represented</em>. A good example sentence to add: a map shows roads and stops but not the buildings.' },

          { t: 'sort', title: 'Decomposition or abstraction?', prompt: 'Which idea is each statement describing?', cats: ['Decomposition', 'Abstraction'], items: [
            { text: 'Splitting a game into: draw the board, take a turn, check for a winner', cat: 0 },
            { text: 'A London Underground map that shows only the lines and stations', cat: 1 },
            { text: 'Writing one function for each menu option', cat: 0 },
            { text: 'Calling <code>round(x, 2)</code> without knowing how it works inside', cat: 1 },
            { text: 'Listing the tasks needed to organise a school trip', cat: 0 },
            { text: 'Ignoring the colour of a car when you only need its speed', cat: 1 },
          ], why: 'Decomposition is about splitting into parts. Abstraction is about hiding or ignoring detail that is not needed.' },

          { t: 'h', text: 'Doing it in Python: one long program, then split' },
          { t: 'p', html: 'Here is a program that works but does everything in one block. It asks for three scores, then shows the total, the average and a result. Run each tab, then read how the second version is the same program decomposed into subprograms.' },
          { t: 'cases', title: 'From one block to subprograms', items: [
            { label: 'One long block', stdin: ['40', '50', '60'], code: C`
              a = int(input("Score 1: "))
              b = int(input("Score 2: "))
              c = int(input("Score 3: "))
              total = a + b + c
              average = total / 3
              print("Total:", total)
              print("Average:", round(average, 1))
              if average >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
            { label: 'Split into functions', intro: 'Each sub-problem has its own function with a clear job and a clear name.', stdin: ['40', '50', '60'], code: C`
              def get_scores():
                  a = int(input("Score 1: "))
                  b = int(input("Score 2: "))
                  c = int(input("Score 3: "))
                  return a, b, c

              def get_average(a, b, c):
                  return (a + b + c) / 3

              def show_result(average):
                  if average >= 50:
                      print("Pass")
                  else:
                      print("Fail")

              s1, s2, s3 = get_scores()
              average = get_average(s1, s2, s3)
              print("Average:", round(average, 1))
              show_result(average)
            ` },
            { label: 'With a main program', intro: 'A short main program at the bottom only **calls** the subprograms. Reading it tells you the plan in four lines. The detail is abstracted away inside the functions.', stdin: ['10', '20', '30'], code: C`
              def get_scores():
                  a = int(input("Score 1: "))
                  b = int(input("Score 2: "))
                  c = int(input("Score 3: "))
                  return a, b, c

              def get_average(a, b, c):
                  return (a + b + c) / 3

              def show_result(average):
                  if average >= 50:
                      print("Pass")
                  else:
                      print("Fail")

              def main():
                  s1, s2, s3 = get_scores()
                  average = get_average(s1, s2, s3)
                  print("Average:", round(average, 1))
                  show_result(average)

              main()
            ` },
          ] },
          { t: 'note', kind: 'key', html: 'Decomposition gives you the **subprograms**. Abstraction is what lets the main program use them without caring how they work inside. A function is both ideas in one place.' },

          { t: 'h', text: 'Why both ideas help' },
          { t: 'table', head: ['Benefit', 'Because'], rows: [
            ['Teams can share the work', 'Each programmer writes and tests a different subprogram at the same time'],
            ['Easier testing', 'You can test `get_average()` alone with known numbers before it is joined to the rest'],
            ['Reuse', 'A function written once can be called again in the same program or a later one'],
            ['Easier to read and maintain', 'A short main program shows the plan, and a fault is traced to one small function'],
            ['Easier to understand', 'You only hold one small idea in your head at a time'],
          ] },

          { t: 'predict', title: 'Calls and results', code: C`
            def double(n):
                return n * 2

            def add_one(n):
                return n + 1

            print(add_one(double(5)))
            print(double(add_one(5)))
          `, rows: 2, why: 'Inner call first. `double(5)` is 10, then `add_one(10)` is 11. In the second line `add_one(5)` is 6, then `double(6)` is 12.' },
          { t: 'quiz', q: 'A student writes a function <code>area(w, h)</code> and a teammate uses it without reading its code. Which idea does the teammate rely on?', options: ['Iteration', 'Abstraction', 'Validation', 'Concatenation'], answer: 1, why: 'The teammate uses the function without needing its inner detail. That is abstraction.' },
          { t: 'quiz', q: 'Which statements about decomposition are true? Tick all that apply.', options: ['It breaks a problem into smaller parts', 'It makes it easier for several people to work on one program', 'It means deleting all comments', 'It lets each part be tested separately'], answer: [0, 1, 3], why: 'Comments are not removed. The other three are the real benefits of decomposition.' },

          { t: 'exercise', id: 'm14-ex-addvat', title: 'Two small functions', level: 1,
            prompt: 'A shop program is split into two sub-problems. Write <code>add_vat(price)</code>, which returns the price with 20% added, rounded to 2 decimal places. Then write <code>total_with_vat(prices)</code>, which takes a list of prices and returns the sum of the prices <em>after</em> VAT. It must call <code>add_vat</code>.',
            starter: C`
              def add_vat(price):
                  pass

              def total_with_vat(prices):
                  pass
            `,
            solution: C`
              def add_vat(price):
                  return round(price * 1.2, 2)

              def total_with_vat(prices):
                  total = 0
                  for price in prices:
                      total = total + add_vat(price)
                  return total
            `,
            tests: [
              { py: 'assert abs(add_vat(10) - 12) < 0.001', label: 'add_vat(10) is 12' },
              { py: 'assert abs(add_vat(0)) < 0.001 and abs(add_vat(50) - 60) < 0.001', label: 'add_vat(0) and add_vat(50)' },
              { py: 'assert abs(total_with_vat([10, 20]) - 36) < 0.001', label: 'total of [10, 20] is 36' },
              { py: 'assert total_with_vat([]) == 0', hidden: true },
            ],
            hints: ['`return round(price * 1.2, 2)` handles one price.', 'In `total_with_vat` loop over the list and add `add_vat(price)` to a running total.'] },
          { t: 'exercise', id: 'm14-ex-split-scores', title: 'Split the long program', level: 2,
            prompt: 'This program works, but it is one long block. Rewrite it so that it uses three subprograms: <code>get_total(a, b, c)</code> (returns the total), <code>get_average(total)</code> (returns the total divided by 3) and <code>show_result(average)</code> (prints <code>Pass</code> if the average is 50 or more, otherwise <code>Fail</code>). Keep the same output.',
            starter: C`
              a = int(input("Score 1: "))
              b = int(input("Score 2: "))
              c = int(input("Score 3: "))
              total = a + b + c
              average = total / 3
              print("Total:", total)
              print("Average:", round(average, 1))
              if average >= 50:
                  print("Pass")
              else:
                  print("Fail")
            `,
            solution: C`
              def get_total(a, b, c):
                  return a + b + c

              def get_average(total):
                  return total / 3

              def show_result(average):
                  if average >= 50:
                      print("Pass")
                  else:
                      print("Fail")

              a = int(input("Score 1: "))
              b = int(input("Score 2: "))
              c = int(input("Score 3: "))
              total = get_total(a, b, c)
              average = get_average(total)
              print("Total:", total)
              print("Average:", round(average, 1))
              show_result(average)
            `,
            tests: [
              { in: ['40', '50', '60'], out: 'Total: 150\nAverage: 50.0\nPass' },
              { in: ['10', '20', '30'], out: 'Total: 60\nAverage: 20.0\nFail' },
              { in: ['100', '0', '50'], out: 'Total: 150\nAverage: 50.0\nPass', hidden: true },
            ],
            requires: [
              { re: 'def\\s+get_total\\s*\\(', msg: 'Define `get_total`.' },
              { re: 'def\\s+get_average\\s*\\(', msg: 'Define `get_average`.' },
              { re: 'def\\s+show_result\\s*\\(', msg: 'Define `show_result`.' },
            ],
            hints: ['Move the sum into `get_total` and `return` it.', '`show_result` prints, so it does not need a `return`.', 'The main program (outside any function) asks for the three numbers and calls the three subprograms.'] },
          { t: 'exercise', id: 'm14-ex-temps', title: 'Decompose a weather report', level: 3,
            prompt: 'Write a program with two functions and a main program. <code>to_fahrenheit(c)</code> returns <code>c * 9 / 5 + 32</code>. <code>describe(c)</code> returns <code>"cold"</code> if c is below 10, <code>"mild"</code> if below 20, otherwise <code>"warm"</code>. The main program reads three temperatures in Celsius (whole numbers) and, for each one, prints the temperature, the description and the Fahrenheit value on one line, for example <code>5 cold 41.0</code>.',
            starter: C`
              # define to_fahrenheit and describe, then the main program below
            `,
            solution: C`
              def to_fahrenheit(c):
                  return c * 9 / 5 + 32

              def describe(c):
                  if c < 10:
                      return "cold"
                  elif c < 20:
                      return "mild"
                  else:
                      return "warm"

              for i in range(3):
                  c = int(input("Temperature: "))
                  print(c, describe(c), to_fahrenheit(c))
            `,
            tests: [
              { in: ['5', '15', '25'], out: '5 cold 41.0\n15 mild 59.0\n25 warm 77.0' },
              { in: ['-10', '10', '20'], out: '-10 cold 14.0\n10 mild 50.0\n20 warm 68.0' },
              { in: ['9', '19', '0'], out: '9 cold 48.2\n19 mild 66.2\n0 cold 32.0', hidden: true },
            ],
            requires: [
              { re: 'def\\s+to_fahrenheit\\s*\\(', msg: 'Define `to_fahrenheit`.' },
              { re: 'def\\s+describe\\s*\\(', msg: 'Define `describe`.' },
            ],
            hints: ['Both functions use `return`, so the main program can print their results.', 'A `for` loop that runs three times keeps the main program short.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'flowcharts',
        title: 'Flowcharts',
        time: '40 min',
        book: 'Ch 1 · Ch 2 · algorithms',
        exam: 'Paper 1 and Paper 2',
        summary: 'Standard symbols, drawing each control structure, common mistakes',
        intro: 'A flowchart is a picture of an algorithm. Each box says what to do and the arrows say what happens next. Exams ask you to read them, trace them and turn them into code.',
        blocks: [
          { t: 'h', text: 'The standard symbols' },
          { t: 'table', head: ['Symbol', 'Shape', 'Use it for'], rows: [
            ['**Terminator**', 'Rounded box (oval)', 'The **Start** and the **End** of the algorithm. Only one start; every path must reach an end.'],
            ['**Process**', 'Rectangle', 'An instruction that does something: an assignment or a calculation, for example `total = total + 1`.'],
            ['**Input / output**', 'Parallelogram', 'Data going in (from the keyboard) or out (to the screen).'],
            ['**Decision**', 'Diamond', 'A question with two exits labelled **Yes** and **No** (or True and False). Used for `if` and loop conditions.'],
            ['**Subprogram**', 'Rectangle with double side lines', 'A call to a procedure or function that is defined elsewhere.'],
            ['**Flow arrow**', 'Line with an arrowhead', 'Shows the direction and order of the steps.'],
          ] },
          { t: 'sort', title: 'Match the description to the symbol', prompt: 'Which flowchart symbol belongs with each description?', cats: ['Terminator', 'Process', 'Input/output', 'Decision', 'Subprogram', 'Flow arrow'], items: [
            { text: 'Marks where the algorithm begins', cat: 0 },
            { text: 'Contains <code>score = score + 1</code>', cat: 1 },
            { text: 'Contains <code>INPUT age</code>', cat: 2 },
            { text: 'Asks <code>mark &gt;= 50?</code> with a Yes exit and a No exit', cat: 3 },
            { text: 'Calls <code>check_pin(pin)</code> defined elsewhere', cat: 4 },
            { text: 'Shows which step comes next', cat: 5 },
            { text: 'Contains <code>OUTPUT "Well done"</code>', cat: 2 },
            { text: 'Marks where the algorithm finishes', cat: 0 },
          ], why: 'Rounded = start/end, rectangle = process, parallelogram = input/output, diamond = decision, double-sided rectangle = subprogram, arrow = flow.' },
          { t: 'note', kind: 'exam', html: 'Exam questions often say <em>"complete the flowchart"</em> or <em>"give the name of the symbol used for ..."</em>. Learn the six names above exactly. The decision diamond **must** have two labelled exits.' },

          { t: 'h', text: 'Sequence' },
          { t: 'p', html: 'A sequence is a list of steps that run one after another. The flow goes straight down.' },
          { t: 'flowchart', title: 'Sequence: area of a rectangle', flow: [
            { start: 'Start' },
            { io: 'INPUT width' },
            { io: 'INPUT height' },
            { p: 'area = width * height' },
            { io: 'OUTPUT area' },
            { end: 'End' },
          ] },
          { t: 'cases', title: 'The sequence in Python', items: [
            { label: 'Python', stdin: ['4', '5'], code: C`
              width = int(input("Width: "))
              height = int(input("Height: "))
              area = width * height
              print(area)
            ` },
            { label: 'Other data', intro: 'The same flow works for any numbers, including zero.', stdin: ['0', '9'], code: C`
              width = int(input("Width: "))
              height = int(input("Height: "))
              area = width * height
              print(area)
            ` },
          ] },

          { t: 'h', text: 'Selection: if / else' },
          { t: 'p', html: 'A decision diamond asks a question. One arrow leaves for Yes and one for No. The two paths join again afterwards.' },
          { t: 'flowchart', title: 'Selection: pass or fail', flow: [
            { start: 'Start' },
            { io: 'INPUT mark' },
            { if: 'mark >= 50?', then: [{ io: 'OUTPUT "Pass"' }], else: [{ io: 'OUTPUT "Fail"' }] },
            { end: 'End' },
          ] },
          { t: 'cases', title: 'if / else in Python', items: [
            { label: 'Yes path', stdin: ['72'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
            { label: 'No path', stdin: ['31'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
            { label: 'Boundary', intro: 'Exactly 50 takes the Yes path, because the question is "greater than or equal to".', stdin: ['50'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
            { label: 'If without else', intro: 'When there is no `else`, the No arrow goes straight to the next step.', stdin: ['80'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  print("Pass")
              print("Finished")
            ` },
          ] },

          { t: 'h', text: 'Nested selection' },
          { t: 'p', html: 'A decision inside another decision is **nested**. The second question is only asked if the first answer led there.' },
          { t: 'flowchart', title: 'Nested selection: three results', flow: [
            { start: 'Start' },
            { io: 'INPUT mark' },
            { if: 'mark >= 50?',
              then: [{ if: 'mark >= 80?', then: [{ io: 'OUTPUT "Distinction"' }], else: [{ io: 'OUTPUT "Pass"' }] }],
              else: [{ io: 'OUTPUT "Fail"' }] },
            { end: 'End' },
          ] },
          { t: 'cases', title: 'Nested if in Python', items: [
            { label: 'Distinction', stdin: ['90'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  if mark >= 80:
                      print("Distinction")
                  else:
                      print("Pass")
              else:
                  print("Fail")
            ` },
            { label: 'Pass', stdin: ['65'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  if mark >= 80:
                      print("Distinction")
                  else:
                      print("Pass")
              else:
                  print("Fail")
            ` },
            { label: 'Fail', stdin: ['12'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  if mark >= 80:
                      print("Distinction")
                  else:
                      print("Pass")
              else:
                  print("Fail")
            ` },
            { label: 'Same with elif', intro: 'An `elif` chain draws as the same flowchart but is often neater to write.', stdin: ['65'], code: C`
              mark = int(input("Mark: "))
              if mark >= 80:
                  print("Distinction")
              elif mark >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
          ] },

          { t: 'h', text: 'Iteration: the while loop' },
          { t: 'p', html: 'In a **while** loop the decision comes **first**. If the answer is Yes, the body runs and the arrow goes back up to the question. If No, the loop is finished. The loop may run zero times.' },
          { t: 'flowchart', title: 'While loop: count to 5', flow: [
            { start: 'Start' },
            { p: 'count = 1' },
            { while: 'count <= 5?', body: [{ io: 'OUTPUT count' }, { p: 'count = count + 1' }] },
            { end: 'End' },
          ] },
          { t: 'cases', title: 'while in Python', items: [
            { label: 'Count to 5', code: C`
              count = 1
              while count <= 5:
                  print(count)
                  count = count + 1
            ` },
            { label: 'Runs zero times', intro: 'If the question is No the first time, the body never runs.', code: C`
              count = 9
              while count <= 5:
                  print(count)
                  count = count + 1
              print("Loop skipped")
            ` },
          ] },

          { t: 'h', text: 'Iteration: repeat-until' },
          { t: 'p', html: 'In a **repeat-until** loop the body runs **first**, then the decision is asked. The loop stops when the answer is Yes. It always runs at least once. Python has no `repeat`, so we write `while True` and `break`.' },
          { t: 'flowchart', title: 'Repeat-until: guess the number', flow: [
            { start: 'Start' },
            { until: 'guess == 7?', body: [{ io: 'INPUT guess' }] },
            { io: 'OUTPUT "Correct"' },
            { end: 'End' },
          ] },
          { t: 'cases', title: 'repeat-until in Python', items: [
            { label: 'while True and break', stdin: ['3', '9', '7'], code: C`
              while True:
                  guess = int(input("Guess: "))
                  if guess == 7:
                      break
              print("Correct")
            ` },
            { label: 'First guess right', intro: 'The body still ran once. A repeat-until loop cannot run zero times.', stdin: ['7'], code: C`
              while True:
                  guess = int(input("Guess: "))
                  if guess == 7:
                      break
              print("Correct")
            ` },
          ] },
          { t: 'note', kind: 'exam', html: 'In Edexcel pseudocode this loop is <code>REPEAT ... UNTIL guess = 7</code>. Note the condition is the one that **ends** the loop, whereas Python\'s `while` condition is the one that **keeps** it going.' },

          { t: 'h', text: 'A counting loop with an accumulator' },
          { t: 'p', html: 'An **accumulator** is a variable that builds up a running total. Set it to 0 before the loop, then add to it each time round.' },
          { t: 'flowchart', title: 'Total of n numbers', flow: [
            { start: 'Start' },
            { io: 'INPUT n' },
            { p: 'total = 0' },
            { p: 'count = 1' },
            { while: 'count <= n?', body: [{ io: 'INPUT number' }, { p: 'total = total + number' }, { p: 'count = count + 1' }] },
            { io: 'OUTPUT total' },
            { end: 'End' },
          ] },
          { t: 'cases', title: 'Accumulator in Python', items: [
            { label: 'while version', stdin: ['3', '4', '5', '6'], code: C`
              n = int(input("How many numbers? "))
              total = 0
              count = 1
              while count <= n:
                  number = int(input("Number: "))
                  total = total + number
                  count = count + 1
              print(total)
            ` },
            { label: 'for version', intro: 'A `for` loop does the counting for you. The flowchart is the same shape.', stdin: ['3', '4', '5', '6'], code: C`
              n = int(input("How many numbers? "))
              total = 0
              for count in range(n):
                  number = int(input("Number: "))
                  total = total + number
              print(total)
            ` },
            { label: 'n is zero', intro: 'The loop never runs, so the total stays 0.', stdin: ['0'], code: C`
              n = int(input("How many numbers? "))
              total = 0
              for count in range(n):
                  number = int(input("Number: "))
                  total = total + number
              print(total)
            ` },
          ] },

          { t: 'h', text: 'A menu loop' },
          { t: 'flowchart', title: 'Menu: repeat until the user quits', flow: [
            { start: 'Start' },
            { p: 'choice = ""' },
            { while: 'choice != "3"?', body: [
              { io: 'OUTPUT menu' },
              { io: 'INPUT choice' },
              { if: 'choice == "1"?', then: [{ io: 'OUTPUT "Hello"' }],
                else: [{ if: 'choice == "2"?', then: [{ io: 'OUTPUT "Goodbye"' }] }] },
            ] },
            { end: 'End' },
          ] },
          { t: 'cases', title: 'The menu in Python', items: [
            { label: 'Menu', stdin: ['1', '2', '3'], code: C`
              choice = ""
              while choice != "3":
                  print("1. Hello  2. Goodbye  3. Quit")
                  choice = input("Choice: ")
                  if choice == "1":
                      print("Hello")
                  elif choice == "2":
                      print("Goodbye")
            ` },
            { label: 'Quit at once', stdin: ['3'], code: C`
              choice = ""
              while choice != "3":
                  print("1. Hello  2. Goodbye  3. Quit")
                  choice = input("Choice: ")
                  if choice == "1":
                      print("Hello")
                  elif choice == "2":
                      print("Goodbye")
            ` },
          ] },

          { t: 'h', text: 'Common flowchart mistakes' },
          { t: 'note', kind: 'warn', html: '1. A **decision with no Yes / No labels**: the reader cannot tell which path is which.<br>2. A decision with **only one** exit. Every diamond needs two.<br>3. **Arrows missing** or pointing nowhere, so the flow stops in the middle.<br>4. A **process box used for input**. Use a parallelogram for input and output.<br>5. More than one **Start**, or a path that never reaches **End**.<br>6. Writing code such as `print(x)` in a box. Use the course style `OUTPUT x`.<br>7. A loop that never returns to the question, so the question is only asked once.' },
          { t: 'quiz', q: 'A decision diamond contains <code>age &gt;= 16?</code> and has one arrow leaving it labelled <em>Yes</em>. What is wrong?', options: ['It should be a rectangle', 'There is no No arrow, so the other case is not shown', 'The question should not contain a number', 'There is nothing wrong'], answer: 1, why: 'Every decision must have two labelled exits.' },
          { t: 'quiz', q: 'Which flowchart loop is guaranteed to run its body at least once?', options: ['A while loop (question first)', 'A repeat-until loop (body first)', 'Both, always', 'Neither'], answer: 1, why: 'Repeat-until tests after the body. A while loop can skip the body entirely.' },

          { t: 'h', text: 'Tracing a flowchart by hand' },
          { t: 'p', html: 'To trace a flowchart, follow the arrows one box at a time, and write the new value of every variable in a trace table. The Python below is the same as the counting flowchart earlier. Fill in the table, one row per change.' },
          { t: 'tracetable', id: 'm14-tt-count', code: C`
            total = 0
            count = 1
            while count <= 4:
                total = total + count
                count = count + 1
            print(total)
          `, cols: ['total', 'count'], output: true, prompt: 'Trace the program. Enter a value only in the row where a variable changes.' },
          { t: 'tracetable', id: 'm14-tt-selection', code: C`
            mark = int(input())
            if mark >= 50:
                result = "Pass"
            else:
                result = "Fail"
            print(result)
          `, stdin: ['62'], cols: ['mark', 'result'], output: true, prompt: 'Trace the selection flowchart as Python, with 62 typed in.' },

          { t: 'predict', title: 'Follow the arrows', code: C`
            n = 3
            while n > 0:
                print(n)
                n = n - 1
            print("Go")
          `, rows: 4, why: 'The question `n > 0?` is asked first each time. When n reaches 0 the answer is No, so the loop ends and "Go" prints.' },

          { t: 'h', text: 'Now you try: from a flowchart to code' },
          { t: 'flowchart', title: 'Flowchart for the next exercise', flow: [
            { start: 'Start' },
            { io: 'INPUT number' },
            { if: 'number MOD 2 == 0?', then: [{ io: 'OUTPUT "Even"' }], else: [{ io: 'OUTPUT "Odd"' }] },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-fc-evenodd', title: 'Even or odd', level: 1,
            prompt: 'Write the Python for the flowchart above. `MOD` is the remainder, which is `%` in Python.',
            starter: C`
              number = int(input("Number: "))
              # complete the decision
            `,
            solution: C`
              number = int(input("Number: "))
              if number % 2 == 0:
                  print("Even")
              else:
                  print("Odd")
            `,
            tests: [{ in: ['4'], out: 'Even' }, { in: ['7'], out: 'Odd' }, { in: ['0'], out: 'Even' }, { in: ['-3'], out: 'Odd', hidden: true }],
            hints: ['The decision diamond becomes an `if` with a colon.', '`number % 2 == 0` is the question.'] },
          { t: 'flowchart', title: 'Flowchart for the next exercise', flow: [
            { start: 'Start' },
            { io: 'INPUT n' },
            { p: 'total = 0' },
            { p: 'count = 1' },
            { while: 'count <= n?', body: [{ p: 'total = total + count' }, { p: 'count = count + 1' }] },
            { io: 'OUTPUT total' },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-fc-sumton', title: 'Add up to n', level: 2,
            prompt: 'Write the Python for the flowchart above. It adds every whole number from 1 up to n.',
            starter: C`
              n = int(input("n: "))
              # write the rest from the flowchart
            `,
            solution: C`
              n = int(input("n: "))
              total = 0
              count = 1
              while count <= n:
                  total = total + count
                  count = count + 1
              print(total)
            `,
            tests: [{ in: ['4'], out: '10' }, { in: ['1'], out: '1' }, { in: ['0'], out: '0' }, { in: ['10'], out: '55', hidden: true }],
            requires: [{ re: '\\bwhile\\b', msg: 'Follow the flowchart and use a `while` loop.' }],
            hints: ['Set `total` and `count` before the loop.', 'The loop question `count <= n` is the `while` condition.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'flowchart-to-code',
        title: 'From flowchart to code and back',
        time: '40 min',
        book: 'Ch 2 · flowcharts',
        exam: 'Paper 2 translate and amend',
        summary: 'Translate flowcharts into Python; match code to the right flowchart',
        intro: 'Exams give you a flowchart and ask for a working program, or give you code and ask what it does. This lesson practises both directions.',
        blocks: [
          { t: 'h', text: 'A translation recipe' },
          { t: 'table', head: ['Flowchart shape', 'Python'], rows: [
            ['Start / End', 'Top and bottom of the program (nothing to write)'],
            ['Parallelogram `INPUT x`', '`x = input("...")` (use `int()` or `float()` if x is a number)'],
            ['Parallelogram `OUTPUT x`', '`print(x)`'],
            ['Rectangle `x = x + 1`', '`x = x + 1`'],
            ['Diamond with Yes / No', '`if question:` ... `else:`'],
            ['Diamond with an arrow back up', '`while question:`'],
            ['Double-sided rectangle', 'A call to a function or procedure'],
          ] },
          { t: 'cases', title: 'Same shape, different code', items: [
            { label: 'Decision to if', stdin: ['16'], code: C`
              age = int(input("Age: "))
              if age >= 16:
                  print("Can enrol")
              else:
                  print("Too young")
            ` },
            { label: 'Loop to while', stdin: ['2'], code: C`
              n = int(input("n: "))
              count = 1
              while count <= 3:
                  print(n * count)
                  count = count + 1
            ` },
            { label: 'Subprogram box', intro: 'A box such as `check_pin(pin)` is a call. Its flowchart is drawn separately.', stdin: ['1234'], code: C`
              def check_pin(pin):
                  return pin == "1234"

              entered = input("PIN: ")
              if check_pin(entered):
                  print("OK")
              else:
                  print("Wrong")
            ` },
          ] },
          { t: 'note', kind: 'tip', html: 'Walk the flowchart box by box and write one line of Python for each. Indent everything inside a Yes branch or a loop body by four spaces. Test with an easy value after each step.' },

          { t: 'h', text: 'Exercise 1: pass or fail' },
          { t: 'flowchart', title: 'Pass or fail', flow: [
            { start: 'Start' },
            { io: 'INPUT mark' },
            { if: 'mark >= 40?', then: [{ io: 'OUTPUT "Pass"' }], else: [{ io: 'OUTPUT "Fail"' }] },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-f2c-passfail', title: 'Pass or fail', level: 1,
            prompt: 'Turn the flowchart above into Python. The mark is a whole number.',
            starter: C`
              # translate the flowchart
            `,
            solution: C`
              mark = int(input("Mark: "))
              if mark >= 40:
                  print("Pass")
              else:
                  print("Fail")
            `,
            tests: [{ in: ['40'], out: 'Pass' }, { in: ['39'], out: 'Fail' }, { in: ['100'], out: 'Pass' }, { in: ['0'], out: 'Fail', hidden: true }],
            hints: ['One input, one decision, two outputs.'] },

          { t: 'h', text: 'Exercise 2: the larger of two' },
          { t: 'flowchart', title: 'Largest of two', flow: [
            { start: 'Start' },
            { io: 'INPUT a' },
            { io: 'INPUT b' },
            { if: 'a > b?', then: [{ io: 'OUTPUT a' }], else: [{ io: 'OUTPUT b' }] },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-f2c-larger', title: 'Larger of two', level: 1,
            prompt: 'Turn the flowchart into Python. Both inputs are whole numbers.',
            starter: C`
              # translate the flowchart
            `,
            solution: C`
              a = int(input("First: "))
              b = int(input("Second: "))
              if a > b:
                  print(a)
              else:
                  print(b)
            `,
            tests: [{ in: ['3', '8'], out: '8' }, { in: ['9', '2'], out: '9' }, { in: ['5', '5'], out: '5' }, { in: ['-1', '-7'], out: '-1', hidden: true }],
            hints: ['Convert each input with `int()` so the comparison is on numbers, not text.'] },

          { t: 'h', text: 'Exercise 3: sum until zero' },
          { t: 'flowchart', title: 'Sum until 0 is entered', flow: [
            { start: 'Start' },
            { p: 'total = 0' },
            { io: 'INPUT n' },
            { while: 'n != 0?', body: [{ p: 'total = total + n' }, { io: 'INPUT n' }] },
            { io: 'OUTPUT total' },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-f2c-sumzero', title: 'Sum until zero', level: 2,
            prompt: 'Turn the flowchart into Python. The 0 that ends the loop is not added.',
            starter: C`
              total = 0
              # translate the rest of the flowchart
            `,
            solution: C`
              total = 0
              n = int(input("Number (0 to stop): "))
              while n != 0:
                  total = total + n
                  n = int(input("Number (0 to stop): "))
              print(total)
            `,
            tests: [{ in: ['5', '10', '0'], out: '15' }, { in: ['0'], out: '0' }, { in: ['-3', '3', '4', '0'], out: '4' }, { in: ['7', '0'], out: '7', hidden: true }],
            hints: ['Read the first number **before** the loop.', 'Read the next number as the last line **inside** the loop.'] },

          { t: 'h', text: 'Exercise 4: times table' },
          { t: 'flowchart', title: 'Times table', flow: [
            { start: 'Start' },
            { io: 'INPUT n' },
            { p: 'i = 1' },
            { while: 'i <= 5?', body: [{ io: 'OUTPUT n, "x", i, "=", n * i' }, { p: 'i = i + 1' }] },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-f2c-times', title: 'First five of a times table', level: 2,
            prompt: 'Turn the flowchart into Python. For input 3 the first line is <code>3 x 1 = 3</code>.',
            starter: C`
              n = int(input("Number: "))
              # translate the loop
            `,
            solution: C`
              n = int(input("Number: "))
              i = 1
              while i <= 5:
                  print(n, "x", i, "=", n * i)
                  i = i + 1
            `,
            tests: [
              { in: ['3'], out: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15' },
              { in: ['7'], out: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35' },
              { in: ['0'], out: '0 x 1 = 0\n0 x 2 = 0\n0 x 3 = 0\n0 x 4 = 0\n0 x 5 = 0', hidden: true },
            ],
            hints: ['Print five items separated by commas so Python adds the spaces.', 'Do not forget `i = i + 1` inside the loop.'] },

          { t: 'h', text: 'Exercise 5: password with three tries' },
          { t: 'flowchart', title: 'Three password attempts', flow: [
            { start: 'Start' },
            { p: 'tries = 0' },
            { p: 'ok = False' },
            { while: 'tries < 3 AND ok == False?', body: [
              { io: 'INPUT guess' },
              { p: 'tries = tries + 1' },
              { if: 'guess == "cat7"?', then: [{ p: 'ok = True' }] },
            ] },
            { if: 'ok == True?', then: [{ io: 'OUTPUT "Welcome"' }], else: [{ io: 'OUTPUT "Locked"' }] },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-f2c-password', title: 'Password retries', level: 2,
            prompt: 'Turn the flowchart into Python. The password is <code>cat7</code>.',
            starter: C`
              tries = 0
              ok = False
              # translate the loop and the final decision
            `,
            solution: C`
              tries = 0
              ok = False
              while tries < 3 and ok == False:
                  guess = input("Password: ")
                  tries = tries + 1
                  if guess == "cat7":
                      ok = True
              if ok == True:
                  print("Welcome")
              else:
                  print("Locked")
            `,
            tests: [
              { in: ['cat7'], out: 'Welcome' },
              { in: ['x', 'cat7'], out: 'Welcome' },
              { in: ['a', 'b', 'c'], out: 'Locked' },
              { in: ['a', 'b', 'cat7'], out: 'Welcome', hidden: true },
              { in: ['a', 'b', 'c', 'cat7'], out: 'Locked', hidden: true },
            ],
            hints: ['`AND` becomes `and` in Python.', 'The decision after the loop is outside the loop, so it is not indented.'] },

          { t: 'h', text: 'Exercise 6: grade calculator' },
          { t: 'flowchart', title: 'Grade calculator', flow: [
            { start: 'Start' },
            { io: 'INPUT mark' },
            { if: 'mark >= 70?', then: [{ io: 'OUTPUT "A"' }],
              else: [{ if: 'mark >= 50?', then: [{ io: 'OUTPUT "B"' }], else: [{ io: 'OUTPUT "C"' }] }] },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-f2c-grade', title: 'Grade calculator', level: 2,
            prompt: 'Turn the flowchart into Python. You may use `elif` instead of a nested `if` inside `else`.',
            starter: C`
              mark = int(input("Mark: "))
              # translate the decisions
            `,
            solution: C`
              mark = int(input("Mark: "))
              if mark >= 70:
                  print("A")
              elif mark >= 50:
                  print("B")
              else:
                  print("C")
            `,
            tests: [{ in: ['85'], out: 'A' }, { in: ['70'], out: 'A' }, { in: ['69'], out: 'B' }, { in: ['50'], out: 'B' }, { in: ['49'], out: 'C' }, { in: ['0'], out: 'C', hidden: true }],
            hints: ['Check the highest boundary first.', 'The No arrow of the first diamond leads to the second diamond.'] },

          { t: 'h', text: 'Exercise 7: average of n numbers' },
          { t: 'flowchart', title: 'Average of n numbers', flow: [
            { start: 'Start' },
            { io: 'INPUT n' },
            { p: 'total = 0' },
            { p: 'i = 0' },
            { while: 'i < n?', body: [{ io: 'INPUT x' }, { p: 'total = total + x' }, { p: 'i = i + 1' }] },
            { io: 'OUTPUT total / n' },
            { end: 'End' },
          ] },
          { t: 'exercise', id: 'm14-ex-f2c-average', title: 'Average of n numbers', level: 3,
            prompt: 'Turn the flowchart into Python. All inputs are whole numbers and n is at least 1.',
            starter: C`
              n = int(input("How many? "))
              # translate the rest
            `,
            solution: C`
              n = int(input("How many? "))
              total = 0
              i = 0
              while i < n:
                  x = int(input("Number: "))
                  total = total + x
                  i = i + 1
              print(total / n)
            `,
            tests: [{ in: ['3', '4', '5', '6'], out: '5.0' }, { in: ['2', '1', '2'], out: '1.5' }, { in: ['1', '7'], out: '7.0' }, { in: ['4', '0', '0', '0', '8'], out: '2.0', hidden: true }],
            hints: ['`i` starts at 0 here, so the loop runs for i = 0, 1 ... n - 1.', 'Divide **after** the loop has finished.'] },

          { t: 'h', text: 'Which flowchart matches this code?' },
          { t: 'p', html: 'Here is some code. Study the three flowcharts that follow, then answer.' },
          { t: 'code', title: 'The code', code: C`
            total = 0
            n = int(input("Number: "))
            while n > 0:
                total = total + n
                n = int(input("Number: "))
            print(total)
          `, stdin: ['3', '4', '0'], caption: 'The total is added up until a number that is not positive is typed.' },
          { t: 'flowchart', title: 'Option A', flow: [
            { start: 'Start' }, { p: 'total = 0' }, { io: 'INPUT n' },
            { while: 'n > 0?', body: [{ p: 'total = total + n' }, { io: 'INPUT n' }] },
            { io: 'OUTPUT total' }, { end: 'End' },
          ] },
          { t: 'flowchart', title: 'Option B', flow: [
            { start: 'Start' }, { p: 'total = 0' },
            { until: 'n <= 0?', body: [{ io: 'INPUT n' }, { p: 'total = total + n' }] },
            { io: 'OUTPUT total' }, { end: 'End' },
          ] },
          { t: 'flowchart', title: 'Option C', flow: [
            { start: 'Start' }, { p: 'total = 0' }, { io: 'INPUT n' },
            { if: 'n > 0?', then: [{ p: 'total = total + n' }] },
            { io: 'OUTPUT total' }, { end: 'End' },
          ] },
          { t: 'quiz', q: 'Which option matches the code above?', options: ['Option A', 'Option B', 'Option C'], answer: 0, why: 'Option A reads the first number before the loop, tests it, adds it, and reads the next number inside the loop. B adds the final non-positive number and uses a repeat-until, C has no loop at all.' },

          { t: 'p', html: 'Now the other way. Read this code, then pick the flowchart.' },
          { t: 'code', title: 'Second piece of code', code: C`
            mark = int(input("Mark: "))
            if mark >= 50:
                print("Pass")
            print("Done")
          `, stdin: ['30'] },
          { t: 'flowchart', title: 'Option P', flow: [
            { start: 'Start' }, { io: 'INPUT mark' },
            { if: 'mark >= 50?', then: [{ io: 'OUTPUT "Pass"' }], else: [{ io: 'OUTPUT "Done"' }] },
            { end: 'End' },
          ] },
          { t: 'flowchart', title: 'Option Q', flow: [
            { start: 'Start' }, { io: 'INPUT mark' },
            { if: 'mark >= 50?', then: [{ io: 'OUTPUT "Pass"' }] },
            { io: 'OUTPUT "Done"' }, { end: 'End' },
          ] },
          { t: 'quiz', q: 'Which option matches the second piece of code?', options: ['Option P', 'Option Q'], answer: 1, why: '"Done" is printed whatever the mark, so it sits after the decision where both paths join. In P it only prints when the mark is below 50.' },

          { t: 'note', kind: 'exam', html: 'In Paper 2 you may be given a flowchart and told to <em>"write a program that follows the structure of the flowchart"</em>. Use the same variable names as the boxes and keep the same order of steps. Marks are given for each correct construct: input, process, decision, loop and output.' },
          { t: 'predict', title: 'Trace the flowchart as code', code: C`
            n = 2
            count = 0
            while count < 3:
                n = n * 2
                count = count + 1
            print(n)
          `, rows: 1, why: 'n doubles three times: 2, 4, 8, 16.' },
          { t: 'quiz', q: 'In a flowchart, a loop is drawn with a decision diamond and an arrow that returns to a point above the diamond. Which Python word does this correspond to?', options: ['if', 'while', 'def', 'print'], answer: 1, why: 'The returning arrow is what makes it a loop. `while` tests the condition every time round.' },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'reading-code',
        title: 'Reading code: questions about a program',
        time: '40 min',
        book: 'Paper 2 · part (a) questions',
        exam: 'Paper 2 part (a)',
        summary: 'Identify, state, give, describe, explain: parts of a given program',
        intro: 'Many Paper 2 questions give you a short program and ask about it before you write anything. These marks are quick if you know the vocabulary and the command words.',
        blocks: [
          { t: 'h', text: 'The program we will study' },
          { t: 'p', html: 'Read the program below. We will refer to its **line numbers** throughout. Run it, then press **Trace** to watch the variables.' },
          { t: 'code', title: 'quiz_scorer.py', code: C`
            # Quiz scorer
            PASS_MARK = 6
            def get_score(answers, correct):
                score = 0
                for a in answers:
                    if a == correct:
                        score = score + 1
                return score

            answers = ["b", "a", "b", "c", "b", "b", "a", "b"]
            name = input("Name: ")
            result = get_score(answers, "b")
            if result >= PASS_MARK:
                print(name, "passed with", result)
            else:
                print(name, "needs to retry")
          `, stdin: ['Asha'], caption: 'Line 1 is the comment, line 2 sets PASS_MARK, line 3 starts the function, and so on down to line 16.' },

          { t: 'h', text: 'The command words' },
          { t: 'table', head: ['Command word', 'What to do', 'Marks (typical)'], rows: [
            ['**Identify**', 'Pick out one named thing from the code or the question. Write only that name or line number.', '1 mark per item'],
            ['**State**', 'Write a short, factual answer. No reasons needed.', '1 mark per point'],
            ['**Give**', 'Write a short answer such as an example, a value or a name.', '1 mark per item'],
            ['**Describe**', 'Say what something does or is like, in several connected points.', '2 or more marks'],
            ['**Explain**', 'Give a point **and a reason** using words such as "because" or "so that".', '2 or more marks'],
            ['**State the purpose**', 'One clear sentence about what the code is for (what it achieves), not a line-by-line reading.', '1 or 2 marks'],
          ] },
          { t: 'note', kind: 'exam', html: 'The number of marks tells you the number of points. A 1-mark <em>identify</em> answer needs one word. A 2-mark <em>explain</em> answer needs a point and its reason. Do not copy out the entire code.' },

          { t: 'h', text: 'Identify the parts of a program' },
          { t: 'table', head: ['Question', 'Answer for the program above', 'Remember'], rows: [
            ['Identify a **constant**', '`PASS_MARK` (line 2)', 'A named value that is not meant to change while the program runs. Written in capitals by convention.'],
            ['Identify a **variable**', '`score` (line 4), `name` (line 11) or `result` (line 12)', 'A named memory location whose value can change.'],
            ['Give the **data type** of the value on line 10', 'List (of strings)', 'Each item `"b"` is a string.'],
            ['Give the data type of `6` on line 2', 'Integer', 'A whole number.'],
            ['Identify a **parameter**', '`answers` or `correct` (line 3)', 'The name in the function definition that receives a value.'],
            ['Identify an **argument**', '`answers` or `"b"` (line 12)', 'The actual value given when the function is called.'],
            ['Identify a **user-written function**', '`get_score` (line 3)', 'Defined by the programmer with `def`.'],
            ['Identify a **built-in function**', '`print` or `input`', 'Comes with Python already.'],
            ['Function or procedure?', '`get_score` is a **function**, it returns a value (line 8)', 'A procedure does a job but does not return a value.'],
          ] },
          { t: 'sort', title: 'Name the part', prompt: 'Using the program above, classify each item.', cats: ['Parameter', 'Argument', 'Variable', 'Constant'], items: [
            { text: '<code>correct</code> inside the brackets on line 3', cat: 0 },
            { text: '<code>"b"</code> inside the brackets on line 12', cat: 1 },
            { text: '<code>PASS_MARK</code> on line 2', cat: 3 },
            { text: '<code>score</code> on line 4', cat: 2 },
            { text: '<code>answers</code> inside the brackets on line 3', cat: 0 },
            { text: '<code>answers</code> inside the brackets on line 12', cat: 1 },
            { text: '<code>result</code> on line 12', cat: 2 },
          ], why: 'Parameters appear in the `def` line. Arguments appear in the call. PASS_MARK is the named value that never changes.' },

          { t: 'h', text: 'Which line does what?' },
          { t: 'p', html: 'A common question gives you a line number and a list of words. The categories are **input**, **output**, **selection**, **iteration**, **assignment** and **subprogram call**.' },
          { t: 'sort', title: 'Type of statement', prompt: 'Decide what each statement does.', cats: ['Input', 'Output', 'Selection', 'Iteration', 'Assignment'], items: [
            { text: 'Line 11: <code>name = input("Name: ")</code>', cat: 0 },
            { text: 'Line 14: <code>print(name, "passed with", result)</code>', cat: 1 },
            { text: 'Line 13: <code>if result &gt;= PASS_MARK:</code>', cat: 2 },
            { text: 'Line 5: <code>for a in answers:</code>', cat: 3 },
            { text: 'Line 4: <code>score = 0</code>', cat: 4 },
            { text: 'Line 6: <code>if a == correct:</code>', cat: 2 },
          ], why: 'input() reads data, print() outputs, if is selection, for/while is iteration, `=` is assignment. Note line 11 is both an input and an assignment; the question will say which it wants.' },
          { t: 'cases', title: 'Reading a line, in Python', items: [
            { label: 'Line 5 iteration', intro: 'A `for` loop repeats the lines below it once for each item. Count the repeats.', code: C`
              count = 0
              for a in ["b", "a", "b"]:
                  count = count + 1
              print(count)
            ` },
            { label: 'Line 6 selection', intro: 'An `if` chooses whether the indented line runs.', code: C`
              a = "b"
              correct = "b"
              if a == correct:
                  print("match")
              else:
                  print("no match")
            ` },
            { label: 'Line 8 return', intro: '`return` sends a value back to where the function was called, so line 12 can store it in `result`.', code: C`
              def double(n):
                  return n * 2

              result = double(4)
              print(result)
            ` },
          ] },

          { t: 'h', text: 'State the purpose' },
          { t: 'p', html: 'The **purpose** is what the program is for in plain language. For the quiz program: <em>it counts how many of the answers match the correct letter and reports whether the student passed or must retry.</em> Mention the inputs, the main process and the output. Do not simply read each line.' },
          { t: 'quiz', q: 'Which is the best answer to "State the purpose of the function <code>get_score</code>"?', options: ['It has a for loop and an if statement', 'It counts how many answers are equal to the correct answer and returns the count', 'It prints the name', 'It is on line 3'], answer: 1, why: 'The purpose describes the job the function does and what it returns, not its structure.' },

          { t: 'h', text: 'Why are brackets used?' },
          { t: 'p', html: 'Brackets appear for two quite different reasons. Be ready to say which.' },
          { t: 'cases', title: 'Two uses of brackets', items: [
            { label: 'To pass data', intro: 'Brackets after a function name hold the **arguments** or **parameters**.', code: C`
              print(len("hello"))
              print(max(3, 9, 4))
            ` },
            { label: 'To change the order', intro: 'Brackets make Python work out that part first.', code: C`
              print(2 + 3 * 4)
              print((2 + 3) * 4)
            ` },
            { label: 'To group a condition', intro: 'Brackets can make a complex condition clear.', code: C`
              age = 15
              has_card = True
              if (age >= 11 and age <= 16) and has_card:
                  print("Student price")
            ` },
          ] },
          { t: 'quiz', q: 'In <code>average = (a + b) / 2</code> why are brackets used?', options: ['To call a function', 'So that the addition is done before the division', 'To make a list', 'Python needs them for every calculation'], answer: 1, why: 'Without brackets, `b / 2` would be done first, giving the wrong answer.' },

          { t: 'h', text: 'Comments, scope and constants' },
          { t: 'note', kind: 'key', html: '**Comment:** a line (or end of a line) starting with `#` that Python ignores. Its purpose is to explain the code to the humans who read or maintain it. It does not change what the program does.' },
          { t: 'note', kind: 'key', html: '**Scope** is the part of a program where a variable can be used. `score` is **local** to `get_score` (lines 4 to 8): it exists only while the function runs. `PASS_MARK` and `answers` are **global**: they are made outside any function and can be read anywhere.' },
          { t: 'code', title: 'Scope error', expectError: true, code: C`
            def get_score():
                score = 5
                return score

            print(get_score())
            print(score)
          `, caption: 'The last line fails because `score` only exists inside the function.' },
          { t: 'quiz', q: 'State the scope of the variable <code>score</code> in the quiz program.', options: ['Global, so it can be used on any line', 'Local to the function get_score, lines 4 to 8', 'It is a constant', 'Local to the loop on line 5 only'], answer: 1, why: 'It is created inside `get_score`, so it is local to that function.' },
          { t: 'quiz', q: 'Why is the constant <code>PASS_MARK</code> used instead of writing <code>6</code> in the if statement? Tick all that apply.', options: ['The meaning is clear from the name', 'If the pass mark changes, only one line needs to change', 'It makes Python run twice as fast', 'It stops the value from being printed'], answer: [0, 1], why: 'A named constant makes code readable and easy to update. It does not affect speed.' },
          { t: 'quiz', q: 'Which statement describes the difference between a procedure and a function?', options: ['A procedure returns a value; a function does not', 'A function returns a value; a procedure does not', 'There is no difference in Python', 'A function can only have one parameter'], answer: 1, why: 'A function gives back a value with `return`. A procedure just carries out a task, for example printing.' },

          { t: 'predict', title: 'What does the program print?', code: C`
            PASS_MARK = 3
            def get_score(answers, correct):
                score = 0
                for a in answers:
                    if a == correct:
                        score = score + 1
                return score

            result = get_score(["a", "a", "b", "a"], "a")
            if result >= PASS_MARK:
                print("passed with", result)
            else:
                print("retry")
          `, rows: 1, why: 'Three of the four answers equal "a", so result is 3, and 3 >= 3 is True.' },

          { t: 'h', text: 'Trace tables for the exam' },
          { t: 'tracetable', id: 'm14-tt-score', code: C`
            score = 0
            answers = ["b", "a", "b"]
            for a in answers:
                if a == "b":
                    score = score + 1
            print(score)
          `, cols: ['score', 'a'], output: true, prompt: 'Trace the scoring loop. Enter a value in the row where it changes.' },
          { t: 'tracetable', id: 'm14-tt-sentinel', code: C`
            total = 0
            count = 0
            number = int(input())
            while number != -1:
                total = total + number
                count = count + 1
                number = int(input())
            print(total)
          `, stdin: ['4', '6', '-1'], cols: ['total', 'count', 'number'], output: true, prompt: 'The inputs are 4, 6 and -1. Complete the table.' },

          { t: 'note', kind: 'exam', html: 'Typical full-mark answers:<br>**State a variable:** <em>score</em><br>**Give the data type of "Asha":** <em>string</em><br>**Explain why a constant is used:** <em>so the value only has to be changed in one place, which avoids mistakes</em>.<br>Quote the exact name from the code, with the spelling and capitals used there.' },

          { t: 'exercise', id: 'm14-ex-const', title: 'Use a named constant', level: 1,
            prompt: 'The program below uses the number <code>0.2</code> in two places. Add a constant called <code>VAT_RATE</code> at the top, set to <code>0.2</code>, and use it in both places. The output must stay the same.',
            starter: C`
              price = float(input("Price: "))
              vat = price * 0.2
              total = price + price * 0.2
              print("VAT:", vat)
              print("Total:", total)
            `,
            solution: C`
              VAT_RATE = 0.2
              price = float(input("Price: "))
              vat = price * VAT_RATE
              total = price + price * VAT_RATE
              print("VAT:", vat)
              print("Total:", total)
            `,
            tests: [{ in: ['10'], out: 'VAT: 2.0\nTotal: 12.0' }, { in: ['50'], out: 'VAT: 10.0\nTotal: 60.0' }, { in: ['0'], out: 'VAT: 0.0\nTotal: 0.0', hidden: true }],
            requires: [{ re: 'VAT_RATE\\s*=\\s*0\\.2', msg: 'Create `VAT_RATE = 0.2`.' }, { re: '\\*\\s*0\\.2', not: true, msg: 'Do not write `0.2` inside the calculations: use `VAT_RATE`.' }],
            hints: ['Write `VAT_RATE = 0.2` as the first line.', 'Replace each `0.2` in a calculation with `VAT_RATE`.'] },
          { t: 'exercise', id: 'm14-ex-return', title: 'From procedure to function', level: 2,
            prompt: 'The subprogram <code>show_area</code> is a **procedure**: it prints the area. Change it into a **function** called <code>area</code> that **returns** the area, and make the main program print the result.',
            starter: C`
              def show_area(width, height):
                  print(width * height)

              show_area(int(input("Width: ")), int(input("Height: ")))
            `,
            solution: C`
              def area(width, height):
                  return width * height

              print(area(int(input("Width: ")), int(input("Height: "))))
            `,
            tests: [{ in: ['4', '5'], out: '20' }, { in: ['1', '1'], out: '1' }, { in: ['0', '8'], out: '0', hidden: true }],
            requires: [{ re: 'def\\s+area\\s*\\(', msg: 'Name the function `area`.' }, { re: 'return\\b', msg: 'Use `return`.' }],
            hints: ['Replace `print` inside the function with `return`.', 'The main program now needs its own `print` around the call.'] },
          { t: 'exercise', id: 'm14-ex-explain', title: 'Describe it, then fix it', level: 3, kind: 'debug',
            prompt: 'The function <code>count_passes(marks, pass_mark)</code> should return how many marks in the list are at least the pass mark. There are <strong>three</strong> errors: a missing colon, a wrong comparison, and a misplaced <code>return</code>. Fix them.',
            starter: C`
              def count_passes(marks, pass_mark)
                  count = 0
                  for m in marks:
                      if m > pass_mark:
                          count = count + 1
                      return count
            `,
            solution: C`
              def count_passes(marks, pass_mark):
                  count = 0
                  for m in marks:
                      if m >= pass_mark:
                          count = count + 1
                  return count
            `,
            tests: [{ py: 'assert count_passes([40, 50, 39], 40) == 2', label: '[40, 50, 39] with 40' }, { py: 'assert count_passes([], 40) == 0', label: 'empty list' }, { py: 'assert count_passes([10, 90], 50) == 1', hidden: true }],
            hints: ['A `def` line ends with a colon.', 'The mark must be **at least** the pass mark, so include equal.', '`return` must be after the loop, with the same indentation as `for`.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'ide-evaluation',
        title: 'IDEs, debugging and evaluating programs',
        time: '40 min',
        book: 'Ch 2 · development environments',
        exam: 'Paper 1 and Paper 2',
        summary: 'IDE features, debugging, judging a program, improving it, test plans',
        intro: 'Writing code is only half of programming. You also use tools to find faults, and then judge whether your solution is good. This lesson covers both.',
        blocks: [
          { t: 'h', text: 'What is an IDE?' },
          { t: 'p', html: 'An **integrated development environment (IDE)** is one program that brings together the tools a programmer needs to write, run and fix code. IDLE, Thonny and PyCharm are all IDEs. The editor you are using on this site is a small one.' },
          { t: 'table', head: ['IDE feature', 'What it does for you'], rows: [
            ['**Code editor**', 'A text window made for writing code, with line numbers'],
            ['**Syntax highlighting**', 'Shows keywords, strings, numbers and comments in different colours, so mistakes such as an unclosed quote stand out'],
            ['**Auto-indent**', 'Indents the next line for you after a colon, which keeps the blocks correct'],
            ['**Run**', 'Translates and executes the program with one click'],
            ['**Error diagnostics**', 'Reports the error type and the line number, and may underline the fault'],
            ['**Debugger**', 'Lets you pause a program and inspect it while it runs'],
            ['**Breakpoint**', 'A marker on a line that makes the program pause there'],
            ['**Step through**', 'Run one line at a time to see exactly what happens'],
            ['**Variable watch**', 'Shows the current value of each variable as you step'],
          ] },
          { t: 'note', kind: 'exam', html: 'A question may ask you to <em>"describe two features of an IDE that help a programmer to debug"</em>. Good answers: <strong>breakpoints</strong> pause the program at a chosen line so the programmer can inspect it; a **variable watch** shows the current values so a wrong value is spotted; **step through** runs one line at a time so the exact faulty line is found; **error diagnostics** point to the line with a fault.' },

          { t: 'h', text: 'The Trace button works like a debugger' },
          { t: 'p', html: 'The **Trace** button on the code boxes in this course behaves like a debugger step-through. It runs your program one line at a time, highlights the current line, and shows every variable in a table that updates as you go. That is the same idea as stepping with a variable watch in a full IDE. Try it now on the loop below and watch `total` change.' },
          { t: 'code', title: 'Step through me', code: C`
            total = 0
            for n in [3, 5, 2]:
                total = total + n
            print(total)
          `, caption: 'Press Trace, then Step. Watch `n` and `total` after each line.' },

          { t: 'h', text: 'Print-statement debugging' },
          { t: 'p', html: 'You can find a bug without a debugger by adding extra `print()` lines that show the value of a variable at a certain point. Run the program, compare what is printed with what you expected, and the first difference points to the bug. Remove the prints when the bug is fixed.' },
          { t: 'cases', title: 'Finding a bug with print', items: [
            { label: 'The faulty program', intro: 'The average of 10, 20 and 30 should be 20. It shows something else.', code: C`
              numbers = [10, 20, 30]
              total = 0
              for n in numbers:
                  total = total + n
              average = total / len(numbers) + 1
              print(average)
            ` },
            { label: 'With debug prints', intro: 'The extra prints show that `total` is correct (60), so the fault is on the average line.', code: C`
              numbers = [10, 20, 30]
              total = 0
              for n in numbers:
                  total = total + n
              print("DEBUG total:", total)
              average = total / len(numbers) + 1
              print("DEBUG average:", average)
              print(average)
            ` },
            { label: 'Fixed', code: C`
              numbers = [10, 20, 30]
              total = 0
              for n in numbers:
                  total = total + n
              average = total / len(numbers)
              print(average)
            ` },
          ] },

          { t: 'h', text: 'Evaluating a program' },
          { t: 'p', html: 'To **evaluate** a program is to judge how good it is, with reasons. These are the main criteria.' },
          { t: 'table', head: ['Criterion', 'Question to ask'], rows: [
            ['**Meets the requirements**', 'Does it do everything the user asked, and nothing wrong?'],
            ['**Efficiency**', 'Does it avoid repeating work? Does it use few lines and little memory or time?'],
            ['**Usability**', 'Are the prompts clear? Does it explain mistakes? Is output easy to read?'],
            ['**Validation / robustness**', 'Does it cope with bad data without crashing?'],
            ['**Readability / maintainability**', 'Are names meaningful, comments present, code indented and split into subprograms?'],
          ] },
          { t: 'p', html: 'Compare two versions of the same program. Both print the cost of three tickets, but one is far easier to improve.' },
          { t: 'cases', title: 'Version A and version B', items: [
            { label: 'Version A', stdin: ['2', '3', '1'], code: C`
              a = int(input())
              b = int(input())
              c = int(input())
              print(a * 8.5)
              print(b * 8.5)
              print(c * 8.5)
            ` },
            { label: 'Version B', intro: 'Same output. The price is stored once, the work is done by a function, a loop avoids repeated lines, and the prompts and names are clear.', stdin: ['2', '3', '1'], code: C`
              TICKET_PRICE = 8.5

              def cost(tickets):
                  return tickets * TICKET_PRICE

              for group in range(1, 4):
                  tickets = int(input("Tickets for group " + str(group) + ": "))
                  print(cost(tickets))
            ` },
            { label: 'Evaluation', intro: 'Both versions give the same answer for a normal input, so you must evaluate **other** qualities. Try typing `abc` into each version above: both crash, so neither is robust yet. Version B is easier to change (one price, one function) and easier to read. Neither validates input.', code: C`
              # Evaluation checklist applied to Version B
              print("Meets the requirement (correct total): yes")
              print("Efficient (no repeated work): yes")
              print("Readable (names and structure): yes")
              print("Validates input: NO - improve this")
            ` },
          ] },
          { t: 'sort', title: 'Strength or weakness?', prompt: 'Each statement evaluates a program. Is it a strength or a weakness?', cats: ['Strength', 'Weakness'], items: [
            { text: 'Meaningful variable names and a comment above each section', cat: 0 },
            { text: 'The same five lines are copied three times', cat: 1 },
            { text: 'The program crashes if the user types a letter instead of a number', cat: 1 },
            { text: 'Every input is validated and the user is told what is wrong', cat: 0 },
            { text: 'The prompt just says <code>?</code> so the user is unsure what to type', cat: 1 },
            { text: 'Calculations are in functions that can be tested alone', cat: 0 },
            { text: 'The prices are typed directly into ten different lines', cat: 1 },
          ], why: 'Reuse, validation, clear prompts and subprograms are strengths. Repetition, crashing and unclear messages are weaknesses.' },
          { t: 'note', kind: 'exam', html: 'When asked to <em>evaluate</em>, give a **judgement with a reason**: "The program is easy to maintain because the pass mark is stored in a constant, so it only needs changing in one place." A bare "it is good" earns nothing.' },
          { t: 'quiz', q: 'A program asks <code>Enter age</code> and crashes when the user types <code>fifteen</code>. Which criterion is it failing?', options: ['Readability', 'Robustness / validation', 'Efficiency of memory', 'Syntax highlighting'], answer: 1, why: 'It does not cope with unexpected data. A type check with `isdigit()` or `try/except` fixes that.' },

          { t: 'h', text: 'Improving a program' },
          { t: 'exercise', id: 'm14-ex-add-validation', title: 'Add validation', level: 2,
            prompt: 'This program accepts any age. Improve it so it keeps asking until the age is between 11 and 16 inclusive. Each time the age is outside that range print <code>Invalid</code>. Then print <code>Age accepted: </code> followed by the age.',
            starter: C`
              age = int(input("Age (11-16): "))
              print("Age accepted:", age)
            `,
            solution: C`
              age = int(input("Age (11-16): "))
              while age < 11 or age > 16:
                  print("Invalid")
                  age = int(input("Age (11-16): "))
              print("Age accepted:", age)
            `,
            tests: [{ in: ['13'], out: 'Age accepted: 13' }, { in: ['5', '20', '16'], out: 'Invalid\nInvalid\nAge accepted: 16' }, { in: ['11'], out: 'Age accepted: 11' }, { in: ['10', '17', '12'], out: 'Invalid\nInvalid\nAge accepted: 12', hidden: true }],
            requires: [{ re: '\\bwhile\\b', msg: 'Use a `while` loop to keep asking.' }],
            hints: ['The invalid test is `age < 11 or age > 16`.', 'Ask again **inside** the loop.'] },
          { t: 'exercise', id: 'm14-ex-add-comments', title: 'Add comments', level: 1,
            prompt: 'The program works but has no comments. Without changing what it prints, add <strong>at least three</strong> comments that explain the purpose of each section.',
            starter: C`
              price = float(input("Price: "))
              rate = float(input("Discount percent: "))
              saving = price * rate / 100
              new_price = price - saving
              print(round(new_price, 2))
            `,
            solution: C`
              # Read the price and the discount
              price = float(input("Price: "))
              rate = float(input("Discount percent: "))
              # Work out how much is saved
              saving = price * rate / 100
              # Subtract it and show the new price
              new_price = price - saving
              print(round(new_price, 2))
            `,
            tests: [{ in: ['100', '10'], out: '90.0' }, { in: ['50', '50'], out: '25.0' }, { in: ['20', '0'], out: '20.0', hidden: true }],
            requires: [{ re: '#[^\\n]*\\n[\\s\\S]*#[^\\n]*\\n[\\s\\S]*#', msg: 'Add at least three comments starting with `#`.' }],
            hints: ['A comment explains **why or what**, not the symbols: say what the section achieves.'] },
          { t: 'exercise', id: 'm14-ex-use-loop', title: 'Replace repeated code with a loop', level: 2,
            prompt: 'This program repeats the same line five times. Rewrite it so it produces the same output using a <code>for</code> loop and only one <code>print</code>.',
            starter: C`
              print("Locker 1 checked")
              print("Locker 2 checked")
              print("Locker 3 checked")
              print("Locker 4 checked")
              print("Locker 5 checked")
            `,
            solution: C`
              for n in range(1, 6):
                  print("Locker " + str(n) + " checked")
            `,
            tests: [{ out: 'Locker 1 checked\nLocker 2 checked\nLocker 3 checked\nLocker 4 checked\nLocker 5 checked' }, { lines: 5 }, { hasNot: ['Locker 6', 'Locker 0'] }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }, { re: 'print\\([^\\n]*\\)[\\s\\S]*print\\([^\\n]*\\)[\\s\\S]*print\\(', not: true, msg: 'Use only one `print` (inside the loop).' }],
            hints: ['`range(1, 6)` gives 1, 2, 3, 4, 5.', 'Join the number into the text with `str(n)`.'] },
          { t: 'exercise', id: 'm14-ex-use-function', title: 'Replace repeated code with a function', level: 3,
            prompt: 'The VAT calculation is copied three times. Write a function <code>with_vat(price)</code> that returns the price plus 20% rounded to 2 decimal places, and call it three times. The number <code>1.2</code> must appear only once in your program.',
            starter: C`
              p1 = float(input("Price 1: "))
              print("With VAT:", round(p1 * 1.2, 2))
              p2 = float(input("Price 2: "))
              print("With VAT:", round(p2 * 1.2, 2))
              p3 = float(input("Price 3: "))
              print("With VAT:", round(p3 * 1.2, 2))
            `,
            solution: C`
              def with_vat(price):
                  return round(price * 1.2, 2)

              for i in range(3):
                  p = float(input("Price: "))
                  print("With VAT:", with_vat(p))
            `,
            tests: [
              { in: ['10', '20', '5'], out: 'With VAT: 12.0\nWith VAT: 24.0\nWith VAT: 6.0' },
              { in: ['1.5', '2', '100'], out: 'With VAT: 1.8\nWith VAT: 2.4\nWith VAT: 120.0' },
              { in: ['0', '0', '0'], out: 'With VAT: 0.0\nWith VAT: 0.0\nWith VAT: 0.0', hidden: true },
            ],
            requires: [{ re: 'def\\s+with_vat\\s*\\(', msg: 'Define `with_vat`.' }, { re: '1\\.2[\\s\\S]*1\\.2', not: true, msg: 'The number `1.2` must appear only once.' }],
            hints: ['Put `return round(price * 1.2, 2)` in the function.', 'A loop that runs three times can read and print each price.'] },

          { t: 'h', text: 'Writing a test plan' },
          { t: 'p', html: 'A **test plan** lists the data you will try, what you expect to happen, and what actually happened. The table below is a plan for a program that accepts an age from 11 to 16.' },
          { t: 'table', head: ['Test', 'Type of data', 'Input', 'Expected result'], rows: [
            ['1', 'Normal', '13', 'Age accepted'],
            ['2', 'Boundary (lowest valid)', '11', 'Age accepted'],
            ['3', 'Boundary (highest valid)', '16', 'Age accepted'],
            ['4', 'Boundary (just outside)', '10 and 17', 'Rejected, asked again'],
            ['5', 'Erroneous', 'abc', 'Rejected, no crash'],
          ] },
          { t: 'sort', title: 'Choose the test data', prompt: 'For the age rule 11 to 16 inclusive, what kind of test data is each input?', cats: ['Normal', 'Boundary', 'Erroneous'], items: [
            { text: '14', cat: 0 },
            { text: '11', cat: 1 },
            { text: '16', cat: 1 },
            { text: '17', cat: 1 },
            { text: '-4', cat: 2 },
            { text: 'abc', cat: 2 },
            { text: '12', cat: 0 },
          ], why: 'Boundary data sits on or just beside a limit. Erroneous data is the wrong type or clearly impossible. Normal data is ordinary and valid.' },
          { t: 'predict', title: 'Which test fails?', code: C`
            def valid_age(age):
                return 11 < age < 16

            print(valid_age(13))
            print(valid_age(11))
            print(valid_age(16))
          `, rows: 3, why: 'The programmer used `<` not `<=`, so the boundary values 11 and 16 are wrongly rejected. Boundary tests catch this.' },
          { t: 'tracetable', id: 'm14-tt-countdown', code: C`
            x = 3
            while x > 0:
                print(x)
                x = x - 1
          `, cols: ['x'], output: true, prompt: 'Trace this like a debugger step-through with a variable watch on x.' },
          { t: 'note', kind: 'warn', html: 'Testing shows that faults exist; it can never prove there are none. Test with **normal, boundary and erroneous** data, and record the expected result **before** running the test.' },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'complete-the-code',
        title: 'Complete the code',
        time: '45 min',
        book: 'Paper 2 · structured tasks',
        exam: 'Paper 2 practical',
        summary: 'Fill the blanks, generalise, follow the given structure',
        intro: 'Paper 2 often gives you part of a program and tells you to use the structure that is there. These tasks reward careful reading: finish the gaps and change nothing else unless you are told to.',
        blocks: [
          { t: 'h', text: 'How these tasks are written' },
          { t: 'p', html: 'You will see a skeleton with comments such as `# complete the loop` and blanks such as `___`. A blank is **not valid Python**, so the program fails until every blank is replaced. In this course `___` marks exactly where you write.' },
          { t: 'note', kind: 'exam', html: 'Read the instruction wording closely:<br>**"Use the structure given"** means keep the loop or the `if` that is there.<br>**"Do not add any further functionality"** means no extra prints, no extra inputs, no extra checks.<br>**"Generalise"** means it must work for any amount of data, not just the example.<br>**"Add a suitable comment"** means a comment that explains the code beside it.<br>**"Amend the code so it still works when the data changes"** means remove hard-coded numbers and lengths.' },
          { t: 'cases', title: 'Reading a skeleton', items: [
            { label: 'The skeleton', intro: 'Before you type, decide what each blank must hold. This one has three blanks.', code: C`
              # complete the loop (after filling the blanks this would add 1 to 5)
              total = 0
              for number in range(1, 6):
                  total = total + number
              print(total)
            ` },
            { label: 'Blank in a condition', intro: 'The blank is a comparison. Test the boundaries.', stdin: ['16'], code: C`
              age = int(input("Age: "))
              if age >= 16:
                  print("Adult ticket")
              else:
                  print("Child ticket")
            ` },
            { label: 'Hard-coded vs general', intro: 'Version 1 works only for a list of exactly three items. Version 2 works for any length.', code: C`
              marks = [12, 7, 15]
              print("Fixed:", marks[0] + marks[1] + marks[2])

              total = 0
              for m in marks:
                  total = total + m
              print("General:", total)
            ` },
            { label: 'It breaks when data changes', expectError: true, intro: 'The fixed version crashes as soon as the list is shorter.', code: C`
              marks = [12, 7]
              print(marks[0] + marks[1] + marks[2])
            ` },
          ] },
          { t: 'quiz', q: 'A task says <em>"Do not add any further functionality."</em> You have completed the blanks. Which action is **not** allowed?', options: ['Completing the blanks', 'Adding an extra print that shows a bonus message', 'Leaving the other lines untouched', 'Using the variable names already in the skeleton'], answer: 1, why: 'Extra output is added functionality, so it can lose marks and may fail the checks.' },
          { t: 'sort', title: 'Which instruction is it?', prompt: 'Match the instruction to what you must do.', cats: ['Generalise', 'Add a comment', 'Do not add more', 'Use the given structure'], items: [
            { text: 'Make the code work for a list of any length', cat: 0 },
            { text: 'Write a line starting with <code>#</code> that explains a section', cat: 1 },
            { text: 'Fill in the gaps but add no extra prints', cat: 2 },
            { text: 'Keep the <code>while</code> loop that is provided', cat: 3 },
            { text: 'Replace the fixed number 5 with <code>len()</code> of the list', cat: 0 },
          ], why: 'Generalise means remove fixed sizes. Adding a comment, adding nothing extra, and keeping the structure are different instructions.' },
          { t: 'predict', title: 'Fill the blank in your head', code: C`
            total = 0
            for i in range(1, 4):
                total = total + i * i
            print(total)
          `, rows: 1, why: 'The squares are 1, 4 and 9, which add up to 14.' },

          { t: 'exercise', id: 'm14-ex-cc-squares', title: 'Complete the for loop', level: 1,
            prompt: 'Complete the loop so the program prints the sum of the squares of the whole numbers from 1 up to <code>n</code> inclusive. Do not add any further functionality.',
            starter: C`
              n = int(input("n: "))
              total = 0
              for i in range(1, ___):   # complete the loop
                  total = total + ___
              print(total)
            `,
            solution: C`
              n = int(input("n: "))
              total = 0
              for i in range(1, n + 1):
                  total = total + i * i
              print(total)
            `,
            tests: [{ in: ['3'], out: '14' }, { in: ['1'], out: '1' }, { in: ['0'], out: '0' }, { in: ['4'], out: '30', hidden: true }],
            requires: [{ re: '___', not: true, msg: 'Replace every `___`.' }],
            hints: ['`range(1, n)` stops at n - 1.', 'The square of `i` is `i * i`.'] },
          { t: 'exercise', id: 'm14-ex-cc-ticket', title: 'Complete the selection', level: 1,
            prompt: 'Complete the code. Children under 5 enter free, people under 16 pay the child price, everyone else pays the adult price.',
            starter: C`
              age = int(input("Age: "))
              if age < ___:
                  print("Free")
              elif ___:
                  print("Child")
              else:
                  print("Adult")
            `,
            solution: C`
              age = int(input("Age: "))
              if age < 5:
                  print("Free")
              elif age < 16:
                  print("Child")
              else:
                  print("Adult")
            `,
            tests: [{ in: ['3'], out: 'Free' }, { in: ['4'], out: 'Free' }, { in: ['5'], out: 'Child' }, { in: ['15'], out: 'Child' }, { in: ['16'], out: 'Adult' }, { in: ['40'], out: 'Adult', hidden: true }],
            requires: [{ re: '___', not: true, msg: 'Replace every `___`.' }],
            hints: ['The first blank is a number.', 'The second blank is a full condition, for example `age < ...`.'] },
          { t: 'exercise', id: 'm14-ex-cc-while', title: 'Complete the while loop', level: 2,
            prompt: 'Complete the three blanks. The program adds numbers until the user types 0, then prints the total. Keep the structure given.',
            starter: C`
              total = 0
              number = int(input("Number (0 to stop): "))
              while number ___ 0:
                  total = ___
                  number = ___
              print("Total:", total)
            `,
            solution: C`
              total = 0
              number = int(input("Number (0 to stop): "))
              while number != 0:
                  total = total + number
                  number = int(input("Number (0 to stop): "))
              print("Total:", total)
            `,
            tests: [{ in: ['5', '10', '0'], out: 'Total: 15' }, { in: ['0'], out: 'Total: 0' }, { in: ['-2', '3', '0'], out: 'Total: 1' }, { in: ['9', '0'], out: 'Total: 9', hidden: true }],
            requires: [{ re: '___', not: true, msg: 'Replace every `___`.' }],
            hints: ['The loop keeps going while the number is **not** 0.', 'The last line in the loop reads the next number.'] },
          { t: 'exercise', id: 'm14-ex-cc-multiples', title: 'No further functionality', level: 2,
            prompt: 'Complete the code so it prints the first five multiples of 5, one per line (5, 10, 15, 20, 25). **Do not add any further functionality**: no extra output and no input.',
            starter: C`
              for number in range(___, ___):
                  print(number * ___)
            `,
            solution: C`
              for number in range(1, 6):
                  print(number * 5)
            `,
            tests: [{ out: '5\n10\n15\n20\n25' }, { lines: 5, label: 'exactly five lines' }, { hasNot: ['Done', 'total'], loose: true, label: 'no extra messages' }],
            requires: [{ re: '___', not: true, msg: 'Replace every `___`.' }, { re: '\\binput\\b', not: true, msg: 'No input is needed.' }],
            hints: ['`range(1, 6)` gives 1 to 5.', 'Multiply the loop variable by 5.'] },
          { t: 'exercise', id: 'm14-ex-cc-comment', title: 'Add a suitable comment', level: 1,
            prompt: 'Complete the blank so the program takes 10% off the price. Then replace the placeholder comment at the top with a **suitable comment** (at least a short sentence) that explains what the program does.',
            starter: C`
              # ___
              price = float(input("Price: "))
              discount = price * ___
              print(round(price - discount, 2))
            `,
            solution: C`
              # Show the price after a 10 per cent discount
              price = float(input("Price: "))
              discount = price * 0.1
              print(round(price - discount, 2))
            `,
            tests: [{ in: ['50'], out: '45.0' }, { in: ['10'], out: '9.0' }, { in: ['200'], out: '180.0' }, { in: ['0'], out: '0.0', hidden: true }],
            requires: [{ re: '(^|\\n)\\s*#(?![ _]*(\\n|$))[^\\n]*[A-Za-z]{3}', msg: 'Replace `# ___` with a real comment that explains the program.' }, { re: '___', not: true, msg: 'Replace every `___`.' }],
            hints: ['10 per cent as a decimal is `0.1`.', 'A comment starts with `#` and describes what the code does.'] },
          { t: 'exercise', id: 'm14-ex-cc-general', title: 'Generalise the code', level: 2,
            prompt: 'The function <code>mean(values)</code> only works for lists of exactly three numbers. Generalise it so it returns the mean of a list of **any length** (at least one item).',
            starter: C`
              def mean(values):
                  total = values[0] + values[1] + values[2]
                  return total / 3
            `,
            solution: C`
              def mean(values):
                  total = 0
                  for v in values:
                      total = total + v
                  return total / len(values)
            `,
            tests: [{ py: 'assert mean([1, 2, 3]) == 2', label: 'three items' }, { py: 'assert mean([10]) == 10', label: 'one item' }, { py: 'assert mean([4, 6, 8, 10]) == 7', label: 'four items' }, { py: 'assert mean([5, 5, 5, 5, 5, 5]) == 5', hidden: true }],
            requires: [{ re: 'values\\[\\d\\]', not: true, msg: 'Do not use fixed index numbers like `values[0]`.' }],
            hints: ['Loop through the list with `for v in values:`.', 'Divide by `len(values)` instead of 3.'] },
          { t: 'exercise', id: 'm14-ex-cc-data-changes', title: 'Still works when the data changes', level: 2,
            prompt: 'The function <code>count_passes(marks)</code> counts the marks of 40 or more, but it only works for a list of five marks. Amend it so it still works when the data changes length, including an empty list.',
            starter: C`
              def count_passes(marks):
                  count = 0
                  for i in range(5):
                      if marks[i] >= 40:
                          count = count + 1
                  return count
            `,
            solution: C`
              def count_passes(marks):
                  count = 0
                  for i in range(len(marks)):
                      if marks[i] >= 40:
                          count = count + 1
                  return count
            `,
            tests: [{ py: 'assert count_passes([40, 50, 39, 10, 90]) == 3', label: 'five marks' }, { py: 'assert count_passes([60, 20, 80]) == 2', label: 'three marks' }, { py: 'assert count_passes([]) == 0', label: 'empty list' }, { py: 'assert count_passes([1, 2, 3, 4, 5, 6, 7, 8, 9, 40]) == 1', hidden: true }],
            requires: [{ re: 'range\\(\\s*5\\s*\\)', not: true, msg: 'Remove the fixed `range(5)`.' }],
            hints: ['The number of marks is `len(marks)`.', 'Or loop with `for m in marks:`.'] },
          { t: 'exercise', id: 'm14-ex-cc-longest', title: 'Complete the function', level: 3,
            prompt: 'Complete <code>longest_word(words)</code>. It returns the longest word in the list. If two words are equally long, the first one wins. For an empty list it returns an empty string. Use the structure given.',
            starter: C`
              def longest_word(words):
                  best = ""
                  for w in ___:
                      if len(___) > len(best):
                          best = ___
                  return best
            `,
            solution: C`
              def longest_word(words):
                  best = ""
                  for w in words:
                      if len(w) > len(best):
                          best = w
                  return best
            `,
            tests: [{ py: 'assert longest_word(["cat", "horse", "dog"]) == "horse"' }, { py: 'assert longest_word([]) == ""', label: 'empty list' }, { py: 'assert longest_word(["ab", "cd"]) == "ab"', label: 'tie: first wins' }, { py: 'assert longest_word(["a"]) == "a"', hidden: true }],
            requires: [{ re: '___', not: true, msg: 'Replace every `___`.' }],
            hints: ['Loop over the list that is the parameter.', 'Compare the length of the current word `w` with `best`.'] },
          { t: 'exercise', id: 'm14-ex-cc-grid', title: 'Complete the nested loops', level: 3,
            prompt: 'Complete <code>grid_total(grid)</code>, which returns the sum of every value in a 2D list of numbers. The rows may have different lengths and the grid may be empty.',
            starter: C`
              def grid_total(grid):
                  total = 0
                  for row in ___:
                      for value in ___:
                          total = total + ___
                  return total
            `,
            solution: C`
              def grid_total(grid):
                  total = 0
                  for row in grid:
                      for value in row:
                          total = total + value
                  return total
            `,
            tests: [{ py: 'assert grid_total([[1, 2], [3, 4]]) == 10' }, { py: 'assert grid_total([]) == 0', label: 'empty grid' }, { py: 'assert grid_total([[5]]) == 5' }, { py: 'assert grid_total([[1, 2, 3], [4]]) == 10', hidden: true }],
            requires: [{ re: '___', not: true, msg: 'Replace every `___`.' }],
            hints: ['The outer loop goes through the rows of `grid`.', 'The inner loop goes through the values of one `row`.'] },
          { t: 'exercise', id: 'm14-ex-cc-debug', kind: 'debug', title: 'Three errors in a function', level: 2,
            prompt: 'The function <code>count_vowels(text)</code> should return how many vowels (a, e, i, o, u, in either case) are in the text. There are <strong>three</strong> errors. Find and fix them.',
            starter: C`
              def count_vowels(text):
                  count = 0
                  for ch in text
                      if ch in "aeiou":
                          count = count + 1
                      return count
            `,
            solution: C`
              def count_vowels(text):
                  count = 0
                  for ch in text:
                      if ch.lower() in "aeiou":
                          count = count + 1
                  return count
            `,
            tests: [{ py: 'assert count_vowels("Hello") == 2' }, { py: 'assert count_vowels("AEIOU") == 5', label: 'capital letters count' }, { py: 'assert count_vowels("") == 0', label: 'empty text' }, { py: 'assert count_vowels("rhythm") == 0', hidden: true }],
            hints: ['A `for` line needs a colon.', '`return` belongs after the loop, not inside it.', 'Convert each letter with `.lower()` before testing.'] },

          { t: 'note', kind: 'exam', html: 'Checklist before you submit a complete-the-code task: (1) no `___` left; (2) the original structure is still there; (3) no new inputs or prints that were not asked for; (4) test with the smallest case (empty or one item) as well as a normal one; (5) the comment, if requested, says what the code does, not just the word "loop".' },
        ],
      },
    ],
  });
})();

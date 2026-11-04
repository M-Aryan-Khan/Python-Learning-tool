(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm02',
    title: 'Selection (if statements)',
    blurb: 'Make programs decide: comparisons, if / elif / else, and / or / not, nested decisions and everyday patterns.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'comparisons',
        title: 'Comparing values',
        time: '25 min',
        book: 'Ch 2 · p.56',
        exam: 'Paper 2 Q1-Q3',
        summary: 'Comparison operators, True/False results, = vs ==',
        intro: 'Before a program can decide anything, it must be able to ask a yes-or-no question about its data. In Python that question is a comparison, and the answer is always `True` or `False`.',
        blocks: [
          { t: 'h', text: 'A comparison gives a bool' },
          { t: 'p', html: 'A **comparison operator** compares two values and produces a **Boolean** (`bool`) answer: `True` or `False`. There are six of them.' },
          {
            t: 'table', head: ['Operator', 'Meaning', 'Example', 'Result'], rows: [
              ['`==`', 'equal to', '`5 == 5`', '`True`'],
              ['`!=`', 'not equal to', '`5 != 5`', '`False`'],
              ['`<`', 'less than', '`3 < 8`', '`True`'],
              ['`>`', 'greater than', '`3 > 8`', '`False`'],
              ['`<=`', 'less than or equal to', '`8 <= 8`', '`True`'],
              ['`>=`', 'greater than or equal to', '`7 >= 8`', '`False`'],
            ]
          },
          {
            t: 'cases', title: 'The six operators on numbers', items: [
              {
                label: 'Equal / not equal', code: C`
              print(10 == 10)
              print(10 == 11)
              print(10 != 11)
              print(10 != 10)
            ` },
              {
                label: 'Less / greater', code: C`
              print(4 < 9)
              print(4 > 9)
              print(9 < 9)
              print(9 > 9)
            `, caption: 'A number is never less than or greater than itself.'
              },
              {
                label: 'Boundary: the equals sign', intro: 'The difference between `<` and `<=` only shows up when both values are equal. This is called the **boundary**, and exams test it a lot.', code: C`
              score = 50
              print(score < 50)
              print(score <= 50)
              print(score > 50)
              print(score >= 50)
            ` },
              {
                label: 'With variables', code: C`
              age = 15
              limit = 16
              print(age < limit)
              print(age + 1 == limit)
              print(type(age < limit))
            ` },
              {
                label: 'Stored in a variable', intro: 'Because the answer is a value, you can keep it in a variable.', code: C`
              temperature = 31
              is_hot = temperature > 30
              print(is_hot)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Two symbols, two jobs. `=` **stores** a value in a variable (`x = 5`). `==` **asks** whether two values are equal (`x == 5`). Mixing them up is one of the most common mistakes in the exam.' },
          {
            t: 'code', title: 'Using = where you meant ==', expectError: true, code: C`
            x = 5
            if x = 5:
                print("five")
          `, caption: 'Python reports a SyntaxError. Change `=` to `==` to fix it.'
          },

          { t: 'h', text: 'Comparing text' },
          { t: 'p', html: 'You can compare strings too. `==` checks that every character matches, **including capital letters**. Ordering operators compare character by character using the computer\'s character codes, so all capitals come before all lower-case letters.' },
          {
            t: 'cases', title: 'Comparing strings', items: [
              {
                label: 'Equal', code: C`
              print("cat" == "cat")
              print("cat" == "dog")
              print("cat" != "dog")
            ` },
              {
                label: 'Case matters', intro: 'A capital letter makes a different string.', code: C`
              print("Python" == "python")
              print("Python" == "Python")
              print("YES" == "yes")
            ` },
              {
                label: 'Alphabetical order', code: C`
              print("apple" < "banana")
              print("banana" < "apple")
              print("cat" < "caterpillar")
              print("a" < "b")
            `, caption: 'A shorter word that matches the start of a longer word comes first.'
              },
              {
                label: 'Capitals first', code: C`
              print("Zebra" < "apple")
              print("apple" < "Zebra")
              print("A" < "a")
            `, caption: 'Every capital letter has a smaller code than every lower-case letter, so `"Zebra" < "apple"` is `True`.'
              },
              {
                label: 'Ignoring case', intro: 'To compare without caring about capitals, convert both sides with `.lower()` first.', code: C`
              answer = "PyThOn"
              print(answer == "python")
              print(answer.lower() == "python")
            ` },
            ]
          },

          { t: 'h', text: 'Mixing types' },
          { t: 'p', html: 'The text `"5"` and the number `5` look similar but are different things. Always compare like with like. `input()` always gives text, so convert with `int()` or `float()` before comparing numbers.' },
          {
            t: 'cases', title: 'Text vs number', items: [
              {
                label: '"5" == 5', code: C`
              print("5" == 5)
              print(int("5") == 5)
              print("5" == str(5))
            `, caption: '`==` between different types is simply `False`; it does not crash.'
              },
              {
                label: '"5" < 5', expectError: true, intro: 'Ordering operators refuse to compare text with a number.', code: C`
              print("5" < 5)
            ` },
              {
                label: 'Comparing input', stdin: ['12'], code: C`
              age = int(input("Age: "))
              print(age >= 13)
            `, caption: 'Without `int()` this would crash with a TypeError, because `input()` gives text.'
              },
              {
                label: 'Int and float', code: C`
              print(7 == 7.0)
              print(0.1 + 0.2 == 0.3)
            `, caption: 'Whole-number floats equal ints. But decimals are stored approximately, so avoid `==` on calculated floats.'
              },
            ]
          },

          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode uses the same six comparisons, written with the symbols <code>=</code>, <code>≠</code>, <code>&lt;</code>, <code>&gt;</code>, <code>≤</code>, <code>≥</code> in a condition: <pre>IF age ≥ 16 THEN</pre> In Python this is `age >= 16`. A question may ask: <em>state the result of this comparison</em>. The answer is always True or False, never a number.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Predict the comparisons', code: C`
            a = 7
            b = 7.0
            print(a == b)
            print(10 >= 11)
            print("Zed" < "apple")
            print("dog" != "Dog")
          `, rows: 4, why: '`7 == 7.0` is True. `10 >= 11` is False. Capitals sort before lower-case, so `"Zed" < "apple"` is True. Different capitals make the strings different.'
          },
          {
            t: 'predict', title: 'Boundary values', code: C`
            n = 18
            print(n > 18)
            print(n >= 18)
            print(n < 18)
            print(n <= 18)
          `, rows: 4, why: 'At exactly 18, only the "or equal to" versions are True.'
          },
          { t: 'quiz', q: 'Which line checks whether the variable <code>score</code> is equal to 100?', options: ['score = 100', 'score == 100', 'score => 100', 'score equals 100'], answer: 1, why: '`==` compares. A single `=` would try to store a value. `=>` is not a Python operator (the right one is `>=`).' },
          { t: 'quiz', q: 'What is the value of <code>"B" < "a"</code>?', options: ['True', 'False', 'It crashes', 'It depends on the computer'], answer: 0, why: 'Capital letters have smaller character codes than lower-case letters, so `"B"` comes first.' },
          {
            t: 'sort', prompt: 'Decide whether each comparison is True or False.', cats: ['True', 'False'], items: [
              { text: '<code>5 != 6</code>', cat: 0 },
              { text: '<code>12 <= 12</code>', cat: 0 },
              { text: '<code>"hat" == "Hat"</code>', cat: 1 },
              { text: '<code>3 > 3</code>', cat: 1 },
              { text: '<code>"ant" < "bee"</code>', cat: 0 },
              { text: '<code>2 + 2 == 5</code>', cat: 1 },
            ], why: 'Work each one out: equal numbers satisfy `<=` and `>=` but not `<` or `>`; capitals make strings different.'
          },

          {
            t: 'exercise', id: 'm02-ex-can-vote', title: 'Old enough?', level: 1,
            prompt: 'Read an age as a whole number and print <code>True</code> if it is 16 or more, otherwise <code>False</code>. Do this by printing the comparison itself (no <code>if</code> needed).',
            starter: C`
              age = int(input("Age: "))
              # print the result of a comparison
            `,
            solution: C`
              age = int(input("Age: "))
              print(age >= 16)
            `,
            tests: [{ in: ['20'], out: 'True' }, { in: ['16'], out: 'True' }, { in: ['15'], out: 'False', hidden: true }],
            hints: ['The comparison is `age >= 16`.', 'Put the comparison inside `print()`.']
          },
          {
            t: 'exercise', id: 'm02-ex-same-word', title: 'Same word?', level: 1,
            prompt: 'Read two words. Print <code>True</code> if they are the same when capital letters are ignored, otherwise <code>False</code>.',
            starter: C`
              first = input("First word: ")
              second = input("Second word: ")
              # compare them
            `,
            solution: C`
              first = input("First word: ")
              second = input("Second word: ")
              print(first.lower() == second.lower())
            `,
            tests: [{ in: ['Hello', 'hello'], out: 'True' }, { in: ['cat', 'dog'], out: 'False' }, { in: ['PYTHON', 'PyThOn'], out: 'True', hidden: true }],
            hints: ['`.lower()` makes a lower-case copy of a string.', 'Convert both words, then compare with `==`.']
          },
          {
            t: 'exercise', id: 'm02-ex-three-comparisons', title: 'Three answers', level: 2,
            prompt: 'Read two whole numbers <code>a</code> and <code>b</code>. Print three lines: the result of <code>a &lt; b</code>, then <code>a == b</code>, then <code>a &gt; b</code>.',
            starter: C`
              a = int(input("a: "))
              b = int(input("b: "))
            `,
            solution: C`
              a = int(input("a: "))
              b = int(input("b: "))
              print(a < b)
              print(a == b)
              print(a > b)
            `,
            tests: [{ in: ['3', '5'], out: 'True\nFalse\nFalse' }, { in: ['4', '4'], out: 'False\nTrue\nFalse' }, { in: ['9', '2'], out: 'False\nFalse\nTrue', hidden: true }],
            hints: ['You need three `print()` lines.', 'Exactly one of the three lines is ever True.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'if-else',
        title: 'if and else',
        time: '30 min',
        book: 'Ch 2 · p.57-60',
        exam: 'Paper 2 Q1-Q4',
        summary: 'if, if/else, indentation, the colon',
        intro: 'Selection means the program chooses which lines to run. The `if` statement runs a block of code only when a condition is True; `else` gives the block to run otherwise.',
        blocks: [
          { t: 'h', text: 'if on its own' },
          { t: 'p', html: 'The condition is any comparison. If it is `True`, the **indented** lines underneath run. If it is `False`, Python skips them and carries on below.' },
          {
            t: 'code', title: 'if.py', stdin: ['35'], code: C`
            temperature = int(input("Temperature: "))
            if temperature > 30:
                print("It is hot today")
            print("Have a good day")
          `, caption: 'Run it with 35, then change the input to 20 (edit the number in the Input box) and run again. Press **Trace** to watch which lines Python visits.'
          },
          { t: 'note', kind: 'key', html: 'Three things every `if` needs: the word `if`, a condition, and a **colon** `:` at the end of the line. The lines that belong to it are **indented** (4 spaces is the standard). The indentation is how Python knows where the block ends.' },
          {
            t: 'cases', title: 'if on its own: both outcomes', items: [
              {
                label: 'Condition True', stdin: ['35'], code: C`
              temperature = int(input("Temperature: "))
              if temperature > 30:
                  print("It is hot today")
              print("Have a good day")
            ` },
              {
                label: 'Condition False', stdin: ['20'], code: C`
              temperature = int(input("Temperature: "))
              if temperature > 30:
                  print("It is hot today")
              print("Have a good day")
            `, caption: 'The indented line is skipped. The un-indented last line always runs.'
              },
              {
                label: 'Several lines in the block', stdin: ['95'], code: C`
              mark = int(input("Mark: "))
              if mark >= 90:
                  print("Outstanding!")
                  print("You win a certificate")
                  bonus = 5
                  print("Bonus points:", bonus)
              print("End of report")
            ` },
              {
                label: 'Boundary', intro: 'Exactly on the limit. `>` is False at 30, `>=` would be True.', stdin: ['30'], code: C`
              temperature = int(input("Temperature: "))
              if temperature > 30:
                  print("Hot")
              if temperature >= 30:
                  print("Hot or exactly 30")
            ` },
            ]
          },

          { t: 'h', text: 'if ... else' },
          { t: 'p', html: '`else` has no condition of its own. It means "in every other case". Exactly **one** of the two blocks runs, never both and never neither.' },
          {
            t: 'cases', title: 'if / else', items: [
              {
                label: 'Pass or fail', stdin: ['62'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
              {
                label: 'The other branch', stdin: ['31'], code: C`
              mark = int(input("Mark: "))
              if mark >= 50:
                  print("Pass")
              else:
                  print("Fail")
            ` },
              {
                label: 'Comparing strings', stdin: ['python123'], code: C`
              password = input("Password: ")
              if password == "python123":
                  print("Welcome back")
              else:
                  print("Access denied")
            ` },
              {
                label: 'Several lines each side', stdin: ['120'], code: C`
              spend = int(input("Spend: "))
              if spend >= 100:
                  print("Free delivery")
                  print("Thank you for a big order")
              else:
                  print("Delivery costs 5")
                  print("Spend more to save")
              print("Order complete")
            ` },
              {
                label: 'Using a stored bool', stdin: ['16'], code: C`
              age = int(input("Age: "))
              is_adult = age >= 18
              if is_adult:
                  print("Adult ticket")
              else:
                  print("Child ticket")
            `, caption: '`if is_adult:` is enough. You do not need `if is_adult == True:`.'
              },
            ]
          },

          { t: 'h', text: 'What goes wrong' },
          {
            t: 'cases', title: 'The four classic mistakes', items: [
              {
                label: 'Missing colon', expectError: true, code: C`
              age = 17
              if age >= 16
                  print("Allowed")
            `, caption: 'SyntaxError: expected `:`. Add the colon at the end of the `if` line.'
              },
              {
                label: 'Missing indent', expectError: true, code: C`
              age = 17
              if age >= 16:
              print("Allowed")
            `, caption: 'IndentationError: the block under `if` must be indented.'
              },
              {
                label: 'Inconsistent indent', expectError: true, code: C`
              age = 17
              if age >= 16:
                  print("Allowed")
                print("Welcome")
            `, caption: 'Lines in the same block must line up exactly.'
              },
              {
                label: 'else needs an if', expectError: true, code: C`
              age = 17
              else:
                  print("Too young")
            `, caption: '`else` cannot start a decision. It always belongs to an `if` above it.'
              },
              {
                label: 'Logic mistake: = for ==', expectError: true, code: C`
              password = "abc"
              if password = "abc":
                  print("ok")
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'An `if` whose block would be empty is an error. If you really need a placeholder while writing a program, use the word `pass` inside the block.' },

          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode writes the same decision as:<pre>IF mark ≥ 50 THEN\n    SEND "Pass" TO DISPLAY\nELSE\n    SEND "Fail" TO DISPLAY\nEND IF</pre>The Python version has a colon instead of `THEN`, indentation instead of `END IF`, and `print` instead of `SEND ... TO DISPLAY`. Exams often give you the pseudocode or a flowchart and ask you to write the Python, so learn to translate both ways. In a flowchart the decision is a **diamond** with a Yes and a No arrow.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Which branch runs?', code: C`
            x = 8
            if x > 10:
                print("big")
            else:
                print("small")
            print("done")
          `, rows: 2, why: '8 is not greater than 10, so the `else` block runs. The last print is outside the `if` so it always runs.'
          },
          {
            t: 'predict', title: 'Two ifs in a row', code: C`
            n = 6
            if n > 3:
                print("A")
            if n > 5:
                print("B")
            else:
                print("C")
            print("D")
          `, rows: 3, why: 'The two `if` statements are independent. The first prints A, the second prints B (its `else` does not run).'
          },
          { t: 'quiz', q: 'How many lines can an <code>if / else</code> block print from its two branches combined, in a single run?', options: ['Only the lines from one branch', 'Both branches always run', 'Neither runs if the condition is False', 'It depends on indentation only'], answer: 0, why: 'Exactly one branch runs: the `if` block when the condition is True, otherwise the `else` block.' },
          {
            t: 'parsons', title: 'Build the decision', prompt: 'Put the lines in order to ask for a score and print <em>Well done</em> if it is at least 40, otherwise <em>Try again</em>.', lines: [
              'score = int(input("Score: "))',
              'if score >= 40:',
              '    print("Well done")',
              'else:',
              '    print("Try again")',
            ], why: 'Input first, then the `if` line, its indented block, then `else` lined up with `if`.'
          },

          {
            t: 'exercise', id: 'm02-ex-login', title: 'Password check', level: 1,
            prompt: 'Read a password. If it is exactly <code>blue42</code> print <code>Welcome</code>, otherwise print <code>Wrong password</code>.',
            starter: C`
              password = input("Password: ")
            `,
            solution: C`
              password = input("Password: ")
              if password == "blue42":
                  print("Welcome")
              else:
                  print("Wrong password")
            `,
            tests: [{ in: ['blue42'], out: 'Welcome' }, { in: ['red7'], out: 'Wrong password' }, { in: ['Blue42'], out: 'Wrong password', hidden: true }],
            hints: ['Compare with `==`, and remember the colon after the condition.', 'Capital letters count, so `Blue42` is wrong.']
          },
          {
            t: 'exercise', id: 'm02-ex-delivery', title: 'Delivery charge', level: 2,
            prompt: 'A shop gives free delivery on orders of 50 or more. Read the order total (whole number). Print <code>Free delivery</code> if the total is 50 or more, otherwise print <code>Delivery: 4</code>.',
            starter: C`
              total = int(input("Order total: "))
            `,
            solution: C`
              total = int(input("Order total: "))
              if total >= 50:
                  print("Free delivery")
              else:
                  print("Delivery: 4")
            `,
            tests: [{ in: ['60'], out: 'Free delivery' }, { in: ['50'], out: 'Free delivery' }, { in: ['49'], out: 'Delivery: 4', hidden: true }],
            hints: ['The boundary matters: 50 itself gets free delivery, so use `>=`.']
          },
          {
            t: 'exercise', id: 'm02-ex-debug-age', kind: 'debug', title: 'Three errors in a decision', level: 2,
            prompt: 'This program should print <code>Adult</code> if the age is 18 or more, otherwise <code>Under 18</code>. There are <strong>three</strong> errors. Find and fix them all.',
            starter: C`
              age = int(input("Age: "))
              if age = 18:
              print("Adult")
              else
                  print("Under 18")
            `,
            solution: C`
              age = int(input("Age: "))
              if age >= 18:
                  print("Adult")
              else:
                  print("Under 18")
            `,
            tests: [{ in: ['18'], out: 'Adult' }, { in: ['17'], out: 'Under 18' }, { in: ['40'], out: 'Adult', hidden: true }],
            hints: ['Look at line 2: `=` stores a value, and 18 itself must count as an adult.', 'A line that follows `if ...:` must be indented.', 'Check the end of the `else` line.']
          },
          {
            t: 'exercise', id: 'm02-ex-withdraw', kind: 'exam', title: 'Cash machine', level: 3,
            prompt: 'A customer has a balance of 250. Read the amount they want to withdraw. If the amount is more than the balance, print <code>Insufficient funds</code>. Otherwise print <code>New balance:</code> followed by the balance left (for example <code>New balance: 150</code>).',
            starter: C`
              balance = 250
              amount = int(input("Amount: "))
            `,
            solution: C`
              balance = 250
              amount = int(input("Amount: "))
              if amount > balance:
                  print("Insufficient funds")
              else:
                  print("New balance:", balance - amount)
            `,
            tests: [{ in: ['100'], out: 'New balance: 150' }, { in: ['250'], out: 'New balance: 0' }, { in: ['251'], out: 'Insufficient funds' }, { in: ['0'], out: 'New balance: 250', hidden: true }],
            hints: ['Withdrawing exactly the whole balance is allowed.', 'Compare with `>` so that 250 itself goes to the `else` branch.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'elif-chains',
        title: 'elif: more than two choices',
        time: '30 min',
        book: 'Ch 2 · p.60-62',
        exam: 'Paper 2 Q2-Q5',
        summary: 'elif chains, order matters, if vs elif, no else',
        intro: 'Real decisions often have three, four or more outcomes: grade boundaries, ticket prices, traffic lights. An `elif` chain tests conditions one after another and runs only the first one that is True.',
        blocks: [
          { t: 'h', text: 'The elif chain' },
          { t: 'p', html: '`elif` means "else, if". Python checks the conditions **from the top**. The first True condition wins, its block runs, and the **rest of the chain is skipped**. If none are True, the final `else` (if there is one) runs.' },
          {
            t: 'code', title: 'grades.py', stdin: ['72'], code: C`
            mark = int(input("Mark: "))
            if mark >= 80:
                print("Grade A")
            elif mark >= 60:
                print("Grade B")
            elif mark >= 40:
                print("Grade C")
            else:
                print("Grade D")
          `, caption: 'Press **Trace**: with 72, the first test fails, the second passes, and Python never looks at the third.'
          },
          {
            t: 'cases', title: 'Same program, every outcome', items: [
              {
                label: 'Top band', stdin: ['95'], code: C`
              mark = int(input("Mark: "))
              if mark >= 80:
                  print("Grade A")
              elif mark >= 60:
                  print("Grade B")
              elif mark >= 40:
                  print("Grade C")
              else:
                  print("Grade D")
            ` },
              {
                label: 'Middle band', stdin: ['45'], code: C`
              mark = int(input("Mark: "))
              if mark >= 80:
                  print("Grade A")
              elif mark >= 60:
                  print("Grade B")
              elif mark >= 40:
                  print("Grade C")
              else:
                  print("Grade D")
            ` },
              {
                label: 'Exactly on a boundary', stdin: ['60'], code: C`
              mark = int(input("Mark: "))
              if mark >= 80:
                  print("Grade A")
              elif mark >= 60:
                  print("Grade B")
              elif mark >= 40:
                  print("Grade C")
              else:
                  print("Grade D")
            `, caption: 'With `>=`, 60 belongs to the band that starts at 60.'
              },
              {
                label: 'Falls through to else', stdin: ['12'], code: C`
              mark = int(input("Mark: "))
              if mark >= 80:
                  print("Grade A")
              elif mark >= 60:
                  print("Grade B")
              elif mark >= 40:
                  print("Grade C")
              else:
                  print("Grade D")
            ` },
              {
                label: 'No else at all', intro: '`else` is optional. If nothing matches, nothing prints.', stdin: ['5'], code: C`
              mark = int(input("Mark: "))
              if mark >= 80:
                  print("Grade A")
              elif mark >= 60:
                  print("Grade B")
              elif mark >= 40:
                  print("Grade C")
              print("Report finished")
            ` },
            ]
          },

          { t: 'h', text: 'Order matters' },
          { t: 'p', html: 'Because the first True condition wins, the order of the tests is part of the logic. Here the tests are written the wrong way round. A mark of 95 passes `mark >= 40` straight away, so it is told it got a C.' },
          {
            t: 'cases', title: 'Right order and wrong order', items: [
              {
                label: 'Wrong order', stdin: ['95'], code: C`
              mark = int(input("Mark: "))
              if mark >= 40:
                  print("Grade C")
              elif mark >= 60:
                  print("Grade B")
              elif mark >= 80:
                  print("Grade A")
              else:
                  print("Grade D")
            `, caption: 'No error message. This is a **logic error**. The lower tests can never be reached.'
              },
              {
                label: 'Right order (high to low)', stdin: ['95'], code: C`
              mark = int(input("Mark: "))
              if mark >= 80:
                  print("Grade A")
              elif mark >= 60:
                  print("Grade B")
              elif mark >= 40:
                  print("Grade C")
              else:
                  print("Grade D")
            ` },
              {
                label: 'Low to high also works', intro: 'You can go the other way, if you flip the operator. Just stay consistent.', stdin: ['95'], code: C`
              mark = int(input("Mark: "))
              if mark < 40:
                  print("Grade D")
              elif mark < 60:
                  print("Grade C")
              elif mark < 80:
                  print("Grade B")
              else:
                  print("Grade A")
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'With `>=` tests, list the **largest** limit first. With `<` or `<=` tests, list the **smallest** limit first. Then each `elif` already knows the earlier ones failed, so you do not have to write `mark < 80 and mark >= 60`.' },

          { t: 'h', text: 'elif is not the same as a row of ifs' },
          { t: 'p', html: 'A chain of `elif` stops at the first match. A row of separate `if` statements checks **every** condition independently, so several blocks can run.' },
          {
            t: 'cases', title: 'elif chain vs separate ifs', items: [
              {
                label: 'elif chain', stdin: ['90'], code: C`
              score = int(input("Score: "))
              if score >= 50:
                  print("Passed")
              elif score >= 80:
                  print("Distinction")
              else:
                  print("Failed")
            `, caption: 'Only one line prints, and it is not even the best answer. (The order is also wrong!)'
              },
              {
                label: 'Separate ifs', stdin: ['90'], code: C`
              score = int(input("Score: "))
              if score >= 50:
                  print("Passed")
              if score >= 80:
                  print("Distinction")
              if score < 50:
                  print("Failed")
            `, caption: 'Both Passed and Distinction print. Separate `if`s are right when several things can be true at the same time.'
              },
              {
                label: 'Spot the else trap', stdin: ['90'], code: C`
              score = int(input("Score: "))
              if score >= 50:
                  print("Passed")
              if score >= 80:
                  print("Distinction")
              else:
                  print("Failed")
            `, caption: '`else` attaches only to the **last** `if`, so 90 prints Passed and Distinction, but 60 prints Passed and Failed. A bug!'
              },
            ]
          },

          { t: 'h', text: 'Exam wording' },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode has no `ELIF` keyword. A multi-way decision is written with <code>ELSE IF</code>, or by nesting a second <code>IF</code> inside <code>ELSE</code>:<pre>IF mark ≥ 80 THEN\n    SEND "A" TO DISPLAY\nELSE IF mark ≥ 60 THEN\n    SEND "B" TO DISPLAY\nELSE\n    SEND "C" TO DISPLAY\nEND IF</pre>Marks in the exam go for: the correct conditions, boundaries on the correct side, the correct order, and correct outputs in each branch.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'First match wins', code: C`
            n = 15
            if n > 20:
                print("A")
            elif n > 10:
                print("B")
            elif n > 5:
                print("C")
            else:
                print("D")
          `, rows: 1, why: '15 is not above 20. It is above 10, so B prints and the rest is skipped, even though `n > 5` is also True.'
          },
          {
            t: 'predict', title: 'Separate ifs', code: C`
            n = 15
            if n > 10:
                print("A")
            if n > 5:
                print("B")
            elif n > 100:
                print("C")
            else:
                print("D")
          `, rows: 2, why: 'The first `if` prints A. The second chain starts fresh: `n > 5` is True so B prints and the rest of that chain is skipped.'
          },
          {
            t: 'quiz', q: 'In this code, what is printed when <code>temp</code> is 25?', code: C`
            if temp > 30:
                print("Hot")
            elif temp > 15:
                print("Warm")
            elif temp > 0:
                print("Cool")
            else:
                print("Freezing")
          `, options: ['Hot', 'Warm', 'Cool', 'Warm and Cool'], answer: 1, why: '25 is not above 30, but is above 15, so Warm prints. The chain then stops.'
          },
          { t: 'quiz', q: 'A program tests <code>mark >= 40</code> first, then <code>mark >= 60</code>, then <code>mark >= 80</code>. What is the fault?', options: ['Syntax error on line 1', 'Every mark of 40 or more matches the first test, so the later tests are never reached', 'The program crashes at run time', 'There is no fault'], answer: 1, why: 'It is a logic error caused by the order of the conditions.' },
          {
            t: 'parsons', title: 'Ticket prices', prompt: 'Arrange the lines so that under 5 is free, under 18 is child, and everyone else pays adult price.', lines: [
              'age = int(input("Age: "))',
              'if age < 5:',
              '    print("Free")',
              'elif age < 18:',
              '    print("Child")',
              'else:',
              '    print("Adult")',
            ], why: 'Smallest limit first, because each `<` test relies on the earlier ones having failed.'
          },

          {
            t: 'exercise', id: 'm02-ex-grade', title: 'Grade letter', level: 1,
            prompt: 'Read a mark from 0 to 100. Print <code>A</code> for 70 or more, <code>B</code> for 55 to 69, <code>C</code> for 40 to 54, otherwise <code>D</code>.',
            starter: C`
              mark = int(input("Mark: "))
            `,
            solution: C`
              mark = int(input("Mark: "))
              if mark >= 70:
                  print("A")
              elif mark >= 55:
                  print("B")
              elif mark >= 40:
                  print("C")
              else:
                  print("D")
            `,
            tests: [{ in: ['85'], out: 'A' }, { in: ['70'], out: 'A' }, { in: ['69'], out: 'B' }, { in: ['55'], out: 'B' }, { in: ['40'], out: 'C' }, { in: ['39'], out: 'D', hidden: true }],
            requires: [{ re: '\\belif\\b', msg: 'Use `elif`.' }],
            hints: ['Start with the highest boundary, 70.', 'Each `elif` only needs one condition.']
          },
          {
            t: 'exercise', id: 'm02-ex-weather', title: 'Weather report', level: 2,
            prompt: 'Read a temperature (whole number). Print <code>Freezing</code> below 0, <code>Cold</code> below 10, <code>Mild</code> below 20, <code>Warm</code> below 30, otherwise <code>Hot</code>.',
            starter: C`
              temp = int(input("Temperature: "))
            `,
            solution: C`
              temp = int(input("Temperature: "))
              if temp < 0:
                  print("Freezing")
              elif temp < 10:
                  print("Cold")
              elif temp < 20:
                  print("Mild")
              elif temp < 30:
                  print("Warm")
              else:
                  print("Hot")
            `,
            tests: [{ in: ['-5'], out: 'Freezing' }, { in: ['0'], out: 'Cold' }, { in: ['10'], out: 'Mild' }, { in: ['29'], out: 'Warm' }, { in: ['30'], out: 'Hot' }, { in: ['19'], out: 'Mild', hidden: true }],
            hints: ['These all use `<`, so go from the smallest limit upward.', '0 itself is not below 0, so it is Cold.']
          },
          {
            t: 'exercise', id: 'm02-ex-ticket', title: 'Cinema ticket', level: 2,
            prompt: 'Read an age. Print the price: <code>Free</code> for under 5, <code>Child: 4</code> for 5 to 15, <code>Adult: 8</code> for 16 to 64, and <code>Senior: 5</code> for 65 or over.',
            starter: C`
              age = int(input("Age: "))
            `,
            solution: C`
              age = int(input("Age: "))
              if age < 5:
                  print("Free")
              elif age <= 15:
                  print("Child: 4")
              elif age <= 64:
                  print("Adult: 8")
              else:
                  print("Senior: 5")
            `,
            tests: [{ in: ['4'], out: 'Free' }, { in: ['5'], out: 'Child: 4' }, { in: ['15'], out: 'Child: 4' }, { in: ['16'], out: 'Adult: 8' }, { in: ['64'], out: 'Adult: 8' }, { in: ['65'], out: 'Senior: 5', hidden: true }],
            hints: ['Write the bands as upper limits: under 5, up to 15, up to 64.', 'The last band does not need a condition, so use `else`.']
          },
          {
            t: 'exercise', id: 'm02-ex-speeding', kind: 'exam', title: 'Speed camera', level: 3,
            prompt: 'The speed limit is 30. Read a speed (whole number) and print: <code>No offence</code> if 30 or under; <code>Warning</code> if 1 to 10 over the limit; <code>Fine: 60</code> if 11 to 20 over; <code>Court</code> if more than 20 over.',
            starter: C`
              speed = int(input("Speed: "))
            `,
            solution: C`
              speed = int(input("Speed: "))
              over = speed - 30
              if over <= 0:
                  print("No offence")
              elif over <= 10:
                  print("Warning")
              elif over <= 20:
                  print("Fine: 60")
              else:
                  print("Court")
            `,
            tests: [{ in: ['25'], out: 'No offence' }, { in: ['30'], out: 'No offence' }, { in: ['31'], out: 'Warning' }, { in: ['40'], out: 'Warning' }, { in: ['41'], out: 'Fine: 60' }, { in: ['50'], out: 'Fine: 60' }, { in: ['51'], out: 'Court', hidden: true }],
            hints: ['Work out how far over the limit the speed is first: `speed - 30`.', 'Then use an `elif` chain on that number, going from smallest to largest.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'logical-operators',
        title: 'and, or, not',
        time: '35 min',
        book: 'Ch 2 · p.63-66',
        exam: 'Paper 2 Q2-Q6',
        summary: 'Truth tables, precedence, ranges, in / not in, De Morgan',
        intro: 'Real conditions are rarely one comparison. "Old enough and tall enough", "a weekend or a holiday", "not the right password". Logical operators join conditions together.',
        blocks: [
          { t: 'h', text: 'The three logical operators' },
          {
            t: 'table', head: ['Operator', 'Result is True when...', 'Example'], rows: [
              ['`and`', '**both** sides are True', '`age >= 12 and height >= 140`'],
              ['`or`', '**at least one** side is True', '`day == "Sat" or day == "Sun"`'],
              ['`not`', 'the condition is **False** (it flips the answer)', '`not (score > 50)`'],
            ]
          },
          { t: 'h2', text: 'Truth tables' },
          { t: 'p', html: 'A **truth table** lists every combination of inputs. With two conditions, `A` and `B`, there are four rows.' },
          {
            t: 'table', head: ['A', 'B', 'A and B', 'A or B'], rows: [
              ['True', 'True', 'True', 'True'],
              ['True', 'False', 'False', 'True'],
              ['False', 'True', 'False', 'True'],
              ['False', 'False', 'False', 'False'],
            ]
          },
          { t: 'table', head: ['A', 'not A'], rows: [['True', 'False'], ['False', 'True']] },
          {
            t: 'cases', title: 'and, or, not in code', items: [
              {
                label: 'and', intro: 'Both parts must be True.', stdin: ['13', '150'], code: C`
              age = int(input("Age: "))
              height = int(input("Height in cm: "))
              if age >= 12 and height >= 140:
                  print("You can ride")
              else:
                  print("Sorry, not this time")
            ` },
              {
                label: 'and (one part fails)', stdin: ['13', '130'], code: C`
              age = int(input("Age: "))
              height = int(input("Height in cm: "))
              if age >= 12 and height >= 140:
                  print("You can ride")
              else:
                  print("Sorry, not this time")
            ` },
              {
                label: 'or', intro: 'Only one part needs to be True.', stdin: ['Sun'], code: C`
              day = input("Day: ")
              if day == "Sat" or day == "Sun":
                  print("Weekend")
              else:
                  print("Weekday")
            ` },
              {
                label: 'not', stdin: ['3'], code: C`
              tries = int(input("Tries used: "))
              if not (tries >= 3):
                  print("You may try again")
              else:
                  print("Locked")
            `, caption: '`not (tries >= 3)` means the same as `tries < 3`. Often the plain comparison reads better.'
              },
              {
                label: 'Print the bool itself', code: C`
              a = True
              b = False
              print(a and b)
              print(a or b)
              print(not a)
              print(not b)
            ` },
            ]
          },

          { t: 'h', text: 'Precedence and brackets' },
          { t: 'p', html: 'When several operators appear together, Python works in this order: **`not`** first, then **`and`**, then **`or`**. Brackets override everything. When in doubt, add brackets: they cost nothing and make your meaning clear.' },
          {
            t: 'cases', title: 'Order of evaluation', items: [
              {
                label: 'and before or', code: C`
              print(True or False and False)
              print((True or False) and False)
            `, caption: 'First line: `False and False` is done first, giving `True or False`, which is True. Second line: the bracket is done first.'
              },
              {
                label: 'not first', code: C`
              print(not True and False)
              print(not (True and False))
            `, caption: 'Line 1: `not True` is False, then `False and False`. Line 2: bracket first, giving `not False`.'
              },
              {
                label: 'In a real condition', stdin: ['10', 'no'], code: C`
              age = int(input("Age: "))
              with_adult = input("With an adult (yes/no): ")
              if age >= 15 or age >= 12 and with_adult == "yes":
                  print("Film allowed")
              else:
                  print("Film not allowed")
            `, caption: 'Python reads this as `age >= 15 or (age >= 12 and with_adult == "yes")`.'
              },
              {
                label: 'Same, with brackets that change it', stdin: ['10', 'no'], code: C`
              age = int(input("Age: "))
              with_adult = input("With an adult (yes/no): ")
              if (age >= 15 or age >= 12) and with_adult == "yes":
                  print("Film allowed")
              else:
                  print("Film not allowed")
            `, caption: 'Different brackets, different rule. Always check the bracket placement.'
              },
            ]
          },

          { t: 'h', text: 'Testing a range' },
          { t: 'p', html: 'To check that a number lies between two limits, both conditions must be True, so join them with `and`. Python also lets you chain the comparisons, which is neater.' },
          {
            t: 'cases', title: 'Is it between 1 and 100?', items: [
              {
                label: 'With and', stdin: ['57'], code: C`
              number = int(input("Number: "))
              if number >= 1 and number <= 100:
                  print("In range")
              else:
                  print("Out of range")
            ` },
              {
                label: 'Chained comparison', stdin: ['57'], code: C`
              number = int(input("Number: "))
              if 1 <= number <= 100:
                  print("In range")
              else:
                  print("Out of range")
            ` },
              {
                label: 'Outside the range (or)', intro: 'To test for being **outside**, use `or`: it is either too small or too large.', stdin: ['101'], code: C`
              number = int(input("Number: "))
              if number < 1 or number > 100:
                  print("Invalid")
              else:
                  print("Valid")
            ` },
              {
                label: 'Wrong: and for outside', stdin: ['101'], code: C`
              number = int(input("Number: "))
              if number < 1 and number > 100:
                  print("Invalid")
              else:
                  print("Valid")
            `, caption: 'No number can be below 1 **and** above 100 at once, so `Invalid` can never print. Logic error.'
              },
            ]
          },

          { t: 'h', text: 'The x == 1 or 2 bug' },
          { t: 'p', html: 'In English you say "if x is 1 or 2". In Python each side of `or` must be a **complete** condition. `x == 1 or 2` is read as `(x == 1) or (2)`, and any non-zero number counts as True.' },
          {
            t: 'cases', title: 'A famous mistake', items: [
              {
                label: 'The bug', stdin: ['7'], code: C`
              x = int(input("Number: "))
              if x == 1 or 2:
                  print("Matched")
              else:
                  print("No match")
            `, caption: '7 matches! No error message, just a wrong answer.'
              },
              {
                label: 'Fix 1: repeat the variable', stdin: ['7'], code: C`
              x = int(input("Number: "))
              if x == 1 or x == 2:
                  print("Matched")
              else:
                  print("No match")
            ` },
              {
                label: 'Fix 2: use in', stdin: ['7'], code: C`
              x = int(input("Number: "))
              if x in (1, 2):
                  print("Matched")
              else:
                  print("No match")
            ` },
            ]
          },

          { t: 'h', text: 'in and not in' },
          { t: 'p', html: '`in` asks "is this item found inside that collection?". It works on text (is this piece inside the string?) and on lists. It gives True or False. `not in` is the opposite.' },
          {
            t: 'cases', title: 'Membership tests', items: [
              {
                label: 'Letter in a string', code: C`
              print("a" in "banana")
              print("z" in "banana")
              print("nan" in "banana")
              print("z" not in "banana")
            ` },
              {
                label: 'Is it a vowel?', stdin: ['e'], code: C`
              letter = input("Letter: ")
              if letter in "aeiou":
                  print("vowel")
              else:
                  print("not a vowel")
            ` },
              {
                label: 'In a list', intro: 'A **list** is several values in square brackets. For now you only need to know that `in` can check one.', stdin: ['Sat'], code: C`
              day = input("Day: ")
              if day in ["Sat", "Sun"]:
                  print("Weekend")
              else:
                  print("Weekday")
            ` },
              {
                label: 'Case matters', code: C`
              print("A" in "banana")
              print("A".lower() in "banana")
            ` },
              {
                label: 'Beware: empty text', code: C`
              print("" in "banana")
            `, caption: 'The empty string is inside every string, so checking a vowel with `in "aeiou"` accepts an empty input. Check the length too when it matters.'
              },
            ]
          },

          { t: 'h', text: 'De Morgan: flipping a condition' },
          { t: 'p', html: 'When you negate a joined condition, `and` becomes `or` (and the other way round) and each comparison is reversed. These pairs are always equal:' },
          {
            t: 'table', head: ['Original', 'Equivalent'], rows: [
              ['`not (a and b)`', '`(not a) or (not b)`'],
              ['`not (a or b)`', '`(not a) and (not b)`'],
              ['`not (age >= 12 and height >= 140)`', '`age < 12 or height < 140`'],
              ['`not (x > 0 or y > 0)`', '`x <= 0 and y <= 0`'],
            ]
          },
          {
            t: 'code', title: 'Check De Morgan yourself', code: C`
            for a in (True, False):
                for b in (True, False):
                    print(a, b, not (a and b) == ((not a) or (not b)))
          `, caption: 'Every row is True, so the two forms always agree. (Loops come in the next module.)'
          },

          { t: 'note', kind: 'exam', html: 'Edexcel uses <code>AND</code>, <code>OR</code> and <code>NOT</code> in pseudocode: <pre>IF age ≥ 12 AND height ≥ 140 THEN</pre> A common question: <em>complete the truth table</em> for a two-input expression. Work column by column, and use brackets to show your order. Python writes these in lower case.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Logical operators', code: C`
            a = 5
            b = 12
            print(a > 3 and b > 20)
            print(a > 3 or b > 20)
            print(not (a > 3))
            print(a < 10 and not b == 12)
          `, rows: 4, why: 'Line 1: True and False. Line 2: True or False. Line 3: not True. Line 4: True and (not True).'
          },
          {
            t: 'predict', title: 'Precedence', code: C`
            print(True or False and False)
            print(not True or True)
          `, rows: 2, why: '`and` is done before `or`, and `not` before both.'
          },
          { t: 'quiz', q: 'Which condition is True only for a mark from 40 to 100 inclusive?', options: ['mark >= 40 or mark <= 100', 'mark >= 40 and mark <= 100', 'mark > 40 and mark < 100', 'mark >= 40 and mark >= 100'], answer: 1, why: 'Both limits must hold, so use `and`, and keep the `=` so 40 and 100 are included.' },
          { t: 'quiz', q: 'Tick **all** the conditions that are equal to <code>not (x > 5 and y > 5)</code>.', options: ['x <= 5 or y <= 5', 'x <= 5 and y <= 5', 'not (x > 5) or not (y > 5)', 'x < 5 or y < 5'], answer: [0, 2], why: 'De Morgan: `and` becomes `or` and each comparison is reversed. The last option is wrong when x is exactly 5.' },
          {
            t: 'sort', prompt: 'Which is the correct way to write each idea? Choose "Works" or "Bug".', cats: ['Works', 'Bug'], items: [
              { text: '<code>if x == 3 or x == 4:</code>', cat: 0 },
              { text: '<code>if x == 3 or 4:</code>', cat: 1 },
              { text: '<code>if 0 <= x <= 10:</code>', cat: 0 },
              { text: '<code>if x < 0 and x > 10:</code> (meaning "outside 0 to 10")', cat: 1 },
              { text: '<code>if ch in "aeiou":</code>', cat: 0 },
              { text: '<code>if x > 5 and < 10:</code>', cat: 1 },
            ], why: 'Each side of `and` / `or` must be a complete comparison, and "outside a range" needs `or`.'
          },

          {
            t: 'exercise', id: 'm02-ex-valid-mark', title: 'Valid mark', level: 1,
            prompt: 'Read a whole number. Print <code>Valid</code> if it is from 0 to 100 inclusive, otherwise print <code>Invalid</code>.',
            starter: C`
              mark = int(input("Mark: "))
            `,
            solution: C`
              mark = int(input("Mark: "))
              if mark >= 0 and mark <= 100:
                  print("Valid")
              else:
                  print("Invalid")
            `,
            tests: [{ in: ['50'], out: 'Valid' }, { in: ['0'], out: 'Valid' }, { in: ['100'], out: 'Valid' }, { in: ['-1'], out: 'Invalid' }, { in: ['101'], out: 'Invalid', hidden: true }],
            hints: ['Both limits must be satisfied, so use `and`.', 'The limits 0 and 100 are valid, so use `>=` and `<=`.']
          },
          {
            t: 'exercise', id: 'm02-ex-vowel', title: 'Vowel or consonant', level: 1,
            prompt: 'Read one lower-case letter. Print <code>vowel</code> if it is a, e, i, o or u, otherwise <code>consonant</code>. Use <code>in</code>.',
            starter: C`
              letter = input("Letter: ")
            `,
            solution: C`
              letter = input("Letter: ")
              if letter in "aeiou":
                  print("vowel")
              else:
                  print("consonant")
            `,
            tests: [{ in: ['a'], out: 'vowel' }, { in: ['u'], out: 'vowel' }, { in: ['k'], out: 'consonant' }, { in: ['z'], out: 'consonant', hidden: true }],
            requires: [{ re: '\\bin\\b', msg: 'Use the `in` operator.' }],
            hints: ['`letter in "aeiou"` is True for a vowel.']
          },
          {
            t: 'exercise', id: 'm02-ex-ride', title: 'Theme park ride', level: 2,
            prompt: 'A ride lets you on if you are at least 12 years old <strong>and</strong> at least 140 cm tall, <strong>or</strong> if you are with a carer. Read the age, the height (both whole numbers) and then <code>yes</code> or <code>no</code> for "with a carer". Print <code>Allowed</code> or <code>Not allowed</code>.',
            starter: C`
              age = int(input("Age: "))
              height = int(input("Height: "))
              carer = input("With a carer (yes/no): ")
            `,
            solution: C`
              age = int(input("Age: "))
              height = int(input("Height: "))
              carer = input("With a carer (yes/no): ")
              if (age >= 12 and height >= 140) or carer == "yes":
                  print("Allowed")
              else:
                  print("Not allowed")
            `,
            tests: [{ in: ['13', '150', 'no'], out: 'Allowed' }, { in: ['13', '130', 'no'], out: 'Not allowed' }, { in: ['9', '120', 'yes'], out: 'Allowed' }, { in: ['12', '140', 'no'], out: 'Allowed' }, { in: ['11', '160', 'no'], out: 'Not allowed', hidden: true }],
            hints: ['The "and" part belongs together in brackets.', 'Join the bracket and the carer test with `or`.']
          },
          {
            t: 'exercise', id: 'm02-ex-demorgan', title: 'Flip the rule', level: 3,
            prompt: 'The program below prints <code>Entry</code> when a person is allowed in. Allowed means: age at least 16 and a ticket (<code>yes</code>). Rewrite the <strong>condition</strong> so that it describes a person who is <em>refused</em>, using <code>or</code> and no <code>not</code> (apply De Morgan), and print <code>Refused</code> for them; otherwise print <code>Entry</code>.',
            starter: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age >= 16 and ticket == "yes":
                  print("Entry")
              else:
                  print("Refused")
            `,
            solution: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age < 16 or ticket != "yes":
                  print("Refused")
              else:
                  print("Entry")
            `,
            tests: [{ in: ['20', 'yes'], out: 'Entry' }, { in: ['15', 'yes'], out: 'Refused' }, { in: ['30', 'no'], out: 'Refused' }, { in: ['16', 'yes'], out: 'Entry', hidden: true }],
            requires: [{ re: 'if\\s+[^\\n]*\\bor\\b[^\\n]*:\\s*\\n\\s*print\\(\\s*["\']Refused', msg: 'The `if` condition must use `or` and its block must print `Refused`.' }, { re: '\\bnot\\b', not: true, msg: 'Do not use `not`; reverse each comparison instead.' }],
            hints: ['Reverse each comparison: `>=` becomes `<`, and `==` becomes `!=`.', 'Change `and` to `or`, then swap which message goes where.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'nested-if',
        title: 'Nested decisions',
        time: '30 min',
        book: 'Ch 2 · p.62',
        exam: 'Paper 2 Q3-Q6',
        summary: 'if inside if, nested vs and, indentation levels',
        intro: 'Sometimes a second question only makes sense after the first is answered: "Are you logged in? If so, do you have enough credit?". You put one `if` inside another.',
        blocks: [
          { t: 'h', text: 'An if inside an if' },
          { t: 'p', html: 'A **nested** `if` is indented one level further than the `if` that contains it. The inner decision is reached only when the outer condition is True. Each extra level means 4 more spaces.' },
          {
            t: 'code', title: 'nested.py', stdin: ['17', 'yes'], code: C`
            age = int(input("Age: "))
            if age >= 17:
                test = input("Passed the test (yes/no): ")
                if test == "yes":
                    print("Licence issued")
                else:
                    print("Come back after passing the test")
            else:
                print("Too young to apply")
          `, caption: 'Use **Trace** to follow the path. Notice that the inner question is never asked when the age is under 17.'
          },
          {
            t: 'cases', title: 'Every path through the program', items: [
              {
                label: 'Too young', stdin: ['15'], code: C`
              age = int(input("Age: "))
              if age >= 17:
                  test = input("Passed the test (yes/no): ")
                  if test == "yes":
                      print("Licence issued")
                  else:
                      print("Come back after passing the test")
              else:
                  print("Too young to apply")
            ` },
              {
                label: 'Old enough, failed', stdin: ['18', 'no'], code: C`
              age = int(input("Age: "))
              if age >= 17:
                  test = input("Passed the test (yes/no): ")
                  if test == "yes":
                      print("Licence issued")
                  else:
                      print("Come back after passing the test")
              else:
                  print("Too young to apply")
            ` },
              {
                label: 'Old enough, passed', stdin: ['18', 'yes'], code: C`
              age = int(input("Age: "))
              if age >= 17:
                  test = input("Passed the test (yes/no): ")
                  if test == "yes":
                      print("Licence issued")
                  else:
                      print("Come back after passing the test")
              else:
                  print("Too young to apply")
            ` },
              {
                label: 'elif inside a block', stdin: ['Asha', '66'], code: C`
              name = input("Name: ")
              if name == "Asha":
                  score = int(input("Score: "))
                  if score >= 90:
                      print("Gold")
                  elif score >= 60:
                      print("Silver")
                  else:
                      print("Bronze")
              else:
                  print("Unknown player")
            ` },
            ]
          },

          { t: 'h', text: 'Nested or combined with and?' },
          { t: 'p', html: 'If the inner decision has no extra work and no separate message, a nested `if` can usually be replaced by a single `if` with `and`. Both are correct; the single-line version is shorter.' },
          {
            t: 'cases', title: 'Two ways to write the same rule', items: [
              {
                label: 'Nested', stdin: ['14', 'yes'], code: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age >= 13:
                  if ticket == "yes":
                      print("Come in")
            ` },
              {
                label: 'Combined with and', stdin: ['14', 'yes'], code: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age >= 13 and ticket == "yes":
                  print("Come in")
            ` },
              {
                label: 'When nesting is needed', intro: 'Different messages for different failures need nesting, because a single `and` cannot tell you which part failed.', stdin: ['14', 'no'], code: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age >= 13:
                  if ticket == "yes":
                      print("Come in")
                  else:
                      print("You need a ticket")
              else:
                  print("You are too young")
            ` },
            ]
          },
          { t: 'h2', text: 'Where does the else belong?' },
          { t: 'p', html: 'An `else` belongs to the `if` that is indented **exactly the same amount**. Moving it one level changes which condition it answers.' },
          {
            t: 'cases', title: 'Same lines, different indentation', items: [
              {
                label: 'else lined up with the inner if', stdin: ['20', 'no'], code: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age >= 13:
                  if ticket == "yes":
                      print("Come in")
                  else:
                      print("Ticket needed")
            `, caption: 'The `else` answers the ticket question.'
              },
              {
                label: 'else lined up with the outer if', stdin: ['20', 'no'], code: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age >= 13:
                  if ticket == "yes":
                      print("Come in")
              else:
                  print("Ticket needed")
            `, caption: 'Now the `else` answers the age question, so a 20-year-old without a ticket gets no message at all, and a 10-year-old is told they need a ticket.'
              },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Keep nesting shallow. More than two or three levels deep is hard to read; look for ways to join conditions with `and` or to use an `elif` chain instead.' },
          { t: 'note', kind: 'exam', html: 'Pseudocode nests with indentation and several <code>END IF</code> lines, one per <code>IF</code>:<pre>IF age ≥ 17 THEN\n    IF test = "yes" THEN\n        SEND "Licence issued" TO DISPLAY\n    END IF\nEND IF</pre>In Python the end of each block is shown only by the indentation, so count your indents carefully.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Trace the nest', code: C`
            a = 8
            b = 3
            if a > 5:
                if b > 5:
                    print("X")
                else:
                    print("Y")
            else:
                print("Z")
          `, rows: 1, why: '`a > 5` is True, so the inner `if` runs. `b > 5` is False, so its `else` prints Y.'
          },
          {
            t: 'predict', title: 'else on the outer level', code: C`
            a = 8
            b = 3
            if a > 5:
                if b > 5:
                    print("X")
            else:
                print("Z")
            print("end")
          `, rows: 1, why: 'The outer `if` is True. The inner one is False and has no `else`, so nothing prints there. The outer `else` is skipped. Only `end` prints.'
          },
          { t: 'quiz', q: 'Which single condition is equal to the nested decision <code>if a > 0:</code> then <code>if b > 0:</code> with one shared block?', options: ['a > 0 or b > 0', 'a > 0 and b > 0', 'not (a > 0 and b > 0)', 'a > 0 == b > 0'], answer: 1, why: 'The block is reached only if both are True, which is what `and` means.' },
          {
            t: 'parsons', title: 'Arrange the nest', prompt: 'Order the lines: if the user is logged in, check the credit; if there is credit, print "Play"; otherwise print "Top up". If not logged in, print "Log in first".', lines: [
              'logged_in = input("Logged in (yes/no): ")',
              'if logged_in == "yes":',
              '    credit = int(input("Credit: "))',
              '    if credit > 0:',
              '        print("Play")',
              '    else:',
              '        print("Top up")',
              'else:',
              '    print("Log in first")',
            ], why: 'The credit question lives inside the first block, and the last `else` lines up with the first `if`.'
          },

          {
            t: 'exercise', id: 'm02-ex-licence', title: 'Licence check', level: 1,
            prompt: 'Read an age. If it is under 17 print <code>Too young</code>. Otherwise read <code>yes</code> or <code>no</code> for "passed the test": print <code>Licence issued</code> for yes and <code>Test needed</code> for no.',
            starter: C`
              age = int(input("Age: "))
            `,
            solution: C`
              age = int(input("Age: "))
              if age < 17:
                  print("Too young")
              else:
                  passed = input("Passed the test (yes/no): ")
                  if passed == "yes":
                      print("Licence issued")
                  else:
                      print("Test needed")
            `,
            tests: [{ in: ['16'], out: 'Too young' }, { in: ['17', 'yes'], out: 'Licence issued' }, { in: ['30', 'no'], out: 'Test needed' }, { in: ['10'], out: 'Too young', hidden: true }],
            hints: ['Only ask for the test result when the person is old enough: put the second `input` inside the `else`.']
          },
          {
            t: 'exercise', id: 'm02-ex-teen-club', title: 'Teen club', level: 2,
            prompt: 'A club admits people aged 13 to 19 (inclusive) who hold a ticket. Read the age, then the word <code>yes</code> or <code>no</code> for ticket. Print <code>Admitted</code> or <code>Refused</code>. Use a <strong>single</strong> <code>if</code> with <code>and</code> (no nesting).',
            starter: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
            `,
            solution: C`
              age = int(input("Age: "))
              ticket = input("Ticket (yes/no): ")
              if age >= 13 and age <= 19 and ticket == "yes":
                  print("Admitted")
              else:
                  print("Refused")
            `,
            tests: [{ in: ['15', 'yes'], out: 'Admitted' }, { in: ['13', 'yes'], out: 'Admitted' }, { in: ['19', 'yes'], out: 'Admitted' }, { in: ['20', 'yes'], out: 'Refused' }, { in: ['12', 'yes'], out: 'Refused' }, { in: ['15', 'no'], out: 'Refused', hidden: true }],
            requires: [{ re: '\\band\\b', msg: 'Join the conditions with `and`.' }],
            hints: ['You need three conditions: age at least 13, age at most 19, ticket is "yes".']
          },
          {
            t: 'exercise', id: 'm02-ex-atm', kind: 'exam', title: 'ATM withdrawal', level: 3,
            prompt: 'Read a PIN (text), then an amount (whole number). The correct PIN is <code>1234</code>. If the PIN is wrong print <code>Wrong PIN</code>. If the PIN is right: print <code>Invalid amount</code> if the amount is 0 or less, <code>Over daily limit</code> if it is more than 200, otherwise <code>Dispensing</code> followed by the amount (for example <code>Dispensing 80</code>). Read the amount only after a correct PIN.',
            starter: C`
              pin = input("PIN: ")
            `,
            solution: C`
              pin = input("PIN: ")
              if pin == "1234":
                  amount = int(input("Amount: "))
                  if amount <= 0:
                      print("Invalid amount")
                  elif amount > 200:
                      print("Over daily limit")
                  else:
                      print("Dispensing", amount)
              else:
                  print("Wrong PIN")
            `,
            tests: [{ in: ['0000'], out: 'Wrong PIN' }, { in: ['1234', '80'], out: 'Dispensing 80' }, { in: ['1234', '200'], out: 'Dispensing 200' }, { in: ['1234', '201'], out: 'Over daily limit' }, { in: ['1234', '0'], out: 'Invalid amount' }, { in: ['1234', '-5'], out: 'Invalid amount', hidden: true }],
            hints: ['Outer `if` is the PIN test. Everything else goes inside it.', 'Inside, use an `if / elif / else` chain on the amount.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'selection-patterns',
        title: 'Selection patterns you will reuse',
        time: '35 min',
        book: 'Ch 2 · p.56-66',
        exam: 'Paper 2 Q2-Q6',
        summary: 'Even/odd, leap year, menus, min/max, choices, one-line if',
        intro: 'A handful of small decisions come up again and again in programs and in exam questions. Learn them as ready-made patterns and you will recognise them everywhere.',
        blocks: [
          { t: 'h', text: 'Even or odd with %' },
          { t: 'p', html: 'The **modulus** operator `%` gives the remainder after division. A number is even when dividing by 2 leaves no remainder. The same trick tests "is it a multiple of n?".' },
          {
            t: 'cases', title: 'Using %', items: [
              {
                label: 'Remainders', code: C`
              print(10 % 2)
              print(11 % 2)
              print(17 % 5)
              print(20 % 5)
            ` },
              {
                label: 'Even or odd', stdin: ['7'], code: C`
              n = int(input("Number: "))
              if n % 2 == 0:
                  print("even")
              else:
                  print("odd")
            ` },
              {
                label: 'Multiple of 3 and 5', stdin: ['30'], code: C`
              n = int(input("Number: "))
              if n % 3 == 0 and n % 5 == 0:
                  print("multiple of both")
              elif n % 3 == 0:
                  print("multiple of 3")
              elif n % 5 == 0:
                  print("multiple of 5")
              else:
                  print("neither")
            `, caption: 'The most specific test (both) must come first.'
              },
              {
                label: 'Zero and negatives', code: C`
              print(0 % 2)
              print(-3 % 2)
              print(-4 % 2)
            `, caption: '0 is even. In Python, `%` by a positive number never gives a negative result.'
              },
            ]
          },

          { t: 'h', text: 'Leap year' },
          { t: 'p', html: 'A year is a leap year if it divides by 4, **except** century years, which must divide by 400. So 2024 and 2000 are leap years, but 1900 and 2100 are not. There are two equivalent ways to write this.' },
          {
            t: 'cases', title: 'Leap year, two ways', items: [
              {
                label: 'One long condition', stdin: ['1900'], code: C`
              year = int(input("Year: "))
              if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
                  print("Leap year")
              else:
                  print("Not a leap year")
            ` },
              {
                label: 'Nested / elif', stdin: ['2000'], code: C`
              year = int(input("Year: "))
              if year % 400 == 0:
                  print("Leap year")
              elif year % 100 == 0:
                  print("Not a leap year")
              elif year % 4 == 0:
                  print("Leap year")
              else:
                  print("Not a leap year")
            ` },
              {
                label: 'Ordinary year', stdin: ['2023'], code: C`
              year = int(input("Year: "))
              if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
                  print("Leap year")
              else:
                  print("Not a leap year")
            ` },
            ]
          },

          { t: 'h', text: 'Largest of three, without max()' },
          {
            t: 'cases', title: 'Finding the biggest', items: [
              {
                label: 'Compare with and', stdin: ['4', '9', '6'], code: C`
              a = int(input("a: "))
              b = int(input("b: "))
              c = int(input("c: "))
              if a >= b and a >= c:
                  print("Largest:", a)
              elif b >= a and b >= c:
                  print("Largest:", b)
              else:
                  print("Largest:", c)
            `, caption: '`>=` is used so that ties still work.'
              },
              {
                label: 'Keep a running best', intro: 'This version scales to any number of values, and is the idea behind loops later.', stdin: ['4', '9', '6'], code: C`
              a = int(input("a: "))
              b = int(input("b: "))
              c = int(input("c: "))
              largest = a
              if b > largest:
                  largest = b
              if c > largest:
                  largest = c
              print("Largest:", largest)
            ` },
              {
                label: 'Smallest', stdin: ['4', '9', '6'], code: C`
              a = int(input("a: "))
              b = int(input("b: "))
              c = int(input("c: "))
              smallest = a
              if b < smallest:
                  smallest = b
              if c < smallest:
                  smallest = c
              print("Smallest:", smallest)
            ` },
              {
                label: 'All equal', stdin: ['5', '5', '5'], code: C`
              a = int(input("a: "))
              b = int(input("b: "))
              c = int(input("c: "))
              largest = a
              if b > largest:
                  largest = b
              if c > largest:
                  largest = c
              print("Largest:", largest)
            ` },
            ]
          },

          { t: 'h', text: 'Menus and validating a choice' },
          { t: 'p', html: 'A menu prints the options, reads a choice, then uses `if / elif / else` to do the right thing. The final `else` catches anything that is not a valid option, which is a simple kind of **validation**.' },
          {
            t: 'cases', title: 'A small menu', items: [
              {
                label: 'Choice 1', stdin: ['1'], code: C`
              print("1. Add")
              print("2. Subtract")
              print("3. Quit")
              choice = input("Choose: ")
              if choice == "1":
                  print("Adding")
              elif choice == "2":
                  print("Subtracting")
              elif choice == "3":
                  print("Goodbye")
              else:
                  print("Please choose 1, 2 or 3")
            ` },
              {
                label: 'Invalid choice', stdin: ['9'], code: C`
              print("1. Add")
              print("2. Subtract")
              print("3. Quit")
              choice = input("Choose: ")
              if choice == "1":
                  print("Adding")
              elif choice == "2":
                  print("Subtracting")
              elif choice == "3":
                  print("Goodbye")
              else:
                  print("Please choose 1, 2 or 3")
            ` },
              {
                label: 'Compare as text', intro: 'The choice is kept as text, so compare with `"1"` not `1`. Otherwise nothing ever matches.', stdin: ['1'], code: C`
              choice = input("Choose: ")
              if choice == 1:
                  print("matched")
              else:
                  print("no match")
            ` },
              {
                label: 'Letters, any case', stdin: ['Q'], code: C`
              choice = input("(A)dd or (Q)uit: ")
              if choice.lower() == "a":
                  print("Adding")
              elif choice.lower() == "q":
                  print("Goodbye")
              else:
                  print("Unknown option")
            `, caption: '`.lower()` lets the user type `Q` or `q`.'
              },
              {
                label: 'Simple validation', stdin: ['150'], code: C`
              percent = int(input("Percentage: "))
              if percent < 0 or percent > 100:
                  print("Error: enter a number from 0 to 100")
              else:
                  print("Accepted:", percent)
            ` },
            ]
          },

          { t: 'h', text: 'Truthiness and one-line decisions' },
          { t: 'p', html: 'Python treats some values as **False** in a condition: `0`, `0.0`, the empty string `""`, and the empty list. Everything else counts as True. This means `if name:` is a short way to test that something was typed.' },
          {
            t: 'cases', title: 'Short forms', items: [
              {
                label: 'Empty or not', stdin: [''], code: C`
              name = input("Name: ")
              if name:
                  print("Hello", name)
              else:
                  print("You did not type anything")
            ` },
              {
                label: 'Equivalent explicit form', stdin: [''], code: C`
              name = input("Name: ")
              if name != "":
                  print("Hello", name)
              else:
                  print("You did not type anything")
            `, caption: 'Beginners should prefer this clearer form.'
              },
              {
                label: 'Truthiness of numbers', code: C`
              print(bool(0))
              print(bool(7))
              print(bool(""))
              print(bool("0"))
            `, caption: 'The text `"0"` is not empty, so it counts as True.'
              },
              {
                label: 'One-line if (extension)', intro: 'A **conditional expression** chooses a value in a single line: `value_if_true if condition else value_if_false`.', stdin: ['16'], code: C`
              age = int(input("Age: "))
              status = "adult" if age >= 18 else "child"
              print(status)
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Exams like these: <em>"write a program that reads a number and states whether it is odd or even"</em>, <em>"display the largest of three numbers"</em>, <em>"a menu with three options"</em>. In pseudocode the first is <pre>RECEIVE n FROM (INTEGER) KEYBOARD\nIF n MOD 2 = 0 THEN\n    SEND "even" TO DISPLAY\nELSE\n    SEND "odd" TO DISPLAY\nEND IF</pre>`MOD` is `%` in Python, and `DIV` (whole-number division) is `//`.' },

          { t: 'h', text: 'Check your understanding' },
          {
            t: 'predict', title: 'Remainders and decisions', code: C`
            n = 14
            if n % 4 == 0:
                print("A")
            elif n % 2 == 0:
                print("B")
            else:
                print("C")
            print(n % 5)
          `, rows: 2, why: '14 % 4 is 2, so the first test fails. 14 % 2 is 0, so B prints. 14 % 5 is 4.'
          },
          {
            t: 'predict', title: 'Truthiness', code: C`
            items = ["", "0", 0, "a"]
            for x in items:
                if x:
                    print("yes")
                else:
                    print("no")
          `, rows: 4, why: 'Empty text and the number 0 are False. The text `"0"` and `"a"` are True. (A short loop, covered in the next module.)'
          },
          { t: 'quiz', q: 'Which condition is True for the year 1900?', options: ['year % 4 == 0 and year % 100 != 0', 'year % 400 == 0', 'year % 100 == 0', 'year % 4 != 0'], answer: 2, why: '1900 divides by 100, but not by 400 (so it is not a leap year), and the first option fails because of the `!= 0`.' },
          {
            t: 'sort', prompt: 'Decide the outcome for each number tested with <code>n % 2 == 0</code>.', cats: ['Even branch', 'Odd branch'], items: [
              { text: '<code>10</code>', cat: 0 },
              { text: '<code>7</code>', cat: 1 },
              { text: '<code>0</code>', cat: 0 },
              { text: '<code>101</code>', cat: 1 },
              { text: '<code>-4</code>', cat: 0 },
              { text: '<code>1</code>', cat: 1 },
            ], why: 'Even numbers (including 0 and negatives) leave remainder 0 when divided by 2.'
          },
          {
            t: 'parsons', title: 'Smallest of three', prompt: 'Put the lines in order so the program prints the smallest of a, b, c.', lines: [
              'smallest = a',
              'if b < smallest:',
              '    smallest = b',
              'if c < smallest:',
              '    smallest = c',
              'print(smallest)',
            ], why: 'Start with a guess, then replace it whenever something smaller turns up.'
          },

          {
            t: 'exercise', id: 'm02-ex-even-odd', title: 'Even or odd', level: 1,
            prompt: 'Read a whole number and print <code>even</code> or <code>odd</code>.',
            starter: C`
              n = int(input("Number: "))
            `,
            solution: C`
              n = int(input("Number: "))
              if n % 2 == 0:
                  print("even")
              else:
                  print("odd")
            `,
            tests: [{ in: ['8'], out: 'even' }, { in: ['7'], out: 'odd' }, { in: ['0'], out: 'even' }, { in: ['-3'], out: 'odd', hidden: true }],
            hints: ['Use the remainder after dividing by 2: `n % 2`.']
          },
          {
            t: 'exercise', id: 'm02-ex-largest3', title: 'Largest of three', level: 2,
            prompt: 'Read three whole numbers. Print the largest. Do not use <code>max()</code>.',
            starter: C`
              a = int(input("a: "))
              b = int(input("b: "))
              c = int(input("c: "))
            `,
            solution: C`
              a = int(input("a: "))
              b = int(input("b: "))
              c = int(input("c: "))
              largest = a
              if b > largest:
                  largest = b
              if c > largest:
                  largest = c
              print(largest)
            `,
            tests: [{ in: ['3', '8', '5'], out: '8' }, { in: ['9', '2', '4'], out: '9' }, { in: ['1', '2', '7'], out: '7' }, { in: ['6', '6', '6'], out: '6' }, { in: ['-5', '-2', '-9'], out: '-2', hidden: true }],
            requires: [{ re: '\\bmax\\s*\\(', not: true, msg: 'Do not use `max()`.' }],
            hints: ['Start by assuming `a` is the largest.', 'Then check whether `b` or `c` beats it.']
          },
          {
            t: 'exercise', id: 'm02-ex-calc-menu', title: 'Calculator menu', level: 2,
            prompt: 'Read two whole numbers, then a choice: <code>1</code> for add, <code>2</code> for subtract, <code>3</code> for multiply. Print the result only (for example <code>12</code>). For any other choice print <code>Invalid choice</code>.',
            starter: C`
              a = int(input("First number: "))
              b = int(input("Second number: "))
              choice = input("1 add, 2 subtract, 3 multiply: ")
            `,
            solution: C`
              a = int(input("First number: "))
              b = int(input("Second number: "))
              choice = input("1 add, 2 subtract, 3 multiply: ")
              if choice == "1":
                  print(a + b)
              elif choice == "2":
                  print(a - b)
              elif choice == "3":
                  print(a * b)
              else:
                  print("Invalid choice")
            `,
            tests: [{ in: ['7', '5', '1'], out: '12' }, { in: ['7', '5', '2'], out: '2' }, { in: ['7', '5', '3'], out: '35' }, { in: ['7', '5', '4'], out: 'Invalid choice' }, { in: ['2', '9', 'x'], out: 'Invalid choice', hidden: true }],
            hints: ['`choice` is text, so compare it with `"1"`, not `1`.']
          },
          {
            t: 'exercise', id: 'm02-ex-leap', kind: 'exam', title: 'Leap year', level: 3,
            prompt: 'Read a year. Print <code>Leap year</code> or <code>Not a leap year</code>. A year is a leap year if it divides by 4, except that years dividing by 100 are leap years only if they also divide by 400.',
            starter: C`
              year = int(input("Year: "))
            `,
            solution: C`
              year = int(input("Year: "))
              if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
                  print("Leap year")
              else:
                  print("Not a leap year")
            `,
            tests: [{ in: ['2024'], out: 'Leap year' }, { in: ['2023'], out: 'Not a leap year' }, { in: ['1900'], out: 'Not a leap year' }, { in: ['2000'], out: 'Leap year' }, { in: ['2100'], out: 'Not a leap year', hidden: true }, { in: ['1996'], out: 'Leap year', hidden: true }],
            hints: ['There are two ways to be a leap year: divisible by 4 but not by 100, or divisible by 400.', 'Join those two cases with `or`, and use brackets.']
          },
          {
            t: 'exercise', id: 'm02-ex-pass-name', title: 'Case-insensitive answer', level: 2,
            prompt: 'A quiz asks: <em>What is the capital of France?</em> Read the answer (the user may use any capital letters or add spaces at the ends). Print <code>Correct</code> if it is Paris, otherwise <code>Wrong</code>. Use <code>.lower()</code> and <code>.strip()</code>.',
            starter: C`
              answer = input("Capital of France: ")
            `,
            solution: C`
              answer = input("Capital of France: ")
              if answer.strip().lower() == "paris":
                  print("Correct")
              else:
                  print("Wrong")
            `,
            tests: [{ in: ['Paris'], out: 'Correct' }, { in: ['  PARIS '], out: 'Correct' }, { in: ['london'], out: 'Wrong' }, { in: ['parís'], out: 'Wrong', hidden: true }],
            requires: [{ re: '\\.lower\\(\\)', msg: 'Use `.lower()`.' }],
            hints: ['`.strip()` removes spaces from both ends.', 'You can chain methods: `answer.strip().lower()`.']
          },
        ],
      },
    ],
  });
})();

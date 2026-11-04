(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm08',
    title: 'Validation, testing and tracing',
    blurb: 'Stop bad data, choose test data, fill in trace tables and fix broken programs.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'validation',
        title: 'Validation checks',
        time: '35 min',
        book: 'Paper 2 · validation',
        summary: 'Range, length, type, presence, format, lookup, check digit; verification',
        intro: 'People make mistakes when they type. **Validation** is the program checking that data is sensible before it uses it. It cannot prove the data is correct, only that it is acceptable.',
        blocks: [
          { t: 'h', text: 'Validation is not the same as correct' },
          { t: 'p', html: 'If a user types an age of `15` when they are really 16, no validation check can tell. But a check *can* reject `-3`, `"abc"` or an empty answer. Validation makes sure the data is **reasonable**.' },
          { t: 'table', head: ['Check', 'Question it asks', 'Example rule'], rows: [
            ['**Range**', 'Is it between a lowest and a highest value?', 'Mark from 0 to 100'],
            ['**Length**', 'Does it have an acceptable number of characters?', 'Password at least 8 characters; PIN exactly 4'],
            ['**Type**', 'Is it the right kind of data?', 'Age must be a whole number'],
            ['**Presence**', 'Was anything entered at all?', 'Name must not be empty'],
            ['**Format**', 'Does it follow the expected pattern?', 'Email contains `@` and a dot'],
            ['**Lookup**', 'Is it one of the allowed values?', 'Size must be S, M or L'],
            ['**Check digit**', 'Is the last digit consistent with the others?', 'Barcodes and ISBNs'],
          ] },
          { t: 'note', kind: 'exam', html: 'A Paper 2 question may give a data item (for example "a student year group between 7 and 11") and ask you to <strong>name the check</strong> and <strong>write the code</strong>. Name the check exactly: range check, length check, type check, presence check, format check or lookup check.' },

          { t: 'h', text: 'Each check as a function' },
          { t: 'p', html: 'The neatest way to write a check is as a function that returns `True` (valid) or `False` (invalid). You wrote this kind of helper in the Subprograms module.' },
          { t: 'cases', title: 'The checks in Python', items: [
            { label: 'Range', code: C`
              def valid_mark(mark):
                  return 0 <= mark <= 100

              print(valid_mark(55))
              print(valid_mark(0))
              print(valid_mark(100))
              print(valid_mark(101))
              print(valid_mark(-1))
            ` },
            { label: 'Length', code: C`
              def valid_password(pw):
                  return len(pw) >= 8

              def valid_pin_length(pin):
                  return len(pin) == 4

              print(valid_password("tiger"))
              print(valid_password("tiger2024"))
              print(valid_pin_length("1234"))
              print(valid_pin_length("12345"))
            ` },
            { label: 'Type', intro: '`isdigit()` is true only when every character is a digit 0 to 9, and the string is not empty.', code: C`
              print("42".isdigit())
              print("4.2".isdigit())
              print("-5".isdigit())
              print("abc".isdigit())
              print("".isdigit())
            ` },
            { label: 'Presence', intro: 'An empty string is "falsy". Remove spaces first so a name made only of spaces is also rejected.', code: C`
              def has_text(answer):
                  return answer.strip() != ""

              print(has_text("Asha"))
              print(has_text(""))
              print(has_text("   "))
            ` },
            { label: 'Format', intro: 'A simple format check for an email address: one `@`, and a dot somewhere after it.', code: C`
              def valid_email(text):
                  if text.count("@") != 1:
                      return False
                  at = text.index("@")
                  return "." in text[at:]

              print(valid_email("asha@school.org"))
              print(valid_email("asha.school.org"))
              print(valid_email("asha@school"))
            ` },
            { label: 'Lookup', code: C`
              def valid_size(size):
                  return size in ["S", "M", "L"]

              print(valid_size("M"))
              print(valid_size("XL"))
              print(valid_size("m"))
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'A **range check** with `or` is a classic bug. `x < 0 or x > 100` is the *invalid* test. The *valid* test is `0 <= x <= 100` or `x >= 0 and x <= 100`. Writing `x >= 0 or x <= 100` accepts every number.' },
          { t: 'code', title: 'the or bug', code: C`
            def valid_bad(x):
                return x >= 0 or x <= 100

            print(valid_bad(50))
            print(valid_bad(-20))
            print(valid_bad(5000))
          `, caption: 'All three are accepted, so the check does nothing. Change `or` to `and` and run again.' },

          { t: 'h', text: 'Check digits' },
          { t: 'p', html: 'A **check digit** is an extra digit worked out from the others. When data is typed or scanned, the program recomputes it. If it does not match, a digit was probably mistyped. Here is a simple scheme: the fifth digit must equal the sum of the first four, modulo 10.' },
          { t: 'cases', title: 'A check-digit function', items: [
            { label: 'The function', code: C`
              def valid_code(code):
                  if len(code) != 5 or not code.isdigit():
                      return False
                  total = 0
                  for ch in code[:4]:
                      total = total + int(ch)
                  return total % 10 == int(code[4])

              print(valid_code("12340"))
              print(valid_code("12341"))
              print(valid_code("1234"))
              print(valid_code("12a40"))
            ` },
            { label: 'Why it catches errors', intro: 'Change one digit and the check no longer matches.', code: C`
              def check_digit(first_four):
                  total = 0
                  for ch in first_four:
                      total = total + int(ch)
                  return total % 10

              print(check_digit("1234"))
              print(check_digit("1334"))
            ` },
          ] },

          { t: 'h', text: 'Verification' },
          { t: 'p', html: '**Verification** checks that the data entered **matches what the user meant** to enter. The common methods are **double entry** (type it twice) and a **visual check** (read it back and confirm).' },
          { t: 'cases', title: 'Verification', items: [
            { label: 'Double entry', stdin: ['asha@mail.com', 'asha@mial.com'], code: C`
              first = input("Enter email: ")
              second = input("Enter it again: ")
              if first == second:
                  print("Thank you")
              else:
                  print("The two entries do not match")
            ` },
            { label: 'Visual check', stdin: ['Asha', 'y'], code: C`
              name = input("Your name: ")
              print("You entered:", name)
              ok = input("Is this correct (y/n)? ")
              if ok == "y":
                  print("Saved")
              else:
                  print("Please re-enter")
            ` },
          ] },
          { t: 'sort', title: 'Validation or verification?', prompt: 'Which is being described?', cats: ['Validation', 'Verification'], items: [
            { text: 'Rejecting a mark of 140 because the maximum is 100', cat: 0 },
            { text: 'Asking a user to type their new password twice', cat: 1 },
            { text: 'Checking a name box is not left empty', cat: 0 },
            { text: 'Showing the entered date and asking "Is this correct?"', cat: 1 },
            { text: 'Checking a postcode follows the expected pattern', cat: 0 },
          ], why: 'Validation checks the data is sensible. Verification checks it matches what the user intended.' },
          { t: 'sort', title: 'Name the check', prompt: 'Which validation check does each rule describe?', cats: ['Range', 'Length', 'Presence', 'Lookup', 'Type'], items: [
            { text: 'A year group must be between 7 and 11', cat: 0 },
            { text: 'A username must have at least 5 characters', cat: 1 },
            { text: 'The surname box must not be empty', cat: 2 },
            { text: 'The colour must be red, green or blue', cat: 3 },
            { text: 'An age must be a whole number, not letters', cat: 4 },
            { text: 'A phone number must have exactly 11 digits', cat: 1 },
          ], why: 'Range = between limits, length = number of characters, presence = something entered, lookup = in a list of allowed values, type = kind of data.' },

          { t: 'predict', title: 'What passes?', code: C`
            def check(s):
                return s.isdigit() and len(s) == 4

            print(check("1234"))
            print(check("123"))
            print(check("12a4"))
            print(check("12345"))
          `, rows: 4, why: 'Only the first has all digits and length 4.' },
          { t: 'quiz', q: 'A program accepts the age <code>17</code> for a student who is really 16. What does that show?', options: ['Validation failed', 'Validation cannot detect data that is sensible but wrong', 'The range check is missing', 'A syntax error'], answer: 1, why: '17 passes any sensible range check. Only verification (for example asking the user to confirm) might catch it.' },

          { t: 'exercise', id: 'm08-ex-validage', title: 'Valid age', level: 1,
            prompt: 'Write a function <code>valid_age(age)</code> that returns <code>True</code> if the age is a whole number from 11 to 16 inclusive, otherwise <code>False</code>.',
            starter: C`
              def valid_age(age):
                  pass
            `,
            solution: C`
              def valid_age(age):
                  return 11 <= age <= 16
            `,
            tests: [{ py: 'assert valid_age(11) and valid_age(16) and valid_age(13)', label: '11, 13 and 16 are valid' }, { py: 'assert not valid_age(10) and not valid_age(17)', label: '10 and 17 are invalid' }, { py: 'assert not valid_age(-4) and not valid_age(100)', hidden: true, label: 'hidden check' }],
            hints: ['Both limits are included.', '`11 <= age <= 16`'] },
          { t: 'exercise', id: 'm08-ex-validpw', title: 'Password rules', level: 2,
            prompt: 'Write <code>valid_password(pw)</code> returning <code>True</code> only if the password has <strong>at least 8 characters</strong> and contains <strong>at least one digit</strong>.',
            starter: C`
              def valid_password(pw):
                  pass
            `,
            solution: C`
              def valid_password(pw):
                  if len(pw) < 8:
                      return False
                  for ch in pw:
                      if ch.isdigit():
                          return True
                  return False
            `,
            tests: [{ py: 'assert valid_password("tiger2024") is True' }, { py: 'assert valid_password("tigerrrrr") is False', label: 'no digit' }, { py: 'assert valid_password("ab1") is False', label: 'too short' }, { py: 'assert valid_password("12345678") is True', hidden: true }, { py: 'assert valid_password("") is False', hidden: true }],
            hints: ['Check the length first.', 'Loop through the characters and look for one with `.isdigit()`.'] },
          { t: 'exercise', id: 'm08-ex-lookup-scenario', title: 'Club sign-up', level: 2,
            prompt: 'A school club accepts only these clubs: <code>chess</code>, <code>drama</code>, <code>coding</code>. Ask for the club name. Ignore capital letters and extra spaces around it. Print <code>Accepted</code> if it is one of the three, otherwise print <code>Rejected</code>. Also print <code>No club entered</code> (and nothing else) if the answer is empty.',
            starter: C`
              clubs = ["chess", "drama", "coding"]
              answer = input("Club: ")
            `,
            solution: C`
              clubs = ["chess", "drama", "coding"]
              answer = input("Club: ").strip().lower()
              if answer == "":
                  print("No club entered")
              elif answer in clubs:
                  print("Accepted")
              else:
                  print("Rejected")
            `,
            tests: [{ in: ['chess'], out: 'Accepted' }, { in: ['  Drama '], out: 'Accepted' }, { in: ['football'], out: 'Rejected' }, { in: [''], out: 'No club entered', hidden: true }, { in: ['   '], out: 'No club entered', hidden: true }],
            hints: ['`.strip().lower()` cleans the text.', 'Test for the empty answer first, then lookup with `in`.'] },
          { t: 'exercise', id: 'm08-ex-checkdigit', title: 'Check digit', level: 3, kind: 'exam',
            prompt: 'Product codes have 6 digits. The sixth digit must equal the <strong>sum of the first five digits, modulo 10</strong>. Write <code>valid_product(code)</code> returning <code>True</code> or <code>False</code>. It must also return <code>False</code> if the code is not exactly 6 characters or contains anything that is not a digit.',
            starter: C`
              def valid_product(code):
                  pass
            `,
            solution: C`
              def valid_product(code):
                  if len(code) != 6 or not code.isdigit():
                      return False
                  total = 0
                  for ch in code[:5]:
                      total += int(ch)
                  return total % 10 == int(code[5])
            `,
            tests: [{ py: 'assert valid_product("123455") is True', label: '1+2+3+4+5=15, check digit 5' }, { py: 'assert valid_product("123456") is False' }, { py: 'assert valid_product("12345") is False', label: 'too short' }, { py: 'assert valid_product("12a455") is False', label: 'letter' }, { py: 'assert valid_product("000000") is True', hidden: true }],
            hints: ['Reject bad length or non-digits first.', '`code[:5]` is the first five characters; `int(code[5])` is the check digit.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'input-validation',
        title: 'Validating input with loops',
        time: '35 min',
        book: 'Paper 2 · input validation',
        summary: 'Loop until valid, try/except, isdigit, strip, reusable input functions, PIN tries',
        intro: 'Checking data is one thing; making the user try again until they get it right is the real job. This lesson shows the standard patterns, including the exam favourite: a PIN with three attempts.',
        blocks: [
          { t: 'h', text: 'Loop until valid' },
          { t: 'p', html: 'The pattern: ask once, then **while the answer is invalid, say so and ask again**. The first `input()` is outside the loop, the repeat inside.' },
          { t: 'cases', title: 'Range checks with a while loop', items: [
            { label: 'Ask, check, repeat', stdin: ['150', '-5', '72'], code: C`
              mark = int(input("Mark (0-100): "))
              while mark < 0 or mark > 100:
                  print("Invalid. Enter 0 to 100.")
                  mark = int(input("Mark (0-100): "))
              print("Accepted:", mark)
            ` },
            { label: 'Right first time', stdin: ['64'], code: C`
              mark = int(input("Mark (0-100): "))
              while mark < 0 or mark > 100:
                  print("Invalid. Enter 0 to 100.")
                  mark = int(input("Mark (0-100): "))
              print("Accepted:", mark)
            ` },
            { label: 'while True / break', intro: 'The same job with a single `input()` line.', stdin: ['999', '12'], code: C`
              while True:
                  mark = int(input("Mark (0-100): "))
                  if 0 <= mark <= 100:
                      break
                  print("Invalid. Enter 0 to 100.")
              print("Accepted:", mark)
            ` },
            { label: 'Boundary values accepted', stdin: ['0', '100'], code: C`
              for i in range(2):
                  mark = int(input("Mark: "))
                  while mark < 0 or mark > 100:
                      mark = int(input("Mark: "))
                  print(mark, "accepted")
            ` },
            { label: 'Wrong condition: and', intro: 'Invalid means too low **or** too high. With `and` the condition can never be true, so nothing is ever rejected.', stdin: ['500'], code: C`
              mark = int(input("Mark (0-100): "))
              while mark < 0 and mark > 100:
                  mark = int(input("Mark (0-100): "))
              print("Accepted:", mark)
            ` },
          ] },

          { t: 'h', text: 'When the user types text instead of a number' },
          { t: 'p', html: 'Calling `int("abc")` crashes the program with a `ValueError`. Two ways to avoid it: check first with `isdigit()`, or catch the error with `try` / `except`.' },
          { t: 'cases', title: 'The type check', items: [
            { label: 'The crash', expectError: true, stdin: ['abc'], code: C`
              age = int(input("Age: "))
              print(age)
            ` },
            { label: 'isdigit()', intro: 'Keep the answer as a string until it passes the check. Then convert it.', stdin: ['abc', '4.5', '', '15'], code: C`
              answer = input("Age: ")
              while not answer.isdigit():
                  print("Please type a whole number")
                  answer = input("Age: ")
              age = int(answer)
              print("Age is", age)
            ` },
            { label: 'isdigit() and negatives', intro: '`isdigit()` is false for `-5` because of the minus sign. That is fine for ages, but wrong for temperatures.', code: C`
              print("-5".isdigit())
              print("5".isdigit())
              print(" 5".isdigit())
            ` },
            { label: 'try / except', intro: 'Python tries the risky line. If a `ValueError` happens it jumps to `except` instead of crashing.', stdin: ['abc', '-8', '12'], code: C`
              valid = False
              while not valid:
                  try:
                      number = int(input("Whole number: "))
                      valid = True
                  except ValueError:
                      print("That was not a whole number")
              print("You entered", number)
            ` },
            { label: 'Decimals', intro: 'Use `float` when decimals are allowed.', stdin: ['x', '3.75'], code: C`
              while True:
                  try:
                      price = float(input("Price: "))
                      break
                  except ValueError:
                      print("Numbers only, please")
              print("Price:", price)
            ` },
          ] },
          { t: 'note', kind: 'key', html: 'Three layers of validation appear in good programs: (1) **presence** (not empty), (2) **type** (is it a number?), (3) **range** (is the number allowed?). Check them in that order.' },

          { t: 'h', text: 'Cleaning text input' },
          { t: 'cases', title: 'strip, lower and empty answers', items: [
            { label: 'strip()', intro: 'Remove accidental spaces before checking.', stdin: ['  yes  '], code: C`
              answer = input("Continue? ").strip().lower()
              if answer == "yes":
                  print("Continuing")
              else:
                  print("Stopping")
            ` },
            { label: 'Presence check loop', stdin: ['', '   ', 'Asha'], code: C`
              name = input("Name: ").strip()
              while name == "":
                  print("The name cannot be empty")
                  name = input("Name: ").strip()
              print("Hello", name)
            ` },
            { label: 'Lookup loop', stdin: ['XL', 's', 'M'], code: C`
              size = input("Size (S, M, L): ").upper()
              while size not in ["S", "M", "L"]:
                  print("Choose S, M or L")
                  size = input("Size (S, M, L): ").upper()
              print("Size", size, "selected")
            ` },
          ] },

          { t: 'h', text: 'A reusable validated-input function' },
          { t: 'p', html: 'Most programs need the same loop many times. Put it in a function with parameters for the prompt and the limits, and call it wherever you need a number.' },
          { t: 'code', title: 'get_int.py', stdin: ['x', '200', '15', '3'], code: C`
            def get_int(prompt, low, high):
                while True:
                    try:
                        value = int(input(prompt))
                    except ValueError:
                        print("Please type a whole number")
                        continue
                    if low <= value <= high:
                        return value
                    print("Number must be from", low, "to", high)

            age = get_int("Age (11-16): ", 11, 16)
            print("age =", age)
            level = get_int("Level (1-5): ", 1, 5)
            print("level =", level)
          `, caption: 'Trace it. A function that returns only valid data means the rest of the program never needs to check again.' },

          { t: 'h', text: 'Limited attempts: PIN with three tries' },
          { t: 'p', html: 'Authentication means proving who you are. A typical exam task allows a fixed number of attempts. Count the wrong tries; stop when correct or when the tries run out. Pay attention to when each message is printed.' },
          { t: 'cases', title: 'Three attempts', items: [
            { label: 'Correct on the second try', stdin: ['1111', '4821'], code: C`
              CORRECT = "4821"
              tries = 0
              granted = False
              while tries < 3 and not granted:
                  pin = input("PIN: ")
                  if pin == CORRECT:
                      granted = True
                  else:
                      tries = tries + 1
                      print("Wrong PIN")
              if granted:
                  print("Access granted")
              else:
                  print("Card blocked")
            ` },
            { label: 'All three wrong', stdin: ['1', '2', '3'], code: C`
              CORRECT = "4821"
              tries = 0
              granted = False
              while tries < 3 and not granted:
                  pin = input("PIN: ")
                  if pin == CORRECT:
                      granted = True
                  else:
                      tries = tries + 1
                      print("Wrong PIN")
              if granted:
                  print("Access granted")
              else:
                  print("Card blocked")
            ` },
            { label: 'for loop version', intro: 'A `for` loop counts the attempts for you. `return`-style exit is done with `break`.', stdin: ['0000', '4821'], code: C`
              CORRECT = "4821"
              granted = False
              for attempt in range(3):
                  pin = input("PIN: ")
                  if pin == CORRECT:
                      granted = True
                      break
                  print("Wrong PIN, attempt", attempt + 1, "of 3")
              print("Access granted" if granted else "Card blocked")
            ` },
            { label: 'Common bug: PIN as int', intro: 'The user\'s answer is text. Comparing the string `"4821"` with the number `4821` is never true.', stdin: ['4821'], code: C`
              pin = input("PIN: ")
              if pin == 4821:
                  print("Correct")
              else:
                  print("Wrong, because a string is never equal to an int")
            ` },
          ] },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode for a validation loop: <code>RECEIVE mark FROM (INTEGER) KEYBOARD</code> then <code>WHILE mark &lt; 0 OR mark &gt; 100 DO … END WHILE</code>. The exam wants you to show the input being repeated until valid, and a sensible message such as "Enter a number from 0 to 100".' },

          { t: 'predict', title: 'How many times is it asked?', code: C`
            x = int(input())
            asked = 1
            while x < 1 or x > 5:
                x = int(input())
                asked += 1
            print(asked, x)
          `, stdin: ['9', '0', '6', '3', '4'], rows: 1, why: 'Inputs 9, 0 and 6 are rejected; 3 is the fourth value and passes. The count is 4.' },
          { t: 'quiz', q: 'Which loop condition correctly rejects a percentage that is not between 0 and 100?', options: ['while p < 0 and p > 100', 'while p >= 0 or p <= 100', 'while p < 0 or p > 100', 'while 0 < p < 100'], answer: 2, why: 'A value is invalid if it is too low OR too high. The last option wrongly rejects 0 and 100 themselves.' },
          { t: 'parsons', title: 'Loop until valid', prompt: 'Put these lines in order so the program keeps asking until the number is from 1 to 10.', lines: [
            'num = int(input("Number 1-10: "))', 'while num < 1 or num > 10:', '    print("Invalid")', '    num = int(input("Number 1-10: "))', 'print("You chose", num)'], why: 'Ask once, loop while invalid (asking again inside), then use the value.' },

          { t: 'exercise', id: 'm08-ex-getmark', title: 'Valid mark', level: 1,
            prompt: 'Ask for a mark from 0 to 100 (whole number). Keep asking until the mark is valid, then print <code>Mark: </code> followed by the number.',
            starter: C`
              mark = int(input("Mark: "))
              print("Mark:", mark)
            `,
            solution: C`
              mark = int(input("Mark: "))
              while mark < 0 or mark > 100:
                  mark = int(input("Mark: "))
              print("Mark:", mark)
            `,
            tests: [{ in: ['50'], out: 'Mark: 50' }, { in: ['101', '-1', '70'], out: 'Mark: 70' }, { in: ['0'], out: 'Mark: 0', label: '0 is valid' }, { in: ['100'], out: 'Mark: 100', hidden: true }, { in: ['101', '100'], out: 'Mark: 100', hidden: true }],
            requires: [{ re: '\\bwhile\\b', msg: 'Use a `while` loop.' }],
            hints: ['Valid is 0 to 100 inclusive, so invalid is `< 0` or `> 100`.', 'Ask for input again inside the loop.'] },
          { t: 'exercise', id: 'm08-ex-safeint', title: 'Whole numbers only', level: 2,
            prompt: 'Ask for the number of tickets (a whole number from 1 to 6). If the user types something that is not a whole number, print <code>Numbers only</code> and ask again. If it is a whole number outside 1 to 6, print <code>Between 1 and 6</code> and ask again. When valid, print <code>Tickets: N</code>.',
            starter: C`
              # use try / except or isdigit()
            `,
            solution: C`
              while True:
                  text = input("Tickets: ")
                  try:
                      n = int(text)
                  except ValueError:
                      print("Numbers only")
                      continue
                  if 1 <= n <= 6:
                      break
                  print("Between 1 and 6")
              print("Tickets:", n)
            `,
            tests: [{ in: ['3'], out: 'Tickets: 3' }, { in: ['abc', '9', '2'], out: 'Numbers only\nBetween 1 and 6\nTickets: 2' }, { in: ['0', '6'], out: 'Between 1 and 6\nTickets: 6', hidden: true }, { in: ['x', '', '1'], out: 'Numbers only\nNumbers only\nTickets: 1', hidden: true }],
            hints: ['Put the `int(input())` inside a `try` block.', 'Two different messages: one in `except ValueError`, one when the range test fails.'] },
          { t: 'exercise', id: 'm08-ex-username', title: 'Username rules', level: 2,
            prompt: 'Ask for a username. It must be 5 to 12 characters long. While it is too short print <code>Too short</code>; while it is too long print <code>Too long</code>. Ask again each time. When valid print <code>Welcome, NAME</code>.',
            starter: C`
              name = input("Username: ")
            `,
            solution: C`
              name = input("Username: ")
              while len(name) < 5 or len(name) > 12:
                  if len(name) < 5:
                      print("Too short")
                  else:
                      print("Too long")
                  name = input("Username: ")
              print("Welcome,", name)
            `,
            tests: [{ in: ['sam123'], out: 'Welcome, sam123' }, { in: ['ab', 'abcdefghijklmn', 'good_one'], out: 'Too short\nToo long\nWelcome, good_one' }, { in: ['abcde'], out: 'Welcome, abcde', label: '5 is accepted', hidden: true }, { in: ['abcdefghijkl'], out: 'Welcome, abcdefghijkl', label: '12 is accepted', hidden: true }],
            hints: ['Use `len(name)`.', 'Inside the loop use `if` / `else` to choose the message.'] },
          { t: 'exercise', id: 'm08-ex-pin3', title: 'Three tries', level: 3, kind: 'exam',
            prompt: 'The correct PIN is <code>7391</code>. The user gets <strong>three</strong> attempts. After a wrong attempt print <code>Incorrect</code>. If they enter the right PIN print <code>Welcome</code> and stop. If all three attempts are wrong print <code>Account locked</code>. A PIN that is not exactly 4 digits must print <code>Invalid PIN</code> and still counts as an attempt.',
            starter: C`
              CORRECT = "7391"
              tries = 0
            `,
            solution: C`
              CORRECT = "7391"
              tries = 0
              granted = False
              while tries < 3 and not granted:
                  pin = input("PIN: ")
                  if len(pin) != 4 or not pin.isdigit():
                      print("Invalid PIN")
                      tries += 1
                  elif pin == CORRECT:
                      print("Welcome")
                      granted = True
                  else:
                      print("Incorrect")
                      tries += 1
              if not granted:
                  print("Account locked")
            `,
            tests: [
              { in: ['7391'], out: 'Welcome' },
              { in: ['1234', '7391'], out: 'Incorrect\nWelcome' },
              { in: ['1', '2222', 'abcd'], out: 'Invalid PIN\nIncorrect\nInvalid PIN\nAccount locked' },
              { in: ['0000', '1111', '7391'], out: 'Incorrect\nIncorrect\nWelcome', hidden: true },
              { in: ['0000', '1111', '2222'], out: 'Incorrect\nIncorrect\nIncorrect\nAccount locked', hidden: true },
            ],
            hints: ['Use a counter `tries` and a flag such as `granted`.', 'Test the format first (length and digits), then compare with the correct PIN.', 'Only print `Account locked` after the loop, when `granted` is still False.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'test-data',
        title: 'Test data and test plans',
        time: '35 min',
        book: 'Paper 2 · testing',
        summary: 'Normal, boundary and erroneous data; test tables; asserts; iterative testing',
        intro: 'Running a program once and seeing it work proves very little. Testers choose a set of inputs designed to find the mistakes, and write down in advance what should happen.',
        blocks: [
          { t: 'h', text: 'Three kinds of test data' },
          { t: 'table', head: ['Type', 'What it is', 'Should the program accept it?'], rows: [
            ['**Normal**', 'Typical, sensible values well inside the limits', 'Yes'],
            ['**Boundary**', 'Values on the edge of what is allowed: the smallest and largest valid value, and the values just outside', 'The valid edges yes; the values just outside no'],
            ['**Erroneous**', 'Data that should never be accepted: wrong type, empty, or far outside the range', 'No, with an error message'],
          ] },
          { t: 'p', html: 'Suppose a program accepts a student age from **11 to 16 inclusive**. A good set of tests is:' },
          { t: 'table', head: ['Test data', 'Type', 'Expected result'], rows: [
            ['13', 'Normal', 'Accepted'],
            ['11', 'Boundary (lowest valid)', 'Accepted'],
            ['16', 'Boundary (highest valid)', 'Accepted'],
            ['10', 'Boundary (just below)', 'Rejected'],
            ['17', 'Boundary (just above)', 'Rejected'],
            ['abc', 'Erroneous (wrong type)', 'Rejected, message shown'],
            ['(empty)', 'Erroneous (nothing entered)', 'Rejected, message shown'],
            ['-5', 'Erroneous (far out of range)', 'Rejected'],
          ] },
          { t: 'note', kind: 'exam', html: 'Exam tables ask you to complete the columns <em>test data</em>, <em>type of test data</em> and <em>expected output</em>. The expected output is what the program <strong>should</strong> do, decided from the rule, not copied from running the code. Boundary data tests both **sides** of each limit, so a range with two limits has four boundary values.' },

          { t: 'sort', title: 'Classify the test data', prompt: 'The rule: a mark is valid if it is a whole number from 0 to 50 inclusive. Classify each test value.', cats: ['Normal', 'Boundary', 'Erroneous'], items: [
            { text: '25', cat: 0 },
            { text: '0', cat: 1 },
            { text: '50', cat: 1 },
            { text: '51', cat: 1 },
            { text: '-1', cat: 1 },
            { text: 'fifty', cat: 2 },
            { text: '300', cat: 2 },
            { text: '(empty)', cat: 2 },
            { text: '7', cat: 0 },
            { text: '12.5', cat: 2 },
          ], why: '0 and 50 are the edges of the valid range, 51 and -1 are the values just outside. Text, decimals, empty input and very large values are erroneous. 25 and 7 are comfortably inside the range.' },
          { t: 'sort', title: 'Expected result', prompt: 'A password must be at least 8 characters. Which outcome is expected for each test?', cats: ['Accepted', 'Rejected'], items: [
            { text: '`password1` (9 characters)', cat: 0 },
            { text: '`abcdefgh` (8 characters)', cat: 0 },
            { text: '`abcdefg` (7 characters)', cat: 1 },
            { text: '(empty)', cat: 1 },
            { text: '`a very long sentence of a password`', cat: 0 },
          ], why: 'The boundary is 8: exactly 8 is accepted and 7 is rejected.' },

          { t: 'h', text: 'Testing with code' },
          { t: 'p', html: 'You can turn a test table into code. A list of `(input, expected)` pairs lets one loop run all your tests and print `PASS` or `FAIL` for each. This is how professionals repeat testing quickly after every change.' },
          { t: 'cases', title: 'Automatic tests', items: [
            { label: 'A test table in a loop', code: C`
              def valid_age(age):
                  return 11 <= age <= 16

              tests = [
                  (13, True),
                  (11, True),
                  (16, True),
                  (10, False),
                  (17, False),
                  (-5, False),
              ]
              for value, expected in tests:
                  actual = valid_age(value)
                  result = "PASS" if actual == expected else "FAIL"
                  print(value, expected, actual, result)
            ` },
            { label: 'Finding a bug', intro: 'The function uses `<` instead of `<=` on the upper limit. The boundary test 16 exposes it. Normal data alone would not have.', code: C`
              def valid_age(age):
                  return 11 <= age < 16

              tests = [(13, True), (11, True), (16, True), (10, False), (17, False)]
              for value, expected in tests:
                  actual = valid_age(value)
                  print(value, "PASS" if actual == expected else "FAIL")
            ` },
            { label: 'assert', intro: '`assert` stops the program at the first failing test. Run it, then fix the function.', expectError: true, code: C`
              def valid_age(age):
                  return 11 <= age < 16

              assert valid_age(13) == True
              assert valid_age(11) == True
              assert valid_age(16) == True, "16 should be accepted"
              print("all passed")
            ` },
          ] },
          { t: 'note', kind: 'key', html: '**Boundary data finds the off-by-one mistakes** (`<` instead of `<=`, `range(1, 10)` instead of `range(1, 11)`). Always test both edges.' },

          { t: 'h', text: 'Writing a test plan' },
          { t: 'p', html: 'A **test plan** is a table written *before* testing. After running the program, add an **actual result** column; any row where actual differs from expected is a fault to fix.' },
          { t: 'table', head: ['No.', 'Purpose', 'Input', 'Expected', 'Actual', 'Pass?'], rows: [
            ['1', 'Normal value', '35', 'Mark accepted', '', ''],
            ['2', 'Lowest valid', '0', 'Mark accepted', '', ''],
            ['3', 'Just below range', '-1', 'Error message, ask again', '', ''],
            ['4', 'Highest valid', '100', 'Mark accepted', '', ''],
            ['5', 'Just above range', '101', 'Error message, ask again', '', ''],
            ['6', 'Wrong type', 'ten', 'Error message, ask again', '', ''],
          ] },
          { t: 'cases', title: 'Test plan variants', items: [
            { label: 'Selection (grade function)', intro: 'Test a value inside each band and at every band edge.', code: C`
              def grade(mark):
                  if mark >= 70:
                      return "A"
                  elif mark >= 50:
                      return "B"
                  else:
                      return "C"

              for m in [90, 70, 69, 60, 50, 49, 0]:
                  print(m, grade(m))
            ` },
            { label: 'Loops (empty and one item)', intro: 'For loops and lists, test zero items, one item and many.', code: C`
              def total(numbers):
                  t = 0
                  for n in numbers:
                      t += n
                  return t

              print(total([]))
              print(total([5]))
              print(total([1, 2, 3, 4]))
            ` },
            { label: 'Strings (empty, one char)', code: C`
              def first_letter(word):
                  if word == "":
                      return ""
                  return word[0].upper()

              for w in ["python", "a", ""]:
                  print(repr(first_letter(w)))
            ` },
          ] },

          { t: 'h', text: 'Iterative testing' },
          { t: 'p', html: '**Iterative testing** means testing as you build: write a small part, test it, fix it, then add the next part and test again. Errors are easier to find when only a few lines are new. Exam answers about this mention testing **each module/subprogram** as it is developed, then testing the whole program together (**final testing**).' },
          { t: 'note', kind: 'exam', html: 'Common question: <em>"Explain why a programmer would use iterative testing."</em> Good points: errors are found early, they are easier to locate in a small piece of code, and each fix is checked before more code is added.' },

          { t: 'predict', title: 'Which test fails?', code: C`
            def valid_pin(pin):
                return len(pin) == 4 and pin.isdigit()

            for p in ["1234", "123", "12345", "12a4", ""]:
                print(repr(p), valid_pin(p))
          `, rows: 5, why: 'Only "1234" has four characters that are all digits.' },
          { t: 'quiz', q: 'A range check accepts numbers from 1 to 20 inclusive. Which set contains all four boundary values?', options: ['1, 10, 20, 30', '0, 1, 20, 21', '1, 2, 19, 20', '-1, 0, 21, 22'], answer: 1, why: 'Boundary data uses the two edges (1, 20) and the values just outside (0, 21).' },
          { t: 'quiz', q: 'Why is <code>"hello"</code> a good <strong>erroneous</strong> test for an age input?', options: ['It is the largest valid age', 'It is the wrong type of data and should be rejected', 'It is a normal value', 'It is just outside the boundary'], answer: 1, why: 'Erroneous data should never be accepted, and the program should respond with a message rather than crash.' },

          { t: 'exercise', id: 'm08-ex-testlists', title: 'Choose the test data', level: 1,
            prompt: 'A program accepts a number of players from <strong>2 to 6</strong> inclusive. Create three lists: <code>normal</code> (two or more typical values as integers), <code>boundary</code> (all four boundary values as integers) and <code>erroneous</code> (at least two strings that should be rejected). Then print <code>done</code>.',
            starter: C`
              normal = []
              boundary = []
              erroneous = []
              print("done")
            `,
            solution: C`
              normal = [3, 4]
              boundary = [1, 2, 6, 7]
              erroneous = ["four", ""]
              print("done")
            `,
            tests: [
              { py: 'assert len(normal) >= 2 and all(isinstance(x, int) and 2 < x < 6 for x in normal), "normal values must be integers between 3 and 5"', label: 'normal values are inside the range' },
              { py: 'assert sorted(boundary) == [1, 2, 6, 7], "boundary should be 1, 2, 6, 7"', label: 'boundary values are 1, 2, 6, 7' },
              { py: 'assert len(erroneous) >= 2 and all(isinstance(x, str) for x in erroneous)', label: 'erroneous values are strings' },
              { out: 'done' },
            ],
            hints: ['Valid edges are 2 and 6. Just outside are 1 and 7.', 'Erroneous means wrong type, e.g. words or an empty string.'] },
          { t: 'exercise', id: 'm08-ex-grade', title: 'Fix the boundaries', level: 2, kind: 'debug',
            prompt: 'The function <code>ticket_price(age)</code> should return 0 for under 5, 4 for ages 5 to 15, 8 for 16 to 64 and 5 for 65 or over. Two boundary mistakes exist. Fix them. (The program at the bottom runs your boundary tests.)',
            starter: C`
              def ticket_price(age):
                  if age < 5:
                      return 0
                  elif age < 15:
                      return 4
                  elif age < 64:
                      return 8
                  else:
                      return 5
            `,
            solution: C`
              def ticket_price(age):
                  if age < 5:
                      return 0
                  elif age < 16:
                      return 4
                  elif age < 65:
                      return 8
                  else:
                      return 5
            `,
            tests: [
              { py: 'assert [ticket_price(a) for a in [4, 5, 15, 16, 64, 65]] == [0, 4, 4, 8, 8, 5]', label: 'boundary ages 4, 5, 15, 16, 64, 65' },
              { py: 'assert ticket_price(0) == 0 and ticket_price(30) == 8 and ticket_price(90) == 5', label: 'normal ages' },
            ],
            hints: ['Age 15 should cost 4 but the code gives 8.', 'The upper limit of a band that stops at 15 is `age < 16`.', 'Do the same check for the 64/65 edge.'] },
          { t: 'exercise', id: 'm08-ex-runtests', title: 'Run the test table', level: 2,
            prompt: 'A function <code>valid_score(s)</code> (0 to 20 inclusive) is already written. Complete the loop so that for each <code>(value, expected)</code> pair it prints the value followed by <code>PASS</code> if the function agrees with <code>expected</code>, otherwise <code>FAIL</code>. For example <code>20 PASS</code>.',
            starter: C`
              def valid_score(s):
                  return 0 <= s <= 20

              tests = [(10, True), (0, True), (20, True), (21, False), (-1, False)]
              for value, expected in tests:
                  pass
            `,
            solution: C`
              def valid_score(s):
                  return 0 <= s <= 20

              tests = [(10, True), (0, True), (20, True), (21, False), (-1, False)]
              for value, expected in tests:
                  if valid_score(value) == expected:
                      print(value, "PASS")
                  else:
                      print(value, "FAIL")
            `,
            tests: [{ out: '10 PASS\n0 PASS\n20 PASS\n21 PASS\n-1 PASS' }, { py: 'assert valid_score(5) is True', label: 'function not broken' }],
            hints: ['Compare `valid_score(value)` with `expected`.', 'Print `value` and the word PASS or FAIL in the same `print()`.'] },
          { t: 'exercise', id: 'm08-ex-scenario-vote', title: 'Voting age checker', level: 3, kind: 'exam',
            prompt: 'A program reads an age and prints <code>Allowed</code> if the person is 18 or over, <code>Too young</code> if they are 0 to 17, and <code>Invalid age</code> for anything below 0 or above 120. Write the program, then it will be tested with normal, boundary and erroneous values. Boundary values: 0, 17, 18, 120 and -1, 121.',
            starter: C`
              age = int(input("Age: "))
            `,
            solution: C`
              age = int(input("Age: "))
              if age < 0 or age > 120:
                  print("Invalid age")
              elif age >= 18:
                  print("Allowed")
              else:
                  print("Too young")
            `,
            tests: [{ in: ['30'], out: 'Allowed' }, { in: ['18'], out: 'Allowed' }, { in: ['17'], out: 'Too young' }, { in: ['0'], out: 'Too young' }, { in: ['-1'], out: 'Invalid age', hidden: true }, { in: ['120'], out: 'Allowed', hidden: true }, { in: ['121'], out: 'Invalid age', hidden: true }],
            hints: ['Check for invalid ages first.', 'Then `>= 18` for Allowed, else Too young.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'trace-tables',
        title: 'Trace tables',
        time: '35 min',
        book: 'Paper 2 · tracing',
        summary: 'Read the Trace button, fill in exam trace tables for loops, selection and functions',
        intro: 'A **trace table** records, step by step, what a program does with its variables. In the exam you do it by hand to find the output or to spot a logic error. On this website the Trace button does it for you, so you can check your hand-written answers.',
        blocks: [
          { t: 'h', text: 'What is in a trace table?' },
          { t: 'list', items: [
            'One **column for each variable** in the program, plus a column for the **output**.',
            'One **row each time a variable changes** (in the exam) or each line that runs (on this site).',
            'You write a value only when it **changes**. Leave blank if it stays the same.',
            'You work **like the computer**: line by line, exactly as written, even if you think you know the answer.',
          ] },

          { t: 'h', text: 'Using the Trace button' },
          { t: 'p', html: 'Press **Trace** under a code box. Use **Step** to go one line forward. The left panel shows every variable and its value; the yellow-highlighted ones just changed. Then press **Trace table**. Each row is one line that ran; the **Line** column is the line number, the middle columns are your variables, and the last column shows anything printed.' },
          { t: 'code', title: 'running total', code: C`
            total = 0
            for i in range(1, 4):
                total = total + i
            print(total)
          `, caption: 'Press Trace, then Trace table. Predict each row before you press Step.' },
          { t: 'p', html: 'Written the exam way, with one row per change, the same program looks like this:' },
          { t: 'table', head: ['i', 'total', 'output'], rows: [
            ['', '0', ''],
            ['1', '1', ''],
            ['2', '3', ''],
            ['3', '6', ''],
            ['', '', '6'],
          ] },
          { t: 'note', kind: 'key', html: 'The row for `i = 3` shows total `6` because the line `total = total + i` has already run with `i = 3` (3 + 3 = 6). Work out the right-hand side with the **old** value, then store the answer.' },

          { t: 'h', text: 'Tracing every kind of code' },
          { t: 'cases', title: 'Four programs to trace', items: [
            { label: 'for loop', intro: 'Trace table columns: `i`, `square`, output.', code: C`
              for i in range(1, 5):
                  square = i * i
                  print(i, square)
            ` },
            { label: 'while loop', intro: 'The loop checks `n > 0` before each repeat. Watch how many times the body runs.', code: C`
              n = 10
              steps = 0
              while n > 0:
                  n = n - 3
                  steps = steps + 1
              print(n, steps)
            ` },
            { label: 'selection', intro: 'Only **one** branch runs. In the trace table you can see which line numbers appear and which never do.', code: C`
              mark = 55
              if mark >= 70:
                  grade = "A"
              elif mark >= 50:
                  grade = "B"
              else:
                  grade = "C"
              print(grade)
            ` },
            { label: 'function', intro: 'In the Trace view you see a second panel, "Inside the function", with the local variables. In an exam, add columns for the parameters and local variables.', code: C`
              def add_tax(price):
                  total = price * 1.2
                  return total

              cost = add_tax(50)
              print(cost)
            ` },
          ] },

          { t: 'h', text: 'Doing it by hand' },
          { t: 'p', html: 'Here is a loop that has a boundary bug. Do the trace in your head, row by row, before you open the Trace button.' },
          { t: 'code', title: 'countdown', code: C`
            count = 3
            while count > 0:
                print(count)
                count = count - 1
            print("Go")
          `, caption: 'Hand trace: count 3 (print 3), count 2 (print 2), count 1 (print 1), count 0 (loop ends), print Go.' },
          { t: 'table', head: ['count', 'count > 0?', 'output'], rows: [
            ['3', 'True', '3'],
            ['2', 'True', '2'],
            ['1', 'True', '1'],
            ['0', 'False', ''],
            ['', '', 'Go'],
          ] },
          { t: 'note', kind: 'exam', html: 'Exam trace-table questions often hide a **logic error**: the final value is not what the description says. Fill in the table honestly, then compare the result with what the program was meant to do. The first row where intention and reality differ points at the bug. Typical bugs: loop starts or stops one too soon, wrong operator, variable updated before it is used.' },

          { t: 'h', text: 'A function trace with a loop' },
          { t: 'code', title: 'digit sum', code: C`
            def digit_sum(n):
                total = 0
                while n > 0:
                    digit = n % 10
                    total = total + digit
                    n = n // 10
                return total

            print(digit_sum(472))
          `, caption: 'Trace it, then switch to the Trace table. The columns for `n`, `total` and `digit` show 472 shrinking by one digit each time.' },
          { t: 'table', head: ['n', 'digit', 'total', 'output'], rows: [
            ['472', '', '0', ''],
            ['472', '2', '2', ''],
            ['47', '2', '2', ''],
            ['47', '7', '9', ''],
            ['4', '7', '9', ''],
            ['4', '4', '13', ''],
            ['0', '4', '13', ''],
            ['', '', '', '13'],
          ] },

          { t: 'predict', title: 'Trace it in your head', code: C`
            x = 2
            y = 5
            for i in range(3):
                x = x + y
                y = y - 1
            print(x, y)
          `, rows: 1, why: 'Round 1: x=7, y=4. Round 2: x=11, y=3. Round 3: x=14, y=2. Output: 14 2.' },
          { t: 'predict', title: 'A swap', code: C`
            a = 4
            b = 9
            temp = a
            a = b
            b = temp
            print(a, b)
          `, rows: 1, why: 'The temporary variable keeps the old a so the two values exchange. If you skip `temp` and write `a = b` then `b = a`, both would become 9.' },
          { t: 'predict', title: 'Output column', code: C`
            n = 1
            while n < 20:
                n = n * 2
                print(n)
          `, rows: 5, why: 'n doubles: 2, 4, 8, 16, 32. The loop only stops once n is 20 or more, and 32 is printed because the print is inside the loop.' },
          { t: 'quiz', q: 'In a trace table for <code>total = total + i</code>, when <code>total</code> is 6 and <code>i</code> is 4, what value goes in the <code>total</code> column for that row?', options: ['4', '6', '10', '24'], answer: 2, why: 'The new total is the old total plus i: 6 + 4 = 10.' },
          { t: 'quiz', q: 'Which statement about trace tables is true?', options: ['They test a program with several different inputs at once', 'They follow the values of variables as the program runs, step by step', 'They check a program for syntax errors', 'They only work on programs with no loops'], answer: 1, why: 'A trace table is for following one run of the code, so you can find logic errors and predict output.' },
          { t: 'sort', title: 'Row or no row?', prompt: 'When tracing with one row per change, decide whether a trace table needs a new value in the columns.', cats: ['New value written', 'No new value'], items: [
            { text: '`x = x + 1`', cat: 0 },
            { text: '`if x > 5:` (just the test)', cat: 1 },
            { text: '`print(x)`', cat: 1 },
            { text: '`total = 0`', cat: 0 },
            { text: '`for i in range(3):` moves to the next value', cat: 0 },
          ], why: 'Only assignments and loop-variable updates change a variable; tests and print statements affect the flow or output columns, not a variable column.' },

          { t: 'exercise', id: 'm08-ex-trace-loop', title: 'Print the trace rows', level: 1,
            prompt: 'Write a program that does the loop below and prints a trace table row for each pass: first <code>i</code>, a space, then the new <code>total</code>. For <code>i</code> from 1 to 4 the running total of 1, 2, 3, 4 is 1, 3, 6, 10.<pre>1 1\n2 3\n3 6\n4 10</pre>',
            starter: C`
              total = 0
              for i in range(1, 5):
                  pass
            `,
            solution: C`
              total = 0
              for i in range(1, 5):
                  total = total + i
                  print(i, total)
            `,
            tests: [{ out: '1 1\n2 3\n3 6\n4 10' }],
            hints: ['Update `total` first, then print `i` and `total`.'] },
          { t: 'exercise', id: 'm08-ex-trace-while', title: 'Halving trace', level: 2,
            prompt: 'Read a whole number <code>n</code>. While <code>n</code> is greater than 1, replace it with <code>n // 2</code> and print the new value. Finally print <code>Steps: S</code> where S is how many times you halved. For input 20 the output is <code>10</code>, <code>5</code>, <code>2</code>, <code>1</code>, <code>Steps: 4</code>.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              steps = 0
              while n > 1:
                  n = n // 2
                  steps = steps + 1
                  print(n)
              print("Steps:", steps)
            `,
            tests: [{ in: ['20'], out: '10\n5\n2\n1\nSteps: 4' }, { in: ['1'], out: 'Steps: 0' }, { in: ['9'], out: '4\n2\n1\nSteps: 3', hidden: true }],
            hints: ['Use a counter variable that starts at 0.', 'Print `n` inside the loop, after halving.'] },
          { t: 'exercise', id: 'm08-ex-trace-fn', title: 'Trace a function', level: 3, kind: 'exam',
            prompt: 'Write the function <code>collatz_steps(n)</code> that returns how many steps it takes to reach 1 using these rules: if <code>n</code> is even, replace it with <code>n // 2</code>; otherwise replace it with <code>3 * n + 1</code>. Each replacement is one step. For 6 the sequence is 6, 3, 10, 5, 16, 8, 4, 2, 1, so the answer is 8. The program should read <code>n</code>, call the function and print the result.',
            starter: C`
              def collatz_steps(n):
                  pass

              start = int(input("Start: "))
            `,
            solution: C`
              def collatz_steps(n):
                  steps = 0
                  while n != 1:
                      if n % 2 == 0:
                          n = n // 2
                      else:
                          n = 3 * n + 1
                      steps = steps + 1
                  return steps

              start = int(input("Start: "))
              print(collatz_steps(start))
            `,
            tests: [{ in: ['6'], out: '8' }, { in: ['1'], out: '0' }, { in: ['7'], out: '16', hidden: true }, { in: ['27'], out: '111', hidden: true }],
            hints: ['Use a `while n != 1` loop and a step counter.', 'Inside use `if n % 2 == 0` for even, `else` for odd.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'amend-the-code',
        title: 'Amend the code: finding and fixing errors',
        time: '40 min',
        book: 'Paper 2 · amend',
        summary: 'Error types recap, a checklist of classic bugs, "there are N errors" tasks, defensive programming',
        intro: 'Paper 2 hands you a program with deliberate mistakes and tells you how many there are. This lesson gives you a checklist, then practice at increasing difficulty.',
        blocks: [
          { t: 'h', text: 'Three kinds of error, again' },
          { t: 'table', head: ['Type', 'When it shows', 'How you find it'], rows: [
            ['**Syntax**', 'Before the program runs', 'Python points to the line. Read the message.'],
            ['**Runtime**', 'The program crashes part-way', 'Read the error name and line number.'],
            ['**Logic**', 'Never crashes, but the answer is wrong', 'Compare to what you expect; use Trace and test data.'],
          ] },

          { t: 'h', text: 'The classic mistakes checklist' },
          { t: 'p', html: 'Almost every "amend the code" question uses a few standard mistakes. Learn to spot each one by its message. Run every example, read the error and then fix it.' },
          { t: 'cases', title: 'Syntax errors', items: [
            { label: 'Missing colon', expectError: true, code: C`
              age = 15
              if age >= 13
                  print("Teen")
            ` },
            { label: 'Single = in a condition', expectError: true, code: C`
              age = 15
              if age = 15:
                  print("Fifteen")
            ` },
            { label: 'Indentation', expectError: true, code: C`
              for i in range(3):
              print(i)
            ` },
            { label: 'Unclosed bracket or quote', expectError: true, code: C`
              print("Total:", (3 + 4)
              print("done")
            ` },
            { label: 'Misspelt keyword', expectError: true, code: C`
              whlie True:
                  print("x")
            ` },
          ] },
          { t: 'cases', title: 'Runtime errors', items: [
            { label: 'Missing int()', expectError: true, intro: '`input()` returns text, so `+ 1` on a string crashes with `TypeError`.', stdin: ['5'], code: C`
              n = input("Number: ")
              print(n + 1)
            ` },
            { label: 'Misspelt variable', expectError: true, code: C`
              total = 5
              print(totl)
            ` },
            { label: 'Index out of range', expectError: true, code: C`
              names = ["Asha", "Ben", "Chloe"]
              for i in range(4):
                  print(names[i])
            ` },
            { label: 'Wrong type in calculation', expectError: true, code: C`
              print("Age: " + 15)
            ` },
            { label: 'Function not called with value', expectError: true, code: C`
              def double(n):
                  return n * 2
              print(double())
            ` },
          ] },
          { t: 'cases', title: 'Logic errors (no message at all)', items: [
            { label: 'Off by one in range', intro: 'Meant to print 1 to 5, but `range(1, 5)` stops at 4.', code: C`
              for i in range(1, 5):
                  print(i)
            ` },
            { label: 'Wrong operator', intro: 'Average of 4 and 8 should be 6.', code: C`
              a = 4
              b = 8
              print(a + b / 2)
            ` },
            { label: 'Wrong variable', intro: 'Intended to print the total, printed the last item.', code: C`
              total = 0
              for n in [3, 4, 5]:
                  total = total + n
              print(n)
            ` },
            { label: 'Initial value wrong', intro: 'The highest of negative numbers is -2, not 0.', code: C`
              highest = 0
              for n in [-5, -2, -9]:
                  if n > highest:
                      highest = n
              print(highest)
            ` },
            { label: 'Loop never ends well', intro: 'The `print` is outside the loop, so only the last total appears.', code: C`
              total = 0
              for i in range(1, 4):
                  total = total + i
              print(total)
            ` },
            { label: 'Return too early', intro: '`return` inside the loop ends it on the first pass.', code: C`
              def total(nums):
                  t = 0
                  for n in nums:
                      t = t + n
                      return t

              print(total([1, 2, 3]))
            ` },
          ] },

          { t: 'note', kind: 'key', html: '**Method for "There are N errors":** 1) Run it and fix the first error Python reports. 2) Run again; repeat until it runs. 3) Compare the output with what the question says. 4) Trace, or test boundary values, to find the logic errors. 5) Count how many you fixed; if it is fewer than N, look again.' },
          { t: 'sort', title: 'Name the error type', prompt: 'Classify each mistake.', cats: ['Syntax', 'Runtime', 'Logic'], items: [
            { text: 'Missing colon after `while x < 10`', cat: 0 },
            { text: '`print(scores[10])` for a list of five scores', cat: 1 },
            { text: 'Using `>` where `>=` was needed so 50 is graded wrongly', cat: 2 },
            { text: '`int("hello")`', cat: 1 },
            { text: 'Forgetting a closing bracket in `print("Hi"`', cat: 0 },
            { text: 'Program counts from 0 when it should count from 1', cat: 2 },
          ], why: 'Syntax errors prevent the program running, runtime errors crash it, logic errors give wrong results without any message.' },

          { t: 'h', text: 'Defensive programming' },
          { t: 'p', html: '**Defensive programming** means writing code that expects things to go wrong: validating input, avoiding crashes, and printing a helpful message. Good messages say what was wrong **and** what to do.' },
          { t: 'cases', title: 'Defensive habits', items: [
            { label: 'Guard against zero', stdin: ['0'], code: C`
              n = int(input("Divide 100 by: "))
              if n == 0:
                  print("You cannot divide by zero. Enter another number.")
              else:
                  print(100 / n)
            ` },
            { label: 'Guard an empty list', code: C`
              marks = []
              if len(marks) == 0:
                  print("No marks entered yet, so there is no average.")
              else:
                  print(sum(marks) / len(marks))
            ` },
            { label: 'Meaningful messages', intro: 'Compare "Error" with a message that helps.', stdin: ['abc'], code: C`
              text = input("Age: ")
              if not text.isdigit():
                  print("Age must be a whole number such as 14. You typed:", text)
              else:
                  print("Age accepted")
            ` },
            { label: 'Catching a missing file', stdin: ['nofile.txt'], code: C`
              name = input("File name: ")
              try:
                  f = open(name)
                  print(f.read())
                  f.close()
              except FileNotFoundError:
                  print("The file", name, "was not found. Check the spelling.")
            ` },
          ] },
          { t: 'note', kind: 'exam', html: 'A typical mark scheme for "amend the code" gives **one mark per error fixed**. Correcting the same line in the wrong way, or fixing a line that was already right, can lose marks. Change only what is needed.' },

          { t: 'predict', title: 'What does the faulty code print?', code: C`
            nums = [4, 9, 2]
            biggest = 0
            for i in range(1, len(nums)):
                if nums[i] > biggest:
                    biggest = nums[i]
            print(biggest)
          `, rows: 1, why: 'The loop starts at index 1, so it never looks at 4. Here the answer happens to be right (9), but with `[9, 4, 2]` it would give 4, a hidden logic error.' },
          { t: 'quiz', q: 'A program asks for a number and then runs <code>print(n + 1)</code> without converting. What happens?', options: ['It prints n + 1 correctly', 'It prints the text n followed by 1', 'A TypeError crash, because a string cannot be added to a number', 'A syntax error before the program runs'], answer: 2, why: '`input()` returns a string; adding an int to it is a runtime TypeError.' },

          { t: 'exercise', id: 'm08-ex-debug1', kind: 'debug', title: 'Two errors: greeting', level: 1,
            prompt: 'This program should ask for a name and age and print <code>Sam is 15</code>. There are <strong>two</strong> errors.',
            starter: C`
              name = input("Name: ")
              age = int(input("Age: ")
              print(name "is" age)
            `,
            solution: C`
              name = input("Name: ")
              age = int(input("Age: "))
              print(name, "is", age)
            `,
            tests: [{ in: ['Sam', '15'], out: 'Sam is 15' }, { in: ['Priya', '12'], out: 'Priya is 12' }],
            hints: ['Count the brackets on line 2.', 'Items in `print()` must be separated by commas.'] },
          { t: 'exercise', id: 'm08-ex-debug2', kind: 'debug', title: 'Three errors: average', level: 2,
            prompt: 'This program reads five marks and prints their average. There are <strong>three</strong> errors (one syntax, one runtime, one logic).',
            starter: C`
              total = 0
              for i in range(5)
                  mark = input("Mark: ")
                  total = total + mark
              average = total / 4
              print("Average:", average)
            `,
            solution: C`
              total = 0
              for i in range(5):
                  mark = int(input("Mark: "))
                  total = total + mark
              average = total / 5
              print("Average:", average)
            `,
            tests: [{ in: ['10', '20', '30', '40', '50'], out: 'Average: 30.0' }, { in: ['0', '0', '0', '0', '5'], out: 'Average: 1.0' }],
            hints: ['The `for` line needs a colon.', 'Convert the input to a number.', 'Divide by the number of marks that were entered.'] },
          { t: 'exercise', id: 'm08-ex-debug3', kind: 'debug', title: 'Four errors: times table', level: 2,
            prompt: 'This program should print the 7 times table from 1 × 7 to 12 × 7 as <code>1 x 7 = 7</code> and so on. There are <strong>four</strong> errors.',
            starter: C`
              number = 7
              for i in range(1, 12):
                  answer = i + number
                  print(i, "x", number, "=" answer)
                  number = number + 1
            `,
            solution: C`
              number = 7
              for i in range(1, 13):
                  answer = i * number
                  print(i, "x", number, "=", answer)
            `,
            tests: [{ out: '1 x 7 = 7\n2 x 7 = 14\n3 x 7 = 21\n4 x 7 = 28\n5 x 7 = 35\n6 x 7 = 42\n7 x 7 = 49\n8 x 7 = 56\n9 x 7 = 63\n10 x 7 = 70\n11 x 7 = 77\n12 x 7 = 84' }],
            hints: ['Look at the print line for a missing comma.', 'The range must include 12.', 'A times table multiplies; and `number` must stay 7.'] },
          { t: 'exercise', id: 'm08-ex-debug4', kind: 'debug', title: 'Five errors: login', level: 3,
            prompt: 'This login program should give <strong>3</strong> attempts for password <code>python</code>. Print <code>Welcome</code> on success or <code>Locked</code> after three failures, with <code>Try again</code> after each wrong attempt. There are <strong>five</strong> errors.',
            starter: C`
              password = "python"
              tries = 1
              success = False
              while tries < 3 and success = False:
                  attempt = input("Password: ")
                  if attempt = password:
                      success = True
                  else:
                      print("Try again")
              tries = tries + 1
              if success:
                  print("Welcome")
              else:
                  print("Locked")
            `,
            solution: C`
              password = "python"
              tries = 0
              success = False
              while tries < 3 and success == False:
                  attempt = input("Password: ")
                  if attempt == password:
                      success = True
                  else:
                      print("Try again")
                  tries = tries + 1
              if success:
                  print("Welcome")
              else:
                  print("Locked")
            `,
            tests: [
              { in: ['python'], out: 'Welcome' },
              { in: ['a', 'python'], out: 'Try again\nWelcome' },
              { in: ['a', 'b', 'c'], out: 'Try again\nTry again\nTry again\nLocked' },
              { in: ['a', 'b', 'python'], out: 'Try again\nTry again\nWelcome', hidden: true },
            ],
            hints: ['Two lines use `=` where `==` is needed.', 'The counter should start at 0 to allow exactly three tries.', 'The line `tries = tries + 1` must be inside the loop (indent it).', 'That makes five fixes in total.'] },
          { t: 'exercise', id: 'm08-ex-debug5', kind: 'debug', title: 'Logic errors in a function', level: 3,
            prompt: 'The function <code>highest(numbers)</code> should return the biggest number in a list, which may contain negative numbers. The function <code>count_even(numbers)</code> should return how many are even. Each function has <strong>one</strong> logic error and the second also has a missing bit. Fix them.',
            starter: C`
              def highest(numbers):
                  best = 0
                  for n in numbers:
                      if n > best:
                          best = n
                  return best

              def count_even(numbers):
                  count = 0
                  for n in numbers:
                      if n % 2 == 0:
                          count = count + 1
                          return count
            `,
            solution: C`
              def highest(numbers):
                  best = numbers[0]
                  for n in numbers:
                      if n > best:
                          best = n
                  return best

              def count_even(numbers):
                  count = 0
                  for n in numbers:
                      if n % 2 == 0:
                          count = count + 1
                  return count
            `,
            tests: [{ py: 'assert highest([-5, -2, -9]) == -2', label: 'highest of negatives' }, { py: 'assert highest([3, 8, 1]) == 8' }, { py: 'assert count_even([2, 4, 5, 6]) == 3', label: 'count_even counts all evens' }, { py: 'assert count_even([1, 3]) == 0', label: 'count_even with no evens' }],
            hints: ['Start `best` with the first item rather than 0.', 'In `count_even`, `return` belongs after the loop, not inside the `if`.'] },
          { t: 'exercise', id: 'm08-ex-defensive', title: 'Safe divider', level: 3, kind: 'exam',
            prompt: 'Write a program that asks for two numbers (they may have decimals) and prints the first divided by the second. It must never crash. If either entry is not a number print <code>Please enter numbers only</code>. If the second number is 0 print <code>Cannot divide by zero</code>. Otherwise print <code>Result: </code> followed by the answer.',
            starter: C`
              a = input("First: ")
              b = input("Second: ")
            `,
            solution: C`
              a = input("First: ")
              b = input("Second: ")
              try:
                  x = float(a)
                  y = float(b)
                  if y == 0:
                      print("Cannot divide by zero")
                  else:
                      print("Result:", x / y)
              except ValueError:
                  print("Please enter numbers only")
            `,
            tests: [{ in: ['10', '4'], out: 'Result: 2.5' }, { in: ['10', '0'], out: 'Cannot divide by zero' }, { in: ['ten', '2'], out: 'Please enter numbers only' }, { in: ['5', 'x'], out: 'Please enter numbers only', hidden: true }, { in: ['-9', '3'], out: 'Result: -3.0', hidden: true }],
            hints: ['Use `float()` inside a `try` block with `except ValueError`.', 'Check for zero before dividing.'] },
        ],
      },
    ],
  });
})();

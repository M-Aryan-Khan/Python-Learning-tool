(function () {
  const C = PP.C;

  /* ===================================================================== */
  PP.addReference({
    id: 'cheatsheet',
    title: 'Python cheat sheet',
    blocks: [
      { t: 'p', html: 'One compact page: the Python you need for Paper 2. Every code block can be run and edited.' },
      { t: 'h', text: 'Data types' },
      { t: 'table', head: ['Type', 'Example', 'Convert with', 'Notes'], rows: [
        ['`int`', '`42`, `-7`', '`int(x)`', 'Whole numbers. `int("12")` works, `int("1.5")` does not.'],
        ['`float`', '`3.14`, `2.0`', '`float(x)`', 'Decimals. Division `/` always gives a float.'],
        ['`str`', '`"hello"`', '`str(x)`', 'Text. `input()` always returns a `str`.'],
        ['`bool`', '`True`, `False`', '`bool(x)`', 'Results of comparisons.'],
        ['`list`', '`[1, 2, 3]`', '`list(x)`', 'Ordered, changeable. Edexcel "array".'],
      ] },
      { t: 'h', text: 'Operators' },
      { t: 'table', head: ['Operator', 'Meaning', 'Example', 'Result'], rows: [
        ['`+  -  *`', 'add, subtract, multiply', '`7 * 3`', '`21`'],
        ['`/`', 'divide (float)', '`7 / 2`', '`3.5`'],
        ['`//`', 'whole-number divide (DIV)', '`7 // 2`', '`3`'],
        ['`%`', 'remainder (MOD)', '`7 % 2`', '`1`'],
        ['`**`', 'power', '`2 ** 5`', '`32`'],
        ['`==  !=`', 'equal, not equal', '`3 == 3`', '`True`'],
        ['`<  >  <=  >=`', 'compare', '`5 >= 5`', '`True`'],
        ['`and  or  not`', 'combine conditions', '`not (1 > 2)`', '`True`'],
        ['`in`', 'is it inside?', '`"a" in "cat"`', '`True`'],
        ['`+=  -=  *=`', 'update a variable', '`n += 1`', 'adds 1 to `n`'],
      ] },
      { t: 'h', text: 'Order of operations (precedence)' },
      { t: 'p', html: 'From first to last: brackets, then power, then `*  /  //  %`, then `+  -`, then comparisons, then `not`, then `and`, then `or`.' },
      { t: 'code', code: C`
        print(2 + 3 * 4)        # 14: multiply first
        print((2 + 3) * 4)      # 20: brackets first
        print(2 ** 3 ** 2)      # 512: power works right to left
        print(10 - 4 - 3)       # 3: left to right
        print(True or False and False)   # True: and before or
      ` },
      { t: 'h', text: 'Input and output' },
      { t: 'code', code: C`
        name = input("Name: ")
        age = int(input("Age: "))
        print("Hi", name, "you are", age)          # commas add spaces
        print("Next year:", age + 1, sep=" | ")
        print("no newline", end="")
        print(" ... continued")
      `, stdin: ['Asha', '15'] },
      { t: 'h', text: 'Selection' },
      { t: 'code', code: C`
        mark = 64
        if mark >= 70:
            print("A")
        elif mark >= 60:
            print("B")
        elif mark >= 50:
            print("C")
        else:
            print("Fail")
        if 0 <= mark <= 100 and mark != 50:
            print("valid and not 50")
      ` },
      { t: 'h', text: 'Loops' },
      { t: 'table', head: ['Loop', 'Python', 'Values'], rows: [
        ['Count n times', '`for i in range(5):`', '0, 1, 2, 3, 4'],
        ['Start and stop', '`for i in range(2, 6):`', '2, 3, 4, 5'],
        ['With a step', '`for i in range(10, 0, -3):`', '10, 7, 4, 1'],
        ['Each item', '`for x in items:`', 'each item in turn'],
        ['Until a condition', '`while cond:`', 'checked before each go'],
        ['Always at least once', '`while True:` … `break`', 'stop with `break`'],
      ] },
      { t: 'code', code: C`
        for i in range(1, 4):
            print("for", i)
        n = 3
        while n > 0:
            print("while", n)
            n -= 1
        while True:
            n += 1
            if n >= 2:
                break
        print(n)
      ` },
      { t: 'h', text: 'Functions' },
      { t: 'code', code: C`
        def greet(name):                 # procedure: no return
            print("Hello", name)

        def add(a, b=10):                # function with a default
            return a + b

        greet("Asha")
        print(add(3), add(3, 4))
      ` },
      { t: 'note', kind: 'key', html: 'Variables made inside a function are **local**: they disappear when it ends. A function that only prints returns `None`.' },
      { t: 'h', text: 'Useful built-ins' },
      { t: 'table', head: ['Call', 'Does', 'Example result'], rows: [
        ['`len(x)`', 'length of a string or list', '`len("cat")` → `3`'],
        ['`abs(x)`', 'ignore the sign', '`abs(-4)` → `4`'],
        ['`round(x, n)`', 'round to n places', '`round(3.14159, 2)` → `3.14`'],
        ['`min(…)`, `max(…)`', 'smallest, largest', '`max(3, 9, 4)` → `9`'],
        ['`sum(list)`', 'add up a list of numbers', '`sum([1, 2, 3])` → `6`'],
        ['`ord(c)`, `chr(n)`', 'character ↔ code', '`ord("A")` → `65`'],
        ['`range(a, b)`', 'a counting sequence', 'a to b-1'],
        ['`type(x)`', 'what type is it', '`<class \'int\'>`'],
      ] },
      { t: 'note', kind: 'exam', html: 'Pseudocode versions are on the <a href="#/ref/pseudocode">Edexcel pseudocode</a> page.' },
    ],
  });

  /* ===================================================================== */
  PP.addReference({
    id: 'strings-lists',
    title: 'Strings and lists',
    blocks: [
      { t: 'p', html: 'Every method you need, with an example. Remember: string methods return a **new** string; the original does not change. List methods usually change the list itself.' },
      { t: 'h', text: 'String basics' },
      { t: 'table', head: ['Idea', 'Code', 'Result'], rows: [
        ['Length', '`len("hello")`', '`5`'],
        ['Index', '`"hello"[1]`', '`"e"`'],
        ['Last character', '`"hello"[-1]`', '`"o"`'],
        ['Slice', '`"hello"[1:4]`', '`"ell"`'],
        ['From start', '`"hello"[:2]`', '`"he"`'],
        ['To the end', '`"hello"[2:]`', '`"llo"`'],
        ['Reverse', '`"hello"[::-1]`', '`"olleh"`'],
        ['Every 2nd', '`"hello"[::2]`', '`"hlo"`'],
        ['Join', '`"a" + "b"`', '`"ab"`'],
        ['Repeat', '`"ab" * 3`', '`"ababab"`'],
        ['Contains', '`"ell" in "hello"`', '`True`'],
      ] },
      { t: 'h', text: 'String methods' },
      { t: 'table', head: ['Method', 'Meaning', 'Example', 'Result'], rows: [
        ['`upper()`', 'all capitals', '`"hi".upper()`', '`"HI"`'],
        ['`lower()`', 'all lower case', '`"Hi".lower()`', '`"hi"`'],
        ['`title()`', 'Capital Each Word', '`"to be".title()`', '`"To Be"`'],
        ['`capitalize()`', 'first letter capital', '`"to be".capitalize()`', '`"To be"`'],
        ['`strip()`', 'remove spaces/newlines at both ends', '`" hi \\n".strip()`', '`"hi"`'],
        ['`lstrip()` / `rstrip()`', 'remove from left / right only', '`"  hi".lstrip()`', '`"hi"`'],
        ['`replace(a, b)`', 'swap text', '`"cat".replace("c", "b")`', '`"bat"`'],
        ['`find(s)`', 'index of first match, or -1', '`"hello".find("l")`', '`2`'],
        ['`index(s)`', 'index, but error if missing', '`"hello".index("l")`', '`2`'],
        ['`count(s)`', 'how many times', '`"banana".count("a")`', '`3`'],
        ['`split(sep)`', 'cut into a list', '`"a,b,c".split(",")`', '`["a","b","c"]`'],
        ['`join(list)`', 'glue a list together', '`"-".join(["a","b"])`', '`"a-b"`'],
        ['`startswith(s)`', 'begins with?', '`"hello".startswith("he")`', '`True`'],
        ['`endswith(s)`', 'ends with?', '`"hello".endswith("lo")`', '`True`'],
        ['`isdigit()`', 'all digits?', '`"123".isdigit()`', '`True`'],
        ['`isalpha()`', 'all letters?', '`"abc".isalpha()`', '`True`'],
        ['`isalnum()`', 'letters or digits only?', '`"ab1".isalnum()`', '`True`'],
        ['`isupper()` / `islower()`', 'case checks', '`"AB".isupper()`', '`True`'],
        ['`isspace()`', 'only whitespace?', '`"  ".isspace()`', '`True`'],
      ] },
      { t: 'code', title: 'Try them', code: C`
        s = "  Hello, World  "
        t = s.strip()
        print(t.upper(), t.lower(), t.replace("World", "Python"))
        print(t.split(", "))
        print(t.find("o"), t.count("l"), t[::-1])
        print("original unchanged:", repr(s))
      ` },
      { t: 'h', text: 'List basics' },
      { t: 'table', head: ['Idea', 'Code', 'Result'], rows: [
        ['Create', '`nums = [4, 8, 6]`', 'a list'],
        ['Empty list', '`items = []`', 'no items'],
        ['Repeat', '`[0] * 3`', '`[0, 0, 0]`'],
        ['Index / last', '`nums[0]`, `nums[-1]`', '`4`, `6`'],
        ['Change', '`nums[1] = 9`', '`[4, 9, 6]`'],
        ['Slice', '`nums[0:2]`', '`[4, 9]`'],
        ['Length', '`len(nums)`', '`3`'],
        ['Contains', '`6 in nums`', '`True`'],
        ['Add lists', '`[1] + [2]`', '`[1, 2]`'],
        ['Min / max / sum', '`min(nums)`, `max(nums)`, `sum(nums)`', 'smallest, largest, total'],
      ] },
      { t: 'h', text: 'List methods' },
      { t: 'table', head: ['Method', 'Meaning', 'Example', 'List after'], rows: [
        ['`append(x)`', 'add to the end', '`a.append(7)`', '`[1, 2, 7]`'],
        ['`insert(i, x)`', 'add at position i', '`a.insert(0, 9)`', '`[9, 1, 2]`'],
        ['`extend(list)`', 'add several', '`a.extend([5, 6])`', '`[1, 2, 5, 6]`'],
        ['`remove(x)`', 'delete first x', '`a.remove(1)`', '`[2]`'],
        ['`pop()`', 'remove and return the last', '`a.pop()`', '`[1]`'],
        ['`pop(i)`', 'remove and return item i', '`a.pop(0)`', '`[2]`'],
        ['`del a[i]`', 'delete item i', '`del a[0]`', '`[2]`'],
        ['`index(x)`', 'position of x', '`a.index(2)`', 'unchanged, gives `1`'],
        ['`count(x)`', 'how many x', '`a.count(2)`', 'unchanged, gives `1`'],
        ['`sort()`', 'sort in place (returns None)', '`a.sort()`', 'sorted'],
        ['`sorted(a)`', 'new sorted list', '`b = sorted(a)`', '`a` unchanged'],
        ['`reverse()`', 'reverse in place', '`a.reverse()`', '`[2, 1]`'],
        ['`copy()`', 'independent copy', '`b = a.copy()`', '`a` unchanged'],
      ] },
      { t: 'code', title: 'Try them', code: C`
        a = [3, 1, 2]
        a.append(7)
        a.insert(0, 9)
        print(a)
        a.remove(1)
        print(a, a.pop(), a)
        a.sort()
        print(a, a.index(3))
        b = a            # same list, not a copy
        c = a.copy()     # a real copy
        b.append(100)
        print(a, c)
      ` },
      { t: 'note', kind: 'warn', html: '`a = a.sort()` sets `a` to `None`, because `sort()` changes the list and returns nothing. Write `a.sort()` on its own, or `a = sorted(a)`.' },
      { t: 'h', text: '2D lists' },
      { t: 'code', code: C`
        grid = [[1, 2, 3],
                [4, 5, 6]]
        print(grid[1][2])              # row 1, column 2
        print(len(grid), len(grid[0])) # rows, columns
        for row in grid:
            print(sum(row))
        for r in range(len(grid)):
            for c in range(len(grid[r])):
                print(r, c, grid[r][c])
      ` },
    ],
  });

  /* ===================================================================== */
  PP.addReference({
    id: 'files',
    title: 'Files and modules',
    blocks: [
      { t: 'h', text: 'Open modes' },
      { t: 'table', head: ['Mode', 'Meaning', 'If file missing', 'Existing content'], rows: [
        ['`"r"`', 'read', 'error: `FileNotFoundError`', 'kept'],
        ['`"w"`', 'write', 'file is created', '**erased**'],
        ['`"a"`', 'append', 'file is created', 'kept; new text goes on the end'],
      ] },
      { t: 'h', text: 'Reading patterns' },
      { t: 'cases', title: 'Four ways to read', items: [
        { label: 'Whole file', files: { 'data.txt': 'one\ntwo\nthree\n' }, code: C`
          file = open("data.txt", "r")
          text = file.read()
          file.close()
          print(repr(text))
        ` },
        { label: 'One line', files: { 'data.txt': 'one\ntwo\nthree\n' }, code: C`
          file = open("data.txt", "r")
          first = file.readline()
          second = file.readline()
          file.close()
          print(repr(first), repr(second))
        ` },
        { label: 'All lines as a list', files: { 'data.txt': 'one\ntwo\nthree\n' }, code: C`
          file = open("data.txt", "r")
          lines = file.readlines()
          file.close()
          print(lines)
        ` },
        { label: 'Loop (best)', files: { 'data.txt': 'one\ntwo\nthree\n' }, code: C`
          file = open("data.txt", "r")
          for line in file:
              print(line.strip())
          file.close()
        ` },
      ] },
      { t: 'note', kind: 'key', html: 'Each line read from a file ends with `\\n`. Use `strip()` before comparing or converting with `int()`.' },
      { t: 'h', text: 'Writing patterns' },
      { t: 'cases', title: 'Write and append', items: [
        { label: 'Write (w)', code: C`
          file = open("out.txt", "w")
          file.write("first\n")
          file.write("second\n")
          file.close()
          print(open("out.txt").read())
        ` },
        { label: 'Append (a)', files: { 'log.txt': 'old\n' }, code: C`
          file = open("log.txt", "a")
          file.write("new\n")
          file.close()
          print(open("log.txt").read())
        ` },
        { label: 'Numbers need str()', code: C`
          file = open("n.txt", "w")
          for n in range(1, 4):
              file.write(str(n) + "\n")
          file.close()
          print(open("n.txt").read())
        ` },
        { label: 'with (tidy)', code: C`
          with open("w.txt", "w") as f:
              f.write("closes itself\n")
          print(open("w.txt").read())
        ` },
      ] },
      { t: 'h', text: 'Common file jobs' },
      { t: 'code', title: 'File of name,score lines to lists', files: { 'scores.txt': 'Asha,92\nBen,67\n' }, code: C`
        names = []
        scores = []
        file = open("scores.txt", "r")
        for line in file:
            parts = line.strip().split(",")
            names.append(parts[0])
            scores.append(int(parts[1]))
        file.close()
        print(names, scores)
      ` },
      { t: 'code', title: 'Handling a missing file', code: C`
        try:
            file = open("nothing.txt", "r")
            print(file.read())
            file.close()
        except FileNotFoundError:
            print("That file does not exist")
      ` },
      { t: 'h', text: 'random module' },
      { t: 'table', head: ['Call', 'Gives'], rows: [
        ['`import random`', 'needed once at the top'],
        ['`random.randint(1, 6)`', 'whole number from 1 to 6, **both ends included**'],
        ['`random.choice(items)`', 'one random item from a list'],
        ['`random.random()`', 'float from 0 up to (not including) 1'],
        ['`random.shuffle(items)`', 'shuffles the list in place'],
        ['`random.seed(n)`', 'makes the "random" numbers repeatable (for testing)'],
      ] },
      { t: 'code', code: C`
        import random
        random.seed(10)
        print(random.randint(1, 6) in range(1, 7))
        print(random.choice(["red", "green", "blue"]) in ["red", "green", "blue"])
      ` },
      { t: 'h', text: 'math module' },
      { t: 'table', head: ['Call', 'Gives', 'Example'], rows: [
        ['`math.sqrt(x)`', 'square root', '`math.sqrt(16)` → `4.0`'],
        ['`math.pi`', 'the value of pi', '`3.14159…`'],
        ['`math.floor(x)`', 'round down', '`math.floor(2.9)` → `2`'],
        ['`math.ceil(x)`', 'round up', '`math.ceil(2.1)` → `3`'],
        ['`math.pow(a, b)`', 'a to the power b (float)', '`math.pow(2, 3)` → `8.0`'],
      ] },
      { t: 'code', code: C`
        import math
        print(math.sqrt(49), math.floor(2.9), math.ceil(2.1), round(math.pi, 2))
      ` },
    ],
  });

  /* ===================================================================== */
  PP.addReference({
    id: 'errors',
    title: 'Errors and fixes',
    blocks: [
      { t: 'p', html: 'Read the **last line** of the message first: it names the error type. The line number tells you where to look. Each entry below is a real error you can run.' },
      { t: 'table', head: ['Error', 'What it means', 'Typical fix'], rows: [
        ['`SyntaxError`', 'Python cannot understand the line: missing colon, bracket, quote', 'Check the line (and the one above) for a missing `:` `)` or `"`'],
        ['`IndentationError`', 'Lines are not lined up properly', 'Indent the block by 4 spaces; match levels'],
        ['`NameError`', 'A name has not been created, or is misspelt', 'Fix the spelling; create the variable first'],
        ['`TypeError`', 'Wrong type for an operation, such as text + number', 'Convert with `int()` or `str()`'],
        ['`ValueError`', 'Right type, impossible value, such as `int("abc")`', 'Validate with `isdigit()` or `try/except`'],
        ['`IndexError`', 'Index is outside the list or string', 'Stay in `0` to `len(x) - 1`'],
        ['`KeyError`', 'Dictionary key does not exist', 'Check with `in`, or use `.get()`'],
        ['`ZeroDivisionError`', 'Division or modulus by 0', 'Test the divisor first'],
        ['`FileNotFoundError`', 'The file does not exist', 'Check the name and folder; use `"w"` to create'],
        ['`AttributeError`', 'That value has no such method', 'Check the type; check the spelling of the method'],
      ] },
      { t: 'h', text: 'See each one' },
      { t: 'cases', title: 'Error messages you will meet', items: [
        { label: 'SyntaxError', expectError: true, intro: 'Missing colon after the condition.', code: C`
          age = 14
          if age > 12
              print("teen")
        ` },
        { label: 'IndentationError', expectError: true, intro: 'The body of the `for` is not indented.', code: C`
          for i in range(2):
          print(i)
        ` },
        { label: 'NameError', expectError: true, intro: 'Name misspelt.', code: C`
          score = 5
          print(scor)
        ` },
        { label: 'TypeError', expectError: true, intro: 'Text plus number. Fix: `str(age)`, or use a comma.', code: C`
          age = 15
          print("Age: " + age)
        ` },
        { label: 'ValueError', expectError: true, intro: 'The text cannot become an integer.', code: C`
          n = int("twelve")
        ` },
        { label: 'IndexError', expectError: true, intro: 'A list of 3 has indexes 0, 1, 2 only.', code: C`
          items = ["a", "b", "c"]
          print(items[3])
        ` },
        { label: 'KeyError', expectError: true, intro: 'Dictionaries only know the keys they hold.', code: C`
          ages = {"Asha": 15}
          print(ages["Ben"])
        ` },
        { label: 'ZeroDivisionError', expectError: true, code: C`
          print(10 / 0)
        ` },
        { label: 'FileNotFoundError', expectError: true, code: C`
          file = open("missing.txt", "r")
        ` },
        { label: 'AttributeError', expectError: true, intro: 'A list has no `upper()`.', code: C`
          names = ["asha"]
          print(names.upper())
        ` },
        { label: 'Fixing with try/except', code: C`
          try:
              n = int("twelve")
          except ValueError:
              print("Please type a whole number")
        ` },
      ] },
      { t: 'h', text: 'Mistakes that give no error message' },
      { t: 'table', head: ['Symptom', 'Likely cause'], rows: [
        ['Total is just the last number', 'Total set to 0 inside the loop'],
        ['Loop prints one item too few', '`range(1, 10)` when you wanted 1 to 10'],
        ['`None` is displayed', 'Function prints but has no `return`'],
        ['Condition is always true', '`x == 1 or 2` instead of `x == 1 or x == 2`'],
        ['Boundary value fails', '`>` used where `>=` was needed (or the other way)'],
        ['Sorted list is `None`', '`a = a.sort()`'],
        ['Numbers join as text', 'Missing `int()` after `input()`'],
        ['The program never ends', 'Loop variable never updated'],
      ] },
      { t: 'cases', title: 'Quiet logic errors', items: [
        { label: 'x == 1 or 2', code: C`
          x = 5
          if x == 1 or 2:
              print("always printed")
        ` },
        { label: 'Fixed', code: C`
          x = 5
          if x == 1 or x == 2:
              print("never printed here")
          print("done")
        ` },
        { label: 'None from a function', code: C`
          def add(a, b):
              print(a + b)

          print(add(1, 2))
        ` },
      ] },
    ],
  });

  /* ===================================================================== */
  PP.addReference({
    id: 'trace-guide',
    title: 'Trace tables and test data',
    blocks: [
      { t: 'h', text: 'Filling a trace table: the method' },
      { t: 'list', ordered: true, items: [
        'Make **one column per variable** (and one for the output).',
        'Work through the program **line by line**, in the order it runs.',
        'Write a new row each time a variable **changes**. Leave the others blank, or repeat them if the question says so.',
        'In a loop, **every pass** adds rows. Check the loop condition each time.',
        'Write each output in the output column at the moment `print` runs.',
      ] },
      { t: 'note', kind: 'exam', html: 'A typical question gives you the code and the input values, and asks you to complete the table (3 to 6 marks). Do not skip rows: marks are given for each correct value.' },
      { t: 'h', text: 'Worked example' },
      { t: 'code', title: 'Press Trace table', code: C`
        total = 0
        n = 1
        while n <= 4:
            if n % 2 == 1:
                total = total + n
            n = n + 1
        print(total)
      ` },
      { t: 'table', head: ['n', 'n % 2 == 1', 'total', 'output'], rows: [
        ['1', 'True', '1', ''],
        ['2', 'False', '1', ''],
        ['3', 'True', '4', ''],
        ['4', 'False', '4', ''],
        ['5 (loop ends)', '', '', '4'],
      ] },
      { t: 'h', text: 'Tracing a function' },
      { t: 'code', code: C`
        def bigger(a, b):
            if a > b:
                return a
            return b

        x = bigger(4, 9)
        y = bigger(7, 2)
        print(x, y)
      ` },
      { t: 'p', html: 'Call 1: `a = 4`, `b = 9`, returns `9`, so `x = 9`. Call 2: `a = 7`, `b = 2`, returns `7`, so `y = 7`. Output: `9 7`.' },
      { t: 'predict', title: 'Practise: fill the table in your head', code: C`
        count = 0
        for i in range(1, 8):
            if i % 3 == 0:
                count = count + 1
        print(count)
      `, rows: 1, why: 'Multiples of 3 between 1 and 7 are 3 and 6, so count is 2.' },
      { t: 'h', text: 'Test data' },
      { t: 'table', head: ['Type', 'Meaning', 'Example (valid age 12 to 18)'], rows: [
        ['**Normal**', 'Clearly valid, expected data', '`15`'],
        ['**Boundary**', 'On the edge of the range, and just beyond it', '`11`, `12`, `18`, `19`'],
        ['**Erroneous**', 'Wrong type or nonsense, must be rejected', '`"abc"`, `-5`, `200`'],
      ] },
      { t: 'p', html: 'A test plan has columns for the test number, **what is being tested**, the **data**, and the **expected result**. Fill in the expected result **before** you run the program.' },
      { t: 'table', head: ['Test', 'Purpose', 'Input', 'Expected output'], rows: [
        ['1', 'Normal', '15', 'Accepted'],
        ['2', 'Lower boundary', '12', 'Accepted'],
        ['3', 'Just below lower boundary', '11', 'Rejected'],
        ['4', 'Upper boundary', '18', 'Accepted'],
        ['5', 'Just above upper boundary', '19', 'Rejected'],
        ['6', 'Erroneous (wrong type)', 'abc', 'Rejected, no crash'],
      ] },
      { t: 'code', title: 'Run the plan', code: C`
        def valid_age(text):
            if not text.isdigit():
                return False
            age = int(text)
            return 12 <= age <= 18

        for test in ["15", "12", "11", "18", "19", "abc"]:
            print(test, valid_age(test))
      ` },
      { t: 'sort', prompt: 'Classify each test value for a quantity that must be 1 to 10.', cats: ['Normal', 'Boundary', 'Erroneous'], items: [
        { text: '`5`', cat: 0 }, { text: '`1`', cat: 1 }, { text: '`10`', cat: 1 }, { text: '`11`', cat: 1 }, { text: '`0`', cat: 1 }, { text: '`ten`', cat: 2 }, { text: '`-3`', cat: 2 },
      ], why: 'Boundary values sit on and either side of each limit. Wrong types are erroneous.' },
    ],
  });

  /* ===================================================================== */
  PP.addReference({
    id: 'pseudocode',
    title: 'Edexcel pseudocode',
    blocks: [
      { t: 'p', html: 'Pseudocode is how the exam describes an algorithm. It is not run by a computer: you translate it to Python. Wording below is the style used in the exam.' },
      { t: 'table', head: ['Construct', 'Pseudocode', 'Python'], rows: [
        ['Assign', '`SET x TO 5`', '`x = 5`'],
        ['Output', '`SEND x TO DISPLAY`', '`print(x)`'],
        ['Input (text)', '`RECEIVE name FROM (STRING) KEYBOARD`', '`name = input()`'],
        ['Input (whole number)', '`RECEIVE n FROM (INTEGER) KEYBOARD`', '`n = int(input())`'],
        ['Selection', '`IF x > 5 THEN … ELSE … END IF`', '`if x > 5:` … `else:`'],
        ['Chain', '`ELSE IF x > 2 THEN`', '`elif x > 2:`'],
        ['Pre-test loop', '`WHILE x < 10 DO … END WHILE`', '`while x < 10:`'],
        ['Post-test loop', '`REPEAT … UNTIL x = 10`', '`while True:` … `if x == 10: break`'],
        ['Counting loop', '`FOR i FROM 1 TO 5 DO … END FOR`', '`for i in range(1, 6):`'],
        ['Each item', '`FOR EACH x FROM list DO`', '`for x in list:`'],
        ['Array', '`SET a TO [3, 5, 7]`', '`a = [3, 5, 7]`'],
        ['Element', '`a[0]`', '`a[0]`'],
        ['Length', '`LENGTH(a)`', '`len(a)`'],
        ['Procedure', '`PROCEDURE show(x) … END PROCEDURE`', '`def show(x):`'],
        ['Function', '`FUNCTION f(x) … RETURN y … END FUNCTION`', '`def f(x):` … `return y`'],
        ['Call', '`CALL show(3)`', '`show(3)`'],
        ['Remainder', '`a MOD b`', '`a % b`'],
        ['Whole division', '`a DIV b`', '`a // b`'],
        ['Join text', '`a & b`', '`a + b` (use `str()` for numbers)'],
        ['Logic', '`AND`  `OR`  `NOT`', '`and`  `or`  `not`'],
        ['Compare', '`=`  `≠`  `≤`  `≥`', '`==`  `!=`  `<=`  `>=`'],
      ] },
      { t: 'note', kind: 'warn', html: '`FOR i FROM 1 TO 10` includes 10, so Python needs `range(1, 11)`.' },
      { t: 'h', text: 'A whole program, side by side' },
      { t: 'html', html: '<pre>SET total TO 0\nFOR i FROM 1 TO 5 DO\n  RECEIVE mark FROM (INTEGER) KEYBOARD\n  SET total TO total + mark\nEND FOR\nSEND "Average: " &amp; total / 5 TO DISPLAY</pre>' },
      { t: 'code', code: C`
        total = 0
        for i in range(1, 6):
            mark = int(input("Mark: "))
            total = total + mark
        print("Average: " + str(total / 5))
      `, stdin: ['10', '20', '30', '40', '50'] },
      { t: 'h', text: 'Algorithm in pseudocode and Python' },
      { t: 'html', html: '<pre>FUNCTION linearSearch(arr, target)\nBEGIN FUNCTION\n  FOR i FROM 0 TO LENGTH(arr) - 1 DO\n    IF arr[i] = target THEN\n      RETURN i\n    END IF\n  END FOR\n  RETURN -1\nEND FUNCTION</pre>' },
      { t: 'code', code: C`
        def linear_search(arr, target):
            for i in range(0, len(arr)):
                if arr[i] == target:
                    return i
            return -1

        print(linear_search([4, 8, 15], 8), linear_search([4, 8, 15], 5))
      ` },
      { t: 'note', kind: 'exam', html: 'Indentation shows structure in the pseudocode too. Every `IF` ends with `END IF`, every loop with `END WHILE` or `END FOR`. In Python the same structure is shown by the colon and indentation alone.' },
    ],
  });
})();

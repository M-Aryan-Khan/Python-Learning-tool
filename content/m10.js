(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm10',
    title: 'Text files',
    blurb: 'Open, read, write and append text files, and turn files into lists and back again.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'files-reading',
        title: 'Reading a text file',
        time: '35 min',
        book: 'Ch 2 · p.73-76',
        summary: 'open, read, readline, readlines, looping, strip, missing files',
        intro: 'Variables vanish when a program ends. A file keeps data on disk so the next run can use it. First job: getting text out of a file and into your program.',
        blocks: [
          { t: 'h', text: 'Open, use, close' },
          { t: 'p', html: 'To use a file you ask Python to **open** it. Python hands back a **file handle**: a name your program uses to talk to that file. When you have finished you **close** it. The mode `"r"` means read.' },
          {
            t: 'code', title: 'Open and read', files: { 'welcome.txt': 'Welcome to Year 10\nComputer Science is fun\n' }, code: C`
            file = open("welcome.txt", "r")
            text = file.read()
            file.close()
            print(text)
          `, caption: 'The Output panel lists the files the program had. `file` is the file handle; `text` is an ordinary string.'
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode talks about opening a file, reading from it, and closing it. In Python the three steps are `open(name, "r")`, a read method, and `close()`. Always close what you open.' },

          { t: 'h', text: 'Four ways to read' },
          { t: 'p', html: 'The file below has three lines. Each way of reading gives you something different, so look at what each tab prints.' },
          {
            t: 'cases', title: 'read, readline, readlines and a for loop', items: [
              {
                label: 'read()', intro: '`read()` returns the **whole file as one string**, including the `\\n` at the end of each line.', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
              file = open("pets.txt", "r")
              text = file.read()
              file.close()
              print(repr(text))
            ` },
              {
                label: 'readline()', intro: '`readline()` returns **one line** each time it is called, then moves on. Past the end it returns an empty string.', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
              file = open("pets.txt", "r")
              first = file.readline()
              second = file.readline()
              file.close()
              print(repr(first))
              print(repr(second))
            ` },
              {
                label: 'readlines()', intro: '`readlines()` returns a **list** with one string per line.', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
              file = open("pets.txt", "r")
              lines = file.readlines()
              file.close()
              print(lines)
              print(len(lines))
            ` },
              {
                label: 'for loop', intro: 'Looping over the handle gives one line per turn. This is the most common pattern.', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
              file = open("pets.txt", "r")
              for line in file:
                  print("Pet:", line)
              file.close()
            ` },
              {
                label: 'Past the end', intro: 'Once all lines are read, `readline()` gives `""`. That is how a program knows it has reached the end of the file.', files: { 'pets.txt': 'cat\n' }, code: C`
              file = open("pets.txt", "r")
              print(repr(file.readline()))
              print(repr(file.readline()))
              file.close()
            ` },
            ]
          },

          { t: 'h', text: 'The hidden newline' },
          { t: 'p', html: 'Every line in the file ends with a newline character `\\n`. `print()` adds its own newline as well, so you saw a blank line after each pet. `.strip()` removes the spaces and newlines at both ends of a string.' },
          {
            t: 'cases', title: 'Dealing with \\n', items: [
              {
                label: 'Without strip', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
              file = open("pets.txt", "r")
              for line in file:
                  print(len(line), line)
              file.close()
            ` },
              {
                label: 'With strip', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
              file = open("pets.txt", "r")
              for line in file:
                  line = line.strip()
                  print(len(line), line)
              file.close()
            ` },
              {
                label: 'Compare a line', intro: 'Comparing without `.strip()` fails, because `"dog\\n"` is not `"dog"`.', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
              file = open("pets.txt", "r")
              for line in file:
                  if line == "dog":
                      print("matched without strip")
                  if line.strip() == "dog":
                      print("matched with strip")
              file.close()
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Forgetting `.strip()` is the number one file mistake. If a comparison that "should" be true is false, or a number will not convert cleanly, check for a hidden `\\n`.' },

          { t: 'h', text: 'The tidy way: with' },
          { t: 'p', html: 'Python also has `with open(...) as file:`. It closes the file for you when the indented block ends, even if something goes wrong. Both styles are fine in the exam; use whichever you are told to.' },
          {
            t: 'code', title: 'with', files: { 'pets.txt': 'cat\ndog\nfish\n' }, code: C`
            with open("pets.txt", "r") as file:
                for line in file:
                    print(line.strip())
            print("The file is closed now")
          ` },

          { t: 'h', text: 'Counting things in a file' },
          {
            t: 'cases', title: 'Lines, words and characters', items: [
              {
                label: 'Lines', files: { 'poem.txt': 'Roses are red\nViolets are blue\nPython is fun\n' }, code: C`
              file = open("poem.txt", "r")
              count = 0
              for line in file:
                  count = count + 1
              file.close()
              print("Lines:", count)
            ` },
              {
                label: 'Words', files: { 'poem.txt': 'Roses are red\nViolets are blue\nPython is fun\n' }, code: C`
              file = open("poem.txt", "r")
              words = 0
              for line in file:
                  words = words + len(line.split())
              file.close()
              print("Words:", words)
            ` },
              {
                label: 'Characters', intro: 'Reading the whole text and using `len()` counts every character, including each `\\n`.', files: { 'poem.txt': 'Roses are red\nViolets are blue\nPython is fun\n' }, code: C`
              file = open("poem.txt", "r")
              text = file.read()
              file.close()
              print("Characters:", len(text))
            ` },
              {
                label: 'Search for a word', files: { 'poem.txt': 'Roses are red\nViolets are blue\nPython is fun\n' }, code: C`
              word = "blue"
              found = False
              file = open("poem.txt", "r")
              for line in file:
                  if word in line:
                      found = True
              file.close()
              if found:
                  print(word, "is in the file")
              else:
                  print(word, "is not in the file")
            ` },
            ]
          },

          { t: 'h', text: 'When the file is not there' },
          {
            t: 'cases', title: 'FileNotFoundError', items: [
              {
                label: 'The crash', expectError: true, intro: 'No file with that name exists, so Python raises `FileNotFoundError`. Check spelling, capitals and the `.txt`.', code: C`
              file = open("scores.txt", "r")
              print(file.read())
            ` },
              {
                label: 'Handled', intro: '`try / except` catches the error so the program can carry on with a friendly message.', code: C`
              try:
                  file = open("scores.txt", "r")
                  print(file.read())
                  file.close()
              except FileNotFoundError:
                  print("Sorry, scores.txt could not be found")
            ` },
              {
                label: 'Read after close', expectError: true, intro: 'Reading a closed file also crashes with a `ValueError`.', files: { 'pets.txt': 'cat\n' }, code: C`
              file = open("pets.txt", "r")
              file.close()
              print(file.read())
            ` },
              {
                label: 'Empty file', intro: 'An empty file is not an error. The loop simply runs zero times.', files: { 'empty.txt': '' }, code: C`
              file = open("empty.txt", "r")
              text = file.read()
              file.close()
              print(repr(text))
              print(len(text))
            ` },
            ]
          },

          {
            t: 'predict', code: C`
            file = open("data.txt", "r")
            a = file.readline()
            b = file.readline().strip()
            file.close()
            print(len(a), len(b))
          `, files: { 'data.txt': 'tea\ncoffee\nmilk\n' }, rows: 1, why: '`"tea\\n"` has 4 characters; `"coffee"` after strip has 6.'
          },
          {
            t: 'predict', code: C`
            file = open("nums.txt", "r")
            total = 0
            for line in file:
                total = total + int(line)
            file.close()
            print(total)
          `, files: { 'nums.txt': '4\n10\n6\n' }, rows: 1, why: '`int("4\\n")` works because int ignores surrounding whitespace, so the total is 4 + 10 + 6.'
          },
          { t: 'quiz', q: 'Which method returns the whole file as a list of lines?', options: ['read()', 'readline()', 'readlines()', 'close()'], answer: 2, why: '`readlines()` gives a list; `read()` gives one string; `readline()` gives a single line.' },
          { t: 'quiz', q: 'What does `file.readline()` return when the end of the file has been reached?', options: ['None', 'An empty string', 'An error', 'The first line again'], answer: 1, why: 'It returns `""`, an empty string, which is how you detect the end.' },
          {
            t: 'parsons', prompt: 'Arrange the lines to print every line of <code>names.txt</code> without the hidden newline.', lines: [
              'file = open("names.txt", "r")',
              'for line in file:',
              '    print(line.strip())',
              'file.close()'], why: 'Open, loop, strip inside the loop, then close after the loop.'
          },

          {
            t: 'exercise', id: 'm10-ex-firstline', title: 'First line', level: 1,
            prompt: 'The file <code>notes.txt</code> exists. Open it, read just its <strong>first line</strong>, close the file, and print that line with no extra newline or spaces.',
            files: { 'notes.txt': 'Remember your PE kit\nHomework due Friday\n' },
            starter: C`
              file = open("notes.txt", "r")
              # read the first line, then close
            `,
            solution: C`
              file = open("notes.txt", "r")
              first = file.readline().strip()
              file.close()
              print(first)
            `,
            tests: [
              { files: { 'notes.txt': 'Remember your PE kit\nHomework due Friday\n' }, out: 'Remember your PE kit' },
              { files: { 'notes.txt': 'Bring a calculator\n' }, out: 'Bring a calculator' },
              { files: { 'notes.txt': 'Only line' }, out: 'Only line', hidden: true },
            ],
            requires: [{ re: 'close\\(\\)', msg: 'Close the file with `close()`.' }],
            hints: ['`readline()` reads one line.', 'Use `.strip()` to remove the `\\n`.']
          },
          {
            t: 'exercise', id: 'm10-ex-countlines', title: 'Count the lines', level: 1,
            prompt: 'Print how many lines are in <code>shopping.txt</code>. Use a loop and a counter.',
            files: { 'shopping.txt': 'milk\nbread\neggs\napples\n' },
            starter: C`
              file = open("shopping.txt", "r")
              count = 0
              # loop through the lines and count them
              file.close()
              print(count)
            `,
            solution: C`
              file = open("shopping.txt", "r")
              count = 0
              for line in file:
                  count = count + 1
              file.close()
              print(count)
            `,
            tests: [
              { files: { 'shopping.txt': 'milk\nbread\neggs\napples\n' }, out: '4' },
              { files: { 'shopping.txt': 'tea\n' }, out: '1' },
              { files: { 'shopping.txt': '' }, out: '0', hidden: true },
            ],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['Add 1 to `count` each time round the loop.']
          },
          {
            t: 'exercise', id: 'm10-ex-sumnums', title: 'Total of the numbers', level: 2,
            prompt: '<code>numbers.txt</code> holds one whole number per line. Read them all, then print the total and the largest number on two lines, like <code>Total: 30</code> and <code>Largest: 12</code>.',
            files: { 'numbers.txt': '7\n12\n3\n8\n' },
            starter: C`
              file = open("numbers.txt", "r")
              total = 0
              for line in file:
                  total = total + line
              file.close()
              print("Total:", total)
            `,
            solution: C`
              file = open("numbers.txt", "r")
              total = 0
              largest = None
              for line in file:
                  n = int(line)
                  total = total + n
                  if largest is None or n > largest:
                      largest = n
              file.close()
              print("Total:", total)
              print("Largest:", largest)
            `,
            tests: [
              { files: { 'numbers.txt': '7\n12\n3\n8\n' }, out: 'Total: 30\nLargest: 12' },
              { files: { 'numbers.txt': '5\n' }, out: 'Total: 5\nLargest: 5' },
              { files: { 'numbers.txt': '-4\n-9\n-1\n' }, out: 'Total: -14\nLargest: -1', hidden: true },
            ],
            hints: ['A line is text. Convert it with `int()` before adding.', 'Keep a variable for the largest so far and update it when a bigger number appears.']
          },
          {
            t: 'exercise', id: 'm10-ex-searchword', title: 'Word finder', level: 2, kind: 'exam',
            prompt: 'A teacher keeps <code>words.txt</code>, one word per line. Ask the user to type a word. If it appears as a whole line in the file print <code>Found</code>, otherwise print <code>Not found</code>. Ignore capital letters.',
            files: { 'words.txt': 'apple\nBanana\ncherry\n' },
            starter: C`
              word = input("Word to find: ")
              file = open("words.txt", "r")
              for line in file:
                  if line == word:
                      print("Found")
              file.close()
            `,
            solution: C`
              word = input("Word to find: ").strip().lower()
              found = False
              file = open("words.txt", "r")
              for line in file:
                  if line.strip().lower() == word:
                      found = True
              file.close()
              if found:
                  print("Found")
              else:
                  print("Not found")
            `,
            tests: [
              { in: ['banana'], files: { 'words.txt': 'apple\nBanana\ncherry\n' }, out: 'Found' },
              { in: ['grape'], files: { 'words.txt': 'apple\nBanana\ncherry\n' }, out: 'Not found' },
              { in: ['CHERRY'], files: { 'words.txt': 'apple\nBanana\ncherry\n' }, out: 'Found', hidden: true },
              { in: ['app'], files: { 'words.txt': 'apple\n' }, out: 'Not found', hidden: true },
            ],
            hints: ['Strip and lower both the typed word and each line.', 'Use a flag variable and print the result after the loop, so the answer is printed once.']
          },
          {
            t: 'exercise', id: 'm10-ex-debug-read', title: 'Three errors in a file reader', level: 2, kind: 'debug',
            prompt: 'This program should print the number of words in <code>story.txt</code>. There are <strong>three</strong> errors. Find and fix them.',
            files: { 'story.txt': 'once upon a time\nthere was a cat\n' },
            starter: C`
              file = open("story.txt", "w")
              words = 0
              for line in file
                  words = words + len(line)
              print(words)
            `,
            solution: C`
              file = open("story.txt", "r")
              words = 0
              for line in file:
                  words = words + len(line.split())
              file.close()
              print(words)
            `,
            tests: [
              { files: { 'story.txt': 'once upon a time\nthere was a cat\n' }, out: '8' },
              { files: { 'story.txt': 'one\n' }, out: '1' },
              { files: { 'story.txt': 'a b c\n\nd e\n' }, out: '5', hidden: true },
            ],
            hints: ['The mode must be for reading.', 'A `for` line needs a colon.', '`len(line)` counts characters, not words.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'files-writing',
        title: 'Writing and appending',
        time: '35 min',
        book: 'Ch 2 · p.77-80',
        summary: 'modes w and a, write(), newlines, numbers to text',
        intro: 'A program can also create files. This is how scores, logs and settings are saved. There are two ways to put text in: replace everything (write) or add to the end (append).',
        blocks: [
          { t: 'h', text: 'Mode "w": write' },
          { t: 'p', html: 'Opening with `"w"` creates the file if it does not exist. If it **does** exist, its old contents are **erased immediately**. Then `write()` puts text in. Run this and look at the Output panel: it lists the file that was created.' },
          {
            t: 'code', title: 'Create a file', code: C`
            file = open("greeting.txt", "w")
            file.write("Hello from Python")
            file.close()
            print("Saved")
          ` },
          { t: 'p', html: 'Now the key facts about `write()`:' },
          {
            t: 'list', items: [
              '`write()` takes **one string**. Numbers must be converted with `str()` first.',
              '`write()` does **not** add a new line. You add `\\n` yourself.',
              '`write()` does not print anything on the screen.',
            ]
          },
          {
            t: 'cases', title: 'write() in detail', items: [
              {
                label: 'No newline', intro: 'Without `\\n` everything joins into one line.', code: C`
              file = open("out.txt", "w")
              file.write("one")
              file.write("two")
              file.write("three")
              file.close()
            ` },
              {
                label: 'With \\n', intro: 'Add `\\n` to end each line.', code: C`
              file = open("out.txt", "w")
              file.write("one\n")
              file.write("two\n")
              file.write("three\n")
              file.close()
            ` },
              {
                label: 'Numbers', intro: 'Convert numbers with `str()`. Use `+` to join pieces.', code: C`
              score = 87
              file = open("score.txt", "w")
              file.write(str(score) + "\n")
              file.write("Grade: " + "A" + "\n")
              file.close()
            ` },
              {
                label: 'Number error', expectError: true, intro: 'Writing a number directly is a `TypeError`.', code: C`
              file = open("score.txt", "w")
              file.write(87)
              file.close()
            ` },
              {
                label: 'In a loop', code: C`
              file = open("squares.txt", "w")
              for n in range(1, 6):
                  file.write(str(n * n) + "\n")
              file.close()
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Opening with `"w"` wipes the file **even if you write nothing**. Never open an important file with `"w"` just to look at it.' },

          { t: 'h', text: 'w erases, a appends' },
          { t: 'p', html: 'The file `log.txt` already contains two lines. Compare what each mode does to it.' },
          {
            t: 'cases', title: 'Write versus append', items: [
              {
                label: 'Start: the file', files: { 'log.txt': 'Monday: login\nTuesday: login\n' }, code: C`
              file = open("log.txt", "r")
              print(file.read())
              file.close()
            ` },
              {
                label: '"w" replaces', files: { 'log.txt': 'Monday: login\nTuesday: login\n' }, code: C`
              file = open("log.txt", "w")
              file.write("Wednesday: login\n")
              file.close()
            ` },
              {
                label: '"a" adds to the end', files: { 'log.txt': 'Monday: login\nTuesday: login\n' }, code: C`
              file = open("log.txt", "a")
              file.write("Wednesday: login\n")
              file.close()
            ` },
              {
                label: 'Append creates too', intro: 'If the file does not exist, `"a"` creates it, just like `"w"`.', code: C`
              file = open("new_log.txt", "a")
              file.write("First entry\n")
              file.close()
            ` },
              {
                label: 'Append, then read', files: { 'log.txt': 'Monday: login\n' }, code: C`
              file = open("log.txt", "a")
              file.write("Tuesday: login\n")
              file.close()

              file = open("log.txt", "r")
              for line in file:
                  print(line.strip())
              file.close()
            ` },
              {
                label: 'Cannot read in "w"', expectError: true, intro: 'A file opened for writing cannot be read from.', files: { 'log.txt': 'Monday\n' }, code: C`
              file = open("log.txt", "w")
              print(file.read())
              file.close()
            ` },
            ]
          },
          {
            t: 'table', head: ['Mode', 'Meaning', 'File exists?', 'File missing?'], rows: [
              ['`"r"`', 'read', 'reads it', '`FileNotFoundError`'],
              ['`"w"`', 'write', '**erases** it, starts empty', 'creates it'],
              ['`"a"`', 'append', 'keeps it, adds at the end', 'creates it'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'Exam wording to learn: <em>write</em> replaces the contents; <em>append</em> adds new data after the existing data. A typical question asks which one to use so that old records are not lost.' },

          { t: 'h', text: 'Saving what the user types' },
          {
            t: 'code', title: 'Guest book', stdin: ['Asha', 'Ben'], files: { 'guests.txt': 'Zara\n' }, code: C`
            for i in range(2):
                name = input("Your name: ")
                file = open("guests.txt", "a")
                file.write(name + "\n")
                file.close()
            print("Thank you")
          `, caption: 'Appending inside the loop means each name is stored straight away.'
          },
          {
            t: 'code', title: 'with also works for writing', code: C`
            with open("shopping.txt", "w") as file:
                file.write("milk\n")
                file.write("bread\n")
            print("Done")
          ` },

          {
            t: 'predict', code: C`
            file = open("t.txt", "w")
            file.write("A")
            file.write("B\n")
            file.write("C")
            file.close()
            file = open("t.txt", "r")
            print(file.read())
            file.close()
          `, rows: 2, why: 'There is a newline only after B. After printing, `C` has no newline of its own but print adds one.'
          },
          {
            t: 'predict', code: C`
            file = open("notes.txt", "w")
            file.write("one\n")
            file.close()
            file = open("notes.txt", "a")
            file.write("two\n")
            file.close()
            file = open("notes.txt", "w")
            file.write("three\n")
            file.close()
            file = open("notes.txt", "r")
            print(file.read().strip())
            file.close()
          `, rows: 1, why: 'The last `"w"` erases everything, so only `three` remains.'
          },
          { t: 'quiz', q: 'You want to add one new line to a file without losing the old lines. Which mode do you use?', options: ['"r"', '"w"', '"a"', '"x"'], answer: 2, why: 'Append keeps what is there and adds at the end.' },
          { t: 'quiz', q: 'Which line correctly writes the number <code>score</code> followed by a new line?', options: ['file.write(score)', 'file.write(score + "\\n")', 'file.write(str(score) + "\\n")', 'file.print(score)'], answer: 2, why: 'Numbers must be converted with `str()` before they can be joined to text or written.' },
          {
            t: 'sort', prompt: 'Which mode would you use for each task?', cats: ['"r"', '"w"', '"a"'], items: [
              { text: 'Display a saved list of high scores', cat: 0 },
              { text: 'Replace an old settings file with a fresh one', cat: 1 },
              { text: 'Add a new line to the end of a diary', cat: 2 },
              { text: 'Count the words in an essay stored on disk', cat: 0 },
              { text: 'Record every login time without losing earlier ones', cat: 2 },
              { text: 'Start a new empty log for a new day', cat: 1 },
            ], why: 'Reading is `r`, replacing is `w`, adding to the end is `a`.'
          },

          {
            t: 'exercise', id: 'm10-ex-writename', title: 'Write a file', level: 1,
            prompt: 'Create a file called <code>hello.txt</code> that contains the single line <code>Hello, file!</code> followed by a newline.',
            starter: C`
              # open hello.txt for writing, write the line, close it
            `,
            solution: C`
              file = open("hello.txt", "w")
              file.write("Hello, file!\n")
              file.close()
            `,
            tests: [{ files_out: { 'hello.txt': 'Hello, file!\n' }, label: 'hello.txt holds the line' }, { py: 'assert open("hello.txt").read() == "Hello, file!\\n"', label: 'File contents exactly right' }],
            hints: ['Use mode "w".', 'Remember the `\\n` at the end of the text.']
          },
          {
            t: 'exercise', id: 'm10-ex-squares', title: 'Times table file', level: 1,
            prompt: 'Write the 7 times table (7 x 1 up to 7 x 10) to <code>table7.txt</code>, one answer per line (7, 14, 21 ... 70). Use a loop.',
            starter: C`
              file = open("table7.txt", "w")
              # loop and write each answer
              file.close()
            `,
            solution: C`
              file = open("table7.txt", "w")
              for i in range(1, 11):
                  file.write(str(7 * i) + "\n")
              file.close()
            `,
            tests: [{ py: 'assert open("table7.txt").read() == "".join(str(7*i)+"\\n" for i in range(1,11))', label: 'File has ten correct lines' }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['`range(1, 11)` gives 1 to 10.', 'Convert the answer with `str()` and add `\\n`.']
          },
          {
            t: 'exercise', id: 'm10-ex-appendlog', title: 'Add to the diary', level: 2,
            prompt: '<code>diary.txt</code> already has entries. Ask the user for a new entry and <strong>add</strong> it as a new line at the end. Do not lose the old entries.',
            files: { 'diary.txt': 'Went to school\nPlayed football\n' },
            starter: C`
              entry = input("Entry: ")
              file = open("diary.txt", "w")
              file.write(entry + "\n")
              file.close()
            `,
            solution: C`
              entry = input("Entry: ")
              file = open("diary.txt", "a")
              file.write(entry + "\n")
              file.close()
            `,
            tests: [
              { in: ['Did homework'], files: { 'diary.txt': 'Went to school\nPlayed football\n' }, files_out: { 'diary.txt': 'Went to school\nPlayed football\nDid homework\n' } },
              { in: ['Slept'], files: { 'diary.txt': 'Day one\n' }, files_out: { 'diary.txt': 'Day one\nSlept\n' } },
              { in: ['First'], files: {}, files_out: { 'diary.txt': 'First\n' }, hidden: true },
            ],
            hints: ['One letter is wrong in the starter: which mode keeps old data?']
          },
          {
            t: 'exercise', id: 'm10-ex-copyupper', title: 'Shout it', level: 2,
            prompt: 'Read <code>quiet.txt</code> and write every line in <strong>capital letters</strong> to <code>loud.txt</code>. Keep the same lines.',
            files: { 'quiet.txt': 'hello there\nhow are you\n' },
            starter: C`
              source = open("quiet.txt", "r")
              target = open("loud.txt", "w")
              for line in source:
                  # write the capital version
                  pass
              source.close()
              target.close()
            `,
            solution: C`
              source = open("quiet.txt", "r")
              target = open("loud.txt", "w")
              for line in source:
                  target.write(line.upper())
              source.close()
              target.close()
            `,
            tests: [
              { files: { 'quiet.txt': 'hello there\nhow are you\n' }, files_out: { 'loud.txt': 'HELLO THERE\nHOW ARE YOU\n' } },
              { files: { 'quiet.txt': 'a\n' }, files_out: { 'loud.txt': 'A\n' } },
              { files: { 'quiet.txt': 'Mixed Case 12\n\nend\n' }, files_out: { 'loud.txt': 'MIXED CASE 12\n\nEND\n' }, hidden: true },
            ],
            hints: ['`line.upper()` already keeps the `\\n`, so you can write it straight out.', 'Two files are open at once: one "r", one "w".']
          },
          {
            t: 'exercise', id: 'm10-ex-scoreboard', title: 'Save the scores', level: 3, kind: 'exam',
            prompt: 'A quiz program asks for <strong>3</strong> scores (whole numbers). Save each score on its own line in <code>scores.txt</code> (replacing any old file). Then print <code>Saved 3 scores. Total: </code> followed by the total.',
            starter: C`
              file = open("scores.txt", "w")
              total = 0
              for i in range(3):
                  score = input("Score: ")
                  file.write(score)
              file.close()
              print("Saved 3 scores. Total:", total)
            `,
            solution: C`
              file = open("scores.txt", "w")
              total = 0
              for i in range(3):
                  score = int(input("Score: "))
                  file.write(str(score) + "\n")
                  total = total + score
              file.close()
              print("Saved 3 scores. Total:", total)
            `,
            tests: [
              { in: ['5', '8', '10'], out: 'Saved 3 scores. Total: 23', files_out: { 'scores.txt': '5\n8\n10\n' } },
              { in: ['0', '0', '1'], out: 'Saved 3 scores. Total: 1', files_out: { 'scores.txt': '0\n0\n1\n' } },
              { in: ['20', '30', '40'], out: 'Saved 3 scores. Total: 90', hidden: true },
            ],
            hints: ['Convert with `int()` so you can total them.', 'You need `\\n` after each stored score, and `str()` if you converted.']
          },
          {
            t: 'exercise', id: 'm10-ex-debug-write', title: 'Four errors in a writer', level: 2, kind: 'debug',
            prompt: 'This program should append the three names to <code>team.txt</code>, each on its own line, keeping the names already there. There are <strong>four</strong> errors.',
            files: { 'team.txt': 'Mia\n' },
            starter: C`
              names = ["Omar", "Lily", "Jack"]
              file = open("team.txt", "w")
              for name in names:
                  file.write(name)
              print("Team saved")
            `,
            solution: C`
              names = ["Omar", "Lily", "Jack"]
              file = open("team.txt", "a")
              for name in names:
                  file.write(name + "\n")
              file.close()
              print("Team saved")
            `,
            tests: [
              { files: { 'team.txt': 'Mia\n' }, files_out: { 'team.txt': 'Mia\nOmar\nLily\nJack\n' }, out: 'Team saved' },
              { files: { 'team.txt': '' }, files_out: { 'team.txt': 'Omar\nLily\nJack\n' }, out: 'Team saved', hidden: true },
            ],
            hints: ['Which mode keeps old data?', 'Names need a newline after each.', 'Close the file.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'files-with-lists',
        title: 'Files and lists',
        time: '35 min',
        book: 'Ch 2 · p.73-80',
        summary: 'file to list, list to file, edit and save',
        intro: 'Most programs do not process a file line by line forever. They load it into a list, work on the list (sort, search, add, remove) and save it back.',
        blocks: [
          { t: 'h', text: 'File to list' },
          {
            t: 'cases', title: 'Four ways to build a list from a file', items: [
              {
                label: 'append in a loop', intro: 'The standard way. Strip each line, then append.', files: { 'names.txt': 'Asha\nBen\nChloe\n' }, code: C`
              names = []
              file = open("names.txt", "r")
              for line in file:
                  names.append(line.strip())
              file.close()
              print(names)
            ` },
              {
                label: 'readlines', intro: '`readlines()` is shorter, but the `\\n` stays on every item.', files: { 'names.txt': 'Asha\nBen\nChloe\n' }, code: C`
              file = open("names.txt", "r")
              names = file.readlines()
              file.close()
              print(names)
            ` },
              {
                label: 'read + split', intro: '`read().split("\\n")` gives no `\\n`, but a final empty item appears because the file ends with a newline.', files: { 'names.txt': 'Asha\nBen\nChloe\n' }, code: C`
              file = open("names.txt", "r")
              names = file.read().split("\n")
              file.close()
              print(names)
            ` },
              {
                label: 'splitlines', intro: '`splitlines()` removes newlines and does not leave a final empty item.', files: { 'names.txt': 'Asha\nBen\nChloe\n' }, code: C`
              file = open("names.txt", "r")
              names = file.read().splitlines()
              file.close()
              print(names)
            ` },
              {
                label: 'Numbers', intro: 'Convert as you load, so the list holds numbers and not text.', files: { 'temps.txt': '12\n15\n9\n' }, code: C`
              temps = []
              file = open("temps.txt", "r")
              for line in file:
                  temps.append(int(line))
              file.close()
              print(temps)
              print("Highest:", max(temps))
              print("Average:", sum(temps) / len(temps))
            ` },
            ]
          },

          { t: 'h', text: 'List to file' },
          {
            t: 'cases', title: 'Saving a list', items: [
              {
                label: 'Loop', code: C`
              colours = ["red", "green", "blue"]
              file = open("colours.txt", "w")
              for colour in colours:
                  file.write(colour + "\n")
              file.close()
            ` },
              {
                label: 'Numbers', code: C`
              scores = [12, 7, 30]
              file = open("scores.txt", "w")
              for s in scores:
                  file.write(str(s) + "\n")
              file.close()
            ` },
              {
                label: 'join', intro: '`"\\n".join(list)` makes one string. It needs a list of strings, and puts `\\n` only **between** items.', code: C`
              colours = ["red", "green", "blue"]
              file = open("colours.txt", "w")
              file.write("\n".join(colours) + "\n")
              file.close()
            ` },
              {
                label: 'join error', expectError: true, intro: '`join` does not accept numbers.', code: C`
              scores = [12, 7, 30]
              print("\n".join(scores))
            ` },
              {
                label: 'Round trip', intro: 'Save then load: the list comes back unchanged.', code: C`
              items = ["pen", "ruler", "glue"]
              file = open("kit.txt", "w")
              for item in items:
                  file.write(item + "\n")
              file.close()

              again = []
              file = open("kit.txt", "r")
              for line in file:
                  again.append(line.strip())
              file.close()
              print(again == items)
            ` },
            ]
          },

          { t: 'h', text: 'Load, change, save' },
          { t: 'p', html: 'You cannot edit one line inside a file directly. The safe plan is: **read** all lines into a list, **change** the list, **write** the whole list back with `"w"`.' },
          {
            t: 'cases', title: 'Edit patterns', items: [
              {
                label: 'Sort and save', files: { 'names.txt': 'Chloe\nAsha\nBen\n' }, code: C`
              names = []
              file = open("names.txt", "r")
              for line in file:
                  names.append(line.strip())
              file.close()

              names.sort()

              file = open("names.txt", "w")
              for name in names:
                  file.write(name + "\n")
              file.close()
              print(names)
            ` },
              {
                label: 'Remove an item', files: { 'items.txt': 'pen\nruler\nglue\n' }, stdin: ['ruler'], code: C`
              items = []
              file = open("items.txt", "r")
              for line in file:
                  items.append(line.strip())
              file.close()

              target = input("Remove which? ")
              if target in items:
                  items.remove(target)
                  print("Removed", target)
              else:
                  print("Not in the file")

              file = open("items.txt", "w")
              for item in items:
                  file.write(item + "\n")
              file.close()
            ` },
              {
                label: 'Append only', intro: 'If you only add a line, no need to load anything: use `"a"`.', files: { 'items.txt': 'pen\nruler\n' }, code: C`
              file = open("items.txt", "a")
              file.write("glue\n")
              file.close()
            ` },
              {
                label: 'Blank lines', intro: 'A blank line in a file becomes an empty string. Skip those with `if line.strip() != ""`.', files: { 'names.txt': 'Asha\n\nBen\n\n' }, code: C`
              names = []
              file = open("names.txt", "r")
              for line in file:
                  line = line.strip()
                  if line != "":
                      names.append(line)
              file.close()
              print(names)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Open for `"w"` **after** you have finished reading and closed the file. If you open for `"w"` first, the data is already erased and there is nothing left to read.' },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode: `FOR EACH line FROM file DO` ... corresponds to Python `for line in file:`. Questions often say "store the lines in an array" which here means a list.' },

          {
            t: 'predict', code: C`
            file = open("c.txt", "r")
            items = file.readlines()
            file.close()
            print(len(items))
            print(items[1])
            print(items[1].strip() == "b")
          `, files: { 'c.txt': 'a\nb\nc\n' }, rows: 4, why: '3 lines. `items[1]` is `"b\\n"`, printed with an extra blank line. After strip it equals `"b"`.'
          },
          {
            t: 'predict', code: C`
            file = open("d.txt", "r")
            data = file.read().split("\n")
            file.close()
            print(len(data))
          `, files: { 'd.txt': 'x\ny\n' }, rows: 1, why: 'The text `x\\ny\\n` splits into `["x", "y", ""]`: 3 items.'
          },
          { t: 'quiz', q: 'A file has 5 lines, each ending with a newline. After `data = file.read().split("\\n")`, how many items does `data` have?', options: ['4', '5', '6', 'It depends on the line lengths'], answer: 2, why: 'The final newline leaves an empty string at the end: 5 lines + 1 = 6.' },
          {
            t: 'parsons', prompt: 'Arrange the program that loads <code>words.txt</code> into a list, sorts it and saves it back.', lines: [
              'words = []',
              'file = open("words.txt", "r")',
              'for line in file:',
              '    words.append(line.strip())',
              'file.close()',
              'words.sort()',
              'file = open("words.txt", "w")',
              'for w in words:',
              '    file.write(w + "\\n")',
              'file.close()'], why: 'Read and close first, change the list, then open for writing and write each item.'
          },

          {
            t: 'exercise', id: 'm10-ex-loadlist', title: 'Load the names', level: 1,
            prompt: 'Load <code>friends.txt</code> into a list called <code>friends</code> (no newlines on the items), then print the list.',
            files: { 'friends.txt': 'Amir\nBella\nCal\n' },
            starter: C`
              friends = []
              # open the file, append each stripped line, close
              print(friends)
            `,
            solution: C`
              friends = []
              file = open("friends.txt", "r")
              for line in file:
                  friends.append(line.strip())
              file.close()
              print(friends)
            `,
            tests: [
              { files: { 'friends.txt': 'Amir\nBella\nCal\n' }, out: "['Amir', 'Bella', 'Cal']" },
              { files: { 'friends.txt': 'Zed\n' }, out: "['Zed']" },
              { files: { 'friends.txt': '' }, out: '[]', hidden: true },
            ],
            hints: ['Append `line.strip()` inside a `for` loop.']
          },
          {
            t: 'exercise', id: 'm10-ex-reverselist', title: 'Reverse the file', level: 2,
            prompt: 'Read <code>queue.txt</code> and rewrite it with the lines in <strong>reverse order</strong> (the last line becomes the first).',
            files: { 'queue.txt': 'first\nsecond\nthird\n' },
            starter: C`
              lines = []
              file = open("queue.txt", "r")
              for line in file:
                  lines.append(line.strip())
              file.close()
              # reverse and save
            `,
            solution: C`
              lines = []
              file = open("queue.txt", "r")
              for line in file:
                  lines.append(line.strip())
              file.close()
              lines.reverse()
              file = open("queue.txt", "w")
              for line in lines:
                  file.write(line + "\n")
              file.close()
            `,
            tests: [
              { files: { 'queue.txt': 'first\nsecond\nthird\n' }, files_out: { 'queue.txt': 'third\nsecond\nfirst\n' } },
              { files: { 'queue.txt': 'a\n' }, files_out: { 'queue.txt': 'a\n' } },
              { files: { 'queue.txt': '1\n2\n3\n4\n' }, files_out: { 'queue.txt': '4\n3\n2\n1\n' }, hidden: true },
            ],
            hints: ['`lines.reverse()` or `lines[::-1]`.', 'Write after closing the read.']
          },
          {
            t: 'exercise', id: 'm10-ex-removeitem', title: 'Remove from a list file', level: 2, kind: 'exam',
            prompt: '<code>stock.txt</code> lists items in a shop, one per line. Ask for an item to remove. If it is in the file, remove it, save the file and print <code>Removed</code>. If not, print <code>Not found</code> and leave the file unchanged.',
            files: { 'stock.txt': 'apples\npears\nplums\n' },
            starter: C`
              item = input("Item to remove: ")
              stock = []
              file = open("stock.txt", "r")
              for line in file:
                  stock.append(line.strip())
              file.close()
              stock.remove(item)
              print("Removed")
            `,
            solution: C`
              item = input("Item to remove: ")
              stock = []
              file = open("stock.txt", "r")
              for line in file:
                  stock.append(line.strip())
              file.close()
              if item in stock:
                  stock.remove(item)
                  file = open("stock.txt", "w")
                  for s in stock:
                      file.write(s + "\n")
                  file.close()
                  print("Removed")
              else:
                  print("Not found")
            `,
            tests: [
              { in: ['pears'], files: { 'stock.txt': 'apples\npears\nplums\n' }, out: 'Removed', files_out: { 'stock.txt': 'apples\nplums\n' } },
              { in: ['kiwi'], files: { 'stock.txt': 'apples\npears\nplums\n' }, out: 'Not found', files_out: { 'stock.txt': 'apples\npears\nplums\n' } },
              { in: ['apples'], files: { 'stock.txt': 'apples\n' }, out: 'Removed', files_out: { 'stock.txt': '' }, hidden: true },
            ],
            hints: ['Check `item in stock` first.', 'Write the file only in the branch where you removed something.']
          },
          {
            t: 'exercise', id: 'm10-ex-topthree', title: 'Top three', level: 3,
            prompt: '<code>marks.txt</code> has one whole-number mark per line (at least 3 lines). Print the three highest marks, biggest first, each on its own line.',
            files: { 'marks.txt': '56\n91\n78\n62\n85\n' },
            starter: C`
              marks = []
              file = open("marks.txt", "r")
              for line in file:
                  marks.append(line)
              file.close()
              marks.sort()
              print(marks[0])
              print(marks[1])
              print(marks[2])
            `,
            solution: C`
              marks = []
              file = open("marks.txt", "r")
              for line in file:
                  marks.append(int(line))
              file.close()
              marks.sort(reverse=True)
              for i in range(3):
                  print(marks[i])
            `,
            tests: [
              { files: { 'marks.txt': '56\n91\n78\n62\n85\n' }, out: '91\n85\n78' },
              { files: { 'marks.txt': '5\n100\n20\n' }, out: '100\n20\n5' },
              { files: { 'marks.txt': '9\n10\n8\n10\n' }, out: '10\n10\n9', hidden: true },
            ],
            hints: ['Convert with `int()`: `"100"` sorts before `"20"` as text.', '`sort(reverse=True)` puts biggest first.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'files-2d',
        title: 'Files of records',
        time: '40 min',
        book: 'Ch 2 · p.73-80',
        summary: 'name,score lines, split(","), 2D lists, join, update records',
        intro: 'Real files hold records: several fields on one line, such as a name and a score. You split each line into pieces, giving a 2D list, and join the pieces again to save.',
        blocks: [
          { t: 'h', text: 'A record on one line' },
          { t: 'p', html: 'A **record** is a group of related fields. In a text file, fields are often separated by a comma. This is called a **delimiter**. The file below has one record per line: name, score.' },
          {
            t: 'code', title: 'split(",")', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, code: C`
            file = open("scores.txt", "r")
            for line in file:
                parts = line.strip().split(",")
                print(parts)
                print("Name:", parts[0], "Score:", parts[1])
            file.close()
          `, caption: 'Each `parts` is a list of strings. The score is still **text**: `"72"`, not 72.'
          },

          {
            t: 'cases', title: 'File to 2D list', items: [
              {
                label: 'Strings only', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, code: C`
              table = []
              file = open("scores.txt", "r")
              for line in file:
                  table.append(line.strip().split(","))
              file.close()
              print(table)
              print(table[1][0])
            ` },
              {
                label: 'Convert the score', intro: 'Convert the number field with `int()` as you load.', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, code: C`
              table = []
              file = open("scores.txt", "r")
              for line in file:
                  parts = line.strip().split(",")
                  parts[1] = int(parts[1])
                  table.append(parts)
              file.close()
              print(table)
              print(table[2][1] + 1)
            ` },
              {
                label: 'Three fields', files: { 'pupils.txt': 'Asha,10A,72\nBen,10B,58\n' }, code: C`
              table = []
              file = open("pupils.txt", "r")
              for line in file:
                  name, form, score = line.strip().split(",")
                  table.append([name, form, int(score)])
              file.close()
              for row in table:
                  print(row[0], "is in", row[1])
            ` },
              {
                label: 'Forgot to convert', expectError: true, intro: 'Adding to a `str` score is a `TypeError`.', files: { 'scores.txt': 'Asha,72\n' }, code: C`
              file = open("scores.txt", "r")
              line = file.readline().strip().split(",")
              file.close()
              print(line[1] + 5)
            ` },
              {
                label: 'Short line', expectError: true, intro: 'A line with a missing field makes `parts[1]` an `IndexError`.', files: { 'scores.txt': 'Asha,72\nBen\n' }, code: C`
              file = open("scores.txt", "r")
              for line in file:
                  parts = line.strip().split(",")
                  print(parts[1])
              file.close()
            ` },
            ]
          },

          { t: 'h', text: 'Using the data' },
          {
            t: 'cases', title: 'Average, highest, search', items: [
              {
                label: 'Average', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, code: C`
              total = 0
              count = 0
              file = open("scores.txt", "r")
              for line in file:
                  parts = line.strip().split(",")
                  total = total + int(parts[1])
                  count = count + 1
              file.close()
              print("Average:", total / count)
            ` },
              {
                label: 'Highest', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, code: C`
              best_name = ""
              best_score = -1
              file = open("scores.txt", "r")
              for line in file:
                  name, score = line.strip().split(",")
                  score = int(score)
                  if score > best_score:
                      best_score = score
                      best_name = name
              file.close()
              print(best_name, "scored", best_score)
            ` },
              {
                label: 'Look up', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, stdin: ['Ben'], code: C`
              wanted = input("Name: ")
              result = "No such pupil"
              file = open("scores.txt", "r")
              for line in file:
                  name, score = line.strip().split(",")
                  if name == wanted:
                      result = score
              file.close()
              print(result)
            ` },
            ]
          },

          { t: 'h', text: '2D list back to file' },
          { t: 'p', html: '`",".join(row)` glues a list of strings together with commas. Numbers must be converted to strings first.' },
          {
            t: 'cases', title: 'Saving records', items: [
              {
                label: 'join strings', code: C`
              table = [["Asha", "72"], ["Ben", "58"]]
              file = open("out.txt", "w")
              for row in table:
                  file.write(",".join(row) + "\n")
              file.close()
            ` },
              {
                label: 'with numbers', code: C`
              table = [["Asha", 72], ["Ben", 58]]
              file = open("out.txt", "w")
              for row in table:
                  file.write(row[0] + "," + str(row[1]) + "\n")
              file.close()
            ` },
              {
                label: 'f-string', intro: 'An f-string converts numbers for you.', code: C`
              table = [["Asha", 72], ["Ben", 58]]
              file = open("out.txt", "w")
              for name, score in table:
                  file.write(f"{name},{score}\n")
              file.close()
            ` },
              {
                label: 'Append a record', files: { 'scores.txt': 'Asha,72\n' }, stdin: ['Dev', '66'], code: C`
              name = input("Name: ")
              score = input("Score: ")
              file = open("scores.txt", "a")
              file.write(name + "," + score + "\n")
              file.close()
            ` },
              {
                label: 'Update a record', intro: 'Load everything, change one field, write everything back.', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, stdin: ['Ben', '65'], code: C`
              who = input("Name: ")
              new_score = input("New score: ")
              table = []
              file = open("scores.txt", "r")
              for line in file:
                  table.append(line.strip().split(","))
              file.close()

              for row in table:
                  if row[0] == who:
                      row[1] = new_score

              file = open("scores.txt", "w")
              for row in table:
                  file.write(",".join(row) + "\n")
              file.close()
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'A trailing blank line in the file gives `[""]` when split, and `parts[1]` then crashes. Skip blank lines with `if line.strip() == "": continue`. Also remember a comma inside a name would break a comma-separated file.' },
          { t: 'note', kind: 'exam', html: 'Exam tasks say "read the records from the file into a 2D array". Each row is one record, each column one field. Mention that the numeric field must be converted to an integer.' },

          {
            t: 'predict', code: C`
            parts = "Ravi,10C,88".split(",")
            print(len(parts))
            print(parts[2] + "1")
            print(int(parts[2]) + 1)
          `, rows: 3, why: 'Three fields. `"88" + "1"` joins the text, while `int` adds numerically.'
          },
          {
            t: 'predict', code: C`
            table = []
            file = open("p.txt", "r")
            for line in file:
                table.append(line.strip().split(","))
            file.close()
            print(table[1][0], len(table))
          `, files: { 'p.txt': 'A,1\nB,2\nC,3\n' }, rows: 1, why: 'Three rows; row 1 is `["B","2"]` so `table[1][0]` is `B`.'
          },
          { t: 'quiz', q: 'What type is <code>parts[1]</code> after <code>parts = "Ben,58".split(",")</code>?', options: ['int', 'float', 'str', 'list'], answer: 2, why: '`split` always gives strings. Convert with `int()` if you need to calculate.' },
          {
            t: 'sort', prompt: 'Which action happens when we LOAD a file and which when we SAVE it?', cats: ['Load', 'Save'], items: [
              { text: '`line.strip().split(",")`', cat: 0 },
              { text: '`",".join(row)`', cat: 1 },
              { text: '`int(parts[1])`', cat: 0 },
              { text: '`str(score)`', cat: 1 },
              { text: '`open(name, "w")`', cat: 1 },
              { text: '`table.append(parts)`', cat: 0 },
            ], why: 'Loading splits and converts; saving converts back to text and joins.'
          },

          {
            t: 'exercise', id: 'm10-ex-classaverage', title: 'Class average', level: 2,
            prompt: '<code>results.txt</code> has lines like <code>Asha,72</code>. Print the average score to 1 decimal place (use <code>round(x, 1)</code>).',
            files: { 'results.txt': 'Asha,72\nBen,58\nChloe,91\n' },
            starter: C`
              total = 0
              count = 0
              file = open("results.txt", "r")
              for line in file:
                  parts = line.strip().split(",")
                  total = total + parts[1]
                  count = count + 1
              file.close()
              print(total / count)
            `,
            solution: C`
              total = 0
              count = 0
              file = open("results.txt", "r")
              for line in file:
                  parts = line.strip().split(",")
                  total = total + int(parts[1])
                  count = count + 1
              file.close()
              print(round(total / count, 1))
            `,
            tests: [
              { files: { 'results.txt': 'Asha,72\nBen,58\nChloe,91\n' }, out: '73.7' },
              { files: { 'results.txt': 'A,10\nB,20\n' }, out: '15.0' },
              { files: { 'results.txt': 'X,100\n' }, out: '100.0', hidden: true },
            ],
            hints: ['The second field is text; convert it.', 'Divide after the loop.']
          },
          {
            t: 'exercise', id: 'm10-ex-passfail', title: 'Pass or fail report', level: 2,
            prompt: 'Read <code>exam.txt</code> (lines like <code>Ben,58</code>). Write a new file <code>report.txt</code> with a line for each pupil in the form <code>Ben: Pass</code> when the score is 50 or more, or <code>Ben: Fail</code> otherwise.',
            files: { 'exam.txt': 'Asha,72\nBen,45\nChloe,50\n' },
            starter: C`
              source = open("exam.txt", "r")
              target = open("report.txt", "w")
              for line in source:
                  name, score = line.strip().split(",")
                  # decide and write
              source.close()
              target.close()
            `,
            solution: C`
              source = open("exam.txt", "r")
              target = open("report.txt", "w")
              for line in source:
                  name, score = line.strip().split(",")
                  if int(score) >= 50:
                      target.write(name + ": Pass\n")
                  else:
                      target.write(name + ": Fail\n")
              source.close()
              target.close()
            `,
            tests: [
              { files: { 'exam.txt': 'Asha,72\nBen,45\nChloe,50\n' }, files_out: { 'report.txt': 'Asha: Pass\nBen: Fail\nChloe: Pass\n' } },
              { files: { 'exam.txt': 'Zed,49\n' }, files_out: { 'report.txt': 'Zed: Fail\n' } },
              { files: { 'exam.txt': 'A,0\nB,100\n' }, files_out: { 'report.txt': 'A: Fail\nB: Pass\n' }, hidden: true },
            ],
            hints: ['Boundary: 50 is a pass.']
          },
          {
            t: 'exercise', id: 'm10-ex-addrecord', title: 'Register a new pupil', level: 2, kind: 'exam',
            prompt: 'Ask for a name and a score. Add the record to <code>pupils.txt</code> in the form <code>name,score</code> without losing existing records. Then print <code>Record added</code>.',
            files: { 'pupils.txt': 'Asha,72\n' },
            starter: C`
              name = input("Name: ")
              score = input("Score: ")
              file = open("pupils.txt", "w")
              file.write(name + score)
              file.close()
              print("Record added")
            `,
            solution: C`
              name = input("Name: ")
              score = input("Score: ")
              file = open("pupils.txt", "a")
              file.write(name + "," + score + "\n")
              file.close()
              print("Record added")
            `,
            tests: [
              { in: ['Dev', '66'], files: { 'pupils.txt': 'Asha,72\n' }, out: 'Record added', files_out: { 'pupils.txt': 'Asha,72\nDev,66\n' } },
              { in: ['Lee', '0'], files: { 'pupils.txt': '' }, out: 'Record added', files_out: { 'pupils.txt': 'Lee,0\n' } },
              { in: ['Mo', '100'], files: { 'pupils.txt': 'A,1\nB,2\n' }, out: 'Record added', files_out: { 'pupils.txt': 'A,1\nB,2\nMo,100\n' }, hidden: true },
            ],
            hints: ['Append mode, comma between fields, newline at the end.']
          },
          {
            t: 'exercise', id: 'm10-ex-updatescore', title: 'Update a score', level: 3,
            prompt: 'Ask for a name and a new score. Update that pupil in <code>league.txt</code> (lines <code>name,score</code>) and save the whole file. If the name is not found print <code>No such pupil</code> and leave the file as it was. Otherwise print <code>Updated</code>.',
            files: { 'league.txt': 'Asha,72\nBen,58\nChloe,91\n' },
            starter: C`
              who = input("Name: ")
              new_score = input("New score: ")
              table = []
              file = open("league.txt", "r")
              for line in file:
                  table.append(line.strip().split(","))
              file.close()
              for row in table:
                  if row[0] == who:
                      row[1] = new_score
              print("Updated")
            `,
            solution: C`
              who = input("Name: ")
              new_score = input("New score: ")
              table = []
              file = open("league.txt", "r")
              for line in file:
                  table.append(line.strip().split(","))
              file.close()
              found = False
              for row in table:
                  if row[0] == who:
                      row[1] = new_score
                      found = True
              if found:
                  file = open("league.txt", "w")
                  for row in table:
                      file.write(",".join(row) + "\n")
                  file.close()
                  print("Updated")
              else:
                  print("No such pupil")
            `,
            tests: [
              { in: ['Ben', '65'], files: { 'league.txt': 'Asha,72\nBen,58\nChloe,91\n' }, out: 'Updated', files_out: { 'league.txt': 'Asha,72\nBen,65\nChloe,91\n' } },
              { in: ['Zoe', '10'], files: { 'league.txt': 'Asha,72\nBen,58\n' }, out: 'No such pupil', files_out: { 'league.txt': 'Asha,72\nBen,58\n' } },
              { in: ['Asha', '0'], files: { 'league.txt': 'Asha,72\n' }, out: 'Updated', files_out: { 'league.txt': 'Asha,0\n' }, hidden: true },
            ],
            hints: ['Use a `found` flag.', 'Write the file only if found.']
          },
          {
            t: 'exercise', id: 'm10-ex-debug-records', title: 'Four errors in a record reader', level: 3, kind: 'debug',
            prompt: 'This program should print the name of the pupil with the highest score in <code>quiz.txt</code> (lines like <code>Asha,7</code>). There are <strong>four</strong> errors.',
            files: { 'quiz.txt': 'Asha,7\nBen,9\nChloe,4\n' },
            starter: C`
              best = 0
              best_name = ""
              file = open("quiz.txt")
              for line in file:
                  parts = line.split(";")
                  if parts[1] > best:
                      best = parts[1]
                      best_name = parts[0]
              print(best_name)
            `,
            solution: C`
              best = 0
              best_name = ""
              file = open("quiz.txt", "r")
              for line in file:
                  parts = line.strip().split(",")
                  if int(parts[1]) > best:
                      best = int(parts[1])
                      best_name = parts[0]
              file.close()
              print(best_name)
            `,
            tests: [
              { files: { 'quiz.txt': 'Asha,7\nBen,9\nChloe,4\n' }, out: 'Ben' },
              { files: { 'quiz.txt': 'A,10\nB,9\n' }, out: 'A' },
              { files: { 'quiz.txt': 'X,1\n' }, out: 'X', hidden: true },
            ],
            requires: [{ re: 'close\\(\\)', msg: 'Close the file.' }],
            hints: ['The separator in the file is a comma.', 'Scores are text until converted: `"10"` compares less than `"9"` as text.', 'Close the file after the loop.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'files-subprograms',
        title: 'Files and subprograms',
        time: '40 min',
        book: 'Ch 2 · p.73-80',
        summary: 'read_scores(filename), save_scores(filename, data), small file apps',
        intro: 'Put each file job inside a function: one to load, one to save, one to do the calculation. Your main program then reads like a short plan.',
        blocks: [
          { t: 'h', text: 'Load and save as functions' },
          { t: 'p', html: 'Passing the filename as a **parameter** lets the same function read any file. The function **returns** the data it loaded, and the caller keeps it.' },
          {
            t: 'cases', title: 'The two core subprograms', items: [
              {
                label: 'read_lines', files: { 'names.txt': 'Asha\nBen\nChloe\n' }, code: C`
              def read_lines(filename):
                  lines = []
                  file = open(filename, "r")
                  for line in file:
                      lines.append(line.strip())
                  file.close()
                  return lines

              names = read_lines("names.txt")
              print(names)
            ` },
              {
                label: 'save_lines', code: C`
              def save_lines(filename, lines):
                  file = open(filename, "w")
                  for line in lines:
                      file.write(line + "\n")
                  file.close()

              save_lines("colours.txt", ["red", "green", "blue"])
              print("Saved")
            ` },
              {
                label: 'read_scores', intro: 'Returns a 2D list with converted scores.', files: { 'scores.txt': 'Asha,72\nBen,58\n' }, code: C`
              def read_scores(filename):
                  table = []
                  file = open(filename, "r")
                  for line in file:
                      name, score = line.strip().split(",")
                      table.append([name, int(score)])
                  file.close()
                  return table

              table = read_scores("scores.txt")
              print(table)
            ` },
              {
                label: 'save_scores', code: C`
              def save_scores(filename, table):
                  file = open(filename, "w")
                  for row in table:
                      file.write(row[0] + "," + str(row[1]) + "\n")
                  file.close()

              save_scores("out.txt", [["Asha", 72], ["Ben", 58]])
            ` },
              {
                label: 'Missing file', intro: 'Return an empty list if the file is missing, so the program does not crash on its first run.', code: C`
              def read_lines(filename):
                  lines = []
                  try:
                      file = open(filename, "r")
                      for line in file:
                          lines.append(line.strip())
                      file.close()
                  except FileNotFoundError:
                      pass
                  return lines

              print(read_lines("nothing_here.txt"))
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'Press **Trace** on the full program below to watch Python jump into a function and back out. Notice that the file handle is a **local** variable: it exists only while the function runs.' },
          {
            t: 'code', title: 'A small program in parts', files: { 'scores.txt': 'Asha,72\nBen,58\nChloe,91\n' }, code: C`
            def read_scores(filename):
                table = []
                file = open(filename, "r")
                for line in file:
                    name, score = line.strip().split(",")
                    table.append([name, int(score)])
                file.close()
                return table

            def average(table):
                total = 0
                for row in table:
                    total = total + row[1]
                return total / len(table)

            def highest(table):
                best = table[0]
                for row in table:
                    if row[1] > best[1]:
                        best = row
                return best

            scores = read_scores("scores.txt")
            print("Average:", round(average(scores), 1))
            top = highest(scores)
            print("Top:", top[0], top[1])
          ` },
          { t: 'h', text: 'Add, update and save as procedures' },
          {
            t: 'cases', title: 'Changing the data', items: [
              {
                label: 'add_record', intro: 'A **procedure** changes something but returns nothing. Here it appends to the file.', files: { 'scores.txt': 'Asha,72\n' }, code: C`
              def add_record(filename, name, score):
                  file = open(filename, "a")
                  file.write(name + "," + str(score) + "\n")
                  file.close()

              add_record("scores.txt", "Dev", 66)
            ` },
              {
                label: 'update_score', intro: 'Works on the list and returns True or False to say whether it found the name.', code: C`
              def update_score(table, name, new_score):
                  for row in table:
                      if row[0] == name:
                          row[1] = new_score
                          return True
                  return False

              data = [["Asha", 72], ["Ben", 58]]
              print(update_score(data, "Ben", 65))
              print(update_score(data, "Zoe", 1))
              print(data)
            ` },
              {
                label: 'count_lines', files: { 'a.txt': 'x\ny\nz\n' }, code: C`
              def count_lines(filename):
                  file = open(filename, "r")
                  n = 0
                  for line in file:
                      n = n + 1
                  file.close()
                  return n

              print(count_lines("a.txt"))
            ` },
              {
                label: 'Printing is not returning', intro: 'A function that only prints gives back `None`. Return the value so the caller can use it.', files: { 'a.txt': 'x\ny\nz\n' }, code: C`
              def count_lines(filename):
                  file = open(filename, "r")
                  n = 0
                  for line in file:
                      n = n + 1
                  file.close()
                  print(n)

              result = count_lines("a.txt")
              print(result + 1 if result else "nothing returned")
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode: `PROCEDURE save(filename, data) ... END PROCEDURE` and `FUNCTION read(filename) ... RETURN lines ... END FUNCTION`. A procedure does not return a value; a function does. Name your parameters clearly: `filename`, `scores`.' },

          {
            t: 'predict', code: C`
            def first_line(filename):
                file = open(filename, "r")
                line = file.readline().strip()
                file.close()
                return line

            a = first_line("x.txt")
            b = first_line("y.txt")
            print(a + b)
          `, files: { 'x.txt': 'Hello\nthere\n', 'y.txt': 'World\n' }, rows: 1, why: 'Each call reads the first line of its own file: `Hello` then `World`; joined without a space.'
          },
          {
            t: 'predict', code: C`
            def total(table):
                t = 0
                for row in table:
                    t = t + row[1]
                return t

            data = [["A", 3], ["B", 4], ["C", 5]]
            print(total(data), len(data))
          `, rows: 1, why: '3 + 4 + 5 is 12, and there are 3 rows.'
          },
          { t: 'quiz', q: 'Why pass <code>filename</code> as a parameter to <code>read_scores(filename)</code>?', options: ['It makes the function run faster', 'The same function can read any file', 'Python requires a parameter in every function', 'It stops the file being erased'], answer: 1, why: 'A parameter makes the function reusable with different data.' },
          { t: 'quiz', q: 'Which of these is a function (not just a procedure)?', options: ['One that opens a file, writes a line and closes it', 'One that opens a file, counts lines and returns the count', 'One that prints "Saved"', 'One with no parameters'], answer: 1, why: 'A function returns a value.' },
          {
            t: 'parsons', prompt: 'Arrange this function that returns the number of lines in a file.', lines: [
              'def count_lines(filename):',
              '    file = open(filename, "r")',
              '    n = 0',
              '    for line in file:',
              '        n = n + 1',
              '    file.close()',
              '    return n'], why: 'Open and set the counter, loop, close, then return.'
          },

          {
            t: 'exercise', id: 'm10-ex-fn-readlines', title: 'Write read_lines', level: 1,
            prompt: 'Write a function <code>read_lines(filename)</code> that returns a list of the lines in the file, with newlines removed.',
            starter: C`
              def read_lines(filename):
                  # open, collect stripped lines, close, return
                  pass
            `,
            solution: C`
              def read_lines(filename):
                  lines = []
                  file = open(filename, "r")
                  for line in file:
                      lines.append(line.strip())
                  file.close()
                  return lines
            `,
            tests: [
              { files: { 'a.txt': 'x\ny\n' }, py: 'assert read_lines("a.txt") == ["x", "y"], "two lines expected"', label: 'Two lines' },
              { files: { 'b.txt': '' }, py: 'assert read_lines("b.txt") == []', label: 'Empty file gives empty list' },
              { files: { 'c.txt': 'only\n' }, py: 'assert read_lines("c.txt") == ["only"]', label: 'One line', hidden: true },
            ],
            hints: ['Create an empty list, append inside the loop, and return it at the end.']
          },
          {
            t: 'exercise', id: 'm10-ex-fn-save', title: 'Write save_lines', level: 2,
            prompt: 'Write a procedure <code>save_lines(filename, lines)</code> that writes each item of the list on its own line, replacing the file.',
            starter: C`
              def save_lines(filename, lines):
                  file = open(filename, "a")
                  for line in lines:
                      file.write(line)
            `,
            solution: C`
              def save_lines(filename, lines):
                  file = open(filename, "w")
                  for line in lines:
                      file.write(line + "\n")
                  file.close()
            `,
            tests: [
              { py: 'save_lines("o.txt", ["a", "b"])\nassert open("o.txt").read() == "a\\nb\\n"', label: 'Two lines written' },
              { files: { 'o.txt': 'old\nstuff\n' }, py: 'save_lines("o.txt", ["new"])\nassert open("o.txt").read() == "new\\n", "old data must be replaced"', label: 'Replaces old data' },
              { py: 'save_lines("o.txt", [])\nassert open("o.txt").read() == ""', label: 'Empty list gives empty file', hidden: true },
            ],
            hints: ['Two things to fix: the mode and the newline.', 'Close the file.']
          },
          {
            t: 'exercise', id: 'm10-ex-fn-stats', title: 'Score statistics', level: 2,
            prompt: 'Write <code>read_scores(filename)</code> returning a list of whole numbers from a file with one score per line, and <code>stats(scores)</code> returning a tuple <code>(lowest, highest, average)</code>.',
            starter: C`
              def read_scores(filename):
                  pass

              def stats(scores):
                  pass
            `,
            solution: C`
              def read_scores(filename):
                  scores = []
                  file = open(filename, "r")
                  for line in file:
                      scores.append(int(line))
                  file.close()
                  return scores

              def stats(scores):
                  lowest = scores[0]
                  highest = scores[0]
                  total = 0
                  for s in scores:
                      if s < lowest:
                          lowest = s
                      if s > highest:
                          highest = s
                      total = total + s
                  return (lowest, highest, total / len(scores))
            `,
            tests: [
              { files: { 's.txt': '5\n9\n1\n' }, py: 'assert read_scores("s.txt") == [5, 9, 1]', label: 'Reads numbers' },
              { py: 'assert stats([5, 9, 1]) == (1, 9, 5.0)', label: 'stats of [5, 9, 1]' },
              { py: 'assert stats([4]) == (4, 4, 4.0)', label: 'single value' },
              { py: 'assert stats([-3, -8]) == (-8, -3, -5.5)', label: 'negatives', hidden: true },
            ],
            hints: ['Start `lowest` and `highest` from `scores[0]`.', 'Return `(a, b, c)`.']
          },
          {
            t: 'exercise', id: 'm10-ex-highscore', title: 'High score table', level: 3, kind: 'exam',
            prompt: 'A game stores the best score in <code>best.txt</code> (one whole number). Ask the player for their score. If it is higher than the one in the file, save the new score in the file and print <code>New high score!</code>, otherwise print <code>Not a high score</code>. If <code>best.txt</code> does not exist treat the best as 0. Use a function <code>read_best(filename)</code>.',
            starter: C`
              def read_best(filename):
                  file = open(filename, "r")
                  best = int(file.readline())
                  file.close()
                  return best

              score = int(input("Your score: "))
              best = read_best("best.txt")
              if score > best:
                  print("New high score!")
              else:
                  print("Not a high score")
            `,
            solution: C`
              def read_best(filename):
                  try:
                      file = open(filename, "r")
                      best = int(file.readline())
                      file.close()
                  except FileNotFoundError:
                      best = 0
                  return best

              score = int(input("Your score: "))
              best = read_best("best.txt")
              if score > best:
                  file = open("best.txt", "w")
                  file.write(str(score) + "\n")
                  file.close()
                  print("New high score!")
              else:
                  print("Not a high score")
            `,
            tests: [
              { in: ['50'], files: { 'best.txt': '40\n' }, out: 'New high score!', files_out: { 'best.txt': '50\n' } },
              { in: ['30'], files: { 'best.txt': '40\n' }, out: 'Not a high score', files_out: { 'best.txt': '40\n' } },
              { in: ['5'], files: {}, out: 'New high score!', files_out: { 'best.txt': '5\n' } },
              { in: ['40'], files: { 'best.txt': '40\n' }, out: 'Not a high score', hidden: true },
            ],
            hints: ['Catch `FileNotFoundError` inside `read_best`.', 'Only write to the file inside the `if` branch.']
          },
          {
            t: 'exercise', id: 'm10-ex-fn-debug', title: 'Three errors in subprograms', level: 2, kind: 'debug',
            prompt: 'The function <code>load_scores</code> should return a list of <code>[name, score]</code> rows with scores as integers, and <code>save_scores</code> should write them back as <code>name,score</code>. There are <strong>three</strong> errors.',
            starter: C`
              def load_scores(filename):
                  table = []
                  file = open(filename, "r")
                  for line in file:
                      name, score = line.split(",")
                      table.append([name, score])
                  file.close()

              def save_scores(filename, table):
                  file = open(filename, "w")
                  for row in table:
                      file.write(row[0] + "," + row[1] + "\n")
                  file.close()
            `,
            solution: C`
              def load_scores(filename):
                  table = []
                  file = open(filename, "r")
                  for line in file:
                      name, score = line.strip().split(",")
                      table.append([name, int(score)])
                  file.close()
                  return table

              def save_scores(filename, table):
                  file = open(filename, "w")
                  for row in table:
                      file.write(row[0] + "," + str(row[1]) + "\n")
                  file.close()
            `,
            tests: [
              { files: { 'a.txt': 'Asha,72\nBen,58\n' }, py: 'assert load_scores("a.txt") == [["Asha", 72], ["Ben", 58]]', label: 'load_scores returns converted rows' },
              { py: 'save_scores("b.txt", [["Z", 1], ["Y", 22]])\nassert open("b.txt").read() == "Z,1\\nY,22\\n"', label: 'save_scores writes numbers' },
            ],
            hints: ['A function that does not `return` gives back `None`.', 'The `\\n` ends up inside the score string unless you strip.', 'Numbers cannot be joined to strings with `+`.']
          },
        ],
      },
    ],
  });
})();

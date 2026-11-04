(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm04',
    title: 'Strings',
    blurb: 'Text as a sequence of characters: indexing, slicing, methods, loops over text and classic string algorithms.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'string-basics',
        title: 'Strings: characters, length and index',
        time: '30 min',
        book: 'Ch 2 · p.54',
        exam: 'Paper 2 Q2',
        summary: 'len, index, negative index, IndexError, immutability, + and *',
        intro: 'A string is a row of characters stored in order. Once you know that every character has a position number, you can pick out any letter you like.',
        blocks: [
          { t: 'h', text: 'A string is a sequence of characters' },
          { t: 'p', html: 'A **character** is one letter, digit, space or symbol. A **string** is a sequence of characters in quote marks. Spaces and punctuation count as characters too.' },
          { t: 'p', html: 'Python gives each character a position number called an **index**. The first character has index **0**, not 1. This is called zero-based indexing.' },
          { t: 'html', html: '<div class="cells"><div class="c"><b>P</b><i>0</i><i>-6</i></div><div class="c"><b>y</b><i>1</i><i>-5</i></div><div class="c"><b>t</b><i>2</i><i>-4</i></div><div class="c"><b>h</b><i>3</i><i>-3</i></div><div class="c"><b>o</b><i>4</i><i>-2</i></div><div class="c"><b>n</b><i>5</i><i>-1</i></div></div>' },
          { t: 'p', html: 'The top row is the character, the middle number is the normal index and the bottom number is the **negative index**, which counts back from the end. `-1` is always the last character.' },

          { t: 'h', text: 'len() and indexing' },
          {
            t: 'cases', title: 'Looking at one character at a time', items: [
              {
                label: 'len()', intro: '`len()` returns how many characters a string has. Spaces count.', code: C`
              word = "Python"
              print(len(word))
              print(len("hi there"))
              print(len(""))
            ` },
              {
                label: 'First and last', intro: 'Use square brackets after the string. The first character is index 0. The last is `len(word) - 1`, or simply `-1`.', code: C`
              word = "Python"
              print(word[0])
              print(word[5])
              print(word[len(word) - 1])
              print(word[-1])
            ` },
              {
                label: 'Negative index', intro: 'Negative numbers count back from the end.', code: C`
              word = "Python"
              print(word[-1])
              print(word[-2])
              print(word[-6])
            ` },
              {
                label: 'A space is a character', code: C`
              greeting = "Hi you"
              print(len(greeting))
              print("[" + greeting[2] + "]")
            ` },
              {
                label: 'Index too big', expectError: true, intro: 'There is no character at index 6 in a six-letter word. Python raises an **IndexError**.', code: C`
              word = "Python"
              print(word[6])
            ` },
              {
                label: 'Index from input', stdin: ['3'], intro: 'The index can be any whole-number expression, including a variable.', code: C`
              word = "keyboard"
              position = int(input("Which position? "))
              print(word[position])
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'The last valid index is `len(s) - 1`, not `len(s)`. Using `s[len(s)]` is the classic off-by-one cause of an `IndexError`.' },

          { t: 'h', text: 'Strings cannot be changed in place' },
          { t: 'p', html: 'A string is **immutable**: you cannot change one character inside it. To get a different string you build a new one.' },
          {
            t: 'cases', title: 'Changing a string', items: [
              {
                label: 'Trying to assign', expectError: true, code: C`
              word = "cat"
              word[0] = "b"
            ` },
              {
                label: 'Build a new one', intro: 'Take the parts you want to keep and join them to the new part.', code: C`
              word = "cat"
              word = "b" + word[1:]
              print(word)
            ` },
            ]
          },

          { t: 'h', text: 'Joining, repeating, comparing, searching' },
          {
            t: 'cases', title: 'Operators that work on strings', items: [
              {
                label: 'Concatenation +', intro: '**Concatenation** means joining strings end to end.', code: C`
              first = "Ada"
              last = "Lovelace"
              print(first + " " + last)
              first = first + "!"
              print(first)
              first += "!"
              print(first)
            ` },
              {
                label: 'Repetition *', code: C`
              print("ha" * 3)
              print("=" * 10)
              print("x" * 0 == "")
            ` },
              {
                label: 'Comparison', intro: '`==` is True only when both strings are exactly the same, including capital letters.', code: C`
              print("cat" == "cat")
              print("cat" == "Cat")
              print("apple" < "banana")
              print("Zebra" < "apple")
            ` },
              {
                label: 'in', intro: '`in` checks whether a smaller string appears anywhere inside a bigger one.', code: C`
              print("th" in "Python")
              print("z" in "Python")
              print("z" not in "Python")
              print("" in "Python")
            ` },
              {
                label: 'Text plus number', expectError: true, intro: '`+` cannot join a string and a number.', code: C`
              print("Score: " + 10)
            ` },
              {
                label: 'str() and int()', code: C`
              print("Score: " + str(10))
              print(int("12") + 3)
              print("12" + "3")
              print(len(str(12345)))
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'Capital letters sort before lower-case ones, so `"Zebra" < "apple"` is True. That is why programs often convert text to one case before comparing.' },

          { t: 'h', text: 'Escape characters and multi-line strings' },
          {
            t: 'cases', title: 'Special characters again', items: [
              {
                label: 'Escapes count as one character', code: C`
              s = "a\nb"
              print(len(s))
              print(s)
              print("tab\there")
            ` },
              {
                label: 'Triple quotes', intro: 'Triple quotes let one string run over several lines.', code: C`
              poem = """Roses are red,
              Violets are blue"""
              print(poem)
              print(len(poem))
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'In Edexcel pseudocode the number of characters is <code>LENGTH(word)</code> and the first character is <code>word[0]</code>. Written in Python that is <code>len(word)</code> and <code>word[0]</code>. Strings are zero-indexed in Paper 2 too.' },

          { t: 'viz', kind: 'memory', preset: 'Strings are immutable', title: 'Strings never change in place' },

          {
            t: 'predict', title: 'Which letters?', code: C`
            s = "Bookshop"
            print(s[0], s[4], s[-1])
            print(len(s))
          `, rows: 2, why: 'Index 0 is B, index 4 is s (B-o-o-k-s), and -1 is the last letter p. There are 8 characters.'
          },
          {
            t: 'predict', title: 'Joining and repeating', code: C`
            a = "ab"
            b = a * 2 + "c"
            print(b)
            print(len(b))
          `, rows: 2, why: '`a * 2` is "abab", then "c" is added to give "ababc", which has five characters.'
          },
          { t: 'quiz', q: 'What is the index of the last character of a string called <code>s</code> that is 9 characters long?', options: ['9', '8', '10', '0'], answer: 1, why: 'Indexes run from 0 to 8 for nine characters. `s[-1]` is the same character.' },
          { t: 'quiz', q: 'Which statements are true? (tick all that apply)', options: ['The first character is at index 1', 'len("a b") is 3', 'You can change a letter with word[0] = "x"', 'word[-1] is the last character'], answer: [1, 3], why: 'Indexing starts at 0, spaces count as characters, and strings are immutable.' },

          {
            t: 'exercise', id: 'm04-ex-firstlast', title: 'First and last', level: 1,
            prompt: 'Ask the user for a word. Print its first character on one line and its last character on the next line.',
            starter: C`
              word = input("Word: ")
              # print the first character, then the last character
            `,
            solution: C`
              word = input("Word: ")
              print(word[0])
              print(word[-1])
            `,
            tests: [{ in: ['python'], out: 'p\nn' }, { in: ['a'], out: 'a\na' }, { in: ['Hello'], out: 'H\no', hidden: true }],
            hints: ['The first character is at index 0.', 'The last character is at index -1.']
          },
          {
            t: 'exercise', id: 'm04-ex-howlong', title: 'How long is your name?', level: 1,
            prompt: 'Ask for a name and print a sentence in this exact form: <code>Ben has 3 letters</code> (using the name entered and its length).',
            starter: C`
              name = input("Name: ")
            `,
            solution: C`
              name = input("Name: ")
              print(name, "has", len(name), "letters")
            `,
            tests: [{ in: ['Ben'], out: 'Ben has 3 letters' }, { in: ['Alexandra'], out: 'Alexandra has 9 letters' }, { in: ['Li'], out: 'Li has 2 letters', hidden: true }],
            hints: ['`len(name)` is a number. A comma in `print` lets you mix text and numbers.', 'Or use an f-string: `f"{name} has {len(name)} letters"`.']
          },
          {
            t: 'exercise', id: 'm04-ex-middle', title: 'The middle letter', level: 2,
            prompt: 'The user enters a word with an **odd** number of letters. Print the middle letter. (Hint: `//` gives a whole-number division.)',
            starter: C`
              word = input("Odd-length word: ")
            `,
            solution: C`
              word = input("Odd-length word: ")
              print(word[len(word) // 2])
            `,
            tests: [{ in: ['cat'], out: 'a' }, { in: ['hello'], out: 'l' }, { in: ['x'], out: 'x' }, { in: ['planets'], out: 'n', hidden: true }],
            hints: ['For 5 letters the middle index is 2. What is `5 // 2`?']
          },
          {
            t: 'exercise', id: 'm04-ex-banner', title: 'Word banner', level: 2,
            prompt: 'Ask for a word and print it inside a star banner. The top and bottom lines are stars, long enough to fit the word with a star and a space at each side. Example for <code>hi</code>:<pre>******\n* hi *\n******</pre>',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              border = "*" * (len(word) + 4)
              print(border)
              print("* " + word + " *")
              print(border)
            `,
            tests: [{ in: ['hi'], out: '******\n* hi *\n******' }, { in: ['Python'], out: '**********\n* Python *\n**********' }, { in: ['a'], out: '*****\n* a *\n*****', hidden: true }],
            requires: [{ re: 'len\\(', msg: 'Use `len()` to work out how many stars are needed.' }],
            hints: ['Two stars and two spaces surround the word, so the border is `len(word) + 4` long.', 'Use `"*" * number` to build the border.']
          },
          {
            t: 'exercise', id: 'm04-ex-username', title: 'Username checker', level: 2,
            prompt: 'A school system needs usernames between 5 and 12 characters long (both numbers allowed). Ask for a username. Print <code>Too short</code> if it has fewer than 5 characters, <code>Too long</code> if it has more than 12, otherwise <code>Username accepted</code>.',
            starter: C`
              username = input("Username: ")
            `,
            solution: C`
              username = input("Username: ")
              if len(username) < 5:
                  print("Too short")
              elif len(username) > 12:
                  print("Too long")
              else:
                  print("Username accepted")
            `,
            tests: [{ in: ['abcd'], out: 'Too short' }, { in: ['abcde'], out: 'Username accepted' }, { in: ['abcdefghijkl'], out: 'Username accepted' }, { in: ['abcdefghijklm'], out: 'Too long', hidden: true }],
            hints: ['Compare `len(username)` with 5 and 12.', 'Test both boundaries: 5 and 12 are allowed.']
          },
          {
            t: 'exercise', id: 'm04-ex-debug-basics', kind: 'debug', title: 'Three errors in a word report', level: 2,
            prompt: 'This program should print the first letter, the number of letters and the last letter of the word entered. There are <strong>three</strong> errors. Find and fix them.',
            starter: C`
              word = input("Word: ")
              print("First letter: " + word[1])
              print("Length: " + len(word))
              print("Last letter: " + word[len(word)])
            `,
            solution: C`
              word = input("Word: ")
              print("First letter: " + word[0])
              print("Length: " + str(len(word)))
              print("Last letter: " + word[len(word) - 1])
            `,
            tests: [{ in: ['tree'], out: 'First letter: t\nLength: 4\nLast letter: e' }, { in: ['a'], out: 'First letter: a\nLength: 1\nLast letter: a' }, { in: ['Python'], out: 'First letter: P\nLength: 6\nLast letter: n', hidden: true }],
            hints: ['The first character is at index 0.', 'You cannot add a number to a string with `+`. Convert it with `str()`.', 'The last index is one less than the length.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'string-slicing',
        title: 'Slicing strings',
        time: '30 min',
        book: 'Ch 2 · p.55',
        exam: 'Paper 2 Q2',
        summary: '[a:b], missing parts, steps, reversing, safe out-of-range slices',
        intro: 'Indexing gives you one character. Slicing gives you a piece of the string, from any start to any end, in one go.',
        blocks: [
          { t: 'h', text: 'The slice [start:stop]' },
          { t: 'p', html: 'A **slice** copies part of a string. The form is `s[start:stop]`. It begins at `start` and stops just **before** `stop`. The stop position is never included.' },
          { t: 'html', html: '<div class="cells"><div class="c"><b>c</b><i>0</i><i>-8</i></div><div class="c"><b>o</b><i>1</i><i>-7</i></div><div class="c"><b>m</b><i>2</i><i>-6</i></div><div class="c"><b>p</b><i>3</i><i>-5</i></div><div class="c"><b>u</b><i>4</i><i>-4</i></div><div class="c"><b>t</b><i>5</i><i>-3</i></div><div class="c"><b>e</b><i>6</i><i>-2</i></div><div class="c"><b>r</b><i>7</i><i>-1</i></div></div>' },
          { t: 'p', html: 'For `"computer"`, `s[1:4]` starts at index 1 (`o`) and stops before index 4, giving `"omp"`. The number of characters you get is `stop - start`.' },
          {
            t: 'cases', title: 'All the shapes of a slice', items: [
              {
                label: '[a:b]', code: C`
              s = "computer"
              print(s[1:4])
              print(s[0:3])
              print(s[3:8])
            ` },
              {
                label: '[:b] start missing', intro: 'No start means "from the beginning".', code: C`
              s = "computer"
              print(s[:3])
              print(s[:0] == "")
            ` },
              {
                label: '[a:] stop missing', intro: 'No stop means "to the end".', code: C`
              s = "computer"
              print(s[3:])
              print(s[7:])
            ` },
              {
                label: '[:] everything', intro: 'Both missing makes a full copy.', code: C`
              s = "computer"
              print(s[:])
            ` },
              {
                label: 'Negative positions', intro: 'Negative numbers count from the end, in slices too.', code: C`
              s = "computer"
              print(s[-3:])
              print(s[:-3])
              print(s[-5:-2])
            ` },
              {
                label: 'Step [::2]', intro: 'A third number is the **step**: how far to move each time.', code: C`
              s = "computer"
              print(s[::2])
              print(s[1::2])
              print(s[0:6:3])
            ` },
              {
                label: 'Reverse [::-1]', intro: 'A step of -1 walks backwards through the whole string.', code: C`
              s = "computer"
              print(s[::-1])
              print(s[4::-1])
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: '`s[:n]` gives the first n characters. `s[-n:]` gives the last n characters. `s[::-1]` gives the whole string backwards. These three come up often.' },

          { t: 'h', text: 'Safe and unsafe' },
          { t: 'p', html: 'An index that is too big crashes. A slice that goes too far does **not** crash. Python quietly stops at the ends and returns what exists, even an empty string.' },
          {
            t: 'cases', title: 'Slice versus index', items: [
              {
                label: 'Slice too far is safe', code: C`
              s = "cat"
              print(s[0:100])
              print(s[5:10] == "")
              print(s[2:1] == "")
              print(len(s[5:10]))
            ` },
              {
                label: 'Index too far crashes', expectError: true, code: C`
              s = "cat"
              print(s[5])
            ` },
              {
                label: 'Slice result is a new string', intro: 'Slicing never changes the original.', code: C`
              s = "computer"
              part = s[:3]
              print(part)
              print(s)
            ` },
              {
                label: 'Slicing with variables', stdin: ['2', '5'], code: C`
              s = "keyboard"
              a = int(input("Start: "))
              b = int(input("Stop: "))
              print(s[a:b])
              print(len(s[a:b]) == b - a)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Do not forget that the stop index is **excluded**. To print letters 2, 3 and 4 you need `s[2:5]`, not `s[2:4]`.' },

          { t: 'h', text: 'Using slices to build strings' },
          {
            t: 'cases', title: 'Useful recipes', items: [
              {
                label: 'Replace the first letter', code: C`
              word = "cat"
              new_word = "b" + word[1:]
              print(new_word)
            ` },
              {
                label: 'Remove first and last', code: C`
              word = "[hello]"
              print(word[1:-1])
            ` },
              {
                label: 'Split a code', code: C`
              code = "GB20261103"
              country = code[:2]
              year = code[2:6]
              day = code[6:]
              print(country, year, day)
            ` },
              {
                label: 'Move first letter to the end', code: C`
              word = "python"
              print(word[1:] + word[0])
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Paper 2 tasks often hide a slice inside a bigger question, such as "extract the area code from this phone number" or "display the last three characters". Count positions carefully and test with a short example.' },

          { t: 'viz', kind: 'slice', start: 1, stop: 5, caption: 'Change the numbers. Try a negative start, an empty stop, or step -1 to reverse the text.' },

          {
            t: 'predict', title: 'Slice it', code: C`
            s = "programming"
            print(s[3:7])
            print(s[:3])
            print(s[-4:])
          `, rows: 3, why: 'Indexes 3 to 6 are g, r, a, m. The first three are pro. The last four are ming.'
          },
          {
            t: 'predict', title: 'Step and reverse', code: C`
            s = "abcdef"
            print(s[::2])
            print(s[::-1])
            print(s[10:])
          `, rows: 3, why: 'Every second letter starting at 0 is ace. Reversed is fedcba. A slice starting beyond the end gives an empty line.'
          },
          { t: 'quiz', q: 'What does <code>"abcdef"[1:4]</code> give?', options: ['"abcd"', '"bcd"', '"bcde"', '"bc"'], answer: 1, why: 'It starts at index 1 (b) and stops before index 4, so it contains indexes 1, 2 and 3.' },
          {
            t: 'sort', title: 'Which slice?', prompt: 'Each description matches one of these slice results from the word "keyboard". Sort the slices by what part of the word they give.', cats: ['Start of the word', 'End of the word', 'Whole word, changed'], items: [
              { text: '<code>s[:3]</code>', cat: 0 },
              { text: '<code>s[-4:]</code>', cat: 1 },
              { text: '<code>s[::-1]</code>', cat: 2 },
              { text: '<code>s[0:5]</code>', cat: 0 },
              { text: '<code>s[4:]</code>', cat: 1 },
              { text: '<code>s[::2]</code>', cat: 2 },
            ], why: 'Slices starting at 0 take the start; slices ending at the end take the end; steps and reversing rearrange or skip the whole word.'
          },

          {
            t: 'exercise', id: 'm04-ex-firstthree', title: 'First three letters', level: 1,
            prompt: 'Ask for a word and print its first three letters. If the word is shorter than three letters, print the whole word.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              print(word[:3])
            `,
            tests: [{ in: ['computer'], out: 'com' }, { in: ['hi'], out: 'hi' }, { in: ['abc'], out: 'abc' }, { in: [''], out: '', hidden: true }],
            hints: ['A slice never crashes for being too long.', 'Use `word[:3]`.']
          },
          {
            t: 'exercise', id: 'm04-ex-backwards', title: 'Backwards', level: 1,
            prompt: 'Ask for some text and print it backwards using a slice.',
            starter: C`
              text = input("Text: ")
            `,
            solution: C`
              text = input("Text: ")
              print(text[::-1])
            `,
            tests: [{ in: ['stressed'], out: 'desserts' }, { in: ['a b'], out: 'b a' }, { in: ['x'], out: 'x', hidden: true }],
            requires: [{ re: '\\[\\s*:\\s*:\\s*-1\\s*\\]', msg: 'Use the slice `[::-1]`.' }],
            hints: ['A step of -1 goes backwards.']
          },
          {
            t: 'exercise', id: 'm04-ex-datesplit', title: 'Split a date', level: 2,
            prompt: 'A date is entered as <code>DD/MM/YYYY</code> (always ten characters, for example <code>03/11/2026</code>). Use slices to print the day, the month and the year, each on its own line.',
            starter: C`
              date = input("Date (DD/MM/YYYY): ")
            `,
            solution: C`
              date = input("Date (DD/MM/YYYY): ")
              print(date[:2])
              print(date[3:5])
              print(date[6:])
            `,
            tests: [{ in: ['03/11/2026'], out: '03\n11\n2026' }, { in: ['25/12/1999'], out: '25\n12\n1999' }, { in: ['01/01/2000'], out: '01\n01\n2000', hidden: true }],
            hints: ['The slashes are at indexes 2 and 5.', 'The month is `date[3:5]`.']
          },
          {
            t: 'exercise', id: 'm04-ex-everyother', title: 'Every other letter', level: 2,
            prompt: 'Ask for a word. Print the letters at positions 1, 3, 5 and so on (the second, fourth, sixth letter...) joined together on one line.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              print(word[1::2])
            `,
            tests: [{ in: ['abcdef'], out: 'bdf' }, { in: ['python'], out: 'yhn' }, { in: ['a'], out: '' }, { in: ['computing'], out: 'optn', hidden: true }],
            hints: ['The step goes in the third place: `[start:stop:step]`.', 'Start at index 1, leave stop empty, step 2.']
          },
          {
            t: 'exercise', id: 'm04-ex-swapends', title: 'Swap the ends', level: 3,
            prompt: 'Ask for a word of at least two letters. Print the word with its first and last letters swapped. For <code>python</code> the output is <code>nythop</code>.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              print(word[-1] + word[1:-1] + word[0])
            `,
            tests: [{ in: ['python'], out: 'nythop' }, { in: ['ab'], out: 'ba' }, { in: ['level'], out: 'level' }, { in: ['computer'], out: 'romputec', hidden: true }],
            hints: ['You need three pieces: the last letter, the middle, the first letter.', 'The middle is everything except the first and last: `word[1:-1]`.']
          },
          {
            t: 'exercise', id: 'm04-ex-palin-slice', title: 'Palindrome check', level: 3,
            prompt: 'A palindrome reads the same forwards and backwards. Ask for a word (lower case, no spaces). Print <code>Palindrome</code> if it is one, otherwise <code>Not a palindrome</code>. Use a slice, not a loop.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              if word == word[::-1]:
                  print("Palindrome")
              else:
                  print("Not a palindrome")
            `,
            tests: [{ in: ['level'], out: 'Palindrome' }, { in: ['hello'], out: 'Not a palindrome' }, { in: ['a'], out: 'Palindrome' }, { in: ['abba'], out: 'Palindrome', hidden: true }, { in: ['abca'], out: 'Not a palindrome', hidden: true }],
            requires: [{ re: '\\[\\s*:\\s*:\\s*-1\\s*\\]', msg: 'Use the reversing slice `[::-1]`.' }],
            hints: ['Compare the word with its reverse.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'string-methods',
        title: 'String methods',
        time: '35 min',
        book: 'Ch 2 · p.56',
        exam: 'Paper 2 Q2',
        summary: 'upper, lower, strip, replace, find, count, split, join, is... checks',
        intro: 'A method is a built-in action that belongs to a string, written with a dot: `text.upper()`. Python has dozens. Here are the ones you will actually use.',
        blocks: [
          { t: 'h', text: 'Methods return a new string' },
          { t: 'p', html: 'A method is like a function that is attached to a value with a **dot**. Because strings cannot be changed, a method never edits the original. It gives back a **new** string, and you must store or print it.' },
          {
            t: 'cases', title: 'Original unchanged', items: [
              {
                label: 'The common mistake', intro: 'Nothing is stored, so `name` is still lower case.', code: C`
              name = "asha"
              name.upper()
              print(name)
            ` },
              {
                label: 'Store the result', code: C`
              name = "asha"
              name = name.upper()
              print(name)
            ` },
              {
                label: 'Use it directly', code: C`
              name = "asha"
              print(name.upper())
              print(name)
            ` },
            ]
          },

          { t: 'h', text: 'Changing case and tidying spaces' },
          {
            t: 'cases', title: 'Case and whitespace', items: [
              {
                label: 'upper / lower', code: C`
              s = "Hello World"
              print(s.upper())
              print(s.lower())
              print(s.swapcase())
            ` },
              {
                label: 'title / capitalize', intro: '`title()` capitalises every word. `capitalize()` only the first letter of the string and makes the rest lower case.', code: C`
              s = "the quick BROWN fox"
              print(s.title())
              print(s.capitalize())
            ` },
              {
                label: 'strip family', intro: '`strip()` removes spaces (and tabs, new lines) from **both ends** but never from the middle.', code: C`
              s = "   hello there   "
              print("[" + s.strip() + "]")
              print("[" + s.lstrip() + "]")
              print("[" + s.rstrip() + "]")
            ` },
              {
                label: 'Chaining', intro: 'Because each method returns a string, you can call another on the end.', stdin: ['  YeS  '], code: C`
              answer = input("Continue? ").strip().lower()
              print("[" + answer + "]")
              print(answer == "yes")
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'Always clean user input with `.strip().lower()` before comparing it. Then `"YES"`, `" yes"` and `"Yes "` all become `"yes"`.' },

          { t: 'h', text: 'Searching and replacing' },
          {
            t: 'cases', title: 'find, index, count, replace', items: [
              {
                label: 'find', intro: '`find()` gives the index where the text first appears, or **-1** if it does not.', code: C`
              s = "banana"
              print(s.find("a"))
              print(s.find("na"))
              print(s.find("z"))
              print(s.find("a", 2))
            ` },
              {
                label: 'index', intro: '`index()` does the same, but crashes with a ValueError when the text is missing.', code: C`
              s = "banana"
              print(s.index("n"))
            ` },
              {
                label: 'index missing', expectError: true, code: C`
              s = "banana"
              print(s.index("z"))
            ` },
              {
                label: 'count', intro: '`count()` counts non-overlapping matches. It is case-sensitive.', code: C`
              s = "Banana"
              print(s.count("a"))
              print(s.count("A"))
              print(s.lower().count("a"))
              print(s.count("an"))
            ` },
              {
                label: 'replace', intro: '`replace(old, new)` replaces **every** match. An optional third number limits how many.', code: C`
              s = "the cat sat on the mat"
              print(s.replace("at", "og"))
              print(s.replace("the", "a", 1))
              print(s.replace(" ", ""))
              print(s.replace("dog", "x"))
            ` },
              {
                label: 'startswith / endswith', code: C`
              file = "report.txt"
              print(file.endswith(".txt"))
              print(file.startswith("rep"))
              print(file.startswith("Rep"))
            ` },
            ]
          },

          { t: 'h', text: 'Splitting and joining' },
          { t: 'p', html: '`split()` breaks a string into a **list** of pieces. `join()` does the opposite: it glues a list of strings together, using the string it is called on as the glue.' },
          {
            t: 'cases', title: 'split and join', items: [
              {
                label: 'split on spaces', intro: 'With no argument, `split()` breaks at any run of spaces.', code: C`
              sentence = "the  quick brown   fox"
              words = sentence.split()
              print(words)
              print(len(words))
            ` },
              {
                label: 'split on a symbol', code: C`
              line = "Asha,15,Year 10"
              parts = line.split(",")
              print(parts)
              print(parts[0])
              print(int(parts[1]) + 1)
            ` },
              {
                label: 'join', code: C`
              words = ["red", "green", "blue"]
              print(" ".join(words))
              print("-".join(words))
              print("".join(words))
            ` },
              {
                label: 'join needs strings', expectError: true, code: C`
              numbers = [1, 2, 3]
              print(",".join(numbers))
            ` },
              {
                label: 'Reverse the words', code: C`
              sentence = "one two three"
              words = sentence.split()
              print(words[::-1])
              print(" ".join(words[::-1]))
            ` },
            ]
          },

          { t: 'h', text: 'Checking what a string contains' },
          {
            t: 'table', head: ['Method', 'True when...', 'Example'], rows: [
              ['`isdigit()`', 'every character is a digit and there is at least one', '`"2026".isdigit()`'],
              ['`isalpha()`', 'every character is a letter', '`"hello".isalpha()`'],
              ['`isalnum()`', 'every character is a letter or digit', '`"abc123".isalnum()`'],
              ['`isupper()`', 'there are letters and all are upper case', '`"ABC".isupper()`'],
              ['`islower()`', 'there are letters and all are lower case', '`"abc".islower()`'],
              ['`isspace()`', 'every character is a space, tab or new line', '`"   ".isspace()`'],
            ]
          },
          {
            t: 'cases', title: 'Testing strings', items: [
              {
                label: 'Digits', code: C`
              print("2026".isdigit())
              print("20.5".isdigit())
              print("-7".isdigit())
              print("".isdigit())
              print("12a".isdigit())
            ` },
              {
                label: 'Letters', code: C`
              print("hello".isalpha())
              print("hello world".isalpha())
              print("abc123".isalpha())
              print("abc123".isalnum())
              print("abc 123".isalnum())
            ` },
              {
                label: 'Case checks', code: C`
              print("ABC".isupper())
              print("ABc".isupper())
              print("abc".islower())
              print("123".isupper())
              print("   ".isspace())
              print("".isspace())
            ` },
              {
                label: 'Use before int()', stdin: ['abc'], code: C`
              text = input("Enter a number: ")
              if text.isdigit():
                  print(int(text) * 2)
              else:
                  print("Not a whole number")
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: '`isdigit()` is False for `"-7"` and `"3.5"` because `-` and `.` are not digits. It only accepts plain whole numbers made of 0 to 9.' },
          { t: 'note', kind: 'exam', html: 'Edexcel Paper 2 does not give you a list of method names, so learn the common ones: `upper`, `lower`, `strip`, `replace`, `find`, `split`, `isdigit`. Examiners accept any correct way to test a condition, such as `if text[0] == "A"` instead of `startswith`.' },

          {
            t: 'predict', title: 'Methods and the original', code: C`
            s = " Hello "
            t = s.strip().upper()
            print(t)
            print(len(s))
            print(len(t))
          `, rows: 3, why: '`strip()` removes the two spaces so `t` is HELLO (5 characters). The original `s` is untouched and still has 7.'
          },
          {
            t: 'predict', title: 'Count and replace', code: C`
            s = "mississippi"
            print(s.count("ss"))
            print(s.replace("ss", "S"))
            print(s.find("p"))
          `, rows: 3, why: 'There are two "ss" pairs. Replacing them gives miSiSippi. The first p is at index 8.'
          },
          { t: 'quiz', q: 'A student writes <code>word.title()</code> on its own line. What happens to <code>word</code>?', options: ['It becomes title case', 'It is unchanged, because the result was not stored', 'Python raises an error', 'It becomes upper case'], answer: 1, why: 'Strings are immutable. The method returns a new string, which is thrown away unless you store it.' },
          { t: 'quiz', q: 'What does <code>"a,b,c".split(",")</code> return?', options: ['"abc"', '["a", "b", "c"]', '["a,b,c"]', '3'], answer: 1, why: '`split` returns a list of the pieces between the separators.' },

          {
            t: 'exercise', id: 'm04-ex-shout', title: 'Shout it', level: 1,
            prompt: 'Ask for a message and print it in capital letters with three exclamation marks on the end.',
            starter: C`
              message = input("Message: ")
            `,
            solution: C`
              message = input("Message: ")
              print(message.upper() + "!!!")
            `,
            tests: [{ in: ['hello'], out: 'HELLO!!!' }, { in: ['Well Done'], out: 'WELL DONE!!!' }, { in: ['a1'], out: 'A1!!!', hidden: true }],
            hints: ['Use `.upper()` and then add the exclamation marks with `+`.']
          },
          {
            t: 'exercise', id: 'm04-ex-cleanname', title: 'Clean up a name', level: 1,
            prompt: 'Names are typed messily, such as <code>"   aSHA  "</code>. Ask for a name and print it with the spaces removed from both ends and the first letter only in capitals (<code>Asha</code>).',
            starter: C`
              name = input("Name: ")
            `,
            solution: C`
              name = input("Name: ")
              print(name.strip().title())
            `,
            tests: [{ in: ['   aSHA  '], out: 'Asha' }, { in: ['ben'], out: 'Ben' }, { in: ['  CHLOE'], out: 'Chloe', hidden: true }],
            hints: ['Two methods in a row: first strip, then change the case.', '`title()` and `capitalize()` both work for one word.']
          },
          {
            t: 'exercise', id: 'm04-ex-countletter', title: 'Count a letter', level: 2,
            prompt: 'Ask for a sentence, then ask for a single letter. Print how many times the letter appears in the sentence, ignoring capitals. Print just the number.',
            starter: C`
              sentence = input("Sentence: ")
              letter = input("Letter: ")
            `,
            solution: C`
              sentence = input("Sentence: ")
              letter = input("Letter: ")
              print(sentence.lower().count(letter.lower()))
            `,
            tests: [{ in: ['Banana', 'a'], out: '3' }, { in: ['Banana', 'B'], out: '1' }, { in: ['Hello there', 'z'], out: '0' }, { in: ['Mississippi River', 'S'], out: '4', hidden: true }],
            hints: ['Make both the sentence and the letter the same case first.', '`count()` does the counting.']
          },
          {
            t: 'exercise', id: 'm04-ex-wordcount', title: 'Word counter', level: 2,
            prompt: 'Ask for a sentence and print <code>Words: N</code>, where N is the number of words. Words are separated by one or more spaces.',
            starter: C`
              sentence = input("Sentence: ")
            `,
            solution: C`
              sentence = input("Sentence: ")
              print("Words:", len(sentence.split()))
            `,
            tests: [{ in: ['the quick brown fox'], out: 'Words: 4' }, { in: ['hello'], out: 'Words: 1' }, { in: ['one   two'], out: 'Words: 2' }, { in: [''], out: 'Words: 0', hidden: true }],
            hints: ['`split()` gives a list of words. How do you find the length of a list?']
          },
          {
            t: 'exercise', id: 'm04-ex-yesno', title: 'Friendly yes or no', level: 2,
            prompt: 'A game asks <code>Play again?</code>. Accept <code>yes</code> or <code>y</code> in any capitals and with extra spaces. Print <code>Starting a new game</code> if the answer means yes, otherwise print <code>Goodbye</code>.',
            starter: C`
              answer = input("Play again? ")
            `,
            solution: C`
              answer = input("Play again? ").strip().lower()
              if answer == "yes" or answer == "y":
                  print("Starting a new game")
              else:
                  print("Goodbye")
            `,
            tests: [{ in: ['yes'], out: 'Starting a new game' }, { in: ['  Y '], out: 'Starting a new game' }, { in: ['YES'], out: 'Starting a new game' }, { in: ['no'], out: 'Goodbye' }, { in: ['yep'], out: 'Goodbye', hidden: true }],
            hints: ['Clean the input first: `.strip().lower()`.', 'Use `or` to allow two accepted answers.']
          },
          {
            t: 'exercise', id: 'm04-ex-email', title: 'Split an email address', level: 3,
            prompt: 'Ask for an email address. If it contains an <code>@</code>, print <code>User: ...</code> and <code>Domain: ...</code> on two lines (the parts before and after the <code>@</code>). If it has no <code>@</code>, print <code>Invalid email</code>.',
            starter: C`
              email = input("Email: ")
            `,
            solution: C`
              email = input("Email: ")
              at = email.find("@")
              if at == -1:
                  print("Invalid email")
              else:
                  print("User:", email[:at])
                  print("Domain:", email[at + 1:])
            `,
            tests: [{ in: ['ben@school.org'], out: 'User: ben\nDomain: school.org' }, { in: ['nope'], out: 'Invalid email' }, { in: ['a@b'], out: 'User: a\nDomain: b' }, { in: ['sam.jones@mail.co.uk'], out: 'User: sam.jones\nDomain: mail.co.uk', hidden: true }],
            hints: ['`find("@")` returns -1 when there is none.', 'The user is `email[:at]`. The domain starts one place after the `@`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'string-traversal',
        title: 'Going through a string',
        time: '35 min',
        book: 'Ch 2 · p.56-57',
        exam: 'Paper 2 Q2',
        summary: 'for ch in s, for i in range(len(s)), building new strings, counting',
        intro: 'To check or change every character you need a loop. This lesson shows the two ways to loop over text, and how to build a new string one piece at a time.',
        blocks: [
          { t: 'h', text: 'Two ways to loop over a string' },
          { t: 'p', html: '**Traversal** means visiting every item in a sequence, one after another. A `for` loop can give you the characters themselves, or the index positions.' },
          {
            t: 'cases', title: 'By character and by index', items: [
              {
                label: 'for ch in s', intro: 'The loop variable becomes each character in turn. Use this when you only need the characters.', code: C`
              word = "code"
              for ch in word:
                  print(ch)
            ` },
              {
                label: 'for i in range(len(s))', intro: 'The loop variable is the index. Use this when you need the **position**, or the neighbouring characters.', code: C`
              word = "code"
              for i in range(len(word)):
                  print(i, word[i])
            ` },
              {
                label: 'Both together', intro: 'Press Trace to see `i` and `ch` change.', code: C`
              word = "cab"
              for i in range(len(word)):
                  ch = word[i]
                  print("index", i, "is", ch)
            ` },
              {
                label: 'Backwards by index', code: C`
              word = "stop"
              for i in range(len(word) - 1, -1, -1):
                  print(word[i])
            ` },
              {
                label: 'Empty string', intro: 'A loop over an empty string runs zero times.', code: C`
              for ch in "":
                  print("never printed")
              print("done")
            ` },
              {
                label: 'Range too large', expectError: true, intro: 'Using `len(s) + 1` goes one step too far.', code: C`
              word = "cat"
              for i in range(len(word) + 1):
                  print(word[i])
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'The Edexcel pseudocode loop <code>FOR EACH ch FROM word DO ... END FOR</code> is the same as <code>for ch in word:</code>. The indexed form <code>FOR i FROM 0 TO LENGTH(word) - 1 DO</code> is <code>for i in range(len(word)):</code>. Remember the upper bound difference.' },

          { t: 'h', text: 'Building a new string' },
          { t: 'p', html: 'Start with an empty string `""` and add to it inside the loop. This is the string version of an accumulator. Because strings are immutable, `result = result + ch` really creates a new string each time.' },
          {
            t: 'cases', title: 'Accumulating text', items: [
              {
                label: 'Reverse', code: C`
              word = "python"
              result = ""
              for ch in word:
                  result = ch + result
              print(result)
            ` },
              {
                label: 'Remove spaces', code: C`
              text = "a b  c"
              result = ""
              for ch in text:
                  if ch != " ":
                      result += ch
              print(result)
            ` },
              {
                label: 'Keep only digits', code: C`
              text = "Tel: 07 123-456"
              digits = ""
              for ch in text:
                  if ch.isdigit():
                      digits += ch
              print(digits)
            ` },
              {
                label: 'Double every letter', code: C`
              result = ""
              for ch in "abc":
                  result = result + ch * 2
              print(result)
            ` },
              {
                label: 'Forgot to start empty', expectError: true, intro: 'Using a variable before giving it a value crashes.', code: C`
              for ch in "abc":
                  result += ch
              print(result)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Put `result = ""` **before** the loop. If you put it inside the loop it is reset to empty on every pass, and you only keep the last piece.' },

          { t: 'h', text: 'Counting and checking' },
          {
            t: 'cases', title: 'Counters in a string loop', items: [
              {
                label: 'Count vowels', code: C`
              text = "Education"
              count = 0
              for ch in text.lower():
                  if ch in "aeiou":
                      count += 1
              print("Vowels:", count)
            ` },
              {
                label: 'Count capitals', code: C`
              text = "Hello World, It Is"
              capitals = 0
              for ch in text:
                  if ch.isupper():
                      capitals += 1
              print(capitals)
            ` },
              {
                label: 'Compare neighbours', intro: 'Looking at `word[i]` and `word[i + 1]` needs the index loop, stopping one early.', code: C`
              word = "balloon"
              pairs = 0
              for i in range(len(word) - 1):
                  if word[i] == word[i + 1]:
                      pairs += 1
              print("Double letters:", pairs)
            ` },
              {
                label: 'Position of first match', code: C`
              word = "banana"
              for i in range(len(word)):
                  if word[i] == "n":
                      print("First n at", i)
                      break
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'Press **Trace** on any of these. Watch `count` or `result` change only when the `if` is true.' },

          {
            t: 'predict', title: 'Build a string', code: C`
            result = ""
            for ch in "abc":
                result = ch + result + ch
            print(result)
          `, rows: 1, why: 'Pass 1 gives "aa"; pass 2 gives "baab"; pass 3 gives "cbaabc".'
          },
          {
            t: 'predict', title: 'Index loop', code: C`
            word = "hello"
            total = 0
            for i in range(len(word)):
                if word[i] == "l":
                    total += i
            print(total)
          `, rows: 1, why: 'The letter l is at indexes 2 and 3. The total of those indexes is 5.'
          },
          {
            t: 'parsons', title: 'Count the spaces', prompt: 'Arrange the lines to count how many spaces are in <code>text</code>.', lines: [
              'text = "a b c d"',
              'spaces = 0',
              'for ch in text:',
              '    if ch == " ":',
              '        spaces += 1',
              'print(spaces)',
            ], why: 'Set up, create the counter before the loop, loop over characters, test each one, then print once the loop is finished.'
          },
          { t: 'quiz', q: 'Which loop gives you the <strong>position</strong> of each character in <code>word</code>?', options: ['for ch in word:', 'for i in range(len(word)):', 'for i in word:', 'for ch in len(word):'], answer: 1, why: '`range(len(word))` produces the numbers 0 to len-1. A loop over `word` itself gives characters.' },

          {
            t: 'exercise', id: 'm04-ex-spell', title: 'Spell it out', level: 1,
            prompt: 'Ask for a word and print each letter on its own line.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              for ch in word:
                  print(ch)
            `,
            tests: [{ in: ['cat'], out: 'c\na\nt' }, { in: ['a'], out: 'a' }, { in: ['go on'], out: 'g\no\n\no\nn', hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['`for ch in word:` then print `ch`.']
          },
          {
            t: 'exercise', id: 'm04-ex-vowels', title: 'Vowel counter', level: 2,
            prompt: 'Ask for some text and print <code>Vowels: N</code>, counting a, e, i, o, u in lower or upper case.',
            starter: C`
              text = input("Text: ")
              count = 0
            `,
            solution: C`
              text = input("Text: ")
              count = 0
              for ch in text.lower():
                  if ch in "aeiou":
                      count += 1
              print("Vowels:", count)
            `,
            tests: [{ in: ['Education'], out: 'Vowels: 5' }, { in: ['rhythm'], out: 'Vowels: 0' }, { in: ['AEIOU aeiou'], out: 'Vowels: 10' }, { in: [''], out: 'Vowels: 0', hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['Start a counter at 0. Add 1 for each vowel.', 'Change the text to lower case first so you only test five letters.']
          },
          {
            t: 'exercise', id: 'm04-ex-reverse-loop', title: 'Reverse with a loop', level: 2,
            prompt: 'Ask for a word and print it reversed. Do <strong>not</strong> use a slice: build the result with a loop.',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              result = ""
              for ch in word:
                  result = ch + result
              print(result)
            `,
            tests: [{ in: ['stressed'], out: 'desserts' }, { in: ['a'], out: 'a' }, { in: ['Hello World'], out: 'dlroW olleH' }, { in: [''], out: '', hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }, { re: '::', not: true, msg: 'Do not use a reverse slice for this one.' }],
            hints: ['Start with `result = ""`.', 'Put each new character at the **front** of the result.']
          },
          {
            t: 'exercise', id: 'm04-ex-nospaces', title: 'Squash the spaces', level: 2,
            prompt: 'Ask for a sentence. Print it with all spaces removed, and then, on a second line, print how many spaces there were. Use a loop, not `replace`.',
            starter: C`
              text = input("Sentence: ")
            `,
            solution: C`
              text = input("Sentence: ")
              result = ""
              spaces = 0
              for ch in text:
                  if ch == " ":
                      spaces += 1
                  else:
                      result += ch
              print(result)
              print(spaces)
            `,
            tests: [{ in: ['a b c'], out: 'abc\n2' }, { in: ['nospaces'], out: 'nospaces\n0' }, { in: ['  hi  '], out: 'hi\n4', hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }, { re: 'replace', not: true, msg: 'Do not use `replace` here.' }],
            hints: ['Keep two things: the new text and a counter.', 'Use `if ch == " "` to decide which one to update.']
          },
          {
            t: 'exercise', id: 'm04-ex-capsbyhand', title: 'Capitals by hand', level: 3,
            prompt: 'Without using <code>title()</code> or <code>capitalize()</code>, make the first letter of every word a capital. Other letters stay as typed. Hint: a letter starts a word when it is the first character or the character before it is a space.',
            starter: C`
              text = input("Text: ")
            `,
            solution: C`
              text = input("Text: ")
              result = ""
              for i in range(len(text)):
                  if i == 0 or text[i - 1] == " ":
                      result += text[i].upper()
                  else:
                      result += text[i]
              print(result)
            `,
            tests: [{ in: ['hello big world'], out: 'Hello Big World' }, { in: ['python'], out: 'Python' }, { in: ['a b'], out: 'A B' }, { in: ['one  two'], out: 'One  Two', hidden: true }],
            requires: [{ re: 'title|capitalize', not: true, msg: 'Do it by hand, without `title()` or `capitalize()`.' }],
            hints: ['You need the index, so loop with `range(len(text))`.', 'Test `i == 0 or text[i - 1] == " "`.']
          },
          {
            t: 'exercise', id: 'm04-ex-debug-vowels', kind: 'debug', title: 'The broken vowel counter', level: 2,
            prompt: 'This program should print how many vowels (a, e, i, o, u) are in the lower-case word entered. It has <strong>three</strong> errors. Find and fix them.',
            starter: C`
              word = input("Word: ")
              count = 0
              for letter in word:
                  if letter == "a" or "e" or "i" or "o" or "u":
                      count = 1
              print("Vowels:" count)
            `,
            solution: C`
              word = input("Word: ")
              count = 0
              for letter in word:
                  if letter in "aeiou":
                      count += 1
              print("Vowels:", count)
            `,
            tests: [{ in: ['education'], out: 'Vowels: 5' }, { in: ['rhythm'], out: 'Vowels: 0' }, { in: ['banana'], out: 'Vowels: 3', hidden: true }],
            hints: ['One line has a missing comma, which stops the program starting.', '`letter == "a" or "e"` does not mean what it looks like. Use `in "aeiou"`.', 'The counter must add 1, not become 1.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'string-patterns',
        title: 'String algorithms',
        time: '40 min',
        book: 'Ch 2 · p.54-57',
        exam: 'Paper 2 Q2-Q4',
        summary: 'Palindromes, frequency, ord/chr, validation checks, f-strings',
        intro: 'Now combine everything. These are the string programs that appear again and again in practical exams, from checking a password to counting letters.',
        blocks: [
          { t: 'h', text: 'Pattern 1: palindromes and cleaning first' },
          { t: 'p', html: 'A **palindrome** reads the same both ways. Real text has capitals, spaces and punctuation, so clean the text before you test it.' },
          {
            t: 'cases', title: 'Palindrome checkers', items: [
              {
                label: 'Simple', code: C`
              word = "level"
              if word == word[::-1]:
                  print("Palindrome")
              else:
                  print("Not a palindrome")
            ` },
              {
                label: 'Ignoring case and spaces', stdin: ['Never odd or even'], code: C`
              text = input("Text: ")
              cleaned = text.lower().replace(" ", "")
              print(cleaned)
              print(cleaned == cleaned[::-1])
            ` },
              {
                label: 'Letters only', intro: 'Keep only letters, so commas and full stops do not matter.', code: C`
              text = "A man, a plan, a canal: Panama"
              cleaned = ""
              for ch in text.lower():
                  if ch.isalpha():
                      cleaned += ch
              print(cleaned)
              print(cleaned == cleaned[::-1])
            ` },
              {
                label: 'Two-pointer loop', intro: 'Compare the first with the last, the second with the second last, and so on, with no reversed copy.', code: C`
              word = "racecar"
              ok = True
              for i in range(len(word) // 2):
                  if word[i] != word[-1 - i]:
                      ok = False
              print(ok)
            ` },
            ]
          },

          { t: 'h', text: 'Pattern 2: counting every letter' },
          {
            t: 'cases', title: 'Frequency of letters', items: [
              {
                label: 'One letter', code: C`
              text = "mississippi"
              print(text.count("s"))
            ` },
              {
                label: 'All letters, first-seen order', intro: 'A string `seen` remembers which letters have already been reported.', code: C`
              text = "banana"
              seen = ""
              for ch in text:
                  if ch not in seen:
                      print(ch + ":", text.count(ch))
                      seen += ch
            ` },
              {
                label: 'Alphabet scan', intro: 'Loop over the alphabet and only print the letters that appear.', code: C`
              text = "banana"
              for letter in "abcdefghijklmnopqrstuvwxyz":
                  n = text.count(letter)
                  if n > 0:
                      print(letter, n)
            ` },
              {
                label: 'Most common letter', code: C`
              text = "banana"
              best = ""
              best_count = 0
              for ch in text:
                  n = text.count(ch)
                  if n > best_count:
                      best_count = n
                      best = ch
              print(best, best_count)
            ` },
            ]
          },

          { t: 'h', text: 'Pattern 3: flags for checking rules' },
          { t: 'p', html: 'To check a password you often need to ask: is there **at least one** digit? A **flag** is a True/False variable that starts as False and is switched on when a match is found.' },
          {
            t: 'cases', title: 'Rule checking', items: [
              {
                label: 'Any digit?', code: C`
              password = "hello7"
              has_digit = False
              for ch in password:
                  if ch.isdigit():
                      has_digit = True
              print(has_digit)
            ` },
              {
                label: 'Several rules', code: C`
              password = "Hello7x"
              has_digit = False
              has_upper = False
              for ch in password:
                  if ch.isdigit():
                      has_digit = True
                  if ch.isupper():
                      has_upper = True
              print("Length ok:", len(password) >= 8)
              print("Digit:", has_digit)
              print("Capital:", has_upper)
            ` },
              {
                label: 'All digits?', code: C`
              pin = "4821"
              print(len(pin) == 4 and pin.isdigit())
              pin = "48a1"
              print(len(pin) == 4 and pin.isdigit())
            ` },
              {
                label: 'Hidden in a loop: wrong flag', intro: 'Setting the flag back to False in the else branch loses the earlier match. Run it and compare with the first tab.', code: C`
              password = "a1b"
              has_digit = False
              for ch in password:
                  if ch.isdigit():
                      has_digit = True
                  else:
                      has_digit = False
              print(has_digit)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Only ever switch a flag **on** inside the loop. Never put `else: flag = False`, because the last character would decide the result.' },

          { t: 'h', text: 'Pattern 4: characters as numbers (extension)' },
          { t: 'p', html: 'Every character has a code number. `ord("A")` gives 65, and `chr(65)` gives `"A"`. Capital letters A to Z are 65 to 90; lower-case a to z are 97 to 122. The difference is 32. You will use this heavily for ciphers in module 12.' },
          {
            t: 'cases', title: 'ord and chr', items: [
              {
                label: 'The two functions', code: C`
              print(ord("A"), ord("a"), ord("0"))
              print(chr(66), chr(98), chr(48))
              print(ord("b") - ord("a"))
            ` },
              {
                label: 'To upper case by hand', code: C`
              text = "Hello, World 1"
              result = ""
              for ch in text:
                  if "a" <= ch <= "z":
                      result += chr(ord(ch) - 32)
                  else:
                      result += ch
              print(result)
            ` },
              {
                label: 'Position in the alphabet', code: C`
              for ch in "cab":
                  print(ch, ord(ch) - ord("a") + 1)
            ` },
            ]
          },

          { t: 'h', text: 'Pattern 5: building output with f-strings' },
          {
            t: 'cases', title: 'f-strings with text', items: [
              {
                label: 'Names and numbers', code: C`
              name = "Asha"
              score = 18
              print(f"{name} scored {score}/20")
              print(f"{name.upper()} has {len(name)} letters")
            ` },
              {
                label: 'Lining up columns', code: C`
              for item, price in [("Pen", 1.5), ("Notebook", 3.25)]:
                  print(f"{item:<10}{price:>6.2f}")
            ` },
              {
                label: 'Acronym', code: C`
              phrase = "portable network graphics"
              acronym = ""
              for word in phrase.split():
                  acronym += word[0].upper()
              print(acronym)
            ` },
            ]
          },

          {
            t: 'predict', title: 'Frequency trace', code: C`
            text = "aabca"
            seen = ""
            for ch in text:
                if ch not in seen:
                    print(ch, text.count(ch))
                    seen += ch
          `, rows: 3, why: 'Each letter is reported once, the first time it appears: a is 3, b is 1, c is 1.'
          },
          {
            t: 'predict', title: 'ord and chr', code: C`
            print(chr(ord("a") + 3))
            print(ord("z") - ord("a"))
          `, rows: 2, why: '`ord("a")` is 97, plus 3 is 100, which is d. The difference between z and a is 25.'
          },
          {
            t: 'sort', title: 'Which pattern?', prompt: 'Match each task with the string technique that fits best.', cats: ['Flag (True/False)', 'Counter', 'Build a new string'], items: [
              { text: 'Does the password contain at least one digit?', cat: 0 },
              { text: 'How many vowels are in a sentence?', cat: 1 },
              { text: 'Remove all spaces from some text.', cat: 2 },
              { text: 'Is every character of a PIN a digit?', cat: 0 },
              { text: 'How many capital letters are there?', cat: 1 },
              { text: 'Write the text in reverse order.', cat: 2 },
            ], why: 'Ask a yes/no question: flag. Ask "how many": counter. Produce changed text: build a new string.'
          },
          { t: 'quiz', q: 'What is the purpose of the line <code>if ch not in seen:</code> in the frequency program?', options: ['To skip spaces', 'To report each different letter only once', 'To count the vowels', 'To reverse the string'], answer: 1, why: '`seen` stores the letters already reported, so each distinct letter is handled only the first time.' },
          { t: 'note', kind: 'exam', html: 'A typical Paper 2 string question: "Write a program that asks for a password and checks it has at least 8 characters, a digit and a capital letter. Display a message for each rule that is broken." Use one flag per rule and print messages after the loop.' },

          {
            t: 'exercise', id: 'm04-ex-palindrome', title: 'Phrase palindromes', level: 2,
            prompt: 'Ask for a phrase. Ignoring capitals and spaces, print <code>Palindrome</code> or <code>Not a palindrome</code>.',
            starter: C`
              phrase = input("Phrase: ")
            `,
            solution: C`
              phrase = input("Phrase: ")
              cleaned = phrase.lower().replace(" ", "")
              if cleaned == cleaned[::-1]:
                  print("Palindrome")
              else:
                  print("Not a palindrome")
            `,
            tests: [{ in: ['Never odd or even'], out: 'Palindrome' }, { in: ['Hello there'], out: 'Not a palindrome' }, { in: ['Level'], out: 'Palindrome' }, { in: ['Was it a car or a cat I saw'], out: 'Palindrome', hidden: true }],
            hints: ['Clean first: lower case, then remove the spaces.', 'Then compare the cleaned text with its reverse.']
          },
          {
            t: 'exercise', id: 'm04-ex-acronym', title: 'Make an acronym', level: 2,
            prompt: 'Ask for a phrase and print the acronym: the first letter of every word, in capitals. For <code>portable network graphics</code> the output is <code>PNG</code>.',
            starter: C`
              phrase = input("Phrase: ")
            `,
            solution: C`
              phrase = input("Phrase: ")
              acronym = ""
              for word in phrase.split():
                  acronym += word[0].upper()
              print(acronym)
            `,
            tests: [{ in: ['portable network graphics'], out: 'PNG' }, { in: ['random access memory'], out: 'RAM' }, { in: ['hello'], out: 'H' }, { in: ['central   processing unit'], out: 'CPU', hidden: true }],
            hints: ['`split()` gives you the words. Loop over them.', '`word[0]` is the first letter of a word.']
          },
          {
            t: 'exercise', id: 'm04-ex-digitsum', title: 'Digit sum', level: 2,
            prompt: 'Ask for a string of digits, for example <code>2026</code>. Print the sum of the digits (2 + 0 + 2 + 6 = 10).',
            starter: C`
              digits = input("Digits: ")
            `,
            solution: C`
              digits = input("Digits: ")
              total = 0
              for ch in digits:
                  total += int(ch)
              print(total)
            `,
            tests: [{ in: ['2026'], out: '10' }, { in: ['7'], out: '7' }, { in: ['99999'], out: '45' }, { in: ['1000'], out: '1', hidden: true }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['Each character is text. Convert it with `int()` before adding it.']
          },
          {
            t: 'exercise', id: 'm04-ex-password', kind: 'exam', title: 'Password rules', level: 3,
            prompt: 'A website needs passwords that have at least 8 characters, at least one digit and at least one capital letter. Ask for a password. For each rule that is broken, print one message in this order: <code>Too short</code>, <code>No digit</code>, <code>No capital</code>. If no rule is broken print <code>Password accepted</code>.',
            starter: C`
              password = input("Password: ")
            `,
            solution: C`
              password = input("Password: ")
              has_digit = False
              has_capital = False
              for ch in password:
                  if ch.isdigit():
                      has_digit = True
                  if ch.isupper():
                      has_capital = True
              ok = True
              if len(password) < 8:
                  print("Too short")
                  ok = False
              if not has_digit:
                  print("No digit")
                  ok = False
              if not has_capital:
                  print("No capital")
                  ok = False
              if ok:
                  print("Password accepted")
            `,
            tests: [{ in: ['Secret123'], out: 'Password accepted' }, { in: ['abc'], out: 'Too short\nNo digit\nNo capital' }, { in: ['password1'], out: 'No capital' }, { in: ['PASSWORD'], out: 'No digit' }, { in: ['Ab1'], out: 'Too short', hidden: true }],
            hints: ['Use one True/False flag for the digit rule and one for the capital rule.', 'Check them after the loop, not inside it.', 'Use one `if` per rule, not `elif`, so several messages can appear.']
          },
          {
            t: 'exercise', id: 'm04-ex-frequency', title: 'Letter frequency', level: 3,
            prompt: 'Ask for a word. For each different letter, in order of first appearance, print the letter, a colon, a space and how many times it appears. For <code>banana</code> the output is<pre>b: 1\na: 3\nn: 2</pre>',
            starter: C`
              word = input("Word: ")
            `,
            solution: C`
              word = input("Word: ")
              seen = ""
              for ch in word:
                  if ch not in seen:
                      print(ch + ":", word.count(ch))
                      seen += ch
            `,
            tests: [{ in: ['banana'], out: 'b: 1\na: 3\nn: 2' }, { in: ['aaa'], out: 'a: 3' }, { in: ['abc'], out: 'a: 1\nb: 1\nc: 1' }, { in: ['hello'], out: 'h: 1\ne: 1\nl: 2\no: 1', hidden: true }],
            hints: ['Keep a string of letters you have already printed.', 'Only print a letter when it is not in that string yet.']
          },
          {
            t: 'exercise', id: 'm04-ex-upper-ord', title: 'Upper case with ord and chr', level: 3,
            prompt: 'Without using <code>upper()</code>, convert the text to capital letters. A lower-case letter has a code 32 higher than its capital. Letters that are not lower case stay unchanged.',
            starter: C`
              text = input("Text: ")
            `,
            solution: C`
              text = input("Text: ")
              result = ""
              for ch in text:
                  if "a" <= ch <= "z":
                      result += chr(ord(ch) - 32)
                  else:
                      result += ch
              print(result)
            `,
            tests: [{ in: ['Hello, World 1'], out: 'HELLO, WORLD 1' }, { in: ['abc'], out: 'ABC' }, { in: ['ABC 123'], out: 'ABC 123' }, { in: ['xyz!'], out: 'XYZ!', hidden: true }],
            requires: [{ re: 'upper', not: true, msg: 'Do not use `upper()`.' }, { re: 'ord', msg: 'Use `ord()` and `chr()`.' }],
            hints: ['Test `"a" <= ch <= "z"` to find lower-case letters.', '`chr(ord(ch) - 32)` gives the capital.']
          },
        ],
      },
    ],
  });
})();

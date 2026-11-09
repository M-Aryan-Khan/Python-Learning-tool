(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm09',
    title: 'More Python tools',
    blurb: 'Tuples, dictionaries, comprehensions, enumerate, zip, sorting with a key, and recursion.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'tuples-dicts',
        title: 'Tuples and dictionaries',
        time: '40 min',
        book: 'Extension',
        summary: 'Immutable tuples, unpacking, dictionaries, KeyError, .get, looping, frequencies, records',
        intro: 'A list is not the only way to store a group of values. A **tuple** is a list that cannot be changed. A **dictionary** stores values under names (keys) instead of positions.',
        blocks: [
          { t: 'h', text: 'Tuples' },
          { t: 'p', html: 'A **tuple** is written with round brackets. You can index and slice it like a list, but you **cannot change it** after it is made. This is called being **immutable**.' },
          { t: 'cases', title: 'Tuples', items: [
            { label: 'Create and index', code: C`
              point = (3, 7)
              print(point)
              print(point[0], point[1])
              print(len(point))
              print(point[-1])
            ` },
            { label: 'One item and empty', intro: 'A one-item tuple needs a trailing comma.', code: C`
              one = (5,)
              not_a_tuple = (5)
              empty = ()
              print(type(one))
              print(type(not_a_tuple))
              print(len(empty))
            ` },
            { label: 'Unpacking', intro: 'Give one variable name per item.', code: C`
              colour = (255, 128, 0)
              red, green, blue = colour
              print(red, green, blue)
            ` },
            { label: 'Cannot change', expectError: true, code: C`
              point = (3, 7)
              point[0] = 10
            ` },
            { label: 'Returning a tuple', intro: 'This is what a function does when it returns two values.', code: C`
              def min_max(numbers):
                  return min(numbers), max(numbers)

              low, high = min_max([4, 9, 2, 7])
              print(low, high)
              print(min_max([5]))
            ` },
            { label: 'Swap and convert', code: C`
              a, b = 1, 2
              a, b = b, a
              print(a, b)
              items = list((1, 2, 3))
              fixed = tuple([4, 5, 6])
              print(items, fixed)
            ` },
            { label: 'Wrong unpack count', expectError: true, code: C`
              a, b = (1, 2, 3)
            ` },
          ] },
          { t: 'note', kind: 'tip', html: 'Use a tuple for data that belongs together and should not change, such as a coordinate or a (name, score) pair.' },

          { t: 'h', text: 'Dictionaries' },
          { t: 'p', html: 'A **dictionary** holds **key: value** pairs inside curly brackets. You look up a value by its key, not by a position number. Keys are unique.' },
          { t: 'cases', title: 'Using a dictionary', items: [
            { label: 'Create and read', code: C`
              ages = {"Asha": 15, "Ben": 14, "Chloe": 16}
              print(ages["Ben"])
              print(len(ages))
              print(ages)
            ` },
            { label: 'Add and update', intro: 'Assigning to a new key adds it; assigning to an existing key replaces the value.', code: C`
              ages = {"Asha": 15}
              ages["Dev"] = 13
              ages["Asha"] = 16
              print(ages)
            ` },
            { label: 'Delete', code: C`
              ages = {"Asha": 15, "Ben": 14}
              del ages["Ben"]
              print(ages)
              removed = ages.pop("Asha")
              print(removed, ages)
            ` },
            { label: 'in tests keys', code: C`
              ages = {"Asha": 15, "Ben": 14}
              print("Asha" in ages)
              print("Zed" in ages)
              print(15 in ages)
              print("Zed" not in ages)
            ` },
            { label: 'KeyError', expectError: true, intro: 'Asking for a key that is not there crashes.', code: C`
              ages = {"Asha": 15}
              print(ages["Zed"])
            ` },
            { label: '.get() is safe', intro: '`.get(key)` returns `None` when the key is missing, or a default you choose.', code: C`
              ages = {"Asha": 15}
              print(ages.get("Zed"))
              print(ages.get("Zed", "unknown"))
              print(ages.get("Asha", "unknown"))
            ` },
            { label: 'Empty dictionary', code: C`
              stock = {}
              print(stock, len(stock))
              stock["pens"] = 20
              print(stock)
            ` },
          ] },

          { t: 'h', text: 'Looping over a dictionary' },
          { t: 'cases', title: 'Keys, values and items', items: [
            { label: 'Keys (default)', code: C`
              prices = {"pen": 2, "book": 5, "bag": 18}
              for item in prices:
                  print(item)
            ` },
            { label: '.values()', code: C`
              prices = {"pen": 2, "book": 5, "bag": 18}
              total = 0
              for p in prices.values():
                  total = total + p
              print("Total:", total)
            ` },
            { label: '.items()', intro: 'Gives a (key, value) pair on each pass. Unpack it in the loop header.', code: C`
              prices = {"pen": 2, "book": 5, "bag": 18}
              for item, price in prices.items():
                  print(item, "costs", price)
            ` },
            { label: 'Find the largest', code: C`
              scores = {"Asha": 72, "Ben": 91, "Chloe": 85}
              best_name = ""
              best_score = -1
              for name, score in scores.items():
                  if score > best_score:
                      best_score = score
                      best_name = name
              print(best_name, best_score)
            ` },
          ] },

          { t: 'h', text: 'Counting frequencies' },
          { t: 'p', html: 'A dictionary is perfect for counting how often things appear. The key is the thing, the value is the count.' },
          { t: 'cases', title: 'Frequency counting', items: [
            { label: 'Letters in a word', code: C`
              word = "banana"
              counts = {}
              for ch in word:
                  if ch in counts:
                      counts[ch] = counts[ch] + 1
                  else:
                      counts[ch] = 1
              print(counts)
            ` },
            { label: 'Using .get', intro: 'A shorter pattern: the default 0 covers the first time we see a key.', code: C`
              votes = ["red", "blue", "red", "green", "red", "blue"]
              tally = {}
              for v in votes:
                  tally[v] = tally.get(v, 0) + 1
              for colour, n in tally.items():
                  print(colour, n)
            ` },
            { label: 'Bug: no starting value', expectError: true, code: C`
              counts = {}
              for ch in "aab":
                  counts[ch] = counts[ch] + 1
            ` },
          ] },

          { t: 'h', text: 'Records: a dictionary per item' },
          { t: 'p', html: 'A **record** groups several fields about one thing. A dictionary makes each field readable by name. A list of dictionaries is a small table.' },
          { t: 'cases', title: 'Records', items: [
            { label: 'One record', code: C`
              student = {"name": "Asha", "year": 10, "mark": 78}
              print(student["name"], "got", student["mark"])
              student["mark"] = 82
              print(student)
            ` },
            { label: 'List of records', code: C`
              students = [
                  {"name": "Asha", "mark": 78},
                  {"name": "Ben", "mark": 64},
                  {"name": "Chloe", "mark": 91},
              ]
              for s in students:
                  print(s["name"], s["mark"])
              total = 0
              for s in students:
                  total = total + s["mark"]
              print("Mean:", total / len(students))
            ` },
            { label: 'Search a record', code: C`
              students = [{"name": "Asha", "mark": 78}, {"name": "Ben", "mark": 64}]
              wanted = "Ben"
              for s in students:
                  if s["name"] == wanted:
                      print(wanted, "scored", s["mark"])
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'Dictionary keys must be unique and cannot be lists. Writing the same key twice keeps only the last value: `{"a": 1, "a": 2}` is `{"a": 2}`.' },

          { t: 'predict', title: 'Dictionary updates', code: C`
            d = {"a": 1, "b": 2}
            d["c"] = 3
            d["a"] = d["a"] + 10
            del d["b"]
            print(d)
            print(len(d), "a" in d, "b" in d)
          `, rows: 2, why: 'a becomes 11, c is added, b is deleted. Two keys remain.' },
          { t: 'predict', title: 'Frequencies', code: C`
            counts = {}
            for ch in "hello":
                counts[ch] = counts.get(ch, 0) + 1
            print(counts["l"], counts.get("z", 0), len(counts))
          `, rows: 1, why: 'l appears twice; z is missing so the default 0 is used; the keys are h, e, l, o.' },
          { t: 'quiz', q: 'Which one is a tuple?', options: ['[1, 2]', '{1, 2}', '(1, 2)', '{"a": 1}'], answer: 2, why: 'Round brackets make a tuple, square brackets a list and curly brackets a set or dictionary.' },
          { t: 'sort', title: 'List, tuple or dictionary?', prompt: 'Choose the best structure for each job.', cats: ['List', 'Tuple', 'Dictionary'], items: [
            { text: 'The scores of 30 students, added to during the term', cat: 0 },
            { text: 'The x and y position of a point that never changes', cat: 1 },
            { text: 'A phone book: look up a number by name', cat: 2 },
            { text: 'A shopping basket where items are added and removed', cat: 0 },
            { text: 'Counting how many times each word appears', cat: 2 },
            { text: 'The (red, green, blue) values of a colour', cat: 1 },
          ], why: 'Lists change; tuples are fixed groups; dictionaries look up values by a key.' },

          { t: 'exercise', id: 'm09-ex-stock', compute: true, title: 'Stock check', level: 1,
            prompt: 'Create a dictionary <code>stock</code> with <code>"pens": 20</code> and <code>"books": 5</code>. Add <code>"rulers": 12</code>. Change pens to 18. Then print the dictionary.',
            starter: C`
              stock = {}
            `,
            solution: C`
              stock = {"pens": 20, "books": 5}
              stock["rulers"] = 12
              stock["pens"] = 18
              print(stock)
            `,
            tests: [{ out: "{'pens': 18, 'books': 5, 'rulers': 12}" }],
            hints: ['Assign to a new key to add it.', 'Assign to an existing key to replace its value.'] },
          { t: 'exercise', id: 'm09-ex-wordcount', title: 'Word counter', level: 2,
            prompt: 'Write a function <code>count_words(sentence)</code> that returns a dictionary of how many times each word appears. Split on spaces; treat the text as given (no changes to capital letters).',
            starter: C`
              def count_words(sentence):
                  pass
            `,
            solution: C`
              def count_words(sentence):
                  counts = {}
                  for w in sentence.split():
                      counts[w] = counts.get(w, 0) + 1
                  return counts
            `,
            tests: [{ py: 'assert count_words("a b a") == {"a": 2, "b": 1}' }, { py: 'assert count_words("") == {}', label: 'empty text' }, { py: 'assert count_words("go go go") == {"go": 3}', hidden: true }],
            hints: ['Start with an empty dictionary.', '`counts[w] = counts.get(w, 0) + 1`'] },
          { t: 'exercise', id: 'm09-ex-phonebook', title: 'Phone book', level: 2,
            prompt: 'A phone book is stored in a dictionary: <code>{"Asha": "0711", "Ben": "0722", "Chloe": "0733"}</code>. Ask for a name. Print the number if it is in the book, otherwise print <code>Not found</code>.',
            starter: C`
              book = {"Asha": "0711", "Ben": "0722", "Chloe": "0733"}
              name = input("Name: ")
            `,
            solution: C`
              book = {"Asha": "0711", "Ben": "0722", "Chloe": "0733"}
              name = input("Name: ")
              if name in book:
                  print(book[name])
              else:
                  print("Not found")
            `,
            tests: [{ in: ['Ben'], out: '0722' }, { in: ['Zed'], out: 'Not found' }, { in: ['Chloe'], out: '0733', hidden: true }, { in: ['ben'], out: 'Not found', hidden: true }],
            hints: ['Test with `in` before looking up, or use `.get`.'] },
          { t: 'exercise', id: 'm09-ex-debug-dict', kind: 'debug', title: 'Three errors: dictionary', level: 2,
            prompt: 'This program should print each item with its price and then the total price: <code>pen costs 2</code>, <code>book costs 5</code>, <code>Total: 7</code>. There are <strong>three</strong> errors.',
            starter: C`
              prices = {"pen": 2, "book": 5}
              total = 0
              for item in prices.items()
                  print(item, "costs", prices[item])
                  total = total + price
              print("Total:", total)
            `,
            solution: C`
              prices = {"pen": 2, "book": 5}
              total = 0
              for item in prices:
                  print(item, "costs", prices[item])
                  total = total + prices[item]
              print("Total:", total)
            `,
            tests: [{ out: 'pen costs 2\nbook costs 5\nTotal: 7' }],
            hints: ['A `for` line needs a colon.', 'Looping over the dictionary itself gives the keys.', '`price` is not defined; look up `prices[item]`.'] },
          { t: 'exercise', id: 'm09-ex-gradebook', title: 'Class gradebook', level: 3, kind: 'exam',
            prompt: 'Store marks in a dictionary, starting empty. Repeat: ask for a student name (type <code>done</code> to finish); if not done, ask for the mark (integer) and store it. If a name is entered twice keep the <strong>higher</strong> mark. At the end print each <code>name: mark</code> in the order they were first entered, then <code>Best: NAME</code> for the highest mark. If no students were entered print <code>No students</code> only.',
            starter: C`
              marks = {}
            `,
            solution: C`
              marks = {}
              name = input("Name: ")
              while name != "done":
                  mark = int(input("Mark: "))
                  if name not in marks or mark > marks[name]:
                      marks[name] = mark
                  name = input("Name: ")
              if len(marks) == 0:
                  print("No students")
              else:
                  best = ""
                  for n in marks:
                      print(n + ":", marks[n])
                      if best == "" or marks[n] > marks[best]:
                          best = n
                  print("Best:", best)
            `,
            tests: [{ in: ['Asha', '70', 'Ben', '85', 'done'], out: 'Asha: 70\nBen: 85\nBest: Ben' }, { in: ['done'], out: 'No students' }, { in: ['Asha', '60', 'Asha', '90', 'Ben', '80', 'done'], out: 'Asha: 90\nBen: 80\nBest: Asha', hidden: true }],
            hints: ['Use a `while name != "done"` loop.', 'Only store when the name is new or the new mark is higher.', 'Dictionaries keep the order that keys were added.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'comprehensions',
        title: 'List comprehensions (optional power tool)',
        time: '30 min',
        book: 'Extension',
        summary: 'Build lists in one line: map, filter, conditions, and when not to use them',
        intro: 'A list comprehension is a short way to write a loop that builds a list. You never *need* one: every comprehension can be written as a normal loop. Learn to read them, and use them when they make code shorter and clearer.',
        blocks: [
          { t: 'h', text: 'From a loop to a comprehension' },
          { t: 'cases', title: 'Same result, two ways', items: [
            { label: 'Loop version', code: C`
              squares = []
              for n in range(1, 6):
                  squares.append(n * n)
              print(squares)
            ` },
            { label: 'Comprehension', intro: 'Read it as: "n * n for each n in range(1, 6)".', code: C`
              squares = [n * n for n in range(1, 6)]
              print(squares)
            ` },
          ] },
          { t: 'note', kind: 'key', html: 'Shape: <code>[ expression for variable in sequence ]</code>. The **expression** says what goes in the new list; the `for` part says where the values come from.' },

          { t: 'cases', title: 'Transforming (map)', items: [
            { label: 'Doubling', code: C`
              nums = [3, 5, 8]
              print([n * 2 for n in nums])
            ` },
            { label: 'Strings', code: C`
              names = ["asha", "ben", "chloe"]
              print([n.upper() for n in names])
              print([n.capitalize() for n in names])
              print([len(n) for n in names])
            ` },
            { label: 'From a string', code: C`
              print([ch for ch in "hello"])
              print([ord(ch) for ch in "AB"])
            ` },
            { label: 'Casting input text', stdin: ['4 8 15'], code: C`
              numbers = [int(x) for x in input("Numbers: ").split()]
              print(numbers)
              print(sum(numbers))
            ` },
          ] },

          { t: 'h', text: 'Filtering with if' },
          { t: 'p', html: 'Add `if condition` at the end to keep only items that pass the test.' },
          { t: 'cases', title: 'Filtering', items: [
            { label: 'Evens', code: C`
              print([n for n in range(1, 11) if n % 2 == 0])
            ` },
            { label: 'Pass marks', code: C`
              marks = [34, 56, 78, 40, 91]
              print([m for m in marks if m >= 50])
            ` },
            { label: 'Filter and change', code: C`
              marks = [34, 56, 78, 40, 91]
              print([m + 5 for m in marks if m < 50])
            ` },
            { label: 'Nothing matches', intro: 'The result is an empty list, never an error.', code: C`
              print([n for n in [1, 3, 5] if n > 10])
            ` },
            { label: 'if / else goes before for', intro: 'To choose between two values, put `x if cond else y` in the **expression** part.', code: C`
              marks = [34, 56, 78]
              print(["pass" if m >= 50 else "fail" for m in marks])
            ` },
            { label: 'Common mistake', expectError: true, intro: 'A plain `if ... else` cannot go at the end.', code: C`
              marks = [34, 56, 78]
              print([m for m in marks if m >= 50 else 0])
            ` },
          ] },

          { t: 'h', text: 'Summaries: any, all, sum, len' },
          { t: 'cases', title: 'Comprehensions with built-ins', items: [
            { label: 'sum and len', code: C`
              marks = [34, 56, 78, 40, 91]
              print(sum([m for m in marks if m >= 50]))
              print(len([m for m in marks if m >= 50]))
            ` },
            { label: 'any()', intro: '`any` is true if at least one item is true.', code: C`
              marks = [34, 56, 78]
              print(any(m > 70 for m in marks))
              print(any(m > 90 for m in marks))
            ` },
            { label: 'all()', intro: '`all` is true only if every item is true. On an empty list it is true.', code: C`
              marks = [34, 56, 78]
              print(all(m >= 30 for m in marks))
              print(all(m >= 50 for m in marks))
              print(all(m > 0 for m in []))
            ` },
            { label: 'Nested (2D)', code: C`
              grid = [[1, 2, 3], [4, 5, 6]]
              print([[v * 10 for v in row] for row in grid])
              print([v for row in grid for v in row])
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'If a comprehension is hard to read, write the loop instead. Exams accept loops, and clear code scores better than clever code.' },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode has no list comprehension; use <code>FOR EACH x FROM list DO … END FOR</code> with an append. Know both, but in the exam write the loop unless you are sure.' },

          { t: 'predict', title: 'Read the comprehension', code: C`
            nums = [1, 2, 3, 4, 5, 6]
            print([n * n for n in nums if n % 2 == 1])
          `, rows: 1, why: 'The odd numbers are 1, 3, 5, and their squares are 1, 9, 25.' },
          { t: 'predict', title: 'Words', code: C`
            words = ["tree", "sky", "mountain"]
            print([w[0] for w in words])
            print([w for w in words if len(w) > 3])
          `, rows: 2, why: 'The first takes the first letter; the second keeps words longer than 3 letters.' },
          { t: 'quiz', q: 'Which comprehension gives the list <code>[10, 20, 30]</code>?', options: ['[n for n in range(10, 40, 10)]', '[n * 10 for n in range(3)]', '[n * 10 for n in range(1, 4)]', '[n + 10 for n in range(3)]'], answer: [0, 2], why: 'range(10, 40, 10) is 10, 20, 30 and range(1, 4) times 10 is the same. Option 2 starts at 0.' },
          { t: 'parsons', title: 'Rewrite as a comprehension', prompt: 'Rebuild this single line, which keeps the lengths of words longer than 2 letters.', lines: ['lengths = [', 'len(w)', 'for w in words', 'if len(w) > 2', ']'], why: 'Expression, then for, then the condition, all inside the brackets.' },

          { t: 'exercise', id: 'm09-ex-cubes', title: 'Cubes', level: 1,
            prompt: 'Using a list comprehension, create <code>cubes</code>: the cubes (n × n × n) of the numbers 1 to 5. Print it.',
            starter: C`
              cubes = []
              print(cubes)
            `,
            solution: C`
              cubes = [n ** 3 for n in range(1, 6)]
              print(cubes)
            `,
            tests: [{ out: '[1, 8, 27, 64, 125]' }],
            requires: [{ re: '\\[[^\\]]*\\bfor\\b', msg: 'Use a list comprehension.' }],
            hints: ['`[expression for n in range(1, 6)]`', 'Cube is `n ** 3`.'] },
          { t: 'exercise', id: 'm09-ex-shortwords', title: 'Filter the words', level: 2,
            prompt: 'Write <code>long_words(words, size)</code> that returns a list of the words with <strong>more than</strong> <code>size</code> letters, in uppercase. Use a comprehension.',
            starter: C`
              def long_words(words, size):
                  pass
            `,
            solution: C`
              def long_words(words, size):
                  return [w.upper() for w in words if len(w) > size]
            `,
            tests: [{ py: 'assert long_words(["cat", "horse", "elephant"], 4) == ["HORSE", "ELEPHANT"]' }, { py: 'assert long_words(["a"], 3) == []', label: 'nothing long enough' }, { py: 'assert long_words(["abcd"], 4) == []', hidden: true }],
            requires: [{ re: '\\[[^\\]]*\\bfor\\b', msg: 'Use a list comprehension.' }],
            hints: ['Expression `w.upper()`, condition `len(w) > size`.'] },
          { t: 'exercise', id: 'm09-ex-numbers-scenario', title: 'Numbers on one line', level: 2, kind: 'exam',
            prompt: 'The user types several whole numbers on one line, separated by spaces. Print the <strong>total of the numbers greater than 10</strong>, then how many there were, as <code>Total: T</code> and <code>Count: C</code>.',
            starter: C`
              line = input("Numbers: ")
            `,
            solution: C`
              line = input("Numbers: ")
              numbers = [int(x) for x in line.split()]
              big = [n for n in numbers if n > 10]
              print("Total:", sum(big))
              print("Count:", len(big))
            `,
            tests: [{ in: ['5 12 20 3'], out: 'Total: 32\nCount: 2' }, { in: ['1 2 3'], out: 'Total: 0\nCount: 0' }, { in: ['10 11'], out: 'Total: 11\nCount: 1', hidden: true }],
            hints: ['`line.split()` gives a list of text pieces; convert each with `int`.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'enumerate-zip',
        title: 'enumerate, zip and sorting with a key',
        time: '35 min',
        book: 'Extension',
        summary: 'enumerate, zip, sorted with key/reverse, min/max with key',
        intro: 'These tools remove awkward index handling from loops and sort data in the ways you actually need.',
        blocks: [
          { t: 'h', text: 'enumerate: the index and the item together' },
          { t: 'cases', title: 'enumerate', items: [
            { label: 'The old way', code: C`
              names = ["Asha", "Ben", "Chloe"]
              for i in range(len(names)):
                  print(i, names[i])
            ` },
            { label: 'With enumerate', code: C`
              names = ["Asha", "Ben", "Chloe"]
              for i, name in enumerate(names):
                  print(i, name)
            ` },
            { label: 'Start at 1', intro: 'Numbered lists for people usually start at 1.', code: C`
              names = ["Asha", "Ben", "Chloe"]
              for number, name in enumerate(names, start=1):
                  print(str(number) + ".", name)
            ` },
            { label: 'Find a position', code: C`
              scores = [40, 75, 62, 75]
              for i, s in enumerate(scores):
                  if s == 75:
                      print("75 at index", i)
            ` },
            { label: 'Strings too', code: C`
              for i, ch in enumerate("abc"):
                  print(i, ch)
            ` },
          ] },

          { t: 'h', text: 'zip: walking two lists together' },
          { t: 'p', html: '`zip` pairs up the items of two (or more) lists. It stops at the shortest list. It is perfect for **parallel lists**.' },
          { t: 'cases', title: 'zip', items: [
            { label: 'Two lists', code: C`
              names = ["Asha", "Ben", "Chloe"]
              marks = [72, 58, 90]
              for name, mark in zip(names, marks):
                  print(name, mark)
            ` },
            { label: 'Different lengths', code: C`
              a = [1, 2, 3, 4]
              b = ["x", "y"]
              print(list(zip(a, b)))
            ` },
            { label: 'Make a dictionary', code: C`
              names = ["Asha", "Ben"]
              marks = [72, 58]
              print(dict(zip(names, marks)))
            ` },
            { label: 'Compare neighbours', code: C`
              temps = [14, 16, 15, 19]
              for before, after in zip(temps, temps[1:]):
                  print(before, "->", after, "rise" if after > before else "no rise")
            ` },
            { label: 'Zip is not a list', intro: 'A zip object is used up once you loop over it; wrap it in `list()` to keep it.', code: C`
              z = zip([1, 2], [3, 4])
              print(list(z))
              print(list(z))
            ` },
          ] },

          { t: 'h', text: 'Sorting with sorted() and a key' },
          { t: 'cases', title: 'sorted', items: [
            { label: 'sorted vs sort', intro: '`sorted` returns a new list and leaves the original alone. `.sort()` changes the list and returns `None`.', code: C`
              nums = [5, 2, 9, 1]
              print(sorted(nums))
              print(nums)
              nums.sort()
              print(nums)
            ` },
            { label: 'reverse', code: C`
              nums = [5, 2, 9, 1]
              print(sorted(nums, reverse=True))
            ` },
            { label: 'key = len', intro: 'The `key` is a function that turns each item into the value used for comparing.', code: C`
              words = ["pear", "fig", "banana", "kiwi"]
              print(sorted(words, key=len))
              print(sorted(words, key=len, reverse=True))
            ` },
            { label: 'Capital letters', intro: 'Capitals sort before lower case. Use `key=str.lower` to ignore case.', code: C`
              names = ["ben", "Asha", "chloe", "Dev"]
              print(sorted(names))
              print(sorted(names, key=str.lower))
            ` },
            { label: 'By a column', intro: 'Sort rows of a 2D list or records by one field. A small helper function is the key.', code: C`
              rows = [["Asha", 72], ["Ben", 58], ["Chloe", 90]]

              def by_mark(row):
                  return row[1]

              for name, mark in sorted(rows, key=by_mark, reverse=True):
                  print(name, mark)
            ` },
            { label: 'List of dictionaries', code: C`
              people = [{"n": "Asha", "age": 15}, {"n": "Ben", "age": 13}]
              for p in sorted(people, key=lambda p: p["age"]):
                  print(p["n"], p["age"])
            ` },
            { label: 'Mixed types fail', expectError: true, code: C`
              print(sorted([3, "a", 1]))
            ` },
          ] },
          { t: 'note', kind: 'tip', html: '`lambda p: p["age"]` is a one-line nameless function. It does the same as `def f(p): return p["age"]`. You can use either form.' },

          { t: 'h', text: 'min, max with a key, and any / all' },
          { t: 'cases', title: 'Using key with min and max', items: [
            { label: 'Longest word', code: C`
              words = ["pear", "banana", "fig"]
              print(max(words, key=len))
              print(min(words, key=len))
            ` },
            { label: 'Best record', code: C`
              rows = [["Asha", 72], ["Ben", 58], ["Chloe", 90]]
              best = max(rows, key=lambda r: r[1])
              print(best[0], "has the top mark", best[1])
            ` },
            { label: 'any / all with a list', code: C`
              marks = [55, 62, 48]
              print(any(m < 50 for m in marks))
              print(all(m >= 40 for m in marks))
            ` },
            { label: 'Empty list', expectError: true, code: C`
              print(max([]))
            ` },
          ] },

          { t: 'predict', title: 'enumerate and zip', code: C`
            a = ["x", "y"]
            b = [10, 20, 30]
            for i, (p, q) in enumerate(zip(a, b)):
                print(i, p, q)
          `, rows: 2, why: 'zip stops after two pairs; enumerate numbers them 0 and 1.' },
          { t: 'predict', title: 'sorted with key', code: C`
            words = ["bb", "a", "ccc", "dd"]
            print(sorted(words, key=len, reverse=True))
          `, rows: 1, why: 'Longest first. The two-letter words keep their original order, "bb" then "dd", because Python sorting is stable.' },
          { t: 'quiz', q: 'What does <code>sorted(nums)</code> do to the list <code>nums</code>?', options: ['Sorts it in place', 'Leaves it unchanged and returns a new sorted list', 'Returns None', 'Deletes duplicates'], answer: 1, why: 'Only `.sort()` changes the original.' },
          { t: 'quiz', q: 'Which loop header gives numbers starting at 1 beside each name?', options: ['for i, n in enumerate(names):', 'for i, n in enumerate(names, start=1):', 'for i in names:', 'for n in zip(names):'], answer: 1, why: '`start=1` makes the counter begin at 1.' },

          { t: 'exercise', id: 'm09-ex-numbered', title: 'Numbered list', level: 1,
            prompt: 'Given <code>items = ["milk", "eggs", "bread"]</code>, print each item with a number starting from 1, like <code>1. milk</code>.',
            starter: C`
              items = ["milk", "eggs", "bread"]
            `,
            solution: C`
              items = ["milk", "eggs", "bread"]
              for n, item in enumerate(items, start=1):
                  print(str(n) + ".", item)
            `,
            tests: [{ out: '1. milk\n2. eggs\n3. bread' }],
            requires: [{ re: 'enumerate', msg: 'Use `enumerate`.' }],
            hints: ['`enumerate(items, start=1)`', 'Join the number and the dot with `str(n) + "."`.'] },
          { t: 'exercise', id: 'm09-ex-report', title: 'Parallel lists report', level: 2,
            prompt: 'Write <code>report(names, marks)</code> returning a list of strings like <code>"Asha: 72"</code>, one per pair, using <code>zip</code>.',
            starter: C`
              def report(names, marks):
                  pass
            `,
            solution: C`
              def report(names, marks):
                  lines = []
                  for name, mark in zip(names, marks):
                      lines.append(name + ": " + str(mark))
                  return lines
            `,
            tests: [{ py: 'assert report(["Asha", "Ben"], [72, 58]) == ["Asha: 72", "Ben: 58"]' }, { py: 'assert report([], []) == []', label: 'empty' }, { py: 'assert report(["A", "B", "C"], [1, 2]) == ["A: 1", "B: 2"]', hidden: true }],
            requires: [{ re: '\\bzip\\s*\\(', msg: 'Use `zip`.' }],
            hints: ['Loop with `for name, mark in zip(names, marks):`.', 'Convert the mark with `str()`.'] },
          { t: 'exercise', id: 'm09-ex-leaderboard', title: 'Leaderboard', level: 2, kind: 'exam',
            prompt: 'Three players and their scores are stored in parallel lists. Print the leaderboard from highest score to lowest as <code>1. NAME SCORE</code>, <code>2. …</code>. Use <code>zip</code>, <code>sorted</code> with a key and <code>enumerate</code>.',
            starter: C`
              names = ["Asha", "Ben", "Chloe"]
              scores = [55, 80, 62]
            `,
            solution: C`
              names = ["Asha", "Ben", "Chloe"]
              scores = [55, 80, 62]
              pairs = list(zip(names, scores))
              ranked = sorted(pairs, key=lambda p: p[1], reverse=True)
              for place, (name, score) in enumerate(ranked, start=1):
                  print(str(place) + ".", name, score)
            `,
            tests: [{ out: '1. Ben 80\n2. Chloe 62\n3. Asha 55' }],
            requires: [{ re: 'zip', msg: 'Use `zip`.' }, { re: 'sorted', msg: 'Use `sorted`.' }, { re: 'enumerate', msg: 'Use `enumerate`.' }],
            hints: ['Make pairs with `zip`, sort them by the second item.', 'Number the sorted list with `enumerate(..., start=1)`.'] },
          { t: 'exercise', id: 'm09-ex-longest', title: 'Longest name', level: 2,
            prompt: 'Ask for three names (one per line). Print the longest name. If two are equally long print the first one entered.',
            starter: C`
              names = []
            `,
            solution: C`
              names = []
              for i in range(3):
                  names.append(input("Name: "))
              print(max(names, key=len))
            `,
            tests: [{ in: ['Al', 'Beatrice', 'Cy'], out: 'Beatrice' }, { in: ['Ann', 'Bob', 'Cy'], out: 'Ann' }, { in: ['x', 'yy', 'zz'], out: 'yy', hidden: true }],
            hints: ['Fill the list with a loop, then use `max` with `key=len`.'] },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'recursion',
        title: 'Recursion',
        time: '40 min',
        book: 'Extension',
        summary: 'A function calling itself, base case, factorial, countdown, sum of a list, Trace',
        intro: '**Recursion** is when a function calls itself to solve a smaller version of the same problem. It looks strange at first. The trick is to trust that the smaller call works, and to know exactly when to stop.',
        blocks: [
          { t: 'h', text: 'The two parts' },
          { t: 'list', items: [
            'A **base case**: a situation simple enough to answer directly. It stops the recursion.',
            'A **recursive case**: the function calls itself with a **smaller** problem, then uses that answer.',
          ] },
          { t: 'code', title: 'countdown', code: C`
            def countdown(n):
                if n == 0:
                    print("Go!")
                else:
                    print(n)
                    countdown(n - 1)

            countdown(3)
          `, caption: 'Press Trace and watch the same function being entered again and again. Base case: `n == 0`.' },

          { t: 'h', text: 'Factorial' },
          { t: 'p', html: 'The factorial of 5 is 5 × 4 × 3 × 2 × 1. Notice that 5! = 5 × 4!, so the problem is defined in terms of a smaller one. By definition 0! is 1.' },
          { t: 'cases', title: 'Factorial two ways', items: [
            { label: 'Recursive', code: C`
              def factorial(n):
                  if n == 0:
                      return 1
                  return n * factorial(n - 1)

              print(factorial(5))
              print(factorial(0))
              print(factorial(1))
            ` },
            { label: 'Loop version', intro: 'Any recursion can be a loop. The loop is often faster and simpler; recursion is often neater.', code: C`
              def factorial(n):
                  result = 1
                  for i in range(2, n + 1):
                      result = result * i
                  return result

              print(factorial(5))
              print(factorial(0))
            ` },
            { label: 'Unwinding', intro: 'The calls pile up, then the answers are multiplied on the way back.', code: C`
              def factorial(n):
                  print("call with", n)
                  if n == 0:
                      print("base case, return 1")
                      return 1
                  answer = n * factorial(n - 1)
                  print("return", answer, "for n =", n)
                  return answer

              factorial(3)
            ` },
          ] },

          { t: 'h', text: 'Forgetting the base case' },
          { t: 'cases', title: 'When recursion goes wrong', items: [
            { label: 'No base case', expectError: true, intro: 'The function never stops calling itself. Python gives up with a `RecursionError`.', code: C`
              def forever(n):
                  print(n)
                  forever(n + 1)

              forever(1)
            ` },
            { label: 'Wrong direction', expectError: true, intro: 'The base case is `n == 0`, but the call moves away from it.', code: C`
              def count(n):
                  if n == 0:
                      return 0
                  return 1 + count(n + 1)

              print(count(3))
            ` },
            { label: 'Negative input', expectError: true, intro: 'Starting below the base case skips past it.', code: C`
              def factorial(n):
                  if n == 0:
                      return 1
                  return n * factorial(n - 1)

              print(factorial(-1))
            ` },
            { label: 'Forgot return', expectError: true, intro: 'The recursive call is made but its answer is thrown away, so a call returns `None` and the addition above it crashes.', code: C`
              def total_to(n):
                  if n == 0:
                      return 0
                  n + total_to(n - 1)

              print(total_to(3))
            ` },
          ] },
          { t: 'note', kind: 'warn', html: 'Every recursive function needs (1) a base case and (2) a recursive call that moves **towards** the base case.' },

          { t: 'h', text: 'More recursive patterns' },
          { t: 'cases', title: 'Sum, power and strings', items: [
            { label: 'Sum of a list', intro: 'The sum is the first item plus the sum of the rest. An empty list sums to 0.', code: C`
              def list_sum(items):
                  if len(items) == 0:
                      return 0
                  return items[0] + list_sum(items[1:])

              print(list_sum([4, 8, 3]))
              print(list_sum([]))
            ` },
            { label: 'Sum 1 to n', code: C`
              def sum_to(n):
                  if n == 1:
                      return 1
                  return n + sum_to(n - 1)

              print(sum_to(4))
              print(sum_to(100))
            ` },
            { label: 'Power', code: C`
              def power(base, exp):
                  if exp == 0:
                      return 1
                  return base * power(base, exp - 1)

              print(power(2, 5))
              print(power(7, 0))
            ` },
            { label: 'Reverse a string', code: C`
              def reverse(s):
                  if len(s) <= 1:
                      return s
                  return reverse(s[1:]) + s[0]

              print(reverse("python"))
              print(reverse(""))
            ` },
            { label: 'Palindrome', code: C`
              def is_palindrome(s):
                  if len(s) <= 1:
                      return True
                  if s[0] != s[-1]:
                      return False
                  return is_palindrome(s[1:-1])

              print(is_palindrome("level"))
              print(is_palindrome("python"))
            ` },
            { label: 'Fibonacci', intro: 'Two recursive calls. Each number is the sum of the two before it. Fine for small n; slow for big n.', code: C`
              def fib(n):
                  if n < 2:
                      return n
                  return fib(n - 1) + fib(n - 2)

              print([fib(i) for i in range(10)])
            ` },
          ] },
          { t: 'note', kind: 'exam', html: 'You may be asked to <strong>trace a recursive function</strong> or to say what its output is. Write each call on its own line, indent as it goes deeper, find the base case, then work back up filling in return values. You are unlikely to be asked to <em>invent</em> a recursive solution, but must be able to read one.' },

          { t: 'predict', title: 'Trace the calls', code: C`
            def f(n):
                if n <= 0:
                    return 0
                return n + f(n - 2)

            print(f(5))
            print(f(4))
          `, rows: 2, why: 'f(5) = 5 + 3 + 1 + 0 = 9; f(4) = 4 + 2 + 0 = 6.' },
          { t: 'predict', title: 'Printing before and after', code: C`
            def show(n):
                if n > 0:
                    print("in", n)
                    show(n - 1)
                    print("out", n)

            show(2)
          `, rows: 4, why: 'It prints "in" going down (2, 1) and "out" while coming back up (1, 2).' },
          { t: 'quiz', q: 'What is the purpose of the base case?', options: ['To make the function faster', 'To stop the function calling itself forever', 'To store the answer', 'To import modules'], answer: 1, why: 'Without it, the recursion never ends.' },
          { t: 'quiz', q: 'Which recursive function never reaches its base case when called with 5?', options: ['def f(n): return 0 if n == 0 else f(n - 1)', 'def f(n): return 0 if n == 0 else f(n + 1)', 'def f(n): return 0 if n <= 0 else f(n - 2)', 'def f(n): return 1 if n == 1 else f(n - 1)'], answer: 1, why: 'Calling with n + 1 moves away from 0.' },

          { t: 'exercise', id: 'm09-ex-sumto', title: 'Sum to n', level: 1,
            prompt: 'Write a recursive function <code>sum_to(n)</code> that returns 1 + 2 + … + n. Return 0 when <code>n</code> is 0.',
            starter: C`
              def sum_to(n):
                  pass
            `,
            solution: C`
              def sum_to(n):
                  if n == 0:
                      return 0
                  return n + sum_to(n - 1)
            `,
            tests: [{ py: 'assert sum_to(4) == 10' }, { py: 'assert sum_to(0) == 0', label: 'base case' }, { py: 'assert sum_to(10) == 55', hidden: true }],
            requires: [{ re: 'sum_to\\([^)]*\\)[\\s\\S]*sum_to\\(', msg: 'The function must call itself.' }],
            hints: ['Base case: `n == 0` returns 0.', 'Recursive case: `n + sum_to(n - 1)`.'] },
          { t: 'exercise', id: 'm09-ex-countdown', title: 'Recursive countdown', level: 2,
            prompt: 'Write a recursive procedure <code>countdown(n)</code> that prints <code>n</code>, <code>n-1</code>, … down to 1, then prints <code>Lift off</code>. No loops.',
            starter: C`
              def countdown(n):
                  pass

              countdown(int(input("Start: ")))
            `,
            solution: C`
              def countdown(n):
                  if n == 0:
                      print("Lift off")
                  else:
                      print(n)
                      countdown(n - 1)

              countdown(int(input("Start: ")))
            `,
            tests: [{ in: ['3'], out: '3\n2\n1\nLift off' }, { in: ['0'], out: 'Lift off' }, { in: ['1'], out: '1\nLift off', hidden: true }],
            requires: [{ re: '\\b(for|while)\\b', not: true, msg: 'Do not use a loop.' }],
            hints: ['Base case: n is 0, print Lift off.', 'Otherwise print n and call `countdown(n - 1)`.'] },
          { t: 'exercise', id: 'm09-ex-debug-recursion', kind: 'debug', title: 'Three errors: recursion', level: 3,
            prompt: 'The function <code>power(base, exp)</code> should return <code>base</code> to the power <code>exp</code> using recursion. The program reads two numbers and prints the answer. There are <strong>three</strong> errors.',
            starter: C`
              def power(base, exp)
                  if exp == 0:
                      return 0
                  return base * power(base, exp)

              b = int(input("Base: "))
              e = int(input("Exponent: "))
              print(power(b, e))
            `,
            solution: C`
              def power(base, exp):
                  if exp == 0:
                      return 1
                  return base * power(base, exp - 1)

              b = int(input("Base: "))
              e = int(input("Exponent: "))
              print(power(b, e))
            `,
            tests: [{ in: ['2', '5'], out: '32' }, { in: ['7', '0'], out: '1' }, { in: ['3', '3'], out: '27', hidden: true }],
            hints: ['The first line needs a colon.', 'Anything to the power 0 is 1, not 0.', 'The recursive call must make `exp` smaller.'] },
          { t: 'exercise', id: 'm09-ex-digits', title: 'Count the digits', level: 3, kind: 'exam',
            prompt: 'Write a recursive function <code>digit_count(n)</code> for a whole number <code>n</code> that is 0 or more. A single digit (0 to 9) has 1 digit. Otherwise the answer is 1 plus the count for <code>n // 10</code>. The program reads a number and prints the count.',
            starter: C`
              def digit_count(n):
                  pass

              print(digit_count(int(input("Number: "))))
            `,
            solution: C`
              def digit_count(n):
                  if n < 10:
                      return 1
                  return 1 + digit_count(n // 10)

              print(digit_count(int(input("Number: "))))
            `,
            tests: [{ in: ['7'], out: '1' }, { in: ['4096'], out: '4' }, { in: ['10'], out: '2' }, { in: ['0'], out: '1', hidden: true }, { in: ['999999'], out: '6', hidden: true }],
            hints: ['Base case: `n < 10`.', 'Recursive case: `1 + digit_count(n // 10)`.'] },
        ],
      },
    ],
  });
})();

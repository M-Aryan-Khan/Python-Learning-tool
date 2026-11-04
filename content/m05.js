(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm05',
    title: 'Lists (1D arrays)',
    blurb: 'Store many values under one name: create, index, change, loop and process lists, and avoid the classic list traps.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'list-basics',
        title: 'Lists: creating and indexing',
        time: '30 min',
        book: 'Ch 2 · p.67',
        exam: 'Paper 2 Q3',
        summary: 'Create lists, index, negative index, slices, len, change an element',
        intro: 'A variable holds one value. A list holds many, in order, under a single name. Edexcel calls this a one-dimensional array.',
        blocks: [
          { t: 'h', text: 'Why lists?' },
          { t: 'p', html: 'Imagine storing the marks of 30 students. Thirty variables would be silly. A **list** keeps them together, and each value has an **index**, a position number, starting at 0. Each value is an **element** (or item).' },
          { t: 'html', html: '<div class="cells"><div class="c"><b>12</b><i>0</i><i>-5</i></div><div class="c"><b>7</b><i>1</i><i>-4</i></div><div class="c"><b>15</b><i>2</i><i>-3</i></div><div class="c"><b>9</b><i>3</i><i>-2</i></div><div class="c"><b>11</b><i>4</i><i>-1</i></div></div>' },
          { t: 'p', html: 'This is the list `[12, 7, 15, 9, 11]`. The number in the box is the value, the first number below is the index and the second is the negative index.' },
          { t: 'note', kind: 'exam', html: 'Edexcel uses the word <strong>array</strong>, a fixed-size collection of items of the same type, and writes <code>SET marks TO [12, 7, 15]</code>. Python lists can grow and mix types, but in Paper 2 you use them as arrays.' },

          { t: 'h', text: 'Creating lists' },
          {
            t: 'cases', title: 'Different ways to make a list', items: [
              {
                label: 'Literal', intro: 'Square brackets, items separated by commas.', code: C`
              scores = [12, 7, 15, 9, 11]
              names = ["Asha", "Ben", "Chloe"]
              mixed = ["Ana", 15, True, 1.5]
              print(scores)
              print(names)
              print(mixed)
            ` },
              {
                label: 'Empty', intro: 'An empty list is the start point for building a list in a loop.', code: C`
              items = []
              print(items)
              print(len(items))
            ` },
              {
                label: 'Repeat [0] * n', intro: 'Quickly make a list of n starting values.', code: C`
              counts = [0] * 5
              print(counts)
              flags = [False] * 3
              print(flags)
              print(["-"] * 4)
            ` },
              {
                label: 'list(range())', code: C`
              print(list(range(5)))
              print(list(range(2, 7)))
              print(list(range(10, 0, -3)))
              print(list(range(0)))
            ` },
              {
                label: 'From a string', intro: '`list()` splits a string into characters and `split()` into words.', code: C`
              print(list("hello"))
              print("red green blue".split())
              print("3,8,1".split(","))
            ` },
              {
                label: 'List of text numbers', intro: '`split` always gives strings, even when the pieces look like numbers.', code: C`
              parts = "3 8 1".split()
              print(parts)
              print(parts[0] + parts[1])
              print(int(parts[0]) + int(parts[1]))
            ` },
            ]
          },

          { t: 'h', text: 'Reading elements' },
          {
            t: 'cases', title: 'Index, negative index and len', items: [
              {
                label: 'Positive index', code: C`
              scores = [12, 7, 15, 9, 11]
              print(scores[0])
              print(scores[2])
              print(scores[4])
            ` },
              {
                label: 'Negative index', code: C`
              scores = [12, 7, 15, 9, 11]
              print(scores[-1])
              print(scores[-2])
              print(scores[-5])
            ` },
              {
                label: 'len()', intro: 'The last index is always `len(list) - 1`.', code: C`
              scores = [12, 7, 15, 9, 11]
              print(len(scores))
              print(scores[len(scores) - 1])
              print(len([]))
            ` },
              {
                label: 'Index out of range', expectError: true, code: C`
              scores = [12, 7, 15, 9, 11]
              print(scores[5])
            ` },
              {
                label: 'Empty list index', expectError: true, intro: 'An empty list has no valid index at all.', code: C`
              items = []
              print(items[0])
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'A list of 5 items has indexes 0 to 4. `scores[5]` raises an **IndexError** ("list index out of range").' },

          { t: 'h', text: 'Slices and changing elements' },
          { t: 'p', html: 'Slices work exactly as they do for strings: `[start:stop]` where stop is excluded. A slice of a list is a new list. Unlike strings, lists are **mutable**: you can change an element in place.' },
          {
            t: 'cases', title: 'Slicing and assigning', items: [
              {
                label: 'Slices', code: C`
              scores = [12, 7, 15, 9, 11]
              print(scores[1:3])
              print(scores[:2])
              print(scores[3:])
              print(scores[-2:])
              print(scores[::-1])
              print(scores[::2])
              print(scores[10:])
            ` },
              {
                label: 'Change an element', code: C`
              scores = [12, 7, 15, 9, 11]
              scores[1] = 20
              scores[-1] = scores[-1] + 1
              print(scores)
            ` },
              {
                label: 'Change a slice', code: C`
              letters = ["a", "b", "c", "d"]
              letters[1:3] = ["X", "Y", "Z"]
              print(letters)
            ` },
              {
                label: 'Cannot assign beyond the end', expectError: true, code: C`
              scores = [12, 7, 15]
              scores[3] = 99
            ` },
              {
                label: 'Use in expressions', code: C`
              scores = [12, 7, 15]
              print(scores[0] + scores[2])
              print(scores[1] * 2)
              print(scores[0] > scores[1])
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'To **add** a new item you cannot assign to a position that does not exist. Use `append` (next lesson).' },

          { t: 'h', text: 'Whole-list operations' },
          {
            t: 'cases', title: 'in, +, * and comparison', items: [
              {
                label: 'in', code: C`
              colours = ["red", "green", "blue"]
              print("green" in colours)
              print("pink" in colours)
              print("pink" not in colours)
              print("gre" in colours)
            ` },
              {
                label: 'Joining and repeating', code: C`
              a = [1, 2]
              b = [3, 4]
              print(a + b)
              print(a * 3)
            ` },
              {
                label: 'min, max, sum', code: C`
              scores = [12, 7, 15, 9, 11]
              print(min(scores))
              print(max(scores))
              print(sum(scores))
              print(sum(scores) / len(scores))
            ` },
              {
                label: 'Comparing lists', code: C`
              print([1, 2] == [1, 2])
              print([1, 2] == [2, 1])
              print(["a"] == "a")
            ` },
            ]
          },

          {
            t: 'predict', title: 'Indexing a list', code: C`
            data = [4, 8, 15, 16, 23, 42]
            print(data[1], data[-2])
            print(data[2:4])
            print(len(data))
          `, rows: 3, why: 'Index 1 is 8 and -2 is 23. The slice [2:4] has indexes 2 and 3. There are six items.'
          },
          {
            t: 'predict', title: 'Changing a list', code: C`
            a = [1, 2, 3]
            a[0] = a[2] * 10
            a[-1] = 0
            print(a)
          `, rows: 1, why: '`a[0]` becomes 30, then the last element becomes 0, leaving [30, 2, 0].'
          },
          { t: 'quiz', q: 'Which statement is true for <code>names = ["Ann", "Bo", "Cy"]</code>?', options: ['names[3] is "Cy"', 'names[-1] is "Cy"', 'len(names) is 2', 'names[1] is "Ann"'], answer: 1, why: 'The last item can be reached with -1. The indexes are 0, 1, 2, and len is 3.' },
          { t: 'quiz', q: 'What does <code>[0] * 4</code> produce?', options: ['[0, 4]', '[0, 0, 0, 0]', '0', '[4]'], answer: 1, why: 'Multiplying a list repeats its contents.' },

          {
            t: 'exercise', id: 'm05-ex-threenames', title: 'Three names', level: 1,
            prompt: 'Ask for three names, one at a time, and store them in a list called <code>names</code>. Then print the first name, the last name and the number of names on separate lines.',
            starter: C`
              first = input("Name 1: ")
              second = input("Name 2: ")
              third = input("Name 3: ")
            `,
            solution: C`
              first = input("Name 1: ")
              second = input("Name 2: ")
              third = input("Name 3: ")
              names = [first, second, third]
              print(names[0])
              print(names[-1])
              print(len(names))
            `,
            tests: [{ in: ['Ann', 'Bo', 'Cy'], out: 'Ann\nCy\n3' }, { in: ['x', 'y', 'z'], out: 'x\nz\n3' }, { in: ['Li', 'Li', 'Jo'], out: 'Li\nJo\n3', hidden: true }],
            requires: [{ re: '\\[[^\\]]*,[^\\]]*\\]', msg: 'Put the names in a list with square brackets.' }],
            hints: ['`names = [first, second, third]`', 'Use index 0 and index -1.']
          },
          {
            t: 'exercise', id: 'm05-ex-middlescore', title: 'Change the middle score', level: 1,
            prompt: 'The list <code>scores = [4, 8, 15]</code> is given. Ask for a new score (a whole number), put it in place of the **middle** score, then print the whole list.',
            starter: C`
              scores = [4, 8, 15]
              new_score = int(input("New score: "))
            `,
            solution: C`
              scores = [4, 8, 15]
              new_score = int(input("New score: "))
              scores[1] = new_score
              print(scores)
            `,
            tests: [{ in: ['9'], out: '[4, 9, 15]' }, { in: ['0'], out: '[4, 0, 15]' }, { in: ['100'], out: '[4, 100, 15]', hidden: true }],
            hints: ['The middle item has index 1.', 'Assign with `scores[1] = ...`.']
          },
          {
            t: 'exercise', id: 'm05-ex-zeros', title: 'A list of zeros', level: 2,
            prompt: 'Ask for a whole number <code>n</code> (at least 1). Create a list of <code>n</code> zeros, change the **last** one to 1, and print the list.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              items = [0] * n
              items[-1] = 1
              print(items)
            `,
            tests: [{ in: ['4'], out: '[0, 0, 0, 1]' }, { in: ['1'], out: '[1]' }, { in: ['6'], out: '[0, 0, 0, 0, 0, 1]', hidden: true }],
            hints: ['`[0] * n` builds the list.', 'The last index is -1.']
          },
          {
            t: 'exercise', id: 'm05-ex-slicelist', title: 'Slice a list of numbers', level: 2,
            prompt: 'Ask for a number <code>n</code>. Make the list of whole numbers from 1 to <code>n</code> using <code>list(range(...))</code>. Print the items at positions 0, 2, 4... on the first line and the last three items on the second line (both as lists). Assume n is at least 3.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              nums = list(range(1, n + 1))
              print(nums[::2])
              print(nums[-3:])
            `,
            tests: [{ in: ['10'], out: '[1, 3, 5, 7, 9]\n[8, 9, 10]' }, { in: ['3'], out: '[1, 3]\n[1, 2, 3]' }, { in: ['7'], out: '[1, 3, 5, 7]\n[5, 6, 7]', hidden: true }],
            hints: ['`range(1, n + 1)` includes n.', 'A step of 2 gives every other item.']
          },
          {
            t: 'exercise', id: 'm05-ex-rotate', title: 'Rotate left', level: 3,
            prompt: 'Ask for a number <code>n</code> (at least 2). Build the list 1 to n. Print the list <strong>rotated left by one place</strong>: the first item moves to the end. For n = 4 print <code>[2, 3, 4, 1]</code>. Use slices and <code>+</code>.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              nums = list(range(1, n + 1))
              print(nums[1:] + nums[:1])
            `,
            tests: [{ in: ['4'], out: '[2, 3, 4, 1]' }, { in: ['2'], out: '[2, 1]' }, { in: ['6'], out: '[2, 3, 4, 5, 6, 1]', hidden: true }],
            hints: ['Everything but the first item is `nums[1:]`.', '`nums[:1]` is a list containing only the first item.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'list-methods',
        title: 'List methods',
        time: '35 min',
        book: 'Ch 2 · p.67-68',
        exam: 'Paper 2 Q3',
        summary: 'append, insert, extend, remove, pop, del, sort, sorted, reverse, index, count',
        intro: 'Lists can grow, shrink and be rearranged. Unlike strings, list methods usually change the list itself and give nothing back.',
        blocks: [
          { t: 'h', text: 'Adding items' },
          {
            t: 'cases', title: 'append, insert, extend', items: [
              {
                label: 'append', intro: '`append` adds **one** item to the end. It changes the list in place.', code: C`
              queue = ["Ann", "Ben"]
              queue.append("Cal")
              print(queue)
              queue.append("Dee")
              print(queue)
            ` },
              {
                label: 'Build from empty', code: C`
              evens = []
              evens.append(2)
              evens.append(4)
              evens.append(6)
              print(evens)
              print(len(evens))
            ` },
              {
                label: 'insert', intro: '`insert(position, item)` puts an item at an index and shifts the others to the right.', code: C`
              queue = ["Ann", "Ben", "Cal"]
              queue.insert(0, "VIP")
              print(queue)
              queue.insert(2, "Zed")
              print(queue)
              queue.insert(100, "Last")
              print(queue)
            ` },
              {
                label: 'extend', intro: '`extend` adds **every item** of another list.', code: C`
              a = [1, 2]
              a.extend([3, 4])
              print(a)
              a.append([5, 6])
              print(a)
            ` },
              {
                label: 'append vs +', code: C`
              a = [1, 2]
              b = a + [3]
              print(a)
              print(b)
              a += [3]
              print(a)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: '`a.append([5, 6])` adds the whole list as **one** item (a list inside a list). Use `extend` to add the items separately.' },

          { t: 'h', text: 'Removing items' },
          {
            t: 'cases', title: 'remove, pop, del, clear', items: [
              {
                label: 'remove by value', intro: '`remove` deletes the **first** item equal to the value.', code: C`
              colours = ["red", "blue", "red", "green"]
              colours.remove("red")
              print(colours)
            ` },
              {
                label: 'remove missing', expectError: true, intro: 'Removing a value that is not there gives a **ValueError**.', code: C`
              colours = ["red", "blue"]
              colours.remove("pink")
            ` },
              {
                label: 'Check first', code: C`
              colours = ["red", "blue"]
              item = "pink"
              if item in colours:
                  colours.remove(item)
              else:
                  print(item, "is not in the list")
            ` },
              {
                label: 'pop', intro: '`pop()` removes the last item and **gives it back**. `pop(i)` removes the item at index `i`.', code: C`
              stack = [10, 20, 30, 40]
              last = stack.pop()
              print(last, stack)
              first = stack.pop(0)
              print(first, stack)
            ` },
              {
                label: 'pop from empty', expectError: true, code: C`
              items = []
              items.pop()
            ` },
              {
                label: 'del', intro: '`del` removes by index, and can remove slices.', code: C`
              nums = [5, 6, 7, 8, 9]
              del nums[1]
              print(nums)
              del nums[-2:]
              print(nums)
            ` },
              {
                label: 'clear', code: C`
              nums = [1, 2, 3]
              nums.clear()
              print(nums)
            ` },
            ]
          },

          { t: 'h', text: 'Searching, sorting, reversing' },
          {
            t: 'cases', title: 'index, count, sort, reverse', items: [
              {
                label: 'index and count', code: C`
              nums = [4, 9, 4, 7]
              print(nums.index(4))
              print(nums.index(7))
              print(nums.count(4))
              print(nums.count(100))
            ` },
              {
                label: 'index missing', expectError: true, code: C`
              nums = [4, 9, 4, 7]
              print(nums.index(100))
            ` },
              {
                label: 'sort', intro: '`sort()` puts the list in order **in place**. Add `reverse=True` for largest first.', code: C`
              nums = [4, 9, 1, 7]
              nums.sort()
              print(nums)
              nums.sort(reverse=True)
              print(nums)
              words = ["pear", "apple", "fig"]
              words.sort()
              print(words)
            ` },
              {
                label: 'sorted', intro: '`sorted()` leaves the original alone and returns a new sorted list.', code: C`
              nums = [4, 9, 1, 7]
              ordered = sorted(nums)
              print(ordered)
              print(nums)
              print(sorted("hello"))
            ` },
              {
                label: 'reverse', intro: '`reverse()` flips the list in place, without sorting.', code: C`
              nums = [4, 9, 1, 7]
              nums.reverse()
              print(nums)
              print(nums[::-1])
            ` },
              {
                label: 'The sort trap', intro: '`sort()` returns **None**, so assigning its result destroys your list.', code: C`
              nums = [4, 9, 1, 7]
              nums = nums.sort()
              print(nums)
            ` },
            ]
          },
          {
            t: 'table', head: ['Method / function', 'Changes the list?', 'Returns'], rows: [
              ['`append(x)`, `insert(i, x)`, `extend(list)`', 'Yes', 'None'],
              ['`remove(x)`, `del list[i]`, `clear()`', 'Yes', 'None'],
              ['`pop()`, `pop(i)`', 'Yes', 'The removed item'],
              ['`sort()`, `reverse()`', 'Yes', 'None'],
              ['`sorted(list)`', 'No', 'A new sorted list'],
              ['`index(x)`, `count(x)`', 'No', 'A number'],
              ['`min`, `max`, `sum`, `len`', 'No', 'A number'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode adds to an array with <code>APPEND</code> style wording or by assigning to an index. When asked for a **sorted** output in Paper 2 the question may forbid built-in <code>sort()</code> and expect your own sorting code (module 11), so read the task carefully.' },

          { t: 'viz', kind: 'list', caption: 'Press each operation and watch the indexes shift. Try `pop` with an index that does not exist.' },

          {
            t: 'predict', title: 'Append and pop', code: C`
            a = [1, 2, 3]
            a.append(4)
            x = a.pop()
            a.insert(1, 9)
            print(a, x)
          `, rows: 1, why: 'After append the list is [1, 2, 3, 4]. pop returns 4 and leaves [1, 2, 3]. Inserting 9 at index 1 gives [1, 9, 2, 3].'
          },
          {
            t: 'predict', title: 'remove only removes one', code: C`
            n = [5, 3, 5, 8, 5]
            n.remove(5)
            print(n)
            print(n.count(5))
          `, rows: 2, why: '`remove` deletes only the first 5. Two 5s remain.'
          },
          { t: 'quiz', q: 'Which line leaves <code>nums</code> sorted from smallest to largest?', options: ['nums = nums.sort()', 'nums.sort()', 'sorted(nums)', 'nums.reverse()'], answer: 1, why: '`nums.sort()` changes the list in place. `sorted(nums)` makes a sorted copy but you did not store it.' },
          {
            t: 'sort', title: 'Method or not?', prompt: 'Does the line change the original list, or leave it as it was?', cats: ['Changes the original list', 'Leaves the original list alone'], items: [
              { text: '<code>items.append("x")</code>', cat: 0 },
              { text: '<code>sorted(items)</code>', cat: 1 },
              { text: '<code>items.pop()</code>', cat: 0 },
              { text: '<code>len(items)</code>', cat: 1 },
              { text: '<code>items[::-1]</code>', cat: 1 },
              { text: '<code>items.reverse()</code>', cat: 0 },
            ], why: 'Methods like append, pop and reverse edit the list. Functions like sorted and len and slices make something new or just report.'
          },
          {
            t: 'parsons', title: 'Add and sort', prompt: 'Arrange the lines to start with a list of scores, add a new one entered by the user, sort largest first and print.', lines: [
              'scores = [70, 20, 90]',
              'new_score = int(input("New score: "))',
              'scores.append(new_score)',
              'scores.sort(reverse=True)',
              'print(scores)',
            ], why: 'Create, read, add, sort, show.'
          },

          {
            t: 'exercise', id: 'm05-ex-shopping', title: 'Shopping list', level: 1,
            prompt: 'The list <code>shopping = ["milk", "eggs"]</code> is given. Ask for another item, add it to the **end** of the list and print the list.',
            starter: C`
              shopping = ["milk", "eggs"]
            `,
            solution: C`
              shopping = ["milk", "eggs"]
              item = input("Item: ")
              shopping.append(item)
              print(shopping)
            `,
            tests: [{ in: ['bread'], out: "['milk', 'eggs', 'bread']" }, { in: ['jam'], out: "['milk', 'eggs', 'jam']" }, { in: ['x'], out: "['milk', 'eggs', 'x']", hidden: true }],
            hints: ['Read the item with `input()`, then use `.append()`.']
          },
          {
            t: 'exercise', id: 'm05-ex-queue', title: 'Serve the queue', level: 2,
            prompt: 'The list <code>queue = ["Ann", "Ben", "Cal"]</code> is given. A new person joins at the end (ask for their name). Then the person at the **front** is served. Print <code>Served: NAME</code> and, on the next line, the remaining queue as a list.',
            starter: C`
              queue = ["Ann", "Ben", "Cal"]
            `,
            solution: C`
              queue = ["Ann", "Ben", "Cal"]
              name = input("Name: ")
              queue.append(name)
              served = queue.pop(0)
              print("Served:", served)
              print(queue)
            `,
            tests: [{ in: ['Dee'], out: "Served: Ann\n['Ben', 'Cal', 'Dee']" }, { in: ['Ed'], out: "Served: Ann\n['Ben', 'Cal', 'Ed']" }, { in: ['Zoe'], out: "Served: Ann\n['Ben', 'Cal', 'Zoe']", hidden: true }],
            requires: [{ re: 'pop', msg: 'Use `pop(0)` to take the first person.' }],
            hints: ['`pop(0)` removes and returns the first item.']
          },
          {
            t: 'exercise', id: 'm05-ex-leaderboard', title: 'Leaderboard', level: 2,
            prompt: 'The scores <code>[70, 20, 90]</code> are given. Ask for a new score, add it, sort the list from **largest to smallest** and print the list.',
            starter: C`
              scores = [70, 20, 90]
            `,
            solution: C`
              scores = [70, 20, 90]
              new_score = int(input("New score: "))
              scores.append(new_score)
              scores.sort(reverse=True)
              print(scores)
            `,
            tests: [{ in: ['50'], out: '[90, 70, 50, 20]' }, { in: ['100'], out: '[100, 90, 70, 20]' }, { in: ['5'], out: '[90, 70, 20, 5]', hidden: true }],
            hints: ['Do not forget to convert the input with `int()`.', '`sort(reverse=True)` puts the biggest first.']
          },
          {
            t: 'exercise', id: 'm05-ex-tempstats', title: 'Temperature facts', level: 2,
            prompt: 'The list <code>temps = [12, 15, 9, 20, 15]</code> is given. Ask for a temperature. Print three lines: <code>Highest: H</code>, <code>Lowest: L</code> and <code>Appears: N</code>, where N is how many times the entered temperature is in the list.',
            starter: C`
              temps = [12, 15, 9, 20, 15]
            `,
            solution: C`
              temps = [12, 15, 9, 20, 15]
              t = int(input("Temperature: "))
              print("Highest:", max(temps))
              print("Lowest:", min(temps))
              print("Appears:", temps.count(t))
            `,
            tests: [{ in: ['15'], out: 'Highest: 20\nLowest: 9\nAppears: 2' }, { in: ['9'], out: 'Highest: 20\nLowest: 9\nAppears: 1' }, { in: ['100'], out: 'Highest: 20\nLowest: 9\nAppears: 0', hidden: true }],
            hints: ['`max`, `min` and `.count()` do all the work.']
          },
          {
            t: 'exercise', id: 'm05-ex-safeblock', title: 'Remove a banned word', level: 3,
            prompt: 'The list <code>words = ["cat", "dog", "bird", "dog"]</code> is given. Ask for a word. If it is in the list, remove its **first** occurrence and print the list. If not, print <code>Not found</code> and leave the list unprinted.',
            starter: C`
              words = ["cat", "dog", "bird", "dog"]
            `,
            solution: C`
              words = ["cat", "dog", "bird", "dog"]
              word = input("Word: ")
              if word in words:
                  words.remove(word)
                  print(words)
              else:
                  print("Not found")
            `,
            tests: [{ in: ['dog'], out: "['cat', 'bird', 'dog']" }, { in: ['cat'], out: "['dog', 'bird', 'dog']" }, { in: ['fish'], out: 'Not found' }, { in: ['bird'], out: "['cat', 'dog', 'dog']", hidden: true }],
            hints: ['Check with `in` first so `remove` never crashes.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'list-loops',
        title: 'Looping over lists',
        time: '35 min',
        book: 'Ch 2 · p.68',
        exam: 'Paper 2 Q3',
        summary: 'for by value, by index, enumerate, filling lists, input loops, parallel lists',
        intro: 'Lists and loops belong together. A loop visits every item so you can print, total, search or change them all with a few lines.',
        blocks: [
          { t: 'h', text: 'Three ways to loop' },
          {
            t: 'cases', title: 'By value, by index, with enumerate', items: [
              {
                label: 'By value', intro: 'Use when you only need the items.', code: C`
              names = ["Asha", "Ben", "Chloe"]
              for name in names:
                  print("Hello,", name)
            ` },
              {
                label: 'By index', intro: 'Use when you need positions, or when you want to **change** items.', code: C`
              names = ["Asha", "Ben", "Chloe"]
              for i in range(len(names)):
                  print(i, names[i])
            ` },
              {
                label: 'enumerate', intro: '`enumerate` gives index and value together. `start=1` makes the numbering begin at 1.', code: C`
              names = ["Asha", "Ben", "Chloe"]
              for i, name in enumerate(names):
                  print(i, name)
              for number, name in enumerate(names, start=1):
                  print(str(number) + ".", name)
            ` },
              {
                label: 'Change items', intro: 'Changing the loop variable does not change the list. Assign through the index instead.', code: C`
              nums = [1, 2, 3]
              for n in nums:
                  n = n * 10
              print(nums)
              for i in range(len(nums)):
                  nums[i] = nums[i] * 10
              print(nums)
            ` },
              {
                label: 'Empty list', code: C`
              for x in []:
                  print("never")
              print("finished")
            ` },
              {
                label: 'Backwards and every other', code: C`
              nums = [10, 20, 30, 40, 50]
              for x in nums[::-1]:
                  print(x, end=" ")
              print()
              for i in range(0, len(nums), 2):
                  print(nums[i], end=" ")
              print()
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode: <code>FOR EACH name FROM names DO</code> is <code>for name in names:</code>. And <code>FOR i FROM 0 TO LENGTH(names) - 1 DO</code> is <code>for i in range(len(names)):</code> because Python\'s range stops before its upper bound.' },

          { t: 'h', text: 'Building a list in a loop' },
          {
            t: 'cases', title: 'Filling a list', items: [
              {
                label: 'From a pattern', code: C`
              squares = []
              for n in range(1, 6):
                  squares.append(n * n)
              print(squares)
            ` },
              {
                label: 'Filter', intro: 'Only items that pass a test go into the new list.', code: C`
              marks = [45, 78, 32, 90, 51]
              passes = []
              for m in marks:
                  if m >= 50:
                      passes.append(m)
              print(passes)
            ` },
              {
                label: 'Transform', code: C`
              names = ["asha", "ben"]
              proper = []
              for name in names:
                  proper.append(name.capitalize())
              print(proper)
            ` },
              {
                label: 'From input', stdin: ['3', '10', '20', '5'], code: C`
              count = int(input("How many? "))
              values = []
              for i in range(count):
                  values.append(int(input("Value: ")))
              print(values)
              print(sum(values))
            ` },
              {
                label: 'Until a sentinel', intro: 'Keep reading until the user types `stop`.', stdin: ['cat', 'dog', 'stop'], code: C`
              pets = []
              pet = input("Pet (stop to finish): ")
              while pet != "stop":
                  pets.append(pet)
                  pet = input("Pet (stop to finish): ")
              print(pets)
            ` },
              {
                label: 'List created inside the loop', intro: 'Starting the list inside the loop resets it every time, so only the last item is kept.', code: C`
              for n in range(1, 4):
                  items = []
                  items.append(n)
              print(items)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Create the empty list **before** the loop (`items = []`). Never put it inside, or it is emptied on each pass.' },

          { t: 'h', text: 'Parallel lists' },
          { t: 'p', html: '**Parallel lists** store related data in separate lists that line up by index: `names[2]` and `scores[2]` both describe the same person. Loop over the indexes to use them together.' },
          {
            t: 'cases', title: 'Two lists, one index', items: [
              {
                label: 'Report', code: C`
              names = ["Asha", "Ben", "Chloe"]
              scores = [18, 12, 20]
              for i in range(len(names)):
                  print(names[i], "scored", scores[i])
            ` },
              {
                label: 'Best person', code: C`
              names = ["Asha", "Ben", "Chloe"]
              scores = [18, 12, 20]
              best = 0
              for i in range(len(scores)):
                  if scores[i] > scores[best]:
                      best = i
              print(names[best], scores[best])
            ` },
              {
                label: 'Filtering with both', code: C`
              names = ["Asha", "Ben", "Chloe"]
              scores = [18, 12, 20]
              for i in range(len(names)):
                  if scores[i] >= 15:
                      print(names[i])
            ` },
              {
                label: 'zip (preview)', intro: '`zip` pairs the lists automatically. It is explained properly in module 9.', code: C`
              names = ["Asha", "Ben"]
              scores = [18, 12]
              for name, score in zip(names, scores):
                  print(name, score)
            ` },
            ]
          },

          {
            t: 'predict', title: 'Does the list change?', code: C`
            nums = [1, 2, 3]
            for n in nums:
                n = n + 1
            for i in range(len(nums)):
                nums[i] = nums[i] + 1
            print(nums)
          `, rows: 1, why: 'The first loop changes only the copy `n`. The second loop updates the list: [2, 3, 4].'
          },
          {
            t: 'predict', title: 'Filter', code: C`
            data = [3, 8, 5, 12, 7]
            big = []
            for d in data:
                if d > 5:
                    big.append(d * 2)
            print(big)
          `, rows: 1, why: 'Items greater than 5 are 8, 12 and 7. Each is doubled: [16, 24, 14].'
          },
          { t: 'quiz', q: 'You need to print numbered lines <code>1. milk</code>, <code>2. eggs</code>. Which is best?', options: ['for item in items:', 'for i, item in enumerate(items, start=1):', 'for i in items:', 'for item in range(items):'], answer: 1, why: '`enumerate` supplies both the number and the item. `start=1` makes the counting begin at 1.' },
          { t: 'quiz', q: 'Why do these parallel lists need to stay the same length?', options: ['Python requires it', 'Because the index in one list must match the same person in the other', 'So that sort() works', 'To save memory'], answer: 1, why: 'The position links them. If the lengths differ, the index of one list may not exist in the other.' },

          {
            t: 'exercise', id: 'm05-ex-greetall', title: 'Greet everybody', level: 1,
            prompt: 'The list <code>friends = ["Asha", "Ben", "Chloe"]</code> is given. Use a loop to print <code>Hi, NAME!</code> for each friend.',
            starter: C`
              friends = ["Asha", "Ben", "Chloe"]
            `,
            solution: C`
              friends = ["Asha", "Ben", "Chloe"]
              for friend in friends:
                  print("Hi, " + friend + "!")
            `,
            tests: [{ out: 'Hi, Asha!\nHi, Ben!\nHi, Chloe!' }],
            requires: [{ re: '\\bfor\\b', msg: 'Use a `for` loop.' }],
            hints: ['`for friend in friends:` then print inside the loop.']
          },
          {
            t: 'exercise', id: 'm05-ex-readnums', title: 'Read and total', level: 2,
            prompt: 'Ask how many numbers there will be. Then read that many whole numbers into a list. Print the list on the first line and the total on the second line.',
            starter: C`
              count = int(input("How many? "))
              numbers = []
            `,
            solution: C`
              count = int(input("How many? "))
              numbers = []
              for i in range(count):
                  numbers.append(int(input("Number: ")))
              print(numbers)
              print(sum(numbers))
            `,
            tests: [{ in: ['3', '4', '5', '6'], out: '[4, 5, 6]\n15' }, { in: ['1', '9'], out: '[9]\n9' }, { in: ['0'], out: '[]\n0' }, { in: ['4', '-1', '2', '-3', '10'], out: '[-1, 2, -3, 10]\n8', hidden: true }],
            requires: [{ re: '\\bfor\\b|\\bwhile\\b', msg: 'Use a loop.' }],
            hints: ['Loop `count` times and append each `int(input())`.']
          },
          {
            t: 'exercise', id: 'm05-ex-squares', title: 'List of squares', level: 2,
            prompt: 'Ask for a number <code>n</code>. Build a list of the squares of 1 up to n (inclusive) with a loop and <code>append</code>, then print the list.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              squares = []
              for i in range(1, n + 1):
                  squares.append(i * i)
              print(squares)
            `,
            tests: [{ in: ['5'], out: '[1, 4, 9, 16, 25]' }, { in: ['1'], out: '[1]' }, { in: ['0'], out: '[]', hidden: true }],
            requires: [{ re: 'append', msg: 'Use `append`.' }],
            hints: ['`range(1, n + 1)` goes from 1 to n.']
          },
          {
            t: 'exercise', id: 'm05-ex-pass-list', title: 'Who passed?', level: 2,
            prompt: 'Two parallel lists are given: <code>names = ["Asha", "Ben", "Chloe", "Dev"]</code> and <code>marks = [62, 45, 50, 38]</code>. Ask for the pass mark. Print the name of every student whose mark is **at least** the pass mark, one per line, in list order. If nobody passes print <code>Nobody passed</code>.',
            starter: C`
              names = ["Asha", "Ben", "Chloe", "Dev"]
              marks = [62, 45, 50, 38]
              pass_mark = int(input("Pass mark: "))
            `,
            solution: C`
              names = ["Asha", "Ben", "Chloe", "Dev"]
              marks = [62, 45, 50, 38]
              pass_mark = int(input("Pass mark: "))
              found = False
              for i in range(len(names)):
                  if marks[i] >= pass_mark:
                      print(names[i])
                      found = True
              if not found:
                  print("Nobody passed")
            `,
            tests: [{ in: ['50'], out: 'Asha\nChloe' }, { in: ['40'], out: 'Asha\nBen\nChloe' }, { in: ['90'], out: 'Nobody passed' }, { in: ['62'], out: 'Asha', hidden: true }],
            hints: ['Loop with `range(len(names))` so you can use the same index in both lists.', 'Use a flag that becomes True when you print someone.']
          },
          {
            t: 'exercise', id: 'm05-ex-evensquares', title: 'Squares of even numbers', level: 3,
            prompt: 'Ask for <code>n</code>. Build a list of the squares of the **even** numbers from 1 to n. Print the list. For n = 7 the answer is <code>[4, 16, 36]</code>.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              result = []
              for i in range(1, n + 1):
                  if i % 2 == 0:
                      result.append(i * i)
              print(result)
            `,
            tests: [{ in: ['7'], out: '[4, 16, 36]' }, { in: ['1'], out: '[]' }, { in: ['10'], out: '[4, 16, 36, 64, 100]', hidden: true }],
            hints: ['Even numbers leave 0 when divided by 2: `i % 2 == 0`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'list-algorithms',
        title: 'List algorithms',
        time: '40 min',
        book: 'Ch 2 · p.68-69',
        exam: 'Paper 2 Q3-Q4',
        summary: 'Total, average, max/min by hand, second largest, counting, search, swapping',
        intro: 'These are the standard recipes for working with lists. Learn each pattern once and you can reuse it in almost any exam question.',
        blocks: [
          { t: 'h', text: 'Total and average' },
          {
            t: 'cases', title: 'Running total and mean', items: [
              {
                label: 'Total by hand', intro: 'Press Trace to watch `total` grow.', code: C`
              marks = [12, 7, 15, 9]
              total = 0
              for m in marks:
                  total = total + m
              print(total)
            ` },
              {
                label: 'Average', code: C`
              marks = [12, 7, 15, 9]
              total = 0
              for m in marks:
                  total += m
              average = total / len(marks)
              print("Average:", average)
              print("Rounded:", round(average, 1))
            ` },
              {
                label: 'Built in', code: C`
              marks = [12, 7, 15, 9]
              print(sum(marks), sum(marks) / len(marks))
            ` },
              {
                label: 'Empty list average', expectError: true, intro: 'Dividing by `len([])` which is 0 crashes. Always test for an empty list first (see the pitfalls lesson).', code: C`
              marks = []
              print(sum(marks) / len(marks))
            ` },
            ]
          },

          { t: 'h', text: 'Largest and smallest by hand' },
          { t: 'p', html: 'Exam questions often forbid `max()` and `min()`. The method: assume the **first item** is the largest, then compare every other item with it.' },
          {
            t: 'cases', title: 'Maximum, minimum, and where they are', items: [
              {
                label: 'Maximum', code: C`
              nums = [14, 3, 27, 9, 27]
              biggest = nums[0]
              for n in nums:
                  if n > biggest:
                      biggest = n
              print(biggest)
            ` },
              {
                label: 'Minimum', code: C`
              nums = [14, 3, 27, 9]
              smallest = nums[0]
              for n in nums:
                  if n < smallest:
                      smallest = n
              print(smallest)
            ` },
              {
                label: 'Position of the maximum', code: C`
              nums = [14, 3, 27, 9, 27]
              pos = 0
              for i in range(len(nums)):
                  if nums[i] > nums[pos]:
                      pos = i
              print("Largest", nums[pos], "at index", pos)
            ` },
              {
                label: 'Wrong start value', intro: 'Starting `biggest` at 0 gives a wrong answer when every value is negative.', code: C`
              nums = [-5, -2, -9]
              biggest = 0
              for n in nums:
                  if n > biggest:
                      biggest = n
              print(biggest)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Do not start the maximum at 0 (or the minimum at 100). Start with `nums[0]` so the pattern works for any data.' },

          { t: 'h', text: 'Counting and searching' },
          {
            t: 'cases', title: 'Counting matches and linear search', items: [
              {
                label: 'Count matches', code: C`
              marks = [45, 78, 32, 90, 51, 50]
              passes = 0
              for m in marks:
                  if m >= 50:
                      passes += 1
              print(passes, "of", len(marks), "passed")
            ` },
              {
                label: 'Search: first index', intro: 'A **linear search** looks at every item in order. `break` stops at the first match.', code: C`
              names = ["Asha", "Ben", "Chloe", "Ben"]
              target = "Ben"
              position = -1
              for i in range(len(names)):
                  if names[i] == target:
                      position = i
                      break
              print(position)
            ` },
              {
                label: 'Search: all matches', code: C`
              names = ["Asha", "Ben", "Chloe", "Ben"]
              for i in range(len(names)):
                  if names[i] == "Ben":
                      print("Found at", i)
            ` },
              {
                label: 'Search with a flag', code: C`
              names = ["Asha", "Ben", "Chloe"]
              found = False
              for n in names:
                  if n == "Dev":
                      found = True
              if found:
                  print("Present")
              else:
                  print("Absent")
            ` },
            ]
          },

          { t: 'h', text: 'Second largest and swapping' },
          {
            t: 'cases', title: 'Two more classics', items: [
              {
                label: 'Second largest', intro: 'Keep two variables. When a new item beats the biggest, the old biggest becomes second.', code: C`
              nums = [14, 3, 27, 9, 20]
              first = nums[0]
              second = nums[0]
              for n in nums:
                  if n > first:
                      second = first
                      first = n
                  elif n > second and n != first:
                      second = n
              print(first, second)
            ` },
              {
                label: 'Swap with a temporary', code: C`
              a = [10, 20, 30]
              temp = a[0]
              a[0] = a[2]
              a[2] = temp
              print(a)
            ` },
              {
                label: 'Swap in one line', code: C`
              a = [10, 20, 30]
              a[0], a[2] = a[2], a[0]
              print(a)
            ` },
              {
                label: 'Swap without a temp: the bug', code: C`
              a = [10, 20, 30]
              a[0] = a[2]
              a[2] = a[0]
              print(a)
            ` },
              {
                label: 'Reverse in place', code: C`
              a = [1, 2, 3, 4, 5]
              for i in range(len(a) // 2):
                  a[i], a[-1 - i] = a[-1 - i], a[i]
              print(a)
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'Swapping needs a **temporary** place to hold one value, otherwise the first assignment overwrites a value you still need. Python lets you write the swap in one line, `a[i], a[j] = a[j], a[i]`, and it is the foundation of sorting (module 11).' },
          { t: 'note', kind: 'exam', html: 'A classic Paper 2 task: "Write a program that reads 10 marks into an array and outputs the highest mark, the lowest mark and the mean." Use a loop for input, then one loop (or three small ones) for the statistics, and state the pseudocode <code>SET total TO total + marks[i]</code>.' },

          {
            t: 'predict', title: 'Maximum trace', code: C`
            nums = [5, 9, 2, 9, 7]
            best = nums[0]
            pos = 0
            for i in range(len(nums)):
                if nums[i] > best:
                    best = nums[i]
                    pos = i
            print(best, pos)
          `, rows: 1, why: 'The first 9 at index 1 is bigger than 5. The second 9 is not strictly bigger, so the position stays 1.'
          },
          {
            t: 'predict', title: 'Swap', code: C`
            a = [1, 2, 3, 4]
            a[0], a[3] = a[3], a[0]
            a[1], a[2] = a[2], a[1]
            print(a)
          `, rows: 1, why: 'Swapping the ends and then the middle two reverses the list.'
          },
          { t: 'quiz', q: 'In the maximum algorithm, why do we set <code>biggest = nums[0]</code> instead of <code>biggest = 0</code>?', options: ['It is faster', 'It works when all values are negative', 'Python requires it', 'It stops the loop early'], answer: 1, why: 'Starting from a real item guarantees the answer is an actual member of the list.' },
          {
            t: 'parsons', title: 'Count the passes', prompt: 'Order the lines that count how many marks are 50 or above.', lines: [
              'marks = [45, 78, 32, 90, 51]',
              'passes = 0',
              'for m in marks:',
              '    if m >= 50:',
              '        passes += 1',
              'print(passes)',
            ], why: 'The counter is set up before the loop, tested inside, and shown after.'
          },

          {
            t: 'exercise', id: 'm05-ex-average4', title: 'Average of four', level: 1,
            prompt: 'Ask for four numbers (whole numbers), store them in a list, and print <code>Total: T</code> and <code>Average: A</code> on two lines, where A is the average (it may have a decimal part).',
            starter: C`
              numbers = []
              for i in range(4):
                  numbers.append(int(input("Number: ")))
            `,
            solution: C`
              numbers = []
              for i in range(4):
                  numbers.append(int(input("Number: ")))
              total = sum(numbers)
              print("Total:", total)
              print("Average:", total / len(numbers))
            `,
            tests: [{ in: ['2', '4', '6', '8'], out: 'Total: 20\nAverage: 5.0' }, { in: ['1', '2', '3', '4'], out: 'Total: 10\nAverage: 2.5' }, { in: ['0', '0', '0', '0'], out: 'Total: 0\nAverage: 0.0', hidden: true }],
            hints: ['`sum(numbers)` is the total.', 'Divide by `len(numbers)`.']
          },
          {
            t: 'exercise', id: 'm05-ex-maxmanual', title: 'Biggest without max()', level: 2,
            prompt: 'Ask how many numbers there are (at least 1), then read them. Print the largest, **without** using <code>max()</code> or <code>sort()</code>.',
            starter: C`
              count = int(input("How many? "))
              nums = []
              for i in range(count):
                  nums.append(int(input("Number: ")))
            `,
            solution: C`
              count = int(input("How many? "))
              nums = []
              for i in range(count):
                  nums.append(int(input("Number: ")))
              biggest = nums[0]
              for n in nums:
                  if n > biggest:
                      biggest = n
              print(biggest)
            `,
            tests: [{ in: ['3', '4', '9', '2'], out: '9' }, { in: ['2', '-5', '-3'], out: '-3' }, { in: ['1', '7'], out: '7' }, { in: ['4', '8', '8', '1', '5'], out: '8', hidden: true }],
            requires: [{ re: 'max\\s*\\(|sort', not: true, msg: 'Do not use `max()` or `sort`.' }],
            hints: ['Start with `biggest = nums[0]`.', 'Update it whenever you meet a larger value.']
          },
          {
            t: 'exercise', id: 'm05-ex-search', title: 'Find the position', level: 2,
            prompt: 'The list <code>pets = ["cat", "dog", "fish", "dog", "bird"]</code> is given. Ask for a pet. Print the index of its **first** occurrence, or <code>-1</code> if it is not in the list. Use a loop, not <code>.index()</code>.',
            starter: C`
              pets = ["cat", "dog", "fish", "dog", "bird"]
              target = input("Pet: ")
            `,
            solution: C`
              pets = ["cat", "dog", "fish", "dog", "bird"]
              target = input("Pet: ")
              position = -1
              for i in range(len(pets)):
                  if pets[i] == target:
                      position = i
                      break
              print(position)
            `,
            tests: [{ in: ['dog'], out: '1' }, { in: ['bird'], out: '4' }, { in: ['cat'], out: '0' }, { in: ['horse'], out: '-1', hidden: true }],
            requires: [{ re: '\\bfor\\b|\\bwhile\\b', msg: 'Use a loop.' }, { re: '\\.index', not: true, msg: 'Do not use `.index()`.' }],
            hints: ['Start with `position = -1`.', 'On the first match, save `i` and `break`.']
          },
          {
            t: 'exercise', id: 'm05-ex-passcount', kind: 'exam', title: 'Exam results', level: 2,
            prompt: 'A teacher enters marks for a class. Ask how many students there are, then read each mark (whole numbers out of 100). Print three lines: <code>Highest: H</code>, <code>Lowest: L</code> and <code>Passes: P</code>, where P is the number of marks of 40 or more. Do not use <code>max()</code> or <code>min()</code>.',
            starter: C`
              count = int(input("Number of students: "))
              marks = []
            `,
            solution: C`
              count = int(input("Number of students: "))
              marks = []
              for i in range(count):
                  marks.append(int(input("Mark: ")))
              highest = marks[0]
              lowest = marks[0]
              passes = 0
              for m in marks:
                  if m > highest:
                      highest = m
                  if m < lowest:
                      lowest = m
                  if m >= 40:
                      passes += 1
              print("Highest:", highest)
              print("Lowest:", lowest)
              print("Passes:", passes)
            `,
            tests: [{ in: ['4', '50', '30', '80', '40'], out: 'Highest: 80\nLowest: 30\nPasses: 3' }, { in: ['1', '12'], out: 'Highest: 12\nLowest: 12\nPasses: 0' }, { in: ['3', '100', '100', '39'], out: 'Highest: 100\nLowest: 39\nPasses: 2', hidden: true }],
            requires: [{ re: 'max\\s*\\(|min\\s*\\(', not: true, msg: 'Do not use `max()` or `min()`.' }],
            hints: ['Keep three variables: `highest`, `lowest`, `passes`.', 'One loop can update all three.']
          },
          {
            t: 'exercise', id: 'm05-ex-second', title: 'Second largest', level: 3,
            prompt: 'Ask how many numbers there are (at least 2, and not all equal), then read them. Print the **second largest different value**. For <code>5 9 2 9 7</code> the answer is 7. Do not use <code>sort</code>.',
            starter: C`
              count = int(input("How many? "))
              nums = []
              for i in range(count):
                  nums.append(int(input("Number: ")))
            `,
            solution: C`
              count = int(input("How many? "))
              nums = []
              for i in range(count):
                  nums.append(int(input("Number: ")))
              first = nums[0]
              for n in nums:
                  if n > first:
                      first = n
              second = None
              for n in nums:
                  if n != first and (second is None or n > second):
                      second = n
              print(second)
            `,
            tests: [{ in: ['5', '5', '9', '2', '9', '7'], out: '7' }, { in: ['3', '1', '2', '3'], out: '2' }, { in: ['2', '4', '8'], out: '4' }, { in: ['4', '-1', '-5', '-1', '-3'], out: '-3', hidden: true }],
            requires: [{ re: 'sort', not: true, msg: 'Do not use `sort` or `sorted`.' }],
            hints: ['First find the largest. Then find the largest value that is not equal to it.', 'Starting `second = None` avoids guessing a start value.']
          },
          {
            t: 'exercise', id: 'm05-ex-reverse-swap', title: 'Reverse by swapping', level: 3,
            prompt: 'Read five whole numbers into a list. Reverse the list **in place** by swapping items in pairs (first with last, second with second last). Do not use <code>reverse()</code> or slices. Print the list.',
            starter: C`
              nums = []
              for i in range(5):
                  nums.append(int(input("Number: ")))
            `,
            solution: C`
              nums = []
              for i in range(5):
                  nums.append(int(input("Number: ")))
              for i in range(len(nums) // 2):
                  nums[i], nums[-1 - i] = nums[-1 - i], nums[i]
              print(nums)
            `,
            tests: [{ in: ['1', '2', '3', '4', '5'], out: '[5, 4, 3, 2, 1]' }, { in: ['9', '9', '1', '9', '9'], out: '[9, 9, 1, 9, 9]' }, { in: ['5', '0', '0', '0', '1'], out: '[1, 0, 0, 0, 5]', hidden: true }],
            requires: [{ re: 'reverse\\s*\\(|::', not: true, msg: 'Do not use `reverse()` or a slice.' }],
            hints: ['Only half the list needs to be visited: `range(len(nums) // 2)`.', 'Swap `nums[i]` with `nums[-1 - i]`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'list-pitfalls',
        title: 'List traps and safe code',
        time: '35 min',
        book: 'Ch 2 · p.69',
        exam: 'Paper 2 Q3-Q4',
        summary: 'Aliasing, copies, sort returning None, removing in a loop, empty lists, errors',
        intro: 'Most list bugs come from a small group of traps. If you know them by name, you can spot them in your own code and in the Paper 2 "amend the code" questions.',
        blocks: [
          { t: 'h', text: 'Trap 1: two names, one list' },
          { t: 'p', html: 'Writing `b = a` does **not** copy a list. Both names point at the **same** list, so a change through one name shows up in the other. This is called **aliasing**.' },
          {
            t: 'cases', title: 'Aliasing and copying', items: [
              {
                label: 'The surprise', code: C`
              a = [1, 2, 3]
              b = a
              b.append(99)
              print(a)
              print(b)
              print(a is b)
            ` },
              {
                label: 'Copy with a slice', code: C`
              a = [1, 2, 3]
              b = a[:]
              b.append(99)
              print(a)
              print(b)
              print(a is b)
            ` },
              {
                label: 'Copy with copy()', code: C`
              a = [1, 2, 3]
              b = a.copy()
              b[0] = 100
              print(a, b)
              c = list(a)
              c[1] = 200
              print(a, c)
            ` },
              {
                label: 'Numbers do not alias', intro: 'Numbers and strings cannot be changed in place, so they never show this problem.', code: C`
              x = 5
              y = x
              y = y + 1
              print(x, y)
            ` },
              {
                label: 'Backup before sorting', code: C`
              scores = [30, 10, 20]
              original = scores.copy()
              scores.sort()
              print(scores)
              print(original)
            ` },
            ]
          },

          { t: 'h', text: 'Trap 2: methods that return None' },
          {
            t: 'cases', title: 'sort, append, reverse return nothing', items: [
              {
                label: 'sort()', code: C`
              nums = [3, 1, 2]
              result = nums.sort()
              print(result)
              print(nums)
            ` },
              {
                label: 'append()', code: C`
              nums = [1]
              nums = nums.append(2)
              print(nums)
            ` },
              {
                label: 'Using None', expectError: true, code: C`
              nums = [3, 1, 2]
              nums = nums.sort()
              print(nums[0])
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Never write `nums = nums.sort()` or `nums = nums.append(x)`. Just call the method on its own line.' },

          { t: 'h', text: 'Trap 3: removing while looping' },
          { t: 'p', html: 'If you delete items from a list while a `for` loop is walking over it, the items shift left and the loop skips the next one.' },
          {
            t: 'cases', title: 'Remove items safely', items: [
              {
                label: 'The bug', intro: 'Both 2s should go, but one stays.', code: C`
              nums = [2, 2, 3, 4]
              for n in nums:
                  if n == 2:
                      nums.remove(n)
              print(nums)
            ` },
              {
                label: 'Fix 1: build a new list', code: C`
              nums = [2, 2, 3, 4]
              kept = []
              for n in nums:
                  if n != 2:
                      kept.append(n)
              print(kept)
            ` },
              {
                label: 'Fix 2: loop over a copy', code: C`
              nums = [2, 2, 3, 4]
              for n in nums[:]:
                  if n == 2:
                      nums.remove(n)
              print(nums)
            ` },
              {
                label: 'Fix 3: loop backwards', code: C`
              nums = [2, 2, 3, 4]
              for i in range(len(nums) - 1, -1, -1):
                  if nums[i] == 2:
                      del nums[i]
              print(nums)
            ` },
            ]
          },

          { t: 'h', text: 'Trap 4: empty lists and missing values' },
          {
            t: 'cases', title: 'What crashes when the list is empty', items: [
              {
                label: 'max of nothing', expectError: true, code: C`
              scores = []
              print(max(scores))
            ` },
              {
                label: 'Average of nothing', expectError: true, code: C`
              scores = []
              print(sum(scores) / len(scores))
            ` },
              {
                label: 'First of nothing', expectError: true, code: C`
              scores = []
              print(scores[0])
            ` },
              {
                label: 'Guarded versions', intro: 'Test `len` or the list itself first. An empty list counts as False.', code: C`
              scores = []
              if len(scores) == 0:
                  print("No scores yet")
              else:
                  print(sum(scores) / len(scores))
              if scores:
                  print("has items")
              else:
                  print("empty")
            ` },
              {
                label: 'Fixed, with data', code: C`
              scores = [12, 18]
              if scores:
                  print("Average", sum(scores) / len(scores))
                  print("Best", max(scores))
            ` },
            ]
          },

          { t: 'h', text: 'Trap 5: text numbers sort wrongly' },
          {
            t: 'cases', title: 'Strings versus numbers', items: [
              {
                label: 'Text sorts letter by letter', code: C`
              print(sorted(["10", "9", "100", "2"]))
              print("10" < "9")
            ` },
              {
                label: 'Convert first', code: C`
              text = ["10", "9", "100", "2"]
              numbers = []
              for t in text:
                  numbers.append(int(t))
              print(sorted(numbers))
            ` },
              {
                label: 'Adding does not add', code: C`
              from_input = ["3", "4"]
              print(from_input[0] + from_input[1])
              print(int(from_input[0]) + int(from_input[1]))
            ` },
              {
                label: 'Mixed list', expectError: true, code: C`
              print(sorted([3, "a", 1]))
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Paper 2 "amend the code" questions love: a list index that is one too high (use <code>len(list) - 1</code>), a missing <code>int()</code>, a total that starts in the wrong place, and an average that divides by the wrong number. Edexcel arrays are indexed from 0 and <code>LENGTH(array)</code> is the number of items.' },

          { t: 'viz', kind: 'memory', preset: 'Two names, one list (aliasing)', title: 'Why b = a does not copy a list', caption: 'The badge (A) shows two names that share the same list.' },

          {
            t: 'predict', title: 'Alias or copy?', code: C`
            a = [1, 2, 3]
            b = a
            c = a[:]
            b[0] = 10
            c[1] = 20
            print(a)
            print(c)
          `, rows: 2, why: '`b` is an alias, so changing `b` changes `a`. `c` is a separate copy: [1, 20, 3].'
          },
          {
            t: 'predict', title: 'Skipping while removing', code: C`
            words = ["a", "b", "b", "c"]
            for w in words:
                if w == "b":
                    words.remove(w)
            print(words)
          `, rows: 1, why: 'After the first b is removed the list shifts left and the loop jumps over the second b.'
          },
          {
            t: 'sort', title: 'Which fix?', prompt: 'Which problem does each line of code cause or fix?', cats: ['Causes an error or bug', 'Is a safe fix'], items: [
              { text: '<code>b = a</code> then change <code>b</code> and expect <code>a</code> unchanged', cat: 0 },
              { text: '<code>b = a.copy()</code>', cat: 1 },
              { text: '<code>nums = nums.sort()</code>', cat: 0 },
              { text: '<code>if scores: print(max(scores))</code>', cat: 1 },
              { text: '<code>max([])</code>', cat: 0 },
              { text: '<code>for n in nums[:]:</code> when removing', cat: 1 },
            ], why: 'Copy before changing, never store the result of sort, and guard against empty lists.'
          },
          { t: 'quiz', q: 'What is the safest way to make an independent copy of the list <code>a</code>?', options: ['b = a', 'b = a[:]', 'b == a', 'b = a.sort()'], answer: 1, why: 'A full slice (or `a.copy()`) creates a new list with the same items.' },
          { t: 'quiz', q: 'Which error does <code>[1, 2, 3].remove(7)</code> raise?', options: ['IndexError', 'ValueError', 'TypeError', 'KeyError'], answer: 1, why: 'The value 7 is not in the list, so `remove` raises ValueError. `IndexError` is for bad positions.' },

          {
            t: 'exercise', id: 'm05-ex-backup', kind: 'debug', title: 'Keep the original', level: 2,
            prompt: 'This program should print the sorted scores and then the **original** order. It prints the same order twice. Fix the one error.',
            starter: C`
              scores = [30, 10, 20]
              original = scores
              scores.sort()
              print(scores)
              print(original)
            `,
            solution: C`
              scores = [30, 10, 20]
              original = scores.copy()
              scores.sort()
              print(scores)
              print(original)
            `,
            tests: [{ out: '[10, 20, 30]\n[30, 10, 20]' }],
            hints: ['`original = scores` makes two names for one list.', 'Make a real copy: `scores.copy()` or `scores[:]`.']
          },
          {
            t: 'exercise', id: 'm05-ex-safeavg', title: 'Safe average', level: 2,
            prompt: 'Ask how many scores there are, then read them. If there are none print <code>No scores</code>. Otherwise print <code>Average: A</code> where A is the average.',
            starter: C`
              count = int(input("How many scores? "))
              scores = []
              for i in range(count):
                  scores.append(int(input("Score: ")))
            `,
            solution: C`
              count = int(input("How many scores? "))
              scores = []
              for i in range(count):
                  scores.append(int(input("Score: ")))
              if len(scores) == 0:
                  print("No scores")
              else:
                  print("Average:", sum(scores) / len(scores))
            `,
            tests: [{ in: ['0'], out: 'No scores' }, { in: ['2', '10', '15'], out: 'Average: 12.5' }, { in: ['1', '7'], out: 'Average: 7.0' }, { in: ['3', '1', '2', '3'], out: 'Average: 2.0', hidden: true }],
            hints: ['Test `len(scores) == 0` before dividing.']
          },
          {
            t: 'exercise', id: 'm05-ex-longest', title: 'Longest word', level: 2,
            prompt: 'Ask for a line of words separated by spaces. Print the longest word. If the line has no words print <code>Empty</code>. If two words tie, print the first.',
            starter: C`
              words = input("Words: ").split()
            `,
            solution: C`
              words = input("Words: ").split()
              if len(words) == 0:
                  print("Empty")
              else:
                  longest = words[0]
                  for w in words:
                      if len(w) > len(longest):
                          longest = w
                  print(longest)
            `,
            tests: [{ in: ['cat horse a'], out: 'horse' }, { in: [''], out: 'Empty' }, { in: ['aa bb cc'], out: 'aa' }, { in: ['one'], out: 'one', hidden: true }],
            hints: ['Check for an empty list before using `words[0]`.', 'Use `>` not `>=` so the first of a tie wins.']
          },
          {
            t: 'exercise', id: 'm05-ex-removeneg', title: 'Remove the negatives', level: 3,
            prompt: 'Ask how many numbers there are, then read them as whole numbers. Print a list of only the numbers that are **zero or more**, in their original order. For input <code>-1, 5, -3, 0</code> print <code>[5, 0]</code>. Do not remove items from the list you are looping over.',
            starter: C`
              count = int(input("How many? "))
              nums = []
              for i in range(count):
                  nums.append(int(input("Number: ")))
            `,
            solution: C`
              count = int(input("How many? "))
              nums = []
              for i in range(count):
                  nums.append(int(input("Number: ")))
              kept = []
              for n in nums:
                  if n >= 0:
                      kept.append(n)
              print(kept)
            `,
            tests: [{ in: ['4', '-1', '5', '-3', '0'], out: '[5, 0]' }, { in: ['3', '-1', '-2', '-3'], out: '[]' }, { in: ['3', '1', '2', '3'], out: '[1, 2, 3]' }, { in: ['5', '-1', '-1', '-1', '4', '-1'], out: '[4]', hidden: true }],
            requires: [{ re: 'remove|del ', not: true, msg: 'Build a new list instead of removing items.' }],
            hints: ['Make a new empty list called `kept`.', 'Append only the items that pass the test.']
          },
          {
            t: 'exercise', id: 'm05-ex-debug-list', kind: 'debug', title: 'Three errors in a score report', level: 2,
            prompt: 'This program should add a new score of 11, print the average, then print the lowest score. It should print <code>Average: 10.8</code> and <code>Lowest: 7</code>. There are <strong>three</strong> errors. Find and fix them.',
            starter: C`
              scores = [12, 7, 15, 9]
              scores.append(11
              total = 0
              for i in range(1, len(scores) + 1):
                  total += scores[i]
              print("Average:", total / len(scores))
              scores = scores.sort()
              print("Lowest:", scores[0])
            `,
            solution: C`
              scores = [12, 7, 15, 9]
              scores.append(11)
              total = 0
              for i in range(len(scores)):
                  total += scores[i]
              print("Average:", total / len(scores))
              scores.sort()
              print("Lowest:", scores[0])
            `,
            tests: [{ out: 'Average: 10.8\nLowest: 7' }],
            hints: ['The first line of trouble is a missing bracket.', 'The loop should visit indexes 0 to len - 1.', '`sort()` returns None, so do not assign its result.']
          },
        ],
      },
    ],
  });
})();

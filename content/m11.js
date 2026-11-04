(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm11',
    title: 'Searching and sorting',
    blurb: 'Linear and binary search, bubble sort and merge sort, and how to compare their speed.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'linear-search',
        title: 'Linear search',
        time: '35 min',
        book: 'Ch 1 · p.17-22',
        summary: 'Check each item in turn; found / not found; counting comparisons',
        intro: 'An **algorithm** is a set of steps that solves a problem. Searching is one of the most common problems: is this item in the data, and where? The simplest answer is to look at each item in turn.',
        blocks: [
          { t: 'h', text: 'Look at every item' },
          { t: 'p', html: 'A **linear search** starts at the first item and checks each one until it finds the target or runs out of items. It works on any list, sorted or not. Press **Trace** and watch `i` and `item` change.' },
          {
            t: 'code', title: 'Is 7 in the list?', code: C`
            numbers = [4, 9, 7, 1, 8]
            target = 7
            found = False
            for item in numbers:
                if item == target:
                    found = True
            print(found)
          `, caption: 'This version keeps looking even after it has found the answer.'
          },

          { t: 'h', text: 'Returning the position' },
          { t: 'p', html: 'Usually we want to know **where** the item is. We loop over the **indexes** and return the index when we find it. If we reach the end, we return `-1`, a value that cannot be a real index, to mean "not found".' },
          {
            t: 'cases', title: 'A search function in all its forms', items: [
              {
                label: 'Index or -1', code: C`
              def linear_search(data, target):
                  for i in range(len(data)):
                      if data[i] == target:
                          return i
                  return -1

              names = ["Asha", "Ben", "Chloe", "Dev"]
              print(linear_search(names, "Chloe"))
              print(linear_search(names, "Zoe"))
            ` },
              {
                label: 'Early exit', intro: '`return` ends the function straight away, so we stop at the first match. Compare the counters: finding the first item is quick; the last item takes the most steps.', code: C`
              def linear_search(data, target):
                  comparisons = 0
                  for i in range(len(data)):
                      comparisons = comparisons + 1
                      if data[i] == target:
                          return i, comparisons
                  return -1, comparisons

              data = [5, 3, 8, 6, 2, 9]
              print(linear_search(data, 5))
              print(linear_search(data, 9))
              print(linear_search(data, 7))
            ` },
              {
                label: 'While loop', intro: 'The same idea with a `while` loop and a flag.', code: C`
              data = [5, 3, 8, 6, 2, 9]
              target = 6
              i = 0
              found = False
              while i < len(data) and not found:
                  if data[i] == target:
                      found = True
                  else:
                      i = i + 1
              if found:
                  print("Found at index", i)
              else:
                  print("Not found")
            ` },
              {
                label: 'All matches', intro: 'To find **every** match, do not return early. Collect the positions.', code: C`
              data = [3, 7, 3, 9, 3]
              positions = []
              for i in range(len(data)):
                  if data[i] == 3:
                      positions.append(i)
              print(positions)
              print("Appears", len(positions), "times")
            ` },
              {
                label: 'Strings', intro: 'Strings are compared exactly, so capitals matter. Normalise with `.lower()` for a fair match.', code: C`
              pets = ["Cat", "dog", "Fish"]
              wanted = "cat"
              for i in range(len(pets)):
                  if pets[i] == wanted:
                      print("exact match at", i)
                  if pets[i].lower() == wanted:
                      print("case-insensitive match at", i)
            ` },
              {
                label: 'Empty list', intro: 'An empty list is fine: the loop does not run and we return -1.', code: C`
              def linear_search(data, target):
                  for i in range(len(data)):
                      if data[i] == target:
                          return i
                  return -1

              print(linear_search([], 5))
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Put `return -1` **outside** the loop, lined up with `for`. If it is inside the loop, the function gives up after the first item that does not match.' },
          {
            t: 'code', title: 'Bug: return -1 inside the loop', code: C`
            def linear_search(data, target):
                for i in range(len(data)):
                    if data[i] == target:
                        return i
                    else:
                        return -1

            print(linear_search([4, 5, 6], 5))
          `, caption: 'Prints -1 even though 5 is in the list. Trace it to see why.'
          },

          { t: 'h', text: 'Edexcel pseudocode' },
          { t: 'p', html: 'In the exam you may see a search written in pseudocode. Compare it with the Python:' },
          { t: 'html', html: '<pre>SET found TO false\nSET i TO 0\nWHILE i &lt; LENGTH(data) AND found = false DO\n    IF data[i] = target THEN\n        SET found TO true\n    ELSE\n        SET i TO i + 1\n    END IF\nEND WHILE</pre>' },
          { t: 'note', kind: 'exam', html: 'Questions ask you to <em>describe</em> a linear search: start at the first item, compare each item with the target, stop when found or when the end of the list is reached. One mark per idea. Note it does <strong>not</strong> need sorted data.' },
          { t: 'note', kind: 'key', html: 'Best case: the target is first (1 comparison). Worst case: the target is last or missing (n comparisons for n items).' },

          { t: 'h', text: 'Finding the largest without max()' },
          { t: 'p', html: 'Finding the biggest item is also a linear scan. Keep the best so far, and replace it when you see something bigger.' },
          {
            t: 'cases', title: 'Maximum and minimum by hand', items: [
              {
                label: 'Largest', code: C`
              data = [14, 3, 22, 9, 22, 7]
              largest = data[0]
              for item in data:
                  if item > largest:
                      largest = item
              print(largest)
            ` },
              {
                label: 'Smallest', code: C`
              data = [14, 3, 22, 9, 22, 7]
              smallest = data[0]
              for item in data:
                  if item < smallest:
                      smallest = item
              print(smallest)
            ` },
              {
                label: 'Position of largest', code: C`
              data = [14, 3, 22, 9, 22, 7]
              best = 0
              for i in range(1, len(data)):
                  if data[i] > data[best]:
                      best = i
              print("Largest at index", best, "value", data[best])
            ` },
              {
                label: 'Empty list', expectError: true, intro: 'Starting from `data[0]` crashes on an empty list. Check `if len(data) > 0` first.', code: C`
              data = []
              largest = data[0]
              print(largest)
            ` },
            ]
          },

          { t: 'viz', kind: 'search', mode: 'linear', data: [14, 3, 27, 9, 21, 5], target: 9 },

          {
            t: 'predict', code: C`
            data = [6, 2, 9, 2]
            for i in range(len(data)):
                if data[i] == 2:
                    print("found at", i)
                    break
            print("end")
          `, rows: 2, why: '`break` leaves the loop at the first match, so only index 1 is reported.'
          },
          {
            t: 'predict', code: C`
            def search(data, target):
                steps = 0
                for item in data:
                    steps = steps + 1
                    if item == target:
                        return steps
                return steps

            print(search([5, 6, 7, 8], 7), search([5, 6, 7, 8], 4), search([5, 6, 7, 8], 5))
          `, rows: 1, why: 'Target 7 is third (3 steps); a missing target costs all 4; 5 is first (1 step).'
          },
          { t: 'quiz', q: 'A list has 1000 items. In the **worst case**, how many comparisons does a linear search make?', options: ['1', '10', '500', '1000'], answer: 3, why: 'The worst case is that the item is last or not present, so every item is checked.' },
          { t: 'quiz', q: 'Which of these are true about linear search? (tick all that apply)', options: ['The list must be sorted', 'It works on unsorted data', 'It can stop early when the item is found', 'It always checks every item'], answer: [1, 2], why: 'Linear search needs no ordering and stops on a match; it only checks every item in the worst case.' },
          {
            t: 'parsons', prompt: 'Arrange a function that returns the index of the target, or -1.', lines: [
              'def find(data, target):',
              '    for i in range(len(data)):',
              '        if data[i] == target:',
              '            return i',
              '    return -1'], why: 'Return the index inside the loop; return -1 after the loop.'
          },

          {
            t: 'exercise', id: 'm11-ex-count', title: 'Count the matches', level: 1,
            prompt: 'Write a function <code>count_item(data, target)</code> that returns how many times <code>target</code> appears in the list.',
            starter: C`
              def count_item(data, target):
                  pass
            `,
            solution: C`
              def count_item(data, target):
                  count = 0
                  for item in data:
                      if item == target:
                          count = count + 1
                  return count
            `,
            tests: [
              { py: 'assert count_item([1, 2, 1, 3, 1], 1) == 3' },
              { py: 'assert count_item([1, 2, 3], 9) == 0', label: 'not present returns 0' },
              { py: 'assert count_item([], 4) == 0', label: 'empty list', hidden: true },
              { py: 'assert count_item(["a", "b", "a"], "a") == 2', hidden: true },
            ],
            hints: ['Start a counter at 0 and add one for each match.']
          },
          {
            t: 'exercise', id: 'm11-ex-linear', title: 'Write linear_search', level: 2,
            prompt: 'Write <code>linear_search(data, target)</code> that returns the index of the **first** match, or <code>-1</code> if it is not there. Do not use <code>.index()</code> or <code>in</code>.',
            starter: C`
              def linear_search(data, target):
                  for i in range(len(data)):
                      if data[i] == target:
                          return i
                      else:
                          return -1
            `,
            solution: C`
              def linear_search(data, target):
                  for i in range(len(data)):
                      if data[i] == target:
                          return i
                  return -1
            `,
            tests: [
              { py: 'assert linear_search([4, 5, 6], 5) == 1', label: 'finds the middle item' },
              { py: 'assert linear_search([4, 5, 6], 4) == 0' },
              { py: 'assert linear_search([4, 5, 6], 9) == -1', label: 'missing gives -1' },
              { py: 'assert linear_search([3, 3, 3], 3) == 0', label: 'first match only', hidden: true },
              { py: 'assert linear_search([], 1) == -1', hidden: true },
            ],
            requires: [{ re: '\\.index\\(', not: true, msg: 'Do not use `.index()`: write the loop yourself.' }],
            hints: ['The starter returns -1 too early. When can you be sure the item is not there?']
          },
          {
            t: 'exercise', id: 'm11-ex-lookup', title: 'Student look-up', level: 2, kind: 'exam',
            prompt: 'Two parallel lists store students and their form groups. Ask for a name. If it is in the list, print <code>name is in FORM</code>; otherwise print <code>Not found</code>. Ignore capitals when matching.',
            starter: C`
              names = ["Asha", "Ben", "Chloe", "Dev"]
              forms = ["10A", "10B", "10A", "10C"]
              wanted = input("Name: ")
              # search and print
            `,
            solution: C`
              names = ["Asha", "Ben", "Chloe", "Dev"]
              forms = ["10A", "10B", "10A", "10C"]
              wanted = input("Name: ").strip().lower()
              position = -1
              for i in range(len(names)):
                  if names[i].lower() == wanted:
                      position = i
              if position == -1:
                  print("Not found")
              else:
                  print(names[position], "is in", forms[position])
            `,
            tests: [
              { in: ['Chloe'], out: 'Chloe is in 10A' },
              { in: ['dev'], out: 'Dev is in 10C' },
              { in: ['Zoe'], out: 'Not found', hidden: true },
              { in: ['  BEN '], out: 'Ben is in 10B', hidden: true },
            ],
            hints: ['Find the index in `names`, then use the same index in `forms`.', 'Compare `names[i].lower()` with the lower-case input.']
          },
          {
            t: 'exercise', id: 'm11-ex-allpos', title: 'All the positions', level: 3,
            prompt: 'Write <code>find_all(data, target)</code> returning a list of every index where <code>target</code> is found (an empty list if none).',
            starter: C`
              def find_all(data, target):
                  pass
            `,
            solution: C`
              def find_all(data, target):
                  positions = []
                  for i in range(len(data)):
                      if data[i] == target:
                          positions.append(i)
                  return positions
            `,
            tests: [
              { py: 'assert find_all([3, 7, 3, 9, 3], 3) == [0, 2, 4]' },
              { py: 'assert find_all([1, 2], 5) == []' },
              { py: 'assert find_all(["a", "b", "a"], "a") == [0, 2]', hidden: true },
            ],
            hints: ['Do not return inside the loop; collect indexes in a list.']
          },
          {
            t: 'exercise', id: 'm11-ex-debug-search', title: 'Three errors in a search', level: 2, kind: 'debug',
            prompt: 'This program should print the index of the target in the list, or <code>Not found</code>. There are <strong>three</strong> errors.',
            starter: C`
              data = [12, 7, 19, 3]
              target = int(input("Search for: "))
              index = -1
              for i in range(1, len(data))
                  if data[i] = target:
                      index = i
              if index == 0:
                  print("Not found")
              else:
                  print("Found at", index)
            `,
            solution: C`
              data = [12, 7, 19, 3]
              target = int(input("Search for: "))
              index = -1
              for i in range(len(data)):
                  if data[i] == target:
                      index = i
              if index == -1:
                  print("Not found")
              else:
                  print("Found at", index)
            `,
            tests: [
              { in: ['12'], out: 'Found at 0' },
              { in: ['3'], out: 'Found at 3' },
              { in: ['50'], out: 'Not found', hidden: true },
            ],
            hints: ['Look at line 4 for a missing colon and at the next line for `=`.', 'The range should start at index 0.', 'The "not found" test uses the wrong value.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'binary-search',
        title: 'Binary search',
        time: '40 min',
        book: 'Ch 1 · p.23-25',
        summary: 'low, high, mid; halving a sorted list; counting steps',
        intro: 'If a list is sorted you can do far better than checking every item. A binary search looks in the middle and throws away half the list each time.',
        blocks: [
          { t: 'h', text: 'The guessing game idea' },
          { t: 'p', html: 'Think of guessing a number between 1 and 100 where the answer is "higher" or "lower". Guess 50. If it is higher, the answer is in 51 to 100; you have thrown away half. Binary search does exactly that on a sorted list.' },
          { t: 'note', kind: 'key', html: 'Binary search **only works if the list is sorted**. On unsorted data it can miss items that are really there.' },
          {
            t: 'table', head: ['Step', 'What to do'], rows: [
              ['1', 'Set `low` to the first index and `high` to the last index.'],
              ['2', 'While `low <= high`, find the middle index `mid = (low + high) // 2`.'],
              ['3', 'If `data[mid]` is the target: found at `mid`.'],
              ['4', 'If `data[mid]` is smaller than the target, the target is to the right: `low = mid + 1`.'],
              ['5', 'If `data[mid]` is bigger, the target is to the left: `high = mid - 1`.'],
              ['6', 'If `low` passes `high`, the item is not in the list.'],
            ]
          },
          { t: 'p', html: '`//` is integer division: it rounds down, so `(0 + 5) // 2` is `2`. Press **Trace** on this program and watch `low`, `high` and `mid` close in.' },
          {
            t: 'code', title: 'Binary search', code: C`
            data = [3, 8, 12, 17, 21, 26, 30, 35]
            target = 26
            low = 0
            high = len(data) - 1
            found = -1
            while low <= high:
                mid = (low + high) // 2
                if data[mid] == target:
                    found = mid
                    break
                elif data[mid] < target:
                    low = mid + 1
                else:
                    high = mid - 1
            print("Index:", found)
          `, caption: 'The search checks index 3 (17), then 5 (26): only two looks in a list of eight.'
          },

          {
            t: 'cases', title: 'As a function, with a step counter', items: [
              {
                label: 'Found', code: C`
              def binary_search(data, target):
                  low = 0
                  high = len(data) - 1
                  steps = 0
                  while low <= high:
                      mid = (low + high) // 2
                      steps = steps + 1
                      if data[mid] == target:
                          return mid, steps
                      elif data[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return -1, steps

              data = [3, 8, 12, 17, 21, 26, 30, 35]
              print(binary_search(data, 26))
            ` },
              {
                label: 'First or last', code: C`
              def binary_search(data, target):
                  low = 0
                  high = len(data) - 1
                  steps = 0
                  while low <= high:
                      mid = (low + high) // 2
                      steps = steps + 1
                      if data[mid] == target:
                          return mid, steps
                      elif data[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return -1, steps

              data = [3, 8, 12, 17, 21, 26, 30, 35]
              print(binary_search(data, 3))
              print(binary_search(data, 35))
            ` },
              {
                label: 'Not found', intro: 'When `low` passes `high` the loop ends and we return -1. Even a failed search is short.', code: C`
              def binary_search(data, target):
                  low = 0
                  high = len(data) - 1
                  steps = 0
                  while low <= high:
                      mid = (low + high) // 2
                      steps = steps + 1
                      if data[mid] == target:
                          return mid, steps
                      elif data[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return -1, steps

              data = [3, 8, 12, 17, 21, 26, 30, 35]
              print(binary_search(data, 20))
              print(binary_search(data, 99))
              print(binary_search([], 5))
            ` },
              {
                label: 'Strings', intro: 'Strings can be searched too, if sorted alphabetically.', code: C`
              names = ["Asha", "Ben", "Chloe", "Dev", "Ella", "Finn"]
              low = 0
              high = len(names) - 1
              target = "Ella"
              while low <= high:
                  mid = (low + high) // 2
                  if names[mid] == target:
                      print("Found at", mid)
                      break
                  elif names[mid] < target:
                      low = mid + 1
                  else:
                      high = mid - 1
            ` },
              {
                label: 'Unsorted data', intro: 'The result is wrong because the list is not in order: 4 is at index 0, but the search says it is missing.', code: C`
              data = [9, 4, 7, 1, 6]
              target = 4
              low = 0
              high = len(data) - 1
              result = -1
              while low <= high:
                  mid = (low + high) // 2
                  if data[mid] == target:
                      result = mid
                      break
                  elif data[mid] < target:
                      low = mid + 1
                  else:
                      high = mid - 1
              print(result)
            ` },
              {
                label: 'Infinite loop bug', intro: 'Writing `low = mid` instead of `mid + 1` can make `low` stop moving. This version uses a safety counter so it stops.', code: C`
              data = [1, 3, 5, 7]
              target = 7
              low = 0
              high = len(data) - 1
              safety = 0
              while low <= high and safety < 8:
                  safety = safety + 1
                  mid = (low + high) // 2
                  if data[mid] == target:
                      break
                  elif data[mid] < target:
                      low = mid
                  else:
                      high = mid
              print("Gave up after", safety, "loops")
            ` },
            ]
          },

          { t: 'h', text: 'Why it is so quick' },
          { t: 'p', html: 'Each step halves the list. Starting from 1000 items: 500, 250, 125, 62, 31, 15, 7, 3, 1. That is about 10 steps. Doubling the list size adds only **one** more step.' },
          {
            t: 'table', head: ['Items (n)', 'Worst case, linear', 'Worst case, binary'], rows: [
              ['8', '8', '4'],
              ['16', '16', '5'],
              ['1000', '1000', '10'],
              ['1 000 000', '1 000 000', '20'],
            ]
          },
          {
            t: 'code', title: 'Compare the two on 1000 items', code: C`
            data = list(range(1, 1001))
            target = 1000

            comparisons = 0
            for item in data:
                comparisons = comparisons + 1
                if item == target:
                    break
            print("Linear:", comparisons)

            low = 0
            high = len(data) - 1
            steps = 0
            while low <= high:
                mid = (low + high) // 2
                steps = steps + 1
                if data[mid] == target:
                    break
                elif data[mid] < target:
                    low = mid + 1
                else:
                    high = mid - 1
            print("Binary:", steps)
          ` },

          { t: 'h', text: 'Edexcel pseudocode' },
          { t: 'html', html: '<pre>SET low TO 0\nSET high TO LENGTH(data) - 1\nSET found TO false\nWHILE low &lt;= high AND found = false DO\n    SET mid TO (low + high) DIV 2\n    IF data[mid] = target THEN\n        SET found TO true\n    ELSE IF data[mid] &lt; target THEN\n        SET low TO mid + 1\n    ELSE\n        SET high TO mid - 1\n    END IF\nEND WHILE</pre>' },
          { t: 'note', kind: 'exam', html: '`DIV` in pseudocode is `//` in Python. A common exam task: trace a binary search on a list of 7 to 9 values, writing `low`, `high`, `mid` in a table. Do it row by row; each row is one pass of the loop. Another: explain why the data must be sorted (the decision "left or right" depends on order).' },
          { t: 'note', kind: 'warn', html: 'Common mistakes: using `mid` instead of `mid + 1` / `mid - 1` (can loop forever), using `<` instead of `<=` in the loop condition (misses the last remaining item), and forgetting to sort first.' },

          { t: 'viz', kind: 'search', mode: 'binary', caption: 'Try a target that is not in the list, and count how few comparisons are needed.' },

          {
            t: 'predict', code: C`
            data = [2, 4, 6, 8, 10, 12, 14]
            low = 0
            high = 6
            mid = (low + high) // 2
            print(mid, data[mid])
            low = mid + 1
            mid = (low + high) // 2
            print(mid, data[mid])
          `, rows: 2, why: 'First mid is 3 (value 8). Searching right, low is 4, so mid is (4+6)//2 = 5 (value 12).'
          },
          {
            t: 'predict', code: C`
            low = 5
            high = 8
            print((low + high) // 2)
          `, rows: 1, why: '13 // 2 rounds down to 6.'
          },
          { t: 'quiz', q: 'Why must the list be sorted for a binary search?', options: ['So the program runs faster on small lists', 'So that comparing with the middle item tells you which half to keep', 'Because Python refuses to search unsorted lists', 'So there are no duplicates'], answer: 1, why: 'The middle comparison only tells you which half to discard if the data is in order.' },
          { t: 'quiz', q: 'About how many comparisons does binary search need, at most, for 1024 items?', options: ['1024', '512', '32', '10 or 11'], answer: 3, why: '2 to the power 10 is 1024, so repeated halving reaches one item in about 10 steps.' },
          {
            t: 'parsons', prompt: 'Arrange the loop of a binary search.', lines: [
              'while low <= high:',
              '    mid = (low + high) // 2',
              '    if data[mid] == target:',
              '        return mid',
              '    elif data[mid] < target:',
              '        low = mid + 1',
              '    else:',
              '        high = mid - 1'], why: 'Compute mid, check for a match, then discard the left half (raise low) or right half (lower high).'
          },

          {
            t: 'exercise', id: 'm11-ex-midpoint', title: 'First middle', level: 1,
            prompt: 'A sorted list <code>ages</code> is given. Print the value at the first middle position, using <code>low</code>, <code>high</code> and <code>//</code>.',
            starter: C`
              ages = [11, 12, 12, 13, 14, 15, 16, 17, 18]
              low = 0
              high = len(ages) - 1
              # work out mid and print the value there
            `,
            solution: C`
              ages = [11, 12, 12, 13, 14, 15, 16, 17, 18]
              low = 0
              high = len(ages) - 1
              mid = (low + high) // 2
              print(ages[mid])
            `,
            tests: [{ out: '14' }],
            requires: [{ re: '//', msg: 'Use `//` for integer division.' }],
            hints: ['`mid = (low + high) // 2`']
          },
          {
            t: 'exercise', id: 'm11-ex-binary', title: 'Write binary_search', level: 2,
            prompt: 'Write <code>binary_search(data, target)</code> for a sorted list. Return the index of the target, or <code>-1</code> if not found.',
            starter: C`
              def binary_search(data, target):
                  low = 0
                  high = len(data) - 1
                  # loop while low <= high
                  return -1
            `,
            solution: C`
              def binary_search(data, target):
                  low = 0
                  high = len(data) - 1
                  while low <= high:
                      mid = (low + high) // 2
                      if data[mid] == target:
                          return mid
                      elif data[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return -1
            `,
            tests: [
              { py: 'assert binary_search([3, 8, 12, 17, 21, 26], 17) == 3' },
              { py: 'assert binary_search([3, 8, 12, 17, 21, 26], 3) == 0', label: 'first item' },
              { py: 'assert binary_search([3, 8, 12, 17, 21, 26], 26) == 5', label: 'last item' },
              { py: 'assert binary_search([3, 8, 12], 9) == -1', label: 'not found' },
              { py: 'assert binary_search([], 1) == -1', hidden: true },
              { py: 'assert binary_search([7], 7) == 0', hidden: true },
            ],
            hints: ['Compare `data[mid]` with `target` in three ways: equal, smaller, bigger.']
          },
          {
            t: 'exercise', id: 'm11-ex-count-steps', title: 'Count the steps', level: 3,
            prompt: 'Write <code>binary_steps(data, target)</code> that returns how many times a binary search looks at a middle item (the number of loop passes). A missing target still counts the passes made.',
            starter: C`
              def binary_steps(data, target):
                  pass
            `,
            solution: C`
              def binary_steps(data, target):
                  low = 0
                  high = len(data) - 1
                  steps = 0
                  while low <= high:
                      mid = (low + high) // 2
                      steps = steps + 1
                      if data[mid] == target:
                          return steps
                      elif data[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return steps
            `,
            tests: [
              { py: 'assert binary_steps([1, 2, 3, 4, 5, 6, 7], 4) == 1' },
              { py: 'assert binary_steps([1, 2, 3, 4, 5, 6, 7], 7) == 3' },
              { py: 'assert binary_steps(list(range(1000)), 999) <= 10', label: 'at most 10 for 1000 items' },
              { py: 'assert binary_steps([1, 3, 5], 4) == 2', hidden: true },
            ],
            hints: ['Add 1 to a counter at the top of each pass.']
          },
          {
            t: 'exercise', id: 'm11-ex-guess', title: 'Guess the number', level: 2, kind: 'exam',
            prompt: 'A computer picks a secret number from 1 to 100 (given as <code>secret</code>). Write the program that finds it by always guessing the middle of the range <code>low</code> to <code>high</code>, printing each guess on its own line, until it guesses correctly. Then print <code>Found in N guesses</code>.',
            starter: C`
              secret = int(input("Secret number: "))
              low = 1
              high = 100
              guesses = 0
              # keep guessing the middle
            `,
            solution: C`
              secret = int(input("Secret number: "))
              low = 1
              high = 100
              guesses = 0
              while True:
                  guess = (low + high) // 2
                  guesses = guesses + 1
                  print(guess)
                  if guess == secret:
                      break
                  elif guess < secret:
                      low = guess + 1
                  else:
                      high = guess - 1
              print("Found in", guesses, "guesses")
            `,
            tests: [
              { in: ['50'], out: '50\nFound in 1 guesses' },
              { in: ['75'], out: '50\n75\nFound in 2 guesses' },
              { in: ['1'], out: '50\n25\n12\n6\n3\n1\nFound in 6 guesses', hidden: true },
              { in: ['100'], out: '50\n75\n88\n94\n97\n99\n100\nFound in 7 guesses', hidden: true },
            ],
            hints: ['If the guess is too low, the new `low` is `guess + 1`.', 'Use `//` so the guess is a whole number.']
          },
          {
            t: 'exercise', id: 'm11-ex-debug-binary', title: 'Three errors in binary search', level: 3, kind: 'debug',
            prompt: 'This function should return the index of <code>target</code> in a sorted list, or <code>-1</code>. There are <strong>three</strong> errors.',
            starter: C`
              def binary_search(data, target):
                  low = 0
                  high = len(data)
                  while low < high:
                      mid = (low + high) / 2
                      if data[mid] == target:
                          return mid
                      elif data[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return -1
            `,
            solution: C`
              def binary_search(data, target):
                  low = 0
                  high = len(data) - 1
                  while low <= high:
                      mid = (low + high) // 2
                      if data[mid] == target:
                          return mid
                      elif data[mid] < target:
                          low = mid + 1
                      else:
                          high = mid - 1
                  return -1
            `,
            tests: [
              { py: 'assert binary_search([2, 4, 6, 8, 10], 8) == 3' },
              { py: 'assert binary_search([2, 4, 6, 8, 10], 10) == 4', label: 'last item' },
              { py: 'assert binary_search([2, 4, 6, 8, 10], 5) == -1' },
              { py: 'assert binary_search([5], 5) == 0', hidden: true },
            ],
            hints: ['The last index is `len(data) - 1`.', 'An index must be a whole number: `/` gives a float.', 'The loop must still run when `low` equals `high`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'bubble-sort',
        title: 'Bubble sort',
        time: '40 min',
        book: 'Ch 1 · p.26-28',
        summary: 'Compare neighbours and swap; passes; early stop; counting swaps',
        intro: 'Sorting means putting items in order. Bubble sort is the classic first algorithm: repeatedly compare neighbours and swap them if they are in the wrong order. Big values "bubble" to the end.',
        blocks: [
          { t: 'h', text: 'Swapping two values' },
          { t: 'p', html: 'Everything in a bubble sort relies on a **swap**. If you write `a = b` then `b = a`, both end up the same, because the first value is lost. You need a temporary holder, or Python\'s tuple swap.' },
          {
            t: 'cases', title: 'Swapping', items: [
              {
                label: 'Wrong', intro: 'Both become 8. The original `a` was overwritten before it was saved.', code: C`
              a = 5
              b = 8
              a = b
              b = a
              print(a, b)
            ` },
              {
                label: 'With temp', intro: 'The classic three-line swap. Trace it.', code: C`
              a = 5
              b = 8
              temp = a
              a = b
              b = temp
              print(a, b)
            ` },
              {
                label: 'Tuple swap', intro: 'Python can swap in one line.', code: C`
              a = 5
              b = 8
              a, b = b, a
              print(a, b)
            ` },
              {
                label: 'In a list', code: C`
              data = [9, 2, 7]
              data[0], data[2] = data[2], data[0]
              print(data)
              temp = data[1]
              data[1] = data[2]
              data[2] = temp
              print(data)
            ` },
            ]
          },

          { t: 'h', text: 'One pass' },
          { t: 'p', html: 'A **pass** goes along the list comparing each item with the one after it. If the left one is bigger, swap. After one pass the biggest value has reached the end. Press **Trace** and watch the list change.' },
          {
            t: 'code', title: 'One pass', code: C`
            data = [5, 3, 8, 1]
            for i in range(len(data) - 1):
                if data[i] > data[i + 1]:
                    data[i], data[i + 1] = data[i + 1], data[i]
                print(data)
          `, caption: 'Why `len(data) - 1`? The last comparison is between the last two items; going further would make `data[i + 1]` an `IndexError`.'
          },
          {
            t: 'code', title: 'Too far: IndexError', expectError: true, code: C`
            data = [5, 3, 8, 1]
            for i in range(len(data)):
                if data[i] > data[i + 1]:
                    data[i], data[i + 1] = data[i + 1], data[i]
          ` },

          { t: 'h', text: 'The full sort' },
          { t: 'p', html: 'With n items, you need up to n - 1 passes. Put the pass inside another loop.' },
          {
            t: 'cases', title: 'Bubble sort versions', items: [
              {
                label: 'Basic', code: C`
              data = [5, 3, 8, 1, 9, 2]
              n = len(data)
              for p in range(n - 1):
                  for i in range(n - 1):
                      if data[i] > data[i + 1]:
                          data[i], data[i + 1] = data[i + 1], data[i]
                  print("After pass", p + 1, data)
            ` },
              {
                label: 'Shrinking passes', intro: 'After each pass the largest item is in place, so the next pass can stop one place earlier.', code: C`
              data = [5, 3, 8, 1, 9, 2]
              n = len(data)
              comparisons = 0
              for p in range(n - 1):
                  for i in range(n - 1 - p):
                      comparisons = comparisons + 1
                      if data[i] > data[i + 1]:
                          data[i], data[i + 1] = data[i + 1], data[i]
              print(data)
              print("Comparisons:", comparisons)
            ` },
              {
                label: 'Early stop', intro: 'If a whole pass makes **no swaps**, the list is already sorted, so stop. A flag records whether a swap happened.', code: C`
              data = [1, 2, 4, 3, 5, 6]
              n = len(data)
              swaps = 0
              passes = 0
              swapped = True
              while swapped:
                  swapped = False
                  passes = passes + 1
                  for i in range(n - 1):
                      if data[i] > data[i + 1]:
                          data[i], data[i + 1] = data[i + 1], data[i]
                          swapped = True
                          swaps = swaps + 1
              print(data, "passes:", passes, "swaps:", swaps)
            ` },
              {
                label: 'Already sorted', intro: 'With the flag, a sorted list needs just one pass.', code: C`
              data = [1, 2, 3, 4, 5]
              passes = 0
              swapped = True
              while swapped:
                  swapped = False
                  passes = passes + 1
                  for i in range(len(data) - 1):
                      if data[i] > data[i + 1]:
                          data[i], data[i + 1] = data[i + 1], data[i]
                          swapped = True
              print("passes:", passes)
            ` },
              {
                label: 'Descending', intro: 'To sort from largest to smallest, flip the comparison.', code: C`
              data = [5, 3, 8, 1]
              for p in range(len(data) - 1):
                  for i in range(len(data) - 1):
                      if data[i] < data[i + 1]:
                          data[i], data[i + 1] = data[i + 1], data[i]
              print(data)
            ` },
              {
                label: 'Strings', intro: 'Strings sort alphabetically (capitals come before lower case).', code: C`
              names = ["Dev", "asha", "Chloe", "Ben"]
              for p in range(len(names) - 1):
                  for i in range(len(names) - 1):
                      if names[i].lower() > names[i + 1].lower():
                          names[i], names[i + 1] = names[i + 1], names[i]
              print(names)
            ` },
              {
                label: 'Rows by column', intro: 'Sorting a 2D list: compare the field you care about, swap the whole rows.', code: C`
              table = [["Ben", 58], ["Asha", 72], ["Chloe", 41]]
              for p in range(len(table) - 1):
                  for i in range(len(table) - 1):
                      if table[i][1] < table[i + 1][1]:
                          table[i], table[i + 1] = table[i + 1], table[i]
              print(table)
            ` },
            ]
          },

          { t: 'h', text: 'Tracing it by hand' },
          {
            t: 'table', head: ['Pass', 'List at the end of the pass'], rows: [
              ['Start', '5, 3, 8, 1'],
              ['1', '3, 5, 1, 8'],
              ['2', '3, 1, 5, 8'],
              ['3', '1, 3, 5, 8'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel questions give you a short list and ask you to show the list after each pass. Write the whole list every time, not just the swaps. Marks are also given for stating that the algorithm stops when a pass has no swaps.' },
          { t: 'html', html: '<pre>SET n TO LENGTH(data)\nREPEAT\n    SET swapped TO false\n    FOR i FROM 0 TO n - 2 DO\n        IF data[i] &gt; data[i + 1] THEN\n            SET temp TO data[i]\n            SET data[i] TO data[i + 1]\n            SET data[i + 1] TO temp\n            SET swapped TO true\n        END IF\n    END FOR\nUNTIL swapped = false</pre>' },
          { t: 'note', kind: 'warn', html: 'Python\'s `FOR i FROM 0 TO n - 2` is `range(n - 1)`. The upper bound in `range` is not included. Also `data.sort()` exists, but in the exam you must show the algorithm by hand when asked to "write" a sort.' },

          { t: 'viz', kind: 'bubble', caption: 'Step through slowly. Notice how the biggest value "bubbles" to the end of the list on every pass.' },

          {
            t: 'predict', code: C`
            data = [4, 2, 3]
            for i in range(len(data) - 1):
                if data[i] > data[i + 1]:
                    data[i], data[i + 1] = data[i + 1], data[i]
            print(data)
          `, rows: 1, why: 'Compare 4 and 2: swap to 2,4,3. Compare 4 and 3: swap to 2,3,4.'
          },
          {
            t: 'predict', code: C`
            data = [3, 1, 2]
            swaps = 0
            for p in range(2):
                for i in range(2):
                    if data[i] > data[i + 1]:
                        data[i], data[i + 1] = data[i + 1], data[i]
                        swaps = swaps + 1
            print(data, swaps)
          `, rows: 1, why: 'Pass 1: 3,1,2 -> 1,3,2 -> 1,2,3 (2 swaps). Pass 2 has no swaps. Total 2.'
          },
          { t: 'quiz', q: 'A bubble sort is run on <code>[1, 2, 3, 4]</code> with the early-stop flag. How many passes are made?', options: ['0', '1', '3', '4'], answer: 1, why: 'The first pass finds no swaps, so the flag stays False and the loop stops.' },
          { t: 'quiz', q: 'After the first pass of a bubble sort (ascending), which value is guaranteed to be in its final position?', options: ['The smallest', 'The largest', 'The first item', 'The middle item'], answer: 1, why: 'The largest value is carried to the end by successive swaps.' },
          {
            t: 'parsons', prompt: 'Arrange a bubble sort with a swapped flag.', lines: [
              'swapped = True',
              'while swapped:',
              '    swapped = False',
              '    for i in range(len(data) - 1):',
              '        if data[i] > data[i + 1]:',
              '            data[i], data[i + 1] = data[i + 1], data[i]',
              '            swapped = True'], why: 'The flag is reset at the start of each pass and set when a swap happens.'
          },

          {
            t: 'exercise', id: 'm11-ex-swapfirst', title: 'Swap the ends', level: 1,
            prompt: 'Write a function <code>swap_ends(data)</code> that swaps the first and last items of the list (in place). Use a temp variable or a tuple swap.',
            starter: C`
              def swap_ends(data):
                  pass
            `,
            solution: C`
              def swap_ends(data):
                  data[0], data[-1] = data[-1], data[0]
            `,
            tests: [
              { py: 'd = [1, 2, 3]\nswap_ends(d)\nassert d == [3, 2, 1]' },
              { py: 'd = [5, 9]\nswap_ends(d)\nassert d == [9, 5]' },
              { py: 'd = [4]\nswap_ends(d)\nassert d == [4]', hidden: true },
            ],
            hints: ['The last index is `-1`.']
          },
          {
            t: 'exercise', id: 'm11-ex-bubble', title: 'Write bubble_sort', level: 2,
            prompt: 'Write <code>bubble_sort(data)</code> that sorts the list in place into ascending order. Do not use <code>sort()</code> or <code>sorted()</code>.',
            starter: C`
              def bubble_sort(data):
                  n = len(data)
                  for p in range(n - 1):
                      for i in range(n - 1):
                          if data[i] < data[i + 1]:
                              data[i], data[i + 1] = data[i + 1], data[i]
            `,
            solution: C`
              def bubble_sort(data):
                  n = len(data)
                  for p in range(n - 1):
                      for i in range(n - 1):
                          if data[i] > data[i + 1]:
                              data[i], data[i + 1] = data[i + 1], data[i]
            `,
            tests: [
              { py: 'd = [5, 3, 8, 1]\nbubble_sort(d)\nassert d == [1, 3, 5, 8]' },
              { py: 'd = [1, 2, 3]\nbubble_sort(d)\nassert d == [1, 2, 3]', label: 'already sorted' },
              { py: 'd = [3, 3, 1, 1]\nbubble_sort(d)\nassert d == [1, 1, 3, 3]', label: 'duplicates' },
              { py: 'd = []\nbubble_sort(d)\nassert d == []', hidden: true },
              { py: 'd = ["pear", "apple", "fig"]\nbubble_sort(d)\nassert d == ["apple", "fig", "pear"]', hidden: true },
            ],
            requires: [{ re: '\\.sort\\(|sorted\\(', not: true, msg: 'Write the sort yourself.' }],
            hints: ['The starter sorts the wrong way round: look at the comparison.']
          },
          {
            t: 'exercise', id: 'm11-ex-swapcount', title: 'Count the swaps', level: 3,
            prompt: 'Write <code>bubble_swaps(data)</code> which sorts a **copy** of the list with bubble sort and returns the number of swaps made (the original list must not change).',
            starter: C`
              def bubble_swaps(data):
                  pass
            `,
            solution: C`
              def bubble_swaps(data):
                  items = data[:]
                  swaps = 0
                  n = len(items)
                  for p in range(n - 1):
                      for i in range(n - 1):
                          if items[i] > items[i + 1]:
                              items[i], items[i + 1] = items[i + 1], items[i]
                              swaps = swaps + 1
                  return swaps
            `,
            tests: [
              { py: 'assert bubble_swaps([3, 1, 2]) == 2' },
              { py: 'assert bubble_swaps([1, 2, 3]) == 0' },
              { py: 'assert bubble_swaps([4, 3, 2, 1]) == 6' },
              { py: 'd = [2, 1]\nbubble_swaps(d)\nassert d == [2, 1], "original must not change"', label: 'original unchanged', hidden: true },
            ],
            hints: ['Copy first with `data[:]`.', 'Add 1 to a counter inside the swap branch.']
          },
          {
            t: 'exercise', id: 'm11-ex-leaderboard', title: 'Leaderboard', level: 3, kind: 'exam',
            prompt: 'Three players and their scores are stored in parallel lists. Sort them so the highest score is first (using a bubble sort that swaps **both** lists together), then print each as <code>name: score</code> on its own line.',
            starter: C`
              names = ["Ben", "Asha", "Chloe"]
              scores = [58, 72, 41]
              # sort by score, highest first, keeping the lists aligned
              for i in range(len(names)):
                  print(names[i] + ": " + str(scores[i]))
            `,
            solution: C`
              names = ["Ben", "Asha", "Chloe"]
              scores = [58, 72, 41]
              n = len(names)
              for p in range(n - 1):
                  for i in range(n - 1):
                      if scores[i] < scores[i + 1]:
                          scores[i], scores[i + 1] = scores[i + 1], scores[i]
                          names[i], names[i + 1] = names[i + 1], names[i]
              for i in range(len(names)):
                  print(names[i] + ": " + str(scores[i]))
            `,
            tests: [{ out: 'Asha: 72\nBen: 58\nChloe: 41' }],
            requires: [{ re: '\\.sort\\(|sorted\\(', not: true, msg: 'Write the bubble sort yourself.' }],
            hints: ['Whenever you swap two scores, swap the two names at the same positions.', 'For highest first, swap when the left score is smaller.']
          },
          {
            t: 'exercise', id: 'm11-ex-debug-bubble', title: 'Three errors in bubble sort', level: 2, kind: 'debug',
            prompt: 'This should sort <code>marks</code> ascending and print it. There are <strong>three</strong> errors.',
            starter: C`
              marks = [14, 9, 20, 3]
              n = len(marks)
              for p in range(n)
                  for i in range(n):
                      if marks[i] > marks[i + 1]:
                          marks[i] = marks[i + 1]
                          marks[i + 1] = marks[i]
              print(marks)
            `,
            solution: C`
              marks = [14, 9, 20, 3]
              n = len(marks)
              for p in range(n - 1):
                  for i in range(n - 1):
                      if marks[i] > marks[i + 1]:
                          temp = marks[i]
                          marks[i] = marks[i + 1]
                          marks[i + 1] = temp
              print(marks)
            `,
            tests: [{ out: '[3, 9, 14, 20]' }],
            hints: ['A `for` line needs a colon.', 'Comparing `marks[i + 1]` on the last index goes off the end.', 'The swap loses a value: use a temp variable.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'merge-sort',
        title: 'Merge sort',
        time: '40 min',
        book: 'Ch 1 · p.29-30',
        summary: 'Split in halves, sort each, merge two sorted lists',
        intro: 'Merge sort uses a different idea: divide and conquer. Split the list in halves until single items remain, then merge the pieces back together in order. It is much faster than bubble sort on big lists.',
        blocks: [
          { t: 'h', text: 'Idea first: split, then merge' },
          { t: 'p', html: 'A list of one item is already sorted. So: **split** the list in half again and again until every piece has one item. Then **merge** neighbouring pieces, picking the smaller front item each time.' },
          { t: 'html', html: '<pre>[6, 2, 8, 4]\n  split\n[6, 2]      [8, 4]\n  split         split\n[6] [2]     [8] [4]\n  merge         merge\n[2, 6]      [4, 8]\n        merge\n   [2, 4, 6, 8]</pre>' },
          { t: 'note', kind: 'exam', html: 'In Paper 1 style questions you describe or complete a diagram of the splits and merges. In Paper 2 you use the algorithm in code. Stages: (1) divide until each list has one item, (2) merge pairs into sorted lists, (3) repeat until one sorted list remains.' },

          { t: 'h', text: 'The key step: merging two sorted lists' },
          { t: 'p', html: 'Keep a pointer into each list. Compare the two front items, copy the smaller to the result, and move that pointer along. When one list runs out, copy whatever remains of the other. Press **Trace** to follow `i`, `j` and `result`.' },
          {
            t: 'code', title: 'merge', code: C`
            def merge(left, right):
                result = []
                i = 0
                j = 0
                while i < len(left) and j < len(right):
                    if left[i] <= right[j]:
                        result.append(left[i])
                        i = i + 1
                    else:
                        result.append(right[j])
                        j = j + 1
                while i < len(left):
                    result.append(left[i])
                    i = i + 1
                while j < len(right):
                    result.append(right[j])
                    j = j + 1
                return result

            print(merge([2, 6], [4, 8]))
          ` },
          {
            t: 'cases', title: 'Merge in every situation', items: [
              {
                label: 'Interleaved', code: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  result = result + left[i:] + right[j:]
                  return result

              print(merge([1, 4, 7], [2, 3, 9]))
            ` },
              {
                label: 'One list first', intro: 'All of the left list is smaller. The leftover of `right` is added at the end.', code: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  result = result + left[i:] + right[j:]
                  return result

              print(merge([1, 2], [5, 6, 7]))
            ` },
              {
                label: 'Empty side', code: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  result = result + left[i:] + right[j:]
                  return result

              print(merge([], [3, 4]))
              print(merge([3, 4], []))
            ` },
              {
                label: 'Duplicates', intro: 'Using `<=` keeps equal items in their original order.', code: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  result = result + left[i:] + right[j:]
                  return result

              print(merge([2, 5, 5], [5, 6]))
            ` },
            ]
          },

          { t: 'h', text: 'The full merge sort' },
          { t: 'p', html: 'The sort function calls **itself** on each half. This is **recursion**. The **base case** is a list of 0 or 1 items, which is returned unchanged; without it the splitting would never stop.' },
          {
            t: 'code', title: 'merge_sort', code: C`
            def merge(left, right):
                result = []
                i = 0
                j = 0
                while i < len(left) and j < len(right):
                    if left[i] <= right[j]:
                        result.append(left[i])
                        i = i + 1
                    else:
                        result.append(right[j])
                        j = j + 1
                return result + left[i:] + right[j:]

            def merge_sort(data):
                if len(data) <= 1:
                    return data
                middle = len(data) // 2
                left = merge_sort(data[:middle])
                right = merge_sort(data[middle:])
                return merge(left, right)

            print(merge_sort([6, 2, 8, 4, 1, 7]))
          `, caption: 'It returns a new sorted list; the original is not changed.'
          },
          {
            t: 'code', title: 'Watch the splits and merges', code: C`
            def merge(left, right):
                result = []
                i = 0
                j = 0
                while i < len(left) and j < len(right):
                    if left[i] <= right[j]:
                        result.append(left[i])
                        i = i + 1
                    else:
                        result.append(right[j])
                        j = j + 1
                return result + left[i:] + right[j:]

            def merge_sort(data, depth=0):
                print("  " * depth + "split", data)
                if len(data) <= 1:
                    return data
                middle = len(data) // 2
                left = merge_sort(data[:middle], depth + 1)
                right = merge_sort(data[middle:], depth + 1)
                joined = merge(left, right)
                print("  " * depth + "merge", joined)
                return joined

            merge_sort([6, 2, 8, 4])
          ` },
          {
            t: 'cases', title: 'Variations', items: [
              {
                label: 'Strings', code: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  return result + left[i:] + right[j:]

              def merge_sort(data):
                  if len(data) <= 1:
                      return data
                  middle = len(data) // 2
                  return merge(merge_sort(data[:middle]), merge_sort(data[middle:]))

              print(merge_sort(["pear", "apple", "fig", "banana"]))
            ` },
              {
                label: 'Descending', intro: 'Only the comparison changes: take the **larger** front item.', code: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] >= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  return result + left[i:] + right[j:]

              def merge_sort(data):
                  if len(data) <= 1:
                      return data
                  middle = len(data) // 2
                  return merge(merge_sort(data[:middle]), merge_sort(data[middle:]))

              print(merge_sort([5, 1, 9, 3]))
            ` },
              {
                label: 'Missing base case', expectError: true, intro: 'Without the base case the function calls itself forever until Python gives up with a `RecursionError`.', code: C`
              def broken_sort(data):
                  middle = len(data) // 2
                  return broken_sort(data[:middle]) + broken_sort(data[middle:])

              print(broken_sort([3, 1, 2]))
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'Merge sort splits a list of n items about log<sub>2</sub> n times, and each level of merging touches every item once. For 1000 items that is roughly 1000 x 10 = 10 000 steps, compared with up to about 1 000 000 for bubble sort.' },
          { t: 'note', kind: 'warn', html: 'Merge sort needs extra memory for the new lists, while bubble sort swaps inside the one list. That is the price paid for speed.' },

          { t: 'viz', kind: 'merge' },

          {
            t: 'predict', code: C`
            def merge(left, right):
                result = []
                i = 0
                j = 0
                while i < len(left) and j < len(right):
                    if left[i] <= right[j]:
                        result.append(left[i])
                        i = i + 1
                    else:
                        result.append(right[j])
                        j = j + 1
                return result + left[i:] + right[j:]

            print(merge([1, 5], [2, 3, 9]))
          `, rows: 1, why: '1, then 2, 3 from the right, then 5, then the leftover 9.'
          },
          {
            t: 'predict', code: C`
            data = [8, 3, 5, 1, 9]
            middle = len(data) // 2
            print(data[:middle])
            print(data[middle:])
          `, rows: 2, why: 'Middle is 5 // 2 = 2, so the left half is the first two items and the right half the rest.'
          },
          { t: 'quiz', q: 'What is the base case of merge sort?', options: ['A list with 0 or 1 items', 'A list that is already sorted', 'A list of 2 items', 'A list with duplicates'], answer: 0, why: 'A list of 0 or 1 items is already sorted, so no more splitting is needed.' },
          { t: 'quiz', q: 'Which statement about merge sort is true?', options: ['It only works on numbers', 'It repeatedly splits the list and then merges sorted pieces', 'It compares neighbours and swaps them', 'It needs the data to be sorted already'], answer: 1, why: 'That is divide and conquer. Comparing and swapping neighbours describes bubble sort.' },
          {
            t: 'sort', prompt: 'Which sorting algorithm does each description fit?', cats: ['Bubble sort', 'Merge sort'], items: [
              { text: 'Compares neighbouring items and swaps them', cat: 0 },
              { text: 'Repeatedly halves the list', cat: 1 },
              { text: 'Stops when a pass has no swaps', cat: 0 },
              { text: 'Combines two sorted lists into one', cat: 1 },
              { text: 'Uses recursion in the usual Python version', cat: 1 },
              { text: 'Sorts in place using a temp variable', cat: 0 },
            ], why: 'Bubble = neighbours and swaps; merge = halve and merge.'
          },

          {
            t: 'exercise', id: 'm11-ex-halves', title: 'Split in two', level: 1,
            prompt: 'Write <code>split_half(data)</code> that returns a tuple <code>(left, right)</code> where <code>left</code> is the first half and <code>right</code> the rest. For an odd length the right half is the bigger one.',
            starter: C`
              def split_half(data):
                  pass
            `,
            solution: C`
              def split_half(data):
                  middle = len(data) // 2
                  return (data[:middle], data[middle:])
            `,
            tests: [
              { py: 'assert split_half([1, 2, 3, 4]) == ([1, 2], [3, 4])' },
              { py: 'assert split_half([1, 2, 3]) == ([1], [2, 3])' },
              { py: 'assert split_half([5]) == ([], [5])', hidden: true },
            ],
            hints: ['Use `len(data) // 2` as the cut point and two slices.']
          },
          {
            t: 'exercise', id: 'm11-ex-merge', title: 'Write merge', level: 2,
            prompt: 'Write <code>merge(left, right)</code> that merges two **sorted** lists into one sorted list (a new list). Do not use <code>sort()</code> or <code>sorted()</code>.',
            starter: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  # compare the front items while both lists have items
                  # then add what is left
                  return result
            `,
            solution: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  while i < len(left):
                      result.append(left[i])
                      i = i + 1
                  while j < len(right):
                      result.append(right[j])
                      j = j + 1
                  return result
            `,
            tests: [
              { py: 'assert merge([1, 4], [2, 3]) == [1, 2, 3, 4]' },
              { py: 'assert merge([], [1, 2]) == [1, 2]', label: 'empty left' },
              { py: 'assert merge([1, 2], []) == [1, 2]', label: 'empty right' },
              { py: 'assert merge([1, 1], [1]) == [1, 1, 1]', label: 'duplicates' },
              { py: 'assert merge([5, 6, 7], [1, 2]) == [1, 2, 5, 6, 7]', hidden: true },
            ],
            requires: [{ re: '\\.sort\\(|sorted\\(', not: true, msg: 'Write the merge yourself.' }],
            hints: ['`i` points into `left`, `j` into `right`.', 'After the main loop, one list still has items: copy them.']
          },
          {
            t: 'exercise', id: 'm11-ex-merge-sort', title: 'Write merge_sort', level: 3,
            prompt: 'Using the provided <code>merge</code>, write the recursive function <code>merge_sort(data)</code> that returns a new sorted list.',
            starter: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  return result + left[i:] + right[j:]

              def merge_sort(data):
                  pass
            `,
            solution: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  return result + left[i:] + right[j:]

              def merge_sort(data):
                  if len(data) <= 1:
                      return data
                  middle = len(data) // 2
                  left = merge_sort(data[:middle])
                  right = merge_sort(data[middle:])
                  return merge(left, right)
            `,
            tests: [
              { py: 'assert merge_sort([6, 2, 8, 4, 1, 7]) == [1, 2, 4, 6, 7, 8]' },
              { py: 'assert merge_sort([]) == []' },
              { py: 'assert merge_sort([3]) == [3]' },
              { py: 'assert merge_sort([2, 2, 1, 1]) == [1, 1, 2, 2]', hidden: true },
              { py: 'assert merge_sort(["b", "c", "a"]) == ["a", "b", "c"]', hidden: true },
            ],
            requires: [{ re: 'merge_sort\\(data\\[', msg: 'Call `merge_sort` on each half.' }],
            hints: ['Base case first: `if len(data) <= 1: return data`.', 'Sort each half with `merge_sort`, then `merge` them.']
          },
          {
            t: 'exercise', id: 'm11-ex-debug-merge', title: 'Three errors in merge', level: 3, kind: 'debug',
            prompt: 'This <code>merge</code> should combine two sorted lists, but there are <strong>three</strong> errors.',
            starter: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) or j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          j = j + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  return result
            `,
            solution: C`
              def merge(left, right):
                  result = []
                  i = 0
                  j = 0
                  while i < len(left) and j < len(right):
                      if left[i] <= right[j]:
                          result.append(left[i])
                          i = i + 1
                      else:
                          result.append(right[j])
                          j = j + 1
                  return result + left[i:] + right[j:]
            `,
            tests: [
              { py: 'assert merge([1, 4], [2, 3]) == [1, 2, 3, 4]' },
              { py: 'assert merge([1, 2], [5, 6, 7]) == [1, 2, 5, 6, 7]', label: 'leftovers kept' },
              { py: 'assert merge([], [1]) == [1]', hidden: true },
            ],
            hints: ['When taking from `left`, which pointer moves?', 'Use `and`: stop as soon as one list is used up.', 'Items left over at the end are lost.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'algorithm-efficiency',
        title: 'Comparing algorithms',
        time: '35 min',
        book: 'Ch 1 · p.17-30',
        summary: 'Counting steps, best/worst case, choosing the right algorithm',
        intro: 'Two correct algorithms can differ hugely in how long they take. Computer scientists measure this by counting steps as the amount of data grows. You do not need a stopwatch: a counter will do.',
        blocks: [
          { t: 'h', text: 'Count the steps' },
          { t: 'p', html: 'Time on a real computer varies. Counting comparisons does not. Run this program and read the table it prints: the linear column grows with n, the binary column barely moves.' },
          {
            t: 'code', title: 'Searching: worst-case steps', code: C`
            def linear_steps(n):
                data = list(range(n))
                steps = 0
                for item in data:
                    steps = steps + 1
                    if item == n - 1:
                        break
                return steps

            def binary_steps(n):
                data = list(range(n))
                target = n - 1
                low = 0
                high = n - 1
                steps = 0
                while low <= high:
                    mid = (low + high) // 2
                    steps = steps + 1
                    if data[mid] == target:
                        break
                    elif data[mid] < target:
                        low = mid + 1
                    else:
                        high = mid - 1
                return steps

            print("n      linear  binary")
            for n in [8, 16, 100, 1000, 100000]:
                print(str(n).ljust(7) + str(linear_steps(n)).ljust(8) + str(binary_steps(n)))
          ` },
          {
            t: 'cases', title: 'Best, worst and average', items: [
              {
                label: 'Linear: best case', intro: 'Target is first.', code: C`
              data = [7, 3, 9, 1, 5]
              steps = 0
              for item in data:
                  steps = steps + 1
                  if item == 7:
                      break
              print("Steps:", steps)
            ` },
              {
                label: 'Linear: worst case', intro: 'Target is last, or missing.', code: C`
              data = [7, 3, 9, 1, 5]
              steps = 0
              for item in data:
                  steps = steps + 1
                  if item == 5:
                      break
              print("Steps:", steps)
            ` },
              {
                label: 'Binary: best case', intro: 'Target happens to be the middle item.', code: C`
              data = [1, 3, 5, 7, 9]
              low = 0
              high = 4
              steps = 0
              while low <= high:
                  mid = (low + high) // 2
                  steps = steps + 1
                  if data[mid] == 5:
                      break
                  elif data[mid] < 5:
                      low = mid + 1
                  else:
                      high = mid - 1
              print("Steps:", steps)
            ` },
              {
                label: 'Binary: worst case', intro: 'Target missing: the range shrinks until empty.', code: C`
              data = [1, 3, 5, 7, 9]
              low = 0
              high = 4
              steps = 0
              while low <= high:
                  mid = (low + high) // 2
                  steps = steps + 1
                  if data[mid] == 4:
                      break
                  elif data[mid] < 4:
                      low = mid + 1
                  else:
                      high = mid - 1
              print("Steps:", steps)
            ` },
            ]
          },

          { t: 'h', text: 'Counting comparisons in sorting' },
          { t: 'p', html: 'Sorting a reversed list is the **worst case** for bubble sort. Here we count its comparisons as the list grows. Doubling n roughly **quadruples** the work.' },
          {
            t: 'code', title: 'Bubble sort comparisons', code: C`
            def bubble_comparisons(n):
                data = list(range(n, 0, -1))
                comparisons = 0
                for p in range(n - 1):
                    for i in range(n - 1 - p):
                        comparisons = comparisons + 1
                        if data[i] > data[i + 1]:
                            data[i], data[i + 1] = data[i + 1], data[i]
                return comparisons

            for n in [5, 10, 20, 40, 80]:
                print(n, bubble_comparisons(n))
          ` },
          {
            t: 'table', head: ['n', 'Bubble sort (worst)', 'Merge sort (about n x log n)'], rows: [
              ['8', '28', '24'],
              ['16', '120', '64'],
              ['1000', '499 500', 'about 10 000'],
              ['1 000 000', 'about 500 000 000 000', 'about 20 000 000'],
            ]
          },
          { t: 'note', kind: 'key', html: 'Search: binary is far quicker than linear **but only on sorted data**. Sort: merge sort is far quicker than bubble sort on large lists, but bubble sort is simple, uses no extra memory, and with the early-stop flag is fast on nearly sorted data.' },

          { t: 'h', text: 'Which algorithm should I use?' },
          {
            t: 'sort', prompt: 'Choose the best algorithm for each situation.', cats: ['Linear search', 'Binary search', 'Bubble sort', 'Merge sort'], items: [
              { text: 'Find a name in 50 unsorted names, once', cat: 0 },
              { text: 'Look up a word in a sorted list of 200 000 words', cat: 1 },
              { text: 'Sort 8 numbers, with a tiny simple program', cat: 2 },
              { text: 'Sort a million records quickly', cat: 3 },
              { text: 'Check if a value is in a list of 5 items that changes constantly', cat: 0 },
              { text: 'Find an ID number in a large database sorted by ID', cat: 1 },
            ], why: 'Small or unsorted: linear / bubble. Large and sorted (or sortable): binary / merge.'
          },

          { t: 'p', html: 'Sorting once and then searching many times can pay off. If you will search a list thousands of times, sort it first and use binary search.' },
          {
            t: 'code', title: 'Sort once, search many times', code: C`
            import random
            random.seed(3)
            data = [random.randint(1, 100000) for _ in range(2000)]
            targets = [random.randint(1, 100000) for _ in range(200)]

            linear_total = 0
            for t in targets:
                for item in data:
                    linear_total = linear_total + 1
                    if item == t:
                        break

            data.sort()
            binary_total = 0
            for t in targets:
                low = 0
                high = len(data) - 1
                while low <= high:
                    mid = (low + high) // 2
                    binary_total = binary_total + 1
                    if data[mid] == t:
                        break
                    elif data[mid] < t:
                        low = mid + 1
                    else:
                        high = mid - 1

            print("Linear comparisons:", linear_total)
            print("Binary comparisons:", binary_total)
          ` },
          { t: 'note', kind: 'exam', html: 'Typical exam answers: <em>binary search is faster because it halves the search area each time, but the data must be sorted first</em>; <em>linear search is simpler and works on unsorted data</em>; <em>merge sort is quicker on large data sets but uses more memory</em>. Use the words "compare", "halve", "swap", "sorted", "fewer steps".' },
          { t: 'note', kind: 'warn', html: 'Do not say "binary search is always better". For a short unsorted list, a linear search is the right tool, because sorting first costs more than it saves.' },

          {
            t: 'predict', code: C`
            n = 8
            steps = 0
            while n > 1:
                n = n // 2
                steps = steps + 1
            print(steps)
          `, rows: 1, why: '8 -> 4 -> 2 -> 1 takes 3 halvings.'
          },
          {
            t: 'predict', code: C`
            n = 5
            total = 0
            for p in range(n - 1):
                total = total + (n - 1 - p)
            print(total)
          `, rows: 1, why: '4 + 3 + 2 + 1 = 10 comparisons for five items.'
          },
          { t: 'quiz', q: 'A list of 1 000 000 items is sorted. Roughly how many comparisons might a binary search need in the worst case?', options: ['20', '1000', '500 000', '1 000 000'], answer: 0, why: '2 to the power 20 is just over a million.' },
          { t: 'quiz', q: 'Which of these are advantages of **merge sort** over bubble sort? (tick all that apply)', options: ['Much quicker for large lists', 'Uses less memory', 'Fewer comparisons in general', 'Simpler to write'], answer: [0, 2], why: 'Merge sort is faster on large data but uses extra memory and is more complicated.' },

          {
            t: 'exercise', id: 'm11-ex-maxmin', title: 'Largest and smallest without max()', level: 1,
            prompt: 'Write <code>range_of(data)</code> returning the largest minus the smallest value in a non-empty list. Do not use <code>max</code>, <code>min</code> or <code>sort</code>.',
            starter: C`
              def range_of(data):
                  pass
            `,
            solution: C`
              def range_of(data):
                  largest = data[0]
                  smallest = data[0]
                  for item in data:
                      if item > largest:
                          largest = item
                      if item < smallest:
                          smallest = item
                  return largest - smallest
            `,
            tests: [
              { py: 'assert range_of([4, 9, 2, 7]) == 7' },
              { py: 'assert range_of([5]) == 0' },
              { py: 'assert range_of([-3, -9, -1]) == 8', hidden: true },
            ],
            requires: [{ re: '\\bmax\\(|\\bmin\\(|sort', not: true, msg: 'Do it with a loop, not max/min/sort.' }],
            hints: ['Start both variables at `data[0]`.']
          },
          {
            t: 'exercise', id: 'm11-ex-count-compare', title: 'Count the comparisons', level: 2,
            prompt: 'Write <code>linear_comparisons(data, target)</code> that returns how many comparisons a linear search makes (it stops at the first match; a missing target costs <code>len(data)</code>).',
            starter: C`
              def linear_comparisons(data, target):
                  pass
            `,
            solution: C`
              def linear_comparisons(data, target):
                  count = 0
                  for item in data:
                      count = count + 1
                      if item == target:
                          return count
                  return count
            `,
            tests: [
              { py: 'assert linear_comparisons([5, 6, 7], 5) == 1' },
              { py: 'assert linear_comparisons([5, 6, 7], 7) == 3' },
              { py: 'assert linear_comparisons([5, 6, 7], 9) == 3' },
              { py: 'assert linear_comparisons([], 1) == 0', hidden: true },
            ],
            hints: ['Increase the counter before comparing.']
          },
          {
            t: 'exercise', id: 'm11-ex-compare-report', title: 'Report: which is quicker?', level: 3, kind: 'exam',
            prompt: 'Read a list size <code>n</code>. A sorted list holds the numbers 1 to n and the target is the last item, n. Print <code>Linear: A</code> and <code>Binary: B</code> where A and B are the numbers of comparisons each search makes (linear stops at the match; binary counts each middle check).',
            starter: C`
              n = int(input("List size: "))
              data = list(range(1, n + 1))
              target = n
              # count the comparisons for each search and print
            `,
            solution: C`
              n = int(input("List size: "))
              data = list(range(1, n + 1))
              target = n

              linear = 0
              for item in data:
                  linear = linear + 1
                  if item == target:
                      break

              binary = 0
              low = 0
              high = len(data) - 1
              while low <= high:
                  mid = (low + high) // 2
                  binary = binary + 1
                  if data[mid] == target:
                      break
                  elif data[mid] < target:
                      low = mid + 1
                  else:
                      high = mid - 1

              print("Linear:", linear)
              print("Binary:", binary)
            `,
            tests: [
              { in: ['8'], out: 'Linear: 8\nBinary: 4' },
              { in: ['1'], out: 'Linear: 1\nBinary: 1' },
              { in: ['1000'], out: 'Linear: 1000\nBinary: 10', hidden: true },
              { in: ['100'], out: 'Linear: 100\nBinary: 7', hidden: true },
            ],
            hints: ['Do the linear count first, then the binary count with its own counter.', 'Remember a binary search stops when it finds the target.']
          },
          {
            t: 'exercise', id: 'm11-ex-debug-efficiency', title: 'Two errors counting a sort', level: 2, kind: 'debug',
            prompt: 'This should print the number of <strong>swaps</strong> a bubble sort makes on the list. There are <strong>two</strong> errors.',
            starter: C`
              data = [4, 1, 3, 2]
              swaps = 0
              for p in range(len(data) - 1):
                  for i in range(len(data) - 1):
                      if data[i] > data[i + 1]:
                          data[i], data[i + 1] = data[i + 1], data[i]
                  swaps = swaps + 1
              print("Swaps:", swap)
            `,
            solution: C`
              data = [4, 1, 3, 2]
              swaps = 0
              for p in range(len(data) - 1):
                  for i in range(len(data) - 1):
                      if data[i] > data[i + 1]:
                          data[i], data[i + 1] = data[i + 1], data[i]
                          swaps = swaps + 1
              print("Swaps:", swaps)
            `,
            tests: [{ out: 'Swaps: 4' }],
            hints: ['The counter is at the wrong indent level.', 'The variable name in print is misspelt.']
          },
        ],
      },
    ],
  });
})();

(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm06',
    title: '2D lists and records',
    blurb: 'Tables of data: lists inside lists, nested loops over grids, classic grid algorithms and records.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'two-d-basics',
        title: '2D lists: rows and columns',
        time: '30 min',
        book: 'Ch 2 · p.69',
        exam: 'Paper 2 Q3',
        summary: 'Nested lists, grid[row][col], dimensions, changing cells, building grids',
        intro: 'A table has rows and columns. In Python a table is a list whose items are themselves lists. Edexcel calls it a two-dimensional array.',
        blocks: [
          { t: 'h', text: 'A list of lists' },
          { t: 'p', html: 'Each inner list is one **row**. The outer list holds the rows. To reach one value you need two numbers: the **row** index first, then the **column** index.' },
          { t: 'html', html: '<p><code>grid = [[5, 8, 2], [7, 1, 9]]</code></p><div class="cells"><div class="c"><b>5</b><i>[0][0]</i></div><div class="c"><b>8</b><i>[0][1]</i></div><div class="c"><b>2</b><i>[0][2]</i></div></div><div class="cells"><div class="c"><b>7</b><i>[1][0]</i></div><div class="c"><b>1</b><i>[1][1]</i></div><div class="c"><b>9</b><i>[1][2]</i></div></div>' },
          { t: 'note', kind: 'key', html: 'Say it as **row, then column**: `grid[row][col]`. The grid above has 2 rows and 3 columns, so `len(grid)` is 2 and `len(grid[0])` is 3.' },
          {
            t: 'cases', title: 'Reading a 2D list', items: [
              {
                label: 'One value', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              print(grid[0][0])
              print(grid[0][2])
              print(grid[1][1])
              print(grid[-1][-1])
            ` },
              {
                label: 'A whole row', intro: 'One index gives a whole row, which is an ordinary list.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              print(grid[1])
              print(len(grid[1]))
              print(grid[1][0:2])
            ` },
              {
                label: 'Dimensions', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              rows = len(grid)
              cols = len(grid[0])
              print(rows, "rows and", cols, "columns")
              print(rows * cols, "cells")
            ` },
              {
                label: 'A column', intro: 'There is no single index for a column. Collect it with a loop or a list.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              column = [grid[0][1], grid[1][1]]
              print(column)
            ` },
              {
                label: 'Words in a grid', code: C`
              plan = [["Ann", "Ben"], ["Cal", "Dee"], ["Eli", "Fay"]]
              print(plan[2][0])
              print(plan[1][1].upper())
              print(len(plan), len(plan[0]))
            ` },
              {
                label: 'Row out of range', expectError: true, code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              print(grid[2][0])
            ` },
              {
                label: 'Column out of range', expectError: true, code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              print(grid[0][3])
            ` },
              {
                label: 'Swapped indexes', expectError: true, intro: 'Writing column then row asks for row 2 of a two-row grid.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              print(grid[0][2])
              print(grid[2][0])
            ` },
            ]
          },

          { t: 'h', text: 'Changing, adding and removing' },
          {
            t: 'cases', title: 'Updating a grid', items: [
              {
                label: 'Change a cell', code: C`
              board = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]
              board[1][1] = "X"
              board[0][2] = "O"
              print(board)
            ` },
              {
                label: 'Append a row', code: C`
              grid = [[1, 2], [3, 4]]
              grid.append([5, 6])
              print(grid)
              print(len(grid))
            ` },
              {
                label: 'Remove a row', code: C`
              grid = [[1, 2], [3, 4], [5, 6]]
              grid.pop(1)
              print(grid)
              del grid[0]
              print(grid)
            ` },
              {
                label: 'Add to one row', code: C`
              grid = [[1, 2], [3, 4]]
              grid[0].append(99)
              print(grid)
            ` },
              {
                label: 'Rows can be different lengths', code: C`
              jagged = [[1], [2, 3], [4, 5, 6]]
              print(len(jagged[0]), len(jagged[2]))
            ` },
            ]
          },

          { t: 'h', text: 'Building a grid, and the shared-row trap' },
          {
            t: 'cases', title: 'Making an empty grid', items: [
              {
                label: 'Correct', intro: 'The loop builds a **new** row each time.', code: C`
              grid = [[0] * 3 for _ in range(2)]
              grid[0][0] = 5
              print(grid)
            ` },
              {
                label: 'With plain loops', code: C`
              grid = []
              for r in range(2):
                  row = []
                  for c in range(3):
                      row.append(0)
                  grid.append(row)
              grid[0][0] = 5
              print(grid)
            ` },
              {
                label: 'The trap', intro: '`[[0] * 3] * 2` repeats the **same** row twice, so changing one changes both.', code: C`
              grid = [[0] * 3] * 2
              grid[0][0] = 5
              print(grid)
              print(grid[0] is grid[1])
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Never build a grid with `[[0] * cols] * rows`. Use `[[0] * cols for _ in range(rows)]` or two loops. This is the same aliasing problem as `b = a`.' },

          { t: 'h', text: 'Showing a row neatly' },
          {
            t: 'cases', title: 'Printing', items: [
              {
                label: 'Raw', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              print(grid)
            ` },
              {
                label: 'One row per line', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              print(grid[0])
              print(grid[1])
            ` },
              {
                label: 'join needs strings', code: C`
              row = [5, 8, 2]
              print(" ".join(["a", "b", "c"]))
              print(" ".join(str(x) for x in row))
            ` },
              {
                label: 'join with numbers', expectError: true, code: C`
              print(" ".join([5, 8, 2]))
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel pseudocode writes a 2D array as <code>SET grid TO [[5, 8, 2], [7, 1, 9]]</code> and reads a cell as <code>grid[1][2]</code>. Rows come first. Exam questions often give you the array and ask "what is the value of <code>grid[2][1]</code>?". Count from 0.' },

          { t: 'viz', kind: 'grid' },

          {
            t: 'predict', title: 'Read the cells', code: C`
            t = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
            print(t[0][2], t[2][0], t[1][1])
            print(t[-1])
            print(len(t), len(t[0]))
          `, rows: 3, why: 'Row 0 column 2 is 3; row 2 column 0 is 7; the centre is 5. The last row is [7, 8, 9]. It is a 3 by 3 grid.'
          },
          {
            t: 'predict', title: 'Shared rows', code: C`
            a = [[0, 0]] * 2
            a[0][1] = 7
            print(a)
            b = [[0, 0] for _ in range(2)]
            b[0][1] = 7
            print(b)
          `, rows: 2, why: 'In `a` both rows are the same list so both show the change. In `b` each row is separate.'
          },
          { t: 'quiz', q: 'A grid has 4 rows and 6 columns. What is <code>len(grid[0])</code>?', options: ['4', '6', '24', '10'], answer: 1, why: '`grid[0]` is the first row, and its length is the number of columns.' },
          { t: 'quiz', q: 'In <code>grid[r][c]</code>, what does <code>r</code> stand for?', options: ['The column', 'The row', 'The total', 'The value'], answer: 1, why: 'The first index chooses the row; the second chooses the column.' },

          {
            t: 'exercise', id: 'm06-ex-seat', title: 'Whose seat?', level: 1,
            prompt: 'The seating plan <code>plan = [["Ann", "Ben", "Cal"], ["Dee", "Eli", "Fay"]]</code> is given. Ask for a row number and a seat number (both start at 0) and print the name in that seat.',
            starter: C`
              plan = [["Ann", "Ben", "Cal"], ["Dee", "Eli", "Fay"]]
            `,
            solution: C`
              plan = [["Ann", "Ben", "Cal"], ["Dee", "Eli", "Fay"]]
              row = int(input("Row: "))
              seat = int(input("Seat: "))
              print(plan[row][seat])
            `,
            tests: [{ in: ['0', '0'], out: 'Ann' }, { in: ['1', '2'], out: 'Fay' }, { in: ['1', '1'], out: 'Eli', hidden: true }],
            hints: ['Convert both inputs with `int()`.', 'Use `plan[row][seat]`.']
          },
          {
            t: 'exercise', id: 'm06-ex-zerogrid', title: 'Grid of zeros', level: 1,
            prompt: 'Ask for a number of rows and a number of columns. Build a grid of zeros that size using <code>[[0] * cols for _ in range(rows)]</code> and print the grid, then print its dimensions as <code>R x C</code>.',
            starter: C`
              rows = int(input("Rows: "))
              cols = int(input("Columns: "))
            `,
            solution: C`
              rows = int(input("Rows: "))
              cols = int(input("Columns: "))
              grid = [[0] * cols for _ in range(rows)]
              print(grid)
              print(len(grid), "x", len(grid[0]))
            `,
            tests: [{ in: ['2', '3'], out: '[[0, 0, 0], [0, 0, 0]]\n2 x 3' }, { in: ['1', '1'], out: '[[0]]\n1 x 1' }, { in: ['3', '2'], out: '[[0, 0], [0, 0], [0, 0]]\n3 x 2', hidden: true }],
            hints: ['`len(grid)` is the rows and `len(grid[0])` is the columns.']
          },
          {
            t: 'exercise', id: 'm06-ex-noughts', title: 'Place a mark', level: 2,
            prompt: 'A noughts and crosses board is <code>board = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]</code>. Ask for a row and a column (0 to 2). Put an <code>X</code> in that cell, then print the board as three lines, each with the cells separated by spaces.',
            starter: C`
              board = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]
            `,
            solution: C`
              board = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]
              row = int(input("Row: "))
              col = int(input("Column: "))
              board[row][col] = "X"
              for line in board:
                  print(" ".join(line))
            `,
            tests: [{ in: ['1', '1'], out: '- - -\n- X -\n- - -' }, { in: ['0', '2'], out: '- - X\n- - -\n- - -' }, { in: ['2', '0'], out: '- - -\n- - -\nX - -', hidden: true }],
            hints: ['Assign with `board[row][col] = "X"`.', '`" ".join(line)` turns a row of strings into one string.']
          },
          {
            t: 'exercise', id: 'm06-ex-addrow', title: 'Add a row', level: 2,
            prompt: 'The grid <code>grid = [[1, 2, 3], [4, 5, 6]]</code> is given. Ask for three whole numbers, add them to the grid as a new row, then print the number of rows and the last row.',
            starter: C`
              grid = [[1, 2, 3], [4, 5, 6]]
            `,
            solution: C`
              grid = [[1, 2, 3], [4, 5, 6]]
              a = int(input("Number 1: "))
              b = int(input("Number 2: "))
              c = int(input("Number 3: "))
              grid.append([a, b, c])
              print(len(grid))
              print(grid[-1])
            `,
            tests: [{ in: ['7', '8', '9'], out: '3\n[7, 8, 9]' }, { in: ['0', '0', '0'], out: '3\n[0, 0, 0]' }, { in: ['-1', '5', '2'], out: '3\n[-1, 5, 2]', hidden: true }],
            hints: ['`grid.append([a, b, c])` adds the list as one new row.']
          },
          {
            t: 'exercise', id: 'm06-ex-shared', kind: 'debug', title: 'Rows that change together', level: 2,
            prompt: 'This program should make a 3 by 3 grid of zeros, change only the centre cell to 5 and print the grid. Instead several rows change. Fix the one error.',
            starter: C`
              grid = [[0] * 3] * 3
              grid[1][1] = 5
              print(grid)
            `,
            solution: C`
              grid = [[0] * 3 for _ in range(3)]
              grid[1][1] = 5
              print(grid)
            `,
            tests: [{ out: '[[0, 0, 0], [0, 5, 0], [0, 0, 0]]' }],
            hints: ['The three rows are one list shown three times.', 'Build each row separately with `for _ in range(3)`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'two-d-loops',
        title: 'Looping over grids',
        time: '35 min',
        book: 'Ch 2 · p.69',
        exam: 'Paper 2 Q3',
        summary: 'Nested loops by row and index, neat output, row, column and grand totals',
        intro: 'To visit every cell of a grid you use a loop inside a loop. The outer loop picks a row; the inner loop walks along it.',
        blocks: [
          { t: 'h', text: 'Nested loops over a grid' },
          {
            t: 'cases', title: 'Two ways to visit every cell', items: [
              {
                label: 'By value', intro: 'The outer loop gives a row (a list); the inner loop gives each value in it.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for row in grid:
                  for value in row:
                      print(value)
            ` },
              {
                label: 'By index', intro: 'Use indexes when you need to know the position. Press Trace and watch `r` and `c`.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for r in range(len(grid)):
                  for c in range(len(grid[r])):
                      print("row", r, "col", c, "is", grid[r][c])
            ` },
              {
                label: 'Rows only', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for r in range(len(grid)):
                  print("Row", r, ":", grid[r])
            ` },
              {
                label: 'Columns first', intro: 'Swap the loops to walk down each column.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for c in range(len(grid[0])):
                  for r in range(len(grid)):
                      print(grid[r][c], end=" ")
                  print()
            ` },
              {
                label: 'Wrong bound', expectError: true, intro: 'Using `len(grid)` (rows) for the columns goes out of range when there are more columns than rows.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for r in range(len(grid)):
                  for c in range(len(grid)):
                      print(grid[r][c])
              print(grid[0][len(grid)])
              print(grid[1][len(grid) + 1])
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Edexcel: <code>FOR r FROM 0 TO ROWS - 1 DO</code> with an inner <code>FOR c FROM 0 TO COLS - 1 DO</code>. In Python: <code>for r in range(len(grid)):</code> and <code>for c in range(len(grid[0])):</code>. Nested loops run the inner loop completely for each outer pass.' },

          { t: 'h', text: 'Printing a grid neatly' },
          {
            t: 'cases', title: 'Output styles', items: [
              {
                label: 'end=" "', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for row in grid:
                  for value in row:
                      print(value, end=" ")
                  print()
            ` },
              {
                label: 'join', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for row in grid:
                  print(" ".join(str(v) for v in row))
            ` },
              {
                label: 'Aligned columns', code: C`
              grid = [[5, 8, 200], [7, 10, 9]]
              for row in grid:
                  for value in row:
                      print(f"{value:>4}", end="")
                  print()
            ` },
              {
                label: 'With labels', code: C`
              days = ["Mon", "Tue"]
              grid = [[3, 5], [4, 6]]
              for r in range(len(grid)):
                  print(days[r], grid[r][0], grid[r][1])
            ` },
              {
                label: 'Forgot print()', intro: 'Without the empty `print()` everything lands on one line.', code: C`
              grid = [[1, 2], [3, 4]]
              for row in grid:
                  for v in row:
                      print(v, end=" ")
              print()
            ` },
            ]
          },

          { t: 'h', text: 'Totals' },
          {
            t: 'cases', title: 'Row, column and grand totals', items: [
              {
                label: 'Row totals', intro: 'Reset the total at the start of each row.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for r in range(len(grid)):
                  total = 0
                  for c in range(len(grid[r])):
                      total += grid[r][c]
                  print("Row", r, "total", total)
            ` },
              {
                label: 'Row totals (sum)', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for row in grid:
                  print(sum(row))
            ` },
              {
                label: 'Column totals', intro: 'The outer loop is the column; the total is reset for each column.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              for c in range(len(grid[0])):
                  total = 0
                  for r in range(len(grid)):
                      total += grid[r][c]
                  print("Column", c, "total", total)
            ` },
              {
                label: 'Grand total', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              total = 0
              for row in grid:
                  for v in row:
                      total += v
              print(total)
            ` },
              {
                label: 'Reset in the wrong place', intro: 'Setting `total = 0` before the outer loop makes it a running total across rows, not row totals.', code: C`
              grid = [[5, 8, 2], [7, 1, 9]]
              total = 0
              for row in grid:
                  for v in row:
                      total += v
                  print(total)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Where you write `total = 0` decides what you are counting. **Inside** the outer loop (before the inner) = one total per row. **Before** both loops = one grand total.' },

          { t: 'h', text: 'Filling a grid with a loop' },
          {
            t: 'cases', title: 'Generated tables', items: [
              {
                label: 'Multiplication table', code: C`
              table = []
              for r in range(1, 4):
                  row = []
                  for c in range(1, 5):
                      row.append(r * c)
                  table.append(row)
              for row in table:
                  print(row)
            ` },
              {
                label: 'Read from input', stdin: ['2', '3', '1', '2', '3', '4', '5', '6'], code: C`
              rows = int(input("Rows: "))
              cols = int(input("Columns: "))
              grid = []
              for r in range(rows):
                  row = []
                  for c in range(cols):
                      row.append(int(input("Value: ")))
                  grid.append(row)
              print(grid)
            ` },
              {
                label: 'Chessboard pattern', code: C`
              for r in range(4):
                  line = ""
                  for c in range(4):
                      if (r + c) % 2 == 0:
                          line += "#"
                      else:
                          line += "."
                  print(line)
            ` },
            ]
          },

          {
            t: 'predict', title: 'Row totals', code: C`
            g = [[1, 2], [3, 4], [5, 6]]
            for row in g:
                t = 0
                for v in row:
                    t += v
                print(t)
          `, rows: 3, why: 'Each row is totalled separately: 3, 7 and 11.'
          },
          {
            t: 'predict', title: 'Column order', code: C`
            g = [[1, 2, 3], [4, 5, 6]]
            for c in range(3):
                for r in range(2):
                    print(g[r][c], end=",")
          `, rows: 1, why: 'Going down each column in turn gives 1,4,2,5,3,6, with a comma after each.'
          },
          { t: 'quiz', q: 'To total each <strong>column</strong> of a grid, which loop should be the outer one?', options: ['The loop over rows', 'The loop over columns', 'Either, it makes no difference', 'Neither, you cannot'], answer: 1, why: 'Fix a column, then add down through all the rows, then move to the next column.' },
          {
            t: 'parsons', title: 'Grand total', prompt: 'Order the lines that add up every number in <code>grid</code>.', lines: [
              'grid = [[1, 2], [3, 4]]',
              'total = 0',
              'for row in grid:',
              '    for value in row:',
              '        total += value',
              'print(total)',
            ], why: 'The total starts once, before both loops, and is printed once afterwards.'
          },

          {
            t: 'exercise', id: 'm06-ex-printgrid', title: 'Print the grid', level: 1,
            prompt: 'The grid <code>grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]</code> is given. Print it as three lines with the numbers separated by single spaces.',
            starter: C`
              grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
            `,
            solution: C`
              grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
              for row in grid:
                  for value in row:
                      print(value, end=" ")
                  print()
            `,
            tests: [{ out: '1 2 3\n4 5 6\n7 8 9' }],
            requires: [{ re: '\\bfor\\b[\\s\\S]*\\bfor\\b', msg: 'Use a loop inside a loop.' }],
            hints: ['The inner loop prints values with `end=" "`.', 'After each row, call `print()` to start a new line.']
          },
          {
            t: 'exercise', id: 'm06-ex-rowtotals', title: 'Row totals', level: 2,
            prompt: 'The sales grid <code>sales = [[4, 6, 5], [7, 2, 3], [8, 8, 1]]</code> shows three shops over three days. Print <code>Shop N: T</code> for each row, where N starts at 1 and T is the row total.',
            starter: C`
              sales = [[4, 6, 5], [7, 2, 3], [8, 8, 1]]
            `,
            solution: C`
              sales = [[4, 6, 5], [7, 2, 3], [8, 8, 1]]
              for r in range(len(sales)):
                  total = 0
                  for c in range(len(sales[r])):
                      total += sales[r][c]
                  print("Shop " + str(r + 1) + ": " + str(total))
            `,
            tests: [{ out: 'Shop 1: 15\nShop 2: 12\nShop 3: 17' }],
            requires: [{ re: '\\bfor\\b[\\s\\S]*\\bfor\\b', msg: 'Use a loop inside a loop.' }],
            hints: ['Reset `total = 0` at the start of each row.', 'The shop number is `r + 1`.']
          },
          {
            t: 'exercise', id: 'm06-ex-coltotals', title: 'Column totals', level: 2,
            prompt: 'Use the same grid <code>sales = [[4, 6, 5], [7, 2, 3], [8, 8, 1]]</code>. Print <code>Day N: T</code> for each **column**, where N starts at 1 and T is the total sold that day.',
            starter: C`
              sales = [[4, 6, 5], [7, 2, 3], [8, 8, 1]]
            `,
            solution: C`
              sales = [[4, 6, 5], [7, 2, 3], [8, 8, 1]]
              for c in range(len(sales[0])):
                  total = 0
                  for r in range(len(sales)):
                      total += sales[r][c]
                  print("Day " + str(c + 1) + ": " + str(total))
            `,
            tests: [{ out: 'Day 1: 19\nDay 2: 16\nDay 3: 9' }],
            requires: [{ re: '\\bfor\\b[\\s\\S]*\\bfor\\b', msg: 'Use a loop inside a loop.' }],
            hints: ['Make the column the outer loop.', 'Inside, add `sales[r][c]` for every row `r`.']
          },
          {
            t: 'exercise', id: 'm06-ex-multtable', title: 'Times table grid', level: 2,
            prompt: 'Ask for a number <code>n</code>. Print an n by n multiplication table (from 1 times 1 up to n times n). Each row is one line with the numbers separated by single spaces.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              for r in range(1, n + 1):
                  for c in range(1, n + 1):
                      print(r * c, end=" ")
                  print()
            `,
            tests: [{ in: ['3'], out: '1 2 3\n2 4 6\n3 6 9' }, { in: ['1'], out: '1' }, { in: ['4'], out: '1 2 3 4\n2 4 6 8\n3 6 9 12\n4 8 12 16', hidden: true }],
            hints: ['Both loops use `range(1, n + 1)`.', 'The value in each cell is row times column.']
          },
          {
            t: 'exercise', id: 'm06-ex-readgrid', kind: 'exam', title: 'Class test results', level: 3,
            prompt: 'A teacher records 3 test marks for each of 3 students: <code>names = ["Asha", "Ben", "Chloe"]</code>. Using nested loops, read the three marks for each student (whole numbers) into a grid with one row per student. Then print <code>NAME: TOTAL</code> for each student, and finally <code>Top: NAME</code> for the student with the highest total (the first one if there is a tie).',
            starter: C`
              names = ["Asha", "Ben", "Chloe"]
              grid = []
            `,
            solution: C`
              names = ["Asha", "Ben", "Chloe"]
              grid = []
              for r in range(len(names)):
                  row = []
                  for t in range(3):
                      row.append(int(input("Mark: ")))
                  grid.append(row)
              best = 0
              best_total = -1
              for r in range(len(names)):
                  total = sum(grid[r])
                  print(names[r] + ": " + str(total))
                  if total > best_total:
                      best_total = total
                      best = r
              print("Top: " + names[best])
            `,
            tests: [{ in: ['10', '10', '10', '5', '5', '5', '20', '1', '1'], out: 'Asha: 30\nBen: 15\nChloe: 22\nTop: Asha' }, { in: ['1', '1', '1', '9', '9', '9', '0', '0', '0'], out: 'Asha: 3\nBen: 27\nChloe: 0\nTop: Ben' }, { in: ['5', '5', '5', '5', '5', '5', '5', '5', '5'], out: 'Asha: 15\nBen: 15\nChloe: 15\nTop: Asha', hidden: true }],
            requires: [{ re: '\\bfor\\b[\\s\\S]*\\bfor\\b', msg: 'Use a loop inside a loop to read the marks.' }],
            hints: ['The outer loop is over students, the inner loop over the 3 tests.', 'Track the best total and the row it came from.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'two-d-algorithms',
        title: '2D algorithms',
        time: '40 min',
        book: 'Ch 2 · p.69',
        exam: 'Paper 2 Q3-Q4',
        summary: 'Max/min with position, search, diagonals, transposing, counting',
        intro: 'The recipes from 1D lists carry over to grids. The only new idea is that every position now has two numbers: a row and a column.',
        blocks: [
          { t: 'h', text: 'Largest and smallest, with the position' },
          {
            t: 'cases', title: 'Max and min in a grid', items: [
              {
                label: 'Largest value', code: C`
              grid = [[5, 8, 2], [7, 11, 9], [3, 4, 6]]
              biggest = grid[0][0]
              for row in grid:
                  for v in row:
                      if v > biggest:
                          biggest = v
              print(biggest)
            ` },
              {
                label: 'Largest with its row and column', code: C`
              grid = [[5, 8, 2], [7, 11, 9], [3, 4, 6]]
              best_r = 0
              best_c = 0
              for r in range(len(grid)):
                  for c in range(len(grid[r])):
                      if grid[r][c] > grid[best_r][best_c]:
                          best_r = r
                          best_c = c
              print("Max", grid[best_r][best_c], "at row", best_r, "col", best_c)
            ` },
              {
                label: 'Smallest', code: C`
              grid = [[5, 8, 2], [7, 11, 9], [3, 4, 6]]
              smallest = grid[0][0]
              for row in grid:
                  for v in row:
                      if v < smallest:
                          smallest = v
              print(smallest)
            ` },
              {
                label: 'Row with the biggest total', code: C`
              grid = [[5, 8, 2], [7, 11, 9], [3, 4, 6]]
              best = 0
              for r in range(len(grid)):
                  if sum(grid[r]) > sum(grid[best]):
                      best = r
              print("Row", best, "has total", sum(grid[best]))
            ` },
            ]
          },

          { t: 'h', text: 'Searching a grid' },
          {
            t: 'cases', title: 'Find a value', items: [
              {
                label: 'Is it there?', code: C`
              grid = [[5, 8, 2], [7, 11, 9]]
              found = False
              for row in grid:
                  for v in row:
                      if v == 9:
                          found = True
              print(found)
            ` },
              {
                label: 'Where is it?', code: C`
              plan = [["Ann", "Ben"], ["Cal", "Dee"]]
              target = "Cal"
              found = False
              for r in range(len(plan)):
                  for c in range(len(plan[r])):
                      if plan[r][c] == target:
                          print("Row", r, "seat", c)
                          found = True
              if not found:
                  print("Not found")
            ` },
              {
                label: 'Using a function-style stop', intro: 'To stop both loops at the first match, a flag in the outer loop is the simplest approach in this module.', code: C`
              grid = [[1, 2], [3, 2]]
              pos = None
              for r in range(len(grid)):
                  for c in range(len(grid[r])):
                      if grid[r][c] == 2 and pos is None:
                          pos = (r, c)
              print(pos)
            ` },
              {
                label: 'Count matches', code: C`
              board = [["X", "O", "X"], ["O", "X", "-"], ["-", "-", "X"]]
              count = 0
              for row in board:
                  for cell in row:
                      if cell == "X":
                          count += 1
              print(count)
              print(board[0].count("X"))
            ` },
              {
                label: 'break only leaves one loop', intro: '`break` leaves the inner loop only, so the outer loop carries on.', code: C`
              grid = [[1, 2], [2, 2]]
              for r in range(2):
                  for c in range(2):
                      if grid[r][c] == 2:
                          print("found at", r, c)
                          break
            ` },
            ]
          },

          { t: 'h', text: 'Diagonals and transposing' },
          {
            t: 'cases', title: 'Special cells', items: [
              {
                label: 'Main diagonal', intro: 'Top left to bottom right: the row and column numbers are equal.', code: C`
              grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
              total = 0
              for i in range(len(grid)):
                  total += grid[i][i]
              print(total)
            ` },
              {
                label: 'Other diagonal', intro: 'Top right to bottom left: the column is `size - 1 - row`.', code: C`
              grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
              n = len(grid)
              total = 0
              for i in range(n):
                  total += grid[i][n - 1 - i]
              print(total)
            ` },
              {
                label: 'Edges', code: C`
              grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
              print(grid[0])
              print(grid[-1])
              print([row[0] for row in grid])
              print([row[-1] for row in grid])
            ` },
              {
                label: 'Transpose', intro: 'Swapping rows and columns: the cell at `[r][c]` moves to `[c][r]`.', code: C`
              grid = [[1, 2, 3], [4, 5, 6]]
              result = []
              for c in range(len(grid[0])):
                  new_row = []
                  for r in range(len(grid)):
                      new_row.append(grid[r][c])
                  result.append(new_row)
              print(result)
            ` },
              {
                label: 'Total of one column', code: C`
              grid = [[1, 2, 3], [4, 5, 6]]
              col = 1
              total = 0
              for row in grid:
                  total += row[col]
              print(total)
            ` },
            ]
          },
          { t: 'note', kind: 'tip', html: 'For any grid task, draw a small grid on paper, write the row and column numbers around it, and trace by hand first. Then press **Trace** to compare.' },

          {
            t: 'predict', title: 'Diagonals', code: C`
            g = [[1, 0, 2], [0, 5, 0], [3, 0, 9]]
            a = 0
            b = 0
            for i in range(3):
                a += g[i][i]
                b += g[i][2 - i]
            print(a, b)
          `, rows: 1, why: 'The main diagonal is 1 + 5 + 9 = 15. The other diagonal is 2 + 5 + 3 = 10.'
          },
          {
            t: 'predict', title: 'Where is the maximum?', code: C`
            g = [[3, 9], [9, 1]]
            br = 0
            bc = 0
            for r in range(2):
                for c in range(2):
                    if g[r][c] > g[br][bc]:
                        br = r
                        bc = c
            print(br, bc)
          `, rows: 1, why: 'The first 9 at row 0 column 1 is the first one found. The second 9 is not strictly larger.'
          },
          {
            t: 'sort', title: 'Which loop shape?', prompt: 'Which kind of loop does each task need?', cats: ['One loop (a single index)', 'Nested loops (every cell)'], items: [
              { text: 'Add up the main diagonal of a square grid', cat: 0 },
              { text: 'Find the largest value anywhere in the grid', cat: 1 },
              { text: 'Print the first column only', cat: 0 },
              { text: 'Count how many cells contain "X"', cat: 1 },
              { text: 'Print every row total', cat: 1 },
              { text: 'Sum the last row', cat: 0 },
            ], why: 'Tasks that need every cell use nested loops. Tasks that follow a line (diagonal, one row or one column) need only one.'
          },
          { t: 'quiz', q: 'For a 4 by 4 grid, which cells are on the main diagonal?', options: ['grid[r][c] where r + c = 4', 'grid[i][i] for i from 0 to 3', 'grid[0][i] for i from 0 to 3', 'grid[i][0] for i from 0 to 3'], answer: 1, why: 'On the main diagonal the row and column numbers are equal.' },

          {
            t: 'exercise', id: 'm06-ex-maxpos', title: 'Highest score and where', level: 2,
            prompt: 'The grid <code>scores = [[12, 18, 9], [20, 7, 20], [14, 3, 16]]</code> shows scores for 3 teams over 3 rounds. Print <code>Max X at row R column C</code>, where the position is the **first** occurrence of the largest value (counting from 0).',
            starter: C`
              scores = [[12, 18, 9], [20, 7, 20], [14, 3, 16]]
            `,
            solution: C`
              scores = [[12, 18, 9], [20, 7, 20], [14, 3, 16]]
              best_r = 0
              best_c = 0
              for r in range(len(scores)):
                  for c in range(len(scores[r])):
                      if scores[r][c] > scores[best_r][best_c]:
                          best_r = r
                          best_c = c
              print("Max", scores[best_r][best_c], "at row", best_r, "column", best_c)
            `,
            tests: [{ out: 'Max 20 at row 1 column 0' }],
            requires: [{ re: 'max\\s*\\(', not: true, msg: 'Do not use `max()`.' }],
            hints: ['Remember the row and column of the best value so far.', 'Use `>` not `>=` so the first one stays.']
          },
          {
            t: 'exercise', id: 'm06-ex-diagsum', title: 'Diagonal of a number square', level: 2,
            prompt: 'Ask for a size <code>n</code>. Build an n by n grid where the cell at row <code>r</code> and column <code>c</code> holds <code>r * n + c + 1</code> (so for n = 3 it is 1 2 3 / 4 5 6 / 7 8 9). Print the sum of the main diagonal.',
            starter: C`
              n = int(input("n: "))
            `,
            solution: C`
              n = int(input("n: "))
              grid = []
              for r in range(n):
                  row = []
                  for c in range(n):
                      row.append(r * n + c + 1)
                  grid.append(row)
              total = 0
              for i in range(n):
                  total += grid[i][i]
              print(total)
            `,
            tests: [{ in: ['3'], out: '15' }, { in: ['1'], out: '1' }, { in: ['4'], out: '34' }, { in: ['2'], out: '5', hidden: true }],
            hints: ['Build the grid with nested loops first.', 'The diagonal cells are `grid[i][i]`.']
          },
          {
            t: 'exercise', id: 'm06-ex-findname', title: 'Find the seat', level: 2,
            prompt: 'The seating plan <code>plan = [["Ann", "Ben", "Cal"], ["Dee", "Eli", "Fay"], ["Gus", "Hal", "Ivy"]]</code> is given. Ask for a name. Print <code>Row R, seat S</code> (counting from 0), or <code>Not found</code>.',
            starter: C`
              plan = [["Ann", "Ben", "Cal"], ["Dee", "Eli", "Fay"], ["Gus", "Hal", "Ivy"]]
              name = input("Name: ")
            `,
            solution: C`
              plan = [["Ann", "Ben", "Cal"], ["Dee", "Eli", "Fay"], ["Gus", "Hal", "Ivy"]]
              name = input("Name: ")
              found = False
              for r in range(len(plan)):
                  for c in range(len(plan[r])):
                      if plan[r][c] == name:
                          print("Row " + str(r) + ", seat " + str(c))
                          found = True
              if not found:
                  print("Not found")
            `,
            tests: [{ in: ['Ann'], out: 'Row 0, seat 0' }, { in: ['Fay'], out: 'Row 1, seat 2' }, { in: ['Zed'], out: 'Not found' }, { in: ['Hal'], out: 'Row 2, seat 1', hidden: true }],
            hints: ['Use index loops so you know `r` and `c`.', 'A flag tells you whether anything was found.']
          },
          {
            t: 'exercise', id: 'm06-ex-transpose', title: 'Transpose', level: 3,
            prompt: 'Ask for a number of rows and columns. Build a grid where the cell at row <code>r</code> column <code>c</code> is <code>r * cols + c + 1</code>. Print the **transposed** grid (rows and columns swapped) as a list of lists. For 2 rows and 3 columns that is <code>[[1, 4], [2, 5], [3, 6]]</code>.',
            starter: C`
              rows = int(input("Rows: "))
              cols = int(input("Columns: "))
            `,
            solution: C`
              rows = int(input("Rows: "))
              cols = int(input("Columns: "))
              grid = []
              for r in range(rows):
                  row = []
                  for c in range(cols):
                      row.append(r * cols + c + 1)
                  grid.append(row)
              result = []
              for c in range(cols):
                  new_row = []
                  for r in range(rows):
                      new_row.append(grid[r][c])
                  result.append(new_row)
              print(result)
            `,
            tests: [{ in: ['2', '3'], out: '[[1, 4], [2, 5], [3, 6]]' }, { in: ['1', '1'], out: '[[1]]' }, { in: ['3', '2'], out: '[[1, 3, 5], [2, 4, 6]]' }, { in: ['2', '2'], out: '[[1, 3], [2, 4]]', hidden: true }],
            hints: ['The new grid has `cols` rows and `rows` columns.', 'The new cell `[c][r]` takes the old value `grid[r][c]`.']
          },
          {
            t: 'exercise', id: 'm06-ex-debug-grid', kind: 'debug', title: 'Three errors in a grid average', level: 2,
            prompt: 'This program should print the average of every number in the grid, to 2 decimal places. It should print <code>Average: 5.67</code>. There are <strong>three</strong> errors. Find and fix them.',
            starter: C`
              grid = [[4, 8, 6], [2, 9, 5]]
              for r in range(len(grid))
                  total = 0
                  for c in range(len(grid)):
                      total += grid[r][c]
              print("Average:", round(total / (len(grid) * len(grid[0])), 2))
            `,
            solution: C`
              grid = [[4, 8, 6], [2, 9, 5]]
              total = 0
              for r in range(len(grid)):
                  for c in range(len(grid[0])):
                      total += grid[r][c]
              print("Average:", round(total / (len(grid) * len(grid[0])), 2))
            `,
            tests: [{ out: 'Average: 5.67' }],
            hints: ['A line is missing its colon.', 'The total must start at 0 once, before both loops.', 'The inner loop must go over the number of columns, `len(grid[0])`.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'records',
        title: 'Records and tables of data',
        time: '40 min',
        book: 'Ch 2 · p.67-69',
        exam: 'Paper 2 Q3-Q4',
        summary: 'Records as lists, parallel lists, searching, updating, dictionaries intro, sorting by a column',
        intro: 'A record groups the facts about one thing: a student has a name, an age and a score. A list of records is a table, and you already know how to use one.',
        blocks: [
          { t: 'h', text: 'Three ways to store records' },
          { t: 'p', html: 'A **record** is a group of related fields. Python has several ways to hold them. Each has strengths.' },
          {
            t: 'cases', title: 'Records in different shapes', items: [
              {
                label: 'Parallel lists', intro: 'One list per field; the same index is the same person.', code: C`
              names = ["Asha", "Ben", "Chloe"]
              ages = [15, 14, 15]
              scores = [62, 45, 80]
              print(names[1], ages[1], scores[1])
            ` },
              {
                label: 'List of lists', intro: 'One row per record; the column is the field.', code: C`
              students = [["Asha", 15, 62], ["Ben", 14, 45], ["Chloe", 15, 80]]
              print(students[1])
              print(students[1][0], students[1][2])
              print(len(students), "students")
            ` },
              {
                label: 'Named fields with constants', intro: 'Naming the column numbers makes the code readable.', code: C`
              NAME = 0
              AGE = 1
              SCORE = 2
              students = [["Asha", 15, 62], ["Ben", 14, 45]]
              for s in students:
                  print(s[NAME], "scored", s[SCORE])
            ` },
              {
                label: 'Dictionary (preview)', intro: 'A **dictionary** stores fields by name. Module 9 covers it fully.', code: C`
              student = {"name": "Asha", "age": 15, "score": 62}
              print(student["name"])
              student["score"] = 70
              print(student)
              print(student["name"], "is", student["age"])
            ` },
              {
                label: 'Missing key', expectError: true, code: C`
              student = {"name": "Asha"}
              print(student["score"])
            ` },
            ]
          },
          { t: 'note', kind: 'key', html: 'A record can hold **mixed types** (text, whole number, decimal). This is why a list of lists is a better fit than a single array when the fields differ. Edexcel exam questions also use **parallel arrays**.' },

          { t: 'h', text: 'Working with a table of records' },
          {
            t: 'cases', title: 'Search, update, add, remove', items: [
              {
                label: 'Print every record', code: C`
              students = [["Asha", 15, 62], ["Ben", 14, 45], ["Chloe", 15, 80]]
              for s in students:
                  print(s[0] + " (" + str(s[1]) + "): " + str(s[2]))
            ` },
              {
                label: 'Search by name', code: C`
              students = [["Asha", 15, 62], ["Ben", 14, 45], ["Chloe", 15, 80]]
              target = "Ben"
              found = False
              for s in students:
                  if s[0] == target:
                      print(target, "scored", s[2])
                      found = True
              if not found:
                  print("No such student")
            ` },
              {
                label: 'Update a field', code: C`
              students = [["Asha", 15, 62], ["Ben", 14, 45]]
              for s in students:
                  if s[0] == "Ben":
                      s[2] = 55
              print(students)
            ` },
              {
                label: 'Add a record', code: C`
              students = [["Asha", 15, 62]]
              students.append(["Dev", 14, 71])
              print(students)
            ` },
              {
                label: 'Remove a record', code: C`
              students = [["Asha", 15, 62], ["Ben", 14, 45], ["Chloe", 15, 80]]
              for i in range(len(students)):
                  if students[i][0] == "Ben":
                      del students[i]
                      break
              print(students)
            ` },
              {
                label: 'Best and average', code: C`
              students = [["Asha", 15, 62], ["Ben", 14, 45], ["Chloe", 15, 80]]
              best = students[0]
              total = 0
              for s in students:
                  total += s[2]
                  if s[2] > best[2]:
                      best = s
              print("Best:", best[0])
              print("Average:", round(total / len(students), 1))
            ` },
              {
                label: 'Column of a table', code: C`
              students = [["Asha", 15, 62], ["Ben", 14, 45]]
              scores = []
              for s in students:
                  scores.append(s[2])
              print(scores, max(scores))
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Using the wrong column number is the most common record bug. Write `NAME = 0`, `SCORE = 2` constants, or a comment above the list that names every column.' },

          { t: 'h', text: 'Sorting records by a column' },
          { t: 'p', html: 'To sort rows by one column you compare that column and swap whole rows. This is bubble sort on rows. You will meet it fully in module 11; here it shows that a row is just one item of the outer list.' },
          {
            t: 'cases', title: 'Sort by score', items: [
              {
                label: 'Swap two rows', code: C`
              students = [["Asha", 62], ["Ben", 45]]
              students[0], students[1] = students[1], students[0]
              print(students)
            ` },
              {
                label: 'Bubble sort by column 1', intro: 'Smallest score first. After each pass the largest value has moved to its place at the end.', code: C`
              students = [["Asha", 62], ["Ben", 45], ["Chloe", 80], ["Dev", 50]]
              n = len(students)
              for p in range(n - 1):
                  for i in range(n - 1 - p):
                      if students[i][1] > students[i + 1][1]:
                          students[i], students[i + 1] = students[i + 1], students[i]
              for s in students:
                  print(s[0], s[1])
            ` },
              {
                label: 'Built-in sort with a key', intro: 'A preview of a power tool from module 9: `key` says which column to sort by.', code: C`
              students = [["Asha", 62], ["Ben", 45], ["Chloe", 80]]
              students.sort(key=lambda s: s[1], reverse=True)
              print(students)
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'In Paper 2 a "records" task is usually a file or list of lines such as <code>Asha,15,62</code>, read into a 2D list and then searched, totalled or sorted. Module 10 shows the file side. Always say which column holds which field.' },

          {
            t: 'predict', title: 'Which record?', code: C`
            data = [["pen", 2, 1.5], ["book", 5, 3.0], ["bag", 1, 12.0]]
            print(data[1][0], data[2][2])
            total = 0
            for item in data:
                total += item[1] * item[2]
            print(total)
          `, rows: 2, why: 'Row 1 is the book; row 2 column 2 is 12.0. The total is 2 times 1.5, plus 5 times 3.0, plus 1 times 12.0, which is 30.0.'
          },
          {
            t: 'predict', title: 'Update in a loop', code: C`
            pets = [["cat", 3], ["dog", 5]]
            for p in pets:
                p[1] = p[1] + 1
            print(pets)
          `, rows: 1, why: '`p` is the actual row, which is a list, so changing `p[1]` changes the table: [["cat", 4], ["dog", 6]].'
          },
          { t: 'quiz', q: 'Which structure best stores a name (text), an age (whole number) and a score (decimal) for each student?', options: ['A list of numbers', 'A list of lists, one row per student', 'A single string', 'A range'], answer: 1, why: 'Each row is a record; rows can hold mixed types.' },
          { t: 'quiz', q: 'In <code>students = [["Asha", 15, 62], ["Ben", 14, 45]]</code>, how do you reach Ben\'s score?', options: ['students[1][2]', 'students[2][1]', 'students[1][1]', 'students["Ben"]'], answer: 0, why: 'Ben is row 1 and the score is column 2.' },

          {
            t: 'exercise', id: 'm06-ex-printrecords', title: 'Print the records', level: 1,
            prompt: 'The table <code>items = [["pen", 2], ["book", 5], ["bag", 12]]</code> holds an item name and its price in pounds. Print each as <code>NAME costs £PRICE</code>, for example <code>pen costs £2</code>.',
            starter: C`
              items = [["pen", 2], ["book", 5], ["bag", 12]]
            `,
            solution: C`
              items = [["pen", 2], ["book", 5], ["bag", 12]]
              for item in items:
                  print(item[0] + " costs £" + str(item[1]))
            `,
            tests: [{ out: 'pen costs £2\nbook costs £5\nbag costs £12' }],
            hints: ['Each `item` is a row: `item[0]` is the name, `item[1]` the price.']
          },
          {
            t: 'exercise', id: 'm06-ex-lookup', title: 'Look up a score', level: 2,
            prompt: 'The table <code>students = [["Asha", 62], ["Ben", 45], ["Chloe", 80]]</code> is given. Ask for a name. Print <code>NAME scored N</code>, or <code>No such student</code> if the name is not in the table.',
            starter: C`
              students = [["Asha", 62], ["Ben", 45], ["Chloe", 80]]
              name = input("Name: ")
            `,
            solution: C`
              students = [["Asha", 62], ["Ben", 45], ["Chloe", 80]]
              name = input("Name: ")
              found = False
              for s in students:
                  if s[0] == name:
                      print(name, "scored", s[1])
                      found = True
              if not found:
                  print("No such student")
            `,
            tests: [{ in: ['Ben'], out: 'Ben scored 45' }, { in: ['Chloe'], out: 'Chloe scored 80' }, { in: ['Zed'], out: 'No such student' }, { in: ['Asha'], out: 'Asha scored 62', hidden: true }],
            hints: ['Loop over the rows and compare `s[0]` with the name.']
          },
          {
            t: 'exercise', id: 'm06-ex-update', title: 'Update a score', level: 2,
            prompt: 'Use <code>students = [["Asha", 62], ["Ben", 45], ["Chloe", 80]]</code>. Ask for a name and a new score. If the student exists, change their score. Then print every student as <code>NAME: SCORE</code>, one per line. If the name does not exist, change nothing.',
            starter: C`
              students = [["Asha", 62], ["Ben", 45], ["Chloe", 80]]
              name = input("Name: ")
              new_score = int(input("New score: "))
            `,
            solution: C`
              students = [["Asha", 62], ["Ben", 45], ["Chloe", 80]]
              name = input("Name: ")
              new_score = int(input("New score: "))
              for s in students:
                  if s[0] == name:
                      s[1] = new_score
              for s in students:
                  print(s[0] + ": " + str(s[1]))
            `,
            tests: [{ in: ['Ben', '55'], out: 'Asha: 62\nBen: 55\nChloe: 80' }, { in: ['Zed', '10'], out: 'Asha: 62\nBen: 45\nChloe: 80' }, { in: ['Asha', '0'], out: 'Asha: 0\nBen: 45\nChloe: 80', hidden: true }],
            hints: ['`s[1] = new_score` changes the table because `s` is the actual row.']
          },
          {
            t: 'exercise', id: 'm06-ex-dictrecord', title: 'A dictionary record', level: 2,
            prompt: 'Ask for a name and an age (whole number). Store them in a dictionary with keys <code>"name"</code> and <code>"age"</code>. Add one to the age in the dictionary, then print <code>NAME will be AGE next year</code>.',
            starter: C`
              name = input("Name: ")
              age = int(input("Age: "))
            `,
            solution: C`
              name = input("Name: ")
              age = int(input("Age: "))
              person = {"name": name, "age": age}
              person["age"] = person["age"] + 1
              print(person["name"], "will be", person["age"], "next year")
            `,
            tests: [{ in: ['Asha', '14'], out: 'Asha will be 15 next year' }, { in: ['Ben', '0'], out: 'Ben will be 1 next year' }, { in: ['Li', '99'], out: 'Li will be 100 next year', hidden: true }],
            requires: [{ re: '\\{', msg: 'Use a dictionary written with curly brackets.' }],
            hints: ['`person = {"name": name, "age": age}`', 'Update with `person["age"] = person["age"] + 1`.']
          },
          {
            t: 'exercise', id: 'm06-ex-sortrecords', kind: 'exam', title: 'League table', level: 3,
            prompt: 'The table <code>teams = [["Reds", 12], ["Blues", 18], ["Greens", 9]]</code> holds team names and points. Ask for a new team name and its points, add the record, then sort the table from **highest to lowest points** using your own loops (no <code>sort</code>, <code>sorted</code>). Print <code>NAME POINTS</code> for each team, one per line.',
            starter: C`
              teams = [["Reds", 12], ["Blues", 18], ["Greens", 9]]
              name = input("New team: ")
              points = int(input("Points: "))
            `,
            solution: C`
              teams = [["Reds", 12], ["Blues", 18], ["Greens", 9]]
              name = input("New team: ")
              points = int(input("Points: "))
              teams.append([name, points])
              n = len(teams)
              for p in range(n - 1):
                  for i in range(n - 1 - p):
                      if teams[i][1] < teams[i + 1][1]:
                          teams[i], teams[i + 1] = teams[i + 1], teams[i]
              for t in teams:
                  print(t[0], t[1])
            `,
            tests: [{ in: ['Yellows', '15'], out: 'Blues 18\nYellows 15\nReds 12\nGreens 9' }, { in: ['Pinks', '20'], out: 'Pinks 20\nBlues 18\nReds 12\nGreens 9' }, { in: ['Greys', '1'], out: 'Blues 18\nReds 12\nGreens 9\nGreys 1', hidden: true }],
            requires: [{ re: 'sort', not: true, msg: 'Write your own sorting loops.' }],
            hints: ['Compare `teams[i][1]` with `teams[i + 1][1]`.', 'Swap whole rows: `teams[i], teams[i + 1] = teams[i + 1], teams[i]`.', 'Largest first means swap when the left one is **smaller**.']
          },
        ],
      },
    ],
  });
})();

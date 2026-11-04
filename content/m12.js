(function () {
  const C = PP.C;
  PP.addModule({
    id: 'm12',
    title: 'Data, binary and encryption',
    blurb: 'Binary and hex in code, shifts, characters as numbers, the Caesar cipher and run length encoding.',
    lessons: [
      /* ------------------------------------------------------------------ */
      {
        id: 'binary-hex',
        title: 'Binary and hexadecimal in code',
        time: '40 min',
        book: 'Ch 3',
        summary: 'Denary, binary and hex conversions; bits and combinations; 8-bit addition',
        intro: 'Computers store everything as patterns of 0 and 1. Here you will convert between number bases by hand-written code and with Python\'s built-in tools, and check your answers.',
        blocks: [
          { t: 'h', text: 'Place values' },
          { t: 'p', html: 'In **binary** (base 2) each column is worth double the one to its right: 128, 64, 32, 16, 8, 4, 2, 1 in an 8-bit number. A **bit** is one binary digit; 8 bits make a **byte**.' },
          { t: 'table', head: ['128', '64', '32', '16', '8', '4', '2', '1'], rows: [['0', '1', '0', '0', '1', '0', '1', '1']] },
          { t: 'p', html: 'The pattern above is 64 + 8 + 2 + 1 = 75. Let a program do the sum. Press **Trace** to watch `total` build up.' },
          {
            t: 'code', title: 'Binary to denary by hand', code: C`
            bits = "01001011"
            total = 0
            for digit in bits:
                total = total * 2 + int(digit)
            print(total)
          `, caption: 'Each step doubles the total so far and adds the next bit.'
          },

          {
            t: 'cases', title: 'Binary and denary conversions', items: [
              {
                label: 'Binary to denary (loop)', code: C`
              bits = "11111111"
              total = 0
              for digit in bits:
                  total = total * 2 + int(digit)
              print(total)
            ` },
              {
                label: 'int(s, 2)', intro: 'The second argument is the base of the text.', code: C`
              print(int("01001011", 2))
              print(int("1", 2))
              print(int("0", 2))
            ` },
              {
                label: 'Denary to binary (loop)', intro: 'Divide by 2 repeatedly; the remainders, read **backwards**, are the bits.', code: C`
              n = 75
              bits = ""
              while n > 0:
                  bits = str(n % 2) + bits
                  n = n // 2
              print(bits)
            ` },
              {
                label: 'bin() and format()', intro: '`bin()` adds a `0b` prefix. `format(n, "08b")` gives 8 digits padded with zeros.', code: C`
              n = 75
              print(bin(n))
              print(bin(n)[2:])
              print(format(n, "08b"))
              print(format(5, "08b"))
            ` },
              {
                label: 'Zero', intro: 'The while loop above prints an empty string for 0. Handle that edge case.', code: C`
              n = 0
              bits = ""
              while n > 0:
                  bits = str(n % 2) + bits
                  n = n // 2
              if bits == "":
                  bits = "0"
              print(bits)
            ` },
              {
                label: 'Bad digit', expectError: true, intro: '`int` refuses digits that are not valid in the base.', code: C`
              print(int("10201", 2))
            ` },
            ]
          },

          { t: 'h', text: 'How many values can n bits hold?' },
          {
            t: 'cases', title: 'Bits and combinations', items: [
              {
                label: 'Powers of two', code: C`
              for n in range(1, 9):
                  print(n, "bits:", 2 ** n, "values, largest", 2 ** n - 1)
            ` },
              {
                label: 'Bits needed', intro: 'How many bits are needed to count up to a number?', code: C`
              biggest = 100
              bits = 1
              while 2 ** bits - 1 < biggest:
                  bits = bits + 1
              print(bits)
            ` },
            ]
          },

          { t: 'h', text: 'Hexadecimal' },
          { t: 'p', html: '**Hexadecimal** (base 16) uses 0-9 and A-F (A is 10, F is 15). One hex digit stands for exactly four bits, so a byte is two hex digits. It is shorter and easier for humans to read than binary, and less error-prone to copy.' },
          {
            t: 'cases', title: 'Hex in Python', items: [
              {
                label: 'Denary to hex', code: C`
              print(hex(255))
              print(format(255, "X"))
              print(format(10, "X"))
              print(format(75, "02X"))
            ` },
              {
                label: 'Hex to denary', code: C`
              print(int("4B", 16))
              print(int("FF", 16))
              print(int("ff", 16))
            ` },
              {
                label: 'Binary to hex', intro: 'Group the bits in fours: `0100 1011` is `4` and `B`.', code: C`
              bits = "01001011"
              n = int(bits, 2)
              print(format(n, "X"))
              print(format(n, "08b"))
            ` },
              {
                label: 'By hand', intro: 'Hex digits looked up in a string: the position is the value.', code: C`
              digits = "0123456789ABCDEF"
              n = 75
              result = ""
              while n > 0:
                  result = digits[n % 16] + result
                  n = n // 16
              print(result)
            ` },
              {
                label: 'Bad hex', expectError: true, code: C`
              print(int("4G", 16))
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Say <em>why hex is used</em>: it is shorter than binary (4 bits per digit), easier for people to read and remember, and less likely to be mistyped. Colours (`#FF8800`), MAC addresses and memory addresses all use hex.' },

          { t: 'h', text: 'Binary addition and overflow' },
          { t: 'p', html: 'An 8-bit register holds 0 to 255. If a sum is bigger, a ninth bit would be needed and there is no room: this is **overflow**.' },
          {
            t: 'cases', title: '8-bit addition', items: [
              {
                label: 'Fits', code: C`
              a = int("00110101", 2)
              b = int("00001111", 2)
              total = a + b
              print(a, b, total)
              print(format(total, "08b"))
              print("Overflow" if total > 255 else "OK")
            ` },
              {
                label: 'Overflow', code: C`
              a = int("11000000", 2)
              b = int("01000001", 2)
              total = a + b
              print(total, "needs", len(bin(total)) - 2, "bits")
              print("Overflow" if total > 255 else "OK")
              print(format(total % 256, "08b"), "is what 8 bits would keep")
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: '`bin(5)` gives the **string** `"0b101"`, not a number. You cannot add to it. Convert back with `int(text, 2)` first.' },

          { t: 'viz', kind: 'binary', caption: 'Click the bits to build a number. Each 1 adds its place value.' },

          { t: 'viz', kind: 'denary2bin' },
          { t: 'viz', kind: 'binadd' },

          {
            t: 'predict', code: C`
            print(int("1010", 2))
            print(format(10, "08b"))
            print(format(255, "X"))
          `, rows: 3, why: '1010 is 8 + 2 = 10; padded to 8 digits is 00001010; 255 is FF.'
          },
          {
            t: 'predict', code: C`
            n = 13
            bits = ""
            while n > 0:
                bits = str(n % 2) + bits
                n = n // 2
            print(bits)
          `, rows: 1, why: '13 is 8 + 4 + 1 = 1101. Remainders come out 1, 0, 1, 1 and are placed at the front.'
          },
          { t: 'quiz', q: 'How many different values can 6 bits represent?', options: ['6', '12', '36', '64'], answer: 3, why: '2 to the power 6 is 64.' },
          { t: 'quiz', q: 'Which hex value equals binary 1111 0001?', options: ['E1', 'F1', 'F0', '1F'], answer: 1, why: '1111 is F and 0001 is 1.' },
          {
            t: 'sort', prompt: 'Which number base is each of these written in?', cats: ['Binary', 'Denary', 'Hexadecimal'], items: [
              { text: '10110', cat: 0 },
              { text: '7F', cat: 2 },
              { text: '2048', cat: 1 },
              { text: '0b1001', cat: 0 },
              { text: 'C9', cat: 2 },
              { text: '99', cat: 1 },
            ], why: 'Letters A-F mean hex; only 0 and 1 (or a 0b prefix) means binary; the rest is denary.'
          },

          {
            t: 'exercise', id: 'm12-ex-bin2den', title: 'Binary to denary', level: 1,
            prompt: 'Ask for an 8-bit binary string and print its denary value.',
            starter: C`
              bits = input("Binary: ")
              # work out and print the denary value
            `,
            solution: C`
              bits = input("Binary: ")
              print(int(bits, 2))
            `,
            tests: [
              { in: ['00001010'], out: '10' },
              { in: ['11111111'], out: '255' },
              { in: ['00000000'], out: '0', hidden: true },
              { in: ['10000001'], out: '129', hidden: true },
            ],
            hints: ['`int(text, 2)` converts from base 2.']
          },
          {
            t: 'exercise', id: 'm12-ex-den2bin', title: 'Denary to binary by hand', level: 2,
            prompt: 'Write <code>to_binary(n)</code> returning the binary string of a whole number (no padding, no <code>0b</code>; <code>to_binary(0)</code> is <code>"0"</code>). Use a loop with <code>%</code> and <code>//</code>, not <code>bin()</code> or <code>format()</code>.',
            starter: C`
              def to_binary(n):
                  pass
            `,
            solution: C`
              def to_binary(n):
                  if n == 0:
                      return "0"
                  bits = ""
                  while n > 0:
                      bits = str(n % 2) + bits
                      n = n // 2
                  return bits
            `,
            tests: [
              { py: 'assert to_binary(75) == "1001011"' },
              { py: 'assert to_binary(1) == "1"' },
              { py: 'assert to_binary(0) == "0"', label: 'zero' },
              { py: 'assert to_binary(255) == "11111111"', hidden: true },
            ],
            requires: [{ re: 'bin\\(|format\\(|f"\\{', not: true, msg: 'Write the conversion with a loop.' }],
            hints: ['Remainder of `n % 2` is the next bit (rightmost first).', 'Put each new bit at the front of the string.']
          },
          {
            t: 'exercise', id: 'm12-ex-hexcolour', title: 'Colour code', level: 2, kind: 'exam',
            prompt: 'A pixel colour is given by three numbers from 0 to 255 (red, green, blue). Ask for the three and print the hex code as <code>#</code> followed by six hex digits in capitals, each colour as exactly two digits.',
            starter: C`
              r = int(input("Red: "))
              g = int(input("Green: "))
              b = int(input("Blue: "))
              print("#" + str(r) + str(g) + str(b))
            `,
            solution: C`
              r = int(input("Red: "))
              g = int(input("Green: "))
              b = int(input("Blue: "))
              print("#" + format(r, "02X") + format(g, "02X") + format(b, "02X"))
            `,
            tests: [
              { in: ['255', '136', '0'], out: '#FF8800' },
              { in: ['0', '0', '0'], out: '#000000' },
              { in: ['1', '10', '171'], out: '#010AAB', hidden: true },
            ],
            hints: ['`format(n, "02X")` gives two capital hex digits with a leading zero.']
          },
          {
            t: 'exercise', id: 'm12-ex-overflow', title: 'Overflow checker', level: 3,
            prompt: 'Ask for two 8-bit binary numbers. Add them. Print the 8-bit result as 8 binary digits and then <code>OK</code> if the sum is 255 or less, or <code>Overflow</code> if it is more. On overflow print the sum with the carry dropped (sum modulo 256) as 8 binary digits.',
            starter: C`
              a = int(input("First: "), 2)
              b = int(input("Second: "), 2)
              total = a + b
              print(format(total, "08b"))
            `,
            solution: C`
              a = int(input("First: "), 2)
              b = int(input("Second: "), 2)
              total = a + b
              if total > 255:
                  print(format(total % 256, "08b"))
                  print("Overflow")
              else:
                  print(format(total, "08b"))
                  print("OK")
            `,
            tests: [
              { in: ['00110101', '00001111'], out: '01000100\nOK' },
              { in: ['11000000', '01000001'], out: '00000001\nOverflow' },
              { in: ['11111111', '00000001'], out: '00000000\nOverflow', hidden: true },
              { in: ['10000000', '01111111'], out: '11111111\nOK', hidden: true },
            ],
            hints: ['Compare the denary sum with 255.', '`total % 256` keeps just the low 8 bits.']
          },
          {
            t: 'exercise', id: 'm12-ex-debug-bin', title: 'Three errors in a converter', level: 2, kind: 'debug',
            prompt: 'This should print the binary of a number the user types (e.g. 6 gives 110). There are <strong>three</strong> errors.',
            starter: C`
              n = input("Number: ")
              bits = ""
              while n > 0
                  bits = bits + str(n % 2)
                  n = n // 2
              print(bits)
            `,
            solution: C`
              n = int(input("Number: "))
              bits = ""
              while n > 0:
                  bits = str(n % 2) + bits
                  n = n // 2
              print(bits)
            `,
            tests: [
              { in: ['6'], out: '110' },
              { in: ['75'], out: '1001011' },
              { in: ['1'], out: '1', hidden: true },
            ],
            hints: ['`input` gives text.', 'A `while` line needs a colon.', 'The bits come out in reverse: where should each new bit go?']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'bitwise-shifts',
        title: 'Shifts and bitwise operators',
        time: '35 min',
        book: 'Ch 3',
        summary: 'Logical shifts << >>, multiply and divide by 2, two\'s complement, & | ^',
        intro: 'A **shift** moves every bit left or right. It is a fast way to multiply or divide by powers of two, and it is a favourite exam topic.',
        blocks: [
          { t: 'h', text: 'Logical shifts' },
          { t: 'p', html: 'A **logical shift left** moves all bits one place left and fills the gap on the right with 0. Each place is worth double, so the number is **multiplied by 2**. A **shift right** divides by 2 (rounding down). Bits pushed off the end are lost.' },
          {
            t: 'cases', title: 'Shifting in Python', items: [
              {
                label: 'Left shift', intro: '`x << n` shifts left by `n` places: multiplies by 2 to the power n.', code: C`
              x = 5
              print(format(x, "08b"), x)
              y = x << 1
              print(format(y, "08b"), y)
              z = x << 3
              print(format(z, "08b"), z)
            ` },
              {
                label: 'Right shift', intro: '`x >> n` divides by 2 to the power n, dropping the remainder.', code: C`
              x = 100
              print(format(x, "08b"), x)
              print(format(x >> 1, "08b"), x >> 1)
              print(format(x >> 2, "08b"), x >> 2)
              print(13 >> 1)
            ` },
              {
                label: 'Bits lost', intro: 'An 8-bit register cannot hold more than 255. `& 255` keeps only the lowest 8 bits, simulating a register.', code: C`
              x = 200
              y = (x << 1) & 255
              print(format(x, "08b"))
              print(format(y, "08b"), y)
            ` },
              {
                label: 'Same as * and //', code: C`
              n = 12
              print(n << 2, n * 4)
              print(n >> 2, n // 4)
            ` },
              {
                label: 'Negative shift', expectError: true, intro: 'A negative shift count is an error.', code: C`
              print(5 << -1)
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Typical question: <em>describe the effect of a logical shift left by 2 places on 00001101.</em> Answer: bits move 2 places left, 0s fill the right, giving 00110100; the value is multiplied by 4 (13 becomes 52). Mention loss of bits if the number gets too big (overflow).' },

          { t: 'h', text: 'Bitwise AND, OR, XOR' },
          { t: 'p', html: 'These operators compare two numbers bit by bit. They are an extension, but they are useful for masks.' },
          {
            t: 'table', head: ['Operator', 'Result bit is 1 when...', 'Example'], rows: [
              ['`&` AND', 'both bits are 1', '`1100 & 1010 = 1000`'],
              ['`|` OR', 'at least one bit is 1', '`1100 | 1010 = 1110`'],
              ['`^` XOR', 'the bits differ', '`1100 ^ 1010 = 0110`'],
            ]
          },
          {
            t: 'cases', title: 'Bitwise operators', items: [
              {
                label: 'AND, OR, XOR', code: C`
              a = int("1100", 2)
              b = int("1010", 2)
              print(format(a & b, "04b"))
              print(format(a | b, "04b"))
              print(format(a ^ b, "04b"))
            ` },
              {
                label: 'Is it odd?', intro: 'ANDing with 1 isolates the lowest bit: 1 means odd.', code: C`
              for n in [4, 7, 10, 13]:
                  print(n, n & 1)
            ` },
              {
                label: 'Mask', intro: 'ANDing with `00001111` keeps only the low four bits.', code: C`
              x = int("10110101", 2)
              mask = int("00001111", 2)
              print(format(x & mask, "08b"))
            ` },
            ]
          },

          { t: 'h', text: 'Two\'s complement (8 bits)' },
          { t: 'p', html: 'To store negative numbers, the leftmost bit has a **negative** place value: -128. So `11111111` is -128 + 127 = -1. To make a negative number: **invert the bits and add 1**.' },
          {
            t: 'cases', title: 'Two\'s complement in code', items: [
              {
                label: 'Negative to bits', code: C`
              n = -5
              print(format(n & 255, "08b"))
              print(format(256 + n, "08b"))
            ` },
              {
                label: 'By the rule', intro: 'Invert then add one: 5 is 00000101, invert 11111010, add 1 gives 11111011.', code: C`
              bits = format(5, "08b")
              inverted = ""
              for b in bits:
                  inverted = inverted + ("1" if b == "0" else "0")
              result = int(inverted, 2) + 1
              print(bits, inverted, format(result, "08b"))
            ` },
              {
                label: 'Bits to number', code: C`
              bits = "11111011"
              value = int(bits, 2)
              if bits[0] == "1":
                  value = value - 256
              print(value)
            ` },
              {
                label: 'Range', code: C`
              print("Smallest:", -(2 ** 7))
              print("Largest:", 2 ** 7 - 1)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Python integers never overflow by themselves. To pretend to be an 8-bit register, use `& 255` or `% 256` after shifting or adding.' },

          { t: 'viz', kind: 'binary', title: 'Shifts in action', bits: [0, 0, 0, 0, 0, 1, 1, 0], caption: 'Press Shift left and Shift right repeatedly. Then set the top bit to 1 and shift left to see overflow.' },

          {
            t: 'predict', code: C`
            x = 6
            print(x << 2)
            print(x >> 1)
            print(25 >> 3)
          `, rows: 3, why: '6 x 4 = 24; 6 // 2 = 3; 25 // 8 = 3.'
          },
          {
            t: 'predict', code: C`
            print(format(int("00101100", 2) << 2, "08b"))
          `, rows: 1, why: 'Shifting 00101100 left twice gives 10110000.'
          },
          { t: 'quiz', q: 'A logical shift right by 3 places on a number has the same effect as:', options: ['Multiplying by 3', 'Dividing by 8 (ignoring the remainder)', 'Dividing by 3', 'Multiplying by 8'], answer: 1, why: 'Each place divides by 2; three places divide by 8.' },
          { t: 'quiz', q: 'What is the 8-bit two\'s complement pattern for -1?', options: ['10000001', '11111111', '11111110', '00000001'], answer: 1, why: '-128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = -1.' },
          {
            t: 'parsons', prompt: 'Arrange the lines to shift 00000111 left by 2 places in an 8-bit register and print it as binary.', lines: [
              'x = int("00000111", 2)',
              'x = (x << 2) & 255',
              'print(format(x, "08b"))'], why: 'Convert, shift and mask, then print.'
          },

          {
            t: 'exercise', id: 'm12-ex-double', title: 'Shift to double', level: 1,
            prompt: 'Ask for a whole number and print it multiplied by 8 using a shift (not <code>*</code>).',
            starter: C`
              n = int(input("Number: "))
              print(n * 8)
            `,
            solution: C`
              n = int(input("Number: "))
              print(n << 3)
            `,
            tests: [
              { in: ['5'], out: '40' },
              { in: ['0'], out: '0' },
              { in: ['13'], out: '104', hidden: true },
            ],
            requires: [{ re: '<<', msg: 'Use the `<<` operator.' }, { re: '\\*', not: true, msg: 'Do not use `*`.' }],
            hints: ['8 is 2 to the power 3.']
          },
          {
            t: 'exercise', id: 'm12-ex-shiftbits', title: 'Show the shift', level: 2,
            prompt: 'Write <code>shift_left(bits, places)</code> where <code>bits</code> is an 8-character binary string. It returns the 8-bit string after a logical shift left (bits fall off the left, zeros fill the right).',
            starter: C`
              def shift_left(bits, places):
                  pass
            `,
            solution: C`
              def shift_left(bits, places):
                  n = (int(bits, 2) << places) & 255
                  return format(n, "08b")
            `,
            tests: [
              { py: 'assert shift_left("00001101", 2) == "00110100"' },
              { py: 'assert shift_left("11000001", 1) == "10000010"', label: 'bit falls off' },
              { py: 'assert shift_left("00000001", 0) == "00000001"', label: 'zero places' },
              { py: 'assert shift_left("10000000", 1) == "00000000"', hidden: true },
            ],
            hints: ['Convert, shift, mask with `& 255`, then format.']
          },
          {
            t: 'exercise', id: 'm12-ex-twos', title: 'Negative to binary', level: 3, kind: 'exam',
            prompt: 'Ask for a whole number from -128 to 127 and print its 8-bit two\'s complement binary pattern.',
            starter: C`
              n = int(input("Number: "))
              print(format(n, "08b"))
            `,
            solution: C`
              n = int(input("Number: "))
              print(format(n & 255, "08b"))
            `,
            tests: [
              { in: ['5'], out: '00000101' },
              { in: ['-5'], out: '11111011' },
              { in: ['-128'], out: '10000000', hidden: true },
              { in: ['-1'], out: '11111111', hidden: true },
            ],
            hints: ['`format(-5, "08b")` gives `-0000101`. Mask first with `& 255`.']
          },
          {
            t: 'exercise', id: 'm12-ex-debug-shift', title: 'Two errors in a shift program', level: 2, kind: 'debug',
            prompt: 'This should divide a number by 4 with a shift and show the result in binary with 8 digits. There are <strong>two</strong> errors.',
            starter: C`
              n = int(input("Number: "))
              result = n << 2
              print(format(result, "8b"))
            `,
            solution: C`
              n = int(input("Number: "))
              result = n >> 2
              print(format(result, "08b"))
            `,
            tests: [
              { in: ['100'], out: '00011001' },
              { in: ['7'], out: '00000001' },
              { in: ['3'], out: '00000000', hidden: true },
            ],
            hints: ['Which direction divides?', 'Padding with zeros needs a `0` in the format string.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'ascii-ord-chr',
        title: 'Characters as numbers: ord and chr',
        time: '35 min',
        book: 'Ch 3',
        summary: 'ASCII codes, ord(), chr(), character arithmetic, case conversion',
        intro: 'A computer stores a letter as a number. ASCII is the agreed table: for example capital A is 65. Python lets you move between a character and its code.',
        blocks: [
          { t: 'h', text: 'The ASCII table in Python' },
          { t: 'p', html: '`ord("A")` gives the **number** for a character. `chr(65)` gives the **character** for a number. They are opposites.' },
          {
            t: 'cases', title: 'ord and chr', items: [
              {
                label: 'ord', code: C`
              print(ord("A"))
              print(ord("a"))
              print(ord("0"))
              print(ord(" "))
            ` },
              {
                label: 'chr', code: C`
              print(chr(65))
              print(chr(97))
              print(chr(48))
              print(chr(33))
            ` },
              {
                label: 'Round trip', code: C`
              print(chr(ord("M")))
              print(ord(chr(100)))
            ` },
              {
                label: 'Table by loop', intro: 'Print part of the ASCII table.', code: C`
              for code in range(65, 91):
                  print(code, chr(code))
            ` },
              {
                label: 'Digit is not a number', intro: 'The character `"7"` has code 55. Subtract the code of `"0"` to get the value 7.', code: C`
              d = "7"
              print(ord(d))
              print(ord(d) - ord("0"))
              print(int(d))
            ` },
              {
                label: 'ord needs one character', expectError: true, code: C`
              print(ord("AB"))
            ` },
            ]
          },
          {
            t: 'table', head: ['Characters', 'Codes', 'Handy fact'], rows: [
              ['`0` to `9`', '48 to 57', 'digits are in order'],
              ['`A` to `Z`', '65 to 90', 'capital letters are in order'],
              ['`a` to `z`', '97 to 122', 'small letter = capital + 32'],
              ['space', '32', 'lowest of the printable characters'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'ASCII uses 7 bits (128 characters); extended ASCII uses 8 bits (256). Unicode uses more bits per character so it can hold every language and emoji. Because letters are in order, comparing characters with `<` and `>` compares codes.' },

          { t: 'h', text: 'Character arithmetic' },
          {
            t: 'cases', title: 'Doing sums on letters', items: [
              {
                label: 'Next letter', code: C`
              letter = "C"
              print(chr(ord(letter) + 1))
            ` },
              {
                label: 'Position in alphabet', intro: 'A is 0, B is 1, ... Z is 25.', code: C`
              for letter in "AZM":
                  print(letter, ord(letter) - ord("A"))
            ` },
              {
                label: 'Upper to lower', intro: 'Add 32 to a capital letter code. (`.lower()` does this for you, but the exam may ask for the arithmetic.)', code: C`
              capital = "Q"
              print(chr(ord(capital) + 32))
              print(chr(ord("q") - 32))
            ` },
              {
                label: 'Swap case by hand', code: C`
              text = "Hello World"
              result = ""
              for ch in text:
                  if "A" <= ch <= "Z":
                      result = result + chr(ord(ch) + 32)
                  elif "a" <= ch <= "z":
                      result = result + chr(ord(ch) - 32)
                  else:
                      result = result + ch
              print(result)
            ` },
              {
                label: 'Compare characters', code: C`
              print("a" < "b")
              print("Z" < "a")
              print("apple" < "Apple")
            ` },
              {
                label: 'Count letters', intro: 'Count capital letters in a message.', code: C`
              text = "Hello, My Name Is Sam"
              count = 0
              for ch in text:
                  if ord("A") <= ord(ch) <= ord("Z"):
                      count = count + 1
              print(count)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: '`ord` and `chr` change letters only by their **code**. Adding 1 to `"Z"` gives `"["`, not `"A"`. Wrapping round the end of the alphabet needs `%`; you will do that in the next lesson.' },

          {
            t: 'predict', code: C`
            print(ord("C") - ord("A"))
            print(chr(ord("a") + 2))
            print(chr(70))
          `, rows: 3, why: 'C is two after A; two after "a" is "c"; 70 is "F".'
          },
          {
            t: 'predict', code: C`
            word = "cab"
            for ch in word:
                print(ord(ch) - 96, end=" ")
          `, rows: 1, why: '"c" is 99 so 3; "a" is 97 so 1; "b" is 98 so 2. `end=" "` keeps them on one line.'
          },
          { t: 'quiz', q: 'In ASCII, which of these is the code for the lowercase letter <code>b</code>?', options: ['66', '98', '97', '2'], answer: 1, why: '`a` is 97, so `b` is 98.' },
          { t: 'quiz', q: 'Why is Unicode needed as well as ASCII?', options: ['ASCII is too slow', 'ASCII has too few characters for all languages and symbols', 'Unicode is smaller', 'ASCII cannot store digits'], answer: 1, why: 'ASCII has only 128 or 256 codes; Unicode has many thousands.' },
          {
            t: 'sort', prompt: 'Is each statement about the result of the Python expression true or false?', cats: ['True', 'False'], items: [
              { text: '`ord("a") > ord("A")`', cat: 0 },
              { text: '`chr(66) == "A"`', cat: 1 },
              { text: '`ord("0") == 0`', cat: 1 },
              { text: '`"B" < "a"`', cat: 0 },
              { text: '`ord("z") - ord("a") == 25`', cat: 0 },
              { text: '`chr(ord("x") + 1) == "y"`', cat: 0 },
            ], why: 'Capitals have lower codes than small letters; `ord("0")` is 48; `chr(66)` is "B".'
          },

          {
            t: 'exercise', id: 'm12-ex-asciiofletter', title: 'Code of a letter', level: 1,
            prompt: 'Ask for one character and print its ASCII code.',
            starter: C`
              ch = input("Character: ")
              # print the code
            `,
            solution: C`
              ch = input("Character: ")
              print(ord(ch))
            `,
            tests: [
              { in: ['A'], out: '65' },
              { in: ['z'], out: '122' },
              { in: ['5'], out: '53', hidden: true },
              { in: [' '], out: '32', hidden: true },
            ],
            hints: ['`ord()` turns a character into its code.']
          },
          {
            t: 'exercise', id: 'm12-ex-alphapos', title: 'Alphabet position', level: 2,
            prompt: 'Ask for a word in capital letters. Print the alphabet position (A is 1, B is 2 ... Z is 26) of each letter, separated by single spaces, on one line.',
            starter: C`
              word = input("Word: ")
              positions = []
              for ch in word:
                  positions.append(ord(ch))
              print(" ".join(positions))
            `,
            solution: C`
              word = input("Word: ")
              positions = []
              for ch in word:
                  positions.append(str(ord(ch) - ord("A") + 1))
              print(" ".join(positions))
            `,
            tests: [
              { in: ['CAB'], out: '3 1 2' },
              { in: ['Z'], out: '26' },
              { in: ['HELLO'], out: '8 5 12 12 15', hidden: true },
            ],
            hints: ['A should become 1, so subtract `ord("A")` and add 1.', '`join` needs strings: use `str()`.']
          },
          {
            t: 'exercise', id: 'm12-ex-casehand', title: 'Capitals by hand', level: 2,
            prompt: 'Write <code>to_upper(text)</code> that returns the text with every small letter turned into a capital using <code>ord</code> and <code>chr</code> (not <code>.upper()</code>). Other characters stay the same.',
            starter: C`
              def to_upper(text):
                  result = ""
                  for ch in text:
                      result = result + ch
                  return result
            `,
            solution: C`
              def to_upper(text):
                  result = ""
                  for ch in text:
                      if "a" <= ch <= "z":
                          result = result + chr(ord(ch) - 32)
                      else:
                          result = result + ch
                  return result
            `,
            tests: [
              { py: 'assert to_upper("hello") == "HELLO"' },
              { py: 'assert to_upper("Hi There 99!") == "HI THERE 99!"', label: 'keeps capitals, digits, symbols' },
              { py: 'assert to_upper("") == ""', hidden: true },
            ],
            requires: [{ re: '\\.upper\\(', not: true, msg: 'Do not use `.upper()`.' }, { re: 'ord\\(', msg: 'Use `ord`.' }],
            hints: ['Only change characters between "a" and "z".', 'A small letter is 32 more than its capital.']
          },
          {
            t: 'exercise', id: 'm12-ex-digitsum', title: 'Add the digits', level: 3, kind: 'exam',
            prompt: 'A product code is typed as text, such as <code>A4C9</code>. Print the sum of the **digits** in it (ignore the letters). Use <code>ord</code> to convert each digit character: do not use <code>int()</code> or <code>isdigit()</code>.',
            starter: C`
              code = input("Code: ")
              total = 0
              for ch in code:
                  total = total + ch
              print(total)
            `,
            solution: C`
              code = input("Code: ")
              total = 0
              for ch in code:
                  if ord("0") <= ord(ch) <= ord("9"):
                      total = total + (ord(ch) - ord("0"))
              print(total)
            `,
            tests: [
              { in: ['A4C9'], out: '13' },
              { in: ['XYZ'], out: '0' },
              { in: ['1234567890'], out: '45', hidden: true },
            ],
            requires: [{ re: '\\bint\\(|isdigit', not: true, msg: 'Use `ord` instead of `int()`/`isdigit()`.' }],
            hints: ['A digit character has a code from 48 to 57.', 'Digit value = code of the character minus code of "0".']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'caesar-cipher',
        title: 'Caesar cipher',
        time: '45 min',
        book: 'Ch 3',
        summary: 'Shift letters with wrap-around; encrypt, decrypt, brute force',
        intro: '**Encryption** scrambles a message so only someone with the key can read it. The Caesar cipher shifts every letter a fixed number of places along the alphabet. It is easy to break, which makes it a perfect first example.',
        blocks: [
          { t: 'h', text: 'The idea' },
          { t: 'p', html: 'The original message is **plaintext**; the scrambled message is **ciphertext**; the shift is the **key**. With key 3, A becomes D, B becomes E ... and X, Y, Z wrap round to A, B, C.' },
          { t: 'table', head: ['Plain', 'A', 'B', 'C', 'D', '...', 'X', 'Y', 'Z'], rows: [['Key 3', 'D', 'E', 'F', 'G', '...', 'A', 'B', 'C']] },

          { t: 'h', text: 'Shifting one letter with wrap-around' },
          { t: 'p', html: 'Convert the letter to a position 0-25, add the key, use `% 26` to wrap, and convert back. Press **Trace** to watch each stage.' },
          {
            t: 'code', title: 'One letter', code: C`
            letter = "X"
            key = 3
            position = ord(letter) - ord("A")
            shifted = (position + key) % 26
            new_letter = chr(shifted + ord("A"))
            print(letter, "->", new_letter)
          `, caption: 'X is 23; 23 + 3 = 26; 26 % 26 = 0, which is A.'
          },
          {
            t: 'cases', title: 'Why the wrap-around is needed', items: [
              {
                label: 'Without %', intro: 'Z + 3 goes off the end of the alphabet into punctuation.', code: C`
              print(chr(ord("Z") + 3))
            ` },
              {
                label: 'With %', code: C`
              for letter in "WXYZ":
                  p = ord(letter) - ord("A")
                  print(letter, chr((p + 3) % 26 + ord("A")))
            ` },
              {
                label: 'Key bigger than 26', intro: 'A key of 29 behaves like 3, thanks to `%`.', code: C`
              for key in [3, 29, 55]:
                  p = ord("B") - ord("A")
                  print(key, chr((p + key) % 26 + ord("A")))
            ` },
            ]
          },

          { t: 'h', text: 'Encrypting a whole message' },
          {
            t: 'cases', title: 'Encryption, step by step', items: [
              {
                label: 'Capitals only', code: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      p = ord(ch) - ord("A")
                      result = result + chr((p + key) % 26 + ord("A"))
                  return result

              print(encrypt("HELLO", 3))
            ` },
              {
                label: 'Spaces and symbols', intro: 'Only letters are shifted; everything else is kept. Without the `if`, the space would become a strange character.', code: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - ord("A") + key) % 26 + ord("A"))
                      else:
                          result = result + ch
                  return result

              print(encrypt("MEET AT NINE!", 5))
            ` },
              {
                label: 'Upper and lower case', intro: 'Small letters use `ord("a")` as the base.', code: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - ord("A") + key) % 26 + ord("A"))
                      elif "a" <= ch <= "z":
                          result = result + chr((ord(ch) - ord("a") + key) % 26 + ord("a"))
                      else:
                          result = result + ch
                  return result

              print(encrypt("Hello, World!", 3))
            ` },
              {
                label: 'Decrypt', intro: 'Decrypting shifts the other way: use `-key`. Python\'s `%` always gives a result from 0 to 25, even for negative numbers.', code: C`
              def shift(text, key):
                  result = ""
                  for ch in text:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - ord("A") + key) % 26 + ord("A"))
                      elif "a" <= ch <= "z":
                          result = result + chr((ord(ch) - ord("a") + key) % 26 + ord("a"))
                      else:
                          result = result + ch
                  return result

              secret = shift("Hello, World!", 3)
              print(secret)
              print(shift(secret, -3))
              print(shift(secret, 23))
            ` },
              {
                label: 'Key 0 and 26', intro: 'A key of 0 or 26 leaves the message unchanged: a useless key.', code: C`
              def shift(text, key):
                  return "".join(chr((ord(c) - 65 + key) % 26 + 65) for c in text)

              print(shift("HELLO", 0))
              print(shift("HELLO", 26))
            ` },
            ]
          },
          { t: 'note', kind: 'exam', html: 'Exam wording: the cipher is a <em>substitution</em> cipher. It is weak because there are only 25 possible keys, and letter frequencies are unchanged (in English, E is the most common letter, so the most common ciphertext letter is probably E shifted). A stronger cipher has a bigger key space and hides patterns.' },
          { t: 'html', html: '<pre>FUNCTION encrypt(text, key)\n    SET result TO ""\n    FOR EACH ch FROM text DO\n        SET p TO (ORD(ch) - 65 + key) MOD 26\n        SET result TO result + CHR(p + 65)\n    END FOR\n    RETURN result\nEND FUNCTION</pre>' },

          { t: 'h', text: 'Breaking it: brute force' },
          { t: 'p', html: 'With only 25 useful keys, an attacker can try them all. This is a **brute force** attack. A human then spots the line that makes sense.' },
          {
            t: 'code', title: 'Try every key', code: C`
            def shift(text, key):
                result = ""
                for ch in text:
                    if "A" <= ch <= "Z":
                        result = result + chr((ord(ch) - 65 + key) % 26 + 65)
                    else:
                        result = result + ch
                return result

            secret = "WKH FDW VDW"
            for key in range(1, 26):
                print(key, shift(secret, -key))
          `, caption: 'Key 3 gives THE CAT SAT.'
          },
          {
            t: 'cases', title: 'Finding the key', items: [
              {
                label: 'Known word', intro: 'If you know the message contains `THE`, test each key and stop when it appears.', code: C`
              def shift(text, key):
                  result = ""
                  for ch in text:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - 65 + key) % 26 + 65)
                      else:
                          result = result + ch
                  return result

              secret = "WKH FDW VDW"
              for key in range(1, 26):
                  attempt = shift(secret, -key)
                  if "THE" in attempt:
                      print("Key is", key, "->", attempt)
                      break
            ` },
              {
                label: 'Most common letter', intro: 'Count letters; assume the most common is E.', code: C`
              secret = "ZLLP LQ WKH SHOHLQ HWTJHL"
              counts = {}
              for ch in secret:
                  if ch != " ":
                      counts[ch] = counts.get(ch, 0) + 1
              best = ""
              for letter in counts:
                  if best == "" or counts[letter] > counts[best]:
                      best = letter
              key = (ord(best) - ord("E")) % 26
              print("Most common:", best, "so key might be", key)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'A common bug is `chr(ord(ch) + key)` with no `% 26` and no `- ord("A")`. It works until a letter passes Z. Also decrypting with the same positive key as encrypting just shifts further instead of undoing it.' },

          { t: 'viz', kind: 'caesar' },

          {
            t: 'predict', code: C`
            print(chr((ord("Y") - 65 + 4) % 26 + 65))
            print((5 - 8) % 26)
          `, rows: 2, why: 'Y is 24; 24 + 4 = 28; 28 % 26 = 2, which is C. In Python (5 - 8) % 26 is 23, never negative.'
          },
          {
            t: 'predict', code: C`
            text = "ab"
            key = 1
            out = ""
            for ch in text:
                out = out + chr((ord(ch) - 97 + key) % 26 + 97)
            print(out)
          `, rows: 1, why: 'a becomes b and b becomes c.'
          },
          { t: 'quiz', q: 'Why is the Caesar cipher easy to break?', options: ['It uses numbers', 'There are only 25 possible keys to try', 'It needs a computer to decrypt', 'It changes every letter randomly'], answer: 1, why: 'An attacker can try every key (brute force), and letter frequency patterns survive.' },
          { t: 'quiz', q: 'Which operator makes a letter wrap from Z back to A?', options: ['//', '%', '**', '&'], answer: 1, why: 'Modulus gives the remainder after dividing by 26, so positions stay in 0 to 25.' },
          {
            t: 'parsons', prompt: 'Arrange the statements that shift one capital letter <code>ch</code> by <code>key</code>.', lines: [
              'p = ord(ch) - ord("A")',
              'p = (p + key) % 26',
              'new_ch = chr(p + ord("A"))'], why: 'Convert to a 0-25 position, shift with wrap, then convert back to a letter.'
          },

          {
            t: 'exercise', id: 'm12-ex-shiftletter', title: 'Shift one letter', level: 1,
            prompt: 'Write <code>shift_letter(letter, key)</code> for a single capital letter. It returns the letter shifted forward by <code>key</code> with wrap-around.',
            starter: C`
              def shift_letter(letter, key):
                  return chr(ord(letter) + key)
            `,
            solution: C`
              def shift_letter(letter, key):
                  return chr((ord(letter) - ord("A") + key) % 26 + ord("A"))
            `,
            tests: [
              { py: 'assert shift_letter("A", 3) == "D"' },
              { py: 'assert shift_letter("Z", 1) == "A"', label: 'wraps' },
              { py: 'assert shift_letter("M", 26) == "M"', label: 'full circle' },
              { py: 'assert shift_letter("B", -2) == "Z"', hidden: true },
            ],
            hints: ['Subtract `ord("A")`, add the key, `% 26`, add `ord("A")` back.']
          },
          {
            t: 'exercise', id: 'm12-ex-caesar-enc', title: 'Caesar encrypt', level: 2,
            prompt: 'Write <code>encrypt(text, key)</code>: shift letters (capitals and small letters, keeping their case) by <code>key</code>, leaving spaces, digits and punctuation unchanged.',
            starter: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - ord("A") + key) % 26 + ord("A"))
                      else:
                          result = result + ch
                  return result
            `,
            solution: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - ord("A") + key) % 26 + ord("A"))
                      elif "a" <= ch <= "z":
                          result = result + chr((ord(ch) - ord("a") + key) % 26 + ord("a"))
                      else:
                          result = result + ch
                  return result
            `,
            tests: [
              { py: 'assert encrypt("Hello, World!", 3) == "Khoor, Zruog!"' },
              { py: 'assert encrypt("xyz", 3) == "abc"', label: 'small letters wrap' },
              { py: 'assert encrypt("a1 b2", 1) == "b1 c2"', label: 'digits and spaces kept' },
              { py: 'assert encrypt("", 5) == ""', hidden: true },
            ],
            hints: ['Add an `elif` for small letters with `ord("a")` as the base.']
          },
          {
            t: 'exercise', id: 'm12-ex-caesar-prog', title: 'Cipher tool', level: 3, kind: 'exam',
            prompt: 'Write a program that asks for a message and a key (whole number), then asks <code>E</code> to encrypt or <code>D</code> to decrypt (accept capital or small). Print the result. Shift letters only, keep their case, and leave everything else unchanged. For anything other than E or D print <code>Invalid choice</code>.',
            starter: C`
              message = input("Message: ")
              key = int(input("Key: "))
              choice = input("E or D: ").upper()
              # build and print the result
            `,
            solution: C`
              def shift(text, key):
                  result = ""
                  for ch in text:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - ord("A") + key) % 26 + ord("A"))
                      elif "a" <= ch <= "z":
                          result = result + chr((ord(ch) - ord("a") + key) % 26 + ord("a"))
                      else:
                          result = result + ch
                  return result

              message = input("Message: ")
              key = int(input("Key: "))
              choice = input("E or D: ").upper()
              if choice == "E":
                  print(shift(message, key))
              elif choice == "D":
                  print(shift(message, -key))
              else:
                  print("Invalid choice")
            `,
            tests: [
              { in: ['Hello, World!', '3', 'E'], out: 'Khoor, Zruog!' },
              { in: ['Khoor, Zruog!', '3', 'd'], out: 'Hello, World!' },
              { in: ['abc', '1', 'X'], out: 'Invalid choice' },
              { in: ['Zebra 99', '30', 'E'], out: 'Difve 99', hidden: true },
              { in: ['Difve 99', '30', 'D'], out: 'Zebra 99', hidden: true },
            ],
            hints: ['Decrypting is encrypting with `-key`.', 'Put the shifting in a function and call it twice.']
          },
          {
            t: 'exercise', id: 'm12-ex-bruteforce', title: 'Brute force', level: 3,
            prompt: 'A message in capitals was encrypted with an unknown key. Ask for the ciphertext. Print all 25 decryptions, one per line, in the form <code>key: text</code> for keys 1 to 25 (decrypt means shift backwards by the key). Spaces stay unchanged.',
            starter: C`
              secret = input("Ciphertext: ")
              for key in range(1, 26):
                  # decrypt with this key and print
                  pass
            `,
            solution: C`
              secret = input("Ciphertext: ")
              for key in range(1, 26):
                  result = ""
                  for ch in secret:
                      if "A" <= ch <= "Z":
                          result = result + chr((ord(ch) - ord("A") - key) % 26 + ord("A"))
                      else:
                          result = result + ch
                  print(str(key) + ": " + result)
            `,
            tests: [
              { in: ['KHOOR'], has: ['3: HELLO', '1: JGNNQ', '25: LIPPS'], lines: 25 },
              { in: ['A B'], has: ['1: Z A', '25: B C'], lines: 25 },
            ],
            hints: ['A loop inside a loop: outer over keys, inner over letters.', 'Shift by `-key`; `%` keeps it in range.']
          },
          {
            t: 'exercise', id: 'm12-ex-debug-caesar', title: 'Three errors in a cipher', level: 3, kind: 'debug',
            prompt: 'This function should shift capital letters forward by <code>key</code> with wrap-around and leave other characters alone. There are <strong>three</strong> errors.',
            starter: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      if ch >= "A" or ch <= "Z":
                          p = ord(ch) + key
                          result = result + chr(p % 26 + 65)
                      else:
                          result = ch
                  return result
            `,
            solution: C`
              def encrypt(text, key):
                  result = ""
                  for ch in text:
                      if ch >= "A" and ch <= "Z":
                          p = ord(ch) - 65 + key
                          result = result + chr(p % 26 + 65)
                      else:
                          result = result + ch
                  return result
            `,
            tests: [
              { py: 'assert encrypt("ABC", 3) == "DEF"' },
              { py: 'assert encrypt("XYZ", 3) == "ABC"' },
              { py: 'assert encrypt("A B!", 1) == "B C!"', label: 'keeps spaces and symbols' },
            ],
            hints: ['A letter must be both at least "A" and at most "Z".', 'Position must start from 0: subtract 65 before adding the key.', 'The else branch should add to `result`, not replace it.']
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      {
        id: 'rle',
        title: 'Run length encoding',
        time: '45 min',
        book: 'Ch 3 · p.136-141',
        summary: 'Compress runs of repeated characters; decompress; ratio; when it fails',
        intro: '**Compression** makes data smaller so it takes less storage and travels faster. Run length encoding (RLE) replaces each **run** of the same character with a count and the character.',
        blocks: [
          { t: 'h', text: 'The idea' },
          { t: 'p', html: 'The text `WWWBBBBW` has three Ws, four Bs, one W. As RLE it is `3W4B1W`. RLE is **lossless**: the original can be rebuilt exactly. It works best when data has long runs, such as simple pictures with big blocks of one colour.' },
          {
            t: 'table', head: ['Original', 'Encoded', 'Characters before', 'After'], rows: [
              ['`AAAABBB`', '`4A3B`', '7', '4'],
              ['`ABCD`', '`1A1B1C1D`', '4', '8'],
              ['`ZZZZZZZZZZ`', '`10Z`', '10', '3'],
            ]
          },
          { t: 'note', kind: 'exam', html: 'The textbook draws RLE as a flowchart: set count to 1, compare each character with the previous one; if equal add 1 to count, otherwise output count and character and reset count; at the end output the last run. The Python below follows that flow step for step. Learn the order of the steps.' },

          { t: 'h', text: 'Compressing' },
          { t: 'p', html: 'Keep the current character and a counter. When the next character differs, output the pair and start again. Do not forget the last run after the loop. Press **Trace** to follow `count`, `current` and `result`.' },
          {
            t: 'code', title: 'compress', code: C`
            text = "WWWBBBBW"
            result = ""
            current = text[0]
            count = 1
            for i in range(1, len(text)):
                if text[i] == current:
                    count = count + 1
                else:
                    result = result + str(count) + current
                    current = text[i]
                    count = 1
            result = result + str(count) + current
            print(result)
          `, caption: 'The line after the loop writes out the final run.'
          },
          {
            t: 'cases', title: 'Compression in all its cases', items: [
              {
                label: 'As a function', code: C`
              def compress(text):
                  if text == "":
                      return ""
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  result = result + str(count) + current
                  return result

              print(compress("AAAABBBCCD"))
            ` },
              {
                label: 'Single character', code: C`
              def compress(text):
                  if text == "":
                      return ""
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  result = result + str(count) + current
                  return result

              print(compress("Q"))
              print(compress("QQQQQQQQQQQQ"))
            ` },
              {
                label: 'Empty text', intro: 'Without the guard, `text[0]` crashes on an empty string.', expectError: true, code: C`
              text = ""
              current = text[0]
            ` },
              {
                label: 'Forgot last run', intro: 'Leaving out the line after the loop loses the final run: `3W4B` instead of `3W4B1W`.', code: C`
              text = "WWWBBBBW"
              result = ""
              current = text[0]
              count = 1
              for i in range(1, len(text)):
                  if text[i] == current:
                      count = count + 1
                  else:
                      result = result + str(count) + current
                      current = text[i]
                      count = 1
              print(result)
            ` },
              {
                label: 'Case matters', intro: '`"a"` and `"A"` are different characters, so they form separate runs.', code: C`
              def compress(text):
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  return result + str(count) + current

              print(compress("aaAA"))
            ` },
              {
                label: 'Ratio', intro: 'Compression ratio: size after divided by size before. Below 1 means it shrank.', code: C`
              def compress(text):
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  return result + str(count) + current

              original = "AAAAAAAABBBBCCDA"
              packed = compress(original)
              print(packed)
              print(len(original), "->", len(packed))
              print("Ratio:", round(len(packed) / len(original), 2))
            ` },
            ]
          },

          { t: 'h', text: 'When RLE does not help' },
          { t: 'p', html: 'If there are no runs, every character becomes a pair of characters, so the "compressed" version is **twice as long**. RLE is useful only when the data has plenty of repetition.' },
          {
            t: 'code', title: 'Compression can expand', code: C`
            def compress(text):
                result = ""
                current = text[0]
                count = 1
                for i in range(1, len(text)):
                    if text[i] == current:
                        count = count + 1
                    else:
                        result = result + str(count) + current
                        current = text[i]
                        count = 1
                return result + str(count) + current

            for sample in ["AAAAAAAAAA", "AABBCC", "ABCDEFGH"]:
                packed = compress(sample)
                print(sample, packed, len(sample), len(packed))
          ` },

          { t: 'h', text: 'Decompressing' },
          { t: 'p', html: 'Read the encoded text in pairs: a number then a character, and repeat the character that many times. This version assumes counts are single digits (1 to 9). Handling multi-digit counts is an extension below.' },
          {
            t: 'cases', title: 'Decompression', items: [
              {
                label: 'Single-digit counts', code: C`
              def decompress(code):
                  result = ""
                  for i in range(0, len(code), 2):
                      count = int(code[i])
                      result = result + code[i + 1] * count
                  return result

              print(decompress("3W4B1W"))
            ` },
              {
                label: 'Multi-digit counts', intro: 'Collect digits into a number until a non-digit appears; that character is repeated.', code: C`
              def decompress(code):
                  result = ""
                  number = ""
                  for ch in code:
                      if ch.isdigit():
                          number = number + ch
                      else:
                          result = result + ch * int(number)
                          number = ""
                  return result

              print(decompress("12A3B1C"))
            ` },
              {
                label: 'Round trip', intro: 'Compress then decompress should give back exactly what you started with.', code: C`
              def compress(text):
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  return result + str(count) + current

              def decompress(code):
                  result = ""
                  number = ""
                  for ch in code:
                      if ch.isdigit():
                          number = number + ch
                      else:
                          result = result + ch * int(number)
                          number = ""
                  return result

              original = "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWW"
              packed = compress(original)
              print(packed)
              print(decompress(packed) == original)
            ` },
              {
                label: 'Picture rows', intro: 'A tiny picture: each row is RLE coded and drawn back.', code: C`
              rows = ["4.2#4.", "1.8#1.", "4.2#4."]
              for row in rows:
                  line = ""
                  for i in range(0, len(row), 2):
                      line = line + row[i + 1] * int(row[i])
                  print(line)
            ` },
            ]
          },
          { t: 'note', kind: 'warn', html: 'Numbers in the data cause trouble: `"11"` compresses to `"21"`, which a decoder reads as two copies of `"1"`... it can still work, but the multi-digit method above would read `"21"` as the number 21 with no character. In exercises, the text to compress contains letters only.' },
          { t: 'note', kind: 'exam', html: 'Compression types: <strong>lossless</strong> keeps all the data (RLE, Huffman); <strong>lossy</strong> throws some away (JPEG, MP3). RLE is lossless. Questions give you a string or a grid of pixels and ask you to write the RLE, or state the saving in characters or bits.' },

          { t: 'viz', kind: 'rle' },

          {
            t: 'predict', code: C`
            text = "aabccc"
            result = ""
            current = text[0]
            count = 1
            for i in range(1, len(text)):
                if text[i] == current:
                    count = count + 1
                else:
                    result = result + str(count) + current
                    current = text[i]
                    count = 1
            result = result + str(count) + current
            print(result)
          `, rows: 1, why: 'Two a, one b, three c.'
          },
          {
            t: 'predict', code: C`
            code = "2x3y"
            out = ""
            for i in range(0, len(code), 2):
                out = out + code[i + 1] * int(code[i])
            print(out, len(out))
          `, rows: 1, why: 'Two x then three y: `xxyyy`, 5 characters.'
          },
          { t: 'quiz', q: 'What is the run length encoding of <code>AAABCC</code>?', options: ['3A1B2C', 'A3B1C2', '3A1B1C', '3ABC2'], answer: 0, why: 'Three A, one B, two C.' },
          { t: 'quiz', q: 'For which data is RLE most effective?', options: ['A random list of letters', 'A simple image with large blocks of one colour', 'Every character different', 'A short word'], answer: 1, why: 'Long runs give big savings; no runs doubles the size.' },
          {
            t: 'sort', prompt: 'Will RLE make each string shorter, or longer, or the same length?', cats: ['Shorter', 'Same length', 'Longer'], items: [
              { text: 'AAAAAAAA', cat: 0 },
              { text: 'ABABAB', cat: 2 },
              { text: 'AABB', cat: 1 },
              { text: 'ABC', cat: 2 },
              { text: 'WWWWWWWWBB', cat: 0 },
              { text: 'ZZ', cat: 1 },
            ], why: 'Each run costs 2 characters (count + letter) when counts are one digit. A run of 1 doubles; a run of 2 is break-even; longer runs shrink.'
          },
          {
            t: 'parsons', prompt: 'Arrange the body of <code>compress</code> for a non-empty string.', lines: [
              'current = text[0]',
              'count = 1',
              'for i in range(1, len(text)):',
              '    if text[i] == current:',
              '        count = count + 1',
              '    else:',
              '        result = result + str(count) + current',
              '        current = text[i]',
              '        count = 1',
              'result = result + str(count) + current'], why: 'Start the first run, extend or end runs inside the loop, then write the last run after it.'
          },

          {
            t: 'exercise', id: 'm12-ex-rle-first', title: 'Length of the first run', level: 1,
            prompt: 'Ask for a word. Print how many times its first character repeats in a row at the start (for <code>aaabaa</code> the answer is 3).',
            starter: C`
              text = input("Text: ")
              count = 1
              # count repeats of text[0] at the start
              print(count)
            `,
            solution: C`
              text = input("Text: ")
              count = 1
              while count < len(text) and text[count] == text[0]:
                  count = count + 1
              print(count)
            `,
            tests: [
              { in: ['aaabaa'], out: '3' },
              { in: ['xyz'], out: '1' },
              { in: ['bbbb'], out: '4', hidden: true },
              { in: ['q'], out: '1', hidden: true },
            ],
            hints: ['Keep going while the next character equals the first.', 'Check `count < len(text)` first so you never read past the end.']
          },
          {
            t: 'exercise', id: 'm12-ex-rle-compress', title: 'Write compress', level: 2,
            prompt: 'Write <code>compress(text)</code> returning the run length encoding, e.g. <code>"WWWBBBBW"</code> gives <code>"3W4B1W"</code>. An empty string gives <code>""</code>.',
            starter: C`
              def compress(text):
                  if text == "":
                      return ""
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  return result
            `,
            solution: C`
              def compress(text):
                  if text == "":
                      return ""
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  result = result + str(count) + current
                  return result
            `,
            tests: [
              { py: 'assert compress("WWWBBBBW") == "3W4B1W"' },
              { py: 'assert compress("ABCD") == "1A1B1C1D"' },
              { py: 'assert compress("") == ""', label: 'empty' },
              { py: 'assert compress("ZZZZZZZZZZZZ") == "12Z"', label: 'long run', hidden: true },
              { py: 'assert compress("a") == "1a"', hidden: true },
            ],
            hints: ['What has not been written out when the loop finishes?']
          },
          {
            t: 'exercise', id: 'm12-ex-rle-decompress', title: 'Write decompress', level: 2,
            prompt: 'Write <code>decompress(code)</code> which rebuilds the original text from RLE. Counts can have more than one digit and the data letters only (no digits).',
            starter: C`
              def decompress(code):
                  result = ""
                  for i in range(0, len(code), 2):
                      result = result + code[i + 1] * int(code[i])
                  return result
            `,
            solution: C`
              def decompress(code):
                  result = ""
                  number = ""
                  for ch in code:
                      if ch.isdigit():
                          number = number + ch
                      else:
                          result = result + ch * int(number)
                          number = ""
                  return result
            `,
            tests: [
              { py: 'assert decompress("3W4B1W") == "WWWBBBBW"' },
              { py: 'assert decompress("12A") == "AAAAAAAAAAAA"', label: 'two-digit count' },
              { py: 'assert decompress("") == ""', hidden: true },
              { py: 'assert decompress("1x10y") == "x" + "y" * 10', hidden: true },
            ],
            hints: ['Build the count digit by digit in a string.', 'When you meet a non-digit, repeat it `int(number)` times, then reset `number`.']
          },
          {
            t: 'exercise', id: 'm12-ex-rle-report', title: 'Compression report', level: 3, kind: 'exam',
            prompt: 'A fax machine sends a line of pixels written as letters (for example <code>WWWWBBW</code>). Ask for the line, compress it with RLE, and print three lines: <code>Encoded: ...</code>, <code>Before: N characters</code> and <code>After: M characters</code>. If the encoded text is not shorter, print a fourth line <code>No saving</code>.',
            starter: C`
              line = input("Pixel line: ")
              # compress, then report
            `,
            solution: C`
              line = input("Pixel line: ")
              result = ""
              current = line[0]
              count = 1
              for i in range(1, len(line)):
                  if line[i] == current:
                      count = count + 1
                  else:
                      result = result + str(count) + current
                      current = line[i]
                      count = 1
              result = result + str(count) + current
              print("Encoded:", result)
              print("Before:", len(line), "characters")
              print("After:", len(result), "characters")
              if len(result) >= len(line):
                  print("No saving")
            `,
            tests: [
              { in: ['WWWWWWBBW'], out: 'Encoded: 6W2B1W\nBefore: 9 characters\nAfter: 6 characters' },
              { in: ['WBWB'], out: 'Encoded: 1W1B1W1B\nBefore: 4 characters\nAfter: 8 characters\nNo saving' },
              { in: ['AABB'], out: 'Encoded: 2A2B\nBefore: 4 characters\nAfter: 4 characters\nNo saving', hidden: true },
            ],
            hints: ['Reuse the compress loop; remember the last run.', 'Compare the two lengths with `>=` for "no saving".']
          },
          {
            t: 'exercise', id: 'm12-ex-debug-rle', title: 'Three errors in compress', level: 3, kind: 'debug',
            prompt: 'This function should return the RLE of a non-empty string, but there are <strong>three</strong> errors.',
            starter: C`
              def compress(text):
                  result = ""
                  current = text[0]
                  count = 0
                  for i in range(len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + current + str(count)
                          current = text[i]
                  result = result + str(count) + current
                  return result
            `,
            solution: C`
              def compress(text):
                  result = ""
                  current = text[0]
                  count = 1
                  for i in range(1, len(text)):
                      if text[i] == current:
                          count = count + 1
                      else:
                          result = result + str(count) + current
                          current = text[i]
                          count = 1
                  result = result + str(count) + current
                  return result
            `,
            tests: [
              { py: 'assert compress("AAABB") == "3A2B"' },
              { py: 'assert compress("ABC") == "1A1B1C"' },
              { py: 'assert compress("Z") == "1Z"', hidden: true },
            ],
            hints: ['Output order is count then character.', 'The count must restart at 1 when a new run begins.', 'Starting the loop at 0 counts the first character twice with `count = 0`: choose start values that agree.']
          },
        ],
      },
    ],
  });
})();

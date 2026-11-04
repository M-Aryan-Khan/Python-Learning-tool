/* Past-paper finder data.
 * Each entry points to a question in the teacher's topical booklet (Booklet 1) by session, question and printed page number,
 * and describes the SKILL being tested in our own words. No question text is reproduced.
 * `lessons` = lesson ids that teach the skill; `practice` = original m15 exercises in the same style.
 * Page numbers are the numbers printed at the top of each booklet page. Paper 1 question numbers are taken from the lesson planner. */
(function () {
  const B = (p) => 'Booklet 1 p.' + p;
  const P = (paper, session, q, topic, page, skill, marks, lessons, practice) => {
    const e = { paper, session, q, topic, page: B(page), skill, lessons: lessons || [], practice: practice || [] };
    if (marks) e.marks = marks;
    return e;
  };
  PP.pastPapers = [
    /* ---------------- June 2019 (Paper 2) ---------------- */
    P('P2', 'June 2019', 'Q1(a)', 'Data types', 37, 'choose the best data type for a number with a decimal part', 1, ['data-types']),
    P('P2', 'June 2019', 'Q1(b)', 'Errors', 37, 'define what a logic error is', 1, ['errors-debugging']),
    P('P2', 'June 2019', 'Q1(c)', 'Amend the code', 37, 'find and fix three errors in a short counter program that adds a fixed amount', 3, ['amend-the-code', 'errors-debugging'], ['m15-ex-ae-stock', 'm15-ex-ae-temps']),
    P('P2', 'June 2019', 'Q1(d)', 'Good practice', 37, 'give a reason why programmers use comments', 1, ['comments-style']),
    P('P2', 'June 2019', 'Q1(e)', 'Scope', 38, 'explain the difference between local and global variables', 2, ['scope']),
    P('P2', 'June 2019', 'Q1(f)', 'Selection', 38, 'complete an if statement for two bonus tiers that mix and / or on sales and income', 4, ['logical-operators', 'elif-chains', 'complete-the-code'], ['m15-ex-sb-garden', 'm15-ex-sb-cakes']),
    P('P2', 'June 2019', 'Q1(g)', 'Validation', 39, 'describe two further validation tests for a fixed-format registration code and give failing examples for each', 4, ['validation', 'input-validation'], ['m15-ex-vf-code']),
    P('P2', 'June 2019', 'Q2(a)', 'Games', 40, 'turn pseudocode for a number-guessing game (random 1 to 10, counting guesses) into Python', 10, ['while-loops', 'random-math', 'pseudocode-to-python'], ['m15-ex-g-higherlower']),
    P('P2', 'June 2019', 'Q2(b)', 'Reading code', 41, 'read a physics-style calculation program: state values, data type, and why brackets are needed', 5, ['reading-code', 'arithmetic', 'data-types']),
    P('P2', 'June 2019', 'Q2(c)', 'Reading code', 42, 'read a text-manipulating subprogram: find an operator, an input line, arguments and parameters, and state the returned value', 7, ['reading-code', 'parameters-return', 'string-slicing'], ['m15-ex-sm-username']),
    P('P2', 'June 2019', 'Q3(a)', 'Files and validation', 44, 'read email addresses from a file and write those without an @ symbol to Error.txt', 6, ['files-reading', 'files-writing', 'validation'], ['m15-ex-vf-emails']),
    P('P2', 'June 2019', 'Q3(b)', 'Sorting theory', 44, 'explain a drawback of merge sort on large data sets', 2, ['merge-sort', 'algorithm-efficiency']),
    P('P2', 'June 2019', 'Q3(c)', 'Loops', 44, 'repeat: input a number from 1 to 50 and show its square and cube, stopping when the number is outside the range', 6, ['while-loops', 'input-validation'], ['m15-ex-vf-pin']),
    P('P2', 'June 2019', 'Q5', 'Arrays', 45, 'analyse pupil reading data: totals, average, pupils below a threshold and the three highest (medals)', 20, ['list-algorithms', 'list-loops'], ['m15-ex-a1-medals', 'm15-ex-a1-delays']),
    P('P2', 'June 2019', 'Q4(a)-(c)', 'Encryption', 110, 'decode and judge a symbol-substitution (pigpen style) cipher grid', 7, ['caesar-cipher']),
    P('P1', 'May 2019', 'Q6(b)', 'Pseudocode', 34, 'complete a partly written pseudocode algorithm that sorts ships by their registered state', null, ['pseudocode-to-python', 'flowchart-to-code'], []),
    P('P1', 'May 2019', 'Q6(c)', 'Pseudocode', 35, 'read a pseudocode loop on cargo weights and say what it outputs', null, ['reading-code', 'trace-tables'], []),
    P('P1', 'May 2019', 'Q6(c)(i)', 'Trace tables', 36, 'say what trace tables are used for and complete one for a short algorithm', null, ['trace-tables'], []),

    /* ---------------- June 2020 (Paper 2) ---------------- */
    P('P2', 'June 2020', 'Q1(a)', 'Operators', 52, 'pick the item that is not an arithmetic operator', 1, ['arithmetic']),
    P('P2', 'June 2020', 'Q1(b)', 'Data types', 52, 'state the two values a Boolean can hold', 1, ['data-types']),
    P('P2', 'June 2020', 'Q1(c)', 'Amend the code', 53, 'fix three errors in a program that multiplies two whole numbers', 3, ['amend-the-code', 'input-casting'], ['m15-ex-ae-discount', 'm15-ex-ae-stock']),
    P('P2', 'June 2020', 'Q1(d)', 'Variables', 53, 'state what a variable is', 1, ['variables']),
    P('P2', 'June 2020', 'Q1(e)', 'Reading code', 53, 'inspect a sum-of-numbers program: locate a logic operator and a subprogram definition, name numeric and string variables', 4, ['reading-code', 'data-types']),
    P('P2', 'June 2020', 'Q2(a)', 'Pseudocode to code', 54, 'turn pseudocode for a triangle area program, with a loop that repeats until the height is 1 to 100, into Python', 10, ['pseudocode-to-python', 'input-validation', 'while-loops'], ['m15-ex-vf-pin', 'm15-ex-sm-bmi']),
    P('P2', 'June 2020', 'Q2(b)', 'Problem solving', 55, 'work out the number of fence panels around a rectangular site that needs a gap for access', 7, ['arithmetic', 'input-casting'], ['m15-ex-mt-shop']),
    P('P2', 'June 2020', 'Q4(a)', 'Selection', 56, 'complete a four-outcome if statement on two test scores (both low, one low, both high, other)', 6, ['elif-chains', 'logical-operators'], ['m15-ex-sb-results']),
    P('P2', 'June 2020', 'Q4(b)', 'Menus', 56, 'complete a menu program whose options are subprograms: list pupils under 75% and count those at 90% or more', 7, ['menus', 'procedures-functions', 'functions-and-lists'], ['m15-ex-sm-gym']),
    P('P2', 'June 2020', 'Q5(a)', 'Validation', 57, 'give two further validation tests for a ten-character stock code with failing examples', 4, ['validation', 'test-data'], ['m15-ex-vf-code']),
    P('P2', 'June 2020', 'Q5(b)', 'Searching theory', 57, 'compare advantages and disadvantages of linear and binary search', 4, ['linear-search', 'binary-search', 'algorithm-efficiency']),
    P('P2', 'June 2020', 'Q5(c)', 'Subprograms', 58, 'give similarities and one difference between a function and a procedure', 4, ['procedures-functions', 'functions-intro']),
    P('P2', 'June 2020', 'Q6', 'Tables', 59, 'process a sales table: total per person, team total, and the two highest people with their names', 20, ['two-d-loops', 'two-d-algorithms'], ['m15-ex-a2-gradebook', 'm15-ex-a2-columns']),
    P('P2', 'June 2020', 'Q3(c)', 'Encryption', 117, 'encrypt a word with a zig-zag rail fence cipher and show working', 4, ['caesar-cipher'], ['m15-ex-ce-railfence']),
    P('P2', 'June 2020', 'Q3(c)(ii)', 'Encryption theory', 118, 'explain one reason the rail fence cipher is weak', 2, ['caesar-cipher']),

    /* ---------------- June 2021 (Paper 2) ---------------- */
    P('P2', 'June 2021', 'Q1(a)', 'Logic operators', 62, 'pick the logic operator from four options', 1, ['logical-operators']),
    P('P2', 'June 2021', 'Q1(b)', 'Arrays', 62, 'describe a difference between a one-dimensional and a two-dimensional array', 2, ['two-d-basics', 'list-basics']),
    P('P2', 'June 2021', 'Q1(c)', 'Amend the code', 62, 'fix three errors in a program that works out how many 20-pound notes make up an amount and the change left', 3, ['amend-the-code', 'arithmetic'], ['m15-ex-ae-bill', 'm15-ex-ae-multiples']),
    P('P2', 'June 2021', 'Q1(d)', 'Comments', 63, 'add comments at the lines where a comparison, a loop, a selection and a data structure begin', 4, ['comments-style', 'reading-code']),
    P('P2', 'June 2021', 'Q2(b)', 'Selection', 64, 'complete an if statement with four outcomes on books sold and profit', 4, ['elif-chains', 'logical-operators'], ['m15-ex-sb-cakes']),
    P('P2', 'June 2021', 'Q2(c)', 'Test data', 65, 'fill in boundary test data and expected outputs for the books and profit conditions', 3, ['test-data'], ['m15-ex-td-depth', 'm15-ex-td-pizza']),
    P('P2', 'June 2021', 'Q5', 'Games and menus', 66, 'finish a quiz with a three-option menu: choose each question once, check typed answers, keep a score, show the result', 20, ['menus', 'files-subprograms', 'list-algorithms'], ['m15-ex-g-picker', 'm15-ex-sm-gym']),
    P('P2', 'June 2021', 'Q3(a)', 'Caesar cipher', 123, 'extend a Caesar program: validate a key from 1 to 25, write the ciphertext to Cipher.txt and display it', 8, ['caesar-cipher', 'files-writing', 'input-validation'], ['m15-ex-ce-caesarfile']),
    P('P2', 'June 2021', 'Q3(b)', 'Encryption theory', 123, 'explain one reason the Caesar cipher is a weak form of encryption', 2, ['caesar-cipher']),
    P('P2', 'June 2021', 'Q3(c)', 'Vigenere cipher', 124, 'use a Vigenere square to encrypt a short word with a keyword', 4, ['caesar-cipher'], ['m15-ex-ce-vigenere']),
    P('P2', 'June 2021', 'Q3(d)', 'Subprograms', 125, 'read a call to a user-defined cipher function: what it returns, a parameter, and what built-in means', 3, ['parameters-return', 'reading-code'], ['m15-ex-ce-vigenere']),
    P('P2', 'June 2020', 'Q5(b)(i)-(ii)', 'Linear search', 21, 'repeat of the linear-versus-binary comparison: advantages and disadvantages (topical copy)', 4, ['linear-search', 'algorithm-efficiency']),
    P('P2', 'June 2021', 'Q15', 'Linear search', 22, 'describe in steps how a linear search finds an item', 3, ['linear-search'], ['m15-ex-ss-linear']),
    P('P2', 'June 2021', 'Q16', 'Binary search', 23, 'explain an advantage of binary search and the most items it must examine on a short list', 5, ['binary-search', 'algorithm-efficiency'], ['m15-ex-ss-binary']),

    /* ---------------- November 2021 (Paper 2) ---------------- */
    P('P2', 'Nov 2021', 'Q1(a)', 'Good practice', 69, 'give a technique that makes code easy to read', 1, ['comments-style']),
    P('P2', 'Nov 2021', 'Q1(b)', 'Errors', 69, 'classify three described mistakes as logic, syntax or runtime errors', 3, ['errors-debugging']),
    P('P2', 'Nov 2021', 'Q1(c)', 'Flowcharts', 70, 'recognise a decision box with one branch as the selection construct', 1, ['flowcharts', 'decomposition-abstraction']),
    P('P2', 'Nov 2021', 'Q1(d)', 'Amend the code', 70, 'fix three errors in a program that compares two numbers and prints a message', 3, ['amend-the-code', 'if-else'], ['m15-ex-ae-discount']),
    P('P2', 'Nov 2021', 'Q1(e)', 'Loops', 71, 'print a 1 to 12 multiplication table for an entered number in a given layout', 5, ['for-loops', 'formatting-output'], ['m15-ex-ae-multiples']),
    P('P2', 'Nov 2021', 'Q3(a)', 'Reading code', 72, 'inspect a days-in-a-month program: local variable, data structure, built-in and user functions, parameter, then test data types for the 1 to 12 check', 7, ['reading-code', 'test-data', 'scope']),
    P('P2', 'Nov 2021', 'Q3(b)', 'Subprograms', 73, 'explain why parameters are used to pass data into subprograms', 2, ['parameters-return']),
    P('P2', 'Nov 2021', 'Q3(c)', 'Selection', 73, 'write a leap-year check from the divisibility rules', 6, ['logical-operators', 'selection-patterns'], ['m15-ex-sb-ride']),
    P('P2', 'Nov 2021', 'Q5', 'Strings and arrays', 74, 'search an array of words: show those starting with, or containing, an input word, count them, and report the longest and shortest; repeat until exit', 20, ['string-methods', 'list-algorithms', 'string-patterns'], ['m15-ex-tf-longest', 'm15-ex-a1-extremes']),
    P('P2', 'Nov 2021', 'Q4(a)', 'Binary', 130, 'validate an 8-character binary pattern, repeat until valid, convert it to denary and print a message', 11, ['binary-hex', 'input-validation'], ['m15-ex-ce-binary']),
    P('P2', 'Nov 2021', 'Q4(b)', 'Reading code', 131, 'describe in words what a given program does', 2, ['reading-code']),
    P('P2', 'Nov 2021', 'Q11', 'Merge sort', 19, 'show the splitting and merging stages of a merge sort on nine numbers', 5, ['merge-sort'], ['m15-ex-ss-merge']),
    P('P2', 'Nov 2021', 'Q17', 'Binary search', 24, 'complete a partly written binary search that tracks start, end, middle and a found flag', 10, ['binary-search', 'complete-the-code'], ['m15-ex-ss-binary']),

    /* ---------------- June 2022 (Paper 2) ---------------- */
    P('P2', 'June 2022', 'Q1(a)', 'Variables', 79, 'pick the correct description of a variable', 1, ['variables']),
    P('P2', 'June 2022', 'Q1(b)', 'Good practice', 79, 'pick the technique that improves readability', 1, ['comments-style']),
    P('P2', 'June 2022', 'Q1(c)', 'Data types', 79, 'give an example value for char and real types', 2, ['data-types']),
    P('P2', 'June 2022', 'Q1(d)', 'Test data', 80, 'say how boundary test data differs from erroneous test data', 2, ['test-data'], ['m15-ex-td-locker']),
    P('P2', 'June 2022', 'Q1(e)', 'Errors', 80, 'name the type of error when a program runs but gives a wrong value', 1, ['errors-debugging']),
    P('P2', 'June 2022', 'Q1(f)', 'Amend the code', 80, 'fix three errors in a program that works out the area of a square', 3, ['amend-the-code'], ['m15-ex-ae-rectangle', 'm15-ex-ae-temps']),
    P('P2', 'June 2022', 'Q1(g)', 'Strings', 80, 'complete an if statement comparing an input letter with a stored letter (before, after or same)', 4, ['comparisons', 'elif-chains', 'complete-the-code'], ['m15-ex-sb-word']),
    P('P2', 'June 2022', 'Q2(a)', 'Reading pseudocode', 82, 'answer questions about a prime-number function in pseudocode: where selection and iteration start, local variable, parameter', 5, ['reading-code', 'procedures-functions']),
    P('P2', 'June 2022', 'Q2(b)', 'Subprograms', 82, 'write the prime-number function and the calling code from the pseudocode', 11, ['pseudocode-to-python', 'procedures-functions'], ['m15-ex-sm-prime']),
    P('P2', 'June 2022', 'Q3', 'Selection', 83, 'work out the price per book from quantity bands and display price and total cost', 6, ['elif-chains', 'selection-patterns'], ['m15-ex-sb-stickers']),
    P('P2', 'June 2022', 'Q5(a)', 'Files and validation', 84, 'check passwords in a file (first character, a digit), display the rejected ones and count them', 9, ['files-reading', 'validation', 'string-methods'], ['m15-ex-vf-passwords']),
    P('P2', 'June 2022', 'Q6', 'Games', 85, 'build a guess-the-word game: random word from a list, attempts from word length, stores for right and wrong letters, own subprograms and comments', 20, ['functions-and-lists', 'string-traversal', 'list-algorithms'], ['m15-ex-g-wordguess']),
    P('P2', 'June 2022', 'Q4', 'Encryption', 137, 'work out the key, the ciphertext and the name of the algorithm from a diagram of a text-scrambling cipher', 7, ['caesar-cipher'], ['m15-ex-ce-railfence']),
    P('P2', 'June 2022', 'Q9(b)', 'Bubble sort', 17, 'complete a table showing the list after each pass of a bubble sort of six scores', 3, ['bubble-sort'], ['m15-ex-ss-bubble']),
    P('P2', 'June 2022', 'Q18', 'Efficiency', 25, 'compare the efficiency of searching algorithms', 3, ['algorithm-efficiency', 'binary-search']),

    /* ---------------- June 2023 (Paper 2) ---------------- */
    P('P2', 'June 2023', 'Q1(b)', 'Reading code', 89, 'inspect a tax program: comment text, logical operator, global variable, constant, parameter', 5, ['reading-code', 'scope']),
    P('P2', 'June 2023', 'Q1(c)', 'Constants', 89, 'state what a constant is for and one benefit of using one', 2, ['variables']),
    P('P2', 'June 2023', 'Q2(a)', 'Subprograms', 90, 'reasons for subprogram libraries, which subprogram must return a result, and the meaning of local variable', 4, ['procedures-functions', 'scope']),
    P('P2', 'June 2023', 'Q2(b)(i)', 'Test data', 91, 'give normal, boundary and erroneous values for a two-field booking rule (adults and children)', 3, ['test-data'], ['m15-ex-td-pizza']),
    P('P2', 'June 2023', 'Q2(b)(ii)', 'Amend the code', 91, 'fix four errors in a stock-check program using given test data to find them', 4, ['amend-the-code'], ['m15-ex-ae-bill', 'm15-ex-ae-stock']),
    P('P2', 'June 2023', 'Q12(a)', 'Merge sort', 20, 'complete a descending merge sort on a list of tuna species in three passes', 2, ['merge-sort'], ['m15-ex-ss-merge']),
    P('P2', 'June 2023', 'Q5(c)', 'Files', 92, 'write records from an array to a file with a numbered code field starting at 101 and comma separators', 6, ['files-writing', 'files-2d'], ['m15-ex-tf-records']),
    P('P2', 'June 2023', 'Q6', 'Arrays', 93, 'process parallel arrays about dairy breeds: daily volume per breed, herd total, labelled output and the recommended breed', 20, ['list-algorithms', 'two-d-algorithms', 'records'], ['m15-ex-a1-medals', 'm15-ex-a2-columns']),
    P('P2', 'June 2023', 'Q4(a)', 'Caesar cipher', 143, 'apply Caesar shifts (including negative), compare two combined shifts and spot the fault in a faulty cipher', 6, ['caesar-cipher'], ['m15-ex-ce-decrypt']),
    P('P2', 'June 2023', 'Q4(b)', 'Strings', 144, 'validate a two-letter word, then build a key from a whole number, the reversed word and the whole part of a decimal', 8, ['string-slicing', 'input-validation'], ['m15-ex-sm-username']),

    /* ---------------- June 2024 (Paper 2) ---------------- */
    P('P2', 'June 2024', 'Q1(a)', 'Abstraction', 95, 'identify the meaning of abstraction', 1, ['decomposition-abstraction']),
    P('P2', 'June 2024', 'Q1(b)', 'Selection', 95, 'complete a program that welcomes a user younger than 30', 4, ['complete-the-code', 'if-else']),
    P('P2', 'June 2024', 'Q1(c)', 'Reading code', 96, 'inspect a program: comment text, variable creation line, selection keyword, logical operator', 4, ['reading-code']),
    P('P2', 'June 2024', 'Q1(d)', 'Records', 96, 'tell which set of data needs a record rather than an array', 1, ['records']),
    P('P2', 'June 2024', 'Q1(e)', 'Data types', 96, 'give the data type for a decimal and a True value', 2, ['data-types']),
    P('P2', 'June 2024', 'Q2(a)', 'Design', 97, 'name a step-by-step description of a task and a changeable memory location', 2, ['decomposition-abstraction', 'variables']),
    P('P2', 'June 2024', 'Q2(b)', 'Errors', 97, 'state what a runtime error is and give an example', 2, ['errors-debugging']),
    P('P2', 'June 2024', 'Q2(c)', 'Amend the code', 98, 'fix three errors in a random-width rectangle perimeter program', 3, ['amend-the-code', 'random-math'], ['m15-ex-ae-rectangle']),
    P('P2', 'June 2024', 'Q2(d)', 'Test data', 98, 'choose two erroneous, one normal and one boundary value for a text field with a length rule', 4, ['test-data'], ['m15-ex-td-locker', 'm15-ex-td-passlen']),
    P('P2', 'June 2024', 'Q3(a)', 'Logic', 99, 'complete a truth table for OR, NOT and a combined expression', 4, ['logical-operators']),
    P('P2', 'June 2024', 'Q3(b)', 'Lists', 99, 'amend a loop so it displays every other name in an array', 4, ['list-loops', 'for-loops'], ['m15-ex-a1-findall']),
    P('P2', 'June 2024', 'Q3(c)', 'Validation', 100, 'fix the messages a number-validation program gives for empty, negative, zero and banded inputs', 6, ['input-validation', 'elif-chains'], ['m15-ex-td-weight']),
    P('P2', 'June 2024', 'Q4(c)', 'Subprograms', 101, 'complete a subprogram that joins parts of a string and a number into a key, and complete its call', 6, ['parameters-return', 'complete-the-code'], ['m15-ex-sm-username']),
    P('P2', 'June 2024', 'Q5(c)', 'Files', 102, 'read lines of numbers from a sales file and show each line subtotal plus a grand total', 8, ['files-reading', 'files-2d'], ['m15-ex-tf-weekly']),
    P('P2', 'June 2024', 'Q6', '2D arrays', 103, 'process a 2D array of word pairs: number each pair, show the longer word indented, and correct any pair out of alphabetical order', 20, ['two-d-loops', 'string-methods'], ['m15-ex-a2-pairs']),
    P('P2', 'June 2024', 'Q4(a)', 'Variables and scope', 30, 'say where global variables are created and where local variables can be used', 2, ['scope']),
    P('P2', 'June 2024', 'Q4(b)', 'Efficiency', 30, 'explain why nested if / else is more efficient than separate if statements for number ranges', 2, ['elif-chains', 'algorithm-efficiency']),
    P('P2', 'June 2024', 'Q5(a)', 'Lists', 32, 'improve repeated checks against separate variables by using a list that works for any number of items', 2, ['list-loops', 'linear-search']),
    P('P2', 'June 2024', 'Q5(b)', 'Binary search', 33, 'complete a table of high, low and middle index values for a binary search that does not find its target', 4, ['binary-search'], ['m15-ex-ss-binary']),
  ];
})();

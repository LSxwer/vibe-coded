import { Exercise } from '../types';

export const C_EXERCISES: Exercise[] = [
  {
    id: 'ex-hello-world',
    title: '1. Hello, Modern C++!',
    category: 'Basics & Syntax',
    difficulty: 'beginner',
    shortDescription: 'Write your first C++ program using std::cout and standard headers.',
    instructions: [
      'Include the `<iostream>` header library to enable input/output stream operations.',
      'Inside the `main()` function, print `"Hello, C++ World!"` followed by a newline or `std::endl`.',
      'Return `0` at the end of the `main()` function to indicate successful termination.',
    ],
    learningPoints: [
      '#include <iostream> brings in the standard I/O stream declarations.',
      'std::cout is the standard character output stream object.',
      'The << operator is known as the stream insertion operator.',
      'Every executable C++ program requires exactly one entry-point main() function.',
    ],
    starterCode: `#include <iostream>

int main() {
    // TODO: Print "Hello, C++ World!" to the console
    
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    std::cout << "Hello, C++ World!" << std::endl;
    return 0;
}`,
    explanation: 'In C++, std::cout is used in conjunction with the insertion operator << to stream characters to standard output. std::endl writes a newline character and flushes the stream buffer.',
    hints: [
      'Remember to use std::cout << "your text here" << std::endl;',
      'Ensure the string matches "Hello, C++ World!" exactly, including capitalization and punctuation.',
      'Do not forget the semicolon ; at the end of your statement!',
    ],
    testCases: [
      {
        id: 'tc-1',
        input: '',
        expectedOutput: 'Hello, C++ World!',
        description: 'Standard hello world output check',
      },
    ],
  },
  {
    id: 'ex-variables-math',
    title: '2. Variables, Arithmetic & cin',
    category: 'Variables & Types',
    difficulty: 'beginner',
    shortDescription: 'Read two integers from standard input and print their sum, difference, and product.',
    instructions: [
      'Declare two integer variables `a` and `b`.',
      'Read both integers from `std::cin`.',
      'Calculate and print `Sum: <sum>`, `Diff: <diff>`, and `Prod: <prod>` on separate lines.',
    ],
    learningPoints: [
      'int declares 32-bit signed integers in standard modern environments.',
      'std::cin >> a >> b extracts whitespace-separated inputs.',
      'Variables in C++ must be declared with a strict data type before use.',
    ],
    starterCode: `#include <iostream>

int main() {
    int a, b;
    // TODO: Read a and b from std::cin
    // TODO: Output Sum: <a+b>
    // TODO: Output Diff: <a-b>
    // TODO: Output Prod: <a*b>
    
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int a, b;
    if (std::cin >> a >> b) {
        std::cout << "Sum: " << (a + b) << std::endl;
        std::cout << "Diff: " << (a - b) << std::endl;
        std::cout << "Prod: " << (a * b) << std::endl;
    }
    return 0;
}`,
    explanation: 'Using std::cin >> var extracts input tokens. We then perform standard arithmetic operations (+, -, *) and format the output strings with labels.',
    hints: [
      'Use std::cin >> a >> b; to read two integers separated by space or newline.',
      'Output format should strictly be: "Sum: 15", "Diff: 5", "Prod: 50" for inputs 10 and 5.',
    ],
    defaultStdin: '10 5',
    testCases: [
      {
        id: 'tc-1',
        input: '10 5',
        expectedOutput: 'Sum: 15\nDiff: 5\nProd: 50',
        description: 'Inputs: 10 and 5',
      },
      {
        id: 'tc-2',
        input: '20 4',
        expectedOutput: 'Sum: 24\nDiff: 16\nProd: 80',
        description: 'Inputs: 20 and 4',
      },
    ],
  },
  {
    id: 'ex-control-flow-evenodd',
    title: '3. Conditionals & Number Classifier',
    category: 'Control Flow',
    difficulty: 'beginner',
    shortDescription: 'Check if an integer is Positive, Negative, or Zero, and if it is Even or Odd.',
    instructions: [
      'Read one integer `n` from `std::cin`.',
      'If `n == 0`, print `"Zero"`.',
      'If `n > 0`, print `"Positive Even"` or `"Positive Odd"`.',
      'If `n < 0`, print `"Negative Even"` or `"Negative Odd"`.',
    ],
    learningPoints: [
      'if, else if, and else provide branch logic.',
      'The modulo operator % returns the remainder of integer division.',
      'Boolean operators (&&, ||) combine conditions.',
    ],
    starterCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    
    // TODO: Check if n is Zero, Positive/Negative, and Even/Odd
    
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n) {
        if (n == 0) {
            std::cout << "Zero" << std::endl;
        } else if (n > 0) {
            if (n % 2 == 0) {
                std::cout << "Positive Even" << std::endl;
            } else {
                std::cout << "Positive Odd" << std::endl;
            }
        } else {
            if (n % 2 == 0) {
                std::cout << "Negative Even" << std::endl;
            } else {
                std::cout << "Negative Odd" << std::endl;
            }
        }
    }
    return 0;
}`,
    explanation: 'We branch on whether n is 0, > 0, or < 0. For non-zero numbers, we test if n % 2 == 0 to determine even parity.',
    hints: [
      'First check if n == 0.',
      'Then handle positive and negative branches, checking n % 2 == 0 inside each.',
    ],
    defaultStdin: '7',
    testCases: [
      { id: 'tc-1', input: '7', expectedOutput: 'Positive Odd', description: 'Positive odd test' },
      { id: 'tc-2', input: '-4', expectedOutput: 'Negative Even', description: 'Negative even test' },
      { id: 'tc-3', input: '0', expectedOutput: 'Zero', description: 'Zero test' },
    ],
  },
  {
    id: 'ex-loops-factorial',
    title: '4. Loops & Factorial Calculator',
    category: 'Loops & Iteration',
    difficulty: 'easy',
    shortDescription: 'Calculate the factorial of a non-negative integer using a for loop.',
    instructions: [
      'Read an integer `n` from input (where 0 <= n <= 12).',
      'Compute `n!` (factorial: 1 * 2 * 3 * ... * n). Note that 0! = 1.',
      'Print `"Factorial of " << n << " is " << result`.',
    ],
    learningPoints: [
      'for loops have initialization, condition check, and increment steps: for (int i = 1; i <= n; ++i).',
      'Factorials grow rapidly; long long or unsigned long long is often preferred for large factorials.',
      '0! is mathematically defined as 1.',
    ],
    starterCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    
    long long result = 1;
    // TODO: Write a loop to compute the factorial
    
    // TODO: Print "Factorial of <n> is <result>"
    
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n) {
        long long result = 1;
        for (int i = 1; i <= n; ++i) {
            result *= i;
        }
        std::cout << "Factorial of " << n << " is " << result << std::endl;
    }
    return 0;
}`,
    explanation: 'We initialize result to 1. If n is 0, the loop body never runs and result remains 1. For n > 0, we multiply result by each integer from 1 to n.',
    hints: [
      'Start your loop at int i = 1 up to i <= n.',
      'Inside the loop: result *= i;',
    ],
    defaultStdin: '5',
    testCases: [
      { id: 'tc-1', input: '5', expectedOutput: 'Factorial of 5 is 120', description: 'Factorial 5' },
      { id: 'tc-2', input: '0', expectedOutput: 'Factorial of 0 is 1', description: 'Factorial 0' },
      { id: 'tc-3', input: '6', expectedOutput: 'Factorial of 6 is 720', description: 'Factorial 6' },
    ],
  },
  {
    id: 'ex-functions-swap-ref',
    title: '5. Pass-by-Reference & Swap Function',
    category: 'Functions & References',
    difficulty: 'easy',
    shortDescription: 'Implement a function that swaps two integers in-place using C++ references.',
    instructions: [
      'Write a function `void swapNumbers(int& x, int& y)` that swaps the values of `x` and `y`.',
      'In `main()`, read two integers `a` and `b`, print them before swap, call `swapNumbers(a, b)`, and print them after swap.',
      'Output format:\n`Before: a = <a>, b = <b>`\n`After: a = <a>, b = <b>`',
    ],
    learningPoints: [
      'Pass-by-value makes a copy of arguments, leaving original variables unchanged.',
      'Pass-by-reference (int& x) creates an alias for the actual caller variable.',
      'Modifying a reference directly modifies the original variable without pointers or dereference syntax.',
    ],
    starterCode: `#include <iostream>

// TODO: Implement swapNumbers using references (int& x, int& y)
void swapNumbers(/* arguments */) {
    // Write swap logic here
}

int main() {
    int a, b;
    std::cin >> a >> b;
    
    std::cout << "Before: a = " << a << ", b = " << b << std::endl;
    
    // TODO: Call swapNumbers(a, b);
    
    std::cout << "After: a = " << a << ", b = " << b << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

void swapNumbers(int& x, int& y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a, b;
    if (std::cin >> a >> b) {
        std::cout << "Before: a = " << a << ", b = " << b << std::endl;
        swapNumbers(a, b);
        std::cout << "After: a = " << a << ", b = " << b << std::endl;
    }
    return 0;
}`,
    explanation: 'By adding & to the parameter types (int& x, int& y), x and y become references (aliases) to the variables a and b passed from main. Modifying x and y swaps the actual contents of a and b.',
    hints: [
      'Function signature: void swapNumbers(int& x, int& y)',
      'Use a temporary variable: int temp = x; x = y; y = temp;',
    ],
    defaultStdin: '100 200',
    testCases: [
      {
        id: 'tc-1',
        input: '100 200',
        expectedOutput: 'Before: a = 100, b = 200\nAfter: a = 200, b = 100',
        description: 'Swap 100 and 200',
      },
      {
        id: 'tc-2',
        input: '42 99',
        expectedOutput: 'Before: a = 42, b = 99\nAfter: a = 99, b = 42',
        description: 'Swap 42 and 99',
      },
    ],
  },
  {
    id: 'ex-pointers-basics',
    title: '6. Pointers & Memory Dereferencing',
    category: 'Pointers & Memory',
    difficulty: 'easy',
    shortDescription: 'Master the address-of (&) and dereference (*) operators.',
    instructions: [
      'Declare an integer `num = 42`.',
      'Declare a pointer `int* ptr` pointing to `num` using the address-of operator `&num`.',
      'Print the value pointed to by `ptr` using `*ptr`.',
      'Modify `num` indirectly through `*ptr = 99`.',
      'Print `"Modified num: " << num`.',
    ],
    learningPoints: [
      'A pointer holds the memory address of another variable.',
      '& operator retrieves the address of a variable in RAM.',
      '* operator (dereference) accesses or modifies the value stored at that address.',
    ],
    starterCode: `#include <iostream>

int main() {
    int num = 42;
    
    // TODO 1: Declare a pointer ptr that stores the address of num
    
    // TODO 2: Print "Original value: " << *ptr
    
    // TODO 3: Change the value of num to 99 via ptr
    
    // TODO 4: Print "Modified num: " << num
    
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int num = 42;
    int* ptr = &num;
    
    std::cout << "Original value: " << *ptr << std::endl;
    *ptr = 99;
    std::cout << "Modified num: " << num << std::endl;
    
    return 0;
}`,
    explanation: 'int* ptr = &num assigns the memory address of num to ptr. Dereferencing *ptr accesses the exact memory cell of num. Thus, *ptr = 99 directly updates num to 99.',
    hints: [
      'To declare pointer: int* ptr = &num;',
      'To dereference: *ptr = 99;',
    ],
    testCases: [
      {
        id: 'tc-1',
        input: '',
        expectedOutput: 'Original value: 42\nModified num: 99',
        description: 'Pointer dereference and mutation check',
      },
    ],
  },
  {
    id: 'ex-vector-stl',
    title: '7. Dynamic Arrays with std::vector',
    category: 'STL & Data Structures',
    difficulty: 'easy',
    shortDescription: 'Store numbers dynamically in a vector, filter even numbers, and calculate their sum.',
    instructions: [
      'Include `<vector>` and `<numeric>` headers.',
      'Read integer `count` from `cin`, followed by `count` integers into a `std::vector<int>`.',
      'Iterate through the vector, print all even numbers on one line separated by spaces, preceded by `"Evens: "`.',
      'Print `"Sum of evens: " << sum` on the next line.',
    ],
    learningPoints: [
      'std::vector is a dynamically-sized sequence container in C++.',
      '.push_back(val) appends an element to the back.',
      'Range-based for loops: for (int x : vec) offer clean iteration.',
      '.size() returns the number of elements.',
    ],
    starterCode: `#include <iostream>
#include <vector>

int main() {
    int count;
    std::cin >> count;
    
    std::vector<int> numbers;
    // TODO: Read count numbers into the vector
    
    // TODO: Print "Evens: " followed by all even numbers separated by space
    
    // TODO: Print "Sum of evens: <sum>"
    
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <vector>

int main() {
    int count;
    if (std::cin >> count) {
        std::vector<int> numbers;
        for (int i = 0; i < count; ++i) {
            int val;
            std::cin >> val;
            numbers.push_back(val);
        }
        
        std::cout << "Evens: ";
        int sum = 0;
        bool first = true;
        for (int num : numbers) {
            if (num % 2 == 0) {
                if (!first) std::cout << " ";
                std::cout << num;
                first = false;
                sum += num;
            }
        }
        std::cout << std::endl;
        std::cout << "Sum of evens: " << sum << std::endl;
    }
    return 0;
}`,
    explanation: 'We populate the std::vector using .push_back(). We then iterate through the elements using a range-based for loop, testing num % 2 == 0 to filter even values.',
    hints: [
      'Use numbers.push_back(val); inside a loop to populate the vector.',
      'Use a range-based for loop: for (int x : numbers) to inspect each element.',
    ],
    defaultStdin: '6\n1 2 3 4 5 6',
    testCases: [
      {
        id: 'tc-1',
        input: '6\n1 2 3 4 5 6',
        expectedOutput: 'Evens: 2 4 6\nSum of evens: 12',
        description: '6 numbers: 1 to 6',
      },
      {
        id: 'tc-2',
        input: '5\n10 15 20 25 30',
        expectedOutput: 'Evens: 10 20 30\nSum of evens: 60',
        description: 'Multiples of 5',
      },
    ],
  },
  {
    id: 'ex-classes-oop-bank',
    title: '8. Classes & Encapsulation',
    category: 'Object-Oriented Programming',
    difficulty: 'intermediate',
    shortDescription: 'Build a secure BankAccount class with private balance, deposit, withdraw, and display methods.',
    instructions: [
      'Create a class `BankAccount` with:',
      '  - Private member: `std::string owner_` and `double balance_`.',
      '  - Constructor: `BankAccount(std::string owner, double initialBalance)`',
      '  - `void deposit(double amount)`: increases balance.',
      '  - `bool withdraw(double amount)`: decreases balance if sufficient funds and returns true, else prints `"Insufficient funds"` and returns false.',
      '  - `void printSummary() const`: prints `"Account [<owner>]: $<balance>"`.',
      'In `main()`, instantiate an account for `"Alice"` with `$100.0`, deposit `$50.0`, withdraw `$30.0`, attempt to withdraw `$200.0`, and print the final summary.',
    ],
    learningPoints: [
      'Encapsulation hides sensitive data inside private access specifiers.',
      'Member methods declared public provide the controlled interface to interact with data.',
      'const member methods guarantee that calling them will not mutate the object state.',
    ],
    starterCode: `#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner_;
    double balance_;

public:
    // TODO: Constructor
    
    // TODO: deposit(double amount)
    
    // TODO: withdraw(double amount)
    
    // TODO: printSummary() const
};

int main() {
    BankAccount acc("Alice", 100.0);
    acc.deposit(50.0);
    acc.withdraw(30.0);
    acc.withdraw(200.0);
    acc.printSummary();
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner_;
    double balance_;

public:
    BankAccount(std::string owner, double initialBalance)
        : owner_(owner), balance_(initialBalance) {}

    void deposit(double amount) {
        if (amount > 0) {
            balance_ += amount;
        }
    }

    bool withdraw(double amount) {
        if (amount > balance_) {
            std::cout << "Insufficient funds" << std::endl;
            return false;
        }
        balance_ -= amount;
        return true;
    }

    void printSummary() const {
        std::cout << "Account [" << owner_ << "]: $" << balance_ << std::endl;
    }
};

int main() {
    BankAccount acc("Alice", 100.0);
    acc.deposit(50.0);
    acc.withdraw(30.0);
    acc.withdraw(200.0);
    acc.printSummary();
    return 0;
}`,
    explanation: 'The BankAccount class protects balance_ by keeping it private. The withdraw method guards against negative balances by checking amount > balance_ before modifying state.',
    hints: [
      'Use member initializer list in constructor: BankAccount(...) : owner_(owner), balance_(initialBalance) {}',
      'Print "Insufficient funds" when amount exceeds balance in withdraw().',
    ],
    testCases: [
      {
        id: 'tc-1',
        input: '',
        expectedOutput: 'Insufficient funds\nAccount [Alice]: $120',
        description: 'Test deposit, valid withdraw, overdraft attempt, and summary',
      },
    ],
  },
  {
    id: 'ex-smart-pointers-raii',
    title: '9. Modern Memory & std::unique_ptr (RAII)',
    category: 'Memory & Modern C++',
    difficulty: 'intermediate',
    shortDescription: 'Use modern smart pointers (std::unique_ptr) to eliminate memory leaks automatically.',
    instructions: [
      'Include `<memory>`.',
      'Observe the struct `Resource` with constructor and destructor printing lifetime events.',
      'Inside `main()`, allocate a `Resource` on the heap using `std::make_unique<Resource>("DatabaseConnection")`.',
      'Call `res->use()` to perform work.',
      'Notice how the resource is automatically deallocated upon leaving scope without calling `delete`!',
    ],
    learningPoints: [
      'RAII (Resource Acquisition Is Initialization) ties resource lifespan to object scope.',
      'std::unique_ptr represents exclusive ownership of a dynamically allocated heap object.',
      'When unique_ptr goes out of scope, its destructor invokes delete automatically, preventing memory leaks.',
    ],
    starterCode: `#include <iostream>
#include <memory>
#include <string>

struct Resource {
    std::string name;
    Resource(std::string n) : name(n) {
        std::cout << "Acquired: " << name << std::endl;
    }
    ~Resource() {
        std::cout << "Released: " << name << std::endl;
    }
    void use() const {
        std::cout << "Using: " << name << std::endl;
    }
};

int main() {
    std::cout << "Entering scope" << std::endl;
    {
        // TODO: Create a std::unique_ptr<Resource> using std::make_unique<Resource>("DatabaseConnection")
        
        // TODO: Call ->use() on your pointer
        
    } // unique_ptr goes out of scope here!
    std::cout << "Exited scope" << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <memory>
#include <string>

struct Resource {
    std::string name;
    Resource(std::string n) : name(n) {
        std::cout << "Acquired: " << name << std::endl;
    }
    ~Resource() {
        std::cout << "Released: " << name << std::endl;
    }
    void use() const {
        std::cout << "Using: " << name << std::endl;
    }
};

int main() {
    std::cout << "Entering scope" << std::endl;
    {
        std::unique_ptr<Resource> res = std::make_unique<Resource>("DatabaseConnection");
        res->use();
    }
    std::cout << "Exited scope" << std::endl;
    return 0;
}`,
    explanation: 'Modern C++ strongly discourages raw new/delete in favor of smart pointers like std::unique_ptr. When the inner scope block closes, res is destroyed, which automatically calls ~Resource().',
    hints: [
      'Use auto res = std::make_unique<Resource>("DatabaseConnection");',
      'Call res->use(); inside the inner braces { }',
    ],
    testCases: [
      {
        id: 'tc-1',
        input: '',
        expectedOutput: 'Entering scope\nAcquired: DatabaseConnection\nUsing: DatabaseConnection\nReleased: DatabaseConnection\nExited scope',
        description: 'Verify RAII acquisition and automated scope destruction',
      },
    ],
  },
  {
    id: 'ex-stl-algorithms-sort',
    title: '10. STL Algorithms & Lambda Expressions',
    category: 'STL & Data Structures',
    difficulty: 'intermediate',
    shortDescription: 'Sort strings by length and transform integers with modern C++ lambdas.',
    instructions: [
      'Include `<algorithm>`, `<vector>`, and `<string>`.',
      'Read `n` words from input.',
      'Use `std::sort` with a custom lambda `[](const std::string& a, const std::string& b) { return a.length() < b.length(); }` to sort strings by length ascending.',
      'If two strings have equal length, sort them alphabetically.',
      'Print the sorted words on a single line separated by spaces.',
    ],
    learningPoints: [
      'std::sort from <algorithm> operates in O(N log N) time.',
      'Lambdas [captures](params) -> ret { body } allow passing inline custom comparator functions.',
      'std::pair or boolean comparison ties can be resolved cleanly.',
    ],
    starterCode: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

int main() {
    int n;
    std::cin >> n;
    
    std::vector<std::string> words(n);
    for (int i = 0; i < n; ++i) {
        std::cin >> words[i];
    }
    
    // TODO: Use std::sort with a lambda comparator
    // Primary sort: shorter length first
    // Secondary sort (tie): alphabetical order
    
    // TODO: Output sorted words separated by space
    
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

int main() {
    int n;
    if (std::cin >> n) {
        std::vector<std::string> words(n);
        for (int i = 0; i < n; ++i) {
            std::cin >> words[i];
        }
        
        std::sort(words.begin(), words.end(), [](const std::string& a, const std::string& b) {
            if (a.length() != b.length()) {
                return a.length() < b.length();
            }
            return a < b;
        });
        
        for (size_t i = 0; i < words.size(); ++i) {
            std::cout << words[i] << (i + 1 < words.size() ? " " : "");
        }
        std::cout << std::endl;
    }
    return 0;
}`,
    explanation: 'We pass a lambda to std::sort. The lambda compares a.length() vs b.length(); if lengths are equal, it compares a < b lexicographically.',
    hints: [
      'In lambda: if (a.length() != b.length()) return a.length() < b.length(); return a < b;',
      'Call std::sort(words.begin(), words.end(), lambda);',
    ],
    defaultStdin: '5\nelephant cat dog butterfly ant',
    testCases: [
      {
        id: 'tc-1',
        input: '5\nelephant cat dog butterfly ant',
        expectedOutput: 'ant cat dog elephant butterfly',
        description: 'Sort 5 animal words by length, then alphabet',
      },
    ],
  },
];

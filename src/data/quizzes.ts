import { QuizQuestion } from '../types';

export const C_QUIZZES: QuizQuestion[] = [
  {
    id: 'quiz-1',
    topic: 'Pointers & Memory',
    difficulty: 'beginner',
    question: 'What is the output of the following C++ code?',
    codeSnippet: `#include <iostream>

int main() {
    int x = 10;
    int* ptr = &x;
    *ptr = 25;
    std::cout << x << " " << *ptr;
    return 0;
}`,
    options: [
      '10 25',
      '25 25',
      '10 10',
      'Compilation error',
    ],
    correctAnswerIndex: 1,
    explanation: '`ptr` stores the memory address of `x`. Dereferencing `*ptr = 25` mutates the value stored at `x`\'s address in memory. Therefore, both `x` and `*ptr` evaluate to 25.',
  },
  {
    id: 'quiz-2',
    topic: 'References vs Values',
    difficulty: 'beginner',
    question: 'What will this program output?',
    codeSnippet: `#include <iostream>

void modify(int a, int& b) {
    a += 5;
    b += 5;
}

int main() {
    int x = 10, y = 10;
    modify(x, y);
    std::cout << x << " " << y;
    return 0;
}`,
    options: [
      '15 15',
      '10 15',
      '15 10',
      '10 10',
    ],
    correctAnswerIndex: 1,
    explanation: 'Parameter `a` is passed by value (a copy), so modifications inside `modify` do not affect `x`. Parameter `b` is passed by reference (`int&`), which aliases `y` directly, updating `y` to 15.',
  },
  {
    id: 'quiz-3',
    topic: 'Modern C++ / Smart Pointers',
    difficulty: 'intermediate',
    question: 'Which of the following statements about std::unique_ptr is TRUE?',
    options: [
      'std::unique_ptr can be copied using standard copy assignment (ptr1 = ptr2)',
      'std::unique_ptr uses reference counting to determine when to delete the object',
      'std::unique_ptr cannot be copied, only moved using std::move',
      'You must manually call delete on the object wrapped in a unique_ptr',
    ],
    correctAnswerIndex: 2,
    explanation: 'std::unique_ptr enforces exclusive ownership. Copying is disabled (deleted copy constructor), so ownership must be explicitly transferred with std::move. It destroys the resource automatically on scope exit without manual delete.',
  },
  {
    id: 'quiz-4',
    topic: 'OOP / Virtual Functions',
    difficulty: 'intermediate',
    question: 'Why should base class destructors almost always be declared `virtual` in C++?',
    options: [
      'To make the class run faster in release mode',
      'To ensure that derived class destructors are properly called when deleting via a base class pointer',
      'To prevent the base class from being instantiated',
      'Because C++ requires all functions in a class to be virtual',
    ],
    correctAnswerIndex: 1,
    explanation: 'If a base class destructor is not virtual, deleting a derived object through a base pointer results in undefined behavior where the derived destructor is never invoked, leaking derived resources.',
  },
  {
    id: 'quiz-5',
    topic: 'Standard Template Library (STL)',
    difficulty: 'easy',
    question: 'What is the average time complexity of searching for a key in `std::unordered_map` versus `std::map`?',
    options: [
      'unordered_map: O(1), map: O(log N)',
      'unordered_map: O(N), map: O(1)',
      'unordered_map: O(log N), map: O(1)',
      'Both have identical O(N) complexity',
    ],
    correctAnswerIndex: 0,
    explanation: 'std::unordered_map is implemented with a hash table, providing O(1) average lookup. std::map is backed by a self-balancing Red-Black binary search tree, providing O(log N) lookup.',
  },
  {
    id: 'quiz-6',
    topic: 'Memory / Undefined Behavior',
    difficulty: 'easy',
    question: 'What is a "dangling pointer" in C++?',
    options: [
      'A pointer initialized to nullptr',
      'A pointer that points to a memory location that has already been deallocated or freed',
      'A pointer pointing to a constant variable',
      'A pointer stored inside a struct',
    ],
    correctAnswerIndex: 1,
    explanation: 'A dangling pointer continues to hold the memory address of an object after its memory has been deleted or gone out of scope. Dereferencing it is undefined behavior.',
  },
  {
    id: 'quiz-7',
    topic: 'C++ Basics',
    difficulty: 'beginner',
    question: 'What is the difference between `std::endl` and `\'\\n\'`?',
    options: [
      'There is no difference; they are exact synonyms',
      'std::endl adds a newline AND flushes the stream output buffer, whereas \'\\n\' only outputs the newline character',
      '\'\\n\' only works on Linux, while std::endl is cross-platform',
      'std::endl works only with files, \'\\n\' works only with std::cout',
    ],
    correctAnswerIndex: 1,
    explanation: 'std::endl inserts \'\\n\' and immediately calls stream.flush(). In high-throughput loops, flushing repeatedly degrades performance, which is why \'\\n\' is preferred for speed.',
  },
];

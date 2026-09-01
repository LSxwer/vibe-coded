import { MemoryScenario } from '../types';

export const MEMORY_SCENARIOS: MemoryScenario[] = [
  {
    id: 'scen-pointers-basic',
    title: '1. Pointers & Dereferencing (* &)',
    category: 'Pointers',
    description: 'See how a pointer variable on the stack stores the memory address of another variable and mutates it indirectly.',
    code: `int main() {
    int age = 21;          // Line 2: Stack allocation
    int* ptr = &age;       // Line 3: Pointer stores address of age
    *ptr = 22;             // Line 4: Dereference & modify value
    int other = *ptr + 5;  // Line 5: Read value via pointer
    return 0;
}`,
    frames: [
      {
        id: 'f1',
        title: 'Step 1: Declare stack variable `age`',
        description: 'An integer `age` is allocated on the stack at memory address `0x7ffee1a0` with value `21`.',
        codeHighlightLine: 2,
        stack: [
          { name: 'age', type: 'int', value: '21', address: '0x7ffee1a0' },
        ],
        heap: [],
        terminalOutput: '// age initialized to 21 at 0x7ffee1a0',
      },
      {
        id: 'f2',
        title: 'Step 2: Declare pointer `ptr = &age`',
        description: 'Pointer `ptr` is allocated on the stack at `0x7ffee1a8`. Its value is the memory address of `age` (`0x7ffee1a0`).',
        codeHighlightLine: 3,
        stack: [
          { name: 'age', type: 'int', value: '21', address: '0x7ffee1a0' },
          { name: 'ptr', type: 'int*', value: '0x7ffee1a0', address: '0x7ffee1a8', isPointer: true, pointsToAddress: '0x7ffee1a0' },
        ],
        heap: [],
        terminalOutput: '// ptr points to address 0x7ffee1a0 (&age)',
      },
      {
        id: 'f3',
        title: 'Step 3: Dereference and mutate `*ptr = 22`',
        description: 'The CPU follows `ptr` to address `0x7ffee1a0` and updates the value stored there from 21 to 22.',
        codeHighlightLine: 4,
        stack: [
          { name: 'age', type: 'int', value: '22', address: '0x7ffee1a0' },
          { name: 'ptr', type: 'int*', value: '0x7ffee1a0', address: '0x7ffee1a8', isPointer: true, pointsToAddress: '0x7ffee1a0' },
        ],
        heap: [],
        terminalOutput: '// Value at 0x7ffee1a0 changed to 22 through *ptr',
      },
      {
        id: 'f4',
        title: 'Step 4: Compute `other = *ptr + 5`',
        description: 'A new stack variable `other` is created at `0x7ffee1b0` storing 22 + 5 = 27.',
        codeHighlightLine: 5,
        stack: [
          { name: 'age', type: 'int', value: '22', address: '0x7ffee1a0' },
          { name: 'ptr', type: 'int*', value: '0x7ffee1a0', address: '0x7ffee1a8', isPointer: true, pointsToAddress: '0x7ffee1a0' },
          { name: 'other', type: 'int', value: '27', address: '0x7ffee1b0' },
        ],
        heap: [],
        terminalOutput: '// other = 27 (read *ptr which is 22, + 5)',
      },
    ],
  },
  {
    id: 'scen-stack-vs-heap',
    title: '2. Stack vs Heap (new / delete)',
    category: 'Dynamic Memory',
    description: 'Observe dynamic heap allocation with `new`, pointer tracking across memory segments, and heap deallocation with `delete`.',
    code: `int main() {
    int stackVal = 10;            // Line 2: Stack allocation
    int* heapPtr = new int(500);  // Line 3: Heap allocation via 'new'
    *heapPtr = 999;               // Line 4: Mutate heap memory
    delete heapPtr;               // Line 5: Free heap memory
    heapPtr = nullptr;            // Line 6: Prevent dangling pointer
    return 0;
}`,
    frames: [
      {
        id: 'h1',
        title: 'Step 1: Stack variable creation',
        description: '`stackVal` is placed on the call stack at `0x7ffee200`.',
        codeHighlightLine: 2,
        stack: [
          { name: 'stackVal', type: 'int', value: '10', address: '0x7ffee200' },
        ],
        heap: [],
        terminalOutput: '// Stack frame created with stackVal = 10',
      },
      {
        id: 'h2',
        title: 'Step 2: Allocate on Heap with `new int(500)`',
        description: '`new` requests memory from OS heap manager. Heap allocates block at `0x55a19000`. Pointer `heapPtr` on stack holds `0x55a19000`.',
        codeHighlightLine: 3,
        stack: [
          { name: 'stackVal', type: 'int', value: '10', address: '0x7ffee200' },
          { name: 'heapPtr', type: 'int*', value: '0x55a19000', address: '0x7ffee208', isPointer: true, pointsToAddress: '0x55a19000' },
        ],
        heap: [
          { name: 'Heap Block', type: 'int', value: '500', address: '0x55a19000', isHeapAllocated: true },
        ],
        terminalOutput: '// Heap allocated 4 bytes at 0x55a19000 with initial value 500',
      },
      {
        id: 'h3',
        title: 'Step 3: Modify Heap via `*heapPtr = 999`',
        description: 'Writing to `*heapPtr` updates the heap memory block at `0x55a19000` to 999.',
        codeHighlightLine: 4,
        stack: [
          { name: 'stackVal', type: 'int', value: '10', address: '0x7ffee200' },
          { name: 'heapPtr', type: 'int*', value: '0x55a19000', address: '0x7ffee208', isPointer: true, pointsToAddress: '0x55a19000' },
        ],
        heap: [
          { name: 'Heap Block', type: 'int', value: '999', address: '0x55a19000', isHeapAllocated: true },
        ],
        terminalOutput: '// Heap memory at 0x55a19000 updated to 999',
      },
      {
        id: 'h4',
        title: 'Step 4: Free Heap with `delete heapPtr`',
        description: '`delete` returns heap memory to the OS. Notice `heapPtr` still holds the old address (Dangling Pointer hazard!) until reset.',
        codeHighlightLine: 5,
        stack: [
          { name: 'stackVal', type: 'int', value: '10', address: '0x7ffee200' },
          { name: 'heapPtr', type: 'int*', value: '0x55a19000 (DANGLING)', address: '0x7ffee208', isPointer: true, pointsToAddress: '0x55a19000' },
        ],
        heap: [],
        terminalOutput: '// Heap memory deallocated. heapPtr is now dangling!',
      },
      {
        id: 'h5',
        title: 'Step 5: Safe Reset `heapPtr = nullptr`',
        description: 'Setting `heapPtr = nullptr` prevents accidental use of deallocated memory.',
        codeHighlightLine: 6,
        stack: [
          { name: 'stackVal', type: 'int', value: '10', address: '0x7ffee200' },
          { name: 'heapPtr', type: 'int*', value: 'nullptr (0x0)', address: '0x7ffee208', isPointer: true },
        ],
        heap: [],
        terminalOutput: '// heapPtr safely set to nullptr (0x0)',
      },
    ],
  },
  {
    id: 'scen-references-alias',
    title: '3. C++ References (Aliases)',
    category: 'References',
    description: 'Understand how references in C++ are not separate memory objects, but compile-time aliases for existing variables.',
    code: `int main() {
    int score = 100;    // Line 2: Original variable
    int& alias = score; // Line 3: Create reference alias
    alias += 50;        // Line 4: Mutate through alias
    int copy = score;   // Line 5: Value copy
    return 0;
}`,
    frames: [
      {
        id: 'r1',
        title: 'Step 1: Declare `score`',
        description: 'Stack allocates `score = 100` at `0x7ffee310`.',
        codeHighlightLine: 2,
        stack: [
          { name: 'score', type: 'int', value: '100', address: '0x7ffee310' },
        ],
        heap: [],
      },
      {
        id: 'r2',
        title: 'Step 2: Bind reference `int& alias = score`',
        description: '`alias` shares the exact same memory address (`0x7ffee310`) as `score`. No new memory allocation occurs.',
        codeHighlightLine: 3,
        stack: [
          { name: 'score', type: 'int', value: '100', address: '0x7ffee310' },
          { name: 'alias (ref)', type: 'int&', value: '100', address: '0x7ffee310', isReference: true, refersToName: 'score' },
        ],
        heap: [],
        terminalOutput: '// alias bound to score (same address 0x7ffee310)',
      },
      {
        id: 'r3',
        title: 'Step 3: Modify `alias += 50`',
        description: 'Because `alias` and `score` share memory address `0x7ffee310`, modifying `alias` directly changes `score` to 150.',
        codeHighlightLine: 4,
        stack: [
          { name: 'score', type: 'int', value: '150', address: '0x7ffee310' },
          { name: 'alias (ref)', type: 'int&', value: '150', address: '0x7ffee310', isReference: true, refersToName: 'score' },
        ],
        heap: [],
        terminalOutput: '// score and alias are now both 150',
      },
      {
        id: 'r4',
        title: 'Step 4: Copy by value `int copy = score`',
        description: 'A separate memory cell `0x7ffee320` is allocated for `copy` with value 150. Modifying `copy` later will not affect `score`.',
        codeHighlightLine: 5,
        stack: [
          { name: 'score', type: 'int', value: '150', address: '0x7ffee310' },
          { name: 'alias (ref)', type: 'int&', value: '150', address: '0x7ffee310', isReference: true, refersToName: 'score' },
          { name: 'copy', type: 'int', value: '150', address: '0x7ffee320' },
        ],
        heap: [],
      },
    ],
  },
];

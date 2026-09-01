import { CodeSnippet } from '../types';

export const C_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-fast-io',
    title: 'Fast I/O & Competitive Programming Boilerplate',
    category: 'Input/Output',
    difficulty: 'beginner',
    tags: ['cin', 'cout', 'optimization', 'buffer', 'competitive-programming'],
    description: 'Speeds up C++ stream operations by untying std::cin from std::cout and disabling synchronization with C stdio.',
    code: `#include <iostream>

int main() {
    // Untie cin from cout and disable stdio sync for 10x faster I/O
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    int n;
    if (std::cin >> n) {
        std::cout << "Fast processed: " << n * 2 << "\\n"; // Prefer '\\n' over std::endl to avoid buffer flushes
    }
    return 0;
}`,
    explanation: [
      'std::ios_base::sync_with_stdio(false) disables synchronization between C++ standard streams and C stdio functions (like printf/scanf).',
      'std::cin.tie(NULL) un-ties cin from cout, preventing automatic cout flush before every cin operation.',
      'Using "\\n" instead of std::endl avoids forced buffer flushes, significantly speeding up output in loops.',
    ],
    outputSample: 'Fast processed: 84',
    bestPractices: [
      'Do not mix printf/scanf with cin/cout after disabling stdio sync.',
      'Use "\\n" instead of std::endl unless immediate flushing is necessary (e.g. interactive terminal prompt).',
    ],
    commonGotchas: [
      'Mixing std::cout and printf after sync_with_stdio(false) can cause interleaved, out-of-order output.',
    ],
  },
  {
    id: 'snip-string-parsing',
    title: 'String Tokenization with std::stringstream',
    category: 'Strings',
    difficulty: 'beginner',
    tags: ['string', 'stringstream', 'tokenization', 'split'],
    description: 'Split sentences into words or parse mixed numbers and strings using std::stringstream.',
    code: `#include <iostream>
#include <string>
#include <sstream>
#include <vector>

int main() {
    std::string text = "C++20 is modern fast and expressive";
    std::stringstream ss(text);
    std::string word;
    std::vector<std::string> words;

    while (ss >> word) {
        words.push_back(word);
    }

    std::cout << "Extracted " << words.size() << " words:\\n";
    for (const auto& w : words) {
        std::cout << " -> [" << w << "]\\n";
    }
    return 0;
}`,
    explanation: [
      'std::stringstream acts as an in-memory stream.',
      'The extraction operator >> automatically delimits words by any whitespace (spaces, tabs, newlines).',
      'Storing tokens in a std::vector allows convenient subsequent processing.',
    ],
    outputSample: `Extracted 6 words:\n -> [C++20]\n -> [is]\n -> [modern]\n -> [fast]\n -> [and]\n -> [expressive]`,
    bestPractices: [
      'Include <sstream> to use std::stringstream.',
      'To split by custom delimiter (like commas), use std::getline(ss, token, \',\').',
    ],
  },
  {
    id: 'snip-vector-algorithms',
    title: 'Vector Essentials & STL Algorithms',
    category: 'STL & Containers',
    difficulty: 'easy',
    tags: ['vector', 'algorithm', 'sort', 'reverse', 'accumulate', 'min_element'],
    description: 'Master dynamic arrays, sorting, searching, reversing, and summing elements with standard algorithms.',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> nums = {42, 13, 89, 7, 24, 65};

    // 1. Sort ascending
    std::sort(nums.begin(), nums.end());

    // 2. Compute sum
    int total = std::accumulate(nums.begin(), nums.end(), 0);

    // 3. Find min & max
    auto minIt = std::min_element(nums.begin(), nums.end());
    auto maxIt = std::max_element(nums.begin(), nums.end());

    std::cout << "Sorted: ";
    for (int x : nums) std::cout << x << " ";
    std::cout << "\\nTotal Sum: " << total;
    std::cout << "\\nMin: " << *minIt << ", Max: " << *maxIt << "\\n";

    return 0;
}`,
    explanation: [
      'std::sort(begin, end) sorts a collection in O(N log N) time.',
      'std::accumulate from <numeric> sums elements with an initial value (0).',
      'std::min_element / std::max_element return iterators to the target elements; dereference with * to get the value.',
    ],
    outputSample: `Sorted: 7 13 24 42 65 89 \nTotal Sum: 240\nMin: 7, Max: 89`,
    bestPractices: [
      'Pass containers by const reference (const std::vector<int>& v) into functions to prevent expensive copying.',
    ],
  },
  {
    id: 'snip-pointers-memory',
    title: 'Pointers vs References Demystified',
    category: 'Pointers & Memory',
    difficulty: 'easy',
    tags: ['pointers', 'references', 'address', 'dereference', 'memory'],
    description: 'A side-by-side contrast of memory addresses, pointer reassignment, and references.',
    code: `#include <iostream>

int main() {
    int original = 100;

    // 1. Reference (Alias): Cannot be null, cannot be reseated
    int& ref = original;
    ref = 200; // Directly updates original

    // 2. Pointer: Stores memory address, can be nullptr, can point to other variables
    int* ptr = &original;
    *ptr = 300; // Updates original via dereference

    int other = 500;
    ptr = &other; // Pointer now points to 'other'
    *ptr = 555;

    std::cout << "original: " << original << "\\n"; // 300
    std::cout << "other: " << other << "\\n";       // 555
    std::cout << "ptr points to address: " << ptr << " with value: " << *ptr << "\\n";

    return 0;
}`,
    explanation: [
      'References (int&) are immutable aliases created at declaration. Once bound, they cannot point to something else.',
      'Pointers (int*) are independent variables storing a hexadecimal memory address. They can be reassigned or set to nullptr.',
      'Prefer references by default for function parameters, and pointers only when nullable or dynamic reseating is needed.',
    ],
    outputSample: `original: 300\nother: 555\nptr points to address: 0x7ffeeb42 with value: 555`,
    bestPractices: [
      'Initialize pointers to nullptr if not immediately assigned: int* p = nullptr;',
      'Never dereference nullptr or dangling pointers.',
    ],
  },
  {
    id: 'snip-smart-unique-shared',
    title: 'Smart Pointers: std::unique_ptr & std::shared_ptr',
    category: 'Modern C++',
    difficulty: 'intermediate',
    tags: ['smart-pointers', 'unique_ptr', 'shared_ptr', 'memory-management', 'RAII'],
    description: 'Zero memory leaks with modern smart pointers and automated lifetime management.',
    code: `#include <iostream>
#include <memory>
#include <string>

struct Node {
    int id;
    Node(int i) : id(i) { std::cout << "Node " << id << " created\\n"; }
    ~Node() { std::cout << "Node " << id << " destroyed\\n"; }
};

int main() {
    // 1. Exclusive ownership with unique_ptr
    {
        std::unique_ptr<Node> u = std::make_unique<Node>(1);
        std::cout << "Using unique node: " << u->id << "\\n";
        // Node 1 destroyed automatically here!
    }

    // 2. Shared ownership with reference counting
    {
        std::shared_ptr<Node> s1 = std::make_shared<Node>(2);
        {
            std::shared_ptr<Node> s2 = s1; // Ref count = 2
            std::cout << "Ref count in inner scope: " << s1.use_count() << "\\n";
        } // s2 destroyed, ref count = 1
        std::cout << "Ref count after inner scope: " << s1.use_count() << "\\n";
    } // s1 destroyed, ref count = 0 -> Node 2 deleted automatically!

    return 0;
}`,
    explanation: [
      'std::unique_ptr ensures single ownership. Move-only; cannot be copied.',
      'std::shared_ptr uses an atomic reference counter. Memory is deleted when the last shared_ptr is destroyed.',
      'Always prefer std::make_unique and std::make_shared instead of raw new.',
    ],
    outputSample: `Node 1 created\nUsing unique node: 1\nNode 1 destroyed\nNode 2 created\nRef count in inner scope: 2\nRef count after inner scope: 1\nNode 2 destroyed`,
  },
  {
    id: 'snip-map-hash-lookup',
    title: 'Hash Maps with std::unordered_map',
    category: 'STL & Containers',
    difficulty: 'easy',
    tags: ['unordered_map', 'map', 'hash-table', 'dictionary', 'key-value'],
    description: 'Fast O(1) average lookup key-value data structure in C++.',
    code: `#include <iostream>
#include <string>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, double> fruitPrices = {
        {"Apple", 1.25},
        {"Banana", 0.75},
        {"Cherry", 2.50}
    };

    // Insert or update
    fruitPrices["Dragonfruit"] = 4.99;

    // Check existence without accidental insertion
    std::string query = "Banana";
    if (auto it = fruitPrices.find(query); it != fruitPrices.end()) {
        std::cout << query << " price: $" << it->second << "\\n";
    }

    // Iterate through all key-value pairs
    std::cout << "\\nAll items in catalog:\\n";
    for (const auto& [item, price] : fruitPrices) { // C++17 structured binding
        std::cout << " - " << item << ": $" << price << "\\n";
    }

    return 0;
}`,
    explanation: [
      'std::unordered_map provides hash-table backed key-value mapping with O(1) average lookup.',
      'Using map[key] inserts a default constructed value if key doesn\'t exist. Use map.find(key) or map.contains(key) in C++20 for safe checks.',
      'C++17 structured bindings for (const auto& [key, value] : map) make iteration concise.',
    ],
    outputSample: `Banana price: $0.75\n\nAll items in catalog:\n - Apple: $1.25\n - Banana: $0.75\n - Cherry: $2.5\n - Dragonfruit: $4.99`,
  },
  {
    id: 'snip-rule-of-five',
    title: 'OOP Rule of Three / Rule of Five',
    category: 'Object-Oriented Programming',
    difficulty: 'intermediate',
    tags: ['oop', 'destructor', 'copy-constructor', 'move-semantics', 'rule-of-five'],
    description: 'Properly manage custom dynamic resources in C++ classes avoiding shallow-copy double-free bugs.',
    code: `#include <iostream>
#include <algorithm>

class DynamicArray {
private:
    int* data_;
    size_t size_;

public:
    // 1. Constructor
    DynamicArray(size_t size, int initVal = 0) : size_(size), data_(new int[size]) {
        std::fill(data_, data_ + size_, initVal);
    }

    // 2. Destructor
    ~DynamicArray() {
        delete[] data_;
    }

    // 3. Copy Constructor (Deep Copy)
    DynamicArray(const DynamicArray& other) : size_(other.size_), data_(new int[other.size_]) {
        std::copy(other.data_, other.data_ + size_, data_);
    }

    // 4. Copy Assignment Operator
    DynamicArray& operator=(const DynamicArray& other) {
        if (this != &other) {
            delete[] data_;
            size_ = other.size_;
            data_ = new int[size_];
            std::copy(other.data_, other.data_ + size_, data_);
        }
        return *this;
    }

    size_t size() const { return size_; }
};

int main() {
    DynamicArray a(5, 42);
    DynamicArray b = a; // Safe deep copy!
    std::cout << "Successfully copied dynamic buffer without double-free.\\n";
    return 0;
}`,
    explanation: [
      'If your class manually manages raw resources (like raw pointers with new/delete), you must implement or delete the Destructor, Copy Constructor, and Copy Assignment Operator.',
      'Failing to implement a deep copy leads to double-free undefined behavior when both objects call delete on the same pointer.',
      'Best practice: Prefer std::vector or smart pointers (Rule of Zero) over manual memory management.',
    ],
    outputSample: 'Successfully copied dynamic buffer without double-free.',
  },
  {
    id: 'snip-cpp20-modern',
    title: 'Modern C++20 Features (Ranges, auto & std::format style)',
    category: 'Modern C++',
    difficulty: 'intermediate',
    tags: ['cpp20', 'ranges', 'lambdas', 'auto', 'concepts'],
    description: 'Write expressive, declarative modern C++ code using ranges and functional transformations.',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // Filter evens and square them
    std::vector<int> squaredEvens;
    for (int x : numbers) {
        if (x % 2 == 0) {
            squaredEvens.push_back(x * x);
        }
    }

    std::cout << "Squared evens: ";
    for (auto num : squaredEvens) {
        std::cout << num << " ";
    }
    std::cout << "\\n";

    return 0;
}`,
    explanation: [
      'Modern C++ emphasizes type inference (auto), RAII, range-based loops, and functional algorithm chains.',
      'Modern C++ eliminates raw pointer bugs while maintaining zero-cost runtime performance.',
    ],
    outputSample: 'Squared evens: 4 16 36 64 100 ',
  },
];

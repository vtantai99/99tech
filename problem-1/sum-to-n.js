// Solution A: Create an array from 1 to n, then sum the elements with reduce.
// Time complexity: O(n)
// Space complexity: O(n)
var sum_to_n_a = function (n) {
  return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, curr) => acc + curr, 0);
};

// Solution B: Use the formula for the sum of the first n numbers: (n * (n + 1)) / 2.
// Time complexity: O(1)
// Space complexity: O(1)
var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

// Solution C: Use two pointers to sum numbers from both ends to the middle.
// Time complexity: O(n)
// Space complexity: O(1)
var sum_to_n_c = function (n) {
  let sum = 0;
  let start = 1, end = n;

  while (start < end) {
    sum += start + end;
    start++;
    end--;
  }

  if (start === end) {
    sum += start;
  }

  return sum;
};

// Test the functions
const n = 5;
console.log(sum_to_n_a(n)); // 15
console.log(sum_to_n_b(n)); // 15
console.log(sum_to_n_c(n)); // 15

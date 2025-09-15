export function getBubbleSortSteps(arr) {
  let steps = [];
  let array = [...arr];
  let n = array.length;

  // Initial state
  steps.push({
    array: [...array],
    activeIndices: [],
    swaps: [],
    comparisons: [],
    sortedIndices: [],
    pivot: null,
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Step: comparing two elements
      steps.push({
        array: [...array],
        comparisons: [j, j + 1],
        swaps: [],
        activeIndices: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
        pivot: null,
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        // Step: after swap
        steps.push({
          array: [...array],
          comparisons: [],
          swaps: [j, j + 1],
          activeIndices: [j, j + 1],
          sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
          pivot: null,
        });
      }
    }

    // Mark last element in this pass as sorted
    steps.push({
      array: [...array],
      comparisons: [],
      swaps: [],
      activeIndices: [],
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      pivot: null,
    });
  }

  return steps;
}

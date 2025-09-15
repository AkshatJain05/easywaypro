export function getInsertionSortSteps(arr) {
  let steps = [];
  let array = [...arr];

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      steps.push({
        array: [...array],
        comparisons: [j, j + 1],
        swaps: [j, j + 1],
      });

      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;

    steps.push({
      array: [...array],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
    });
  }
  return steps;
}

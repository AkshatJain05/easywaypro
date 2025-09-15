export function getSelectionSortSteps(arr) {
  let steps = [];
  let array = [...arr];

  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      steps.push({
        array: [...array],
        comparisons: [minIdx, j],
      });
      if (array[j] < array[minIdx]) minIdx = j;
    }
    [array[i], array[minIdx]] = [array[minIdx], array[i]];
    steps.push({
      array: [...array],
      swaps: [i, minIdx],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
    });
  }
  return steps;
}

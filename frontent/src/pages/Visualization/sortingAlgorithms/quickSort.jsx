function partition(arr, low, high, steps) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    steps.push({ array: [...arr], comparisons: [j, high], pivot: high });
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push({ array: [...arr], swaps: [i, j], pivot: high });
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  steps.push({ array: [...arr], swaps: [i + 1, high], pivot: high });
  return i + 1;
}

function quickSortHelper(arr, low, high, steps) {
  if (low < high) {
    let pi = partition(arr, low, high, steps);
    quickSortHelper(arr, low, pi - 1, steps);
    quickSortHelper(arr, pi + 1, high, steps);
  }
}

export function getQuickSortSteps(array) {
  let arr = [...array];
  let steps = [{ array: [...arr] }];
  quickSortHelper(arr, 0, arr.length - 1, steps);
  steps.push({ array: [...arr], sortedIndices: Array.from(arr.keys()) });
  return steps;
}

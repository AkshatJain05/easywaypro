function merge(arr, l, m, r, steps) {
  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    steps.push({ array: [...arr], comparisons: [l + i, m + 1 + j] });
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
    steps.push({ array: [...arr], swaps: [k - 1] });
  }
  while (i < left.length) {
    arr[k++] = left[i++];
    steps.push({ array: [...arr], swaps: [k - 1] });
  }
  while (j < right.length) {
    arr[k++] = right[j++];
    steps.push({ array: [...arr], swaps: [k - 1] });
  }
}

function mergeSortHelper(arr, l, r, steps) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  mergeSortHelper(arr, l, m, steps);
  mergeSortHelper(arr, m + 1, r, steps);
  merge(arr, l, m, r, steps);
}

export function getMergeSortSteps(array) {
  let arr = [...array];
  let steps = [{ array: [...arr] }];
  mergeSortHelper(arr, 0, arr.length - 1, steps);
  steps.push({ array: [...arr], sortedIndices: Array.from(arr.keys()) });
  return steps;
}

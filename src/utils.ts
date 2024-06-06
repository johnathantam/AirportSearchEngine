// This file handles and prepares the data and all functions related to accesing information from the data
// that will be used in all applications!
// E.x. sort, search, etc.

// Import data
interface Data {
  continent: string[];
  ident: string[];
  iso_country: string[];
  iso_region: string[];
  latitude_deg: string[];
  longitude_deg: string[];
  name: string[];
  type: string[];
}

const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data;

let SORTED_NAMES: [string, number][] = new Array(78312);
let SORTED_TYPES: [string, number][] = new Array(78312);
let SORTED_COUNTRIES: [string, number][] = new Array(78312);
let SORTED_IDENTS: [string, number][] = new Array(78312);

// O(n)
// Returns a slice of the array similar to .slice()
function slice(array: [string, number][], start: number, end: number) {
  let sliced = new Array(end - start);
  for (let i = start; i < end; i++) {
    sliced[i - start] = array[i];
  }
  
  return sliced;
}

// Credit to Mr. Ma for the base in place merge sort code
// O(n)
function merge(left: [string, number][], right: [string, number][], array: [string, number][]): [string, number][] {
  let i: number = 0; // left side
  let j: number = 0; // right side

  for (let k = 0; k < array.length; k++) {
    //If left is empty
    if (i >= left.length) {
      array[k] = right[j]; //Place values from right
      j++;
      continue;
    } 
    
    //If right is empty
    if (j >= right.length) {
      array[k] = left[i]; //Place values from left
      i++;
      continue;
    } 

    // If none of the sides are empty, than merge the left and right sides in ascending order
    const leftString: string = left[i][0];
    const rightString: string = right[j][0];
    
    if (leftString < rightString) {
      array[k] = left[i];
      i++;
    } else if (leftString > rightString) {
      array[k] = right[j];
      j++;
    } else {
      // if a duplicate, place in order of alphabetically descending id numbers
      const leftId: string = data.ident[left[i][1]].toString(); // Has toString as some id's are numbers
      const rightId: string = data.ident[right[j][1]].toString();

      if (leftId < rightId) {
        array[k] = left[i];
        i++;
      } else {
        array[k] = right[j];
        j++;
      }
    }
  }

  return array;
}

// Credit to Mr. Ma for the base in place merge sort code
// O(n log n)
function mergeSort(nums: [string, number][]): [string, number][] | void {
  let numsLength: number = nums.length;

  if (numsLength <= 1) {
    return nums;
  }

  let mid: number = Math.floor(numsLength/2);

  let leftSide: [string, number][] = slice(nums, 0, mid);
  let rightSide: [string, number][] = slice(nums, mid, nums.length);

  mergeSort(leftSide);
  mergeSort(rightSide);
  merge(leftSide, rightSide, nums);
}

// Credit to GPT for the base binary search code
// O(log n)
function binarySearch(sortedArray: [string, number][], input: string): number {
  const target = input.toLowerCase();
  let left: number = 0;
  let right: number = sortedArray.length - 1;
  let foundIndex: number = -1;
  
  while (left <= right) {
    const mid: number = Math.floor((left + right) / 2);
    const midValue: string = sortedArray[mid][0];

    if (midValue === target) {
      foundIndex = mid; // Set closest found index to the right and keep searching towards the left for the first occurence
      right = mid - 1;
    } else if (midValue < target) {
      left = mid + 1; // Search in the right half
    } else {
      right = mid - 1; // Search in the left half
    }
  }

  return foundIndex; // Target not found
}

// Store every element with their index in preparation to sort
// O(n)
function storeIndexesInDatabase(): void {
  // store each item with their index so we can sort them later while knowing their original data
  // Additionally make them lowercase so that their numerical codes aren't
  // effected by their capitilization since we need to sort alphabetically
  const len: number = data.name.length;
  for (let i = 0; i < len; i++) {
    SORTED_NAMES[i] = [data.name[i].toLowerCase(), i];
    SORTED_TYPES[i] = [data.type[i].toLowerCase(), i];
    SORTED_COUNTRIES[i] = [data.iso_country[i].toLocaleLowerCase(), i];
    SORTED_IDENTS[i] = [data.ident[i].toString().toLowerCase(), i];
  }
}

// O(n)
function initializeDataForSearchAndSort() {
  // Keep track of indexes with each element as we are about to sort them
  storeIndexesInDatabase();
  
  // Sort and store elements in global variables that will then be used in other files as a global constant
  mergeSort(SORTED_NAMES);
  mergeSort(SORTED_COUNTRIES);
  mergeSort(SORTED_TYPES);
  mergeSort(SORTED_IDENTS);
}

// Initialize dataset with util.js
initializeDataForSearchAndSort();
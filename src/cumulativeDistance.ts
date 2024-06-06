// This file handles bonus #1 and #2
// Elements related to search functionality
const distanceInputContainer: HTMLDivElement = document.getElementById("distanceInputContainer") as HTMLDivElement;
const distanceInput: HTMLInputElement = document.getElementById("distanceInput") as HTMLInputElement;
const distanceResultDisplayBoard: HTMLTableSectionElement = document.getElementById("distanceResultDisplayBoard") as HTMLTableSectionElement;
const distanceAndDisplacementBox: HTMLDivElement = document.getElementById("distanceAndDisplacementBox") as HTMLDivElement;
const distanceStatistic: HTMLHeadingElement = document.getElementById("distanceStatistic") as HTMLHeadingElement;
const displacementStatistic: HTMLHeadingElement = document.getElementById("displacementStatistic") as HTMLHeadingElement;

// Element related to visual signifiers (error, correct, etc.)
const emptyDistanceResultsIndicator: HTMLDivElement = document.getElementById("noResultsPopup") as HTMLDivElement;
const searchDistanceTimeIndicator: HTMLParagraphElement = document.getElementById("distanceResultTimer") as HTMLParagraphElement;

// O(1)
function degToRad(deg: number): number {
  return deg * (Math.PI/180);
}

// O(1)
// This function returns the distance between two positions based on latitude and longitude
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r: number = 6371;
  const dLat: number = (degToRad(lat2 - lat1));
  const dLon: number = (degToRad(lon2 - lon1));

  // taken from wikipedia
  const d: number = 2 * r * Math.asin(Math.sqrt((Math.sin(dLat / 2) ** 2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * (Math.sin(dLon / 2) ** 2)));

  return d;
}

// O(1)
function getDisplacement(IDOfFirstAirport: string, IDOfSecondAirport: string): number | null {
  const firstIndex: number = binarySearch(SORTED_IDENTS, IDOfFirstAirport);
  const secondIndex: number = binarySearch(SORTED_IDENTS, IDOfSecondAirport);

  // If any id cannot not be found, stop.
  if (firstIndex === -1 || secondIndex === -1) {
    return null;
  }

  // If the ids are not the same type, stop.
  if (data.type[SORTED_IDENTS[secondIndex][1]] !== data.type[SORTED_IDENTS[firstIndex][1]] || data.type[SORTED_IDENTS[secondIndex][1]] === "closed") {
    return null;
  }

  return haversineDistance(Number(data.latitude_deg[SORTED_IDENTS[firstIndex][1]]), Number(data.longitude_deg[SORTED_IDENTS[firstIndex][1]]), Number(data.latitude_deg[SORTED_IDENTS[secondIndex][1]]), Number(data.longitude_deg[SORTED_IDENTS[secondIndex][1]]));
}

// O(n)
function getDistanceBetweenEveryAirport(IDArray: string[]): number[] | null {
  let displacementArr: number[] = [];
  let firstIndex: number = binarySearch(SORTED_IDENTS, IDArray[0]);

  // if id of first airport is not found, stop.
  if (firstIndex === -1) {
    return null;
  }

  for (let i = 1; i < IDArray.length; i++) {
    const secondIndex: number = binarySearch(SORTED_IDENTS, IDArray[i]);

    // if any id is not found, stop.
    if (secondIndex === -1) {
      return null;
    }

    // if airport is then not the same type or is closed, stop.
    if (data.type[SORTED_IDENTS[secondIndex][1]] !== data.type[SORTED_IDENTS[firstIndex][1]] || data.type[SORTED_IDENTS[secondIndex][1]] === "closed") {
      return null;
    }

    displacementArr[i-1] = haversineDistance(Number(data.latitude_deg[SORTED_IDENTS[firstIndex][1]]), Number(data.longitude_deg[SORTED_IDENTS[firstIndex][1]]), Number(data.latitude_deg[SORTED_IDENTS[secondIndex][1]]), Number(data.longitude_deg[SORTED_IDENTS[secondIndex][1]]));
    firstIndex = secondIndex;
  }

  return displacementArr;
}

// O(n)
function getTotalDistance(distances: number[]): number {
  // Add up total distance
  let totalDistance = 0;
  for (let i = 0; i < distances.length; i++) {
    totalDistance += distances[i];
  } 

  return totalDistance;
}

// O(n)
function addDisplacement(displacementArr: number[], startTransferIndex: number, endTransferIndex: number): number {
  const totalTransferIndex: number = endTransferIndex - startTransferIndex;
  let displacement: number = 0;

  for (let i = startTransferIndex; i < totalTransferIndex; i++) {
    displacement += displacementArr[i];
  }

  return displacement;
}

// O(n)
function splitIDsIntoArray(ids: string): string[] {
  let splitByCommas: string[] = ids.split(",");

  // Truncate items as white space could ruin potential searches
  for (let i = 0; i < splitByCommas.length; i++) {
    splitByCommas[i] = splitByCommas[i].trim();
  }

  return splitByCommas;
}

function displayError() {
  // Show error image and hide distance results
  emptyDistanceResultsIndicator.style.display = "flex";
  distanceAndDisplacementBox.style.display = "none";

  // Play error animation
  distanceInputContainer.classList.add("left-side-distance-input-error-animation");
  // Stop error animation after it ends
  setTimeout(function() { 
    distanceInputContainer.classList.remove("left-side-distance-input-error-animation");
  }, 600);
}

// O(1)
function displayTotalDistanceAndDisplacement(displacement: number, totalDistance: number): void {
  // Show distance results and hide error image
  distanceAndDisplacementBox.style.display = "block";
  emptyDistanceResultsIndicator.style.display = "none";

  // Set content
  distanceStatistic.innerText = totalDistance.toFixed(2) + "km";
  displacementStatistic.innerText = displacement.toFixed(2) + "km";
  
  // Play searched animation
  distanceAndDisplacementBox.classList.toggle("right-side-distance-loading-in-anim");

  // Remove searched animation
  setTimeout(function () {
    distanceAndDisplacementBox.classList.remove("right-side-distance-loading-in-anim");
  }, 500);
}

// Add event listener for the distance functionality
// O(n)
distanceInput.addEventListener("keypress", function (keyPressEvent) {
  if (keyPressEvent.key !== "Enter") return;

  // Run the input through distance finder
  const startTime: number = performance.now();
  const input: string[] = splitIDsIntoArray(distanceInput.value);

  if (input.length <= 1) {
    displayError();
  }

  // Find displacement between first and last airport
  const displacement: number | null = getDisplacement(input[0], input[input.length - 1]);

  // If displacement id isn't found or something goes wrong, stop.
  if (!displacement) {
    displayError();
    return;
  }
  
  // Find distance between each id'd airport
  const distanceBetweenEachInput: number[] | null = getDistanceBetweenEveryAirport(input);

  // If one id isn't found or something goes wrong, stop.
  if (!distanceBetweenEachInput) {
    displayError();
    return;
  }

  // Else, show distances and time
  const endTime: number = performance.now();
  searchDistanceTimeIndicator.innerText = "Found distance in " + (endTime - startTime) + "ms";
  displayTotalDistanceAndDisplacement(displacement, getTotalDistance(distanceBetweenEachInput));
});
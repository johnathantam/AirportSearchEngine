"use strict";
// This file handles bonus #1 and #2
// Elements related to search functionality
const distanceInputContainer = document.getElementById("distanceInputContainer");
const distanceInput = document.getElementById("distanceInput");
const distanceResultDisplayBoard = document.getElementById("distanceResultDisplayBoard");
const distanceAndDisplacementBox = document.getElementById("distanceAndDisplacementBox");
const distanceStatistic = document.getElementById("distanceStatistic");
const displacementStatistic = document.getElementById("displacementStatistic");
// Element related to visual signifiers (error, correct, etc.)
const emptyDistanceResultsIndicator = document.getElementById("noResultsPopup");
const searchDistanceTimeIndicator = document.getElementById("distanceResultTimer");
// O(1)
function degToRad(deg) {
    return deg * (Math.PI / 180);
}
// O(1)
// This function returns the distance between two positions based on latitude and longitude
function haversineDistance(lat1, lon1, lat2, lon2) {
    const r = 6371;
    const dLat = (degToRad(lat2 - lat1));
    const dLon = (degToRad(lon2 - lon1));
    // taken from wikipedia
    const d = 2 * r * Math.asin(Math.sqrt((Math.sin(dLat / 2) ** 2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * (Math.sin(dLon / 2) ** 2)));
    return d;
}
// O(1)
function getDisplacement(IDOfFirstAirport, IDOfSecondAirport) {
    const firstIndex = binarySearch(SORTED_IDENTS, IDOfFirstAirport);
    const secondIndex = binarySearch(SORTED_IDENTS, IDOfSecondAirport);
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
function getDistanceBetweenEveryAirport(IDArray) {
    let displacementArr = [];
    let firstIndex = binarySearch(SORTED_IDENTS, IDArray[0]);
    // if id of first airport is not found, stop.
    if (firstIndex === -1) {
        return null;
    }
    for (let i = 1; i < IDArray.length; i++) {
        const secondIndex = binarySearch(SORTED_IDENTS, IDArray[i]);
        // if any id is not found, stop.
        if (secondIndex === -1) {
            return null;
        }
        // if airport is then not the same type or is closed, stop.
        if (data.type[SORTED_IDENTS[secondIndex][1]] !== data.type[SORTED_IDENTS[firstIndex][1]] || data.type[SORTED_IDENTS[secondIndex][1]] === "closed") {
            return null;
        }
        displacementArr[i - 1] = haversineDistance(Number(data.latitude_deg[SORTED_IDENTS[firstIndex][1]]), Number(data.longitude_deg[SORTED_IDENTS[firstIndex][1]]), Number(data.latitude_deg[SORTED_IDENTS[secondIndex][1]]), Number(data.longitude_deg[SORTED_IDENTS[secondIndex][1]]));
        firstIndex = secondIndex;
    }
    return displacementArr;
}
// O(n)
function getTotalDistance(distances) {
    // Add up total distance
    let totalDistance = 0;
    for (let i = 0; i < distances.length; i++) {
        totalDistance += distances[i];
    }
    return totalDistance;
}
// O(n)
function addDisplacement(displacementArr, startTransferIndex, endTransferIndex) {
    const totalTransferIndex = endTransferIndex - startTransferIndex;
    let displacement = 0;
    for (let i = startTransferIndex; i < totalTransferIndex; i++) {
        displacement += displacementArr[i];
    }
    return displacement;
}
// O(n)
function splitIDsIntoArray(ids) {
    let splitByCommas = ids.split(",");
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
    setTimeout(function () {
        distanceInputContainer.classList.remove("left-side-distance-input-error-animation");
    }, 600);
}
// O(1)
function displayTotalDistanceAndDisplacement(displacement, totalDistance) {
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
    if (keyPressEvent.key !== "Enter")
        return;
    // Run the input through distance finder
    const startTime = performance.now();
    const input = splitIDsIntoArray(distanceInput.value);
    if (input.length <= 1) {
        displayError();
    }
    // Find displacement between first and last airport
    const displacement = getDisplacement(input[0], input[input.length - 1]);
    // If displacement id isn't found or something goes wrong, stop.
    if (!displacement) {
        displayError();
        return;
    }
    // Find distance between each id'd airport
    const distanceBetweenEachInput = getDistanceBetweenEveryAirport(input);
    // If one id isn't found or something goes wrong, stop.
    if (!distanceBetweenEachInput) {
        displayError();
        return;
    }
    // Else, show distances and time
    const endTime = performance.now();
    searchDistanceTimeIndicator.innerText = "Found distance in " + (endTime - startTime) + "ms";
    displayTotalDistanceAndDisplacement(displacement, getTotalDistance(distanceBetweenEachInput));
});
//# sourceMappingURL=cumulativeDistance.js.map
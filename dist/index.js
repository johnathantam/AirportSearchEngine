"use strict";
// This file handles all of the frontend of the search engine 
// USES FUNCTIONS FROM util.ts
// Elements related to search functionality
const searchInputContainer = document.getElementById("searchInputContainer");
const searchInput = document.getElementById("searchInput");
const searchResultDisplayBoard = document.getElementById("searchResultDisplayBoard");
// Buttons that set the search type to one of the four categories
const setNameSearchButton = document.getElementById("searchByName");
const setCountrySearchButton = document.getElementById("searchByCountry");
const setTypeSearchButton = document.getElementById("searchByType");
const setIdentSearchButton = document.getElementById("searchByIdent");
const searchByIdentifier = document.getElementById("searchByIdentifier");
// Element related to visual signifiers (error, time, etc.)
const emptyResultsIndicator = document.getElementById("noResultsPopup");
const searchTimeIndicator = document.getElementById("searchResultTimer");
// Miscellanious elements for random airport images
const RANDOM_AIPORT_IMAGES = new Array("darkAirport.png", "colorfulAirport.png", "cityAirport.png", "technoAirport.png", "blackAndWhiteAirport.png", "AIAirport.png", "sadAirport.png", "aestheticAirport.png");
let searchBy = "Name";
// O(1)
function setSearchBy(type, examplarSearch) {
    // Assign global variable to given type
    searchBy = type;
    // Let user know what type it has switched to
    searchByIdentifier.innerText = type;
    // Let user know of a example search given type .e.g Pleasant Hill Airport
    searchInput.value = "";
    searchInput.placeholder = examplarSearch;
}
// O(1)
function createSearchResultItem(item) {
    const searchResult = document.createElement('div');
    const searchResultImage = document.createElement('div');
    const basicSearchResultInformation = document.createElement('p');
    const advancedSearchResultInformation = document.createElement('p');
    // Apply parent structure
    searchResult.appendChild(searchResultImage);
    searchResult.appendChild(basicSearchResultInformation);
    searchResult.appendChild(advancedSearchResultInformation);
    // Apply styling
    searchResult.className = "right-side-search-result-item";
    searchResultImage.className = "right-side-search-result-item-picture";
    searchResultImage.style.backgroundImage = "url('" + "/css/images/" + RANDOM_AIPORT_IMAGES[Math.floor(Math.random() * RANDOM_AIPORT_IMAGES.length)] + "')"; // Load random images from css folder
    basicSearchResultInformation.className = "right-side-search-result-item-information";
    advancedSearchResultInformation.className = "right-side-search-result-item-information right-side-search-result-item-second-information";
    // Add information of airport
    const basicAirportInformation = "<b>Name: </b>" + data.name[item] + "<br>" + "<b>Country: </b>" + data.iso_country[item] + "<br>" + "<b>Type: </b>" + data.type[item] + "<br>" + "<b>ID: </b>" + data.ident[item];
    const advancedAirportInformation = "<b>Continent: </b>" + data.continent[item] + "<br>" + "<b>Region: </b>" + data.iso_region[item] + "<br>" + "<b>Latitude: </b>" + data.latitude_deg[item] + "<br>" + "<b>Longitude: </b>" + data.longitude_deg[item];
    basicSearchResultInformation.innerHTML = basicAirportInformation;
    advancedSearchResultInformation.innerHTML = advancedAirportInformation;
    searchResult.id = "search-result";
    return searchResult;
}
// O(1)
function createLoadMoreButton() {
    // Create a load more button
    const loadMoreButton = document.createElement("button");
    // Apply styling
    loadMoreButton.className = "right-side-search-result-load-more-button";
    // Apply content
    loadMoreButton.innerText = "Load More Items.";
    return loadMoreButton;
}
// O(n)
function displayResults(sortedItems, elementValue, start, padding) {
    // Some search results will have multiple results, so we must check for multiple elements according to the padding
    const indexesToShow = start + padding;
    const lastIndexToShow = indexesToShow - 1;
    const duplicate = elementValue.toLowerCase(); // Reformat to lowercase as our data is sorted as lowercase
    // Start from the leftmost element and display all duplicates to the right if there are any
    for (let i = start; i < indexesToShow; i++) {
        // if we move out of range, stop.
        if (i >= sortedItems.length) {
            return;
        }
        // If we don't find another duplicate, stop.
        const thisItem = sortedItems[i][0];
        if (thisItem !== duplicate) {
            return;
        }
        // If we reach the padded loaded airports and there are more duplicates ahead, stop. And add a load more button
        const nextItem = (i + 1) < sortedItems.length ? sortedItems[i + 1][0] : null;
        if (i === lastIndexToShow && nextItem === duplicate) {
            const loadMoreButton = createLoadMoreButton();
            // Add event to button to load the next amount of items
            loadMoreButton.addEventListener("click", function () {
                displayResults(sortedItems, duplicate, indexesToShow, padding);
                this.remove();
            });
            searchResultDisplayBoard.appendChild(loadMoreButton);
            return;
        }
        // Else we just show the duplicate item
        const searchResult = createSearchResultItem(sortedItems[i][1]);
        searchResultDisplayBoard.appendChild(searchResult);
    }
}
// O(n)
function hidePreviousSearchResults() {
    // Remove all children of the search board
    let children = searchResultDisplayBoard.children;
    while (children.length > 1) { // Keep the first element as that is our title
        children[children.length - 1].remove();
    }
}
// O(1)
function showErrorPopup() {
    emptyResultsIndicator.style.display = "flex";
    // Play error animation
    searchInputContainer.classList.add("left-side-search-input-error-animation");
    // Stop error animation after it ends
    setTimeout(function () {
        searchInputContainer.classList.remove("left-side-search-input-error-animation");
    }, 600);
}
// O(1)
function hideNoResultsPopup() {
    emptyResultsIndicator.style.display = "none";
}
// O(n)
function searchAndDisplay(sortedItems, searchInput) {
    const startTime = performance.now();
    const itemIndex = binarySearch(sortedItems, searchInput);
    const endTime = performance.now();
    // if the item is not found, stop the function and display a error message
    if (itemIndex === -1) {
        hidePreviousSearchResults();
        showErrorPopup();
        return;
    }
    // Countries have multiple airports, so we have to iterate through fifty and add a load more button
    hidePreviousSearchResults();
    hideNoResultsPopup();
    displayResults(sortedItems, searchInput, itemIndex, 25);
    searchTimeIndicator.innerText = "Items searched in " + (endTime - startTime) + "ms";
}
// Add event listeners and functionality to buttons
setNameSearchButton.addEventListener("click", function () { setSearchBy("Name", "E.x. Pleasant Hill Airport"); });
setCountrySearchButton.addEventListener("click", function () { setSearchBy("Country", "E.x. US"); });
setTypeSearchButton.addEventListener("click", function () { setSearchBy("Type", "E.x. heliport"); });
setIdentSearchButton.addEventListener("click", function () { setSearchBy("Ident", "E.x. 19WA"); });
// Add event listener for the search functionality
searchInput.addEventListener("keypress", function (keyPressEvent) {
    if (keyPressEvent.key !== "Enter")
        return;
    const input = searchInput.value;
    switch (searchBy) {
        case "Name":
            searchAndDisplay(SORTED_NAMES, input);
            break;
        case "Type":
            searchAndDisplay(SORTED_TYPES, input);
            break;
        case "Country":
            searchAndDisplay(SORTED_COUNTRIES, input);
            break;
        case "Ident":
            searchAndDisplay(SORTED_IDENTS, input);
            break;
    }
});
//# sourceMappingURL=index.js.map
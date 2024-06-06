"use strict";
// This file handles displaying all airports
// USES FUNCTIONS FROM UTIL.TS
// # of sorted items to display on sort
const DEFAULT_DISPLAY_COUNT = 6;
// Elements related to sort functionality
const sortResultDisplayBoard = document.getElementById("sortResultDisplayBoard");
const sortResultTimer = document.getElementById("sortResultTimer");
const sortByAscendingCheck = document.getElementById("sortByAscendingCheckbox");
const sortByDescendingCheck = document.getElementById("sortByDescendingCheckbox");
// Buttons that set the sort type to one of the four categories
const setNameSortButton = document.getElementById("sortByName");
const setCountrySortButton = document.getElementById("sortByCountry");
const setTypeSortButton = document.getElementById("sortByType");
const setIdentSortButton = document.getElementById("sortByIdent");
const sortByIdenfitifer = document.getElementById("sortByIdentifier");
let sortBy = "Ascending";
let currentsortedItems = SORTED_NAMES; // Create a pointer to the current sorted items we are sorting so we switch to ascending and descending
// O(1)
function createSortResultItem(item) {
    // Create a table, table row, and table data
    const table = document.createElement("table");
    const tableRow = document.createElement("TR");
    const tabularName = document.createElement("TD");
    const tabularType = document.createElement("TD");
    const tabularCountry = document.createElement("TD");
    const tablularIdent = document.createElement("TD");
    const tablularRegion = document.createElement("TD");
    const tabularContinent = document.createElement("TD");
    const tabularLongitude = document.createElement("TD");
    const tabularLatitude = document.createElement("TD");
    // apply parent structure
    table.appendChild(tableRow);
    tableRow.appendChild(tabularName);
    tableRow.appendChild(tabularType);
    tableRow.appendChild(tablularIdent);
    tableRow.appendChild(tabularCountry);
    tableRow.appendChild(tablularRegion);
    tableRow.appendChild(tabularLatitude);
    tableRow.appendChild(tabularLongitude);
    tableRow.appendChild(tabularContinent);
    // Apply styling
    table.className = "right-side-sort-result-tabular-row";
    tabularName.className = "sorted-tabular-item";
    tabularType.className = "sorted-tabular-item";
    tabularCountry.className = "sorted-tabular-item";
    tablularIdent.className = "sorted-tabular-item";
    tablularRegion.className = "sorted-tabular-item";
    tabularContinent.className = "sorted-tabular-item";
    tabularLongitude.className = "sorted-tabular-item";
    tabularLatitude.className = "sorted-tabular-item";
    // Add content
    tabularName.innerText = data.name[item];
    tabularType.innerText = data.type[item];
    tabularCountry.innerText = data.iso_country[item];
    tablularIdent.innerText = data.ident[item];
    tablularRegion.innerText = data.iso_region[item];
    tabularContinent.innerText = data.continent[item];
    tabularLongitude.innerText = data.longitude_deg[item];
    tabularLatitude.innerText = data.latitude_deg[item];
    return table;
}
// O(1)
function createLoadMoreSortedItemsButton() {
    // Create a load more button
    const loadMoreButton = document.createElement("button");
    // Apply styling
    loadMoreButton.className = "right-side-sort-result-load-more-button";
    // Apply content
    loadMoreButton.innerText = "Load More Items.";
    return loadMoreButton;
}
// O(n)
function displaySortedItemsAscendingly(sortedItems, start, padding) {
    const indexesToShow = start + padding;
    const lastIndexToShow = indexesToShow - 1;
    const totalDataLength = data.name.length;
    // Loop through sorted items starting a certain index and display a certain amount to the right (ascending)
    for (let i = start; i < indexesToShow; i++) {
        // if we finish showing all the sorted items, stop.
        if (i >= totalDataLength) {
            return;
        }
        // And if we have reached the end of items to show, add a load more button
        if (i === lastIndexToShow) {
            const loadMoreButton = createLoadMoreSortedItemsButton();
            // Add load more functionality
            loadMoreButton.addEventListener("click", function () {
                displaySortedItemsAscendingly(sortedItems, indexesToShow, padding);
                this.remove();
            });
            sortResultDisplayBoard.appendChild(loadMoreButton);
            return;
        }
        // Else, display the next in line ascending item
        const sortedItem = createSortResultItem(sortedItems[i][1]);
        sortResultDisplayBoard.appendChild(sortedItem);
    }
}
// O(n)
function displaySortedItemsDescendingly(sortedItems, end, padding) {
    const indexesToShow = end - padding;
    const lastIndexToShow = indexesToShow + 1;
    // Loop through sorted items starting a certain index and display a certain amount to the left (descending)
    for (let i = end; i > indexesToShow; i--) {
        // if we finish showing all the sorted items, stop.
        if (i < 0) {
            return;
        }
        // And if we have reached the end, add a load more button
        if (i === lastIndexToShow) {
            const loadMoreButton = createLoadMoreSortedItemsButton();
            // Add load more functionality
            loadMoreButton.addEventListener("click", function () {
                displaySortedItemsDescendingly(sortedItems, lastIndexToShow, padding);
                this.remove();
            });
            sortResultDisplayBoard.appendChild(loadMoreButton);
            return;
        }
        // Else, display descending item next in line
        const sortedItem = createSortResultItem(sortedItems[i][1]);
        sortResultDisplayBoard.appendChild(sortedItem);
    }
}
// O(n)
function hidePreviousSortedResults() {
    // Remove all children of the search board
    let children = sortResultDisplayBoard.children;
    while (children.length > 0) {
        children[children.length - 1].remove();
    }
}
// O(n)
function displaySortedItems(sortedItems) {
    const startTime = performance.now();
    if (sortBy === "Ascending") {
        displaySortedItemsAscendingly(sortedItems, 0, DEFAULT_DISPLAY_COUNT);
    }
    else {
        displaySortedItemsDescendingly(sortedItems, sortedItems.length - 1, DEFAULT_DISPLAY_COUNT);
    }
    const endTime = performance.now();
    sortResultTimer.innerText = `Items sorted and displayed in ${endTime - startTime}ms`;
}
// O(n)
function handleSortButtonClick(sortedItems, identifier) {
    hidePreviousSortedResults();
    displaySortedItems(sortedItems);
    currentsortedItems = sortedItems;
    sortByIdenfitifer.innerText = identifier;
}
// Add event listeners and functionality to buttons
// O(n)
setNameSortButton.addEventListener("click", () => {
    handleSortButtonClick(SORTED_NAMES, "Name");
});
// O(n)
setCountrySortButton.addEventListener("click", () => {
    handleSortButtonClick(SORTED_COUNTRIES, "Country");
});
// O(n)
setTypeSortButton.addEventListener("click", () => {
    handleSortButtonClick(SORTED_TYPES, "Type");
});
// O(n)
setIdentSortButton.addEventListener("click", () => {
    handleSortButtonClick(SORTED_IDENTS, "Ident");
});
// Add event listeners and functionality to ascending or descending checkboxes
// O(n)
sortByAscendingCheck.addEventListener("click", (event) => {
    hidePreviousSortedResults();
    // if ascending check is disabled, sort by descending order instead
    if (sortByAscendingCheck.checked === false) {
        sortByDescendingCheck.checked = true;
        sortBy = "Descending";
        displaySortedItems(currentsortedItems);
        return;
    }
    // Otherwise if ascending check is being enabled, sort by ascending order
    sortByDescendingCheck.checked = false;
    sortBy = "Ascending";
    displaySortedItems(currentsortedItems);
});
// O(n)
sortByDescendingCheck.addEventListener("click", (event) => {
    hidePreviousSortedResults();
    // if descending check is disabled, sort by ascending order instead
    if (sortByDescendingCheck.checked === false) {
        sortByAscendingCheck.checked = true;
        sortBy = "Ascending";
        displaySortedItems(currentsortedItems);
        return;
    }
    // Otherwise if descending check is being enabled, sort by descending order
    sortByAscendingCheck.checked = false;
    sortBy = "Descending";
    displaySortedItems(currentsortedItems);
});
// Initially show sorted name elements
displaySortedItems(SORTED_NAMES);
//# sourceMappingURL=allAirports.js.map
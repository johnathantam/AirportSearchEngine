// This file handles displaying all airports
// USES FUNCTIONS FROM UTIL.TS

// # of sorted items to display on sort
const DEFAULT_DISPLAY_COUNT: number = 6;

// Elements related to sort functionality
const sortResultDisplayBoard: HTMLTableSectionElement = document.getElementById("sortResultDisplayBoard") as HTMLTableSectionElement;
const sortResultTimer: HTMLParagraphElement = document.getElementById("sortResultTimer") as HTMLParagraphElement;
const sortByAscendingCheck: HTMLInputElement = document.getElementById("sortByAscendingCheckbox") as HTMLInputElement;
const sortByDescendingCheck: HTMLInputElement = document.getElementById("sortByDescendingCheckbox") as HTMLInputElement;

// Buttons that set the sort type to one of the four categories
const setNameSortButton: HTMLButtonElement = document.getElementById("sortByName") as HTMLButtonElement;
const setCountrySortButton: HTMLButtonElement = document.getElementById("sortByCountry") as HTMLButtonElement;
const setTypeSortButton: HTMLButtonElement = document.getElementById("sortByType") as HTMLButtonElement;
const setIdentSortButton: HTMLButtonElement = document.getElementById("sortByIdent") as HTMLButtonElement;
const sortByIdenfitifer: HTMLParagraphElement = document.getElementById("sortByIdentifier") as HTMLParagraphElement;

let sortBy: string = "Ascending";
let currentsortedItems: [string, number][] = SORTED_NAMES; // Create a pointer to the current sorted items we are sorting so we switch to ascending and descending

// O(1)
function createSortResultItem(item: number): HTMLTableElement {
  // Create a table, table row, and table data
  const table: HTMLTableElement = document.createElement("table") as HTMLTableElement;
  const tableRow: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
  const tabularName: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
  const tabularType: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
  const tabularCountry: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
  const tablularIdent: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
  const tablularRegion: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
  const tabularContinent: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
  const tabularLongitude: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
  const tabularLatitude: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;

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
function createLoadMoreSortedItemsButton(): HTMLButtonElement {
  // Create a load more button
  const loadMoreButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;

  // Apply styling
  loadMoreButton.className = "right-side-sort-result-load-more-button";

  // Apply content
  loadMoreButton.innerText = "Load More Items.";

  return loadMoreButton;
}

// O(n)
function displaySortedItemsAscendingly(sortedItems: [string, number][], start: number, padding: number): void {
  const indexesToShow: number = start + padding;
  const lastIndexToShow: number = indexesToShow - 1;
  const totalDataLength: number = data.name.length;

  // Loop through sorted items starting a certain index and display a certain amount to the right (ascending)
  for (let i = start; i < indexesToShow; i++) {
    // if we finish showing all the sorted items, stop.
    if (i >= totalDataLength) {
      return;
    }

    // And if we have reached the end of items to show, add a load more button
    if (i === lastIndexToShow) {
      const loadMoreButton: HTMLButtonElement = createLoadMoreSortedItemsButton();

      // Add load more functionality
      loadMoreButton.addEventListener("click", function () { 
        displaySortedItemsAscendingly(sortedItems, indexesToShow, padding); 
        this.remove();
      })

      sortResultDisplayBoard.appendChild(loadMoreButton);
      return;
    }

    // Else, display the next in line ascending item
    const sortedItem: HTMLDivElement = createSortResultItem(sortedItems[i][1]);
    sortResultDisplayBoard.appendChild(sortedItem);
  }
}

// O(n)
function displaySortedItemsDescendingly(sortedItems: [string, number][], end: number, padding: number): void {
  const indexesToShow: number = end - padding;
  const lastIndexToShow: number = indexesToShow + 1;

  // Loop through sorted items starting a certain index and display a certain amount to the left (descending)
  for (let i = end; i > indexesToShow; i--) {
    // if we finish showing all the sorted items, stop.
    if (i < 0) {
      return;
    }

    // And if we have reached the end, add a load more button
    if (i === lastIndexToShow) {
      const loadMoreButton: HTMLButtonElement = createLoadMoreSortedItemsButton();

      // Add load more functionality
      loadMoreButton.addEventListener("click", function () { 
        displaySortedItemsDescendingly(sortedItems, lastIndexToShow, padding); 
        this.remove();
      })

      sortResultDisplayBoard.appendChild(loadMoreButton);
      return;
    }

    // Else, display descending item next in line
    const sortedItem: HTMLDivElement = createSortResultItem(sortedItems[i][1]);
    sortResultDisplayBoard.appendChild(sortedItem);
  }
}

// O(n)
function hidePreviousSortedResults(): void {
  // Remove all children of the search board
  let children: HTMLCollection = sortResultDisplayBoard.children;
  while (children.length > 0) {
    children[children.length - 1].remove();
  }
}

// O(n)
function displaySortedItems(sortedItems: [string, number][]) {
  const startTime: number = performance.now();
  
  if (sortBy === "Ascending") {
    displaySortedItemsAscendingly(sortedItems, 0, DEFAULT_DISPLAY_COUNT);
  } else {
    displaySortedItemsDescendingly(sortedItems, sortedItems.length-1, DEFAULT_DISPLAY_COUNT);
  }

  const endTime: number = performance.now();
  sortResultTimer.innerText = `Items sorted and displayed in ${endTime - startTime}ms`;
}

// O(n)
function handleSortButtonClick(sortedItems: [string, number][], identifier: string) {
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
})

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
})

// Initially show sorted name elements
displaySortedItems(SORTED_NAMES);
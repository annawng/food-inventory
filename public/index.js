/**
 * This JS file implements the UI for my food inventory project, enabling the
 * user to view, add to, and remove from the inventory.
 */
"use strict";
(function() {
  const EMPTY_MESSAGE = "No items added yet!";
  const REMOVE_MESSAGE = "To remove an item, double-click the associated row.";

  window.addEventListener("load", init);

  /**
   * Initializes the submit button to process the information in the form when
   * clicked.
   */
  function init() {
    getPreviousInventory();
    id("name-form").addEventListener("submit", displayName);
    id("item-form").addEventListener("submit", addItem);
  }

  /* -------------------- AJAX Request Functions -------------------- */
  /**
   * Gets the previous state of the inventory, as in what items were in the
   * inventory before the page was reloaded, and displays that inventory in the
   * table on the page.
   */
  function getPreviousInventory() {
    fetch("/inventory")
      .then(statusCheck)
      .then(res => res.json())
      .then(loadInventory)
      .catch(handleError);
  }

  /**
   * Displays the name entered by the user in the form as part of the main
   * heading of the page.
   * @param {Object} event - the event object
   */
  function displayName(event) {
    event.preventDefault();
    fetch("/name/" + id("name").value)
      .then(statusCheck)
      .then(res => res.text())
      .then(updateInventoryName)
      .catch(handleError);
    clearForm("name-form");
  }

  /**
   * Using user-entered data from the form, adds an item and any associated
   * provided information to the inventory, which is displayed on the screen.
   * @param {Object} event - the event object
   */
  function addItem(event) {
    event.preventDefault();
    let params = new FormData(id("item-form"));
    fetch("/add", {method: "POST", body: params})
      .then(statusCheck)
      .then(res => res.json())
      .then(showItem)
      .catch(handleError);
    clearForm("item-form");
  }

  /**
   * Removes item that user double-clicked from the table. If the inventory
   * then contains no items, hides the table and changes the message displayed.
   */
  function removeItem() {
    let rowNum = this.id.substring(this.id.indexOf("-") + 1);
    let params = new FormData();
    params.append("row", rowNum);
    fetch("/remove", {method: "POST", body: params})
      .then(statusCheck)
      .then(res => res.json())
      .then(updateInventory)
      .catch(handleError);
  }

  /* -------------------- Helper Functions -------------------- */
  /**
   * Displays all items in the inventory in the table on the page.
   * @param {Object} res - the response from the API containing the inventory
   */
  function loadInventory(res) {
    let inventory = JSON.parse(res);
    for (let i = 0; i < inventory.length; i++) {
      processEntry(inventory[i]);
    }
    if (inventory.length !== 0 && qs("table").classList.contains("hidden")) {
      toggleInventory();
    }
  }

  /**
   * Displays the string with the user-entered name as the name of the food inventory.
   * @param {Object} res - the response from the API containing the string to display
   */
  function updateInventoryName(res) {
    qs("h1").textContent = res;
  }

  /**
   * Adds the item submitted by the user to the inventory table.
   * @param {Object} res - the response from the API containing the inventory
   */
  function showItem(res) {
    res = JSON.parse(res);
    let itemInfo = res[res.length - 1];
    processEntry(itemInfo);
    if (qs("table").classList.contains("hidden")) {
      toggleInventory();
    }
  }

  /**
   * Replaces the contents of the table with the items currently in the inventory,
   * effectively removing any items the user requested to be removed.
   * @param {Object} res - the response from the API containing the inventory
   */
  function updateInventory(res) {
    qs("tbody").innerHTML = "";
    loadInventory(res);
    if (qsa("tr").length === 1) {
      toggleInventory();
    }
  }

  /**
   * Clears the user input in the form with the given ID.
   * @param {String} formId - the ID of the form to clear
   */
  function clearForm(formId) {
    let fields = qsa("form#" + formId + " input");
    for (let i = 0; i < fields.length; i++) {
      fields[i].value = "";
    }
  }

  /**
   * Adds a blank row to the inventory table and enables the row to be removed
   * by double-clicking.
   * @returns {Object} the created row
   */
  function createRow() {
    let tableBody = qs("tbody");
    let row = gen("tr");
    let rowCount = qsa("tbody tr").length;
    row.id = "row-" + rowCount;
    tableBody.appendChild(row);
    row.addEventListener("dblclick", removeItem);
    return row;
  }

  /**
   * Adds info about an item to the corresponding cells of a new row added to
   * the table.
   * @param {Object} itemInfo - the object containing information about the item
   */
  function processEntry(itemInfo) {
    let row = createRow();
    for (let key in itemInfo) {
      let tableData = gen("td");
      tableData.textContent = itemInfo[key];
      row.appendChild(tableData);
    }
  }

  /**
   * Toggles the visibility of the inventory table and changes the message
   * displayed above or in place of the table.
   */
  function toggleInventory() {
    qs("table").classList.toggle("hidden");
    if (id("message").textContent === EMPTY_MESSAGE) {
      id("message").textContent = REMOVE_MESSAGE;
    } else {
      id("message").textContent = EMPTY_MESSAGE;
    }
  }

  /**
   * Throws an error if the fetch call is not successful in retrieving the data
   * from the server.
   * @param {Object} response - the response from the server
   * @returns {Object} the response from the server
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * Displays the error message associated with the given error.
   * @param {Object} error - the error sent by the API
   */
  function handleError(error) {
    let errorMessage = id("error");
    if (errorMessage === null) {
      errorMessage = gen("p");
      errorMessage.id = "error";
      id("error-section").appendChild(errorMessage);
    }
    errorMessage.textContent = error;
  }

  /* -------------------- Shortcut Helper Functions -------------------- */
  /**
   * ID helper function
   * @param {String} id name of id
   * @returns {Object} element with id name
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Query selector helper function
   * @param {String} selector name of selector
   * @returns {Object} element with selector name
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Query selector all helper function
   * @param {String} selector name of selector
   * @returns {Array} array of elements with selector name
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Create element helper function
   * @param {String} tagName name of tag
   * @returns {Object} element created with tag name
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();
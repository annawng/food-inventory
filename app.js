/**
 * This API manages the food inventory, allowing the client to retrieve the
 * current inventory, add and remove items, and add a name to the main heading
 * via GET and POST requests.
 */
"use strict";
const multer = require("multer");
const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const KEYS = ['item', 'category', 'quantity', 'purchase-date', 'exp-date'];
const ERROR_CODE = 400;
const LOCAL_PORT = 8000;
let inventory = []; // items in the inventory

/* -------------------- Endpoints -------------------- */
/**
 * Sends the current inventory as an array in JSON format. Each item in the
 * inventory is represented by a JS object containing the keys listed in the
 * KEYS constant.
 */
app.get("/inventory", function(req, res) {
  res.json(JSON.stringify(inventory));
});

/**
 * Adds the item sent through the request body to the inventory array if a
 * valid item is given (that is, it is a JS object containing the keys listed
 * above) and sends back the inventory updated with that item. If the
 * information given about the item is invalid, sends a 400 error.
 */
app.post("/add", function(req, res) {
  if (isValid(req.body)) {
    inventory.push(req.body);
    res.json(JSON.stringify(inventory));
  } else {
    sendError(res, "invalid parameters");
  }
});

/**
 * Removes the item indicated by the request from the inventory array. A valid
 * request body contains a number that indicates the zero-indexed row of the
 * item in the inventory table, which corresponds to the index of that item in
 * the inventory array. Sends the updated inventory (no longer containing the
 * removed item) if successful or a 400 error if not.
 */
app.post("/remove", function(req, res) {
  let row = parseInt(req.body.row);
  if (inventory[row] !== undefined) {
    inventory.splice(row, 1);
    res.json(JSON.stringify(inventory));
  } else {
    sendError(res, "invalid row number");
  }
});

/* -------------------- Helper Functions -------------------- */
/**
 * Checks whether the object sent via the request body is a valid item to be
 * added to the food inventory.
 * @param {Object} body - the JSON object sent via the request body
 * @returns {Boolean} true if the object contains all the correct keys, false if not
 */
function isValid(body) {
  for (let i = 0; i < KEYS.length; i++) {
    if (body[KEYS[i]] === undefined) {
      return false;
    }
  }
  return true;
}

/**
 * Sends a 400 error to the client with a message describing what the issue is.
 * @param {Object} res - the response to be sent back to the client
 * @param {String} message - the error message to send via the response
 */
function sendError(res, message) {
  res.type("text").status(ERROR_CODE)
    .send(message);
}

app.use(express.static("public"));
const PORT = process.env.PORT || LOCAL_PORT;
app.listen(PORT);
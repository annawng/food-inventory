# Food Inventory API Documentation
The Food Inventory API provides information about the items in the inventory and can add and remove items from it.

## Get current inventory
**Request Format:** /inventory

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Return an array of all the items in the food inventory.


**Example Request:** /inventory

**Example Response:**

```json
[
  {
    "item": "milk",
    "category": "dairy",
    "quantity": "1",
    "purchase-date": "2021-08-12",
    "exp-date": "1991-07-13"
  },
  {
    "item": "donuts",
    "category": "dessert",
    "quantity": "12",
    "purchase-date": "2021-08-12",
    "exp-date": "2021-08-16"
  }
]
```

**Error Handling:**
N/A

## Add item to inventory
**Request Format:** /add endpoint with POST parameters of `item`, `category`, `quantity`, `purchase-date`, and `exp-date`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Adds the given item to the food inventory and returns an updated array of all the items in the inventory.


**Example Request:** /add with POST parameters of `item=apples`, `category=fruit`, `quantity=6`, `"purchase-date"="2021-08-12"`, and `"exp-date"=""`

**Example Response:**

```json
[
  {
    "item": "milk",
    "category": "dairy",
    "quantity": "1",
    "purchase-date": "2021-08-12",
    "exp-date": "1991-07-13"
  },
  {
    "item": "donuts",
    "category": "dessert",
    "quantity": "12",
    "purchase-date": "2021-08-12",
    "exp-date": "2021-08-16"
  },
  {
    "item": "apples",
    "category": "fruit",
    "quantity": "6",
    "purchase-date": "2021-08-12",
    "exp-date": ""
  }
]
```

**Error Handling:**
Possible 400 (invalid request) error (plain text):
- If not given data with all the correct parameters, returns an error with the message `invalid parameters`.

## Remove item from inventory
**Request Format:** /remove endpoint with POST parameter of `row`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Removes the item at the given `row` from the food inventory, assuming the first row is at index 0, and returns an updated array of all the items in the inventory.


**Example Request:** /remove with POST parameter of `row=1`

**Example Response:**

```json
[
  {
    "item": "milk",
    "category": "dairy",
    "quantity": "1",
    "purchase-date": "2021-08-12",
    "exp-date": "1991-07-13"
  }
]
```

**Error Handling:**
Possible 400 (invalid request) error (plain text):
- If given an invalid row number (e.g. not a number or a number greater than or equal to the number of rows or less than 0), returns an error with the message `invalid row number`.
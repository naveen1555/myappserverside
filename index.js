const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());

const dbPath = path.join(__dirname, "customerdatabase.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Get Customer Details List
app.get("/selectCustomers", async (request, response) => {
  const getCustomerQuery = `
      SELECT
        *
      FROM
        customerdata;`;
  const customerArray = await db.all(getCustomerQuery);
  response.send(customerArray);
});

// //Get Customer Detail//

app.get("/selectCustomers/:customerId/", async (request, response) => {
  const { customerId } = request.params;
  const getCustomer = `
      SELECT
        *
      FROM
        customerdata
      WHERE
      id = ${customerId};`;
  const customer = await db.get(getCustomer);
  response.send(customer);
});

// Adding Customer Details
app.post("/selectCustomers/", async (request, response) => {
  const customerDetails = request.body;
  const {
    id,
    name,
    email,
    password,
    address,
    phoneNumber,
    cart,
    products,
    couponcode,
  } = customerDetails;
  const addcustomerQuery = `
      INSERT INTO
        customerdata(id,name,email,password,address,phoneNumber,cart,products,couponcode)
      VALUES
        (
          ${id},
          '${name}',
          '${email}',
          '${password}',
          '${address}',
          ${phoneNumber},
          '${cart}',
          '${products}',
          ${couponcode},
        );`;

  const dbResponse = await db.run(addcustomerQuery);
  const customerId = dbResponse.lastID;
  response.send({ newcustomerId: customerId });
});


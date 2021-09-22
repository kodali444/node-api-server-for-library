/* Load frameworks */
const express = require("express");
const bodyParser = require("body-parser");

/* Initialize express server to server our end points */
const app = express();

/* built in filesystem libray */
const fs = require("fs");

/* add bodyparser settings to our express instance */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/routes")(app, fs);
/* launch server on port 4444 */
const server = app.listen(4444, () => {
  console.log("node server listening on %s ", server.address().port);
});

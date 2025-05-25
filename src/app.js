const express = require('express');
const routes = require('./routes');
const handlebars = require('express-handlebars');

const app = express();
const path = require("path");

// Handlebars Config
app.engine("hbs", handlebars.engine ({
    extname: ".hbs",
    defaultLayout: "main"
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, 'views'));

// MIDELLWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
app.use("/api", routes);

module.exports = app;

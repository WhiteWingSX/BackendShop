const express = require('express');
const routes = require('./routes');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const path = require("path");
const dotenv = require('dotenv');

const app = express();

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

// Conexión a MongoDB
mongoose.connect(mongoUrl, {})
    .then(() => console.log('¡conection completed!'))
    .catch(err => console.error('Error to connect to server', err));

// Handlebars Config con helpers
app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        multiply: (a, b) => a * b,
        calcTotal: (products) => {
            let total = 0;
            products.forEach(p => {
                total += p.product.price * p.quantity;
            });
            return total;
        },
        eq: (a, b) => a === b
    }
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use("/", routes);

module.exports = app;

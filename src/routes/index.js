const express = require("express");
const router = express.Router();

const ProductRouter = require("./products");
const CartRouter = require("./cart");
const ViewRoutes = require("./views");

router.use("/api/products", ProductRouter);
router.use("/api/carts", CartRouter);

router.use("/", ViewRoutes);

module.exports = router;

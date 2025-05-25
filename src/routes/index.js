const express = require("express");
const router = express.Router();
const ProductRouter = require("./products");
const cartRouter = require("./cart");
const viewRoutes = require("./views");

router.use("/products", ProductRouter);
router.use("/cart", cartRouter);
router.use("/views", viewRoutes);

module.exports = router;

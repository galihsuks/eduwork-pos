const router = require("express").Router();
const orderController = require("./controller");
const { police_check } = require("../../middlewares");

router.get("/order", police_check("view", "Order"), orderController.index);
router.post("/order", police_check("create", "Order"), orderController.store);

module.exports = router;

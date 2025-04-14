const router = require("express").Router();
const { police_check } = require("../../middlewares");
const cartController = require("./controller");

router.get("/cart", police_check("read", "Cart"), cartController.index);
router.put("/cart", police_check("update", "Cart"), cartController.update);
module.exports = router;

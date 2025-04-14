const router = require("express").Router();
const deliveryAddressController = require("./controller");
const { police_check } = require("../../middlewares");

router.get(
    "/delivery-address",
    police_check("view", "DeliveryAddress"),
    deliveryAddressController.index
);
router.post(
    "/delivery-address",
    police_check("create", "DeliveryAddress"),
    deliveryAddressController.store
);
router.put("/delivery-address/:id", deliveryAddressController.update);
router.delete("/delivery-address/:id", deliveryAddressController.destroy);

module.exports = router;

const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const { rootPath } = require("../config");

router.get("/:filename", (req, res) => {
    const filePath = path.join(
        rootPath,
        "public/images/products",
        req.params.filename
    );
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    res.status(404).json({ message: "File not found" });
});

module.exports = router;

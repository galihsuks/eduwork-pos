const router = require("express").Router();
const config = require("../config");

router.get("/provinsi", async (req, res) => {
    try {
        const resFetch = await fetch(
            "https://pro.rajaongkir.com/api/province",
            {
                method: "get",
                headers: {
                    key: config.rajaOngkir,
                },
            }
        );
        const resJson = await resFetch.json();
        return res.json(resJson);
    } catch (err) {
        return res.json({
            error: 1,
            message: "Server error",
        });
    }
});
router.get("/kabupaten", async (req, res) => {
    try {
        const { provinsi } = req.query;
        const resFetch = await fetch(
            `https://pro.rajaongkir.com/api/city?province=${provinsi}`,
            {
                method: "get",
                headers: {
                    key: config.rajaOngkir,
                },
            }
        );
        const resJson = await resFetch.json();
        return res.json(resJson);
    } catch (err) {
        return res.json({
            error: 1,
            message: "Server error",
        });
    }
});
router.get("/kecamatan", async (req, res) => {
    try {
        const { kabupaten } = req.query;
        const resFetch = await fetch(
            `https://pro.rajaongkir.com/api/subdistrict?city=${kabupaten}`,
            {
                method: "get",
                headers: {
                    key: config.rajaOngkir,
                },
            }
        );
        const resJson = await resFetch.json();
        return res.json(resJson);
    } catch (err) {
        return res.json({
            error: 1,
            message: "Server error",
        });
    }
});
router.get("/kelurahan", async (req, res) => {
    try {
        const { kecamatan } = req.query; //kecamatan hrs bentul encode URI
        const resFetch = await fetch(
            `https://dakotacargo.co.id/api/api_glb_M_kodepos.asp?key=15f6a51696a8b034f9ce366a6dc22138&id=11022019000001&aKec=${kecamatan}`
        );
        const resJson = await resFetch.json();
        return res.json(resJson);
    } catch (err) {
        return res.json({
            error: 1,
            message: "Server error",
        });
    }
});
module.exports = router;

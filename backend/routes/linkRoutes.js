const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/linkController");

router.post("/links", ctrl.createLink);
router.get("/links", ctrl.getAllLinks);
router.get("/links/:code", ctrl.getSingleLink);
router.delete("/links/:code", ctrl.deleteLink);

module.exports = router;

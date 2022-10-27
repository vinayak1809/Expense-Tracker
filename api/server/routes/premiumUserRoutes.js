const express = require("express");
const router = express.Router();

const premiumController = require("../controllers/premiumUser");
const middleware = require("../../middleware/auth");

router.post("/order", middleware.authenticate, premiumController.postOrder);
//router.post(
//  "/checkout",
//  middleware.authenticate,
//  premiumController.checkoutOrder
//);
router.post("/verify", middleware.authenticate, premiumController.verifyOrder);

router.get("/report", middleware.authenticate, premiumController.getReport);
//router.get("/download", middleware.authenticate, premiumController.download);
router.post("/postFile", middleware.authenticate, premiumController.postFile);
router.get("/getFile", middleware.authenticate, premiumController.getFile);
router.get("/key", middleware.authenticate, premiumController.key);
//router.post("/password/forgotpassword", authController.postMail);

module.exports = router;

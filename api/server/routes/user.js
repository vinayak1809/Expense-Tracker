const express = require("express");
const router = express.Router();

const authController = require("../controllers/authorization");
const userExpense = require("../controllers/user");
const premiumController = require("../controllers/premiumUser");

const middleware = require("../../middleware/auth");

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/expense", middleware.authenticate, userExpense.getExpenses);
router.post("/add-expense", middleware.authenticate, userExpense.addExpense);
router.post(
  "/delete-expense",
  middleware.authenticate,
  userExpense.deleteExpense
);

router.post("/order", middleware.authenticate, premiumController.postOrder);
//router.post(
//  "/checkout",
//  middleware.authenticate,
//  premiumController.checkoutOrder
//);
router.post("/verify", middleware.authenticate, premiumController.verifyOrder);

// router.get("/report", middleware.authenticate, premiumController.getReport);
router.get("/download", middleware.authenticate, premiumController.download);
router.post("/postFile", middleware.authenticate, premiumController.postFile);
router.get("/getFile", middleware.authenticate, premiumController.getFile);
//router.post("/password/forgotpassword", authController.postMail);

module.exports = router;

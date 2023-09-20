const express = require("express");
const router = express.Router();

const addCreditExpense = require("../controllers/userCreditExpesnse");
const middleware = require("../../middleware/auth");
const { route } = require("./authRoutes");

router.post(
  "/add-credit-expense",
  middleware.authenticate,
  addCreditExpense.addCreditExpense
);

router.get(
  "/get-credit-expense",
  middleware.authenticate,
  addCreditExpense.getCreditExpense
);

router.get(
  "/get-edit-credit-expense",
  middleware.authenticate,
  addCreditExpense.getEditCreditExpense
);

module.exports = router;

const express = require("express");
const router = express.Router();

const userExpense = require("../controllers/user");
const middleware = require("../../middleware/auth");

router.get("/expense", middleware.authenticate, userExpense.getExpenses);
router.post("/add-expense", middleware.authenticate, userExpense.addExpense);
router.get(
  "/edit-expense",
  middleware.authenticate,
  userExpense.getEditExpense
);
router.post(
  "/edit-expense",
  middleware.authenticate,
  userExpense.postEditExpense
);
router.post(
  "/delete-expense",
  middleware.authenticate,
  userExpense.deleteExpense
);

module.exports = router;

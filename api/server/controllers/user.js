const express = require("express");
const Expenses = require("../src/models/expenses");
const JSAlert = require("alert");
const ITEMS_PER_PAGE = 3;

exports.getExpenses = function (req, res, next) {
  const page = +req.query.page || 1;

  return Expenses.findAll({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  }).then((expense) => {
    res.json(expense);
  });
};

exports.addExpense = function (req, res, next) {
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;

  if (category.length == 0 || description.length == 0 || amount.length == 0) {
    return res
      .status(400)
      .json({ success: false, message: "parameter missing" });
  }

  Expenses.create({
    category: category,
    description: description,
    amount: amount,
    userId: req.id,
  })
    .then((expense) => {
      res.status(200).json({ success: true, message: "Item added" });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err });
    });
};

exports.deleteExpense = (req, res, next) => {
  const id = req.body.id;
  console.log("req.id>>>>>>", req.id, id);

  if (id == undefined) {
    res.status(400).json({ success: false, message: "undefined" });
  }

  Expenses.destroy({ where: { id: id, userId: req.id } })
    .then((result) => {
      res.status(200).json({ success: true, message: "Item deleted" });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "you are not authorized user to delete this item",
      });
    });
};

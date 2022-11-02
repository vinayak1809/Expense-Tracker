const express = require("express");
const Expenses = require("../src/models/expenses");
const JSAlert = require("alert");
const page = 2;

exports.getExpenses = function (req, res, next) {
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = +req.query.item || 1;

  return Expenses.findAndCountAll({
    where: { userId: req.id },

    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  }).then((expense) => {
    console.log(expense.count, expense.rows);
    res.json({ expense: expense, premium: req.premium });
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

exports.getEditExpense = (req, res, next) => {
  const id = req.query.id;
  try {
    Expenses.findAll({ where: { id: id, userId: req.id } }).then((expense) => {
      res.status(200).json({ success: true, expense: expense });
    });
  } catch {
    console.log(err, "error in edit expense");
  }
};

exports.postEditExpense = (req, res) => {
  const id = req.body.id;
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;

  if (category.length == 0 || description.length == 0 || amount.length == 0) {
    return res
      .status(400)
      .json({ success: false, message: "parameter missing" });
  }

  Expenses.update(
    {
      category: category,
      description: description,
      amount: amount,
    },
    { where: { id: id, userId: req.id } }
  ).then((expense) => {
    res.status(200).json({ success: true, message: "Item edited" });
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

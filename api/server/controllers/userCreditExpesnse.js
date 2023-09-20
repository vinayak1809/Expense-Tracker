const express = require("express");
const CreditExpense = require("../src/models/CreditExpenses");
const sequelize = require("sequelize");
const { ResponseError } = require("@sendgrid/mail");
const s = require("../util/database");

exports.addCreditExpense = (req, res, next) => {
  const description = req.body.description;
  const amount = req.body.amount;

  if (description.length == 0 || amount.length == 0) {
    return res
      .status(400)
      .json({ success: false, message: "parameter missing" });
  }

  CreditExpense.create({
    description: description,
    creditAmount: amount,
    userId: req.id,
  })
    .then((expense) => {
      res.status(200).json({ success: true, message: "Item added" });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err });
    });
};

exports.getCreditExpense = (req, res, next) => {
  const sum = CreditExpense.findAll({
    where: { userId: req.id },
    attributes: [sequelize.fn("SUM", sequelize.col("creditAmount"))],
    raw: true,
  });

  const creditExpList = CreditExpense.findAll({
    where: { userId: req.id },
  });

  Promise.all([sum, creditExpList]).then((response) => {
    res
      .status(200)
      .json({ success: true, sum: response[0], creditExpList: response[1] });
  });
};

exports.getEditCreditExpense = (req, res, next) => {
  const id = req.query.id;
  try {
    console.log(req.id, "iddddd");
    CreditExpense.findAll({ where: { id: id, userId: req.id } }).then(
      (expense) => {
        res.status(200).json({ success: true, expense: expense });
      }
    );
  } catch {
    console.log(err, "error in edit expense");
  }
};

const users = s
  .query(
    "SELECT description as des,updatedAt as upAt,amount as amt FROM expenses UNION SELECT description,updatedAt ,CreditAmount   FROM CreditExpenses Order by upAt;"
  )
  .then((response) => {
    console.log(response, "eeeeeeeeeeeeeeeeeee");
  });

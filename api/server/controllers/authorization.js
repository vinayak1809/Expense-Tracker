const express = require("express");
const User = require("../src/models/user");
const JSAlert = require("alert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

///////////////////////////////////////////////
// signup
///////////////////////////////////////////////

exports.getSignup = (req, res, next) => {
  res.render("user/signup", {
    pageTitle: "Add Product",
    path: "/",
    editing: false,
    formsCSS: true,
    login: false,
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const password = req.body.password;
  const saltRounds = 10;

  if (
    name.length == 0 ||
    email.length == 0 ||
    phone_number.length == 0 ||
    password.length == 0
  ) {
    return res
      .status(400)
      .json({ success: false, message: "parameter missing" });
  }
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        res.json({ message: "Unable to create new user" });
      } else {
        User.create({
          name: name,
          email: email,
          phone_number: phone_number,
          password: hash,
          ispremiumuser: false,
        })
          .then((user) => {
            return res
              .status(200)
              .json({ success: true, message: "signed up successfully" });
            // res.redirect("/login");
          })
          .catch((err) => {
            // console.log(err);
            res.status(403).json(err);
          });
      }
    });
  });
};

///////////////////////////////////////////////
// login
///////////////////////////////////////////////

exports.getLogin = (req, res, next) => {
  res.render("user/login", {
    path: "/",
    editing: false,
    formsCSS: true,
    login: true,
  });
};

function generateAccessToken(id) {
  return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: "24h" });
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findAll({ where: { email: email } })
    .then((user) => {
      if (user.length != 0) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (err) {
            return res.status(402).json("something went wrong");
          } else if (result) {
            const token = generateAccessToken({
              id: user[0].id,
              premium: user[0].ispremiumuser,
            });
            res.status(200).json({
              token: token,
              success: true,
              message: "successfully login",
            });
          } else {
            res.status(404).json({
              success: false,
              message: "invalid password",
            });
          }
        });
      } else {
        res.status(403).json({
          success: false,
          message: "user not found",
        });
      }
    })
    .catch((err) => {
      console.log(err, "err");
    });
};

///////////////////////////////////////////////
// forget-password
///////////////////////////////////////////////

//function mailIt() {
//  const sgMail = require("@sendgrid/mail");
//  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//  const msg = {
//    to: "vinayakrshinde18@gmail.com", // Change to your recipient
//    from: "vinayakrshinde18@gmail.com", // Change to your verified sender
//    subject: "Sending with SendGrid is Fun",
//    text: "and easy to do anywhere, even with Node.js",
//    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//  };
//
//  sgMail
//    .send(msg)
//    .then((response) => {
//      console.log(response[0].statusCode);
//      console.log(response[0].headers);
//    })
//    .catch((error) => {
//      console.error("err", error);
//    });
//}

///////////////////////////////////////////////
// mail
///////////////////////////////////////////////

// exports.postPassword = (req, res, next) => {
//   const mail = req.body.mail;
//   console.log(mail, "mail");
//   // mailIt();
// };

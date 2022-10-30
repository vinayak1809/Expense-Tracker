const Order = require("../src/models/order");
const Razopay = require("razorpay");
const User = require("../src/models/user");
const Expenses = require("../src/models/expenses");
const FileRecord = require("../src/models/FileRecords");
const S3Service = require("../services/S3Service");

const fs = require("fs");
const path = require("path");
const util = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const { resolve } = require("path");
const readFile = util.promisify(fs.readFile);

///////////////////////////////////////////////
// create-order
///////////////////////////////////////////////

exports.key = (req, res, next) => {
  res.status(200).json({ key_id: process.env.RZP_KEY_ID });
};

exports.postOrder = (req, res, next) => {
  try {
    var rzp = new Razopay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });
    const amount = req.body.amount;
    const currency = "INR";
    const receipt = "yearlypackage";

    rzp.orders.create({ amount, currency, receipt }, (err, order) => {
      if (!err) {
        Order.create({
          userId: req.id,
          paymentid: "",
          orderid: order.id,
          status: "PENDING",
        }).then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        });
      } else {
        res.json(err);
      }
    });
  } catch {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

///////////////////////////////////////////////
// checkout-order
///////////////////////////////////////////////

//exports.checkoutOrder = (req, res, next) => {};

///////////////////////////////////////////////
// verify-order
///////////////////////////////////////////////

exports.verifyOrder = async (req, res, next) => {
  const paymentId = req.body.orderPayId;
  const orderId = req.body.orderId;
  const signature = req.body.signature;

  try {
    Order.update(
      { paymentid: paymentId, status: "successfull" },
      { where: { orderid: orderId } }
    ).then(() => {
      // req.id.update({ ispremiumuser: true });
      User.update({ ispremiumuser: true }, { where: { id: req.id } }).then(
        () => {
          return res
            .status(202)
            .json({ sucess: true, message: "Transaction Successfull" });
        }
      );
    });
  } catch {
    return res
      .status(202)
      .json({ sucess: false, message: "Transaction unSuccessfull" });
  }
};

///////////////////////////////////////////////
// genarate-report
///////////////////////////////////////////////

exports.getReport = async (req, res, next) => {
  let data = {};
  const doit = await getTemplateHtml()
    .then(async (res) => {
      console.log("Compiing the template with handlebars");
      const template = hb.compile(res, { strict: true });

      const result = template(data);

      const html = result;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html);
      const fileName = Date.now();
      const file = `./api/server/public/reports/${fileName}.pdf`;

      await FileRecord.create({
        fileUrl: `reports/${fileName}.pdf`,
        userId: req.id,
      });

      await page.pdf({ path: file, format: "A4" });

      await browser.close();
      console.log("PDF Generated");

      return `reports/${fileName}.pdf`;
    })
    .catch((err) => {
      console.error(err);
    });
  res.json({
    success: true,
    message: "PDF Generated",
    fileUrl: doit,
  });
};

async function getTemplateHtml() {
  console.log("Loading template file in memory");

  try {
    const invoicePath = path.resolve(__dirname, "../public/report.html");
    const a = await readFile(invoicePath, "utf8");
    console.log(invoicePath, "involi");
    return a;
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}

///////////////////////////////////////////////
// download-report with AWS
///////////////////////////////////////////////

//exports.download = async (req, res, next) => {
//  try {
//    const expenses = await Expenses.findAll({ where: { id: req.id } });
//
//    const StringifyData = JSON.stringify(expenses);
//    const user = req.id;
//    const fileName = `expenseReport${user}.txt`;
//
//    const fileUrl = await S3Service.uploadToS3(StringifyData, fileName);
//
//    return res.status(200).json({ fileUrl, success: true });
//  } catch (err) {
//    return res.status(500).json({ fileUrl: "", success: false, error: err });
//  }
//};

///////////////////////////////////////////////
// record of downloaded-report
///////////////////////////////////////////////

exports.postFile = async (req, res, next) => {
  const fileURL = req.body.fileURL;

  await FileRecord.create({ fileUrl: fileURL, userId: req.id }).then(() => {
    return res.status(200).json("successfully inserted");
  });
};

exports.getFile = async (req, res, next) => {
  await FileRecord.findAll({ where: { id: req.id } }).then((records) => {
    res.status(200).json({ records: records, success: true });
  });
};

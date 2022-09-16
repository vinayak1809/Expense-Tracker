const Order = require("../src/models/order");
const Razopay = require("razorpay");
const User = require("../src/models/user");
const Expenses = require("../src/models/expenses");
const FileRecord = require("../src/models/FileRecords");
const S3Service = require("../services/S3Service");

///////////////////////////////////////////////
// create-order
///////////////////////////////////////////////

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
        console.log(req.id, "orderiddddddddddddddddddd");
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

// exports.getReport = (req, res, next) => {
//   Expenses.findAll({ where: { id: req.id } })
//     .then((records) => {
//       res.status(200).json(records);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

///////////////////////////////////////////////
// download-report
///////////////////////////////////////////////

exports.download = async (req, res, next) => {
  try {
    const expenses = await Expenses.findAll({ where: { id: req.id } });

    const StringifyData = JSON.stringify(expenses);
    const user = req.id;
    const fileName = `expenseReport${user}.txt`;

    const fileUrl = await S3Service.uploadToS3(StringifyData, fileName);

    return res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    return res.status(500).json({ fileUrl: "", success: false, error: err });
  }
};

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

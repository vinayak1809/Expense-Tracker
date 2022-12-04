const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/api/server/public")));
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

//keeping track of request made

////////////////////////////////////////////////////
//routes
////////////////////////////////////////////////////

const authRoutes = require("./api/server/routes/authRoutes");
const userRoutes = require("./api/server/routes/userRoutes");
const userCreditRoutes = require("./api/server/routes/userCreditRoutes");
const premiumUserRoutes = require("./api/server/routes/premiumUserRoutes");

app.use(authRoutes);
app.use(userRoutes);
app.use(userCreditRoutes);
app.use(premiumUserRoutes);

////////////////////////////////////////////////////
//models
////////////////////////////////////////////////////

const sequelize = require("./api/server/util/database");

const User = require("./api/server/src/models/user");
const Expense = require("./api/server/src/models/expenses");
const Order = require("./api/server/src/models/order");
const ForgetPassword = require("./api/server/src/models/forgetPassword");
const FileRecords = require("./api/server/src/models/FileRecords");
const CreditExpense = require("./api/server/src/models/CreditExpenses");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);

User.hasMany(FileRecords);
FileRecords.belongsTo(User);

User.hasMany(CreditExpense);
CreditExpense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });

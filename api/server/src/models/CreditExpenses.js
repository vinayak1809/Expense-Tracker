const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const CreditExpense = sequelize.define("CreditExpense", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  description: { type: Sequelize.STRING, unique: false },
  amount: { type: Sequelize.STRING, allowNull: false },
});

module.exports = CreditExpense;

const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const FileRecords = sequelize.define("fileRecords", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl: { type: Sequelize.STRING, allowNull: false },
});

module.exports = FileRecords;

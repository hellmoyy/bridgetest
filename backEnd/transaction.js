const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  fromTransactionHash: {
    type: String,
  },
  toTransactionHash: {
    type: String,
  },
  type: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);

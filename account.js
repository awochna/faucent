const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
  amount: Number
}, { timestamps: true })

const accountSchema = mongoose.Schema({
  address: { type: String, unique: true },
  deposits: [transactionSchema],
  withdrawals: [transactionSchema]
}, { timestamps: true })

accountSchema.methods.getBalance = function () {
  return this.getTotalDeposits() - this.getTotalWithdrawals()
}

accountSchema.methods.getTotalDeposits = function () {
  return this.deposits.reduce((sum, transaction) => {
    return sum + transaction.amount
  }, 0)
}
accountSchema.methods.getTotalWithdrawals = function () {
  return this.withdrawals.reduce((sum, transaction) => {
    return sum + transaction.amount
  }, 0)
}

accountSchema.methods.createDeposit = function (amount) {
  this.deposits.push({amount})
}

accountSchema.methods.createWithdrawal = function (amount) {
  this.withdrawals.push({amount})
}

const Account = mongoose.model('Account', accountSchema);

module.exports = Account

const Promise = require('bluebird')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
mongoose.Promise = Promise
const Account = require('./account')
const bitcoin = require('bitcoin-promise')

let app = express()
app.set('view engine', 'pug')
app.set('views', './views')
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))

let client = new bitcoin.Client({
  host: 'yourCoindHost', // your coind host here
  port: 8888, // your port here
  user: 'coinrpc', // your rpc user here
  pass: 'password', // your rpc password here
  timeout: 30000
})

app.get('/', (req, res) => {
  client.getBalance('*', 10).then((serverBalance) => {
    res.render('index', {serverBalance})
  })
})

app.post('/faucet', (req, res) => {
  const address = req.body.address
  if (!address) return res.redirect('back')

  find_or_create_account(address).then((account) => {
    res.redirect(`/faucet/${account.address}`)
  }).catch((err) => {
    console.error(err.message)
    res.sendStatus(500).end()
  })
})

app.get('/faucet/:address', (req, res) => {
  Account.findOne({address: req.params.address}).then((account) => {
    res.render('faucet', {account})
  }).catch((err) => {
    console.error('Address not found:', req.params.address)
    res.sendStatus(404).end()
  })
})

app.post('/claim', (req, res) => {
  const address = req.body.address
  if (!address) return res.redirect('back')
  Account.findOne({address}).then((account) => {
    account.createDeposit(100)
    return account.save()
  }).then((account) => {
    res.redirect(`/faucet/${account.address}`)
  })
})

app.post('/withdraw', (req, res) => {
  const address = req.body.address
  if (!address) return res.redirect('back')
  Account.findOne({address}).then((account) => {
    const accountBalance = account.getBalance()
    client.getBalance('*', 10).then((serverBalance) => {
      if (accountBalance < serverBalance * 1000 * 1000) {
        return client.sendToAddress(account.address, accountBalance / (1000 * 1000))
      }
      res.send("Server doesn't have enough funds!")
    }).then((transaction) => {
      account.createWithdrawal(accountBalance)
      account.save().then(() => {
        res.send(`Sent in transaction: ${transaction}`)
      })
    })
  })
})


function find_or_create_account(address, callback) {
  return Account.findOne({ address }).exec().then((account) => {
    if (account != null) return account
    account = Account.create({ address })
    return account.save().then((account) => {
      console.log("New account created:", account.address)
      return account
    })
  })
}

// Adjust the following line with your mongodb info.
mongoose.connect('mongodb://user:password@mongohost:27017/db',
  { useMongoClient: true })
  .then((db) => {
    app.listen(4050, () => {
      console.log('Listening on port 4050')
    })
  })
  .catch((err) => {
    console.error('mongodb connection error:', err.message)
  })

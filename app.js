const express = require('express')
const bitcoin = require('bitcoin-promise')

let app = express()
let client = new bitcoin.Client({
  host: 'localhost',
  port: 24242,
  user: 'gaycoinrpc',
  pass: 'secret',
  timeout: 30000
})

app.get('/faucet_balance', (req, res) => {
  client.getBalance('*', 10).then((balance) => {
    res.send(balance)
  }).catch((err) => {
    res.send(err)
  })
})

app.listen(4050)

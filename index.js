const express = require("express")
const uuid = require("uuid")
const cors = require("cors")

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const orders = []

const checkId = (req, res, next) => {
  const { id } = req.params
  const index = orders.findIndex(p => p.id === id)
  req.orderIndex = index
  req.orderId = id
  if (index < 0) {
    return res.status(404).json("Order not found")
  }
  next()
}

const showMethod = (req, res, next) => {
  const {method} = req
  const {url} = req
  console.log(`
  request method: ${method}
  request url: ${url}
  `)
  next()
}

app.get("/orders", showMethod, (req, res) => {
  return res.json(orders)
});

app.post("/orders", showMethod, (req, res) => {
  const { order, clientName, price } = req.body
  const newOrder = { id: uuid.v4(), order, clientName, price }
  orders.push(newOrder)
  return res.status(201).json(newOrder)
})

app.put("/orders/:id", checkId, showMethod, (req, res) => {
  const index = req.orderIndex
  const id = req.orderId
  const { order, clientName, price } = req.body
  const newOrder = { id, order, clientName, price }
  orders[index] = newOrder
  return res.json(orders)
});

app.delete("/orders/:id", checkId, showMethod, (req, res) => {
  const index =  req.orderIndex
  console.log(index)
  orders.splice(index, 1)
  return res.json(orders)
});

app.get("/orders/filter/:id", checkId, showMethod, (req, res) => {
  const index =  req.orderIndex
  return res.json(orders[index])
})

app.listen(port, () => console.log(`🌐 Server started on port ${port}`))
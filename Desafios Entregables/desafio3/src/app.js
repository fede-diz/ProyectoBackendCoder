// *** ENDPOINTS
const ProductManager = require('./manager')
const productManager = new ProductManager('./products.json')

const express = require('express')
const app = express()

app.get('/products', async (req, resp) => {
    const products = await productManager.getProducts()
    const limit = req.query.limit

    if (limit) {
        const limitedArray = products.slice(0, limit)
        return resp.json({products: limitedArray})
    } else {
        resp.json({products})
    }
})

app.get('/products/:id', async (req, resp) => {
    const idProd = req.params.id
    const productById = await productManager.getProductsById(idProd)

    resp.json({productById})
})

app.listen(8080)
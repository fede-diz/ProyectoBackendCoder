// Manager de Productos

const fs = require('fs')
const express = require('express')
const app = express()

class ProductManager {

    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }

    writeFile = productsArray => {
        return fs.promises.writeFile(this.path, JSON.stringify(productsArray))
    }

    getNextID = async () => {
        return this.getProducts()
            .then(products => {
                const count = products.length
                return (count > 0) ? products[count-1].id + 1 : 1
            })
    }
    
    getProducts = async () => {
        return fs.promises.readFile(this.path, this.format)
            .then(content => JSON.parse(content))
            .catch(() => {return [] })
    }
    
    getProductsById = async (id) => {
        const products = await this.getProducts()
        const productById = products.find(prod => prod.id == id);

        return productById ?? "Not Found"
    }

    addProduct = async (object) => {
        const products = await this.getProducts()
        const id = await this.getNextID()
        const product = {
            id,
            ...object
        }

        const codes = products.map(prod => prod.code);

        if (codes.includes(product.code)) {
            console.log(`ERROR: CÓDIGO DUPLICADO\nNo se agrega el producto "${product.title}"`)
            return products
        } else {
            products.push(product)
            await this.writeFile(products)  
            return products
        }
       
    }

    updateProduct = async (id, object) => {
        const products = await this.getProducts()
        const ids = products.map(prod => prod.id);
        const productIndex = ids.indexOf(parseInt(id))
        const productToUpdate = products[productIndex]

        if (!productToUpdate) {
            return console.log("Not Found")
        } else {
            const updatedProduct = {
                id: productToUpdate.id,
                ...object
            }
            products.splice(productIndex, 1, updatedProduct)
            await this.writeFile(products) 
            return products
        }
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const ids = products.map(prod => prod.id);
        const productIndex = ids.indexOf(parseInt(id))
        const productToDelete = products[productIndex]

        if (!productToDelete) {
            return console.log("Not Found")
        } else {
            products.splice(productIndex,1)
            console.log(`Producto ${productToDelete.title} eliminado`)
            await this.writeFile(products)
            return products
        }
    }
}

const productManager = new ProductManager('./products.json')

app.get('/add', async (req, resp) => {
    const body = req.query
    const product = await productManager.addProduct(body)

    resp.json({product})
})

app.get('/products', async (req, resp) => {
    const products = await productManager.getProducts()
    const limit = req.query.limit

    if (limit) {
        const limitedArray = products.filter((prod) => prod.id <= limit)
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



// 127.0.0.1:8080/add?title=Samsung%20S20&price=1100&thumbnail=Sin%20Imagen&code=a1&stock=20
// 127.0.0.1:8080/add?title=Nokia%201100&price=20000&thumbnail=Sin%20Imagen&code=b2&stock=15
// 127.0.0.1:8080/add?title=iPad%208va%20Generacion&price=700&thumbnail=Sin%20Imagen&code=c3&stock=22
// 127.0.0.1:8080/add?title=Notebook%20Omen%2017&price=1500&thumbnail=Sin%20Imagen&code=d4&stock=30
// 127.0.0.1:8080/add?title=iPhone%2013%20Pro%20Max&price=1000&thumbnail=Sin%20Imagen&code=e5&stock=10
// 127.0.0.1:8080/add?title=Termo%20Stanley%201L&price=100&thumbnail=Sin%20Imagen&code=f6&stock=18
// 127.0.0.1:8080/add?title=Mouse%20Genius&price=50&thumbnail=Sin%20Imagen&code=g7&stock=4
// 127.0.0.1:8080/add?title=Yerba%20Playadito%201kg&price=10&thumbnail=Sin%20Imagen&code=h8&stock=11
// 127.0.0.1:8080/add?title=Kindle%20Paperwhite&price=350&thumbnail=Sin%20Imagen&code=i9&stock=26
// 127.0.0.1:8080/add?title=TV%20Sony%2080%20Pulgadas&price=2500&thumbnail=Sin%20Imagen&code=j10&stock=9
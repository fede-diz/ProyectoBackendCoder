// *** MANAGER DE PRODUCTOS

const fs = require('fs')

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

module.exports = ProductManager
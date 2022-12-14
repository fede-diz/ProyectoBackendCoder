// Manager de Productos

const fs = require('fs')

class ProductManager {

    constructor(path) {
        this.path = path
        this.format = 'utf-8'
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
        const ids = products.map(prod => prod.id);
        const productIndex = ids.indexOf(id)

        return products[productIndex] ?? "Not Found"
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const products = await this.getProducts()
        const id = await this.getNextID()
        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        const codes = products.map(prod => prod.code);

        if (codes.includes(product.code)) {
            return console.log(`ERROR: CÓDIGO DUPLICADO\nNo se agrega el producto "${product.title}"`)
        } else {
            products.push(product)

            return fs.promises.writeFile(this.path, JSON.stringify(products))
        }
       
    }

    updateProduct = async (id, title, description, price, thumbnail, code, stock) => {
        const products = await this.getProducts()
        const ids = products.map(prod => prod.id);
        const productIndex = ids.indexOf(id)
        const productToUpdate = products[productIndex]

        if (!productToUpdate) {
            return console.log("Not Found")
        } else {
            const updatedProduct = {
                id: productToUpdate.id,
                title: title ?? productToUpdate.title,
                description: description ?? productToUpdate.description,
                price: price ?? productToUpdate.price,
                thumbnail: thumbnail ?? productToUpdate.thumbnail,
                code: code ?? productToUpdate.code,
                stock: stock ?? productToUpdate.stock,
            }
            products.splice(productIndex, 1, updatedProduct)
                
            return fs.promises.writeFile(this.path, JSON.stringify(products))
        }
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const ids = products.map(prod => prod.id);
        const productIndex = ids.indexOf(id)
        const productToDelete = products[productIndex]

        if (!productToDelete) {
            return console.log("Not Found")
        } else {
            products.splice(productIndex,1)

            return (
                fs.promises.writeFile(this.path, JSON.stringify(products)),
                `Producto ${productToDelete.title} eliminado`
            )
        }
    }
}

async function run() {
    const productManager = new ProductManager('./products.json')

    console.log("-------------------[Array Inicial]--------------------");
    console.log(await productManager.getProducts());

    console.log("-------------------[Agregar productos]--------------------");
    await productManager.addProduct("Celular", "Samsung S20", 1500, "Sin imagen", "def456", 20)
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
    console.log(await productManager.getProducts());

    console.log("-------------------[Duplicar un producto]--------------------");
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

    console.log("-------------------[Buscar por ID]--------------------");
    console.log(await productManager.getProductsById(2));

    console.log("-------------------[Actualizar un producto]--------------------");
    await productManager.updateProduct(2, null, null, price = 10, null, null, stock = 30)
    console.log(await productManager.getProducts());

    console.log("-------------------[Eliminar un producto]--------------------");
    console.log(await productManager.deleteProduct(2));
    console.log(await productManager.getProducts());
}

run()
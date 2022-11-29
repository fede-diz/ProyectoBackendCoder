// Manager de Productos

class ProductManager {

    constructor() {
        this.products = []
        this.codes = []
    }

    getProducts = () => { return this.products }

    getNextID = () => {
        const count = this.products.length
        return (count > 0) ? this.products[count-1].id + 1 : 1
    }
    
    // *** ALTERNATIVA NEXTID
    // static nextProductId = 0
    // getNextId = () => {
    //     ProductManager.nextProductId++;
    //     return ProductManager.nextProductId;
    // }
    

    getProductsById = (id) => {
        return this.products[id-1] ?? "Not Found"
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        const id = this.getNextID()
        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        if (this.codes.includes(product.code)) {
            console.log(`ERROR: CÓDIGO DUPLICADO\nNo se agrega el producto "${product.title}"`)
        } else {
            this.products.push(product)
            this.codes.push(product.code)
        }
    }
}

const productManager = new ProductManager()
console.log("---------------------------------------");

console.log(productManager.getProducts());
console.log("---------------------------------------");

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
productManager.addProduct("Celular", "Samsung S20", 1500, "Sin imagen", "def456", 20)

console.log(productManager.getProducts());
console.log("---------------------------------------");

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
console.log("---------------------------------------");

console.log(productManager.getProductsById(2));
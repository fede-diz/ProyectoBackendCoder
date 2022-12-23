import { Router } from 'express'
import ProductsManager from '../productsManager.js'

// const socket = io()                         Lo dejo como comentario para que se vea que lo intenté (mil veces), pero no me deja meter un socket adentro de un router

const viewsRouter = Router()
const productsManager = new ProductsManager('./productos.json')

viewsRouter.get('/', async (req, res) => {
    const products = await productsManager.getProducts()

    res.render('home', {
        products: products,
        style: 'index.css',
        title: "Desafio CODER"
    })
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getProducts()

    res.render('realTimeProducts', {
        products: products,
        style: 'index.css',
        title: "Desafio CODER"
    })
})

// socket.on('msg_all_add', async (data) => {
//     viewsRouter.post('/realtimeproducts', async (req, res) => {
//        await productsManager.addProduct(data)
//         const products = await productsManager.getProducts()

//         res.render('realTimeProducts', {
//             products: products,
//             style: 'index.css',
//             title: "Desafio CODER"
//         })
//     })
// })

export default viewsRouter

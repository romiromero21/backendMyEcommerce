import express from 'express'
import controller from '../controller/carrito.js'
import pago from '../controller/pago.js'

const router = express.Router()

/* POST - request para agregar un producto */
router.post('/', controller.guardarCarrito)

router.get('/feddback',pago.feedBack

)

export default router
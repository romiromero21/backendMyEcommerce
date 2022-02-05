/* https://mongoosejs.com/ */
import mongoose from 'mongoose'
import DB_Mongo from './DB_Mongo.js'

/* ------------------------------------------------------------- */
/* Esquema del documento producto */
const carritoSchema = mongoose.Schema({
    carrito: Array
})

/* Modelo del documento almacenado en una colección */
const CarritoModel = mongoose.model('carritos', carritoSchema)
/* ------------------------------------------------------------- */


class CarritoModelMongoDB {

    // -----------------------------------------------------------------------------------
    /* CRUD -> C : Create -> http method POST */
    async createCarrito(carrito) {
        if(!DB_Mongo.conexionOk) return {}


        try {
            const carritoSave = new CarritoModel({carrito: carrito})
            await carritoSave.save()
            return carrito
        }
        catch(error) {
            console.log(`Error en createCarrito: ${error.message}`)
            return {}
        }
    }
}

export default CarritoModelMongoDB
import mongoose from 'mongoose'
import config from '../config.js'

class DB_Mongo {
    static conexionOk = false
    static pk = '_id'

    static genIdKey(obj){

        if (Array.isArray(obj)){
            for( let i=0; i<obj.length; i++){
                obj[i].id = obj[i][DB_Mongo.pk]
            }
        }
        else{
            obj.id = obj[DB_Mongo.pk]
        }
        return obj
    }

    static async conectarDB() {
        try {
            if(!DB_Mongo.conexionOk) {
                await mongoose.connect(config.STR_CNX, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
                console.log('Base de datos conectada!')
                DB_Mongo.conexionOk = true
            }
        }
        catch (error) {
            console.log(`MongoDB error al conectar: ${error.message}`)
        }

    }

}

export default DB_Mongo
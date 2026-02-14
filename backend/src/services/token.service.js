import jwt from 'jsonwebtoken'
import { jwt_secret, jwt_expires } from './enviroments.service.js'


export const generateToken = (payload) => {
    try {
        //generamos el token
        const token = jwt.sign(
            payload,
            jwt_secret,
            {
                expiresIn: jwt_expires
            }
        )

        return token
    } catch (error) {
        
        console.error(error)
    }
}

//funcion para verificar el token
export const verifyToken = (token) => {

    try {
        return jwt.verify(token, jwt_secret)

    } catch (error) {
        
       return console.log(error) 
    }
}

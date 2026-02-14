import { verifyToken } from "../src/services/token.service.js";

export const authMiddleware = (req, res, next) => {
    try {
        
        //obtenemos el token del header de la peticion
        const authHeader = req.headers.authorization;

        //verificamos si esta el token
        if(!authHeader) {

            return res.status(401).json({
                msj: 'token no proporcionado'
            })
        }

        //ahora si pasa la validacion separamos el token
        const token = authHeader.split(" ")[1]

        //validamos si el token es correcto
        const decode = verifyToken(token)

        //si el token esta malo
        if(!decode) {
            return res.status(401).json({
                msj: 'token invalido o expirado'
            })
        }

        req.user = decode;
        next()
    } catch (error) {
        res.stauts(500).json({
            msj: 'error del servidor',
            error: error.message
        })
    }
}
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../services/token.service.js";

export class userController {

    //register (creacion de usuarios)
    async register (req, res) {
        try {
            //obtenemos los datos del usuario
            const { name, email, password, role } = req.body;

            //verificamos si el email ya esta en uso
            const userExist = await User.findOne({ email })

            if(userExist) {
                return res.status(400).json({ msj: 'el email ya esta en uso'})
            }

            //hasheamos la contraseña
            const hasPassword = await bcrypt.hash(password, 10)

            //creamos el nuevo usuario
            const newUser = await User.create({
                name,
                email,
                password: hasPassword,
                role
            })

            const token = generateToken({
                id: newUser._id,
                email: newUser.email,
                role: newUser.role
            })

            //enviamos la respues
            res.status(201).json({
                msj: 'user creado correctamente',
                token,
                data: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            })
        } catch (error) {
            
            res.status(500).json({
                msj: 'errro creando usuario',
                error: error.message
            })
        }
    }

    //login controller
    async login (req, res) {
        try {
            const { email , password } = req.body;

            const user = await User.findOne({ email }).select("+password") //incorporamos la contraseña porque no la trae en la respuesta porque el model es select: false(no incluye la contraseña)
            if(!user){
                return res.status(401).json({
                    msj: 'credenciales invalidas'
                })
            }

            const isvalidPass = await bcrypt.compare(password, user.password)
            if(!isvalidPass) {
                return res.status(401).json({
                    msj: 'credenciales invalidas'
                })
            }

            const token = generateToken({
                id: user._id,
                email: user.email,
                role: user.role
            })

            res.status(200).json({
                msj: 'login exitoso',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            
            return res.status(500).json({
                msj: 'error de servidor',
                error: error.message
            })
        }
    }

    //controladores del administrador
    //eliminar usuarios
    async deleteUser (req, res) {
        try {
            
            const { id } = req.params;

            if(!id) {
                return res.status(401).json({
                    msj: 'no id proporcionado'
                })
            }

            const deletedUser = await User.findByIdAndDelete(id)
            
            res.status(200).json({
                msj: 'user eliminado correctamente',
                deleteUser: {
                    id: deletedUser._id,
                    name: deletedUser.name,
                    email: deleteUser.email,
                    role: deleteUser.role
                }
            })
        } catch (error) {
            
            res.status(500).json({
                msj: 'error del servidor',
                error: error.message
            })
        }
    }
}
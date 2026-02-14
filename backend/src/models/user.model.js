import { Schema, model } from 'mongoose'

const userModel = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false //evitamos enviar el campo a la hora de hacer pediciones como find o findOne
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'admin'
    }
}, {timestamps: true}); //nos crea el createAt y el updateAt por defautl en cada documento

export const User = model('User', userModel)
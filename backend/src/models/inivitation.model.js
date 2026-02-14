import { Schema, model } from "mongoose";

const InvitationSchema = new Schema ({

    familia: {
        type: String,
        required: [true, 'familia es requerida']
    },
    personas: {
        type: Number,
        required: [true, 'las personas son requeridas']
    },
    codigo: {
        type: String,
        unique: true
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    estado: {
        type: String,
        enum: ['pendiente', 'cerrada'],
        default: 'pendiente'
    },
    confirmadaEn: {
        type: Date
    }
}, { timestamps: true});

//lo envolvemos en una constante para creear un cliente y poder usarlo en el controller
export const Invitation = model('Invitation', InvitationSchema)
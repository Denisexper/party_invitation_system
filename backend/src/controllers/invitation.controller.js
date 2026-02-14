import { Invitation } from "../models/inivitation.model.js";

export class invitationController {

    //admin controllers
    async createInvitation(req, res) {
        try {
            //obtenemos datos por el body (necesaros)
            const { familia, personas } = req.body;
            //validamos si los datos van en el body
            if (!familia || !personas) {
                return res.status(400).json({ msj: 'familia y personas son requeridos' })
            }

            //creamos la invitacio
            const newInvitacion = await Invitation.create({
                familia,
                personas,
                codigo: ''
            })

            //creamos el codigo con el id
            newInvitacion.codigo = newInvitacion._id.toString()
            await newInvitacion.save();

            res.status(201).json({
                msj: 'invitacion creada',
                data: newInvitacion
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                msj: 'error del servidor',
                error: error.message
            })
        }
    }

    //obtener todas las invitacones(para poder ver todas las asistencias)
    async getAllInvitations(req, res) {
        try {

            const invitations = await Invitation.find().sort({ createdAt: -1 })

            res.status(200).json({
                msj: invitations.length === 0
                    ? 'lista de invitaciones vacia'
                    : 'Invitaciones: ',
                total: invitations.length,
                invitations: invitations
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                msj: 'error de servidor',
                error: error.message
            })
        }
    }

    //obtener invitacion especifica (por id)
    async getInvitation(req, res) {
        try {

            const { id } = req.params;

            const invitacion = await Invitation.findById(id)

            if (!invitacion) {
                return res.status(404).json({
                    msj: 'invitacion no encontrada'
                })
            }

            res.status(200).json({
                msj: 'invitacion obtenida',
                invitation: invitacion
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                msj: 'error de servidor',
                error: error.message
            })
        }
    }

    async deleteInvitacion(req, res) {
        try {
            const { id } = req.params;

            const deletedInv = await Invitation.findByIdAndDelete(id)

            if (!deletedInv) {
                return res.status(404).json({
                    msj: 'invitacion no encontrada',
                })
            }

            res.status(200).json({
                msj: 'invitacion eliminada',
                invitation: deletedInv
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                msj: 'error de servidor',
                error: error.message
            })
        }
    }

    //controles que usara el invitado (invitado endpoints)
    //obtener la invitacion por el id(invitado)
    async getInvitationId(req, res) {
        try {

            const { id } = req.params;

            const invitacion = await Invitation.findById(id)

            if (!invitacion) {
                return res.status(404).json({
                    msj: 'invitacion no encontrada'
                })
            }

            res.status(200).json({
                msj: 'invitacion encontrada',
                invitation: invitacion
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                msj: 'error de servidor',
                error: error.message
            })
        }
    }

    //confirmacion de asistencia endpoint
    async confirmarAsistencia(req, res) {
        try {
            const { id } = req.params;

            const invitation = await Invitation.findById(id);

            if (!invitation) {
                return res.status(404).json({ msg: 'Invitación no encontrada' });
            }

            if (invitation.confirmado) {
                return res.status(400).json({
                    msg: 'Esta invitación ya fue confirmada previamente'
                });
            }

            if (invitation.estado === 'cerrada') {
                return res.status(400).json({
                    msg: 'Esta invitación ya está cerrada'
                });
            }

            // Confirmamos y cerramos automáticamente
            invitation.confirmado = true;
            invitation.estado = 'cerrada';
            invitation.confirmadaEn = new Date();
            await invitation.save();

            res.status(200).json({
                msg: 'Asistencia confirmada exitosamente',
                invitation
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: 'Error al confirmar asistencia',
                error: error.message
            });
        }
    }
}

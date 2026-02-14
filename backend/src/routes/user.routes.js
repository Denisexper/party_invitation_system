import { Router } from "express"
import { userController } from "../controllers/user.controller.js";
import { invitationController } from "../controllers/invitation.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = Router();
const uController = new userController()
const icontroller = new invitationController()

//rutas publicas sin middlewares
router.post("/register", uController.register)
router.post("/login", uController.login)




// ==================== RUTAS PÚBLICAS (Invitado) ====================
router.get('/public/:id', icontroller.getInvitationId);
router.put('/public/:id/confirm', icontroller.confirmarAsistencia);

// ==================== RUTAS PROTEGIDAS (Admin) ====================
router.post('/invitacion/', authMiddleware, icontroller.createInvitation);
router.get('/invitacion', authMiddleware, icontroller.getAllInvitations);
router.get('/invitacion/:id', authMiddleware, icontroller.getInvitation);
router.delete('/invitacion/:id', authMiddleware, icontroller.deleteInvitacion);

export default router
import express from 'express'
import { port } from './services/enviroments.service.js';
import { connectionDb } from './database/config.db.js';
import userRoutes from './routes/user.routes.js'
import morgan from "morgan"
import cors from "cors"

//configuramos express
const app = express();

//configuramos el servidor con json
app.use(express.json());

//utilizamos morgan
app.use(morgan("dev"))

//permitimos la conexion con el frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://party-invitation-system.vercel.app',  // ✅ Tu frontend desplegado
    'https://party-invitation-system-git-main-denisexpers-projects.vercel.app',
    'https://party-invitation-system-6b4qly94a-denisexpers-projects.vercel.app'
  ],
  credentials: true
}));

//ruta raiz
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend funcionando',
    status: 'OK',
    endpoints: {
      register: '/app/register',
      login: '/app/login'
    }
  });
});

//levantamos la configuracion con el puerto
app.listen(port, () => console.log(`server up at port: ${port}`))

//levantamos la connecion con la db
connectionDb()

//levantamos las rutas
app.use('/app', userRoutes)


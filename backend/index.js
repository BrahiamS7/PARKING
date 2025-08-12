// IMPORTACIONES
import express from "express";
import env from "dotenv";
import cors from "cors";
env.config();

//IMPORTACIONES DE RUTAS
import vehiculosRoutes from './routes/vehiculos.routes.js'


//CONSTANTES
const app = express();
const port = process.env.port;

// UTILIDADES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS
app.get("/", (req, res) => {
  res.send("Api corriendo correctamente");
});
app.use("/api/vehiculos",vehiculosRoutes)


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

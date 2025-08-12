import express from "express";
import db from "../db.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/", async (req, res) => {
  const response = await db.query(
    "SELECT * FROM vehiculos WHERE presente=true"
  );
  const data = response.rows;
  res.json(data);
});
router.get("/espacios", async (req, res) => {
  const response = await db.query("SELECT * FROM espacios ORDER BY id");
  const data = response.rows;
  res.json(data);
});
router.post("/camEstado/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.query("SELECT estado FROM espacios WHERE id = $1", [
    id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ msg: "Espacio no encontrado" });
  }

  const estadoActual = result.rows[0].estado;
  const nuevoEstado = estadoActual === "ocupado" ? "disponible" : "ocupado";
  await db.query("UPDATE espacios SET estado = $1 WHERE id = $2", [
    nuevoEstado,
    id,
  ]);

  res.json({ msg: "Estado cambiado", nuevoEstado });
});
router.get("/movimientos", async (req, res) => {
  const response = await db.query(
    "SELECT m.id, v.placa, v.tipo, m.entrada, m.salida, ROUND(EXTRACT(EPOCH FROM (m.salida - m.entrada)) / 60) AS total_minutos, t.tarifa AS tarifa_por_minuto, ROUND((EXTRACT(EPOCH FROM (m.salida - m.entrada)) / 60) * t.tarifa) AS total_pagar FROM movimientos m JOIN vehiculos v ON m.placa = v.placa JOIN tarifas t ON t.tipo = v.tipo;"
  );
  const data = response.rows;
  console.log(data);

  res.json(data);
});

router.post("/add", async (req, res) => {
  const placa = req.body.placa;
  const tipo = req.body.tipo;
  const response = await db.query("SELECT * FROM vehiculos WHERE placa=$1", [
    placa,
  ]);
  if (response.rows.length > 0) {
    await db.query("UPDATE vehiculos SET presente=true WHERE placa=$1", [
      placa,
    ]);
  } else {
    let vehiculo = false;
    if (tipo === "moto") {
      vehiculo = false;
    } else {
      vehiculo = true;
    }
    await db.query(
      "INSERT INTO vehiculos (placa,tipo,presente) VALUES ($1,$2,TRUE)",
      [placa, vehiculo]
    );
  }
  await db.query("INSERT INTO movimientos (placa) VALUES ($1)", [placa]);
  res.json({ msg: "Vehiculo añadido correctamente" });
});

router.get("/imprimir", async (req, res) => {
  const response = await db.query(
    "SELECT m.id, v.placa, v.tipo, m.entrada, m.salida, ROUND(EXTRACT(EPOCH FROM (m.salida - m.entrada)) / 60) AS total_minutos, t.tarifa AS tarifa_por_minuto, ROUND((EXTRACT(EPOCH FROM (m.salida - m.entrada)) / 60) * t.tarifa) AS total_pagar FROM movimientos m JOIN vehiculos v ON m.placa = v.placa JOIN tarifas t ON t.tipo = v.tipo ORDER BY m.id DESC"
  );
  const ultMv = response.rows[0];
  const carpeta = path.join(__dirname, "../facturas");
  const rutaArchivo = path.join(carpeta, `${ultMv.placa}.txt`);
  fs.writeFile(
    rutaArchivo,
    `PLACA: ${ultMv.placa} ENTRADA: ${ultMv.entrada} SALIDA: ${ultMv.salida} TOTAL MINUTOS: ${ultMv.total_minutos} TOTAL A PAGAR: ${ultMv.total_pagar}`,
    (err) => {
      if (err) throw err;
      console.log("Archivo añadido correctamente");
    }
  );
});

router.post("/salida/:placa", async (req, res) => {
  const placa = req.params.placa;
  const fecha = new Date();
  // Para encontrar el vehiculo
  const response = await db.query("SELECT * FROM vehiculos WHERE placa=$1", [
    placa,
  ]);
  const vehiculo = response.rows[0];
  const tipo = vehiculo.tipo;
  await db.query("UPDATE movimientos SET salida=$1 WHERE placa=$2", [
    fecha,
    placa,
  ]);
  await db.query("UPDATE vehiculos SET presente=false WHERE placa=$1", [placa]);
  res.json({ msg: "Vehiculo eliminado correctamente" });
});

router.get("/ultMovimiento", async (req, res) => {
  const response = await db.query(
    "SELECT m.id, v.placa, v.tipo, m.entrada, m.salida, ROUND(EXTRACT(EPOCH FROM (m.salida - m.entrada)) / 60) AS total_minutos, t.tarifa AS tarifa_por_minuto, ROUND((EXTRACT(EPOCH FROM (m.salida - m.entrada)) / 60) * t.tarifa) AS total_pagar FROM movimientos m JOIN vehiculos v ON m.placa = v.placa JOIN tarifas t ON t.tipo = v.tipo ORDER BY m.id DESC"
  );
  const ultMv = response.rows[0];
  console.log(ultMv);

  res.json({ data: ultMv });
});

export default router;

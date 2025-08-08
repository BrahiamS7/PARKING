import React from "react";
import { useState, useEffect } from "react";

const Movimientos = () => {
  const url = import.meta.env.VITE_API_URL;
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    cargarMovimientos();
  }, []);
  const cargarMovimientos = () => {
    fetch(`${url}/api/vehiculos/movimientos`)
      .then((res) => res.json())
      .then((data) => {
        setMovimientos(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return <div>
    {movimientos.map((movimiento)=>(
        <p>Placa: {movimiento.placa} - Salida: {movimiento.salida} - Entrada: {movimiento.entrada} - Minutos: {movimiento.total_minutos} - Total: {movimiento.total_pagar}</p>
    ))}
    <a href="/">Volver</a>
  </div>;
};

export default Movimientos;

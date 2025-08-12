import React, { useState, useEffect } from "react";
import { Table, Container, Button, Alert } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

const Movimientos = () => {
  const url = import.meta.env.VITE_API_URL;
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

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
        setError("Error al cargar movimientos");
      });
  };
  return (
    <Container className="py-4">
      <h2 className="text-center fw-bold mb-4">Historial de Movimientos</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {movimientos.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay movimientos registrados
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Minutos</th>
              <th>Total a Pagar</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov, i) => (
              <tr key={i}>
                <td className="fw-bold">{mov.placa}</td>
                <td>{mov.entrada || "—"}</td>
                <td>{mov.salida || "—"}</td>
                <td>{mov.total_minutos ?? "—"}</td>
                <td>${mov.total_pagar ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="text-center mt-4">
        <Button href="/" variant="outline-primary">
          <FaArrowLeft /> Volver
        </Button>
      </div>
    </Container>
  );
};

export default Movimientos;

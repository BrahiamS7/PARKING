import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import carroImg from "../assets/carro.jpg";
import motoImg from "../assets/moto.jpg";
import salidaImg from "../assets/salida.png";
import "./Home.css";

function Home() {
  const [vehiculos, setVehiculos] = useState([]);
  const [showEntrada, setShowEntrada] = useState(false);
  const [showSalida, setShowSalida] = useState(false);
  const [placa, setPlaca] = useState("");
  const [tipo, setTipo] = useState("");
  const [msg, setMsg] = useState("");
  const [hora, setHora] = useState("");

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    cargarVehiculos();
    const intervalo = setInterval(() => {
      setHora(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarVehiculos = () => {
    fetch(`${url}/api/vehiculos/`)
      .then((res) => res.json())
      .then((data) => {
        setVehiculos(data);
      })
      .catch((error) => console.error("Error al cargar vehículos:", error));
  };

  const handleSubmit = () => {
    if (!placa || !tipo) {
      setMsg("Por favor registre todas las casillas");
      setTimeout(() => setMsg(""), 5000);
      return;
    }
    fetch(`${url}/api/vehiculos/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placa, tipo }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.msg);
        setPlaca("");
        setTipo("");
        setShowEntrada(false);
        cargarVehiculos();
        setTimeout(() => setMsg(""), 5000);
      });
  };

  const handleDelete = (placa) => {
    fetch(`${url}/api/vehiculos/salida/${placa}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.msg);
        setShowSalida(false);
        cargarVehiculos();
        setTimeout(() => setMsg(""), 5000);
      });
  };

  return (
    <div className="container-home">
      <h2>Bienvenido al Parqueadero</h2>
      <p>{hora}</p>
      <p>Seleccione una opción</p>

      <div className="button-grid">
        <div className="vehiculo-card" onClick={() => setShowEntrada(true)}>
          <img src={carroImg} alt="Carro" />
          <p>Carro</p>
        </div>
        <div className="vehiculo-card" onClick={() => setShowEntrada(true)}>
          <img src={motoImg} alt="Moto" />
          <p>Moto</p>
        </div>
        <div className="vehiculo-card" onClick={() => setShowSalida(true)}>
          <img src={salidaImg} alt="Retirar Vehículo" />
          <p>Retirar Vehículo</p>
        </div>
      </div>
      <a href="/movimientos">Ver Movimientos</a>
      {msg && <p className="msg">{msg}</p>}

      {/* Modal Entrada */}
      <Modal show={showEntrada} onHide={() => setShowEntrada(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Entrada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Seleccione tipo</option>
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Salida */}
      <Modal show={showSalida} onHide={() => setShowSalida(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dar salida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {vehiculos.map((vehiculo, i) => (
            <div key={i} className="salida-item">
              <strong>
                {vehiculo.placa} - {vehiculo.tipo}
              </strong>
              <Button
                variant="danger"
                onClick={() => handleDelete(vehiculo.placa)}
              >
                Salida
              </Button>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;

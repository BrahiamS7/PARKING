import { useEffect, useState } from "react";
import { Button, Modal, Card, Row, Col, Form, Alert } from "react-bootstrap";
import { FaCar, FaMotorcycle, FaSignOutAlt, FaClock, FaRProject } from "react-icons/fa";
import carroImg from "../assets/carro.png";
import motoImg from "../assets/moto.png";
import salidaImg from "../assets/salida.png";
import "./Home.css";

function Home() {
  const [vehiculos, setVehiculos] = useState([]);
  const [factura, setFactura] = useState({});
  const [showEntrada, setShowEntrada] = useState(false);
  const [showSalida, setShowSalida] = useState(false);
  const [showFactura, setShowFactura] = useState(false);
  const [activeTab, setActiveTab] = useState("floor");
  const [placa, setPlaca] = useState("");
  const [tipo, setTipo] = useState("");
  const [msg, setMsg] = useState("");
  const [hora, setHora] = useState("");
  const [espacios, setEspacios] = useState([]);

  

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    cargarVehiculos();
    cargarEspacios();
    const intervalo = setInterval(() => {
      setHora(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarVehiculos = () => {
    fetch(`${url}/api/vehiculos/`)
      .then((res) => res.json())
      .then((data) => setVehiculos(data))
      .catch((error) => console.error("Error al cargar vehículos:", error));
  };
  const cargarEspacios=()=>{
    fetch(`${url}/api/vehiculos/espacios`)
    .then((res)=>res.json())
    .then((data)=>{
      setEspacios(data)
    })
  }

  const cambiarEstado = (id) => {
      fetch(`${url}/api/vehiculos/camEstado/${id}`,{
        method:'POST',
        headers:{"Content-Type": "application/json" },
      })
      .then((res)=>res.json())
      .then((data)=>{
        setMsg(data.msg)
        cargarEspacios()
      })
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
        cargarFactura();
        setShowFactura(true);
      });
  };
  const cargarFactura = () => {
    fetch(`${url}/api/vehiculos/ultMovimiento`)
      .then((res) => res.json())
      .then((data) => {
        setFactura(data.data);
      });
  };
  const imprimir = () => {
    fetch(`${url}/api/vehiculos/imprimir`);
    setShowFactura(false);
    console.log("Imprimiendo ticket");
  };
  return (
    <div className="d-flex vh-100">
      {/* Barra lateral */}
      <div className="bg-light border-end p-3" style={{ width: "250px" }}>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item mb-2">
            <button
              className={`nav-link ${activeTab === "floor" ? "active" : ""}`}
              onClick={() => setActiveTab("floor")}
            >
              Floor View
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              List View
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4">
        {activeTab === "floor" && (
          <div>
            <h2 className="text-center fw-bold">Bienvenido al Parqueadero</h2>
            <p className="text-center text-muted">
              <FaClock /> {hora}
            </p>

            {msg && (
              <Alert variant="info" className="text-center">
                {msg}
              </Alert>
            )}

            <Row className="mt-4 text-center">
              <Col md={4}>
                <Card
                  className="shadow-sm card-option"
                  onClick={() => {
                    setTipo("carro");
                    setShowEntrada(true);
                  }}
                >
                  <Card.Img variant="top" src={carroImg} />
                  <Card.Body>
                    <Card.Title>
                      <FaCar /> Carro
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className="shadow-sm card-option"
                  onClick={() => {
                    setTipo("moto");
                    setShowEntrada(true);
                  }}
                >
                  <Card.Img variant="top" src={motoImg} />
                  <Card.Body>
                    <Card.Title>
                      <FaMotorcycle /> Moto
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className="shadow-sm card-option"
                  onClick={() => setShowSalida(true)}
                >
                  <Card.Img variant="top" src={salidaImg} />
                  <Card.Body>
                    <Card.Title>
                      <FaSignOutAlt /> Retirar Vehículo
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <a href="/movimientos" className="btn btn-outline-primary mx-3">
                Ver Movimientos
              </a>
            </div>

            {/* Modal Entrada */}
            <Modal
              show={showEntrada}
              onHide={() => setShowEntrada(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Registrar Entrada</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Placa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: ABC123"
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Tipo de Vehículo</Form.Label>
                    <Form.Select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="carro">Carro</option>
                      <option value="moto">Moto</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowEntrada(false)}
                >
                  Cancelar
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                  Guardar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal Salida */}
            <Modal
              show={showSalida}
              onHide={() => setShowSalida(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Dar Salida</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {vehiculos.length === 0 ? (
                  <p className="text-muted">No hay vehículos registrados</p>
                ) : (
                  vehiculos.map((vehiculo, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                    >
                      <strong>
                        {vehiculo.placa.toUpperCase()} -{" "}
                        {vehiculo.tipo === true ? "Carro" : "Moto"}
                      </strong>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(vehiculo.placa)}
                      >
                        Salida
                      </Button>
                    </div>
                  ))
                )}
              </Modal.Body>
            </Modal>

            {/* MODAL FACTURA */}
            <Modal
              show={showFactura}
              onHide={() => setShowFactura(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Factura</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {factura.length === 0 ? (
                  <p>No hay factura a mostrar!</p>
                ) : (
                  <div>
                    <p>PLACA DEL VEHICULO: {factura.placa}</p>
                    <p>PLACA DEL TOTAL A PAGAR: ${factura.total_pagar}</p>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={() => imprimir()}>
                  Imprimir
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}

        {activeTab === "list" && (
          <div>
            <div className="parqueadero-vertical">
              <div className="fila">

                {espacios.map((espacios,i)=>(
                  espacios.tipo===true && 
                  <div 
                  onClick={()=>cambiarEstado(espacios.id)}
                  className={espacios.estado==="ocupado"?"parqueadero ocupado":"parqueadero libre"}
                  key={i}>
                    <FaCar />
                  </div>
                ))}
              </div>
              <div className="fila">
                {espacios.map((espacios,i)=>(
                  espacios.tipo===false && 
                  <div
                  key={i}
                  className={espacios.estado==="ocupado"?"parqueadero ocupado":"parqueadero libre"}
                  onClick={()=>cambiarEstado(espacios.id)}
                  >
                    <FaMotorcycle />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

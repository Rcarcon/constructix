import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [proyectos, setProyectos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [compras, setCompras] = useState([]);
  const [avances, setAvances] = useState([]);
  const [logueado, setLogueado] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
  nombre: "",
  cliente: "",
  ubicacion: "",
  fecha_inicio: "",
  fecha_fin_estimada: "",
  presupuesto_estimado: "",
  estado: "Planificado"
});
const [proyectoEditando, setProyectoEditando] = useState(null);

useEffect(() => {

  obtenerProyectos();
  obtenerMateriales();
  obtenerCompras();
  obtenerAvances();

}, []);

const obtenerProyectos = async () => {

  try {

    const response = await axios.get(
      "http://localhost:3000/api/proyectos"
    );

    setProyectos(response.data);

  } catch (error) {

    console.log(error);

  }

};

const obtenerMateriales = async () => {

  try {

    const response = await axios.get("http://localhost:3000/api/materiales");
    setMateriales(response.data);
  } catch (error) {
    console.log(error);
  }
};

const obtenerCompras = async () => {
  
  try {
    const response = await axios.get("http://localhost:3000/api/compras");
    setCompras(response.data);
  } catch (error) {
    console.log(error);
  }
};
const obtenerAvances = async () => {

  try {
    const response = await axios.get("http://localhost:3000/api/avances");
    setAvances(response.data);
  } catch (error) {
    console.log(error);
  }
};

const crearProyecto = async (e) => {
  e.preventDefault();

  try {
    await axios.post(
      "http://localhost:3000/api/proyectos",
      {
        ...nuevoProyecto,
        fecha_fin_estimada: nuevoProyecto.fecha_fin_estimada || null
      }
    );

    setNuevoProyecto({
      nombre: "",
      cliente: "",
      ubicacion: "",
      fecha_inicio: "",
      fecha_fin_estimada: "",
      presupuesto_estimado: "",
      estado: "Planificado"
    });

    obtenerProyectos();

  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/proyectos/${id}`);
    obtenerProyectos();
  } catch (error) {
    console.log(error);
  }
};

const editarProyecto = (proyecto) => {
  setProyectoEditando(proyecto.id);

  setNuevoProyecto({
    nombre: proyecto.nombre,
    cliente: proyecto.cliente,
    ubicacion: proyecto.ubicacion,
    fecha_inicio: proyecto.fecha_inicio?.split("T")[0],
    fecha_fin_estimada: proyecto.fecha_fin_estimada?.split("T")[0] || "",
    presupuesto_estimado: proyecto.presupuesto_estimado,
    estado: proyecto.estado
  });
};

const actualizarProyecto = async (e) => {
  e.preventDefault();

  try {
    await axios.put(
      `http://localhost:3000/api/proyectos/${proyectoEditando}`,
      nuevoProyecto
    );

    setProyectoEditando(null);

    setNuevoProyecto({
      nombre: "",
      cliente: "",
      ubicacion: "",
      fecha_inicio: "",
      fecha_fin_estimada: "",
      presupuesto_estimado: "",
      estado: "Planificado"
    });

    obtenerProyectos();
  } catch (error) {
    console.log(error);
  }
};

const avancePromedio =
  avances.length > 0
    ? avances.reduce((total, avance) => total + Number(avance.porcentaje_avance), 0) / avances.length
    : 0;

    const data = {
  labels: ["Proyectos", "Materiales", "Compras"],
  datasets: [
    {
      label: "Resumen General",
      data: [
        proyectos.length,
        materiales.length,
        compras.length
      ],
      backgroundColor: [
        "#3b82f6",
        "#10b981",
        "#f59e0b"
      ]
    }
  ]
};
if (!logueado) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontFamily: "Arial"
    }}>
      <div style={{
        width: "380px",
        background: "linear-gradient(135deg, #1e293b, #334155)",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 4px 25px rgba(0,0,0,0.4)"
      }}>
        <h1>Constructix</h1>
        <p style={{ color: "#94a3b8" }}>Acceso al Dashboard empresarial</p>

        <input placeholder="Usuario" style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          borderRadius: "10px",
          border: "none"
        }} />

        <input placeholder="Contraseña" type="password" style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          borderRadius: "10px",
          border: "none"
        }} />

        <button
          onClick={() => setLogueado(true)}
          style={{
            width: "100%",
            padding: "12px 20px",
            marginTop: "20px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b, #334155)",
        color: "white",
        fontFamily: "Arial"
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: "250px",
          background: "linear-gradient(135deg, #1e293b, #334155)",
          padding: "20px"
        }}
      >
        <h2 style={{ marginBottom: "40px" }}>
          Constructix
        </h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "20px" }}>
            Dashboard
          </li>

          <li style={{ marginBottom: "20px" }}>
            Proyectos
          </li>

          <li style={{ marginBottom: "20px" }}>
            Materiales
          </li>

          <li style={{ marginBottom: "20px" }}>
            Compras
          </li>

          <li style={{ marginBottom: "20px" }}>
            Presupuestos
          </li>

          <li style={{ marginBottom: "20px" }}>
            Avances
          </li>
        </ul>
      </div>

      {/* CONTENIDO */}

      <div
        style={{
          flex: 1,
          padding: "30px"
        }}
      >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  }}
>
      <div>
        <h1>Dashboard Empresarial</h1>

         <p style={{ color: "#94a3b8" }}>
          Sistema Constructix
         </p>
      </div>

    <button
      onClick={() => setLogueado(false)}
       style={{
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        padding: "12px 20px",
        borderRadius: "12px",
        border: "none",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
  }}
>
         Cerrar sesión 
      </button>
      </div>
      <div
  style={{
    background: "linear-gradient(135deg, #1e293b, #334155)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    marginBottom: "40px"
  }}
>
  <h2 style={{ marginBottom: "20px" }}>
    Registrar Proyecto
  </h2>

  <form onSubmit={proyectoEditando ? actualizarProyecto : crearProyecto}>
    
    <input
      type="text"
      placeholder="Nombre del proyecto"
      value={nuevoProyecto.nombre}
      onChange={(e) =>
        setNuevoProyecto({
          ...nuevoProyecto,
          nombre: e.target.value
        })
      }
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "10px",
        border: "none"
      }}
    />

    <input
      type="text"
      placeholder="Cliente"
      value={nuevoProyecto.cliente}
      onChange={(e) =>
        setNuevoProyecto({
          ...nuevoProyecto,
          cliente: e.target.value
        })
      }
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "10px",
        border: "none"
      }}
    />

    <input
      type="text"
      placeholder="Ubicación"
      value={nuevoProyecto.ubicacion}
      onChange={(e) =>
        setNuevoProyecto({
          ...nuevoProyecto,
          ubicacion: e.target.value
        })
      }
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "10px",
        border: "none"
      }}
    />

    <input
      type="date"
      value={nuevoProyecto.fecha_inicio}
      onChange={(e) =>
        setNuevoProyecto({
          ...nuevoProyecto,
          fecha_inicio: e.target.value
        })
      }
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "10px",
        border: "none"
      }}
    />

    <input
      type="number"
      placeholder="Presupuesto"
      value={nuevoProyecto.presupuesto_estimado}
      onChange={(e) =>
        setNuevoProyecto({
          ...nuevoProyecto,
          presupuesto_estimado: e.target.value
        })
      }
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "10px",
        border: "none"
      }}
    />

    <button
      type="submit"
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
    {proyectoEditando ? "Actualizar Proyecto" : "Guardar Proyecto"}
    </button>

  </form>
</div>

        {/* TARJETAS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "40px"
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #334155)",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <h3>Proyectos</h3>
            <h2>{proyectos.length}</h2>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #334155)",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <h3>Materiales</h3>
            <h2>{materiales.length}</h2>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #334155)",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <h3>Compras</h3>
            <h2>{compras.length}</h2>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #334155)",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <h3>Avance General</h3>
            <h2>{avancePromedio.toFixed(0)}%</h2>
          </div>
        </div>

        {/* TABLA */}

        <div
          style={{
            background: "linear-gradient(135deg, #1e293b, #334155)",
            padding: "20px",
            borderRadius: "12px"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Proyectos recientes
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr>
                <th align="left">Proyecto</th>
                <th align="left">Acciones</th>
                <th align="left">Estado</th>
                <th align="left">Presupuesto</th>
              </tr>
            </thead>

           <tbody>
                {proyectos.map((proyecto) => (
<tr key={proyecto.id}>
  <td>{proyecto.nombre}</td>
  <td>{proyecto.estado}</td>
  <td>Q{proyecto.presupuesto_estimado}</td>
<td>
  <button
    onClick={() => editarProyecto(proyecto)}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "10px"
    }}
  >
    Editar
  </button>

  <button
    onClick={() => eliminarProyecto(proyecto.id)}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    Eliminar
  </button>
</td>
</tr>
  ))}
            </tbody>
           </table>
         </div>

            <div
            style={{
            marginTop: "40px",
            background: "linear-gradient(135deg, #1e293b, #334155)",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}
>
  <h2 style={{ marginBottom: "20px" }}>
    Resumen Empresarial
  </h2>

  <Bar data={data} />
         </div>

       </div>
     </div>
);
}

export default App;
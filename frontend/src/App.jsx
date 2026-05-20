import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "#f1f5f9"
};

const thStyle = {
  textAlign: "left",
  padding: "12px"
};

const tdStyle = {
  padding: "12px"
};

function App() {
  const [proyectos, setProyectos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [compras, setCompras] = useState([]);

const [nuevoAvance, setNuevoAvance] = useState({
  proyecto_id: "",
  descripcion: "",
  porcentaje_avance: "",
  fecha_avance: "",
  observaciones: "",
  estado: ""
});
const [nuevaCompra, setNuevaCompra] = useState({
  material_id: "",
  proveedor_id: "",
  cantidad: "",
  precio_unitario: "",
  fecha: ""
});

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

const [nuevoMaterial, setNuevoMaterial] = useState({
  nombre: "",
  descripcion: "",
  unidad_medida: "",
  precio_unitario: "",
  stock: "",
  proveedor: ""
});

const [materialEditando, setMaterialEditando] = useState(null);

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

    const response = await axios.get(
      "http://localhost:3000/api/compras"
    );

    setCompras(response.data);

  } catch (error) {

    console.log(error);

  }

};

const crearCompra = async (e) => {

  e.preventDefault();

  try {

await axios.post("http://localhost:3000/api/compras", {
  material_id: nuevaCompra.material_id,
  proveedor_id: nuevaCompra.proveedor_id,
  cantidad: nuevaCompra.cantidad,
  precio_unitario: nuevaCompra.precio_unitario,
  total: Number(nuevaCompra.cantidad) * Number(nuevaCompra.precio_unitario),
  fecha_compra: nuevaCompra.fecha,
  estado: "Registrada"
});

    setNuevaCompra({
      material_id: "",
      proveedor_id: "",
      cantidad: "",
      precio_unitario: "",
      fecha: ""
    });

    obtenerCompras();

  } catch (error) {

    console.log(error);

  }

};

const eliminarCompra = async (id) => {

  try {

    await axios.delete(
      `http://localhost:3000/api/compras/${id}`
    );

    obtenerCompras();

  } catch (error) {

    console.log(error);

  }

};

const obtenerAvances = async () => {

  try {

    const response = await axios.get(
      "http://localhost:3000/api/avances"
    );

    setAvances(response.data);

  } catch (error) {

    console.log(error);

  }

};

const crearAvance = async (e) => {

  e.preventDefault();

  try {

    await axios.post(
      "http://localhost:3000/api/avances",
      nuevoAvance
    );

    setNuevoAvance({
      proyecto_id: "",
      descripcion: "",
      porcentaje_avance: "",
      fecha_avance: "",
      observaciones: "",
      estado: ""
    });

    obtenerAvances();

  } catch (error) {

    console.log(error);

  }

};

const eliminarAvance = async (id) => {

  try {

    await axios.delete(
      `http://localhost:3000/api/avances/${id}`
    );

    obtenerAvances();

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

const crearMaterial = async (e) => {
  e.preventDefault();

  try {
    const estabaEditando = materialEditando !== null;

    if (estabaEditando) {
      await axios.put(
        `http://localhost:3000/api/materiales/${materialEditando.id}`,
        nuevoMaterial
      );

      setMaterialEditando(null);
    } else {
      await axios.post(
        "http://localhost:3000/api/materiales",
        nuevoMaterial
      );
    }
setNuevoMaterial({
  nombre: "",
  descripcion: "",
  unidad_medida: "",
  precio_unitario: "",
  stock: "",
  proveedor: ""
});

    obtenerMateriales();

    Swal.fire({
      icon: "success",
      title: estabaEditando ? "Material actualizado" : "Material guardado",
      text: "La operación se realizó correctamente",
      timer: 1800,
      showConfirmButton: false
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo realizar la operación"
    });

    console.log(error);
  }
};

const eliminarMaterial = async (id) => {

  try {

    await axios.delete(
      `http://localhost:3000/api/materiales/${id}`
    );

    obtenerMateriales();

  } catch (error) {

    console.log(error);

  }
};
const editarMaterial = (material) => {
  setMaterialEditando(material);

setNuevoMaterial({
  nombre: material.nombre,
  descripcion: material.descripcion,
  unidad_medida: material.unidad_medida,
  precio_unitario: material.precio_unitario,
  stock: material.stock,
  proveedor: material.proveedor
});
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
    marginTop: "40px",
    background: "#1e293b",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
  }}
>
  <h2 style={{ marginBottom: "20px" }}>
    Avance por Proyecto
  </h2>

  <Bar
    data={{
      labels: proyectos.map((p) => p.nombre),

      datasets: [
        {
          label: "Porcentaje de avance",

          data: proyectos.map((proyecto) => {

            const avancesProyecto = avances.filter(
              (avance) => avance.proyecto_id === proyecto.id
            );

            if (avancesProyecto.length === 0) return 0;

            return avancesProyecto[
              avancesProyecto.length - 1
            ].porcentaje_avance;
          }),

          backgroundColor: "#2563eb"
        }
      ]
    }}

    options={{
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: "white"
          }
        },

        y: {
          ticks: {
            color: "white"
          }
        }
      }
    }}
  />
</div>
<div
  style={{
    marginTop: "40px",
    background: "#1e293b",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
  }}
>
  <h2 style={{ marginBottom: "20px" }}>
    Compras por Material
  </h2>

  <Bar
    data={{
      labels: materiales.map((material) => material.nombre),

      datasets: [
        {
          label: "Total comprado",

          data: materiales.map((material) => {

            const comprasMaterial = compras.filter(
              (compra) => compra.material_id === material.id
            );

            return comprasMaterial.reduce(
              (total, compra) => total + Number(compra.cantidad),
              0
            );
          }),

          backgroundColor: "#16a34a"
        }
      ]
    }}

    options={{
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: "white"
          }
        },

        y: {
          ticks: {
            color: "white"
          }
        }
      }
    }}
  />
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

      <td>{proyecto.estado}</td>

      <td>
        Q{proyecto.presupuesto_estimado}
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

 <div style={{
  marginTop: "40px",
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
}}>

  <h2 style={{ marginBottom: "20px" }}>Materiales</h2>

  <form
    onSubmit={crearMaterial}
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "15px",
      marginBottom: "30px"
    }}
  >

    <input style={inputStyle} type="text" placeholder="Nombre" value={nuevoMaterial.nombre}
      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, nombre: e.target.value })} />

    <input style={inputStyle} type="text" placeholder="Descripción" value={nuevoMaterial.descripcion}
      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, descripcion: e.target.value })}/>

    <input style={inputStyle} type="text" placeholder="Unidad de medida" value={nuevoMaterial.unidad_medida}
      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, unidad_medida: e.target.value })}/>

    <input style={inputStyle} type="number" placeholder="Precio unitario" value={nuevoMaterial.precio_unitario}
      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, precio_unitario: e.target.value })} />

    <input style={inputStyle} type="number" placeholder="Stock" value={nuevoMaterial.stock}
      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, stock: e.target.value })} />

    <input style={inputStyle} type="text" placeholder="Proveedor" value={nuevoMaterial.proveedor}
      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, proveedor: e.target.value })}/>

    <button
      type="submit"
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "12px",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      {materialEditando ? "Actualizar Material" : "Guardar Material"}
    </button>

  </form>

  <div style={{ overflowX: "auto" }}>
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      color: "white"
    }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #475569" }}>
<th style={thStyle}>Nombre</th>
<th style={thStyle}>Descripción</th>
<th style={thStyle}>Unidad</th>
<th style={thStyle}>Precio</th>
<th style={thStyle}>Stock</th>
<th style={thStyle}>Proveedor</th>
<th style={thStyle}>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {materiales.map((material) => (
    <tr key={material.id} style={{ borderBottom: "1px solid #334155" }}>
  <td style={tdStyle}>{material.nombre}</td>
  <td style={tdStyle}>{material.descripcion}</td>
  <td style={tdStyle}>{material.unidad_medida}</td>
  <td style={tdStyle}>Q{material.precio_unitario}</td>
  <td style={tdStyle}>{material.stock}</td>
  <td style={tdStyle}>{material.proveedor}</td>

  <td style={tdStyle}>
    <button
      onClick={() => editarMaterial(material)}
      style={{
        background: "#f59e0b",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "8px 12px",
        cursor: "pointer",
        marginRight: "8px"
      }}
    >
      Editar
    </button>

    <button
      onClick={() => eliminarMaterial(material.id)}
      style={{
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "8px 12px",
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
<div style={{
  marginTop: "40px",
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
}}>

  <h2 style={{ marginBottom: "20px" }}>Compras</h2>

  <form
    onSubmit={crearCompra}
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "15px",
      marginBottom: "30px"
    }}
  >

    <select
      style={inputStyle}
      value={nuevaCompra.material_id}
      onChange={(e) => setNuevaCompra({ ...nuevaCompra, material_id: e.target.value })}
    >
      <option value="">Seleccione material</option>
      {materiales.map((material) => (
        <option key={material.id} value={material.id}>
          {material.nombre}
        </option>
      ))}
    </select>

    <input
      style={inputStyle}
      type="number"
      placeholder="ID Proveedor"
      value={nuevaCompra.proveedor_id}
      onChange={(e) => setNuevaCompra({ ...nuevaCompra, proveedor_id: e.target.value })}
    />

    <input
      style={inputStyle}
      type="number"
      placeholder="Cantidad"
      value={nuevaCompra.cantidad}
      onChange={(e) => setNuevaCompra({ ...nuevaCompra, cantidad: e.target.value })}
    />

    <input
      style={inputStyle}
      type="number"
      placeholder="Precio unitario"
      value={nuevaCompra.precio_unitario}
      onChange={(e) => setNuevaCompra({ ...nuevaCompra, precio_unitario: e.target.value })}
    />

    <input
      style={inputStyle}
      type="date"
      value={nuevaCompra.fecha}
      onChange={(e) => setNuevaCompra({ ...nuevaCompra, fecha: e.target.value })}
    />

    <button
      type="submit"
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "12px",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      Guardar Compra
    </button>

  </form>

  <div style={{ overflowX: "auto" }}>
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      color: "white"
    }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #475569" }}>
          <th style={thStyle}>Material</th>
          <th style={thStyle}>Proveedor</th>
          <th style={thStyle}>Cantidad</th>
          <th style={thStyle}>Precio</th>
          <th style={thStyle}>Fecha</th>
          <th style={thStyle}>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {compras.map((compra) => (
          <tr key={compra.id} style={{ borderBottom: "1px solid #334155" }}>
            <td style={tdStyle}>
              {
                materiales.find((material) => material.id === compra.material_id)?.nombre
                || compra.material_id
              }
            </td>
            <td style={tdStyle}>
              {compra.proveedor_id === 1
               ? "Ferretería La Económica"
               : compra.proveedor_id}
            </td>
            <td style={tdStyle}>{compra.cantidad}</td>
            <td style={tdStyle}>Q{compra.precio_unitario}</td>
            <td style={tdStyle}>{compra.fecha_compra ? compra.fecha_compra.substring(0, 10) : ""}</td>
            <td style={tdStyle}>
              <button
                onClick={() => eliminarCompra(compra.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
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
<div style={{
  marginTop: "40px",
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
}}>

  <h2 style={{ marginBottom: "20px" }}>Avances de obra</h2>

  <form
    onSubmit={crearAvance}
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "15px",
      marginBottom: "30px"
    }}
  >

    <select
      style={inputStyle}
      value={nuevoAvance.proyecto_id}
      onChange={(e) => setNuevoAvance({ ...nuevoAvance, proyecto_id: e.target.value })}
    >
      <option value="">Seleccione proyecto</option>
      {proyectos.map((proyecto) => (
        <option key={proyecto.id} value={proyecto.id}>
          {proyecto.nombre}
        </option>
      ))}
    </select>

    <input
      style={inputStyle}
      type="text"
      placeholder="Descripción"
      value={nuevoAvance.descripcion}
      onChange={(e) => setNuevoAvance({ ...nuevoAvance, descripcion: e.target.value })}
    />

    <input
      style={inputStyle}
      type="number"
      placeholder="Porcentaje de avance"
      value={nuevoAvance.porcentaje_avance}
      onChange={(e) => setNuevoAvance({ ...nuevoAvance, porcentaje_avance: e.target.value })}
    />

    <input
      style={inputStyle}
      type="date"
      value={nuevoAvance.fecha_avance}
      onChange={(e) => setNuevoAvance({ ...nuevoAvance, fecha_avance: e.target.value })}
    />

    <input
      style={inputStyle}
      type="text"
      placeholder="Observaciones"
      value={nuevoAvance.observaciones}
      onChange={(e) => setNuevoAvance({ ...nuevoAvance, observaciones: e.target.value })}
    />

    <select
      style={inputStyle}
      value={nuevoAvance.estado}
      onChange={(e) => setNuevoAvance({ ...nuevoAvance, estado: e.target.value })}
    >
      <option value="">Seleccione estado</option>
      <option value="En proceso">En proceso</option>
      <option value="Finalizado">Finalizado</option>
      <option value="Pausado">Pausado</option>
    </select>

    <button
      type="submit"
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "12px",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      Guardar Avance
    </button>

  </form>

  <div style={{ overflowX: "auto" }}>
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      color: "white"
    }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #475569" }}>
          <th style={thStyle}>Proyecto</th>
          <th style={thStyle}>Descripción</th>
          <th style={thStyle}>Avance</th>
          <th style={thStyle}>Fecha</th>
          <th style={thStyle}>Estado</th>
          <th style={thStyle}>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {avances.map((avance) => (
          <tr key={avance.id} style={{ borderBottom: "1px solid #334155" }}>
            <td style={tdStyle}>
              {
                proyectos.find((proyecto) => proyecto.id === avance.proyecto_id)?.nombre 
                || avance.proyecto_id
              }
            </td>
            <td style={tdStyle}>{avance.descripcion}</td>
            <td style={tdStyle}>{avance.porcentaje_avance}%</td>
            <td style={tdStyle}>
              {avance.fecha_registro ? avance.fecha_registro.substring(0, 10) : ""}
            </td>
            <td style={tdStyle}>{avance.estado}</td>
            <td style={tdStyle}>
              <button
                onClick={() => eliminarAvance(avance.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
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

</div>
</div>
</div>
</div>
     </div>
);
}


export default App;
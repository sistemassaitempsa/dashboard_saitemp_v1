<template>
  <div class="container">
    <Loading :loading="loading" />
    <div
      @click="toggleDiv"
      :class="{
        expandido: divExpandido,
        pestaña: !divExpandido,
        pestaña3: divExpandido,
      }"
      class="pestaña"
      style="overflow-y: auto"
    >
      <div v-if="!divExpandido">Porcentajes:</div>
      <div v-if="divExpandido" style="text-align: left">
        Total de registros:
        <p>{{ total_registros }}</p>
      </div>
      <hr v-if="divExpandido" />
      <div v-if="divExpandido" style="text-align: left">
        Porcentaje de estados oportunos:
        <p>{{ porcentaje_oportuno }} %</p>
      </div>
      <hr v-if="divExpandido" />
      <div v-if="divExpandido" style="text-align: left">
        Porcentaje de estados no oportunos:
        <p>{{ porcentaje_no_oportuno }} %</p>
      </div>
      <hr v-if="divExpandido" />
      <div v-if="divExpandido" style="text-align: left">
        Porcentaje de estados pendientes:
        <p>{{ porcentaje_pendientes }} %</p>
      </div>
    </div>
    <div class="row">
      <h2>Historico de estados</h2>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-12">
        <h5 class="h5paginate" v-if="datos.length > 0">
          Mostrando {{ this.datos.length }} de
          {{ this.total_registros }} registros - página
          {{ this.page_label }}
        </h5>
      </div>
    </div>
    <div
      v-if="datos.length > 0"
      class="row mt-4"
      style="text-align: left; clear: both"
    >
      <span @click="toggleFiltros = !toggleFiltros" style="cursor: pointer"
        >Filtro avanzado de búsqueda
        <i v-if="toggleFiltros" class="bi bi-chevron-down"></i
        ><i v-if="!toggleFiltros" class="bi bi-chevron-compact-up"></i
      ></span>
    </div>
    <FiltrosTabla
      @descargarExcel="descargarExcel"
      @enviarFiltros="aplicarFiltro"
      :filtros="filtros"
      @borrarBusqueda="aplicarFiltro"
      v-if="toggleFiltros"
    ></FiltrosTabla>
    <TablaHistoricoEstados
      :datos="filteredDatos"
      :total_registros="total_registros"
      :columnas="columnas"
      :linkRegistro="'/navbar/debida-diligencia/formulario-clientes/'"
      @cantidadRegistros="cantidadRegistrosLista"
    ></TablaHistoricoEstados>
    <TablaPaginador
      :pagination="pagination"
      @navigate="(url, page_label) => getDatos(url, page_label)"
    />
  </div>
</template>
<script>
import TablaHistoricoEstados from "./TablaHistoricoEstados.vue";
import FiltrosTabla from "./FiltrosTabla.vue";
import { Token } from "../Mixins/Token.js";
import { Alerts } from "../Mixins/Alerts.js";
import TablaPaginador from "./TablaPaginador.vue";
import Loading from "./Loading.vue";
import axios from "axios";
export default {
  name: "",
  components: {
    TablaHistoricoEstados,
    TablaPaginador,
    FiltrosTabla,
    Loading,
  },
  mixins: [Token, Alerts],
  props: {},
  data() {
    return {
      loading: false,
      toggleFiltros: false,
      page_label: "",
      pagination: {},
      total_registros: 0,
      porcentaje_pendientes: "",
      porcentaje_no_oportuno: "",
      porcentaje_oportuno: "",
      divExpandido: false,
      divExpandido2: false,
      URL_API: process.env.VUE_APP_URL_API,
      first_page_url: "",
      datos: [],
      columnas: [
        "Radicado",
        "Responsable",
        "Estado",
        "Fecha creación",
        "Fecha de finalización",
        "Tiempo(min)",
        "Tiempo estimado(min)",
        "Oportuno",
      ],
      filtros: [
        {
          value: "radicado",
          label: "Radicado",
          opciones: ["Igual a", "Contiene"],
          type: "text",
        },
        {
          value: "responsable_final",
          label: "Responsable",
          opciones: ["Igual a"],
          type: "select",
          opciones_select: [],
        },
        {
          value: "nombre_estado",
          label: "Estado",
          opciones: ["Igual a"],
          type: "select",
          opciones_select: [],
        },
        {
          value: "created_at",
          label: "Fecha creación",
          opciones: ["Igual a", "Entre"],
          type: "date",
        },
        {
          value: "updated_at",
          label: "Fecha finalización",
          opciones: ["Igual a", "Entre"],
          type: "date",
        },
        {
          value: "tiempo",
          label: "Tiempo",
          opciones: ["Igual a", "Entre"],
          type: "text",
        },
        {
          value: "oportuno",
          label: "Oportuno",
          opciones: ["Igual a"],
          type: "select",
          opciones_select: ["Si", "No", "Estado pendiente"],
        },
      ],
    };
  },
  computed: {
    filteredDatos() {
      return this.datos.map((item) => ({
        radicado: item.radicado,
        responsable_final: item.responsable_final,
        nombre_estado: item.nombre_estado,
        created_at: item.created_at
          ? this.formatearFecha(item.created_at)
          : this.formatearFecha(item.estado_created_at),
        updated_at: item.updated_at
          ? this.formatearFecha(item.updated_at)
          : this.formatearFecha(item.estado_updated_at),
        Tiempo: item.tiempo,
        tiempo_estimado: item.tiempo_estimado,
        oportuno: this.formatearOportuno(item.oportuno),
        id: item.id,
      }));
    },
  },
  watch: {},
  mounted() {},
  created() {
    this.getDatos();
    this.getEstados();
    this.getResponsables();
  },
  methods: {
    toggleDiv() {
      this.divExpandido = !this.divExpandido;
      this.divExpandido2 = false;
    },
    async getDatos(
      url = `${this.URL_API}api/v1/consultaHistoricoEstadosDd/10`,
      page = 1
    ) {
      this.loading = true;

      try {
        const config = this.configHeader();

        // Incluye los filtros actuales
        const filtros = this.filtrosAplicados || [];

        // Realiza la solicitud POST con filtros y URL
        const response = await axios.post(url, { filtros }, config);

        this.datos = response.data.data || [];
        this.total_registros = response.data.total;
        this.page_label = page;
        this.porcentaje_pendientes = response.data.porcentaje_pendientes;
        this.porcentaje_no_oportuno = response.data.porcentaje_no_oportuno;
        this.porcentaje_oportuno = response.data.porcentaje_oportuno;

        // Filtra los enlaces del paginador
        const linksFiltered = response.data.links.filter((link) => {
          return (
            link.label !== "Next &raquo;" && link.label !== "&laquo; Previous"
          );
        });

        this.pagination = {
          links: linksFiltered,
          prev_page_url: response.data.prev_page_url,
          next_page_url: response.data.next_page_url,
        };
        this.loading = false;
      } catch (error) {
        this.showAlert("Error al cargar los datos", "error");
        this.loading = false;
      }
    },
    getResponsables() {
      let self = this;
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/allUsers", config)
        .then(function (result) {
          result.data.forEach((element) => {
            self.filtros[1].opciones_select.push(element.nombre);
          });
        });
    },
    getEstados() {
      let self = this;
      let config = this.configHeader();

      axios
        .get(self.URL_API + "api/v1/estadosfirma", config)
        .then(function (result) {
          result.data.forEach((element) => {
            self.filtros[2].opciones_select.push(element.nombre);
          });
        });
    },
    formatearFecha(fechaISO) {
      try {
        // Intenta crear una fecha a partir del formato original
        let fecha = new Date(fechaISO);

        // Si la fecha es inválida, intenta reemplazar ciertos formatos problemáticos
        if (isNaN(fecha)) {
          // Corrige fechas con espacios o con un formato incorrecto
          fechaISO = fechaISO.replace(" ", "T"); // Reemplaza espacio por "T" en caso de que falte
          fecha = new Date(fechaISO);
        }

        // Si sigue siendo inválida, lanza un error
        if (isNaN(fecha)) {
          throw new Error("Formato de fecha no válido");
        }

        // Retorna la fecha formateada
        return fecha.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      } catch (error) {
        console.error("Error al formatear la fecha:", error.message);
        return "Fecha no válida"; // Valor por defecto en caso de error
      }
    },
    async aplicarFiltro(filtros, cantidadRegistros = 10) {
      this.filtrosAplicados = filtros; // Almacena los filtros aplicados
      await this.getDatos(
        `${this.URL_API}api/v1/consultaHistoricoEstadosDd/${cantidadRegistros}`
      );
    },
    cantidadRegistrosLista(numero) {
      this.aplicarFiltro(this.filtrosAplicados, numero);
    },
    formatearOportuno(oportuno) {
      switch (oportuno) {
        case "1":
          return "Si";

        case "0":
          return "No";

        case "2":
          return "Estado pendiente";

        default:
          break;
      }
    },
    async descargarExcel(filtros) {
      const url = `${this.URL_API}api/v1/excelHistoricoEstadosDd`;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      };
      try {
        this.loading = true;
        const response = await axios.post(url, { filtros }, config);
        const urlDocument = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const link = document.createElement("a");
        link.href = urlDocument;
        link.setAttribute("download", "estados.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
h2 {
  font-family: "Montserrat", sans-serif;
  margin: 20px 0px 20px 0px;
}
.pestaña {
  position: fixed;
  top: 30%;
  right: 0;
  background-color: lightblue;
  padding: 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  cursor: pointer;
  z-index: 1000;
  background: rgb(0, 107, 63);
  color: white;
  background: linear-gradient(
    95deg,
    rgba(0, 107, 63, 1) 4%,
    rgba(26, 150, 56, 1) 19%,
    rgba(48, 159, 128, 1) 45%,
    rgba(22, 119, 115, 1) 63%,
    rgba(4, 66, 105, 1) 88%
  );
}

.pestaña2 {
  position: fixed;
  top: 37%;
  right: 0;
  background-color: lightblue;
  padding: 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  cursor: pointer;
  z-index: 1000;
  background: rgb(0, 107, 63);
  color: white;
  background: linear-gradient(
    95deg,
    rgba(0, 107, 63, 1) 4%,
    rgba(26, 150, 56, 1) 19%,
    rgba(48, 159, 128, 1) 45%,
    rgba(22, 119, 115, 1) 63%,
    rgba(4, 66, 105, 1) 88%
  );
}

.pestaña3 {
  position: fixed;
  top: 45%;
  right: 0;
  background-color: lightblue;
  padding: 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  cursor: pointer;
  z-index: 1000;
  background: rgb(0, 107, 63);
  color: white;
  background: linear-gradient(
    95deg,
    rgba(0, 107, 63, 1) 4%,
    rgba(26, 150, 56, 1) 19%,
    rgba(48, 159, 128, 1) 45%,
    rgba(22, 119, 115, 1) 63%,
    rgba(4, 66, 105, 1) 88%
  );
}

/* Animación para expandir */
@keyframes expandir {
  from {
    width: 0;
  }

  to {
    width: 300px;
  }
}

@keyframes contraer {
  from {
    width: 300px;
  }

  to {
    width: 0;
  }
}

/* Animación para expandir */
@keyframes expandir2 {
  from {
    width: 0;
  }

  to {
    width: 300px;
  }
}

@keyframes contraer2 {
  from {
    width: 300px;
  }

  to {
    width: 0;
  }
}

/* Estilos cuando el div está expandido */
.expandido {
  animation: expandir 1s ease;
  /* Animación para expandir */
  width: 300px;
  height: 300px;
  /* Anchura del contenido expandido */
}

.pestaña:not(.expandido) {
  animation: contraer 1s ease;
  /* Animación para contraer */
  overflow: hidden;
  /* Ocultar el contenido al contraer */
}

/* Estilos cuando el div está expandido */
.expandido2 {
  animation: expandir2 1s ease;
  /* Animación para expandir */
  width: 300px;
  height: 300px;
  /* Anchura del contenido expandido */
}

.pestaña2:not(.expandido2) {
  animation: contraer2 1s ease;
  /* Animación para contraer */
  overflow: hidden;
  /* Ocultar el contenido al contraer */
}
.h5paginate {
  text-align: left;
  color: #d06519;
  margin-top: 2em;
}
/* .orientacion{
    text-align: justify;
} */
</style>

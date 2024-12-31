<template>
  <div class="container">
    <Loading :loading="loadingChar1" />
    <div class="row">
      <div class="col">
        <span v-if="char1">Cantidad de radicados por cada mes del año.</span>
        <GraficoBarras
          @graficoCargado="graficoCargado"
          :labels_x="labels_x"
          :items="radicados_mes"
          :datosS="cargos_mes"
          :index="1"
        />
      </div>
      <div class="col">
        <span v-if="char2"
          >Cantidad de radicados por tipo de operacion por cada mes del
          año.</span
        >
        <GraficoBarras
          @graficoCargado="graficoCargado"
          :labels_x="labels_x"
          :items="estados_cargo"
          :datosS="cantidad_vacantes_tipo_servicio"
          :index="2"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <span v-if="char2"
          >Cantidad de radicados oportunos vs no oportunos por cada mes del
          año.</span
        >
        <GraficoBarras
          @graficoCargado="graficoCargado"
          :labels_x="labels_x"
          :items="estados_oportuno"
          :datosS="cantidad_oportunos"
          :index="3"
        />
      </div>
      <div class="col">
        <div v-if="items.length < 1">
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <h5>Cargando por favor espere un momento.</h5>
        </div>
        <div v-else>
          <div v-for="(row, index) in rows" :key="index" class="row">
            <GraficoCircular
              v-for="item in row"
              :item="item"
              :key="item.id"
              :maxPercentage="item.percentaje"
              :label="item.label"
              class="col"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <span v-if="char2">Porcentaje radicados oportunos vs no oportunos</span>

      <FiltrosTabla
        @enviarFiltros="aplicarFiltro"
        :filtros="filtros"
        @borrarBusqueda="aplicarFiltro"
        @descargarExcel="descargarExcel"
      />

      <div class="col">
        <div class="minHeight">
          <PieChart :datosPie="chartDataPie" v-if="charPie"></PieChart>
        </div>
      </div>
      <div
        class="row"
        style="text-align: left; clear: both; margin-bottom: 40px"
      >
        <h5 @click="historicoToggle = !historicoToggle" style="cursor: pointer">
          Detalle historico de estados
          <i v-if="historicoToggle" class="bi bi-chevron-compact-up"></i
          ><i v-if="!historicoToggle" class="bi bi-chevron-down"></i>
        </h5>
        <div v-if="!historicoToggle">
          <div class="row animationHistorico">
            <div class="col-xs-12 col-md-12">
              <h5 class="h5paginate" v-if="datos.length > 0">
                Mostrando {{ this.datos.length }} de
                {{ this.total_registros_pie }} registros - página
                {{ this.page_label }}
              </h5>
            </div>
          </div>
          <div class="col animationHistorico">
            <TablaHistoricoEstados
              :datos="filteredDatos"
              :total_registros="total_registros_pie"
              :columnas="columnas"
              :linkRegistro="'/navbar/debida-diligencia/formulario-clientes/'"
              @cantidadRegistros="cantidadRegistrosLista"
            ></TablaHistoricoEstados>
            <TablaPaginador
              :pagination="pagination"
              @navigate="(url, page_label) => getDatos(url, page_label)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PieChart from "./PieChart.vue";
import TablaHistoricoEstados from "./TablaHistoricoEstados.vue";
import FiltrosTabla from "./FiltrosTabla.vue";
import axios from "axios";
import GraficoCircular from "./GraficoCircular.vue";
import GraficoBarras from "./GraficoBarras.vue";
import { Token } from "../Mixins/Token.js";
import Loading from "./Loading.vue";
import TablaPaginador from "./TablaPaginador.vue";
export default {
  components: {
    GraficoCircular,
    FiltrosTabla,
    GraficoBarras,
    TablaHistoricoEstados,
    TablaPaginador,
    Loading,
    PieChart,
  },
  mixins: [Token],
  props: {},
  data() {
    return {
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
      page_label: "",
      pagination: {},
      historicoToggle: true,
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
          opciones: ["Contiene"],
          type: "select",
          opciones_select: [],
        },
        {
          value: "nombre_estado",
          label: "Estado",
          opciones: ["Igual a"],
          type: "text",
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
      charPie: false,
      chartDataPie: {},
      total_registros: 0,
      total_registros_pie: 0,
      loadingChar1: false,
      URL_API: process.env.VUE_APP_URL_API,
      loading: false,
      char2: false,
      cantidad_oportunos: "",
      cantidad_vacantes_tipo_servicio: "",
      char1: false,
      items: [],
      estados_oportuno: [],
      estados_cargo: [],
      radicados_mes: [],
      cargos_mes: "",
      labels_x: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
    };
  },
  computed: {
    rows() {
      return this.chunk(this.items, 3);
    },
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
  mounted() {
    this.allLoad();
  },
  created() {
    this.empleadosActivos();
    this.getDatos();
    this.getEstados();
    this.getResponsables();
    //   this.empleadosActivos()
  },
  methods: {
    async allLoad() {
      await this.getRadicadosMes();
      await this.getCantidadVacantesesTipoServicio();
      await this.getCantidadOportunos();
    },
    getCantidadOportunos(anio = null) {
      const fechaActual = new Date();
      const anioactual = fechaActual.getFullYear();
      if (anio == null) {
        anio = anioactual;
      }
      let self = this;
      var array = [];
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/estadoOportunoMes/" + anio, config)
        .then(function (result) {
          result.data.forEach(function (item, index) {
            if (index == 0) {
              self.estados_oportuno = Object.values(item["nombres"]);
            } else {
              array.push(Object.values(item));
            }
          });
          self.cantidad_oportunos = JSON.stringify(array);
        });
    },
    cantidadRegistrosLista(numero) {
      this.aplicarFiltro(this.filtrosAplicados, numero);
    },
    getCantidadVacantesesTipoServicio(anio = null) {
      const fechaActual = new Date();
      const anioactual = fechaActual.getFullYear();
      if (anio == null) {
        anio = anioactual;
      }
      let self = this;
      var array = [];
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/tipoDeOperacionMes/" + anio, config)
        .then(function (result) {
          result.data.forEach(function (item, index) {
            if (index == 0) {
              self.estados_cargo = Object.values(item["nombres"]);
            } else {
              array.push(Object.values(item));
            }
          });
          self.cantidad_vacantes_tipo_servicio = JSON.stringify(array);
        });
    },
    getRadicadosMes(anio = null) {
      this.loadingChar1 = true;
      const fechaActual = new Date();
      const anioactual = fechaActual.getFullYear();
      if (anio == null) {
        anio = anioactual;
      }
      let self = this;
      var array = [];
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/numeroRadicadosMes/" + anio, config)
        .then(function (result) {
          // Object.values(result.data).forEach(function (item) {
          //     self.cargos_mes.push(item)
          // })
          result.data.forEach(function (item, index) {
            if (index == 0) {
              self.radicados_mes = Object.values(item["nombres"]);
            } else {
              array.push(Object.values(item));
            }
          });
          self.cargos_mes = JSON.stringify(array);
          self.loadingChar1 = false;
        });
    },
    graficoCargado(cargado, index) {
      this.loadingChar1 = false;
      switch (index) {
        case 1:
          this.char1 = cargado;
          break;
        case 2:
          this.char2 = cargado;
          break;
        case 3:
          this.char3 = cargado;
          break;
        case 4:
          this.char4 = cargado;
          break;
        case 5:
          this.char5 = cargado;
          break;
        case 6:
          this.char6 = cargado;
          break;
        case 7:
          this.char7 = cargado;
          break;

        default:
          break;
      }
    },
    chunk(array, size) {
      const chunkedArray = [];
      let index = 0;
      while (index < array.length) {
        chunkedArray.push(array.slice(index, size + index));
        index += size;
      }
      return chunkedArray;
    },
    async getDatos(
      url = `${this.URL_API}api/v1/consultaHistoricoEstadosDd/10`,
      page = 1
    ) {
      this.loading = true;
      this.charPie = false;
      try {
        const config = this.configHeader();
        const filtros = this.filtrosAplicados || [];
        const response = await axios.post(url, { filtros }, config);
        this.datos = response.data.data || [];
        this.total_registros_pie = response.data.total;
        this.page_label = page;
        this.chartDataPie = {
          labels: [
            `Oportuno: ${response.data.porcentaje_oportuno}%`,
            `No Oportuno: ${response.data.porcentaje_no_oportuno}%`,
            `Pendiente: ${response.data.porcentaje_pendientes}%`,
          ],
          datasets: [
            {
              backgroundColor: ["#58b176", "#f76567", "#f3df86"],
              data: [
                response.data.porcentaje_oportuno,
                response.data.porcentaje_no_oportuno,
                response.data.porcentaje_pendientes,
              ],
            },
          ],
        };
        this.charPie = true;
        /*    this.porcentaje_pendientes = response.data.porcentaje_pendientes;
        this.porcentaje_no_oportuno = response.data.porcentaje_no_oportuno;
        this.porcentaje_oportuno = response.data.porcentaje_oportuno; */
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
      } catch {
        this.showAlert("Error al cargar los datos", "error");
        this.loading = false;
      }
    },
    async aplicarFiltro(filtros, cantidadRegistros = 10) {
      this.filtrosAplicados = filtros; // Almacena los filtros aplicados
      await this.getDatos(
        `${this.URL_API}api/v1/consultaHistoricoEstadosDd/${cantidadRegistros}`
      );
    },
    empleadosActivos() {
      let self = this;
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/clientesactivos", config)
        .then(function (result) {
          self.items.push({
            percentaje: result.data,
            label: "Clientes registrados",
          });
        });
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
  },
};
</script>
<style scoped>
h2 {
  font-family: "Montserrat", sans-serif;
  margin: 20px 0px 20px 0px;
}

.row {
  margin-bottom: 30px;
}
.animationHistorico {
  animation: fadeIn 0.3s ease;
}
/*spiner*/
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin-top: 50px;
  color: red;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid rgb(10, 10, 10);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: rgb(199, 195, 195) transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.row {
  background-color: rgba(216, 231, 233, 0.653);
  margin-top: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  padding: 15px;
}

span {
  float: left;
  display: block;
  padding: 15px;
  /* transition-duration: 500ms; */
}
.minHeight {
  height: 300px;
  min-height: 3em;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
/* fin spinner*/
</style>

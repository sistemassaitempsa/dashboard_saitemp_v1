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
  </div>
</template>
<script>
import axios from "axios";
import GraficoCircular from "./GraficoCircular.vue";
import GraficoBarras from "./GraficoBarras.vue";
import { Token } from "../Mixins/Token.js";
import Loading from "./Loading.vue";
export default {
  components: {
    GraficoCircular,
    GraficoBarras,
    Loading,
  },
  mixins: [Token],
  props: {},
  data() {
    return {
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
  },
  watch: {},
  mounted() {
    this.allLoad();
  },
  created() {
    this.empleadosActivos();
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
/* fin spinner*/
</style>

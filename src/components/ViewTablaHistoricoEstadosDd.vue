<template>
  <div class="container">
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
    <h2>Historico de estados</h2>
    <TablaHistoricoEstados
      :datos="filteredDatos"
      :columnas="columnas"
    ></TablaHistoricoEstados>
  </div>
</template>
<script>
import TablaHistoricoEstados from "./TablaHistoricoEstados.vue";
import { Token } from "../Mixins/Token.js";
import { Alerts } from "../Mixins/Alerts.js";
import axios from "axios";
export default {
  name: "",
  components: {
    TablaHistoricoEstados,
  },
  mixins: [Token, Alerts],
  props: {},
  data() {
    return {
      total_registros: "",
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
        "Oportuno",
      ],
    };
  },
  computed: {
    filteredDatos() {
      return this.datos.map((item) => ({
        radicado: item.radicado,
        responsable_inicial: item.responsable_inicial,
        nombre_estado: item.nombre_estado,
        created_at: this.formatearFecha(item.created_at),
        updated_at: this.formatearFecha(item.updated_at),
        Tiempo: item.tiempo != 0 ? item.tiempo : "Estado pendiente",
        oportuno: this.formatearOportuno(item.oportuno),
      }));
    },
  },
  watch: {},
  mounted() {},
  created() {
    this.getDatos();
  },
  methods: {
    toggleDiv() {
      this.divExpandido = !this.divExpandido;
      this.divExpandido2 = false;
    },
    getDatos() {
      let self = this;
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/consultaHistoricoEstadosDd/" + 10, config)
        .then((result) => {
          self.first_page_url = result.data.first_page_url.replace('"');
          this.datos = result.data.data;
          this.porcentaje_oportuno = result.data.porcentaje_oportuno;
          this.porcentaje_no_oportuno = result.data.porcentaje_no_oportuno;
          this.porcentaje_pendientes = result.data.porcentaje_pendientes;
          this.total_registros = result.data.total;
        });
    },
    formatearFecha(fechaISO) {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-Es", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
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

/* .orientacion{
    text-align: justify;
} */
</style>

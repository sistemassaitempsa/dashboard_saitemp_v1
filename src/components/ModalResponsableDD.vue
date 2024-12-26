<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="container">
        <div class="row">
          <div class="col">
            <label>{{ nombre_estado }}</label>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <SearchList
              nombreCampo="Responsable: "
              @getEncargados="getEncargados"
              eventoCampo="getEncargados"
              nombreItem="nombre"
              :consulta="consulta_responsable_firma"
              :registros="lista_responsables"
              placeholder="Seleccione una opción"
              :valida_campo="true"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <button type="button" class="buttonCancel" @click="close">
              Cancelar
            </button>
          </div>
          <div class="col">
            <button type="button" class="buttonSave" @click="saveResponsableDD">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchList from "./SearchList.vue";
import axios from "axios";
import { Alerts } from "../Mixins/Alerts.js";
import { Token } from "../Mixins/Token.js";
import { Permisos } from "../Mixins/Permisos.js";
export default {
  name: "",
  components: {
    SearchList,
  },
  mixins: [Token, Alerts, Permisos],
  props: {
    estado_firma_id: {
      type: [String, Number], // Usa los constructores `String` y `Number` sin comillas
      required: true,
    },
    nombre_estado: {
      type: [String], // Usa los constructores `String` y `Number` sin comillas
      required: true,
    },
  },
  data() {
    return {
      consulta_responsable_firma: "",
      lista_encargados_debida_diligencia: "",
      correo_responsable: "",
      responsable_id: "",
      consulta_encargado: "",
      lista_responsables: "",
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    getEncargados(item = null) {
      if (item != null) {
        this.responsable_id = item.usuario_id;
        this.consulta_encargado = item.nombre;
        this.consulta_responsable_firma = item.nombre;
        this.correo_responsable = item.email;
      }
      if (this.estado_firma_id != 0) {
        let self = this;
        let config = this.configHeader();
        axios
          .get(
            self.URL_API +
              "api/v1/estadoResponsableFirma/" +
              this.estado_firma_id,
            config
          )
          .then(function (result) {
            self.lista_responsables = result.data;
          });
      }
    },
    close() {
      this.$emit("closeModalDD");
    },
    saveResponsableDD() {
      if (this.responsable_id != "") {
        this.$emit(
          "actualizaEstadoHijo",
          this.responsable_id,
          this.estado_firma_id,
          this.correo_responsable
        );
      } else {
        this.showAlert("Debe seleccionar un responsable", "error");
      }
    },
  },
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  animation: fadeIn 0.3s ease;
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

.buttonSave {
  margin-top: 10px;
  padding: 10px;
  background-color: #006b3f;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.8s;
}

.buttonSave:hover {
  background-color: #0d5436;
}
.buttonCancel {
  margin-top: 10px;
  padding: 10px;
  background-color: rgb(226, 74, 74);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.8s;
}
.buttonCancel:hover {
  background-color: #dd1d1d;
}
</style>

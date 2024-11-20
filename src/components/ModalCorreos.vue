<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="principalContainer">
        <h3>Información firmantes</h3>
        <form action="submit">
          <div class="border rounded mt-3 p-4">
            <h6>Representante legal cliente</h6>
            <div class="row">
              <div class="col">
                <label for="" class="form-check-label">Nombre</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="cliente.Nombre"
                  :disabled="disableCliente"
                />
              </div>
              <div class="col">
                <label for="" class="form-check-label"
                  >Correo electrónico</label
                >
                <input
                  class="form-control"
                  type="text"
                  v-model="cliente.Email"
                  :disabled="disableCliente"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label for="" class="form-check-label"
                  >Teléfono de contacto</label
                >
                <input
                  class="form-control"
                  type="text"
                  v-model="cliente.Telefono"
                  :disabled="disableCliente"
                />
              </div>
              <div class="col-1">
                <button
                  @click="editarCliente"
                  class="btn btn-warning btn-sm mt-5"
                  type="button"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="border rounded mt-3 p-4">
            <h6>Saitemp</h6>
            <div class="row">
              <div class="col">
                <label for="" class="form-check-label">Nombre</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="saitemp.Nombre"
                  :disabled="disableSaitemp"
                />
              </div>
              <div class="col">
                <label for="" class="form-check-label"
                  >Correo electrónico</label
                >
                <input
                  class="form-control"
                  type="text"
                  v-model="saitemp.Email"
                  :disabled="disableSaitemp"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label for="" class="form-check-label"
                  >Teléfono de contacto</label
                >
                <input
                  class="form-control"
                  type="text"
                  v-model="saitemp.Telefono"
                  :disabled="disableSaitemp"
                />
              </div>
              <div class="col-1">
                <div class="buttonContainer">
                  <button
                    @click="editarSaitemp"
                    class="btn btn-warning btn-sm mt-5"
                    type="button"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="close"
              >
                Cancelar
              </button>
            </div>
            <div class="col">
              <ConsultaContrato
                @pdf-generated="handlePdfGenerated"
                class="ct"
                :item_id="registro_id"
                :index="1"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import ConsultaContrato from "./ConsultaContrato.vue";
import { Alerts } from "../Mixins/Alerts.js";
import { Token } from "../Mixins/Token.js";
/* import Loading from "./Loading.vue"; */
import { Permisos } from "../Mixins/Permisos.js";
import axios from "axios";
export default {
  components: { ConsultaContrato },
  props: {
    registro_id: {
      tipe: String,
      default: "",
    },
    representante_legal: {
      nombre: "",
      correo: "",
      telefono: "",
      municipio_id: "",
      tipo_identificacion: "",
      identificacion: "",
      municipio: "",
    },
  },
  mixins: [Alerts, Token, Permisos],
  watch: {
    representante_legal: {
      immediate: true,
      handler(newVal) {
        this.cliente = {
          Nombre: newVal.nombre,
          Email: newVal.correo,
          Telefono: newVal.telefono,
          Indicativo: "57",
          Pais: "Colombia",
          Contador: "1",
          PruebaVida: "1",
        };
      },
    },
  },
  data() {
    return {
      cliente: {
        Nombre: "",
        Email: "",
        Telefono: "",
        Indicativo: "57",
        Pais: "Colombia",
        Contador: "1",
        PruebaVida: "1",
      },
      saitemp: {
        Nombre: "",
        Email: "",
        Telefono: "",
        Indicativo: "57",
        Pais: "Colombia",
        Contador: "2",
        PruebaVida: "0",
      },
      disableCliente: true,
      disableSaitemp: true,
    };
  },
  mounted() {
    this.llenarFormulario();
  },
  methods: {
    llenarFormulario() {
      let self = this;
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/userbyid/18 ", config)
        .then(function (result) {
          if (result.data.length > 0) {
            self.saitemp.Nombre = result.data[0].nombres;
            self.saitemp.Email = result.data[0].usuario;
          }
        });
    },
    editarCliente() {
      this.disableCliente = !this.disableCliente;
    },
    editarSaitemp() {
      this.disableSaitemp = !this.disableSaitemp;
    },
    close() {
      this.$emit("closeModalCorreos");
    },
    handlePdfGenerated(blob) {
      let self = this;
      let config = this.configHeader();
      const formData = new FormData();
      formData.append("file", blob, "documento.pdf");
      axios
        .post(
          self.URL_API + "api/v1/uploadFileValidart/" + this.registro_id,
          formData,
          config
        )
        .then((result) => {
          console.log(result);
        });
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
  max-width: 70%;
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
label {
  float: left;
  margin: 20px 0px 5px 0px;
}
.buttonContainer {
  height: 20px;
}
</style>

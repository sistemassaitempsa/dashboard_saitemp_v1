<template>
  <div class="container">
    <Loading :loading="loading" />
    <h2>Interacción cliente CRM</h2>
    <div id="seccion">
      <div class="row" v-if="$route.params.id != undefined">
        <div class="col">
          <h6 style="text-align: left">Radicado: {{ radicado }}</h6>
        </div>
        <div class="col" v-if="$route.params.id != null">
          <button
            type="button"
            class="btn btn-success btn-sm"
            style="float: left"
            @click="limpiarFormulario()"
          >
            Crear nuevo radicado
          </button>
        </div>
      </div>
      <form class="was-validated" @submit.prevent="save()">
        <div class="row" v-if="$route.params.id != undefined">
          <div class="col mb-3">
            <label class="form-label">Fecha de radicado: </label>
            <input
              type="datetime-local"
              class="form-control"
              autocomplete="off"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="fecha_radicado"
              disabled
            />
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
          <div class="col mb-3">
            <label class="form-label">Fecha de cierre: </label>
            <input
              type="datetime-local"
              class="form-control"
              autocomplete="off"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="fecha_cierre"
              disabled
            />
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <SearchList
              nombreCampo="Sede*"
              @getSedes="getSedes"
              eventoCampo="getSedes"
              nombreItem="nombre"
              :registros="sedes"
              placeholder="Seleccione una opción"
              :consulta="consulta_sede"
              :disabled="$route.params.id != undefined"
            />
          </div>

          <div class="col mb-3">
            <SearchList
              nombreCampo="Proceso o área *"
              @getProcesos="getProcesos"
              eventoCampo="getProcesos"
              nombreItem="nombre"
              :registros="procesos"
              placeholder="Seleccione una opción"
              :consulta="consulta_proceso"
              :disabled="$route.params.id != undefined"
            />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <SearchList
              nombreCampo="Solicitante *"
              @getSolicitanteCrm="getSolicitanteCrm"
              eventoCampo="getSolicitanteCrm"
              nombreItem="nombre"
              :registros="solicitantes"
              placeholder="Seleccione una opción"
              :consulta="consulta_solicitante"
              :disabled="$route.params.id != undefined"
            />
          </div>
          <div class="col mb-3">
            <SearchList
              nombreCampo="Tipo de atención *"
              @getInteracciones="getInteracciones"
              eventoCampo="getInteracciones"
              nombreItem="nombre"
              :registros="respuestas_interaccion"
              placeholder="Seleccione una opción"
              :consulta="consulta_interaccion"
              :disabled="$route.params.id != undefined"
            />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label class="form-label">Nombre / razón social: </label>
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="nombre_contacto"
              required
              :disabled="$route.params.id != undefined"
            />
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
          <div class="col mb-3">
            <label class="form-label">Nit / número de documento: </label>
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="nit_documento"
              required
              :disabled="$route.params.id != undefined"
            />
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label class="form-label">Telefono de contacto: </label>
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="telefono_contacto"
              required
              :disabled="$route.params.id != undefined"
            />
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
          <div class="col mb-3">
            <label class="form-label">Correo de contacto: </label>
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="correo_contacto"
              required
              :disabled="$route.params.id != undefined"
            />
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <SearchList
              nombreCampo="Estado *"
              @getEstadoCierreCrm="getEstadoCierreCrm"
              eventoCampo="getEstadoCierreCrm"
              nombreItem="nombre"
              :registros="estados_cierre"
              placeholder="Seleccione una opción"
              :consulta="consulta_estado_cierre"
              :disabled="
                $route.params.id != undefined && fecha_cierre != undefined
              "
            />
          </div>
          <div class="col mb-3">
            <SearchList
              nombreCampo="PQRSF *"
              @getPQRSF="getPQRSF"
              eventoCampo="getPQRSF"
              nombreItem="nombre"
              :registros="lista_pqrsf"
              placeholder="Seleccione una opción"
              :consulta="consulta_pqrsf"
              :disabled="$route.params.id != undefined"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-6 mb-3">
            <SearchList
              nombreCampo="Responsable *"
              @getUsuarios="getUsuarios"
              eventoCampo="getUsuarios"
              nombreItem="nombre"
              :registros="usuarios"
              placeholder="Seleccione una opción"
              :consulta="consulta_responsable"
              :disabled="$route.params.id != undefined"
              :index="1"
            />
          </div>
          <div
            class="col-6 mb-3"
            v-if="
              (estado_cierre_id == 2 && $route.params.id != undefined) ||
              (estado_cierre_id == 2 && $route.params.id == undefined)
            "
          >
            <SearchList
              nombreCampo="Cierra la PQRSF *"
              @getUsuarios="getUsuarios"
              eventoCampo="getUsuarios"
              nombreItem="nombre"
              :registros="usuarios"
              placeholder="Seleccione una opción"
              :consulta="consulta_cierra_pqrsf"
              :disabled="
                $route.params.id != undefined &&
                consulta_cierra_pqrsf != null &&
                fecha_cierre != undefined
              "
              :index="2"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-6 mb-3" v-if="$route.params.id != undefined">
            <label class="form-label">Crea PQRSF: </label>
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="crea_pqrsf"
              required
              :disabled="$route.params.id != undefined"
            />
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label class="form-label">Observación: *</label>
            <textarea
              class="form-control"
              required
              name=""
              id="razon_social"
              rows="10"
              v-model="observacion"
              placeholder="Observación"
              :disabled="$route.params.id != undefined"
            ></textarea>
            <div class="invalid-feedback">
              {{ mensaje_error }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col" v-if="$route.params.id != null">
            <label class="form-label labelBlock">Archivos adjuntos:</label>
          </div>
        </div>

        <div v-if="consulta_evidencias.length > 0">
          <div class="d-flex justify-content-center p-5 gap-8 flex-wrap">
            <div
              class="card p-3 fontSize-5"
              v-for="evidencia in consulta_evidencias"
              :key="evidencia.id"
              style="width: 18rem"
            >
              <div class="col d-flex justify-content-end">
                <a
                  :href="URL_API + evidencia.archivo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    type="button"
                    :class="
                      evidencia.archivo != undefined
                        ? 'btn btn-sm ver'
                        : 'btn btn-sm btn-secondary'
                    "
                  >
                    <i class="bi bi-eye"> ver</i>
                  </button>
                </a>
              </div>

              <div class="card-body">
                <h6 class="card-title">{{ getFileName(evidencia.archivo) }}</h6>
              </div>

              <div class="col">
                <div class="mb-3">
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    v-model="evidencia.descripcion"
                    :disabled="!evidencia.edit"
                  ></textarea>
                </div>
              </div>

              <div class="col">
                <div
                  class="d-flex justify-content-between align-items-center p-1"
                >
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="messageDelete(evidencia)"
                  >
                    <label class="bi bi-trash-fill labelOption">
                      Eliminar
                    </label>
                  </button>
                  <button
                    type="button"
                    :class="
                      evidencia.edit ? 'btn btn-success' : 'btn btn-warning'
                    "
                    @click="toggleEdit(evidencia)"
                  >
                    <label class="bi bi-pencil-square labelOption">
                      {{ evidencia.edit ? "Guardar" : "Editar" }}
                    </label>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div
            class="row"
            style="text-align: left; clear: both; margin-top: 40px"
          >
            <h5 @click="adjuntos = !adjuntos" style="cursor: pointer">
              Cargar Archivos
              <i v-if="adjuntos" class="bi bi-chevron-down"></i
              ><i v-if="!adjuntos" class="bi bi-chevron-compact-up"></i>
            </h5>
          </div>
          <div v-if="adjuntos">
            <div
              class="row obs"
              v-for="(item, index) in evidencias"
              :key="item.id"
            >
              <div class="row">
                <div class="mb-3">
                  <div class="row">
                    <div class="col-5">
                      <div class="input-group">
                        <input
                          class="form-control"
                          type="file"
                          accept="image/*,.pdf, .msg"
                          @change="cargarArchivo($event, index)"
                          id="formFileMultiple"
                          :ref="'fileInput' + index"
                          required
                        />
                        <span
                          style="cursor: pointer"
                          class="btn btn-outline-secondary"
                          @click="quitarAdjuntos(index)"
                          id="basic-addon1"
                          >Quitar imágenes</span
                        >
                      </div>
                    </div>

                    <div class="col-5">
                      <textarea
                        name=""
                        id="novedades"
                        class="form-control textareaControl"
                        rows="1"
                        v-model="evidencias[index].observacion"
                      ></textarea>
                    </div>
                    <div class="col-2 rightContent">
                      <label
                        class="bi bi-trash-fill labelOption"
                        v-if="index > 0"
                        @click="
                          deleteDynamic(evidencias, index, 'identificador')
                        "
                      >
                        Eliminar</label
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="botones"
                v-for="(item2, index2) in evidencias[index].file"
                :key="index2"
              >
                <div class="card mb-3" v-if="$route.params.id != undefined">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img
                        v-bind:src="item2"
                        class="img-fluid rounded-start"
                        alt=""
                      />
                    </div>
                    <!-- <div class="col-md-8">
                      <div class="card-body" style="text-align: left"></div>
                    </div> -->
                  </div>
                </div>
              </div>
              <!-- <div class="row editor"></div> -->
              <div
                class="row trash justify-content-center align-items-center padding-1"
              >
                <label
                  v-if="index == evidencias.length - 1"
                  id="clasificador"
                  @click="agregarObservacion()"
                  style="cursor: pointer"
                  ><i class="bi bi-plus-circle-fill"></i>
                  Agregar archivo
                </label>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-success" type="submit">
          Guardar formulario
        </button>
      </form>
    </div>
    <div
      class="row"
      v-if="$route.params.id != undefined"
      style="text-align: left; clear: both; margin-bottom: 40px"
    >
      <h5 @click="envio_correo = !envio_correo" style="cursor: pointer">
        Envío correo <i v-if="envio_correo" class="bi bi-chevron-down"></i
        ><i v-if="!envio_correo" class="bi bi-chevron-compact-up"></i>
      </h5>
    </div>
    <SolicitudNovedadesNomina
      v-if="$route.params.id != undefined && envio_correo"
      :menu="menu"
      :reenvio_correo="reenvio_correo"
      :adjuntos_candidato_string="adjuntos_candidato_string"
      @lanzarLoading="lanzarLoading"
      @correoEnviado="manejarCorreoEnviado"
    />

    <div
      class="row"
      v-if="gestioningresocorreos.length > 0"
      style="text-align: left; clear: both; margin-bottom: 40px"
    >
      <h5
        @click="historico_correos = !historico_correos"
        style="cursor: pointer"
      >
        Historico correos enviados
        <i v-if="historico_correos" class="bi bi-chevron-compact-up"></i
        ><i v-if="!historico_correos" class="bi bi-chevron-down"></i>
      </h5>
    </div>
    <div class="table-responsive" v-if="!historico_correos">
      <table
        class="table table-striped table-hover table-bordered align-middle"
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Remitente</th>
            <th scope="col">Destinatario</th>
            <th scope="col">Con copia</th>
            <th scope="col">Con copia oculta</th>
            <th scope="col">Asunto</th>
            <th scope="col">Mensaje</th>
            <th scope="col">Adjuntos</th>
            <th scope="col">Fecha envío</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in gestioningresocorreos" :key="index">
            <th scope="row">{{ index }}</th>
            <td>{{ item.remitente }}</td>
            <td>{{ item.destinatario }}</td>
            <td>{{ item.con_copia }}</td>
            <td>{{ item.con_copia_oculta }}</td>
            <td>{{ item.asunto }}</td>
            <td>{{ item.mensaje }}</td>
            <td>{{ item.adjunto }}</td>
            <td>{{ reformatearFecha(item.created_at) }}</td>
            <td scope="col">
              <button
                class="btn btn-success"
                type="button"
                @click="reenviar(item)"
              >
                Reenviar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Token } from "../Mixins/Token.js";
import { Alerts } from "../Mixins/Alerts.js";
import SearchList from "./SearchList.vue";
import Loading from "./Loading.vue";
import SolicitudNovedadesNomina from "./SolicitudNovedadesNomina.vue";

export default {
  components: {
    SearchList,
    Loading,
    SolicitudNovedadesNomina,
  },
  mixins: [Token, Alerts],
  props: {
    menu: [],
  },
  data() {
    return {
      reenvio_correo: "",
      historico_correos: true,
      URL_API: process.env.VUE_APP_URL_API,
      envio_correo: false,
      adjuntos_candidato_string: "",
      gestioningresocorreos: [],
      menu_id: "",
      adjuntos: false,
      mensaje_error: "",
      procesos: [],
      consulta_proceso: "",
      loading: false,
      sedes: [],
      sede_id: "",
      consulta_sede: "",
      respuestas_interaccion: [],
      consulta_interaccion: "",
      solicitantes: [],
      solicitante_id: "",
      consulta_solicitante: "",
      telefono_contacto: "",
      correo_contacto: "",
      estado_cierre_id: "",
      consulta_estado_cierre: "",
      estados_cierre: [],
      observacion: "",
      proceso_id: "",
      interaccion_id: "",
      nombre_contacto: "",
      radicado: "",
      nit_documento: "",
      fecha_radicado: "",
      fecha_cierre: "",
      lista_pqrsf: [],
      consulta_pqrsf: "",
      pqrsf_id: "",
      id_registro: "",
      crea_pqrsf: "",
      cierra_pqrsf_id: "",
      consulta_cierra_pqrsf: "",
      responsable_id: "",
      consulta_responsable: "",
      usuarios: [],
      evidencias: [{ observacion: "", file: [] }],
      consulta_texto: [],
      consulta_evidencias: [],
    };
  },
  computed: {},
  watch: {
    $route() {
      this.limpiarFormulario();
    },
    menu() {
      this.getModulo();
    },
  },
  created() {
    this.getModulo();
  },
  async mounted() {
    this.id_registro = this.$route.params.id;

    if (this.id_registro !== undefined) {
      this.getItem(this.id_registro);
    }
  },

  methods: {
    getFileName(filePath) {
      let lastUnderscoreIndex = 0;
      if (filePath) {
        lastUnderscoreIndex = filePath.lastIndexOf("_");
      } else {
        return null;
      }
      if (lastUnderscoreIndex === -1) return filePath;
      return filePath.substring(lastUnderscoreIndex + 1);
    },
    manejarCorreoEnviado() {
      this.historico_correos = true;
      this.historicoCorreos();
    },

    reformatearFecha(fechaOriginal) {
      const fechaHora = new Date(fechaOriginal);
      const año = fechaHora.getFullYear();
      const mes = (fechaHora.getMonth() + 1).toString().padStart(2, "0"); // Los meses son indexados desde 0
      const dia = fechaHora.getDate().toString().padStart(2, "0");
      const horas = fechaHora.getHours().toString().padStart(2, "0");
      const minutos = fechaHora.getMinutes().toString().padStart(2, "0");
      const segundos = fechaHora.getSeconds().toString().padStart(2, "0");
      const fechaFormateada = `${dia}/${mes}/${año}  `;
      const horaFormateada = `${horas}:${minutos}:${segundos}`;
      return fechaFormateada + " " + horaFormateada;
    },
    toggleEdit(evidencia) {
      evidencia.edit = !evidencia.edit;
      if (!evidencia.edit) {
        this.saveEvidencia(evidencia);
      }
    },
    saveEvidencia(evidencia) {
      let self = this;
      let config = this.configHeader();
      axios
        .put(
          self.URL_API + "api/v1/seguimientocrmupdateevidencia/" + evidencia.id,
          evidencia,
          config
        )
        .then(function (result) {
          self.showAlert(result.data.message, result.data.status);
        });
      console.log("Guardando evidencia:", evidencia);
    },

    agregarObservacion() {
      if (this.evidencias.length <= 10) {
        this.evidencias.push({ observacion: "", file: [] });
      }
    },
    deleteDynamic(array, index, identificador = null) {
      if (identificador != null) {
        this.consulta_texto.splice(index, 1);
        this.evidencias[index].file = [];
        this.evidencias.splice(index, 0);
        console.log(this.evidencias);
      }
      array.splice(index, 1);
    },
    deleteConsultaEvidencia(array, index, identificador = null) {
      if (identificador != null) {
        this.consulta_texto.splice(index, 1);
        this.consulta_evidencias[index] = [];
      }
      array.splice(index, 1);
    },
    limpiarFormulario() {
      this.radicado = "";
      this.nombre_contacto = "";
      this.sede_id = "";
      this.consulta_sede = "";
      this.proceso_id = "";
      this.consulta_proceso = "";
      this.solicitante_id = "";
      this.consulta_solicitante = "";
      this.interaccion_id = "";
      this.consulta_interaccion = "";
      this.telefono_contacto = "";
      this.correo_contacto = "";
      this.estado_cierre_id = "";
      this.consulta_estado_cierre = "";
      this.observacion = "";
      this.nit_documento = "";
      this.fecha_radicado = "";
      this.fecha_cierre = "";
      this.pqrsf_id = "";
      this.consulta_pqrsf = "";
      this.crea_pqrsf = "";
      this.consulta_cierra_pqrsf = "";
      this.consulta_responsable = "";
      this.historico_correos = true;
      this.gestioningresocorreos = [];
      this.consulta_evidencias = [];
      this.evidencias = [{ observacion: "", file: [] }];
      this.adjuntos = false;
    },
    getItem(id) {
      let self = this;
      self.loading = true;
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/seguimientocrmbyid/" + id, config)
        .then(function (result) {
          self.llenarFormulario(result.data);
        });
    },
    llenarFormulario(item) {
      this.radicado = item.numero_radicado;
      this.nombre_contacto = item.nombre_contacto;
      this.sede_id = item.sede_id;
      this.consulta_sede = item.sede;
      this.proceso_id = item.proceso_id;
      this.consulta_proceso = item.proceso;
      this.solicitante_id = item.solicitante_id;
      this.consulta_solicitante = item.solicitante;
      this.interaccion_id = item.tipo_atencion_id;
      this.consulta_interaccion = item.iteraccion;
      this.telefono_contacto = item.telefono;
      this.correo_contacto = item.correo;
      this.estado_cierre_id = item.estado_id;
      this.consulta_estado_cierre = item.estado;
      this.observacion = item.observacion;
      this.nit_documento = item.nit_documento;
      this.pqrsf_id = item.pqrsf_id;
      this.consulta_pqrsf = item.pqrsf;
      this.crea_pqrsf = item.creacion_pqrsf;
      this.consulta_cierra_pqrsf = item.cierre_pqrsf;
      this.consulta_responsable = item.responsable;
      this.fecha_radicado = this.formatearFecha(item.created_at);
      this.fecha_cierre = this.formatearFecha(item.fecha_cerrado);
      this.loading = false;
      this.consulta_evidencias = item.Evidencias;
      console.log(this.consulta_evidencias);
    },
    formatearFecha(fechaOriginal) {
      if (fechaOriginal != null) {
        var fecha = new Date(fechaOriginal);
        var year = fecha.getFullYear();
        var month = ("0" + (fecha.getMonth() + 1)).slice(-2);
        var day = ("0" + fecha.getDate()).slice(-2);
        var hour = ("0" + fecha.getHours()).slice(-2);
        var minute = ("0" + fecha.getMinutes()).slice(-2);
        var formattedDate = `${year}-${month}-${day}T${hour}:${minute}`;
        return formattedDate;
      }
    },
    cargarArchivo(event, index) {
      var self = this;
      const file = event.target.files;
      for (var i = 0; i < file.length; i++) {
        self.evidencias[index].file.push(file[i]);
      }
    },
    quitarAdjuntos(index) {
      this.evidencias[index].file = [];
      this.$refs["fileInput" + index][0].value = null;
    },
    formatearPesoArchivo(pesoBytes) {
      if (pesoBytes < 1024) {
        return `${pesoBytes} bytes`;
      } else if (pesoBytes < 1024 * 1024) {
        return `${Math.ceil(pesoBytes / 1024)} KB`;
      } else if (pesoBytes < 1024 * 1024 * 1024) {
        return `${Math.ceil(pesoBytes / (1024 * 1024))} MB`;
      } else {
        return `${Math.ceil(pesoBytes / (1024 * 1024 * 1024))} GB`;
      }
    },

    save() {
      let self = this;
      let config = this.configHeader();
      const formulario = new FormData();
      formulario.append("nombre_contacto", this.nombre_contacto);
      formulario.append("sede_id", this.sede_id);
      formulario.append("proceso_id", this.proceso_id);
      formulario.append("solicitante_id", this.solicitante_id);
      formulario.append("tipo_atencion_id", this.interaccion_id);
      formulario.append("telefono", this.telefono_contacto);
      formulario.append("correo", this.correo_contacto);
      formulario.append("estado_id", this.estado_cierre_id);
      formulario.append("observacion", this.observacion);
      formulario.append("nit_documento", this.nit_documento);
      formulario.append("pqrsf_id", this.pqrsf_id);
      formulario.append("creacion_pqrsf", this.crea_pqrsf);
      formulario.append("cierre_pqrsf", this.consulta_cierra_pqrsf);
      formulario.append("responsable", this.consulta_responsable);
      this.evidencias.forEach(function (item, index) {
        formulario.append("imagen[" + index + "][0]", item.observacion);
        item.file.forEach(function (item2, index2) {
          formulario.append(
            "imagen[" + index + "][" + (index2 + 1) + "]",
            item2
          );
        });
      });
      console.log(formulario);
      var id = this.$route.params.id;
      var url = "";
      if (id != null) {
        url = self.URL_API + "api/v1/seguimientocrm/" + id;
      } else {
        url = self.URL_API + "api/v1/seguimientocrm";
      }
      for (let pair of formulario.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      axios.post(url, formulario, config).then(function (result) {
        self.showAlert(result.data.message, result.data.status);
        self.getItem(result.data.id);
        const rutaActual = self.$route.path;
        console.log(rutaActual);
        const nuevosParametros = { ...rutaActual.params, id: result.data.id };
        self.$router.replace({ ...rutaActual, params: nuevosParametros });
      });
    },
    eliminarDocumento(item) {
      let self = this;
      let config = this.configHeader();
      axios
        .delete(
          self.URL_API +
            "api/v1/eliminararevidencia/" +
            this.$route.params.id +
            "/" +
            item.id,
          config
        )
        .then(function (result) {
          self.showAlert(result.data.message, result.data.status);
          if (result.data.status == "success") {
            self.consulta_evidencias = self.consulta_evidencias.filter(
              (evidencia) => evidencia.id !== item.id
            );
          }
        });
    },
    messageDelete(item) {
      let self = this;
      var title = "Estas seguro de elimiar el resgistro?";
      this.$swal
        .fire({
          title: title,
          text: "Esta operación no se puede revertir!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, eliminar!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            self.eliminarDocumento(item);
          }
        });
    },
    getSedes(item = null) {
      if (item != null) {
        this.sede_id = item.id;
        this.consulta_sede = item.nombre;
      }
      let self = this;
      let config = this.configHeader();
      axios.get(self.URL_API + "api/v1/sede", config).then(function (result) {
        self.sedes = result.data;
      });
    },
    reenviar(item) {
      this.envio_correo = true;
      setTimeout(() => {
        this.reenvio_correo = item;
      }, 1000);
    },
    getProcesos(item = null) {
      let self = this;
      if (item != null) {
        this.proceso_id = item.id;
        this.consulta_proceso = item.nombre;
      }
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/procesos", config)
        .then(function (result) {
          self.procesos = result.data;
        });
    },
    historicoCorreos() {
      var self = this;
      var config = this.configHeader();
      axios
        .get(
          self.URL_API +
            "api/v1/consultacorreo/" +
            self.menu_id +
            "/" +
            self.$route.params.id,
          config
        )
        .then(function (result) {
          self.gestioningresocorreos = result.data;
        });
    },
    getModulo() {
      var self = this;
      if (self.$route.path != "/navbar/gestion-ingresosl") {
        var ruta =
          self.$route.path.split("/")[1] + "/" + self.$route.path.split("/")[2];
        this.menu.forEach(function (item) {
          item.opciones.forEach((element) => {
            if (element.url == ruta) {
              self.menu_id = element.id;
              self.historicoCorreos();
            }
          });
        });
      }
    },
    getInteracciones(item = null) {
      let self = this;
      if (item != null) {
        this.interaccion_id = item.id;
        this.consulta_interaccion = item.nombre;
      }
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/interaccion", config)
        .then(function (result) {
          self.respuestas_interaccion = result.data;
        });
    },
    getSolicitanteCrm(item = null) {
      let self = this;
      if (item != null) {
        this.solicitante_id = item.id;
        this.consulta_solicitante = item.nombre;
      }
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/solicitantecrm", config)
        .then(function (result) {
          self.solicitantes = result.data;
        });
    },
    enviarArchivos(booleano, ruta_archivo, nombre) {
      var self = this;
      if (booleano) {
        this.adjuntos_candidato.push({
          nombre_archivo: nombre,
          ruta_archivo: ruta_archivo,
        });
      } else {
        this.adjuntos_candidato.forEach(function (item, index) {
          if (item.nombre_archivo == nombre) {
            self.adjuntos_candidato.splice(index, 1);
          }
        });
      }
      this.adjuntos_candidato_string = JSON.stringify(self.adjuntos_candidato);
    },
    lanzarLoading(loading) {
      this.loading = loading;
    },
    getEstadoCierreCrm(item = null) {
      let self = this;
      if (item != null) {
        this.estado_cierre_id = item.id;
        this.consulta_estado_cierre_id = item.nombre;
        if (item.id == 1) {
          this.cierra_pqrsf_id = "";
          this.consulta_cierra_pqrsf = "";
        }
      }
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/estadocirrecrm", config)
        .then(function (result) {
          self.estados_cierre = result.data;
        });
    },
    valida_envioCorreo() {
      if (this.correo_empresa == null && this.correo_laboratorio == null) {
        this.showAlert(
          "Para enviar el correo debe diligenciar por lo menos el correo de la empresa y guardar el formulario",
          "error"
        );
        return true;
      }
    },
    envioCorreo(id) {
      let self = this;
      if (this.valida_envioCorreo()) {
        return;
      }
      this.idSeleccionado = id;
      this.loading = true;
      this.scrollTop();
      let config = this.configHeader();
      axios
        .get(
          self.URL_API +
            "api/v1/gestioningresospdf/" +
            self.menu_id +
            "/" +
            self.$route.params.id +
            "/" +
            this.idSeleccionado,
          config
        )
        .then(function (result) {
          // self.estados_ingreso = result.data
          self.showAlert(result.data.message, result.data.status);
          self.loading = false;
        });
    },
    getPQRSF(item = null) {
      let self = this;
      if (item != null) {
        this.pqrsf_id = item.id;
        this.consulta_pqrsf = item.nombre;
      }
      let config = this.configHeader();
      axios.get(self.URL_API + "api/v1/pqrsf", config).then(function (result) {
        self.lista_pqrsf = result.data;
      });
    },
    getUsuarios(item = null, index = null) {
      if (item != null) {
        switch (index) {
          case 1:
            this.responsable_id = item.id;
            this.consulta_responsable = item.nombre;
            break;
          case 2:
            this.cierra_pqrsf_id = item.id;
            this.consulta_cierra_pqrsf = item.nombre;
            break;
        }
      }

      let self = this;
      let config = this.configHeader();
      axios
        .get(self.URL_API + "api/v1/userslist", config)
        .then(function (result) {
          self.usuarios = result.data;
        });
    },
  },
};
</script>
<style scoped>
#seccion {
  border: solid #d5dbdb 0.5px;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
}

.tituloseccion {
  position: relative;
  display: inline-block;
  background-color: white;
  padding: 5px;
  top: 22px;
}
.bi bi-x {
  margin: 20px 0px 20px 0px;
  max-width: 400px;
  cursor: pointer;
}
.btn-group {
  overflow: auto;
}

span {
  height: 38px;
}
.botones {
  padding: 5px;
}
.adjunto {
  white-space: nowrap;
  margin-bottom: 10px;
  background-color: #239b56;
  color: rgb(255, 255, 255);
  width: 100%;
}

label {
  float: left;
  margin: 20px 0px 5px 0px;
}

.adjuntos_container {
  display: flex;
  flex-direction: column;
}
.form_controlContainer {
  width: 100%;
}
.spanContainer {
  width: 20%;
  display: flex;
  justify-content: left;
}
.option_container {
  display: flex;
  gap: 0;
  width: 100%;
}
.labelOption {
  margin: 0;
}
.right {
  justify-content: right;
}
.left {
  justify-content: left;
}
.center {
  justify-content: center;
}
.labelBlock {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.3em;
  padding-left: 0;
}
.padding-1 {
  padding: 0.5em;
}
.ver {
  background-color: #006b3f;
  color: white;
}
.fontSize-5 {
  font-size: 0.5em;
}
.gap-8 {
  gap: 6em;
}
</style>
<!-- 222 -->

<template>
  <div class="filtro-container">
    <div
      class="row mt-4"
      v-for="(filtroDinamico, index) in filtrosDinamicos"
      :key="index"
    >
      <!-- Campo -->
      <div class="col-3">
        <label for="campo" class="form-label" style="float: left">Campo</label>
        <select
          class="form-select form-select-sm"
          name="campo"
          id="campo"
          v-model="filtroDinamico.dato_seleccionado"
          @change="actualizarComparaciones"
        >
          <option value="">Por favor seleccione un campo</option>
          <option
            v-for="(filtro, index) in filtros"
            :value="filtro.value"
            :key="index"
          >
            {{ filtro.label }}
          </option>
        </select>
        <div class="row mt-5" v-if="index == filtrosDinamicos.length - 1">
          <div class="col">
            <button type="button" class="btn btn-success btn-sm">
              Realizar búsqueda
            </button>
          </div>
        </div>
      </div>

      <!-- Comparación -->
      <div class="col-3">
        <label for="opciones" class="form-label" style="float: left"
          >Comparación</label
        >
        <select
          name="opciones"
          id="opciones"
          v-model="filtroDinamico.comparacion_seleccionada"
          class="form-select form-select-sm"
        >
          <option value="">Seleccione una comparación</option>
          <option
            v-for="(opcion, index) in comparaciones"
            :value="opcion"
            :key="index"
          >
            {{ opcion }}
          </option>
        </select>
        <div class="row mt-5" v-if="index == filtrosDinamicos.length - 1">
          <div class="col">
            <button type="button" class="btn btn-success btn-sm">
              Exportar excel
            </button>
          </div>
        </div>
      </div>

      <!-- Valor -->
      <div class="col-3">
        <label for="valor" class="form-label" style="float: left">Valor</label>
        <input
          :type="type"
          id="valor"
          name="valor"
          v-model="filtroDinamico.valor_ingresado"
          class="form-control form-control-sm"
        />
        <div class="row mt-5" v-if="index == filtrosDinamicos.length - 1">
          <div class="col">
            <button type="button" class="btn btn-success btn-sm">
              Borrar búsqueda
            </button>
          </div>
        </div>
      </div>
      <div class="col-3" v-if="index == filtrosDinamicos.length - 1">
        <button
          type="button"
          class="btn btn-success mt-4 btn-sm"
          @click="agregarFiltro"
        >
          <i class="bi bi-plus-circle"></i>
        </button>
        <div class="row mt-5" v-if="index > 0">
          <div class="col">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="eliminarFiltro"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FiltroBusqueda",
  props: {
    filtros: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filtrosDinamicos: [
        {
          dato_seleccionado: "",
          comparacion_seleccionada: "",
          valor_ingresado: "",
        },
      ],
      filtrosSelec: JSON.parse(JSON.stringify(this.filtros)),
      campoSeleccionado: "",
      comparaciones: [],
      comparacionSeleccionada: "",
      valorSeleccionado: "",
      type: "text",
    };
  },
  methods: {
    emitirFiltros() {
      // Emitir los filtros actualizados al componente padre
      const filtrosAplicados = this.filtrosSelec.reduce((acc, filtro) => {
        if (filtro.valor) {
          acc[filtro.campo] = filtro.valor;
        }
        return acc;
      }, {});
      this.$emit("aplicar-filtros", filtrosAplicados);
    },
    resetFiltros() {
      // Restablecer los valores de los filtros
      this.filtrosSelec = JSON.parse(JSON.stringify(this.filtrosIniciales));
      this.emitirFiltros(); // Emitir los filtros restablecidos
    },
    actualizarComparaciones(index) {
      const filtro = this.filtros.find(
        (filtro) => filtro.value === this.campoSeleccionado
      );
      this.comparaciones = filtro ? filtro.opciones : [];
      this.filtrosDinamicos[index].comparacion_seleccionada = ""; // Reiniciar la comparación al cambiar el campo
      this.type = filtro ? filtro.type : "text";
    },
    agregarFiltro() {
      this.filtrosDinamicos.push({
        dato_seleccionado: "",
        comparacion_seleccionada: "",
        valor_ingresado: "",
      });
    },
    eliminarFiltro(index) {
      this.filtrosDinamicos.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.filtro-container {
  padding: 2em;
  background-color: #ffffff;
  margin-top: 1.5em;

  margin-bottom: 20px;
  clear: both;
  padding: 30px;
  border: solid #d5dbdb 0.5px;
  border-radius: 10px;
}

.reset-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reset-btn:hover {
  background-color: #0056b3;
}
</style>

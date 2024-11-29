<template>
  <div class="filtro-container">
    <div
      class="row mt-4"
      v-for="(filtroDinamico, index) in filtrosDinamicos"
      :key="index"
    >
      <!-- Campo -->
      <div class="col-2">
        <label for="campo" class="form-label" style="float: left">Campo</label>
        <select
          class="form-select form-select-sm"
          name="campo"
          id="campo"
          v-model="filtroDinamico.dato_seleccionado"
          @change="actualizarComparaciones(index)"
        >
          <option value="">Seleccione un campo</option>
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
            <button
              type="button"
              class="btn btn-success btn-sm"
              @click="enviarFiltros"
            >
              Realizar búsqueda
            </button>
          </div>
        </div>
      </div>

      <!-- Comparación -->
      <div class="col-2">
        <label for="opciones" class="form-label" style="float: left"
          >Comparación</label
        >
        <select
          name="opciones"
          id="opciones"
          v-model="filtroDinamico.comparacion_seleccionada"
          class="form-select form-select-sm"
        >
          <option value="">Seleccione una opción</option>
          <option
            v-for="(opcion, index) in filtroDinamico.comparaciones"
            :value="opcion"
            :key="index"
          >
            {{ opcion }}
          </option>
        </select>
        <div class="row mt-5" v-if="index == filtrosDinamicos.length - 1">
          <div class="col">
            <button
              type="button"
              class="btn btn-success btn-sm"
              @click="exportarExcel"
            >
              Exportar excel
            </button>
          </div>
        </div>
      </div>

      <!-- Valor -->
      <div class="col-3">
        <label for="valor" class="form-label" style="float: left">Valor</label>
        <input
          v-if="
            filtroDinamico.comparacion_seleccionada != 'Entre' &&
            filtroDinamico.type != 'select'
          "
          :type="filtroDinamico.type"
          id="valor"
          name="valor"
          v-model="filtroDinamico.valor_ingresado"
          class="form-control form-control-sm"
        />
        <select
          v-else-if="filtroDinamico.type == 'select'"
          :type="filtroDinamico.type"
          id="valor"
          name="valor"
          v-model="filtroDinamico.valor_ingresado"
          class="form-control form-control-sm"
        >
          <option
            v-for="(opcion, index) in filtroDinamico.opciones_select"
            :key="index"
            :value="opcion"
          >
            {{ opcion }}
          </option>
        </select>
        <input
          v-else
          :type="filtroDinamico.type"
          id="valor"
          name="valor"
          v-model="filtroDinamico.valor_ingresado[0]"
          class="form-control form-control-sm"
        />
        <div class="row mt-5" v-if="index == filtrosDinamicos.length - 1">
          <div class="col">
            <button
              type="button"
              class="btn btn-success btn-sm"
              @click="eliminarBusqueda"
            >
              Borrar búsqueda
            </button>
          </div>
        </div>
      </div>
      <div
        class="col-3"
        v-if="filtroDinamico.comparacion_seleccionada == 'Entre'"
      >
        <label for="valor" class="form-label" style="float: left">Valor</label>
        <input
          v-if="filtroDinamico.comparacion_seleccionada != 'Entre'"
          :type="filtroDinamico.type"
          id="valor"
          name="valor"
          v-model="filtroDinamico.valor_ingresado"
          class="form-control form-control-sm"
        />
        <input
          v-else
          :type="filtroDinamico.type"
          id="valor"
          name="valor"
          v-model="filtroDinamico.valor_ingresado[1]"
          class="form-control form-control-sm"
        />
      </div>
      <div class="col-1" v-if="index == filtrosDinamicos.length - 1">
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
          valor_ingresado: "" || [],
          comparaciones: [],
          type: "text",
          opciones_select: [],
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
    eliminarBusqueda() {
      this.$emit("borrarBusqueda");
    },
    resetFiltros() {
      // Restablecer los valores de los filtros
      this.filtrosSelec = JSON.parse(JSON.stringify(this.filtrosIniciales));
    },
    actualizarComparaciones(index) {
      const filtroSeleccionado = this.filtros.find(
        (filtro) =>
          filtro.value === this.filtrosDinamicos[index].dato_seleccionado
      );

      if (filtroSeleccionado) {
        // Asigna las comparaciones y el tipo del filtro seleccionado
        this.$set(
          this.filtrosDinamicos[index],
          "comparaciones",
          filtroSeleccionado.opciones || []
        );
        this.$set(
          this.filtrosDinamicos[index],
          "opciones_select",
          filtroSeleccionado.opciones_select || []
        );
        this.$set(
          this.filtrosDinamicos[index],
          "type",
          filtroSeleccionado.type || "text"
        );
      } else {
        // Restablece comparaciones y tipo si no se encuentra un filtro válido
        this.$set(this.filtrosDinamicos[index], "comparaciones", []);
        this.$set(this.filtrosDinamicos[index], "type", "text");
      }

      // Reinicia el valor de la comparación seleccionada
      this.filtrosDinamicos[index].comparacion_seleccionada = "";
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
    enviarFiltros() {
      const filtrosFormated = this.filtrosDinamicos.map((filtro) => {
        filtro = {
          campo: filtro.dato_seleccionado,
          comparacion: filtro.comparacion_seleccionada,
          valor: filtro.valor_ingresado,
        };
        return filtro;
      });
      this.$emit("enviarFiltros", filtrosFormated);
    },
    exportarExcel() {
      const filtrosFormated = this.filtrosDinamicos.map((filtro) => {
        filtro = {
          campo: filtro.dato_seleccionado,
          comparacion: filtro.comparacion_seleccionada,
          valor: filtro.valor_ingresado,
        };
        return filtro;
      });
      this.$emit("descargarExcel", filtrosFormated);
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

<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th v-for="(columna, index) in columnas" :key="index">
            {{ columna }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(dato, index) in datos"
          :key="index"
          :class="{ 'bg-light-gray': index % 2 === 1 }"
        >
          <td>
            {{ index + 1 }}
          </td>
          <td
            v-for="(valor, key) in dato"
            :key="key"
            :class="{ 'text-danger': key === 'oportuno' && valor === 'No' }"
          >
            {{ valor }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TablaHistoricoEstados",
  props: {
    datos: {
      type: Array,
      required: true,
    },
    columnas: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  max-width: 100%;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.table th {
  background-color: #cbcbcb;
  font-weight: bold;
}
.text-danger {
  color: red;
  font-weight: bold;
}
.bg-light-gray {
  background-color: #f9f9f9;
}
</style>

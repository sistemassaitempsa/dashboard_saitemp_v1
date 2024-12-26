<template>
  <div class="pagination-container">
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <!-- Botón para ir a la página anterior -->
        <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
          <a
            class="page-link"
            href="#"
            @click.prevent="irAtras(pagination.prev_page_url)"
          >
            Anterior
          </a>
        </li>

        <!-- Botones para cada número de página -->
        <li
          v-for="(page, index) in pagination.links"
          :key="index"
          class="page-item"
          :class="{ active: page.active }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="irPaginaexpecifica(page.url, page.label)"
          >
            {{ page.label }}
          </a>
        </li>

        <!-- Botón para ir a la página siguiente -->
        <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
          <a
            class="page-link"
            href="#"
            @click.prevent="irSiguiente(pagination.next_page_url)"
          >
            Siguiente
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "TablaPaginador",
  props: {
    pagination: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      pagina: "1",
    };
  },
  methods: {
    irPaginaexpecifica(url, label) {
      this.pagina = label;
      this.$emit("navigate", url, label); // Envía URL y etiqueta de página
    },
    irSiguiente(url) {
      this.pagina += 1;
      this.$emit("navigate", url, this.pagina); // Envía URL y nueva página
    },
    irAtras(url) {
      this.pagina -= 1;
      this.$emit("navigate", url, this.pagina); // Envía URL y nueva página
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: left;
  margin: 20px 0;
}

.pagination {
  list-style: none;
  display: flex;
  gap: 3px;
  padding: 0;
}

.page-item {
  display: inline-block;
}

.page-item .page-link {
  color: #ffffff;
  background-color: rgb(33, 97, 140);
  text-decoration: none;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  cursor: pointer;
}

.page-item .page-link:hover {
  background-color: #f1f1f1;
  color: rgb(33, 97, 140);
}

.page-item.disabled .page-link {
  pointer-events: none;
  color: #ccc;
  background-color: #ffffff;
}

.page-item.active .page-link {
  background-color: rgb(208, 101, 25);
  color: white;
}
</style>

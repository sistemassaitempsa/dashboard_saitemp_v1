<!-- <template>
   <div>
     <div class="header">
        <div class="titulo"></div>

     </div>
   </div>
</template>
<script>
export default {
   name: '',
   components: {
     
   },
   mixins: [],
   props: {
     
   },
   data() {
     return {
       
     }
   },
   computed: {
     
   },
   watch: {
     
   },
   mounted() {
     
   },
   methods: {
     
   }
};
</script>
<style lang='' scoped>
</style> -->
<template>
  <div class="container">
    <div class="form-container">
      <h2>Campos Arrastrables</h2>
      <div v-for="(item, index) in formItems" :key="index" class="form-item" draggable="true"
        @dragstart="dragStart(index)" style="width: 20%;">
        Campo tipo {{ item.label }}
        <!-- <button @click="removeItem(index)" type="button" class="btn btn-success btn-sm">Eliminar</button> -->
      </div>
    </div>

    <div class="column" @dragover.prevent @drop="dropLeft">
      <h2>Arrastrar campo aquí</h2>
      <div v-for="(field, index) in formFields" :key="index" class="form-field" draggable="true"
        @dragstart="dragStartField(index)">
        <label @click="editLabel(field, index)" :class="{ disabled: field.disabled }">{{ field.customLabel }}</label>
        <input v-if="field.editing && field.type !== 'select'" v-model="field.customLabel" @blur="field.editing = false"
          @keydown.enter.prevent="field.editing = false" required>
        <input
          v-else-if="field.type === 'text' || field.type === 'number' || field.type === 'email' || field.type === 'date' || field.type === 'datetime-local'"
          :type="field.type" :name="field.name" :placeholder="field.placeholder" :required="field.required"
          :disabled="field.disabled" readonly @click="enableEditing(field)">
        <select v-else :name="field.name" :required="field.required" :disabled="field.disabled"
          @focus="field.editing = true">
          <option v-for="(option, optionIndex) in field.options" :key="optionIndex">{{ option }}</option>
        </select>
        <input type="checkbox" v-model="field.required"> Obligatorio
        <input type="checkbox" v-model="field.disabled"> Deshabilitado
        <button @click="removeField(index)">Eliminar</button>
      </div>
    </div>

    <div class="column" @dragover.prevent @drop="dropRight">
      <h2>Arrastrar campo aquí</h2>
      <div v-for="(field, index) in formFieldsRight" :key="index" class="form-field" draggable="true"
        @dragstart="dragStartFieldRight(index)">
        <label @click="editLabel(field, index)" :class="{ disabled: field.disabled }">{{ field.customLabel }}</label>
        <input v-if="field.editing && field.type !== 'select'" v-model="field.customLabel" @blur="field.editing = false"
          @keydown.enter.prevent="field.editing = false" required>
        <input
          v-else-if="field.type === 'text' || field.type === 'number' || field.type === 'email' || field.type === 'date' || field.type === 'datetime-local'"
          :type="field.type" :name="field.name" :placeholder="field.placeholder" :required="field.required"
          :disabled="field.disabled" readonly @click="enableEditing(field)">
        <select v-else :name="field.name" :required="field.required" :disabled="field.disabled"
          @focus="field.editing = true">
          <option v-for="(option, optionIndex) in field.options" :key="optionIndex">{{ option }}</option>
        </select>
        <input type="checkbox" v-model="field.required"> Obligatorio
        <input type="checkbox" v-model="field.disabled"> Deshabilitado
        <button @click="removeFieldRight(index)">Eliminar</button>
      </div>
    </div>

    <form class="was-validated" @submit.prevent="save()">
      <!-- <h6 class="tituloseccion">Información general</h6> -->
      <div id="seccion">
        <div class="row" v-for="item,index in formFields" :key="index">
          <div class="col-6 mb-6">
            <label for="exampleInputEmail1" style="float:left" class="form-label">{{ item.customLabel }}</label>
            <input type="text" class="form-control form-control-sm" autocomplete="off" id="exampleInputEmail2"
              aria-describedby="emailHelp" v-model="valores1[index]" :required="item.required" :disabled="item.disabled"/>
          </div>
        </div>
        <div class="row" v-for="item, index in formFieldsRight" :key="index">
          <div class="col-6 mb-6">
            <label for="exampleInputEmail1" style="float:left" class="form-label">{{ item.customLabel }}</label>
            <input type="text" class="form-control form-control-sm" autocomplete="off" id="exampleInputEmail2"
              aria-describedby="emailHelp" v-model="valores2[index]" :required="item.required" :disabled="item.disabled"/>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formItems: [
        { label: 'Texto', type: 'text', name: 'text', placeholder: 'Ingrese texto' },
        { label: 'Número', type: 'number', name: 'number', placeholder: 'Ingrese número' },
        { label: 'Email', type: 'email', name: 'email', placeholder: 'Ingrese email' },
        { label: 'Fecha', type: 'date', name: 'date', placeholder: 'Seleccione fecha' },
        { label: 'Fecha y Hora', type: 'datetime-local', name: 'datetime', placeholder: 'Seleccione fecha y hora' },
        { label: 'Lista', type: 'select', name: 'select', options: ['Opción 1', 'Opción 2', 'Opción 3'] }
      ],
      formFields: [],
      formFieldsRight: [],
      columna1: [],
      columna2: [],
      valores1:[],
      valores2:[],
      editcolumna1:false,
      editcolumna2:false
    };
  },
  watch: {
  formFields(newFields) {
    this.columna1 = newFields;
    console.log(newFields)
  },
  formFieldsRight(newFieldsRight) {
    this.columna2 = newFieldsRight;
    console.log(newFieldsRight)
  }
},
  methods: {
    dragStart(index) {
      this.draggedItem = this.formItems[index];
    },
    dragStartField(index) {
      this.draggedField = { ...this.formFields[index] };
    },
    dragStartFieldRight(index) {
      this.draggedField = { ...this.formFieldsRight[index] };
    },
    dropLeft() {
      if (this.draggedItem) {
        this.formFields.push({ ...this.draggedItem, customLabel: this.draggedItem.label, editing: false, required: false, disabled: false });
        this.draggedItem = null;
      }
      if (this.draggedField) {
        this.formFields.push(this.draggedField);
        this.draggedField = null;
      }
    },
    dropRight(event) {
      event.preventDefault();
      if (this.draggedItem) {
        this.formFieldsRight.push({ ...this.draggedItem, customLabel: this.draggedItem.label, editing: false, required: false, disabled: false });
        this.draggedItem = null;
      }
      if (this.draggedField) {
        this.formFieldsRight.push(this.draggedField);
        this.draggedField = null;
      }
    },
    removeItem(index) {
      this.formItems.splice(index, 1);
    },
    removeField(index) {
      this.formFields.splice(index, 1);
    },
    removeFieldRight(index) {
      this.formFieldsRight.splice(index, 1);
    },
    editLabel(field, index) {
      // Deshabilitar edición si el campo está deshabilitado
      if (!field.disabled) {
        // Habilitar edición del label y deshabilitar edición en otros campos
        this.formFields.forEach((item, i) => {
          if (i !== index) {
            item.editing = false;
          }
        });
        this.formFieldsRight.forEach((item, i) => {
          if (i !== index) {
            item.editing = false;
          }
        });
        field.editing = true;
      }
    },
    enableEditing(field) {
      // Habilitar edición del label al hacer clic en el campo de tipo texto o lista
      if ((field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' || field.type === 'datetime-local' || field.type === 'select') && !field.disabled) {
        field.editing = true;
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  margin-bottom: 20px;
}

.form-item {
  padding: 10px;
  margin: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.form-field {
  padding: 10px;
  margin: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.column {
  width: 50%;
  float: left;
  padding: 20px;
}

.column h2 {
  margin-bottom: 10px;
}

.disabled {
  color: #999;
}
</style>
// Mixin para mostrar mensajes de alerta como exito o error en una acción
export const Alerts = {
  data() {
    return {};
  },
  methods: {
    showAlert(mensaje, icono) {
      this.$swal({
        position: "top",
        icon: icono,
        title: mensaje,
        showConfirmButton: false,
        timer: icono == "error" ? 3000 : 1500,
      });
    },
    showAlertConfirm(mensaje, icono) {
      this.$swal({
        position: "top",
        icon: icono,
        title: mensaje,
        showConfirmButton: true,
      });
    },
    messageDelete(titulo = null, funcion, id) {
      var title =
        titulo == null ? "Estas seguro de elimiar el resgistro?" : titulo;
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
            funcion(id);
          }
        });
    },
    showAlertmasBoton(mensaje, icono) {
      this.$swal({
        icon: icono,
        title: mensaje,
      });
    },
  },
  computed: {},
  created() {},
}; // MiMixin.js

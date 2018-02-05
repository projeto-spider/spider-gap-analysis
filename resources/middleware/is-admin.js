export default function ({ store, error }) {
  if (!store.getters.isAdmin) {
    error({
      message: 'Você não é administrador',
      statusCode: 403
    })
  }
}

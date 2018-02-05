export default function ({ store, error }) {
  if (!store.getters.isAdmin && !store.getters.isReviewer) {
    error({
      message: 'Você não é revisor',
      statusCode: 403
    })
  }
}

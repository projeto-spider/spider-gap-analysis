export default function ({ store, error, redirect }) {
  if (!store.getters.isLoggedIn) {
    redirect('/')
  }
}

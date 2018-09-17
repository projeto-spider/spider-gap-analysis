export default function ({ $axios, redirect }) {
  const token = localStorage.getItem('app/TOKEN')

  if (token) {
    $axios.setToken(token, 'Bearer')
  }
}

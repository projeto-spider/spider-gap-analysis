import Vue from 'vue'
import Buefy from 'buefy'

Vue.use(Buefy, {
  defaultIconPack: 'fa',

  defaultDayNames: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],

  defaultMonthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],

  defaultDateFormatter(date){
    const d = date.getDate()
    const m = date.getMonth() + 1
    const yyyy = date.getFullYear();

    return twoDigits(d) + '/' + twoDigits(m) + '/' + yyyy
  }
})

function twoDigits(n) {
  return n < 10 ? `0${n}` : n
}

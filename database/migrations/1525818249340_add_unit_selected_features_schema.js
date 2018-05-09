'use strict'

const Schema = use('Schema')

const defaultSelectedFeatures = JSON.stringify({
  G: { processes: [], attributes: [] },
  F: { processes: [], attributes: [] },
  E: { processes: [], attributes: [] },
  D: { processes: [], attributes: [] },
  C: { processes: [], attributes: [] },
  B: { processes: [], attributes: [] },
  A: { processes: [], attributes: [] }
})

class AddUnitSelectedFeaturesSchema extends Schema {
  up () {
    this.table('units', (table) => {
      table.text('selectedFeatures')
        .defaultTo(defaultSelectedFeatures)
        .notNullable()
    })
  }

  down () {
    this.table('units', (table) => {
      table.dropColumn('selectedFeatures')
    })
  }
}

module.exports = AddUnitSelectedFeaturesSchema

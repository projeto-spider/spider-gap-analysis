import levels from '~/static/levels.json'
import processes from '~/static/process.json'
import expectedResults from '~/static/expected-results.json'
import processAttributes from '~/static/process-attributes.json'

const processesList = Object.values(processes)

export const processesByLevel =
  processesList
    .reduce((acc, process) => {
      if (!acc[process.level]) acc[process.level] = []
      acc[process.level].push(process.id)
      return acc
    }, {})

export const expectedResultsByProcess =
  Object.values(expectedResults)
    .reduce((acc, result) => {
      if (!acc[result.process]) acc[result.process] = []
      acc[result.process].push(result)
      return acc
    }, {})

export const processAttributesByLevel =
  Object.values(levels)
    .reduce((acc, level) => {
      acc[level.id] = level.attributes.map(attrId => processAttributes[attrId])
      return acc
    }, {})

export function mapProcessesIdsToProcesses (ids, isLevelA) {
  const valid = new Set(ids)

  if (isLevelA) {
    // Ensure level A is there because you can't select it on
    // Unit page
    valid.add('Nível A')
  }

  return processesList
    .filter(({id}) => valid.has(id))
}

export function getUnitProcesses (unit) {
  return mapProcessesIdsToProcesses(unit.selectedProcesses, unit.levelId === 'A')
}

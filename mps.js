import processes from '~/static/process.json'
import expectedResults from '~/static/expected-results.json'

export const processesByLevel =
  Object.values(processes)
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

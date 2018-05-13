import processes from '~/static/process.json'

export const processesByLevel =
  Object.values(processes)
    .reduce((acc, process) => {
      if (!acc[process.level]) acc[process.level] = []
      acc[process.level].push(process.id)
      return acc
    }, {})

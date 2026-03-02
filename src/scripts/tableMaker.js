import fs from 'fs'

// Read the input JSON file
fs.readFile('chaos.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err)
    return
  }

  // Parse the JSON data
  const inputData = data.split('\n')

  // Transform the data
  const outputData = {}
  let i = 0
  inputData.forEach((item) => {
    if (item) {
      outputData[i] = { result: item }
    }
    i++
  })

  // Write the transformed data to the output JSON file
  fs.writeFile('RollingTableDone.json', JSON.stringify(outputData, null, 4), (err) => {
    if (err) {
      console.error('Error writing the file:', err)
      return
    }
    console.log('Transformation complete! The output has been saved to output.json.')
  })
})

import fs from 'fs'

// Read the input JSON file
fs.readFile('Dnace.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err)
    return
  }

  // Parse the JSON data
  const inputData = JSON.parse(data)

  // Transform the data
  const outputData = {}
  inputData.forEach((item) => {
    const key = item.name
    if (key) {
      outputData[key] = item
    }
  })

  // Write the transformed data to the output JSON file
  fs.writeFile('DanceObject.json', JSON.stringify(outputData, null, 4), (err) => {
    if (err) {
      console.error('Error writing the file:', err)
      return
    }
    console.log('Transformation complete! The output has been saved to output.json.')
  })
})

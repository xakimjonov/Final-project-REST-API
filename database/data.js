const fs = require('fs')

function readData() {
  try {
    let data = fs.readFileSync('./database/data.json')
    let dataObj = JSON.parse(data)
    return dataObj
  } catch (err) {
    console.error(err)
  }
  console.log('readData')
}
function writeData(data) {
  try {
    let text = JSON.stringify(data, null, '\t')
    fs.writeFileSync('./database/data.json', text)
  } catch (err) {
    console.error(err)
  }
  console.log('writeData')
}
module.exports = { readData, writeData }

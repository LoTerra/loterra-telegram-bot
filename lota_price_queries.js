const axios = require('axios')
const numeral = require('numeral');

// const url = `https://tequila-lcd.terra.dev/wasm/contracts/terra1wxe503thjmapngtnyqarxrc4jy80vf800vf0cy/store?query_msg={%22pairs%22:{}}`

const pool_address = `terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta`;

const getLotaPrice = async () => {
  const pool = await axios.get("https://lcd.terra.dev/wasm/contracts/terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta/store?query_msg=%20%20%7B%20%20%20%22pool%22%3A%20%7B%7D%20%7D")
  
  let lotaAmount = pool.data.result.assets[0].amount
  let ustAmount = pool.data.result.assets[1].amount
  
  let price = parseInt(ustAmount) / parseInt(lotaAmount)
  return price
}

module.exports = { getLotaPrice };
const axios = require('axios')
const numeral = require('numeral');

// const url = `https://tequila-lcd.terra.dev/wasm/contracts/terra1wxe503thjmapngtnyqarxrc4jy80vf800vf0cy/store?query_msg={%22pairs%22:{}}`

const getLotaPrice = async () => {
   const prices = await axios.get("https://alpac4.com/LOTA-UST_day.json")
   const today = prices.data.data[0][0]
   const last_price = prices.data.data[0][1]
   console.log(last_price)
   return last_price 
}

module.exports = { getLotaPrice };
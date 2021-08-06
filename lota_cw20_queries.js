const axios = require('axios')
const numeral = require('numeral');

const lottery_contract_address = `terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr`;

const url = `https://lcd.terra.dev/wasm/contracts/${lottery_contract_address}/store?query_msg=`;

const getCirculatingSupply = async () => {
  const res = await axios.get(`${url}%7B%20%20%09%22balance%22%3A%20%7B%20%20%09%09%22address%22%3A%20%22terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0%22%20%09%20%7D%20%20%7D`)
  
  let totalSupply = 1939548764705
  
  let circulatingSupply = (totalSupply - parseInt(res.data.result.balance)) / 1000000
  
  return circulatingSupply
};

module.exports = { getCirculatingSupply };
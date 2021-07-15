const axios = require('axios')
const numeral = require('numeral');


const staking_contract_address = `terra1342fp86c3z3q0lksq92lncjxpkfl9hujwh6xfn`;
const url = `https://lcd.terra.dev/wasm/contracts/${staking_contract_address}/store?query_msg=`;

const getStakingBalance = async () => {
  try {
    let res = await axios.get(`${url}%7B%20%20%20%20%20%22state%22%3A%20%7B%7D%20%7D`);
    console.log(res.data.result.total_balance / 1000000);
    let balance = parseInt(res.data.result.total_balance) / 1000000;
    return numeral(balance).format('0,0.00');
  } catch (e) {
    console.log(e);
  }
};
// https://lcd.terra.dev/wasm/contracts/terra1342fp86c3z3q0lksq92lncjxpkfl9hujwh6xfn/store?query_msg=%7B%20%20%20%20%20%22holder%22%3A%20%7B%20%20%20%20%20%20%20%20%20%22address%22%3A%20%22terra1fahxalax0yl5xvasrn45c57ktxn9rx8k98nu0a%22%20%20%20%20%20%7D%20%7D

function getHolder(address) {
  const getHolder = async () => {
    let res = await axios.get(`${url}%7B%20%20%20%20%20%22holder%22%3A%20%7B%20%20%20%20%20%20%20%20%20%22address%22%3A%20%22${address}%22%20%20%20%20%20%7D%20%7D`);
    return res.data.result.balance
  }
}

module.exports = { getStakingBalance, getHolder };


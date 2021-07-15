const axios = require('axios')
const numeral = require('numeral');

// Use swagger to query the contract 
// https://lcd.terra.dev/swagger-ui/#/Wasm/get_wasm_contracts__contractAddress__store
const lottery_contract_address = `terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0`;

const url = `https://lcd.terra.dev/wasm/contracts/${lottery_contract_address}/store?query_msg=`;
const getState = async () => {
  try {
    // RETURNED OBJECT FROM QUERY
    /*
    {
      "height": "3733973",
      "result": {
        "admin": "XfzhTkKcyYtVTI5JvuscsBg1rgA=",
        "block_time_play": 1626299323,
        "every_block_time_play": 302400,
        "denom_stable": "uusd",
        "combination_len": 6,
        "jackpot_percentage_reward": 30,
        "token_holder_percentage_fee_reward": 20,
        "fee_for_drand_worker_in_percentage": 1,
        "prize_rank_winner_percentage": [
          0,
          97,
          2,
          1
        ],
        "poll_count": 15,
        "poll_default_end_height": 90000,
        "price_per_ticket_to_register": "1000000",
        "terrand_contract_address": "9eCV8x2Bk0/knTV9yez1uCbBvJc=",
        "loterra_cw20_contract_address": "yKurGXz8Gsf6kTpvQfaGkf+j74c=",
        "loterra_staking_contract_address": "jVSQn1iIogf+0AFV+eJGDZPy35I=",
        "safe_lock": false,
        "lottery_counter": 17,
        "holders_bonus_block_time_end": 1624976715
      }
    }
    */
    let res = await axios.get(`${url}%7B%22config%22%3A%7B%7D%7D`);
    return res.data.result;
  } catch (e) {
    console.log(e);
  }
};

// Get balance
const getBalance = async () => {
  try{
    let {jackpot_percentage_reward} = await getState();
    let res = await axios.get(`https://lcd.terra.dev/bank/balances/${lottery_contract_address}`);
    // Check is the array contain "uusd" and only display uusd 
    const filter = res.data.result.filter(balance => balance.denom == "uusd")
    return (parseInt(filter[0].amount) * jackpot_percentage_reward / 100) / 1000000;
  }catch (e){
    console.log(e)
  }
}

const getCountTicket = async () => {
  try{
    let {lottery_counter} = await getState();
    let res = await axios.get(`${url}%7B%22count_ticket%22%3A%7B%22lottery_id%22%3A%20${lottery_counter}%7D%7D`);
    return res.data.result;
  }catch (e){
    console.log(e)
  }
}

const getCountPlayer = async () => {
  try{
    let {lottery_counter} = await getState();
    let res = await axios.get(`${url}%7B%22count_player%22%3A%7B%22lottery_id%22%3A%20${lottery_counter}%7D%7D`);
    return res.data.result;
  }catch (e){
    console.log(e)
  }
}

module.exports = { getState, getBalance, getCountTicket, getCountPlayer };

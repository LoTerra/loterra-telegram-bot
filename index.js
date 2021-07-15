// How to use numeral? http://numeraljs.com/
const numeral = require('numeral');
const { Telegraf } = require('telegraf');
const { getState, getBalance, getCountTicket, getCountPlayer } = require('./lottery_queries');
const { getStakingBalance, getHolder } = require('./staking_queries');
const { getLotaPrice } = require('./lota_price_queries');

// Init bot 
const bot = new Telegraf(process.env.BOT_TOKEN);

// Basic message

// TODO - ADD:  
//             - 👨‍👩‍👧‍👦 DAO: /currentproposals - Get all current proposals
//             - /stakinginfo - Get your staking info
const welcomeMessage = `Welcome!👋 I am LoTerra Bot your personal assistant.

Here you can get some info about LoTerra ecosystem. Click and let yourself be guided!

🎰 *LoTerra Lottery Info:*
/currentlotteryinfo - Get Current lottery info
/lotteryinfobyid - Get lottery info by ID
/prizerankpercentage - Get prize rank percentage
/probabilities - Get probabilities for a single ticket

🔐 Staking:
/stakingbalance - Get total staked

🪙 LOTA:
/lotacurrentprice - Get LOTA current price
/tokenomics - Get Tokenomics

🧐 Help:
/help
  
Website:
  🔗 Website: https://loterra.io
  📑 Doc: https://docs.loterra.io
  💾 Source code: https://github.com/LoTerra

Social Network:
  🐦 Twitter: https://twitter.com/LoTerra_LOTA
  💬 Telegram: https://t.me/LoTerra`;

const helpMessage = `*If you need help, you can contact:* 
- @YundoRocket 🚀
- @codeSnake 🐍
`;

const getProbabilities = `*Probabilities:*
Rank#1 (6 hits): 1 / 16^6 = 0.0000059%
Rank#2 (5 hits): 96 / 16^6 = 0.00057%
Rank#3 (4 hits): 3840 / 16^6 = 0.023%
Rank#4 (3 hits): 81920 / 16^6 = 0.49%
`;

const getTokenomics = `*🪙 Tokenomics:*

*Info:*
Token type - *CW20*
Name - *loterra*
Symbol - *LOTA*
Decimals - *6*
Role - *utility*
Blockchain - *Terra*

*Supply:*
Circulating supply - 894,548.764705 $LOTA
Total supply - 1,939,548.764705 $LOTA

*Supply distribution:*
Community - 603,616.45 $LOTA - 31,12％
Team - 290,932.314705 $LOTA - 15％
DAO - 1,045,000 $LOTA - 53.88％
`;

// Basic commands
bot.start((ctx) => ctx.reply(welcomeMessage));
bot.help((ctx) => ctx.reply(helpMessage, {parse_mode: "Markdown"}));


function roundDown(num){
  const full = num.toString()
  const reg = /([\d]+)/i
  const res = reg.exec(full)
  return res[1]
}
// Helper
function remainingTime(timeLeftDraw) {
      const days = roundDown(timeLeftDraw / 86400000)
      console.log(days)
      const hours = roundDown((timeLeftDraw % 86400000) / 3600000)
      console.log(hours)
      const min = roundDown(((timeLeftDraw % 86400000) % 3600000) / 60000)
      console.log(min)
      const sec = roundDown((((timeLeftDraw % 86400000) % 3600000) % 60000) / 1000)
      console.log(sec)
      const dayFormat = days < 10 ? '0' + days : days
      const hourFormat = hours < 10 ? '0' + hours : hours
      const minFormat = min < 10 ? '0' + min : min
      const secFormat = sec < 10 ? '0' + sec : sec
    
      if (days < 0 && hours < 0 && min < 0 &&  sec < 0) {
            return "Lottery closed"
          }
      const isDays = dayFormat > 0 ? dayFormat + "D : " : ''
      const isHour = hourFormat > 0 ? hourFormat + "H : " : ''
      const isMin =  minFormat > 0 ? minFormat + "M : " : ''
      const isSec =  secFormat > 0 ? secFormat + "S : " : ''
      return isDays + ' ' + isHour + ' ' + isMin + ' ' + isSec
};

// Listen commands
bot.hears('/currentlotteryinfo', async (ctx) => {
  try {
    const { admin,
           block_time_play,
           lottery_counter, 
           token_holder_percentage_fee_reward, 
           price_per_ticket_to_register, 
           jackpot_percentage_reward, 
           prize_rank_winner_percentage}
    = await getState()
    const jackpot = await getBalance()
    const count_ticket = await getCountTicket()
    const count_players = await getCountPlayer()
    const ticketPrice = (price_per_ticket_to_register / 1000000)
    const grossPrizesRank1 = ((jackpot * prize_rank_winner_percentage[0]) / 100)
    const grossPrizesRank2 = ((jackpot * prize_rank_winner_percentage[1]) / 100)
    const grossPrizesRank3 = ((jackpot * prize_rank_winner_percentage[2]) / 100)
    const grossPrizesRank4 = ((jackpot * prize_rank_winner_percentage[3]) / 100)
    const timeLeft = new Date(block_time_play * 1000) - Date.now()
    
    const currentLotteryInfo = `*🎰Current Lottery:*
  
Next draw in ${remainingTime(timeLeft)} ⏳

🆔 ${lottery_counter} 
💰 Jackpot ${numeral(jackpot).format('0,0.00')} $UST
🏷 Price per ticker ${ticketPrice} $UST
🎫 ${count_ticket} ticket sold
🙋‍♂️ ${count_players} players

Win the jackpot with 5 of 6 symbols 👻

💰 Gross prizes
Rank 1 - ${numeral(grossPrizesRank1).format('0,0.00')} $UST
Rank 2 - ${numeral(grossPrizesRank2).format('0,0.00')} $UST
Rank 3 - ${numeral(grossPrizesRank3).format('0,0.00')} $UST
Rank 4 - ${numeral(grossPrizesRank4).format('0,0.00')} $UST

💰 Net prizes 
Rank 1 - ${numeral(grossPrizesRank1 - ((grossPrizesRank1 * token_holder_percentage_fee_reward) / 100)).format('0,0.00')} $UST
Rank 2 - ${numeral(grossPrizesRank2 - ((grossPrizesRank2 * token_holder_percentage_fee_reward) / 100)).format('0,0.00')} $UST
Rank 3 - ${numeral(grossPrizesRank3 - ((grossPrizesRank3 * token_holder_percentage_fee_reward) / 100)).format('0,0.00')} $UST
Rank 4 - ${numeral(grossPrizesRank4 - ((grossPrizesRank4 * token_holder_percentage_fee_reward) / 100)).format('0,0.00')} $UST

👨‍👩‍👧‍👦 ${token_holder_percentage_fee_reward}％ Stakers commission
Rank 1 - ${numeral((grossPrizesRank1 * token_holder_percentage_fee_reward) / 100).format('0,0.00')} $UST
Rank 2 - ${numeral((grossPrizesRank2 * token_holder_percentage_fee_reward) / 100).format('0,0.00')} $UST
Rank 3 - ${numeral((grossPrizesRank3 * token_holder_percentage_fee_reward) / 100).format('0,0.00')} $UST
Rank 4 - ${numeral((grossPrizesRank4 * token_holder_percentage_fee_reward) / 100).format('0,0.00')} $UST
`;
    ctx.reply(currentLotteryInfo, { parse_mode: "Markdown" })
  } catch (e){
    console.log(e)
  }
});

bot.hears('/prizerankpercentage', async (ctx) => {
  const { prize_rank_winner_percentage } = await getState()
  const prizePerRank = `*Prize per rank#:*
Rank#1: ${prize_rank_winner_percentage[0]}％
Rank#2: ${prize_rank_winner_percentage[1]}％
Rank#3: ${prize_rank_winner_percentage[2]}％
Rank#4: ${prize_rank_winner_percentage[3]}％
`;
  ctx.reply(prizePerRank, { parse_mode: "Markdown"})
});

bot.hears('/probabilities', async (ctx) => {
  ctx.reply(getProbabilities, { parse_mode: "Markdown" })
});

bot.hears('/stakingbalance', async (ctx) => {
  const balance = await getStakingBalance()
  ctx.reply(`*Total staked:* ${balance} $LOTA`, { parse_mode: "Markdown" })
});

// TODO 
bot.hears('/stakinginfo', async (ctx) => {
  ctx.reply(getProbabilities, { parse_mode: "Markdown" })
});

bot.hears('/lotacurrentprice', async (ctx) => {
  const lotaPrice = await getLotaPrice();
  console.log(lotaPrice)
  ctx.reply(`*$LOTA price:* ${lotaPrice}$` ,{ parse_mode: "Markdown" })
});

bot.hears('/tokenomics', async (ctx) => {
  ctx.reply(getTokenomics, { parse_mode: "Markdown" })
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
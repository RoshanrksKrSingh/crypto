const axios = require('axios');
module.exports.verifyTronTransaction = async (hash) => {
  const res = await axios.get(`https://api.trongrid.io/v1/transactions/${hash}`, {
    headers: { 'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY }
  });
  return res.data;
};
const axios = require('axios');
const axiosInstance = new axios.create({
    baseURL: 'https://coinranking1.p.rapidapi.com/',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
        'x-rapidapi-key': '35bd8b1e83msh71e88378887c189p1b357ajsna90f0b0d71d4'
    }
});
module.exports = axiosInstance;

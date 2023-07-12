/// Authorize module test
import axios from 'axios';

// Config
axios.defaults.baseURL = 'http://127.0.0.1:3000';

// Task
async function task1(data) {
  try {
    let res = await axios({
      data: data,
      method: 'post',
      url: '/api/authorize'
    });

    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error(err.message);
  }
}

async function task2(token) {
  try {
    let res = await axios({
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'put',
      url: '/api/authorize'
    });

    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error(err.message);
  }
}

// Query
let token1, token2;

token1 = await task1({});
token1 = await task1({ password: '123456' });
token1 = await task1({ password: '114514' });

token1 = token1.token;
console.log(token1);

token2 = await task2('');
token2 = await task2(token1);

token2 = token2.token;
console.log(token2);

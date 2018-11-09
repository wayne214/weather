const URI = 'http://v.juhe.cn/toutiao/index';

const fetch = require('./fetch.js');

function fetchApi(type, params) {
  return fetch(URI, type, params)
}

function topNews(type) {
  const params = {
    type: type,
    key: '30c0a90f8a2475db8d589bd30e6f02f9'
  }
  return fetchApi('', params).then(res => res.data)
}

module.exports = {
  topNews
}
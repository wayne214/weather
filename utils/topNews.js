const URI = 'https://www.apiopen.top/journalismApi';

const fetch = require('./fetch.js');

function fetchApi(type, params) {
  return fetch(URI, type, params)
}

function topNews(type) {
  const params = {
  }
  return fetchApi('', params).then(res => res.data)
}

module.exports = {
  topNews
}
const URI = 'https://free-api.heweather.com/s6/weather/'
const fetch = require('./fetch')

function fetchApi(type, params) {
  return fetch(URI, type, params)
}

function nowWeather(type) {
  const params = {
    location: '北京',
    key: 'a5ab0c33df5142cb880b92efd205a9af'
  }
  return fetchApi(type, params).then(res => res.data)
}

module.exports = {
  nowWeather
}
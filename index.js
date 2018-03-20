const https = require(`https`);

module.exports = ({incoming}) => {
  const { data } = incoming;
  const cityName = data && JSON.parse(data).city ? JSON.parse(data).city : `Grand Rapids, Michigan`;

  const getWeather = () => {
    return new Promise((resolve, reject) => {
      const city = encodeURIComponent(cityName);
      const url = `https://query.yahooapis.com/v1/public/yql?q=select%20item.condition.text%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${city}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
      https.get(url, (response) => {
        let data = ``;

        response.on(`data`, (chunk) => data += chunk);
        response.on(`end`, () => resolve(JSON.parse(data)));

      }).on(`error`, reject);
    });
  };

  // Create a human readable sentence with the weather
  // -------------------------------------------------
  const createSentence = (weatherReport) => {

    return new Promise((resolve) => {
      const sentence = `Its, ${weatherReport.query.results.channel.item.condition.text} in ${cityName}`;
      return resolve(sentence);
    });
  };

  return getWeather().then(createSentence);
};
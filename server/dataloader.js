const { db } = require("./db");
const DataLoader = require('dataloader');

function makeDataLoader(query) {
  return new DataLoader(keys => {
    return db.conn
      .any(query, [keys])
      .then((data) => {
        const lookup = data.reduce((acc, val) => ({...acc, [val.id]: val}), {});
        return keys.map(id => (id in lookup) ? lookup[id] : null);
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
  });
}

module.exports = {
  makeDataLoader,
}

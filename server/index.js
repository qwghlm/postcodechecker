const express = require('express');
const app = express();

app.get('/api', function(req, res) {
  res.json({});
});

app.listen(9000);

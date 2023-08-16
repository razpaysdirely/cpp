const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.use(express.json());

let dataFromWebsite = null;

axios.get('website_url')
  .then(response => {
    dataFromWebsite = response.data;
  })
  .catch(error => {
    console.log(error);
  });

app.post('/endpoint', (req, res) => {
  if (req.body.apikey !== dataFromWebsite) {
    return res.status(403).send('Invalid API key');
  }

  const dlist = JSON.parse(fs.readFileSync('dlist.json'));
  dlist.push({ dname: req.body.dname, dinfo: req.body.dinfo });
  fs.writeFileSync('dlist.json', JSON.stringify(dlist));

  res.send('Data added successfully');
});

app.get('/endpoint', (req, res) => {
  const dlist = JSON.parse(fs.readFileSync('dlist.json'));
  const e = req.query.e ? parseInt(req.query.e) : 1;
  const dname = req.query.dname;

  if (dname) {
    const entry = dlist.find(entry => entry.dname === dname);
    return res.send(entry ? entry.dinfo : 'No entry found');
  }

  res.send(dlist.slice((e - 1) * 10, e * 10));
});

app.listen(3000, () => console.log('Server running on port 3000'));

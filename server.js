const path = require('path');
const express = require('express');
const { Client } = require('pg');
const chalk = require('chalk');
const morgan = require('morgan');
const cron = require('node-cron');
const serialize = require('serialize-javascript');

// SENSORS
async function dummySensorOne() {
  const dummyData = {
    date: '22.11.2019',
    time: '12:00',
    value: 18.5,
  };

  await new Promise(resolve => setTimeout(() => resolve(), 500));
  return dummyData
};

async function dummySensorTwo() {
  const dummyData = {
    date: '22.11.2019',
    time: '12:00',
    value: 16.3,
  };

  await new Promise(resolve => setTimeout(() => resolve(), 500));
  return dummyData
};
// SENSORS END

// DB
const client = new Client({
  user: 'pi',
  host: 'localhost',
  database: 'Temp',
  password: 'Brahnernn',
  port: 5432,
});
client.connect();

function insertData(tableName, data) {
  const queryData = {
    name: `insert-data-${tableName}`,
    text: `INSERT INTO ${tableName}(date, time, temperature) VALUES($1, $2, $3)`,
    values: [data.date, data.time, data.value],
  };

  return client.query(queryData).catch(e => console.log(e));
};

function queryData(tableName) {
  const queryData = {
    name: `query-data-${tableName}`,
    text: `SELECT * FROM ${tableName}`,
  };

  return client.query(queryData).then(res => res.rows).catch(e => console.log(e))
};

cron.schedule('* * * * *', async () => {
  const dataOne = await dummySensorOne();
  await insertData('sensor_one', dataOne);
  const dataTwo = await dummySensorTwo();
  await insertData('sensor_two', dataTwo);
});
// DB END

// SERVER
const app = express();

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  const dataOne = await queryData('sensor_one');
  const dataTwo = await queryData('sensor_two');
  res.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Temperature control service</title>
      </head>
      <body>
        <div id='root'></div>
        <script>
          window.__SENSOR_ONE_DATA__ = ${serialize(dataOne)}
          window.__SENSOR_TWO_DATA__ = ${serialize(dataTwo)}
        </script>
        <script src='/dist/bundle.js'></script>
      </body>
    </html>
  `);
  return res.end();
});

const port = 1337;
app.listen(process.env.PORT || port, () => console.log(chalk.blue(`Listening intently on port ${port}`)));
// SERVER END
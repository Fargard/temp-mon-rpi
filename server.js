const express = require('express');
const app = express();
const path = require('path');
const chalk = require('chalk');
const morgan = require('morgan');

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use(morgan('dev'));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

const port = 1337;
app.listen(process.env.PORT || port, () => console.log(chalk.blue(`Listening intently on port ${port}`)));
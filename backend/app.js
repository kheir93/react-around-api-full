const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const helmet = require('helmet');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config()
const app = express();
const { PORT = 3000 } = process.env;
const NOT_FOUND = 404;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
let cors = require("cors");

// app.use((req, res, next) => {
//   res.header = (
//     'Access-Control-Allow-Origin',
//     'https://kheir93.students.nomoreparties.sbs'
//   );

//   next();
// });
app.use(helmet());
app.use(requestLogger);
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'http://localhost:3001'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
  next();
});

app.use(cors());
app.options('*', cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(errorLogger);

app.use('*', (req, res, next) => next(new errorMiddleware('Requested resource not found', NOT_FOUND)));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});

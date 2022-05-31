const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const helmet = require('helmet');
require('dotenv').config()

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
});


const app = express();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const cors = require("cors");

const { PORT = 3000 } = process.env;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use((req, res, next) => {
//   res.header = (
//     'Access-Control-Allow-Origin',
//     'https://https://kheir93.students.nomoreparties.sbs'
//   );

//   next();
// });

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
  next();
});


app.use(requestLogger);
app.use(cors());
app.options('*', cors());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(helmet());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(auth);

app.use(errorLogger);

app.use('*', (req, res) => res.status(404).send({ message: 'Requested resource not found' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const mongoose = require('mongoose');

dotenv.config();

//MIDDLEWARES
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// Mongodb Connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('connected to DB!'))
  .catch((err) => {
    console.log(err);
  });

//ROUTES
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

//LISTEN
const PORT = process.env.PORT_NUM || 3000;
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});

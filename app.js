const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');

//MIDDLEWARES
app.use(express.json());

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

//LISTEN
const PORT = process.env.PORT_NUM || 3000;
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Kết nối tới MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware để xử lý dữ liệu JSON
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());


// Chỉ định router cho cacs tuyến đường routes/api
const signupRouter = require('../server/routes/api/signup');
const loginRouter = require('../server/routes/api/login');
const productRouter = require('../server/routes/api/products');
const schedule = require('../server/routes/api/schedules');
const editProfile = require('../server/routes/api/editprofile');
const order = require('./routes/api/urlpay');
const payment = require('../server/routes/api/detailball');
const urlpay = require('../server/routes/api/urlpay');
const ipnurl = require('../server/routes/api/ipnurl');
const returnurl = require('../server/routes/api/returnurl');
const users = require('../server/routes/api/users');
const paypal = require('../server/routes/api/paypal');
app.use('/api/vnpay_ipn', ipnurl);
app.use('/api/vnpay_return', returnurl);
app.use('/api/create_payment_url', urlpay);
app.use('/api/products', productRouter);
app.use('/api/schedule', schedule);
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/userinfo', editProfile);
app.use('/api/createOrder', order);
app.use('/api/process-payment', payment);
app.use('/api/users', users);
app.use('/api/paypal', paypal);
// ... Các phần khác của ứng dụng ...

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

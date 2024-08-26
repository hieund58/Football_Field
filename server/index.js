const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

const User = require('./db/user');

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
const payment = require('../server/routes/api/payment');
const users = require('../server/routes/api/users');
const paypal = require('../server/routes/api/paypalv2');
const field = require('../server/routes/api/field')
const revenue = require('../server/routes/api/revenue')

app.use('/api/products', productRouter);
app.use('/api/schedule', schedule);
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/userinfo', editProfile);
app.use('/api/process-payment', payment);
app.use('/api/users', users);
app.use('/api/paypal', paypal);
app.use('/api/field', field);
app.use('/api/revenue', revenue);

// Biến folder uploads thành tĩnh để truy cập ảnh
app.use(express.static(path.join(__dirname, '..', 'uploads')));

// Tạo user admin default
User.makeDefaultAdmin()

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

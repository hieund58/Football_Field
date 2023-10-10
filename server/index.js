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
app.use(bodyParser.json());
app.use(cors());

// Chỉ định router cho /api/signup và /api/login
const signupRouter = require('../server/routes/api/signup');
const loginRouter = require('../server/routes/api/login');
const productRouter = require('../server/routes/api/products');
const scheduleRouter = require('../server/routes/api/schedules');
app.use('/api/products', productRouter);
app.use('/api/schedule',scheduleRouter)
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);

// ... Các phần khác của ứng dụng ...

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

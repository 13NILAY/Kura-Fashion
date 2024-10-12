require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const verifyRoles = require("./middleware/verifyRoles");
const ROLES_LIST = require("./config/roles_list");

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const db = await mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedDb = db;
  return db;
}

// Middleware
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Routes
app.use('/register', require('./routes/register'));
app.use("/login", require('./routes/auth'));
app.use("/refresh", require('./routes/refresh'));
app.use("/logout", require("./routes/logout"));
app.use("/Category", require("./routes/category"));
app.use("/product", require("./routes/products"));
app.use("/slider", require("./routes/slider"));
app.use("/coupon", require("./routes/coupon"));
app.use("/order", require("./routes/order"));

app.use(verifyJWT);
app.use('/users', require('./routes/user'));

app.use(verifyRoles(ROLES_LIST.Admin));
app.use("/admin", require("./routes/admin"));

// Health check route
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;
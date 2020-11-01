const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbSessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
require('dotenv').config();

const authRoutes = require('./routes/auth-route');

const app = express();
const sessionStore = new mongodbSessionStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  expires: 100 * 60 * 60 * 24 // session live for 24 hours in the database 
});
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET, saveUninitialized: false, resave: false, store: sessionStore }));
app.use(flash());

app.use('/auth', authRoutes);
app.use('/', (req, res) => res.status(404).send("<h1>Page Not Found</h1>"));

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: true 
}).then(result => app.listen(process.env.PORT, () => console.log(`server running at port ${process.env.PORT}.....`))
).catch(err => console.error(err));
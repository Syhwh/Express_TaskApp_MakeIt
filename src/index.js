const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const routes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');
const cookieSession = require('cookie-session');
const User = require('./database/models/User');

const morgan = require('morgan');

const port = config.port;
app = express();


//Database
mongoose.connect(config.mongoose.db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });

//Middlewares
app.use(express.urlencoded({ extended: true }));





//Views 
app.set('view engine', config.viewEngine);
app.set('views', config.views);



//cookie session
app.use(cookieSession(config.cookieSession));

app.use(async (req, res, next) => {
    const userId = req.session.userId;
    if (userId) {
        const user = await User.findById(userId);        
        if (user) {
            res.locals.user = user;            
        } else {
            delete req.session.userId;
        }
    }
    next();
});

//routes
app.use(authRoutes);
app.use(routes);





//static files
app.use(express.static(config.static));

app.use(morgan('dev'))

//error handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Server Error')
});

//app inizialization
app.listen(port, () => {
    console.log(`Server runing in the port ${port}`);
});


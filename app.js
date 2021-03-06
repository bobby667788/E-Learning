    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var exphbs = require('express-handlebars');
    var expressValidator = require('express-validator');
    var flash = require('connect-flash');
    var session = require('express-session');
    var passport = require('passport');
    var localstrategy = require('passport-local');
    var mongodb = require('mongodb');
    var mongoose = require('mongoose');
    
    mongoose.connect('mongodb://localhost/learn');
    var db = mongoose.connection;
    async = require('async');
    var index = require('./routes/index');
    var users = require('./routes/users');
    var classes = require('./routes/classes');
    var students = require('./routes/students');
    var instructors = require('./routes/instructors');

    var app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.engine('handlebars',exphbs({defaultLayout:'layout'}));
    app.set('view engine', 'handlebars');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(session({
        secret:'secret',
        saveUninitialized:true,
        resave:true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(expressValidator({
        errorFormatter:function(param,msg,value){
            var namespace = param.split('.'),
                root = namespace.shift(),
                formParam = root;
            while(namespace.lenght){
                formParam += '[' + namespace.shift() + ']';
            }
            return{
                param:formParam,
                msg: msg,
                value: value
            };
        }
    }));
    

    app.use(flash());

        
      
    app.use(function(req,res,next){
        res.locals.messages = require('express-messages')(req,res);
        if(req.url=='/'){
               res.locals.ishome = true;
        }
        next();
    });

    
    app.get('*',function(req,res,next){
        res.locals.user = req.user || null;
        if(req.user){
            res.locals.usertype = req.user.type;
        }
        next();
    });
    
    app.use('/', index);
    app.use('/users', users);
    app.use('/classes', classes);
    app.use('/students', students);
    app.use('/instructors', instructors);
    // catch 404 and forward to error handler




    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    module.exports = app;

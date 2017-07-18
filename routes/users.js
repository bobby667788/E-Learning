var express = require('express');
var router = express.Router();
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Student = require('../models/student');
var Instructor = require('../models/instructor');

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});

router.get('/about', function(req, res, next) {

          res.render('users/about');

});

router.post('/signup', function(req, res, next) {
    var fullname = req.body.fullname;
    var address = req.body.address;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var type = req.body.type;
    
    req.checkBody('password2','Password do not match').equals(req.body.password);
    
    var errors = req.validationErrors();
    
    if(errors){
         res.render('users/signup',{
                 errors:errors,
        fullname:fullname,
        address:address,
        username:username,
        email:email,
        password:password,
        password2:password2,
        type:type  
        });
 
    }
    else
    {
       var newuser = new User({
           email:email,
           username:username,
           password:password,
           type:type
       });
        
                           var instructor = new Instructor({
                fullname:fullname,
                address:address,
                email:email,
                username:username
            });
                       var student = new Student({
                fullname:fullname,
                address:address,
                email:email,
                username:username
            });
        if(type=='student'){
       
            User.saveStudent(newuser,student,function(err,user){
                console.log('Student Created');
            });
        }
           else{
       
            User.saveInstructor(newuser,instructor,function(err,user){
                console.log('Instructor Created');
            });
        }
        req.flash('success','User added successfully');
        res.redirect('/');
    }
    
});

passport.serializeUser(function(user,done){
    done(null,user._id);
});

passport.deserializeUser(function(id,done){
    User.getuserbyid(id,function(err,user){
        done(err,user); 
    });
});


router.post('/login',passport.authenticate('local',{failureRedirect:'/',failureFlash:'Wrong Username or Password'}),function(req,res){
    req.flash('success','You are logged in');
    console.log('logged in successfully');
    var usertype = req.user.type;
    res.redirect('/'+usertype+'s/classes');
});

passport.use(new localstrategy(
    function(username,password,done){
        User.getuserbyusername(username,function(err,user){
                 if(err) throw err;
        if(!user){
            return done(null,false,{message:'Unknown user'+username});
        }
        User.comparePassword(password,user.password,function(err,isMatch){
            if(err) return done(err);
            if(isMatch){
                return done(null,user);
            }
            else{
                console.log('Invalid Password');
                return done(null,false,{message:'Invalid password'});
            }
        });
        });
   
    }
));

router.get('/logout',function(req,res){
    req.logout();
    req.flash('success','You have logged out');
    res.redirect('/');
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/')
}

module.exports = router;

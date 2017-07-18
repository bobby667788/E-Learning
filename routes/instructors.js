var express = require('express');
var router = express.Router();
Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

router.get('/classes', function(req, res, next) {
  Instructor.getinstructorbyusername(req.user.username,function(err,instructor){
      if(err){
          console.log(err);
          res.send(err);
      }
      else{
          res.render('instructors/classes',{"instructor":instructor});
      }
  });
});

router.post('/classes/register',function(req,res){
    info=[];
    info['instname']=req.user.username;
    info['classid'] = req.body.class_id;
    info['classtitle'] = req.body.class_title;
    Instructor.register(info,function(err,instructor){
        if(err) throw err;
        console.log(instructor);
    });
    req.flash('success','You are now registered');
    res.redirect('/');
});

router.get('/classes/:id/lessons/new', function(req, res, next) {

  res.render('instructors/lessons',{"classid":req.params.id});
});

router.post('/classes/:id/lessons/new', function(req, res, next) {
    
    var info=[];
    info['classid']=req.params.id;
    info['lessno'] = req.body.lessno;
    info['lesstitle'] = req.body.lesstitle;
    info['lessbody'] = req.body.lessbody;
    Class.addlesson(info,function(err,lesson){
        console.log('lesson added!!');
    });
    req.flash('success','Lesson added successfully');
    res.redirect('/');
    
});

module.exports = router;
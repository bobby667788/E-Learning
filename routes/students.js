var express = require('express');
var router = express.Router();
Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');

router.get('/classes', function(req, res, next) {
  Student.getstudentbyusername(req.user.username,function(err,student){
      if(err){
          console.log(err);
          res.send(err);
      }
      else{
          res.render('students/classes',{"student":student});
      }
  });
});

router.post('/classes/register',function(req,res){
    info=[];
    info['studname']=req.user.username;
    info['classid'] = req.body.class_id;
    info['classtitle'] = req.body.class_title;
    Student.register(info,function(err,student){
        if(err) throw err;
        console.log(student);
    });
    req.flash('success','You are now registered');
    res.redirect('/classes');
});


module.exports = router;
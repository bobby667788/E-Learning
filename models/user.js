var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        bcrypt:true
    },
    type:{
        type:String
    }
});

var User = module.exports = mongoose.model('User',userSchema);


module.exports.getuserbyid = function(id,callback){
    User.findById(id,callback);
}

module.exports.getuserbyusername = function(username,callback){
    var query = {username:username};
    User.findOne(query,callback);
}

module.exports.saveStudent = function(newuser,newstudent,callback){
    bcrypt.hash(newuser.password,10,function(err,hash){
        if(err){
            throw err;
        }
        newuser.password = hash;
        console.log('Saving student...');
        async.parallel([newuser.save.bind(newuser), newstudent.save.bind(newstudent)], callback);
    });
}

module.exports.saveInstructor = function(newuser,newinstructor,callback){
    bcrypt.hash(newuser.password,10,function(err,hash){
        if(err){
            throw err
        }
        newuser.password = hash;
        console.log('Saving instructor...');
    async.parallel([newuser.save.bind(newuser), newinstructor.save.bind(newinstructor)], callback);
    });
}

module.exports.comparePassword = function(password,hash,callback){
    bcrypt.compare(password,hash,function(err,isMatch){
       if(err) throw err;
        callback(null,isMatch);
    });
}


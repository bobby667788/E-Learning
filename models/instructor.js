var mongoose = require('mongoose');

var instructorSchema = mongoose.Schema({
    username:{
        type:String
    },
    fullname:{
        type:String
    },
     address:{
        type:String
    },
     type:{
        type:String
    },
    email:{
        type:String
    },
    classes:[{
        class_id:{type:[mongoose.Schema.Types.ObjectId]},
        class_title:{type: String}
    }]
    
});

var Instructor = module.exports = mongoose.model('Instructor',instructorSchema);

module.exports.getinstructorbyusername = function(username,callback){
    var query = {username:username};
    Instructor.findOne(query,callback);
} 

module.exports.register = function(info,callback){
    instname = info['instname'];
    classid = info['classid'];
    classname = info['classtitle'];
    Instructor.findOneAndUpdate(
    instname,{$push: {"classes":{class_id:classid,class_title:classname}}},
        {safe:true,upsert:true},callback
              );
}


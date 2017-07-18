var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
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

var Student = module.exports = mongoose.model('Student',studentSchema);

module.exports.getstudentbyusername = function(username,callback){
    var query = {username:username};
    Student.findOne(query,callback);
} 

module.exports.register = function(info,callback){
    std_name = info['studname'];
    classid = info['classid'];
    classname = info['classtitle'];
    Student.findOneAndUpdate(
    std_name,{$push: {"classes":{class_id:classid,class_title:classname}}},
        {safe:true,upsert:true},callback
              );
}


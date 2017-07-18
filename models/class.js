var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    instructor:{
        type:String
    },
    lessons:[{
        less_no:{type:Number},
        les_title:{type:String},
        les_body:{type:String}
    }]
});

var Class = module.exports = mongoose.model('Class',classSchema);


module.exports.getClasses = function(callback,limit){
    Class.find(callback).limit(limit);
}

module.exports.getClassbyid = function(id,callback){
    Class.findById(id,callback);
}

module.exports.addlesson = function(info,callback){
    classid=info['classid'];
    lessno=info['lessno'];
    lesstitle=info['lesstitle'];
    lessbody=info['lessbody'];
    Class.findByIdAndUpdate(
    classid,
    {$push:{"lessons":{less_no:lessno,les_title:lesstitle,les_body:lessbody}}},
        {safe:true,upsert:true},callback
    );
    
}
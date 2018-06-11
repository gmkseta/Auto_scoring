var mongoose = require("mongoose");
var util     = require("../util");

var fileSchema = mongoose.Schema({
  title: String,
  author:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
  file: String,
  createdAt:{type:Date, default:Date.now}
},{
  toObject:{virtuals:true}
});

// virtuals
fileSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

fileSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true,"Title is required!"]},
  body:{type:String, required:[true,"Body is required!"]},
  author:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
  inp: String,
  file: Object,
  files:[fileSchema],
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true},
  usePushEach: true
});

// virtuals
postSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

postSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

postSchema.virtual("updatedDate")
.get(function(){
  return util.getDate(this.updatedAt);
});

postSchema.virtual("updatedTime")
.get(function(){
  return util.getTime(this.updatedAt);
});

// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;

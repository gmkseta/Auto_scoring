var express  = require("express");
var fs = require("fs")
var router   = express.Router();
var Post     = require("../models/Post");
var util     = require("../util");
var multer = require('multer');
var compile_run    = require("compile-run");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
    // cb(null, 'uploads/'+req.user._id+"/") // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var upload = multer({ storage: storage })

router.get("/correct", function(req,res){
  res.render("posts/correct");
});

router.get("/incorrect", function(req,res){
  res.render("posts/incorrect");
});

// Index
router.get("/", function(req, res){
  Post.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
    res.render("posts/index", {posts:posts});
  });
});

// New
router.get("/new", util.isLoggedin, function(req, res){
  var post = req.flash("post")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("posts/new", { post:post, errors:errors });
});

// create
router.post("/", upload.single("file"), util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  // req.body.file = req.file
  req.body.file = ""
  // console.log(req.body.file)
  Post.create(req.body, function(err, post){
    if(err){
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/new");
    }
    if(req.file){
      var dir = './uploads/'+post._id;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      post.update({file: req.file}, function(err, post2){
        res.redirect("/posts");
      })
    }else{
      res.redirect("/posts");
    }
  });
});

// show
router.get("/:id", function(req, res){
  Post.findOne({_id:req.params.id})
  .populate("author")
  .populate({ path: 'files.author'})
  .exec(function(err, post){
    if(err) return res.json(err);
    res.render("posts/show", {post:post});
  });
});

// show
router.get("/:id/json", function(req, res){
  Post.findOne({_id:req.params.id})
  .populate("author")
  .populate({ path: 'files.author'})
  .exec(function(err, post){
    if(err) return res.json(err);
    return res.json({count: post.length,msg: "success", result: post});
  });
});

// edit
router.get("/:id/edit", util.isLoggedin, checkPermission, function(req, res){
  var post = req.flash("post")[0];
  var errors = req.flash("errors")[0] || {};
  if(!post){
    Post.findOne({_id:req.params.id}, function(err, post){
      if(err) return res.json(err);
      res.render("posts/edit", { post:post, errors:errors });
    });
  } else {
    post._id = req.params.id;
    res.render("posts/edit", { post:post, errors:errors });
  }
});

// update
router.put("/:id", util.isLoggedin, checkPermission, function(req, res){
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err){
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/"+req.params.id+"/edit");
    }
    res.redirect("/posts/"+req.params.id);
  });
});

// destroy
router.delete("/:id", util.isLoggedin, checkPermission, function(req, res){
  Post.remove({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});

// file upload
router.post("/:id/files",upload.single('file'), function(req, res){
  Post.findById(req.params.id).exec((err, post)=>{
    console.log(req.file)
    post.files.push({title: req.file.originalname, file: req.file.path});
    post.save((err,success_post)=>{
      if(err) res.status(500).send(err);
      Post.findById(req.params.id).distinct('inp',function(err,result){
        var b=result[0].split("/");
        var c = new Array();
        for(var i=0;i<b.length;i++){
          if(b[i][0]=='s')
            c.push(b[i].substring(1));
          else
            c.push(Number(b[i]));
        }
        console.log(c);
        compile_run.runFile(req.file.originalname,c,function(stdout, stderr, err){
          if(!err){
            var output = stdout;
            Post.findById(req.params.id).distinct('file.originalname',function(err2,result2){
              console.log(result2);
              compile_run.runFile(result2[0],c,function(stdout2, stderr2, err3){
                if(!err3){
                  if(output==stdout2)
                    res.render("posts/correct");
                    else res.render("posts/incorrect");
                }
                else console.log(err3);
              })
            });
          }
          else{
            console.log(err);
          }
        });
      });

      //res.render("posts/show", {post:post});
    })
  })
})


module.exports = router;

// private functions
function checkPermission(req, res, next){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    if(post.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}

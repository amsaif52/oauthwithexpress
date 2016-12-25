var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
	return res.render('index',{title:'Home',user:req.user});
});

router.get('/about',function(req,res){
	return res.render('about',{title:'About',user:req.user});
});

router.get('/contact',function(req,res){
	return res.render('contact',{title:'Contact',user:req.user});
});

router.get('/profile',function(req,res){
	if(req.user){
		return res.render('profile',{title:'Profile',user:req.user});
	}else{
		res.redirect('/login');
	}
});

router.get('/login',function(req,res){
	return res.render('index',{title:'Login',user:req.user});
});

module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users });
    })
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: { email: email }
    }).then(user => {
        if (user == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users");
            }).catch((err) => {
                res.redirect("/users/create");
            })

        } else {
            res.redirect("/admin/users/create");
        }
    })
});

router.get("/admin/users/edit/:id", (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect("/admin/users");
    } else {

        User.findByPk(id).then(user => {
            if (user != undefined) {
                res.render("admin/users/edit", { user: user });
            } else {
                res.redirect("/admin/users");
            }
        }).catch((err) => {
            res.redirect("/admin/users");
        })

    }
})

router.post("/admin/users/update",(req,res)=>{
    var password = req.body.password;
    var id = req.body.id;
    //res.json({id,password});

    if(password != undefined && password != ""){

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password,salt);

    User.update({password:hash},{
        where:{
            id:id
        }
    }).then( ()=>{
        res.redirect("/admin/users");
    })

    }else{
        res.redirect("/");
    }
})

router.post("/admin/users/delete",(req,res)=>{
    var id = req.body.id;

    if(isNaN(id) || id==undefined ){
        res.redirect("/");
    }else{
        User.destroy({
            where:{
                id:id
            }
        }).then(() =>{
            res.redirect("/admin/users");
        })
    }
});

router.get("/login",(req,res)=> {
    res.render("admin/users/login");
});

router.post("/authenticate",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    //res.json({email,password});

    User.findOne({
        where:{
            email:email
        }
    }).then( user =>{
        if(user != undefined){
            var correct = bcrypt.compareSync(password,user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login");
            }

        }else{
            res.redirect("/login");
        }
    })
})

router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
})

module.exports = router;
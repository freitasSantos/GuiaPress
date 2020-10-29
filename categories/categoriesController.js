const express = require("express");
const router = express.Router();
const Category = require("./Category");
const sluify = require("slugify");
const { default: slugify } = require("slugify");

router.get("/categories",(req,res) =>{
    res.send("Rota de categorias")
})

router.get("/admin/categories/new",(req,res) =>{
    res.render("admin/categories/new");
})

router.post("/categories/save",(req,res)=>{
    var title = req.body.title;
    if (title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then( ()=>{
            res.redirect("/");
        })
    }else{  
        res.redirect("admin/categories/new");
    }
});

module.exports = router;
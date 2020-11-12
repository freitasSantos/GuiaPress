const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const connection = require("./database/database");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require("./users/usersController");

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));

//deixar esses tópicos abaixo da chamada do bodyParser
app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController);

//database
connection
    .authenticate()
        .then( () =>{
            console.log('Database connection sucess!');
        })
        .catch( (error) =>{
            console.log(error);
        })

app.get("/",(req,res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],limit:4
    }).then( articles =>{
        Category.findAll().then(categories =>{
            res.render("index",{articles: articles, categories:categories})
        })
    })
})

app.get("/:slug",(req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then( article =>{
        if(article != undefined){
                Category.findAll().then(categories =>{
                    res.render("article",{article: article, categories:categories})
                })
        }else{
            res.redirect("/");
        }
    }).catch( err =>{
        res.redirect("/");
    })
})

app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where :{
            slug: slug
        },
        include: [{model: Article}]
    }).then( category=>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch( err =>{
        res.redirect("/")
    })
})

app.listen(8080,()=>{
    console.log("O servidor está rodando!");
})
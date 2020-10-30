const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use("/public", express.static('public'));

const connection = require("./database/database");
const Article = require("./articles/Article");
const Category = require("./categories/Category");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController")

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));

//database
connection
    .authenticate()
        .then( () =>{
            console.log('Database connection sucess!');
        })
        .catch( (error) =>{
            console.log(error);
        })

app.use("/",categoriesController);
app.use("/", articlesController);

app.get("/",(req,res)=>{
    res.render("index")
})

app.listen(8080,()=>{
    console.log("O servidor está rodando!");
})
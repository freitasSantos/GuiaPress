const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

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


app.get("/",(req,res)=>{
    res.render("index")
})

app.listen(8080,()=>{
    console.log("O servidor está rodando!");
})
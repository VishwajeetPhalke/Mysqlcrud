require ('dotenv').config();//used to keep our secrets secure.
const express = require("express");
const bodyparser = require ("body-parser");
const ejs = require ("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
const port = 3000;

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({
    extended:true
}));

mongoose.connect('mongodb://127.0.0.1:27017/usersDB', {
  useNewUrlParser: true
});

const usersSchema = new mongoose.Schema({
    email: String,
    password: String
  });


usersSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User", usersSchema);


app.get("/",function(req,res){
    res.render("home.ejs");
});

app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.get("/register",function(req,res){
    res.render("register.ejs");
});


app.post("/register",function(req,res){   //we created doc in post.
    const newUser=new User({    //docs--we want data that will be entered to be saved in collection-User of DB
        email:req.body.username,    //username and password are the names used in the form.
        password:req.body.password

    });

    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    });
    
    //if no erreors render the secrets page.-->we want the user to see secrets page only when they have registered. So previously we have not given any get req for secrets page.
})

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
 
    User.findOne({email: username})
    .then(function(foundUser){
        if(foundUser.password ===password){
            res.render("secrets");
        }else{
            res.send("error");
        }
    })
    .catch(function(err){
        console.log(err);
    })
 
})
//matlab yaha pe on login page we ask for username and password and then we use findone if it finds the mathing data of email and password in our re.body then we render the secrets.ejs otherwise we dont render it.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

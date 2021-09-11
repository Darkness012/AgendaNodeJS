const express = require("express");
const app = express();
const loginRouter = require("./router/login.js");
const agendaRouter = require("./router/agenda.js");
const eventosRouter = require("./router/eventos.js");
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const cookieParser = require("cookie-parser");


//CONNECTING TO DATABASE
mongoose.connect('mongodb://localhost:27017/app_agenda');


//SETTINGS
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secretcode0FA4A6C',
    resave: false,
    saveUninitialized: true
}))


//STATIC FILES
app.use(express.static(path.join(__dirname, "../client")));


//ROUTER
app.use("/login", loginRouter);
app.use("/agenda", agendaRouter);
app.use("/events", eventosRouter);


//STARTING SERVER
app.listen(80, ()=>{
    console.log("Running on port 80"); 
})


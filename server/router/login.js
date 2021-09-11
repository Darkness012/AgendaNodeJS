const Router = require("express").Router();
const dbadmin = require("../mongo/admin.js");

Router.get("/", (req, res)=>{
    //SE ENVIARA A LA PAGINA PRINCIPAL LOGIN
    if(req.session.email){
        res.redirect("./../");
    }
    else{
        res.redirect("./../login.html");
    }
    
});

Router.post("/checkuser", (req, res)=>{
    //SE VERIFICARA EL USUARIO

    dbadmin.checkUser(req.body)
        .then((respuesta)=>{
            //SE INICIA SESION SI ES VALIDO
            if(respuesta=="OK") req.session.email = req.body.email;
            res.json({msg:respuesta});
        })
        .catch((err)=>{
            console.log(err);
            res.json({msg:err});
        })
})

Router.get("/all", (req, res)=>{
    dbadmin.getAllUsers()
        .then((docs)=>{
            res.json(docs)
        })
        .catch((err)=>{
            res.send(err)
        })
    
})

module.exports = Router;
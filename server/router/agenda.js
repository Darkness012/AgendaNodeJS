const Router = require("express").Router();

Router.get("/", (req, res)=>{

    //SE ENVIARA A LA PAGINA PRINCIPAL
    if(req.session.email){
        res.redirect("./../");
    }
    //SE ENVIARA AL LOGIN SI NO HAY SESSION
    else{
        res.redirect("./../login.html");
    }
    
});

Router.post("/cerrarSession", (req, res)=>{

    //CIERRA LA SESSION
    req.session.destroy(()=>{
        res.json({msg:"OK"});
    });
})

module.exports = Router;
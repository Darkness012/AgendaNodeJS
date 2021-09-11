const Router = require("express").Router();
const dbadmin = require("../mongo/admin.js");

Router.get("/all", (req, res)=>{

    //RETORNARA TODOS LOS EVENTOS DEL USUARIO

    if(req.session.email) {
        
        dbadmin.getEventsByEmail(req.session.email)
            .then(events=>{
                res.json(events);
            })
            .catch(err=>{
                res.json({msg:err});
            })

    }else{
        res.json({msg:"REDIRECT"});
    }
    
})

Router.post("/new", (req, res)=>{
    //SE CREARA UN NUEVO EVENTO
    let newEvent = req.body;
    newEvent.user_email = req.session.email;

    dbadmin.addNewEvent(newEvent)
        .then((id)=>{
            res.json({msg:"OK", id:id});
        })
        .catch((err)=>{
            res.json({msg:err});
        })
})

Router.post("/update/:id", (req, res)=>{

    //SE ACUTALIZARA EL EVENTO
    let id = req.params.id;
    let updated = req.body;

    dbadmin.updateEvent(id, updated)
        .then(msg=>{
            res.json({msg:msg});
        })
        .catch(err=>{
            res.json({msg:err})
        })

})

Router.post("/delete/:id", (req, res)=>{

    //SE ELIMINARA EL EVENTO
    dbadmin.deleteEvent(req.params.id)
        .then(msg=>{
            res.json({msg:msg});
        })
        .catch(err=>{
            res.json({msg:err});
        })
})


module.exports = Router;
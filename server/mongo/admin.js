const Users = require("./user_model.js");
const Events = require("./event_model.js");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {

    createUser(user){
        return new Promise((resolve, reject)=>{
            let newUser = new Users(user);
            newUser.save((err, newUser)=>{
                if(err) reject(err);

                resolve("OK");
            })
        });
    },

    checkUser(user){
        return new Promise((resolve, reject)=>{
            Users.find({email:user.email}).exec(function(err, docs) {
                if (err) reject(err);

                let msg = "WRONG_PASS";
                if(docs.length == 0) msg ="INVALID_DATA";
                else{
                    if(docs[0].pass===user.pass) msg = "OK"
                }

                resolve(msg);
            })
        })
    },
    
    getEventsByEmail(email){
        return new Promise((resolve, reject)=>{
            Events.find({user_email:email}).exec(function(err, docs){

                if(err) reject(err);

                respuesta = {
                    msg: "EMPTY"
                }

                if(docs.length > 0){
                    respuesta.msg = "OK"

                    let newEvents = [];
                    docs.forEach(evento=>{
                        newEvent = {
                            id: evento._id,
                            title: evento.title,
                            allDay: evento.allDay,
                            start: evento.start
                        }
                        if(!evento.allDay){
                            newEvent.end = evento.end;
                        }

                        newEvents.push(newEvent);
                    })

                    respuesta.events = newEvents;
                }

                resolve(respuesta);

            })
        })
        
    },
    
    addNewEvent(event){
        return new Promise((resolve, reject)=>{
            let evento = new Events(event);
            evento.save((err, newEvent)=>{
                if (err) reject(err);
                resolve(newEvent._id);
            })
        })
    },

    updateEvent(id, data){
        return new Promise((resolve, reject)=>{
            Events.findOneAndUpdate({_id:ObjectId(id)}, {$set:data}, (err, doc)=>{
                if(err) reject(err);

                resolve("OK");
            });
        })
    },

    deleteEvent(id){
        return new Promise((resolve, reject)=>{
            Events.findOneAndDelete({_id:ObjectId(id)}, (err)=>{
                if(err) reject(err);

                resolve("OK");
            });
        });
    }
};

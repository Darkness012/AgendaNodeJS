var utils = {
    isEmpty(str){
        return !(Boolean(str) && Boolean(str.replace(/\s/g, '')));
    }
    
}

var login = {
    clickLogin(event) {

        if(!utils.isEmpty($("#user").val()) && !utils.isEmpty($("#pass").val())){
            data = {
                email: $("#user").val(), 
                pass: $("#pass").val()
            };

            $.post('/login/checkuser', data, 
                function(response) {
                    if (response.msg == "OK") {
                        window.location.href = "/"
                    }else if(response.msg == "WRONG_PASS"){
                        alert("Contraseña incorrecta")
                    }else{
                        alert("Datos no validos")
                    }
            })

        }else{
            alert("Rellene todos los campos")
        }

        

        
        /**/
    }
}

$(function(){
    initForm();
    
})

function initForm(){
    $('.loginButton').on('click', login.clickLogin);
}
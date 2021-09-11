var utils = {
    getFormData(){
        let title = $('#titulo').val(),
            start = $('#start_date').val(),
            end = '',
            start_hour = '',
            end_hour = '',
            allDay = true

        if (!$('#allDay').is(':checked')) {
            allDay = false;
            end = $('#end_date').val()
            start_hour = $('#start_hour').val()
            end_hour = $('#end_hour').val()


            start = start + ((start_hour!="")?('T' + start_hour):"");
            end = end + ((end_hour!="")?('T' + end_hour):"");
        }

        let data = {
            title: title,
            start: start,
            allDay, allDay
        }

        if(end!="") data.end = end;

        return data;
    }, 
    formFilled(){
        let continuar = (!this.isEmpty($('#titulo').val()) && !this.isEmpty($('#start_date').val()) != "");
        if (!$('#allDay').is(':checked')) continuar = continuar && !this.isEmpty($('#end_date').val());

        return continuar;
    },
    isEmpty(str){
        return !(Boolean(str) && Boolean(str.replace(/\s/g, '')));
    }
}

class EventManager {
    constructor() {
        this.urlBase = "/events"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
            if(response.msg == "OK"){
                console.log("Tiene eventos");
                this.inicializarCalendario(response.events)
            }else if(response.msg == "EMPTY"){
                alert("No hay eventos aun");
                this.inicializarCalendario()

            }else if(response.msg == "REDIRECT"){
                window.location.href = "/login";

            }else{
                alert("Error al obtener los datos "+response.msg);
            }

            
        })
    }

    eliminarEvento(evento) {
        let eventId = evento.id
        $.post('/events/delete/'+eventId, (response) => {
            if(response.msg=="OK"){
                alert("Se elimino el evento");
            }else{
                alert("Error al eliminar");
                console.log(response.msg);
            }
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()

            let data = utils.getFormData();
            let url = this.urlBase + "/new";

            if(utils.formFilled()){
                $.post(url, data,function(response){
                if(response.msg == "OK"){
                        data.id = response.id;
                        $('.calendario').fullCalendar('renderEvent', data);
                        alert("Se añadio el evento")
                    }else{
                        alert(response.msg);
                    }
                    
                })
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    actualizarEvento(evento) {
        let start = moment(evento.start).format('YYYY-MM-DDTHH:mm');
        
        let updated = {
            start: start.substr(0,10)
        }

        if(!evento.allDay){
            let end = moment(evento.end).format('YYYY-MM-DDTHH:mm');
            updated.start += "T"+start.substr(11,8);
            updated.end = end.substr(0,10)+"T"+end.substr(11,8);
        }
        
        $.post('./events/update/'+evento._id, updated, function(response){
            if (response.msg=="OK") {
                alert('Se ha actualizado el evento exitosamente')
            }else {
                console.log(response.msg);
                alert(response.msg)
            }
        });
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
                $('.timepicker, #end_date').val("");
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
        $(".logout-container").click(function(){
            $.ajax({
                url:"/agenda/cerrarSession",
                type:"POST",
                success: function(response){
                    if(response.msg == "OK"){
                        window.location.href = "/login";
                    }
                },
                error: function(err){
                    alert("Error al cerrar sescion")
                }
            });
        })
    }

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos?eventos:[],
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "../img/trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 && jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                    
                    this.eliminarEvento(event);
                    $('.calendario').fullCalendar('removeEvents', event.id);
                }

                $('.delete').find('img').attr('src', "../img/delete.png");
                $('.delete').css('background-color', '#8B0913')
            }
        })
    }
}

$(function(){
    const Manager = new EventManager();
})


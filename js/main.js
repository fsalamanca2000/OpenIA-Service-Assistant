var converter = new showdown.Converter();//se crea un nuevo objeto converter para el manejo de showdown
var artyom = new Artyom();//el sonido
var banderaSonido = false;
var audioAux;
var asistente = "";
main();

function main() {

    $("#sonidoDesactivado").hide();

    tipoAsistente();

    $(".consultar").on("click", function () {
        responder(verificarPregunta());
    });

    $("#txt_buscador").keyup(function (event) { //keyup evento cuando se oprime una tecla
        if (event.keyCode === 13) {//si se oprime enter es el 13 en la tabla key code
            responder(verificarPregunta());
        }
    });

    $("#sonidoActivado").on("click", function () {//boton activar sonido
        activarSonido();
    });

    $("#sonidoDesactivado").on("click", function () {//boton desactivar sonido
        desactivarSonido();
    });
    $("#buscarAudio").on("click", function () {
        mostrarBusquedaAudio();
        limpiar();
    });
    $("#limpiar").on("click", function () {
        limpiar()
    })

}

function responder(preg) {
    if (asistente != "") {
        pregunta = "toma el rol de " + asistente + preg;
        respt = " del " + asistente + " ";
    } else {
        pregunta = preg;
        respt = ": ";
    }

    //alert(pregunta)
    $.ajax({ //mandar mensajes de manera asincronicas al server sin refrescar el navegador

        url: "http://127.0.0.1:3002/chat",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ pregunta: pregunta }), //convertir el valor a json gracias a stringify

        //succes es si hay un funcionamiento exitoso haga la funcion
        success: function (data) { //data es la respuesta dada por el servidor del Back
            //console.log(data)
            $("#pregunta").append(`<p class="chat-pregunta"> Tu:<br> ${(preg)} </p>`)
            $("#chat").append(`<p class="chat-response"> Respuesta${respt} <br>${converter.makeHtml(data.respuesta)} </p>`) //imprimir la respuesta en el id chat
            if (banderaSonido) {
                artyom.say(data.respuesta);//hablar
            }
        }
    });

    limpiar();
    audioAux = "";
}

function tipoAsistente() {
    $("#doctor").on("click", function () {
        asistente = "doctor: ";
        $(".cancelar").click();
    })
    $("#filosofo").on("click", function () {
        asistente = "filosofo: ";
        $(".cancelar").click();
    })
    $("#programador").on("click", function () {
        asistente = "programador: ";
        $(".cancelar").click();
    })
    $("#fisico").on("click", function () {
        asistente = "fisico: ";
        $(".cancelar").click();
    })
    $("#culturista").on("click", function () {
        asistente = "culturista: ";
        $(".cancelar").click();
    })
    $("#matematico").on("click", function () {
        asistente = "matematico: ";
        $(".cancelar").click();
    })
    $("#ninguno").on("click", function () {
        asistente = "";
        $(".cancelar").click();
    })
    $("#aceptar").on("click", function () {
        asistente = $("#Asistente_Persona").val() + ": ";
        document.getElementById("Asistente_Persona").value = "";
        $(".cancelar").click();
    })

}

function limpiar() {
    document.getElementById("txt_buscador").value = "";
    $(".audio").remove();//borra lo que se dice

}

function activarSonido() {
    artyom.say("sonido activado");//hablar
    banderaSonido = true;//indica si habla o no
    $("#sonidoDesactivado").show();//mostrar objeto
    $("#sonidoActivado").hide();//ocultar objeto
}

function desactivarSonido() {
    artyom.say("sonido desactivado");
    banderaSonido = false;
    $("#sonidoActivado").show();//mostrar objeto
    $("#sonidoDesactivado").hide();//ocultar objeto
}


//configurar sonido:
artyom.initialize({
    lang: "es-ES",
    debug: true,
    listen: true,
    continuous: true,
    speed: 0.9,
    mode: "normal"
});
//Acciones de voz
artyom.addCommands({
    indexes: ["Activar", "Desactivar", "Buscar", "preguntar", "Cancelar", "instrucciones", "asistente"],
    action: function (i) {
        if (i == 0) {
            activarSonido();
        } else if (i == 1) {
            desactivarSonido();
        }
        else if (i == 2) {
            responder(verificarPregunta());
            $(".cancelar").click();
        }
        else if (i == 3) {
            $("#buscarAudio").click();
            mostrarBusquedaAudio();
            limpiar();
        }
        else if (i == 4) {
            $(".cancelar").click();
        }
        else if (i == 5) {
            $("#btnInstrucciones").click();
        }
        else if (i == 6) {
            $("#asistente").click();
        }
    }
});

function mostrarBusquedaAudio() {
    artyom.redirectRecognizedTextOutput(function (recognized, isFinal) {
        if (isFinal) {
            if (recognized === "Buscar" || recognized === "buscar") {//revisaaaaaaaaaaaaaaaaaaaaaar
                alert("Es buscar")

            } else {
                $("#fondoConsultar").append(`<p class="audio"> ${recognized} </p>`);//mostrar lo que se dice
                audioAux = recognized;
            }
        }
    });
}

function verificarPregunta() {//si es en audio o escrita
    if ($("#txt_buscador").val().length != 0) {
        return $("#txt_buscador").val()
    } else {
        return audioAux;
    }
}
var index = 0;
var arr1 = {};
var arr2 = {};
var col = 0;
var suma = 0;
var residuo = 0;
var op = "";
var unidades = ["Unidad<br>U", "Decena<br>D", "Centena<br>C", "Miles/Millares<br>M"];

$(document).ready(function(){
    //iniciar
    $("#start").click(function(e){
        //agregar animacion
        $(this).addClass("hinge animated");
        //1.-evitar recarga de pagina.
        e.preventDefault();
        $("#tablaResultado tbody").empty();
        $("#respuestaUsuario").show();
        $("#contestar").show();
        //2.-obtener numeros ingresados
        var val1 = $("#num1").val();
        var val2 = $("#num2").val();

        //3.-no permitir numeros negativos.
        if(val1 < 0 || val2 < 0){
            alert("Nno se permiten numeros negativos");
            switch(true){
                case val1 < 0:
                    $("#num1").val("0");
                    break;
                case val2 < 0:
                    $("#num2").val("0");
                    break;
                default:
                    break;
            }
        }

        //4.-obtener las longitudes de cada numero y generar tabla.
        var cols = 0;
        if(val1.length > val2.length){
            val2 = val2.padStart(val1.length, "0");
            cols = val1.length;
        }else{
            val1 = val1.padStart(val2.length, "0");
            cols = val2.length;
        }

        //en este caso siempre son 5 filas.
        var filas = generarFilas(5, cols + 1);

        //colocar filas en la tabla
        $("#tablaResultado tbody").append(filas);

        //colocar texto de unidades.
        colocarUnidades(unidades);

        //colocar operacion en tabla.
        colocarOperacion(".fila-2", val1);
        colocarOperacion(".fila-3", val2);

        //agregar simbolo de suma
        $('.fila-3 .columna-0').html("+");

        //5.-generar arrays
        arr1 = generararray(val1);
        arr2 = generararray(val2);

        col = arr1.length;

        //respuesta de operacion.
        suma = ejecutaOperacion(arr1, arr2, index, arr2.length, residuo);

        //6.-realizar la operacion.
        setTimeout(function(){
            console.log("realizar pregunta al usuario");
            preguntaOperacion(op);
        }, 1000);

    });

    //obtener respuesta de usuario.
    $(".modal-footer").on("click", "#contestar",function(){
        //var td = ".columna-" + col;
        var respUser = $("#respuestaUsuario").val();
        //validar la respuesta.
        validarRespuesta(respUser);
    });

    //generar numero aleatoreamente.
    $("#aleatorio").click(function(e){
       
        $(this).addClass("rubberBand animated");
        e.preventDefault();
        var num1 = Math.floor(Math.random() * 100);
        var num2 = Math.floor(Math.random() * 100);
        $("#num1").val(num1);
        $("#num2").val(num2);
       // setTimeout(function(){
            
           
        //}, 300);
    });

});

function colocarUnidades(unidades){
    var unidad = $('.fila-0').children().length;
    var col = ".columna-" + (unidad - 1);
    switch(true){
        case unidad == 1:
            //unidad
            $('.fila-0 .columna-0').html(unidades[0]);
            break;
        case unidad == 2:
            //decena
            $('.fila-0 .columna-1').html(unidades[0]);
            $('.fila-0 .columna-0').html(unidades[1]);
            break;
        case unidad == 3:
            //centena
            $('.fila-0 .columna-2').html(unidades[0]);
            $('.fila-0 .columna-1').html(unidades[1]);
            $('.fila-0 .columna-0').html(unidades[2]);
            break;
        case unidad >= 4:
            //milles o millones
            $('.fila-0 .columna-3').html(unidades[0]);
            $('.fila-0 .columna-2').html(unidades[1]);
            $('.fila-0 .columna-1').html(unidades[2]);
            $('.fila-0 .columna-0').html(unidades[3]);
            break;
        default:
            break;
    }
}

//colocar la operacion en la tabla
function colocarOperacion(fila, valor){
    for(var a = valor.length - 1; a >= 0; a--){
        $(fila).children('.columna-' + (a + 1)).html(valor[a]);
    }
}

//crear filas
function generarFilas(rows, tds){
    var filas;
    for(var a = 0; a < rows; a++){
        //crear columnas
        filas += "<tr class='fila-" + a + "'>";
        for(var b = 0; b < tds; b++){
            filas += "<td class='columna-" + b + "'></td>";
        }
        filas+= "</tr>";
    }
    return filas;
}

function generararray(val){
    var arr = [];
    for(var a = val.length - 1; a >= 0; a--){
        arr.push(val[a]);
    }
    return arr;
}

function ejecutaOperacion(){
    var operacion = 0;

    operacion = parseInt(arr2[index]) + parseInt(arr1[index]);
    var r = residuo.toString();

    //validamos valor de residuo.
    if(residuo > 0){
        operacion = operacion + residuo;
        op = "sumar: " + arr1[index] + " + " + arr2[index] + " + " + residuo + " que nos sobra";
    }else{
        op = "sumar: " + arr1[index] + " + " + arr2[index];
    }
    return operacion;
}

//mostrar pregunta al usuario.
function preguntaOperacion(){
    $("#respuestaUsuario").val("");
    $(".modal-body p").remove();
    $("#notificaRespuesta").empty();
    $('#exampleModal').modal("show");
    $('#operacion').html(op);
    $('#exampleModal').find('.modal-title').text("Realiza la operación");
}

//validar respuesta de usuario.
function validarRespuesta(respUser){
    var td = ".columna-" + col;
    if(suma == respUser){
        $("#respuestaUsuario").addClass("tada animated");
        //respuesta correcta.
        correcto();
        setTimeout(function(){
            $('#exampleModal').modal("hide");
            if(suma > 9){
                var n = suma.toString();
                $(".fila-4").children(td).html(n[1]);

                $(".fila-1").children('.columna-' + (col - 1)).html(n[0]);
                $(".fila-1").children('.columna-' + (col - 1)).addClass("zoomInUp animated");
                residuo = parseInt(n[0]);

                if(index == arr2.length - 1){
                    $(".fila-4").children('.columna-' + (col - 1) ).html(residuo);
                    $(".fila-4").children('.columna-' + (col - 1) ).addClass("zoomInUp animated");
                }
            }
            else{
                $(".fila-4").children(td).html(suma);
                //agregar animacion
                $(".fila-4").children(td).addClass("zoomInUp animated");
                residuo = 0;
            }

            col--;
            index++;

            //validar fin de operacion.
            if(index == arr1.length){
                //has terminado la operacion.
                setTimeout(function(){
                    op = "<p><i class='fas fa-smile-beam'></i><span>Bien hecho!</span></p>";
                    preguntaOperacion();
                    $('#exampleModal').find('.modal-title').text("Felicidades, haz terminado el problema");
                    $('#exampleModal').find('.modal-body input').hide();
                    $("#contestar").hide();
                    //resetear valores.
                    index = 0;
                    arr1 = {};
                    arr2 = {};
                    col = 0;
                    suma = 0;
                    residuo = 0;
                    op = "";
                    
                    $("#start").removeClass("hinge animated");
                    $("#aleatorio").removeClass("rubberBand animated");
                }, 1000);
            }else{
                //continua preguntando
                $('#exampleModal').modal("hide");
                setTimeout(function(){
                    suma = ejecutaOperacion();
                    preguntaOperacion();
                }, 500);
            }
            $("#respuestaUsuario").removeClass("tada animated");
        },2000);
    }
    else{
        //respuesta incorrecta.
        incorrecto();
        $("#respuestaUsuario").addClass("shake animated");
        setTimeout(function(){
            suma = ejecutaOperacion();
            $("#respuestaUsuario").removeClass("shake animated");
            $("#respuestaUsuario").val("");
        }, 2000);
    }
}

//mostrar animacion respuesta correcta.
function correcto(){
    $(".modal-body").append("<p id='notificaRespuesta'><i class='fas fa-star'></i>Correcto!!</p>");
    setTimeout(function(){
        $(".modal-body p").remove();
    }, 1000);
}

function incorrecto(){
    $(".modal-body").append("<p id='notificaRespuesta'><i class='fas fa-times-circle'></i>Incorrecto!!</p>");
    setTimeout(function(){
        $(".modal-body p").remove();
    }, 1000);
}
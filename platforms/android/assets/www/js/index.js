/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function jsonCallback(json) {
					console.log(json);
					
					if (json.validacion == "ok"){
					$("#resultado").html("<span>enviado</span>");
					}
					else{
					$("#resultado").html("<span class='rojo'>todos los campos son obligatorios</span>");
					}
				}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		//inicializamos BBDD
		bbdd.initialize();
		//inicialiamos FB
		//console.log("Llamamos a fb init");
		//facebook.initialize();
		console.log("fb init listo");
		//Iniciamos ons
		//~ console.log("Iniciamos ONS");
		ons.bootstrap();
		ons.ready(function() {
			$(document.body).on('pageinit', 'mapa.html', function() {
				//~ console.log("Somos mapa.html");
				app.initializeMap();
			})
			console.log("ONS listo");			
			//asociamos el evento postpush tras la carga d euna página
			app.navi.on("postpush", app.postPushEvent);
		});
        app.receivedEvent('deviceready');
        var networkState = navigator.connection.type;
        console.log("Tenemos el networkState: "+networkState);
        if(networkState==Connection.CELL_3G || networkState==Connection.WIFI ||  Connection.ETHERNET ) {
			console.log("Tenemos 3g o WiFi o somos frikis y tiene ethernet");
			app.refreshDb();
		}
    },
    
	//Evento que se ejecuta tras cargar una nueva pagina en el navegador
    postPushEvent: function() {
		//~ console.log("somos post push");
		var page = app.navi.getCurrentPage();
		if (page.options.mapa) {
			app.initializeMap();
		}
        if (page.options.mapa_detalle) {
			app.initializeMap(page.options.comercio_id);
		}
		if (page.options.listado) {
			app.refrescarListaComercios();
		}
		if (page.options.info) {
			console.log("Somo la página de info");
			console.log("Inicializamos FB");
			facebook.initialize();
		}
		if (page.options.contacto) {
					
				
				
				$('#contacto').click(function() {
					// recolecta los valores que inserto el usuario
						console.log("entramos en la funcion mail ajax")
								var parametros = {
				            asunto :$("#asunto").val(),
								email: $("#email").val(),
								mensa :$("#mensaje").val()
				        };
				        						console.log("leyendo el email"+parametros.email+"y asubnto"+parametros.asunto);
				        						
				       
				        /*if (parametros.email == "" || parametros.asunto == "" || parametros.mensa =="") {
				       			$("#resultado").html("todos los campos son obligatorios");
				        }*/
				        
				        $.ajax({
				                data:  parametros,
				                url:   'http://consumoresponsable.info/app-admin/mailer/contacto.php',
				                type:  'POST',
				                dataType:'jsonp',
				                jsonpCallback:'jsonCallback',
				                
				                beforeSend: function () {
				                        $("#resultado").html("<span class='negro'>Procesando, espere por favor...</span>");
				                }
				                
				                
				                
				        });
				        
				     });
		}
		if (page.options.ficha) {
			console.log("Cargamos los datos del comercio: "+page.options.comercio);
			bbdd.cargarComercio(page.options.comercio);
			console.log("Inicializamos FB");
			facebook.initialize();  
		}
	},
	// FUNCIONES MAPA //
	initializeMap: function (comercio_id) {
		//~ console.log("Iniciamos el mapa");
        alto = $(window).height()
        alto2 = windowHeight = screen.height; 
		if (app.map != undefined) {
            
            //console.log("Borramos el mapa");
            //app.map.remove();
            $("#map_detail").height(alto);
            console.log("Redimensionado listo");
        } else {
            
            //console.log("Alto ventana: "+alto+" "+alto2);
            $("#map").height(alto);
            console.log("Redimensionado listo");
        }
		
        
        if (typeof comercio_id == "undefined") {
            console.log("Inicializamos el mapa");
            app.map = new L.Map('map');
        } else {
            console.log("Inicializamos el mapa detalle");
            app.map = new L.Map('map_detail');
        }
		
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib = 'Map data © OpenStreetMap contributors';
		var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });
		app.map.setView(new L.LatLng(42.847363,-2.6734835), 13);
		app.map.addLayer(osm);
		if (typeof comercio_id == "undefined") {
			console.log("Buscamos todos los comercios");
			consulta = "SELECT id_comercio,categoria,nombre,direccion,latitud,longitud,telefono FROM comercios";
		} else {
			console.log("Solo vamos a mostrar el comercio con ID"+comercio_id);
			consulta = "SELECT id_comercio,categoria,nombre,direccion,latitud,longitud,telefono FROM comercios WHERE id_comercio = "+comercio_id+"";
		}
		bbdd.db.transaction(function(tx){
			tx.executeSql(consulta, [],mapa.add_markers,function(tx,error){console.log("Error leyendo de BBDD: "+error.message)});
		});
		console.log("Mapa Iniciado");
	},
    buscame_onSuccess: function(position) {
        console.log("Te pillé");
        console.log('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
        //var map = new L.Map('map');
        console.log("Centremonos");
            
        app.map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 15);
  
        console.log("Centrado");
    },
     
    // onError Callback receives a PositionError object
    //
    buscame_onError: function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },

    buscame: function() {
        console.log("Vamos a buscar la posicion");
        navigator.geolocation.getCurrentPosition(this.buscame_onSuccess, this.buscame_onError);
    },
    // FUNCIONES MAPA //
    
    // FUNCIONES LISTA //
	initializeLista: function() {
		console.log("Cargando lista comercios");
		
		for (i = 0; i < 50; i++) {
			//~ console.log("Añadimos el comercio: "+i);
			$("#listado_comercios").append('<ons-list-item>Comercio '+i+'</ons-list-item>');
		}
	},
	
	refrescarListaComercios: function() {
		console.log("Cargando lista comercios");
		//Leemos los filtros:
		var categoria = $('#select_categorias :selected').val();
		console.log("Tenemos la categoria: " + categoria);
		var etiquetas = [];
		elegidas = $("#checkbox_etiquetas").children("input:checked");
		$.each( elegidas, function( tag ) {
			console.log("Tenemos elegida la tag "+elegidas[tag].value);
			etiquetas.push(elegidas[tag].value);
		});
		console.log("Tenemos las etiquetas "+etiquetas);
		console.log("Consultamos a BBDD");
		bbdd.listComercios(categoria,etiquetas);
		//~ $.each( data.comercios, function( i, item ) {
			//~ console.log("Añadimos el comercio: "+i);
			//~ $("#listado_comercios").append('<ons-list-item>Comercio '+item.nombre+'</ons-list-item>');
		//~ });
		//~ for (i = 0; i < 50; i++) {
			//~ console.log("Añadimos el comercio: "+i);
			//~ $("#listado_comercios").append('<ons-list-item>Comercio '+i+'</ons-list-item>');
		//~ }
		console.log("Terminado refrescarLista");
	},
	// FUNCIONES LISTA //
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //~ console.log('Received Event: ' + id);
        if(id="deviceready") {
			$("#splash").hide();
			//~ console.log("listo, quitamos el splash");
		}
    },
    
    checkUpdates: function() {
		console.log("Cargamos el JSON del server");
		var jqxhr = $.getJSON("http://etxea.net/medicus/about.json", 
			function(data) {
				console.log( "success" );
				console.log(data);
				console.log(data.bbdd.last);
				console.log(data.app.last);
				$("#bbdd_last").text(data.bbdd.last);
				$("#app_last").text(data.app.last);
			})

			.fail(function(jqxhr, textStatus, error) {
			console.log( "error" );
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
			})
		console.log("Terminado checkUpdates");
	},
	refreshDb: function() {
		bbdd.refreshDb();
	},
	
};


app.initialize();

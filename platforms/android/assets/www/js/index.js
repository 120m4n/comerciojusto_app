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
var bbdd = {
	
	initialize: function() {
		console.log("Abrimos la BBDD");
		bbdd.db = window.openDatabase("comercios", "0.1", "Comercios", 100000);
		//~ console.log("DB abierta. Creamos las tablas");
		//~ bbdd.db.transaction(bbdd.createDB, bbdd.errorCB, bbdd.successCB);
		console.log("Miramos si la tabla existe o hay que crearla");
		bbdd.db.transaction(bbdd.checkDB, bbdd.errorCB, bbdd.successCB);
	},
	
	createBD: function() {
		bbdd.db.transaction(function(tx){
			console.log("Somos createBD");
			console.log("Borramos la BBDD si existe");
			tx.executeSql('DROP TABLE IF EXISTS comercios');
			sql="CREATE TABLE IF NOT EXISTS `comercios` (\
				`id_comercio` INTEGER PRIMARY KEY AUTOINCREMENT,\
				`nombre` varchar(255) NOT NULL,\
				`categoria` varchar(255) NOT NULL,\
				`direccion` varchar(255) NOT NULL,\
				`telefono` varchar(15) NOT NULL,\
				`etiqueta_1` Boolean,\
				`etiqueta_2` Boolean,\
				`etiqueta_3` Boolean,\
				`etiqueta_4` Boolean,\
				`etiqueta_5` Boolean,\
				`etiqueta_6` Boolean,\
				`latitud` varchar(20) NOT NULL,\
				`longitud` varchar(20) NOT NULL\
			);"
			console.log("Creamos la tabla categorias");
			tx.executeSql(sql);
			sql = "CREATE TABLE IF NOT EXISTS `categorias` (\
				`id_categoria` int(11) NOT NULL,\
				`categoria` varchar(255) NOT NULL\
			);"
			console.log("Creamos la tabla categorias");
			tx.executeSql(sql);
			
			bbdd.populateDB();
		});
	},
	// Populate the database 
    populateDB: function () {
        console.log("Somos populateBD");		
		console.log("Cargamos el JSON local");
		$.getJSON( "js/comercios.json",function( data ) {
			console.log("JSON cargado vamos a recorrerlo");
				$.each( data, function( key,val ) {
					var comercio = val;
					bbdd.db.transaction(function(tx){
						sql = "INSERT INTO comercios (nombre,categoria,direccion,telefono,latitud,longitud) VALUES ('"+comercio.nombre+"','"+comercio.categoria+"','"+comercio.direccion+"','"+comercio.telefono+"','"+comercio.lat+"','"+comercio.lon+"')";
						console.log(sql);
						tx.executeSql(sql,[], 
							function (tx, results) { console.log('Insert OK'+results); }, 
							function(tx,error){ console.log("Insert KO: "+error.code+" "+error.message); }
						);
				});
			});
		}).fail(function(jqxhr, textStatus, error) {
				console.log( "error" );
				var err = textStatus + ", " + error;
				console.log( "Request Failed: " + err );
		});
		 
         
    },
    
	checkDB: function (tx) {
		console.log("Somos checkDB");
        tx.executeSql('SELECT * FROM comercios', [],function (tx, results) {
			if (results.rows.length>0) {
				console.log("La BBDD ya existe");
			}else{
				console.log("Creamos la BBDD");
				bbdd.createBD();
			}
		}, function(){
			console.log("Ha fallado el check por si acaso recreamos la BBDD");
			bbdd.createBD();
			});
	 },
	 
	 checkResult: function (tx, results) {
		 console.log("Somos checkResult");
		 console.log(results);
		 console.log("Returned rows = " + results.rows.length);
		 if (results.rows.length>0) {
			 for (i = 0; i < results.rows.length; i++) {
				//Get the current row
				var row = results.rows.item(i);
				console.log("Tenemos la fila: "+i+" "+row);
			};
		} else {
			//~ bbdd.createDB(tx);
			console.log("BBDD vacia?");
			
		}
	},
    // Transaction error callback
    //
    errorCB: function (tx,err) {
        console.log("Error processing SQL: "+err.message);
    },

    // Transaction success callback
    //
    successCB: function () {
        console.log("DB operation success!");
    },
	refreshDb: function() {
		
		console.log("Refresh DB");
		bbdd.createBD();
	},
	listComercios: function(categoria,etiquetas) {
		console.log("Vamos a buscar en BBDD los comercios con categoria "+categoria+" y las etiquetas "+etiquetas);
		if (categoria>0) {
			consulta = "SELECT * FROM comercios WHERE categoria = "+categoria;
		} else {
			consulta = "SELECT * FROM comercios WHERE 1=1";
		}
		while (etiquetas.length > 0 ) {
			consulta = consulta + " AND etiqueta_"+etiquetas.pop()+"=1";
		}
		
		console.log("El sql es: "+consulta);
		bbdd.db.transaction(function(tx){
			tx.executeSql(consulta, [],function (tx, results) {
				console.log("Vaciamos la lista");
				$("#listado_comercios").empty();
				$("#listado_comercios").append('<ons-list-header class="list__header ons-list-header-inner">Listado de Comercios</ons-list-header>');
				var len = results.rows.length;
				console.log("Hemos encontrado "+len+" comercios");
				if (len>0) {
					console.log("Vamos a rellenar la lista");
					for (i = 0; i < len; i++) {
						comercio = results.rows.item(i);
						//console.log("Añadimos "+comercio.id+" "+comercio.nombre);
						$("#listado_comercios").append('<ons-list-item class="list__item ons-list-item-inner"\
							onclick=\'app.navi.pushPage("ficha.html", { ficha: "True", comercio: "'+comercio.id_comercio+'"});\' >'
							+comercio.nombre+'</ons-list-item>');
					}

					
				}else{
					console.log("Sin resultados");
				}
			}, bbdd.errorCB);
		});
	},
	cargarComercio: function(id_comercio) {
		console.log("Vamos a buscar en BBDD el comercio "+id_comercio);
		consulta = "SELECT * FROM comercios WHERE id_comercio = "+id_comercio;
		console.log("El sql es: "+consulta);
		bbdd.db.transaction(function(tx){
			tx.executeSql(consulta, [],function (tx, results) {
				if (results.rows.length>0) {
					console.log("Vamos a rellenar la ficha");
					comercio = results.rows.item(0);
					console.log("Añadimos "+comercio.id+" "+comercio.nombre);
					$("#ficha_comercio_nombre").text(comercio.nombre);
					$("#ficha_comercio_direccion").text(comercio.direccion);
					$("#ficha_comercio_telefono").text(comercio.telefono);
				}else{
					console.log("Sin resultados");
				}
			}, bbdd.errorCB);
		});
	},
	
};
 



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
    },
    
	//Evento que se ejecuta tras cargar una nueva pagina en el navegador
    postPushEvent: function() {
		//~ console.log("somos post push");
		var page = app.navi.getCurrentPage();
		if (page.options.mapa) {
			app.initializeMap();
		}
		if (page.options.listado) {
			app.refrescarListaComercios();
		}
		if (page.options.ficha) {
			console.log("Cargamos los datos del comercio: "+page.options.comercio);
			bbdd.cargarComercio(page.options.comercio);
		}
	},
	// FUNCIONES MAPA //
	initializeMap: function () {
		//~ console.log("Iniciamos el mapa");
		var myIcon = L.icon({
					iconUrl: 'img/marker-icon.png',
					iconRetinaUrl: 'img/marker-icon-2x.png',
					iconSize: [38, 95],
					iconAnchor: [22, 94],
					popupAnchor: [-3, -76],
					shadowUrl: 'img/marker-shadow.png',
					shadowRetinaUrl: 'img/marker-shadow.png',
					shadowSize: [68, 95],
					shadowAnchor: [22, 94]
				});
		alto = $(window).height()
		alto2 = windowHeight = screen.height; 
		console.log("Alto ventana: "+alto+" "+alto2);
		$("#map").height(alto);
		//~ console.log("Redimensionado listo");
		app.map = new L.Map('map');
		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib = 'Map data © OpenStreetMap contributors';
		var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });
		app.map.setView(new L.LatLng(42.847363,-2.6734835), 13);
		app.map.addLayer(osm);
		
		consulta = "SELECT id_comercio,nombre,direccion,latitud,longitud,telefono FROM comercios";
		bbdd.db.transaction(function(tx){
			tx.executeSql(consulta, [],function (tx, results) {
				var len = results.rows.length;
				console.log("Hemos encontrado "+len+" comercios");		
				if (len>0) {
					console.log("Vamos a añadir los marcadores");
					for (i = 0; i < len; i++) {
						comercio = results.rows.item(i);
						//~ console.log("Añadimos "+comercio.id_comercio+" al mapa en ["+comercio.latitud+","+comercio.longitud+"]");
						popup_texto = "<div onclick='app.navi.pushPage(\"ficha.html\", { ficha: \"True\", comercio: \""+comercio.id_comercio+"\"})';>"+comercio.nombre+" "+comercio.telefono+"</div>";
						console.log(popup_texto);
						L.marker([comercio.longitud, comercio.latitud],{icon: myIcon}).addTo(app.map).bindPopup(popup_texto);
					}
				}else{
					console.log("Sin resultados");
				}},function(tx,error){console.log("Error leyendo de BBDD: "+error.message)});
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

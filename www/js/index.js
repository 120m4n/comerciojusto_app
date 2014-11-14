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
			sql="CREATE TABLE comercios(id INTEGER PRIMARY KEY ASC, nombre TEXT, telefono TEXT,direccion TEXT, lat REAL, lon REAL,categoria INTEGER,  etiqueta_1 INTEGER, etiqueta_2 INTEGER, etiqueta_3 INTEGER, etiqueta_4 INTEGER, etiqueta_5 INTEGER, etiqueta_6 INTEGER);"
			console.log("Creamos la BBDD");
			console.log(sql);
			tx.executeSql(sql);
			bbdd.populateDB();
		});
	},
	// Populate the database 
    populateDB: function () {
        console.log("Somos populateBD");
		bbdd.db.transaction(function(tx){
			for (i = 0; i < 50; i++) {
				console.log("Añadimos datos");
				sql = 'INSERT INTO comercios (nombre, categoria, etiqueta_1,etiqueta_2) VALUES ("Comercio '+i+'",'+Math.floor(Math.random()*10)+','+Math.floor(Math.random()*2)+','+Math.floor(Math.random()*2)+')';
				tx.executeSql(sql);
			}
			
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
    errorCB: function (err) {
        console.log("Error processing SQL: "+err);
    },

    // Transaction success callback
    //
    successCB: function () {
        console.log("DB operation success!");
    },
	refreshDb: function() {
		
		console.log("Refresh DB");
		console.log("Cargamos el JSON del server");
		var jqxhr = $.getJSON("http://etxea.net/medicus/comercios.json", 
			function(data) {
				console.log( "success" );
				app.refrescarLista(data);
			})
			.fail(function(jqxhr, textStatus, error) {
			console.log( "error" );
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
			})
		console.log("Terminado checkUpdates");
		
	},
	listComercios: function(categoria,etiquetas) {
		console.log("Vamos a buscar en BBDD los comercios con categoria "+categoria+" y las etiquetas "+etiquetas);
		if (categoria>0) {
			consulta = "SELECT * FROM comercios WHERE categoria = "+categoria;
		} else {
			consulta = "SELECT * FROM comercios WHERE categoria > 0";
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
						console.log("Añadimos "+results.rows.item(i).id+" "+results.rows.item(i).nombre);
						$("#listado_comercios").append('<ons-list-item class="list__item ons-list-item-inner">'+results.rows.item(i).nombre+'</ons-list-item>');
					}

					
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
		
	},
	// FUNCIONES MAPA //
	initializeMap: function () {
		//~ console.log("Iniciamos el mapa");
		alto = $(window).height()
		alto2 = windowHeight = screen.height; 
		console.log("Alto ventana: "+alto+" "+alto2);
		$("#map").height(alto);
		//~ console.log("Redimensionado listo");
		app.map = new L.Map('map');
		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib = 'Map data © OpenStreetMap contributors';
		var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });
		app.map.setView(new L.LatLng(42.847363,-2.6734835), 14);
		app.map.addLayer(osm);
		//~ console.log("Mapa Iniciado");
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
            
        app.map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 16);
  
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
	
};


app.initialize();

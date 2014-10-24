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
		
		//~ app.initializeLista();
		//Iniciamos ons
		console.log("Iniciamos ONS");
		ons.bootstrap();
		ons.ready(function() {
			//Primera inicialización
			//app.initializeMap();
			$(document.body).on('pageinit', 'mapa.html', function() {
				console.log("Somos mapa.html");
				app.initializeMap();
			})
			//~ menu.on('postclose', function() {
				//~ console.log("Menu page is closed");
				//~ app.initializeMap();
			//~ });
			console.log("ONS listo");
			
			//Cambiamos el height del mapa
			app.navi.on("postpush", app.postPushEvent);
		});
		
        app.receivedEvent('deviceready');
        
    },
    postPushEvent: function() {
		console.log("somos post push");
		var page = app.navi.getCurrentPage();
		//~ console.log(page);
		//~ console.log(page.options);
		//~ console.log(page.options.mapa);
		if (page.options.mapa) {
			app.initializeMap();
		}
		
	},
	initializeMap: function () {
		console.log("Iniciamos el mapa");
		alto = $(window).height()
		alto2 = windowHeight = screen.height; 
		console.log("Alto ventana: "+alto+" "+alto2);
		$("#map").height(alto);
		console.log("Redimensionado listo");
		app.map = new L.Map('map');
		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib = 'Map data © OpenStreetMap contributors';
		var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });
		app.map.setView(new L.LatLng(42.847363,-2.6734835), 14);
		app.map.addLayer(osm);
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
    
	initializeLista: function() {
		console.log("Cargando lista comercios");
		
		for (i = 0; i < 50; i++) {
			//~ console.log("Añadimos el comercio: "+i);
			$("#listado_comercios").append('<ons-list-item>Comercio '+i+'</ons-list-item>');
		}
	},
	
	refrescarLista: function(data) {
		console.log("Cargando lista comercios");
		$.each( data.comercios, function( i, item ) {
			console.log("Añadimos el comercio: "+i);
			$("#listado_comercios").append('<ons-list-item>Comercio '+i+' '+item.nombre+'</ons-list-item>');
		});
		console.log("terminado refrescarLista");
	},
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        if(id="deviceready") {
			$("#splash").hide();
			console.log("listo, quitamos el splash");
		}
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

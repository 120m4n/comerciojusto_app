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
				`categoria` varchar(255) NOT NULL DEFAULT '0',\
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
		console.log("Cargamos el JSON desde la web");
		//~ $.getJSON( "js/comercios.json",function( data ) {
		$.getJSON( "http://pronosticadores.net/json.php",function( data ) {
			console.log("JSON cargado vamos a recorrerlo");
				$.each( data, function( key,val ) {
					//~ console.log("Tenemos el key :"+key);
					var comercio = val;
					if (comercio.categoria == "") {
						comercio.categoria = 1;
					}
					//console.log("Categoria: "+comercio.categoria);
					bbdd.db.transaction(function(tx){
						
						sql = "INSERT INTO comercios (id_comercio,nombre,categoria,direccion,telefono,latitud,longitud,etiqueta_1,etiqueta_2,etiqueta_3,etiqueta_4,etiqueta_5,etiqueta_6) VALUES ('"+comercio.id_comercio+"','"+comercio.nombre+"','"+comercio.categoria+"','"+comercio.direccion+"','"+comercio.telefono+"','"+comercio.latitud+"','"+comercio.longitud+"','"+comercio.cLocal+"','"+comercio.cEcologico+"','"+comercio.cComercio+"','"+comercio.cSegunda+"','"+comercio.cReparar+"','"+comercio.cMujer+"')";
						//console.log(sql);
						tx.executeSql(sql,[], 
							function (tx, results) { /* console.log('Insert OK');*/ }, 
							function(tx,error){ console.log("Insert KO: "+error.code+" "+error.message); }
						);
				});
			});
			console.log("JSON Procesado");
		}).fail(function(jqxhr, textStatus, error) {
				console.log( "Error descargando el JSON" );
				alert("Lo sentimos mucho pero no hemos podido descargar la lista de comercios. Compruebe su conexión a Internet e intentelo de nuevo.");
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
					console.log("Añadimos "+comercio.id_comercio+" "+comercio.nombre+"categoria es "+comercio.categoria+"tipo producto "+comercio.etiqueta_1);
					
					$("#ficha_info_grafica").addClass("circles");
					console.log("Añadimos las etiquetas");
					if(comercio.etiqueta_1 == 1){
						console.log("Añadimos span con clase tLocal");
					   $("#ficha_info_grafica").append("<p class='tLocal'><span >local</span></p>");
					}
					if(comercio.etiqueta_2 == 1){	
					   $("#ficha_info_grafica").append("<p class='tEcologico'><span >ecologico</span></p>");
					}	
					if(comercio.etiqueta_3 == 1){
					   $("#ficha_info_grafica").append("<p class='tComercio'><span >comercio</span></p>");
					}	
					if(comercio.etiqueta_4 == 1){
					   $("#ficha_info_grafica").append("<p class='tSegunda'><span >segunda</span></p>");
					}	
					if(comercio.etiqueta_5 == 1){
					   $("#ficha_info_grafica").append("<p class='tReparar'><span >reparar</span></p>");
					}				
					if(comercio.etiqueta_6 == 1){
					   $("#ficha_info_grafica").append("<p class='tMujer'><span >mujer</span></p>");
					}	
					console.log("Ponemos la categoria");
					switch(comercio.categoria) {
						case "1":
							console.log("Añadimos clase circle alimentacion");
							$("#ficha_info_grafica").addClass("circle_alimentacion");
							break;
						
						case "2":
							$("#ficha_info_grafica").addClass("circle_artesania");
							break;
						
						case "3":
							$("#ficha_info_grafica").addClass("circle_ferias");
							break;
						
						case "4":
							$("#ficha_info_grafica").addClass("circle_limpieza");
							break;
						
						case "5":
							$("#ficha_info_grafica").addClass("circle_oficina");
							break;
						
						case "6":
							$("#ficha_info_grafica").addClass("circle_bares");
							break;
						
						case "7":
							$("#ficha_info_grafica").addClass("circle_ropa");
							break;
						
						case "8":
							$("#ficha_info_grafica").addClass("circle_otros");
							break;
					}
					console.log("Rellenamos los textos");
					$("#ficha_comercio_nombre").text(comercio.nombre);
					$("#ficha_comercio_direccion").text(comercio.direccion);
					$("#ficha_comercio_telefono").text(comercio.telefono);
					$("#ficha_ver_comercio_mapa").html('<span onclick="app.navi.pushPage(\'mapa.html\',{ mapa: \'True\',comercio_id: \''+comercio.id_comercio+'\'});" >Ver en el mapa </span>');
				}else{
					console.log("Sin resultados");
				}
			}, bbdd.errorCB);
		});
	},
	
};

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
					console.log("Añadimos "+comercio.id_comercio+" "+comercio.nombre);
					$("#ficha_comercio_nombre").text(comercio.nombre);
					$("#ficha_comercio_direccion").text(comercio.direccion);
					$("#ficha_comercio_telefono").text(comercio.telefono);
					$("#ficha_comercio_web").html("<a href='http://pronosticadores.net/ficha.php?id="+comercio.id_comercio+"'>web</a>");
				}else{
					console.log("Sin resultados");
				}
			}, bbdd.errorCB);
		});
	},
	
};

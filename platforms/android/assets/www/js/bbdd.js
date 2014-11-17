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
			//~ tx.executeSql('DROP TABLE IF EXISTS DEMO');
			tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY, data)');
			bbdd.populateDB();
		});
	},
	// Populate the database 
    populateDB: function () {
        console.log("Añadimos datos");
		bbdd.db.transaction(function(tx){
			for (i = 0; i < 50; i++) {
				tx.executeSql('INSERT INTO DEMO (data) VALUES ("Another row")');
			}
			
		}); 
         
    },
    
	checkDB: function (tx) {
		console.log("Somos checkDB");
        tx.executeSql('SELECT * FROM DEMO', [],function (tx, results) {
			if (results.rows.length>0) {
				console.log("La BBDD ya existe");
			}else{
				console.log("Creamos la BBDD");
				bbdd.createBD();
			}
		}, bbdd.errorCB);
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
			consulta = "SELECT * FROM DEMO WHERE categoria = "+categoria;
		} else {
			consulta = "SELECT * FROM DEMO";
		}
		console.log("El sql es: "+consulta);
		bbdd.db.transaction(function(tx){
			tx.executeSql(consulta, [],function (tx, results) {
				if (results.rows.length>0) {
					console.log("Vamos a rellenar la lista");
					var len = results.rows.length, i;
					for (i = 0; i < len; i++) {
						console.log("Añadimos "results.rows.item(i).data);
						$("#listado_comercios").append('<ons-list-item>Comercio '+i+' '+results.rows.item(i).data+'</ons-list-item>');
					}

					
				}else{
					console.log("Sin resultados");
				}
			}, bbdd.errorCB);
		});
	},
	
};
 

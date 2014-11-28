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

var iconos = {
	 alimentacion: L.icon({
					iconUrl: 'img/alimentacion_marker-icon.png',
					iconRetinaUrl: 'img/alimentacion_marker-icon-2x.png',
					iconSize: [23, 28],
					iconAnchor: [22, 94],
					popupAnchor: [-3, -76],
					shadowUrl: 'img/marker-shadow.png',
					shadowRetinaUrl: 'img/marker-shadow.png',
					shadowSize: [23, 28],
					shadowAnchor: [22, 94]
				}),
	 ropa: L.icon({
					iconUrl: 'img/ropa_marker-icon.png',
					iconRetinaUrl: 'img/ropa_marker-icon-2x.png',
					iconSize: [23, 28],
					iconAnchor: [22, 94],
					popupAnchor: [-3, -76],
					shadowUrl: 'img/marker-shadow.png',
					shadowRetinaUrl: 'img/marker-shadow.png',
					shadowSize: [23, 28],
					shadowAnchor: [22, 94]
				}),
	artesania: L.icon({
					iconUrl: 'img/ropa_marker-icon.png',
					iconRetinaUrl: 'img/ropa_marker-icon-2x.png',
					iconSize: [23, 28],
					iconAnchor: [22, 94],
					popupAnchor: [-3, -76],
					shadowUrl: 'img/marker-shadow.png',
					shadowRetinaUrl: 'img/marker-shadow.png',
					shadowSize: [23, 28],
					shadowAnchor: [22, 94]
				}),
	restaurantes: L.icon({
					iconUrl: 'img/ropa_marker-icon.png',
					iconRetinaUrl: 'img/ropa_marker-icon-2x.png',
					iconSize: [23, 28],
					iconAnchor: [22, 94],
					popupAnchor: [-3, -76],
					shadowUrl: 'img/marker-shadow.png',
					shadowRetinaUrl: 'img/marker-shadow.png',
					shadowSize: [23, 28],
					shadowAnchor: [22, 94]
				}),
}
var mapa = {
	add_markers: function (tx, results) {
				var len = results.rows.length;
				console.log("Hemos encontrado "+len+" comercios");		
				if (len>0) {
					console.log("Vamos a añadir los marcadores");
					for (i = 0; i < len; i++) {
						comercio = results.rows.item(i);
						console.log("Añadimos "+comercio.id_comercio+" al mapa en ["+comercio.latitud+","+comercio.longitud+"]");
						popup_texto = "<div onclick='app.navi.pushPage(\"ficha.html\", { ficha: \"True\", comercio: \""+comercio.id_comercio+"\"})';>"+comercio.nombre+" "+comercio.telefono+"</div>";
						//console.log(popup_texto);
						L.marker([comercio.longitud, comercio.latitud],{icon: iconos.alimentacion}).addTo(app.map).bindPopup(popup_texto);
					}
					console.log("Marcadores listos");
				}else{
					console.log("Sin resultados");
				}
				},
}



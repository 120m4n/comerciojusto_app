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

var LeafIcon = L.Icon.extend({
			options: {
				shadowUrl: 'img/marker-shadow.png',
				iconSize:     [38, 95],
				shadowSize:   [50, 64],
				iconAnchor:   [22, 94],
				shadowAnchor: [4, 62],
				popupAnchor:  [-3, -76]
			}
		});
				
var mapa = {
	add_markers: function (tx, results) {
				var len = results.rows.length;
				console.log("Hemos encontrado "+len+" comercios");		
				if (len>0) {
					console.log("Vamos a añadir los marcadores");
					for (i = 0; i < len; i++) {
						comercio = results.rows.item(i);
						
						popup_texto = "<div onclick='app.navi.pushPage(\"ficha.html\", { ficha: \"True\", comercio: \""+comercio.id_comercio+"\"})';>"+comercio.nombre+" "+comercio.telefono+"</div>";
						var icono_alimentacion = new LeafIcon({iconUrl: 'img/alimentacion_marker-icon.png'});
						var icono_artesania = new LeafIcon({iconUrl: 'img/artesania_marker-icon.png'});		
						var icono_otros = new LeafIcon({iconUrl: 'img/otros_marker-icon.png'});
						if (comercio.categoria == '1') {
							icono_seleccionado = icono_alimentacion;
						}
						else if (comercio.categoria == '2') {
							console.log("Usamos el icono de artesania "+comercio.latitud+" "+comercio.longitud);
							icono_seleccionado = icono_artesania;
						}
						else if (comercio.categoria == '3') {
							icono_seleccionado = icono_artesania;
						}
						else if (comercio.categoria == '4') {
							icono_seleccionado = icono_artesania;
						}
						else if (comercio.categoria == '5') {
							icono_seleccionado = icono_artesania;
						}
						else if (comercio.categoria == '6') {
							icono_seleccionado = icono_artesania;
						}
						else if (comercio.categoria == '7') {
							icono_seleccionado = icono_artesania;
						}
						else {
							icono_seleccionado = icono_otros;
						}
						L.marker([comercio.latitud, comercio.longitud],{icon: icono_seleccionado}).addTo(app.map).bindPopup(popup_texto);
					}
					console.log("Marcadores listos");
				}else{
					console.log("Sin resultados");
				}
				},
}



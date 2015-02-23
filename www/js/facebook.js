/*
 * Libería para las funcionaces Facebook usando el plugin https://github.com/Wizcorp/phonegap-facebook-plugin
 * 
 * 
 * 
 */

var facebook = {
	
	initialize: function() {
		console.log("Primero vamos a ver cual es el login status");
		facebookConnectPlugin.getLoginStatus(
			function (response) { 
				console.log("Ha ido bien y tenemos el status");
				//~ alert(JSON.stringify(response))
				console.log(response.status);
				if (response.status == "connected") { 
					console.log("Estamos logeados");
					$("#facebook_div").html('Di que <span class="ion-thumbsup" ></span>');
					$("#facebook_div").click( function() {facebook.like();});
				} else {
					console.log("No Estamos logeados, mostramos el icono de hacer login")
					$("#facebook_div").html('Entra en <span class="ion-social-facebook"></span>');
					$("#facebook_div").click( function() {facebook.login();});
				}
			},
			function (response) { 
				console.log("Ha ido mal");
				alert(JSON.stringify(response)) 
			}
		);
		
		
	},
	//sacado del ejemplo https://github.com/Wizcorp/phonegap-facebook-plugin/blob/master/platforms/android/assets/www/index.html
	login: function() {
		 if (!window.cordova) {
			appId="371506683014644";
			facebookConnectPlugin.browserInit(appId);
		}
		facebookConnectPlugin.login( ["email"],
			function (response) { 
				//~ alert(JSON.stringify(response))
				console.log("Login OK");
				console.log(JSON.stringify(response));
				facebook.initialize();
				},
			function (response) { 
				console.log("Login KO :(");
				console.log(JSON.stringify(response)) 
				}
		);
	
	},
	like: function() {
		console.log("Vamos a hacer LIKE con opengraph");		
		console.log("Primero buscamos el token");
		facebookConnectPlugin.getAccessToken(
			function (token) { 
				console.log("Tenemos el token:");
				URL_TO_LIKE="http://www.etxea.net";
				URL_TO_POST="https://graph.facebook.com/me/og.likes?access_token="+token+"&object="+URL_TO_LIKE
				console.log("Lanzmaos el post a:" + URL_TO_POST)
				console.log(JSON.stringify(token));
				console.log("Hacemos post al like");
				$.post(URL_TO_POST, function( data ) {
					console.log("hemos hecho el post")
					console.log(data);
				}).fail(function() {
					console.log("Error en el POST del like");
				});
				console.log("POST lanzado, pero no sabemos si OK");
			},
			function (response) { 
				console.log("Ha fallado el getAccesToken");
				console.log(JSON.stringify(response));
			}
		);
		
	},
	showDialog: function () {
		facebookConnectPlugin.showDialog( { method: "feed" },
			function (response) { alert(JSON.stringify(response)) },
			function (response) { alert(JSON.stringify(response)) }
		);
	},
	getAccessToken: function () {
		facebookConnectPlugin.getAccessToken(
			function (response) { alert(JSON.stringify(response)) },
			function (response) { alert(JSON.stringify(response)) }
		);
	},
	
	getStatus: function () {
		facebookConnectPlugin.getLoginStatus(
		function (response) { alert(JSON.stringify(response)) },
		function (response) { alert(JSON.stringify(response)) });
	},
	
	logout: function () {
		facebookConnectPlugin.logout(
			function (response) { alert(JSON.stringify(response)) },
			function (response) { alert(JSON.stringify(response)) }
		);
	},
	
	apiTest: function() {
		facebookConnectPlugin.api( "me/?fields=id,email", ["user_birthday"],
			function (response) { alert(JSON.stringify(response)) },
			function (response) { alert(JSON.stringify(response)) }
			); 
	},
	
	getLikes: function() {
	},
	
	likeIt: function() {
	}
}

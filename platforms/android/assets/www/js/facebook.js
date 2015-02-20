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
					$("#facebook_div").text("Me gusta!");
					$("#facebook_div").click( function() {facebook.like();});
				} else {
					console.log("No Estamos logeados, mostramos el icono de hacer login")
					$("#facebook_div").text("Login en facebook");
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
		facebookConnectPlugin.login( ["email","publish_actions"],
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
				console.log("tenemos el token:");
				URL_TO_LIKE="http://www.etxea.net";
				console.log(JSON.stringify(token));
				$.post( "https://graph.facebook.com/me/og.likes?access_token="+token+"&object="+URL_TO_LIKE, function( data ) {
					console.log("hemos hecho el post")
					console.log(data);
				});
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

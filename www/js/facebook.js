/*
 * Libería para las funcionaces Facebook usando el plugin https://github.com/Wizcorp/phonegap-facebook-plugin
 * 
 * 
 * 
 */

var facebook = {
	
	initialize: function() {
		console.log("Abrimos la Conexion a facebook");
		
		
	},
	//sacado del ejemplo https://github.com/Wizcorp/phonegap-facebook-plugin/blob/master/platforms/android/assets/www/index.html
	login: function() {
		 if (!window.cordova) {
			appId="371506683014644";
			facebookConnectPlugin.browserInit(appId);
		}
		facebookConnectPlugin.login( ["email"],
			function (response) { alert(JSON.stringify(response)) },
			function (response) { alert(JSON.stringify(response)) }
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

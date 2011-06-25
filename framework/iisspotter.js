
var phonegap = new PhoneGap();
//must call this to let the device know that the app is ready
navigator.device.deviceReady();

function dashboard() {
    navigator.notification.newDashboard("dashboard.html");
}

function info() {
	var deviceinfo = JSON.stringify(navigator.device.getDeviceInfo()).replace(/,/g, ', ');
	page('info');
	lastpage.innerHTML = deviceinfo;
}

function net() {
	page('net');
	var netpage = lastpage;
	netpage.innerHTML = "Requesting network info...";
	
	function successful(response) {
		
		var states = {};
		        states[NetworkStatus.NOT_REACHABLE]                      = 'No network connection';
		        states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'Carrier data connection';
		        states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK]         = 'WiFi connection';
		
		
		var r = JSON.stringify(states[response]);
		netpage.innerHTML = r.replace(/,/g, ', ');
	}
	
	var request = navigator.network.isReachable('palm://com.palm.connectionmanager', successful, {});
}

function displayCurrentOrientation() {
	navigator.notification.showBanner(navigator.orientation.getCurrentOrientation(), 'current orientaiton'); 
}	

function getPicture() {
	page('camera');
	var cameraPage = lastpage;
	lastpage.innerHTML = "camera application should launch if this works";
	
	function onSuccessCallback(response) {
		console.log("camera launched successfully");
		navigator.notification.showBanner("camera launched successfully");
	}
	
	function onErrorCallback(response) {
		console.log("camera failed to launch");
		navigator.notification.showBanner("camera failed to launch");
	}
	
	navigator.camera.getPicture(onSuccessCallback, onErrorCallback);
}

window.addEventListener("palmsystem", function(e) {
	console.log("system message: " + JSON.stringify(e.data));
});

window.addEventListener("appmenuopen", function() {
	menu(true);
});

window.addEventListener("back", function() {
	console.log("back gesture");
});

window.addEventListener("forward", function() {
	console.log("forward gesture");
});

function menu() {
	var menudiv = document.getElementById('menu');
	if (typeof state == 'undefined')
		var state = (menudiv.style.display != 'block');
		
	menudiv.style.display = state ? 'block' : 'none';
}

lastreq = null;
function launchmap() {
	navigator.map.show();
	menu(false);
}

var lastpage = document.getElementById('screen');
function page(id) {
	lastpage.style.display = 'none';
	lastpage = document.getElementById(id);
	lastpage.style.display = 'block';
	menu(false);
}


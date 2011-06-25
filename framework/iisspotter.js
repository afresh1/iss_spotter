
var phonegap = new PhoneGap();

//must call this to let the device know that the app is ready
navigator.device.deviceReady();

function dashboard() {
    //navigator.notification.newDashboard("dashboard.html");
}

function info() {
	var deviceinfo = JSON.stringify(navigator.device.getDeviceInfo()).replace(/,/g, ', ');
	page('info');
	lastpage.innerHTML = deviceinfo;
}

function menu() {
	var menudiv = document.getElementById('menu');
	if (typeof state == 'undefined')
		var state = (menudiv.style.display != 'block');
		
	menudiv.style.display = state ? 'block' : 'none';
}

lastreq = null;

var lastpage = document.getElementById('screen');

function onError(error) {
        var element = document.getElementById('geolocation');
        element.innerHTML = 'error getting location.';
}

function onLoad() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {
        var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            'Heading: '            + position.coords.heading               + '<br />' +
                            'Speed: '              + position.coords.speed                 + '<br />' +
                            'Timestamp: '          + new Date(position.timestamp)          + '<br />';
}

// PhoneGap is ready
function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
}



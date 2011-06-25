/* 
 * issSpotter - Get the next visible ISS Passes from heavens-above.com
*/
var issSpotter = function() {
	var lastreq = null;
	var lastpage = document.getElementById('screen');
	var phonegap = new PhoneGap();

	var getPasses = function(lat,lng,callback) {
		var url = "http://heavens-above.com/PassSummary.aspx"
		    + "?satid=25544&tz=UCT"
		    + "&lat=" + lat
		    + "&lng=" + lng;
		
		console.log(url);
		joFile(url, function(data, error) {
			if (error) {
				console.log("error loading file");
				return;
			}
			if (callback) {
				callback( parsePasses(data) );
			} 
			else {
				console.log(parsePasses(data));
			}
		});
	};

	var parsePasses = function(cl) {
		var page = document.createElement('div');
		page.innerHTML = cl;

		var rows = page.getElementsByTagName('table')[3]
		    .getElementsByTagName('tr');

		var i, j, cells, content, pass, passes = [];
		var time, d = new Date();
		var year = d.getUTCFullYear();

		var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		var months_to_int = {};
		for (i = 0; i < months.length; i++) {
			months_to_int[ months[i] ] = i;
		}

		for (i = 2; i < rows.length; i++) {
			pass = { start: {}, max: {}, end: {} };
			cells = rows[i].getElementsByTagName('td');
			for (j = 0; j < cells.length; j++) {
				content = cells[j].innerText.trim();
				switch (j) {
					case 0:
						pass['link'] = cells[j]
					    		.getElementsByTagName('a')[0]
					    		.getAttribute('href');
						pass.date = content.split(' ');
						pass.date[1] = months_to_int[ pass.date[1] ];
					case 1:
						pass.mag = content;
					case 2:
						time = content.split(':');
						pass.start.time = Date.UTC(year, pass.date[1], pass.date[0], time[0], time[1], time[2], 0);
					case 3:
						pass.start.alt = content;
					case 4:
						pass.start.az = content;
					case 5:
						time = content.split(':');
						pass.max.time = Date.UTC(year, pass.date[0], pass.date[1], time[0], time[1], time[2], 0);
					case 6:
						pass.max.alt = content;
					case 7:
						pass.max.az = content;
					case 8:
						time = content.split(':');
						pass.end.time = Date.UTC(year, pass.date[0], pass.date[1], time[0], time[1], time[2], 0);
					case 9:
						pass.end.alt = content;
					case 10:
						pass.end.az = content;
				}
			}
			passes.push(pass);
		}

		return passes;
	};



//function dashboard() {
    //navigator.notification.newDashboard("dashboard.html");
//}

	var info = function() { 
		var deviceinfo = JSON.stringify(navigator.device.getDeviceInfo()).replace(/,/g, ', ');
		page('info');
		lastpage.innerHTML = deviceinfo;
	};

	var menu = function() {
		var menudiv = document.getElementById('menu');
		if (typeof state == 'undefined')
			var state = (menudiv.style.display != 'block');
			
		menudiv.style.display = state ? 'block' : 'none';
	};


	var onError = function(error) {
		var element = document.getElementById('geolocation');
		element.innerHTML = 'error getting location.';
	};

	var onGetPositionSuccess = function(position) {
		var element = document.getElementById('geolocation');
		element.innerHTML = '<p>Latitude: '           + position.coords.latitude              + '<br />' +
				    'Longitude: '          + position.coords.longitude             + '<br />' +
				    'Altitude: '           + position.coords.altitude              + '<br />' +
				    'Accuracy: '           + position.coords.accuracy              + '<br />' +
				    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
				    'Heading: '            + position.coords.heading               + '<br />' +
				    'Speed: '              + position.coords.speed                 + '<br />' +
				    'Timestamp: '          + new Date(position.timestamp)          + '<br /></p>';

		getPasses( position.coords.latitude, position.coords.longitude, function(times) {
			var i, t;
			console.log(times);
			for (i = 0; i < times.length; i++) {
				t = times[i];
				element.innerHTML += "<hr /><p>"
				            + "Start: " + new Date(t.start.time) + ' Altitude: ' + t.start.alt + ' Azimuth: ' + t.start.az + '<br />'
				            + "Max: " + new Date(t.max.time) + ' Altitude: ' + t.max.alt + ' Azimuth: ' + t.max.az + '<br />'
				            + "End: " + new Date(t.end.time) + ' Altitude: ' + t.end.alt + ' Azimuth: ' + t.end.az + '<br />'
				            + "</p>";
			}
		});

	}

	// PhoneGap is ready
	//function onDeviceReady() {
	//	navigator.geolocation.getCurrentPosition(onGetPositionSuccess, onError);
	//}

	var onLoad = function() {
		navigator.device.deviceReady();
		jo.load();
		navigator.geolocation.getCurrentPosition(onGetPositionSuccess, onError);
		//must call this to let the device know that the app is ready
	}

	return {
		onLoad: onLoad,
		getPasses: getPasses,
		info: info
	};

}
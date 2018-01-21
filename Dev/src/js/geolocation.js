function getCurrentLocation() {
	return new Promise(function (resolve, reject) {
		let options = {
			enableHighAccuracy: true,
			timeout: 15000,
			maximumAge: 0
		};
		function gpsSuccess(position) {
			resolve(position);
		}
		function gpsError(error) {
			reject(error);
		}
		navigator.geolocation.getCurrentPosition(gpsSuccess, gpsError, options) ;
	});
}

function getDistanceInFeet(lat1, lon1, lat2, lon2) {
	let radlat1 = Math.PI * lat1 / 180;
	let radlat2 = Math.PI * lat2 / 180;
	let theta = lon1 - lon2;
	let radtheta = Math.PI * theta / 180;
	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	return dist * 5280;
}
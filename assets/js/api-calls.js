// Link Storage Delete Later
// const geoApi = `https://maps.googleapis.com/maps/api/geocode/json?address=${homeLocation}&key=AIzaSyA6_fb9VakKHBcqkyryNKgwbmO6CsVGGnQ`;
// const parkApiParks = "https://developer.nps.gov/api/v1/parks";
// const parkApiCamp = "https://developer.nps.gov/api/v1/campgrounds";
// const parkKey = "nQU50CkQwFxE1hsRuWF2bTdGUZVlHWhfKj0MTDsN";
const weatherApi = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?locations=${parkLat},${parkLon}&alertLevel=true&aggregateHours=24&unitGroup=us&contentType=json&key=SJJYSNFMDHASY352EUXQKNUP4`


// Fetch coordinates from Zip Code
const getLocation = function(input) {
    const homeLocation = input.trim();
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${homeLocation}&key=AIzaSyA6_fb9VakKHBcqkyryNKgwbmO6CsVGGnQ`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        const homeCoords = {
            name: homeLocation,
            lat: data.results[0].geometry.location.lat,
            lon: data.results[0].geometry.location.lng
        }
        // ! REMOVE CONSOLE LOG
        console.log(homeCoords);
        parkLocation(homeCoords);
    })
}

// Fetch park coordinates and names
const parkLocation = function(home) {
    fetch('https://developer.nps.gov/api/v1/parks?limit=1000', {
        headers: {
            "X;Api-Key": "nQU50CkQwFxE1hsRuWF2bTdGUZVlHWhfKj0MTDsN"
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // ! REMOVE CONSOLE LOG
        console.log(data);
        // Create Park Data Array
        const parkData = [];
        for (park of data.data) {
            // ? Possibly filter by designation
            const parkInfo = {
                name: park.name,
                lat: park.latitude,
                lon: park.longitude,
                description: park.description,
                address: park.addresses[0]
            }
            parkData.push(parkInfo);
        }
        // ! REMOVE CONSOLE LOG
        console.log(parkData);
        parkSorting(home, parkData);
    })
}

// Create and sort by Distance property on parks
const parkSorting = function(homeCoords, parkData) {
    for (i = 0; i < parkData.length; i++) {
        const latDist = homeCoords.lat - parkData[i].lat;
        const lonDist = homeCoords.lon - parkData[i].lon;
        parkData[i].distance = Math.sqrt(latDist * latDist + lonDist * lonDist);
    }
    // ! REMOVE CONSOLE LOG
    console.log(parkData);
    // TODO: Sort by Distance
}

// get rainfall on closest 4-10 parks



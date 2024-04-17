// Link Storage Delete Later
// const geoApi = `https://maps.googleapis.com/maps/api/geocode/json?address=${homeLocation}&key=AIzaSyA6_fb9VakKHBcqkyryNKgwbmO6CsVGGnQ`;
// const parkApiParks = "https://developer.nps.gov/api/v1/parks";
// const parkApiCamp = "https://developer.nps.gov/api/v1/campgrounds";
// const parkKey = "nQU50CkQwFxE1hsRuWF2bTdGUZVlHWhfKj0MTDsN";
// const weatherApi = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timelinemulti?locations=${locationParameter}&include=days,alerts&datestart=${startDate}&dateend=${endDate}&unitGroup=us&contentType=json&key=SJJYSNFMDHASY352EUXQKNUP4`

const parkData = [];  // was between 42 and 43

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
        console.log('get location', homeCoords);
        parkLocation(homeCoords);
    })
}

// Fetch park coordinates and names
const parkLocation = function(home) {
    fetch('https://developer.nps.gov/api/v1/parks?limit=1000', {
        headers: {
            "X-Api-Key": "nQU50CkQwFxE1hsRuWF2bTdGUZVlHWhfKj0MTDsN"
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // ! REMOVE CONSOLE LOG
        console.log('park location data', data);
        // Create Park Data Array
        for (park of data.data) {
            // ? Possibly filter by designation
            const parkInfo = {
                name: park.name,
                lat: park.latitude,
                lon: park.longitude,
                description: park.description,
                address: park.addresses[0],
                parkCode: park.parkCode
            }
            parkData.push(parkInfo);
        }
        // ! REMOVE CONSOLE LOG
        console.log('filled parkData array', parkData);
        parkSorting(home, parkData);
        getWeather(parkData);
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
    console.log('parkData with distance', parkData);
    parkData.sort((a, b) => a.distance - b.distance)
    console.log('sorted parkData', parkData);
    parkData.splice(5, parks.length - 5)
    console.log('reduced parkData', parkData);
}

// get rainfall on closest 4-10 parks
const getWeather = function(parkData) {
    let locationParameter = '';
    for (park of parkData) {
        locationParameter = locationParameter.concat(`|${park.lat},${park.lon}`);
        park.parkWeather = {};
    }
    locationParameter = locationParameter.slice(1);
    let weatherURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timelinemulti?locations=${locationParameter}&include=days,alerts&datestart=${startDate}&dateend=${endDate}&unitGroup=us&contentType=json&key=SJJYSNFMDHASY352EUXQKNUP4`;
    fetch(weatherURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Creates and overwrites data
        // ! DELETE CONSOLE LOG
        console.log('weather data', data)

        for (i = 0; i < parkData.length; i++) {
            for (j = 0; j < data.locations[i].days.length; j++) {
                if (!parkData[i].parkWeather.chance || parkData[i].parkWeather.chance < data.locations[i].days[j].precipprob) {
                    parkData[i].parkWeather.chance = data.locations[i].days[j].precipprob;
                    parkData[i].parkWeather.cover = data.locations[i].days[j].precipcover;
                    parkData[i].parkWeather.amount = data.locations[i].days[j].precip;
                    parkData[i].parkWeather.date = data.locations[i].days[j].datetime;
                }
            }
        }
    })
    .then(function() {
        // ! DELETE CONSOLE LOG
        console.log(parkData)
    })
}



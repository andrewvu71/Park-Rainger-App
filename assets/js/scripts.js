const parkData = [];

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
    parkData.sort((a, b) => a.distance - b.distance);
    // * Sets the number of parks to check for rain
    parkData.splice(4, parkData.length - 4);
    i = 0;
}

// get rainfall on closest 4-10 parks
const getWeather = function(parkData) {
    let locationParameters = [];
    let weatherResponses = [];
    const weatherAPIs = ['qQTBSY3Cb9QKTcgXFfM6EDZWjnv5C33m', 'uN7jDJ5liRJytxbbSjcQUEkYYQqa6qOd', '2u3FDpARrZjayBFQDHe5WIJm45yt0y0G'];
    weatherAPIs.push(...weatherAPIs);
    for (park of parkData) {
        locationParameters.push(`${park.lat},${park.lon}`);
        park.parkWeather = {
            chance: '',
            amount: '',
            date: ''
        };
    }
    let loopFetch = setInterval(function() {
        if (!i) {
            let i = 0;
        }
        let weatherURL = `https://api.tomorrow.io/v4/weather/forecast?location=${locationParameters[i]}&timesteps=1d&units=imperial&apikey=${weatherAPIs[i]}`;
        weatherResponses.push(fetch(weatherURL));
        i++;
        if (i >= locationParameters.length) {
            clearInterval(loopFetch);
        }
    }, 350)
    let fetchTimer = 350 * locationParameters.length + 10;
    
    setTimeout(() => {Promise.all(weatherResponses)
        .then(function(responses) {
            const parsedResponses = [];
            for (i = 0; i < weatherResponses.length; i++) {
                let response = responses[i].json();
                parsedResponses.push(response);
            }
            Promise.all(parsedResponses)
            .then(function(data) {
                // Creates and overwrites data
                for (i = 0; i < data.length; i++) {
                    for (j = 0; j < data[i].timelines.daily.length; j++) {
                        if (!parkData[i].parkWeather.chance || parkData[i].parkWeather.chance < data[i].timelines.daily[j].values.precipitationProbabilityMax) {
                            parkData[i].parkWeather.chance = data[i].timelines.daily[j].values.precipitationProbabilityMax;
                            parkData[i].parkWeather.amount = data[i].timelines.daily[j].values.rainAccumulationSum;
                            parkData[i].parkWeather.date = data[i].timelines.daily[j].time;
                        }
                    }
                }
                parkData.sort((a, b) => b.parkWeather.chance - a.parkWeather.chance)
                // ! REMOVE CONSOLE LOGS
                console.log('sorted by weather', parkData)
                if (parkData.length > 4) {
                    parkData.splice(4, parkData.length - 4)
                }

            })
        })
    }, fetchTimer)
}

// Link Storage Delete Later
const geoApi = `https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=AIzaSyA6_fb9VakKHBcqkyryNKgwbmO6CsVGGnQ`;
const parkApiParks = "https://developer.nps.gov/api/v1/parks";
const parkApiCamp = "https://developer.nps.gov/api/v1/campgrounds";
const parkKey = "nQU50CkQwFxE1hsRuWF2bTdGUZVlHWhfKj0MTDsN";
const weatherApi = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?locations=${parkLat},${parkLon}&alertLevel=true&aggregateHours=24&unitGroup=us&contentType=json&key=SJJYSNFMDHASY352EUXQKNUP4`


// Fetch coordinates from Zip Code

// Fetch park coordinates and names

// Create Distance property on parks
for (i = 0; i < parkData.length; i++) {
    const latDist = homeCoords.lat - parkData[i].lat;
    const lonDist = homeCoords.lon - parkData[i].lon;
    parkData[i].distance = Math.sqrt(latDist * latDist + lonDist * lonDist);
}

// Sort by Distance

// get rainfall on closest 4-10 parks
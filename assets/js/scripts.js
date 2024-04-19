//Declaring variables

const modal= document.getElementById('modal1');
const btnSearch= document.getElementById('btnSearch');
const weatherCards= document.getElementById('weatherCard');
const zipcode= document.getElementById('txtZipcode');
const parentDivId= document.getElementById('parentDiv');
const resultsTitle= document.getElementById('results-title');

const parkData = [];


function getParkDetails(event)
{ 
    event.preventDefault();
    
    //this condition is to reset elements in modal. It deletes all previous elements in modal 
    if(modal.hasChildNodes)
    {
        modal.replaceChildren("");
    }
    
    // Selects the specific 
    const cardID = event.target.getAttribute('id')
    const parkIndex = cardID.charAt(cardID.length - 1);
    //create modal elements
    const divModal = document.createElement("div");
    
    divModal.classList.add("modal-content");
    
    const h2 = document.createElement("h2");
    h2.textContent="Park Details";
    divModal.append(h2);
    const modalParkName = document.createElement("h4")
    modalParkName.textContent = parkData[parkIndex].name;
    divModal.append(modalParkName);
    const address = document.createElement("h5");
    address.textContent="Address";
    divModal.append(address);
    const addressLine1 = document.createElement("h6");
    addressLine1.textContent= parkData[parkIndex].address.line1;
    divModal.append(addressLine1);
    const city= document.createElement("h6");
    city.textContent=parkData[parkIndex].address.city;
    divModal.append(city);
    const postalCode= document.createElement("h6");
    postalCode.textContent=parkData[parkIndex].address.postalCode;
    divModal.append(postalCode);
    
    const parkInfo = document.createElement("h5");
    parkInfo.textContent="Park Description";
    divModal.append(parkInfo);
    const parkInfoDetails = document.createElement("h6");
    parkInfoDetails.textContent=parkData[parkIndex].description;
    divModal.append(parkInfoDetails);
    const direction = document.createElement("h5");
    divModal.append(direction);
    const directionURL= document.createElement("a");
    directionURL.textContent="Click here for directions.";
    directionURL.setAttribute("href", parkData[parkIndex].directions);
    directionURL.setAttribute("target", "_blank");
    divModal.append(directionURL);
    modal.append(divModal);
    //footer
    const footerDiv= document.createElement("div");
    footerDiv.classList.add("modal-footer");
    
    modal.append(footerDiv);
    const closeButton= document.createElement("a");
    closeButton.classList.add("modal-close");
    closeButton.classList.add("waves-effect");
    closeButton.classList.add("waves-green");
    closeButton.classList.add("btn-flat");
    closeButton.textContent="Close";
    footerDiv.append(closeButton);
    
    var instance = M.Modal.init(modal);
    
    instance.open();
}


// function getWeatherDetails(chance,amount,date,name,image)
function getWeatherDetails(parkData)
{
    for (i = 0; i < parkData.length; i++) {
        const cardDiv= document.createElement("div");
        cardDiv.innerHTML=`
        <div>
            <div class="col s12 m6">
                <div class="card">
                    <div class="card-image">
                        <img src=${parkData[i].image}>
                    </div>
                    <div class="card-content">
                        <h5 class="center-align">${parkData[i].name}</h5>
                        <h5>Rain Chance: ${parkData[i].parkWeather.chance}%</h5>
                        <h5>Rain Amount: ${parkData[i].parkWeather.amount} inches</h5>
                        <h5>Rain Date:${parkData[i].parkWeather.date}</h5>
                    </div>
                    <div class="card-action center-align">
                        <button id="park-card-${i}" class="btnParkDetail btn waves-effect">Click here for more details!</button>
                    </div>
                </div>
            </div>
        </div>`;
        
        parentDivId.append(cardDiv);  
        cardButton = document.getElementById(`park-card-${i}`);
        cardButton.addEventListener('click', getParkDetails);
    }    
}


// Fetch coordinates from Zip Code
const getLocation = function(event) {
    event.preventDefault();
    
    resultsTitle.textContent = "Finding parks near you with rain..."
    const homeLocation = zipcode.value.trim();
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
                directions:park.directionsUrl,
                image:park.images[0].url,
                altText:park.images[0].altText,
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
    // * Sets the number of nearby parks to check for rain.  Must be at least 4
    parkData.splice(8, parkData.length - 8);
}

// get rainfall on closest 4-10 parks
const getWeather = function(parkData) {
    let locationParameters = [];
    let weatherResponses = [];
    const weatherAPIs = ['qQTBSY3Cb9QKTcgXFfM6EDZWjnv5C33m', 'uN7jDJ5liRJytxbbSjcQUEkYYQqa6qOd', '2u3FDpARrZjayBFQDHe5WIJm45yt0y0G', 'JFoUCG4Lux9sxayhPg37yW2OddUq8NGO'];
    weatherAPIs.push(...weatherAPIs);
    for (park of parkData) {
        locationParameters.push(`${park.lat},${park.lon}`);
        park.parkWeather = {
            chance: '',
            amount: '',
            date: ''
        };
    }
    for (i = 0; i < locationParameters.length; i++) {
        let weatherURL = `https://api.tomorrow.io/v4/weather/forecast?location=${locationParameters[i]}&timesteps=1d&units=imperial&apikey=${weatherAPIs[i]}`;
        weatherResponses.push(fetch(weatherURL));
    }

    Promise.all(weatherResponses)
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
                if (parkData.length > 4) {
                    parkData.splice(4, parkData.length - 4)
                }
                resultsTitle.textContent = "National Parks with Rain in their Forecast"
                getWeatherDetails(parkData);
            })
        })
}

btnSearch.addEventListener('click',getLocation);


//Declaring variables

//const cardLink= document.getElementById('modalLink');
const modal= document.getElementById('modal1');
const btnSearch= document.getElementById('btnSearch');
const weatherCards= document.getElementById('weatherCard');

const parkData = [];


function getParkDetails(event)
{ 
    event.preventDefault();

    // TODO: Change this line to select based on which card was clicked
    let parkIndex = 0;
    //this condition is to reset elements in modal. It deletes all previous elements in modal 
    if(modal.hasChildNodes)
    {
        modal.replaceChildren("");
    }

    //create modal elements
    const divModal = document.createElement("div");
    
    divModal.classList.add("modal-content");
    
    const h2 = document.createElement("h2");
    h2.textContent="Park Details";
    divModal.append(h2);
    const modalParkName = document.createElement("h6")
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
    directionURL.setAttribute('href', parkData[parkIndex].directions);
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


function getWeatherDetails()
{
  const divcard = document.createElement("div");
  divcard.classList.add("card");
  weatherCards.append(divcard);
  const cardImagediv = document.createElement("div");
  cardImagediv.classList.add("card-image");
  divcard.append(cardImagediv);
  const cardImage = document.createElement("img");
  cardImage.src='./assets/Images/sample-1.jpg';
  cardImagediv.append(cardImage);
  const cardTitle = document.createElement("span");
  cardTitle.classList.add('card-title');
  cardTitle.textContent="Card Title" //add park name here from API
  cardImagediv.append(cardTitle);
  
  const cardContent= document.createElement("div");
  cardContent.classList.add('card-content');
  divcard.append(cardContent);
  const cardWeather= document.createElement("h3");
  cardWeather.textContent='I am a very simple card. I am good at containing small bits of information.';
  cardContent.append('cardWeather');
  
  const cardAction= document.createElement("div");
  cardAction.classList.add('card-action');
  divcard.append(cardAction);
  
  const cardLink= document.createElement("a");
  cardLink.id='modalLink';
  cardLink.classList.add('waves-effect');
  cardLink.classList.add('waves-teal');
  cardLink.classList.add('btn-flat');
  cardLink.textContent='Click here to know more';
  cardLink.addEventListener('click',getParkDetails);
  cardAction.append(cardLink);
}


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
    // * Sets the number of parks to check for rain
    parkData.splice(4, parkData.length - 4);
    i = 0;
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

// btnSearch.addEventListener('click',getWeatherDetails);
cardButton = document.getElementById('card-1');
cardButton.addEventListener('click', getParkDetails);



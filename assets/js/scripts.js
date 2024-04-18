//Declaring variables

//const cardLink= document.getElementById('modalLink');
const modal= document.getElementById('modal1');
const btnSearch= document.getElementById('btnSearch');
const weatherCards= document.getElementById('weatherCard');

const  APIKey = 'X4cFIkirB6EJTJYaTubCtg5RgOouTq1luIm4p0IB';
let parkCode='abli';
let requestUrl = 'https://developer.nps.gov/api/v1/parks';


function getParkDetails()
{ 
    event.preventDefault();
    requestUrl =`https://developer.nps.gov/api/v1/parks?ParkCode=${parkCode}&api_key=${APIKey}`;
    fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
         
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
         const address = document.createElement("h5");
         address.textContent="Address";
         divModal.append(address);
         const addressLine1 = document.createElement("h6");
         addressLine1.textContent= data.data[0].addresses[0].line1;
         divModal.append(addressLine1);
         const city= document.createElement("h6");
         city.textContent=data.data[0].addresses[0].city;
         divModal.append(city);
         const postalCode= document.createElement("h6");
         postalCode.textContent=data.data[0].addresses[0].postalCode;
         divModal.append(postalCode);
         const weatherInfo = document.createElement("h5");
         weatherInfo.textContent="WeatherDetails";
         divModal.append(weatherInfo);
         const weatherInfoDetails = document.createElement("h6");
         weatherInfoDetails.textContent=data.data[0].weatherInfo;
         divModal.append(weatherInfoDetails);
         const direction = document.createElement("h5");
         direction.textContent="For direction visit the below link";
         divModal.append(direction);
         const directionURL= document.createElement("a");
         directionURL.textContent=data.data[0].directionsUrl;
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

       
        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      console.log(error.statusText);
    });
    
   
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

btnSearch.addEventListener('click',getWeatherDetails);




//Declaring variables

const cardLink= document.getElementById('modalLink');
const modal= document.getElementById('modal1');

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
         //add code to display details in modal
         const divModal = document.createElement("div");
         divModal.classList.add("modal-content");
       
         const h2 = document.createElement("h2");
         h2.textContent="Park Details";
         divModal.append(h2);
         const addressLine1 = document.createElement("h5");
         addressLine1.textContent= data.data[0].addresses[0].line1;
        
         divModal.append(addressLine1);
         const city= document.createElement("h5");
         city.textContent=data.data[0].addresses[0].city;
         divModal.append(city);
         const postalCode= document.createElement("h5");
         postalCode.textContent=data.data[0].addresses[0].postalCode;
         divModal.append(postalCode);
         const directionURL= document.createElement("h5");
         directionURL.textContent=data.data[0].addresses[0].directionsUrl;
         divModal.append(directionURL);
         const WeatherInfo = document.createElement("h5");
         WeatherInfo.textContent=data.data[0].addresses[0].weatherInfo;
         divModal.append(WeatherInfo);
         modal.append(divModal);
         //Open Modal with park details
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

cardLink.addEventListener('click',getParkDetails);



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



cardLink.addEventListener('click',getParkDetails);



const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = '7979fa4287949928b56473d08d015c0f';

// Making input & search button interactive on click, if statement to prevent empty output, blur to unfocus
searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() !== '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
    }
})

// Making input interactive when user click on 'Enter' same functionality as above
cityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' &&
        cityInput.value.trim()) {
            updateWeatherInfo(cityInput.value);
            cityInput.value = '';
            cityInput.blur();
        }  
});


//Using async(promise) to wait for the response/data from the openWeather API. 
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric&lang=cz`;

    
    const response = await fetch(apiUrl);
    
    return response.json();
}
       
//Assining correct icon to different weather situations through id 
function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg';
    if(id <= 321) return 'drizzle.svg';
    if(id <= 531) return 'rain.svg';
    if(id <= 622) return 'snow.svg';
    if(id <= 781) return 'atmosphere.svg';
    if(id === 800) return 'clear.svg';
    else return 'clouds.svg';  
}
// Getting the current date with Date object, translating the time to czech version
function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit'
    }
    return currentDate.toLocaleDateString('cz-CZ',options)
}
// Function which accepts the city parametr that user inputs and through api it gets the precise data of wheater or forecast
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if(weatherData.cod !== 200) {
        showDisplaySection(notFoundSection);
        return 
    }
    //Destructuring the data from weatherData. Using it to generate DOM
    const {
        name: country,
        main: {temp, humidity},
        weather: [{ id, description}],
        wind: {speed}
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + '°C';
    conditionTxt.textContent = description;
    humidityValueTxt.textContent = humidity;
    windValueTxt.textContent = speed + ' M/s';
    //Generating DOM for date and Weather Icon
    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastsInfo(city)     // awaits promise function for the 5 days forecast
    showDisplaySection(weatherInfoSection);

}
// Fetches the weather forecast data for a given city and updates the DOM to display the relevant forecast items
async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    // Define the specific time of day (12:00:00) for which the forecast data will be displayed.
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = ''
     // Loop through the list of forecast data returned from the API.
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken)
             && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastsItems(forecastWeather);
        }
    });
}
// Updates the DOM with the weather forecast data for a specific date and time.
function updateForecastsItems(weatherData) {
    // Destructure the necessary properties from the weatherData object
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short',
    }

    const dateResult = dateTaken.toLocaleDateString('cz-CZ',dateOption);

    // Create the HTML structure for the forecast item, inserting the formatted date, weather icon, and temperature.
    const forecastItem = `
         <div class="forecast-item">
           <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
           <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
           <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

// Displays the specified section in the DOM while hiding the others.
function showDisplaySection(section) {
   const sections = [weatherInfoSection, searchCitySection, notFoundSection];

         sections.forEach(section => section.style.display = 'none'); // Hides all sections

         section.style.display = 'flex'; // Reveals the section which is passed in the parameter
}
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

    try{
    const response = await fetch(apiUrl);
    if(!response.ok) {
    throw new Error('Network response was not ok');
    }
       return response.json();
       
    } catch (error) {
        console.error('Fetch error:', error);
        return {cod: response.status, message: 'Failed to fetch weather data'}
     }

}

function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg';
    if(id <= 321) return 'drizzle.svg';
    if(id <= 531) return 'rain.svg';
    if(id <= 622) return 'snow.svg';
    if(id <= 781) return 'atmosphere.svg';
    if(id === 800) return 'clear.svg';
    else return 'clouds.svg';  
}

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

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection);

}

async function updateForecastsInfo() {
    const forecastsData = await getFetchData('forecast', city);
    console.log(forecastsData)
}

function showDisplaySection(section) {
   const sections = [weatherInfoSection, searchCitySection, notFoundSection];

         sections.forEach(section => section.style.display = 'none'); // Hides all sections

         section.style.display = 'flex'; // Reveals the section which is passed in the parameter
}
const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

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
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`

    const response = await fetch(apiUrl);

    return response.json()
}

// Function which accepts the city parametr that user inputs and through api it gets the precise data of wheater or forecast
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if(weatherData.cod !== 200) {
        showDisplaySection(notFoundSection);
        return 
    }
    console.log(weatherData)


    showDisplaySection(weatherInfoSection)

}

function showDisplaySection(section) {
   const sections = [weatherInfoSection, searchCitySection, notFoundSection];

         sections.forEach(section => section.style.display = 'none'); // Hides all sections

         section.style.display = 'flex'; // Reveals the section which is passed in the parameter
}
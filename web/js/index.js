const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather');
const currentSol = document.querySelector('[data-current-sol]');
const currentDate = document.querySelector('[data-current-date]');
const currentTempHigh = document.querySelector('[data-current-temp-high]');
const currentTempLow = document.querySelector('[data-current-temp-low]');
const currentWindSpeed = document.querySelector('[data-wind-speed]');
const windDirectionText = document.querySelector('[data-wind-direction-text]');
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]');

const previousSolTemplate = document.querySelector('[data-previous-sol-template]');
const previousSolContainer = document.querySelector('[data-previous-sols]');

const unitToggle = document.querySelector('[data-unit-toggle]');
const metricRadio = document.getElementById('cel');
const imperialRadio = document.getElementById('fah');

previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather');
});

let selectedSolIndex;

getWeather().then(sols => {
    selectedSolIndex = sols.length - 1;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();

    unitToggle.addEventListener('click', () => {
        let metricUnits = !metricRadio.checked;
        metricRadio.checked = metricUnits;
        imperialRadio.checked = !metricUnits;
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });

    metricRadio.addEventListener('change', () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });
    imperialRadio.addEventListener('change', () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    })

});

function getWeather() {
    return fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const {
                sol_keys,
                validity_checks,
                ...solData
            } = data;
            return Object.entries(solData).map(([sol, data]) => {
                return {
                    sol,
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av,
                    windDirectionDegrees: data.WD.most_common.compass_degrees,
                    windDirectionCardinal: data.WD.most_common.compass_point,
                    date: new Date(data.First_UTC)
                }
            });

        });
}

function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex];
    currentSol.innerText = selectedSol.sol;
    // currentDate.innerText = selectedSol.date.split(" ").splice(1,2).join(" ");
    currentDate.innerText = displayDate(selectedSol.date) ;
    currentTempHigh.innerText = displayTemperature(selectedSol.maxTemp);
    currentTempLow.innerText = displayTemperature(selectedSol.minTemp);
    currentWindSpeed.innerText = displaySpeed(selectedSol.windSpeed);
    windDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`);
    windDirectionText.innerText = selectedSol.windDirectionCardinal;
    console.log(selectedSol);
}

function displayDate(date) {
    return date.toLocaleDateString(
        undefined,
        {day: 'numeric', month: 'long'}
    )
}

function displayTemperature(temp) {
    let returnTemp = temp;
    if(!isMetric()){
        returnTemp = (temp -32 ) * 5/9;
    }
    return Math.round(returnTemp)
}

function displaySpeed(speed) {
    let returnSpeed = speed;
    if(!isMetric()){
        returnSpeed = speed / 1.609;
    }
    return Math.round(returnSpeed)

}

function displayPreviousSols(sols){
    previousSolContainer.innerHTML = '';
    sols.forEach((solData, index) => {
        const solContainer = previousSolTemplate.content.cloneNode(true);
        solContainer.querySelector('[data-sol]').innerText = solData.sol;
        solContainer.querySelector('[data-date]').innerText = displayDate(solData.date);
        solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp);
        solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp);
        solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
            selectedSolIndex = index;
            displaySelectedSol(sols)
        })
        previousSolContainer.appendChild(solContainer)
    })
};


const updateUnits = () => {
    const speedUnits = document.querySelectorAll('[data-speed-unit]');
    const tempUnits = document.querySelectorAll('[data-temp-unit');
    speedUnits.forEach(unit => unit.innerText = isMetric() ? 'kph' : 'mph');
    tempUnits.forEach(unit => unit.innerText = isMetric() ? 'C': 'F')
}

const isMetric = () => {
    return metricRadio.checked;
}
import hotBG from './asset/hot.jpeg';
import coldBG from './asset/cold.jpeg';
import Descriptions from './components/descriptions';
import { useEffect, useState } from 'react';
import { getFormattedWeatherData } from './weatherService';

function App() {
  const [city, setCity] = useState('Taipei');
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBG);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units).catch((err) => {
        console.log(err);
        setError(true);
      });
      if(data){
        setWeather(data);
        console.log(data);
        const threshold = units === "metric" ? 20 : 70;
        console.log(threshold)
        if (data.temp <= threshold) setBg(coldBG);
        else setBg(hotBG);
      }
    }
    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  }

  const enterKeyPressed = (e) => {
    setError(false);
    if (e.keyCode === 13) {
      setCity(e.target.value);
      e.currentTarget.blur();
    }
  }

  return (
    <div className="app" style={{ 'backgroundImage': `url(${bg})`, 'backgroundSize': 'cover' }}>
      <div className='overlay'>
        {weather && (
          <div className='container'>
            <div className='section section_inputs'>
              <div className='inputs'>
                <input type="text" name="city" onKeyDown={enterKeyPressed} placeholder='Enter City...' />
                {error && <div className='ErrorMessage'>Can't Find This City!!</div>}
              </div>
              <button onClick={handleUnitsClick}>°F</button>
            </div>

            <div className="section section_temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" width={50} />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{weather.temp.toFixed()} °{units === "metric" ? "C" : "F"}</h1>
              </div>
            </div>

            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { weatherService } from "../services/weather.service";
import { Loader } from "./Loader";
import cloudy from "../styles/img/cloudy.png";
import rainy from "../styles/img/rainy.png";
import sunny from "../styles/img/sunny.png";
import littleRain from "../styles/img/little-rain.png";
import littleCloudy from "../styles/img/little-cloudy.png";

export function SearchBarFilterInput() {
	const [cities, setCities] = useState([]);
	const [weather, setWeather] = useState([]);
	const [searchVal, setSearchVal] = useState('');
	const [currCity, setCurrCity] = useState('');
	const [isCelUnit, setIsCelUnit] = useState(false);

	useEffect(() => {
		(async () => {
			const citiesFromStorage = await weatherService.autoComplete(searchVal);
			setCities(citiesFromStorage?.locations || []);
		})();
	}, [searchVal]);

	function handleChange({ target }) {
		const { value } = target;
		setSearchVal(value)
	}

	function getWeatherImg(describtion) {
		switch (describtion) {
			case ("Mostly cloudy"): return cloudy;
			case ('Partly cloudy'): return rainy;
			case ("Intermittent clouds"): return littleRain;
			case ("sunny"): return sunny;
			default: return littleCloudy;
		}
	}

	async function onPlaceClick(key,place) {
		console.log(key)
		const weatherToShow = await weatherService.getWeatherByKey(key);
		setWeather(weatherToShow.weather.DailyForecasts);
		setCities([]);
		setSearchVal('');
		setCurrCity(place);
	}
	console.log(weather)
	return (
		<article className='search-filter-container'>
			<div className='search-filter-inputs'>
				<input
					id='location'
					className='search-input'
					value={searchVal}
					placeholder='Lets explore worldwide weather !'
					onChange={handleChange}
					type='text'
				/>
				{cities.length ? (
					<ul
						className={`data-result 
      `}>
						{cities.map((value, idx) => {
							return (
								<li onClick={() => onPlaceClick(value.Key,value.Country.EnglishName+' '+value.LocalizedName)} key={value.Key + idx} className='data-item'>
									<p>
										{value.LocalizedName} , <small>{value.Country.EnglishName}</small>
									</p>
								</li>
							);
						})}
					</ul>
				) : <Loader />}
			<h1>{currCity}</h1>
			</div>
			<section className="weather-container">
				{weather.length ? <button className="temp-btn" onClick={()=>setIsCelUnit(!isCelUnit)}>Convert to {isCelUnit ? "Celcius" : "Farenheit"}</button> : <Loader/> }
			<section className="weather-container" id="weather-container">
				{(weather.length) ? weather.map(day => {
					return <ul key={day.Date}>
						<li><img src={`${(getWeatherImg(day.Day.IconPhrase))}`} alt="dateIcon"/></li>
						<li>{new Date(day.Date).getFullYear()+"."+(new Date(day.Date).getMonth()+1)+"."+new Date(day.Date).getDate()}</li>
						<li><p>{day.Day.IconPhrase}</p></li>
						<li>
					{isCelUnit ?
					 (((day.Temperature.Maximum.Value - 32)* (5/9)).toFixed(1)+' - '+((day.Temperature.Minimum.Value - 32)* (5/9)).toFixed(1)+' C') :
					 (day.Temperature.Maximum.Value+' - '+day.Temperature.Minimum.Value+' F')
				}</li>
					</ul>
				}) : <Loader/>}
			</section>
			</section>
		</article>
	);
}
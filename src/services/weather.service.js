import { httpService } from './http.service';
import { storageService } from './async-storage.service';
import axios from 'axios';

const STORAGE_KEY_LOCATIONS = "locationsDB";
const STORAGE_KEY_WEATHER = "weatherDB";
const API_KEY = "apikey=UJxhulvf6nGuTCRr4qIoPULI9MGKpyfV&q=";


export const weatherService = { 
    autoComplete,
    getWeatherByKey
}

async function autoComplete(searchValue) {
    if (!searchValue) return;
    const locationsFromLocal = await storageService.get(STORAGE_KEY_LOCATIONS,searchValue);
    if (locationsFromLocal) {
        console.log(locationsFromLocal)
        console.log('locations from local');
        return locationsFromLocal;
    }
    console.log('locations from server')
    const url = "http://dataservice.accuweather.com/locations/v1/cities/search?"
    const sendRequestUrl = url+API_KEY+searchValue;
    let locations = await axios.get(sendRequestUrl);
    locations = locations.data;
    storageService.post(STORAGE_KEY_LOCATIONS,{searchValue, locations});
    return locations;
}

async function getWeatherByKey(key) {
    if (!key) return;
    const weatherFromLocal = await storageService.get(STORAGE_KEY_WEATHER,key);
    if (weatherFromLocal) {
        console.log('weather from local');
        return weatherFromLocal;
    }
    console.log('weather from server')
    const url = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/";
    const sendRequestUrl = url+key+"?"+API_KEY;
    let weather = await axios.get(sendRequestUrl);
    weather = weather.data;
    storageService.post(STORAGE_KEY_WEATHER,{key, weather});
    return weather;
}
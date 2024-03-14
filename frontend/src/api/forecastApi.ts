import axios from 'axios';
import { ForecastHourly } from '../models/ForecastHourly';

const forecastApi = axios.create({
    baseURL: process.env.FORECAST_BASE_URL as string,
    timeout: 5000,
});

export async function getForecast(lat: number, lon: number): Promise<ForecastHourly[]>{
    const response = await forecastApi.get(`/hourly?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`);
    return response.data.list.map((forecast: any) => ForecastHourly.fromJson(forecast));
}



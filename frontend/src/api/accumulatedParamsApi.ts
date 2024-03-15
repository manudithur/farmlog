import axios from 'axios';
import { AccumulatedPrecipitation } from '../models/AccumulatedPrecipitation';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const accumulatedParamsApi = axios.create({
    baseURL: proxyUrl+import.meta.env.VITE_ACCUMULATED_BASE_URL as string,
    timeout: 5000,
});

export async function getAccumulatedPrecipitation(lat: number, lon: number, start: string, end: string): Promise<AccumulatedPrecipitation[]> {
    const response = await accumulatedParamsApi.get(`/accumulated_precipitation?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
    return response.data.list.map((precipitation: any) => AccumulatedPrecipitation.fromJson(precipitation));
}



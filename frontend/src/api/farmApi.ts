import { Farm } from '../models/Farm';
import api from './config'

export async function createFarm(name: string, center: {lat: number, lng: number}): Promise<any> {
    const response = await api.post('/farms', { name, center }, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return response.data.farm;
}

export async function getFarm(): Promise<Farm>{
    const response = await api.get('/farms', {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Farm.fromJson(response.data.farm);
}
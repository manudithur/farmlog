import api from './config';
import { Paddock } from '../models/Paddock';

export async function createPaddock(path: {lat: number, lng: number}[], area: number, name: string, farmId: string): Promise<Paddock> {
    const response = await api.post('/paddocks', { name, area, shape: path, farmId }, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Paddock.fromJson(response.data.paddock);
}

export async function deletePaddock(paddockId: string): Promise<void>{
    await api.delete(`/paddocks/${paddockId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
}

export async function getPaddockById(paddockId: string): Promise<Paddock>{
    const response = await api.get(`/paddocks/${paddockId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Paddock.fromJson(response.data.paddock);
}

export async function getPaddocksByFarmId(farmId: string): Promise<Paddock[]>{
    const response = await api.get(`/paddocks/farm/${farmId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return response.data.paddocks.map((paddock: any) => Paddock.fromJson(paddock));
}

export async function editPaddock (paddockId: string, path: {lat: number, lng: number}[], area: number, name: string): Promise<Paddock>{
    const response = await api.put(`/paddocks/${paddockId}`, { name, area, shape: path }, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Paddock.fromJson(response.data.paddock);
}
import api from './config';
import { Field } from '../models/Field';

export async function createfield(path: {lat: number, lng: number}[], center: {lat: number, lng: number}, area: number, name: string, farmId: string): Promise<Field> {
    const response = await api.post('/fields', { name, area, shape: path, center, farmId }, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Field.fromJson(response.data.field);
}

export async function deletefield(fieldId: string): Promise<void>{
    await api.delete(`/fields/${fieldId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
}

export async function getfieldById(fieldId: string): Promise<Field>{
    const response = await api.get(`/fields/${fieldId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Field.fromJson(response.data.field);
}

export async function getfieldsByFarmId(farmId: string): Promise<Field[]>{
    const response = await api.get(`/fields/farm/${farmId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    console.log(response.data.fields);
    return response.data.fields.map((field: any) => Field.fromJson(field));
}

export async function editfield (fieldId: string, path: {lat: number, lng: number}[], area: number, name: string): Promise<Field>{
    const response = await api.put(`/fields/${fieldId}`, { name, area, shape: path }, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Field.fromJson(response.data.field);
}
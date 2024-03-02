
import api from './config';
import { Group } from '../models/Group';

export async function createGroup(name: string, liveStockCount: Number, currentPadockId: string): Promise<Group> {
    const response = await api.post('/groups', { name, liveStockCount, currentPadockId }, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Group.fromJson(response.data.group);
}

export async function editGroup(groupId: string, name: string, currentPadockId: string, liveStockCount: Number ): Promise<Group> {
    const response = await api.put(`/groups/${groupId}`, { name, currentPadockId, liveStockCount }, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Group.fromJson(response.data.group);
}

export async function getGroup(groupId: string): Promise<Group> {
    const response = await api.get(`/groups/${groupId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return Group.fromJson(response.data.group);
}

export async function getGroups(active: boolean): Promise<Group[]> {
    const response = await api.get(`/groups?active=${active}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return response.data.groups.map((group: any) => Group.fromJson(group));
}


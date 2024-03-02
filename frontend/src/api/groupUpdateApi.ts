

import api from './config';
import { GroupUpdate } from '../models/GroupUpdate';

export const createGroupUpdate = async (groupId: string, paddockId: string, type: string, title: string, message: string, date: Date): Promise<GroupUpdate> => {
    const response = await api.post('/updates', {groupId, paddockId, type, title, message, date}, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return GroupUpdate.fromJson(response.data.update);
}

export const getGroupUpdates = async (groupId: string, type: string): Promise<GroupUpdate[]> => {
    const response = await api.get(`/updates/${groupId}?type=${type}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return response.data.updates.map((update: any) => GroupUpdate.fromJson(update));
}
import api from "./config";
import { User } from "../models/User";

export async function createUser (
    name: { first: string; last: string },
    role: string,
    email: string,
    password: string,
    farmId: string
): Promise<User>{
    const response = await api.post("/users", { name, role, email, password, farmId });
    return User.fromJson(response.data.user);
};

export async function loginUser  (email: string, password: string): Promise<string>{
    const response = await api.post("/users/login", { email, password });
    return response.data.token;
};

export async function getUserById (userId: string): Promise<User>{
    const response = await api.get(`/users/${userId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
    return User.fromJson(response.data.user);
};




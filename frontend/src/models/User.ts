
export class User {
    name: {
        first: string;
        last: string;
    };
    role: string;
    email: string;
    password: string;
    userId: string;
    farmId: string;

    constructor(name: {first: string, last: string}, role: string, email: string, password: string, userId: string, farmId: string) {
        this.name = name;
        this.role = role;
        this.email = email;
        this.password = password;
        this.userId = userId;
        this.farmId = farmId;
    }

    static fromJson(json: any): User {
        return new User(json.name, json.role, json.email, json.password, json.userId, json.farmId);
    }
}
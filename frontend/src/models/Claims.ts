export class Claims {
    email: string;
    userId: string;
    role: string;
    farmId: string;
    name: string;

    constructor(email: string, userId: string, role: string, farmId: string, name: string) {
        this.email = email;
        this.userId = userId;
        this.role = role;
        this.farmId = farmId;
        this.name = name;
    }

    static fromJson(json: any): Claims {
        return new Claims(json.email, json.userId, json.role, json.farmId, json.name);
    }
    
}
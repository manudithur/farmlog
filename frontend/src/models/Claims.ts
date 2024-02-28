export class Claims {
    email: string;
    userId: string;
    role: string;
    farmId: string;

    constructor(email: string, userId: string, role: string, farmId: string) {
        this.email = email;
        this.userId = userId;
        this.role = role;
        this.farmId = farmId;
    }

    static fromJson(json: any): Claims {
        return new Claims(json.email, json.userId, json.role, json.farmId);
    }
    
}
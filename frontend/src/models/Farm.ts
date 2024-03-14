import { fieldShape } from "./Field";

export class Farm {

    farmId: string;
    name: string;
    ownerId: string;
    center: fieldShape;

    constructor(farmId: string, name: string, ownerId: string, center: fieldShape) {
        this.farmId = farmId;
        this.name = name;
        this.ownerId = ownerId;
        this.center = center;
    }

    static fromJson(json: any): Farm {
        return new Farm(json.farmId, json.name, json.ownerId, json.center);
    }
    
}

export class Paddock {
    farmId: string;
    name: string;
    area: number;
    shape: PaddockShape[];
    paddockId: string;

    constructor(farmId: string, name: string, area: number, shape: PaddockShape[], paddockId: string) {
        this.farmId = farmId;
        this.name = name;
        this.area = area;
        this.shape = shape;
        this.paddockId = paddockId;
    }

    static fromJson(json: any): Paddock {
        return new Paddock(json.farmId, json.name, json.area, json.shape, json.paddockId);
    }
    
}

export interface PaddockShape {
    lat: number;
    lng: number;
  }
  
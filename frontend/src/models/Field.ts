
export class Field {
    farmId: string;
    name: string;
    area: number;
    shape: fieldShape[];
    fieldId: string;

    constructor(farmId: string, name: string, area: number, shape: fieldShape[], fieldId: string) {
        this.farmId = farmId;
        this.name = name;
        this.area = area;
        this.shape = shape;
        this.fieldId = fieldId;
    }

    static fromJson(json: any): Field {
        return new Field(json.farmId, json.name, json.area, json.shape, json.fieldId);
    }
    
}

export interface fieldShape {
    lat: number;
    lng: number;
  }
  

export class Field {
    farmId: string;
    name: string;
    area: number;
    shape: fieldShape[];
    fieldId: string;
    center: fieldShape;

    constructor(farmId: string, name: string, area: number, shape: fieldShape[], fieldId: string, center: fieldShape) {
        this.farmId = farmId;
        this.name = name;
        this.area = area;
        this.shape = shape;
        this.fieldId = fieldId;
        this.center = center;
    }

    static fromJson(json: any): Field {
        return new Field(json.farmId, json.name, json.area, json.shape, json.fieldId, json.center);
    }
    
}

export interface fieldShape {
    lat: number;
    lng: number;
  }
  
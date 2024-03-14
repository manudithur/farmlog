export class AccumulatedPrecipitation {
                           
    date: string;
    rain: number;
    count: number;
    
    constructor(date: string, rain: number, count: number) {
        this.date = date;
        this.rain = rain;
        this.count = count;
    }
    
    static fromJson(json: any): AccumulatedPrecipitation {
        return new AccumulatedPrecipitation(json.date, json.rain, json.count);
    }
}
                         
                      
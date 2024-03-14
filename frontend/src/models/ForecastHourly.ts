export class ForecastHourly {
    // "dt": 1661882400,
    // "main": {
    //     "temp": 294.94,
    //     "humidity": 60,
    //   },
    //   "rain": {
    //     "1h": 0.2
    //   },

    date: string;
    temp: number;
    feel: number;
    humidity: number;
    rain: number;

    constructor(date: string, temp: number, feel: number, humidity: number, rain: number) {
        this.date = date;
        this.temp = temp;
        this.feel = feel;
        this.humidity = humidity;
        this.rain = rain;
    }

    static fromJson(json: any): ForecastHourly {
        return new ForecastHourly(new Date(json.dt*1000).toLocaleString(), json.main.temp - 273.15, json.main.feels_like - 273.15, json.main.humidity, json.rain ? json.rain['1h'] : 0);
    }
}
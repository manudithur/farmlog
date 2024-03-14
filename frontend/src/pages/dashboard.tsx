import { Card, Col, DatePicker, Divider, Flex,  Skeleton, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, XAxis, YAxis, AreaChart, Area } from "recharts";
import { Field } from "../models/Field";
import { getfieldsByFarmId } from "../api/fieldApi";
import { useNavigate } from "react-router-dom";
import { getAccumulatedPrecipitation } from "../api/accumulatedParamsApi";
import dayjs from "dayjs";
import '../styles/main.css'
import { ForecastHourly } from "../models/ForecastHourly";
import { Claims } from "../models/Claims";
import { jwtDecode } from "jwt-decode";
import { getForecast } from "../api/forecastApi";
import { Farm } from "../models/Farm";
import { getFarm } from "../api/farmApi";

interface GraphData {
    name: string;
    value: number;
}

const { RangePicker } = DatePicker;

const dateFormat = 'DD-MM-YYYY';

const Dashboard: React.FC = () => {
    const token = localStorage.getItem('token');
    const claims = Claims.fromJson(jwtDecode(token!) as { [key: string]: string });


    const router = useNavigate();
    const {Title, Text} = Typography

    const [farm, setFarm] = useState<Farm>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dailyData, setDailyData] = useState<GraphData[]>([]);
    const [hourlyForecast, setHourlyForecast] = useState<ForecastHourly[]>([]);

    const transformToDailyRain = (accumulatedData: GraphData[]): GraphData[] => {
        let dailyData: GraphData[] = [];
        for (let i = 0; i < accumulatedData.length; i++) {
          if (i === 0) {
            dailyData.push({ ...accumulatedData[i] });
          } else {
            const dailyValue = accumulatedData[i].value - accumulatedData[i - 1].value;
            dailyData.push({ name: accumulatedData[i].name, value: dailyValue });
          }
        }
      
        return dailyData;
      };
      

    useEffect(() => {
        if(!claims.farmId)
            router('/login');

        const fetchData = async () => {
            try{
            const farm = await getFarm();
            setFarm(farm);


            const response = await getAccumulatedPrecipitation(farm.center.lat!, farm.center.lng!, dayjs().subtract(1, 'week').unix().toString(), dayjs().unix().toString());
            
            const dailyData = transformToDailyRain(response.map((value) => {
                return {
                    name: value.date,
                    value: value.rain
                }
            }).filter((value) => value.value !== 0));

            setDailyData(dailyData);

            
            const forecast = await getForecast(farm.center.lat!, farm.center.lng!);

            setHourlyForecast(forecast);
            

            }
            catch(err){
                console.log(err);
                setDailyData([])
                message.error("No hay datos para esas fechas");
            }
        }

        fetchData().then(() => setIsLoading(false));

    }, []);

    const CustomTooltip: React.FC<TooltipProps<string, number>> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip" style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
              <p className="label"><b>{label}</b></p>
              <p className="label">{`${new Number(payload[0].value).toFixed(1)} mm`}</p>
            </div>
          );
        }
      
        return null;
      };

    return (
        <Flex vertical className="w-100" align="center" justify="center">
            <Skeleton loading={isLoading} >
                <Flex className="w-50 text-center mt-2vh" justify="space-evenly">
                    <Card>
                        <Title level={4} style={{margin: 0}}>Ultimos 7 dias</Title>
                        <Text>{dailyData.reduce((acc, value) => acc + value.value, 0).toFixed(1)} mm</Text>
                    </Card>
                    <Card>
                        <Title level={4} style={{margin: 0}}>Proximas 48hs</Title>
                        <Text>{hourlyForecast.slice(0, 48).reduce((acc, value) => acc + value.rain, 0).toFixed(1)} mm</Text>
                    </Card>
                    <Card>
                        <Title level={4} style={{margin: 0}}>Temperatura actual</Title>
                        <Text>{hourlyForecast[0]?.temp}°C</Text>
                    </Card>
                
                </Flex>
                <Flex className="mt-2vh w-100" justify="space-evenly">
                    <Col className="w-50">
                        <Title level={5} style={{paddingLeft: 50}}>Ultimas lluvias</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart width={730} height={250} data={dailyData} margin={{top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip/>}/>
                                <Bar dataKey="value" fill="#67C6E3"/>
                            </BarChart>
                        </ResponsiveContainer>
                        <Title level={5} style={{paddingLeft: 50}}>Pronostico temperatura</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                width={500}
                                height={200}
                                data={hourlyForecast}
                                syncId="anyId"
                                margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="feel" stroke="#EE99C2" fill="#EE99C2" />
                                <Area type="monotone" dataKey="temp" stroke="#EADFB4" fill="#EADFB4" />
                            </AreaChart>
                        </ResponsiveContainer>  
                    </Col>
                    <Col className="w-50">
                        <Title level={5} style={{paddingLeft: 50}}>Pronostico lluvias</Title>
                        <ResponsiveContainer width="100 %" height={300}>
                            <BarChart
                                width={500}
                                height={200}
                                data={hourlyForecast}
                                syncId="anyId"
                                margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                                }}
                                title="Pronóstico de lluvia por hora"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar type="monotone" dataKey="rain" stroke="#9BB0C1" fill="#9BB0C1" />
                            </BarChart>
                        </ResponsiveContainer>
                        <Title level={5} style={{paddingLeft: 50}}>Pronostico humedad</Title>

                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                width={500}
                                height={200}
                                data={hourlyForecast}
                                syncId="anyId"
                                margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="humidity" stroke="#9BB0C1" fill="#9BB0C1" />
                            </AreaChart>
                        </ResponsiveContainer>  
                    </Col>
                </Flex>
            </Skeleton>
        </Flex>
    )
}

export default Dashboard;
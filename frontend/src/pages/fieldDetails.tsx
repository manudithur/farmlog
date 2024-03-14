import { ToolOutlined } from "@ant-design/icons";
import { Card, DatePicker, Divider, Flex, Skeleton, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid,Tooltip, ResponsiveContainer, TooltipProps, XAxis, YAxis } from "recharts";
import { Field } from "../models/Field";
import { getfieldById } from "../api/fieldApi";
import { useNavigate, useParams } from "react-router-dom";
import { getAccumulatedPrecipitation } from "../api/accumulatedParamsApi";
import dayjs from "dayjs";
import '../styles/main.css'

interface GraphData {
    name: string;
    value: number;
}

const { RangePicker } = DatePicker;

const dateFormat = 'DD-MM-YYYY';

const FieldDetails: React.FC = () => {

    const {id} = useParams();
    const router = useNavigate();
    const {Title, Text} = Typography

    const [field, setField] = useState<Field>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs('01-01-2024', dateFormat), dayjs()]);
    const [data , setData] = useState<GraphData[]>([]);
    const [monthlyData, setMonthlyData] = useState<GraphData[]>([]);
    const [dailyData, setDailyData] = useState<GraphData[]>([]);

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
        if(!id)
            router(-1);

        const fetchData = async () => {
            try{
            const field = await getfieldById(id!);
            setField(field);
            const response = await getAccumulatedPrecipitation(field?.center.lat!, field?.center.lng!, dateRange[0].unix().toString(), dateRange[1].unix().toString());
            setData(response.map((value) => {
                return {
                    name: value.date,
                    value: value.rain
                }
            }))
            
            const dailyData = transformToDailyRain(response.map((value) => {
                return {
                    name: value.date,
                    value: value.rain
                }
            }).filter((value) => value.value !== 0));

            setDailyData(dailyData);

            const monthlyData: GraphData[] = [];
            for (let i = 0; i < dailyData.length; i++) {
                console.log(dailyData[i].name);
                let date = dayjs(dailyData[i].name, 'YYYY-M-DD');
    
                if (!date.isValid()) {
                    date = dayjs(dailyData[i].name, 'DD-MM-YYYY');
                }
            
                if (!date.isValid()) {
                    console.error(`Invalid date format for: ${dailyData[i].name}`);
                    continue;
                }
            
                const month = new Date(date.toString()).toLocaleString('default', { month: 'long' });
                const value = dailyData[i].value;
                const index = monthlyData.findIndex((data) => data.name === month);
            
                if (index === -1) {
                    monthlyData.push({ name: month, value: value });
                } else {
                    monthlyData[index].value += value;
                }
            }
            
            setMonthlyData(monthlyData);

            

            }
            catch(err){
                console.log(err);
                setData([])
                message.error("No hay datos para esas fechas");
            }
        }

        fetchData().then(() => setIsLoading(false));

    }, [dateRange]);

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
        <Flex vertical className="w-100" align="center" justify="center" style={{padding: 25}}>
            <Skeleton loading={isLoading} >
                <Title level={1}>{field?.name}</Title>
                <RangePicker
                    maxDate={dayjs()} 
                    minDate={dayjs('01-01-2020')}
                    defaultValue={[dayjs().subtract(1, 'month'), dayjs()]}
                    onChange={(dates) => dates ? setDateRange([dates[0]!, dates[1]!]) : setDateRange([dayjs().subtract(1, 'month'), dayjs()])}
                    placeholder={["Desde", "Hasta"]}
                />
                <Flex className="mt-2vh w-50" justify="space-evenly">
                    {data.length > 0 && <>
                    <Card>
                        <Title level={4} style={{margin: 0}}>Total</Title>
                        <Text>{data[data.length-1].value} mm</Text>
                    </Card>
                    <Card>
                        <Title level={4} style={{margin: 0}}>Lluvias</Title>
                        <Text>{dailyData.filter((value) => {return value.value > 0.5 }).length}</Text>
                    </Card>
                    <Card>
                        <Title level={4} style={{margin: 0}}>Promedio</Title>
                        <Text>{(data[dailyData.length-1].value / dailyData.filter((value) => {return value.value > 0.5}).length).toFixed(1)} mm</Text>
                    </Card>
                    </>
                    }
                </Flex>

                <div className="w-50">
                    <Divider/>
                </div>
                
                <Title level={4}>Diario</Title>
                <ResponsiveContainer width="70%" height={300}>
                    <BarChart width={730} height={250} data={dailyData} margin={{top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip/>}/>
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
               
                <div className="w-50">
                    <Divider/>
                </div>
                <Title level={4}>Mensual</Title>
                <ResponsiveContainer width="70%" height={300}>
                    <BarChart width={730} height={250} data={monthlyData} margin={{top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip/>}/>
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
                <div className="w-50">
                    <Divider/>
                </div>
                <Title level={4}>Acumulada</Title>
                <ResponsiveContainer width="70%" height={300}>
                    <AreaChart width={730} height={250} data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={50}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={50}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<CustomTooltip/>}/>
                        <ToolOutlined />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorRain)" />
                    </AreaChart>
                </ResponsiveContainer>

            </Skeleton>
        </Flex>
    )
}

export default FieldDetails;
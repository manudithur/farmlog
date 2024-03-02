import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Group } from "../models/Group";
import { getGroup } from "../api/groupApi";
import { Button, Descriptions, Divider, Flex, Row, Skeleton, Timeline, Typography, message } from "antd";
import { Paddock } from "../models/Paddock";
import { getPaddockById } from "../api/paddockApi";
import type { DescriptionsProps } from 'antd';
import moment from "moment";
import '../styles/main.css'
import { getGroupUpdates } from "../api/groupUpdateApi";
import { GroupUpdate } from "../models/GroupUpdate";
import { HeartTwoTone, InfoCircleTwoTone, InteractionTwoTone, PlusCircleTwoTone, WarningTwoTone } from "@ant-design/icons";

const GroupDetails: React.FC = () => {

    const { id } = useParams();
    const router = useNavigate();

    const [group, setGroup] = useState<Group | null>(null);
    const [paddock, setPaddock] = useState<Paddock | null>(null);
    const [loading, setLoading] = useState(true);
    const [updates, setUpdates] = useState<GroupUpdate[]>([]);

    const items: DescriptionsProps['items'] = [
        {
            key: 'liveStockCount',
            label: 'Cantidad de ganado',
            children: group?.liveStockCount ? group.liveStockCount.toString() : 'No definido',
        },
        {
            key: 'paddock',
            label: 'Lote actual',
            children: paddock?.name ? paddock.name : 'No definido', 
        },
        {
            key: 'lastUpdated',
            label: 'Ultima actualizacion',
            children: group?.lastUpdated ? moment(group.lastUpdated).toDate().toLocaleDateString() : 'No definido'
        }
    ]

    useEffect(() => {

        if(!id){
            message.error('No se ha seleccionado una categoria');
            router('/groups');
        }

        getGroup(id!).then((group) => {
            setGroup(group);

            getGroupUpdates(group.groupId, '').then((updates) => {
                setUpdates(updates.sort((a, b) => moment(b.date).toDate().getTime() - moment(a.date).toDate().getTime()));
                if(group.currentPadockId){
                    getPaddockById(group.currentPadockId).then((paddock) => {
                        setPaddock(paddock);
                        setLoading(false);
                    }).catch((error) => {
                        message.error(error.message);
                    });
                } else{
                    setLoading(false);
                }
            })          
            

        }).catch((error) => {
            message.error(error.message);
        });
    }, []);

    return (
        <Row justify="center" className="w-100">
            <div className="w-50">
                <Descriptions
                    title={<Flex vertical>
                        <Typography.Title level={2}>{group?.name}</Typography.Title>
                        
                    </Flex>}
                    size={'default'}
                    extra={
                        <Flex justify="evenly" className="w-100" >
                            <Button type="primary" className="mr-5" href={`./${id}/update`}>Actualizar</Button>
                            <Button type="dashed">Editar</Button>
                        </Flex>
                    }
                    items={items}
                    bordered
                />
                <Divider/>
                {updates.length > 0 && <>
                <Typography.Title level={5}>Actualizaciones</Typography.Title>
                <Skeleton loading={loading} active>
                    <Timeline mode="left" className="w-100 pt-5">
                        {updates.map((update) => (
                            <Timeline.Item key={update.updateId} dot={update.type == 'death' ? <WarningTwoTone twoToneColor="red"/> : update.type == 'birth' ? <PlusCircleTwoTone/> : update.type == 'health' ?  <HeartTwoTone twoToneColor='pink' /> : update.type == 'movement' ? <InteractionTwoTone twoToneColor="blue"/> : <InfoCircleTwoTone twoToneColor='blue'/> }>
                                
                                        {moment(update.date).toDate().toLocaleDateString()}
                                        <Typography.Title className="w-100" level={5} style={{margin: 0}}>{update.title}</Typography.Title>
                                        <Typography.Text>{update.message}</Typography.Text>
                                
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Skeleton>
                </>}


            </div>
        </Row>

    )
}

export default GroupDetails
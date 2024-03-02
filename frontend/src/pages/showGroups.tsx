import { useEffect, useState } from "react";
import { Group } from "../models/Group";
import { getGroups } from "../api/groupApi";
import { Button, Col, Divider, Flex, Popconfirm, Row, Skeleton, Table, Typography, message } from "antd";
import { Paddock } from "../models/Paddock";
import { getPaddockById } from "../api/paddockApi";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";


const ShowGroups: React.FC = () => {

    const [loading,  setLoading] = useState(true);
    const [groups, setGroups] = useState<{item: Group, paddock: Paddock | null}[]>([]);
    const [selectedTableRowsIds, setSelectedTableRowsIds] = useState<string[]>([]);

    const router = useNavigate();

    const [paddocksIds, setPaddocksIds] = useState<String[]>([]);
    const [paddocks, setPaddocks] = useState<Paddock[]>([]);

    useEffect(() => {
        if (loading) {
            getGroups(true).then((fetchedGroups) => {
                // Use a map to track paddock fetches and avoid duplicates
                const paddockFetches: Map<string, Promise<Paddock | null>> = new Map();
    
                fetchedGroups.forEach((group) => {
                    if (group.currentPadockId && !paddocksIds.includes(group.currentPadockId)) {
                        if (!paddockFetches.has(group.currentPadockId)) {
                            // Fetch the paddock and store the promise in the map
                            paddockFetches.set(
                                group.currentPadockId,
                                getPaddockById(group.currentPadockId).catch((error) => {
                                    message.error(error.message);
                                    return null;
                                })
                            );
                        }
                    }
                });
    
                // Wait for all paddock fetches to resolve
                Promise.all(paddockFetches.values()).then((fetchedPaddocks) => {
                    // Filter out any nulls from failed requests
                    const successfulPaddocks = fetchedPaddocks.filter((paddock): paddock is Paddock => paddock !== null);
    
                    // Update the paddocks and paddocksIds with new ones
                    setPaddocks((currentPaddocks) => [...currentPaddocks, ...successfulPaddocks]);
                    setPaddocksIds((currentPaddocksIds) => [
                        ...currentPaddocksIds,
                        ...successfulPaddocks.map((paddock) => paddock.paddockId),
                    ]);
    
                    // Now update the groups
                    setGroups((currentGroups) =>
                        fetchedGroups.map((group) => ({
                            item: group,
                            paddock: successfulPaddocks.find((p) => p.paddockId === group.currentPadockId) || null,
                        })).sort((a, b) => moment(b.item.lastUpdated).diff(moment(a.item.lastUpdated)))
                    );
                    setLoading(false);
                });
            }).catch((error) => {
                message.error(error.message);
                setLoading(false);
            });
        }
    }, []); // Dependencies array

    const confirm = (e: React.MouseEvent<HTMLElement> | undefined) => {
        message.info('No implementado aun :)')
    };
    
    
    return (
        <>
            <Typography.Title level={2}>Categorias</Typography.Title>
            <Divider/>
            <Row justify="center">
                <Skeleton loading={loading}>
                    {
                        groups.length === 0 && 
                        <Row className="w-100 flex-center flex-column mb-5">
                            <Typography.Text type="secondary">No hay categorias para mostrar</Typography.Text>
                            <Button href="/groups/create" type="primary">Crear categoria <PlusCircleOutlined/></Button>
                        </Row>
                    }
                    {
                        groups.length > 0 && <>
                        <Flex vertical className="w-50">
                            <Row className="w-100 flex-end mb-5">
                                <Button href="/groups/create" type="primary">Crear categoria <PlusCircleOutlined/></Button>
                            </Row>
                            <Table 
                                columns={[
                                    {
                                        title: 'Nombre',
                                        dataIndex: 'name',
                                        key: 'name'
                                    },
                                    {
                                        title: 'Lote actual',
                                        dataIndex: 'currentPaddock',
                                        key: 'currentPaddock'
                                    },
                                    {
                                        title: 'Cantidad de animales',
                                        dataIndex: 'liveStockCount',
                                        key: 'liveStockCount'
                                    },
                                    {
                                        title: 'Ultima actualizacion',
                                        dataIndex: 'lastUpdated',
                                        key: 'lastUpdated',
                                        render: (text: string) => moment(text).toDate().toLocaleDateString()
                                    }
                                
                                ]}
                                dataSource={groups.map((group) => ({...group.item, currentPaddock: group.paddock?.name || 'No asignado', key: group.item.groupId}))}
                                pagination={false}    
                                className="w-100"
                                onRow={(record) => {return {
                                    onClick: () => router(`/groups/${record.groupId}`)
                                }}}
                                rowSelection={{
                                    type: 'checkbox',
                                    onSelect: (record, selected, selectedRows) => {
                                      setSelectedTableRowsIds(selectedRows.map((row) => row.groupId));
                                    },
                                    hideSelectAll: true
                                }}
                            >
                            </Table>
                            {
                                selectedTableRowsIds.length > 0 ?
                                <Row className='w-100 flex-end mt-5'>
                                    <Popconfirm
                                    title="Eliminar Categoria(s)?"
                                    description="Esta accion no se puede deshacer, estas seguro?"
                                    onConfirm={confirm}
                                    okText="Si"
                                    cancelText="No"
                                    >
                                    <Button danger>Eliminar <DeleteOutlined /></Button>
                                    </Popconfirm>
                                </Row>
                                :
                                null
                            }
                        </Flex>

                        </>
                    }

                </Skeleton>
            </Row>
        </>
    );
}

export default ShowGroups;
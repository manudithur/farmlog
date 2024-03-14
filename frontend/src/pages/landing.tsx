import { Button, Carousel, Col, Flex, Image, Row, Typography } from "antd"
import '../styles/main.css'
import Fondo from '../assets/Fondo.jpg'

const Landing : React.FC = () => {
    const {Title, Text} = Typography;
    return (
        <Flex vertical className="w-100" style={{padding: 0}}>
            <div style={{backgroundImage: `url(${Fondo})`, padding: 100}}>
                <Text type="secondary" style={{fontSize: '1.5rem', color: '#4a9f42'}}>Bienvenido a FARMLOG!</Text>
                <Title level={1} style={{margin: 0, fontWeight: 'bolder', color: 'white'}}>Monitorea las lluvias sin pluviometro</Title>
                <Button type="primary" size="large" style={{marginTop: 20}}>Solicitar demo</Button>
            </div>

            <Row style={{padding: 25}}>
                <Col span={12}>
                    <Image src={'./lotes.png'} width="100%" height="100%" preview={false} />
                </Col>
                <Col span={12}>
                    <Flex vertical style={{padding: 50}} justify="center">
                        <Text type="secondary" style={{fontSize: '1rem', color: '#4a9f42'}}>Mapeo satelital</Text>
                        <Title level={3} style={{margin: 0}}>Observa todos tus lotes en un mismo lugar</Title>
                        <Text style={{fontSize: '1rem'}} className="mt-2vh">Utilizando imagenes satelitales mappea tus lotes y observa las condiciones de los mismos en detalle.</Text>
                    </Flex>
                </Col>
            </Row>
            <Row>
            <Col span={12}>
                    <Flex vertical style={{padding: 50}} justify="center">
                        <Text type="secondary" style={{fontSize: '1rem', color: '#4a9f42'}}>Historial del lote</Text>
                        <Title level={3} style={{margin: 0}}>Accede al historial de lluvias del lote</Title>
                        <Text style={{fontSize: '1rem'}} className="mt-2vh">Accede a un historial de todas las lluvias en el lote. Se extrae la informacion de satelites climaticos.</Text>
                    </Flex>
                </Col>
                <Col span={12}>
                    <Carousel autoplay autoplaySpeed={6000} style={{overflow: 'hidden'}}>
                        <div>
                            <Image src={'./historial1.png'} width="100%" height="100%" preview={false} />      
                        </div>
                        <div>
                            <Image src={'./historial2.png'} width="100%" height="100%" preview={false} />
                        </div>
                        <div>
                            <Image src={'./historial3.png'} width="100%" height="100%" preview={false} />
                        </div>
                    </Carousel>
                </Col>
            </Row>
            <Row style={{padding: 25}}>
                <Col span={12}>
                    <Image src={'./dashboard.png'} width="100%" height="100%" preview={false} />
                </Col>
                <Col span={12}>
                    <Flex vertical style={{padding: 50}} justify="center">
                        <Text type="secondary" style={{fontSize: '1rem', color: '#4a9f42'}}>Pronostico completo</Text>
                        <Title level={3} style={{margin: 0}}>Observa el pronostico de lluvias</Title>
                        <Text style={{fontSize: '1rem'}} className="mt-2vh">Pronostico a base de radares satelitales con alta precision.</Text>
                    </Flex>
                </Col>
            </Row>
        </Flex>
    )
}

export default Landing
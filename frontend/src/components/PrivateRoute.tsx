import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/authProvider'
import Login from '../pages/login'

interface Props {
  component: React.ComponentType
  path?: string
}

export const PrivateRoute: React.FC<Props> = ({ component: RouteComponent}) => {
    const router = useNavigate();
    const {isAuthenticated} = useAuthContext()

    if (isAuthenticated) {
        return <RouteComponent />
    } else {
        router('/login')
        return <Login/>
    }
}
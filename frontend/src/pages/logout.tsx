import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/authProvider";

const Logout: React.FC = () => {
    const auth = useAuthContext();
    const router = useNavigate();
    useEffect(() => {
        auth.logout();
        router('/login');
    }, []);
    return <></>
}
export default Logout;
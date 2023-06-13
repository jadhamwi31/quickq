import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";

export default function useRole() {
    if (Cookies.get('jwt')) {
        const decode = jwt_decode(Cookies.get('jwt'))
        return decode.role
    }
    return null;
}

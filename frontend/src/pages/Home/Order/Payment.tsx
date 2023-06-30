import { useEffect } from 'react'
import Cookies from 'js-cookie';

function Payment() {
    useEffect(() => {
        const getReceipt = async () => {
            const response = await fetch('/tables/receipt', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            const json = await response.json();
            if (response.ok) {

                console.log(json)

            }
            else {
                console.log(json)
            }
        };

        getReceipt();
    }, []);
    return (
        <div>Payment</div>
    )
}

export default Payment
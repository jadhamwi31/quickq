import { OrderContext } from '../context/orderContext'
import { useContext } from 'react'

export const useOrder = () => {
    const context = useContext(OrderContext)

    if (!context) {
        throw Error('useOrderHook must be used inside an OrderContext')
    }

    return context
}
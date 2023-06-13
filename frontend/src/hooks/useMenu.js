import { menuStylesContext } from '../context/menuStylesContext'
import { useContext } from 'react'

export const useMenuContext = () => {
    const context = useContext(menuStylesContext)

    if (!context) {
        throw Error('useMenu must be used inside  MenuStylesContext')
    }

    return context
}
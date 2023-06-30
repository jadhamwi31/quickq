import { ActiveMenuContext } from '../context/ActiveMenuContext'
import { useContext } from 'react'

export const useActiveMenu = () => {
    const context = useContext(ActiveMenuContext)

    if (!context) {
        throw Error('useActiveMenuHook must be used inside an ActiveMenuContext')
    }

    return context
}
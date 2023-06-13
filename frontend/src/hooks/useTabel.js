import { TabelContext } from '../context/tableContext'
import { useContext } from 'react'

export const useTabelsContext = () => {
    const context = useContext(TabelContext)

    if (!context) {
        throw Error('useTabelsContext must be used inside an TabelsContext')
    }

    return context
}
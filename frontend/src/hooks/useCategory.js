import { CategoriesContext } from '../context/categoriesContext'
import { useContext } from 'react'

export const useCategoriesContext = () => {
    const context = useContext(CategoriesContext)

    if (!context) {
        throw Error('useCategoriesContext must be used inside an CategoriesContext')
    }

    return context
}
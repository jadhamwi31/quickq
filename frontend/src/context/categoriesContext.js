import { createContext, useReducer } from 'react'

export const CategoriesContext = createContext()

export const CategoriesReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return {
                Categories: action.payload
            }
        case 'CREATE':
            return {
                Categories: [...state.Categories, action.payload]
            }
        case 'DELETE':
            return {
                Categories: state.Categories.filter((category) => category.name !== action.payload)
            };
        case 'UPDATE':
            return {
                Categories: state.Categories.map((category) =>
                    category.name === action.payload.oldName
                        ? { ...category, name: action.payload.newName, image: action.payload.newImage }
                        : category
                ),
            };

        default:
            return state
    }
}

export const CategoriesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CategoriesReducer, {
        Categories: null
    })

    return (
        <CategoriesContext.Provider value={{ ...state, dispatch }}>
            {[children]} {/* Wrap the children in an array */}
        </CategoriesContext.Provider>
    )
}

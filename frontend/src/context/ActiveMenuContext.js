import { createContext, useReducer } from 'react'

export const ActiveMenuContext = createContext()

export const ActiveMenuReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return {
                ActiveMenu: action.payload
            }
        default:
            return state
    }
}

export const ActiveMenuContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ActiveMenuReducer, {
        ActiveMenu: null
    })

    return (
        <ActiveMenuContext.Provider value={{ ...state, dispatch }}>
            {[children]} {/* Wrap the children in an array */}
        </ActiveMenuContext.Provider>
    )
}

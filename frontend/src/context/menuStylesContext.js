import React, { createContext, useReducer } from 'react';

export const menuStylesContext = createContext();

export const menuStylesReducer = (state, action) => {
    try {
        switch (action.type) {
            case 'SET':
                return {
                    Styles: action.payload,
                };
            case 'CREATE':
                return {
                    Styles: {
                        ...state.Styles,
                        category: {
                            ...state.Styles.category,
                            [action.payload.name]: action.payload.style,
                        },
                    },
                };
            default:
                return state;
        }
    } catch (error) {
        //console.error(error);
        return state;
    }
};


export const MenuStylesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(menuStylesReducer, {
        Styles: null
    });

    return (
        <menuStylesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </menuStylesContext.Provider>
    );
};

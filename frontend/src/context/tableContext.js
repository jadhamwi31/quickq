import { createContext, useReducer } from 'react';

export const TabelContext = createContext();

export const TabelsReducer = (state, action) => {
    switch (action.type) {
        case 'SET':

            return {
                Tabels: action.payload,
            };
        case 'CREATE':
            return {
                Tabels: [...state.Tabels, action.payload],
            };
        case 'DELETE':
            return {
                Tabels: state.Tabels.filter((tabel) => tabel.id !== action.payload),
            };
        case 'UPDATE':
            return {
                Tabels: state.Tabels.map((tabel) =>
                    tabel.id === action.payload.oldCode ? { ...tabel, status: action.payload.newStatus } : tabel
                ),
            };



        default:
            return state;
    }
};
export const TabelContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(TabelsReducer, {
        Tabels: [],
    });

    return (
        <TabelContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TabelContext.Provider>
    );
};

import { createContext, useEffect, useReducer } from 'react';

export const OrderContext = createContext();

export const OrderReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return {
                Order: action.payload,
            };
        case 'ADD':
            const updatedOrder = state.Order.map((item) => {
                if (item.name === action.payload.name) {
                    return {
                        ...item,
                        quantity: item.quantity + action.payload.quantity,
                    };
                }
                return item;
            });

            const existingDish = state.Order.find(
                (item) => item.name === action.payload.name
            );
            if (existingDish) {
                const newState = {
                    ...state,
                    Order: updatedOrder,
                };

                // Save the updated order to local storage
                localStorage.setItem('order', JSON.stringify(newState.Order));
                return newState;
            }

            const newState = {
                ...state,
                Order: [...state.Order, action.payload],
            };

            // Save the updated order to local storage
            localStorage.setItem('order', JSON.stringify(newState.Order));
            return newState;
        case 'UPDATE_COUNT':
            const x = state.Order.map((item) => {
                if (item.name === action.payload.name) {
                    return {
                        ...item,
                        quantity: action.payload.quantity,
                    };
                }
                return item;
            });

            localStorage.setItem('order', JSON.stringify(x));
            return {
                Order: x,
            };
        case 'DELETE_ITEM':
            const z = state.Order.filter((item) => item.name !== action.payload.name);

            localStorage.setItem('order', JSON.stringify(z));
            return {
                Order: z,
            };
        case 'CLEAR':
            localStorage.removeItem('order');
            return {
                Order: [],
            };

        default:
            return state;
    }
};

export const OrderContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(OrderReducer, {
        Order: [],
    });

    useEffect(() => {
        const storedOrder = localStorage.getItem('order');
        if (storedOrder) {
            dispatch({ type: 'SET', payload: JSON.parse(storedOrder) });
        }
    }, []);


    return (
        <OrderContext.Provider value={{ ...state, dispatch }}>
            {children}
        </OrderContext.Provider>
    );
};

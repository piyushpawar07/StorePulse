import { createContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true, // Start as loading to verify session on initial load
    error: null,
};

// Actions
const AUTH_ACTIONS = {
    AUTH_START: 'AUTH_START',
    AUTH_SUCCESS: 'AUTH_SUCCESS',
    AUTH_FAILURE: 'AUTH_FAILURE',
    LOGOUT: 'LOGOUT',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.AUTH_START:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AUTH_ACTIONS.AUTH_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case AUTH_ACTIONS.AUTH_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload,
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };
        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch, AUTH_ACTIONS }}>
            {children}
        </AuthContext.Provider>
    );
};

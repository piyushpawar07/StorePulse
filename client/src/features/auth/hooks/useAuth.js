import { useContext, useCallback } from 'react';
import { AuthContext } from '../state/AuthContext';
import * as authApi from '../api/auth.api';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { state, dispatch, AUTH_ACTIONS } = context;

    const handleLogin = async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.AUTH_START });
        try {
            const data = await authApi.login(credentials);
            if (data.success) {
                dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.user });
                return { success: true };
            } else {
                dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: message });
            return { success: false, message };
        }
    };

    const handleRegister = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.AUTH_START });
        try {
            const data = await authApi.register(userData);
            if (data.success) {
                dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.user });
                return { success: true };
            } else {
                dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: message });
            return { success: false, message };
        }
    };

    const handleLogout = async () => {
        dispatch({ type: AUTH_ACTIONS.AUTH_START });
        try {
            await authApi.logout();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API fails, clear local state
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    const restoreSession = useCallback(async () => {
        dispatch({ type: AUTH_ACTIONS.AUTH_START });
        try {
            const data = await authApi.getMe();
            if (data.user) {
                dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.user });
            } else {
                dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: null });
            }
        } catch {
            dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: null });
        }
    }, [dispatch, AUTH_ACTIONS]);

    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    const handleChangePassword = async (passwords) => {
        try {
            const data = await authApi.changePassword(passwords);
            return { success: true, message: data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to change password';
            return { success: false, message };
        }
    };

    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        handleLogin,
        handleRegister,
        handleLogout,
        handleChangePassword,
        restoreSession,
        clearError,
    };
};

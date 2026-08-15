import { useState } from 'react';
import { createAdminUser } from '../api/admin.api';

const INITIAL_FORM = {
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
};

export const useCreateUser = ({ onSuccess } = {}) => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await createAdminUser(form);
            setSuccessMessage(data.message || 'User created successfully');
            setForm(INITIAL_FORM);
            if (onSuccess) onSuccess(data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        setForm(INITIAL_FORM);
        setError(null);
        setSuccessMessage(null);
    };

    return { form, submitting, error, successMessage, handleChange, handleSubmit, reset };
};

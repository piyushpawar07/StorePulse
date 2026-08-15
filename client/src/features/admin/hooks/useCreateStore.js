import { useState } from 'react';
import { createAdminStore } from '../api/admin.api';

const INITIAL_FORM = {
    name: '',
    email: '',
    address: '',
    ownerId: '',
};

export const useCreateStore = ({ onSuccess } = {}) => {
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
            const payload = { ...form, ownerId: Number(form.ownerId) };
            const data = await createAdminStore(payload);
            setSuccessMessage(data.message || 'Store created successfully');
            setForm(INITIAL_FORM);
            if (onSuccess) onSuccess(data.store);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store');
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

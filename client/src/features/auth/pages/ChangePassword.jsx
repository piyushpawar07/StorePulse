import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.scss';

const ChangePassword = () => {
    const { handleChangePassword } = useAuth();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [status, setStatus] = useState({ type: '', message: '' }); // 'success' | 'error'
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setStatus({ type: '', message: '' });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match.' });
            return;
        }

        setLoading(true);
        const result = await handleChangePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        });
        setLoading(false);

        if (result.success) {
            setStatus({ type: 'success', message: result.message || 'Password changed successfully!' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setStatus({ type: 'error', message: result.message });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Change Password</h2>
                <p>Update your account password</p>

                {status.message && (
                    <div className={status.type === 'success' ? 'auth-success' : 'auth-error'}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                            maxLength={16}
                        />
                        <span className="form-hint">8–16 chars, one uppercase, one special character</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <div className="auth-links">
                    <p><Link to="/">← Back to Dashboard</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;

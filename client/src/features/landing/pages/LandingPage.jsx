import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import './LandingPage.scss';

const FEATURES = [
    {
        icon: '🏪',
        title: 'Discover Stores',
        desc: 'Browse local stores and businesses, sorted by real customer ratings.',
    },
    {
        icon: '⭐',
        title: 'Rate & Review',
        desc: 'Share your honest experience with a simple 1–5 star rating for any store.',
    },
    {
        icon: '📊',
        title: 'Owner Insights',
        desc: 'Store owners get a live dashboard showing their average rating and all customer feedback.',
    },
    {
        icon: '🔒',
        title: 'Trusted & Secure',
        desc: 'Role-based access keeps data safe. Admins, owners, and users each see only what they need.',
    },
];

const LandingPage = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return null;

    if (isAuthenticated && user) {
        if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
        return <Navigate to="/stores" replace />;
    }

    return (
        <div className="landing">

            {/* ── Hero ── */}
            <section className="landing__hero">
                <div className="landing__hero-content">
                    <h1 className="landing__headline">
                        Find Stores You <span className="landing__headline--accent">Trust</span>.
                        <br />Rate the Ones You Visit.
                    </h1>

                    <p className="landing__subheadline">
                        StorePulse connects customers with local stores through genuine ratings —
                        and gives store owners the feedback they need to grow.
                    </p>

                    <div className="landing__cta-group">
                        <Link to="/register" className="landing__cta-primary">
                            Get Started
                        </Link>
                        <Link to="/login" className="landing__cta-secondary">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing__features">
                <div className="landing__section-header">
                    <h2>Everything you need to <span className="landing__headline--accent">make better choices</span></h2>
                    <p>A complete platform for customers, store owners, and administrators.</p>
                </div>

                <div className="landing__features-grid">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="landing__feature-card">
                            <span className="landing__feature-icon">{f.icon}</span>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section className="landing__bottom-cta">
                <h2>Ready to get started?</h2>
                <p>Create a free account and start exploring stores near you.</p>
                <div className="landing__cta-group">
                    <Link to="/register" className="landing__cta-primary">
                        Create Free Account
                    </Link>
                    <Link to="/login" className="landing__cta-secondary">
                        Sign In
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing__footer">
                <span>© {new Date().getFullYear()} StorePulse. All rights reserved.</span>
            </footer>

        </div>
    );
};

export default LandingPage;

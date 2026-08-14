import { Outlet } from 'react-router-dom';
import '../index.scss';

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Store Rating Platform</h1>
            </header>
            
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RepositoryPage } from './pages/RepositoryPage';
import { UsersPage } from './pages/UsersPage';
import { Layout } from './components/Layout';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Layout><RepositoryPage /></Layout>} />
                        <Route path="/users" element={<Layout><UsersPage /></Layout>} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RepositoryPage } from './pages/RepositoryPage';
import { UsersPage } from './pages/UsersPage';
import { RolesPage } from './pages/RolesPage';
import { OrgStructurePage } from './pages/OrgStructurePage';
import { SettingsPage } from './pages/SettingsPage';
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
                        <Route path="/users/system-roles" element={<Layout><RolesPage type="system" /></Layout>} />
                        <Route path="/users/organization-roles" element={<Layout><RolesPage type="organization" /></Layout>} />
                        <Route path="/users/org-structure" element={<Layout><OrgStructurePage /></Layout>} />
                        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

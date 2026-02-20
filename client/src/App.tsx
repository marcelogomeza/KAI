import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Experts } from './pages/Experts';
import { Search } from './pages/Search';
import { CareerMap } from './pages/CareerMap';
import { Guides } from './pages/Guides';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="search" element={<Search />} />
        <Route path="career" element={<CareerMap />} />
        <Route path="experts" element={<Experts />} />
        <Route path="guides" element={<Guides />} />
        <Route path="knowledge" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;

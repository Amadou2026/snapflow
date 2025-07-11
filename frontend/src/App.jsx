import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

import Dashboard from './pages/Dashboard';
import Projets from './pages/Projets';
import Axes from './pages/Axes';
import SousAxes from './pages/SousAxes';
import Tests from './pages/Tests';
import Executions from './pages/Executions';
import Rapports from './pages/Rapports';
import Utilisateurs from './pages/Utilisateurs';
import Roles from './pages/Roles';
import Login from './pages/Login';

import AjouterProjet from './pages/AjouterProjet';
import ModifierProjet from './pages/ModifierProjet';
import AjouterAxePage from './pages/AjouterAxePage';
import AjouterSousAxePage from './pages/AjouterSousAxePage';
import EditSousAxePage from './pages/EditSousAxePage';
import AjoutTestPage from './pages/AjoutTestPage';
import EditTestPage from './pages/EditTestPage';

import './app.css';

// Layout commun (Navbar + Sidebar) avec Outlet
function AppLayout() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100 overflow-x-hidden">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet /> {/* Les pages enfants s'affichent ici */}
        </main>
      </div>
      <footer className="bg-gray-800 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Snapflow Monitoring. Tous droits réservés.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page publique */}
        <Route path="/login" element={<Login />} />

        {/* Redirection racine */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Routes privées avec layout */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/axes/ajouter" element={<AjouterAxePage />} />
          <Route path="/tests/ajouter" element={<AjoutTestPage />} />
          <Route path="/tests/modifier/:id" element={<EditTestPage />} />
          <Route path="/sous-axes/modifier/:id" element={<EditSousAxePage />} />
          <Route path="/sous-axes/ajouter" element={<AjouterSousAxePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/projets/ajouter" element={<AjouterProjet />} />
          <Route path="/projets/:id/modifier" element={<ModifierProjet />} />
          <Route path="/axes" element={<Axes />} />
          <Route path="/sous-axes" element={<SousAxes />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/executions" element={<Executions />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/roles" element={<Roles />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

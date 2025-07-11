import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import TestsAutomatisesActif from '../components/TestsAutomatisesActif';
import TicketsRedmine from '../components/TicketsRedmine';
import DernieresExecutions from '../components/DernieresExecutions';
import DerniersRapports from '../components/DerniersRapports';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projets: 0,
    axes: 0,
    sousAxes: 0,
    tests: 0,
    executions: 0,
    rapports: 0,
    utilisateurs: 0,
  });
  const [tickets, setTickets] = useState([]);

  const [projets, setProjets] = useState([]);
  const [tests, setTests] = useState([]);
  const [recentExecutions, setRecentExecutions] = useState([]);
  const [recentRapports, setRecentRapports] = useState([]);
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          projetsRes,
          axesRes,
          sousAxesRes,
          testsRes,
          execRes,
          rapportsRes,
          ticketsRes,
        ] = await Promise.all([
          fetch('http://localhost:8000/api/projets/'),
          fetch('http://localhost:8000/api/axes/'),
          fetch('http://localhost:8000/api/sous-axes/'),
          fetch('http://localhost:8000/api/tests/'),
          fetch('http://localhost:8000/api/logs/'),
          fetch('http://localhost:8000/api/rapports/'),
          fetch('http://localhost:8000/api/tickets/'),  // fetch redmine tickets
        ]);

        if (
          !projetsRes.ok ||
          !axesRes.ok ||
          !sousAxesRes.ok ||
          !testsRes.ok ||
          !execRes.ok ||
          !rapportsRes.ok ||
          !ticketsRes.ok
        ) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const projetsData = await projetsRes.json();
        const axesData = await axesRes.json();
        const sousAxesData = await sousAxesRes.json();
        const testsData = await testsRes.json();
        const executionsData = await execRes.json();
        const rapportsData = await rapportsRes.json();
        const ticketsData = await ticketsRes.json();

        setProjets(projetsData);
        setTests(testsData);
        setTickets(ticketsData);

        setStats({
          projets: projetsData.length,
          axes: axesData.length,
          sousAxes: sousAxesData.length,
          tests: testsData.length,
          executions: executionsData.length,
          rapports: rapportsData.length,
          utilisateurs: stats.utilisateurs,
        });

        setRecentExecutions(
          executionsData
            .slice()
            .sort((a, b) => new Date(b.date_execution) - new Date(a.date_execution))
            .slice(0, 5)
        );

        setRecentRapports(
          rapportsData
            .slice()
            .sort((a, b) => new Date(b.date_generation) - new Date(a.date_generation))
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProjetName = (id) => {
    const projet = projets.find((p) => p.id === id);
    return projet ? projet.nom_projet : 'Inconnu';
  };

  const RapportDetailModal = ({ rapport, onClose }) => {
    if (!rapport) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Détail du rapport</h2>
          <p><strong>Projet :</strong> {getProjetName(rapport.projet)}</p>
          <p><strong>Date :</strong> {new Date(rapport.date_generation).toLocaleString()}</p>
          {/* <p><strong>Statut :</strong> {rapport.statut}</p> */}
          <div className="mt-4 p-3 bg-gray-100 rounded max-h-60 overflow-y-auto whitespace-pre-wrap text-sm border">
            {rapport.contenu}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-full h-full py-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Projets" value={stats.projets} icon="M19 11H5m14 0a2 2 0 012 2v6..." />
        <StatCard title="Axes" value={stats.axes} icon="M4 6h16M4 12h16M4 18h7" />
        <StatCard title="Sous-Axes" value={stats.sousAxes} icon="M5 13l4 4L19 7" />
        <StatCard title="Tests" value={stats.tests} icon="M9 12l2 2 4-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dernières exécutions */}
        <DernieresExecutions recentExecutions={recentExecutions} />     

        {/* Derniers rapports */}
        <DerniersRapports
          recentRapports={recentRapports}
          getProjetName={getProjetName}
          onVoirRapport={setSelectedRapport}
        />        

        {/* Conteneur pour TestsAutomatisesActif et TicketsRedmine côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
          {/* Tests actifs */}
          <div className="card bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <TestsAutomatisesActif tests={tests} projets={projets} />
            </div>
          </div>

          {/* Redmine */}
          <div className="card bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <TicketsRedmine tickets={tickets} />
            </div>
          </div>
        </div>

      </div>

      {/* Modal rapport */}
      <RapportDetailModal
        rapport={selectedRapport}
        onClose={() => setSelectedRapport(null)}
      />
    </div>
  );
};

export default Dashboard;

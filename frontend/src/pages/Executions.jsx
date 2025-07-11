import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

const ExecutionsPage = () => {
  const [executions, setExecutions] = useState([]);
  const [sousAxes, setSousAxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [executionsRes, sousAxesRes] = await Promise.all([
          fetch('http://localhost:8000/api/logs/'),
          fetch('http://localhost:8000/api/sous-axes/')
        ]);

        const executionsData = await executionsRes.json();
        const sousAxesData = await sousAxesRes.json();

        // Tri décroissant par date
        const sortedLogs = executionsData.sort(
          (a, b) => new Date(b.date_execution) - new Date(a.date_execution)
        );

        setExecutions(sortedLogs);
        setSousAxes(sousAxesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSousAxeName = (sousAxe) => {
    if (!sousAxe) return 'Inconnu';

    if (typeof sousAxe === 'object') {
      return sousAxe.nom_sous_axe || 'Inconnu';
    } else {
      const found = sousAxes.find(s => s.id === sousAxe);
      return found ? found.nom_sous_axe : 'Inconnu';
    }
  };

  const LogDetailModal = ({ log, onClose }) => {
    if (!log) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Détails du log</h2>
          <p><strong>Sous-axe:</strong> {getSousAxeName(log.sous_axe)}</p>
          <p><strong>Date:</strong> {new Date(log.date_execution).toLocaleString()}</p>
          <p><strong>Statut:</strong> {log.statut}</p>
          <div className="mt-4 p-3 bg-gray-100 rounded max-h-60 overflow-y-auto whitespace-pre-wrap text-sm border">
            {log.contenu_log}
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

  const filteredExecutions = executions.filter((execution) =>
    getSousAxeName(execution.sous_axe).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Logs d'exécution</h1>

      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un sous-axe..."
          className="form-input w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Sous-axe</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date exécution</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExecutions.map((execution, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {getSousAxeName(execution.sous_axe)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {new Date(execution.date_execution).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${execution.statut === 'Succès' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {execution.statut}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedLog(execution)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Modal */}
      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};

export default ExecutionsPage;

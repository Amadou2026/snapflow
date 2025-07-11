import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const RapportsPage = () => {
  const [rapports, setRapports] = useState([]);
  const [projets, setProjets] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRapport, setSelectedRapport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rapportsRes, projetsRes, testsRes] = await Promise.all([
          fetch('http://localhost:8000/api/rapports/'),
          fetch('http://localhost:8000/api/projets/'),
          fetch('http://localhost:8000/api/tests/')
        ]);
        
        const rapportsData = await rapportsRes.json();
        const projetsData = await projetsRes.json();
        const testsData = await testsRes.json();
        
        setRapports(rapportsData);
        setProjets(projetsData);
        setTests(testsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProjetName = (projetId) => {
    const projet = projets.find(p => p.id === projetId);
    return projet ? projet.nom_projet : 'Inconnu';
  };

  const getTestName = (testId) => {
    if (!testId) return 'Exécution manuelle';
    const test = tests.find(t => t.id === testId);
    return test ? test.nom_test : 'Test inconnu';
  };

  const downloadTxtFile = (content, filename = 'rapport.txt') => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const RapportModal = ({ rapport, onClose }) => {
    if (!rapport) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto whitespace-pre-wrap">
          <h2 className="text-xl font-bold mb-4">Contenu du rapport</h2>
          <div className="mb-4 text-sm text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
            {rapport.contenu}
          </div>
          <div className="flex justify-end">
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

  return (
    <div className="w-full h-full py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rapports</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {['Projet', 'Source', 'Date génération', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 px-4 py-2 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rapports.map((rapport, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {getProjetName(rapport.projet)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {getTestName(rapport.test)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {new Date(rapport.date_generation).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRapport(rapport)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => downloadTxtFile(rapport.contenu, `rapport_${rapport.id}.txt`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RapportModal rapport={selectedRapport} onClose={() => setSelectedRapport(null)} />
    </div>
  );
};

export default RapportsPage;

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchWithToken } from '../services/Api';
import { Link } from 'react-router-dom';

const periodOptions = [
  { value: '2m', label: 'Toutes les 2 minutes' },
  { value: '2h', label: 'Toutes les 2 heures' },
  { value: '6h', label: 'Toutes les 6 heures' },
  { value: '12h', label: 'Toutes les 12 heures' },
  { value: '24h', label: 'Une fois par jour' },
  { value: 'hebdo', label: 'Une fois par semaine' },
  { value: 'mensuel', label: 'Une fois par mois' },
];

const TestsPage = () => {
  const [tests, setTests] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [testsRes, projetsRes] = await Promise.all([
        fetchWithToken('http://localhost:8000/api/tests/'),
        fetchWithToken('http://localhost:8000/api/projets/'),
      ]);

      if (!testsRes.ok || !projetsRes.ok) throw new Error('Erreur chargement');

      setTests(await testsRes.json());
      setProjets(await projetsRes.json());
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProjetName = (id) => projets.find(p => p.id === id)?.nom_projet || 'Inconnu';

  const toggleActive = async (test) => {
    try {
      const res = await fetchWithToken(`http://localhost:8000/api/tests/${test.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actif: !test.actif }),
      });
      if (!res.ok) throw new Error('Erreur changement état');
      fetchData();
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  const deleteTest = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      const res = await fetchWithToken(`http://localhost:8000/api/tests/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur suppression');
      fetchData();
    } catch (err) {
      alert('Erreur suppression : ' + err.message);
    }
  };

  return (
    <div className="w-full h-full py-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tests automatisés</h1>
        <Link
          to="/tests/ajouter"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ajouter un test
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Nom</th>
                <th className="border px-4 py-2 text-left">Projet</th>
                <th className="border px-4 py-2 text-left">Périodicité</th>
                <th className="border px-4 py-2 text-left">Actif</th>
                <th className="border px-4 py-2 text-left">Date création</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-t hover:bg-gray-50">
                  <td className="border px-4 py-2">{test.nom_test}</td>
                  <td className="border px-4 py-2">{getProjetName(test.projet)}</td>
                  <td className="border px-4 py-2">
                    {periodOptions.find(p => p.value === test.periodicite)?.label || test.periodicite}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => toggleActive(test)}
                      className={`px-2 py-1 rounded ${test.actif ? 'bg-blue-600 text-white' : 'bg-red-600 text-black-100'}`}
                    >
                      {test.actif ? 'Oui' : 'Non'}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(test.date_creation).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/tests/modifier/${test.id}`}
                        className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-green-700"
                      >
                        Éditer
                      </Link>
                      <button
                        onClick={() => deleteTest(test.id)}
                        className="text-sm text-white bg-red-800 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestsPage;

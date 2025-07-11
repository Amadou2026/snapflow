// src/pages/SousAxesPage.jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../services/Api';

const SousAxesPage = () => {
  const [sousAxes, setSousAxes] = useState([]);
  const [axes, setAxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sousAxesRes, axesRes] = await Promise.all([
          fetchWithToken('http://localhost:8000/api/sous-axes/'),
          fetchWithToken('http://localhost:8000/api/axes/'),
        ]);
        setSousAxes(await sousAxesRes.json());
        setAxes(await axesRes.json());
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAxeName = (axeId) => {
    const axe = axes.find((a) => a.id === axeId);
    return axe ? axe.nom_axe : 'Inconnu';
  };

  const handleEdit = (id) => {
    navigate(`/sous-axes/modifier/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce sous-axe ?')) return;
    try {
      const res = await fetchWithToken(`http://localhost:8000/api/sous-axes/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setSousAxes(sousAxes.filter((sa) => sa.id !== id));
    } catch (error) {
      console.error("Erreur suppression sous-axe:", error);
    }
  };

  return (
    <div className="w-full h-full py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sous-axes</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/sous-axes/ajouter')}
        >
          Ajouter un sous-axe
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Nom</th>
                <th className="border px-4 py-2">Axe</th>
                <th className="border px-4 py-2">Actif</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sousAxes.map((sousAxe) => (
                <tr key={sousAxe.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{sousAxe.nom_sous_axe}</td>
                  <td className="border px-4 py-2">{getAxeName(sousAxe.axe)}</td>
                  <td className="border px-4 py-2">{sousAxe.active ? 'Oui' : 'Non'}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => handleEdit(sousAxe.id)}
                      >
                        Éditer
                      </button>
                      <button
                        className="text-sm bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(sousAxe.id)}
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

export default SousAxesPage;

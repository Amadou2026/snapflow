// src/pages/AxesPage.jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchWithToken } from '../services/Api';
import { useNavigate } from 'react-router-dom';

const AxesPage = () => {
  const [axes, setAxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projets, setProjets] = useState([]);
  const [editingAxeId, setEditingAxeId] = useState(null);
  const [editingAxeData, setEditingAxeData] = useState({ nom_axe: '', projet: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [axesRes, projetsRes] = await Promise.all([
        fetchWithToken('http://localhost:8000/api/axes/'),
        fetchWithToken('http://localhost:8000/api/projets/')
      ]);
      if (axesRes && projetsRes) {
        setAxes(await axesRes.json());
        setProjets(await projetsRes.json());
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (axe) => {
    setEditingAxeId(axe.id);
    setEditingAxeData({ nom_axe: axe.nom_axe, projet: axe.projet });
  };

  const cancelEditing = () => {
    setEditingAxeId(null);
    setEditingAxeData({ nom_axe: '', projet: '' });
  };

  const saveEditing = async () => {
    try {
      const response = await fetchWithToken(`http://localhost:8000/api/axes/${editingAxeId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAxeData),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      cancelEditing();
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'axe:", error);
    }
  };

  const deleteAxe = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet axe ?")) return;
    try {
      const response = await fetchWithToken(`http://localhost:8000/api/axes/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'axe:", error);
    }
  };

  const getProjetName = (projetId) => {
    const projet = projets.find(p => p.id === projetId);
    return projet ? projet.nom_projet : 'Inconnu';
  };

  return (
    <div className="w-full h-full py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Axes</h1>
        <button
          onClick={() => navigate('/axes/ajouter')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter un axe
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="table-auto w-full border-collapse border border-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Nom</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Projet</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {axes.map((axe) => (
                <tr key={axe.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {editingAxeId === axe.id ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={editingAxeData.nom_axe}
                        onChange={(e) =>
                          setEditingAxeData({ ...editingAxeData, nom_axe: e.target.value })
                        }
                      />
                    ) : (
                      <span>{axe.nom_axe}</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingAxeId === axe.id ? (
                      <select
                        className="form-select w-full"
                        value={editingAxeData.projet}
                        onChange={(e) =>
                          setEditingAxeData({ ...editingAxeData, projet: e.target.value })
                        }
                      >
                        {projets.map((projet) => (
                          <option key={projet.id} value={projet.id}>
                            {projet.nom_projet}
                          </option>
                        ))}
                      </select>
                    ) : (
                      getProjetName(axe.projet)
                    )}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    {editingAxeId === axe.id ? (
                      <>
                        <button onClick={saveEditing} className="bg-blue-600 text-white px-2 py-1 rounded">Sauvegarder</button>
                        <button onClick={cancelEditing} className="bg-red-800 text-white px-2 py-1 rounded">Annuler</button>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => startEditing(axe)} className="bg-blue-600 text-white px-2 py-1 rounded">Éditer</button>
                        <button onClick={() => deleteAxe(axe.id)} className="bg-red-800 text-white px-2 py-1 rounded">Supprimer</button>
                      </div>
                    )}
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

export default AxesPage;

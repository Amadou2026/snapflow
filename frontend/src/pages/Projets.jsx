import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchWithToken } from '../services/Api';
import { useNavigate } from 'react-router-dom';

const ProjetsPage = () => {
  const [projets, setProjets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjets();
    fetchUsers();
  }, []);

  const fetchProjets = async () => {
    try {
      setLoading(true);
      const res = await fetchWithToken('http://localhost:8000/api/projets/');
      if (!res) return;
      const data = await res.json();
      setProjets(data);
    } catch (err) {
      console.error("Erreur chargement projets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetchWithToken('http://localhost:8000/api/users/');
      if (!res) return;
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
    }
  };

  const getUserFullName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.prenom} ${user.nom}` : 'Non assigné';
  };

  const handleDeleteProjet = async (projetId) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce projet ?");
    if (!confirmDelete) return;

    try {
      const res = await fetchWithToken(`http://localhost:8000/api/projets/${projetId}/`, {
        method: 'DELETE',
      });

      if (res && res.ok) {
        setProjets((prev) => prev.filter((p) => p.id !== projetId));
      } else {
        console.error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur API suppression:", err);
    }
  };

  return (
    <div className="w-full h-full py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projets</h1>
        <button
          onClick={() => navigate('/projets/ajouter')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter un projet
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
                <th className="border border-gray-300 px-4 py-2 text-left">ID Redmine</th>
                <th className="border border-gray-300 px-4 py-2 text-left">URL</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Chargé de projet</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projets.map((projet) => (
                <tr key={projet.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{projet.nom_projet}</td>
                  <td className="border px-4 py-2">{projet.id_redmine_projet}</td>
                  <td className="border px-4 py-2">
                    <a
                      href={projet.url_projet}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {projet.url_projet}
                    </a>
                  </td>
                  <td className="border px-4 py-2">{getUserFullName(projet.chargedecompte_projet)}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/projets/${projet.id}/modifier`)}
                        className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-green-700"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProjet(projet.id)}
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

export default ProjetsPage;

// src/pages/AjouterAxePage.jsx
import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../services/Api';
import { useNavigate } from 'react-router-dom';

const AjouterAxePage = () => {
  const [projets, setProjets] = useState([]);
  const [newAxe, setNewAxe] = useState({ nom_axe: '', projet: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithToken('http://localhost:8000/api/projets/')
      .then(res => res.json())
      .then(data => setProjets(data))
      .catch(err => console.error("Erreur chargement projets", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAxe.nom_axe || !newAxe.projet) {
      alert("Tous les champs sont requis.");
      return;
    }
    try {
      const res = await fetchWithToken('http://localhost:8000/api/axes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAxe),
      });
      if (res && res.ok) {
        navigate('/axes');
      } else {
        alert("Erreur lors de l'ajout.");
      }
    } catch (error) {
      console.error("Erreur ajout axe:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Ajouter un Axe</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block font-medium">Nom de l'axe</label>
          <input
            type="text"
            className="form-input w-full"
            value={newAxe.nom_axe}
            onChange={(e) => setNewAxe({ ...newAxe, nom_axe: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Projet</label>
          <select
            className="form-select w-full"
            value={newAxe.projet}
            onChange={(e) => setNewAxe({ ...newAxe, projet: e.target.value })}
            required
          >
            <option value="">-- Sélectionner un projet --</option>
            {projets.map((projet) => (
              <option key={projet.id} value={projet.id}>{projet.nom_projet}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/axes')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterAxePage;

// src/pages/EditSousAxePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../services/Api';

const EditSousAxePage = () => {
  const { id } = useParams(); // ID du sous-axe à éditer
  const navigate = useNavigate();

  const [axes, setAxes] = useState([]);
  const [formData, setFormData] = useState({
    nom_sous_axe: '',
    axe: '',
    introduction_sous_axe: '',
    description_sous_axe: '',
    script: null,
    active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sousAxeRes, axesRes] = await Promise.all([
          fetchWithToken(`http://localhost:8000/api/sous-axes/${id}/`),
          fetchWithToken('http://localhost:8000/api/axes/'),
        ]);

        if (sousAxeRes.ok && axesRes.ok) {
          const sousAxeData = await sousAxeRes.json();
          const axesData = await axesRes.json();

          setFormData({
            nom_sous_axe: sousAxeData.nom_sous_axe || '',
            axe: sousAxeData.axe || '',
            introduction_sous_axe: sousAxeData.introduction_sous_axe || '',
            description_sous_axe: sousAxeData.description_sous_axe || '',
            script: null, // L'ancien script ne peut pas être réédité en tant que fichier
            active: sousAxeData.active ?? true,
          });

          setAxes(axesData);
        } else {
          throw new Error('Échec du chargement des données');
        }
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    }

    const response = await fetchWithToken(`http://localhost:8000/api/sous-axes/${id}/`, {
      method: 'PUT',
      body: data,
    });

    if (response.ok) {
      navigate('/sous-axes');
    } else {
      const errorData = await response.json();
      alert(`Erreur: ${JSON.stringify(errorData)}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Modifier le sous-axe</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium">Nom du sous-axe</label>
          <input
            type="text"
            name="nom_sous_axe"
            className="form-input w-full"
            value={formData.nom_sous_axe}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Axe</label>
          <select
            name="axe"
            className="form-select w-full"
            value={formData.axe}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un axe</option>
            {axes.map((axe) => (
              <option key={axe.id} value={axe.id}>
                {axe.nom_axe}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Introduction</label>
          <textarea
            name="introduction_sous_axe"
            className="form-textarea w-full"
            value={formData.introduction_sous_axe}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description_sous_axe"
            className="form-textarea w-full"
            value={formData.description_sous_axe}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium">Script (laisser vide pour ne pas changer)</label>
          <input
            type="file"
            name="script"
            accept=".js,.py,.sh,.txt"
            className="form-input w-full"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="active"
              className="form-checkbox"
              checked={formData.active}
              onChange={handleChange}
            />
            <span className="ml-2">Actif</span>
          </label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default EditSousAxePage;
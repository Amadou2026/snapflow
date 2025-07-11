// src/pages/AjouterSousAxePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../services/Api';

const AjouterSousAxePage = () => {
  const [axes, setAxes] = useState([]);
  const [formData, setFormData] = useState({
    nom_sous_axe: '',
    axe: '',
    introduction_sous_axe: '',
    description_sous_axe: '',
    script: null,
    active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadAxes = async () => {
      const res = await fetchWithToken('http://localhost:8000/api/axes/');
      if (res.ok) {
        const data = await res.json();
        setAxes(data);
      }
    };
    loadAxes();
  }, []);

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

    const response = await fetchWithToken('http://localhost:8000/api/sous-axes/', {
      method: 'POST',
      body: data,
    });

    if (response.ok) {
      navigate('/sous-axes');
    } else {
      const err = await response.json();
      alert(`Erreur: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Ajouter un sous-axe</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium">Nom du sous-axe</label>
          <input type="text" name="nom_sous_axe" required className="form-input w-full"
            value={formData.nom_sous_axe} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-medium">Axe</label>
          <select name="axe" required className="form-select w-full"
            value={formData.axe} onChange={handleChange}>
            <option value="">Sélectionner un axe</option>
            {axes.map((axe) => (
              <option key={axe.id} value={axe.id}>{axe.nom_axe}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Introduction</label>
          <textarea name="introduction_sous_axe" className="form-textarea w-full"
            value={formData.introduction_sous_axe} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea name="description_sous_axe" className="form-textarea w-full"
            value={formData.description_sous_axe} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-medium">Script</label>
          <input type="file" name="script" required className="form-input w-full"
            onChange={handleChange} accept=".py,.js,.sh,.txt" />
        </div>
        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" name="active"
              checked={formData.active} onChange={handleChange} className="form-checkbox" />
            <span className="ml-2">Actif</span>
          </label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default AjouterSousAxePage;

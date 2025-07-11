import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchWithToken } from '../services/Api';
import LoadingSpinner from '../components/LoadingSpinner';

const periodOptions = [
  { value: '2m', label: 'Toutes les 2 minutes' },
  { value: '2h', label: 'Toutes les 2 heures' },
  { value: '6h', label: 'Toutes les 6 heures' },
  { value: '12h', label: 'Toutes les 12 heures' },
  { value: '24h', label: 'Une fois par jour' },
  { value: 'hebdo', label: 'Une fois par semaine' },
  { value: 'mensuel', label: 'Une fois par mois' },
];

const EditTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom_test: '',
    projet: '',
    axes: [],
    sous_axes: [],
    periodicite: '',
    actif: true,
    emails_notification: [],
  });

  const [emailInput, setEmailInput] = useState('');
  const [projets, setProjets] = useState([]);
  const [axes, setAxes] = useState([]);
  const [sousAxes, setSousAxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper pour formater les options Select
  const toSelectOptions = (items, labelKey) =>
    items.map(item => ({
      value: item.id,
      label: item[labelKey] || item.nom_axe || item.nom_sous_axe || item.nom_projet,
    }));

  // Chargement initial
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [testRes, projetsRes, axesRes, sousAxesRes] = await Promise.all([
          fetchWithToken(`http://localhost:8000/api/tests/${id}/`),
          fetchWithToken('http://localhost:8000/api/projets/'),
          fetchWithToken('http://localhost:8000/api/axes/'),
          fetchWithToken('http://localhost:8000/api/sous-axes/'),
        ]);

        if (!testRes.ok || !projetsRes.ok || !axesRes.ok || !sousAxesRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const testData = await testRes.json();
        setFormData({
          nom_test: testData.nom_test,
          projet: testData.projet,
          axes: testData.axes,
          sous_axes: testData.sous_axes,
          periodicite: testData.periodicite,
          actif: testData.actif,
          emails_notification: testData.emails_notification || [],
        });

        setProjets(await projetsRes.json());
        setAxes(await axesRes.json());
        setSousAxes(await sousAxesRes.json());
      } catch (error) {
        console.error('Erreur chargement données :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  // Modifie un champ simple
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Ajoute un email après validation simple
  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email invalide");
      return;
    }
    if (formData.emails_notification.includes(email)) {
      alert("Email déjà ajouté");
      return;
    }
    setFormData(prev => ({
      ...prev,
      emails_notification: [...prev.emails_notification, email],
    }));
    setEmailInput('');
  };

  // Supprime un email
  const handleRemoveEmail = (emailToRemove) => {
    setFormData(prev => ({
      ...prev,
      emails_notification: prev.emails_notification.filter(e => e !== emailToRemove),
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchWithToken(`http://localhost:8000/api/tests/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      navigate('/tests');
    } catch (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier le test</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Nom du test</label>
          <input
            type="text"
            value={formData.nom_test}
            onChange={(e) => handleInputChange('nom_test', e.target.value)}
            className="form-input w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Projet</label>
          <select
            value={formData.projet}
            onChange={(e) => handleInputChange('projet', e.target.value)}
            className="form-input w-full"
            required
          >
            <option value="">Sélectionner un projet</option>
            {projets.map((p) => (
              <option key={p.id} value={p.id}>{p.nom_projet}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Axes</label>
          <Select
            isMulti
            options={toSelectOptions(axes, 'nom_axe')}
            value={toSelectOptions(axes, 'nom_axe').filter(o => formData.axes.includes(o.value))}
            onChange={(selected) => handleInputChange('axes', selected.map(s => s.value))}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sous-axes</label>
          <Select
            isMulti
            options={toSelectOptions(sousAxes, 'nom_sous_axe')}
            value={toSelectOptions(sousAxes, 'nom_sous_axe').filter(o => formData.sous_axes.includes(o.value))}
            onChange={(selected) => handleInputChange('sous_axes', selected.map(s => s.value))}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Périodicité</label>
          <Select
            options={periodOptions}
            value={periodOptions.find(p => p.value === formData.periodicite)}
            onChange={(selected) => handleInputChange('periodicite', selected ? selected.value : '')}
            isClearable
          />
        </div>

        <div className="flex items-center space-x-2 mt-6 md:mt-0">
          <input
            type="checkbox"
            id="actif"
            checked={formData.actif}
            onChange={(e) => handleInputChange('actif', e.target.checked)}
            className="form-checkbox"
          />
          <label htmlFor="actif" className="font-medium cursor-pointer">Actif</label>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Emails de notification</label>
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Ajouter un email"
              className="form-input flex-1"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            {formData.emails_notification.map(email => (
              <li key={email} className="flex justify-between items-center border-b pb-1">
                {email}
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(email)}
                  className="text-red-600 hover:underline ml-2 text-sm"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Mettre à jour
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTestPage;

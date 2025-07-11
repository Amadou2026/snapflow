import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../services/Api';

const periodOptions = [
    { value: '2m', label: 'Toutes les 2 minutes' },
    { value: '2h', label: 'Toutes les 2 heures' },
    { value: '6h', label: 'Toutes les 6 heures' },
    { value: '12h', label: 'Toutes les 12 heures' },
    { value: '24h', label: 'Une fois par jour' },
    { value: 'hebdo', label: 'Une fois par semaine' },
    { value: 'mensuel', label: 'Une fois par mois' },
];

const AjoutTestPage = () => {
    const [projets, setProjets] = useState([]);
    const [axes, setAxes] = useState([]);
    const [sousAxes, setSousAxes] = useState([]);
    const [formData, setFormData] = useState({
        nom_test: '',
        projet: '',
        axes: [],
        sous_axes: [],
        periodicite: '',
        actif: true,
        emails_notification: [''], // Initialisé avec un champ vide
    });
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [projetsRes, axesRes, sousAxesRes] = await Promise.all([
                fetchWithToken('http://localhost:8000/api/projets/'),
                fetchWithToken('http://localhost:8000/api/axes/'),
                fetchWithToken('http://localhost:8000/api/sous-axes/'),
            ]);

            setProjets(await projetsRes.json());
            setAxes(await axesRes.json());
            setSousAxes(await sousAxesRes.json());
        } catch (err) {
            console.error("Erreur chargement données:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Gérer modification email individuel
    const handleEmailChange = (index, value) => {
        const emails = [...formData.emails_notification];
        emails[index] = value;
        setFormData((prev) => ({ ...prev, emails_notification: emails }));
    };

    // Ajouter un champ email vide
    const addEmailField = () => {
        setFormData((prev) => ({
            ...prev,
            emails_notification: [...prev.emails_notification, ''],
        }));
    };

    // Supprimer un champ email
    const removeEmailField = (index) => {
        const emails = formData.emails_notification.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, emails_notification: emails }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Optionnel : nettoyer la liste des emails en enlevant vides
        const cleanedEmails = formData.emails_notification.filter(email => email.trim() !== '');

        try {
            const payload = {
                ...formData,
                emails_notification: cleanedEmails,
            };

            const response = await fetchWithToken('http://localhost:8000/api/tests/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            navigate('/tests'); // Redirection après succès
        } catch (err) {
            alert("Erreur lors de l’enregistrement : " + err.message);
        }
    };

    const toSelectOptions = (items, labelKey = 'label') =>
        items.map(item => ({
            value: item.id,
            label: item[labelKey] || item.nom_axe || item.nom_sous_axe || item.nom_projet,
        }));

    return (
    <div className="p-6 bg-white rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un test</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Nom du test */}
        <div>
          <label className="block font-medium mb-1">Nom du test</label>
          <input
            type="text"
            placeholder="Nom du test"
            className="form-input w-full"
            value={formData.nom_test}
            onChange={(e) => handleInputChange('nom_test', e.target.value)}
            required
          />
        </div>

        {/* Projet */}
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

        {/* Axes */}
        <div>
          <label className="block font-medium mb-1">Axes</label>
          <Select
            isMulti
            options={toSelectOptions(axes, 'nom_axe')}
            value={toSelectOptions(axes, 'nom_axe').filter(o => formData.axes.includes(o.value))}
            onChange={(selected) => handleInputChange('axes', selected.map(s => s.value))}
          />
        </div>

        {/* Sous-axes */}
        <div>
          <label className="block font-medium mb-1">Sous-axes</label>
          <Select
            isMulti
            options={toSelectOptions(sousAxes, 'nom_sous_axe')}
            value={toSelectOptions(sousAxes, 'nom_sous_axe').filter(o => formData.sous_axes.includes(o.value))}
            onChange={(selected) => handleInputChange('sous_axes', selected.map(s => s.value))}
          />
        </div>

        {/* Périodicité */}
        <div>
          <label className="block font-medium mb-1">Périodicité</label>
          <Select
            options={periodOptions}
            value={periodOptions.find(p => p.value === formData.periodicite)}
            onChange={(selected) => handleInputChange('periodicite', selected?.value || '')}
            isClearable
          />
        </div>

        {/* Actif */}
        <div className="flex items-center gap-2 mt-6 md:mt-0">
          <input
            type="checkbox"
            checked={formData.actif}
            onChange={(e) => handleInputChange('actif', e.target.checked)}
            className="form-checkbox"
            id="actif"
          />
          <label htmlFor="actif" className="font-medium cursor-pointer">Actif</label>
        </div>

        {/* Emails notification */}
        <div className="md:col-span-2">
          <label className="font-medium mb-2 block">Emails de notification</label>
          {formData.emails_notification.map((email, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="email"
                placeholder="Email"
                className="form-input flex-grow"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                required={index === 0}
              />
              {formData.emails_notification.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmailField(index)}
                  className="text-red-600 font-bold px-2"
                  title="Supprimer cet email"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEmailField}
            className="text-blue-600 underline"
          >
            + Ajouter un email
          </button>
        </div>

        {/* Bouton enregistrer */}
        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutTestPage;

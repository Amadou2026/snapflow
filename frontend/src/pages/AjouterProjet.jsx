import React, { useEffect, useState } from 'react';
import ProjetForm from '../components/ProjetForm';
import { fetchWithToken } from '../services/Api';
import { useNavigate } from 'react-router-dom';

const AjouterProjet = () => {
  const [projet, setProjet] = useState({
    nom_projet: '',
    id_redmine_projet: '',
    url_projet: '',
    contrat_projet: '',
    logo_projet: null,
    chargedecompte_projet: '',
  });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetchWithToken('http://localhost:8000/api/users/');
      if (!res) return;
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProjet((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in projet) {
      if (projet[key]) {
        formData.append(key, projet[key]);
      }
    }
    const res = await fetchWithToken('http://localhost:8000/api/projets/', {
      method: 'POST',
      body: formData,
    });

    if (res && res.ok) {
      navigate('/projets');
    } else {
      alert('Erreur lors de l’ajout du projet');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Ajouter un projet</h1>
      <ProjetForm projet={projet} onChange={handleChange} onSubmit={handleSubmit} users={users} />
    </div>
  );
};

export default AjouterProjet;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjetForm from '../components/ProjetForm';
import { fetchWithToken } from '../services/Api';

const ModifierProjet = () => {
  const { id } = useParams();
  const [projet, setProjet] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projetRes, usersRes] = await Promise.all([
          fetchWithToken(`http://localhost:8000/api/projets/${id}/`),
          fetchWithToken('http://localhost:8000/api/users/'),
        ]);

        if (!projetRes || !projetRes.ok) {
          throw new Error("Erreur chargement du projet");
        }

        if (!usersRes || !usersRes.ok) {
          throw new Error("Erreur chargement utilisateurs");
        }

        const projetData = await projetRes.json();
        const usersData = await usersRes.json();
        setProjet(projetData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des données");
        navigate('/projets');
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProjet((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (let key in projet) {
        if (projet[key] !== null && projet[key] !== undefined) {
          formData.append(key, projet[key]);
        }
      }

      const res = await fetchWithToken(`http://localhost:8000/api/projets/${id}/`, {
        method: 'PUT',
        body: formData,
      });

      if (!res || !res.ok) {
        throw new Error("Erreur lors de la modification");
      }

      navigate('/projets');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification du projet");
    }
  };

  if (!projet) return <p>Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl bg-blue font-bold mb-4">Modifier le projet</h1>
      <ProjetForm
        projet={projet}
        onChange={handleChange}
        onSubmit={handleSubmit}
        users={users}
        isEdit={true}
      />
    </div>
  );
};

export default ModifierProjet;

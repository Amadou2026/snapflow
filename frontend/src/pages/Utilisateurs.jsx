import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

const UtilisateursPage = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [utilisateursRes, rolesRes] = await Promise.all([
          fetch('/api/utilisateurs/'),
          fetch('/api/roles/')
        ]);
        
        const utilisateursData = await utilisateursRes.json();
        const rolesData = await rolesRes.json();
        
        setUtilisateurs(utilisateursData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.nom : 'Inconnu';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
        <button className="btn-primary">
          Ajouter un utilisateur
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          headers={['Email', 'Nom', 'Prénom', 'Rôle', 'Staff', 'Actif', 'Actions']}
          data={utilisateurs}
          renderRow={(utilisateur, index) => (
            <tr key={index}>
              <td className="font-medium text-gray-900">{utilisateur.email}</td>
              <td>{utilisateur.nom}</td>
              <td>{utilisateur.prenom}</td>
              <td>{getRoleName(utilisateur.role)}</td>
              <td>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  utilisateur.is_staff ? 'badge-success' : 'badge-error'
                }`}>
                  {utilisateur.is_staff ? 'Oui' : 'Non'}
                </span>
              </td>
              <td>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  utilisateur.is_active ? 'badge-success' : 'badge-error'
                }`}>
                  {utilisateur.is_active ? 'Oui' : 'Non'}
                </span>
              </td>
              <td>
                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Éditer</button>
                <button className="text-red-600 hover:text-red-900">Supprimer</button>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
};

export default UtilisateursPage;
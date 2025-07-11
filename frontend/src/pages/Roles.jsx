import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles/');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Erreur lors du chargement des rôles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rôles</h1>
        <button className="btn-primary">
          Ajouter un rôle
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          headers={['Nom', 'Permissions', 'Actions']}
          data={roles}
          renderRow={(role, index) => (
            <tr key={index}>
              <td className="font-medium text-gray-900">{role.nom}</td>
              <td>
                {role.permissions && role.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((perm, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 text-xs rounded">
                        {perm}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="bg-gray-100 px-2 py-1 text-xs rounded">+{role.permissions.length - 3} autres</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Aucune permission</span>
                )}
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

export default RolesPage;
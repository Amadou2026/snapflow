import React from 'react';
import DataTable from './DataTable';

const DerniersRapports = ({ recentRapports, getProjetName, onVoirRapport }) => (
  <div className="card bg-white shadow rounded-lg overflow-hidden">
    <div className="p-6">
      <h2 className="card-title mb-4 text-lg font-semibold">Derniers rapports</h2>
      <DataTable
        headers={['Projet', 'Date', 'Actions']} // 🛠️ Statut supprimé ici
        data={recentRapports}
        renderRow={(rapport, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="font-medium text-gray-900">
              {getProjetName(rapport.projet)}
            </td>
            <td>{new Date(rapport.date_generation).toLocaleString()}</td>
            <td>
              <button
                className="text-indigo-600 hover:text-indigo-900 text-sm"
                onClick={() => onVoirRapport(rapport)}
              >
                Voir
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  </div>
);

export default DerniersRapports;

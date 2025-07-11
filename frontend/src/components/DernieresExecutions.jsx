// src/components/DernieresExecutions.jsx
import React from 'react';
import DataTable from './DataTable';

const DernieresExecutions = ({ recentExecutions }) => (
  <div className="card bg-white shadow rounded-lg overflow-hidden">
    <div className="p-6">
      <h2 className="card-title mb-4 text-lg font-semibold">Dernières exécutions</h2>
      <DataTable
        headers={['Sous-axe', 'Date', 'Statut']}
        data={recentExecutions}
        renderRow={(execution, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="font-medium text-gray-900">
              {execution.sous_axe.nom_sous_axe}
            </td>
            <td>{new Date(execution.date_execution).toLocaleString()}</td>
            <td className="text-sm font-medium text-gray-800">
              {execution.statut === 'Succès' ? 'Succès' : 'Échec'}
            </td>
          </tr>
        )}
      />
    </div>
  </div>
);

export default DernieresExecutions;

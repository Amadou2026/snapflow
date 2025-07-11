import React from 'react';

const periodOptions = {
  '2m': 'Toutes les 2 minutes',
  '2h': 'Toutes les 2 heures',
  '6h': 'Toutes les 6 heures',
  '12h': 'Toutes les 12 heures',
  '24h': 'Une fois par jour',
  'hebdo': 'Une fois par semaine',
  'mensuel': 'Une fois par mois',
};

const TestsAutomatisesActif = ({ tests, projets }) => {
  // Filtrer uniquement les tests actifs
  const testsActifs = tests.filter(test => test.actif);

  // Trouver le nom du projet à partir de son id
  const getProjetName = (projetId) => {
    const projet = projets.find(p => p.id === projetId);
    return projet ? projet.nom_projet : 'Inconnu';
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Tests automatisés actifs</h2>
      {testsActifs.length === 0 ? (
        <p>Aucun test actif trouvé.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Nom du test</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Projet</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Périodicité</th>
            </tr>
          </thead>
          <tbody>
            {testsActifs.map(test => (
              <tr key={test.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{test.nom_test}</td>
                <td className="border border-gray-300 px-4 py-2">{getProjetName(test.projet)}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {periodOptions[test.periodicite] || test.periodicite}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestsAutomatisesActif;

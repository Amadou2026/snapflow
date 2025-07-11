import React from 'react';

const TicketsRedmine = ({ tickets }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tickets Redmine</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Numéro</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date d'ouverture</th>
            </tr>
          </thead>
          <tbody>
            {tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">
                    #{ticket.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        ticket.status.toLowerCase() === 'fermé'
                          ? 'bg-red-100 text-red-800'
                          : ticket.status.toLowerCase() === 'en cours'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(ticket.created_on).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  Aucun ticket trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsRedmine;

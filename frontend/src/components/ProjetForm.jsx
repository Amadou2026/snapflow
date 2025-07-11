import React from 'react';

const ProjetForm = ({ projet, onChange, onSubmit, users, isEdit = false }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <div>
        <label className="block font-medium">Nom du projet</label>
        <input
          type="text"
          name="nom_projet"
          value={projet.nom_projet}
          onChange={onChange}
          className="form-input w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">ID Redmine</label>
        <input
          type="text"
          name="id_redmine_projet"
          value={projet.id_redmine_projet}
          onChange={onChange}
          className="form-input w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">URL du projet</label>
        <input
          type="url"
          name="url_projet"
          value={projet.url_projet}
          onChange={onChange}
          className="form-input w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Contrat</label>
        <textarea
          name="contrat_projet"
          value={projet.contrat_projet}
          onChange={onChange}
          className="form-input w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Logo</label>
        <input
          type="file"
          name="logo_projet"
          accept="image/*"
          onChange={onChange}
          className="form-input w-full"
          {...(isEdit ? {} : { required: true })}
        />
      </div>

      <div>
        <label className="block font-medium">Chargé de compte</label>
        <select
          name="chargedecompte_projet"
          value={projet.chargedecompte_projet}
          onChange={onChange}
          className="form-input w-full"
          required
        >
          <option value="">Sélectionner</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.prenom} {user.nom}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {isEdit ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
};

export default ProjetForm;

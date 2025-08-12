"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useOrganigramme } from "../../hooks/useOrganigramme";

export default function AdminOrganigrammePage() {
  const { organigrammes, loading, error, createOrganigramme, updateOrganigramme, deleteOrganigramme, refreshOrganigrammes } = useOrganigramme();
  const [selectedOrganigramme, setSelectedOrganigramme] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleCreateOrganigramme = async (organigrammeData) => {
    try {
      console.log('Data envoyée pour création:', organigrammeData); // Debug
      
      const response = await createOrganigramme(organigrammeData);
      console.log('Réponse création:', response); // Debug
      
      if (response.success) {
        showNotification("Membre créé avec succès");
        setShowCreateForm(false);
        refreshOrganigrammes(); // Recharger la liste
      } else {
        showNotification(response.error || "Erreur lors de la création du membre", "error");
      }
    } catch (error) {
      console.log('Erreur création:', error); // Debug
      showNotification("Erreur lors de la création du membre", "error");
    }
  };

  const handleUpdateField = async (id, field, value) => {
    if (!id) {
      showNotification("Erreur: ID du membre manquant", "error");
      console.error("ID manquant pour la mise à jour:", { id, field, value });
      return { success: false, error: "ID manquant" };
    }
    
    try {
      const organigrammeData = { [field]: value };
      const response = await updateOrganigramme(id, organigrammeData);
      
      if (response.success) {
        showNotification(`Champ ${field} mis à jour avec succès`);
        
        // Mettre à jour selectedOrganigramme si c'est le membre en cours d'édition
        if (selectedOrganigramme && selectedOrganigramme._id === id) {
          setSelectedOrganigramme(response.data);
        }
        
        refreshOrganigrammes(); // Recharger la liste
        return { success: true };
      } else {
        const errorMsg = response.error || `Erreur lors de la mise à jour du champ ${field}`;
        showNotification(errorMsg, "error");
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      const errorMsg = `Erreur lors de la mise à jour du champ ${field}`;
      showNotification(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const handleDeleteOrganigramme = async (id) => {
    if (!id) {
      showNotification("Erreur: ID du membre manquant", "error");
      console.error("ID manquant pour la suppression:", { id });
      return;
    }
    
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      try {
        const response = await deleteOrganigramme(id);
        if (response.success) {
          showNotification("Membre supprimé avec succès");
          refreshOrganigrammes(); // Recharger la liste
        } else {
          showNotification(response.error || "Erreur lors de la suppression du membre", "error");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        showNotification("Erreur lors de la suppression du membre", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mr-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Dashboard Admin
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion de l'Organigramme</h1>
                <p className="text-gray-600">Administration des membres de l'équipe</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Site Web
              </Link>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau Membre
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === "error" 
            ? "bg-red-500 text-white" 
            : "bg-green-500 text-white"
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Membres</p>
                <p className="text-2xl font-bold text-gray-900">{organigrammes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table des membres */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tous les Membres</h2>
          </div>
          
          {error ? (
            <div className="p-6 text-center text-red-600">
              Erreur lors du chargement des membres: {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organigrammes.map((membreItem) => (
                    <tr key={membreItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {membreItem.photo ? (
                            <img 
                              src={membreItem.photo} 
                              alt={`${membreItem.firstname} ${membreItem.name}`}
                              className="w-8 h-8 object-contain mr-3"
                              onError={(e) => {
                                console.log('Erreur image:', membreItem.photo);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-red-600">❌</span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {membreItem.firstname} {membreItem.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {membreItem.photo || 'Pas de photo'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Oui
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{membreItem.email}</div>
                        <div className="text-gray-500">{membreItem.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {membreItem.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {membreItem.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrganigramme(membreItem)}
                          className="text-accent hover:text-accent/80 mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteOrganigramme(membreItem._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création */}
      {showCreateForm && (
        <CreateOrganigrammeModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateOrganigramme}
        />
      )}

      {/* Modal de modification */}
      {selectedOrganigramme && (
        <EditOrganigrammeModal
          organigramme={selectedOrganigramme}
          onClose={() => setSelectedOrganigramme(null)}
          onUpdate={handleUpdateField}
        />
      )}
    </div>
  );
}

// Composant Modal pour créer un membre
function CreateOrganigrammeModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    email: "",
    phone: "",
    photo: "",
    description: "",
    role: ""
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/organigramme', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, photo: data.filePath }));
    } catch (error) {
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation des champs requis (photo devient optionnelle)
    if (!formData.name || !formData.firstname || !formData.email || !formData.phone || !formData.description || !formData.role) {
      alert('Tous les champs sont requis');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Créer un nouveau membre</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.firstname}
                onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo (optionnelle)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-600 mt-1">Upload en cours...</p>}
            {formData.photo ? (
              <div className="mt-2">
                <img src={formData.photo} alt="Preview" className="w-16 h-16 object-contain" />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Si aucune photo n'est uploadée, une image par défaut sera utilisée</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`flex-1 px-4 py-2 rounded-md text-white ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent/90'
              }`}
            >
              {uploading ? 'Upload...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant Modal pour modifier un membre
function EditOrganigrammeModal({ organigramme, onClose, onUpdate }) {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "", field: "" });

  const showLocalNotification = (message, type = "success", field = "") => {
    setNotification({ message, type, field });
    setTimeout(() => setNotification({ message: "", type: "", field: "" }), 3000);
  };

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue || "");
    setNotification({ message: "", type: "", field: "" }); // Clear notifications when editing
  };

  const handleSave = async () => {
    try {
      const result = await onUpdate(organigramme._id, editingField, tempValue);
      if (result && result.success) {
        setEditingField(null);
        showLocalNotification(`${editingField} mis à jour avec succès ✓`, "success", editingField);
      } else {
        showLocalNotification(result?.error || `Erreur lors de la mise à jour`, "error", editingField);
      }
    } catch (error) {
      showLocalNotification(`Erreur lors de la mise à jour`, "error", editingField);
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/organigramme', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      await onUpdate(organigramme._id, 'photo', data.filePath);
    } catch (error) {
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Modifier le membre</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notification locale dans la modal */}
        {notification.message && (
          <div className={`mb-4 p-3 rounded-md ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
            {editingField === "firstname" ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <button onClick={handleSave} className="px-3 py-2 bg-green-500 text-white rounded-md">
                  ✓
                </button>
                <button onClick={() => setEditingField(null)} className="px-3 py-2 bg-gray-500 text-white rounded-md">
                  ✕
                </button>
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("firstname", organigramme.firstname)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'firstname' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{organigramme.firstname}</span>
                  {notification.field === 'firstname' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            {editingField === "name" ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <button onClick={handleSave} className="px-3 py-2 bg-green-500 text-white rounded-md">✓</button>
                <button onClick={() => setEditingField(null)} className="px-3 py-2 bg-gray-500 text-white rounded-md">✕</button>
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("name", organigramme.name)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'name' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{organigramme.name}</span>
                  {notification.field === 'name' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            <div className="flex items-center gap-4">
              <img src={organigramme.photo} alt={`${organigramme.firstname} ${organigramme.name}`} className="w-16 h-16 object-contain" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                className="flex-1"
                disabled={uploading}
              />
              {uploading && <span className="text-sm text-gray-600">Upload...</span>}
            </div>
            <p className="text-sm text-gray-500 mt-1">Cliquez pour remplacer la photo actuelle</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {editingField === "email" ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <button onClick={handleSave} className="px-3 py-2 bg-green-500 text-white rounded-md">✓</button>
                <button onClick={() => setEditingField(null)} className="px-3 py-2 bg-gray-500 text-white rounded-md">✕</button>
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("email", organigramme.email)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'email' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{organigramme.email}</span>
                  {notification.field === 'email' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            {editingField === "phone" ? (
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <button onClick={handleSave} className="px-3 py-2 bg-green-500 text-white rounded-md">✓</button>
                <button onClick={() => setEditingField(null)} className="px-3 py-2 bg-gray-500 text-white rounded-md">✕</button>
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("phone", organigramme.phone)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'phone' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{organigramme.phone}</span>
                  {notification.field === 'phone' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            {editingField === "role" ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-3 py-2 bg-green-500 text-white rounded-md">✓</button>
                  <button onClick={() => setEditingField(null)} className="px-3 py-2 bg-gray-500 text-white rounded-md">✕</button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("role", organigramme.role)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'role' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{organigramme.role}</span>
                  {notification.field === 'role' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            {editingField === "description" ? (
              <div className="space-y-2">
                <textarea
                  rows="4"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-3 py-2 bg-green-500 text-white rounded-md">✓</button>
                  <button onClick={() => setEditingField(null)} className="px-3 py-2 bg-gray-500 text-white rounded-md">✕</button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("description", organigramme.description)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 min-h-[100px] ${
                  notification.field === 'description' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex-1">{organigramme.description}</span>
                  {notification.field === 'description' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

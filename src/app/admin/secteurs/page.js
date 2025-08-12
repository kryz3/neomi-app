"use client";
import { useState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { useSecteur } from "../../hooks/useSecteur";

export default function AdminSecteursPage() {
  const { secteurs, loading, error, createSecteur, updateSecteur, deleteSecteur, refreshSecteurs } = useSecteur();
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleCreateSecteur = async (secteurData) => {
    try {
      console.log('Data envoyée pour création:', secteurData); // Debug
      
      // Vérifier que l'ordre n'est pas déjà pris
      const existingOrdres = secteurs.map(s => s.ordre);
      if (existingOrdres.includes(secteurData.ordre)) {
        showNotification(`L'ordre ${secteurData.ordre} est déjà utilisé. Choisissez un autre numéro.`, "error");
        return;
      }

      const response = await createSecteur(secteurData);
      console.log('Réponse création:', response); // Debug
      
      if (response.success) {
        showNotification("Secteur créé avec succès");
        setShowCreateForm(false);
        refreshSecteurs(); // Recharger la liste
      } else {
        showNotification(response.error || "Erreur lors de la création du secteur", "error");
      }
    } catch (error) {
      console.log('Erreur création:', error); // Debug
      showNotification("Erreur lors de la création du secteur", "error");
    }
  };

  const handleUpdateField = async (id, field, value) => {
    if (!id) {
      showNotification("Erreur: ID du secteur manquant", "error");
      console.error("ID manquant pour la mise à jour:", { id, field, value });
      return { success: false, error: "ID manquant" };
    }
    
    // Si c'est le champ ordre, vérifier qu'il n'est pas déjà pris
    if (field === 'ordre') {
      const existingOrdres = secteurs.filter(s => s._id !== id).map(s => s.ordre);
      if (existingOrdres.includes(parseInt(value))) {
        const errorMsg = `L'ordre ${value} est déjà utilisé par un autre secteur.`;
        showNotification(errorMsg, "error");
        return { success: false, error: errorMsg };
      }
    }
    
    try {
      const secteurData = { [field]: value };
      const response = await updateSecteur(id, secteurData);
      
      if (response.success) {
        showNotification(`Champ ${field} mis à jour avec succès`);
        
        // Mettre à jour selectedSecteur si c'est le secteur en cours d'édition
        if (selectedSecteur && selectedSecteur._id === id) {
          setSelectedSecteur(response.data);
        }
        
        refreshSecteurs(); // Recharger la liste
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

  const handleDeleteSecteur = async (id) => {
    if (!id) {
      showNotification("Erreur: ID du secteur manquant", "error");
      console.error("ID manquant pour la suppression:", { id });
      return;
    }
    
    if (confirm("Êtes-vous sûr de vouloir supprimer ce secteur ?")) {
      try {
        const response = await deleteSecteur(id);
        if (response.success) {
          showNotification("Secteur supprimé avec succès");
          refreshSecteurs(); // Recharger la liste
        } else {
          showNotification(response.error || "Erreur lors de la suppression du secteur", "error");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        showNotification("Erreur lors de la suppression du secteur", "error");
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
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Secteurs</h1>
                <p className="text-gray-600">Administration des secteurs d'activité</p>
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
                Nouveau Secteur
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Secteurs</p>
                <p className="text-2xl font-bold text-gray-900">{secteurs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table des secteurs */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tous les Secteurs</h2>
          </div>
          
          {error ? (
            <div className="p-6 text-center text-red-600">
              Erreur lors du chargement des secteurs: {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom du Secteur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Icône
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enjeux
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accompagnement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {secteurs.map((secteurItem) => (
                    <tr key={secteurItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {secteurItem.ordre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {secteurItem.icone ? (
                            <img 
                              src={secteurItem.icone} 
                              alt={secteurItem.nom}
                              className="w-8 h-8 object-contain mr-3"
                              onError={(e) => {
                                console.log('Erreur image:', secteurItem.icone);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-red-600">❌</span>
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {secteurItem.nom}
                          </div>
                          <div className="text-xs text-gray-500 ml-2">
                            {secteurItem.icone || 'Pas d\'icône'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Oui
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {secteurItem.enjeux}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {secteurItem.accompagnement}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedSecteur(secteurItem)}
                          className="text-accent hover:text-accent/80 mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteSecteur(secteurItem._id)}
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
        <CreateSecteurModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSecteur}
          existingSecteurs={secteurs}
        />
      )}

      {/* Modal de modification */}
      {selectedSecteur && (
        <EditSecteurModal
          secteur={selectedSecteur}
          onClose={() => setSelectedSecteur(null)}
          onUpdate={handleUpdateField}
        />
      )}
    </div>
  );
}

// Composant Modal pour créer un secteur
function CreateSecteurModal({ onClose, onSubmit, existingSecteurs }) {
  // Calculer le prochain ordre disponible
  const getNextAvailableOrdre = () => {
    const existingOrdres = existingSecteurs.map(s => s.ordre).sort((a, b) => a - b);
    let nextOrdre = 1;
    for (const ordre of existingOrdres) {
      if (ordre === nextOrdre) {
        nextOrdre++;
      } else {
        break;
      }
    }
    return nextOrdre;
  };

  const [formData, setFormData] = useState({
    nom: "",
    enjeux: "",
    accompagnement: "",
    resultats: "",
    minicas: "",
    icone: "",
    ordre: getNextAvailableOrdre()
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/secteurs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, icone: data.filePath }));
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'icône');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation des champs requis incluant l'icône
    if (!formData.nom || !formData.enjeux || !formData.accompagnement || !formData.resultats || !formData.minicas || !formData.icone) {
      alert('Tous les champs sont requis, y compris l\'icône');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Créer un nouveau secteur</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du secteur *
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icône *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={uploading}
              required={!formData.icone}
            />
            {uploading && <p className="text-sm text-gray-600 mt-1">Upload en cours...</p>}
            {formData.icone ? (
              <div className="mt-2">
                <img src={formData.icone} alt="Preview" className="w-16 h-16 object-contain" />
              </div>
            ) : (
              <p className="text-sm text-red-600 mt-1">Une icône est requise</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordre d'affichage
            </label>
            <input
              type="number"
              min="1"
              value={formData.ordre}
              onChange={(e) => {
                const newOrdre = parseInt(e.target.value) || 1;
                setFormData(prev => ({ ...prev, ordre: newOrdre }));
              }}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent ${
                existingSecteurs.some(s => s.ordre === formData.ordre) 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
            {existingSecteurs.some(s => s.ordre === formData.ordre) && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ Cet ordre est déjà utilisé
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Ordres disponibles : {(() => {
                const taken = existingSecteurs.map(s => s.ordre).sort((a, b) => a - b);
                const available = [];
                for (let i = 1; i <= Math.max(...taken, 0) + 3; i++) {
                  if (!taken.includes(i)) available.push(i);
                }
                return available.slice(0, 5).join(', ') + (available.length > 5 ? '...' : '');
              })()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enjeux *
            </label>
            <textarea
              required
              rows="3"
              value={formData.enjeux}
              onChange={(e) => setFormData(prev => ({ ...prev, enjeux: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accompagnement *
            </label>
            <textarea
              required
              rows="3"
              value={formData.accompagnement}
              onChange={(e) => setFormData(prev => ({ ...prev, accompagnement: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Résultats *
            </label>
            <textarea
              required
              rows="3"
              value={formData.resultats}
              onChange={(e) => setFormData(prev => ({ ...prev, resultats: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mini cas *
            </label>
            <textarea
              required
              rows="3"
              value={formData.minicas}
              onChange={(e) => setFormData(prev => ({ ...prev, minicas: e.target.value }))}
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
              disabled={!formData.icone || uploading}
              className={`flex-1 px-4 py-2 rounded-md text-white ${
                !formData.icone || uploading
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

// Composant Modal pour modifier un secteur
function EditSecteurModal({ secteur, onClose, onUpdate }) {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "", field: "" });

  // Récupérer la liste de tous les secteurs pour vérifier les ordres
  const { secteurs: allSecteurs } = useSecteur();

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
      const result = await onUpdate(secteur._id, editingField, tempValue);
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

  const isOrdreAlreadyTaken = (ordre) => {
    return allSecteurs && allSecteurs.some(s => s._id !== secteur._id && s.ordre === parseInt(ordre));
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/secteurs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      await onUpdate(secteur._id, 'icone', data.filePath);
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'icône');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Modifier le secteur</h3>
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
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du secteur</label>
            {editingField === "nom" ? (
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
                onClick={() => handleEdit("nom", secteur.nom)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'nom' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{secteur.nom}</span>
                  {notification.field === 'nom' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Icône */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icône *</label>
            <div className="flex items-center gap-4">
              <img src={secteur.icone} alt={secteur.nom} className="w-16 h-16 object-contain" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                className="flex-1"
                disabled={uploading}
              />
              {uploading && <span className="text-sm text-gray-600">Upload...</span>}
            </div>
            <p className="text-sm text-gray-500 mt-1">Cliquez pour remplacer l'icône actuelle</p>
          </div>

          {/* Ordre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
            {editingField === "ordre" ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className={`flex-1 border rounded-md px-3 py-2 ${
                      isOrdreAlreadyTaken(tempValue) 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  <button 
                    onClick={handleSave} 
                    disabled={isOrdreAlreadyTaken(tempValue)}
                    className={`px-3 py-2 rounded-md text-white ${
                      isOrdreAlreadyTaken(tempValue)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    ✓
                  </button>
                  <button onClick={() => setEditingField(null)} className="px-3 py-2 bg-gray-500 text-white rounded-md">✕</button>
                </div>
                {isOrdreAlreadyTaken(tempValue) && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 14c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    ⚠️ Cet ordre est déjà utilisé par un autre secteur
                  </p>
                )}
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("ordre", secteur.ordre)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'ordre' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{secteur.ordre}</span>
                  {notification.field === 'ordre' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enjeux */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enjeux</label>
            {editingField === "enjeux" ? (
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
                onClick={() => handleEdit("enjeux", secteur.enjeux)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 min-h-[100px] ${
                  notification.field === 'enjeux' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex-1">{secteur.enjeux}</span>
                  {notification.field === 'enjeux' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Accompagnement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accompagnement</label>
            {editingField === "accompagnement" ? (
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
                onClick={() => handleEdit("accompagnement", secteur.accompagnement)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 min-h-[100px] ${
                  notification.field === 'accompagnement' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex-1">{secteur.accompagnement}</span>
                  {notification.field === 'accompagnement' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Résultats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Résultats</label>
            {editingField === "resultats" ? (
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
                onClick={() => handleEdit("resultats", secteur.resultats)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 min-h-[100px] ${
                  notification.field === 'resultats' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex-1">{secteur.resultats}</span>
                  {notification.field === 'resultats' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mini cas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mini cas</label>
            {editingField === "minicas" ? (
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
                onClick={() => handleEdit("minicas", secteur.minicas)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 min-h-[100px] ${
                  notification.field === 'minicas' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex-1">{secteur.minicas}</span>
                  {notification.field === 'minicas' && notification.type === 'success' && (
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

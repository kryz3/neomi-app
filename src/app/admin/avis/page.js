"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAvis, createAvis, updateAvisField, deleteAvis } from "../../hooks/useAvis";

export default function AdminAvisPage() {
  const { avis, loading, error, refetch, setAvis } = useAvis();
  const [selectedAvis, setSelectedAvis] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleCreateAvis = async (avisData) => {
    try {
      // Vérifier que l'ordre n'est pas déjà pris
      const existingOrdres = avis.map(a => a.ordre);
      if (existingOrdres.includes(avisData.ordre)) {
        showNotification(`L'ordre ${avisData.ordre} est déjà utilisé. Choisissez un autre numéro.`, "error");
        return;
      }

      const response = await createAvis(avisData);
      showNotification("Avis créé avec succès");
      setShowCreateForm(false);
      
      // Mettre à jour l'état local directement avec le nouvel avis
      if (response.success && response.data) {
        setAvis(prevAvis => [...prevAvis, response.data]);
      }
    } catch (error) {
      showNotification("Erreur lors de la création de l'avis", "error");
    }
  };

  const handleUpdateField = async (id, field, value) => {
    if (!id) {
      showNotification("Erreur: ID de l'avis manquant", "error");
      console.error("ID manquant pour la mise à jour:", { id, field, value });
      return { success: false, error: "ID manquant" };
    }
    
    // Si c'est le champ ordre, vérifier qu'il n'est pas déjà pris
    if (field === 'ordre') {
      const existingOrdres = avis.filter(a => a._id !== id).map(a => a.ordre);
      if (existingOrdres.includes(parseInt(value))) {
        const errorMsg = `L'ordre ${value} est déjà utilisé par un autre avis.`;
        showNotification(errorMsg, "error");
        return { success: false, error: errorMsg };
      }
    }
    
    try {
      const response = await updateAvisField(id, field, value);
      showNotification(`Champ ${field} mis à jour avec succès`);
      
      // Mettre à jour l'état local directement
      if (response.success && response.data) {
        setAvis(prevAvis => 
          prevAvis.map(avis => 
            avis._id === id ? response.data : avis
          )
        );
        
        // Mettre à jour aussi selectedAvis si c'est l'avis en cours d'édition
        if (selectedAvis && selectedAvis._id === id) {
          setSelectedAvis(response.data);
        }
      }
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      const errorMsg = `Erreur lors de la mise à jour du champ ${field}`;
      showNotification(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const handleDeleteAvis = async (id) => {
    if (!id) {
      showNotification("Erreur: ID de l'avis manquant", "error");
      console.error("ID manquant pour la suppression:", { id });
      return;
    }
    
    if (confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      try {
        await deleteAvis(id);
        showNotification("Avis supprimé avec succès");
        
        // Mettre à jour l'état local directement
        setAvis(prevAvis => prevAvis.filter(avis => avis._id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        showNotification("Erreur lors de la suppression de l'avis", "error");
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
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Avis</h1>
                <p className="text-gray-600">Administration des avis clients</p>
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
                Nouvel Avis
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Avis</p>
                <p className="text-2xl font-bold text-gray-900">{avis.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avec Logo</p>
                <p className="text-2xl font-bold text-gray-900">{avis.filter(a => a.logo).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table des avis */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tous les Avis</h2>
          </div>
          
          {error ? (
            <div className="p-6 text-center text-red-600">
              Erreur lors du chargement des avis: {error}
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
                      Entreprise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Référent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommandation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {avis.map((avisItem) => (
                    <tr key={avisItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {avisItem.ordre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {avisItem.logo ? (
                            <img 
                              src={avisItem.logo} 
                              alt={avisItem.entreprise}
                              className="w-8 h-8 object-contain mr-3"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-gray-600">
                                {avisItem.entreprise.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {avisItem.entreprise}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {avisItem.referent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {avisItem.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                        {avisItem.recommandation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {avisItem.logo ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Oui
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Non
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedAvis(avisItem)}
                          className="text-accent hover:text-accent/80 mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteAvis(avisItem._id)}
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
        <CreateAvisModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateAvis}
          existingAvis={avis}
        />
      )}

      {/* Modal de modification */}
      {selectedAvis && (
        <EditAvisModal
          avis={selectedAvis}
          onClose={() => setSelectedAvis(null)}
          onUpdate={handleUpdateField}
        />
      )}
    </div>
  );
}

// Composant Modal pour créer un avis
function CreateAvisModal({ onClose, onSubmit, existingAvis }) {
  // Calculer le prochain ordre disponible
  const getNextAvailableOrdre = () => {
    const existingOrdres = existingAvis.map(a => a.ordre).sort((a, b) => a - b);
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
    entreprise: "",
    referent: "",
    role: "",
    recommandation: "",
    ordre: getNextAvailableOrdre(),
    logo: ""
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, logo: data.filePath }));
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Créer un nouvel avis</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entreprise *
            </label>
            <input
              type="text"
              required
              value={formData.entreprise}
              onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référent *
            </label>
            <input
              type="text"
              required
              value={formData.referent}
              onChange={(e) => setFormData(prev => ({ ...prev, referent: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
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
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-600 mt-1">Upload en cours...</p>}
            {formData.logo && (
              <div className="mt-2">
                <img src={formData.logo} alt="Preview" className="w-16 h-16 object-contain" />
              </div>
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
                existingAvis.some(a => a.ordre === formData.ordre) 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
            {existingAvis.some(a => a.ordre === formData.ordre) && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ Cet ordre est déjà utilisé
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Ordres disponibles : {(() => {
                const taken = existingAvis.map(a => a.ordre).sort((a, b) => a - b);
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
              Recommandation *
            </label>
            <textarea
              required
              rows="4"
              value={formData.recommandation}
              onChange={(e) => setFormData(prev => ({ ...prev, recommandation: e.target.value }))}
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
              className="flex-1 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant Modal pour modifier un avis
function EditAvisModal({ avis, onClose, onUpdate }) {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "", field: "" });

  // Récupérer la liste de tous les avis pour vérifier les ordres
  const { avis: allAvis } = useAvis();

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
      const result = await onUpdate(avis._id, editingField, tempValue);
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
    return allAvis && allAvis.some(a => a._id !== avis._id && a.ordre === parseInt(ordre));
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      await onUpdate(avis._id, 'logo', data.filePath);
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Modifier l'avis</h3>
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
          {/* Entreprise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
            {editingField === "entreprise" ? (
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
                onClick={() => handleEdit("entreprise", avis.entreprise)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'entreprise' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{avis.entreprise}</span>
                  {notification.field === 'entreprise' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {avis.logo ? (
                <img src={avis.logo} alt={avis.entreprise} className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Aucun</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                className="flex-1"
                disabled={uploading}
              />
              {uploading && <span className="text-sm text-gray-600">Upload...</span>}
            </div>
          </div>

          {/* Référent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Référent</label>
            {editingField === "referent" ? (
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
                onClick={() => handleEdit("referent", avis.referent)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'referent' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{avis.referent}</span>
                  {notification.field === 'referent' && notification.type === 'success' && (
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
                onClick={() => handleEdit("role", avis.role)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'role' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{avis.role}</span>
                  {notification.field === 'role' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
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
                    ⚠️ Cet ordre est déjà utilisé par un autre avis
                  </p>
                )}
              </div>
            ) : (
              <div 
                onClick={() => handleEdit("ordre", avis.ordre)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  notification.field === 'ordre' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{avis.ordre}</span>
                  {notification.field === 'ordre' && notification.type === 'success' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Recommandation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommandation</label>
            {editingField === "recommandation" ? (
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
                onClick={() => handleEdit("recommandation", avis.recommandation)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 min-h-[100px] ${
                  notification.field === 'recommandation' && notification.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex-1">{avis.recommandation}</span>
                  {notification.field === 'recommandation' && notification.type === 'success' && (
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

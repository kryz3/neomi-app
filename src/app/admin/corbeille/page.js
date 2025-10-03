"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, RotateCcw, Trash2 } from "lucide-react";

export default function AdminCorbeillePage() {
  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Fonction pour afficher une notification avec masquage automatique
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
  };

  useEffect(() => {
    fetchTrashItems();
    fetchStats();
  }, [filter]);

  const fetchTrashItems = async () => {
    try {
      setLoading(true);
      const url = filter ? `/api/trash?type=${filter}` : '/api/trash';
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setTrashItems(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors du chargement de la corbeille');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/trash/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const restoreItem = async (itemId, itemType) => {
    try {
      const response = await fetch(`/api/trash/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemType }),
      });

      const data = await response.json();

      if (data.success) {
        fetchTrashItems();
        fetchStats();
        showNotification('Élément restauré avec succès', 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      showNotification('Erreur lors de la restauration', 'error');
    }
  };

  const deleteItemPermanently = async (itemId, itemType) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cet élément ? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/trash/${itemId}?type=${itemType}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchTrashItems();
        fetchStats();
        showNotification('Élément supprimé définitivement', 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  const emptyTrash = async () => {
    try {
      const response = await fetch('/api/trash', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchTrashItems();
        fetchStats();
        setShowConfirmEmpty(false);
        showNotification('Corbeille vidée avec succès', 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      showNotification('Erreur lors du vidage de la corbeille', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getItemTitle = (item) => {
    switch (item.itemType) {
      case 'Article':
        return item.itemData.titre || 'Article sans titre';
      case 'Avis':
        return `${item.itemData.entreprise} - ${item.itemData.referent}`;
      case 'Secteur':
        return item.itemData.nom;
      case 'Organigramme':
        return `${item.itemData.firstname} ${item.itemData.name}`;
      default:
        return 'Élément inconnu';
    }
  };

  const getItemTypeLabel = (type) => {
    const labels = {
      'Article': 'Article',
      'Avis': 'Avis client',
      'Secteur': 'Secteur',
      'Organigramme': 'Membre équipe'
    };
    return labels[type] || type;
  };

  const getItemTypeColor = (type) => {
    const colors = {
      'Article': 'bg-blue-100 text-blue-800',
      'Avis': 'bg-green-100 text-green-800',
      'Secteur': 'bg-purple-100 text-purple-800',
      'Organigramme': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la corbeille...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gray-50 overflow-auto">
      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === "error" 
            ? "bg-red-500 text-white" 
            : notification.type === "warning"
            ? "bg-orange-500 text-white"
            : "bg-green-500 text-white"
        }`}>
          {notification.message}
        </div>
      )}

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
                <h1 className="text-3xl font-bold text-gray-900">Corbeille</h1>
                <p className="text-gray-600">Gérer les éléments supprimés</p>
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
              {trashItems.length > 0 && (
                <button
                  onClick={() => setShowConfirmEmpty(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Vider la corbeille
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      {type === 'Article' ? '📝' : type === 'Avis' ? '💬' : type === 'Secteur' ? '🏢' : '👥'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{getItemTypeLabel(type)}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filtres */}
        <div className="mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="Article">Articles</option>
                <option value="Avis">Avis clients</option>
                <option value="Secteur">Secteurs</option>
                <option value="Organigramme">Équipe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {trashItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🗑️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Corbeille vide
            </h3>
            <p className="text-gray-600">
              {filter ? `Aucun ${getItemTypeLabel(filter).toLowerCase()} dans la corbeille.` : "Aucun élément dans la corbeille pour le moment."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Élément
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supprimé le
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trashItems.map((item) => (
                    <tr key={`${item.itemType}-${item.itemId}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getItemTitle(item)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {item.itemId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getItemTypeColor(item.itemType)}`}>
                          {getItemTypeLabel(item.itemType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.deletedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => restoreItem(item.itemId, item.itemType)}
                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                            title="Restaurer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItemPermanently(item.itemId, item.itemType)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de confirmation pour vider la corbeille */}
        {showConfirmEmpty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Vider la corbeille
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cette action supprimera définitivement tous les éléments de la corbeille.
                  </p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Attention :</strong> Cette action est irréversible. Tous les éléments seront supprimés définitivement.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmEmpty(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={emptyTrash}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Vider définitivement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Détails de l'élément
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Type :</span> {getItemTypeLabel(selectedItem.itemType)}
                </div>
                <div>
                  <span className="font-medium">Titre :</span> {getItemTitle(selectedItem)}
                </div>
                <div>
                  <span className="font-medium">Supprimé le :</span> {formatDate(selectedItem.deletedAt)}
                </div>
                <div>
                  <span className="font-medium">Données :</span>
                  <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(selectedItem.itemData, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    restoreItem(selectedItem.itemId, selectedItem.itemType);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restaurer
                </button>
                <button
                  onClick={() => {
                    deleteItemPermanently(selectedItem.itemId, selectedItem.itemType);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { ArrowLeft, FileText, Download, CheckCircle, AlertCircle, XCircle, CreditCard } from 'lucide-react';

const ContraventionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await api.get('/api/utilisateurs/');
            return res.data[0]; // Assuming the viewset returns the current user in a list
        }
    });

    const { data: contravention, isLoading, error } = useQuery({
        queryKey: ['contravention', id],
        queryFn: async () => {
            const res = await api.get(`/api/contraventions/${id}/`);
            return res.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async (newStatus: string) => {
            const res = await api.patch(`/api/contraventions/${id}/`, { statut: newStatus });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contravention', id] });
            alert("Statut mis à jour avec succès !");
        },
        onError: () => {
            alert("Erreur lors de la mise à jour du statut.");
        }
    });

    // Mock payment for Citoyen
    const payMutation = useMutation({
        mutationFn: async () => {
            // Usually we would POST to /api/paiements/
            const res = await api.post(`/api/paiements/`, {
                contravention: id,
                montant: contravention.montant,
                reference: `PAY-OM-${Math.floor(Math.random() * 10000000)}`,
                mode_paiement: 'ORANGE_MONEY'
            });
            // And then update the contravention status to PAYEE
            await api.patch(`/api/contraventions/${id}/`, { statut: 'PAYEE' });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contravention', id] });
            alert("Paiement effectué avec succès !");
        },
        onError: () => {
            alert("Erreur lors du paiement.");
        }
    });

    if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
    if (error || !contravention) return <div className="p-8 text-center text-red-500">Erreur lors du chargement des détails.</div>;

    const getStatusColor = (statut: string) => {
        if (statut === 'PAYEE') return 'bg-green-100 text-green-800';
        if (statut === 'VALIDEE') return 'bg-indigo-100 text-indigo-800';
        if (statut === 'EN_ATTENTE') return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Retour
                    </button>
                    <a 
                        href={`http://localhost:8000/contraventions/${contravention.id}/pdf/`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le PDF
                    </a>
                </div>

                {/* Detail Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center">
                            <FileText className="w-6 h-6 mr-3 text-blue-600" />
                            Contravention N° {contravention.numero}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(contravention.statut)}`}>
                            {contravention.statut}
                        </span>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Informations Générales</h3>
                                <p className="text-gray-900"><span className="font-semibold">Date :</span> {new Date(contravention.date_contravention).toLocaleString('fr-FR')}</p>
                                <p className="text-gray-900"><span className="font-semibold">Lieu :</span> {contravention.lieu_adresse} ({contravention.commune})</p>
                                <p className="text-gray-900"><span className="font-semibold">Véhicule :</span> {contravention.immatriculation_vehicule} ({contravention.type_vehicule})</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Infraction</h3>
                                <p className="text-gray-900 font-medium">{contravention.infraction_details?.libelle}</p>
                                <p className="text-2xl font-extrabold text-red-600 mt-2">{parseFloat(contravention.montant).toLocaleString('fr-FR')} FCFA</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Agent Verbalisateur</h3>
                                <p className="text-gray-900">{contravention.agent_details?.first_name} {contravention.agent_details?.last_name}</p>
                                <p className="text-gray-500 text-sm">{contravention.agent_details?.service_agent}</p>
                            </div>

                            {/* Actions Buttons based on Role and Status */}
                            <div className="mt-8 space-y-3">
                                {user?.role === 'ADMIN' && contravention.statut === 'EN_ATTENTE' && (
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => updateStatusMutation.mutate('VALIDEE')}
                                            disabled={updateStatusMutation.isPending}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center"
                                        >
                                            <CheckCircle className="w-5 h-5 mr-2" /> Valider
                                        </button>
                                        <button 
                                            onClick={() => updateStatusMutation.mutate('ANNULEE')}
                                            disabled={updateStatusMutation.isPending}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center"
                                        >
                                            <XCircle className="w-5 h-5 mr-2" /> Rejeter
                                        </button>
                                    </div>
                                )}
                                
                                {user?.role === 'CITOYEN' && contravention.statut === 'VALIDEE' && (
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => payMutation.mutate()}
                                            disabled={payMutation.isPending}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center"
                                        >
                                            <CreditCard className="w-5 h-5 mr-2" /> Payer ({contravention.montant} FCFA)
                                        </button>
                                        <button 
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium flex items-center justify-center"
                                            onClick={() => alert('Fonctionnalité de contestation à venir')}
                                        >
                                            <AlertCircle className="w-5 h-5 mr-2" /> Contester
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            {/* Photo Proof */}
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Preuve Photographique</h3>
                            {contravention.photo_preuve ? (
                                <div className="rounded-lg overflow-hidden border border-gray-200">
                                    <img src={contravention.photo_preuve} alt="Preuve" className="w-full h-auto object-cover max-h-64" />
                                </div>
                            ) : (
                                <div className="bg-gray-100 rounded-lg flex items-center justify-center h-48 border border-gray-200 border-dashed">
                                    <p className="text-gray-400 text-sm">Aucune photo associée</p>
                                </div>
                            )}

                            {/* QR Code Placeholder (If actual QR code image is generated, it should be fetched, otherwise we can use a library to generate it, but since the requirement mentions QR code + PDF, PDF contains the QR code, or we can use react-qr-code) */}
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Vérification QR</h3>
                            <div className="bg-white p-4 inline-block border border-gray-200 rounded-lg shadow-sm">
                                {/* Normally we'd use a QR code library like react-qr-code here. We just show a placeholder or text for now to indicate it exists. */}
                                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400 text-center">QR Code affiché sur le PDF</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContraventionDetail;

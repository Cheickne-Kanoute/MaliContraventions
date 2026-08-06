import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  FileText, CreditCard, CheckCircle, AlertTriangle, LogOut,
  User, Download, AlertCircle, Bell, Menu, X, MessageSquare, ChevronRight
} from 'lucide-react';

interface Contravention {
    id: number; numero: string; date_contravention: string;
    immatriculation_vehicule: string; montant: number; statut: string;
    commune: string; agent_details?: any; infraction_details?: any;
}
interface Notification {
    id: number; titre: string; message: string; lue: boolean; date_creation: string;
}
interface Litige {
    id: number; motif: string; statut: string; date_depot: string; contravention: number;
}

type TabId = 'dashboard' | 'contraventions' | 'paiements' | 'contestations' | 'notifications';

const DashboardCitoyen = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabId>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fetch contraventions
    const { data: contraventions = [], isLoading } = useQuery<Contravention[]>({
        queryKey: ['citoyenContraventions'],
        queryFn: async () => {
            const res = await api.get('/api/contraventions/');
            return res.data;
        },
    });

    // Fetch notifications
    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: async () => (await api.get('/api/notifications/')).data,
    });

    // Fetch litiges
    const { data: litiges = [], refetch: refetchLitiges } = useQuery<Litige[]>({
        queryKey: ['citoyenLitiges'],
        queryFn: async () => (await api.get('/api/litiges/')).data,
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: number) => api.post(`/api/notifications/${id}/mark_read/`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    // Stats
    const totalFines = contraventions.length;
    const aPayer = contraventions.filter(c => c.statut === 'EN_ATTENTE' || c.statut === 'VALIDEE');
    const payees = contraventions.filter(c => c.statut === 'PAYEE');
    const montantDu = contraventions.filter(c => c.statut === 'VALIDEE').reduce((sum, c) => sum + parseFloat(c.montant.toString()), 0);
    const montantPaye = payees.reduce((sum, c) => sum + parseFloat(c.montant.toString()), 0);
    const unreadCount = notifications.filter(n => !n.lue).length;
    const recentContraventions = [...contraventions].sort((a, b) => b.id - a.id).slice(0, 10);

    // Litige form
    const [showLitigeModal, setShowLitigeModal] = useState(false);
    const [litigeContravention, setLitigeContravention] = useState<number | null>(null);
    const [litigeMotif, setLitigeMotif] = useState('');
    const [litigePiece, setLitigePiece] = useState<File | null>(null);

    const submitLitigeMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append('contravention_id', String(litigeContravention));
            formData.append('motif', litigeMotif);
            if (litigePiece) formData.append('piece_jointe', litigePiece);
            return api.post('/api/litiges/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        },
        onSuccess: () => {
            setShowLitigeModal(false);
            setLitigeMotif('');
            setLitigePiece(null);
            refetchLitiges();
        },
        onError: (err: any) => alert("Erreur: " + JSON.stringify(err.response?.data || err.message)),
    });

    const downloadPDF = async (ctr: Contravention) => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.setFillColor(0, 135, 81);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18); doc.setFont('helvetica', 'bold');
        doc.text('PROCÈS-VERBAL DE CONTRAVENTION', 105, 15, { align: 'center' });
        doc.setFontSize(11); doc.setFont('helvetica', 'normal');
        doc.text('République du Mali - MaliContraventions', 105, 25, { align: 'center' });
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        let y = 50;
        const addRow = (label: string, value: string) => {
            doc.setFont('helvetica', 'bold'); doc.text(label, 20, y);
            doc.setFont('helvetica', 'normal'); doc.text(value, 90, y);
            y += 10;
        };
        addRow('Numéro PV :', ctr.numero);
        addRow('Date :', new Date(ctr.date_contravention).toLocaleString('fr-FR'));
        addRow('Immatriculation :', ctr.immatriculation_vehicule);
        addRow('Infraction :', ctr.infraction_details?.libelle || 'N/A');
        addRow('Montant Amende :', parseFloat(ctr.montant.toString()).toLocaleString('fr-FR') + ' FCFA');
        addRow('Commune :', ctr.commune);
        addRow('Statut :', ctr.statut);
        addRow('Agent :', `${ctr.agent_details?.first_name || ''} ${ctr.agent_details?.last_name || ''}`.trim() || 'N/A');
        
        y += 10;
        doc.setFillColor(248, 248, 248);
        doc.rect(15, y - 5, 180, 25, 'F');
        doc.setFontSize(9);
        doc.text('Ce document est officiel. Pour vérifier son authenticité, scannez le QR Code ou rendez-vous sur malicontraventions.ml/verifier', 105, y + 5, { align: 'center', maxWidth: 170 });
        
        doc.save(`PV-${ctr.numero}.pdf`);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-green-700 text-xl font-semibold">Chargement...</div>;

    const NAV_ITEMS = [
        { id: 'dashboard' as TabId, label: 'Mon Tableau de bord', icon: User },
        { id: 'contraventions' as TabId, label: 'Mes Contraventions', icon: FileText },
        { id: 'paiements' as TabId, label: 'Mes Paiements', icon: CreditCard },
        { id: 'contestations' as TabId, label: 'Mes Contestations', icon: AlertTriangle },
        { id: 'notifications' as TabId, label: 'Notifications', icon: Bell, badge: unreadCount },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a3622] text-white flex-col transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex`}>
                <div className="p-5 border-b border-green-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded bg-green-500 flex items-center justify-center mr-3 text-white font-bold text-sm">MC</span>
                        Espace Citoyen
                    </h2>
                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-3">
                    <nav className="space-y-0.5 px-2">
                        {NAV_ITEMS.map(item => {
                            const Icon = item.icon;
                            return (
                                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm ${activeTab === item.id ? 'bg-green-700 text-white font-semibold' : 'text-green-200 hover:bg-green-800 hover:text-white'}`}>
                                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                                    {item.label}
                                    {'badge' in item && item.badge && item.badge > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{item.badge}</span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-green-800">
                    <div className="flex items-center mb-3">
                        <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">CT</div>
                        <div className="ml-3"><p className="text-sm font-medium text-white">Citoyen Malien</p><p className="text-xs text-green-300">Profil vérifié</p></div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-green-700 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 transition-colors">
                        <LogOut className="w-4 h-4 mr-2" />Déconnexion
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0">
                    <div className="flex items-center">
                        <button className="md:hidden mr-4 text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">{NAV_ITEMS.find(t => t.id === activeTab)?.label || 'Mon Dossier'}</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setActiveTab('notifications')} className="relative p-2 text-gray-400 hover:text-gray-600">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6">

                    {/* ======== DASHBOARD ======== */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white mb-6 shadow-sm">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold mb-3 border border-green-400">PORTAIL CITOYEN</div>
                                <h2 className="text-2xl font-extrabold mb-1">Vos infractions routières</h2>
                                <p className="text-green-100 text-sm">Gérez, payez ou contestez vos contraventions en toute simplicité.</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {[
                                    { label: 'Total Dossiers', value: totalFines, icon: FileText, className: 'text-gray-600 bg-gray-50' },
                                    { label: 'Amendes à Payer', value: aPayer.length, icon: AlertCircle, className: 'text-red-600 bg-red-50' },
                                    { label: 'Montant Dû', value: montantDu.toLocaleString('fr-FR') + ' FCFA', icon: CreditCard, className: 'text-red-600 bg-red-50' },
                                    { label: 'Déjà Payé', value: montantPaye.toLocaleString('fr-FR') + ' FCFA', icon: CheckCircle, className: 'text-green-600 bg-green-50' },
                                ].map((s, i) => {
                                    const Icon = s.icon;
                                    return (
                                        <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center">
                                            <div className={`w-11 h-11 rounded-lg ${s.className} flex items-center justify-center mr-3 shrink-0`}><Icon className="w-5 h-5" /></div>
                                            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p><p className="text-lg font-extrabold text-gray-900">{s.value}</p></div>
                                        </div>
                                    );
                                })}
                            </div>

                            {unreadCount > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                    <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-blue-800">{unreadCount} notification(s) non lue(s)</p>
                                        <button onClick={() => setActiveTab('notifications')} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                            Voir les notifications <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800">Dernières contraventions</h3>
                                    <button onClick={() => setActiveTab('contraventions')} className="text-sm text-green-700 font-medium hover:underline">Voir tout</button>
                                </div>
                                <ContraventionsTable contraventions={recentContraventions} navigate={navigate} downloadPDF={downloadPDF} setLitigeContravention={setLitigeContravention} setShowLitigeModal={setShowLitigeModal} setActiveTab={setActiveTab} />
                            </div>
                        </>
                    )}

                    {/* ======== CONTRAVENTIONS TAB ======== */}
                    {activeTab === 'contraventions' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800">Toutes mes contraventions ({contraventions.length})</h3>
                            </div>
                            <ContraventionsTable contraventions={recentContraventions} navigate={navigate} downloadPDF={downloadPDF} setLitigeContravention={setLitigeContravention} setShowLitigeModal={setShowLitigeModal} setActiveTab={setActiveTab} />
                        </div>
                    )}

                    {/* ======== PAIEMENTS TAB ======== */}
                    {activeTab === 'paiements' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Mes Paiements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Total Payé</p>
                                    <p className="text-3xl font-extrabold text-green-700">{montantPaye.toLocaleString('fr-FR')} <span className="text-lg font-medium">FCFA</span></p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-5 border border-red-100">
                                    <p className="text-sm text-gray-500 mb-1">Montant Restant Dû</p>
                                    <p className="text-3xl font-extrabold text-red-600">{montantDu.toLocaleString('fr-FR')} <span className="text-lg font-medium">FCFA</span></p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-3 font-medium">N° PV</th>
                                            <th className="px-6 py-3 font-medium">Infraction</th>
                                            <th className="px-6 py-3 font-medium">Montant</th>
                                            <th className="px-6 py-3 font-medium">Statut</th>
                                            <th className="px-6 py-3 font-medium">Action</th>
                                        </tr></thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {contraventions.map(c => (
                                                <tr key={c.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-mono text-xs">{c.numero}</td>
                                                    <td className="px-6 py-4 text-gray-600">{c.infraction_details?.libelle || '-'}</td>
                                                    <td className="px-6 py-4 font-bold">{parseFloat(c.montant.toString()).toLocaleString('fr-FR')} FCFA</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${c.statut === 'PAYEE' ? 'bg-green-100 text-green-800' : c.statut === 'VALIDEE' ? 'bg-indigo-100 text-indigo-800' : c.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{c.statut}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {c.statut === 'VALIDEE' && (
                                                            <button onClick={() => navigate(`/contraventions/${c.id}`)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-semibold">
                                                                Payer en ligne
                                                            </button>
                                                        )}
                                                        {c.statut === 'PAYEE' && <span className="text-green-600 text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Payée</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                            {contraventions.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucun paiement.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======== CONTESTATIONS TAB ======== */}
                    {activeTab === 'contestations' && (
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-xl font-bold text-gray-800">Mes Contestations</h3>
                                <button onClick={() => { setLitigeContravention(null); setLitigeMotif(''); setShowLitigeModal(true); }} className="flex items-center gap-2 bg-[#008751] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
                                    <MessageSquare className="w-4 h-4" />Nouvelle contestation
                                </button>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-800">
                                <p className="font-semibold mb-1">Information légale</p>
                                <p>Vous pouvez contester une contravention dans un délai de <strong>30 jours</strong> après sa date d'émission. Vous recevrez la décision de l'administration par notification.</p>
                            </div>
                            {litiges.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
                                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="font-semibold">Aucune contestation déposée</p>
                                    <p className="text-sm mt-1">Vous n'avez déposé aucune contestation pour l'instant.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                                            <th className="px-6 py-3">PV</th><th className="px-6 py-3">Motif</th>
                                            <th className="px-6 py-3">Date</th><th className="px-6 py-3">Décision</th>
                                        </tr></thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {litiges.map(l => (
                                                <tr key={l.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-mono text-xs">{`PV #${l.contravention}`}</td>
                                                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{l.motif}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(l.date_depot).toLocaleDateString('fr-FR')}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${l.statut === 'ACCEPTE' ? 'bg-green-100 text-green-800' : l.statut === 'REJETE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{l.statut}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======== NOTIFICATIONS TAB ======== */}
                    {activeTab === 'notifications' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications ({notifications.length})</h3>
                            {notifications.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
                                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="font-semibold">Aucune notification</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className={`bg-white rounded-xl border p-4 flex gap-4 ${!notif.lue ? 'border-green-200 shadow-sm' : 'border-gray-100'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notif.lue ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                <Bell className={`w-5 h-5 ${!notif.lue ? 'text-green-700' : 'text-gray-400'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`font-semibold text-sm ${!notif.lue ? 'text-gray-900' : 'text-gray-600'}`}>{notif.titre}</p>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(notif.date_creation).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                                {!notif.lue && (
                                                    <button onClick={() => markReadMutation.mutate(notif.id)} className="text-xs text-green-700 font-medium hover:underline mt-1">
                                                        Marquer comme lue
                                                    </button>
                                                )}
                                            </div>
                                            {!notif.lue && <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>

            {/* Litige Modal */}
            {showLitigeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-green-700" />Contester une contravention</h3>
                            <button onClick={() => setShowLitigeModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contravention à contester *</label>
                                <select
                                    value={litigeContravention ?? ''}
                                    onChange={e => setLitigeContravention(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm"
                                >
                                    <option value="">-- Sélectionner un PV --</option>
                                    {contraventions.filter(c => c.statut !== 'PAYEE' && c.statut !== 'ANNULEE').map(c => (
                                        <option key={c.id} value={c.id}>{c.numero} – {c.infraction_details?.libelle || 'Infraction'}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motif de la contestation *</label>
                                <textarea
                                    rows={4}
                                    value={litigeMotif}
                                    onChange={e => setLitigeMotif(e.target.value)}
                                    placeholder="Expliquez les raisons de votre contestation..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pièce justificative (optionnel)</label>
                                <input type="file" onChange={e => setLitigePiece(e.target.files?.[0] || null)} className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowLitigeModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
                                <button
                                    disabled={!litigeContravention || !litigeMotif || submitLitigeMutation.isPending}
                                    onClick={() => submitLitigeMutation.mutate()}
                                    className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitLitigeMutation.isPending ? 'Envoi...' : 'Déposer la contestation'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for the contraventions table
const ContraventionsTable = ({ contraventions, navigate, downloadPDF, setLitigeContravention, setShowLitigeModal, setActiveTab }: {
    contraventions: Contravention[]; navigate: any; downloadPDF: any;
    setLitigeContravention: any; setShowLitigeModal: any; setActiveTab: any;
}) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">N° PV</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Motif</th>
                <th className="px-6 py-3 font-medium">Montant</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {contraventions.map(ctr => (
                    <tr key={ctr.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900">{ctr.numero}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(ctr.date_contravention).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-[160px] truncate text-xs">{ctr.infraction_details?.libelle || 'Inconnue'}</td>
                        <td className="px-6 py-4 font-bold text-gray-900 text-xs whitespace-nowrap">{parseFloat(ctr.montant.toString()).toLocaleString('fr-FR')} FCFA</td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ctr.statut === 'PAYEE' ? 'bg-green-100 text-green-800' : ctr.statut === 'VALIDEE' ? 'bg-indigo-100 text-indigo-800' : ctr.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{ctr.statut}</span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                            <button onClick={() => downloadPDF(ctr)} className="text-gray-500 hover:text-gray-700 bg-gray-100 p-1.5 rounded" title="Télécharger PDF">
                                <Download className="w-3.5 h-3.5" />
                            </button>
                            {ctr.statut === 'VALIDEE' && (
                                <button onClick={() => navigate(`/contraventions/${ctr.id}`)} className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded font-medium text-xs">
                                    Payer
                                </button>
                            )}
                            {(ctr.statut === 'EN_ATTENTE' || ctr.statut === 'VALIDEE') && (
                                <button onClick={() => { setLitigeContravention(ctr.id); setShowLitigeModal(true); setActiveTab('contestations'); }} className="text-orange-600 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded font-medium text-xs">
                                    Contester
                                </button>
                            )}
                            <button onClick={() => navigate(`/contraventions/${ctr.id}`)} className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded font-medium text-xs">
                                Détail
                            </button>
                        </td>
                    </tr>
                ))}
                {contraventions.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Vous n'avez aucune contravention dans votre dossier.</td></tr>
                )}
            </tbody>
        </table>
    </div>
);

export default DashboardCitoyen;

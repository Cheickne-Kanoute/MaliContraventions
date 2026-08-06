import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  LogOut,
  User,
  Download,
  AlertCircle,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contraventionsService } from '../services/contraventionsService';
import type { Contravention } from '../types';

const DashboardCitoyen = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const { data: contraventions = [], isLoading: loading } = useQuery<Contravention[]>({
        queryKey: ['citoyenContraventions'],
        queryFn: async () => {
            try {
                return await contraventionsService.getAll();
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate('/login?role=citoyen');
                }
                throw error;
            }
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login?role=citoyen');
    };

    // Calculate Stats
    const totalFines = contraventions.length;
    const aPayer = contraventions.filter(c => c.statut === 'EN_ATTENTE' || c.statut === 'VALIDEE');
    const payees = contraventions.filter(c => c.statut === 'PAYEE');
    
    const montantDu = aPayer.filter(c => c.statut === 'VALIDEE').reduce((sum, c) => sum + parseFloat(c.montant.toString()), 0);
    const montantPaye = payees.reduce((sum, c) => sum + parseFloat(c.montant.toString()), 0);

    const recentContraventions = [...contraventions].sort((a, b) => b.id - a.id).slice(0, 10);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-green-600">Chargement du tableau de bord...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar (Green for Citoyen) - Desktop & Mobile */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a3622] text-white flex-col transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex`}>
                <div className="p-6 border-b border-green-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded bg-green-500 flex items-center justify-center mr-3 text-white font-bold">C</span>
                        Espace Citoyen
                    </h2>
                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-3 py-2.5 rounded-lg ${activeTab === 'dashboard' ? 'bg-green-800 text-white' : 'text-green-200 hover:bg-green-800 hover:text-white transition-colors'}`}>
                            <User className="w-5 h-5 mr-3" />
                            Mon Tableau de bord
                        </button>
                        <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className="w-full flex items-center px-3 py-2.5 text-green-200 hover:bg-green-800 hover:text-white rounded-lg transition-colors">
                            <FileText className="w-5 h-5 mr-3" />
                            Mes Contraventions
                        </button>
                        <button onClick={() => alert("La page de paiement dédiée sera bientôt disponible.")} className="w-full flex items-center px-3 py-2.5 text-green-200 hover:bg-green-800 hover:text-white rounded-lg transition-colors">
                            <CreditCard className="w-5 h-5 mr-3" />
                            Paiements en ligne
                        </button>
                        <button onClick={() => { setActiveTab('contestations'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-3 py-2.5 rounded-lg ${activeTab === 'contestations' ? 'bg-green-800 text-white' : 'text-green-200 hover:bg-green-800 hover:text-white transition-colors'}`}>
                            <AlertTriangle className="w-5 h-5 mr-3" />
                            Mes Contestations
                        </button>
                    </nav>
                </div>
                <div className="p-4 border-t border-green-800">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold">CT</div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">Citoyen Malien</p>
                            <p className="text-xs text-green-300">Profil vérifié</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-green-700 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 transition-colors">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
                    <div className="flex items-center">
                        <button className="md:hidden mr-4 text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[150px] sm:max-w-none">Mon Dossier</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-gray-500">
                            <Bell className="w-6 h-6" />
                            {aPayer.length > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                    </div>
                </header>

                    {/* Dashboard Body */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                        {activeTab === 'dashboard' && (
                            <>
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white mb-6 shadow-sm">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold mb-3 shadow-sm border border-green-400">
                            PORTAIL CITOYEN
                        </div>
                        <h2 className="text-2xl font-extrabold mb-1">Vos infractions routières</h2>
                        <p className="text-green-100 text-sm">Gérez, payez ou contestez vos contraventions en toute simplicité et transparence.</p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mr-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Dossiers</p>
                                <p className="text-2xl font-extrabold text-gray-900">{totalFines}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-red-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-4">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Amendes à Payer</p>
                                <p className="text-2xl font-extrabold text-red-600">{aPayer.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-red-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-4">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Montant Dû</p>
                                <p className="text-2xl font-extrabold text-red-600">{montantDu.toLocaleString('fr-FR')} <span className="text-sm font-medium">FCFA</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Déjà Payé</p>
                                <p className="text-2xl font-extrabold text-gray-900">{montantPaye.toLocaleString('fr-FR')} <span className="text-sm font-medium">FCFA</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Table Row */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-white">
                            <h3 className="text-lg font-bold text-gray-800">Historique de vos contraventions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-3 font-medium">N° PV</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Motif (Infraction)</th>
                                        <th className="px-6 py-3 font-medium">Montant</th>
                                        <th className="px-6 py-3 font-medium">Statut</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {recentContraventions.map((ctr) => (
                                        <tr 
                                            key={ctr.id} 
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/contraventions/${ctr.id}`)}
                                        >
                                            <td className="px-6 py-4 font-mono font-medium text-gray-900">{ctr.numero}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(ctr.date_contravention).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{ctr.infraction_details?.libelle || 'Inconnue'}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{parseFloat(ctr.montant.toString()).toLocaleString('fr-FR')} FCFA</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    ctr.statut === 'PAYEE' ? 'bg-green-100 text-green-800' : 
                                                    ctr.statut === 'VALIDEE' ? 'bg-indigo-100 text-indigo-800' : 
                                                    ctr.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {ctr.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="text-gray-500 hover:text-gray-700 bg-gray-100 p-1.5 rounded" title="Télécharger PDF">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                {ctr.statut === 'VALIDEE' && (
                                                    <button className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded font-medium text-xs">
                                                        Payer
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentContraventions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Vous n'avez aucune contravention dans votre dossier.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </>
                    )}

                    {activeTab === 'contestations' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <AlertTriangle className="w-6 h-6 mr-3 text-yellow-500" />
                                Suivi de vos contestations (Litiges)
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Ici vous pourrez suivre l'état d'avancement des contestations que vous avez soumises. La fonctionnalité de soumission de nouvelles preuves ou contestations est en cours de déploiement final.
                            </p>
                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-start">
                                <AlertCircle className="w-5 h-5 mr-3 mt-0.5" />
                                <div className="text-sm">
                                    <strong>Rappel légal :</strong> Toute contestation non justifiée peut entraîner une majoration de l'amende initiale. Assurez-vous d'avoir des preuves valables (photos, documents) avant d'initier un litige.
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardCitoyen;

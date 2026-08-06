import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  FileText, 
  Hourglass, 
  CheckCircle, 
  AlertCircle, 
  LogOut,
  LayoutDashboard,
  Search,
  Bell,
  MapPin,
  PlusCircle
} from 'lucide-react';

interface Contravention {
    id: number;
    numero: string;
    date_contravention: string;
    immatriculation_vehicule: string;
    montant: number;
    statut: string;
    commune: string;
    citoyen_details?: any;
    infraction_details?: any;
}

const DashboardAgent = () => {
    const navigate = useNavigate();
    const [contraventions, setContraventions] = useState<Contravention[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch contraventions (Backend automatically filters for the logged-in agent)
                const res = await api.get('/api/contraventions/');
                setContraventions(res.data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate('/login?role=agent');
                }
                console.error("Erreur lors de la récupération des données", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login?role=agent');
    };

    // Calculate Stats
    const totalCreees = contraventions.length;
    const enAttente = contraventions.filter(c => c.statut === 'EN_ATTENTE').length;
    const validees = contraventions.filter(c => c.statut === 'VALIDEE').length;
    const payees = contraventions.filter(c => c.statut === 'PAYEE').length;
    
    const recentContraventions = [...contraventions].sort((a, b) => b.id - a.id).slice(0, 10);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600">Chargement du tableau de bord...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar (Blue for Agent) */}
            <div className="w-64 bg-blue-900 text-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-blue-800">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center mr-3 text-white font-bold">P</span>
                        Agent Panel
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <a href="#" className="flex items-center px-3 py-2.5 bg-blue-800 text-white rounded-lg">
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Mon Tableau de bord
                        </a>
                        <a href="#" className="flex items-center px-3 py-2.5 text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors">
                            <PlusCircle className="w-5 h-5 mr-3" />
                            Dresser un PV
                        </a>
                        <a href="#" className="flex items-center px-3 py-2.5 text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors">
                            <FileText className="w-5 h-5 mr-3" />
                            Mes Contraventions
                        </a>
                        <a href="#" className="flex items-center px-3 py-2.5 text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors">
                            <MapPin className="w-5 h-5 mr-3" />
                            Carte (Mon Secteur)
                        </a>
                    </nav>
                </div>
                <div className="p-4 border-t border-blue-800">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">AG</div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">Agent de Police</p>
                            <p className="text-xs text-blue-300">CCR / Unité 3</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-blue-700 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 transition-colors">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">Mon Espace de Travail</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Nouveau PV
                        </button>
                        <div className="relative hidden sm:block">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <button className="relative p-2 text-gray-400 hover:text-gray-500">
                            <Bell className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Dashboard Body */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 text-white mb-6 shadow-sm">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold mb-3 shadow-sm border border-blue-500">
                            ESPACE AGENT DE POLICE
                        </div>
                        <h2 className="text-2xl font-extrabold mb-1">Unité de Verbalisation</h2>
                        <p className="text-blue-100 text-sm">Police Nationale / CCR (Consultez vos statistiques personnelles et dressez de nouveaux PV)</p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">PV Dressés</p>
                                <p className="text-2xl font-extrabold text-gray-900">{totalCreees}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4">
                                <Hourglass className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">En Attente</p>
                                <p className="text-2xl font-extrabold text-gray-900">{enAttente}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Validées</p>
                                <p className="text-2xl font-extrabold text-gray-900">{validees}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payées</p>
                                <p className="text-2xl font-extrabold text-gray-900">{payees}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Row */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="text-lg font-bold text-gray-800">Mes Dernières Contraventions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-3 font-medium">N° PV</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Citoyen (Contrevenant)</th>
                                        <th className="px-6 py-3 font-medium">Infraction</th>
                                        <th className="px-6 py-3 font-medium">Montant</th>
                                        <th className="px-6 py-3 font-medium">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {recentContraventions.map((ctr) => (
                                        <tr key={ctr.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-gray-900">{ctr.numero}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(ctr.date_contravention).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{ctr.citoyen_details?.first_name || 'Inconnu'} {ctr.citoyen_details?.last_name || ''}</td>
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
                                        </tr>
                                    ))}
                                    {recentContraventions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Vous n'avez dressé aucune contravention.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default DashboardAgent;

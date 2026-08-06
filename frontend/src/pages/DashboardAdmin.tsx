import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  FileText, 
  Hourglass, 
  CheckCircle, 
  DollarSign, 
  LogOut,
  LayoutDashboard,
  Users,
  MapPin,
  Settings,
  Bell,
  Search,
  UserPlus,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Contravention {
    id: number;
    numero: string;
    date_contravention: string;
    immatriculation_vehicule: string;
    montant: number;
    statut: string;
    commune: string;
    agent_details?: any;
    citoyen_details?: any;
    infraction_details?: any;
}

}

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    telephone: string;
    badge_agent?: string;
    nin_carte_identite?: string;
}

const COLORS = ['#008751', '#FCD116', '#CE1126', '#6b7280'];

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [contraventions, setContraventions] = useState<Contravention[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [totalRecettes, setTotalRecettes] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // User Modal State
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        first_name: '', last_name: '', email: '', password: '', role: 'AGENT', telephone: '', badge_agent: '', nin_carte_identite: ''
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch contraventions
                const resContraventions = await api.get('/api/contraventions/');
                const data: Contravention[] = resContraventions.data;
                setContraventions(data);

                // Fetch paiements to calculate total recettes
                const resPaiements = await api.get('/api/paiements/');
                const recettes = resPaiements.data.reduce((sum: number, p: any) => sum + parseFloat(p.montant), 0);
                setTotalRecettes(recettes);

                // Fetch users
                const resUsers = await api.get('/api/utilisateurs/');
                setUsers(resUsers.data);

            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate('/login');
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
        navigate('/login');
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const username = newUser.email.split('@')[0];
            const payload = { ...newUser, username };
            await api.post('/api/utilisateurs/', payload);
            alert("Utilisateur créé avec succès !");
            setShowUserModal(false);
            // Refresh users
            const resUsers = await api.get('/api/utilisateurs/');
            setUsers(resUsers.data);
            setNewUser({ first_name: '', last_name: '', email: '', password: '', role: 'AGENT', telephone: '', badge_agent: '', nin_carte_identite: '' });
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur", error);
            alert("Erreur lors de la création de l'utilisateur.");
        }
    };

    // Calculate Stats
    const totalPV = contraventions.length;
    const enAttente = contraventions.filter(c => c.statut === 'EN_ATTENTE').length;
    const payees = contraventions.filter(c => c.statut === 'PAYEE').length;
    const annulees = contraventions.filter(c => c.statut === 'ANNULEE').length;
    
    const recentContraventions = [...contraventions].sort((a, b) => b.id - a.id).slice(0, 5);

    // Data for Pie Chart (Statuts)
    const pieData = [
        { name: 'Payées', value: payees },
        { name: 'En Attente', value: enAttente },
        { name: 'Annulées', value: annulees },
    ];

    // Data for Bar Chart (Communes)
    const communesCount: Record<string, number> = {};
    contraventions.forEach(c => {
        const com = c.commune || 'Inconnue';
        communesCount[com] = (communesCount[com] || 0) + 1;
    });
    const barData = Object.keys(communesCount).map(key => ({
        name: key,
        total: communesCount[key]
    })).sort((a, b) => b.total - a.total).slice(0, 5);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-mali-green">Chargement du tableau de bord...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-mali-dark text-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded bg-mali-green flex items-center justify-center mr-3 text-white font-bold">M</span>
                        Admin Panel
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-mali-green bg-opacity-20 text-mali-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Tableau de bord
                        </button>
                        <button className="w-full flex items-center px-3 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                            <FileText className="w-5 h-5 mr-3" />
                            Contraventions
                        </button>
                        <button onClick={() => setActiveTab('utilisateurs')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'utilisateurs' ? 'bg-mali-green bg-opacity-20 text-mali-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                            <Users className="w-5 h-5 mr-3" />
                            Agents & Citoyens
                        </button>
                        <a href="#" className="flex items-center px-3 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                            <MapPin className="w-5 h-5 mr-3" />
                            Géolocalisation
                        </a>
                        <a href="#" className="flex items-center px-3 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                            <Settings className="w-5 h-5 mr-3" />
                            Paramètres
                        </a>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">A</div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">Administrateur</p>
                            <p className="text-xs text-gray-400">admin@police.ml</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors">
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
                        <h1 className="text-xl font-bold text-gray-800">Vue d'ensemble</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input type="text" placeholder="Rechercher un PV..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mali-green focus:border-transparent" />
                        </div>
                        <button className="relative p-2 text-gray-400 hover:text-gray-500">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-mali-red rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Body */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 relative">
                    
                    {activeTab === 'dashboard' && (
                        <>
                            {/* Welcome Banner */}
                            <div className="bg-gradient-to-r from-[#008751] to-[#005231] rounded-xl p-6 text-white mb-6 shadow-sm">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-mali-yellow text-mali-dark text-xs font-bold mb-3 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-mali-dark mr-2"></span> ESPACE ADMINISTRATEUR
                        </div>
                        <h2 className="text-2xl font-extrabold mb-1">Supervision globale de la sécurité routière</h2>
                        <p className="text-green-100 text-sm">Suivez en temps réel les infractions, les encaissements et les performances des agents sur tout le territoire.</p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total PV</p>
                                <p className="text-2xl font-extrabold text-gray-900">{totalPV}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4">
                                <Hourglass className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">En Attente</p>
                                <p className="text-2xl font-extrabold text-gray-900">{enAttente}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Payées</p>
                                <p className="text-2xl font-extrabold text-gray-900">{payees}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recettes</p>
                                <p className="text-2xl font-extrabold text-gray-900">{totalRecettes.toLocaleString('fr-FR')} <span className="text-sm font-medium text-gray-500">FCFA</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Communes Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 text-mali-green mr-2" />
                                Infractions par Commune
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Bar dataKey="total" fill="#008751" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Status Pie Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <FileText className="w-5 h-5 text-mali-yellow mr-2" />
                                Répartition des Statuts
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center space-x-4 mt-2">
                                    <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-mali-green mr-1"></span> Payées</div>
                                    <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-mali-yellow mr-1"></span> Attente</div>
                                    <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-mali-red mr-1"></span> Annulées</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Row */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Dernières Contraventions</h3>
                            <button className="text-sm font-medium text-mali-green hover:text-green-800">Voir tout</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-3 font-medium">N° PV</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Citoyen</th>
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
                                            <td className="px-6 py-4 font-bold text-gray-900">{parseFloat(ctr.montant.toString()).toLocaleString('fr-FR')} FCFA</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    ctr.statut === 'PAYEE' ? 'bg-green-100 text-green-800' : 
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
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucune contravention récente.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                        </>
                    )}

                    {activeTab === 'utilisateurs' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                                <button onClick={() => setShowUserModal(true)} className="bg-mali-green hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm">
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Nouvel Utilisateur
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                                <th className="px-6 py-3 font-medium">Nom & Prénom</th>
                                                <th className="px-6 py-3 font-medium">Email</th>
                                                <th className="px-6 py-3 font-medium">Rôle</th>
                                                <th className="px-6 py-3 font-medium">Téléphone</th>
                                                <th className="px-6 py-3 font-medium text-center">Identifiant (Badge/NINA)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {users.map(u => (
                                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-gray-900">{u.first_name} {u.last_name}</td>
                                                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                            u.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800' : 
                                                            u.role === 'AGENT' ? 'bg-blue-100 text-blue-800' : 
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{u.telephone || '-'}</td>
                                                    <td className="px-6 py-4 text-center font-mono text-gray-500">
                                                        {u.role === 'AGENT' ? u.badge_agent : u.nin_carte_identite || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Creation Modal */}
                    {showUserModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                        <UserPlus className="w-5 h-5 mr-2 text-mali-green" />
                                        Créer un compte
                                    </h3>
                                    <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleCreateUser} className="p-6 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                            <input type="text" required value={newUser.first_name} onChange={e => setNewUser({...newUser, first_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                            <input type="text" required value={newUser.last_name} onChange={e => setNewUser({...newUser, last_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                            <input type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                                            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none bg-white">
                                                <option value="AGENT">Agent de Police</option>
                                                <option value="CITOYEN">Citoyen</option>
                                                <option value="ADMIN">Administrateur</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                            <input type="text" value={newUser.telephone} onChange={e => setNewUser({...newUser, telephone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none" />
                                        </div>
                                    </div>

                                    {newUser.role === 'AGENT' && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Badge (Matricule)</label>
                                            <input type="text" required value={newUser.badge_agent} onChange={e => setNewUser({...newUser, badge_agent: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none" />
                                        </div>
                                    )}

                                    {newUser.role === 'CITOYEN' && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro NINA / Carte d'identité</label>
                                            <input type="text" required value={newUser.nin_carte_identite} onChange={e => setNewUser({...newUser, nin_carte_identite: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mali-green outline-none" />
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 mt-8">
                                        <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                                            Annuler
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-mali-green text-white rounded-lg hover:bg-green-800 font-medium">
                                            Créer l'utilisateur
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default DashboardAdmin;

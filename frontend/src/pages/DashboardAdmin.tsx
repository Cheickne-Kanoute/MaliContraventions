import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { contraventionsService } from '../services/contraventionsService';
import { paymentsService } from '../services/paymentsService';
import { usersService } from '../services/usersService';
import type { Contravention, User } from '../types';
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
  X,
  Menu
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Types are imported from ../types

const COLORS = ['#008751', '#FCD116', '#CE1126', '#6b7280'];

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: dashboardData, isLoading: loading } = useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            try {
                const [resContraventions, resPaiements, resUsers] = await Promise.all([
                    contraventionsService.getAll(),
                    paymentsService.getAll(),
                    usersService.getAll()
                ]);

                const recettes = resPaiements.reduce((sum: number, p: any) => sum + parseFloat(p.montant), 0);

                return {
                    contraventions: resContraventions,
                    totalRecettes: recettes,
                    users: resUsers
                };
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate('/login');
                }
                console.error("Erreur lors de la récupération des données", error);
                throw error;
            }
        }
    });

    const contraventions = dashboardData?.contraventions || [];
    const users = dashboardData?.users || [];
    const totalRecettes = dashboardData?.totalRecettes || 0;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    // User Modal State
    const [showUserModal, setShowUserModal] = useState(false);
    const { data: geolocData } = useQuery({
        queryKey: ['geolocData'],
        queryFn: async () => {
            return await contraventionsService.getGeoloc();
        },
        enabled: activeTab === 'geolocalisation'
    });

    const [newUser, setNewUser] = useState({
        first_name: '', last_name: '', email: '', password: '', role: 'AGENT', telephone: '', badge_agent: '', nin_carte_identite: ''
    });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const username = newUser.email.split('@')[0];
            const payload = { ...newUser, username };
            await api.post('/api/utilisateurs/', payload);
            alert("Utilisateur créé avec succès !");
            setShowUserModal(false);
            // Refresh users
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
            setNewUser({ first_name: '', last_name: '', email: '', password: '', role: 'AGENT', telephone: '', badge_agent: '', nin_carte_identite: '' });
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur", error);
            alert("Erreur lors de la création de l'utilisateur.");
        }
    };

    // Calculate Stats
    const totalPV = contraventions.length;
    const enAttente = contraventions.filter((c: Contravention) => c.statut === 'EN_ATTENTE').length;
    const payees = contraventions.filter((c: Contravention) => c.statut === 'PAYEE').length;
    const annulees = contraventions.filter((c: Contravention) => c.statut === 'ANNULEE').length;
    
    const recentContraventions = [...contraventions].sort((a, b) => b.id - a.id).slice(0, 5);

    // Data for Pie Chart (Statuts)
    const pieData = [
        { name: 'Payées', value: payees },
        { name: 'En Attente', value: enAttente },
        { name: 'Annulées', value: annulees },
    ];

    // Data for Bar Chart (Communes)
    const communesCount: Record<string, number> = {};
    contraventions.forEach((c: Contravention) => {
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
            {/* Sidebar Desktop & Mobile */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-mali-dark text-white flex-col transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex`}>
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded bg-mali-green flex items-center justify-center mr-3 text-white font-bold">M</span>
                        Admin Panel
                    </h2>
                    <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-mali-green bg-opacity-20 text-mali-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Tableau de bord
                        </button>
                        <button onClick={() => { setActiveTab('contraventions'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'contraventions' ? 'bg-mali-green bg-opacity-20 text-mali-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                            <FileText className="w-5 h-5 mr-3" />
                            Contraventions
                        </button>
                        <button onClick={() => { setActiveTab('utilisateurs'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'utilisateurs' ? 'bg-mali-green bg-opacity-20 text-mali-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                            <Users className="w-5 h-5 mr-3" />
                            Agents & Citoyens
                        </button>
                        <button onClick={() => { setActiveTab('geolocalisation'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'geolocalisation' ? 'bg-mali-green bg-opacity-20 text-mali-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                            <MapPin className="w-5 h-5 mr-3" />
                            Géolocalisation
                        </button>
                        <button onClick={() => alert("Les paramètres seront disponibles prochainement.")} className="w-full flex items-center px-3 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                            <Settings className="w-5 h-5 mr-3" />
                            Paramètres
                        </button>
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
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[120px] sm:max-w-none">Vue d'ensemble</h1>
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
                        <Card className="flex flex-row items-center p-5 transition-transform hover:-translate-y-1 shadow-sm border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4 shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total PV</p>
                                <p className="text-2xl font-extrabold text-gray-900">{totalPV}</p>
                            </div>
                        </Card>
                        
                        <Card className="flex flex-row items-center p-5 transition-transform hover:-translate-y-1 shadow-sm border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4 shrink-0">
                                <Hourglass className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">En Attente</p>
                                <p className="text-2xl font-extrabold text-gray-900">{enAttente}</p>
                            </div>
                        </Card>

                        <Card className="flex flex-row items-center p-5 transition-transform hover:-translate-y-1 shadow-sm border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4 shrink-0">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Payées</p>
                                <p className="text-2xl font-extrabold text-gray-900">{payees}</p>
                            </div>
                        </Card>

                        <Card className="flex flex-row items-center p-5 transition-transform hover:-translate-y-1 shadow-sm border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 shrink-0">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recettes</p>
                                <p className="text-2xl font-extrabold text-gray-900">{totalRecettes.toLocaleString('fr-FR')} <span className="text-sm font-medium text-gray-500">FCFA</span></p>
                            </div>
                        </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Communes Chart */}
                        <Card className="shadow-sm border-gray-100 lg:col-span-2 flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                                    <MapPin className="w-5 h-5 text-mali-green mr-2" />
                                    Infractions par Commune
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-64 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Bar dataKey="total" fill="#008751" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Status Pie Chart */}
                        <Card className="shadow-sm border-gray-100 flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                                    <FileText className="w-5 h-5 text-mali-yellow mr-2" />
                                    Répartition des Statuts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-64 mt-4">
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table Row */}
                    <Card className="shadow-sm border-gray-100 overflow-hidden">
                        <CardHeader className="flex flex-row justify-between items-center border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-bold text-gray-800">Dernières Contraventions</CardTitle>
                            <Button variant="ghost" className="text-mali-green hover:text-green-800 p-0 h-auto font-medium">Voir tout</Button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="font-medium text-gray-500 uppercase tracking-wider">N° PV</TableHead>
                                        <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
                                        <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Citoyen</TableHead>
                                        <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Montant</TableHead>
                                        <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Statut</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 text-sm">
                                    {recentContraventions.map((ctr) => (
                                        <TableRow 
                                            key={ctr.id} 
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/contraventions/${ctr.id}`)}
                                        >
                                            <TableCell className="font-mono font-medium text-gray-900">{ctr.numero}</TableCell>
                                            <TableCell className="text-gray-500">{new Date(ctr.date_contravention).toLocaleDateString('fr-FR')}</TableCell>
                                            <TableCell className="font-medium text-gray-800">{ctr.citoyen_details?.first_name || 'Inconnu'} {ctr.citoyen_details?.last_name || ''}</TableCell>
                                            <TableCell className="font-bold text-gray-900">{parseFloat(ctr.montant.toString()).toLocaleString('fr-FR')} FCFA</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${
                                                    ctr.statut === 'PAYEE' ? 'bg-green-100 text-green-800 border-transparent' : 
                                                    ctr.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800 border-transparent' : 
                                                    'bg-red-100 text-red-800 border-transparent'
                                                }`}>
                                                    {ctr.statut}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {recentContraventions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 py-8">Aucune contravention récente.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                        </>
                    )}

                    {activeTab === 'utilisateurs' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                                <Button onClick={() => setShowUserModal(true)} className="bg-mali-green hover:bg-green-800 text-white font-bold h-10 px-4 rounded-lg shadow-sm">
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Nouvel Utilisateur
                                </Button>
                            </div>

                            <Card className="shadow-sm border-gray-100 overflow-hidden">
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50 border-b border-gray-200">
                                            <TableRow>
                                                <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Nom & Prénom</TableHead>
                                                <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Email</TableHead>
                                                <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Rôle</TableHead>
                                                <TableHead className="font-medium text-gray-500 uppercase tracking-wider">Téléphone</TableHead>
                                                <TableHead className="font-medium text-gray-500 uppercase tracking-wider text-center">Identifiant (Badge/NINA)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 text-sm">
                                            {users.map((u: User) => (
                                                <TableRow key={u.id} className="hover:bg-gray-50 transition-colors">
                                                    <TableCell className="font-semibold text-gray-900">{u.first_name} {u.last_name}</TableCell>
                                                    <TableCell className="text-gray-600">{u.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`${
                                                            u.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800 border-transparent' : 
                                                            u.role === 'AGENT' ? 'bg-blue-100 text-blue-800 border-transparent' : 
                                                            'bg-green-100 text-green-800 border-transparent'
                                                        }`}>
                                                            {u.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">{u.telephone || '-'}</TableCell>
                                                    <TableCell className="text-center font-mono text-gray-500">
                                                        {u.role === 'AGENT' ? u.badge_agent : u.nin_carte_identite || '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
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
                                        <Button type="button" variant="outline" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-gray-700 font-medium">
                                            Annuler
                                        </Button>
                                        <Button type="submit" className="px-4 py-2 bg-mali-green text-white hover:bg-green-800 font-medium">
                                            Créer l'utilisateur
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contraventions' && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Toutes les Contraventions</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Numéro PV</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Immatriculation</TableHead>
                                            <TableHead>Infraction</TableHead>
                                            <TableHead>Montant</TableHead>
                                            <TableHead>Statut</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboardData?.contraventions.map((c: Contravention) => (
                                            <TableRow 
                                                key={c.id} 
                                                className="cursor-pointer hover:bg-gray-50"
                                                onClick={() => navigate(`/contraventions/${c.id}`)}
                                            >
                                                <TableCell className="font-medium">{c.numero}</TableCell>
                                                <TableCell>{new Date(c.date_contravention).toLocaleDateString()}</TableCell>
                                                <TableCell>{c.immatriculation_vehicule}</TableCell>
                                                <TableCell className="truncate max-w-[200px]">{c.infraction_details?.libelle || 'Infraction Code'}</TableCell>
                                                <TableCell className="font-bold">{c.montant} FCFA</TableCell>
                                                <TableCell>
                                                    <Badge className={c.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : (c.statut === 'PAYE' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100')}>
                                                        {c.statut.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!dashboardData?.contraventions || dashboardData.contraventions.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-4 text-gray-500">Aucune contravention trouvée</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'geolocalisation' && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-8rem)] flex flex-col">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Carte des Infractions</h2>
                            <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 relative z-0">
                                {geolocData && (
                                    <MapContainer center={[12.6392, -8.0029]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />
                                        {geolocData.map((loc: any, idx: number) => (
                                            <Marker key={idx} position={[loc.lat, loc.lng]}>
                                                <Popup>
                                                    <div className="text-sm">
                                                        <p className="font-bold">{loc.numero}</p>
                                                        <p>{loc.infraction}</p>
                                                        <p className="text-gray-600">{loc.date} - {loc.montant} FCFA</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}
                                    </MapContainer>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default DashboardAdmin;

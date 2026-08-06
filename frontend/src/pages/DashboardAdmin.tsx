import { lazy, Suspense, useState, useMemo } from 'react';
const GoogleMap = lazy(() => import('../components/GoogleMap'));
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  FileText, Hourglass, CheckCircle, DollarSign, LogOut,
  LayoutDashboard, Users, MapPin, Settings, Bell, Search, UserPlus, X, Menu,
  AlertTriangle, Shield, BarChart2, ClipboardList, Download, RefreshCw, Trash2, Edit, ToggleLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Contravention {
    id: number; numero: string; date_contravention: string;
    immatriculation_vehicule: string; montant: number; statut: string;
    commune: string; agent_details?: any; citoyen_details?: any; infraction_details?: any;
}
interface User {
    id: number; username: string; email: string; first_name: string;
    last_name: string; role: string; telephone: string; is_active: boolean;
    badge_agent?: string; service_agent?: string; nin_carte_identite?: string;
}
interface Infraction {
    id: number; code: string; libelle: string; montant: number;
    degre_gravite: string; statut_actif: boolean; description?: string;
}
interface Litige {
    id: number; motif: string; statut: string; date_depot: string;
    decision?: string; contravention: number;
    contravention_details?: { numero: string; montant: number; infraction_details?: any; citoyen_details?: any; };
}

const COLORS = ['#008751', '#FCD116', '#CE1126', '#6b7280'];

const TABS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'contraventions', label: 'Contraventions', icon: FileText },
  { id: 'utilisateurs', label: 'Agents & Citoyens', icon: Users },
  { id: 'infractions', label: 'Infractions', icon: Shield },
  { id: 'litiges', label: 'Litiges', icon: AlertTriangle },
  { id: 'geolocalisation', label: 'Géolocalisation', icon: MapPin },
  { id: 'rapports', label: 'Rapports', icon: BarChart2 },
  { id: 'audit', label: 'Audit', icon: ClipboardList },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [statutFilter, setStatutFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // --- Main Dashboard Data ---
    const { data: dashboardData, isLoading: loading } = useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            const [resC, resP, resU] = await Promise.all([
                api.get('/api/contraventions/'),
                api.get('/api/paiements/'),
                api.get('/api/utilisateurs/')
            ]);
            const totalRecettes = resP.data.reduce((sum: number, p: any) => sum + parseFloat(p.montant), 0);
            return {
                contraventions: resC.data as Contravention[],
                totalRecettes,
                users: resU.data as User[]
            };
        }
    });

    // --- Infractions Data ---
    const { data: infractions = [], refetch: refetchInfractions } = useQuery<Infraction[]>({
        queryKey: ['infractions'],
        queryFn: async () => (await api.get('/api/infractions/')).data,
    });

    // --- Litiges Data ---
    const { data: litiges = [], refetch: refetchLitiges } = useQuery<Litige[]>({
        queryKey: ['litiges'],
        queryFn: async () => (await api.get('/api/litiges/')).data,
    });

    // --- Geoloc Data ---
    const { data: geolocData } = useQuery({
        queryKey: ['geolocData'],
        queryFn: async () => (await api.get('/api/contraventions/geoloc/')).data,
        enabled: activeTab === 'geolocalisation',
        retry: false,
    });

    const contraventions = dashboardData?.contraventions || [];
    const users = dashboardData?.users || [];
    const totalRecettes = dashboardData?.totalRecettes || 0;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    // --- User Modal State ---
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        first_name: '', last_name: '', email: '', password: '', role: 'AGENT',
        telephone: '', badge_agent: '', service_agent: '', nin_carte_identite: ''
    });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const username = newUser.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
            await api.post('/api/utilisateurs/', { ...newUser, username });
            setShowUserModal(false);
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
            setNewUser({ first_name: '', last_name: '', email: '', password: '', role: 'AGENT', telephone: '', badge_agent: '', service_agent: '', nin_carte_identite: '' });
        } catch (error) {
            alert("Erreur lors de la création.");
        }
    };

    const handleToggleUser = async (user: User) => {
        try {
            await api.patch(`/api/utilisateurs/${user.id}/`, { is_active: user.is_active === false });
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
        } catch (error) {
            alert("Erreur lors de la mise a jour du statut.");
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Supprimer cet utilisateur ?")) return;
        try {
            await api.delete(`/api/utilisateurs/${id}/`);
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
        } catch (error) {
            alert("Erreur lors de la suppression.");
        }
    };
    // --- Infraction Modal ---
    const [showInfractionModal, setShowInfractionModal] = useState(false);
    const [editInfraction, setEditInfraction] = useState<Infraction | null>(null);
    const [infractionForm, setInfractionForm] = useState({ code: '', libelle: '', montant: '', degre_gravite: 'MOYENNE', description: '' });

    const handleSaveInfraction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editInfraction) {
                await api.patch(`/api/infractions/${editInfraction.id}/`, infractionForm);
            } else {
                await api.post('/api/infractions/', infractionForm);
            }
            setShowInfractionModal(false);
            setEditInfraction(null);
            refetchInfractions();
        } catch (err: any) {
            alert("Erreur: " + JSON.stringify(err.response?.data || 'Erreur inconnue'));
        }
    };

    const handleToggleInfraction = async (inf: Infraction) => {
        await api.patch(`/api/infractions/${inf.id}/`, { statut_actif: !inf.statut_actif });
        refetchInfractions();
    };

    const handleDeleteInfraction = async (id: number) => {
        if (!confirm('Supprimer cette infraction ?')) return;
        await api.delete(`/api/infractions/${id}/`);
        refetchInfractions();
    };

    // --- Litige Treatment ---
    const traiteLitigeMutation = useMutation({
        mutationFn: async ({ id, statut, decision }: { id: number; statut: string; decision: string }) => {
            return api.post(`/api/litiges/${id}/traiter/`, { statut, decision });
        },
        onSuccess: () => refetchLitiges(),
        onError: (err: any) => alert("Erreur: " + JSON.stringify(err.response?.data || err.message)),
    });

    const [showLitigeModal, setShowLitigeModal] = useState(false);
    const [selectedLitige, setSelectedLitige] = useState<Litige | null>(null);
    const [litigeDecision, setLitigeDecision] = useState('');

    // --- Stats ---
    const totalPV = contraventions.length;
    const enAttente = contraventions.filter(c => c.statut === 'EN_ATTENTE').length;
    const payees = contraventions.filter(c => c.statut === 'PAYEE').length;
    const annulees = contraventions.filter(c => c.statut === 'ANNULEE').length;
    const recentContraventions = [...contraventions].sort((a, b) => b.id - a.id).slice(0, 5);
    const pieData = [
        { name: 'Payées', value: payees },
        { name: 'En Attente', value: enAttente },
        { name: 'Annulées', value: annulees },
    ];
    const communesCount: Record<string, number> = {};
    contraventions.forEach(c => {
        const com = c.commune || 'Inconnue';
        communesCount[com] = (communesCount[com] || 0) + 1;
    });
    const barData = Object.keys(communesCount).map(k => ({ name: k, total: communesCount[k] })).sort((a, b) => b.total - a.total).slice(0, 5);

    // --- Filtered Contraventions for tab ---
    const filteredContraventions = useMemo(() => {
        let result = [...contraventions].sort((a, b) => b.id - a.id);
        if (statutFilter !== 'all') result = result.filter(c => c.statut === statutFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.numero.toLowerCase().includes(q) ||
                c.immatriculation_vehicule?.toLowerCase().includes(q) ||
                c.citoyen_details?.first_name?.toLowerCase().includes(q) ||
                c.citoyen_details?.last_name?.toLowerCase().includes(q)
            );
        }
        return result;
    }, [contraventions, statutFilter, searchQuery]);

    // --- Export functions ---
    const exportCSV = () => {
        const headers = ['Numéro PV', 'Date', 'Immatriculation', 'Citoyen', 'Infraction', 'Montant', 'Statut', 'Commune'];
        const rows = filteredContraventions.map(c => [
            c.numero,
            new Date(c.date_contravention).toLocaleDateString('fr-FR'),
            c.immatriculation_vehicule,
            `${c.citoyen_details?.first_name || ''} ${c.citoyen_details?.last_name || ''}`.trim() || 'N/A',
            c.infraction_details?.libelle || 'N/A',
            c.montant,
            c.statut,
            c.commune
        ]);
        const csvContent = [headers, ...rows].map(r => r.join(';')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'contraventions.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const exportExcel = async () => {
        const XLSX = await import('xlsx');
        const data = filteredContraventions.map(c => ({
            'Numéro PV': c.numero,
            'Date': new Date(c.date_contravention).toLocaleDateString('fr-FR'),
            'Immatriculation': c.immatriculation_vehicule,
            'Citoyen': `${c.citoyen_details?.first_name || ''} ${c.citoyen_details?.last_name || ''}`.trim() || 'N/A',
            'Infraction': c.infraction_details?.libelle || 'N/A',
            'Montant (FCFA)': c.montant,
            'Statut': c.statut,
            'Commune': c.commune,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Contraventions');
        XLSX.writeFile(wb, 'contraventions.xlsx');
    };

    const exportPDF = async () => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(16);
        doc.text('Liste des Contraventions - MaliContraventions', 14, 15);
        doc.setFontSize(10);
        doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

        const headers = [['N° PV', 'Date', 'Immatriculation', 'Infraction', 'Montant', 'Statut', 'Commune']];
        const rows = filteredContraventions.map(c => [
            c.numero,
            new Date(c.date_contravention).toLocaleDateString('fr-FR'),
            c.immatriculation_vehicule,
            (c.infraction_details?.libelle || 'N/A').substring(0, 30),
            parseFloat(c.montant.toString()).toLocaleString('fr-FR') + ' FCFA',
            c.statut,
            c.commune,
        ]);

        let y = 30;
        const colWidths = [35, 22, 28, 60, 28, 22, 22];
        // Draw header
        doc.setFillColor(0, 135, 81);
        doc.rect(14, y - 5, 262, 9, 'F');
        doc.setTextColor(255, 255, 255);
        headers[0].forEach((h, i) => {
            doc.text(h, 14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
        });
        y += 7;
        doc.setTextColor(0, 0, 0);

        rows.forEach((row, ri) => {
            if (y > 185) { doc.addPage(); y = 15; }
            if (ri % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(14, y - 5, 262, 9, 'F'); }
            row.forEach((cell, i) => {
                doc.text(String(cell), 14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
            });
            y += 8;
        });

        doc.save('contraventions.pdf');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-green-700 text-xl font-semibold">Chargement...</div>;

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex-col transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex`}>
                <div className="p-5 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded bg-[#008751] flex items-center justify-center mr-3 text-white font-bold text-sm">MC</span>
                        Admin Panel
                    </h2>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-3">
                    <nav className="space-y-0.5 px-2">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm ${activeTab === tab.id ? 'bg-[#008751] text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                >
                                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                                    {tab.label}
                                    {tab.id === 'litiges' && litiges.filter(l => l.statut === 'EN_ATTENTE').length > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{litiges.filter(l => l.statut === 'EN_ATTENTE').length}</span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center mb-3">
                        <div className="w-9 h-9 rounded-full bg-[#008751] flex items-center justify-center text-white font-bold text-sm">A</div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">Administrateur</p>
                            <p className="text-xs text-gray-400">admin@police.ml</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Overlay mobile */}
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0">
                    <div className="flex items-center">
                        <button className="md:hidden mr-4 text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                            {TABS.find(t => t.id === activeTab)?.label || 'Tableau de bord'}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        {(activeTab === 'dashboard' || activeTab === 'contraventions') && (
                            <div className="relative hidden sm:block">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher un PV..."
                                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]"
                                />
                            </div>
                        )}
                        <button className="relative p-2 text-gray-400 hover:text-gray-600">
                            <Bell className="w-5 h-5" />
                            {litiges.filter(l => l.statut === 'EN_ATTENTE').length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6">

                    {/* ======== DASHBOARD TAB ======== */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="bg-gradient-to-r from-[#008751] to-[#005231] rounded-xl p-6 text-white mb-6 shadow-sm">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FCD116] text-gray-900 text-xs font-bold mb-3">
                                    ESPACE ADMINISTRATEUR
                                </div>
                                <h2 className="text-2xl font-extrabold mb-1">Supervision globale de la sécurité routière</h2>
                                <p className="text-green-100 text-sm">Suivez en temps réel les infractions, les encaissements et les performances.</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {[
                                    { label: 'Total PV', value: totalPV, icon: FileText, color: 'blue' },
                                    { label: 'En Attente', value: enAttente, icon: Hourglass, color: 'yellow' },
                                    { label: 'Total Payées', value: payees, icon: CheckCircle, color: 'green' },
                                    { label: 'Recettes', value: totalRecettes.toLocaleString('fr-FR') + ' FCFA', icon: DollarSign, color: 'emerald' },
                                ].map((stat, i) => {
                                    const Icon = stat.icon;
                                    const colorMap: any = {
                                        blue: 'bg-blue-50 text-blue-600', yellow: 'bg-yellow-50 text-yellow-600',
                                        green: 'bg-green-50 text-green-600', emerald: 'bg-emerald-50 text-emerald-600'
                                    };
                                    return (
                                        <Card key={i} className="flex flex-row items-center p-4 shadow-sm">
                                            <div className={`w-11 h-11 rounded-lg ${colorMap[stat.color]} flex items-center justify-center mr-3 shrink-0`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                                <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                <Card className="shadow-sm lg:col-span-2">
                                    <CardHeader className="pb-2"><CardTitle className="text-base font-bold">Infractions par Commune</CardTitle></CardHeader>
                                    <CardContent className="h-56 mt-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="#008751" radius={[4, 4, 0, 0]} maxBarSize={45} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm">
                                    <CardHeader className="pb-2"><CardTitle className="text-base font-bold">Répartition des Statuts</CardTitle></CardHeader>
                                    <CardContent className="h-56 mt-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex justify-center space-x-3 mt-1">
                                            {pieData.map((d, i) => (
                                                <div key={i} className="flex items-center text-xs text-gray-600">
                                                    <span className="w-2.5 h-2.5 rounded-full mr-1" style={{ backgroundColor: COLORS[i] }}></span>{d.name}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row justify-between items-center border-b border-gray-100 pb-4">
                                    <CardTitle className="text-base font-bold">Dernières Contraventions</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-[#008751] font-medium" onClick={() => setActiveTab('contraventions')}>Voir tout</Button>
                                </CardHeader>
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>N° PV</TableHead><TableHead>Date</TableHead>
                                                <TableHead>Citoyen</TableHead><TableHead>Montant</TableHead><TableHead>Statut</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentContraventions.map(c => (
                                                <TableRow key={c.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/contraventions/${c.id}`)}>
                                                    <TableCell className="font-mono text-xs">{c.numero}</TableCell>
                                                    <TableCell>{new Date(c.date_contravention).toLocaleDateString('fr-FR')}</TableCell>
                                                    <TableCell>{c.citoyen_details?.first_name || 'N/A'} {c.citoyen_details?.last_name || ''}</TableCell>
                                                    <TableCell className="font-bold">{parseFloat(c.montant.toString()).toLocaleString('fr-FR')} FCFA</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs ${c.statut === 'PAYEE' ? 'bg-green-100 text-green-800' : c.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : c.statut === 'VALIDEE' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} border-transparent`}>{c.statut}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {recentContraventions.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">Aucune contravention.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* ======== CONTRAVENTIONS TAB ======== */}
                    {activeTab === 'contraventions' && (
                        <div>
                            <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
                                <div className="flex gap-2 flex-wrap">
                                    {['all', 'EN_ATTENTE', 'VALIDEE', 'PAYEE', 'ANNULEE'].map(s => (
                                        <button key={s} onClick={() => setStatutFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statutFilter === s ? 'bg-[#008751] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                                            {s === 'all' ? 'Toutes' : s}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                                        <Download className="w-3.5 h-3.5" /> CSV
                                    </button>
                                    <button onClick={exportExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                                        <Download className="w-3.5 h-3.5" /> Excel
                                    </button>
                                    <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CE1126] text-white rounded-lg text-xs font-medium hover:bg-red-700">
                                        <Download className="w-3.5 h-3.5" /> PDF
                                    </button>
                                </div>
                            </div>
                            {/* Mobile search */}
                            <div className="relative sm:hidden mb-3">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]" />
                            </div>
                            <Card className="shadow-sm">
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>N° PV</TableHead><TableHead>Date</TableHead>
                                                <TableHead>Immatr.</TableHead><TableHead>Infraction</TableHead>
                                                <TableHead>Montant</TableHead><TableHead>Statut</TableHead><TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredContraventions.map(c => (
                                                <TableRow key={c.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-mono text-xs">{c.numero}</TableCell>
                                                    <TableCell className="text-xs">{new Date(c.date_contravention).toLocaleDateString('fr-FR')}</TableCell>
                                                    <TableCell className="text-xs">{c.immatriculation_vehicule}</TableCell>
                                                    <TableCell className="text-xs max-w-[140px] truncate">{c.infraction_details?.libelle || '-'}</TableCell>
                                                    <TableCell className="font-bold text-xs whitespace-nowrap">{parseFloat(c.montant.toString()).toLocaleString('fr-FR')} FCFA</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs ${c.statut === 'PAYEE' ? 'bg-green-100 text-green-800' : c.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : c.statut === 'VALIDEE' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} border-transparent`}>{c.statut}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <button onClick={() => navigate(`/contraventions/${c.id}`)} className="text-xs text-[#008751] hover:underline font-medium">Voir</button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredContraventions.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-gray-500 py-8">Aucun résultat.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <p className="text-xs text-gray-400 mt-2">{filteredContraventions.length} résultat(s)</p>
                        </div>
                    )}

                    {/* ======== UTILISATEURS TAB ======== */}
                    {activeTab === 'utilisateurs' && (
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                                <Button onClick={() => setShowUserModal(true)} className="bg-[#008751] hover:bg-green-800 text-white h-9 px-4 text-sm">
                                    <UserPlus className="w-4 h-4 mr-2" />Nouvel utilisateur
                                </Button>
                            </div>
                            <Card className="shadow-sm">
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>Nom & Prénom</TableHead><TableHead>Email</TableHead>
                                                <TableHead>Rôle</TableHead><TableHead>Téléphone</TableHead><TableHead>Identifiant</TableHead>
                                                <TableHead>Statut</TableHead><TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map(u => (
                                                <TableRow key={u.id} className={`hover:bg-gray-50 ${!u.is_active ? 'opacity-50' : ''}`}>
                                                    <TableCell className="font-semibold text-gray-900">{u.first_name} {u.last_name}</TableCell>
                                                    <TableCell className="text-gray-600 text-sm">{u.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs ${u.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800' : u.role === 'AGENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} border-transparent`}>{u.role}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 text-sm">{u.telephone || '-'}</TableCell>
                                                    <TableCell className="text-center font-mono text-gray-500 text-xs">
                                                        {u.role === 'AGENT' ? (u.badge_agent || '-') : (u.nin_carte_identite || '-')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs border-transparent ${u.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                                            {u.is_active !== false ? 'Actif' : 'Inactif'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1 items-center">
                                                            <button
                                                                onClick={() => handleToggleUser(u)}
                                                                title={u.is_active !== false ? 'Désactiver le compte' : 'Activer le compte'}
                                                                className={`p-1.5 rounded text-xs font-medium transition-colors ${
                                                                    u.is_active !== false
                                                                        ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                                                                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                                }`}
                                                            >
                                                                <ToggleLeft className="w-3.5 h-3.5" />
                                                            </button>
                                                            {u.role !== 'ADMIN' && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id)}
                                                                    title="Supprimer l'utilisateur"
                                                                    className="p-1.5 rounded text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ======== INFRACTIONS TAB ======== */}
                    {activeTab === 'infractions' && (
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-xl font-bold text-gray-800">Gestion des Infractions ({infractions.length})</h2>
                                <Button onClick={() => { setEditInfraction(null); setInfractionForm({ code: '', libelle: '', montant: '', degre_gravite: 'MOYENNE', description: '' }); setShowInfractionModal(true); }} className="bg-[#008751] hover:bg-green-800 text-white h-9 px-4 text-sm">
                                    + Nouvelle Infraction
                                </Button>
                            </div>
                            <Card className="shadow-sm">
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>Code</TableHead><TableHead>Libellé</TableHead>
                                                <TableHead>Montant</TableHead><TableHead>Gravité</TableHead>
                                                <TableHead>Statut</TableHead><TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {infractions.map(inf => (
                                                <TableRow key={inf.id} className={`hover:bg-gray-50 ${!inf.statut_actif ? 'opacity-50' : ''}`}>
                                                    <TableCell className="font-mono text-xs">{inf.code}</TableCell>
                                                    <TableCell className="font-medium text-sm">{inf.libelle}</TableCell>
                                                    <TableCell className="font-bold">{parseFloat(inf.montant.toString()).toLocaleString('fr-FR')} FCFA</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs border-transparent ${inf.degre_gravite === 'CRITIQUE' ? 'bg-red-100 text-red-800' : inf.degre_gravite === 'GRAVE' ? 'bg-orange-100 text-orange-800' : inf.degre_gravite === 'MOYENNE' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{inf.degre_gravite}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs border-transparent ${inf.statut_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{inf.statut_actif ? 'Active' : 'Inactive'}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            <button onClick={() => { setEditInfraction(inf); setInfractionForm({ code: inf.code, libelle: inf.libelle, montant: inf.montant.toString(), degre_gravite: inf.degre_gravite, description: inf.description || '' }); setShowInfractionModal(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Modifier">
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleToggleInfraction(inf)} className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded" title={inf.statut_actif ? 'Désactiver' : 'Activer'}>
                                                                <ToggleLeft className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleDeleteInfraction(inf.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Supprimer">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {infractions.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">Aucune infraction.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ======== LITIGES TAB ======== */}
                    {activeTab === 'litiges' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-5">Gestion des Litiges ({litiges.length})</h2>
                            <Card className="shadow-sm">
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>PV Contesté</TableHead><TableHead>Citoyen</TableHead>
                                                <TableHead>Motif</TableHead><TableHead>Date Dépôt</TableHead>
                                                <TableHead>Statut</TableHead><TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {litiges.map(l => (
                                                <TableRow key={l.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-mono text-xs">{l.contravention_details?.numero || `#${l.contravention}`}</TableCell>
                                                    <TableCell className="text-sm">{l.contravention_details?.citoyen_details?.first_name || '-'} {l.contravention_details?.citoyen_details?.last_name || ''}</TableCell>
                                                    <TableCell className="text-sm max-w-[200px] truncate">{l.motif}</TableCell>
                                                    <TableCell className="text-xs text-gray-500">{new Date(l.date_depot).toLocaleDateString('fr-FR')}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs border-transparent ${l.statut === 'ACCEPTE' ? 'bg-green-100 text-green-800' : l.statut === 'REJETE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{l.statut}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {l.statut === 'EN_ATTENTE' && (
                                                            <button onClick={() => { setSelectedLitige(l); setLitigeDecision(''); setShowLitigeModal(true); }} className="text-xs font-medium text-[#008751] hover:underline">
                                                                Traiter
                                                            </button>
                                                        )}
                                                        {l.statut !== 'EN_ATTENTE' && <span className="text-xs text-gray-400">{l.decision || 'Traité'}</span>}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {litiges.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">Aucun litige déposé.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ======== GEOLOCALISATION TAB ======== */}
                    {activeTab === 'geolocalisation' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Carte des Contraventions</h2>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '500px' }}>
                                <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Chargement de la carte...</div>}>
                                    <GoogleMap locations={geolocData?.locations} />
                                </Suspense>
                            </div>
                            {(!geolocData?.locations || geolocData.locations.length === 0) && (
                                <p className="text-sm text-gray-500 mt-3 text-center">Aucune contravention géolocalisée pour l'instant.</p>
                            )}
                        </div>
                    )}

                    {/* ======== RAPPORTS TAB ======== */}
                    {activeTab === 'rapports' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-5">Rapports et Exports</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Export CSV', desc: 'Toutes les contraventions au format CSV (Excel compatible)', action: exportCSV, color: 'bg-[#008751] hover:bg-green-800', icon: Download },
                                    { label: 'Export Excel (.xlsx)', desc: 'Rapport complet avec mise en forme pour Microsoft Excel', action: exportExcel, color: 'bg-blue-600 hover:bg-blue-700', icon: Download },
                                    { label: 'Export PDF', desc: 'Document PDF prêt à imprimer pour archivage ou signature', action: exportPDF, color: 'bg-[#CE1126] hover:bg-red-700', icon: FileText },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <Card key={i} className="shadow-sm">
                                            <CardContent className="p-6">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                                                    <Icon className="w-6 h-6 text-gray-700" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-2">{item.label}</h3>
                                                <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                                                <button onClick={item.action} className={`w-full py-2.5 rounded-lg text-white font-semibold text-sm ${item.color} transition-colors`}>
                                                    Télécharger
                                                </button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-800 mb-3">Résumé de la période en cours</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-extrabold text-gray-900">{totalPV}</p>
                                        <p className="text-xs text-gray-500">PV Émis</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-extrabold text-green-600">{payees}</p>
                                        <p className="text-xs text-gray-500">Payées</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-extrabold text-yellow-600">{enAttente}</p>
                                        <p className="text-xs text-gray-500">En Attente</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-extrabold text-gray-900">{totalRecettes.toLocaleString('fr-FR')}</p>
                                        <p className="text-xs text-gray-500">FCFA encaissés</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======== AUDIT TAB ======== */}
                    {activeTab === 'audit' && (
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-xl font-bold text-gray-800">Journal d'Audit</h2>
                                <button onClick={() => queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                    <RefreshCw className="w-4 h-4" /> Actualiser
                                </button>
                            </div>
                            <Card className="shadow-sm">
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>Date</TableHead><TableHead>Événement</TableHead>
                                                <TableHead>Référence</TableHead><TableHead>Statut</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[...contraventions].sort((a, b) => b.id - a.id).slice(0, 20).map(c => (
                                                <TableRow key={c.id} className="hover:bg-gray-50">
                                                    <TableCell className="text-xs text-gray-500">{new Date(c.date_contravention).toLocaleString('fr-FR')}</TableCell>
                                                    <TableCell className="text-sm">PV créé par agent</TableCell>
                                                    <TableCell className="font-mono text-xs">{c.numero}</TableCell>
                                                    <TableCell><Badge variant="outline" className={`text-xs border-transparent ${c.statut === 'PAYEE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.statut}</Badge></TableCell>
                                                </TableRow>
                                            ))}
                                            {contraventions.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">Aucune activité.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ======== PARAMETRES TAB ======== */}
                    {activeTab === 'parametres' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-5">Paramètres du Système</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Card className="shadow-sm">
                                    <CardHeader><CardTitle className="text-base">Informations système</CardTitle></CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Application</span><span className="font-medium">MaliContraventions v2.0</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Backend</span><span className="font-medium">Django 5 + DRF</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Frontend</span><span className="font-medium">React 19 + Vite</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Authentification</span><span className="font-medium text-green-600">JWT (sécurisé)</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Total Utilisateurs</span><span className="font-medium">{users.length}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Total PV</span><span className="font-medium">{totalPV}</span></div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm">
                                    <CardHeader><CardTitle className="text-base">Communes couvertes</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {['Commune I', 'Commune II', 'Commune III', 'Commune IV', 'Commune V', 'Commune VI', 'Kati'].map((com, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-700">{com}</span>
                                                    <span className="font-bold text-[#008751]">{communesCount[com] || 0} PV</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* ======== MODALS ======== */}

            {/* User Creation Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center"><UserPlus className="w-5 h-5 mr-2 text-[#008751]" />Créer un compte</h3>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label><input type="text" required value={newUser.first_name} onChange={e => setNewUser({...newUser, first_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom</label><input type="text" required value={newUser.last_name} onChange={e => setNewUser({...newUser, last_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label><input type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none bg-white text-sm">
                                        <option value="AGENT">Agent</option>
                                        <option value="CITOYEN">Citoyen</option>
                                        <option value="ADMIN">Administrateur</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label><input type="text" value={newUser.telephone} onChange={e => setNewUser({...newUser, telephone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                            </div>
                            {newUser.role === 'AGENT' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Badge</label><input type="text" value={newUser.badge_agent} onChange={e => setNewUser({...newUser, badge_agent: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Service</label><input type="text" value={newUser.service_agent} onChange={e => setNewUser({...newUser, service_agent: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                                </div>
                            )}
                            {newUser.role === 'CITOYEN' && (
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">NINA / NIN</label><input type="text" value={newUser.nin_carte_identite} onChange={e => setNewUser({...newUser, nin_carte_identite: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>Annuler</Button>
                                <Button type="submit" className="bg-[#008751] text-white hover:bg-green-800">Créer l'utilisateur</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Infraction Modal */}
            {showInfractionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">{editInfraction ? 'Modifier l\'infraction' : 'Nouvelle infraction'}</h3>
                            <button onClick={() => setShowInfractionModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSaveInfraction} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Code</label><input type="text" value={infractionForm.code} onChange={e => setInfractionForm({...infractionForm, code: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" placeholder="ex: ART-101" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label><input type="number" required value={infractionForm.montant} onChange={e => setInfractionForm({...infractionForm, montant: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label><input type="text" required value={infractionForm.libelle} onChange={e => setInfractionForm({...infractionForm, libelle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Gravité</label>
                                <select value={infractionForm.degre_gravite} onChange={e => setInfractionForm({...infractionForm, degre_gravite: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none bg-white text-sm">
                                    <option value="MINEURE">Mineure</option>
                                    <option value="MOYENNE">Moyenne</option>
                                    <option value="GRAVE">Grave</option>
                                    <option value="CRITIQUE">Critique</option>
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={infractionForm.description} onChange={e => setInfractionForm({...infractionForm, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm resize-none" /></div>
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowInfractionModal(false)}>Annuler</Button>
                                <Button type="submit" className="bg-[#008751] text-white hover:bg-green-800">{editInfraction ? 'Sauvegarder' : 'Créer'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Litige Decision Modal */}
            {showLitigeModal && selectedLitige && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Traiter le Litige</h3>
                            <button onClick={() => setShowLitigeModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                <p className="font-bold text-gray-800 mb-1">PV : {selectedLitige.contravention_details?.numero || `#${selectedLitige.contravention}`}</p>
                                <p className="text-gray-600"><span className="font-medium">Motif :</span> {selectedLitige.motif}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Décision / Commentaire</label>
                                <textarea value={litigeDecision} onChange={e => setLitigeDecision(e.target.value)} rows={3} placeholder="Expliquez votre décision..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] outline-none text-sm resize-none" />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowLitigeModal(false)}>Annuler</Button>
                                <button onClick={() => { traiteLitigeMutation.mutate({ id: selectedLitige.id, statut: 'REJETE', decision: litigeDecision }); setShowLitigeModal(false); }} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700">
                                    Rejeter
                                </button>
                                <button onClick={() => { traiteLitigeMutation.mutate({ id: selectedLitige.id, statut: 'ACCEPTE', decision: litigeDecision }); setShowLitigeModal(false); }} className="px-4 py-2 bg-[#008751] text-white rounded-lg font-semibold text-sm hover:bg-green-800">
                                    Accepter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DashboardAdmin;

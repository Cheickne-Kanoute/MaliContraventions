import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { 
  FileText, 
  Hourglass, 
  LogOut,
  LayoutDashboard,
  PlusCircle,
  X,
  Upload,
  Menu
} from 'lucide-react';

import { contraventionsService } from '../services/contraventionsService';
import type { Contravention, Infraction } from '../types';

const DashboardAgent = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [selectedInfraction, setSelectedInfraction] = useState('');
    const [immatriculation, setImmatriculation] = useState('');
    const [lieu, setLieu] = useState('');
    const [commune, setCommune] = useState('Commune III');
    const [photo, setPhoto] = useState<File | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: contraventions = [], isLoading } = useQuery<Contravention[]>({
        queryKey: ['agentContraventions'],
        queryFn: async () => {
            return await contraventionsService.getAll();
        }
    });

    const { data: infractions = [] } = useQuery<Infraction[]>({
        queryKey: ['infractions'],
        queryFn: async () => {
            const res = await api.get('/api/infractions/');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.post('/api/contraventions/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agentContraventions'] });
            setIsModalOpen(false);
            // Reset form
            setSelectedInfraction('');
            setImmatriculation('');
            setLieu('');
            setCommune('Commune III');
            setPhoto(null);
        },
        onError: (error) => {
            console.error("Erreur lors de la création", error);
            alert("Erreur lors de la création de la contravention.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInfraction || !immatriculation || !lieu) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        const formData = new FormData();
        formData.append('infraction', selectedInfraction);
        formData.append('immatriculation_vehicule', immatriculation);
        formData.append('lieu_adresse', lieu);
        formData.append('commune', commune);
        if (photo) {
            formData.append('photo_preuve', photo);
        }

        createMutation.mutate(formData);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login?role=agent');
    };

    const totalCreees = contraventions.length;
    const enAttente = contraventions.filter(c => c.statut === 'EN_ATTENTE').length;
    
    const recentContraventions = [...contraventions].sort((a, b) => b.id - a.id).slice(0, 10);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600">Chargement du tableau de bord...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar Desktop & Mobile */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white flex-col transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex`}>
                <div className="p-6 border-b border-blue-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center mr-3 text-white font-bold">P</span>
                        Agent Panel
                    </h2>
                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center px-3 py-2.5 bg-blue-800 text-white rounded-lg">
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Mon Tableau de bord
                        </button>
                        <button onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center px-3 py-2.5 text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors">
                            <PlusCircle className="w-5 h-5 mr-3" />
                            Dresser un PV
                        </button>
                    </nav>
                </div>
                <div className="p-4 border-t border-blue-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-blue-700 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 transition-colors">
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
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
                    <div className="flex items-center">
                        <button className="md:hidden mr-4 text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[150px] sm:max-w-none">Mon Espace</h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center transition-colors">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Nouveau PV
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
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
                    </div>

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
                                        <th className="px-6 py-3 font-medium">Infraction</th>
                                        <th className="px-6 py-3 font-medium">Montant</th>
                                        <th className="px-6 py-3 font-medium">Statut</th>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Nouveau PV */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Dresser un nouveau PV</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Infraction</label>
                                <select 
                                    value={selectedInfraction} 
                                    onChange={(e) => setSelectedInfraction(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Sélectionnez une infraction</option>
                                    {infractions.map(inf => (
                                        <option key={inf.id} value={inf.id}>{inf.libelle} ({inf.montant_amende} FCFA)</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                                <input 
                                    type="text" 
                                    value={immatriculation} 
                                    onChange={(e) => setImmatriculation(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: AB 1234 MD"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu / Adresse</label>
                                <input 
                                    type="text" 
                                    value={lieu} 
                                    onChange={(e) => setLieu(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                                <select 
                                    value={commune} 
                                    onChange={(e) => setCommune(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Commune I">Commune I</option>
                                    <option value="Commune II">Commune II</option>
                                    <option value="Commune III">Commune III</option>
                                    <option value="Commune IV">Commune IV</option>
                                    <option value="Commune V">Commune V</option>
                                    <option value="Commune VI">Commune VI</option>
                                    <option value="Kati">Kati</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preuve photo (Optionnel)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                <span>Télécharger un fichier</span>
                                                <input 
                                                    type="file" 
                                                    className="sr-only" 
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setPhoto(e.target.files[0]);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">{photo ? photo.name : 'PNG, JPG, GIF jusqu\'à 10MB'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={createMutation.isPending}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {createMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardAgent;

import { Link } from 'react-router-dom';
import { Shield, Badge, User } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#0a3622] font-sans text-white">
            {/* Top Bar */}
            <div className="border-b border-white/10 px-6 py-4 flex justify-between items-center text-xs text-gray-300">
                <div className="flex items-center space-x-2">
                    <div className="bg-white/10 p-1.5 rounded-full border border-white/20">
                        <Shield className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <div className="font-bold text-white">République du Mali</div>
                        <div className="text-[10px]">Ministère de la Sécurité et de la Protection Civile</div>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="font-bold text-white">PLATEFORME OFFICIELLE</div>
                    <div className="text-[10px]">Version 1.0 - Phase Bamako</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
                
                {/* Badge */}
                <div className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-4 py-1.5 rounded-full text-xs font-medium mb-8 flex items-center">
                    <Shield className="w-3 h-3 mr-2" />
                    Système officiel de gestion des infractions routières
                </div>

                {/* Headers */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-yellow-500">
                    Plateforme de Gestion<br />
                    des Contraventions Routières
                </h1>
                <p className="text-gray-300 text-center max-w-2xl mb-16 text-sm md:text-base">
                    Système numérique centralisé pour la gestion, le suivi et le paiement des contraventions routières du District de Bamako.
                </p>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    
                    {/* Admin Card */}
                    <div className="bg-[#0c4029] border border-yellow-500/50 rounded-2xl p-6 flex flex-col h-full transition-transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Administrateur</h2>
                        <p className="text-gray-400 text-sm mb-6 flex-grow">
                            Supervision complète de la plateforme, validation des contraventions, gestion des agents et citoyens, tableaux de bord décisionnels.
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Validation contraventions</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Gestion des agents</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Rapports & KPI</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Paramètres système</span>
                        </div>

                        <Link to="/login?role=admin" className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-center text-sm transition-colors mt-auto">
                            Accéder à l'espace Administrateur &rarr;
                        </Link>
                    </div>

                    {/* Agent Card */}
                    <div className="bg-[#0c4029] border border-blue-500/50 rounded-2xl p-6 flex flex-col h-full transition-transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                            <Badge className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Agent de Police</h2>
                        <p className="text-gray-400 text-sm mb-6 flex-grow">
                            Création et suivi des contraventions sur le terrain, consultation de l'historique et des statistiques personnelles.
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Créer une contravention</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Suivi activité</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Géolocalisation GPS</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Statistiques</span>
                        </div>

                        <Link to="/login?role=agent" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-center text-sm transition-colors mt-auto">
                            Accéder à l'espace Agent de Police &rarr;
                        </Link>
                    </div>

                    {/* Citoyen Card */}
                    <div className="bg-[#0c4029] border border-green-500/50 rounded-2xl p-6 flex flex-col h-full transition-transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center mb-6">
                            <User className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Citoyen</h2>
                        <p className="text-gray-400 text-sm mb-6 flex-grow">
                            Consultation, paiement et contestation de vos contraventions. Accès aux documents officiels avec QR Code.
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Consulter contraventions</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Payer en ligne</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Télécharger PDF</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">Déposer un litige</span>
                        </div>

                        <Link to="/login?role=citoyen" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-center text-sm transition-colors mt-auto">
                            Accéder à l'espace Citoyen &rarr;
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;

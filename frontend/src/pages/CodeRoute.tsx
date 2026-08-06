import { ChevronLeft, Scale, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CodeRoute = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-16">
            {/* Header */}
            <div className="bg-[#0a3622] text-white py-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/4">
                    <Scale className="w-96 h-96" />
                </div>
                
                <div className="max-w-5xl mx-auto relative z-10">
                    <button 
                        onClick={() => navigate('/')} 
                        className="flex items-center text-gray-300 hover:text-white transition-colors text-sm font-medium mb-8"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Retour à l'accueil
                    </button>
                    
                    <h1 className="text-4xl font-bold mb-4 text-yellow-500">Code de la Route</h1>
                    <p className="text-xl text-gray-200 max-w-3xl">
                        Référentiel des infractions et amendes prévues par la réglementation malienne.
                    </p>
                    <div className="mt-6 bg-white/10 border border-white/20 p-4 rounded-lg inline-block">
                        <p className="text-sm text-gray-300 flex items-center">
                            <Info className="w-5 h-5 mr-2 text-yellow-500" />
                            <span className="font-semibold text-white mr-1">Base légale :</span> 
                            décret n°1999-134/P-RM du 26 mai 1999 relatif à la sécurité routière, modifié par le décret n°06-413/P-RM du 27 septembre 2005.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
                
                {/* Section Critique */}
                <section>
                    <div className="flex items-center mb-6">
                        <div className="bg-red-100 p-2 rounded-lg mr-3">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Infractions Critiques</h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                        <th className="px-6 py-4 font-medium w-32">Code</th>
                                        <th className="px-6 py-4 font-medium w-1/4">Libellé</th>
                                        <th className="px-6 py-4 font-medium w-1/2">Description</th>
                                        <th className="px-6 py-4 font-medium text-right">Amende (FCFA)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr className="hover:bg-red-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-red-600">INF-005</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Défaut de permis de conduire ou carte grise</td>
                                        <td className="px-6 py-4 text-gray-600">Incapacité de présenter les documents légaux obligatoires du conducteur et du véhicule.</td>
                                        <td className="px-6 py-4 font-bold text-gray-900 text-right">25 000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Section Grave */}
                <section>
                    <div className="flex items-center mb-6">
                        <div className="bg-orange-100 p-2 rounded-lg mr-3">
                            <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Infractions Graves</h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                        <th className="px-6 py-4 font-medium w-32">Code</th>
                                        <th className="px-6 py-4 font-medium w-1/4">Libellé</th>
                                        <th className="px-6 py-4 font-medium w-1/2">Description</th>
                                        <th className="px-6 py-4 font-medium text-right">Amende (FCFA)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr className="hover:bg-orange-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-orange-600">INF-001</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Excès de vitesse en agglomération</td>
                                        <td className="px-6 py-4 text-gray-600">Dépassement de la vitesse autorisée de plus de 20 km/h en zone urbaine.</td>
                                        <td className="px-6 py-4 font-bold text-gray-900 text-right">20 000</td>
                                    </tr>
                                    <tr className="hover:bg-orange-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-orange-600">INF-003</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Non-respect du feu rouge ou de priorité</td>
                                        <td className="px-6 py-4 text-gray-600">Franchissement d'une intersection au feu rouge ou refus de priorité à un carrefour.</td>
                                        <td className="px-6 py-4 font-bold text-gray-900 text-right">15 000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Section Mineure */}
                <section>
                    <div className="flex items-center mb-6">
                        <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                            <Info className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Infractions Mineures</h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                        <th className="px-6 py-4 font-medium w-32">Code</th>
                                        <th className="px-6 py-4 font-medium w-1/4">Libellé</th>
                                        <th className="px-6 py-4 font-medium w-1/2">Description</th>
                                        <th className="px-6 py-4 font-medium text-right">Amende (FCFA)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr className="hover:bg-yellow-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-yellow-600">INF-004</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Défaut de casque ou ceinture de sécurité</td>
                                        <td className="px-6 py-4 text-gray-600">Conduite d'un deux-roues sans casque ou non-port de la ceinture.</td>
                                        <td className="px-6 py-4 font-bold text-gray-900 text-right">5 000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default CodeRoute;

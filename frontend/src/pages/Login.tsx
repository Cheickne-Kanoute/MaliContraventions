import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { ChevronLeft, UserCircle } from 'lucide-react';
import heroImg from '../assets/hero.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const role = searchParams.get('role') || 'admin';
    const roleTitle = role === 'agent' ? 'Agent de Police' : role === 'citoyen' ? 'Citoyen' : 'Administrateur';
    const roleColor = role === 'agent' ? 'blue' : role === 'citoyen' ? 'green' : 'yellow';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Using existing DRF SimpleJWT endpoint
            const response = await api.post('/api/token/', {
                username: email, // Assuming username is email in your custom user model
                password: password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            // Redirect based on selected role
            if (role === 'agent') {
                navigate('/dashboard/agent');
            } else if (role === 'citoyen') {
                navigate('/dashboard/citoyen');
            } else {
                navigate('/dashboard/admin');
            }
            
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Identifiants incorrects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Side (Dark Green) */}
            <div 
                className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white relative bg-mali-dark"
            >
                
                {/* Logo and Titles */}
                <div className="flex flex-col items-center mb-16">
                    <div className="bg-mali-green bg-opacity-20 p-4 rounded-full mb-6 border border-mali-green">
                        <img src={heroImg} alt="Armoiries du Mali" className="w-12 h-12 object-contain" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 font-serif">République du Mali</h1>
                    <p className="text-gray-300 text-lg">Plateforme de Gestion des Contraventions</p>
                </div>

                {/* Espace Card preview */}
                <div className="bg-mali-dark border border-gray-600 rounded-xl p-8 flex flex-col items-center w-80 shadow-lg relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mali-green via-${roleColor}-500 to-mali-red`}></div>
                    <UserCircle className={`w-10 h-10 text-${roleColor}-500 mb-4`} />
                    <h3 className="text-xl font-bold mb-1">Espace {roleTitle}</h3>
                    <p className="text-xs text-gray-400 text-center">
                        {role === 'citoyen' ? 'Consultation et paiement en ligne' : `Accès réservé à l'${roleTitle.toLowerCase()}`}
                    </p>
                </div>
            </div>

            {/* Right Side (White Form) */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative">

                <div className="w-full max-w-md mx-auto">
                    <button 
                        onClick={() => navigate('/')} 
                        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium mb-8"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Retour à l'accueil
                    </button>

                    <div className="mb-10 text-left">
                        <div className="flex items-center mb-2">
                            <div className="bg-green-50 p-2 rounded-full mr-3 text-mali-green">
                                <UserCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
                        </div>
                        <p className="text-gray-500 text-sm ml-11">Espace {roleTitle}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {role === 'citoyen' ? 'Adresse email ou NINA*' : 'Identifiant professionnel*'}
                            </label>
                            <input
                                type="text" // Using text to allow email or username depending on backend
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mali-green focus:border-mali-green transition-all outline-none"
                                placeholder="admin@police.ml"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe*
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mali-green focus:border-mali-green transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-mali-green hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <UserCircle className="w-5 h-5 mr-2" />
                                    Se connecter
                                </>
                            )}
                        </button>
                        
                        {role === 'citoyen' && (
                            <p className="text-center text-sm text-gray-500 mt-4">
                                Pas encore de compte ?{' '}
                                <a href="/register" className="text-mali-green font-semibold hover:underline">Créer un compte citoyen</a>
                            </p>
                        )}
                        
                        <div className="mt-8 text-center text-xs text-gray-400">
                            Plateforme sécurisée - République du Mali
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

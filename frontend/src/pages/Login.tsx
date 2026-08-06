import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Shield, ChevronLeft, UserCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            
            // Decode JWT to get user role, or simply fetch user profile
            // For now, redirect to admin dashboard as requested
            navigate('/dashboard/admin');
            
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Identifiants incorrects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Side (Dark Green) */}
            <div className="hidden lg:flex lg:w-1/2 bg-mali-dark flex-col items-center justify-center p-12 text-white relative">
                
                {/* Logo and Titles */}
                <div className="flex flex-col items-center mb-16">
                    <div className="bg-mali-green bg-opacity-20 p-4 rounded-full mb-6 border border-mali-green">
                        <Shield className="w-12 h-12 text-mali-red" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">République du Mali</h1>
                    <p className="text-gray-300 text-lg">Plateforme de Gestion des Contraventions</p>
                </div>

                {/* Espace Card preview */}
                <div className="bg-mali-dark border border-gray-600 rounded-xl p-8 flex flex-col items-center w-80 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mali-green via-mali-yellow to-mali-red"></div>
                    <UserCircle className="w-10 h-10 text-mali-yellow mb-4" />
                    <h3 className="text-xl font-bold mb-1">Espace Administrateur</h3>
                    <p className="text-xs text-gray-400 text-center">Accès réservé à l'administration</p>
                </div>
            </div>

            {/* Right Side (White Form) */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative">
                
                <button className="absolute top-8 left-8 sm:left-12 flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour à l'accueil
                </button>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start items-center mb-6">
                            <div className="bg-green-50 p-3 rounded-full mr-3 text-mali-green">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Espace Administrateur</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adresse email professionnelle*
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

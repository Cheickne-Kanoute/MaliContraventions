import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        first_name: '', last_name: '', username: '', email: '',
        telephone: '', nin_carte_identite: '', password: '', password2: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.password2) { setError("Les mots de passe ne correspondent pas."); return; }
        if (form.password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères."); return; }
        setLoading(true);
        try {
            await api.post('/api/utilisateurs/', {
                username: form.username || form.email.split('@')[0],
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                telephone: form.telephone,
                nin_carte_identite: form.nin_carte_identite,
                password: form.password,
                role: 'CITOYEN',
            });
            navigate('/login?role=citoyen&registered=1');
        } catch (err: any) {
            const data = err.response?.data;
            if (data) {
                const msg = Object.entries(data).map(([k, v]) => `${k}: ${(v as any[]).join(', ')}`).join('\n');
                setError(msg);
            } else {
                setError("Erreur lors de la création du compte.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-700 to-green-900 px-8 py-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">MC</div>
                        <div>
                            <h1 className="text-xl font-extrabold">MaliContraventions</h1>
                            <p className="text-green-200 text-xs">République du Mali</p>
                        </div>
                    </div>
                    <h2 className="text-2xl font-extrabold">Créer votre compte citoyen</h2>
                    <p className="text-green-100 text-sm mt-1">Accédez à votre espace pour gérer vos contraventions</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 whitespace-pre-wrap">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                            <input type="text" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                            <input type="text" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur *</label>
                        <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="Votre identifiant de connexion" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input type="tel" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="+223 XX XX XX XX" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NINA / NIN</label>
                            <input type="text" value={form.nin_carte_identite} onChange={e => setForm({...form, nin_carte_identite: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer *</label>
                            <input type="password" required value={form.password2} onChange={e => setForm({...form, password2: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition-colors disabled:opacity-50 mt-2">
                        {loading ? 'Création du compte...' : 'Créer mon compte'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Déjà un compte ?{' '}
                        <Link to="/login?role=citoyen" className="text-green-700 font-semibold hover:underline">Se connecter</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;

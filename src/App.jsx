import React, { useState, useMemo, useEffect } from 'react';
import { authAPI, userAPI, scriptsAPI } from './api.js';

// Logo komponenta
const StudyVaultLogo = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
        {/* Monitor outline */}
        <rect x="20" y="15" width="60" height="45" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <rect x="45" y="60" width="10" height="4" rx="1" fill="currentColor"/>
        
        {/* Open book inside monitor */}
        <path d="M 35 25 L 50 30 L 50 50 L 35 45 Z" fill="currentColor" opacity="0.9"/>
        <path d="M 50 30 L 65 25 L 65 45 L 50 50 Z" fill="currentColor" opacity="0.7"/>
        <path d="M 35 25 L 50 30 L 50 50 L 35 45 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
        <path d="M 50 30 L 65 25 L 65 45 L 50 50 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
        <line x1="50" y1="25" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
        
        {/* Digital/pixelated effect - right side */}
        <rect x="80" y="20" width="4" height="4" fill="currentColor" opacity="0.6"/>
        <rect x="86" y="18" width="4" height="4" fill="currentColor" opacity="0.5"/>
        <rect x="92" y="22" width="4" height="4" fill="currentColor" opacity="0.7"/>
        <rect x="80" y="28" width="4" height="4" fill="currentColor" opacity="0.4"/>
        <rect x="86" y="26" width="4" height="4" fill="currentColor" opacity="0.6"/>
        <rect x="92" y="30" width="4" height="4" fill="currentColor" opacity="0.5"/>
        <rect x="80" y="36" width="4" height="4" fill="currentColor" opacity="0.5"/>
        <rect x="86" y="34" width="4" height="4" fill="currentColor" opacity="0.7"/>
        <rect x="92" y="38" width="4" height="4" fill="currentColor" opacity="0.4"/>
        
        {/* Small star in bottom right */}
        <path d="M 105 100 L 106.5 103.5 L 110 105 L 106.5 106.5 L 105 110 L 103.5 106.5 L 100 105 L 103.5 103.5 Z" fill="currentColor" opacity="0.4"/>
    </svg>
);

// Ikone (simulirano s inline SVG za rad u jednom fajlu)
const IconWallet = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"/><path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M16 16h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1z"/></svg>);
const IconSearch = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const IconUpload = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5"/><path d="M12 17v6"/><path d="m9 20-3-3 3 3"/></svg>);
const IconToken = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12h-2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2v2h2v-2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2zm-6 0h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v2h-2v-2c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h2z"/><path d="M4 12h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H4v2H2v-2c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h2zm16-8H4c-1.1 0-2 .9-2 2v2h2V6h16v2h2V6c0-1.1-.9-2-2-2z"/></svg>);
const IconStar = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);

// --- PODACI I INICIJALNO STANJE ---
const INITIAL_SVL_AIRDROP = 50;

// Simulirani podaci za fallback (ako backend ne radi)
const MOCK_SCRIPTS = [
    { _id: '1', id: '1', title: 'Uvod u Mikroekonomiju', course: 'Mikroekonomija', authorId: { email: 'creator_a' }, price: 15, rating: 4.8, numRatings: 22, description: 'Sažeti pregled temeljnih principa mikroekonomije za prvu godinu.', purchasedBy: [], content: 'Ovo je dešifrirana skripta za Mikroekonomiju...' },
    { _id: '2', id: '2', title: 'Osnove Računovodstva - Bilanca', course: 'Računovodstvo', authorId: { email: 'creator_b' }, price: 20, rating: 4.2, numRatings: 15, description: 'Detaljna analiza bilance i osnovnih knjigovodstvenih operacija.', purchasedBy: [], content: 'Ovo je dešifrirana skripta za Računovodstvo...' },
    { _id: '3', id: '3', title: 'Kvantitativne Metode 1', course: 'Kvantitativne Metode', authorId: { email: 'creator_c' }, price: 10, rating: 5.0, numRatings: 5, description: 'Formule i primjeri za sve ispite iz Kvantitativnih Metoda (1. dio).', purchasedBy: [], content: 'Ovo je dešifrirana skripta za Kvantitativne Metode...' },
];

// Glavna App komponenta
const App = () => {
    // Stanje
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [svlBalance, setSvlBalance] = useState(0);
    const [reputationCredit, setReputationCredit] = useState(0);
    const [scripts, setScripts] = useState([]);
    const [useMockData, setUseMockData] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedScript, setSelectedScript] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    // Učitaj podatke pri učitavanju
    useEffect(() => {
        // Prvo postavi mock podatke kao fallback
        setScripts(MOCK_SCRIPTS);
        setUseMockData(true);
        
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        }
        // Učitaj skripte (s fallback na mock podatke)
        loadScripts();
    }, []);

    // Učitaj skripte kada se promijeni search query
    useEffect(() => {
        if (!useMockData) {
            loadScripts();
        } else {
            // Ako koristimo mock podatke, samo filtriraj
            let filteredScripts = MOCK_SCRIPTS;
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                filteredScripts = MOCK_SCRIPTS.filter(s =>
                    s.title.toLowerCase().includes(lowerQuery) ||
                    s.course.toLowerCase().includes(lowerQuery)
                );
            }
            setScripts(filteredScripts);
        }
    }, [searchQuery]);

    const checkAuth = async () => {
        try {
            const user = await userAPI.getMe();
            setIsLoggedIn(true);
            setCurrentUserId(user._id);
            setSvlBalance(user.svlBalance || 0);
            setReputationCredit(user.reputationCredit || 0);
            setWalletConnected(user.svlBalance > 0);
        } catch (err) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        }
    };

    const loadScripts = async () => {
        try {
            setLoading(true);
            const data = await scriptsAPI.getAll(searchQuery);
            setScripts(data);
            setUseMockData(false);
        } catch (err) {
            console.error('Error loading scripts:', err);
            // Fallback na simulirane podatke ako backend ne radi
            let filteredScripts = MOCK_SCRIPTS;
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                filteredScripts = MOCK_SCRIPTS.filter(s =>
                    s.title.toLowerCase().includes(lowerQuery) ||
                    s.course.toLowerCase().includes(lowerQuery)
                );
            }
            setScripts(filteredScripts);
            setUseMockData(true);
            // Prikaži informativnu poruku
            setError('Backend nije dostupan. Prikazujem demo podatke.');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIKA PRIJAVE I REGISTRACIJE ---

    const handleLogin = async (email, password) => {
        try {
            setError('');
            setLoading(true);
            const response = await authAPI.login(email, password);
            localStorage.setItem('token', response.token);
            setIsLoggedIn(true);
            setCurrentUserId(response.user.id);
            setSvlBalance(response.user.svlBalance || 0);
            setReputationCredit(response.user.reputationCredit || 0);
            setWalletConnected(response.user.svlBalance > 0);
        } catch (err) {
            // Fallback: simulirana prijava ako backend ne radi
            if (useMockData || err.message.includes('Network') || err.message.includes('Failed to fetch')) {
                console.log('Backend nije dostupan, koristim simuliranu prijavu');
                setIsLoggedIn(true);
                setCurrentUserId('demo_user');
                setSvlBalance(0);
                setReputationCredit(0);
                setWalletConnected(false);
            } else {
                setError(err.message || 'Greška pri prijavi');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (email, password, confirmPassword) => {
        if (password !== confirmPassword) {
            setError('Lozinke se ne podudaraju!');
            return false;
        }
        try {
            setError('');
            setLoading(true);
            const response = await authAPI.register(email, password);
            localStorage.setItem('token', response.token);
            setIsLoggedIn(true);
            setCurrentUserId(response.user.id);
            setSvlBalance(response.user.svlBalance || 0);
            setReputationCredit(response.user.reputationCredit || 0);
            return true;
        } catch (err) {
            // Fallback: simulirana registracija ako backend ne radi
            if (useMockData || err.message.includes('Network') || err.message.includes('Failed to fetch')) {
                console.log('Backend nije dostupan, koristim simuliranu registraciju');
                setIsLoggedIn(true);
                setCurrentUserId('demo_user');
                setSvlBalance(0);
                setReputationCredit(0);
                setWalletConnected(false);
                return true;
            } else {
                setError(err.message || 'Greška pri registraciji');
                return false;
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIKA ONBOARDINGA I NOVCANIKA ---

    const handleWalletConnect = async () => {
        try {
            setLoading(true);
            const response = await userAPI.connectWallet();
            setWalletConnected(true);
            setSvlBalance(response.svlBalance);
            setReputationCredit(response.reputationCredit);
            setCurrentView('dashboard');
        } catch (err) {
            // Fallback: simulirano povezivanje novčanika ako backend ne radi
            if (useMockData || err.message.includes('Network') || err.message.includes('Failed to fetch')) {
                console.log('Backend nije dostupan, koristim simulirano povezivanje novčanika');
                setWalletConnected(true);
                setSvlBalance(INITIAL_SVL_AIRDROP);
                setReputationCredit(0);
                setCurrentView('dashboard');
            } else {
                setError(err.message || 'Greška pri povezivanju novčanika');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAirdrop = async () => {
        try {
            setLoading(true);
            const response = await userAPI.airdrop();
            setSvlBalance(response.svlBalance);
        } catch (err) {
            setError(err.message || 'Greška pri airdropu');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIKA POTROSACA (KUPOVINA) ---

    const handlePurchase = async (script) => {
        try {
            setLoading(true);
            const response = await scriptsAPI.purchase(script._id);
            setSvlBalance(response.newBalance);
            setSelectedScript(response.script);
            await loadScripts();
            setShowModal(null);
        } catch (err) {
            setError(err.message || 'Greška pri kupovini');
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (scriptId, ratingValue, reviewText) => {
        try {
            setLoading(true);
            const response = await scriptsAPI.rate(scriptId, ratingValue, reviewText);
            setReputationCredit(response.reputationCredit);
            setSelectedScript(response.script);
            await loadScripts();
            setShowModal(null);
        } catch (err) {
            setError(err.message || 'Greška pri ocjenjivanju');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIKA KREATORA (UPLOADI) ---

    const handleUpload = async (newScript) => {
        try {
            setLoading(true);
            const script = await scriptsAPI.create({
                ...newScript,
                content: `Ovo je sadržaj za skriptu: ${newScript.title}`
            });
            await loadScripts();
            setCurrentView('dashboard');
        } catch (err) {
            setError(err.message || 'Greška pri uploadu');
        } finally {
            setLoading(false);
        }
    };


    // --- PRIKAZI I FILTRIRANJE ---

    const isScriptPurchased = (script) => {
        if (!script || !script.purchasedBy || !currentUserId) return false;
        return script.purchasedBy.some(id => id._id === currentUserId || id === currentUserId);
    };

    // Odabir komponenti za renderiranje
    const renderContent = () => {
        if (!isLoggedIn) {
            return <LoginRegister 
                onLogin={handleLogin} 
                onRegister={handleRegister}
                showLoginForm={showLoginForm}
                setShowLoginForm={setShowLoginForm}
            />;
        }

        if (!walletConnected) {
            return <WalletConnect onConnect={handleWalletConnect} />;
        }

        switch (currentView) {
            case 'dashboard':
                return <Dashboard
                    svlBalance={svlBalance}
                    reputationCredit={reputationCredit}
                    onUploadClick={() => setCurrentView('upload')}
                    onAirdrop={handleAirdrop}
                    scripts={scripts}
                    onScriptSelect={(script) => { setSelectedScript(script); setCurrentView('details'); }}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUserId={currentUserId}
                />;
            case 'details':
                return <ScriptDetail
                    script={selectedScript}
                    isPurchased={isScriptPurchased(selectedScript)}
                    onBuyClick={() => setShowModal('purchase')}
                    onBack={() => { setCurrentView('dashboard'); setSelectedScript(null); }}
                    onRateClick={() => setShowModal('rating')}
                />;
            case 'upload':
                return <UploadForm onUpload={handleUpload} onBack={() => setCurrentView('dashboard')} />;
            default:
                return <Dashboard
                    svlBalance={svlBalance}
                    reputationCredit={reputationCredit}
                    onUploadClick={() => setCurrentView('upload')}
                    onAirdrop={handleAirdrop}
                    scripts={scripts}
                    onScriptSelect={(script) => { setSelectedScript(script); setCurrentView('details'); }}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUserId={currentUserId}
                />;
        }
    };

    // --- Komponente Modala ---

    const PurchaseModal = ({ script, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Potvrda Kupnje</h3>
                <p className="mb-6 text-gray-700 dark:text-gray-300">Želite li kupiti skriptu "{script.title}" za <span className="font-bold text-blue-900 dark:text-blue-400">{script.price} $SVL$</span>?</p>
                <p className="mb-6 text-sm text-red-500">Ova transakcija je simulirana. Tokeni će biti prebačeni autoru.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">Odustani</button>
                    <button onClick={() => handlePurchase(script)} className="px-4 py-2 text-sm font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition">Kupi za {script.price} $SVL$</button>
                </div>
            </div>
        </div>
    );

    const RatingModal = ({ script, onClose }) => {
        const [rating, setRating] = useState(5);
        const [review, setReview] = useState('');

        const submitReview = () => {
            if (rating < 1 || rating > 5) {
                console.error("Ocjena mora biti između 1 i 5.");
                return;
            }
            handleRating(script._id || script.id, rating, review);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Ocjenite "{script.title}"</h3>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">Ostavljanje ocjene donosi autoru Reputacijski Kredit (RC) i potiče kvalitetu.</p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ocjena (1-5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value) || 1)} // Osiguraj da je broj
                            className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-900 focus:ring-blue-900"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recenzija (Opcijonalno)</label>
                        <textarea
                            rows="3"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Vaše mišljenje o skripti..."
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">Odustani</button>
                        <button onClick={submitReview} className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Potvrdi Ocjenu (+5 RC)</button>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 font-sans p-4 sm:p-6">
            {isLoggedIn && (
                <header className="flex justify-between items-center mb-8">
                    <div 
                        onClick={() => { setCurrentView('dashboard'); setSelectedScript(null); }}
                        className="flex items-center space-x-3 cursor-pointer group"
                    >
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <StudyVaultLogo className="text-blue-900 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors" style={{ width: '83px', height: '83px' }} />
                        </div>
                        {/* Natpis "Study Vault" (Tamnoplava boja) */}
                        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-400 tracking-tight group-hover:text-blue-800 dark:group-hover:text-blue-300 transition">
                            Study Vault
                        </h1>
                    </div>
                    {walletConnected && (
                        <div className="flex items-center space-x-4 text-sm font-medium">
                            <div className="flex items-center space-x-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                <IconToken className="w-5 h-5 text-yellow-500" />
                                <span>{svlBalance.toFixed(2)} $SVL$</span>
                            </div>
                            <div className="flex items-center space-x-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                <IconStar className="w-5 h-5 text-green-500" />
                                <span>RC: {reputationCredit}</span>
                            </div>
                        </div>
                    )}
                </header>
            )}

            <main className="max-w-7xl mx-auto">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
                        {error}
                        <button onClick={() => setError('')} className="ml-4 text-red-900 dark:text-red-100">✕</button>
                    </div>
                )}
                {loading && (
                    <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg">
                        Učitavanje...
                    </div>
                )}
                {renderContent()}
            </main>

            {/* Modali */}
            {showModal === 'purchase' && selectedScript && <PurchaseModal script={selectedScript} onClose={() => setShowModal(null)} />}
            {showModal === 'rating' && selectedScript && <RatingModal script={selectedScript} onClose={() => setShowModal(null)} />}
        </div>
    );
};

// --- KOMPONENTE ---

const LoginRegister = ({ onLogin, onRegister, showLoginForm, setShowLoginForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (showLoginForm) {
            // Login
            if (!email || !password) {
                setError('Molimo unesite email i lozinku.');
                return;
            }
            onLogin(email, password);
        } else {
            // Register
            if (!email || !password || !confirmPassword) {
                setError('Molimo ispunite sva polja.');
                return;
            }
            if (password.length < 6) {
                setError('Lozinka mora imati najmanje 6 znakova.');
                return;
            }
            const success = onRegister(email, password, confirmPassword);
            if (!success) {
                setError('Lozinke se ne podudaraju.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <StudyVaultLogo className="text-blue-900 dark:text-blue-400" style={{ width: '125px', height: '125px' }} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400 tracking-tight mb-2">
                        Study Vault
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {showLoginForm ? 'Prijavite se na svoj račun' : 'Kreirajte novi račun'}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition"
                                placeholder="vas@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lozinka
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {!showLoginForm && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Potvrdi Lozinku
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}

                        {(error || loading) && (
                            <div className={`p-3 rounded-lg text-sm ${
                                error 
                                    ? 'bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300' 
                                    : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                            }`}>
                                {error || 'Učitavanje...'}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition transform hover:scale-105"
                        >
                            {showLoginForm ? 'Prijavi se' : 'Registriraj se'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setShowLoginForm(!showLoginForm);
                                setError('');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className="text-sm text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                        >
                            {showLoginForm 
                                ? 'Nemate račun? Registrirajte se' 
                                : 'Već imate račun? Prijavite se'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WalletConnect = ({ onConnect }) => {
    return (
        <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-blue-400 dark:border-blue-700 max-w-md mx-auto mt-20">
            <IconWallet className="w-12 h-12 text-blue-900 mb-4" />
            <h2 className="text-2xl font-bold mb-2">2. Povezivanje Novčanika</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Molimo povežite svoj Web3 novčanik (npr. MetaMask) za pristup $SVL$ tokenima i sadržaju.</p>
            <button
                onClick={onConnect}
                className="w-full py-3 px-6 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition transform hover:scale-105"
            >
                Poveži Novčanik & Primi Airdrop ({INITIAL_SVL_AIRDROP} $SVL$)
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Simulacija: Tokeni će biti automatski dodani na saldo nakon povezivanja.</p>
        </div>
    );
};

const Dashboard = ({ svlBalance, reputationCredit, onUploadClick, onAirdrop, scripts, onScriptSelect, searchQuery, setSearchQuery, currentUserId }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Kartica 1: Upload (Zelena boja ostaje jer se odnosi na 'Kreatora/Zaradu') */}
                <div
                    onClick={onUploadClick}
                    className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/40 rounded-xl shadow-lg border border-green-300 dark:border-green-700 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
                >
                    <IconUpload className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                    <span className="text-lg font-semibold text-green-800 dark:text-green-200">Uploadaj Skriptu</span>
                    <p className="text-sm text-green-600 dark:text-green-400">Postani Kreator i zaradi $SVL$ & RC!</p>
                </div>
                {/* Kartica 2: Saldo (Žuta boja ostaje jer se odnosi na 'SVL Tokene') */}
                <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900/40 rounded-xl shadow-lg border border-yellow-300 dark:border-yellow-700">
                    <IconToken className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-2" />
                    <span className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{svlBalance.toFixed(2)} $SVL$</span>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Trenutni Saldo Novčanika</p>
                </div>
                {/* Kartica 3: Reputacija (Plava boja je ažurirana na tamniju nijansu) */}
                <div className="flex flex-col items-center justify-center p-6 bg-blue-100 dark:bg-blue-900/40 rounded-xl shadow-lg border border-blue-400 dark:border-blue-700">
                    <IconStar className="w-8 h-8 text-blue-700 dark:text-blue-400 mb-2" />
                    <span className="text-2xl font-bold text-blue-900 dark:text-blue-200">{reputationCredit} RC</span>
                    <p className="text-sm text-blue-700 dark:text-blue-400">Reputacijski Kredit (RC)</p>
                </div>
            </div>

            {/* Tražilica i Lista Skripti */}
            <div className="mb-6">
                <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pretraži kolegij ili naslov skripte (npr. 'Mikroekonomija')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-inner focus:ring-blue-900 focus:border-blue-900 dark:bg-gray-800 dark:text-white transition"
                    />
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Dostupne Skripte</h2>

                    <ScriptList scripts={scripts} onScriptSelect={onScriptSelect} myUserId={currentUserId} />

            <div className="mt-8 text-center">
                <button
                    onClick={onAirdrop}
                    className="text-sm text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                >
                    (Simulacija: Klikni za ponovni Airdrop +{INITIAL_SVL_AIRDROP} $SVL$)
                </button>
            </div>
        </div>
    );
};

const ScriptList = ({ scripts, onScriptSelect, myUserId }) => {
    if (scripts.length === 0) {
        return <p className="text-center py-8 text-gray-500 dark:text-gray-400">Nema pronađenih skripti za prikaz.</p>;
    }

    const isPurchased = (script) => {
        if (!script.purchasedBy || !myUserId) return false;
        return script.purchasedBy.some(id => (typeof id === 'object' ? id._id : id) === myUserId);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map(script => (
                <div
                    key={script._id || script.id}
                    onClick={() => onScriptSelect(script)}
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition transform hover:scale-[1.02] cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {script.course}
                        </span>
                        <div className="flex items-center text-yellow-500 text-sm font-medium">
                            <IconStar className="w-4 h-4 mr-1 fill-yellow-500" />
                            {script.rating || 0}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{script.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{script.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                        {isPurchased(script) ? (
                            <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                                <IconToken className="w-4 h-4 mr-1" /> KUPLJENO
                            </span>
                        ) : (
                            <span className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center">
                                <IconToken className="w-4 h-4 mr-1" />
                                {script.price} $SVL$
                            </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Autor: {typeof script.authorId === 'object' ? script.authorId.email : script.authorId}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ScriptDetail = ({ script, isPurchased, onBuyClick, onBack, onRateClick }) => {
    if (!script) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-blue-900 dark:text-blue-400 hover:text-blue-800 transition mb-6">
                    &larr; Natrag na Dashboard
                </button>
                <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Skripta nije pronađena.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center text-blue-900 dark:text-blue-400 hover:text-blue-800 transition mb-6">
                &larr; Natrag na Dashboard
            </button>

            <header className="border-b pb-4 mb-6 border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-400">{script.course}</span>
                <h2 className="text-3xl font-extrabold mt-1">{script.title}</h2>
                <div className="flex items-center mt-2 space-x-4">
                    <span className="flex items-center text-yellow-500 font-bold">
                        <IconStar className="w-5 h-5 mr-1 fill-yellow-500" />
                        {script.rating} ({script.numRatings} ocjena)
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Autor: {typeof script.authorId === 'object' ? script.authorId.email : script.authorId}
                    </span>
                </div>
            </header>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-3">Opis Skripte</h3>
                <p className="text-gray-700 dark:text-gray-300">{script.description}</p>
            </section>

            {isPurchased ? (
                <>
                    <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">Pristup Otključan!</h3>
                    <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-500 mb-6">
                        <p className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
                            {/* Simulacija decentraliziranog preuzimanja s IPFS-a */}
                            {script.content}
                        </p>
                    </div>

                    {!script.hasRated && (
                        <button onClick={onRateClick} className="w-full py-3 px-6 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition transform">
                            Ocijeni/Recenziraj skriptu & Dobij RC (Reputacijski Kredit)
                        </button>
                    )}
                </>
            ) : (
                <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-100 dark:bg-gray-700 p-5 rounded-lg border-l-4 border-blue-900">
                    <span className="text-2xl font-extrabold text-blue-900 dark:text-blue-300 flex items-center mb-4 sm:mb-0">
                        Cijena: <IconToken className="w-6 h-6 ml-2 mr-1 text-yellow-500" /> {script.price} $SVL$
                    </span>
                    <button
                        onClick={onBuyClick}
                        className="py-3 px-8 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition transform hover:scale-[1.03]"
                    >
                        Kupi za {script.price} $SVL$
                    </button>
                </div>
            )}
        </div>
    );
};

const UploadForm = ({ onUpload, onBack }) => {
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(15);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !course || !file || price < 1) {
            setMessage('Molimo ispunite sva polja i odaberite datoteku.');
            return;
        }

        setIsUploading(true);
        setMessage('Mintanje NFT-a i upload na IPFS u tijeku...');

        setTimeout(() => {
            // Simulacija Mintanja i Upload-a
            const newScript = {
                title,
                course,
                description,
                price: parseInt(price, 10),
                // U stvarnosti bi ovdje bio IPFS hash
            };

            onUpload(newScript);
            setMessage('Skripta uspješno mintana i objavljena!');
            setIsUploading(false);
        }, 2000); // 2 sekunde simulacije uploada
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl max-w-2xl mx-auto">
            <button onClick={onBack} className="flex items-center text-blue-900 dark:text-blue-400 hover:text-blue-800 transition mb-6">
                &larr; Natrag na Dashboard
            </button>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-gray-200 dark:border-gray-700">Uploadaj Skriptu (Postani Kreator)</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Naziv Skripte</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kolegij</label>
                    <input type="text" id="course" value={course} onChange={(e) => setCourse(e.target.value)}
                        placeholder="Npr. Mikroekonomija, Računovodstvo"
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opis (Sažetak)</label>
                    <textarea id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cijena ($SVL$ Tokeni)</label>
                        <input type="number" id="price" min="1" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm" required />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Primanje Nagrada: Kada se kupi, primate $SVL$ tokene i Reputacijski Kredit (RC).</p>
                    </div>
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Datoteka Skripte (.pdf/.doc)</label>
                        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 dark:file:bg-blue-900 dark:file:text-blue-300 dark:file:hover:bg-blue-800" required />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sustav će automatski mintati NFT (Dokaz Autorstva).</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm ${isUploading ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'}`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3 px-6 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Mintanje i Objava...' : 'Objavi Skriptu'}
                </button>
            </form>
        </div>
    );
};

export default App;


import React, { useEffect, useState, useRef } from 'react';
import AdminDashboard from './components/AdminDashboard';
import KamarCrud from './components/KamarCrud';
import ApartemenCrud from './components/ApartemenCrud';
import UserDashboard from './components/UserDashboard';
import SewaKamarForm from './components/SewaKamarForm';
import KamarListUser from './components/KamarListUser';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

function App() {
  const [kamar, setKamar] = useState([]);
  const [apartemen, setApartemen] = useState([]);
  const [kamarDipilih, setKamarDipilih] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [authPage, setAuthPage] = useState('login');
  const [refreshSewa, setRefreshSewa] = useState(0);
  const [activeTab, setActiveTab] = useState('kamar'); // 'kamar', 'pesanan', 'checkout'
  const tabRef = useRef(null);

  // Fetch kamar & apartemen dari backend
  const fetchKamar = () => {
    const token = localStorage.getItem('token');
    fetch('https://be-sewaapart-86067911510.us-central1.run.app/kamar', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async res => {
        if (res.status === 401) {
          alert('Session Anda telah habis, silakan login ulang.');
          handleLogout();
          return [];
        }
        return res.json();
      })
      .then(data => Array.isArray(data) ? setKamar(data) : setKamar([]));
  };
  const fetchApartemen = () => {
    const token = localStorage.getItem('token');
    fetch('https://be-sewaapart-86067911510.us-central1.run.app/apartements', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async res => {
        if (res.status === 401) {
          alert('Session Anda telah habis, silakan login ulang.');
          handleLogout();
          return [];
        }
        return res.json();
      })
      .then(data => Array.isArray(data) ? setApartemen(data) : setApartemen([]));
  };

  useEffect(() => {
    fetchKamar();
    fetchApartemen();
  }, []);

  // Handler login
  const handleLogin = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  };

  // Handler logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setAuthPage('login');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Routing by role
  if (!user) {
    return authPage === 'login' ? (
      <div className="App">
        {/* Branding */}
        <LoginForm onLogin={handleLogin} onSwitch={() => setAuthPage('register')} />
        {/* Watermark */}
        <div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 13, marginTop: 48, marginBottom: 8 }}>
          © {new Date().getFullYear()} Lee Sitanggang by Astama. All rights reserved.
        </div>
      </div>
    ) : (
      <div className="App">
        {/* Branding */}
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 24, color: '#4a90e2', margin: '32px 0 16px 0', letterSpacing: 1 }}>
          Lee Sitanggang by Astama
        </div>
        <RegisterForm onRegister={() => setAuthPage('login')} onSwitch={() => setAuthPage('login')} />
        {/* Watermark */}
        <div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 13, marginTop: 48, marginBottom: 8 }}>
          © {new Date().getFullYear()} Lee Sitanggang by Astama. All rights reserved.
        </div>
      </div>
    );
  }

  if (user.role === 'Admin') {
    return (
      <div className="App">
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
          <span style={{ marginRight: 16, color: '#4a90e2', fontWeight: 600 }}>Hi, {user.nama_user} (Admin)</span>
          <button onClick={handleLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
        </div>
        <AdminDashboard kamar={kamar} apartemen={apartemen} fetchKamar={fetchKamar} fetchApartemen={fetchApartemen}>
          <KamarCrud kamar={kamar} apartemen={apartemen} fetchKamar={fetchKamar} />
          <ApartemenCrud apartemen={apartemen} fetchApartemen={fetchApartemen} />
        </AdminDashboard>
        {/* Watermark */}
        <div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 13, marginTop: 48, marginBottom: 8 }}>
          © {new Date().getFullYear()} Lee Sitanggang by Astama. All rights reserved.
        </div>
      </div>
    );
  }

  // Penyewa
  return (
    <div className="App">
      {/* Navbar Atas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#fff', borderBottom: '1px solid #e0e0e0', marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          <button onClick={() => setActiveTab('kamar')} style={{ background: activeTab === 'kamar' ? '#4a90e2' : 'none', color: activeTab === 'kamar' ? '#fff' : '#4a90e2', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Kamar Tersedia</button>
          <button onClick={() => setActiveTab('pesanan')} style={{ background: activeTab === 'pesanan' ? '#4a90e2' : 'none', color: activeTab === 'pesanan' ? '#fff' : '#4a90e2', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Pesanan Saya</button>
          <button onClick={() => setActiveTab('checkout')} style={{ background: activeTab === 'checkout' ? '#4a90e2' : 'none', color: activeTab === 'checkout' ? '#fff' : '#4a90e2', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Checkout</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 16, color: '#4a90e2', fontWeight: 600 }}>Hi, {user.nama_user} (Penyewa)</span>
          <button onClick={handleLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
      {/* Konten dengan animasi geser antar tab */}
      <div className="tab-content-anim">
        <TransitionGroup component={null}>
          <CSSTransition key={activeTab} classNames="slide-fade" timeout={400} nodeRef={tabRef}>
            <div ref={tabRef}>
              {activeTab === 'kamar' && (
                <KamarListUser onPilihKamar={setKamarDipilih} apartemen={apartemen} animateList={true} />
              )}
              {kamarDipilih && (
                <SewaKamarForm kamarDipilih={kamarDipilih} onClose={() => setKamarDipilih(null)} userLogin={user} onSewaSuccess={() => setRefreshSewa(x => x+1)} />
              )}
              {(activeTab === 'pesanan' || activeTab === 'checkout') && (
                <UserDashboard refreshSewa={refreshSewa} userLogin={user} activeTab={activeTab} setActiveTab={setActiveTab} animateList={true} />
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      {/* Watermark */}
      <div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 13, marginTop: 48, marginBottom: 8 }}>
        © {new Date().getFullYear()} Lee Sitanggang by Astama. All rights reserved.
      </div>
    </div>
  );
}

export default App;

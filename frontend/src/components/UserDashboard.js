import React, { useEffect, useState } from 'react';

const UserDashboard = ({ refreshSewa, userLogin, activeTab, setActiveTab, animateList }) => {
  const [sewa, setSewa] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!userLogin) return;
    const token = localStorage.getItem('token');
    fetch('https://be-sewaapart-86067911510.us-central1.run.app/sewa-kamar', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setSewa(Array.isArray(data) ? data.filter(item => item.id_user === userLogin.id_user) : []);
      });
  }, [refreshSewa, userLogin]);

  // Handler untuk checkout (ubah status_sewa menjadi 'Selesai')
  const handleCheckout = async (id_sewa) => {
    setLoadingCheckout(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://be-sewaapart-86067911510.us-central1.run.app/sewa-kamar/${id_sewa}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status_sewa: 'Selesai' })
      });
      if (res.ok) {
        setSuccessMsg('Checkout berhasil!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        setErrorMsg('Gagal checkout');
        setTimeout(() => setErrorMsg(''), 2000);
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan');
      setTimeout(() => setErrorMsg(''), 2000);
    }
    setLoadingCheckout(false);
    setTimeout(() => window.location.reload(), 500);
  };

  // Untuk animasi list pesanan dan checkout
  const getAnimClass = idx => animateList ? 'kamar-card-anim' : '';
  const getAnimStyle = idx => animateList ? { animationDelay: `${idx * 80}ms` } : {};

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #eee', padding: 40, position: 'relative' }}>
      {/* Watermark & Branding */}
      <div style={{ position: 'absolute', top: 18, left: 32, color: '#4a90e2', fontWeight: 800, fontSize: 22, letterSpacing: 1, opacity: 0.92, zIndex: 2 }}>
        Lee Sitanggang by Astama
      </div>
      {activeTab === 'pesanan' && (
        <>
          <h2 style={{ color: '#2d3a4b', marginBottom: 24 }}>Pesanan Saya</h2>
          {sewa.length === 0 ? (
            <div style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>Belum ada pesanan.</div>
          ) : (
            <div className={animateList ? 'kamar-list-anim' : ''}>
              {sewa.map((item, idx) => (
                <div key={item.id_sewa} className={getAnimClass(idx)} style={getAnimStyle(idx)}>
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: 14,
                    boxShadow: '0 2px 12px #e0e6ed',
                    padding: 0,
                    minWidth: 320,
                    maxWidth: 400,
                    margin: '12px 0',
                    borderLeft: item.status_sewa === 'Aktif' ? '6px solid #4a90e2' : '#f5efd1',
                    position: 'relative',
                    flex: '1 1 320px',
                    transition: 'box-shadow 0.2s',
                    overflow: 'hidden',
                  }}>
                    <img src={item.kamar && item.kamar.gambar ? item.kamar.gambar : 'https://via.placeholder.com/320x180?text=No+Image'} alt={item.kamar && item.kamar.nomor_kamar ? item.kamar.nomor_kamar : 'Kamar'} style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 14, borderTopRightRadius: 14, marginBottom: 0 }} />
                    <div style={{ padding: 24 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: '#22304a', marginBottom: 6 }}>
                        Kamar: {item.kamar ? `${item.id_kamar} - ${item.kamar.nomor_kamar}` : item.id_kamar}
                        {item.kamar && item.kamar.apartemen && (
                          <span style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>
                            (Lokasi: {item.kamar.apartemen.nama_apartemen})
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#4a90e2', fontWeight: 600, marginBottom: 8 }}>
                        Tanggal: {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} s/d {new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: 15, color: '#555', marginBottom: 8 }}>
                        ID Pesanan: {item.id_sewa}
                      </div>
                      <div style={{ position: 'absolute', top: 18, right: 24 }}>
                        <span style={{
                          background: item.status_sewa === 'Aktif' ? '#d1f5e0' : item.status_sewa === 'Selesai' ? '#f5efd1' : '#f5d1d1',
                          color: item.status_sewa === 'Aktif' ? '#1a7f37' : item.status_sewa === 'Selesai' ? '#a68b00' : '#a61a1a',
                          padding: '4px 14px',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 15
                        }}>{item.status_sewa}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {activeTab === 'checkout' && (
        <>
          <h2 style={{ color: '#2d3a4b', marginBottom: 24 }}>Checkout</h2>
          {successMsg && <div style={{ color: '#1a7f37', marginBottom: 16, textAlign: 'center' }}>{successMsg}</div>}
          {errorMsg && <div style={{ color: '#e74c3c', marginBottom: 16, textAlign: 'center' }}>{errorMsg}</div>}
          {sewa.filter(item => item.status_sewa === 'Aktif').length === 0 ? (
            <div style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>Tidak ada pesanan yang bisa di-checkout.</div>
          ) : (
            <div className={animateList ? 'kamar-list-anim' : ''}>
              {sewa.filter(item => item.status_sewa === 'Aktif').map((item, idx) => (
                <div key={item.id_sewa} className={getAnimClass(idx)} style={getAnimStyle(idx)}>
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: 14,
                    boxShadow: '0 2px 12px #e0e6ed',
                    padding: 0,
                    minWidth: 320,
                    maxWidth: 400,
                    margin: '12px 0',
                    borderLeft: '6px solid #4a90e2',
                    position: 'relative',
                    flex: '1 1 320px',
                    transition: 'box-shadow 0.2s',
                    overflow: 'hidden',
                  }}>
                    <img src={item.kamar && item.kamar.gambar ? item.kamar.gambar : 'https://via.placeholder.com/320x180?text=No+Image'} alt={item.kamar && item.kamar.nomor_kamar ? item.kamar.nomor_kamar : 'Kamar'} style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 14, borderTopRightRadius: 14, marginBottom: 0 }} />
                    <div style={{ padding: 24 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: '#22304a', marginBottom: 6 }}>
                        Kamar: {item.kamar ? `${item.id_kamar} - ${item.kamar.nomor_kamar}` : item.id_kamar}
                        {item.kamar && item.kamar.apartemen && (
                          <span style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>
                            (Lokasi: {item.kamar.apartemen.nama_apartemen})
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#4a90e2', fontWeight: 600, marginBottom: 8 }}>
                        Tanggal: {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} s/d {new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: 15, color: '#555', marginBottom: 8 }}>
                        ID Pesanan: {item.id_sewa}
                      </div>
                      <div style={{ marginTop: 16, textAlign: 'right' }}>
                        <button onClick={() => handleCheckout(item.id_sewa)} disabled={loadingCheckout} style={{ padding: '8px 24px', borderRadius: 8, background: '#4a90e2', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #e0e6ed' }}>
                          {loadingCheckout ? 'Memproses...' : 'Checkout'}
                        </button>
                      </div>
                      <div style={{ position: 'absolute', top: 18, right: 24 }}>
                        <span style={{
                          background: '#d1f5e0',
                          color: '#1a7f37',
                          padding: '4px 14px',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 15
                        }}>{item.status_sewa}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* Watermark Copyright */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: 48, color: '#b0b6c3', fontSize: 15, fontWeight: 500, letterSpacing: 0.5 }}>
        &copy; {new Date().getFullYear()} Lee Sitanggang by Astama. All rights reserved.
      </div>
    </div>
  );
};

export default UserDashboard;

import React, { useEffect, useState } from 'react';

const AdminDashboard = ({ kamar, apartemen, fetchKamar, fetchApartemen, children }) => {
  const [sewaKamar, setSewaKamar] = useState([]);
  const [menu, setMenu] = useState('dashboard');

  // Ambil data sewa kamar dari backend
  const fetchAll = () => {
    const token = localStorage.getItem('token');
    fetch('https://be-sewaapart-86067911510.us-central1.run.app/sewa-kamar', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setSewaKamar(data) : setSewaKamar([]));
    fetchKamar();
    fetchApartemen();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 600, background: '#f4f6fa', borderRadius: 16 }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#22304a', color: '#fff', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, padding: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 22, padding: '32px 0 24px 0', textAlign: 'center', letterSpacing: 1, borderBottom: '1px solid #2d3a4b' }}>
          Admin Panel
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 16 }}>
          <button onClick={() => setMenu('dashboard')} style={{ background: menu==='dashboard' ? '#4a90e2' : 'none', color: '#fff', border: 'none', textAlign: 'left', padding: '16px 32px', fontWeight: 600, cursor: 'pointer', borderLeft: menu==='dashboard' ? '4px solid #fff' : '4px solid transparent' }}>Dashboard</button>
          <button onClick={() => setMenu('kamar')} style={{ background: menu==='kamar' ? '#4a90e2' : 'none', color: '#fff', border: 'none', textAlign: 'left', padding: '16px 32px', fontWeight: 600, cursor: 'pointer', borderLeft: menu==='kamar' ? '4px solid #fff' : '4px solid transparent' }}>Tambah Kamar</button>
          <button onClick={() => setMenu('apartemen')} style={{ background: menu==='apartemen' ? '#4a90e2' : 'none', color: '#fff', border: 'none', textAlign: 'left', padding: '16px 32px', fontWeight: 600, cursor: 'pointer', borderLeft: menu==='apartemen' ? '4px solid #fff' : '4px solid transparent' }}>Tambah Apartemen</button>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: 40, background: '#fff', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
        {menu === 'dashboard' && (
          <>
            <h2 style={{ color: '#2d3a4b', marginBottom: 24 }}>Dashboard Admin</h2>
            <button onClick={fetchAll} style={{ marginBottom: 24, background: '#4a90e2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Refresh</button>
            <h3 style={{ color: '#4a90e2', marginBottom: 16 }}>Pesanan Sewa Kamar</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc', marginBottom: 32 }}>
              <thead>
                <tr style={{ background: '#eaf1fb' }}>
                  <th style={{ padding: 10, border: '1px solid #e0e0e0' }}>ID</th>
                  <th style={{ padding: 10, border: '1px solid #e0e0e0' }}>User</th>
                  <th style={{ padding: 10, border: '1px solid #e0e0e0' }}>Kamar</th>
                  <th style={{ padding: 10, border: '1px solid #e0e0e0' }}>Tanggal Mulai</th>
                  <th style={{ padding: 10, border: '1px solid #e0e0e0' }}>Tanggal Selesai</th>
                  <th style={{ padding: 10, border: '1px solid #e0e0e0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sewaKamar.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: '#aaa' }}>Belum ada pesanan.</td>
                  </tr>
                )}
                {sewaKamar.map((item, idx) => (
                  <tr key={item.id_sewa} style={{ background: idx % 2 === 0 ? '#fff' : '#f5f7fa' }}>
                    <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>{item.id_sewa}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>{item.user ? item.user.nama_user : item.id_user}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>{item.kamar ? `${item.id_kamar} - ${item.kamar.nomor_kamar}` : item.id_kamar}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>{item.tanggal_mulai}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>{item.tanggal_selesai}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e0e0' }}>
                      <span style={{
                        background: item.status_sewa === 'Aktif' ? '#d1f5e0' : item.status_sewa === 'Selesai' ? '#f5efd1' : '#f5d1d1',
                        color: item.status_sewa === 'Aktif' ? '#1a7f37' : item.status_sewa === 'Selesai' ? '#a68b00' : '#a61a1a',
                        padding: '4px 12px',
                        borderRadius: 8,
                        fontWeight: 600
                      }}>{item.status_sewa}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 style={{ color: '#4a90e2', marginBottom: 12 }}>List Kamar</h3>
            <ul style={{ padding: 0, marginBottom: 32 }}>
              {kamar.map((k, idx) => (
                <li key={k.id_kamar} style={{ listStyle: 'none', background: idx % 2 === 0 ? '#f5f7fa' : '#fff', marginBottom: 6, padding: 10, borderRadius: 6 }}>
                  <b>{k.nomor_kamar}</b> - {k.tipe_kamar} - <span style={{ color: k.status === 'Tersedia' ? '#1a7f37' : '#a61a1a' }}>{k.status}</span>
                </li>
              ))}
            </ul>
            <h3 style={{ color: '#4a90e2', marginBottom: 12 }}>List Apartemen</h3>
            <ul style={{ padding: 0 }}>
              {apartemen.map((a, idx) => (
                <li key={a.id_apartemen} style={{ listStyle: 'none', background: idx % 2 === 0 ? '#fff' : '#f5f7fa', marginBottom: 6, padding: 10, borderRadius: 6 }}>
                  <b>{a.nama_apartemen}</b> - {a.alamat}
                </li>
              ))}
            </ul>
          </>
        )}
        {menu === 'kamar' && (
          <>
            <h2 style={{ color: '#2d3a4b', marginBottom: 24 }}>CRUD Kamar</h2>
            {children && children[0]}
          </>
        )}
        {menu === 'apartemen' && (
          <>
            <h2 style={{ color: '#2d3a4b', marginBottom: 24 }}>CRUD Apartemen</h2>
            {children && children[1]}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

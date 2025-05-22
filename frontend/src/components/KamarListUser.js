import React, { useEffect, useState } from 'react';

const KamarListUser = ({ onPilihKamar, apartemen }) => {
  const [kamar, setKamar] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/kamar')
      .then(res => res.json())
      .then(setKamar);
  }, []);

  // Helper untuk dapatkan nama apartemen dari id_apartemen
  const getNamaApartemen = (id) => {
    const apt = apartemen?.find(a => a.id_apartemen === id);
    return apt ? apt.nama_apartemen : '-';
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center', color: '#2d3a4b', marginBottom: 24 }}>Pilih Kamar</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {kamar.map(k => (
          <div key={k.id_kamar} style={{ width: 260, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #eee', padding: 16, cursor: k.status === 'Tersedia' ? 'pointer' : 'not-allowed', opacity: k.status === 'Tersedia' ? 1 : 0.6, transition: 'box-shadow 0.2s' }}
            onClick={() => {
              if (k.status === 'Tersedia') {
                onPilihKamar(k);
              } else {
                alert('Kamar sudah terisi');
              }
            }}>
            <img src={k.gambar ? k.gambar : 'https://via.placeholder.com/240x160?text=No+Image'} alt={k.nomor_kamar} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
            <div style={{ fontWeight: 600, fontSize: 18 }}>{k.nomor_kamar} - {k.tipe_kamar}</div>
            <div style={{ color: '#4a90e2', fontWeight: 600, margin: '8px 0' }}>Rp {k.harga_per_bulan}</div>
            <div style={{ color: k.status === 'Tersedia' ? '#1a7f37' : '#a61a1a', fontWeight: 500 }}>{k.status}</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>{k.fasilitas}</div>
            <div style={{ fontSize: 13, color: '#444', marginTop: 6 }}><b>Lokasi Apartemen:</b> {getNamaApartemen(k.id_apartemen)}</div>
            {k.status === 'Terisi' && (
              <div style={{ color: '#e74c3c', fontWeight: 600, marginTop: 10, textAlign: 'center', fontSize: 15 }}>Kamar sudah terisi</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KamarListUser;

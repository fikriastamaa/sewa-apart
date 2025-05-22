import React, { useEffect, useState } from 'react';

const SewaKamarForm = ({ kamarDipilih, onClose, userLogin, onSewaSuccess }) => {
  const [form, setForm] = useState({ id_kamar: '', id_user: '', tanggal_mulai: '', tanggal_selesai: '' });
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, [kamarDipilih]);

  useEffect(() => {
    if (kamarDipilih && userLogin) {
      setForm(f => ({ ...f, id_kamar: kamarDipilih.id_kamar, id_user: userLogin.id_user }));
    }
  }, [kamarDipilih, userLogin]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    fetch('https://be-sewaapart-86067911510.us-central1.run.app/sewa-kamar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ id_kamar: '', id_user: '', tanggal_mulai: '', tanggal_selesai: '' });
      onClose();
      if (onSewaSuccess) onSewaSuccess();
    });
  };

  if (!kamarDipilih) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px #eee',
        padding: 32,
        minWidth: 400,
        position: 'relative',
        transform: show ? 'translateY(0)' : 'translateY(40px)',
        opacity: show ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(.4,1.3,.6,1)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
        <h3 style={{ color: '#4a90e2', marginBottom: 16 }}>Sewa Kamar</h3>
        <img src={kamarDipilih.gambar ? kamarDipilih.gambar : 'https://via.placeholder.com/320x180?text=No+Image'} alt={kamarDipilih.nomor_kamar} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
        <div style={{ fontWeight: 600, fontSize: 18 }}>{kamarDipilih.nomor_kamar} - {kamarDipilih.tipe_kamar}</div>
        <div style={{ color: '#4a90e2', fontWeight: 600, margin: '8px 0' }}>Rp {kamarDipilih.harga_per_bulan}</div>
        <div style={{ color: kamarDipilih.status === 'Tersedia' ? '#1a7f37' : '#a61a1a', fontWeight: 500 }}>{kamarDipilih.status}</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{kamarDipilih.fasilitas}</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* id_user otomatis dari userLogin, tidak perlu select */}
          <input type="date" name="tanggal_mulai" value={form.tanggal_mulai} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
          <input type="date" name="tanggal_selesai" value={form.tanggal_selesai} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
          <button type="submit" style={{ padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', fontWeight: 600 }}>Pesan</button>
        </form>
      </div>
    </div>
  );
};

export default SewaKamarForm;

import React, { useState } from 'react';

const KamarCrud = ({ kamar, apartemen, fetchKamar }) => {
  const [form, setForm] = useState({ id_apartemen: '', nomor_kamar: '', tipe_kamar: '', harga_per_bulan: '', status: 'Tersedia', fasilitas: '', gambar: '' });
  const [editId, setEditId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (editId) {
      // Edit mode
      fetch(`https://be-sewaapart-86067911510.us-central1.run.app/kamar/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form)
      }).then(() => {
        setForm({ id_apartemen: '', nomor_kamar: '', tipe_kamar: '', harga_per_bulan: '', status: 'Tersedia', fasilitas: '', gambar: '' });
        setEditId(null);
        setShowPopup(false);
        fetchKamar();
      });
    } else {
      // Add mode
      fetch('https://be-sewaapart-86067911510.us-central1.run.app/kamar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form)
      }).then(() => {
        setForm({ id_apartemen: '', nomor_kamar: '', tipe_kamar: '', harga_per_bulan: '', status: 'Tersedia', fasilitas: '', gambar: '' });
        fetchKamar();
      });
    }
  };

  const handleDelete = id => {
    const token = localStorage.getItem('token');
    fetch(`https://be-sewaapart-86067911510.us-central1.run.app/kamar/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(() => fetchKamar());
  };

  const handleEdit = k => {
    setForm({
      id_apartemen: k.id_apartemen,
      nomor_kamar: k.nomor_kamar,
      tipe_kamar: k.tipe_kamar,
      harga_per_bulan: k.harga_per_bulan,
      status: k.status,
      fasilitas: k.fasilitas,
      gambar: k.gambar
    });
    setEditId(k.id_kamar);
    setShowPopup(true);
  };

  const handleCancelEdit = () => {
    setForm({ id_apartemen: '', nomor_kamar: '', tipe_kamar: '', harga_per_bulan: '', status: 'Tersedia', fasilitas: '', gambar: '' });
    setEditId(null);
    setShowPopup(false);
  };

  // Pastikan apartemen adalah array agar .map tidak error
  const safeApartemen = Array.isArray(apartemen) ? apartemen : [];
  // Pastikan kamar adalah array agar .map tidak error
  const safeKamar = Array.isArray(kamar) ? kamar : [];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #eee', padding: 32 }}>
      <h3 style={{ color: '#4a90e2', marginBottom: 16 }}>CRUD Kamar</h3>
      {/* Form tambah kamar */}
      <form onSubmit={handleSubmit} style={{ display: editId ? 'none' : 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <select name="id_apartemen" value={form.id_apartemen} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }}>
          <option value="">Pilih Apartemen</option>
          {safeApartemen.map(a => (
            <option key={a.id_apartemen} value={a.id_apartemen}>{a.nama_apartemen}</option>
          ))}
        </select>
        <input name="nomor_kamar" placeholder="Nomor Kamar" value={form.nomor_kamar} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <input name="tipe_kamar" placeholder="Tipe Kamar" value={form.tipe_kamar} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <input name="harga_per_bulan" placeholder="Harga" value={form.harga_per_bulan} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <input name="fasilitas" placeholder="Fasilitas" value={form.fasilitas} onChange={handleChange} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <input name="gambar" placeholder="Link Gambar" value={form.gambar || ''} onChange={handleChange} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <button type="submit" style={{ padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', fontWeight: 600 }}>
          Tambah
        </button>
      </form>

      {/* Popup Edit */}
      {showPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: 32, borderRadius: 12, minWidth: 400, boxShadow: '0 2px 16px #aaa', position: 'relative'
          }}>
            <h4 style={{ marginBottom: 16 }}>Edit Kamar</h4>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select name="id_apartemen" value={form.id_apartemen} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }}>
                <option value="">Pilih Apartemen</option>
                {safeApartemen.map(a => (
                  <option key={a.id_apartemen} value={a.id_apartemen}>{a.nama_apartemen}</option>
                ))}
              </select>
              <input name="nomor_kamar" placeholder="Nomor Kamar" value={form.nomor_kamar} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <input name="tipe_kamar" placeholder="Tipe Kamar" value={form.tipe_kamar} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <input name="harga_per_bulan" placeholder="Harga" value={form.harga_per_bulan} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <input name="fasilitas" placeholder="Fasilitas" value={form.fasilitas} onChange={handleChange} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <input name="gambar" placeholder="Link Gambar" value={form.gambar || ''} onChange={handleChange} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <button type="submit" style={{ padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', fontWeight: 600 }}>
                Update
              </button>
              <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 20px', borderRadius: 6, background: '#aaa', color: '#fff', border: 'none', fontWeight: 600 }}>
                Batal
              </button>
            </form>
            <button onClick={handleCancelEdit} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
          </div>
        </div>
      )}

      <ul style={{ padding: 0 }}>
        {safeKamar.map((k, idx) => (
          <li key={k.id_kamar} style={{ listStyle: 'none', background: idx % 2 === 0 ? '#f5f7fa' : '#fff', marginBottom: 6, padding: 10, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <b>{k.nomor_kamar}</b> - {k.tipe_kamar} - <span style={{ color: k.status === 'Tersedia' ? '#1a7f37' : '#a61a1a' }}>{k.status}</span>
            </span>
            <div>
              <button onClick={() => handleEdit(k)} style={{ background: '#f1c40f', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', marginRight: 8 }}>Edit</button>
              <button onClick={() => handleDelete(k.id_kamar)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KamarCrud;
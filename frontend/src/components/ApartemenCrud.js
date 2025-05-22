import React, { useState } from 'react';

const ApartemenCrud = ({ apartemen, fetchApartemen }) => {
  const [form, setForm] = useState({ nama_apartemen: '', alamat: '', jumlah_kamar: '', fasilitas: '' });
  const [editId, setEditId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (editId) {
      // Edit mode
      fetch(`https://be-sewaapart-86067911510.us-central1.run.app/apartements/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form)
      }).then(() => {
        setForm({ nama_apartemen: '', alamat: '', jumlah_kamar: '', fasilitas: '' });
        setEditId(null);
        setShowPopup(false);
        fetchApartemen();
      });
    } else {
      // Add mode
      fetch('https://be-sewaapart-86067911510.us-central1.run.app/apartements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form)
      }).then(() => {
        setForm({ nama_apartemen: '', alamat: '', jumlah_kamar: '', fasilitas: '' });
        fetchApartemen();
      });
    }
  };

  const handleDelete = id => {
    const token = localStorage.getItem('token');
    fetch(`https://be-sewaapart-86067911510.us-central1.run.app/apartements/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(() => fetchApartemen());
  };

  const handleEdit = a => {
    setForm({
      nama_apartemen: a.nama_apartemen,
      alamat: a.alamat,
      jumlah_kamar: a.jumlah_kamar,
      fasilitas: a.fasilitas
    });
    setEditId(a.id_apartemen);
    setShowPopup(true);
  };

  const handleCancelEdit = () => {
    setForm({ nama_apartemen: '', alamat: '', jumlah_kamar: '', fasilitas: '' });
    setEditId(null);
    setShowPopup(false);
  };

  // Pastikan apartemen adalah array agar .map tidak error
  const safeApartemen = Array.isArray(apartemen) ? apartemen : [];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #eee', padding: 32 }}>
      <h3 style={{ color: '#4a90e2', marginBottom: 16 }}>CRUD Apartemen</h3>
      <form onSubmit={handleSubmit} style={{ display: editId ? 'none' : 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input name="nama_apartemen" placeholder="Nama Apartemen" value={form.nama_apartemen} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <input name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} required style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <input name="jumlah_kamar" placeholder="Jumlah Kamar" value={form.jumlah_kamar} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <input name="fasilitas" placeholder="Fasilitas" value={form.fasilitas} onChange={handleChange} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
        <button type="submit" style={{ padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', fontWeight: 600 }}>Tambah</button>
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
            <h4 style={{ marginBottom: 16 }}>Edit Apartemen</h4>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input name="nama_apartemen" placeholder="Nama Apartemen" value={form.nama_apartemen} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <input name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} required style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <input name="jumlah_kamar" placeholder="Jumlah Kamar" value={form.jumlah_kamar} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <input name="fasilitas" placeholder="Fasilitas" value={form.fasilitas} onChange={handleChange} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }} />
              <button type="submit" style={{ padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', fontWeight: 600 }}>Update</button>
              <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 20px', borderRadius: 6, background: '#aaa', color: '#fff', border: 'none', fontWeight: 600 }}>Batal</button>
            </form>
            <button onClick={handleCancelEdit} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
          </div>
        </div>
      )}

      <ul style={{ padding: 0 }}>
        {safeApartemen.map((a, idx) => (
          <li key={a.id_apartemen} style={{ listStyle: 'none', background: idx % 2 === 0 ? '#f5f7fa' : '#fff', marginBottom: 6, padding: 10, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><b>{a.nama_apartemen}</b> - {a.alamat}</span>
            <div>
              <button onClick={() => handleEdit(a)} style={{ background: '#f1c40f', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', marginRight: 8 }}>Edit</button>
              <button onClick={() => handleDelete(a.id_apartemen)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApartemenCrud;
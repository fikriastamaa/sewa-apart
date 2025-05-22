import React, { useState } from 'react';

const RegisterForm = ({ onRegister, onSwitch }) => {
  const [form, setForm] = useState({
    nama_user: '',
    email: '',
    password: '',
    nomor_telepon: '',
    alamat: '',
    role: 'Penyewa'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('https://be-sewaapart-86067911510.us-central1.run.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setForm({ nama_user: '', email: '', password: '', nomor_telepon: '', alamat: '', role: 'Penyewa' });
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    }
    setLoading(false);
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="nama_user" placeholder="Nama Lengkap" value={form.nama_user} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="nomor_telepon" placeholder="Nomor Telepon" value={form.nomor_telepon} onChange={handleChange} required />
        <input name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </form>
      <div className="auth-switch">Sudah punya akun? <span onClick={onSwitch}>Login</span></div>
    </div>
  );
};

export default RegisterForm;

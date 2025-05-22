import Apartemen from "../models/ApartementModel.js";

// Mendapatkan semua data Apartemen
export const getApartemen = async (req, res) => {
    try {
        const response = await Apartemen.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// Menambahkan data Apartemen baru
export const createApartemen = async (req, res) => {
    try {
        await Apartemen.create(req.body);
        res.status(201).json({ message: 'Apartemen berhasil ditambahkan' });
    } catch (error) {
        console.log(error.message);
    }
}

// Mengupdate data Apartemen
export const updateApartemen = async (req, res) => {
    try {
        const { id } = req.params;
        await Apartemen.update(req.body, {
            where: { id_apartemen: id }
        });
        res.status(200).json({ message: 'Apartemen berhasil diupdate' });
    } catch (error) {
        console.log(error.message);
    }
}

// Menghapus data Apartemen
export const deleteApartemen = async (req, res) => {
    try {
        const { id } = req.params;
        await Apartemen.destroy({
            where: { id_apartemen: id }
        });
        res.status(200).json({ message: 'Apartemen berhasil dihapus' });
    } catch (error) {
        console.log(error.message);
    }
}

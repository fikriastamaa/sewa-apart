import express from 'express';
import cors from 'cors';
import UserRoute from './routes/UserRoute.js';
import KamarRoute from './routes/KamarRoute.js';
import SewaKamarRoute from './routes/SewaKamarRoute.js';
import ApartementRoute from './routes/ApartementRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(UserRoute, KamarRoute, SewaKamarRoute, ApartementRoute);

app.listen(5000, () => console.log('Server telah berjalan di port 5000'));
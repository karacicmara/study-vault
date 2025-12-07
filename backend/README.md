# Study Vault Backend API

Backend API za Study Vault platformu - Web3 marketplace za studentske skripte.

## Instalacija

```bash
cd backend
npm install
```

## Konfiguracija

Kopiraj `.env.example` u `.env` i uredi varijable:

```env
PORT=3001
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/study-vault
NODE_ENV=development
```

## Pokretanje

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server će biti dostupan na `http://localhost:3001`

## API Endpoints

### Autentifikacija
- `POST /api/auth/register` - Registracija korisnika
- `POST /api/auth/login` - Prijava korisnika

### Korisnici
- `GET /api/users/me` - Dobij trenutnog korisnika (zahtijeva auth)
- `POST /api/users/wallet/connect` - Poveži novčanik i primi airdrop (zahtijeva auth)
- `POST /api/users/airdrop` - Dodaj SVL tokene (zahtijeva auth)

### Skripte
- `GET /api/scripts` - Dobij sve skripte (query: ?search=term)
- `GET /api/scripts/:id` - Dobij pojedinu skriptu
- `POST /api/scripts` - Kreiraj novu skriptu (zahtijeva auth)
- `POST /api/scripts/:id/purchase` - Kupi skriptu (zahtijeva auth)
- `POST /api/scripts/:id/rate` - Ocijeni skriptu (zahtijeva auth)

### Health Check
- `GET /api/health` - Provjera statusa servera

## Baza podataka

Backend koristi MongoDB. Ako MongoDB nije dostupan, aplikacija će raditi s in-memory storage (za development).

## Struktura

```
backend/
├── config/        # Konfiguracija baze podataka
├── models/        # Mongoose modeli
├── routes/        # API rute
├── middleware/    # Auth middleware
├── uploads/       # Uploadane datoteke
└── server.js      # Glavni server fajl
```


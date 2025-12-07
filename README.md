# Study Vault

Web3 marketplace za studentske skripte - platforma gdje studenti mogu kupovati i prodavati skripte koristeći $SVL$ tokene i Reputacijski Kredit (RC).

## 🚀 Funkcionalnosti

- **Autentifikacija**: Registracija i prijava korisnika
- **Web3 Novčanik**: Povezivanje novčanika i airdrop $SVL$ tokena
- **Marketplace**: Pregled, pretraga i kupovina studentskih skripti
- **Kreator Mode**: Upload i prodaja vlastitih skripti
- **Ocjenjivanje**: Ocjenjivanje skripti i dobivanje Reputacijskog Kredita
- **Token Ekonomija**: $SVL$ tokeni za transakcije i RC za reputaciju

## 📁 Struktura Projekta

```
├── backend/          # Node.js/Express backend API
├── src/             # React frontend
├── package.json     # Frontend dependencies
└── vite.config.js   # Vite konfiguracija
```

## 🛠️ Instalacija i Pokretanje

### Backend

```bash
cd backend
npm install
npm start
```

Backend će biti dostupan na `http://localhost:3001`

### Frontend

```bash
npm install
npm run dev
```

Frontend će biti dostupan na `http://localhost:5173`

## 🔧 Konfiguracija

### Backend Environment Variables

Kreiraj `backend/.env` datoteku:

```env
PORT=3001
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/study-vault
NODE_ENV=development
```

### MongoDB

Backend koristi MongoDB za pohranu podataka. Ako MongoDB nije instaliran, aplikacija će raditi s in-memory storage (za development).

Za instalaciju MongoDB:
- macOS: `brew install mongodb-community`
- Linux: Slijedi [MongoDB instalacijske upute](https://docs.mongodb.com/manual/installation/)
- Windows: Preuzmi s [MongoDB stranice](https://www.mongodb.com/try/download/community)

## 📡 API Endpoints

### Autentifikacija
- `POST /api/auth/register` - Registracija
- `POST /api/auth/login` - Prijava

### Korisnici
- `GET /api/users/me` - Trenutni korisnik
- `POST /api/users/wallet/connect` - Poveži novčanik
- `POST /api/users/airdrop` - Airdrop tokena

### Skripte
- `GET /api/scripts` - Sve skripte
- `GET /api/scripts/:id` - Pojedina skripta
- `POST /api/scripts` - Kreiraj skriptu
- `POST /api/scripts/:id/purchase` - Kupi skriptu
- `POST /api/scripts/:id/rate` - Ocijeni skriptu

## 🎨 Tehnologije

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB / Mongoose
- JWT (autentifikacija)
- bcryptjs (hashiranje lozinki)

## 📝 Napomene

- Backend koristi MongoDB, ali može raditi i bez njega (in-memory storage)
- Sve transakcije su trenutno simulirane (nema stvarnog blockchain integracije)
- File upload funkcionalnost je pripremljena, ali još nije potpuno implementirana

## 🔐 Sigurnost

- Lozinke su hashirane pomoću bcryptjs
- JWT tokeni za autentifikaciju
- CORS zaštita
- Validacija inputa na backendu

## 📄 Licenca

MIT


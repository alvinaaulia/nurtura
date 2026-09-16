# SMART - Stunting Monitoring Alert Response Tools

SMART sekarang menggunakan **single-project architecture**. Frontend, backend API, dan runtime model ML berada dalam satu project Node dan memakai satu `package.json`.

## Struktur

```text
stunting/
├── app.js                 # Express API/server
├── migrate.js
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── src/                   # source frontend
│   ├── index.html
│   ├── scripts/
│   ├── styles/
│   └── public/
├── public/                # asset backend + runtime ML model
│   └── ml-model/
├── ml/                    # notebook/dataset/training workspace
├── dist/                  # hasil build frontend
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── package.json
└── .env.example
```

## Development

Hanya perlu satu instalasi dependency dan satu command dev:

```bash
npm install
npm run dev
```

`npm run dev` menjalankan Express melalui Nodemon dan Webpack Dev Server secara bersamaan. Web app tersedia di `http://localhost:9000`, sementara request `/api`, `/auth`, `/ml`, dan `/public` otomatis diproxy ke Express di port 5000.

Tidak ada lagi `npm run dev:frontend` atau `npm run dev:backend`.

## Production

```bash
npm run build
npm start
```

Setelah build, Express menyajikan `dist/` dan API dari proses Node yang sama. Port default backend adalah 5000 atau mengikuti `PORT` di environment.

## Database

Salin `.env.example` menjadi `.env`, isi konfigurasi PostgreSQL/JWT yang diperlukan, kemudian:

```bash
npm run migrate
```

`app.js` juga mempertahankan mekanisme migration yang sudah ada pada project sebelumnya.

## ML

Model yang dipakai runtime berada di `public/ml-model/`, sehingga tidak ada service Python/ML terpisah yang harus dijalankan. Folder `ml/` menyimpan notebook, dataset, dan artefak training untuk pengembangan model.

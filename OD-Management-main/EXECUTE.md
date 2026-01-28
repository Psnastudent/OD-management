# Running the OD-Management Project

This document explains how to run the three parts of the repository from a Windows PowerShell (`pwsh.exe`) environment:

- API server (backend) — `api/`
- Admin panel (web frontend) — `admin/` (Vite + React)
- User app (Expo React Native) — `user/`

Prerequisites

- Node.js (recommended v18+). Verify with:

```powershell
node -v
npm -v
```
- (Optional) `expo-cli` globally for convenience: `npm i -g expo-cli` (not required because project uses local `expo`).
- Git, and any DB tools you need if you use the Prisma migrations (optional).

Notes about terminals

- All example commands below assume PowerShell. Use absolute paths or `Push-Location` to change directory.
- Long-running dev servers (API, Vite, Metro/Expo) will run interactively; press `Ctrl+C` to stop.

1) API (backend) — `api/`

Description: Express + TypeScript API (Prisma present). By default the dev server listens on port `3000`.

Typical steps:

```powershell
# go to api
Push-Location 'D:\project\OD-Management-main\api'

# install deps
npm install

# (optional) if you changed prisma schema or on first run
npx prisma generate
npx prisma migrate dev --name init

# start dev server (uses tsx and nodemon style watcher)
npm run dev

# or to just run once
npm start

# when finished stop server and return to previous folder
Pop-Location
```

Notes:
- The API uses `.env` (check `api/` for `.env.example` or create your own). Ensure DB connection string and other environment variables (SMTP, CLOUDINARY, JWT secrets, etc.) are set.
- If you see `Server is running at http://localhost:3000` then API is running.

2) Admin panel — `admin/` (Vite + React)

Description: Vite app (TypeScript + Tailwind). Development server runs on port `5173` by default.

```powershell
Push-Location 'D:\project\OD-Management-main\admin'
npm install
npm run dev

# preview build (after `npm run build`):
npm run preview

Pop-Location
```

Notes:
- Default dev URL: `http://localhost:5173/`.
- If `vite` suggests `--host` and you need network access from other devices, run `vite --host` or set host config.

3) User app — `user/` (Expo / React Native)

Description: Expo Router project. Runs Metro bundler and serves the app to device/emulator or web. Web host uses port `8081` by default (Expo metro web server).

```powershell
Push-Location 'D:\project\OD-Management-main\user'
npm install
npm run start

# helper shortcuts while Metro is running:
# a = open Android (if emulator/device configured)
# i = open iOS (macOS only)
# w = open web

Pop-Location
```

Notes:
- Scan the QR code printed by Expo to open the app on a device or use a development build.
- For web testing, open `http://localhost:8081` or follow the link printed by Expo.

Common troubleshooting

- If a port is already in use, stop the process or pick a different port. For Vite: `npm run dev -- --port 5174`.
- If you get dependency vulnerabilities: run `npm audit fix` (review before applying). These are warnings and usually do not block development.
- If the API depends on a DB, ensure your database server is running and `DATABASE_URL` in `.env` is valid. Use Prisma commands to apply migrations: `npx prisma migrate deploy` or `npx prisma migrate dev`.
- If `expo start` fails due to missing global CLI, install with `npm i -g expo-cli` or run with `npx expo start`.

Useful commands summary

```powershell
# API dev
Push-Location 'D:\project\OD-Management-main\api'; npm install; npm run dev

# Admin dev
Push-Location 'D:\project\OD-Management-main\admin'; npm install; npm run dev

# User (Expo)
Push-Location 'D:\project\OD-Management-main\user'; npm install; npm run start
```

If you want, I can also add `.bat` or PowerShell script wrappers to launch all three in parallel from one command.

-- End

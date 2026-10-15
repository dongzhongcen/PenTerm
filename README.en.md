# PenTerm (portable terminal)

[简体中文](./README.md)

Personal portable SSH / SFTP terminal. Private fork of [electerm](https://github.com/electerm/electerm) (**MIT**). Not for public redistribution.

## Attribution & license

- Upstream: [electerm](https://github.com/electerm/electerm), author ZHAO Xudong
- This repo keeps the full [LICENSE](./LICENSE) (MIT) and [NOTICE](./NOTICE)
- v1 stays close to upstream; only light rebranding and Windows portable setup

## MVP

- SSH to remote servers
- SFTP / file transfer
- Multi-tab sessions

## Windows portable (preferred)

Unpack to a USB drive and double-click to run. In portable mode, config lives in a `penterm` folder next to the executable.

### GitHub Actions (recommended)

1. **Actions** → workflow **Windows Portable**
2. **Run workflow**
3. Download artifact `PenTerm-win-x64-portable` from the run

This Linux box cannot fully cross-build Windows packages; use CI.

### Build on Windows

Requires Node.js 24.x, Python, and a native build toolchain.

```bat
npm config set legacy-peer-deps true
npm install -g node-gyp
npm un node-pty serialport
npm i
npm i -S -E node-pty@1.1.0-beta14
npm i -S -E serialport@13.0.0
npm run build-win-portable
```

Output under `dist/` as `PenTerm-*-win-x64-portable.tar.gz`. Extract and run `PenTerm.exe`.

Equivalent steps: `npm run b` → `npm run pb` → `node src/build/bin/build-win-portable.js`.

### USB usage

1. Extract the archive to any folder on the USB drive
2. Run `PenTerm.exe`
3. A sibling `penterm` folder stores config and local data
4. Move the drive to another PC and run from the same folder

### Windows SmartScreen

Unsigned builds may be blocked: More info → Run anyway. Only run builds you produced or from this private repo’s CI.

## SSH key safety

- Private keys are **not** bundled in the portable package by default; the app still uses `~/.ssh` on the host
- **Do not** copy private keys into the on-USB `penterm` data folder unless you accept loss/theft risk
- Prefer keys on the host machine; use an agent when needed
- If you must carry keys: use an encrypted container and rotate keys if lost


## Theme: Qinglan (青岚)

Built-in Qinglan theme: deep teal/navy UI and terminal palette, clean cyan accents.

### Enable

1. Open **Settings → Themes**
2. Select **青岚 Qinglan** and apply
3. (Optional) **Settings → Terminal** → Terminal background → **🌊 青岚 Qinglan**
4. (Optional) Tune **Blur** (about 6–12) and **Opacity** (about 0.35–0.6) for a soft dim/frosted look

The background is a bundled static CSS gradient layer (no video, no third-party images). Theme/background changes apply at runtime; no rebuild needed for selecting them. Rebuild only if you changed source and need a new portable package.

## Connection Center

Click the Connection Center (cluster) icon in the left icon bar:

- Left: group tree – All, Starred, Recent, Frequent, then your bookmark groups with counts.
- Right: bookmark table – star toggle, OS icon, name, host with copy button, info tags, and Connect / Edit / More (duplicate, delete).
- Search box filters by name or host (e.g. `192.0.2.10`).
- Connect behaves exactly like clicking the bookmark in the bookmark list; Recent/Frequent come from connection history, stars are stored locally.

### Qinglan glass effect

With the Qinglan theme, sidebar, tab bar, setting panel and Connection Center become translucent frosted glass over the Qinglan gradient. Toggle "Glass effect for Qinglan theme" in Settings → Common (on by default).

## Develop

```bash
npm i
npm start
```

See `src/build/` and `.github/workflows/win-portable.yml`.

## Version

Started from electerm `5.6.10`. Product name **PenTerm**.

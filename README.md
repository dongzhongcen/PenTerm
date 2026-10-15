# PenTerm（企鹅主题便携终端）

[English](./README.en.md)

个人自用的便携 SSH / SFTP 终端，基于开源项目 [electerm](https://github.com/electerm/electerm)（**MIT**）私有 fork，**不对外发布**。

## 致谢与许可

- 上游：[electerm](https://github.com/electerm/electerm)，作者 ZHAO Xudong
- 本仓库保留完整 [LICENSE](./LICENSE)（MIT）与 [NOTICE](./NOTICE)
- 第一版以 upstream 稳定路径为主，仅做必要改名与 Windows 便携配置

## MVP 功能

- SSH 连接远程服务器
- SFTP / 文件传输
- 多标签会话

## Windows 便携包（优先）

目标：解压到 U 盘后双击即可用；**配置写在程序目录**旁的 `penterm` 文件夹（portable 模式）。

### 用 GitHub Actions 打包（推荐）

1. 打开仓库 **Actions** → 工作流 **Windows Portable**
2. **Run workflow**（手动触发）
3. 跑完后在该次 run 的 **Artifacts** 下载 `PenTerm-win-x64-portable`

本机为 Linux 时无法完整交叉打出 Windows 包，请用上述 CI。

### 在 Windows 本机构建

需要：Node.js 24.x、Python、能编译原生模块的环境。

```bat
npm config set legacy-peer-deps true
npm install -g node-gyp
npm un node-pty serialport
npm i
npm i -S -E node-pty@1.1.0-beta14
npm i -S -E serialport@13.0.0
npm run build-win-portable
```

产物在 `dist/`，形如 `PenTerm-*-win-x64-portable.tar.gz`。解压后运行 `PenTerm.exe`。

也可分步：`npm run b` → `npm run pb` → `node src/build/bin/build-win-portable.js`。

### U 盘用法

1. 将便携包解压到 U 盘任意目录
2. 双击 `PenTerm.exe`
3. 首次运行后，同级目录会出现 `penterm` 文件夹存放配置与本地数据
4. 换电脑插入 U 盘即可继续使用（同一可执行文件目录）

### Windows SmartScreen

未签名的便携包可能被 SmartScreen 拦截：点「更多信息」→「仍要运行」。仅运行自己构建或本私有仓库 CI 产物。

## 密钥安全建议

- **默认不会**把 SSH 私钥打进便携包；程序默认仍读取本机用户目录下的 `~/.ssh`
- **不要**把私钥复制进 U 盘上的 `penterm` 配置目录，除非你明确接受丢失/被借阅的风险
- 建议：密钥留在本机；需要时用系统自带的密钥代理或临时挂载，用完卸下
- 若必须随身携带密钥：使用加密容器，并设置强口令；丢失即轮换密钥

## 开发说明

```bash
npm i
npm start
```

更多构建细节见 `src/build/` 与 `.github/workflows/win-portable.yml`。

## 版本

基于 electerm `5.6.10` 起点；产品名 **PenTerm**。

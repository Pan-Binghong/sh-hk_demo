# SH-HK Demo - 实时语音对话演示项目

一个基于 Web 技术的实时语音对话演示应用，支持语音录制、实时转录和AI对话功能。

## ✨ 新功能：文字对话聊天

现已支持**流式文字聊天功能**：
- 💬 实时文字对话，支持心理咨询场景
- ⚡ 流式AI响应，打字机效果显示
- 🔄 多轮对话，保持上下文记忆
- 📝 聊天记录自动保存和导出
- 🌐 完美解决生产环境混合内容问题（HTTPS访问HTTP API）

Preview: [https://coze.cn/open-platform/realtime/websocket](https://coze.cn/open-platform/realtime/websocket)

## 📋 环境要求

### 系统要求
- **操作系统**: Windows 10+, macOS 10.15+, 或 Linux (Ubuntu 18.04+)
- **浏览器**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+ (需支持 WebRTC 和 Web Audio API)
- **网络**: HTTPS 环境 (本地开发已配置自签名证书)
- **硬件**: 麦克风设备 (用于语音录制功能)

### 软件版本要求

#### Node.js 环境
- **Node.js**: `>= 18.0.0` (推荐 18.17.0 或更高版本)
- **npm**: `>= 9.0.0` (通常随 Node.js 安装)
- **包管理器**: npm (默认) 或 yarn 1.22+

#### Python 环境
- **Python**: `3.11.x` (严格要求，已在 `.python-version` 中指定)
- **uv**: `>= 0.1.0` (推荐使用的Python包管理器)
- **pip**: `>= 23.0` (备用包管理器)

#### 核心依赖版本

**前端依赖:**
```json
{
  "react": "^18.3.1",
  "typescript": "^5.2.2", 
  "vite": "^6.3.5",
  "antd": "^5.21.3",
  "@coze/api": "latest"
}
```

**后端依赖:**
```toml
dependencies = [
  "flask>=3.1.1",
  "flask-cors>=6.0.1", 
  "cryptography>=45.0.5"
]
```

## 🚀 完整安装指南

### 1. 环境准备

#### 安装 Node.js
```bash
# 方式1: 从官网下载安装 (推荐)
# 访问 https://nodejs.org/ 下载 LTS 版本

# 方式2: 使用 nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 方式3: 使用包管理器
# Windows (使用 Chocolatey)
choco install nodejs

# macOS (使用 Homebrew)  
brew install node@18
```

#### 安装 Python 3.11
```bash
# 方式1: 从官网下载安装
# 访问 https://www.python.org/downloads/ 下载 3.11.x 版本

# 方式2: 使用 pyenv (推荐)
# Linux/macOS
curl https://pyenv.run | bash
pyenv install 3.11.0
pyenv local 3.11.0

# Windows (使用 pyenv-win)
git clone https://github.com/pyenv-win/pyenv-win.git %USERPROFILE%\.pyenv
pyenv install 3.11.0
pyenv local 3.11.0

# 方式3: 使用包管理器
# Ubuntu/Debian
sudo apt update && sudo apt install python3.11 python3.11-venv

# CentOS/RHEL
sudo dnf install python3.11

# macOS (使用 Homebrew)
brew install python@3.11
```

#### 安装 uv (Python 包管理器)
```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 使用 pip 安装 (备用方式)
pip install uv
```

### 2. 项目安装

#### 克隆项目
```bash
git clone <repository-url>
cd sh-hk_demo
```

#### 安装前端依赖
```bash
# 运行预安装脚本
npm run run-preinstall

# 安装依赖
npm install
```

#### 安装后端依赖
```bash
# 使用 uv 安装 (推荐)
uv sync

# 或使用 pip 安装
pip install -r requirements.txt

# 或创建虚拟环境后安装 (推荐)
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/macOS  
source venv/bin/activate
pip install -r requirements.txt
```

#### 生成SSL证书 (HTTPS开发环境)
```bash
# 使用项目内置脚本生成
python scripts/generate_ssl_cert.py

# 脚本会自动生成以下文件:
# - localhost.pem (证书文件)
# - localhost-key.pem (私钥文件)
```

### 3. 启动服务

#### 启动前端开发服务器
```bash
npm run start
```
- 服务地址: `https://localhost:5173`
- 自动打开浏览器并加载项目

#### 启动后端服务器
```bash
# 方式1: 使用启动脚本 (推荐)
cd backend
python run.py

# 方式2: 直接运行服务器文件
cd backend
python server.py

# 方式3: 使用 flask 命令
cd backend
export FLASK_APP=server.py  # Linux/macOS
set FLASK_APP=server.py     # Windows
flask run --host=0.0.0.0 --port=5000
```
- 服务地址: `http://localhost:5000`
- 日志文件: `backend/chat_log.jsonl`

## 🔧 开发环境配置

### VS Code 推荐插件
```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance", 
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 环境变量配置
创建 `.env` 文件 (如需要):
```bash
# API 配置
VITE_API_BASE_URL=https://localhost:5000
VITE_PUBLIC_URL=/

# 开发模式
NODE_ENV=development
FLASK_ENV=development
```

### 浏览器设置
由于使用自签名证书，首次访问时需要:
1. 访问 `https://localhost:5173`
2. 点击"高级"或"继续访问"
3. 允许麦克风权限 (首次使用语音功能时)

## 🛠️ 常见问题解决

### Node.js 版本问题
```bash
# 检查当前版本
node --version
npm --version

# 如果版本过低，请更新到 18+ 版本
```

### Python 版本问题
```bash
# 检查当前版本
python --version
python3 --version

# 确保是 3.11.x 版本
```

### SSL 证书问题
```bash
# 重新生成证书
rm localhost.pem localhost-key.pem
python scripts/generate_ssl_cert.py
```

### 依赖安装问题
```bash
# 清理缓存后重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Python 依赖问题
uv cache clean  # 或 pip cache purge
uv sync --reinstall
```

### 端口占用问题
```bash
# 查看端口占用 (5173/5000)
netstat -tulpn | grep :5173
lsof -i :5173  # macOS/Linux

# 终止占用进程
kill -9 <PID>
```

## ⚡ 快速开始

如果你的环境已经满足要求 (Node.js 18+, Python 3.11+)，可以直接运行：

### 前端启动
```bash
npm run run-preinstall
npm install
npm run start
```

### 后端启动 (新终端窗口)
```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 生成 SSL 证书
python scripts/generate_ssl_cert.py  

# 启动后端服务
cd backend
python run.py
```

### 访问应用
- 前端: `https://localhost:5173` 
- 后端: `http://localhost:5000`

> ⚠️ **首次使用**: 请参考上方的完整安装指南进行环境配置

## 🎯 API调用说明

本应用支持两种与AI模型对话的方式，每种方式都有对应的API调用实现。

### 📢 方式一：麦克风录音 + 语音转录 + 文字输入到大模型

这种方式通过麦克风收录用户语音，实时转录为文字，然后自动发送给大模型进行对话。

#### 1. 麦克风录音API

**开始录音**
```typescript
// 文件位置: src/pages/chat/index.tsx:377
await clientRef.current.startRecord();
```

**停止录音**
```typescript
// 文件位置: src/pages/chat/index.tsx:422
clientRef.current.stopRecord();
```

#### 2. 语音转录监听

**监听转录事件**
```typescript
// 文件位置: src/pages/chat/index.tsx:207-213
clientRef.current?.on(
  WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE,
  (_, data) => {
    const event = data as ConversationAudioTranscriptUpdateEvent;
    if (event.data.content) {
      setTranscript(event.data.content);  // 实时显示转录结果
    }
  },
);
```

#### 3. 工作流程
1. 用户按住"按住说话"按钮 → 触发 `startPressRecord()`
2. 开始麦克风录音 → 调用 `clientRef.current.startRecord()`
3. 实时语音转录 → 监听 `CONVERSATION_AUDIO_TRANSCRIPT_UPDATE` 事件
4. 转录结果实时显示在界面上
5. 用户松开按钮 → 触发 `finishPressRecord()` → 调用 `clientRef.current.stopRecord()`
6. 转录后的文字自动发送给大模型

### 💬 方式二：直接发送文本调用

这种方式允许用户直接输入文字消息发送给大模型。

#### 1. 发送文本消息API

**核心发送函数**
```typescript
// 文件位置: src/pages/chat/send-message.tsx:21-24
const handleSendText = (text: string) => {
  clientRef.current?.sendTextMessage(text);  // 关键API调用
  onSendText(text);
};
```

#### 2. 工作流程
1. 用户点击"发送文本"按钮 → 触发 `showModal()`
2. 弹出文本输入框
3. 用户输入文字内容
4. 点击确定按钮 → 触发 `handleOk()` → 调用 `handleSendText()`
5. 直接发送文字给大模型 → 调用 `clientRef.current?.sendTextMessage(text)`

### 🔧 其他重要API调用

#### 音频设备管理
```typescript
// 设置音频输入设备
// 文件位置: src/pages/chat/index.tsx:270-276
await clientRef.current?.setAudioInputDevice(deviceId);
```

#### 音量控制
```typescript
// 设置播放音量 (0-1之间的值)
// 文件位置: src/pages/chat/index.tsx:290
clientRef.current.setPlaybackVolume(value / 100);
```

#### 连接管理
```typescript
// 建立WebSocket连接
// 文件位置: src/pages/chat/index.tsx:250
await clientRef.current?.connect({ chatUpdate });

// 断开连接
clientRef.current.disconnect();
```

#### 错误处理
```typescript
// 监听服务器错误
// 文件位置: src/pages/chat/index.tsx:227-237
clientRef.current?.on(
  WsChatEventNames.SERVER_ERROR,
  (_: string, event: unknown) => {
    console.log('[chat] error', event);
    message.error(`发生错误：${(event as CommonErrorEvent)?.data?.msg}`);
  },
);
```

### 📁 文件结构说明

| 文件 | 功能 | 主要API |
|------|------|---------|
| `src/pages/chat/index.tsx` | 主聊天页面，处理录音和转录 | `startRecord()`, `stopRecord()`, 事件监听 |
| `src/pages/chat/send-message.tsx` | 文本消息发送组件 | `sendTextMessage()` |
| `src/pages/chat/receive-message.tsx` | 消息接收显示组件 | 消息渲染和处理 |
| `src/pages/chat/operation.tsx` | 操作控制组件 | 连接控制相关 |

### 🎛️ 关键API调用总结

| 功能类别 | API调用 | 文件位置 | 说明 |
|----------|---------|----------|------|
| **录音控制** | `startRecord()` | `index.tsx:377` | 开始麦克风录音 |
| **录音控制** | `stopRecord()` | `index.tsx:422` | 停止麦克风录音 |
| **文本发送** | `sendTextMessage(text)` | `send-message.tsx:21` | 发送文本消息给AI |
| **事件监听** | `CONVERSATION_AUDIO_TRANSCRIPT_UPDATE` | `index.tsx:207` | 监听语音转录结果 |
| **连接管理** | `connect(config)` | `index.tsx:250` | 建立WebSocket连接 |
| **连接管理** | `disconnect()` | 多处调用 | 断开WebSocket连接 |
| **设备控制** | `setAudioInputDevice(deviceId)` | `index.tsx:270` | 设置音频输入设备 |
| **音量控制** | `setPlaybackVolume(volume)` | `index.tsx:290` | 设置播放音量 |

### 💡 使用建议

1. **语音对话模式**：适合需要自然对话体验的场景，支持实时语音转录
2. **文本输入模式**：适合需要精确输入的场景，可以编辑和修改消息内容
3. **错误处理**：建议在所有API调用外包装try-catch进行错误处理
4. **状态管理**：注意管理连接状态、录音状态等，确保UI与实际状态同步

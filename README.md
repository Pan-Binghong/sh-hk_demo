# Quick Start

Preview: [https://coze.cn/open-platform/realtime/websocket](https://coze.cn/open-platform/realtime/websocket)

## Prerequisites
1. Ensure you have Node.js (v18+) installed

## Running the Demo

```bash
npm run run-preinstall
npm install
npm run start
```

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

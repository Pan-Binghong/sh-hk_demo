# 日志持久化说明

## 问题
之前聊天日志存储在Docker容器内部，每次容器重启时会丢失所有日志数据。

## 解决方案
现在使用Docker Volume挂载将日志数据持久化到宿主机：

### 目录结构
```
logs/
├── README.md          # 本说明文件
├── .gitkeep           # 确保目录被git跟踪
├── chat_log.jsonl     # demo.10kv.co 的聊天日志
└── chat_log_hk.jsonl  # demohk.10kv.co 的聊天日志
```

### 技术实现
1. **Docker Compose配置**：`./logs:/app/logs:rw` 挂载
2. **后端代码修改**：日志文件保存到 `/app/logs/` 目录
3. **Git配置**：忽略 `*.jsonl` 文件，保留目录结构

### 重新部署
```bash
# 停止当前容器
docker-compose down

# 重新构建并启动
docker-compose up --build -d
```

### 验证
- 日志文件位置：`./logs/chat_log*.jsonl`
- 容器重启后日志不会丢失
- 可以直接从宿主机访问和备份日志文件

### 备份建议
定期备份 `logs/` 目录到云存储或其他位置。 
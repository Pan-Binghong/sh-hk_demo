# 🚀 SH-HK Demo 生产环境部署指南

## 📋 问题解决方案

本配置解决了 **HTTPS 前端访问 HTTP API 的混合内容问题**，通过 Nginx 反向代理实现。

## 🏗️ 配置结构

```
sh-hk_demo/
├── dist/                           # 构建后的前端文件
├── nginx_conf/default.conf         # Nginx 配置文件
├── docker-compose.yml              # Docker 编排文件
├── backend/                        # 后端代码
├── ssl/                            # SSL 证书目录
└── build.sh                        # 构建脚本
```

## 🔧 核心解决方案

### AI API 代理配置

在 Nginx 中添加了 `/api/ai/` 路径代理到您的 AI 模型服务器：

```nginx
location /api/ai/ {
    proxy_pass http://221.181.122.58:23006/v1/chat/;
    
    # 支持流式响应
    proxy_buffering off;
    proxy_cache off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    
    # CORS 处理
    add_header Access-Control-Allow-Origin $http_origin always;
    # ... 其他配置
}
```

### 前端 API 调用

前端代码会根据环境自动选择：
- **开发环境**: 直接访问 `http://221.181.122.58:23006/v1/chat/completions`
- **生产环境**: 通过代理访问 `/api/ai/completions`

## 📦 部署步骤

### 1. 构建前端项目

```bash
# 在开发环境执行
./build.sh

# 或者手动执行
npm install
npm run build
```

### 2. 上传文件到服务器

将以下文件上传到您的阿里云 ECS 服务器：

```
├── dist/                     # 构建后的前端文件
├── nginx_conf/default.conf   # 更新的 Nginx 配置
├── docker-compose.yml        # Docker 编排文件
├── backend/                  # 后端代码
└── ssl/                      # SSL 证书目录
```

### 3. 部署到生产环境

```bash
# 在服务器上执行
cd /path/to/your/project

# 停止现有服务
docker-compose down

# 重新构建并启动服务
docker-compose up -d --build

# 检查服务状态
docker-compose ps
docker-compose logs nginx
```

### 4. 验证部署

- 访问 `https://demo.10kv.co/#/text-chat`
- 访问 `https://demohk.10kv.co/#/text-chat`
- 测试文字聊天功能是否正常

## 🔍 测试混合内容问题解决

### 问题症状
```
Mixed Content: The page at 'https://demo.10kv.co' was loaded over HTTPS, 
but requested an insecure resource 'http://221.181.122.58:23006/...'. 
This request has been blocked.
```

### 解决验证
1. 打开浏览器开发者工具
2. 访问文字聊天页面
3. 发送消息，观察 Network 面板
4. 应该看到请求路径为 `/api/ai/completions`（而不是原始的HTTP地址）
5. 响应应该是流式的，可以看到打字机效果

## 🛠️ 故障排除

### 1. 代理不工作
```bash
# 检查 Nginx 配置语法
docker exec demo nginx -t

# 重新加载 Nginx 配置
docker exec demo nginx -s reload

# 查看 Nginx 错误日志
docker-compose logs nginx
```

### 2. AI API 无法访问
```bash
# 测试服务器能否访问 AI API
curl -X POST http://221.181.122.58:23006/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"10kv-v1-14b","messages":[{"role":"user","content":"测试"}]}'
```

### 3. 流式响应问题
检查 Nginx 配置中的关键设置：
- `proxy_buffering off;`
- `proxy_cache off;`
- `proxy_http_version 1.1;`

## 📝 注意事项

1. **SSL 证书**: 确保 SSL 证书路径正确且有效
2. **域名解析**: 确保域名正确解析到服务器 IP
3. **防火墙**: 确保 80 和 443 端口开放
4. **AI API 访问**: 确保服务器能够访问 `221.181.122.58:23006`

## 🔄 后续维护

- 定期更新 SSL 证书
- 监控 AI API 服务状态
- 备份聊天记录数据
- 更新前端代码时重新构建和部署

## 🆘 技术支持

如果遇到问题，请检查：
1. Docker 服务状态
2. Nginx 配置语法
3. 网络连接状况
4. SSL 证书有效性 
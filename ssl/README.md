# SSL 证书目录

## 📁 目录结构

将您的 SSL 证书文件放置在此目录中，按照域名组织：

```
ssl/
├── demo.10kv.co/
│   ├── fullchain.pem     # 完整证书链
│   └── privkey.pem       # 私钥文件
└── demohk.10kv.co/
    ├── fullchain.pem     # 完整证书链
    └── privkey.pem       # 私钥文件
```

## 🔒 证书要求

- **证书格式**: PEM 格式
- **权限设置**: 确保私钥文件权限为 600
- **证书链**: 使用完整的证书链（fullchain.pem）

## 🛠️ 证书获取

### 使用 Let's Encrypt (推荐)

```bash
# 使用 certbot 获取免费 SSL 证书
certbot certonly --webroot \
  -w /var/www/html \
  -d demo.10kv.co \
  -d demohk.10kv.co
```

### 使用阿里云 SSL 证书

1. 在阿里云控制台申请 SSL 证书
2. 下载 Nginx 格式的证书文件
3. 将文件重命名并放置到对应目录

## 📝 注意事项

- 请勿将私钥文件提交到版本控制系统
- 定期检查证书过期时间
- 建议设置自动续期 
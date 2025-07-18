#!/usr/bin/env python3
"""
后端服务启动脚本
"""

import os
import sys
from server import app

if __name__ == "__main__":
    # 设置开发环境
    os.environ.setdefault('FLASK_ENV', 'development')
    os.environ.setdefault('FLASK_DEBUG', '1')
    
    print("🚀 启动 SH-HK Demo 后端服务...")
    print("📍 服务地址: http://localhost:5000")
    print("🔧 运行模式: 开发模式")
    print("📝 日志文件: chat_log.jsonl")
    print("⏹️  停止服务: Ctrl+C")
    print("-" * 50)
    
    try:
        # 启动 Flask 开发服务器
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True,
            use_reloader=True
        )
    except KeyboardInterrupt:
        print("\n✅ 服务已停止")
        sys.exit(0)
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1) 
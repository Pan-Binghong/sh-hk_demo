from flask import Flask, request, send_file, jsonify, Response
import json
import time
import os
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)
LOG_FILE = 'chat_log.jsonl'

@app.route('/api/chat-log', methods=['POST'])
def save_chat_log():
    data = request.json
    # 增加时间戳
    data['timestamp'] = int(time.time())
    # 追加写入
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(json.dumps(data, ensure_ascii=False) + '\n')
    return jsonify({'status': 'ok'})

@app.route('/api/chat-log/download', methods=['GET'])
def download_chat_log():
    if not os.path.exists(LOG_FILE):
        return jsonify({'error': 'No log file found'}), 404
    # 生成日期前缀，格式2025071000（年月日小时）
    now = datetime.datetime.now()
    date_prefix = f"{now.year}{now.month:02d}{now.day:02d}{now.hour:02d}"
    download_name = f"{date_prefix}_chat.jsonl"
    return send_file(LOG_FILE, as_attachment=True, download_name=download_name)

@app.route('/api/chat-log/view', methods=['GET'])
def view_chat_log():
    if not os.path.exists(LOG_FILE):
        return jsonify({'error': 'No log file found'}), 404
    with open(LOG_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        records = [json.loads(line) for line in lines if line.strip()]
    # 关键：ensure_ascii=False
    return Response(
        json.dumps(records, ensure_ascii=False, indent=2),
        content_type='application/json; charset=utf-8'
    )

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=81,
        debug=True,
        # ssl_context=('../localhost.pem', '../localhost-key.pem') # 生产环境需要注释, Nginx反向代理到flask的81端口
    )
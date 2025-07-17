from flask import Flask, request, send_file, jsonify, Response
import json
import time
import os
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

def get_log_file():
    # 根据域名区分日志文件
    host = request.host.split(':')[0]
    if 'demohk' in host:
        return 'chat_log_hk.jsonl'
    else:
        return 'chat_log.jsonl'

@app.route('/api/chat-log', methods=['POST'])
def save_chat_log():
    data = request.json
    data['timestamp'] = int(time.time())
    log_file = get_log_file()
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(json.dumps(data, ensure_ascii=False) + '\n')
    return jsonify({'status': 'ok'})

@app.route('/api/chat-log/download', methods=['GET'])
def download_chat_log():
    log_file = get_log_file()
    if not os.path.exists(log_file):
        return jsonify({'error': 'No log file found'}), 404
    now = datetime.datetime.now()
    date_prefix = f"{now.year}{now.month:02d}{now.day:02d}{now.hour:02d}"
    download_name = f"{date_prefix}_chat.jsonl"
    return send_file(log_file, as_attachment=True, download_name=download_name)

@app.route('/api/chat-log/view', methods=['GET'])
def view_chat_log():
    log_file = get_log_file()
    if not os.path.exists(log_file):
        return jsonify({'error': 'No log file found'}), 404
    with open(log_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        records = [json.loads(line) for line in lines if line.strip()]
    return Response(
        json.dumps(records, ensure_ascii=False, indent=2),
        content_type='application/json; charset=utf-8'
    )

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=81,
        debug=True,
        ssl_context=('../localhost.pem', '../localhost-key.pem')
    )
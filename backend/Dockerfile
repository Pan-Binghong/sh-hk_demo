FROM python:3.10-slim

WORKDIR /app

COPY server.py /app/

RUN mkdir -p /app/logs
VOLUME /app/logs

# 升级pip并用国内源安装依赖
RUN pip install --upgrade pip
RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ flask flask-cors

EXPOSE 81

CMD ["sh", "-c", "touch /app/logs/chat_log.jsonl && python server.py"]
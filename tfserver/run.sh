uvicorn main:app \
  --host 0.0.0.0 \
  --port 8500 \
  --ssl-keyfile="/home/jupyter/ssl/example.key" \
  --ssl-certfile="/home/jupyter/ssl/example.crt" \
  --reload

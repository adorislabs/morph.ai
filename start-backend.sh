#!/bin/bash
pkill -f uvicorn 2>/dev/null
sleep 1
cd /Users/dhruv/Downloads/projects/morph-trae/morph/backend
source venv/bin/activate
nohup uvicorn main:app --port 8000 > /tmp/morph-backend.log 2>&1 &
echo "Backend PID: $!"
sleep 3
tail -3 /tmp/morph-backend.log

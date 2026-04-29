#!/bin/bash
cd /Users/dhruv/Downloads/projects/morph-trae/morph/frontend
npm run dev -- --port 5173 > /tmp/morph-frontend.log 2>&1 &
echo "Frontend PID: $!"
sleep 5
tail -5 /tmp/morph-frontend.log

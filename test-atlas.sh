#!/bin/bash

echo "🔄 MongoDB Atlas Connection Tester"
echo "=================================="
echo ""
echo "Testing connection every 30 seconds..."
echo "Press Ctrl+C to stop"
echo ""

attempt=1
max_attempts=10

while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt of $max_attempts ($(date +%H:%M:%S))"
    
    if timeout 15 node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb+srv://ronmarcheuy_db_user:O9S3dPzhWGfizYLg@cluster0.yi6shja.mongodb.net/cict_pageant?retryWrites=true&w=majority&appName=Cluster0', {serverSelectionTimeoutMS: 12000}).then(() => { console.log('✅ SUCCESS! MongoDB Atlas is connected!'); process.exit(0); }).catch(() => process.exit(1));" 2>/dev/null; then
        echo ""
        echo "✅ Connection successful! You can now:"
        echo "   1. Run: node seed.js"
        echo "   2. Check MongoDB Atlas to see your data"
        echo ""
        exit 0
    else
        echo "❌ Not ready yet. Waiting 30 seconds..."
        echo ""
        sleep 30
    fi
    
    attempt=$((attempt + 1))
done

echo "⚠️  Still not connected after $max_attempts attempts."
echo "Please check:"
echo "  1. MongoDB Atlas Network Access shows 0.0.0.0/0 as 'Active' (green)"
echo "  2. Wait a few more minutes and try again"

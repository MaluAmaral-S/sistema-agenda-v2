#!/bin/bash

# Script para iniciar frontend e backend simultaneamente
# Uso: ./start-dev.sh

echo "🚀 Iniciando AgendaPro em modo desenvolvimento..."
echo "================================================"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "❌ Dependências do backend não encontradas. Execute ./install-deps.sh primeiro."
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dependências do frontend não encontradas. Execute ./install-deps.sh primeiro."
    exit 1
fi

# Verificar se o PostgreSQL está rodando
if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL não está rodando. Tentando iniciar..."
    sudo systemctl start postgresql
    sleep 2
    
    if ! pgrep -x "postgres" > /dev/null; then
        echo "❌ Não foi possível iniciar o PostgreSQL. Verifique a instalação."
        exit 1
    fi
fi

echo "✅ PostgreSQL está rodando"

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C para limpar processos
trap cleanup SIGINT

echo ""
echo "🔧 Iniciando backend na porta 3000..."
npm run dev &
BACKEND_PID=$!

# Aguardar o backend iniciar
sleep 3

echo "🎨 Iniciando frontend na porta 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 AgendaPro iniciado com sucesso!"
echo "================================================"
echo "📍 URLs de acesso:"
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📋 Painel Admin: http://localhost:5173/painel"
echo "🔗 Agendamento:  http://localhost:5173/agendamento/sua-empresa"
echo ""
echo "💡 Pressione Ctrl+C para parar os serviços"
echo "================================================"

# Aguardar indefinidamente
wait


#!/bin/bash
# Script de Migração para MakeupManager V2
# Executa a migração completa do repositório

set -e

echo "🚀 Iniciando migração para MakeupManager V2..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Verificar se git está limpo
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Há alterações não commitadas. Commit primeiro:"
    git status --short
    exit 1
fi

# Solicitar URL do novo repositório
echo "📝 Digite a URL do novo repositório V2:"
read -p "URL (ex: https://github.com/Josewesley2020/MakeupManager-V2.git): " V2_URL

if [ -z "$V2_URL" ]; then
    echo "❌ URL não pode estar vazia"
    exit 1
fi

echo "✅ Usando URL: $V2_URL"

# Backup de segurança
echo "📦 Criando backup..."
cd ..
BACKUP_DIR="MakeupManager_v2_backup_$(date +%Y%m%d_%H%M%S)"
cp -r MakeupManager_v2 "$BACKUP_DIR"
echo "✅ Backup criado: $BACKUP_DIR"

cd MakeupManager_v2

# Garantir que estamos na branch developer atualizada
echo "🔄 Atualizando branch developer..."
git checkout developer
git pull origin developer

# Adicionar remote V2
echo "🔗 Configurando remote V2..."
git remote add v2 "$V2_URL" 2>/dev/null || git remote set-url v2 "$V2_URL"

# Push para V2
echo "📤 Enviando código para V2..."
git push v2 developer:main
git push v2 master:master

# Criar tag de estabilidade V1
echo "🏷️  Criando tag de versão estável..."
git checkout master
git tag v1.0.0 -m "Stable V1 release - Migrated to V2" 2>/dev/null || echo "Tag já existe"
git push origin v1.0.0 2>/dev/null || echo "Tag já existe no remoto"

# Criar README de migração
echo "📄 Criando README de migração..."
cat > README_MIGRATION.md << EOF
# MakeupManager V1 (STABLE) 🔒

Este repositório contém a versão estável V1 do MakeupManager.

**🚀 Versão ativa:** [MakeupManager V2]($V2_URL)

## Status
- ✅ **Produção estável**: Sistema em funcionamento
- ❌ **Desenvolvimento pausado**: Novas features no V2
- 🔒 **Manutenção**: Apenas correções críticas de segurança

## Migração Concluída
- Data: $(date +"%Y-%m-%d %H:%M:%S")
- Último commit V1: $(git log -1 --format="%h - %s")
- Total de commits: $(git rev-list --count HEAD)

## Para Desenvolvedores
Para novas funcionalidades e desenvolvimento ativo, utilize o repositório V2:
$V2_URL

## Informações Técnicas V1
- React 18 + TypeScript
- Supabase Backend
- GitHub Pages Deploy
- WhatsApp Integration

---
*Gerado automaticamente pelo script de migração*
EOF

git add README_MIGRATION.md
git commit -m "docs: Add migration documentation - V2 is now active"
git push origin master

# Voltar para developer
git checkout developer

echo ""
echo "✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!"
echo ""
echo "📋 Próximos passos:"
echo "1. Clone o repositório V2:"
echo "   git clone $V2_URL"
echo ""
echo "2. Configure o novo repositório:"
echo "   cd MakeupManager-V2"
echo "   npm install"
echo "   npm run build"
echo ""
echo "3. Configure GitHub Pages no repositório V2"
echo "4. Atualize secrets/environment variables no V2"
echo "5. Configure CI/CD workflows no V2"
echo ""
echo "💾 Backup disponível em: ../$BACKUP_DIR"
echo "🔗 Repositório V1 (atual): $(git remote get-url origin)"
echo "🚀 Repositório V2 (novo): $V2_URL"
echo ""
echo "🎉 Repositório V1 marcado como estável!"
echo "🎯 Continue o desenvolvimento no repositório V2!"
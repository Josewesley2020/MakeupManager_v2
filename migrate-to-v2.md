# Migração para MakeupManager V2

## 🎯 Objetivo
Migrar o projeto atual para um novo repositório (V2) mantendo este como estável.

## 📋 Passos para Migração

### 1. Criar Novo Repositório no GitHub
1. Acesse: https://github.com/new
2. Nome sugerido: `MakeupManager-V2` ou `MakeupManager_V2`
3. Descrição: "MakeupManager V2 - Professional makeup artist management system"
4. Marque como **Private** (se necessário)
5. **NÃO** inicialize com README, .gitignore ou license

### 2. Preparar Código Local
```bash
# No diretório atual (MakeupManager_v2)
git checkout developer
git pull origin developer

# Criar backup local (opcional)
cd ..
cp -r MakeupManager_v2 MakeupManager_v2_backup
```

### 3. Migração - Método 1: Clone Direto
```bash
# No diretório pai
git clone --bare https://github.com/Josewesley2020/MakeupManager.git MakeupManager-temp

cd MakeupManager-temp
git push --mirror https://github.com/Josewesley2020/MakeupManager-V2.git

cd ..
rm -rf MakeupManager-temp

# Clone o novo repositório
git clone https://github.com/Josewesley2020/MakeupManager-V2.git
cd MakeupManager-V2
```

### 4. Migração - Método 2: Novo Remote
```bash
# No diretório atual
git remote add v2 https://github.com/Josewesley2020/MakeupManager-V2.git
git push v2 developer:main
git push v2 master:master

# Criar novo diretório para V2
cd ..
git clone https://github.com/Josewesley2020/MakeupManager-V2.git
```

### 5. Configurar V2
```bash
cd MakeupManager-V2

# Atualizar package.json se necessário
# Atualizar README.md
# Verificar se build funciona
npm install
npm run build

# Primeiro commit no V2 (se necessário)
git add .
git commit -m "chore: Initialize MakeupManager V2"
git push origin main
```

### 6. Finalizar V1 (Repositório Atual)
```bash
# No repositório atual (MakeupManager_v2)
git checkout master
git tag v1.0.0 -m "Stable V1 release"
git push origin v1.0.0

# Criar README indicando migração
echo "# MakeupManager V1 (STABLE)

Este repositório contém a versão estável V1 do MakeupManager.

**🚀 Versão ativa:** [MakeupManager-V2](https://github.com/Josewesley2020/MakeupManager-V2)

## Status
- ✅ Produção estável
- ❌ Desenvolvimento pausado
- 🔒 Apenas correções críticas

Para novas funcionalidades, usar o repositório V2." > README_V1.md

git add README_V1.md
git commit -m "docs: Mark as stable V1, point to V2"
git push origin master
```

## 🎯 Resultado Final

- **V1 (atual)**: Mantido como estável, apenas correções críticas
- **V2 (novo)**: Desenvolvimento ativo, novas funcionalidades
- **Separação clara**: Cada versão em seu repositório
- **Histórico preservado**: Commits mantidos na migração

## ⚠️ Importante

1. **Backup**: Sempre fazer backup antes da migração
2. **CI/CD**: Reconfigurar pipelines no repositório V2
3. **Environment Variables**: Copiar secrets para novo repositório
4. **GitHub Pages**: Configurar deploy no repositório V2
5. **Colaboradores**: Adicionar permissões no repositório V2

## 🔧 URLs Importantes

- **V1 (atual)**: https://github.com/Josewesley2020/MakeupManager
- **V2 (novo)**: https://github.com/Josewesley2020/MakeupManager-V2
- **Deploy V1**: https://avanade-josewesley.github.io/MakeupManager/
- **Deploy V2**: https://avanade-josewesley.github.io/MakeupManager-V2/
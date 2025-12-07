# Sistema de Versionamento - MakeupManager v2

## 📦 Visão Geral

O MakeupManager usa **Semantic Versioning** (versionamento semântico) para identificar facilmente qual versão está em produção.

**Formato:** `MAJOR.MINOR.PATCH` (exemplo: `1.2.3`)

- **MAJOR** (1.x.x) - Mudanças grandes que quebram compatibilidade
- **MINOR** (x.1.x) - Novas funcionalidades (sem quebrar nada)
- **PATCH** (x.x.1) - Correções de bugs

---

## 🎯 Versão Atual

**v1.0.0** - Lançamento Inicial (06/12/2024)

### Recursos:
- ✅ PWA instalável (Progressive Web App)
- ✅ Modo offline com sincronização automática
- ✅ Dashboard otimizado (4-5x mais rápido)
- ✅ Notificações automáticas de agendamentos
- ✅ Sistema de versionamento visível
- ✅ Detecção inteligente de navegadores (Chrome, Edge, Opera, Firefox, Safari, Samsung)

---

## 📍 Onde a Versão Aparece

### 1. **Dashboard Header**
```
┌──────────────────────────────────────────┐
│ 💄 Dashboard     [v1.0.0 ⓘ]   📲    🚪  │
│ Bem-vinda, jose!                         │
└──────────────────────────────────────────┘
```

**Ao clicar em "v1.0.0 ⓘ":**
```
┌─────────────────────────┐
│ 💄 MakeupManager  v1.0.0│
├─────────────────────────┤
│ Versão: 1.0.0           │
│ Lançamento: 06/12/2024  │
│ Ambiente: production    │
├─────────────────────────┤
│ ✨ Novidades v1.0.0:    │
│ • PWA instalável        │
│ • Modo offline          │
│ • Dashboard 4x rápido   │
│ • Notificações auto     │
├─────────────────────────┤
│ [ Fechar ]              │
└─────────────────────────┘
```

### 2. **Arquivo `package.json`**
```json
{
  "name": "makeup-manager",
  "version": "1.0.0"
}
```

### **3. Componente `Version.tsx`**
```tsx
const version = '1.0.0'
const releaseDate = '06/12/2024'

// Ambiente detectado automaticamente:
// - localhost/127.0.0.1 → development (amarelo)
// - *.github.io → production (verde)
// - outros → staging (azul)
const environment = getEnvironment()
```

---

## 🔧 Como Atualizar a Versão

### **Passo 1: Decidir o Tipo de Versão**

| Tipo de Mudança | Exemplo | Versão Anterior | Versão Nova |
|-----------------|---------|-----------------|-------------|
| 🐛 **Bug Fix** | Corrigir erro no cálculo de preço | 1.0.0 | **1.0.1** |
| ✨ **Feature** | Adicionar tema escuro | 1.0.0 | **1.1.0** |
| 💥 **Breaking** | Mudar estrutura do banco de dados | 1.0.0 | **2.0.0** |

### **Passo 2: Atualizar `package.json`**

```json
{
  "version": "1.1.0"  // ← Alterar aqui
}
```

### **Passo 3: Atualizar `src/components/Version.tsx`**

```tsx
export default function Version() {
  const version = '1.1.0'  // ← Alterar aqui
  const releaseDate = '15/12/2024'  // ← Alterar aqui
  // Ambiente é detectado automaticamente (não precisa alterar)
  
  // ...
  
  // Adicionar novidades no changelog (linha ~60):
  <strong className="text-gray-800 block mb-2">✨ Novidades v1.1.0:</strong>
  <span className="space-y-1 block">
    <span className="flex items-start gap-2">
      <span className="text-pink-500 flex-shrink-0">•</span>
      <span>Tema escuro</span>
    </span>
    <span className="flex items-start gap-2">
      <span className="text-pink-500 flex-shrink-0">•</span>
      <span>Exportar relatórios em PDF</span>
    </span>
    <span className="flex items-start gap-2">
      <span className="text-pink-500 flex-shrink-0">•</span>
      <span>Backup automático na nuvem</span>
    </span>
  </span>
}
```

### **Passo 4: Atualizar este documento (VERSIONING.md)**

Adicionar nova versão no histórico (seção abaixo).

### **Passo 5: Commit e Deploy**

```bash
git add .
git commit -m "chore: bump version to v1.1.0"
git push origin developer

# Merge para master (deploy automático via GitHub Actions)
git checkout master
git merge developer
git push origin master
```

---

## 📋 Histórico de Versões

### **v1.0.0** - 06/12/2024 (Lançamento Inicial) 🚀

**Novas Funcionalidades:**
- PWA instalável com modo offline completo
- Dashboard com métricas otimizadas via RPC function (4-5x mais rápido)
- Sistema de versionamento visível para usuários
- Detecção inteligente de navegadores (Chrome, Edge, Opera, Firefox, Safari iOS, Samsung Internet)
- Modal estilizado para instruções de instalação PWA
- WhatsApp integration para envio de orçamentos
- Gestão completa de clientes, serviços e agendamentos
- Sistema de preços regionais com taxas de deslocamento
- Calendário mensal com visualização de agendamentos
- Dashboard financeiro com análise de receitas

**Melhorias de UX:**
- Redução de 30s → 10s no delay do prompt de instalação
- Card promocional no dashboard para incentivar instalação
- Instruções passo-a-passo específicas por navegador
- Badge de versão clicável com changelog completo
- Botão de instalação com tooltip explicativo

**Correções:**
- Campo `total_received` removido (migrado para `total_amount_paid`)
- Lógica de créditos corrigida (não subtrair pagamentos do total)
- Status `completed` e `cancelled` adicionados aos agendamentos

**Otimizações:**
- Dashboard: 8 queries → 1 RPC function (`get_dashboard_metrics`)
- Service Worker com cache estratégico (Network First para API, Cache First para assets)
- IndexedDB para armazenamento offline (Dexie)
- Sincronização bidirecional automática (online/offline)

---

## 🚀 Roadmap de Versões Futuras

### **v1.1.0** - Previsto: Janeiro 2025
- [ ] Push Notifications implementadas
- [ ] Background Sync API (processar fila offline em background)
- [ ] Tema escuro com toggle
- [ ] Exportar agendamentos em PDF
- [ ] Relatório de performance mensal

### **v1.2.0** - Previsto: Fevereiro 2025
- [ ] Backup automático na nuvem (Supabase Storage)
- [ ] Importar/Exportar dados (JSON/CSV)
- [ ] Relatórios financeiros avançados
- [ ] Gráficos de performance com Chart.js
- [ ] Filtros avançados no calendário

### **v2.0.0** - Previsto: Q2 2026 (SaaS)
- [ ] Sistema de assinaturas (Stripe/PagSeguro)
- [ ] Multi-tenancy (workspaces/equipes)
- [ ] Planos (Free/Pro/Business)
- [ ] Billing dashboard com métricas de uso
- [ ] API pública para integrações

### **v3.0.0** - Previsto: Q3 2026 (Multi-segmento)
- [ ] Suporte para cabeleireiros, barbeiros, esteticistas
- [ ] Templates de serviços por nicho
- [ ] Marketplace de templates
- [ ] Sistema de avaliações e reviews
- [ ] Integração com Google Calendar

---

## 🧪 Como Testar a Versão

### **1. Visual no Dashboard**
1. Acesse o app: https://josewesley2020.github.io/MakeupManager_v2/
2. Faça login
3. Veja **"v1.0.0 ⓘ"** ao lado do título "Dashboard"
4. Clique para ver popup com detalhes

### **2. Console do Navegador**
```javascript
// Abrir DevTools (F12)
// Na aba Console, verificar logs do Service Worker:
console.log('MakeupManager PWA registered')
```

### **3. Package.json**
```bash
# Via terminal
cat package.json | grep version
# Output: "version": "1.0.0"
```

### **4. Testar Atualização de Versão**
```bash
# 1. Mudar versão em Version.tsx para 1.0.1
# 2. Recarregar página
# 3. Verificar se badge mostra v1.0.1
```

---

## 📝 Convenções de Commit (Conventional Commits)

Para facilitar o versionamento automático no futuro:

```bash
# Bug fix (PATCH: 1.0.0 → 1.0.1)
git commit -m "fix: corrigir cálculo de total_amount_paid no agendamento"
git commit -m "fix(dashboard): resolver erro de loading infinito"

# Nova feature (MINOR: 1.0.0 → 1.1.0)
git commit -m "feat: adicionar tema escuro com toggle"
git commit -m "feat(pwa): implementar push notifications"

# Breaking change (MAJOR: 1.0.0 → 2.0.0)
git commit -m "feat!: migrar para Supabase v2 com nova estrutura"
git commit -m "refactor!: mudar schema do banco de dados"

# Outras categorias
git commit -m "docs: atualizar README com versionamento"
git commit -m "chore: bump version to 1.1.0"
git commit -m "refactor: otimizar queries do dashboard"
git commit -m "style: ajustar espaçamento no header"
git commit -m "test: adicionar testes para PaymentService"
git commit -m "perf: melhorar performance do calendário"
```

**Formato:** `<tipo>(<escopo>): <descrição>`

**Tipos válidos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Testes
- `chore`: Tarefas de build/deploy

---

## 🔍 Troubleshooting

### **Versão não aparece no dashboard**
**Problema:** Componente `Version` não foi importado/adicionado.

**Solução:**
```tsx
// Dashboard.tsx (linha ~12)
import Version from './Version'

// No JSX (linha ~267):
<Version />
```

### **Versão desatualizada após deploy**
**Problema:** Cache do navegador mostrando versão antiga.

**Solução:**
```bash
# Forçar refresh no navegador
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)

# Ou limpar cache via DevTools:
F12 → Application → Clear Storage → Clear site data
```

### **Popup não abre ao clicar na versão**
**Problema:** Estado `showDetails` não está funcionando.

**Solução:** Verificar se `useState` foi importado:
```tsx
import { useState } from 'react'
```

### **Badge de versão não está visível no header**
**Problema:** Conflito de cores (texto branco em fundo branco).

**Solução:** O badge usa `bg-white/10` com `border-white/20` para contraste. Se não aparecer, verificar tema do Tailwind.

---

## ✅ Checklist de Release

Antes de lançar nova versão:

### **Pré-Release**
- [ ] Definir número da versão (MAJOR.MINOR.PATCH)
- [ ] Listar todas as mudanças (features, fixes, breaking changes)
- [ ] Testar localmente: `npm run dev`
- [ ] Build de produção: `npm run build`
- [ ] Verificar bundle size (idealmente < 500KB)

### **Atualização de Código**
- [ ] Atualizar `package.json` → `"version": "x.x.x"`
- [ ] Atualizar `Version.tsx` → `const version = 'x.x.x'`
- [ ] Atualizar `Version.tsx` → `const releaseDate = 'DD/MM/YYYY'`
- [ ] Adicionar changelog em `Version.tsx` → Novidades vX.X.X
- [ ] Atualizar `VERSIONING.md` → Histórico de versões

### **Deploy**
- [ ] Commit: `git commit -m "chore: bump version to vX.X.X"`
- [ ] Push para `developer`: `git push origin developer`
- [ ] Merge para `master`: `git checkout master && git merge developer`
- [ ] Push master: `git push origin master`
- [ ] Verificar GitHub Actions (deploy automático)
- [ ] Aguardar 2-3 minutos para deploy

### **Pós-Release**
- [ ] Testar em produção: https://josewesley2020.github.io/MakeupManager_v2/
- [ ] Verificar versão no dashboard (clicar no badge)
- [ ] Testar funcionalidades novas
- [ ] Forçar refresh (Ctrl+F5) para limpar cache
- [ ] Avisar usuários sobre nova versão (WhatsApp/Email)
- [ ] Criar release note no GitHub (opcional)

---

## 📚 Recursos Adicionais

- **Semantic Versioning:** https://semver.org/
- **Conventional Commits:** https://www.conventionalcommits.org/
- **GitHub Actions:** `.github/workflows/ci-deploy.yml`
- **PWA Documentation:** `PWA_IMPLEMENTATION_STATUS.md`
- **Roadmap:** `PROJECT_ROADMAP.md`
- **SQL Metrics:** `TESTE_SQL_METRICS.md`

---

## 🎨 Customização do Badge de Versão

Se quiser personalizar a aparência do badge:

### **Cores**
```tsx
// Version.tsx (linha ~14)
className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1 bg-white/10 px-2 py-1 rounded"

// Opções de cor:
// - bg-white/10 (atual, transparente branco)
// - bg-pink-500 (rosa sólido)
// - bg-purple-500 (roxo sólido)
// - bg-gradient-to-r from-pink-500 to-purple-600 (gradiente)
```

### **Tamanho**
```tsx
// Pequeno (atual): text-xs px-2 py-1
// Médio: text-sm px-3 py-1.5
// Grande: text-base px-4 py-2
```

### **Posicionamento do Popup**
```tsx
// Version.tsx (linha ~26)
className="absolute left-0 top-10 ..."  // Abaixo à esquerda (atual)
// Opções:
// right-0 top-10  → Abaixo à direita
// left-0 bottom-10 → Acima à esquerda
// right-0 bottom-10 → Acima à direita
```

---

**Última atualização:** 06/12/2024  
**Versão do documento:** 1.0  
**Autor:** MakeupManager Dev Team

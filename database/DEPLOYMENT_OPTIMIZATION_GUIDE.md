# GUIA DE DEPLOYMENT DAS OTIMIZAÇÕES

## ⚠️ IMPORTANTE: Executar na ordem correta!

### Passo 1: Executar Scripts SQL no Supabase

Acesse o **SQL Editor** do Supabase e execute os arquivos na ordem:

1. **`database/005-rpc-check-duplicate-appointment.sql`**
   - Cria função RPC para verificação de duplicados
   - Elimina problema N+1 na verificação de appointments
   - Teste: `SELECT check_duplicate_appointment(...)`

2. **`database/006-rpc-create-appointment-with-services.sql`**
   - Cria função RPC transacional para criação de appointments
   - UPSERT automático de cliente + appointment + services
   - Teste: `SELECT create_appointment_with_services(...)`

3. **`database/007-optimized-indices.sql`**
   - Cria 5 índices compostos para queries comuns
   - Melhora performance de listagens e agregações
   - Teste: Use queries EXPLAIN ANALYZE incluídas no arquivo

### Passo 2: Validar Funções Criadas

Execute no SQL Editor:

```sql
-- Listar funções criadas
SELECT 
  routine_name, 
  routine_type,
  data_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('check_duplicate_appointment', 'create_appointment_with_services');

-- Verificar índices criados
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY indexname;
```

### Passo 3: Deploy Frontend

O código frontend já está atualizado e pronto para usar as novas RPCs:

```bash
npm run build
./deploy.ps1
```

### Passo 4: Testar Funcionalidades

Teste essas operações após deployment:

1. **Cache de Perfil** (automático ao carregar PriceCalculator)
   - Abrir Calculadora de Preços
   - Verificar que clientes carregam normalmente
   - Enviar orçamento via WhatsApp (perfil deve estar em cache)

2. **Verificação de Duplicados**
   - Criar appointment confirmado
   - Tentar criar outro idêntico (mesmos serviços + data/hora)
   - Deve mostrar alerta de duplicação

3. **Criação de Appointment**
   - Criar appointment com cliente existente
   - Criar appointment com cliente novo
   - Verificar transação (se falhar, deve fazer rollback completo)

4. **Performance (opcional)**
   - Abrir DevTools → Network
   - Criar appointment e contar requests ao Supabase
   - Deve ter apenas 1-2 requests (vs 6-8 antes)

## 📊 Métricas Esperadas

### Antes das Otimizações
- **Carregamento inicial**: 2 queries sequenciais (clientes, depois perfil)
- **Envio WhatsApp**: 1 query de perfil por envio
- **Verificação duplicados**: 1 query inicial + 5-10 queries (N+1)
- **Criação appointment**: 3-6 queries (client → appointment → services)
- **Total por appointment**: ~8-12 queries
- **Tempo médio**: 800-1200ms

### Depois das Otimizações
- **Carregamento inicial**: 1 Promise.all paralela (clientes + perfil)
- **Envio WhatsApp**: 0 queries (usa cache)
- **Verificação duplicados**: 1 RPC call (2 queries internas otimizadas)
- **Criação appointment**: 1 RPC call transacional
- **Total por appointment**: ~2-3 queries
- **Tempo médio**: 200-400ms (3x mais rápido)
- **Redução de queries**: 70-80%

## 🔍 Troubleshooting

### Erro: "function does not exist"
- Execute os scripts SQL 005 e 006 no Supabase
- Verifique permissões com `GRANT EXECUTE` incluído nos scripts

### Erro: "column does not exist" 
- Verifique que todas as migrations V2 foram executadas
- Confirme campos: `payment_total_appointment`, `total_amount_paid`, `travel_fee`

### Appointment não é criado
- Abra console do navegador para ver erro detalhado
- Verifique se RPC retorna `{success: true, ...}`
- Teste RPC manualmente no SQL Editor

### Performance não melhorou
- Verifique se índices foram criados: `\di idx_*` no psql
- Execute EXPLAIN ANALYZE nas queries (exemplos no arquivo 007)
- Confirme que RLS policies não estão causando full scans

## ✅ Checklist de Deployment

- [ ] Executar `005-rpc-check-duplicate-appointment.sql`
- [ ] Executar `006-rpc-create-appointment-with-services.sql`
- [ ] Executar `007-optimized-indices.sql`
- [ ] Validar funções criadas (query information_schema)
- [ ] Validar índices criados (query pg_indexes)
- [ ] Build frontend (`npm run build`)
- [ ] Deploy para produção (`./deploy.ps1`)
- [ ] Testar cache de perfil
- [ ] Testar verificação de duplicados
- [ ] Testar criação de appointments (cliente novo + existente)
- [ ] Verificar performance no DevTools (contar requests)
- [ ] Confirmar que WhatsApp budget funciona (sem query de perfil)

## 📝 Rollback (se necessário)

Se houver problemas graves após deployment:

```sql
-- Remover RPCs
DROP FUNCTION IF EXISTS check_duplicate_appointment(UUID, UUID, UUID, DATE, TIME, UUID[]);
DROP FUNCTION IF EXISTS create_appointment_with_services(UUID, JSONB, JSONB, JSONB);

-- Remover índices
DROP INDEX IF EXISTS idx_appointments_user_filters;
DROP INDEX IF EXISTS idx_appointments_duplicate_check;
DROP INDEX IF EXISTS idx_appointment_services_lookup;
DROP INDEX IF EXISTS idx_clients_user_active;
DROP INDEX IF EXISTS idx_appointments_financial;
```

Depois fazer rollback do frontend para commit anterior.

## 🎯 Próximos Passos (Opcional)

Após validar que tudo funciona:

1. **Monitorar performance** no Supabase Dashboard
2. **Ajustar índices** se necessário baseado em queries reais
3. **Considerar outras otimizações**:
   - Cache de services/categories no localStorage
   - Lazy loading de componentes grandes
   - Pagination para listagens longas

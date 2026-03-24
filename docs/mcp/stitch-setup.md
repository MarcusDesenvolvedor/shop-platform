# Configuração do Google Stitch MCP

Guia para configurar o Model Context Protocol (MCP) com Google Stitch no Cursor.

## O que é o Google Stitch?

O Google Stitch é uma ferramenta de design que transforma prompts de texto em designs de UI completos e código pronto para produção. O MCP permite que agentes de IA (como o Cursor) manipulem projetos Stitch diretamente.

## Pré-requisitos

- [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install) instalado
- Conta no Google Cloud com billing habilitado
- Projeto no Google Cloud

## Opção 1: stitch-mcp (Recomendado - NPX)

Esta abordagem usa o pacote `stitch-mcp` com autenticação via Google Cloud. É gratuita e funciona em Windows, Mac e Linux.

### Passo 1: Login no Google Cloud

```bash
# Faça login no Google Cloud
gcloud auth login

# Configure seu projeto (substitua SEU_PROJECT_ID pelo ID real)
gcloud config set project SEU_PROJECT_ID
gcloud auth application-default set-quota-project SEU_PROJECT_ID
```

### Passo 2: Habilitar a API Stitch

```bash
# Instale o componente beta do gcloud (se ainda não tiver)
gcloud components install beta

# Habilite a API Stitch no projeto
gcloud beta services mcp enable stitch.googleapis.com
```

### Passo 3: Credenciais de Aplicação

```bash
# Configure as credenciais padrão da aplicação
gcloud auth application-default login
```

### Passo 4: Atualizar o mcp.json

Edite o arquivo `.cursor/mcp.json` e substitua `SEU_PROJECT_ID` pelo ID do seu projeto Google Cloud:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "stitch-mcp"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "meu-projeto-123"
      }
    }
  }
}
```

### Passo 5: Reiniciar o Cursor

Feche e reabra o Cursor para que a configuração do MCP seja carregada.

---

## Opção 2: API Oficial (HTTP com API Key)

Se você preferir usar a API oficial do Google Stitch com chave de API:

### Passo 1: Obter a API Key

1. Acesse as [Configurações do Stitch](https://stitch.google.com/settings)
2. Na seção "API Keys", clique em "Create API Key"
3. Salve a chave em local seguro (nunca faça commit em repositórios públicos)

### Passo 2: Configurar o mcp.json

Substitua a configuração em `.cursor/mcp.json` por:

```json
{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "SUA_API_KEY_AQUI"
      }
    }
  }
}
```

> ⚠️ **Segurança:** Se usar API Key, adicione `.cursor/mcp.json` ao `.gitignore` para não expor a chave.

---

## Ferramentas Disponíveis

| Ferramenta | Descrição |
|------------|-----------|
| `extract_design_context` | Extrai "Design DNA" (fontes, cores, layouts) de uma tela para manter consistência |
| `fetch_screen_code` | Baixa o código HTML/Frontend de uma tela |
| `fetch_screen_image` | Baixa o screenshot em alta resolução da tela |
| `generate_screen_from_text` | Gera uma NOVA tela baseada no seu prompt |
| `create_project` | Cria um novo workspace/projeto |
| `list_projects` | Lista todos os projetos Stitch disponíveis |
| `list_screens` | Lista todas as telas de um projeto |
| `get_project` | Obtém detalhes de um projeto |
| `get_screen` | Obtém metadados de uma tela |

## Dica: Fluxo do Designer

Para gerar UI consistente, use o fluxo em 2 passos:

1. **Extrair:** "Extraia o contexto de design da Home Screen..."
2. **Gerar:** "Usando esse contexto, gere uma Chat Screen..."

Isso garante que novas telas combinem com o design system existente.

## Solução de Problemas

### MCP não aparece no Cursor
- Verifique se o arquivo `.cursor/mcp.json` está na raiz do projeto
- Reinicie o Cursor completamente
- Em Cursor: Settings > MCP e verifique se o servidor aparece

### Erro de autenticação
- Execute novamente: `gcloud auth application-default login`
- Verifique se o projeto está correto: `gcloud config get-value project`

### API não habilitada
- Confirme: `gcloud beta services mcp list --enabled`
- O serviço `stitch.googleapis.com` deve aparecer na lista

# WM Transporte

Página estática de solicitação e cálculo de viagens.

## Estrutura ativa após a primeira organização

- `index.html`: estrutura da única página.
- `css/theme.css`: estilos que antes estavam embutidos no HTML. As regras foram extraídas sem redesign ou alteração intencional.
- `js/app.js`: lógica da página que antes estava embutida no HTML. O código foi extraído sem reescrever as regras.
- `core/datamanager.js`: carrega e indexa os arquivos de tarifas.
- `data/*.json`: tabelas de origem, destino e valores.
- `icons/`: ícones e imagem de marca existentes.

## Arquivos mantidos para auditoria

Os arquivos abaixo foram preservados, sem exclusão, porque ainda precisamos confirmar se são usados por outras partes do projeto ou se são legados:

- `core/dinamico.js`
- `core/global.js`
- `core/taxas.js`
- `js/calculo.js`
- `js/premiacao.js`
- `theme/*.css`
- `manifest.json`
- `service-worker.js`

## Pontos que precisam de validação antes de remover ou ativar

1. `index.html` ainda referencia `core/supabase.js`, mas esse arquivo não está presente no repositório recebido. A referência foi mantida nesta etapa para não remover uma integração sem autorização.
2. `service-worker.js` lista páginas (`origem.html`, `destino.html`, `resumo.html`) que não aparecem no ZIP. Também não encontramos registro do service worker no `index.html`.
3. `manifest.json` aponta para `icons/192.png` e `icons/512.png`, enquanto os arquivos presentes são `icons/icon-192.png` e `icons/icon-512.png`.
4. Os estilos em `theme/` e alguns scripts em `core/` e `js/` não são carregados pelo `index.html` atual. Foram preservados até confirmar se são realmente descartáveis.

## Regra de preservação

A separação inicial retirou CSS e JavaScript do `index.html` para arquivos externos. Não foram alteradas intencionalmente as regras de cálculo, os eventos, os dados JSON ou o fluxo de solicitação pelo WhatsApp.

# Site V3rso 3D

Página única da V3rso | Impressão 3D. A página inteira é uma impressão: rolar é subir no eixo Z.

Stack: Vite + React, GSAP + ScrollTrigger, Lenis.

## Rodar

```bash
npm install
npm run dev      # http://127.0.0.1:5183
npm run build    # gera dist/
```

## Deploy na Vercel

Importe o repositório. O `vercel.json` já define framework (Vite), comando de build e pasta de saída (`dist`).

Variável de ambiente opcional:

| Variável | Para quê |
|---|---|
| `VITE_WHATSAPP_URL` | Link do WhatsApp dos botões. Sem ela, usa o link público da bio do Instagram. |

## Estrutura

```
src/
  lib/scroll.js          Lenis + GSAP no mesmo loop, helpers de cena e movimento reduzido
  lib/FrameSequence.js   vídeo em frames desenhado em canvas, controlado pelo scroll
  lib/logo.js            geometria do logo (redesenho)
  lib/config.js          links e números ilustrativos
  components/            Logo, navegação, régua Z, pré-carregamento
  sections/              uma seção por arquivo (01 Hero ... 10 Fechamento)
  styles.css             tokens e estilos
public/
  frames/printer         193 frames da impressora (desktop)
  frames/printer-m       97 frames (celular)
  img/                   fotos dos cards e da peça
marca/                   logo em SVG
site-v3rso.pen           design no Pencil
```

## Seções e movimento

| Seção | Movimento |
|---|---|
| 00 Pré-carregamento | o bico aquece de 25 a 215 °C enquanto fontes e imagens carregam |
| 01 Hero | o bico desenha o logo; ao rolar o logo sobe em camadas e o painel conta |
| 02 Fatiar | a peça se abre em 40 fatias |
| 03 Imprimir | uma máscara revela a peça de baixo para cima, com o bico na linha de corte |
| 04 Virada | a frase é preenchida palavra por palavra |
| 05 Peças | scroll vertical vira faixa horizontal (no celular, arrasta com o dedo) |
| 06 Impressora | vídeo em frames da impressão; anel de progresso e frases em órbita |
| 07 Processo | o filamento desce e as etapas acendem |
| 08 Cores | clicar troca a cor do carretel |
| 09 Varejo e atacado | o número conta de 1 a 100 e a mesa enche |
| 10 Fechamento | o logo é desenhado; contatos |

## A confirmar com o cliente

- Fotos dos cards, da peça e o vídeo da impressora são gerados por IA. Trocar pelas fotos reais.
- Números do painel (960 camadas, 0,2 mm, 215 °C) são ilustrativos e estão rotulados assim.
- Lista de cores de filamento é de exemplo.
- Etapas do processo ("você aprova antes de imprimir", "orçamento por lote") foram inferidas.
- O logo em `marca/` é um redesenho a partir de uma imagem pequena. Substituir pelo arquivo original.

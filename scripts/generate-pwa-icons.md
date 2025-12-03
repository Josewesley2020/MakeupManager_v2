# Gerar Ícones PWA

## Instruções para criar os ícones

Os ícones PWA precisam ser gerados a partir do `public/makeup-icon.svg`.

### Opção 1: Usando pwa-asset-generator (Recomendado)

```bash
# Instalar ferramenta
npm install -g pwa-asset-generator

# Gerar todos os ícones automaticamente
pwa-asset-generator public/makeup-icon.svg public --padding "10%" --background "#FF6B9D" --scrape false
```

### Opção 2: Usando Figma/Photoshop

Exportar o SVG nos seguintes tamanhos:

**PWA Icons:**
- `icon-192.png` → 192x192 pixels
- `icon-512.png` → 512x512 pixels

**Apple Touch Icons:**
- `apple-touch-icon-180.png` → 180x180 pixels
- `apple-touch-icon-152.png` → 152x152 pixels
- `apple-touch-icon-120.png` → 120x120 pixels

**Favicon:**
- `favicon-32.png` → 32x32 pixels
- `favicon-16.png` → 16x16 pixels

### Opção 3: Usando ImageMagick

```bash
# Converter SVG para PNG nos tamanhos necessários
magick convert -background "#FF6B9D" -density 1200 public/makeup-icon.svg -resize 192x192 public/icon-192.png
magick convert -background "#FF6B9D" -density 1200 public/makeup-icon.svg -resize 512x512 public/icon-512.png
magick convert -background "#FF6B9D" -density 1200 public/makeup-icon.svg -resize 180x180 public/apple-touch-icon-180.png
```

### Opção 4: Usando Online Tools

1. Acesse: https://realfavicongenerator.net/
2. Upload do `public/makeup-icon.svg`
3. Configure cor de fundo: `#FF6B9D`
4. Download e extrair para a pasta `public/`

## Arquivos necessários na pasta public/

```
public/
├── icon-192.png          ✅ PWA icon pequeno
├── icon-512.png          ✅ PWA icon grande
├── apple-touch-icon-180.png  ✅ iOS home screen
├── apple-touch-icon-152.png  ✅ iOS iPad
├── apple-touch-icon-120.png  ✅ iOS retina
├── favicon-32.png        ✅ Favicon desktop
├── favicon-16.png        ✅ Favicon mobile
└── makeup-icon.svg       ✅ Já existe
```

## Ação Imediata

**IMPORTANTE:** Antes de fazer deploy do PWA, execute uma das opções acima para gerar os ícones reais.

Por enquanto, o projeto está configurado para funcionar sem os PNGs (usando apenas o SVG), mas para instalação PWA completa os PNGs são necessários.

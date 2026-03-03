# SVP · Sistema de Vigilancia de Plataformas de Vivienda Vacacional

Demo interactiva desarrollada por el **Área de Inteligencia Económica** de la Secretaría General de Consumo y Juego (SGCJ) para ilustrar las capacidades del Sistema de Vigilancia de Precios (SVP) aplicado al mercado de alquiler vacacional.

## Descripción

La herramienta monitoriza de forma continua los anuncios publicados en las principales plataformas de alquiler vacacional (Airbnb, Booking.com, Vrbo, HomeToGo) y detecta automáticamente anomalías como ausencia de licencia turística, precios abusivos, fraude en los datos del anuncio y duplicados entre plataformas.

## Contenido de la demo

- **Vista global** — comparativa de anomalías entre plataformas con evolución temporal
- **Detalle por plataforma** — desglose por tipo de infracción y zona geográfica
- **CPU vs GPU** — demostración del rendimiento de inferencia de modelos de lenguaje con y sin aceleración GPU en NubeSARA

## Instalación
```bash
npm install
npm run dev
```

## Tecnología

- React 18 + Vite
- Recharts
- Anthropic API

## Contexto técnico

La infraestructura se despliega en **NubeSARA** dentro de la red RedSARA. El procesamiento de texto libre de anuncios —que puede contener datos personales— se realiza íntegramente on-premise por exigencia del **Esquema Nacional de Seguridad (ENS) categoría Alta**.
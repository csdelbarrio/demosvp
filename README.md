# SVP - Vigilancia Plataformas de Vivienda Vacacional

Demo interactiva del Sistema de Vigilancia de Precios (SVP).
Area de Inteligencia Economica - SGCJ.

## Pestanas

- **Global**: comparativa de anomalias entre Airbnb, Booking.com, Vrbo y HomeToGo
- **Detalle por plataforma**: desglose por tipo de anomalia y zona geografica  
- **CPU vs GPU**: demo en tiempo real del rendimiento de inferencia LLM con y sin GPU en NubeSARA

## Instalacion

    npm install
    npm run dev

## Stack

React 18 + Vite + Recharts + API Anthropic

## Contexto tecnico

Infraestructura desplegada en NubeSARA (RedSARA). Requisitos ENS categoria Alta.
El procesamiento de texto libre de anuncios se realiza on-premise por exigencia normativa.

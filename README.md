# 🎬 Netflix Advanced Shortcuts — Pause-and-Translate Helper

Extensão para Google Chrome que adiciona **atalhos avançados** no player da Netflix, pensada para auxiliar no método **Pause-and-Translate** de aprendizado de idiomas.

O **Pause-and-Translate Method** consiste em:
1. Pausar a reprodução quando aparece uma fala interessante/difícil.
2. Alterar a legenda para o idioma de destino (ex.: inglês) para verificar a construção da frase.
3. Retornar a reprodução e comparar com a legenda original (ex.: português).

Essa extensão automatiza parte desse processo, tornando a prática mais fluida.

## ✨ Funcionalidades

- **Atalho `W`** → Retrocede **5 segundos** no vídeo.
- **Atalho `Q`** → Alterna entre:
  - **Português** + Pausa
  - **Inglês (priorizando CLOSEDCAPTIONS)** + Play
- Sempre mantém o **estado coerente**:
  - **PT = pausa** (para leitura/tradução no idioma nativo)
  - **EN = reprodução** (para escutar no idioma alvo)
- Detecção automática do player da Netflix.
- Executa no **contexto da página**, acessando APIs internas para troca de legenda de forma imediata.

## 📦 Instalação

1. Baixe o repositório.
2. Extraia os arquivos em uma pasta local.
3. No Chrome, acesse `chrome://extensions` e ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.
5. Abra qualquer título da Netflix (`https://www.netflix.com/watch/...`) e use os atalhos.

## 🛠️ Como usar

- **Estudando com Pause-and-Translate:**
  1. Assista normalmente com legenda em português.
  2. Quando quiser ver a frase original:
     - Pressione **Q** → muda para inglês e reproduz.
  3. Para voltar e entender no contexto:
     - Pressione **Q** novamente → muda para português e pausa.
  4. Use **W** para voltar 5 segundos sempre que quiser repetir.

## 📋 Requisitos

- Google Chrome (ou navegador compatível com extensões do Chrome).
- Conta Netflix.
- A obra deve ter legendas disponíveis em português e inglês.

## 📜 Licença

Este projeto é distribuído sob a licença MIT.  
Sinta-se livre para modificar e contribuir.

💡 **Dica**: Combine com ferramentas de tradução e anotações de vocabulário para potencializar o aprendizado.

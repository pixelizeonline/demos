# 🧠 Memória do Sistema - Pixelize Demos (Contexto Obrigatório)

> **Instrução Especial para a IA / Agente:** Ao abrir este repositório, LEIA as regras abaixo para compreender o modo de trabalho e as preferências de segurança do usuário.

## 1. Organização e Arquitetura de Pastas
Nenhum projeto de cliente deve ser criado solto na raiz. As landing pages devem ser obrigatoriamente incluídas na sua pasta de "Nicho" correspodente, tais como:
`alimentacao`, `estetica`, `financas`, `barbearia`, `imobiliaria`, `advocacia`, etc.
*(Exceções: Páginas institucionais da própria agência e a pasta prospect).*

## 2. Padrão de Fluxo (Criação via Imagem/Print)
Ao receber uma solicitação de criação, o usuário fornecerá o **nicho** e uma **imagem** (print do GMN, Instagram, etc.).
- A IA deverá usar sua Visão Computacional para **extrair a identidade do cliente** (Cores, Tons, Serviços, Endereços, Logo).
- A IA deverá clonar/adaptar a melhor landing campeã do repositório respectivo daquele nicho para ganhar agilidade de conversão.

## 3. Nível de Segurança: "Camada Psicológica" OBRIGATÓRIA 🔒
**Atenção Crítica:** TODAS as landing pages devem ter aplicada uma camada de segurança (anti-fuxico / anti-espião).
No final do arquivo principal de Javascript (`script.js` ou `main.js`), você deve INJETAR o snippet de segurança que executa:
1. Bloqueio de clique direito (contextmenu).
2. Bloqueio de teclas F12, Ctrl+Shift+I, J e Ctrl+U.
3. Detecção por quebra de tamanho de tela (Resize do Console/DevTools).
*(O script deve ser preferencialmente ofuscado/minificado com arrays hexadecimais de string, semelhante ao que há na Dorus Burgers ou HM Pizza).*

## 4. Fluxo de Git Automático (Push CI/CD)
Após qualquer finalização ou ajuste substancial em landigs, não espere o usuário pedir.
Automaticamente execute os comandos para salvar:
```bash
git add .
git commit -m "feat: [descrição do que foi feito]"
git push
```

## 5. Devolutiva de Link de Produção (Live Preview)
Após o git push, sempre responda o usuário entregando o link de produção. O deploy é alimentado pelo GitHub Pages/Vercel via branch root.
Devido à organização de diretórios por nichos, os links formatados são sempre:
`https://pixelizeonline.github.io/demos/[nicho]/[nome_do_projeto]/`

**Exemplo:** Se a página "Hamburgueria do Zé" for criada na pasta "alimentacao"...
- A IA deve entregar: `https://pixelizeonline.github.io/demos/alimentacao/hamburgueria-do-ze/`

## 6. O Padrão "50k" (Premium UI & Responsividade) 💎
Nenhum projeto pode parecer um template genérico ou barato. Todo site gerado deve ter aspecto visual nativo de um projeto de **Alto Valor (nível 50K+ / Premium)**.
A IA deve sempre incluir nativamente:
- **"Frescurinhas" e Micro-interações Mágicas:** Animações avançadas (como fade-ups no scroll), botões magnéticos, efeitos de hover sutis, sobreposições de vidro (glassmorphism), overlays de gradiente macios e tipografia refinada. A interface precisa parecer "viva" e despertar o fator "WOW".
- **Responsividade Máxima (Mobile-First):** O design DEVE ser pensado com a perfeição mobile desde o primeiro código. Ajustes milimétricos de padding, margens amigáveis para touch e ausência absoluta de bugs visuais em telas pequenas são inegociáveis. O projeto precisa renderizar perfeitamente no celular sob qualquer condição.

## 7. Assinaturas e Elementos Obrigatórios de Conversão 🚀
Além do layout premium estilizado, todo projeto Pixelize deve conter sem falta:
- **Assinatura no Footer:** Presença obrigatória da tag *"Desenvolvido por Pixelize"* no rodapé estilizado, com link apropriado para a agência.
- **Botão de WhatsApp Flutuante:** Ícone magnético / animado fixo (bottom-right), configurado com link de API (`wa.me`) pronto para receber mensagens do lead.
- **Proibição de Placeholders:** Quadros cinzas vazios são expressamente proibidos. A IA deve buscar e aplicar instantaneamente fotos reais premium de alta qualidade (via Unsplash, Pexels, etc.) que façam sentido estético para a marca logo no primeiro render.
- **Carga Rápida e Copy Focada:** Código semântico limpo, foco em um único "H1" poderoso, botões Call To Action diretos e otimização para carregamento assíncrono (lazy-load ou preload inteligente de assets).

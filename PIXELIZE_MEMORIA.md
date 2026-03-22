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

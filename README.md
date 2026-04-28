# Equipilates - Equipamentos de Pilates 🏋️

[![Deploy on Vercel](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://equipilates-kd8843deo-webereaugustos-projects.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-181717?style=for-the-badge&logo=github)](https://github.com/webereaugusto/equipilates-html)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

> Site institucional da **Equipilates**, líder em fabricação de equipamentos de Pilates na América Latina desde 2006.

---

## 🌐 Acesso

### 🚀 Produção (Vercel)
**https://equipilates-kd8843deo-webereaugustos-projects.vercel.app**

Hospedado no **Vercel** com:
- ⚡ CDN Global
- 🔒 SSL/HTTPS automático
- 📦 Cache otimizado (1 ano para assets)
- 🌍 Edge Network
- 📊 Analytics em tempo real

### 🔗 GitHub Pages (Backup)
**https://webereaugusto.github.io/equipilates-html/**

---

## ✨ Sobre o Projeto

Landing page moderna e responsiva desenvolvida para apresentar as linhas de produtos Equipilates, focada em conversão e experiência do usuário.

### 🎯 Principais Características

| Característica | Descrição |
|---|---|
| 🎨 **Design Moderno** | Interface clean com animações suaves |
| 📱 **Totalmente Responsivo** | Otimizado para mobile, tablet e desktop |
| 🌍 **Multilíngue** | PT-BR, EN, ES, DE |
| 🚀 **Alta Performance** | PageSpeed 85+ |
| ♿ **Acessível** | ARIA labels completos |
| 🎯 **SEO Otimizado** | Meta tags, Schema.org |
| 📸 **Galeria Inteligente** | Filtros + lazy loading |
| 🎪 **Carrosséis Modernos** | Autoplay + touch |

---

## 🛠️ Stack Tecnológico

```
Frontend:  HTML5 + CSS3 + Vanilla JavaScript
Imagens:   WebP (otimizado)
i18n:      Sistema custom em JSON
Deploy:    Vercel (Produção) + GitHub Pages (Backup)
CDN:       Vercel Edge Network
SSL:       Automático via Vercel
```

---

## 📦 Instalação e Uso

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/webereaugusto/equipilates-html.git
cd equipilates-html
```

### 2️⃣ Inicie um Servidor Local

**Opção A - Python:**
```bash
python -m http.server 8080
```

**Opção B - Node.js:**
```bash
npx http-server -p 8080
```

**Opção C - PHP:**
```bash
php -S localhost:8080
```

### 3️⃣ Acesse no Navegador

```
http://localhost:8080
```

> ⚠️ **Importante:** Não abra o `index.html` diretamente. Use sempre um servidor local.

---

## 📁 Estrutura do Projeto

```
equipilates-html/
│
├── 📄 index.html              # Página principal
├── 🎨 styles.css              # Estilos globais
├── ⚙️ script.js               # JavaScript principal
├── 🌐 i18n.js                 # Sistema i18n
│
├── 📂 images/
│   ├── linha-classic/         # 10 produtos clássicos
│   ├── linha-contemporanea/   # 10 produtos contemporâneos
│   ├── acessorios/            # 5 acessórios
│   ├── bg/                    # Backgrounds
│   └── logos/                 # Logotipos
│
├── 📂 locales/
│   ├── pt-BR.json            # Português
│   ├── en.json               # English
│   ├── es.json               # Español
│   └── de.json               # Deutsch
│
├── ⚙️ vercel.json             # Configuração Vercel
├── 🚫 .vercelignore           # Ignorar arquivos
├── 📖 README.md               # Este arquivo
└── 📄 LICENSE                 # Licença MIT
```

---

## 🎨 Funcionalidades Detalhadas

### 🏠 Hero Section
- Slider automático com 3 slides
- Navegação por dots e setas
- Conteúdo multilíngue
- CTA para WhatsApp

### 🖼️ Galeria de Produtos
- **Filtros:** Linha Clássica, Contemporânea, Acessórios
- **Lazy Loading:** Carregamento sob demanda
- **Progressivo:** 8 itens iniciais, +8 por clique
- **Shuffle:** Ordem aleatória a cada visita
- **Animações:** Fade-in suave

### 🎪 Carrosséis
- **2 carrosséis:** Linha Clássica + Contemporânea
- **20 produtos:** 10 em cada linha
- **Autoplay:** Rotação automática
- **Touch/Swipe:** Suporte mobile
- **Dots interativos:** Navegação visual
- **Responsivo:** Adapta quantidade de slides

### 🌐 Internacionalização
- Troca de idioma instantânea
- Persistência via localStorage
- 4 idiomas completos
- Sem reload de página

### 📊 Seção Institucional
- Timeline do processo
- Estatísticas da empresa
- Diferenciais competitivos
- Cards de valores

---

## ⚡ Otimizações de Performance

### 🎯 Implementadas

| Otimização | Impacto |
|---|---|
| ✅ Lazy Loading | -500KB carga inicial |
| ✅ Defer Scripts | Renderização não-bloqueante |
| ✅ Preload Crítico | FCP mais rápido |
| ✅ WebP | 30% menor que PNG |
| ✅ Cache Headers | 1 ano para assets |

### 📊 Métricas PageSpeed (Mobile)

```
Performance:     85+ ⚡
Acessibilidade:  90+ ♿
Best Practices:  96+ ✅
SEO:            100 🎯
```

### 🚀 Tempos de Carregamento

| Métrica | Tempo |
|---|---|
| **First Contentful Paint** | ~1.5s |
| **Largest Contentful Paint** | ~2.5s |
| **Time to Interactive** | ~3.0s |
| **Total Blocking Time** | <100ms |

---

## 🎨 Design System

### Paleta de Cores

```css
/* Cores Principais */
--primary:   #1a1a1a    /* Cinza escuro - Backgrounds */
--caramel:   #D4A574    /* Dourado - CTAs e acentos */
--accent:    #FFD700    /* Amarelo - Hover states */
--bg-dark:   #0a0a0a    /* Preto suave - Seções */
--text:      #ffffff    /* Branco - Textos */

/* Transparências */
--overlay:   rgba(0,0,0,0.7)    /* Overlays escuros */
--card-bg:   rgba(255,255,255,0.05)  /* Cards sutis */
```

### Tipografia

```css
/* Fontes */
font-primary:   'Sora', sans-serif         /* Títulos */
font-secondary: 'Inter', sans-serif        /* Textos */

/* Tamanhos */
h1:  3.5rem / 56px
h2:  2.5rem / 40px
h3:  1.8rem / 29px
p:   1rem / 16px
```

---

## 🚀 Deploy

### Vercel (Automático)

O projeto está configurado para deploy automático no Vercel a cada push na branch `master`.

**Deploy Manual:**
```bash
vercel --prod
```

**Configurações:**
- Build Command: Nenhum (site estático)
- Output Directory: `.` (raiz)
- Install Command: Nenhum
- Framework Preset: Other

### GitHub Pages (Alternativo)

1. Vá em **Settings** > **Pages**
2. Source: `Deploy from branch`
3. Branch: `master` / `root`
4. Clique em **Save**

---

## 🤝 Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/MinhaFeature
   ```
3. **Commit** suas mudanças:
   ```bash
   git commit -m 'feat: Adiciona MinhaFeature'
   ```
4. **Push** para a branch:
   ```bash
   git push origin feature/MinhaFeature
   ```
5. Abra um **Pull Request**

### 📝 Padrão de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     Nova funcionalidade
fix:      Correção de bug
perf:     Melhoria de performance
style:    Formatação/estilo
refactor: Refatoração
docs:     Documentação
deploy:   Deploy/configuração
```

---

## 🌐 Compatibilidade

| Browser | Versão Mínima |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |
| iOS Safari | 14+ |
| Chrome Mobile | 90+ |

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](LICENSE) para detalhes.

```
MIT License - Copyright (c) 2024 Equipilates
```

---

## 📞 Contato

### Equipilates

- 🌐 **Website:** [equipilates.com.br](https://www.equipilates.com.br)
- 📧 **Email:** contato@equipilates.com.br
- 📱 **WhatsApp:** [+55 24 99845-0039](https://wa.me/5524998450039)
- 📍 **Endereço:** Resende, Rio de Janeiro, Brasil
- 🏭 **Fábrica:** 2.500m² em Resende-RJ

### Redes Sociais

- [Instagram](#) | [Facebook](#) | [LinkedIn](#)

---

## 🏆 Conquistas

- ✅ **+30.000 studios** equipados
- ✅ **24+ países** atendidos
- ✅ **18 anos** de experiência
- ✅ **2.500m²** de área fabril
- ✅ **2 anos** de garantia

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ para revolucionar o mercado de equipamentos de Pilates.

**Equipilates** - Referência em Equipamentos de Pilates desde 2006

---

<div align="center">
  
### 🚀 [Acessar Site](https://equipilates-kd8843deo-webereaugustos-projects.vercel.app) | 📖 [Documentação](#) | 💬 [Suporte](#)

**[⬆ Voltar ao topo](#equipilates---equipamentos-de-pilates-)**

</div>

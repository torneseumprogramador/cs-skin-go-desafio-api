# 🚀 Guia de Deploy para Produção

Este guia mostra como fazer o deploy da API NestJS em diferentes plataformas.

---

## ☁️ Opção 1: Railway (Recomendado - Mais Fácil)

### Passo a Passo

1. **Criar conta no Railway**: https://railway.app/

2. **Criar novo projeto**:
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório

3. **Adicionar MySQL**:
   - No projeto, clique em "+ New"
   - Selecione "Database" → "Add MySQL"
   - Railway criará automaticamente um banco MySQL

4. **Configurar variáveis de ambiente**:
   - Clique no serviço da API
   - Vá em "Variables"
   - Adicione:

```env
NODE_ENV=production
PORT=3001
API_PREFIX=api

# Railway fornece essas variáveis automaticamente ao adicionar MySQL
DATABASE_HOST=${{MYSQL.MYSQLHOST}}
DATABASE_PORT=${{MYSQL.MYSQLPORT}}
DATABASE_USER=${{MYSQL.MYSQLUSER}}
DATABASE_PASSWORD=${{MYSQL.MYSQLPASSWORD}}
DATABASE_NAME=${{MYSQL.MYSQLDATABASE}}

JWT_SECRET=seu-secret-super-seguro-aqui-minimo-32-caracteres-aleatorios
JWT_EXPIRES_IN=7d

CORS_ORIGIN=https://seu-frontend.vercel.app

RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

5. **Deploy automático**:
   - Railway fará deploy automaticamente
   - Aguarde o build terminar

6. **Executar seeds** (primeira vez):
   - No Railway, vá em "Settings" → "Deploy Triggers"
   - Ou execute via terminal local conectando ao banco:

```bash
# Configurar .env local com credenciais do Railway
npm run seed
```

7. **Gerar domínio**:
   - Clique em "Settings" → "Networking"
   - Clique em "Generate Domain"
   - Sua API estará em: `https://seu-projeto.up.railway.app`

---

## ☁️ Opção 2: Render

### Passo a Passo

1. **Criar conta no Render**: https://render.com/

2. **Criar Web Service**:
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório
   - Configure:
     - **Name**: cs-skin-go-api
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start:prod`

3. **Criar banco MySQL**:
   - No dashboard, clique em "New +" → "PostgreSQL" (Render não oferece MySQL gratuito)
   - **Alternativa**: Use PlanetScale (MySQL gratuito)

4. **Adicionar variáveis de ambiente** (igual ao Railway)

5. **Deploy**: Render fará deploy automaticamente

---

## ☁️ Opção 3: Heroku

### Passo a Passo

1. **Instalar Heroku CLI**:
```bash
npm install -g heroku
```

2. **Login**:
```bash
heroku login
```

3. **Criar aplicação**:
```bash
heroku create cs-skin-go-api
```

4. **Adicionar MySQL (ClearDB)**:
```bash
heroku addons:create cleardb:ignite
```

5. **Configurar variáveis**:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=seu-secret-aqui
heroku config:set CORS_ORIGIN=https://seu-frontend.com
```

6. **Deploy**:
```bash
git push heroku main
```

---

## ☁️ Opção 4: DigitalOcean App Platform

### Passo a Passo

1. **Criar conta**: https://www.digitalocean.com/

2. **Criar App**:
   - Dashboard → Apps → Create App
   - Conecte GitHub
   - Configure build:
     - Build Command: `npm run build`
     - Run Command: `npm run start:prod`

3. **Adicionar MySQL Managed Database**:
   - No DigitalOcean, crie um "Managed Database" (MySQL)
   - Conecte à sua app

4. **Configurar variáveis** (igual aos outros)

5. **Deploy**: Automático após configuração

---

## ☁️ Opção 5: AWS (Produção Profissional)

### Requisitos
- Conta AWS
- Docker instalado

### Usando AWS ECS (Elastic Container Service)

1. **Criar Dockerfile** (já incluso no projeto):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

2. **Build da imagem**:
```bash
docker build -t cs-skin-go-api .
```

3. **Push para ECR** (Elastic Container Registry):
```bash
aws ecr create-repository --repository-name cs-skin-go-api
docker tag cs-skin-go-api:latest <seu-ecr-uri>
docker push <seu-ecr-uri>
```

4. **Criar RDS MySQL**:
   - No console AWS, crie um RDS MySQL
   - Configure security groups

5. **Deploy no ECS**:
   - Crie um cluster ECS
   - Crie um service
   - Configure task definition com variáveis de ambiente

---

## 🗄️ Banco de Dados em Produção

### Opções de MySQL Gerenciado

1. **PlanetScale** (Gratuito): https://planetscale.com/
   - MySQL serverless
   - Tier gratuito generoso
   - Fácil de usar

2. **Railway MySQL** (Grátis por tempo limitado)

3. **AWS RDS** (Pago, mas robusto)

4. **DigitalOcean Managed Databases** (A partir de $15/mês)

### Configurar PlanetScale

1. Criar conta: https://planetscale.com/

2. Criar database:
   - Nome: cs-skin-go
   - Região: escolha a mais próxima

3. Criar credenciais:
   - Vá em "Connect"
   - Copie as credenciais

4. Atualizar `.env` de produção:
```env
DATABASE_HOST=aws.connect.psdb.cloud
DATABASE_PORT=3306
DATABASE_USER=seu-usuario
DATABASE_PASSWORD=sua-senha
DATABASE_NAME=cs-skin-go
```

---

## 🔒 Checklist de Segurança para Produção

- [ ] JWT_SECRET com no mínimo 32 caracteres aleatórios
- [ ] DATABASE_PASSWORD forte e segura
- [ ] CORS_ORIGIN configurado apenas para domínios confiáveis
- [ ] `synchronize: false` no TypeORM (usar migrations)
- [ ] Rate limiting ativado
- [ ] Helmet configurado
- [ ] Logs de erro configurados
- [ ] Monitoramento ativo (Sentry, LogRocket, etc)
- [ ] Variáveis de ambiente em Secret Manager (não commitar .env)
- [ ] HTTPS ativado
- [ ] Backups automáticos do banco

---

## 📊 Monitoramento e Logs

### Sentry (Recomendado)

1. **Instalar**:
```bash
npm install @sentry/node
```

2. **Configurar no `main.ts`**:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### PM2 (para VPS)

Se estiver usando VPS (DigitalOcean Droplet, AWS EC2):

```bash
npm install -g pm2

# Iniciar app
pm2 start dist/main.js --name cs-skin-go-api

# Ver logs
pm2 logs cs-skin-go-api

# Reiniciar
pm2 restart cs-skin-go-api

# Auto-start no boot
pm2 startup
pm2 save
```

---

## 🔄 CI/CD com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm run test

      - name: Deploy to Railway
        run: |
          # Adicionar comando de deploy aqui
```

---

## ⚡ Otimizações para Produção

### 1. Habilitar compressão

Já configurado em `main.ts`:
```typescript
app.use(compression());
```

### 2. Cache de queries

Adicionar cache Redis:
```bash
npm install @nestjs/cache-manager cache-manager
```

### 3. Conexão com pool no TypeORM

Já configurado automaticamente no TypeORM.

### 4. Logs estruturados

Usar Winston ou Pino:
```bash
npm install nestjs-pino pino-http
```

---

## 📈 Escalabilidade

### Load Balancing

- **Railway/Render**: Automático com replicas
- **AWS**: Use ECS com Auto Scaling
- **DigitalOcean**: Configure Load Balancer

### Cache Layer

Adicione Redis para:
- Cache de queries frequentes
- Rate limiting distribuído
- Sessions

### Database Read Replicas

Configure réplicas de leitura no MySQL para queries pesadas.

---

## 🧪 Ambiente de Staging

Recomenda-se ter um ambiente de staging:

1. Criar branch `staging` no GitHub
2. Deploy em ambiente separado (ex: Railway staging)
3. Testar antes de fazer merge para `main`

---

## 📞 Suporte e Troubleshooting

### Logs não aparecem

Certifique-se de usar `console.log` ou configure logger customizado.

### Erros 502/504

- Verifique se a porta está correta
- Verifique timeout do servidor
- Verifique se o build foi bem-sucedido

### Banco de dados não conecta

- Verifique credenciais
- Verifique se o IP está na whitelist
- Verifique se o banco está ativo

---

## ✅ Checklist Final de Deploy

- [ ] Código commitado e pushed para GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado e acessível
- [ ] Seeds executados (casos)
- [ ] CORS configurado para frontend
- [ ] JWT_SECRET gerado aleatoriamente
- [ ] Documentação Swagger acessível
- [ ] Testes passando
- [ ] Deploy realizado
- [ ] Frontend atualizado com URL da API
- [ ] Teste completo de fluxo em produção

---

**🎉 API pronta para produção!**


# 🔐 Jornada de Aprendizado: Authentication & Authorization

> Um plano de estudos progressivo, do básico ao avançado, cobrindo todo o espectro de identidade digital: autenticação, autorização, 2FA, MFA, SSO, OAuth, OIDC, SAML, Passkeys, Zero Trust e mais.

---

## 📋 Sobre este plano

Este documento é uma trilha de estudos **incremental e prática**. Cada etapa contém:

- 📚 **Conceitos teóricos** — o "porquê" e o vocabulário do tema
- 🎯 **Lições principais** — o que você precisa saber dominar ao final
- 🛠️ **Incremento no projeto** — código real para fixar a teoria
- ✅ **Critérios de conclusão** — sinais de que você está pronto para avançar

Os conceitos são **agnósticos à stack**. As implementações usam **NestJS (back-end)** e **React (front-end)**, mas a teoria se aplica em qualquer linguagem ou framework.

---

## 🏗️ Aplicação Base: TaskFlow

Vamos construir um **gerenciador de tarefas com times (workspaces)**. É simples o bastante para não desviar o foco de auth, mas rico o suficiente para explorar autorização real.

**Domínio:**

- `User` — quem usa o sistema
- `Workspace` — um time/organização ao qual o usuário pertence
- `Membership` — relação entre `User` e `Workspace`, com `role` (owner, admin, member, guest)
- `Task` — pertence a um workspace, pode ter um assignee
- `Comment` — pertence a uma task

Esse modelo permite estudar tanto recursos **pessoais** (minhas próprias tasks) quanto **compartilhados** (tasks de um workspace), exercitando RBAC e ABAC.

**Stack:**

- Back-end: **NestJS** + TypeORM/Prisma + PostgreSQL + Redis (sessões/rate-limit)
- Front-end: **React** + Vite + React Router + TanStack Query
- Infra: Docker Compose para Postgres, Redis, MailHog, Keycloak (mais adiante)

---

## 🗺️ Visão geral da jornada

| #   | Etapa                         | Foco                                      |
| --- | ----------------------------- | ----------------------------------------- |
| 0   | Fundamentos & Setup           | Conceitos primordiais e projeto base      |
| 1   | Autenticação por Senha        | Hashing, login, registro                  |
| 2   | Sessões & Cookies             | Estado server-side, cookies seguros       |
| 3   | JWT & Stateless Auth          | Tokens, claims, assinatura                |
| 4   | Refresh Tokens & Rotação      | Sessões longas com segurança              |
| 5   | Autorização — RBAC            | Roles e permissões por papel              |
| 6   | Autorização — ABAC/PBAC       | Permissões por atributo e contexto        |
| 7   | Recuperação & Verificação     | E-mail, reset de senha, magic links       |
| 8   | 2FA & MFA                     | TOTP, códigos de recuperação, fatores     |
| 9   | OAuth 2.0 & OIDC              | Login social, delegação                   |
| 10  | SSO Empresarial — SAML        | Federação entre organizações              |
| 11  | Passkeys / WebAuthn / FIDO2   | Autenticação sem senha                    |
| 12  | Segurança Avançada            | CSRF, XSS, headers, rate limit, auditoria |
| 13  | Provedor de Identidade        | Keycloak/Auth0 como IdP central           |
| 14  | Zero Trust & Tópicos Modernos | Continuous auth, risk-based, mTLS         |

---

# Etapa 0 — Fundamentos & Setup

> **Objetivo:** Entender o vocabulário básico e ter a aplicação rodando localmente, sem nenhuma proteção, para servir de base.

### 📚 Conceitos a estudar

- [ ] Diferença entre **Authentication (AuthN)** e **Authorization (AuthZ)**
- [ ] O que é **identidade digital** e **identificador** (vs. autenticador)
- [ ] Modelo HTTP: por que ele é **stateless** e o que isso implica para auth
- [ ] Conceitos de **principal**, **subject**, **claim**, **credencial**
- [ ] **CIA Triad**: Confidentiality, Integrity, Availability
- [ ] **AAA**: Authentication, Authorization, Accounting (auditing)
- [ ] O modelo de ameaças (threat modeling) — **STRIDE** como introdução
- [ ] Vocabulário OWASP — leia o **OWASP Top 10** rapidamente para contexto

### 🎯 Lições principais

- [ ] Sei explicar a diferença entre "quem você é" e "o que você pode fazer"
- [ ] Entendo por que cada requisição HTTP precisa "se identificar" novamente
- [ ] Reconheço os principais vetores de ataque em sistemas de identidade

### 🛠️ Incremento no projeto

- [ ] Inicializar projeto NestJS (`nest new taskflow-api`)
- [ ] Inicializar projeto React (`npm create vite@latest taskflow-web -- --template react-ts`)
- [ ] Subir Postgres e Redis via `docker-compose.yml`
- [ ] Modelar entidades `User`, `Workspace`, `Membership`, `Task`, `Comment` (sem auth ainda)
- [ ] CRUD básico de tasks **sem proteção** — propositalmente vulnerável
- [ ] Front-end consumindo a API, com tela de listagem e criação de tasks

### ✅ Critérios de conclusão

- [ ] Aplicação roda end-to-end localmente
- [ ] Você consegue criar e listar tasks pela UI
- [ ] Você consegue explicar por que esse estado atual é inaceitável em produção

---

# Etapa 1 — Autenticação por Senha

> **Objetivo:** Implementar registro e login com e-mail/senha de forma segura.

### 📚 Conceitos a estudar

- [ ] Por que **nunca** armazenar senhas em texto puro
- [ ] Diferença entre **hash**, **encryption** e **encoding**
- [ ] Funções de hash para senha: **bcrypt**, **scrypt**, **argon2** (e por que MD5/SHA-256 não servem)
- [ ] **Salt**: o que é, por que é necessário, por que deve ser único por usuário
- [ ] **Pepper**: o que é, prós e contras
- [ ] **Work factor / cost factor** e seu impacto em segurança vs. performance
- [ ] **Timing attacks** e comparação em tempo constante
- [ ] Políticas de senha modernas (NIST SP 800-63B) — comprimento > complexidade
- [ ] **Credential stuffing**, **brute force**, **dictionary attack**
- [ ] **HIBP (Have I Been Pwned)** — checagem de senhas vazadas
- [ ] HTTP Basic Auth (apenas para entender, **não usar** em produção sem TLS)

### 🎯 Lições principais

- [ ] Sei escolher e configurar um algoritmo de hash de senha
- [ ] Entendo o trade-off entre segurança e UX em políticas de senha
- [ ] Reconheço por que comparações de hash exigem cuidado

### 🛠️ Incremento no projeto

- [ ] Adicionar campos `email` e `passwordHash` à entidade `User`
- [ ] Endpoint `POST /auth/register` com validação de e-mail e força de senha
- [ ] Hash de senha com **argon2id** (recomendado) ou **bcrypt** com cost ≥ 12
- [ ] Endpoint `POST /auth/login` que retorna apenas sucesso/falha (ainda sem token)
- [ ] Tela de registro e login no React
- [ ] Mensagens de erro **genéricas** para não vazar se o e-mail existe ("credenciais inválidas")
- [ ] Integração opcional com HIBP API para bloquear senhas vazadas

### ✅ Critérios de conclusão

- [ ] Senhas no banco estão sempre hasheadas
- [ ] Você consegue explicar por que `if (user.password === input)` é um erro grave
- [ ] Mensagens de erro não vazam existência de usuários

---

# Etapa 2 — Sessões & Cookies

> **Objetivo:** Manter o usuário autenticado entre requisições usando sessões server-side.

### 📚 Conceitos a estudar

- [ ] O que é uma **sessão** e como ela resolve a natureza stateless do HTTP
- [ ] Anatomia de um **cookie**: `Domain`, `Path`, `Expires`, `Max-Age`
- [ ] Flags de segurança: **HttpOnly**, **Secure**, **SameSite (Strict/Lax/None)**
- [ ] Armazenamento de sessão: in-memory, Redis, banco de dados
- [ ] **Session fixation** e como prevenir (regenerar ID no login)
- [ ] **Session hijacking** e mitigações
- [ ] **Idle timeout** vs. **absolute timeout**
- [ ] Logout: invalidação de sessão server-side
- [ ] Logout global ("logout em todos os dispositivos")
- [ ] Quando preferir sessões vs. tokens (cookies vs. JWT) — debate clássico

### 🎯 Lições principais

- [ ] Sei configurar cookies de sessão com as flags corretas
- [ ] Entendo o ciclo de vida completo de uma sessão
- [ ] Sei revogar sessões individualmente ou em massa

### 🛠️ Incremento no projeto

- [ ] Adicionar `@nestjs/passport` + `passport-local` (ou implementação manual)
- [ ] Armazenamento de sessão em **Redis** com `connect-redis` / equivalente
- [ ] Cookie de sessão com `HttpOnly`, `Secure`, `SameSite=Lax`
- [ ] Endpoint `POST /auth/logout` que destrói a sessão
- [ ] Endpoint `GET /auth/me` que retorna o usuário autenticado
- [ ] Tela `/profile` no front que consome `/auth/me`
- [ ] Endpoint `GET /auth/sessions` listando sessões ativas
- [ ] Endpoint `DELETE /auth/sessions/:id` para revogar uma sessão específica
- [ ] Endpoint `POST /auth/logout-all` para revogar todas

### ✅ Critérios de conclusão

- [ ] Cookies inspecionados no DevTools mostram todas as flags corretas
- [ ] Logout invalida a sessão imediatamente no servidor
- [ ] Usuário consegue ver e encerrar sessões ativas pela UI

---

# Etapa 3 — JWT & Stateless Auth

> **Objetivo:** Entender autenticação baseada em tokens e implementar JWT corretamente.

### 📚 Conceitos a estudar

- [ ] Anatomia de um **JWT**: header, payload, signature
- [ ] Diferença entre **JWS** (signed) e **JWE** (encrypted)
- [ ] Algoritmos de assinatura: **HS256** (simétrico) vs. **RS256/ES256** (assimétricos)
- [ ] **Claims** padrão (RFC 7519): `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti`
- [ ] Claims customizados — o que colocar (e o que **não** colocar)
- [ ] Por que payload é apenas **codificado**, não criptografado
- [ ] **JWKS** (JSON Web Key Set) e rotação de chaves
- [ ] **Stateless vs. stateful**: vantagens e desvantagens de JWT
- [ ] O problema clássico da **revogação de JWT** (não é trivial revogar)
- [ ] Onde armazenar no cliente: `localStorage` vs. cookie `HttpOnly` (debate XSS vs. CSRF)
- [ ] Vulnerabilidades conhecidas: `alg: none`, confusão HS/RS, expiração ausente

### 🎯 Lições principais

- [ ] Sei gerar e validar JWTs com segurança
- [ ] Entendo os trade-offs entre sessões e tokens
- [ ] Sei evitar as armadilhas comuns de implementação

### 🛠️ Incremento no projeto

- [ ] Substituir (ou coexistir com) sessões por **JWT** usando `@nestjs/jwt`
- [ ] Assinatura com **RS256** e par de chaves
- [ ] Endpoint `POST /auth/login` agora retorna `accessToken` (curto, 15min)
- [ ] Guard `JwtAuthGuard` protegendo rotas
- [ ] Decorator `@CurrentUser()` extraindo o `sub` do token
- [ ] No front, interceptor do Axios/Fetch adicionando `Authorization: Bearer`
- [ ] Endpoint `GET /.well-known/jwks.json` expondo a chave pública
- [ ] Documentar em ADR a decisão de stack (cookies vs. localStorage e por quê)

### ✅ Critérios de conclusão

- [ ] Você consegue decodificar manualmente um JWT do seu sistema em jwt.io
- [ ] Tentativas de adulteração do token são rejeitadas
- [ ] Tokens expirados são rejeitados com `401`

---

# Etapa 4 — Refresh Tokens & Rotação

> **Objetivo:** Permitir sessões longas sem sacrificar segurança, usando refresh tokens.

### 📚 Conceitos a estudar

- [ ] Por que access tokens devem ser **curtos** (5-15 min)
- [ ] O que é um **refresh token** e por que ele difere do access token
- [ ] **Refresh token rotation**: emitir novo refresh a cada uso
- [ ] **Reuse detection**: detectar uso de refresh token já consumido
- [ ] **Token family** e invalidação em cadeia ao detectar reuso
- [ ] Armazenamento de refresh tokens: hash no banco (como senha)
- [ ] **Sliding expiration** vs. **absolute expiration**
- [ ] **Device binding** e fingerprinting básico
- [ ] Sincronização de logout entre abas (BroadcastChannel API)

### 🎯 Lições principais

- [ ] Sei implementar rotação segura de refresh tokens
- [ ] Sei detectar e responder a tentativas de roubo de token
- [ ] Entendo como balancear UX (não relogar) com segurança

### 🛠️ Incremento no projeto

- [ ] Tabela `RefreshToken` com `userId`, `tokenHash`, `familyId`, `expiresAt`, `revokedAt`
- [ ] Endpoint `POST /auth/refresh` que troca refresh por novo par de tokens
- [ ] Refresh token entregue em **cookie HttpOnly** separado do access token
- [ ] Implementar **detecção de reuso**: se um refresh já usado for apresentado, revogar toda a família
- [ ] No front: interceptor que captura `401`, chama `/auth/refresh`, repete a requisição
- [ ] Botão "Sair de todos os dispositivos" revoga todas as famílias do usuário
- [ ] Auditoria mínima: log de cada refresh e cada detecção de reuso

### ✅ Critérios de conclusão

- [ ] Usuário não é deslogado durante uso normal mesmo após muito tempo
- [ ] Reuso de refresh token derruba toda a cadeia daquele dispositivo
- [ ] Logs registram corretamente cada operação de token

---

# Etapa 5 — Autorização: RBAC

> **Objetivo:** Implementar controle de acesso baseado em papéis (Role-Based Access Control).

### 📚 Conceitos a estudar

- [ ] Pilares de autorização: **subject**, **action**, **resource**, **context**
- [ ] **RBAC** clássico: usuários → papéis → permissões
- [ ] **Hierarquia de papéis** (admin > member > guest)
- [ ] **RBAC com escopo** (papel dentro de um workspace, não global)
- [ ] **Permission** vs. **Role** — granularidade
- [ ] Princípio do **menor privilégio** (least privilege)
- [ ] **Separation of duties**
- [ ] Onde implementar a checagem: guard, decorator, service, middleware
- [ ] Limitações do RBAC puro (role explosion)

### 🎯 Lições principais

- [ ] Sei modelar papéis e permissões de forma escalável
- [ ] Sei aplicar checagens em camadas diferentes da aplicação
- [ ] Reconheço quando RBAC puro deixa de ser suficiente

### 🛠️ Incremento no projeto

- [ ] Enum `Role` com `OWNER`, `ADMIN`, `MEMBER`, `GUEST`
- [ ] `Membership` carrega o `role` do usuário naquele workspace
- [ ] Decorator `@Roles(Role.ADMIN, Role.OWNER)` + `RolesGuard`
- [ ] Aplicar regras de negócio:
  - [ ] Apenas `OWNER` pode deletar o workspace
  - [ ] `OWNER` e `ADMIN` podem convidar membros
  - [ ] `GUEST` só pode ler tasks
- [ ] UI esconde/desabilita botões conforme o papel
- [ ] **Defesa em profundidade**: backend sempre valida, mesmo que a UI esconda
- [ ] Endpoint `GET /workspaces/:id/permissions` retorna as permissões efetivas do usuário

### ✅ Critérios de conclusão

- [ ] Tentar uma ação sem permissão retorna `403 Forbidden`
- [ ] UI reflete fielmente o que o usuário pode fazer
- [ ] Nenhuma regra de autorização vive **apenas** no front

---

# Etapa 6 — Autorização: ABAC / PBAC / ReBAC

> **Objetivo:** Expressar políticas mais ricas que dependem de atributos, contexto e relações.

### 📚 Conceitos a estudar

- [ ] **ABAC** (Attribute-Based) — decisões baseadas em atributos de subject, resource, action, environment
- [ ] **PBAC** (Policy-Based) — políticas declarativas separadas do código
- [ ] **ReBAC** (Relationship-Based) — modelo do Google Zanzibar / OpenFGA
- [ ] **PDP** (Policy Decision Point) vs. **PEP** (Policy Enforcement Point)
- [ ] Linguagens de política: **Rego (OPA)**, **Cedar (AWS)**, **XACML**
- [ ] **CASL** (biblioteca JS popular para autorização)
- [ ] **Ownership checks** e seu lugar na hierarquia de regras
- [ ] **Field-level authorization**: esconder atributos específicos
- [ ] **Tenant isolation** em sistemas multi-tenant

### 🎯 Lições principais

- [ ] Sei expressar regras complexas como políticas
- [ ] Sei separar lógica de autorização da lógica de negócio
- [ ] Entendo quando vale a pena externalizar autorização

### 🛠️ Incremento no projeto

- [ ] Adotar **CASL** para expressar habilidades por contexto:
  - [ ] "Usuário pode editar uma task se for o autor **ou** for admin do workspace"
  - [ ] "Comentário só pode ser deletado pelo autor nas primeiras 24h"
- [ ] Implementar `AbilityFactory` que retorna abilities por usuário+contexto
- [ ] Guard `PoliciesGuard` que usa CASL
- [ ] **Field-level**: ocultar `email` de outros usuários para `GUEST`
- [ ] (Opcional) Prova de conceito com **OPA** rodando em sidecar, com políticas em Rego
- [ ] (Opcional) Prova de conceito com **OpenFGA** para modelar relações

### ✅ Critérios de conclusão

- [ ] Regras compostas funcionam (papel + ownership + tempo)
- [ ] Você consegue adicionar uma nova regra sem tocar nos controllers
- [ ] Decisões de autorização são testáveis isoladamente

---

# Etapa 7 — Recuperação, Verificação & Magic Links

> **Objetivo:** Implementar fluxos auxiliares de identidade de forma segura.

### 📚 Conceitos a estudar

- [ ] Verificação de e-mail e por que ela importa
- [ ] **Tokens de uso único** (one-time tokens) — geração e armazenamento
- [ ] **Token entropy**: por que `Math.random()` não serve
- [ ] **Expiração curta** para tokens sensíveis (15 min - 1h)
- [ ] **Magic links** — login sem senha por e-mail
- [ ] **Account enumeration** via fluxos de recuperação (e como evitar)
- [ ] **Rate limiting** específico em endpoints sensíveis
- [ ] **E-mail spoofing** — SPF, DKIM, DMARC (visão geral)
- [ ] Mudança de e-mail e mudança de senha: requerem confirmação?
- [ ] Por que **invalidar todas as sessões** ao trocar senha

### 🎯 Lições principais

- [ ] Sei desenhar fluxos de recuperação que não vazam informação
- [ ] Sei gerar tokens com entropia adequada
- [ ] Entendo o ciclo de vida de tokens efêmeros

### 🛠️ Incremento no projeto

- [ ] Subir **MailHog** no docker-compose para inspecionar e-mails localmente
- [ ] `POST /auth/verify-email/request` envia link com token
- [ ] `POST /auth/verify-email/confirm` valida e marca `emailVerifiedAt`
- [ ] `POST /auth/password/forgot` — sempre retorna 200 (não vaza existência)
- [ ] `POST /auth/password/reset` com token de uso único
- [ ] Trocar senha invalida todas as sessões e refresh tokens
- [ ] (Opcional) Implementar **magic link login** como alternativa à senha
- [ ] Rate limiting por IP **e** por e-mail nos endpoints de recuperação

### ✅ Critérios de conclusão

- [ ] Tokens nunca são reutilizáveis
- [ ] Endpoints sensíveis têm rate limiting visível
- [ ] Resposta de "esqueci a senha" é idêntica para e-mails existentes e inexistentes

---

# Etapa 8 — 2FA & MFA

> **Objetivo:** Adicionar uma segunda camada de autenticação, com múltiplos fatores possíveis.

### 📚 Conceitos a estudar

- [ ] Os três fatores clássicos: **algo que você sabe / tem / é**
- [ ] **2FA vs. MFA** — diferença prática e quando exigir
- [ ] **TOTP** (RFC 6238) — como funciona o algoritmo do Google Authenticator
- [ ] **HOTP** (RFC 4226) — versão baseada em contador
- [ ] **Secret provisioning** — QR codes e o formato `otpauth://`
- [ ] **Recovery codes** — geração, exibição única, hash no banco
- [ ] **SMS OTP** — por que é o fator mais fraco (SIM swapping)
- [ ] **E-mail OTP** — adequado para alguns casos
- [ ] **Push notifications** como segundo fator (ex.: Duo, Microsoft Authenticator)
- [ ] **Step-up authentication** — exigir 2FA só para ações críticas
- [ ] **AAL (Authenticator Assurance Levels)** — NIST AAL1/2/3
- [ ] Fluxo de **trusted device** ("não pedir 2FA aqui por 30 dias")

### 🎯 Lições principais

- [ ] Sei implementar TOTP do zero (entendendo o algoritmo)
- [ ] Sei desenhar UX de 2FA que não trava o usuário fora
- [ ] Sei aplicar step-up auth em momentos certos

### 🛠️ Incremento no projeto

- [ ] Endpoint `POST /auth/2fa/setup` gera secret + QR code (lib `otplib`)
- [ ] Endpoint `POST /auth/2fa/enable` valida o primeiro código e ativa
- [ ] Geração de **10 recovery codes**, exibidos uma única vez, hasheados no banco
- [ ] Login passa a ser em duas etapas se 2FA ativo: senha → código
- [ ] **MFA token intermediário** entre as etapas (curto, 5min)
- [ ] Endpoint `POST /auth/2fa/disable` exige senha + código atual
- [ ] **Step-up auth**: exigir 2FA fresco (< 5min) para deletar workspace
- [ ] UI com QR code, campo de código, lista de recovery codes
- [ ] (Opcional) Suporte a **WebAuthn** já aqui como segundo fator (preparação para Etapa 11)

### ✅ Critérios de conclusão

- [ ] Você consegue logar com TOTP usando Google Authenticator real
- [ ] Recovery codes funcionam quando o app autenticador é "perdido"
- [ ] Ações sensíveis exigem reautenticação recente

---

# Etapa 9 — OAuth 2.0 & OpenID Connect

> **Objetivo:** Entender o protocolo padrão de delegação e implementar login social.

### 📚 Conceitos a estudar

- [ ] Por que **OAuth 2.0 não é autenticação** — é autorização delegada
- [ ] Atores: **Resource Owner**, **Client**, **Authorization Server**, **Resource Server**
- [ ] **Grants/Flows** do OAuth 2.0:
  - [ ] Authorization Code (recomendado para apps web)
  - [ ] **Authorization Code + PKCE** (recomendado para SPAs e mobile)
  - [ ] Client Credentials (machine-to-machine)
  - [ ] Device Code (TVs, CLIs)
  - [ ] Implicit (**obsoleto**)
  - [ ] Resource Owner Password (**obsoleto**)
- [ ] **Scopes** — granularidade da delegação
- [ ] **State parameter** — proteção contra CSRF
- [ ] **PKCE** (RFC 7636) — `code_verifier` e `code_challenge`
- [ ] **OpenID Connect (OIDC)** — camada de autenticação sobre OAuth 2.0
- [ ] **ID Token** vs. **Access Token** — diferença essencial
- [ ] **UserInfo endpoint**
- [ ] **Discovery** (`/.well-known/openid-configuration`)
- [ ] **Account linking** — ligar provedor externo a conta local
- [ ] Riscos: **redirect URI hijacking**, **mix-up attacks**, **token leakage**

### 🎯 Lições principais

- [ ] Sei explicar o fluxo Authorization Code + PKCE em um diagrama
- [ ] Sei integrar com qualquer provedor OIDC sem ler tutorial
- [ ] Reconheço por que o Implicit Flow é considerado inseguro hoje

### 🛠️ Incremento no projeto

- [ ] Login social com **Google** via OAuth Authorization Code + PKCE
- [ ] Login social com **GitHub**
- [ ] Tabela `LinkedAccount` (`provider`, `providerUserId`, `userId`)
- [ ] Fluxo de **account linking**: usuário logado pode vincular contas
- [ ] Tratar caso de e-mail já existente (vincular automaticamente? exigir confirmação?)
- [ ] Validar `state` e `nonce`
- [ ] Validar **ID Token** com JWKS do provedor
- [ ] Front-end: botões "Continuar com Google/GitHub"

### ✅ Critérios de conclusão

- [ ] Você consegue logar via Google e o usuário é criado/vinculado corretamente
- [ ] Tentativa de adulteração de `state` é rejeitada
- [ ] ID Token é validado contra a JWKS do provedor

---

# Etapa 10 — SSO Empresarial: SAML

> **Objetivo:** Compreender e implementar SSO no padrão usado por organizações.

### 📚 Conceitos a estudar

- [ ] O que é **SSO** e por que empresas exigem
- [ ] **SAML 2.0** — visão geral, baseado em XML
- [ ] **SP-initiated** vs. **IdP-initiated** flow
- [ ] **Metadata XML** — como SP e IdP se conhecem
- [ ] **Assertions**: autenticação, atributos, autorização
- [ ] **Signatures** e validação de XML — atenção a **XML Signature Wrapping attacks**
- [ ] **SLO** (Single Logout) — e por que costuma ser problemático
- [ ] **Just-in-Time provisioning** vs. **SCIM** para sincronização de usuários
- [ ] **SCIM 2.0** — protocolo para provisioning/deprovisioning
- [ ] Comparação **SAML vs. OIDC** — quando cada um é exigido
- [ ] **Domain-based routing** — descobrir IdP a partir do e-mail
- [ ] **Multi-tenant SSO** — cada cliente com seu próprio IdP

### 🎯 Lições principais

- [ ] Sei configurar SAML SP do zero contra um IdP de teste
- [ ] Entendo as armadilhas de segurança específicas de XML/SAML
- [ ] Sei desenhar SSO em produto multi-tenant

### 🛠️ Incremento no projeto

- [ ] Subir **Keycloak** via Docker como IdP de testes
- [ ] Integrar TaskFlow como **SP SAML** usando `@node-saml/passport-saml` ou similar
- [ ] Configurar SP-initiated login
- [ ] Mapear atributos SAML para campos do `User`
- [ ] **JIT provisioning**: criar usuário automaticamente na primeira autenticação SSO
- [ ] Adicionar conceito de **Organization** com `ssoConfig` próprio
- [ ] **Domain-based routing**: ao digitar `user@empresa.com`, redirecionar para o IdP correto
- [ ] (Opcional avançado) Endpoint **SCIM 2.0** para provisioning vindo do IdP

### ✅ Critérios de conclusão

- [ ] Você consegue logar via Keycloak (SAML) no TaskFlow
- [ ] Cada `Organization` pode ter seu próprio IdP
- [ ] Você sabe descrever 2+ ataques específicos a SAML

---

# Etapa 11 — Passkeys / WebAuthn / FIDO2

> **Objetivo:** Implementar autenticação sem senha usando o padrão moderno.

### 📚 Conceitos a estudar

- [ ] Por que senhas estão morrendo — phishing, reuso, vazamentos
- [ ] **FIDO2** ecosystem: WebAuthn + CTAP
- [ ] **WebAuthn** — API do navegador
- [ ] **Authenticators**: platform (Touch ID, Windows Hello) vs. roaming (YubiKey)
- [ ] **Passkeys** — credencial WebAuthn sincronizada na nuvem (Apple, Google, Microsoft)
- [ ] **Cryptographic ceremony**: registration (attestation) e authentication (assertion)
- [ ] **Public/private key pair** por origem — por isso é phishing-resistant
- [ ] **Resident keys / discoverable credentials**
- [ ] **User verification** (UV) — biometria/PIN local
- [ ] **Attestation** — verificar autenticidade do autenticador
- [ ] Estratégias de migração: WebAuthn como 2º fator → como passwordless
- [ ] Account recovery em mundo sem senha — desafios reais

### 🎯 Lições principais

- [ ] Sei implementar registro e login com WebAuthn
- [ ] Entendo por que passkeys são phishing-resistant
- [ ] Sei desenhar recuperação de conta sem cair de volta em senha

### 🛠️ Incremento no projeto

- [ ] Adicionar lib `@simplewebauthn/server` (back) e `@simplewebauthn/browser` (front)
- [ ] Endpoints `POST /webauthn/register/options` e `/register/verify`
- [ ] Endpoints `POST /webauthn/login/options` e `/login/verify`
- [ ] Tabela `Authenticator` (`credentialId`, `publicKey`, `counter`, `transports`)
- [ ] UI em "Configurações" para registrar passkey
- [ ] Suportar **múltiplos passkeys por usuário**
- [ ] Login com botão "Entrar com passkey" (sem digitar e-mail, usando discoverable credentials)
- [ ] Fallback: se passkey indisponível, continuar com senha + TOTP

### ✅ Critérios de conclusão

- [ ] Você consegue logar usando Touch ID / Windows Hello / passkey iCloud
- [ ] Usuário gerencia seus passkeys (renomear, remover)
- [ ] Sistema permanece utilizável se o passkey for perdido

---

# Etapa 12 — Segurança Avançada & Hardening

> **Objetivo:** Tratar a aplicação como alvo real de ataque e blindar transversalmente.

### 📚 Conceitos a estudar

- [ ] **OWASP Top 10** em detalhe, com foco nos relacionados a identidade
- [ ] **CSRF** — origem do ataque, double-submit cookie, SameSite, tokens síncronos
- [ ] **XSS** — Stored, Reflected, DOM-based; **Content Security Policy (CSP)**
- [ ] **Clickjacking** — `X-Frame-Options`, `frame-ancestors`
- [ ] **CORS** — não é segurança, é relaxamento de Same-Origin Policy
- [ ] **Security headers**: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] **Rate limiting** — por IP, por usuário, por endpoint; token bucket vs. sliding window
- [ ] **Account lockout** vs. **CAPTCHA** vs. **progressive delays**
- [ ] **Brute force protection** específico para login, recovery, 2FA
- [ ] **Audit logging** — o que logar, o que **não** logar (segredos!)
- [ ] **PII handling** — princípios de privacidade, LGPD/GDPR básico
- [ ] **Secrets management** — variáveis de ambiente, Vault, KMS
- [ ] **Dependency scanning** — Snyk, Dependabot, `npm audit`
- [ ] **Anomaly detection** básico — login geograficamente improvável

### 🎯 Lições principais

- [ ] Sei configurar headers e CSP em produção
- [ ] Sei dimensionar rate limits sem prejudicar usuários reais
- [ ] Sei o que registrar em logs de segurança e por quanto tempo

### 🛠️ Incremento no projeto

- [ ] Helmet/equivalente configurado com CSP restritiva
- [ ] HSTS ativo, com pre-load planejado
- [ ] Rate limiting em login, registro, recovery (`@nestjs/throttler` + storage Redis)
- [ ] **Account lockout progressivo**: 5 tentativas → atraso de 1s, depois 5s, depois 30s
- [ ] **Audit log** persistido: login (sucesso/falha), troca de senha, 2FA toggle, mudanças de papel
- [ ] Painel "Atividade da conta" mostrando últimos logins com IP/User-Agent/local
- [ ] Notificação por e-mail em eventos críticos (novo dispositivo, troca de senha)
- [ ] Validação de input com `class-validator` em **toda** entrada
- [ ] Sanitização de output onde HTML é renderizado
- [ ] CI rodando `npm audit` e `eslint-plugin-security`

### ✅ Critérios de conclusão

- [ ] Aplicação obtém nota A+ em [securityheaders.com](https://securityheaders.com)
- [ ] Brute force em login é praticamente inviável
- [ ] Logs permitem reconstruir o que aconteceu numa conta nos últimos 90 dias

---

# Etapa 13 — Provedor de Identidade Centralizado

> **Objetivo:** Externalizar identidade para um IdP dedicado e entender o papel deles.

### 📚 Conceitos a estudar

- [ ] Build vs. buy em identidade — quando vale a pena
- [ ] Players principais: **Keycloak**, **Auth0**, **Okta**, **AWS Cognito**, **Azure AD / Entra ID**, **Clerk**, **Stytch**, **WorkOS**, **Logto**, **Authentik**
- [ ] **Realms / Tenants** em IdPs
- [ ] **Federated identity** — IdP de IdPs
- [ ] **Token exchange** (RFC 8693)
- [ ] **Back-channel logout** vs. front-channel
- [ ] **Custom claims** e mapeamento de atributos
- [ ] **Brokering** — IdP intermediando outros IdPs
- [ ] Como migrar uma base de usuários sem forçar troca de senha (re-hash on login)

### 🎯 Lições principais

- [ ] Sei avaliar trade-offs entre IdP gerenciado e self-hosted
- [ ] Sei delegar TODO o stack de identidade para um IdP
- [ ] Sei migrar usuários existentes para um IdP sem fricção

### 🛠️ Incremento no projeto

- [ ] Configurar **Keycloak** como IdP principal do TaskFlow
- [ ] Migrar autenticação para `keycloak-connect` / `nestjs-keycloak-admin`
- [ ] Mover roles e grupos para o Keycloak
- [ ] Validar tokens emitidos pelo Keycloak via JWKS
- [ ] Configurar **brokering**: Keycloak por trás, Google/GitHub/SAML na frente
- [ ] Implementar **back-channel logout** recebendo notificações do IdP
- [ ] (Opcional) Comparar a mesma feature implementada com **Auth0** ou **Clerk** em branch separado

### ✅ Critérios de conclusão

- [ ] TaskFlow não armazena mais senhas — Keycloak armazena
- [ ] Logout no Keycloak desloga em todas as apps que dependem dele
- [ ] Você consegue articular por que escolheria self-hosted vs. SaaS

---

# Etapa 14 — Zero Trust & Tópicos Modernos

> **Objetivo:** Entender o estado da arte e direções futuras de identidade.

### 📚 Conceitos a estudar

- [ ] Princípios **Zero Trust**: "never trust, always verify"
- [ ] **BeyondCorp** (Google) — perímetro é a identidade, não a rede
- [ ] **Continuous authentication** — reavaliação durante a sessão
- [ ] **Risk-based authentication / Adaptive MFA** — sinais comportamentais
- [ ] **Device trust** — postura do dispositivo influencia decisão
- [ ] **mTLS** (mutual TLS) — autenticação em camada de transporte
- [ ] **Workload identity** — SPIFFE/SPIRE
- [ ] **Service-to-service auth** — JWT-SVID, mTLS, mesh (Istio, Linkerd)
- [ ] **DPoP** (Demonstrating Proof of Possession) — bind de tokens ao cliente
- [ ] **Token binding** e por que tokens portáveis são um problema
- [ ] **Decentralized identity / SSI** — DIDs, Verifiable Credentials, W3C
- [ ] **CIBA** (Client-Initiated Backchannel Authentication)
- [ ] **GNAP** — sucessor experimental de OAuth 2.0
- [ ] **Privacy-preserving auth** — Private Access Tokens, blind signatures

### 🎯 Lições principais

- [ ] Sei descrever o modelo Zero Trust em termos práticos
- [ ] Conheço o estado da arte e sei para onde a área caminha
- [ ] Sei distinguir hype de adoção real

### 🛠️ Incremento no projeto

- [ ] Implementar **risk score** no login considerando: novo dispositivo, novo país (via GeoIP), horário atípico, velocidade impossível
- [ ] Forçar **step-up MFA** quando risk score ultrapassa limiar
- [ ] **Continuous re-evaluation**: a cada N minutos, revalidar políticas (ex.: token revogado, role mudou)
- [ ] Notificação "novo login de [local] em [dispositivo]" com botão "não fui eu"
- [ ] (Opcional avançado) **mTLS** entre serviços do back-end usando SPIRE
- [ ] (Opcional avançado) **DPoP** nos access tokens
- [ ] Documentação final do projeto, com diagrama de arquitetura de identidade completo

### ✅ Critérios de conclusão

- [ ] Login arriscado dispara MFA adicional automaticamente
- [ ] Sessão é interrompida se condições mudarem (role removida, IP suspeito)
- [ ] Você consegue defender suas decisões de arquitetura em uma entrevista sênior

---

# 📖 Glossário rápido

| Termo                   | Significado                                               |
| ----------------------- | --------------------------------------------------------- |
| **AuthN**               | Authentication — provar quem você é                       |
| **AuthZ**               | Authorization — provar o que você pode                    |
| **IdP**                 | Identity Provider — serviço que autentica usuários        |
| **SP**                  | Service Provider — serviço que delega autenticação ao IdP |
| **PEP**                 | Policy Enforcement Point — quem aplica a decisão          |
| **PDP**                 | Policy Decision Point — quem decide                       |
| **JWT**                 | JSON Web Token                                            |
| **JWS / JWE**           | JWT Signed / Encrypted                                    |
| **JWKS**                | JSON Web Key Set                                          |
| **OIDC**                | OpenID Connect — autenticação sobre OAuth 2.0             |
| **SAML**                | Security Assertion Markup Language                        |
| **TOTP / HOTP**         | Time / HMAC based One-Time Password                       |
| **RBAC / ABAC / ReBAC** | Role / Attribute / Relationship Based Access Control      |
| **MFA / 2FA**           | Multi / Two-Factor Authentication                         |
| **SCIM**                | System for Cross-domain Identity Management               |
| **FIDO2**               | Fast IDentity Online v2 (WebAuthn + CTAP)                 |
| **PKCE**                | Proof Key for Code Exchange                               |
| **DPoP**                | Demonstrating Proof-of-Possession                         |
| **SSO / SLO**           | Single Sign-On / Single Logout                            |

---

# 📚 Recursos recomendados

### Documentação canônica

- **OWASP Authentication Cheat Sheet**
- **OWASP Authorization Cheat Sheet**
- **OWASP Session Management Cheat Sheet**
- **OWASP JWT for Java Cheat Sheet** (princípios servem para qualquer linguagem)
- **NIST SP 800-63B** — Digital Identity Guidelines (referência mundial)
- **RFC 6749** (OAuth 2.0), **RFC 7519** (JWT), **RFC 6238** (TOTP)
- **OpenID Connect Core 1.0**

### Livros

- _API Security in Action_ — Neil Madden
- _OAuth 2 in Action_ — Justin Richer & Antonio Sanso
- _Identity and Data Security for Web Development_ — Jonathan LeBlanc

### Vídeos / cursos

- Canal **OktaDev** no YouTube (especialmente "OAuth in 5 minutes" e séries derivadas)
- **PortSwigger Web Security Academy** — labs gratuitos e práticos
- **Cybr** — trilhas de application security

### Ferramentas para brincar

- **jwt.io** — decodificar JWTs
- **Burp Suite Community** — interceptar e modificar requisições
- **OWASP ZAP** — scanner gratuito
- **Hydra (ORY)** e **Keycloak** — IdPs locais para experimentar

---

# 🏁 Como usar este plano

1. **Não pule etapas.** Cada uma depende do vocabulário e do projeto da anterior.
2. **Implemente antes de seguir.** A teoria sem mãos no teclado evapora rápido.
3. **Quebre coisas de propósito.** Tente burlar suas próprias proteções — é o melhor jeito de validar.
4. **Documente decisões.** Mantenha um `/docs/adr` (Architecture Decision Records) explicando por que escolheu X em vez de Y.
5. **Revisite etapas.** À medida que avança, volte e refine implementações anteriores com o que aprendeu.

> Ao final das 14 etapas, você terá implementado um sistema de identidade comparável aos de produtos reais de mercado, com domínio do espaço inteiro — do hash de senha até Zero Trust.

**Boa jornada. 🚀**

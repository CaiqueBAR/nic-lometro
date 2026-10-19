# Nicolômetro 💗

Site para acompanhar o humor da Nicole (1–10), sincronizado em tempo real entre você e ela.

## Como colocar no ar

### 1) Criar o projeto Firebase (grátis, 2 min)

1. Vai em https://console.firebase.google.com → **Add project** → dá um nome (ex: `nicolometro`) → pode desativar Google Analytics.
2. No menu lateral, **Build → Realtime Database → Create Database** → escolhe a região → começa em **test mode** (depois a gente aperta as regras).
3. No menu lateral, clica na engrenagem ⚙️ → **Project settings** → role até **Your apps** → clica no ícone `</>` (web) → dá um apelido → **Register app**.
4. Copia o objeto `firebaseConfig` que aparece e cola em [`firebase-config.js`](firebase-config.js) substituindo os placeholders.

### 2) (Opcional, mas recomendado) Regras da database

Em **Realtime Database → Rules**, cola isso pra qualquer um poder ler/escrever só no nó `mood`:

```json
{
  "rules": {
    "mood": {
      ".read": true,
      ".write": true
    }
  }
}
```

> Como o site é público, qualquer um que tiver o link pode mudar o humor. Pra uma versão fechada depois, dá pra ligar o Firebase Auth (login com Google) e restringir pelo UID de vocês dois.

### 3) Publicar no GitHub Pages

```bash
git init
git add .
git commit -m "nicolômetro inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/nicolometro.git
git push -u origin main
```

No GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root → Save**.
Em ~1 min o site tá em `https://SEU_USUARIO.github.io/nicolometro/`.

## Como funciona

- O humor fica salvo num nó `mood` do Realtime Database.
- Quando ela mexe no slider e clica em **Salvar**, grava `{ level, updatedAt }`.
- Qualquer navegador aberto no site atualiza na hora via `onValue` (listener do Firebase).

# GlobalLove.com — Technical Audit Report (Phase 1)

**Project:** GlobalLove.com (`https://globallove.vercel.app`)  
**Audit Date:** 2026-11-16  
**Stack Inspected:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Express (`server.ts`, local/dev only) + Vercel SPA Hosting (`vercel.json`)  
**Audit Method:** Complete source inspection of `src/`, `public/`, `index.html`, `package.json`, `vercel.json`, `server.ts`, `tsconfig.json`, and `npx tsc --noEmit`.

---

## Executive Summary

The existing application provides a polished landing experience, 92+ country/city/guide SEO pages, 8-language translation dictionary (`src/i18n/translations.ts`), and rich client-side UI flows. However, **all core dating, authentication, matching, messaging, moderation, and administrative features currently operate purely in browser `localStorage` with hardcoded mock data and zero server/database enforcement**. Because production is hosted on Vercel (`https://globallove.vercel.app`) as a static Vite SPA, integrating **Firebase Authentication + Cloud Firestore** with strict `firestore.rules` provides a real, scalable, multi-user backend across both preview and Vercel production without breaking static deployment.

---

## Prioritized Findings (Evidence-Backed)

### CRITICAL

1. **No Real Database or Cross-User Persistence**
   - **Evidence:** `src/context/AppContext.tsx:83-98`, `src/data/mockProfiles.ts:1-433`, `server.ts`.
   - **Impact:** Profiles, likes, passes, matches, chat messages, mural posts, analytics, and registered users (`globallove_users_list_real_v1`) exist solely in the local browser's `localStorage`. Two users on separate devices cannot discover, match, or chat with one another.

2. **Broken Authentication, Unverified Sessions, & Missing Password Recovery / Email Verification**
   - **Evidence:** `src/pages/Entrar.tsx:165,189-196`, `src/context/AppContext.tsx:850-912`.
   - **Impact:** `handleSignIn` accepts any non-empty password without credential verification (`loginUser(loginEmail.trim())`). Registration hardcodes `verificado: true` without verifying email ownership, password hashing, or session tokens. Password reset and email verification flows are absent.

3. **Unprotected Admin Dashboard Exposing PII & Destructive Controls**
   - **Evidence:** `src/App.tsx:54`, `src/pages/Admin.tsx:26-40,519,530-546`, `src/components/layout/Header.tsx:138-163`, `src/components/layout/Footer.tsx:73-78`.
   - **Impact:** Any anonymous visitor can navigate to `/admin` (linked publicly in Header and Footer), view registered users' emails and locations, suspend/delete users, reset audit metrics, export JSON reports, and edit the SuperAdmin profile. Zero role-based access control (RBAC) exists.

4. **Simulated Auto-Matching, Fake Chat Auto-Replies, & Hardcoded Likes Counter**
   - **Evidence:** `src/context/AppContext.tsx:269-328` (pre-populated `match_camila` & `match_mateo`), `:519` (`const isMatch = true;`), `:614-682` (`Realistic auto-reply simulation`), `:729-757` (simulated media replies); `src/pages/Matches.tsx:41,55-75` (hardcoded `"12 pessoas curtiram você"` and 5 static profiles).
   - **Impact:** Every swipe creates an instant fake match; chat messages trigger scripted `setTimeout` bot replies; the "Who Liked You" section displays hardcoded mock users.

5. **Public Exposure of Residential Addresses & Exact Coordinates**
   - **Evidence:** `src/types/index.ts:37,49-50`, `src/pages/Entrar.tsx:483`, `src/pages/Descobrir.tsx:272`, `src/pages/Mapa.tsx:91`.
   - **Impact:** Full residential street/neighborhood strings (`profile.endereco`) and exact `latitude`/`longitude` are stored on public `Profile` records and rendered directly in Discovery cards and map pin placement. Users lack privacy settings to hide location or mask exact coordinates.

---

### HIGH

6. **Missing Blocking, Reporting, & Self-Service Account Deletion**
   - **Evidence:** Mentioned in policy copy (`src/data/institutional.ts:81,145`), absent in UI and `AppContext.tsx`.
   - **Impact:** Users cannot block abusive accounts (to prevent chat/discovery visibility), submit moderation reports linked to Admin review, or delete their own account and data per LGPD/GDPR requirements.

7. **Simulated Video Call & Unvalidated File Uploads**
   - **Evidence:** `src/components/chat/VideoCallModal.tsx:35-41,181-186` (displays static `<img>` after 2.2s claiming `"{nome} está ao vivo"`), `src/components/chat/MediaAttachmentModal.tsx:46-55,84-103,113` (unrestricted `FileReader.readAsDataURL`, silent fallback to Google sample `.ogg` URL if microphone fails).
   - **Impact:** No file MIME-type/size validation exists (risking quota crashes or invalid payloads); media attachments and calls lack honest state messaging / real signaling.

8. **Unread Chat Counter Never Clears & Missing Notifications Center**
   - **Evidence:** `src/pages/Conversas.tsx:148-152`, `src/components/layout/Header.tsx:25`.
   - **Impact:** Selecting a match conversation does not mark incoming messages as `lida: true` or reset `unreadCount`, leaving notification badges stuck. There is no real notification feed for likes, mutual matches, messages, or moderation alerts.

9. **Broken Discovery Filters, Country Routing Disconnects, & Duplicate `<option>` Lists**
   - **Evidence:** `src/pages/Home.tsx:278`, `src/pages/PaisDetalhe.tsx:71`, `src/pages/CidadeDetalhe.tsx:54` (clicking country/city links navigates to `/descobrir` without applying the selected country filter); `src/context/AppContext.tsx:352-370` (ignores `distanciaMax`, `apenasVerificados`, and `user.interesseEm`); `src/pages/Descobrir.tsx:461-473` & `src/pages/Perfil.tsx:267-277` (duplicate 7 country `<option>` entries); `src/pages/Mapa.tsx:20-25` (only filters `todos`, `brasil`, `europa` [3 countries], `asia` [Japan]).
   - **Impact:** Country/city discovery funnels fail to filter results; preference & distance filters are partially non-functional; discovery `currentIndex` does not reset cleanly on filter change.

10. **Non-Functional Contact Form**
    - **Evidence:** `src/pages/Contato.tsx:14-21`.
    - **Impact:** Submitting the support/abuse contact form only triggers local UI state without persisting a ticket or notifying moderation.

11. **Contradictory Legacy Pricing Copy in Country/City SEO Content**
    - **Evidence:** `src/data/paises.ts:75,258,312,742,1034`.
    - **Impact:** States paid plans (`R$ 29,90` / `R$ 239,90` via Pix/card) and `"Cadastre-se Premium"`, directly contradicting the platform's 100% Free positioning in `Planos.tsx`, `institutional.ts`, and `Header.tsx`.

---

### MEDIUM

12. **Native `window.confirm` & Missing Confirmation on Destructive Actions**
    - **Evidence:** `src/pages/Admin.tsx:84` (`window.confirm` violates iframe/UI best practices), `Admin.tsx:541` (`deleteRegisteredUser` executes immediately without confirmation).

13. **Mural Hardcoded Translation & Missing Self-Delete**
    - **Evidence:** `src/pages/Mural.tsx:176-178` (translation toggle returns a single hardcoded Portuguese string for every translated post), missing delete button for post authors despite `src/data/institutional.ts:139`.

14. **Per-Route Dynamic SEO & Language Routing Gaps**
    - **Evidence:** `src/App.tsx:34-39,89-91`.
    - **Impact:** Only `<link rel="canonical">` updates per route; `<title>`, `<meta name="description">`, `og:*`, and JSON-LD remain static on subpages (`/guias/*`, `/pais/*`, `/cidade/*`, `/mapa`, `/mural`). Multilingual landing routes (`/en/dating`, `/es/citas`, etc.) do not synchronize `currentLang`.

15. **Mobile Ergonomics, Excess Pill Badges, Touch Targets, & i18n Completeness**
    - **Evidence:** `src/components/layout/Header.tsx`, `src/pages/Descobrir.tsx:348-385`, `src/pages/Conversas.tsx:175,206,262`.
    - **Impact:** Mobile UX relies solely on a top hamburger menu instead of a thumb-reachable bottom tab bar; several icon buttons use `size-7`/`size-8` (<44px touch hitbox); pages mix English/Portuguese strings instead of honoring `currentLang` and localized `Intl.DateTimeFormat`.

16. **Excessive Global Click Listener & Unbounded Event Feed**
    - **Evidence:** `src/context/AppContext.tsx:486-499`.
    - **Impact:** Global `window.addEventListener('click')` records every `<input>`, `<button>`, `<a>`, `<select>` click into React state on every interaction and stores analytics in client `localStorage`.

---

### LOW

17. **Unused Imports & Missing Accessibility Labels**
    - **Evidence:** Unused icons in `Admin.tsx`, `Planos.tsx`, `Descobrir.tsx`, `Perfil.tsx`; missing `aria-label` on icon-only buttons in `Header.tsx:261`, `Descobrir.tsx:348-385`, `MatchModal.tsx:19`, `Mapa.tsx:156`, `Conversas.tsx:204,260,423`.
18. **External Sample URL Fallbacks**
    - **Evidence:** Fallback `images.unsplash.com` URLs embedded across `AppContext.tsx`, `Entrar.tsx`, `MatchModal.tsx`, `Mural.tsx`, `Perfil.tsx`, `VideoCallModal.tsx`. Should use safe local SVG/initials avatar fallbacks when user photo is missing rather than duplicating a third-party portrait URL.

---

## Remediation Plan (Phases 2–8)

1. **Provision Firebase (Firestore + Firebase Auth)** via AI Studio Firebase RPC setup, architect PII-isolated collections (`users_public`, `users_private`, `likes`, `matches`, `messages`, `notifications`, `blocks`, `reports`, `support_tickets`, `mural_posts`, `admins`, `audit_logs`, `platform_stats`), write TDD security tests + `firestore.rules` + `firestore.indexes.json`, and deploy rules.
2. **Repair Auth, Age-Gating & RBAC:** Real Firebase Email/Password + Google sign-in, password reset, email verification prompt/banner, mandatory 18+ age verification on registration, strict SuperAdmin RBAC on `/admin` (`joeliton.cacoal@gmail.com` + verified email + `admins` collection), and remove exposed public `Área ADM` badge from public visitor nav.
3. **Real Matching, Messaging, Notifications, Blocking & Reporting:** Mutual-like detection via Firestore `likes` + `matches`, real persistent conversations & validated media uploads, real unread counts & notifications feed, user blocking (hiding blocked profiles & blocking messages), reporting to moderation queue, LGPD self-service account deletion, and location privacy controls (coarse city/country display with rounded km distance, zero public exact coordinates or street address).
4. **Mobile-First Design, Internationalization & SEO Upgrade:** Bottom mobile tab bar, >=44px touch targets, non-blocking confirmation modals, loading/empty/error/success states, full 92+ country/city filter integration across Home/Map/Countries/Cities/Discovery, localized dates/times across 8 languages, updated `paises.ts` free messaging, and per-route dynamic SEO (`title`, `description`, `og:*`, JSON-LD).
5. **End-to-End & Security Verification:** Run automated `firestore.rules` Dirty Dozen tests, live two-account relationship E2E verification (User A -> User B discover, like, mutual match, notification, chat, block, report), `compile_applet`, and `lint_applet`.

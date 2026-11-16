# GlobalLove.com — Security Rules & Payload TDD Specification (Phase 0)

## 1. Core Data & Access Invariants

1. **Identity & Verification:** Every authenticated write operation on user/social collections mandates `request.auth != null && request.auth.token.email_verified == true`.
2. **Age-Gating (18+):** Public profile creation and updates strictly require `idade is number && idade >= 18 && idade <= 99` and `ageConfirmed18 == true`.
3. **PII Split-Collection Isolation:** Emails, residential addresses (`endereco`), and explicit privacy settings reside exclusively in `/users_private/{userId}`, readable/listable ONLY by `userId` (owner `get`) or verified Admin (`get`/`list`). Public `/profiles/{userId}` documents NEVER store emails, street addresses, or exact GPS coordinates.
4. **Privilege Escalation & RBAC Prevention:** Regular users cannot create `/admins/{uid}` documents, cannot set `status: 'suspenso'` on themselves or others, and cannot alter `status` on `/profiles` or `/users_private`. Admin access requires `email_verified == true` AND either the bootstrapped SuperAdmin email (`joeliton.cacoal@gmail.com`) or an active document in `/admins/{request.auth.uid}`.
5. **Mutual Match Integrity:** A `/matches/{minUid}_{maxUid}` document can ONLY be created when BOTH directional `/likes/{userA}_{userB}` and `/likes/{userB}_{userA}` exist (or are atomically created in the same batch via `getAfter`), neither is `'pass'`, and `status == 'active'`.
6. **Communication & Block Enforcement:** Messages in `/matches/{matchId}/messages/{messageId}` require parent match membership, `parent.status == 'active'`, and absence of mutual block documents (`/blocks/{sender}_{recipient}` and `/blocks/{recipient}_{sender}`).
7. **Temporal & Immutable Field Integrity:** `createdAt == request.time` on creation and `incoming().createdAt == existing().createdAt` on updates. Ownership/author keys (`uid`, `fromUid`, `senderId`, `blockerUid`, `reporterUid`, `autorId`, `actorUid`) are immutable after creation.
8. **Terminal State Locking & Append-Only Audit Logs:** Moderation reports (`/reports/{reportId}`) lock once `status` becomes `'resolved'` or `'dismissed'` unless overridden by an Admin. `/admin_audit_logs/{logId}` strictly denies all client updates and deletes.

---

## 2. The "Dirty Dozen" Attack Payloads (Expected: `PERMISSION_DENIED`)

| # | Target Collection | Attack Vector | Malicious Payload / Operation |
|---|-------------------|---------------|-------------------------------|
| 1 | `/profiles/{uid}` | **Identity Spoofing + Minor Age-Gate Bypass** | Signed-in user `alice` creates `/profiles/bob` with `{ uid: 'bob', idade: 16, ageConfirmed18: false }` |
| 2 | `/profiles/{uid}` | **Shadow Field / Privilege Escalation** | `alice` updates `/profiles/alice` injecting `{ status: 'suspenso', isAdmin: true, role: 'SuperAdmin' }` |
| 3 | `/users_private/{uid}` | **PII Cross-User Read / Blanket List** | `alice` calls `get(/users_private/bob)` or `list(/users_private)` to scrape member emails and addresses |
| 4 | `/likes/{likeId}` | **Vote / Like Forgery** | `alice` creates `/likes/bob_alice` with `{ fromUid: 'bob', toUid: 'alice', type: 'like' }` to impersonate Bob |
| 5 | `/matches/{matchId}` | **Unilateral Match Forgery (Bypassing Reciprocity)** | `alice` creates `/matches/alice_bob` when `/likes/bob_alice` does NOT exist |
| 6 | `/matches/{matchId}/messages/{msgId}` | **Blocked User Harassment** | `alice` writes message under `/matches/alice_bob/messages/m1` when match `status == 'blocked'` or block doc exists |
| 7 | `/matches/{matchId}/messages/{msgId}` | **Timestamp Spoofing & Oversized Payload Poisoning** | `alice` sets `createdAt: Timestamp(2099-01-01)` or a 50,000-char `texto` string |
| 8 | `/admins/{uid}` | **Self-Assigned SuperAdmin** | Non-admin `alice` creates `/admins/alice` with `{ uid: 'alice', nivelAcesso: 'SuperAdmin', ativo: true }` |
| 9 | `/admins/{uid}` | **Email Spoofing Attack (Unverified Email Claim)** | Attacker signs up with unverified email matching admin (`email_verified: false`) and attempts read on `/admins` or `/users_private` |
| 10 | `/reports/{reportId}` | **Report Resolution Tampering by Non-Admin** | `alice` updates her own `/reports/r1` setting `{ status: 'resolved', reviewedBy: 'alice' }` |
| 11 | `/admin_audit_logs/{logId}` | **Audit Trail Tampering / Deletion** | Even an Admin attempts `update` or `delete` on `/admin_audit_logs/log1` |
| 12 | `/profiles/{uid}` | **Unverified Email Write Bypass** | Authenticated user with `email_verified: false` attempts to create `/profiles/unverifiedUid` |

---

## 3. Red Team Audit Delta Fixes Applied to `firestore.rules`

1. **Query Static Analysis Alignment (`allow list`):** Rewrote `/matches/{matchId}/messages` `allow list` to validate parent `/matches/{matchId}` `participants` so `orderBy('createdAt', 'asc')` queries pass Firestore static query verification without client query constraint mismatches. Aligned `/likes` `allow list` with `in ['like', 'superlike']`.
2. **Atomic Mural Like Counter Binding:** Bound `mural_posts.curtidasCount` `+1`/`-1` transitions strictly to atomic `existsAfter`/`!existsAfter` changes on `/mural_posts/{postId}/post_likes/{request.auth.uid}`, preventing counter spoofing or griefing.
3. **Reciprocal Match Creation Verification:** Hardened `hasReciprocalLikes(userA, userB)` with explicit `existsAfter(...)` guards prior to `getAfter(...)`.
4. **Match Unblock Guard:** Added explicit Action 3 allowing only the original `blockedBy` user to restore a blocked match to `'active'` and ONLY when neither user has a remaining `/blocks` document (`!existsAfter`).
5. **Moderation Notification Restriction:** Restricted creating `'moderation'` and `'system'` notifications exclusively to verified Admins; regular verified users can only send `'like'`, `'match'`, and `'message'` notifications with `senderId == request.auth.uid`.
6. **ESLint `@firebase/eslint-plugin-security-rules` Verification:** Validated clean with `npx eslint firestore.rules` (0 errors, 0 warnings).


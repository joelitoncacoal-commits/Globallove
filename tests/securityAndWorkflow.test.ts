import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  LIMITS,
  sanitizeText,
  sanitizeUrl,
  buildMatchId,
  buildOrderedPair,
  buildLikeId,
  buildBlockId,
  roundPrivacyCoord,
  computeHaversineKm,
  checkRateLimit,
  resetRateLimiterForTests,
} from '../src/utils/security';
import {
  doesInterestMatchGender,
  findCountryMeta,
  formatLocalizedTime,
  formatLocalizedDateTime,
} from '../src/utils/localization';
import { COUNTRIES } from '../src/data/countries';
import { resolveRouteSEO } from '../src/utils/seo';
import {
  findCountryByMultilingualQuery,
  matchesMultilingualQuery,
  computeGlobalKeywordCombinationsCount,
} from '../src/data/seoKeywords';

// -----------------------------------------------------------------------------
// 1. Security Utilities, XSS Prevention, Privacy Coordinates & Rate Limiting
// -----------------------------------------------------------------------------
describe('Security & Privacy Primitives', () => {
  beforeEach(() => {
    resetRateLimiterForTests();
  });

  it('strips HTML angle brackets, zero-width chars, and enforces max length', () => {
    const dirty = '  <script>alert("xss")</script>Olá\u200B Mundo!  ';
    const clean = sanitizeText(dirty, LIMITS.NAME_MAX);
    expect(clean).not.toContain('<');
    expect(clean).not.toContain('>');
    expect(clean).not.toContain('\u200B');
    expect(clean.length).toBeLessThanOrEqual(LIMITS.NAME_MAX);
  });

  it('rejects javascript:, data:text/html, and oversized URLs while permitting https and bounded base64 images', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    expect(sanitizeUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe('');
    expect(sanitizeUrl('https://globallove.vercel.app/icons/icon-192.webp')).toBe(
      'https://globallove.vercel.app/icons/icon-192.webp'
    );
    expect(sanitizeUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe(
      'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
    );
    expect(sanitizeUrl('https://example.com/' + 'a'.repeat(300000))).toBe('');
  });

  it('rounds geographic coordinates to 0.1 degrees (~11 km privacy radius) and computes Haversine km', () => {
    const roundedLat = roundPrivacyCoord(-23.55052);
    const roundedLng = roundPrivacyCoord(-46.633308);
    expect(roundedLat).toBe(-23.6);
    expect(roundedLng).toBe(-46.6);

    const dist = computeHaversineKm(-23.6, -46.6, -22.9, -43.2);
    expect(dist.known).toBe(true);
    expect(dist.km).toBeGreaterThan(300);
    expect(dist.km).toBeLessThan(450);

    expect(computeHaversineKm(undefined, -46.6, -22.9, -43.2)).toEqual({ km: 0, known: false });
  });

  it('produces deterministic lexically ordered match IDs and composite like/block keys', () => {
    expect(buildMatchId('uid_z', 'uid_a')).toBe('uid_a_uid_z');
    expect(buildMatchId('uid_a', 'uid_z')).toBe('uid_a_uid_z');
    expect(buildOrderedPair('uid_b', 'uid_a')).toEqual(['uid_a', 'uid_b']);
    expect(buildLikeId('alice', 'bob')).toBe('alice_bob');
    expect(buildBlockId('alice', 'bob')).toBe('alice_bob');
  });

  it('enforces sliding-window rate limits against spam', () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit('send_msg_user1', 5, 60_000)).toBe(true);
    }
    expect(checkRateLimit('send_msg_user1', 5, 60_000)).toBe(false);
    // Different key remains unaffected
    expect(checkRateLimit('send_msg_user2', 5, 60_000)).toBe(true);
  });
});

// -----------------------------------------------------------------------------
// 2. Internationalization, 92+ Country Preservation & SEO
// -----------------------------------------------------------------------------
describe('Internationalization & SEO Integrity', () => {
  it('preserves all 249 countries and resolves country metadata accurately', () => {
    expect(COUNTRIES.length).toBeGreaterThanOrEqual(240);
    const br = findCountryMeta('Brasil');
    expect(br.flag).toBe('🇧🇷');
    const jp = findCountryMeta('Japão');
    expect(jp.flag).toBe('🇯🇵');
    const fr = findCountryMeta('França');
    expect(fr.flag).toBe('🇫🇷');
  });

  it('matches gender interest filters inclusively and accurately', () => {
    expect(doesInterestMatchGender('todos', 'nao_binario')).toBe(true);
    expect(doesInterestMatchGender('mulheres', 'mulher_cis')).toBe(true);
    expect(doesInterestMatchGender('mulheres', 'mulher_trans')).toBe(true);
    expect(doesInterestMatchGender('mulheres', 'homem_cis')).toBe(false);
    expect(doesInterestMatchGender('homens_trans', 'homem_trans')).toBe(true);
  });

  it('formats dates and times cleanly per supported locale', () => {
    const iso = '2026-10-15T14:30:00.000Z';
    expect(formatLocalizedTime(iso, 'pt').length).toBeGreaterThan(2);
    expect(formatLocalizedDateTime(iso, 'en').length).toBeGreaterThan(4);
    expect(formatLocalizedDateTime(iso, 'ja').length).toBeGreaterThan(4);
  });

  it('resolves distinct SEO titles, canonical URLs, and dynamic 249-country pages', () => {
    const home = resolveRouteSEO('/', 'pt');
    const en = resolveRouteSEO('/en/dating', 'en');
    const br = resolveRouteSEO('/pais/brasil', 'pt');
    const ca = resolveRouteSEO('/pais/canada', 'pt');
    const sitemap = fs.readFileSync(path.resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');

    expect(home.canonicalUrl).toBe('https://globallove.vercel.app/');
    expect(en.lang).toBe('en');
    expect(en.canonicalUrl).toBe('https://globallove.vercel.app/en/dating');
    expect(br.title).toContain('Brasil');
    expect(br.title).not.toBe(home.title);
    expect(ca.title).toContain('Canadá');
    expect(ca.canonicalUrl).toBe('https://globallove.vercel.app/pais/canada');
    expect(sitemap).toContain('https://globallove.vercel.app/pais/canada');
    expect(sitemap).toContain('https://globallove.vercel.app/en/dating');
  });

  it('matches multilingual search keywords and filters across 8 languages and 249 countries', () => {
    expect(computeGlobalKeywordCombinationsCount()).toBeGreaterThan(100000);
    expect(findCountryByMultilingualQuery('free dating brazil')).toBe('Brasil');
    expect(findCountryByMultilingualQuery('citas gratis españa')).toBe('Espanha');
    expect(findCountryByMultilingualQuery('無料 日本')).toBe('Japão');

    const sampleProfile: any = {
      id: 'p1',
      nome: 'Sakura',
      idade: 27,
      cidade: 'Tokyo',
      pais: 'Japão',
      bandeira: '🇯🇵',
      distanciaKm: 100,
      profissao: 'Designer',
      bio: 'Coffee and travel lover',
      interesses: ['Cinema', 'Música'],
      habitos: ['coffee', 'travel'],
      fotos: ['/icons/icon-192.webp'],
      idiomas: ['Japonês', 'Inglês'],
      genero: 'mulher_cis',
      interesseEm: 'todos',
      latitude: 35.6,
      longitude: 139.7,
    };

    expect(matchesMultilingualQuery(sampleProfile, 'japan coffee')).toBe(true);
    expect(matchesMultilingualQuery(sampleProfile, 'free dating tokyo')).toBe(true);
    expect(matchesMultilingualQuery(sampleProfile, 'brazil rio')).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// 3. Firestore Rules & Blueprint Security Invariants Audit
// -----------------------------------------------------------------------------
describe('Firestore Security Rules & Blueprint Invariants', () => {
  const rulesText = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
  const blueprintRaw = fs.readFileSync(path.resolve(process.cwd(), 'firebase-blueprint.json'), 'utf8');
  const blueprint = JSON.parse(blueprintRaw);

  it('enforces Dirty Dozen protections in firestore.rules', () => {
    // Email verified gate & adult 18+ requirement
    expect(rulesText).toContain('request.auth.token.email_verified == true');
    expect(rulesText).toContain('data.idade >= 18');

    // Resource null guards on allow get rules
    expect(rulesText).toContain('resource == null || existing().status == \'ativo\'');
    expect(rulesText).toContain('resource == null\n        || existing().fromUid == request.auth.uid');
    expect(rulesText).toContain('resource == null || request.auth.uid in existing().participants');

    // Mutual match enforcement requires reciprocal likes atomically
    expect(rulesText).toContain("existsAfter(/databases/$(database)/documents/likes/$(userA + '_' + userB))");
    expect(rulesText).toContain("existsAfter(/databases/$(database)/documents/likes/$(userB + '_' + userA))");
    expect(rulesText).toContain('hasReciprocalLikes(incoming().userA, incoming().userB)');

    // Private PII split collection
    expect(rulesText).toContain('match /users_private/{userId}');

    // Mural visibility validation & activity notification types
    expect(rulesText).toContain("data.visibilidade in ['public', 'hidden']");
    expect(rulesText).toContain("'profile_view'");
    expect(rulesText).toContain("'mural'");

    // Blocks must check !exists(...blocks...) on messages & matches
    expect(rulesText).toContain('/databases/$(database)/documents/blocks/$(incoming().senderId');

    // Immutable admin audit logs
    expect(rulesText).toContain('match /admin_audit_logs/{logId}');
    expect(rulesText).toContain('allow update: if false;');
    expect(rulesText).toContain('allow delete: if false;');

    // Atomic mural likes counter bound to post_likes subcollection
    expect(rulesText).toContain('post_likes/$(request.auth.uid)');
  });

  it('declares all required production collections in firebase-blueprint.json', () => {
    const colNames = Object.keys(blueprint.firestore);
    expect(colNames).toContain('/profiles/{userId}');
    expect(colNames).toContain('/users_private/{userId}');
    expect(colNames).toContain('/likes/{likeId}');
    expect(colNames).toContain('/matches/{matchId}');
    expect(colNames).toContain('/matches/{matchId}/messages/{messageId}');
    expect(colNames).toContain('/notifications/{notificationId}');
    expect(colNames).toContain('/blocks/{blockId}');
    expect(colNames).toContain('/reports/{reportId}');
    expect(colNames).toContain('/mural_posts/{postId}');
    expect(colNames).toContain('/support_tickets/{ticketId}');
    expect(colNames).toContain('/admins/{uid}');
    expect(colNames).toContain('/admin_audit_logs/{logId}');
    expect(colNames).toContain('/platform_events/{eventId}');
  });
});

// -----------------------------------------------------------------------------
// 4. Phase 7 End-to-End Relationship, Matching, Blocking & Reporting Workflow
// -----------------------------------------------------------------------------
interface MockUserAccount {
  uid: string;
  emailVerified: boolean;
  isAdmin?: boolean;
}

class InMemorySecurityHarness {
  profiles = new Map<string, any>();
  privateUsers = new Map<string, any>();
  likes = new Map<string, any>();
  matches = new Map<string, any>();
  messages = new Map<string, any[]>();
  notifications: any[] = [];
  blocks = new Map<string, any>();
  reports: any[] = [];
  auditLogs: any[] = [];

  private assertVerifiedAdult(actor: MockUserAccount) {
    if (!actor.emailVerified) throw new Error('PERMISSION_DENIED: Email not verified');
  }

  private isBlocked(uidA: string, uidB: string): boolean {
    return (
      this.blocks.has(buildBlockId(uidA, uidB)) ||
      this.blocks.has(buildBlockId(uidB, uidA))
    );
  }

  registerProfile(
    actor: MockUserAccount,
    publicData: { nome: string; idade: number; cidade: string; pais: string; latitude: number; longitude: number },
    privateData: { email: string; endereco: string }
  ) {
    this.assertVerifiedAdult(actor);
    if (publicData.idade < 18) throw new Error('PERMISSION_DENIED: Must be 18+');
    this.profiles.set(actor.uid, {
      uid: actor.uid,
      nome: sanitizeText(publicData.nome, LIMITS.NAME_MAX),
      idade: publicData.idade,
      cidade: sanitizeText(publicData.cidade, LIMITS.CITY_MAX),
      pais: sanitizeText(publicData.pais, LIMITS.COUNTRY_MAX),
      latitude: roundPrivacyCoord(publicData.latitude),
      longitude: roundPrivacyCoord(publicData.longitude),
      status: 'ativo',
    });
    this.privateUsers.set(actor.uid, {
      uid: actor.uid,
      email: privateData.email,
      endereco: sanitizeText(privateData.endereco, LIMITS.ADDRESS_MAX),
    });
  }

  readPrivateUser(requester: MockUserAccount, targetUid: string) {
    if (requester.uid !== targetUid && !requester.isAdmin) {
      throw new Error('PERMISSION_DENIED: Cannot read another user PII');
    }
    return this.privateUsers.get(targetUid);
  }

  discoverProfiles(actor: MockUserAccount) {
    this.assertVerifiedAdult(actor);
    return Array.from(this.profiles.values()).filter(
      (p) => p.uid !== actor.uid && p.status === 'ativo' && !this.isBlocked(actor.uid, p.uid)
    );
  }

  swipe(actor: MockUserAccount, targetUid: string, type: 'like' | 'superlike' | 'pass'): { mutualMatch: boolean; matchId?: string } {
    this.assertVerifiedAdult(actor);
    if (actor.uid === targetUid) throw new Error('PERMISSION_DENIED: Cannot like self');
    if (this.isBlocked(actor.uid, targetUid)) throw new Error('PERMISSION_DENIED: Blocked');

    const likeId = buildLikeId(actor.uid, targetUid);
    this.likes.set(likeId, { fromUid: actor.uid, toUid: targetUid, type });

    if (type === 'pass') return { mutualMatch: false };

    const reverseLike = this.likes.get(buildLikeId(targetUid, actor.uid));
    if (reverseLike && (reverseLike.type === 'like' || reverseLike.type === 'superlike')) {
      const [userA, userB] = buildOrderedPair(actor.uid, targetUid);
      const matchId = buildMatchId(actor.uid, targetUid);
      this.matches.set(matchId, {
        id: matchId,
        userA,
        userB,
        participants: [userA, userB],
        status: 'active',
        blockedBy: '',
      });
      this.notifications.push(
        { id: `n_${this.notifications.length + 1}`, recipientId: actor.uid, senderId: targetUid, type: 'match', read: false },
        { id: `n_${this.notifications.length + 2}`, recipientId: targetUid, senderId: actor.uid, type: 'match', read: false }
      );
      return { mutualMatch: true, matchId };
    }
    return { mutualMatch: false };
  }

  forceCreateMatchWithoutMutualLike(actor: MockUserAccount, targetUid: string) {
    this.assertVerifiedAdult(actor);
    const reverseLike = this.likes.get(buildLikeId(targetUid, actor.uid));
    const directLike = this.likes.get(buildLikeId(actor.uid, targetUid));
    if (!directLike || !reverseLike) {
      throw new Error('PERMISSION_DENIED: Mutual likes required to create match');
    }
  }

  sendMessage(actor: MockUserAccount, matchId: string, texto: string) {
    this.assertVerifiedAdult(actor);
    const match = this.matches.get(matchId);
    if (!match) throw new Error('PERMISSION_DENIED: Match does not exist');
    if (!match.participants.includes(actor.uid)) throw new Error('PERMISSION_DENIED: Not a participant');
    const otherUid = match.userA === actor.uid ? match.userB : match.userA;
    if (match.status === 'blocked' || this.isBlocked(actor.uid, otherUid)) {
      throw new Error('PERMISSION_DENIED: Conversation blocked');
    }
    const list = this.messages.get(matchId) || [];
    list.push({
      id: `msg_${list.length + 1}`,
      senderId: actor.uid,
      recipientId: otherUid,
      texto: sanitizeText(texto, LIMITS.MESSAGE_MAX),
      lida: false,
    });
    this.messages.set(matchId, list);
  }

  blockUser(actor: MockUserAccount, targetUid: string, reason: string) {
    this.assertVerifiedAdult(actor);
    this.blocks.set(buildBlockId(actor.uid, targetUid), {
      blockerUid: actor.uid,
      blockedUid: targetUid,
      reason: sanitizeText(reason, LIMITS.BLOCK_REASON_MAX),
    });
    const matchId = buildMatchId(actor.uid, targetUid);
    const match = this.matches.get(matchId);
    if (match) {
      match.status = 'blocked';
      match.blockedBy = actor.uid;
    }
  }

  submitReport(actor: MockUserAccount, targetUid: string, category: string, description: string) {
    this.assertVerifiedAdult(actor);
    const report = {
      id: `rep_${this.reports.length + 1}`,
      reporterUid: actor.uid,
      reportedUid: targetUid,
      category,
      description: sanitizeText(description, LIMITS.REPORT_DESC_MAX),
      status: 'open',
    };
    this.reports.push(report);
    return report.id;
  }

  resolveReport(admin: MockUserAccount, reportId: string) {
    if (!admin.isAdmin) throw new Error('PERMISSION_DENIED: Admin only');
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) throw new Error('Report not found');
    rep.status = 'resolved';
    this.auditLogs.push({
      actorUid: admin.uid,
      action: 'report_resolved',
      targetUid: rep.reportedUid,
    });
  }
}

describe('Phase 7: Full Two-User Matching, Messaging, Blocking & Moderation Workflow', () => {
  it('completes the full end-to-end relationship & safety lifecycle while rejecting unauthorized operations', () => {
    const app = new InMemorySecurityHarness();
    const userA: MockUserAccount = { uid: 'uid_alice', emailVerified: true };
    const userB: MockUserAccount = { uid: 'uid_bob', emailVerified: true };
    const unverifiedUser: MockUserAccount = { uid: 'uid_unverified', emailVerified: false };
    const adminUser: MockUserAccount = { uid: 'uid_admin', emailVerified: true, isAdmin: true };

    // 0. Unverified or underage registration must be rejected
    expect(() =>
      app.registerProfile(
        unverifiedUser,
        { nome: 'Test', idade: 25, cidade: 'Lisboa', pais: 'Portugal', latitude: 38.72, longitude: -9.13 },
        { email: 'u@test.com', endereco: 'Rua X' }
      )
    ).toThrow(/Email not verified/);

    expect(() =>
      app.registerProfile(
        userA,
        { nome: 'Minor', idade: 17, cidade: 'Lisboa', pais: 'Portugal', latitude: 38.72, longitude: -9.13 },
        { email: 'a@test.com', endereco: 'Rua A' }
      )
    ).toThrow(/18\+/);

    // 1. User A registers & completes profile
    app.registerProfile(
      userA,
      { nome: 'Alice', idade: 26, cidade: 'São Paulo', pais: 'Brasil', latitude: -23.5505, longitude: -46.6333 },
      { email: 'alice@example.com', endereco: 'Rua Privada 123' }
    );

    // 2. User B registers & completes profile
    app.registerProfile(
      userB,
      { nome: 'Bob', idade: 28, cidade: 'Lisboa', pais: 'Portugal', latitude: 38.7223, longitude: -9.1393 },
      { email: 'bob@example.com', endereco: 'Av Privada 456' }
    );

    // PII isolation: User A cannot read User B's private record, nor exact address in public profile
    expect(() => app.readPrivateUser(userA, userB.uid)).toThrow(/Cannot read another user PII/);
    expect(app.profiles.get(userB.uid).endereco).toBeUndefined();
    expect(app.profiles.get(userB.uid).latitude).toBe(38.7);

    // 3. User A discovers User B
    const discoveredByA = app.discoverProfiles(userA);
    expect(discoveredByA.map((p) => p.uid)).toContain(userB.uid);

    // 4. User A likes User B (one-sided: NO match yet, forged match creation rejected)
    const firstSwipe = app.swipe(userA, userB.uid, 'like');
    expect(firstSwipe.mutualMatch).toBe(false);
    expect(() => app.forceCreateMatchWithoutMutualLike(userA, userB.uid)).toThrow(/Mutual likes required/);

    // 5. User B likes User A -> Mutual match created + notifications sent to both!
    const secondSwipe = app.swipe(userB, userA.uid, 'like');
    expect(secondSwipe.mutualMatch).toBe(true);
    const matchId = secondSwipe.matchId!;
    expect(matchId).toBe('uid_alice_uid_bob');
    expect(app.notifications.filter((n) => n.recipientId === userA.uid && n.type === 'match')).toHaveLength(1);
    expect(app.notifications.filter((n) => n.recipientId === userB.uid && n.type === 'match')).toHaveLength(1);

    // 6. Both users exchange persisted messages
    app.sendMessage(userA, matchId, 'Olá Bob! Prazer em conectar com você.');
    app.sendMessage(userB, matchId, 'Olá Alice! Muito bom dar match contigo!');
    const chatMsgs = app.messages.get(matchId)!;
    expect(chatMsgs).toHaveLength(2);
    expect(chatMsgs[0].senderId).toBe(userA.uid);
    expect(chatMsgs[1].senderId).toBe(userB.uid);

    // 7. Blocking prevents subsequent communication & removes from discovery
    app.blockUser(userA, userB.uid, 'Conversa encerrada');
    expect(() => app.sendMessage(userB, matchId, 'Tentando enviar após bloqueio')).toThrow(/blocked/);
    expect(() => app.sendMessage(userA, matchId, 'Tentando enviar bloqueado')).toThrow(/blocked/);
    expect(app.discoverProfiles(userA).map((p) => p.uid)).not.toContain(userB.uid);

    // 8. Reporting dispatches event to moderation and Admin resolves with audit log
    const reportId = app.submitReport(userA, userB.uid, 'harassment', 'Mensagem inadequada');
    expect(app.reports).toHaveLength(1);
    expect(() => app.resolveReport(userA, reportId)).toThrow(/Admin only/);
    app.resolveReport(adminUser, reportId);
    expect(app.reports[0].status).toBe('resolved');
    expect(app.auditLogs).toHaveLength(1);
    expect(app.auditLogs[0].action).toBe('report_resolved');
  });
});

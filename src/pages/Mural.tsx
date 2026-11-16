import React, { useState } from 'react';
import {
  Compass,
  Heart,
  MessageSquare,
  Send,
  ImagePlus,
  Sparkles,
  Trash2,
  Flag,
  Lock,
  Loader2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compressImageUpload } from '../utils/security';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { ReportModal } from '../components/modals/ReportModal';

export const Mural: React.FC = () => {
  const {
    isLoggedIn,
    user,
    muralPosts,
    muralComments,
    loadMuralComments,
    toggleLikePost,
    addMuralPost,
    addMuralComment,
    deleteMuralPost,
    showToast,
    navigate,
  } = useApp();

  const [novoTexto, setNovoTexto] = useState('');
  const [novaFoto, setNovaFoto] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentSending, setCommentSending] = useState(false);
  const [deleteTargetPostId, setDeleteTargetPostId] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<{ uid: string; name: string } | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const compressed = await compressImageUpload(file, 720, 180000);
      setNovaFoto(compressed);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao processar foto.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/entrar');
      return;
    }
    if (!novoTexto.trim() || publishing) return;
    setPublishing(true);
    try {
      await addMuralPost(novoTexto.trim(), novaFoto || undefined);
      setNovoTexto('');
      setNovaFoto('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao publicar no mural.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleToggleComments = async (postId: string) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      return;
    }
    setActiveCommentsPostId(postId);
    try {
      await loadMuralComments(postId);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao carregar comentários.', 'error');
    }
  };

  const handleSendComment = async (postId: string) => {
    if (!commentInput.trim() || commentSending) return;
    setCommentSending(true);
    try {
      await addMuralComment(postId, commentInput.trim());
      setCommentInput('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao enviar comentário.', 'error');
    } finally {
      setCommentSending(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8 pb-24 md:pb-12">
      {/* Page Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
          <Compass className="size-3.5" /> Comunidade GlobalLove.com
        </div>
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Mural da Comunidade
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compartilhe momentos culturais, viagens e pensamentos com membros verificados do mundo todo.
        </p>
      </div>

      {!isLoggedIn ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="size-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Comunidade Exclusiva para Membros Verificados
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Para proteger a privacidade de quem publica no Mural Global, entre com sua conta verificada (18+) para ler, curtir e comentar.
          </p>
          <button
            type="button"
            onClick={() => navigate('/entrar')}
            className="min-h-[44px] rounded-full bg-brand px-7 py-3 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Entrar ou Criar Conta Grátis
          </button>
        </div>
      ) : (
        <>
          {/* New Post Box */}
          <form
            onSubmit={(e) => void handlePublish(e)}
            className="mb-8 rounded-3xl border border-border bg-card p-5 shadow-soft transition-all focus-within:border-primary/40 focus-within:shadow-card"
          >
            <div className="flex items-start gap-3">
              <div className="relative size-11 overflow-hidden rounded-full shadow-soft shrink-0 bg-muted">
                <img
                  src={user.fotos[0] || '/icons/icon-192.webp'}
                  alt={user.nome}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={novoTexto}
                  onChange={(e) => setNovoTexto(e.target.value)}
                  maxLength={1500}
                  placeholder="Compartilhe algo sobre seu dia, viagem ou cultura..."
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                {novaFoto && (
                  <div className="relative mt-2 inline-block overflow-hidden rounded-2xl border border-border">
                    <img src={novaFoto} alt="Prévia" className="max-h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setNovaFoto('')}
                      aria-label="Remover foto"
                      className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/70 text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                  <label className="flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    {uploadingPhoto ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <ImagePlus className="size-4 text-primary" />
                    )}
                    <span>{uploadingPhoto ? 'Processando...' : 'Adicionar Foto'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => void handlePhotoUpload(e)}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!novoTexto.trim() || publishing || uploadingPhoto}
                    className="flex min-h-[42px] items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-bold text-primary-foreground shadow-soft transition-transform disabled:opacity-50 active:scale-95"
                  >
                    {publishing ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Posts List */}
          {muralPosts.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Ainda não há publicações no Mural Global. Seja a primeira pessoa a publicar hoje!
            </div>
          ) : (
            <div className="space-y-6">
              {muralPosts.map((post) => {
                const isAuthor = post.autorId === user.id;
                const postComments = muralComments[post.id] || [];

                return (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft"
                  >
                    {/* Author Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative size-11 overflow-hidden rounded-full shadow-soft shrink-0 bg-muted">
                          <img
                            src={post.autorFoto || '/icons/icon-192.webp'}
                            alt={post.autorNome}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-foreground truncate">
                              {post.autorNome}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                            <span>{post.autorBandeira}</span>
                            <span className="truncate">
                              {post.autorCidade}, {post.autorPais}
                            </span>
                            <span>•</span>
                            <span className="shrink-0">{post.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {isAuthor ? (
                        <button
                          type="button"
                          onClick={() => setDeleteTargetPostId(post.id)}
                          aria-label="Excluir publicação"
                          className="grid min-h-[40px] min-w-[40px] place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-rose-600 transition"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setReportTarget({ uid: post.autorId, name: post.autorNome })}
                          aria-label="Denunciar publicação"
                          className="grid min-h-[40px] min-w-[40px] place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-rose-600 transition"
                        >
                          <Flag className="size-4" />
                        </button>
                      )}
                    </div>

                    {/* Body */}
                    <p className="mt-4 text-sm leading-relaxed text-foreground whitespace-pre-line break-words">
                      {post.texto}
                    </p>

                    {post.fotoUrl && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                        <img
                          src={post.fotoUrl}
                          alt="Foto da publicação"
                          className="w-full max-h-96 object-cover"
                        />
                      </div>
                    )}

                    {/* Interaction Bar */}
                    <div className="mt-5 flex items-center gap-6 border-t border-border/50 pt-4 text-xs font-semibold text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => void toggleLikePost(post.id)}
                        className={`flex min-h-[38px] items-center gap-1.5 transition-colors ${
                          post.curtidoPeloUsuario ? 'text-coral' : 'hover:text-foreground'
                        }`}
                      >
                        <Heart
                          className={`size-4.5 ${
                            post.curtidoPeloUsuario ? 'fill-current text-coral' : ''
                          }`}
                        />
                        <span>{post.curtidas} curtidas</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleToggleComments(post.id)}
                        className="flex min-h-[38px] items-center gap-1.5 hover:text-foreground transition-colors"
                      >
                        <MessageSquare className="size-4.5" />
                        <span>{post.comentariosCount} comentários</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {activeCommentsPostId === post.id && (
                      <div className="mt-4 space-y-3 border-t border-border/40 pt-4 animate-in fade-in duration-200">
                        {postComments.length > 0 ? (
                          postComments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2.5 text-xs">
                              <img
                                src={c.autorFoto || '/icons/icon-192.webp'}
                                alt={c.autorNome}
                                className="size-7 rounded-full object-cover shrink-0 bg-muted"
                              />
                              <div className="flex-1 rounded-2xl bg-muted/70 p-3">
                                <div className="flex items-center justify-between font-bold text-foreground gap-2">
                                  <span>
                                    {c.autorNome} {c.autorBandeira}
                                  </span>
                                  <span className="text-[10px] font-normal text-muted-foreground">
                                    {c.createdAt}
                                  </span>
                                </div>
                                <p className="mt-1 text-foreground/90 leading-relaxed break-words">
                                  {c.texto}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground py-1 text-center">
                            Nenhum comentário ainda. Seja a primeira pessoa a responder!
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            maxLength={600}
                            placeholder="Deixe um comentário respeitoso..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                void handleSendComment(post.id);
                              }
                            }}
                            className="flex-1 min-h-[42px] rounded-full border border-border bg-background px-4 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            disabled={!commentInput.trim() || commentSending}
                            onClick={() => void handleSendComment(post.id)}
                            aria-label="Enviar comentário"
                            className="grid size-10 place-items-center rounded-full bg-brand text-primary-foreground shadow-soft active:scale-95 disabled:opacity-40"
                          >
                            {commentSending ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Send className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={Boolean(deleteTargetPostId)}
        title="Excluir publicação?"
        description="Esta ação remove permanentemente sua publicação do Mural Global."
        confirmLabel="Excluir"
        destructive
        onCancel={() => setDeleteTargetPostId(null)}
        onConfirm={async () => {
          if (!deleteTargetPostId) return;
          await deleteMuralPost(deleteTargetPostId);
          setDeleteTargetPostId(null);
        }}
      />

      {reportTarget && (
        <ReportModal
          open={Boolean(reportTarget)}
          targetUid={reportTarget.uid}
          targetName={reportTarget.name}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
};

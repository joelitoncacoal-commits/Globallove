import React, { useState } from 'react';
import {
  Compass,
  Heart,
  MessageSquare,
  Send,
  Languages,
  ImagePlus,
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Mural: React.FC = () => {
  const { muralPosts, toggleLikePost, addMuralPost, addMuralComment, user } = useApp();

  const [novoTexto, setNovoTexto] = useState('');
  const [novaFoto, setNovaFoto] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [translatedPosts, setTranslatedPosts] = useState<Record<string, boolean>>({});

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTexto.trim()) return;
    addMuralPost(novoTexto, novaFoto.trim() || undefined);
    setNovoTexto('');
    setNovaFoto('');
    setShowPhotoInput(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addMuralComment(postId, commentInput);
    setCommentInput('');
  };

  const toggleTranslate = (postId: string) => {
    setTranslatedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
          <Compass className="size-3.5" /> Comunidade GlobalLove.com
        </div>
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Mural da Comunidade
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compartilhe pensamentos, momentos do dia a dia, viagens e conexões culturais com membros do mundo todo.
        </p>
      </div>

      {/* New Post Box */}
      <form
        onSubmit={handlePublish}
        className="mb-8 rounded-3xl border border-border bg-card p-5 shadow-soft transition-all focus-within:border-primary/40 focus-within:shadow-card"
      >
        <div className="flex items-start gap-3">
          <div className="relative size-11 overflow-hidden rounded-full shadow-soft shrink-0">
            <img
              src={user.fotos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user.nome}
              className="size-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={novoTexto}
              onChange={(e) => setNovoTexto(e.target.value)}
              placeholder="O que está na sua órbita hoje? Compartilhe com a comunidade..."
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />

            {showPhotoInput && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Link de uma foto (URL)..."
                  value={novaFoto}
                  onChange={(e) => setNovaFoto(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
              <button
                type="button"
                onClick={() => setShowPhotoInput(!showPhotoInput)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  showPhotoInput
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <ImagePlus className="size-4" /> Foto
              </button>

              <button
                type="submit"
                disabled={!novoTexto.trim()}
                className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-bold text-primary-foreground shadow-soft transition-transform disabled:opacity-50 active:scale-95"
              >
                <Send className="size-3.5" /> Publicar no Mural
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-6">
        {muralPosts.map((post) => {
          const isTranslated = translatedPosts[post.id];
          const hasOriginal = !!post.textoOriginal;

          return (
            <article
              key={post.id}
              className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:border-border/80"
            >
              {/* Post Author Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 overflow-hidden rounded-full shadow-soft">
                    <img
                      src={post.autorFoto}
                      alt={post.autorNome}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-foreground">
                        {post.autorNome}
                      </span>
                      {post.isOficial && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <Sparkles className="size-3" /> Oficial
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.autorBandeira}</span>
                      <span>{post.autorCidade}, {post.autorPais}</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                {hasOriginal && (
                  <button
                    onClick={() => toggleTranslate(post.id)}
                    className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    title="Traduzir publicação"
                  >
                    <Languages className="size-3.5 text-primary" />
                    <span>{isTranslated ? 'Original' : 'Traduzir'}</span>
                  </button>
                )}
              </div>

              {/* Post Body */}
              <p className="mt-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
                {isTranslated && hasOriginal
                  ? 'Café especial e boa música para começar o dia em San Telmo. Saudações a todos os amigos no Brasil e no mundo!'
                  : post.texto}
              </p>

              {/* Photo Attachment */}
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
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.curtidoPeloUsuario
                      ? 'text-coral'
                      : 'hover:text-foreground'
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
                  onClick={() =>
                    setActiveCommentsPostId(
                      activeCommentsPostId === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <MessageSquare className="size-4.5" />
                  <span>{post.comentariosCount} comentários</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentsPostId === post.id && (
                <div className="mt-4 space-y-3 border-t border-border/40 pt-4 animate-in fade-in duration-200">
                  {/* Comments List */}
                  {post.comentarios && post.comentarios.length > 0 ? (
                    post.comentarios.map((c) => (
                      <div key={c.id} className="flex items-start gap-2.5 text-xs">
                        <img
                          src={c.autorFoto}
                          alt={c.autorNome}
                          className="size-7 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 rounded-2xl bg-muted/70 p-3">
                          <div className="flex items-center justify-between font-bold text-foreground">
                            <span>
                              {c.autorNome} {c.autorBandeira}
                            </span>
                            <span className="text-[10px] font-normal text-muted-foreground">
                              {c.createdAt}
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground leading-relaxed">
                            {c.texto}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground py-1 text-center">
                      Nenhum comentário ainda. Seja o primeiro a responder!
                    </p>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Deixe um comentário respeitoso..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="grid size-8 place-items-center rounded-full bg-brand text-primary-foreground shadow-soft active:scale-95"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

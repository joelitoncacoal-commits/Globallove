import { MuralPost } from '../types';

export const INITIAL_MURAL_POSTS: MuralPost[] = [
  {
    id: 'post_1',
    autorId: 'p_camila',
    autorNome: 'Camila Santos',
    autorFoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    autorCidade: 'São Paulo',
    autorPais: 'Brasil',
    autorBandeira: '🇧🇷',
    texto: 'Tarde de sábado linda na Pinacoteca! Alguém mais aqui é fã de arte brasileira e café com vista para o parque? ☕🌿',
    fotoUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1000&q=80',
    curtidas: 34,
    curtidoPeloUsuario: false,
    comentariosCount: 5,
    createdAt: 'Há 2 horas',
    comentarios: [
      {
        id: 'c1',
        autorNome: 'Lucas Meireles',
        autorFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        autorBandeira: '🇧🇷',
        texto: 'A Pinacoteca é incrível demais! Quando vou a SP é parada obrigatória.',
        createdAt: 'Há 1 hora'
      },
      {
        id: 'c2',
        autorNome: 'Sofia Vasconcelos',
        autorFoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        autorBandeira: '🇵🇹',
        texto: 'Fotografia linda! Tenho muita vontade de conhecer os museus de São Paulo.',
        createdAt: 'Há 45 minutos'
      }
    ]
  },
  {
    id: 'post_2',
    autorId: 'p_mateo',
    autorNome: 'Mateo Rossi',
    autorFoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    autorCidade: 'Buenos Aires',
    autorPais: 'Argentina',
    autorBandeira: '🇦🇷',
    texto: 'Un café de especialidad y buena música para empezar la mañana en San Telmo. ¡Saludos a todos los amigos en Brasil y el mundo!',
    textoOriginal: 'Un café de especialidad y buena música para empezar la mañana en San Telmo. ¡Saludos a todos los amigos en Brasil y el mundo!',
    idiomaOriginal: 'es',
    fotoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    curtidas: 48,
    curtidoPeloUsuario: false,
    comentariosCount: 8,
    createdAt: 'Há 4 horas',
    comentarios: [
      {
        id: 'c3',
        autorNome: 'Elena Moreno',
        autorFoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        autorBandeira: '🇪🇸',
        texto: '¡San Telmo tiene una magia única! Disfruta mucho ese café.',
        createdAt: 'Há 3 horas'
      }
    ]
  },
  {
    id: 'post_3',
    autorId: 'p_sofia',
    autorNome: 'Sofia Vasconcelos',
    autorFoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    autorCidade: 'Lisboa',
    autorPais: 'Portugal',
    autorBandeira: '🇵🇹',
    texto: 'O fim de tarde no Miradouro de Santa Catarina nunca desilude. Quem vier a Lisboa me avise para boas dicas de livros e cafés!',
    fotoUrl: 'https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=1000&q=80',
    curtidas: 62,
    curtidoPeloUsuario: true,
    comentariosCount: 12,
    createdAt: 'Ontem',
    comentarios: [
      {
        id: 'c4',
        autorNome: 'Camila Santos',
        autorFoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        autorBandeira: '🇧🇷',
        texto: 'Que vista maravilhosa Sofia! Quero muito visitar Lisboa em breve.',
        createdAt: 'Ontem'
      }
    ]
  },
  {
    id: 'post_4',
    autorId: 'p_equipe',
    autorNome: 'Equipe GlobalLove.com',
    autorFoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    autorCidade: 'Comunidade Global',
    autorPais: 'Mundo',
    autorBandeira: '🌍',
    isOficial: true,
    texto: '✨ Bem-vindos ao GlobalLove.com! Conectamos pessoas em 92 países com respeito mútuo, conversas privadas seguras e 100% gratuito para todos. Conte para a gente: qual país você sonha em visitar?',
    curtidas: 120,
    curtidoPeloUsuario: false,
    comentariosCount: 24,
    createdAt: 'Há 1 dia',
    comentarios: []
  }
];

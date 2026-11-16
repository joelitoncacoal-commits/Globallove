import { LifestyleHabit } from '../types';

export const LIFESTYLE_HABITS: LifestyleHabit[] = [
  { id: 'cafe_matinal', label: 'Café Matinal Sagrado', icon: '☕', categoria: 'rotina' },
  { id: 'academia_fitness', label: 'Academia & Treino', icon: '🏋️', categoria: 'rotina' },
  { id: 'pet_lover', label: 'Apaixonado(a) por Pets', icon: '🐾', categoria: 'estilo' },
  { id: 'home_office', label: 'Trabalho em Home Office', icon: '💻', categoria: 'rotina' },
  { id: 'cozinhar', label: 'Gosta de Cozinhar em Casa', icon: '🍳', categoria: 'rotina' },
  { id: 'vinho_gastronomia', label: 'Vinho & Boa Gastronomia', icon: '🍷', categoria: 'social' },
  { id: 'cinema_series', label: 'Maratonar Filmes & Séries', icon: '🍿', categoria: 'lazer' },
  { id: 'viagens_mochilao', label: 'Viajar & Conhecer Culturas', icon: '✈️', categoria: 'lazer' },
  { id: 'praia_sol', label: 'Praia, Sol & Mar', icon: '🏖️', categoria: 'lazer' },
  { id: 'trilhas_natureza', label: 'Trilhas, Camping & Natureza', icon: '🌲', categoria: 'lazer' },
  { id: 'leitura_livros', label: 'Livros & Literatura', icon: '📚', categoria: 'estilo' },
  { id: 'musica_shows', label: 'Shows, Festivais & Música', icon: '🎵', categoria: 'social' },
  { id: 'games_nerd', label: 'Games, PC & Consoles', icon: '🎮', categoria: 'lazer' },
  { id: 'yoga_meditacao', label: 'Yoga, Meditação & Paz', icon: '🧘', categoria: 'estilo' },
  { id: 'vida_noturna', label: 'Balada & Vida Noturna', icon: '🪩', categoria: 'social' },
  { id: 'fotografia', label: 'Fotografia & Criatividade', icon: '📷', categoria: 'estilo' },
  { id: 'madrugador', label: 'Acorda Cedo com Disposição', icon: '🌅', categoria: 'rotina' },
  { id: 'coruja_noturna', label: 'Coruja Noturna / Noite Ativa', icon: '🦉', categoria: 'rotina' },
];

export const HABIT_MAP = new Map(LIFESTYLE_HABITS.map(h => [h.id, h]));

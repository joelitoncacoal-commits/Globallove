import { SupportedLang } from '../types';

export interface TranslationStrings {
  brandName: string;
  tagline: string;
  nav: {
    discover: string;
    mural: string;
    matches: string;
    chats: string;
    map: string;
    guides: string;
    login: string;
    profile: string;
    register: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statsUsers: string;
    statsCountries: string;
    statsFree: string;
  };
  discovery: {
    like: string;
    pass: string;
    superlike: string;
    rewind: string;
    mutualInterests: string;
    mutualHabits: string;
    verifiedAge: string;
    distance: string;
    onlineNow: string;
    offline: string;
    filterTitle: string;
    allGenders: string;
    habitsTitle: string;
    interestsTitle: string;
    lookingFor: string;
    seeking: string;
  };
  chat: {
    startVideoCall: string;
    videoCalling: string;
    calling: string;
    connected: string;
    endCall: string;
    mute: string;
    unmute: string;
    cameraOn: string;
    cameraOff: string;
    typeMessage: string;
    send: string;
    sendPhoto: string;
    sendVideo: string;
    sendAudio: string;
    recordVoice: string;
    recording: string;
    stopRecording: string;
    emptyChat: string;
  };
  auth: {
    registerTitle: string;
    registerSubtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    realName: string;
    realAge: string;
    ageNotice: string;
    email: string;
    gender: string;
    interestedIn: string;
    address: string;
    addressNotice: string;
    city: string;
    country: string;
    photo: string;
    photoNotice: string;
    habits: string;
    habitsNotice: string;
    submit: string;
    next: string;
    back: string;
    success: string;
  };
}

export const translations: Record<SupportedLang, TranslationStrings> = {
  pt: {
    brandName: 'GlobalLove.com',
    tagline: 'Conectando corações sem fronteiras nem barreiras no mundo todo',
    nav: {
      discover: 'Descobrir',
      mural: 'Mural Global',
      matches: 'Matches',
      chats: 'Conversas',
      map: 'Mapa Mundi',
      guides: 'Guias',
      login: 'Entrar',
      profile: 'Meu Perfil',
      register: 'Cadastre-se Grátis',
    },
    hero: {
      badge: 'Plataforma Global 100% Gratuita & Sem Limites',
      titleStart: 'Encontre o amor verdadeiro em',
      titleHighlight: 'qualquer lugar do planeta',
      titleEnd: '',
      subtitle: 'Conexões autênticas, chamadas de vídeo, chat multimídia e afinidades de rotina em mais de 92 países.',
      ctaPrimary: 'Começar Agora — É Grátis',
      ctaSecondary: 'Ver Mapa Global',
      statsUsers: 'Usuários ativos pelo mundo',
      statsCountries: 'Países e territórios conectados',
      statsFree: 'Gratuito para sempre',
    },
    discovery: {
      like: 'Curtir',
      pass: 'Pular',
      superlike: 'Super Like',
      rewind: 'Desfazer',
      mutualInterests: 'Afinidades em comum',
      mutualHabits: 'Ambos compartilham estes hábitos do dia a dia:',
      verifiedAge: 'Idade Verificada',
      distance: 'de você',
      onlineNow: 'Online agora',
      offline: 'Visto recentemente',
      filterTitle: 'Filtros Avançados',
      allGenders: 'Todos os gêneros',
      habitsTitle: 'Hábitos e Estilo de Vida',
      interestsTitle: 'Interesses',
      lookingFor: 'Procurando:',
      seeking: 'Interesse em:',
    },
    chat: {
      startVideoCall: 'Vídeo Chamada',
      videoCalling: 'Em chamada de vídeo com',
      calling: 'Chamando...',
      connected: 'Conectado em HD',
      endCall: 'Encerrar Chamada',
      mute: 'Silenciar',
      unmute: 'Ativar Microfone',
      cameraOn: 'Câmera Ativa',
      cameraOff: 'Câmera Desligada',
      typeMessage: 'Digite uma mensagem carinhosa...',
      send: 'Enviar',
      sendPhoto: 'Enviar Foto',
      sendVideo: 'Enviar Vídeo',
      sendAudio: 'Gravar Áudio',
      recordVoice: 'Segure para gravar áudio',
      recording: 'Gravando áudio...',
      stopRecording: 'Parar e Enviar',
      emptyChat: 'Envie uma mensagem ou inicie uma vídeo chamada para quebrar o gelo!',
    },
    auth: {
      registerTitle: 'Crie seu perfil completo no GlobalLove.com',
      registerSubtitle: '100% gratuito. Encontre pessoas reais com base na sua rotina e preferências verdadeiras.',
      step1: 'Dados Pessoais',
      step2: 'Identidade & Desejos',
      step3: 'Foto & Onde Mora',
      step4: 'Hábitos do Dia a Dia',
      realName: 'Nome Verdadeiro',
      realAge: 'Idade Real',
      ageNotice: 'Maior de 18 anos. Idade verificada para garantir segurança e transparência mútua.',
      email: 'Seu Melhor E-mail',
      gender: 'Seu Gênero Detalhado',
      interestedIn: 'O que você quer encontrar?',
      address: 'Endereço residencial / Bairro',
      addressNotice: 'Usado para calcular a distância exata em km entre vocês mantendo sua privacidade.',
      city: 'Sua Cidade',
      country: 'Seu País',
      photo: 'Foto de Perfil Real',
      photoNotice: 'Carregue uma foto nítida e verdadeira do seu rosto.',
      habits: 'Seus Hábitos Diários',
      habitsNotice: 'Selecione o que você faz no dia a dia. Se a outra pessoa gostar do mesmo, mostramos a ambos!',
      submit: 'Concluir Cadastro Grátis',
      next: 'Avançar',
      back: 'Voltar',
      success: 'Cadastro concluído com sucesso! Bem-vindo ao GlobalLove.com.',
    },
  },
  en: {
    brandName: 'GlobalLove.com',
    tagline: 'Connecting hearts across borders worldwide without barriers',
    nav: {
      discover: 'Discover',
      mural: 'Global Wall',
      matches: 'Matches',
      chats: 'Messages',
      map: 'World Map',
      guides: 'Guides',
      login: 'Sign In',
      profile: 'My Profile',
      register: 'Sign Up Free',
    },
    hero: {
      badge: '100% Free Global Dating Platform & No Limits',
      titleStart: 'Find genuine love anywhere',
      titleHighlight: 'across the entire globe',
      titleEnd: '',
      subtitle: 'Real connections, video calls, multimedia chat, and shared daily lifestyle habits across 92+ countries.',
      ctaPrimary: 'Start Exploring — It’s Free',
      ctaSecondary: 'Explore World Map',
      statsUsers: 'Active members worldwide',
      statsCountries: 'Countries & territories',
      statsFree: 'Free forever with no paywalls',
    },
    discovery: {
      like: 'Like',
      pass: 'Pass',
      superlike: 'Super Like',
      rewind: 'Undo',
      mutualInterests: 'Mutual affinities',
      mutualHabits: 'Both share these daily routine habits:',
      verifiedAge: 'Verified Age',
      distance: 'from you',
      onlineNow: 'Online now',
      offline: 'Recently online',
      filterTitle: 'Advanced Filters',
      allGenders: 'All genders',
      habitsTitle: 'Habits & Lifestyle',
      interestsTitle: 'Interests',
      lookingFor: 'Looking for:',
      seeking: 'Interested in:',
    },
    chat: {
      startVideoCall: 'Video Call',
      videoCalling: 'Video call with',
      calling: 'Calling...',
      connected: 'HD Connected',
      endCall: 'End Call',
      mute: 'Mute',
      unmute: 'Unmute',
      cameraOn: 'Camera On',
      cameraOff: 'Camera Off',
      typeMessage: 'Type a sweet message...',
      send: 'Send',
      sendPhoto: 'Send Photo',
      sendVideo: 'Send Video',
      sendAudio: 'Voice Note',
      recordVoice: 'Record voice note',
      recording: 'Recording audio...',
      stopRecording: 'Stop & Send',
      emptyChat: 'Send a message or start a live video call to break the ice!',
    },
    auth: {
      registerTitle: 'Create your complete profile on GlobalLove.com',
      registerSubtitle: '100% free. Connect with verified people matching your true lifestyle and daily habits.',
      step1: 'Personal Info',
      step2: 'Identity & Seeking',
      step3: 'Photo & Location',
      step4: 'Daily Habits',
      realName: 'Real Name',
      realAge: 'Real Age',
      ageNotice: 'Must be 18+. Verified age ensures transparency and genuine safety for everyone.',
      email: 'Best Email Address',
      gender: 'Detailed Gender',
      interestedIn: 'Who are you looking to meet?',
      address: 'Residential address / Neighborhood',
      addressNotice: 'Used to calculate accurate km distance while preserving exact location privacy.',
      city: 'Your City',
      country: 'Your Country',
      photo: 'Real Profile Photo',
      photoNotice: 'Upload a clear, authentic photo showing your face.',
      habits: 'Daily Lifestyle Habits',
      habitsNotice: 'Choose what you love doing daily. When someone loves the same, we spotlight it to both!',
      submit: 'Complete Free Registration',
      next: 'Next Step',
      back: 'Go Back',
      success: 'Registration completed! Welcome to GlobalLove.com.',
    },
  },
  es: {
    brandName: 'GlobalLove.com',
    tagline: 'Conectando corazones sin fronteras ni barreras en todo el mundo',
    nav: {
      discover: 'Descubrir',
      mural: 'Muro Global',
      matches: 'Matches',
      chats: 'Mensajes',
      map: 'Mapa Mundial',
      guides: 'Guías',
      login: 'Ingresar',
      profile: 'Mi Perfil',
      register: 'Registro Gratis',
    },
    hero: {
      badge: 'Plataforma Global 100% Gratis y Sin Límites',
      titleStart: 'Encuentra el amor verdadero en',
      titleHighlight: 'cualquier rincón del planeta',
      titleEnd: '',
      subtitle: 'Conexiones reales, videollamadas, chat multimedia y afinidades de rutina diaria en más de 92 países.',
      ctaPrimary: 'Comenzar Gratis',
      ctaSecondary: 'Ver Mapa Global',
      statsUsers: 'Usuarios activos en el mundo',
      statsCountries: 'Países y territorios conectados',
      statsFree: 'Gratis para siempre',
    },
    discovery: {
      like: 'Me gusta',
      pass: 'Pasar',
      superlike: 'Super Like',
      rewind: 'Deshacer',
      mutualInterests: 'Afinidades mutuas',
      mutualHabits: 'Ambos comparten estos hábitos diarios:',
      verifiedAge: 'Edad Verificada',
      distance: 'de ti',
      onlineNow: 'En línea ahora',
      offline: 'Visto recientemente',
      filterTitle: 'Filtros Avanzados',
      allGenders: 'Todos los géneros',
      habitsTitle: 'Hábitos y Estilo de Vida',
      interestsTitle: 'Intereses',
      lookingFor: 'Buscando:',
      seeking: 'Interesado/a en:',
    },
    chat: {
      startVideoCall: 'Videollamada',
      videoCalling: 'En videollamada con',
      calling: 'Llamando...',
      connected: 'Conectado en HD',
      endCall: 'Finalizar',
      mute: 'Silenciar',
      unmute: 'Activar micrófono',
      cameraOn: 'Cámara Activa',
      cameraOff: 'Cámara Apagada',
      typeMessage: 'Escribe un mensaje cariñoso...',
      send: 'Enviar',
      sendPhoto: 'Enviar Foto',
      sendVideo: 'Enviar Video',
      sendAudio: 'Grabar Audio',
      recordVoice: 'Grabar mensaje de voz',
      recording: 'Grabando...',
      stopRecording: 'Detener y Enviar',
      emptyChat: '¡Envía un mensaje o inicia una videollamada para romper el hielo!',
    },
    auth: {
      registerTitle: 'Crea tu perfil completo en GlobalLove.com',
      registerSubtitle: '100% gratis. Conoce personas reales con base en tu rutina y preferencias auténticas.',
      step1: 'Datos Personales',
      step2: 'Identidad y Gustos',
      step3: 'Foto y Dirección',
      step4: 'Hábitos del Día a Día',
      realName: 'Nombre Real',
      realAge: 'Edad Real',
      ageNotice: 'Mayor de 18 años con edad comprobada para mayor seguridad y confianza.',
      email: 'Correo Electrónico',
      gender: 'Género Detallado',
      interestedIn: '¿Qué deseas encontrar?',
      address: 'Dirección residencial / Barrio',
      addressNotice: 'Calcula la distancia exacta en km garantizando tu privacidad.',
      city: 'Ciudad',
      country: 'País',
      photo: 'Foto de Perfil Real',
      photoNotice: 'Sube una foto clara y verdadera de tu rostro.',
      habits: 'Hábitos Diarios',
      habitsNotice: 'Selecciona lo que disfrutas hacer. Si la otra persona coincide, ¡se lo mostramos a ambos!',
      submit: 'Completar Registro Gratis',
      next: 'Siguiente',
      back: 'Atrás',
      success: '¡Registro completado! Bienvenido a GlobalLove.com.',
    },
  },
  fr: {
    brandName: 'GlobalLove.com',
    tagline: 'Connecter les cœurs au-delà des frontières dans le monde entier',
    nav: {
      discover: 'Découvrir',
      mural: 'Mur Global',
      matches: 'Matchs',
      chats: 'Messages',
      map: 'Carte du Monde',
      guides: 'Guides',
      login: 'Connexion',
      profile: 'Mon Profil',
      register: 'Inscription Gratuite',
    },
    hero: {
      badge: 'Plateforme Mondiale 100% Gratuite & Sans Limites',
      titleStart: 'Trouvez le grand amour',
      titleHighlight: 'partout sur la planète',
      titleEnd: '',
      subtitle: 'Connexions authentiques, appels vidéo, chat multimédia et habitudes de vie partagées dans plus de 92 pays.',
      ctaPrimary: 'Commencer Gratuitement',
      ctaSecondary: 'Explorer la Carte',
      statsUsers: 'Membres actifs dans le monde',
      statsCountries: 'Pays connectés',
      statsFree: 'Gratuit pour toujours',
    },
    discovery: {
      like: 'Aimer',
      pass: 'Passer',
      superlike: 'Super Like',
      rewind: 'Annuler',
      mutualInterests: 'Affinités communes',
      mutualHabits: 'Vous partagez ces habitudes quotidiennes :',
      verifiedAge: 'Âge Vérifié',
      distance: 'de vous',
      onlineNow: 'En ligne',
      offline: 'Vu récemment',
      filterTitle: 'Filtres Avancés',
      allGenders: 'Tous les genres',
      habitsTitle: 'Habitudes & Style de Vie',
      interestsTitle: 'Centres d’intérêt',
      lookingFor: 'Recherche :',
      seeking: 'Intéressé(e) par :',
    },
    chat: {
      startVideoCall: 'Appel Vidéo',
      videoCalling: 'Appel vidéo avec',
      calling: 'Appel en cours...',
      connected: 'Connecté en HD',
      endCall: 'Raccrocher',
      mute: 'Couper micro',
      unmute: 'Activer micro',
      cameraOn: 'Caméra Active',
      cameraOff: 'Caméra Coupée',
      typeMessage: 'Écrivez un message bienveillant...',
      send: 'Envoyer',
      sendPhoto: 'Envoyer Photo',
      sendVideo: 'Envoyer Vidéo',
      sendAudio: 'Message Vocal',
      recordVoice: 'Enregistrer vocal',
      recording: 'Enregistrement...',
      stopRecording: 'Arrêter et Envoyer',
      emptyChat: 'Envoyez un message ou lancez un appel vidéo en direct !',
    },
    auth: {
      registerTitle: 'Créez votre profil sur GlobalLove.com',
      registerSubtitle: '100% gratuit. Rencontrez des personnes réelles selon votre quotidien.',
      step1: 'Informations',
      step2: 'Identité & Préférences',
      step3: 'Photo & Résidence',
      step4: 'Habitudes du Quotidien',
      realName: 'Vrai Prénom',
      realAge: 'Âge Réel',
      ageNotice: '18 ans et plus. Âge vérifié pour un environnement sûr et transparent.',
      email: 'Adresse E-mail',
      gender: 'Genre Détaillé',
      interestedIn: 'Qui souhaitez-vous rencontrer ?',
      address: 'Adresse / Quartier de résidence',
      addressNotice: 'Permet de calculer la distance exacte en km tout en protégeant votre intimité.',
      city: 'Ville',
      country: 'Pays',
      photo: 'Photo Réelle',
      photoNotice: 'Téléchargez une photo claire de votre visage.',
      habits: 'Habitudes Quotidiennes',
      habitsNotice: 'Choisissez ce que vous aimez. Si votre match aime la même chose, nous l’affichons aux deux !',
      submit: 'Finaliser l’Inscription',
      next: 'Suivant',
      back: 'Retour',
      success: 'Bienvenue sur GlobalLove.com !',
    },
  },
  de: {
    brandName: 'GlobalLove.com',
    tagline: 'Herzen weltweit grenzenlos und ohne Barrieren verbinden',
    nav: {
      discover: 'Entdecken',
      mural: 'Globale Pinnwand',
      matches: 'Matches',
      chats: 'Nachrichten',
      map: 'Weltkarte',
      guides: 'Ratgeber',
      login: 'Anmelden',
      profile: 'Mein Profil',
      register: 'Kostenlos Registrieren',
    },
    hero: {
      badge: '100% Kostenlose Globale Dating-Plattform',
      titleStart: 'Finde die wahre Liebe an',
      titleHighlight: 'jedem Ort der Welt',
      titleEnd: '',
      subtitle: 'Echte Menschen, Videoanrufe, Multimedia-Chat und gemeinsame Alltagsgewohnheiten in über 92 Ländern.',
      ctaPrimary: 'Jetzt Kostenlos Starten',
      ctaSecondary: 'Weltkarte Entdecken',
      statsUsers: 'Aktive Nutzer weltweit',
      statsCountries: 'Länder verbunden',
      statsFree: 'Für immer kostenlos',
    },
    discovery: {
      like: 'Gefällt mir',
      pass: 'Weiter',
      superlike: 'Super Like',
      rewind: 'Zurück',
      mutualInterests: 'Gemeinsame Vorlieben',
      mutualHabits: 'Ihr teilt diese Alltagsgewohnheiten:',
      verifiedAge: 'Verifiziertes Alter',
      distance: 'von dir entfernt',
      onlineNow: 'Jetzt online',
      offline: 'Kürzlich online',
      filterTitle: 'Erweiterte Filter',
      allGenders: 'Alle Geschlechter',
      habitsTitle: 'Gewohnheiten & Lifestyle',
      interestsTitle: 'Interessen',
      lookingFor: 'Sucht nach:',
      seeking: 'Interessiert an:',
    },
    chat: {
      startVideoCall: 'Videoanruf',
      videoCalling: 'Videoanruf mit',
      calling: 'Wird angerufen...',
      connected: 'In HD verbunden',
      endCall: 'Beenden',
      mute: 'Stummschalten',
      unmute: 'Mikrofon an',
      cameraOn: 'Kamera an',
      cameraOff: 'Kamera aus',
      typeMessage: 'Schreibe eine liebevolle Nachricht...',
      send: 'Senden',
      sendPhoto: 'Foto senden',
      sendVideo: 'Video senden',
      sendAudio: 'Sprachnachricht',
      recordVoice: 'Sprachnachricht aufnehmen',
      recording: 'Aufnahme läuft...',
      stopRecording: 'Stoppen & Senden',
      emptyChat: 'Sende eine Nachricht oder starte einen Videoanruf!',
    },
    auth: {
      registerTitle: 'Erstelle dein Profil auf GlobalLove.com',
      registerSubtitle: '100% kostenlos. Echte Kontakte basierend auf deinem Alltag und deinen Vorlieben.',
      step1: 'Persönliche Daten',
      step2: 'Identität & Suche',
      step3: 'Foto & Wohnort',
      step4: 'Alltagsgewohnheiten',
      realName: 'Echter Name',
      realAge: 'Echtes Alter',
      ageNotice: 'Ab 18 Jahren. Verifiziertes Alter für maximale Sicherheit.',
      email: 'E-Mail-Adresse',
      gender: 'Detailliertes Geschlecht',
      interestedIn: 'Wen suchst du?',
      address: 'Wohnadresse / Stadtteil',
      addressNotice: 'Berechnet die genaue Distanz in km bei vollem Schutz deiner Privatsphäre.',
      city: 'Stadt',
      country: 'Land',
      photo: 'Echtes Profilfoto',
      photoNotice: 'Lade ein deutliches Foto deines Gesichts hoch.',
      habits: 'Alltagsgewohnheiten',
      habitsNotice: 'Wähle deine Gewohnheiten. Habt ihr die gleichen, heben wir es für euch beide hervor!',
      submit: 'Registrierung Abschließen',
      next: 'Weiter',
      back: 'Zurück',
      success: 'Willkommen bei GlobalLove.com!',
    },
  },
  it: {
    brandName: 'GlobalLove.com',
    tagline: 'Connettere i cuori oltre ogni confine nel mondo intero',
    nav: {
      discover: 'Scopri',
      mural: 'Bacheca Globale',
      matches: 'Affinità',
      chats: 'Messaggi',
      map: 'Mappa del Mondo',
      guides: 'Guide',
      login: 'Accedi',
      profile: 'Il Mio Profilo',
      register: 'Registrati Gratis',
    },
    hero: {
      badge: 'Piattaforma Globale 100% Gratuita & Senza Limiti',
      titleStart: 'Trova il vero amore in',
      titleHighlight: 'qualsiasi angolo del pianeta',
      titleEnd: '',
      subtitle: 'Connessioni autentiche, videochiamate, chat multimediale e abitudini condivise in oltre 92 paesi.',
      ctaPrimary: 'Inizia Ora Gratis',
      ctaSecondary: 'Esplora la Mappa',
      statsUsers: 'Utenti attivi nel mondo',
      statsCountries: 'Paesi collegati',
      statsFree: 'Gratuito per sempre',
    },
    discovery: {
      like: 'Mi piace',
      pass: 'Salta',
      superlike: 'Super Like',
      rewind: 'Annulla',
      mutualInterests: 'Affinità in comune',
      mutualHabits: 'Condividete queste abitudini di routine:',
      verifiedAge: 'Età Verificata',
      distance: 'da te',
      onlineNow: 'Online adesso',
      offline: 'Visto di recente',
      filterTitle: 'Filtri Avanzati',
      allGenders: 'Tutti i generi',
      habitsTitle: 'Abitudini e Stile di Vita',
      interestsTitle: 'Interessi',
      lookingFor: 'Cerca:',
      seeking: 'Interesse per:',
    },
    chat: {
      startVideoCall: 'Videochiamata',
      videoCalling: 'Videochiamata con',
      calling: 'Chiamata in corso...',
      connected: 'Connesso in HD',
      endCall: 'Termina Chiamata',
      mute: 'Silenzia',
      unmute: 'Attiva Microfono',
      cameraOn: 'Fotocamera Attiva',
      cameraOff: 'Fotocamera Spenta',
      typeMessage: 'Scrivi un messaggio dolce...',
      send: 'Invia',
      sendPhoto: 'Invia Foto',
      sendVideo: 'Invia Video',
      sendAudio: 'Messaggio Vocale',
      recordVoice: 'Registra nota vocale',
      recording: 'Registrazione...',
      stopRecording: 'Ferma e Invia',
      emptyChat: 'Invia un messaggio o avvia una videochiamata per rompere il ghiaccio!',
    },
    auth: {
      registerTitle: 'Crea il tuo profilo su GlobalLove.com',
      registerSubtitle: '100% gratuito. Incontra persone reali che condividono la tua quotidianità.',
      step1: 'Dati Personali',
      step2: 'Identità & Desideri',
      step3: 'Foto & Dove Vivi',
      step4: 'Abitudini Quotidiane',
      realName: 'Nome Vero',
      realAge: 'Età Vera',
      ageNotice: 'Maggiori di 18 anni. Età verificata per massima sicurezza e trasparenza.',
      email: 'Email Principale',
      gender: 'Genere Dettagliato',
      interestedIn: 'Chi vorresti incontrare?',
      address: 'Indirizzo di residenza / Quartiere',
      addressNotice: 'Usato per calcolare la distanza esatta in km nel rispetto della tua privacy.',
      city: 'Città',
      country: 'Paese',
      photo: 'Foto Reale del Profilo',
      photoNotice: 'Carica una foto chiara e autentica del tuo volto.',
      habits: 'Abitudini del Giorno',
      habitsNotice: 'Seleziona le tue abitudini. Se l’altra persona ama le stesse cose, lo mostriamo a entrambi!',
      submit: 'Concludi Registrazione',
      next: 'Avanti',
      back: 'Indietro',
      success: 'Benvenuto su GlobalLove.com!',
    },
  },
  ja: {
    brandName: 'GlobalLove.com',
    tagline: '国境を越えて世界中の心をつなぐグローバルマッチング',
    nav: {
      discover: '探す',
      mural: 'グローバル壁新聞',
      matches: 'マッチ',
      chats: 'メッセージ',
      map: '世界地図',
      guides: 'ガイド',
      login: 'ログイン',
      profile: 'プロフィール',
      register: '無料登録',
    },
    hero: {
      badge: '世界92カ国以上・完全無料グローバルプラットフォーム',
      titleStart: '地球上のどこでも',
      titleHighlight: '真実の愛を見つけよう',
      titleEnd: '',
      subtitle: '本物の出会い、ビデオ通話、マルチメディアチャット、日常の共通の習慣でつながる。',
      ctaPrimary: '無料で始める',
      ctaSecondary: '世界地図を見る',
      statsUsers: '世界中のアクティブユーザー',
      statsCountries: '対応国・地域',
      statsFree: 'ずっと完全無料',
    },
    discovery: {
      like: 'いいね',
      pass: 'スキップ',
      superlike: 'スーパーライク',
      rewind: '元に戻す',
      mutualInterests: '共通の趣味・好み',
      mutualHabits: '2人が共有する日々のライフスタイル習慣：',
      verifiedAge: '年齢確認済み',
      distance: '離れた場所',
      onlineNow: 'オンライン',
      offline: '最近アクセス',
      filterTitle: '高度なフィルター',
      allGenders: 'すべてのジェンダー',
      habitsTitle: '日々の習慣・ライフスタイル',
      interestsTitle: '興味・関心',
      lookingFor: '探している関係：',
      seeking: '希望する相手：',
    },
    chat: {
      startVideoCall: 'ビデオ通話',
      videoCalling: 'ビデオ通話中：',
      calling: '呼び出し中...',
      connected: 'HD接続完了',
      endCall: '通話を終了',
      mute: '消音',
      unmute: 'マイクオン',
      cameraOn: 'カメラオン',
      cameraOff: 'カメラオフ',
      typeMessage: '温かいメッセージを入力...',
      send: '送信',
      sendPhoto: '写真を送信',
      sendVideo: '動画を送信',
      sendAudio: '音声メッセージ',
      recordVoice: 'ボイスメッセージを録音',
      recording: '録音中...',
      stopRecording: '停止して送信',
      emptyChat: 'メッセージを送るかビデオ通話で会話を始めましょう！',
    },
    auth: {
      registerTitle: 'GlobalLove.com にプロフィールを作成',
      registerSubtitle: '完全無料。あなたの日常や本当の好みに合う実在の人々とつながります。',
      step1: '基本情報',
      step2: 'アイデンティティと希望',
      step3: '写真とお住まいの地域',
      step4: '毎日の生活習慣',
      realName: '本名・氏名',
      realAge: '実年齢',
      ageNotice: '18歳以上。安全と透明性を確保するため年齢を確認します。',
      email: 'メールアドレス',
      gender: '詳しいジェンダー',
      interestedIn: '出会いたい相手',
      address: 'お住まいの住所・エリア',
      addressNotice: 'プライバシーを守りながら、相手との正確なキロメートル距離を計算します。',
      city: '都市',
      country: '国',
      photo: '本人の顔写真',
      photoNotice: 'お顔がはっきりとわかる本人の写真をアップロードしてください。',
      habits: '毎日の習慣',
      habitsNotice: '日頃行うことを選んでください。相手と同じ場合、両方に共通点として表示されます！',
      submit: '無料登録を完了する',
      next: '次へ',
      back: '戻る',
      success: '登録が完了しました！GlobalLove.com へようこそ。',
    },
  },
  zh: {
    brandName: 'GlobalLove.com',
    tagline: '无界跨国·连接全球真爱与心灵的约会平台',
    nav: {
      discover: '探索',
      mural: '全球动态',
      matches: '匹配',
      chats: '消息',
      map: '世界地图',
      guides: '指南',
      login: '登录',
      profile: '个人主页',
      register: '免费注册',
    },
    hero: {
      badge: '全球100%永久免费·无付费门槛',
      titleStart: '在世界任何角落',
      titleHighlight: '找到属于你的真爱',
      titleEnd: '',
      subtitle: '跨越92个国家，高清视频通话、多媒体聊天，根据日常真实习惯匹配灵魂伴侣。',
      ctaPrimary: '免费开启相遇',
      ctaSecondary: '浏览世界地图',
      statsUsers: '全球活跃用户',
      statsCountries: '覆盖国家和地区',
      statsFree: '永久免费开放',
    },
    discovery: {
      like: '喜欢',
      pass: '跳过',
      superlike: '超级喜欢',
      rewind: '撤销',
      mutualInterests: '共同喜好',
      mutualHabits: '双方共同拥有的日常生活习惯：',
      verifiedAge: '真实认证年龄',
      distance: '距您',
      onlineNow: '当前在线',
      offline: '最近活跃',
      filterTitle: '高级筛选',
      allGenders: '所有性别',
      habitsTitle: '日常习惯与生活方式',
      interestsTitle: '兴趣爱好',
      lookingFor: '正在寻找：',
      seeking: '意向对象：',
    },
    chat: {
      startVideoCall: '视频通话',
      videoCalling: '正在与对方视频通话：',
      calling: '呼叫中...',
      connected: '高清已连接',
      endCall: '挂断通话',
      mute: '静音',
      unmute: '开启麦克风',
      cameraOn: '开启摄像头',
      cameraOff: '关闭摄像头',
      typeMessage: '发送一条暖心的消息...',
      send: '发送',
      sendPhoto: '发送照片',
      sendVideo: '发送视频',
      sendAudio: '语音留言',
      recordVoice: '录制语音',
      recording: '正在录音...',
      stopRecording: '停止并发送',
      emptyChat: '打个招呼或发起视频通话打破沉默吧！',
    },
    auth: {
      registerTitle: '在 GlobalLove.com 创建完整档案',
      registerSubtitle: '100%免费。基于真实生活习惯与明确意向，结识全球真实会员。',
      step1: '基本资料',
      step2: '性别与择偶期望',
      step3: '真实照片与居住地址',
      step4: '日常起居习惯',
      realName: '真实姓名',
      realAge: '真实年龄',
      ageNotice: '须年满18周岁。真实年龄核验，确保交友环境安全可靠。',
      email: '常用电子邮箱',
      gender: '详细性别',
      interestedIn: '您希望结识谁？',
      address: '居住地址 / 街区',
      addressNotice: '严格保护个人隐私，仅用于精准计算彼此间的公里直线距离。',
      city: '所在城市',
      country: '所在国家',
      photo: '真实头像照片',
      photoNotice: '请上传清晰、真实的本人免冠正面照片。',
      habits: '日常生活习惯',
      habitsNotice: '选择您的日常作息与爱好。如果对方也喜欢同样的事物，系统将为双方高亮展现！',
      submit: '完成免费注册',
      next: '下一步',
      back: '返回',
      success: '注册成功！欢迎来到 GlobalLove.com。',
    },
  },
};

export function detectBrowserLanguage(): SupportedLang {
  try {
    const saved = localStorage.getItem('globallove_lang') as SupportedLang;
    if (saved && translations[saved]) return saved;

    const navLang = (navigator.language || navigator.languages?.[0] || 'pt').toLowerCase();
    if (navLang.startsWith('pt')) return 'pt';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('fr')) return 'fr';
    if (navLang.startsWith('de')) return 'de';
    if (navLang.startsWith('it')) return 'it';
    if (navLang.startsWith('ja')) return 'ja';
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('en')) return 'en';
    return 'pt'; // default
  } catch {
    return 'pt';
  }
}

export function getTranslations(lang: SupportedLang): TranslationStrings {
  return translations[lang] || translations.pt;
}

export const LANGUAGE_OPTIONS: { code: SupportedLang; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, ArrowRight, RotateCcw, 
  CheckCircle2, XCircle, Heart, Timer, Trophy, Medal, 
  Award, X, HeartCrack, Volume2, VolumeX, Lightbulb, 
  Play, Activity, Image as ImageIcon, Smartphone, 
  Search, Crosshair, Fingerprint, Download, User,
  Wifi, Battery, Signal, MessageCircle, Phone, Mail,
  AlertTriangle, Wrench, ShieldX, Check, Radio
} from 'lucide-react';

// --- SISTEMA DE ÁUDIO (Web Audio API) ---
let audioContext: AudioContext | null = null;

const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
};

const playSound = (type: 'correct' | 'wrong' | 'win', isMuted: boolean) => {
  if (isMuted) return;
  initAudio();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  
  if (type === 'correct') {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'win') {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      osc.connect(gain);
      gain.connect(audioContext!.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }
};

// --- COMPONENTE DE CONFETE ---
const Confetti = () => {
  const pieces = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -50, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
          animate={{ 
            y: '100vh', 
            x: `${p.x + (Math.random() * 30 - 15)}vw`, 
            rotate: Math.random() * 720, 
            opacity: [1, 1, 0] 
          }}
          transition={{ 
            duration: 2.5 + Math.random() * 2, 
            ease: "linear", 
            delay: Math.random() * 0.5 
          }}
          className="absolute w-2 h-4 md:w-3 md:h-6 rounded-sm shadow-[0_0_10px_currentColor]"
          style={{ backgroundColor: p.color, color: p.color }}
        />
      ))}
    </div>
  );
};

// --- BASE DE CASOS E DADOS PEDAGÓGICOS ---
type Category = 'Manipulação Eleitoral' | 'Golpe Humanitário' | 'Saúde Pública' | 'Destruição de Reputação' | 'Golpe Financeiro em Massa' | 'Segurança Pública' | 'Jornalismo Investigativo';

const questions = [
  {
    category: 'Manipulação Eleitoral' as Category,
    appType: 'whatsapp',
    sender: 'Grupo da Família',
    isFake: true,
    narrativeText: "Vazou! Áudio do candidato ameaçando confiscar a poupança se for eleito amanhã. Encaminhem para todos antes que censurem! 🚨",
    consequenceText: "Pânico Eleitoral! Você validou a mentira. 5 grupos de família republicaram. 50.000 pessoas foram expostas ao pânico em 10 minutos.",
    evidence: {
      type: 'audio',
      title: 'Áudio Vazado (0:45s)',
      hotspots: [
        { id: 1, x: 30, y: 50, title: 'Frequência Monótona', text: 'Sintetizadores de voz têm dificuldade em replicar a emoção e a respiração humana em discursos inflamados.' },
        { id: 2, x: 70, y: 50, title: 'Cortes Artificiais', text: 'O ruído de fundo desaparece abruptamente, indicando que a voz foi gerada em estúdio e inserida depois.' }
      ]
    },
    emotionalWords: ['Vazou!', 'ameaçando', 'confiscar', 'Encaminhem', 'censurem!'],
    pedagogy: {
      pillar: 'Motivação: Manipulação de Votos',
      explanation: "Áudios falsos na véspera de eleições (quando não há tempo para checagem) buscam causar pânico e alterar o resultado democrático através do medo.",
      goldenTip: "Se a mensagem exige urgência extrema e gera raiva ou pânico imediato, é projetada para burlar seu senso crítico."
    }
  },
  {
    category: 'Golpe Humanitário' as Category,
    appType: 'instagram',
    sender: '@AjudaUrgente',
    isFake: true,
    narrativeText: "Tragédia! Uma enchente devastou essa cidade (foto exclusiva). O governo não está fazendo nada! Doe qualquer valor no PIX abaixo para salvar essas crianças agora!",
    consequenceText: "Efeito Cascata: Doação Desviada! Você validou a mentira. Milhares de pessoas doaram para golpistas em vez de ONGs reais.",
    evidence: {
      type: 'image',
      title: 'Foto da Tragédia (.jpg)',
      hotspots: [
        { id: 1, x: 40, y: 60, title: 'Anatomia Irregular', text: 'As mãos das pessoas na água têm dedos extras ou fundidos, um erro comum em imagens geradas por IA.' },
        { id: 2, x: 70, y: 30, title: 'Física Incoerente', text: 'O reflexo na água não condiz com as estruturas ao redor e a iluminação parece artificial e dramática demais.' }
      ]
    },
    emotionalWords: ['Tragédia!', 'devastou', 'exclusiva', 'governo', 'não', 'está', 'fazendo', 'nada!', 'salvar', 'agora!'],
    pedagogy: {
      pillar: 'Motivação: Lucro Financeiro',
      explanation: "Golpistas usam IA para gerar imagens de desastres que nunca ocorreram, explorando a solidariedade e a empatia da população para roubar dinheiro.",
      goldenTip: "Faça busca reversa da imagem e doe apenas através de canais oficiais e ONGs reconhecidas."
    }
  },
  {
    category: 'Saúde Pública' as Category,
    appType: 'tiktok',
    sender: '@SaudeMilagrosa',
    isFake: true,
    narrativeText: "[Vídeo do Doutor Drauzio Varella]: 'A indústria farmacêutica não quer que você saiba! Esse suplemento limpa suas veias em 2 dias e cura diabetes. Compre no link!'",
    consequenceText: "Efeito Dominó: Risco de Morte! Você promoveu um remédio falso. 10.000 pessoas abandonaram o tratamento médico real hoje.",
    evidence: {
      type: 'video',
      title: 'Vídeo Patrocinado',
      hotspots: [
        { id: 1, x: 50, y: 65, title: 'Dessincronia Labial', text: 'O movimento da boca do médico não acompanha perfeitamente as palavras, parecendo dublado.' },
        { id: 2, x: 50, y: 40, title: 'Tom de Voz Artificial', text: 'A cadência da voz é mecânica, sem as pausas naturais e os maneirismos característicos da celebridade.' }
      ]
    },
    emotionalWords: ['não', 'quer', 'que', 'você', 'saiba!', 'limpa', 'cura', 'Compre', 'no', 'link!'],
    pedagogy: {
      pillar: 'Motivação: Lucro e Desinformação',
      explanation: "Deepfakes de médicos são usados para vender falsos suplementos, colocando a saúde de milhões em risco ao prometer curas milagrosas.",
      goldenTip: "Médicos reais não vendem 'curas milagrosas' em redes sociais. Verifique os conselhos de saúde."
    }
  },
  {
    category: 'Destruição de Reputação' as Category,
    appType: 'mail',
    sender: 'Anon_Hacker',
    isFake: true,
    narrativeText: "Chocante! Atriz famosa é flagrada xingando fãs. O vídeo é assustador, ela perdeu a cabeça! Cancelamento nela! Repasse para os jornais!",
    consequenceText: "Linchamento Virtual! Você engajou. A hashtag subiu pros Trending Topics e destruiu a carreira de uma pessoa inocente.",
    evidence: {
      type: 'video',
      title: 'Vídeo Amador Vazado',
      hotspots: [
        { id: 1, x: 45, y: 35, title: 'Bordas Borradas (Face Swap)', text: 'Há um desfoque (flickering) na linha da mandíbula, indicando que o rosto da atriz foi colado em outro corpo.' },
        { id: 2, x: 80, y: 80, title: 'Artefatos de Compressão', text: 'O vídeo foi comprimido propositalmente para disfarçar as imperfeições da manipulação.' }
      ]
    },
    emotionalWords: ['Chocante!', 'xingando', 'assustador,', 'perdeu', 'a', 'cabeça!', 'Cancelamento', 'nela!', 'Repasse'],
    pedagogy: {
      pillar: 'Motivação: Destruição de Reputação',
      explanation: "O 'Face Swap' (troca de rostos) insere figuras públicas em situações constrangedoras para incitar o ódio em massa.",
      goldenTip: "O linchamento virtual é cruel. Nunca compartilhe conteúdos acusatórios sem confirmação de portais jornalísticos."
    }
  },
  {
    category: 'Golpe Financeiro em Massa' as Category,
    appType: 'phone',
    sender: '(11) 99999-XXXX',
    isFake: true,
    narrativeText: "URGENTE: O Banco Central liberou o resgate de R$ 3.500 do Sistema Valores a Receber para o seu CPF. Acesse agora antes que expire à meia-noite!",
    consequenceText: "Vazamento em Massa! Você compartilhou a dica. 500 amigos acessaram e tiveram contas bancárias esvaziadas.",
    evidence: {
      type: 'image',
      title: 'SMS Urgente',
      hotspots: [
        { id: 1, x: 50, y: 30, title: 'Tática de Pânico', text: 'O golpista força um prazo (meia-noite) para que a vítima não raciocine e clique imediatamente.' },
        { id: 2, x: 50, y: 70, title: 'Link Mascarado', text: 'A URL solicitada leva para um site falso hospedado no exterior, não para o portal do governo.' }
      ]
    },
    emotionalWords: ['URGENTE:', 'liberou', 'resgate', 'agora', 'antes', 'que', 'expire', 'meia-noite!'],
    pedagogy: {
      pillar: 'Motivação: Roubo de Dados Coletivo',
      explanation: "A Engenharia Social em massa cria um cenário de urgência para que milhares de vítimas entreguem seus dados sem pensar.",
      goldenTip: "Governo e bancos não enviam links urgentes por SMS. Acesse o site oficial digitando diretamente no navegador."
    }
  },
  {
    category: 'Segurança Pública' as Category,
    appType: 'phone',
    sender: 'Defesa Civil (40199)',
    isFake: false,
    narrativeText: "ALERTA: Chuvas intensas e risco de alagamento na sua região nas próximas 4 horas. Evite deslocamentos. Abrigue-se.",
    consequenceText: "Você bloqueou um alerta real! Você ficou desinformado sobre um perigo iminente e se colocou em risco físico.",
    evidence: {
      type: 'phone',
      title: 'SMS Oficial',
      hotspots: [
        { id: 1, x: 50, y: 30, title: 'Número Oficial Curto', text: '40199 é o número oficial da Defesa Civil nacional no Brasil.' },
        { id: 2, x: 50, y: 70, title: 'Ausência de Links', text: 'Alertas reais focam na informação e instrução, sem exigir cliques em links ou preenchimento de dados.' }
      ]
    },
    emotionalWords: ['ALERTA:', 'intensas', 'risco', 'Evite', 'Abrigue-se.'],
    pedagogy: {
      pillar: 'Comunicação Oficial',
      explanation: "Órgãos de segurança usam SMS com números curtos (short codes) e não enviam links maliciosos ou pedidos de pagamento.",
      goldenTip: "Bloquear alertas verdadeiros por excesso de paranoia também é perigoso. Conheça os canais oficiais de comunicação."
    }
  },
  {
    category: 'Jornalismo Investigativo' as Category,
    appType: 'instagram',
    sender: '@JornalVerificado',
    isFake: false,
    narrativeText: "Exclusivo: Documentos confirmam desvio de verbas no Ministério. Leia a reportagem completa com as provas anexadas no nosso portal.",
    consequenceText: "Você censurou a imprensa! Ignorar notícias verdadeiras verificadas também contribui para a desinformação coletiva.",
    evidence: {
      type: 'image',
      title: 'Postagem Jornalística',
      hotspots: [
        { id: 1, x: 30, y: 25, title: 'Selo de Verificação Histórico', text: 'O perfil pertence a um veículo de imprensa estabelecido, com histórico consistente de publicações.' },
        { id: 2, x: 70, y: 70, title: 'Remissão a Provas', text: 'A postagem não pede para repassar o texto cegamente, mas direciona para um portal com documentos (fonte).' }
      ]
    },
    emotionalWords: ['Exclusivo:', 'desvio', 'provas'],
    pedagogy: {
      pillar: 'Papel da Imprensa',
      explanation: "O jornalismo profissional utiliza documentos, fontes cruzadas e expediente público, diferentemente de boatos anônimos.",
      goldenTip: "Não confunda notícia desfavorável ao seu viés político com 'Fake News'. Verifique o histórico do veículo emissor."
    }
  }
];

export default function App() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'consequence' | 'feedback' | 'gameover' | 'end'>('intro');
  const [playerName, setPlayerName] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  
  // Decisão do Usuário
  const [userDecision, setUserDecision] = useState<'fake' | 'true' | 'timeout' | null>(null);
  
  // Controle UI/Tools
  const [isMuted, setIsMuted] = useState(false);
  const [toolsLeft, setToolsLeft] = useState(2);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
  
  // Interatividade Pedagógica (Hotspots)
  const [activeHotspotId, setActiveHotspotId] = useState<number | null>(null);
  const [discoveredHotspots, setDiscoveredHotspots] = useState<Set<number>>(new Set());
  const [isEmotionalToolActive, setIsEmotionalToolActive] = useState(false);

  // Relatório de Desempenho
  const [categoryStats, setCategoryStats] = useState<Record<string, { total: number, correct: number }>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Ação/Log Feed
  const [actionLogs, setActionLogs] = useState<string[]>([]);

  const addActionLog = (msg: string) => {
    setActionLogs(prev => [msg, ...prev].slice(0, 3));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const canDecide = discoveredHotspots.size >= currentQuestion.evidence.hotspots.length;
  
  // Define if the user made the correct choice (dynamic based on isFake)
  const isCorrectChoice = userDecision === 'fake' ? currentQuestion.isFake : (userDecision === 'true' ? !currentQuestion.isFake : false);

  // Temporizador
  useEffect(() => {
    if (gameState !== 'playing' || activeHotspotId !== null || isToolMenuOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleDecision('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, activeHotspotId, isToolMenuOpen]);

  const startGame = () => {
    if (!playerName.trim()) return;
    initAudio();
    
    const initialStats: Record<string, { total: number, correct: number }> = {};
    questions.forEach(q => {
      if (!initialStats[q.category]) initialStats[q.category] = { total: 0, correct: 0 };
      initialStats[q.category].total += 1;
    });
    setCategoryStats(initialStats);

    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setTimeLeft(20);
    setUserDecision(null);
    setToolsLeft(2);
    setDiscoveredHotspots(new Set());
    setActiveHotspotId(null);
    setIsEmotionalToolActive(false);
    setIsToolMenuOpen(false);
    setActionLogs(['Sistema de análise inicializado...']);
  };

  const handleDecision = (decision: 'fake' | 'true' | 'timeout') => {
    setUserDecision(decision);
    setIsToolMenuOpen(false);
    setActiveHotspotId(null);
    
    const isCorrect = (decision === 'fake' && currentQuestion.isFake) || (decision === 'true' && !currentQuestion.isFake);

    setCategoryStats(prev => ({
      ...prev,
      [currentQuestion.category]: {
        ...prev[currentQuestion.category],
        correct: prev[currentQuestion.category].correct + (isCorrect ? 1 : 0)
      }
    }));

    if (isCorrect) {
      setScore(s => s + 1);
      playSound('correct', isMuted);
      // Pula a consequência ruim e vai direto pro feedback pedagógico
      setGameState('feedback');
    } else {
      setLives(l => l - 1);
      playSound('wrong', isMuted);
      // Mostra tela de consequência narrativa
      setGameState('consequence');
      
      // Auto-avança para feedback após 3.5 segundos
      setTimeout(() => {
        setGameState(prev => prev === 'consequence' ? 'feedback' : prev);
      }, 3500);
    }
  };

  const handleNextQuestion = () => {
    if (lives <= 0) {
      setGameState('gameover');
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setUserDecision(null);
      setTimeLeft(20);
      setDiscoveredHotspots(new Set());
      setActiveHotspotId(null);
      setIsEmotionalToolActive(false);
      setActionLogs([`Analisando caso #${currentQuestionIndex + 2}...`]);
      setGameState('playing');
    } else {
      setGameState('end');
      if (lives > 0) playSound('win', isMuted);
    }
  };

  const handleUseTool = (tool: 'search' | 'filter' | 'emotion') => {
    if (toolsLeft <= 0) return;
    
    if (tool === 'emotion') {
      setIsEmotionalToolActive(true);
      setToolsLeft(t => t - 1);
      addActionLog('Termômetro Emocional ativado.');
    } else {
      const undiscovered = currentQuestion.evidence.hotspots.filter(h => !discoveredHotspots.has(h.id));
      if (undiscovered.length > 0) {
        setDiscoveredHotspots(prev => new Set(prev).add(undiscovered[0].id));
        setToolsLeft(t => t - 1);
        addActionLog(tool === 'search' ? 'Busca Reversa revelou anomalia.' : 'Filtro revelou anomalia.');
      }
    }
    setIsToolMenuOpen(false);
  };

  const getMedalTier = () => {
    if (score === questions.length) return { title: 'Agente de Elite', icon: Trophy, color: 'text-amber-400', shadow: 'shadow-amber-500/50' };
    if (score >= Math.floor(questions.length * 0.6)) return { title: 'Detetive Digital', icon: Medal, color: 'text-indigo-400', shadow: 'shadow-indigo-500/50' };
    return { title: 'Novato Atento', icon: Award, color: 'text-emerald-500', shadow: 'shadow-emerald-500/50' };
  };

  // --- RENDERIZADORES DE UI DO SMARTPHONE ---

  const renderAppHeader = () => {
    switch (currentQuestion.appType) {
      case 'whatsapp':
        return (
          <div className="bg-[#075e54] text-white p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold overflow-hidden">
              <User size={24} />
            </div>
            <div>
              <div className="font-bold">{currentQuestion.sender}</div>
              <div className="text-[10px] text-green-200">online</div>
            </div>
          </div>
        );
      case 'instagram':
        return (
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-full p-0.5">
              <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-800">
                <User size={20} />
              </div>
            </div>
            <div className="font-bold text-sm tracking-wide">{currentQuestion.sender}</div>
          </div>
        );
      case 'tiktok':
        return (
          <div className="bg-black text-white p-3 flex justify-center items-center relative border-b border-slate-800">
             <div className="text-sm font-bold flex gap-4">
               <span className="text-slate-400">Following</span>
               <span className="border-b-2 border-white pb-1">For You</span>
             </div>
          </div>
        );
      case 'mail':
        return (
          <div className="bg-blue-600 text-white p-3 flex flex-col justify-center">
            <div className="text-sm font-bold flex items-center gap-2"><Mail size={16}/> Caixa de Entrada</div>
            <div className="text-xs text-blue-200 mt-1">De: {currentQuestion.sender}</div>
          </div>
        );
      case 'phone':
        return (
          <div className="bg-slate-900 text-white p-3 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700 shrink-0">
              <Phone size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">SMS / Alerta Móvel</div>
              <div className="font-mono text-sm font-semibold tracking-wide text-slate-100 truncate">{currentQuestion.sender}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderEvidenceScanner = () => {
    const evidence = currentQuestion.evidence;
         
    return (
      <div 
        onClick={() => setActiveHotspotId(null)}
        className="relative group w-full h-full min-h-[380px] md:min-h-[460px] bg-slate-950 flex items-center justify-center cursor-default select-none rounded-xl overflow-visible"
      >
        {/* Fundo decorativo com malha e ícone de mídia ampliado */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <div className="absolute inset-0 opacity-20 flex items-center justify-center">
            {evidence.type === 'audio' && <Activity size={140} className="text-cyan-500" />}
            {evidence.type === 'video' && <Play size={140} className="text-rose-500" />}
            {evidence.type === 'image' && <ImageIcon size={140} className="text-amber-500" />}
            {evidence.type === 'phone' && <Phone size={140} className="text-emerald-500 animate-pulse" />}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Miras cibernéticas nos cantos */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50" />
        </div>

        {/* HUD Scanner Overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-cyan-800/60 z-10 pointer-events-none shadow-lg">
          <Search size={14} /> SCANNER ATIVO: {discoveredHotspots.size}/{evidence.hotspots.length} PISTAS
        </div>

        {/* Renderização dos Hotspots */}
        {evidence.hotspots.map((hotspot) => {
          const isActive = activeHotspotId === hotspot.id;
          const isDiscovered = discoveredHotspots.has(hotspot.id);
          
          // Posicionamento inteligente para nunca cortar
          const isNearLeft = hotspot.x < 32;
          const isNearRight = hotspot.x > 68;
          const isNearBottom = hotspot.y > 50;
          
          const horizClass = isNearLeft ? 'left-0 translate-x-0' : isNearRight ? 'right-0 translate-x-0' : 'left-1/2 -translate-x-1/2';
          const vertClass = isNearBottom ? 'bottom-16' : 'top-16';
          const arrowHoriz = isNearLeft ? 'left-8 -translate-x-1/2' : isNearRight ? 'right-8 translate-x-1/2' : 'left-1/2 -translate-x-1/2';
          const arrowVert = isNearBottom ? '-bottom-2 border-b border-r' : '-top-2 border-t border-l';
                     
          return (
            <div 
              key={hotspot.id}
              className="absolute z-40"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspotId(isActive ? null : hotspot.id);
                  if (!isDiscovered) {
                    setDiscoveredHotspots(prev => new Set(prev).add(hotspot.id));
                    addActionLog(`Evidência encontrada: ${hotspot.title}`);
                  }
                }}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300
                  ${isActive ? 'bg-cyan-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.8)]' : 'bg-slate-900/90 backdrop-blur-sm text-cyan-400 hover:bg-slate-800 border-2 border-cyan-500/60 shadow-lg'}`}
              >
                <Crosshair size={24} />
                {!isDiscovered && !isActive && (
                   <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
                )}
              </button>
                             
              {/* Popover Educacional do Hotspot */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: isNearBottom ? -10 : 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: isNearBottom ? -5 : 5, scale: 0.9 }}
                    className={`absolute ${vertClass} ${horizClass} w-72 sm:w-80 bg-slate-900/98 backdrop-blur-xl border border-cyan-400/80 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-[100] pointer-events-none`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wider leading-tight break-words">{hotspot.title}</h4>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed break-words">{hotspot.text}</p>
                    
                    {/* Seta indicadora do popover */}
                    <div className={`absolute ${arrowHoriz} ${arrowVert} w-3.5 h-3.5 bg-slate-900 border-cyan-400/80 transform rotate-45`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex flex-col items-center justify-start p-3 sm:p-6 font-sans text-slate-200 relative overflow-x-hidden">
      
      {/* Background Decorativo Global */}
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {gameState === 'end' && score > 2 && <Confetti />}

      {/* Global Sound Control (intro e end) */}
      {(gameState === 'intro' || gameState === 'end') && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-4 right-4 z-50 bg-slate-800/80 backdrop-blur-md border border-slate-700 hover:bg-slate-700 text-slate-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* TELA DE INTRO / CADASTRO (Fora do Smartphone para dar destaque inicial) */}
      {gameState === 'intro' && (
        <motion.div 
          className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-500/20 p-8 md:p-12 text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Ciber<span className="text-indigo-400">Detetive</span></h1>
          <p className="text-slate-400 mb-8 text-sm">Simulador de Investigação de Mídias Sintéticas e Engenharia Social.</p>
          
          <div className="text-left mb-8">
            <label className="block text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2 ml-1">Identificação do Agente</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Seu codinome..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
              />
            </div>
          </div>

          <button 
            onClick={startGame}
            disabled={!playerName.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none flex items-center justify-center gap-2"
          >
            Acessar Terminal <ArrowRight size={18} />
          </button>
        </motion.div>
      )}

      {/* TELA DE RELATÓRIO FINAL (Fora do Smartphone para caber bem) */}
      {gameState === 'end' && (
        <motion.div 
          className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 md:p-10 flex flex-col items-center border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative z-10 my-4 overflow-y-auto max-h-[95vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }} 
              animate={{ scale: 1, rotate: 0 }} 
              transition={{ type: "spring", damping: 12, delay: 0.2 }} 
              className="flex justify-center mb-4"
            >
              <div className={`p-5 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl ${getMedalTier().shadow}`}>
                {(() => {
                  const MedalIcon = getMedalTier().icon;
                  return <MedalIcon className={`${getMedalTier().color} w-16 h-16 md:w-20 md:h-20 drop-shadow-lg`} />;
                })()}
              </div>
            </motion.div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight uppercase">
              {getMedalTier().title}
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Agente <span className="font-bold text-white">{playerName}</span>, simulação encerrada com <span className="font-extrabold text-indigo-400">{score}</span> de {questions.length} vitórias defensivas.
            </p>
          </div>

          <div className="w-full bg-slate-950/60 rounded-2xl p-5 border border-slate-800 mb-8">
            <h3 className="text-sm font-mono text-cyan-400 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} /> Diagnóstico Analítico
            </h3>
            
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, rawStats]) => {
                const stats = rawStats as { total: number, correct: number };
                const percentage = (stats.correct / stats.total) * 100;
                let barColor = 'bg-rose-500';
                if (percentage >= 50) barColor = 'bg-amber-400';
                if (percentage === 100) barColor = 'bg-emerald-400';

                return (
                  <div key={category}>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>{category}</span>
                      <span>{stats.correct}/{stats.total} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${barColor}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button 
              onClick={() => setShowCertificate(true)}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)] text-sm md:text-base"
            >
              <Download size={18} /> Emitir Certificado
            </button>
            <button 
              onClick={() => setGameState('intro')}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 text-sm md:text-base"
            >
              <RotateCcw size={18} /> Novo Treinamento
            </button>
          </div>
        </motion.div>
      )}

      {/* CENTRAL DE COMANDO EM TELA CHEIA (Visível nas etapas de jogo e feedback) */}
      {['playing', 'consequence', 'feedback', 'gameover'].includes(gameState) && (
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col z-10 py-2">
          
          {/* HEADER / HUD SUPERIOR DE INVESTIGAÇÃO */}
          <header className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-base tracking-wide">CiberDetetive</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">
                    Caso {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                  <span>Agente: <strong className="text-slate-200">{playerName}</strong></span>
                  <span>•</span>
                  <span className="text-cyan-400">{currentQuestion.category}</span>
                </div>
              </div>
            </div>

            {/* Vidas & Dano Social / Temporizador */}
            <div className="flex items-center gap-4 sm:gap-8">
              {/* Vidas */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 mr-1 uppercase tracking-wider">Vidas:</span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart key={i} size={18} className={`${i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700 fill-slate-800'}`} />
                ))}
              </div>

              {/* Dano Social / Temporizador */}
              <div className="flex flex-col gap-1 min-w-[150px] sm:min-w-[200px]">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className={timeLeft <= 5 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-400'}>
                    DANO SOCIAL: {Math.round(((20 - timeLeft) / 20) * 100)}%
                  </span>
                  <span className={`font-bold ${timeLeft <= 5 ? 'text-rose-500 animate-pulse text-xs' : 'text-cyan-400'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <motion.div 
                    className={`h-full ${timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 12 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    animate={{ width: `${((20 - timeLeft) / 20) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>

            {/* Ações Rápidas: Placar, Som, Sair */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
                <Trophy size={14} /> {score} pts
              </div>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Ativar som" : "Desativar som"}
                className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700 transition-colors"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button 
                onClick={() => setGameState('intro')}
                title="Abandonar / Reiniciar"
                className="w-10 h-10 bg-slate-800/80 hover:bg-rose-900/50 text-slate-300 hover:text-rose-300 rounded-xl flex items-center justify-center border border-slate-700 hover:border-rose-700 transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </header>

          {/* ÁREA PRINCIPAL */}
          <div className="flex-1 flex flex-col relative">

            {/* CONTEÚDO: TELA DE JOGO EM WIDESCREEN */}
            {gameState === 'playing' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch"
              >
                {/* COLUNA ESQUERDA: TRANSMISSÃO INTERCEPTADA E DECISÃO (5 colunas) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Card da Mensagem Interceptada */}
                  <div className={`bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all ${timeLeft <= 5 ? 'border-rose-500/80 shadow-[0_0_25px_rgba(244,63,94,0.3)] animate-[pulse_0.4s_ease-in-out_infinite]' : ''}`}>
                    <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-bold tracking-wider">
                        <Radio size={14} className="animate-pulse text-cyan-400" /> TRANSMISSÃO INTERCEPTADA
                      </span>
                      <span className="bg-slate-800/80 px-2.5 py-0.5 rounded text-[10px] text-slate-300 font-sans uppercase font-medium">
                        Canal: {currentQuestion.appType}
                      </span>
                    </div>

                    {renderAppHeader()}

                    {/* Texto Narrativo */}
                    <div className="p-5 text-sm md:text-base text-slate-200 leading-relaxed bg-slate-950/40 flex-1">
                       {currentQuestion.narrativeText.split(' ').map((word, idx) => {
                         const cleanWord = word.replace(/[^\wÀ-ÿ]/g, '').toLowerCase();
                         const isEmotional = isEmotionalToolActive && currentQuestion.emotionalWords?.some(ew => {
                           const cleanEw = ew.replace(/[^\wÀ-ÿ]/g, '').toLowerCase();
                           return cleanEw && (cleanEw === cleanWord || cleanWord.includes(cleanEw) || cleanEw.includes(cleanWord));
                         });
                         return (
                           <span key={idx} className={isEmotional ? 'text-rose-400 font-bold bg-rose-500/20 px-1 rounded mx-0.5 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.4)] transition-all inline-block' : ''}>
                             {word}{' '}
                           </span>
                         );
                       })}
                    </div>

                    {isEmotionalToolActive && (
                      <div className="px-4 py-2.5 bg-rose-950/40 border-t border-rose-900/50 text-xs font-mono text-rose-300 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                        <span>Termômetro Emocional ativo: Palavras de pânico/urgência destacadas.</span>
                      </div>
                    )}
                  </div>

                  {/* Card de Ferramentas & Decisão */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col gap-4 mt-auto">
                    {/* Ferramentas */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Wrench size={14} className="text-indigo-400" /> Ferramentas do Detetive
                        </span>
                        <span className="text-xs font-mono text-indigo-400 font-bold">
                          Cargas: {toolsLeft}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button 
                          onClick={() => handleUseTool('search')}
                          disabled={toolsLeft <= 0 || canDecide}
                          className="p-2.5 bg-slate-800 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-xl text-xs font-bold text-white transition-all flex flex-col items-center justify-center gap-1 border border-slate-700 text-center"
                        >
                          <Search size={16} className="text-cyan-400" />
                          <span>Busca Reversa</span>
                          <span className="text-[9px] text-slate-400 font-normal">Revela pista</span>
                        </button>
                        <button 
                          onClick={() => handleUseTool('filter')}
                          disabled={toolsLeft <= 0 || canDecide}
                          className="p-2.5 bg-slate-800 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-xl text-xs font-bold text-white transition-all flex flex-col items-center justify-center gap-1 border border-slate-700 text-center"
                        >
                          <Activity size={16} className="text-emerald-400" />
                          <span>Filtro Técnico</span>
                          <span className="text-[9px] text-slate-400 font-normal">Detecta falhas</span>
                        </button>
                        <button 
                          onClick={() => handleUseTool('emotion')}
                          disabled={toolsLeft <= 0 || isEmotionalToolActive}
                          className="p-2.5 bg-slate-800 hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-xl text-xs font-bold text-white transition-all flex flex-col items-center justify-center gap-1 border border-slate-700 text-center"
                        >
                          <AlertTriangle size={16} className="text-amber-400" />
                          <span>Termômetro</span>
                          <span className="text-[9px] text-slate-400 font-normal">{isEmotionalToolActive ? 'Ativado' : 'Grifa gatilhos'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Status de Coleta de Evidências */}
                    <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-center">
                      {!canDecide ? (
                        <p className="text-xs font-mono text-cyan-400 flex items-center justify-center gap-2">
                          <Search size={14} className="text-cyan-400 animate-pulse" />
                          Analise as {currentQuestion.evidence.hotspots.length} pistas no scanner para liberar sua decisão ({discoveredHotspots.size}/{currentQuestion.evidence.hotspots.length})
                        </p>
                      ) : (
                        <p className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-2">
                          <Check size={16} /> Todas as evidências analisadas! Faça sua escolha abaixo:
                        </p>
                      )}
                    </div>

                    {/* Botões de Decisão Final */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        disabled={!canDecide}
                        onClick={() => handleDecision('fake')}
                        className="py-3.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-extrabold text-xs md:text-sm transition-all flex items-center justify-center gap-2 border border-rose-500/40 disabled:border-transparent shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:shadow-none"
                      >
                        <ShieldX size={18} />
                        BLOQUEAR (FALSO)
                      </button>
                      <button 
                        disabled={!canDecide}
                        onClick={() => handleDecision('true')}
                        className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-extrabold text-xs md:text-sm transition-all flex items-center justify-center gap-2 border border-emerald-500/40 disabled:border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:shadow-none"
                      >
                        <ShieldCheck size={18} />
                        CONFIAR (REAL)
                      </button>
                    </div>
                  </div>
                </div>

                {/* COLUNA DIREITA: SCANNER FORENSE DE MÍDIA (7 colunas) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
                        <Crosshair size={16} /> Scanner Forense de Mídia: {currentQuestion.evidence.title}
                      </div>
                      <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-slate-300">
                        Pistas: <strong className="text-cyan-400">{discoveredHotspots.size}</strong> de {currentQuestion.evidence.hotspots.length}
                      </div>
                    </div>

                    {/* Scanner Canvas */}
                    <div className="flex-1 min-h-[380px] md:min-h-[460px] relative rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                      {renderEvidenceScanner()}
                    </div>

                    {/* Terminal Log Feed */}
                    <div className="mt-4 p-3 bg-black border border-cyan-900/50 rounded-xl overflow-hidden flex flex-col justify-end h-20">
                      <div className="flex flex-col justify-end min-h-full">
                        <AnimatePresence>
                          {actionLogs.slice().reverse().map((log, idx) => (
                            <motion.div
                              key={`${idx}-${log}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`text-xs font-mono leading-tight ${idx === actionLogs.length - 1 ? 'text-cyan-400' : 'text-slate-600'}`}
                            >
                              {`> ${log}`}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CONTEÚDO: TELA DE CONSEQUÊNCIA NARRATIVA (Efeito Cascata) */}
            {gameState === 'consequence' && (
              <motion.div 
                className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-2xl mx-auto w-full relative my-auto"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.6)] mb-6">
                  <MessageCircle size={48} className="text-rose-500" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-widest text-rose-400">
                  {userDecision === 'timeout' 
                    ? "DANO IRREVERSÍVEL" 
                    : (currentQuestion.isFake ? "EFEITO CASCATA" : "BLOQUEIO INDEVIDO")}
                </h2>
                
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl text-left relative overflow-hidden w-full">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest mb-3">
                    <Activity size={16} /> {currentQuestion.isFake ? "Alerta de Viralização em Massa" : "Alerta de Risco Coletivo"}
                  </div>
                  <p className="text-slate-100 text-base md:text-lg font-medium leading-relaxed">
                    {userDecision === 'timeout' ? "O tempo de análise esgotou! A mídia manipulada continuou se espalhando na rede e gerou pânico coletivo." : currentQuestion.consequenceText}
                  </p>
                </div>

                <div className="w-full max-w-md bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mb-3">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 3.5 }}
                    className="h-full bg-rose-500"
                  />
                </div>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Carregando relatório pedagógico do caso...</p>
              </motion.div>
            )}

            {/* CONTEÚDO: TELA DE FEEDBACK PEDAGÓGICO */}
            {gameState === 'feedback' && (
              <motion.div 
                className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-6 md:p-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl my-auto"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl ${isCorrectChoice ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-rose-500/20'}`}>
                  {isCorrectChoice ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                </div>
                
                <h3 className={`text-center text-2xl md:text-3xl font-black mb-6 uppercase tracking-wider ${isCorrectChoice ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCorrectChoice ? 'Análise Correta! Ameaça Identificada' : 'Decisão Vulnerável!'}
                </h3>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md text-xs font-mono text-indigo-400 mb-3 border border-slate-700">
                    <Fingerprint size={14} /> PILAR: {currentQuestion.pedagogy.pillar}
                  </div>
                  <p className="text-slate-200 text-base leading-relaxed">
                    {currentQuestion.pedagogy.explanation}
                  </p>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group mb-8">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
                   <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                     <Lightbulb size={16} /> Protocolo de Defesa Digital
                   </h4>
                   <p className="text-indigo-100 text-sm md:text-base leading-relaxed relative z-10">
                     {currentQuestion.pedagogy.goldenTip}
                   </p>
                </div>

                <button 
                  onClick={handleNextQuestion}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-base transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
                >
                  {lives === 0 
                    ? 'Encerrar Operação (Sem Vidas)' 
                    : currentQuestionIndex === questions.length - 1 
                      ? 'Gerar Relatório Final & Certificado' 
                      : 'Avançar para Próximo Caso'} 
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {/* CONTEÚDO: GAME OVER */}
            {gameState === 'gameover' && (
              <motion.div 
                className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full p-8 md:p-12 text-center bg-slate-900/90 border border-rose-500/30 rounded-3xl shadow-2xl my-auto"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
              >
                <HeartCrack size={60} className="text-rose-500 mb-6 drop-shadow-[0_0_25px_rgba(244,63,94,0.6)]" />
                <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-widest">Sistema Invadido</h2>
                <p className="text-slate-300 text-base mb-8 leading-relaxed">
                  Agente <strong className="text-white">{playerName}</strong>, suas defesas caíram diante das campanhas de desinformação. Retorne à base e treine novamente.
                </p>
                <button 
                  onClick={() => setGameState('intro')}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                >
                  <RotateCcw size={18} /> Reiniciar Simulação
                </button>
              </motion.div>
            )}

          </div>
        </div>
      )}

      {/* MODAL CERTIFICADO (Sobrepõe Tudo) */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-100 rounded-sm p-1 md:p-2 max-w-3xl w-full shadow-2xl text-slate-900 relative my-auto"
            >
              {/* Moldura do Certificado */}
              <div className="border-[8px] md:border-[12px] border-double border-indigo-900/20 p-6 md:p-16 text-center bg-white relative overflow-hidden rounded-sm">
                
                <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-indigo-50 rounded-br-full" />
                <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-cyan-50 rounded-tl-full" />

                <button 
                  onClick={() => setShowCertificate(false)} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 rounded-full p-2 z-10"
                >
                  <X size={20} />
                </button>

                <div className="flex justify-center mb-6 relative z-10">
                  <ShieldCheck size={48} className="text-indigo-800 md:w-16 md:h-16" />
                </div>
                
                <h3 className="text-2xl md:text-5xl font-serif text-slate-900 mb-2 uppercase tracking-widest leading-tight">
                  Certificado de Conclusão
                </h3>
                <p className="text-slate-500 font-mono text-[10px] md:text-sm tracking-widest uppercase mb-10">Simulador de Defesa Cibernética</p>
                
                <p className="text-sm md:text-lg text-slate-600 mb-2">Certificamos que</p>
                <p className="text-2xl md:text-4xl font-black text-indigo-900 mb-4 border-b-2 border-slate-200 inline-block px-4 pb-2">
                  {playerName}
                </p>
                <p className="text-sm md:text-lg text-slate-600 mb-10 leading-relaxed">
                  concluiu com sucesso o treinamento e obteve o título de <br/>
                  <strong className="text-xl md:text-2xl text-slate-900 mt-2 block">{getMedalTier().title}</strong>
                </p>

                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 pt-6 mt-6 text-[10px] md:text-sm font-mono text-slate-500 relative z-10 gap-4">
                  <div className="text-center sm:text-left">
                    <p>Acertos: {score}/{questions.length}</p>
                    <p>Autenticação: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p>Data: {new Date().toLocaleDateString()}</p>
                    <p>Plataforma CiberDetetive</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 mb-2">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-xs md:text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <Download size={16} /> Imprimir / PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


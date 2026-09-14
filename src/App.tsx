import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, ArrowRight, RotateCcw, 
  CheckCircle2, XCircle, Heart, Timer, Trophy, Medal, 
  Award, X, HeartCrack, Volume2, VolumeX, Lightbulb, 
  Play, Activity, Image as ImageIcon, Smartphone, 
  Search, Crosshair, Fingerprint, Download, User,
  Wifi, Battery, Signal, MessageCircle, Phone, Mail,
  AlertTriangle, Wrench, ShieldX, Check, Radio,
  Sparkles, ExternalLink, BookOpen, Keyboard, Flame, FileText, Sliders, Eye,
  FolderOpen, FolderArchive, Cpu, ZoomIn, ZoomOut, SplitSquareVertical, Mic, QrCode, CreditCard, Briefcase
} from 'lucide-react';
import { HistoryItem, LeaderboardEntry } from './extraTypes';
import { ScamLabModal } from './components/ScamLabModal';
import { CaseHistoryDrawer } from './components/CaseHistoryDrawer';
import { LeaderboardModal } from './components/LeaderboardModal';

// --- SISTEMA DE ÁUDIO (Web Audio API) ---
let audioContext: AudioContext | null = null;

const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
};

const playSound = (type: 'correct' | 'wrong' | 'win' | 'scan' | 'combo' | 'tool' | 'tick' | 'glitch', isMuted: boolean) => {
  if (isMuted) return;
  initAudio();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  
  if (type === 'scan') {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'tool') {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.15);
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'combo') {
    [700, 950, 1200].forEach((freq, idx) => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      osc.connect(gain);
      gain.connect(audioContext!.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + idx * 0.06;
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  } else if (type === 'correct') {
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
  } else if (type === 'tick') {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'glitch') {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.setValueAtTime(320, now + 0.05);
    osc.frequency.setValueAtTime(110, now + 0.1);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
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
type Category = 
  | 'Manipulação Eleitoral' 
  | 'Golpe Humanitário' 
  | 'Saúde Pública' 
  | 'Destruição de Reputação' 
  | 'Golpe Financeiro em Massa' 
  | 'Segurança Pública' 
  | 'Jornalismo Investigativo'
  | 'Fraude Bancária (Pix)'
  | 'Golpe de Emprego Remoto'
  | 'Ataque Quishing (QR Code)'
  | 'Deepfake Live Stream';

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
  },
  {
    category: 'Fraude Bancária (Pix)' as Category,
    appType: 'whatsapp',
    sender: 'Comprador Marketplace',
    isFake: true,
    narrativeText: "Já fiz o Pix de R$ 1.850 pelo seu videogame! Segue o print do comprovante. O motorista do Uber já está na sua porta pra retirar, libere com urgência!",
    consequenceText: "Prejuízo Imediato! Você entregou o produto sem conferir o saldo da sua conta. O comprovante era uma imagem adulterada com fonte fora do padrão.",
    evidence: {
      type: 'image',
      title: 'Comprovante Pix (.png)',
      hotspots: [
        { id: 1, x: 45, y: 35, title: 'Tipografia Inconsistente', text: 'A fonte numérica do valor e o alinhamento das letras divergem do layout oficial do aplicativo bancário.' },
        { id: 2, x: 75, y: 80, title: 'Pix Agendado Mascarado', text: 'No rodapé em letras minúsculas está escrito "Agendamento Pendente", podendo ser cancelado antes da liquidação.' }
      ]
    },
    emotionalWords: ['urgência!', 'print', 'libere', 'porta', 'Pix'],
    pedagogy: {
      pillar: 'Motivação: Fraude Financeira Imediata',
      explanation: "Golpistas editam prints de transferências bancárias ou fazem Pix Agendado para enganar vendedores de itens usados.",
      goldenTip: "Nunca confie em prints de comprovantes enviados pelo comprador. Abra o aplicativo do seu próprio banco e confirme se o dinheiro realmente caiu na conta."
    }
  },
  {
    category: 'Golpe de Emprego Remoto' as Category,
    appType: 'mail',
    sender: 'RH Global Careers (recruit@hr-careers-amazon.top)',
    isFake: true,
    narrativeText: "Parabéns! Seu currículo foi selecionado para Avaliador de Produtos Home Office. Salário de R$ 450/dia para trabalhar 1 hora. Pague a taxa de matrícula de R$ 69 para liberar seu login.",
    consequenceText: "Roubo de Dados e Extorsão! Você pagou a taxa e enviou fotos de RG/CPF. O emprego nunca existiu e seus documentos foram usados em empréstimos fraudulentos.",
    evidence: {
      type: 'mail',
      title: 'Email Corporativo Suspeito',
      hotspots: [
        { id: 1, x: 30, y: 25, title: 'Domínio Falso (.top)', text: 'Empresas multinacionais nunca utilizam domínios genéricos baratos como .top ou .xyz para recrutamento.' },
        { id: 2, x: 65, y: 65, title: 'Cobrança de Taxa para Trabalhar', text: 'Nenhuma empresa séria cobra taxa de treinamento, matrícula ou crachá como pré-requisito para contratação.' }
      ]
    },
    emotionalWords: ['Parabéns!', 'selecionado', 'Salário', 'taxa', 'liberar'],
    pedagogy: {
      pillar: 'Motivação: Falsa Promessa Trabalhista',
      explanation: "Criminosos atraem desempregados com propostas de altos ganhos com pouco esforço para exigir 'taxas prévias' ou roubar dados.",
      goldenTip: "Desconfie de processos seletivos sem entrevista formal ou que cobrem qualquer valor para iniciar o trabalho."
    }
  },
  {
    category: 'Ataque Quishing (QR Code)' as Category,
    appType: 'phone',
    sender: 'Aviso em Estacionamento / Totem',
    isFake: true,
    narrativeText: "Totem de Pagamento: 'Sistema temporariamente em manutenção. Aponte a câmera e pague sua estadia com 20% de desconto escaneando o QR Code abaixo'.",
    consequenceText: "Ataque Quishing Bem-Sucedido! O QR Code colado no totem físico levou você a um site falso que clonou os dados do seu cartão de crédito.",
    evidence: {
      type: 'image',
      title: 'Adesivo Físico com QR Code',
      hotspots: [
        { id: 1, x: 50, y: 35, title: 'Sobreposição de Adesivo Físico', text: 'O QR Code é um adesivo colado por cima da sinalização metálica original do estabelecimento.' },
        { id: 2, x: 50, y: 75, title: 'URL de Redirecionamento Não Oficial', text: 'A prévia da leitura do QR Code aponta para pagaparking-promo.xyz em vez do domínio oficial da concessionária.' }
      ]
    },
    emotionalWords: ['manutenção.', 'desconto', 'abaixo', 'escaneando'],
    pedagogy: {
      pillar: 'Vetor de Ataque: Quishing Físico',
      explanation: "O 'Quishing' (phishing via QR Code) explora o hábito cego de escanear códigos sem inspecionar a URL real que o celular abre.",
      goldenTip: "Antes de pagar ou digitar senhas após escanear um QR Code em locais públicos, certifique-se de que não é um adesivo colado e confira o endereço da página."
    }
  },
  {
    category: 'Deepfake Live Stream' as Category,
    appType: 'tiktok',
    sender: '@Elon_Tech_Broadcast',
    isFake: true,
    narrativeText: "[Transmissão ao Vivo com Bilionário]: 'Estamos testando o novo algoritmo quântico. Envie 0.1 Bitcoin ou R$ 1.000 via Pix que nosso fundo devolverá o dobro em 5 minutos!'",
    consequenceText: "Golpe da Duplicação de Cripto! Você transferiu o valor achando que era uma transmissão ao vivo real. O vídeo era um loop pré-gravado com voz sintética.",
    evidence: {
      type: 'video',
      title: 'Transmissão Sintética ao Vivo',
      hotspots: [
        { id: 1, x: 50, y: 30, title: 'Voz Sintética Desincronizada', text: 'A voz tem tom metálico de clonagem por IA e não bate com as pausas de respiração da entrevista original.' },
        { id: 2, x: 80, y: 75, title: 'Promessa Absurda de Lucro 2x', text: 'O clássico golpe da duplicação financeira ("giveaway") onde nenhuma quantia jamais é devolvida.' }
      ]
    },
    emotionalWords: ['Bilionário]:', 'devolverá', 'o', 'dobro', '5', 'minutos!'],
    pedagogy: {
      pillar: 'Manipulação de Autoridade e Ganância',
      explanation: "Contas invadidas em plataformas de streaming transmitem vídeos manipulados em loop infinito para roubar espectadores desatentos.",
      goldenTip: "Nenhuma empresa ou celebridade no mundo devolve o dobro do dinheiro doado. Qualquer promessa desse tipo é golpe garantido."
    }
  }
];

// --- MODOS DE DIFICULDADE ---
type Difficulty = 'recruta' | 'investigador' | 'elite';

interface DifficultyConfig {
  timePerCase: number;
  initialLives: number;
  initialTools: number;
  label: string;
  badge: string;
  scoreMultiplier: number;
  description: string;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  recruta: {
    timePerCase: 30,
    initialLives: 3,
    initialTools: 4,
    label: 'Recruta',
    badge: 'Iniciante',
    scoreMultiplier: 1.0,
    description: '30s por caso • 3 vidas • 4 ferramentas'
  },
  investigador: {
    timePerCase: 20,
    initialLives: 3,
    initialTools: 2,
    label: 'Investigador',
    badge: 'Padrão',
    scoreMultiplier: 1.25,
    description: '20s por caso • 3 vidas • 2 ferramentas'
  },
  elite: {
    timePerCase: 12,
    initialLives: 2,
    initialTools: 1,
    label: 'Perito de Elite',
    badge: 'Hardcore',
    scoreMultiplier: 1.75,
    description: '12s por caso • 2 vidas • 1 ferramenta'
  }
};

// Utilitário de embaralhamento (Fisher-Yates)
function shuffleCases<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'consequence' | 'feedback' | 'gameover' | 'end'>('intro');
  const [playerName, setPlayerName] = useState('');
  
  // Dificuldade Selecionada
  const [difficulty, setDifficulty] = useState<Difficulty>('investigador');
  
  // Casos ativos (com suporte a shuffle/embaralhamento)
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Pontuação Dinâmica e Combos Arcade
  const [score, setScore] = useState(0); // acertos totais
  const [arcadeScore, setArcadeScore] = useState(0); // pontuação arcade acumulada
  const [combo, setCombo] = useState(0); // streak de acertos consecutivo
  const [maxCombo, setMaxCombo] = useState(0); // maior streak da partida
  const [lastPointsEarned, setLastPointsEarned] = useState<number | null>(null);

  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  
  // Decisão do Usuário
  const [userDecision, setUserDecision] = useState<'fake' | 'true' | 'timeout' | null>(null);
  
  // Controle UI/Tools
  const [isMuted, setIsMuted] = useState(false);
  const [toolsLeft, setToolsLeft] = useState(2);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
  
  // Modal de Guia de Checagem no Mundo Real
  const [showFactCheckGuide, setShowFactCheckGuide] = useState(false);

  // Novos Recursos: Dossiê, Laboratório e Ranking
  const [caseHistory, setCaseHistory] = useState<HistoryItem[]>([]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showScamLab, setShowScamLab] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ciberdetetive_leaderboard');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Novos Recursos do Scanner: Zoom e Comparador Split-Screen
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [isSplitCompareActive, setIsSplitCompareActive] = useState(false);

  // Text-to-Speech (Voz tática)
  const [isNarrating, setIsNarrating] = useState(false);

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

  const currentQuestion = activeQuestions[currentQuestionIndex] || questions[0];
  const canDecide = discoveredHotspots.size >= currentQuestion.evidence.hotspots.length;
  
  // Define if the user made the correct choice (dynamic based on isFake)
  const isCorrectChoice = userDecision === 'fake' ? currentQuestion.isFake : (userDecision === 'true' ? !currentQuestion.isFake : false);

  // Função de Narração (Web Speech API)
  const toggleNarration = () => {
    if (!('speechSynthesis' in window)) {
      addActionLog('Sintetizador de voz não suportado neste navegador.');
      return;
    }

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${currentQuestion.sender} diz: ${currentQuestion.narrativeText}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      window.speechSynthesis.speak(utterance);
      setIsNarrating(true);
      addActionLog('Narrador tático transmitindo áudio...');
    }
  };

  // Para narração ao mudar de caso ou tela
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    }
  }, [currentQuestionIndex, gameState]);

  // Temporizador com áudio de contagem regressiva
  useEffect(() => {
    if (gameState !== 'playing' || activeHotspotId !== null || isToolMenuOpen || showFactCheckGuide || showHistoryDrawer || showScamLab || showLeaderboard) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 6 && prev > 1) {
          playSound('tick', isMuted);
        }
        if (prev <= 1) {
          clearInterval(timer);
          playSound('glitch', isMuted);
          handleDecision('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, activeHotspotId, isToolMenuOpen, showFactCheckGuide, showHistoryDrawer, showScamLab, showLeaderboard, isMuted]);

  // Atalhos de Teclado (Acessibilidade)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'intro' && (e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'm' || e.key === 'M') {
        setIsMuted(prev => !prev);
        return;
      }

      if (e.key === 'g' || e.key === 'G') {
        setShowFactCheckGuide(prev => !prev);
        return;
      }

      if (gameState === 'playing') {
        if (e.key === '1' || e.key === 'b' || e.key === 'B') {
          if (canDecide) handleDecision('fake');
        } else if (e.key === '2' || e.key === 'c' || e.key === 'C') {
          if (canDecide) handleDecision('true');
        } else if (e.key === 'f' || e.key === 'F') {
          if (toolsLeft > 0 && !canDecide) {
            handleUseTool('search');
          }
        }
      } else if (gameState === 'feedback') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      } else if (gameState === 'gameover') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setGameState('intro');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, canDecide, toolsLeft, currentQuestionIndex, lives, difficulty, activeQuestions]);

  const startGame = () => {
    if (!playerName.trim()) return;
    initAudio();
    
    // Embaralha os casos a cada nova partida para rejogabilidade
    const shuffled = shuffleCases(questions);
    setActiveQuestions(shuffled);

    const initialStats: Record<string, { total: number, correct: number }> = {};
    shuffled.forEach(q => {
      if (!initialStats[q.category]) initialStats[q.category] = { total: 0, correct: 0 };
      initialStats[q.category].total += 1;
    });
    setCategoryStats(initialStats);

    const config = DIFFICULTY_CONFIG[difficulty];

    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setArcadeScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLastPointsEarned(null);
    setLives(config.initialLives);
    setTimeLeft(config.timePerCase);
    setUserDecision(null);
    setToolsLeft(config.initialTools);
    setDiscoveredHotspots(new Set());
    setActiveHotspotId(null);
    setIsEmotionalToolActive(false);
    setIsToolMenuOpen(false);
    setZoomLevel(1);
    setIsSplitCompareActive(false);
    setCaseHistory([]);
    setActionLogs([`Sistema inicializado em modo ${config.label}...`]);
  };

  const handleDecision = (decision: 'fake' | 'true' | 'timeout') => {
    setUserDecision(decision);
    setIsToolMenuOpen(false);
    setActiveHotspotId(null);
    
    const isCorrect = (decision === 'fake' && currentQuestion.isFake) || (decision === 'true' && !currentQuestion.isFake);

    // Registra caso no Dossiê
    const historyEntry: HistoryItem = {
      id: currentQuestionIndex + 1,
      category: currentQuestion.category,
      sender: currentQuestion.sender,
      narrativeText: currentQuestion.narrativeText,
      isFake: currentQuestion.isFake,
      userDecision: decision,
      isCorrect,
      discoveredHotspotsCount: discoveredHotspots.size,
      totalHotspots: currentQuestion.evidence.hotspots.length,
      pillar: currentQuestion.pedagogy.pillar,
      goldenTip: currentQuestion.pedagogy.goldenTip
    };
    setCaseHistory(prev => [...prev, historyEntry]);

    setCategoryStats(prev => ({
      ...prev,
      [currentQuestion.category]: {
        ...prev[currentQuestion.category],
        correct: prev[currentQuestion.category].correct + (isCorrect ? 1 : 0)
      }
    }));

    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo(prev => Math.max(prev, nextCombo));

      const config = DIFFICULTY_CONFIG[difficulty];
      const basePoints = 1000;
      const timeBonus = timeLeft * 60; // Mais tempo sobrando = mais pontos
      const comboMultiplier = Math.min(nextCombo, 4);
      const earned = Math.round((basePoints + timeBonus) * comboMultiplier * config.scoreMultiplier);

      setArcadeScore(prev => prev + earned);
      setLastPointsEarned(earned);
      setScore(s => s + 1);

      if (nextCombo >= 2) {
        playSound('combo', isMuted);
        addActionLog(`STREAK! Combo x${nextCombo} (+${earned} pts)`);
      } else {
        playSound('correct', isMuted);
        addActionLog(`Correto! +${earned} pts`);
      }

      setGameState('feedback');
    } else {
      setCombo(0);
      setLastPointsEarned(0);
      setLives(l => l - 1);
      playSound('wrong', isMuted);
      addActionLog('Falha de análise! Vidas reduzidas.');
      setGameState('consequence');
      
      setTimeout(() => {
        setGameState(prev => prev === 'consequence' ? 'feedback' : prev);
      }, 3500);
    }
  };

  const saveToLeaderboard = (finalArcadeScore: number, finalScore: number, finalMaxCombo: number) => {
    const tier = getMedalTier();
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: playerName || 'Agente Anônimo',
      score: finalScore,
      arcadeScore: finalArcadeScore,
      maxCombo: finalMaxCombo,
      difficulty,
      date: new Date().toLocaleDateString('pt-BR'),
      medal: tier.title
    };

    const updated = [newEntry, ...leaderboardEntries]
      .sort((a, b) => b.arcadeScore - a.arcadeScore)
      .slice(0, 15);

    setLeaderboardEntries(updated);
    try {
      localStorage.setItem('ciberdetetive_leaderboard', JSON.stringify(updated));
    } catch (e) {
      console.warn('Falha ao salvar leaderboard no localStorage', e);
    }
  };

  const handleClearLeaderboard = () => {
    setLeaderboardEntries([]);
    try {
      localStorage.removeItem('ciberdetetive_leaderboard');
    } catch (e) {
      console.warn('Falha ao remover leaderboard', e);
    }
    addActionLog('Quadro de honra redefinido.');
  };

  const handleNextQuestion = () => {
    const config = DIFFICULTY_CONFIG[difficulty];

    if (lives <= 0) {
      saveToLeaderboard(arcadeScore, score, maxCombo);
      setGameState('gameover');
    } else if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setUserDecision(null);
      setTimeLeft(config.timePerCase);
      setDiscoveredHotspots(new Set());
      setActiveHotspotId(null);
      setIsEmotionalToolActive(false);
      setZoomLevel(1);
      setIsSplitCompareActive(false);
      setActionLogs([`Analisando caso #${currentQuestionIndex + 2}...`]);
      setGameState('playing');
    } else {
      // Bônus final por ferramentas economizadas
      const toolBonus = toolsLeft * 250;
      const finalArcade = arcadeScore + toolBonus;
      if (toolBonus > 0) {
        setArcadeScore(finalArcade);
      }
      saveToLeaderboard(finalArcade, score, maxCombo);
      setGameState('end');
      if (lives > 0) playSound('win', isMuted);
    }
  };

  const handleUseTool = (tool: 'search' | 'filter' | 'emotion') => {
    if (toolsLeft <= 0) return;
    playSound('tool', isMuted);
    
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
        className="relative group w-full h-full min-h-[400px] md:min-h-[480px] bg-slate-950 flex items-center justify-center cursor-default select-none rounded-xl overflow-hidden border border-cyan-900/40"
      >
        {/* Container interno com zoom dinâmico */}
        <div 
          className="absolute inset-0 transition-transform duration-300 origin-center flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
        {/* Fundo cibernético e miras */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-500/60 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-500/60 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-500/60 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-500/60 pointer-events-none" />

        {/* MODO COMPARADOR SPLIT-SCREEN (Original vs Sintético) */}
        {isSplitCompareActive && (
          <div className="absolute inset-0 z-30 flex pointer-events-none">
            {/* Metade Esquerda: Original / Referência Segura */}
            <div className="w-1/2 h-full bg-emerald-950/30 border-r-2 border-dashed border-emerald-400/80 p-3 flex flex-col justify-between backdrop-blur-[1px]">
              <span className="text-[10px] font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded uppercase font-bold self-start">
                REFERÊNCIA AUTÊNTICA (CONTROLE)
              </span>
              <div className="text-[11px] font-mono text-emerald-200/80 p-2 bg-black/60 rounded border border-emerald-500/30">
                Padrão biométrico linear, ausência de duplicidade de pixels e iluminação coerente.
              </div>
            </div>
            {/* Metade Direita: Sob Análise / Amostra Suspeita */}
            <div className="w-1/2 h-full bg-rose-950/20 p-3 flex flex-col justify-between">
              <span className="text-[10px] font-mono bg-rose-950/90 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded uppercase font-bold self-end">
                AMOSTRA SUSPEITA INTERCEPTADA
              </span>
              <div className="text-[11px] font-mono text-rose-200/80 p-2 bg-black/60 rounded border border-rose-500/30 text-right">
                Inconsistências espectrais, ruído de compressão assimétrico e possíveis artefatos.
              </div>
            </div>
          </div>
        )}

        {/* SIMULADOR FORENSE DEDICADO POR TIPO DE MÍDIA */}

        {/* 1. MÍDIA: ÁUDIO SINTÉTICO (Espectrograma Forense) */}
        {evidence.type === 'audio' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
            {/* Header Espectrograma */}
            <div className="absolute top-12 left-6 right-6 flex justify-between items-center text-[10px] font-mono text-cyan-400/80 border-b border-cyan-900/60 pb-2">
              <span className="flex items-center gap-1.5"><Activity size={12} className="animate-pulse" /> ESPECTROGRAMA FORENSE DE VOZ</span>
              <span>AMOSTRA: 48.0 kHz / 24-BIT</span>
            </div>

            {/* Visualizador de Onda Sonora Dinâmico */}
            <div className="w-full max-w-md h-32 flex items-center justify-center gap-1 sm:gap-1.5 px-4 my-auto">
              {[28, 45, 72, 90, 60, 35, 80, 100, 75, 40, 65, 88, 95, 50, 30, 70, 85, 45, 60, 35, 78, 92, 48, 25].map((val, idx) => (
                <motion.div
                  key={idx}
                  animate={{ 
                    height: [`${Math.max(12, val * 0.3)}%`, `${val}%`, `${Math.max(15, val * 0.5)}%`],
                    backgroundColor: val > 75 ? '#06b6d4' : val > 45 ? '#3b82f6' : '#6366f1'
                  }}
                  transition={{ 
                    duration: 0.6 + (idx % 4) * 0.2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: idx * 0.04
                  }}
                  className="w-1.5 sm:w-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                />
              ))}
            </div>

            {/* Medidor de Decibéis e Linha de Tempo */}
            <div className="absolute bottom-12 left-6 right-6 flex flex-col gap-1.5 font-mono text-[10px] text-slate-400">
              <div className="flex justify-between items-center text-cyan-300">
                <span>00:18.4s / 00:45.0s</span>
                <span className="text-rose-400 font-bold animate-pulse">RESSÍNTESE DETECTADA</span>
              </div>
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/40">
                <div className="w-[42%] h-full bg-gradient-to-r from-cyan-500 to-indigo-500" />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>[60Hz] GRAVES</span>
                <span>[1.2kHz] MÉDIOS</span>
                <span>[8.0kHz] AGUDOS ARTIFICIAIS</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. MÍDIA: VÍDEO / DEEPFAKE (Tracking Biométrico Facial) */}
        {evidence.type === 'video' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
            {/* Viewfinder da Câmera Forense */}
            <div className="absolute top-12 left-6 right-6 flex justify-between items-center text-[10px] font-mono text-rose-400/90 border-b border-rose-900/50 pb-2">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" /> REC 00:03:14:08</span>
              <span>60.00 FPS UHD • FACE_MESH</span>
            </div>

            {/* Malha Facial Simulada (Wireframe Face Mesh) */}
            <div className="relative w-56 h-64 border border-rose-500/30 rounded-3xl flex items-center justify-center bg-rose-950/10 backdrop-blur-[1px]">
              {/* Pontos de ancoragem facial cibernéticos */}
              <div className="absolute top-12 left-14 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_#f43f5e] animate-pulse" />
              <div className="absolute top-12 right-14 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_#f43f5e] animate-pulse" />
              <div className="absolute top-24 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              <div className="absolute bottom-16 w-16 h-4 border-2 border-dashed border-rose-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              </div>

              {/* Linhas poligonais do Face Mesh */}
              <svg className="absolute inset-0 w-full h-full stroke-rose-400/30 fill-none stroke-[1]" viewBox="0 0 100 100">
                <polygon points="50,15 25,35 25,65 50,90 75,65 75,35" strokeDasharray="2,2" />
                <line x1="25" y1="35" x2="75" y2="35" />
                <line x1="50" y1="35" x2="50" y2="90" />
                <circle cx="50" cy="72" r="8" className="stroke-rose-400" />
              </svg>

              <div className="absolute -bottom-4 bg-black/90 border border-rose-500/80 px-2 py-0.5 rounded text-[9px] font-mono text-rose-300">
                WARPING FACIAL: +4.8px DIVERGÊNCIA
              </div>
            </div>

            <div className="absolute bottom-12 left-6 right-6 flex justify-between font-mono text-[9px] text-slate-400">
              <span>SCANNER DE MANDÍBULA: INCONSISTENTE</span>
              <span className="text-cyan-400">ISOLAMENTO DE BORDA ATIVO</span>
            </div>
          </div>
        )}

        {/* 3. MÍDIA: IMAGEM / POST / SMS (Metadados EXIF e Análise Subpixel) */}
        {(evidence.type === 'image' || evidence.type === 'phone') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
            {/* Header EXIF */}
            <div className="absolute top-12 left-6 right-6 flex justify-between items-center text-[10px] font-mono text-amber-400/80 border-b border-amber-900/50 pb-2">
              <span className="flex items-center gap-1.5"><FileText size={12} /> METADADOS FORENSES & EXIF</span>
              <span>SENSOR_DPI: 72 (COMPRESSÃO WEB)</span>
            </div>

            {/* Grade de Inspeção de Ruído */}
            <div className="relative w-64 h-56 border border-amber-500/20 rounded-2xl flex flex-col justify-between p-4 bg-amber-950/5">
              <div className="flex justify-between font-mono text-[9px] text-amber-300/70">
                <span>ISO: DESCONHECIDO</span>
                <span>F-STOP: NULO (SINTÉTICO)</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                {evidence.type === 'phone' ? (
                  <Phone size={48} className="text-emerald-400 animate-pulse drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                ) : (
                  <ImageIcon size={48} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
                )}
                <span className="font-mono text-[10px] text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                  {evidence.title}
                </span>
              </div>
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>GPS: [REDACTED / AUSENTE]</span>
                <span className="text-rose-400">ARTEFATO DETECTADO</span>
              </div>
            </div>

            <div className="absolute bottom-12 left-6 right-6 flex justify-between font-mono text-[9px] text-slate-400">
              <span>NÍVEL DE RUÍDO SUBPIXEL: DESIGUAL</span>
              <span className="text-emerald-400">COORDENADAS DE MIRA ATIVAS</span>
            </div>
          </div>
        )}

        {/* HUD Scanner Overlay Superior */}
        <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-cyan-800/80 z-10 pointer-events-none shadow-lg">
          <Search size={14} className="text-cyan-400 animate-spin" /> SCANNER ATIVO: {discoveredHotspots.size}/{evidence.hotspots.length} PISTAS
        </div>

        {/* Renderização dos Hotspots com Som Tático */}
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
                  playSound('scan', isMuted);
                  if (!isDiscovered) {
                    setDiscoveredHotspots(prev => new Set(prev).add(hotspot.id));
                    addActionLog(`Evidência encontrada: ${hotspot.title}`);
                  }
                }}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300
                  ${isActive ? 'bg-cyan-500 text-slate-950 scale-110 shadow-[0_0_25px_rgba(6,182,212,0.9)] ring-4 ring-cyan-400/40' : 'bg-slate-900/90 backdrop-blur-sm text-cyan-400 hover:bg-slate-800 border-2 border-cyan-500/60 shadow-lg'}`}
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

      {/* TELA DE INTRO / CADASTRO */}
      {gameState === 'intro' && (
        <motion.div 
          className="w-full max-w-lg bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-500/30 p-6 sm:p-10 text-center relative z-10 my-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-5 transform rotate-3 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
            Ciber<span className="text-indigo-400">Detetive</span>
          </h1>
          <p className="text-slate-400 mb-6 text-xs sm:text-sm">
            Simulador de Investigação de Mídias Sintéticas, Deepfakes e Engenharia Social.
          </p>
          
          {/* Identificação do Agente */}
          <div className="text-left mb-6">
            <label className="block text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2 ml-1">Identificação do Agente</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Seu codinome..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
              />
            </div>
          </div>

          {/* Seletor de Dificuldade */}
          <div className="text-left mb-6">
            <label className="block text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2 ml-1 flex items-center justify-between">
              <span>Nível Operacional</span>
              <span className="text-slate-500 lowercase">selecione o desafio</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((key) => {
                const conf = DIFFICULTY_CONFIG[key];
                const isSelected = difficulty === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDifficulty(key)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold leading-tight">{conf.label}</span>
                      {isSelected && <Check size={12} className="text-indigo-400" />}
                    </div>
                    <span className="text-[9px] font-mono opacity-80">{conf.badge}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-mono text-cyan-400/90 mt-2 ml-1">
              ⚡ {DIFFICULTY_CONFIG[difficulty].description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={startGame}
              disabled={!playerName.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-[0_0_25px_rgba(79,70,229,0.35)] disabled:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Acessar Terminal de Operações <ArrowRight size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setShowScamLab(true)}
                className="py-2.5 px-3 bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 rounded-xl font-mono text-xs transition-all border border-purple-800/60 flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} className="text-purple-400" />
                <span>Lab de Golpes</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLeaderboard(true)}
                className="py-2.5 px-3 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 rounded-xl font-mono text-xs transition-all border border-amber-800/50 flex items-center justify-center gap-1.5"
              >
                <Trophy size={14} className="text-amber-400" />
                <span>Ranking</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFactCheckGuide(true)}
                className="py-2.5 px-3 bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-mono text-xs transition-all border border-slate-800 flex items-center justify-center gap-1.5"
              >
                <BookOpen size={14} className="text-indigo-400" />
                <span>Guia OSINT</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TELA DE RELATÓRIO FINAL */}
      {gameState === 'end' && (
        <motion.div 
          className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 md:p-10 flex flex-col items-center border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative z-10 my-4 overflow-y-auto max-h-[95vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
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
            <h2 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight uppercase">
              {getMedalTier().title}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Agente <span className="font-bold text-white">{playerName}</span> • Operação finalizada em modo <strong className="text-indigo-400">{DIFFICULTY_CONFIG[difficulty].label}</strong>
            </p>
          </div>

          {/* Destaque de Pontuação Arcade e Streak */}
          <div className="grid grid-cols-3 gap-3 w-full mb-6">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Score Arcade</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{arcadeScore.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Maior Combo</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <Flame size={18} className="fill-amber-400" /> {maxCombo}x
              </span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Acertos</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">{score}/{questions.length}</span>
            </div>
          </div>

          <div className="w-full bg-slate-950/60 rounded-2xl p-5 border border-slate-800 mb-6">
            <h3 className="text-sm font-mono text-cyan-400 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} /> Diagnóstico Analítico por Categoria
            </h3>
            
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, rawStats]) => {
                const stats = rawStats as { total: number, correct: number };
                const percentage = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
                let barColor = 'bg-rose-500';
                if (percentage >= 50) barColor = 'bg-amber-400';
                if (percentage === 100) barColor = 'bg-emerald-400';

                return (
                  <div key={category}>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>{category}</span>
                      <span>{stats.correct}/{stats.total} ({Math.round(percentage)}%)</span>
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
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-3">
            <button 
              onClick={() => setShowCertificate(true)}
              className="px-3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(79,70,229,0.4)] text-xs"
            >
              <Download size={16} /> Certificado
            </button>
            <button 
              onClick={() => setShowHistoryDrawer(true)}
              className="px-3 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 text-xs"
            >
              <FolderArchive size={16} /> Dossiê ({caseHistory.length})
            </button>
            <button 
              onClick={() => setShowLeaderboard(true)}
              className="px-3 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 text-xs"
            >
              <Trophy size={16} /> Ranking
            </button>
            <button 
              onClick={() => setGameState('intro')}
              className="px-3 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-800 text-xs"
            >
              <RotateCcw size={16} /> Novo Jogo
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-white text-base tracking-wide">CiberDetetive</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">
                    Caso {currentQuestionIndex + 1}/{activeQuestions.length}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                    {DIFFICULTY_CONFIG[difficulty].label}
                  </span>
                  {combo >= 2 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/40 flex items-center gap-1 font-bold animate-pulse">
                      <Flame size={12} className="text-amber-400 fill-amber-400" /> {combo}x COMBO
                    </span>
                  )}
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
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 mr-1 uppercase tracking-wider">Vidas:</span>
                {Array.from({ length: DIFFICULTY_CONFIG[difficulty].initialLives }).map((_, i) => (
                  <Heart key={i} size={16} className={`${i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700 fill-slate-800'}`} />
                ))}
              </div>

              {/* Dano Social / Temporizador */}
              <div className="flex flex-col gap-1 min-w-[140px] sm:min-w-[180px]">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className={timeLeft <= 4 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-400'}>
                    DANO SOCIAL: {Math.round(((DIFFICULTY_CONFIG[difficulty].timePerCase - timeLeft) / DIFFICULTY_CONFIG[difficulty].timePerCase) * 100)}%
                  </span>
                  <span className={`font-bold ${timeLeft <= 4 ? 'text-rose-500 animate-pulse text-xs' : 'text-cyan-400'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <motion.div 
                    className={`h-full ${timeLeft <= 4 ? 'bg-rose-500' : timeLeft <= 8 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    animate={{ width: `${((DIFFICULTY_CONFIG[difficulty].timePerCase - timeLeft) / DIFFICULTY_CONFIG[difficulty].timePerCase) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>

            {/* Ações Rápidas: Placar Arcade, Dossiê, Ranking, Guia OSINT, Som, Sair */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLeaderboard(true)}
                title="Abrir Quadro de Honra / Ranking"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 font-bold transition-colors"
              >
                <Trophy size={14} /> {arcadeScore.toLocaleString()} pts
              </button>

              <button
                type="button"
                onClick={() => setShowHistoryDrawer(true)}
                title="Abrir Dossiê de Casos Analisados"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/80 hover:bg-slate-800 text-cyan-300 rounded-xl border border-slate-800 text-xs font-mono transition-colors"
              >
                <FolderArchive size={14} />
                <span className="hidden sm:inline">Dossiê</span>
                {caseHistory.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {caseHistory.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowFactCheckGuide(true)}
                title="Abrir Guia de Checagem no Mundo Real [G]"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 rounded-xl border border-indigo-700/50 text-xs font-mono transition-colors"
              >
                <BookOpen size={14} /> Guia OSINT
              </button>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Ativar som [M]" : "Desativar som [M]"}
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
                    {/* Header do Card da Mensagem Interceptada */}
                    <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-bold tracking-wider">
                        <Radio size={14} className="animate-pulse text-cyan-400" /> TRANSMISSÃO INTERCEPTADA
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleNarration}
                          title={isNarrating ? "Parar leitura de voz" : "Ouvir narrativa interceptada (Web Speech)"}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors border ${
                            isNarrating 
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 animate-pulse' 
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                        >
                          <Mic size={11} className={isNarrating ? 'text-cyan-300' : ''} />
                          <span>{isNarrating ? 'Lendo...' : 'Ouvir'}</span>
                        </button>
                        <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-300 font-sans uppercase font-medium">
                          {currentQuestion.appType}
                        </span>
                      </div>
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
                        <span>BLOQUEAR (FALSO)</span>
                        <span className="hidden sm:inline-block px-1.5 py-0.5 bg-black/40 rounded text-[10px] font-mono border border-white/20">1</span>
                      </button>
                      <button 
                        disabled={!canDecide}
                        onClick={() => handleDecision('true')}
                        className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-extrabold text-xs md:text-sm transition-all flex items-center justify-center gap-2 border border-emerald-500/40 disabled:border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:shadow-none"
                      >
                        <ShieldCheck size={18} />
                        <span>CONFIAR (REAL)</span>
                        <span className="hidden sm:inline-block px-1.5 py-0.5 bg-black/40 rounded text-[10px] font-mono border border-white/20">2</span>
                      </button>
                    </div>

                    {/* Barra de Atalhos de Teclado */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 px-1">
                      <span className="flex items-center gap-1.5">
                        <Keyboard size={12} className="text-slate-400" />
                        Atalhos: [1] Bloquear • [2] Confiar • [F] Busca • [G] Guia • [M] Som
                      </span>
                    </div>
                  </div>
                </div>

                {/* COLUNA DIREITA: SCANNER FORENSE DE MÍDIA (7 colunas) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
                        <Crosshair size={16} /> Scanner: {currentQuestion.evidence.title}
                      </div>

                      {/* Ferramentas de Visualização: Zoom e Split-Screen */}
                      <div className="flex items-center gap-2">
                        {/* Botão Split-Screen */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsSplitCompareActive(prev => !prev);
                            playSound('tool', isMuted);
                            addActionLog(!isSplitCompareActive ? 'Comparador Split-Screen ativado.' : 'Comparador desativado.');
                          }}
                          title="Comparar Original vs Sintético (Split-Screen)"
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
                            isSplitCompareActive 
                              ? 'bg-purple-600/30 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] font-bold' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <SplitSquareVertical size={13} />
                          <span className="hidden sm:inline">Comparar</span>
                        </button>

                        {/* Controles de Zoom */}
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setZoomLevel(prev => prev === 2 ? 1.5 : 1);
                              playSound('tool', isMuted);
                            }}
                            title="Diminuir Zoom"
                            disabled={zoomLevel === 1}
                            className="p-1 text-slate-400 hover:text-white disabled:text-slate-700 transition-colors"
                          >
                            <ZoomOut size={13} />
                          </button>
                          <span className="px-1.5 text-[10px] text-cyan-400 font-bold">
                            {zoomLevel}x
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setZoomLevel(prev => prev === 1 ? 1.5 : 2);
                              playSound('tool', isMuted);
                            }}
                            title="Aumentar Zoom Forense"
                            disabled={zoomLevel === 2}
                            className="p-1 text-slate-400 hover:text-white disabled:text-slate-700 transition-colors"
                          >
                            <ZoomIn size={13} />
                          </button>
                        </div>

                        <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                          Pistas: <strong className="text-cyan-400">{discoveredHotspots.size}</strong>/{currentQuestion.evidence.hotspots.length}
                        </div>
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
              <div className="border-[8px] md:border-[12px] border-double border-indigo-900/20 p-6 md:p-14 text-center bg-white relative overflow-hidden rounded-sm">
                
                <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-indigo-50 rounded-br-full" />
                <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-cyan-50 rounded-tl-full" />

                <button 
                  onClick={() => setShowCertificate(false)} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 rounded-full p-2 z-10"
                >
                  <X size={20} />
                </button>

                <div className="flex justify-center mb-4 relative z-10">
                  <ShieldCheck size={48} className="text-indigo-800 md:w-16 md:h-16" />
                </div>
                
                <h3 className="text-2xl md:text-4xl font-serif text-slate-900 mb-1 uppercase tracking-widest leading-tight">
                  Certificado de Conclusão
                </h3>
                <p className="text-slate-500 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-6">Simulador de Defesa Cibernética e Inteligência OSINT</p>
                
                <p className="text-xs md:text-sm text-slate-600 mb-1">Certificamos que o agente</p>
                <p className="text-2xl md:text-3xl font-black text-indigo-900 mb-2 border-b-2 border-slate-200 inline-block px-4 pb-1">
                  {playerName}
                </p>
                <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed">
                  concluiu com êxito a simulação forense no nível <strong className="text-indigo-900">{DIFFICULTY_CONFIG[difficulty].label}</strong> e conquistou a titulação de: <br/>
                  <strong className="text-lg md:text-xl text-slate-900 mt-1 block font-sans">{getMedalTier().title}</strong>
                </p>

                {/* Métricas do Certificado */}
                <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg max-w-md mx-auto mb-6 text-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Acertos</span>
                    <strong className="text-sm text-indigo-900">{score}/{questions.length}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Pontuação</span>
                    <strong className="text-sm text-emerald-700">{arcadeScore.toLocaleString()} pts</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Maior Streak</span>
                    <strong className="text-sm text-amber-700">{maxCombo}x combo</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 pt-4 mt-2 text-[10px] md:text-xs font-mono text-slate-500 relative z-10 gap-2">
                  <div className="text-center sm:text-left">
                    <p>Hash de Segurança: #CD-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                    <p>Status: Habilitado para Triagem Anti-Golpe</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p>Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                    <p>CiberDetetive Security Institute</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-3 mt-4 mb-2">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-xs md:text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Download size={16} /> Imprimir / Salvar PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: GUIA DE CHECAGEM NO MUNDO REAL (OSINT & FACT-CHECKING) */}
      <AnimatePresence>
        {showFactCheckGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setShowFactCheckGuide(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-slate-200 shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
            >
              {/* Header do Guia */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      Guia de Checagem no Mundo Real
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                        OSINT & Fact-Checking
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Como aplicar os princípios investigativos contra golpes, deepfakes e desinformação na vida real.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFactCheckGuide(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Conteúdo com Scroll */}
              <div className="overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar text-sm">
                
                {/* 1. Agências de Checagem */}
                <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                    <Radio size={16} /> 1. Agências Oficiais de Fact-Checking no Brasil
                  </h4>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Antes de repassar qualquer notícia alarmante ou oferta suspeita, consulte os portais certificados pela Rede Internacional de Checagem (IFCN):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="font-bold text-white text-sm block mb-1">Agência Lupa</span>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">Primeira agência de fact-checking do país, especializada em políticas públicas, saúde e economia.</p>
                      <span className="text-[11px] font-mono text-indigo-400">lupa.uol.com.br</span>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="font-bold text-white text-sm block mb-1">Aos Fatos</span>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">Investiga desinformação digital com ferramentas de IA forense e checagem de discursos virais.</p>
                      <span className="text-[11px] font-mono text-indigo-400">aosfatos.org</span>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="font-bold text-white text-sm block mb-1">Projeto Comprova</span>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">Coalizão que reúne mais de 40 grandes veículos de imprensa brasileiros para investigar boatos virais.</p>
                      <span className="text-[11px] font-mono text-indigo-400">projetocomprova.com.br</span>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="font-bold text-white text-sm block mb-1">Fato ou Boato (TSE)</span>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">Canal oficial de combate a boatos sobre eleições, urnas e processos judiciais eleitorais.</p>
                      <span className="text-[11px] font-mono text-indigo-400">tse.jus.br/fato-ou-boato</span>
                    </div>
                  </div>
                </div>

                {/* 2. Validação de Domínios e Phishing */}
                <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-rose-400 font-mono text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} /> 2. O Golpe do Falso .gov.br & O Mito do Cadeado
                  </h4>
                  <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-rose-500/20">
                      <strong className="text-white block mb-1">Regra de Ouro da URL Governamental:</strong>
                      Órgãos oficiais do governo brasileiro usam <strong className="text-emerald-400 font-mono">.gov.br</strong> diretamente ao fim do domínio principal (ex: <code className="text-cyan-300">fazenda.gov.br</code> ou <code className="text-cyan-300">gov.br/receitafederal</code>). Golpistas criam domínios como <code className="text-rose-400 font-mono">receita-gov.site</code> ou <code className="text-rose-400 font-mono">governo-beneficio.com</code>. O termo &quot;gov&quot; antes do traço não o torna governamental!
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/20">
                      <strong className="text-white block mb-1">Cadeado de Segurança (HTTPS):</strong>
                      O cadeado significa apenas que os dados trafegam de forma criptografada entre você e o servidor. Ele <strong className="text-rose-400">NÃO</strong> garante idoneidade da empresa: qualquer golpista adquire certificados SSL gratuitos em segundos.
                    </div>
                  </div>
                </div>

                {/* 3. Mídias Sintéticas & IA */}
                <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                    <Eye size={16} /> 3. Detecção de Mídias Sintéticas e Clones de Voz
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block mb-1">Busca Reversa de Imagens</span>
                      <p className="text-slate-400 leading-relaxed">
                        Use o <strong>Google Lens</strong> ou <strong>TinEye</strong> enviando o print. Você descobre a data de publicação original da imagem e se ela foi retirada de outro contexto antigo.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block mb-1">Clonagem de Voz (IA)</span>
                      <p className="text-slate-400 leading-relaxed">
                        Áudios sintéticos (ElevenLabs, RVC) carecem de ruído ambiente contínuo e pausas de respiração naturais. Ao pedir dinheiro no WhatsApp, ligue em vídeo para confirmar a identidade.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block mb-1">Deepfakes em Vídeo</span>
                      <p className="text-slate-400 leading-relaxed">
                        Observe a sincronia labial (dessincronização entre fonemas bilabiais como P, B, M e os lábios) e artefatos nas bordas da mandíbula ou brincos durante giros de cabeça.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Método SIFT */}
                <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                  <h4 className="text-indigo-300 font-mono text-xs uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                    <Lightbulb size={16} /> 4. O Método SIFT para o Cotidiano
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-indigo-100">
                    <div className="bg-indigo-900/30 p-2.5 rounded-xl border border-indigo-500/20">
                      <strong className="text-white block font-mono">S - Stop (Pare)</strong>
                      Se gerou pânico, indignação ou urgência de compra imediata, pare e respire.
                    </div>
                    <div className="bg-indigo-900/30 p-2.5 rounded-xl border border-indigo-500/20">
                      <strong className="text-white block font-mono">I - Investigate (Investigue)</strong>
                      Quem produziu? É uma fonte primária ou um canal sem histórico verificável?
                    </div>
                    <div className="bg-indigo-900/30 p-2.5 rounded-xl border border-indigo-500/20">
                      <strong className="text-white block font-mono">F - Find (Procure)</strong>
                      Encontre outros veículos cobrindo a notícia. Se só aquele canal tem o furo, desconfie.
                    </div>
                    <div className="bg-indigo-900/30 p-2.5 rounded-xl border border-indigo-500/20">
                      <strong className="text-white block font-mono">T - Trace (Rastreie)</strong>
                      Procure a gravação completa ou o documento oficial sem os cortes sensacionalistas.
                    </div>
                  </div>
                </div>

              </div>

              {/* Rodapé do Modal */}
              <div className="pt-4 border-t border-slate-800 flex justify-end shrink-0">
                <button
                  onClick={() => setShowFactCheckGuide(false)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors"
                >
                  Entendido, fechar guia
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: LABORATÓRIO DE CRIAÇÃO DE GOLPES (SANDBOX) */}
      <ScamLabModal 
        isOpen={showScamLab} 
        onClose={() => setShowScamLab(false)} 
      />

      {/* DRAWER: DOSSIÊ DO DETETIVE (HISTÓRICO DE CASOS) */}
      <CaseHistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        history={caseHistory}
      />

      {/* MODAL: QUADRO DE HONRA / LEADERBOARD */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        entries={leaderboardEntries}
        onClear={handleClearLeaderboard}
      />

    </div>
  );
}


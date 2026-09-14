// --- ARQUIVO COMPLEMENTAR COM TIPOS E RECURSOS DO CIBERDETETIVE ---

export interface HistoryItem {
  id: number;
  category: string;
  sender: string;
  narrativeText: string;
  isFake: boolean;
  userDecision: 'fake' | 'true' | 'timeout';
  isCorrect: boolean;
  discoveredHotspotsCount: number;
  totalHotspots: number;
  pillar: string;
  goldenTip: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  arcadeScore: number;
  maxCombo: number;
  difficulty: 'recruta' | 'investigador' | 'elite';
  date: string;
  medal: string;
}

// Modelos para o Laboratório de Criação de Golpes (Sandbox Pedagógico Inverso)
export interface ScamPart {
  id: string;
  label: string;
  description: string;
  riskScore: number; // 0-100 de persuasão
  redFlagReason: string;
}

export const SCAM_TRIGGERS: ScamPart[] = [
  { 
    id: 'urgency_expire', 
    label: 'Prazo Iminente (Urgência)', 
    description: 'Expira hoje à meia-noite! Últimas vagas disponíveis ou cancelamento imediato.',
    riskScore: 85,
    redFlagReason: 'Força o alvo a agir pelo pânico, sem tempo para checar fontes ou raciocinar.'
  },
  { 
    id: 'financial_gain', 
    label: 'Lucro Fácil ou Resgate', 
    description: 'Valores esquecidos de R$ 4.280 liberados pelo Banco Central para saque imediato.',
    riskScore: 90,
    redFlagReason: 'Explora a ganância e necessidade financeira através de promessas de dinheiro fácil.'
  },
  { 
    id: 'fear_arrest', 
    label: 'Medo Jurídico ou Bloqueio', 
    description: 'Mandado de busca em aberto ou CPF suspenso na Receita Federal por irregularidade grave.',
    riskScore: 95,
    redFlagReason: 'Gera choque e intimidação, fazendo a pessoa clicar para evitar suposta prisão ou processo.'
  },
  { 
    id: 'family_emergency', 
    label: 'Falso Filho / Emergência Familiar', 
    description: 'Oi mãe, troquei de celular! Estou no hospital e preciso pagar um remédio urgente.',
    riskScore: 88,
    redFlagReason: 'Explora o afeto e o desespero familiar antes que o pai ou mãe consiga telefonar pro número antigo.'
  }
];

export const SCAM_CHANNELS: ScamPart[] = [
  {
    id: 'fake_whatsapp',
    label: 'WhatsApp com Foto Clonada',
    description: 'Perfil novo dizendo "celular estragou", com foto copiada da rede social.',
    riskScore: 80,
    redFlagReason: 'Simples de criar, mas desmorona rapidamente se a vítima fizer uma chamada de vídeo.'
  },
  {
    id: 'masked_sms',
    label: 'SMS com Link Falso (Smishing)',
    description: 'Mensagem com texto curto e link encurtado (ex: bit.ly ou receita-gov.site).',
    riskScore: 75,
    redFlagReason: 'Não possui autenticação oficial e links suspeitos podem ser desmascarados no navegador.'
  },
  {
    id: 'deepfake_video',
    label: 'Deepfake em Vídeo (IA)',
    description: 'Vídeo gerado de um apresentador ou celebridade endossando o esquema.',
    riskScore: 92,
    redFlagReason: 'Altíssimo impacto visual, mas exibe dessincronia labial e artefatos de compressão facial.'
  },
  {
    id: 'quishing_qr',
    label: 'QR Code Falso Físico (Quishing)',
    description: 'Adesivo com QR code colado sobre uma conta de luz ou cardápio original.',
    riskScore: 85,
    redFlagReason: 'Muitas pessoas não checam o endereço do site para onde a câmera do celular redireciona.'
  }
];

export const SCAM_CALL_TO_ACTION: ScamPart[] = [
  {
    id: 'pix_transfer',
    label: 'Transferência PIX Direta',
    description: 'Chave aleatória ou CPF de "laranja" para transferência imediata.',
    riskScore: 70,
    redFlagReason: 'Nome do destinatário no comprovante entrega que não se trata do órgão ou empresa oficial.'
  },
  {
    id: 'credential_harvest',
    label: 'Página Falsa para Digitar Senha',
    description: 'Formulário clonado pedindo CPF, senha do cartão e chave de segurança.',
    riskScore: 90,
    redFlagReason: 'Permite ao criminoso tomar posse completa da conta da vítima.'
  },
  {
    id: 'apk_malware',
    label: 'Download de Aplicativo Espião (APK)',
    description: 'Instalar "Módulo de Segurança" fora da loja oficial Google Play / App Store.',
    riskScore: 95,
    redFlagReason: 'Assume controle remoto do celular e rouba códigos de SMS bancários em tempo real.'
  }
];

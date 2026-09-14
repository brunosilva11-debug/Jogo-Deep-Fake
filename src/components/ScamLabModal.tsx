import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, 
  RotateCcw, ArrowRight, Gauge, Cpu, CheckCircle2 
} from 'lucide-react';
import { SCAM_TRIGGERS, SCAM_CHANNELS, SCAM_CALL_TO_ACTION } from '../extraTypes';

interface ScamLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScamLabModal = ({ isOpen, onClose }: ScamLabModalProps) => {
  const [selectedTrigger, setSelectedTrigger] = useState(SCAM_TRIGGERS[0].id);
  const [selectedChannel, setSelectedChannel] = useState(SCAM_CHANNELS[0].id);
  const [selectedAction, setSelectedAction] = useState(SCAM_CALL_TO_ACTION[0].id);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  if (!isOpen) return null;

  const trigger = SCAM_TRIGGERS.find(t => t.id === selectedTrigger)!;
  const channel = SCAM_CHANNELS.find(c => c.id === selectedChannel)!;
  const action = SCAM_CALL_TO_ACTION.find(a => a.id === selectedAction)!;

  const persuasionScore = Math.round((trigger.riskScore * 0.4) + (channel.riskScore * 0.35) + (action.riskScore * 0.25));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-slate-200 shadow-[0_0_50px_rgba(168,85,247,0.2)] relative my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Cpu size={26} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  Laboratório de Engenharia Social
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                    Modo Inverso / Sandbox
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Compreenda a anatomia psicológica dos golpes digitais para desarmá-los com facilidade.
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conteúdo com scroll */}
          <div className="overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar text-sm">
            
            {/* Banner Educativo */}
            <div className="bg-purple-950/30 border border-purple-500/30 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle size={20} className="text-purple-400 shrink-0 mt-0.5" />
              <p className="text-xs text-purple-200 leading-relaxed">
                Todo golpe cibernético combina <strong>3 engrenagens principais</strong>: um gatilho psicológico de pressão, um canal de transmissão com falsa autoridade e um pedido de ação imediata. Monte sua simulação abaixo para ver como os peritos desarmam essa estrutura.
              </p>
            </div>

            {/* Etapa 1: Gatilho Emocional */}
            <div>
              <label className="text-xs font-mono text-purple-400 uppercase tracking-widest block mb-2 font-bold">
                1. Gatilho Psicológico (Manipulação Emocional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SCAM_TRIGGERS.map((item) => {
                  const isSelected = selectedTrigger === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setSelectedTrigger(item.id); setIsAnalyzed(false); }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-purple-600/20 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-slate-100">{item.label}</strong>
                        {isSelected && <CheckCircle2 size={16} className="text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Etapa 2: Canal de Transmissão */}
            <div>
              <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2 font-bold">
                2. Canal ou Mídia Sintética
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SCAM_CHANNELS.map((item) => {
                  const isSelected = selectedChannel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setSelectedChannel(item.id); setIsAnalyzed(false); }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-cyan-600/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-slate-100">{item.label}</strong>
                        {isSelected && <CheckCircle2 size={16} className="text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Etapa 3: Ação Solicitada */}
            <div>
              <label className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2 font-bold">
                3. Ação Solicitada (Vetor de Ataque)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SCAM_CALL_TO_ACTION.map((item) => {
                  const isSelected = selectedAction === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setSelectedAction(item.id); setIsAnalyzed(false); }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-emerald-600/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-slate-100">{item.label}</strong>
                        {isSelected && <CheckCircle2 size={14} className="text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulação do Golpe Gerado */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-amber-400" /> Prévia da Mensagem Manipulada
                </span>
                <span className="text-[11px] font-mono text-slate-500">Canal: {channel.label}</span>
              </div>
              <p className="text-slate-200 text-sm italic font-serif leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                &ldquo;{trigger.description} {channel.description.toLowerCase()} Por favor, proceda com: {action.description.toLowerCase()}&rdquo;
              </p>
            </div>

            {/* Diagnóstico de Perícia */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Gauge size={18} className="text-indigo-400" />
                    Índice Estimado de Persuasão Psicológica
                  </h4>
                  <p className="text-xs text-slate-400">Poder de engano com base em vulnerabilidades humanas conhecidas.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono text-purple-400">{persuasionScore}%</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${persuasionScore > 85 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                    {persuasionScore > 85 ? 'RISCO CRÍTICO' : 'ALTO RISCO'}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${persuasionScore}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
                />
              </div>

              {/* Como o Perito Desarma */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Como o CiberDetetive Desmonta Essa Ameaça:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-purple-400 font-bold block mb-1">Quebrando o Gatilho:</span>
                    <p className="text-slate-400 leading-relaxed">{trigger.redFlagReason}</p>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">Auditando o Canal:</span>
                    <p className="text-slate-400 leading-relaxed">{channel.redFlagReason}</p>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">Neutralizando a Ação:</span>
                    <p className="text-slate-400 leading-relaxed">{action.redFlagReason}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center shrink-0">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
              Simulador Pedagógico CiberDetetive
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs transition-colors ml-auto"
            >
              Voltar à Simulação Forense
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

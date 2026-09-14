import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Flame, RotateCcw, Medal, Calendar, Trash2 } from 'lucide-react';
import { LeaderboardEntry } from '../extraTypes';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  onClear: () => void;
}

export const LeaderboardModal = ({ isOpen, onClose, entries, onClear }: LeaderboardModalProps) => {
  if (!isOpen) return null;

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
          className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-200 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  Quadro de Honra dos Agentes
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Recordes locais e patentes operacionais arquivadas
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

          {/* Tabela de Classificação */}
          <div className="flex-1 overflow-y-auto py-4 pr-1 custom-scrollbar">
            {entries.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Trophy size={48} className="mx-auto mb-3 stroke-1 text-slate-600" />
                <p className="text-sm font-medium text-slate-300">Nenhum recorde registrado ainda.</p>
                <p className="text-xs text-slate-500 mt-1">Conclua uma investigação para cravar seu nome no ranking!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {entries.map((item, index) => {
                  const isTop1 = index === 0;
                  const isTop2 = index === 1;
                  const isTop3 = index === 2;

                  return (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isTop1 
                          ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                          : isTop2
                          ? 'bg-slate-800/60 border-slate-600'
                          : isTop3
                          ? 'bg-amber-900/10 border-amber-700/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl font-mono font-black text-sm flex items-center justify-center ${
                          isTop1 ? 'bg-amber-400 text-slate-950 shadow-md' :
                          isTop2 ? 'bg-slate-300 text-slate-950' :
                          isTop3 ? 'bg-amber-600 text-white' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {index + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-white">{item.name}</strong>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                              {item.difficulty}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                            <span>{item.medal}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-amber-400">
                              <Flame size={12} className="fill-amber-400" /> {item.maxCombo}x combo
                            </span>
                            <span>•</span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <Calendar size={10} /> {item.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black font-mono text-emerald-400 block">
                          {item.arcadeScore.toLocaleString()} pts
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.score} acertos
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center shrink-0">
            {entries.length > 0 ? (
              <button
                onClick={onClear}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} /> Limpar Recordes
              </button>
            ) : <div />}
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Fechar Quadro
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

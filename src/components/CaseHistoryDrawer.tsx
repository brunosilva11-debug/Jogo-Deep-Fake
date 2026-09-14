import { motion, AnimatePresence } from 'motion/react';
import { X, FolderOpen, CheckCircle2, XCircle, AlertTriangle, Fingerprint, Lightbulb, Search } from 'lucide-react';
import { HistoryItem } from '../extraTypes';

interface CaseHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

export const CaseHistoryDrawer = ({ isOpen, onClose, history }: CaseHistoryDrawerProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex justify-end bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md md:max-w-lg bg-slate-900 border-l border-indigo-500/30 h-full p-5 md:p-6 flex flex-col shadow-2xl overflow-hidden text-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <FolderOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  Dossiê de Casos Arquivados
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {history.length} {history.length === 1 ? 'caso registrado' : 'casos registrados'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Lista de Casos com Scroll */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <FolderOpen size={40} className="mb-3 stroke-1 text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Nenhum caso concluído ainda.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Avance pelas transmissões para registrar suas análises forenses no dossiê.
                </p>
              </div>
            ) : (
              history.map((item, index) => {
                return (
                  <div
                    key={item.id || index}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.isCorrect 
                        ? 'bg-slate-950/70 border-emerald-500/30' 
                        : 'bg-slate-950/70 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Caso #{index + 1} • {item.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {item.isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Acerto
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle size={14} /> Vulnerável
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 font-mono mb-2">
                      Remetente: <strong className="text-slate-200">{item.sender}</strong>
                    </div>

                    <p className="text-xs text-slate-300 italic mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                      &ldquo;{item.narrativeText}&rdquo;
                    </p>

                    <div className="space-y-2 text-xs border-t border-slate-800/60 pt-2.5">
                      <div className="flex items-start gap-2">
                        <Fingerprint size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-200">Classificação Real: </span>
                          <span className={item.isFake ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {item.isFake ? 'Mídia Sintética / Manipulada (FALSO)' : 'Informação Autêntica (REAL)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Search size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-slate-400">
                          Sua Decisão: <strong className="text-slate-200">{item.userDecision === 'fake' ? 'Bloqueado (Falso)' : item.userDecision === 'true' ? 'Confiado (Real)' : 'Tempo Esgotado'}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          <strong className="text-amber-300">Dica de Ouro: </strong>
                          {item.goldenTip}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center shrink-0 text-xs">
            <span className="font-mono text-slate-500">Dossiê Operacional</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
            >
              Fechar Dossiê
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

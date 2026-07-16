import React from 'react';
import { Info, Search } from 'lucide-react';

interface RagSectionProps {
  isLoadingRag: boolean;
  selectedAiConfigId: number | null;
  ragSearch: string;
  setRagSearch: (val: string) => void;
  ragDb: any[];
  refreshRagFromGiacNgo: (id?: any) => Promise<void>;
}

export const RagSection: React.FC<RagSectionProps> = ({
  isLoadingRag,
  selectedAiConfigId,
  ragSearch,
  setRagSearch,
  ragDb,
  refreshRagFromGiacNgo,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-hide bg-slate-900/50">
      {/* Header thông báo nguồn dữ liệu */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-3">
        <p className="text-xs text-indigo-300 leading-relaxed font-bold flex items-start gap-2">
          <Info size={18} className="shrink-0 mt-0.5" />
          <span>
            Kho Tri Thức của Lão được đồng bộ trực tiếp từ <b>GiacNgo AI</b> (Training Data của AI Config đang chọn).
            Để thêm/sửa/xóa kiến thức, vui lòng quản lý trên trang <b>GiacNgo Platform</b> rồi bấm Tải lại.
          </span>
        </p>

        <div className="flex gap-2 flex-wrap pt-2 border-t border-indigo-500/20">
          {/* Nút Tải lại từ GiacNgo */}
          <button
            onClick={() => refreshRagFromGiacNgo(selectedAiConfigId)}
            disabled={isLoadingRag}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-wait text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            {isLoadingRag ? (
              <>
                <span className="animate-spin inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full mr-1" />
                Đang tải...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                Tải lại từ GiacNgo
              </>
            )}
          </button>

          {/* Badge nguồn */}
          <span className="ml-auto self-center text-[10px] text-indigo-400/70 font-mono bg-indigo-900/30 px-2 py-1 rounded border border-indigo-500/20">
            AI Config #{selectedAiConfigId}
          </span>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex gap-2 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/50" />
          <input
            type="text"
            placeholder="Tìm kiếm kiến thức trong não bộ Lão..."
            value={ragSearch}
            onChange={(e: any) => setRagSearch(e.target.value)}
            className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider px-2">
          <span>{isLoadingRag ? 'Đang đồng bộ...' : `Đang lưu trữ ${ragDb.length} phân đoạn kiến thức`}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto scrollbar-hide pb-10">
          {ragDb
            .filter((item: any) => item.text.toLowerCase().includes(ragSearch.toLowerCase()))
            .map((item: any) => (
              <div
                key={item.id}
                className="bg-slate-800/80 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors flex flex-col gap-2"
              >
                <span className="bg-indigo-900/50 text-indigo-300 text-[9px] px-2 py-1 rounded font-mono border border-indigo-500/20 self-start">
                  Nguồn: {item.source}
                </span>
                <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed font-serif">
                  {item.text}
                </p>
              </div>
            ))}

          {ragDb.filter((item: any) => item.text.toLowerCase().includes(ragSearch.toLowerCase())).length === 0 &&
            !isLoadingRag && (
              <div className="text-center p-8 text-slate-500 italic text-sm border border-dashed border-white/10 rounded-xl">
                {ragSearch
                  ? `Không tìm thấy kiến thức nào khớp với từ khóa "${ragSearch}".`
                  : 'Chưa có dữ liệu. Nhấn "Tải lại từ GiacNgo" để đồng bộ.'}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

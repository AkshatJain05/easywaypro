import React from "react";
import { MdOutlineLibraryBooks, MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import SkeletonLoader from "./SkeletonLoader";
import Spinner from "./Spinner";

export default function DocList({ docs, loading, onSelect, onDelete, deletingId, setViewMode }) {
  if (loading) return <SkeletonLoader />;

  if (docs.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl border border-white/[0.04] bg-[#07040f]/40">
        <p className="text-gray-500 text-xs font-mono">No files present inside master index registry.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {docs.map((d) => {
        const isDeleting = deletingId === d._id;

        return (
          <div
            key={d._id || d.tempId}
            className="group relative p-5 rounded-2xl border border-white/[0.04] bg-[#090514]/40 hover:border-sky-500/30 hover:bg-white/[0.01] transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            <div className="min-w-0 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-sky-500/5 border border-sky-500/10 text-sky-400">
                  <MdOutlineLibraryBooks size={16} />
                </div>
                <h3 className="font-bold text-sm text-gray-200 group-hover:text-white truncate">
                  {d.subject || "Untitled Context"}
                </h3>
              </div>
              {d.description ? (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed text-justify">
                  {d.description}
                </p>
              ) : (
                <p className="text-xs text-gray-600 italic">No description appended.</p>
              )}
              <div className="mt-3 inline-block bg-white/[0.02] border border-white/[0.05] rounded-md px-2 py-0.5 text-[10px] text-gray-400 font-mono">
                Nodes: {d.questions?.length || 0} items
              </div>
            </div>

            {/* Quick Actions Action Bar */}
            <div className="flex items-center justify-between border-t border-white/[0.03] pt-3 mt-auto gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => { onSelect(d); setViewMode("edit"); }}
                  className="p-2 text-xs font-medium rounded-xl bg-sky-500/5 hover:bg-sky-500 text-sky-400 hover:text-black border border-sky-500/10 transition-all flex items-center gap-1"
                  title="Modify Layout"
                >
                  <MdEdit size={13} /> <span className="text-[11px]">Edit</span>
                </button>
                <button
                  onClick={() => { onSelect(d); setViewMode("preview"); }}
                  className="p-2 text-xs font-medium rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-white border border-white/[0.06] transition-all flex items-center gap-1"
                >
                  <MdVisibility size={13} /> <span className="text-[11px]">Preview</span>
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDeleting) return;
                  onDelete(d._id);
                }}
                disabled={isDeleting}
                className="text-gray-500 hover:text-rose-400 p-2 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-rose-500/20 transition-all disabled:opacity-30"
              >
                {isDeleting ? <Spinner size="sm" /> : <MdDelete size={14} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
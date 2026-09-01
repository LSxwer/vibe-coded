import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Code2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle,
  Tag
} from 'lucide-react';
import { CodeSnippet, UserProgress } from '../types';
import { C_SNIPPETS } from '../data/snippets';
import { toggleSnippetBookmark } from '../services/progress';

interface SnippetsLibraryProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onRunSnippetInPlayground: (code: string) => void;
}

export const SnippetsLibrary: React.FC<SnippetsLibraryProps> = ({
  progress,
  onUpdateProgress,
  onRunSnippetInPlayground,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSnippetId, setExpandedSnippetId] = useState<string | null>(null);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  const categories = ['All', ...Array.from(new Set(C_SNIPPETS.map((s) => s.category)))];

  const filteredSnippets = C_SNIPPETS.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesBookmark = !showOnlyBookmarked || progress.bookmarkedSnippetIds.includes(s.id);

    return matchesSearch && matchesCategory && matchesBookmark;
  });

  const handleCopy = (snippet: CodeSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleBookmark = (snippetId: string) => {
    const updated = toggleSnippetBookmark(snippetId, progress);
    onUpdateProgress(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              C++ Pattern & Snippet Compendium
            </h1>
          </div>
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#888]">
            Standard idiom reference, modern C++20 algorithms, and memory management recipes.
          </p>
        </div>

        {/* Bookmarked Filter Switch */}
        <button
          onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
          className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
            showOnlyBookmarked
              ? 'bg-[#1A1A1A] text-[#FF6321] border-[#1A1A1A] shadow-sm'
              : 'bg-white text-[#666] border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F9F9F7]'
          }`}
        >
          {showOnlyBookmarked ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-[#FF6321]" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
          <span>Saved Snippets ({progress.bookmarkedSnippetIds.length})</span>
        </button>
      </div>

      {/* Search & Categories Filter Bar */}
      <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 mb-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 bg-white border border-[#1A1A1A] px-4 py-2.5">
          <Search className="w-4 h-4 text-[#888] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets by keyword, STL container, or modern idiom (e.g. std::sort, unique_ptr, cin.tie)..."
            className="w-full bg-transparent text-xs text-[#1A1A1A] placeholder-[#999] font-mono outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-[#888] hover:text-[#1A1A1A] uppercase font-black tracking-wider"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#666] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet Cards Grid */}
      {filteredSnippets.length === 0 ? (
        <div className="text-center py-16 bg-[#F9F9F7] border border-[#1A1A1A]">
          <Code2 className="w-10 h-10 text-[#888] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">No matching snippets found</h3>
          <p className="text-xs text-[#666]">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredSnippets.map((snippet) => {
            const isBookmarked = progress.bookmarkedSnippetIds.includes(snippet.id);
            const isExpanded = expandedSnippetId === snippet.id;

            return (
              <div
                key={snippet.id}
                id={`snippet-card-${snippet.id}`}
                className="bg-[#F9F9F7] border border-[#1A1A1A] overflow-hidden shadow-sm"
              >
                {/* Header Bar */}
                <div className="p-6 border-b border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-[#1A1A1A] bg-[#F9F9F7] text-[#FF6321]">
                        {snippet.category}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/20 bg-white text-[#555]">
                        {snippet.difficulty}
                      </span>
                      {snippet.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] text-[#888] font-mono font-bold uppercase">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                      {snippet.title}
                    </h2>
                    <p className="text-xs text-[#555] mt-1 leading-relaxed max-w-3xl">
                      {snippet.description}
                    </p>
                  </div>

                  {/* Actions (Bookmark, Copy, Run) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleBookmark(snippet.id)}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Snippet'}
                      className={`p-2.5 border transition-colors ${
                        isBookmarked
                          ? 'bg-[#1A1A1A] text-[#FF6321] border-[#1A1A1A]'
                          : 'bg-white text-[#888] border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F9F9F7]'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-[#FF6321]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(snippet)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      {copiedId === snippet.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#27C93F]" />
                          <span className="text-[#27C93F] font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onRunSnippetInPlayground(snippet.code)}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Run in Playground</span>
                    </button>
                  </div>
                </div>

                {/* Code Block Container */}
                <div className="p-6 bg-[#1A1A1A]">
                  <pre className="font-mono text-xs text-white leading-relaxed overflow-x-auto whitespace-pre p-4 bg-[#141414] border border-white/10">
                    {snippet.code}
                  </pre>

                  {/* Output Sample */}
                  {snippet.outputSample && (
                    <div className="mt-4 p-3 bg-[#141414] border border-white/10">
                      <div className="text-[9px] uppercase tracking-widest font-mono font-bold text-white/50 mb-1">
                        Expected Output:
                      </div>
                      <pre className="font-mono text-xs text-[#27C93F] whitespace-pre-wrap">
                        {snippet.outputSample}
                      </pre>
                    </div>
                  )}

                  {/* Explanation Toggle */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setExpandedSnippetId(isExpanded ? null : snippet.id)}
                      className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#FF6321] hover:text-white font-bold transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Architectural Notes & Gotchas' : 'Show Line-by-Line Breakdown & Gotchas'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-4 text-xs font-sans">
                        <div className="bg-[#141414] p-4 border border-white/10">
                          <h4 className="font-mono text-[10px] font-black uppercase tracking-widest text-white/80 mb-2">How this works:</h4>
                          <ul className="space-y-1.5">
                            {snippet.explanation.map((item, i) => (
                              <li key={i} className="text-white/80 flex items-start gap-2">
                                <span className="text-[#FF6321] font-mono font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {snippet.bestPractices && snippet.bestPractices.length > 0 && (
                          <div className="p-4 bg-[#141414] border-l-4 border-[#27C93F] text-white/90">
                            <h4 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#27C93F] mb-1.5 flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" /> Best Practice:
                            </h4>
                            <ul className="space-y-1 text-white/80">
                              {snippet.bestPractices.map((bp, i) => (
                                <li key={i}>• {bp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {snippet.commonGotchas && snippet.commonGotchas.length > 0 && (
                          <div className="p-4 bg-[#141414] border-l-4 border-[#FF6321] text-white/90">
                            <h4 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF6321] mb-1.5 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" /> Common Gotcha:
                            </h4>
                            <ul className="space-y-1 text-white/80">
                              {snippet.commonGotchas.map((gotcha, i) => (
                                <li key={i}>• {gotcha}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

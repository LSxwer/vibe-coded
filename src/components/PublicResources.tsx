import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  BookOpen, 
  Video, 
  Wrench, 
  Compass, 
  Code,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PublicResource, ResourceCategory, UserProgress } from '../types';
import { C_PUBLIC_RESOURCES } from '../data/resources';
import { toggleResourceBookmark } from '../services/progress';

interface PublicResourcesProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

export const PublicResources: React.FC<PublicResourcesProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  const categories: { id: ResourceCategory; label: string; icon: any }[] = [
    { id: 'all', label: 'All Resources', icon: Globe },
    { id: 'tutorial', label: 'Tutorials & Guides', icon: BookOpen },
    { id: 'reference', label: 'Official References', icon: ShieldCheck },
    { id: 'interactive', label: 'Interactive Practice', icon: Code },
    { id: 'video', label: 'Video Courses', icon: Video },
    { id: 'tool', label: 'Online Compilers & Tools', icon: Wrench },
    { id: 'roadmap', label: 'Career Roadmaps', icon: Compass },
  ];

  const filteredResources = C_PUBLIC_RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || res.level === selectedLevel;
    const matchesBookmark = !showOnlyBookmarked || progress.bookmarkedResourceIds.includes(res.id);

    return matchesSearch && matchesCategory && matchesLevel && matchesBookmark;
  });

  const handleToggleBookmark = (resourceId: string) => {
    const updated = toggleResourceBookmark(resourceId, progress);
    onUpdateProgress(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              Public C++ Resource Index
            </h1>
          </div>
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#888]">
            Curated repositories, documentation, interactive tools, and standard literature.
          </p>
        </div>

        {/* Study List Bookmark Filter */}
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
          <span>Study List ({progress.bookmarkedResourceIds.length})</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 mb-8 space-y-4 shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="flex-1 w-full flex items-center gap-3 bg-white border border-[#1A1A1A] px-4 py-2.5">
            <Search className="w-4 h-4 text-[#888] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by name, topic (e.g. LearnCpp, Cherno, Compiler Explorer)..."
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

          {/* Level Filter */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#666]">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white border border-[#1A1A1A] text-xs font-mono font-bold text-[#1A1A1A] outline-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap transition-colors border ${
                  active
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#666] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#FF6321]' : 'text-[#888]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-[#F9F9F7] border border-[#1A1A1A]">
          <Globe className="w-10 h-10 text-[#888] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">No matching resources found</h3>
          <p className="text-xs text-[#666]">Try clearing your search query or selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isBookmarked = progress.bookmarkedResourceIds.includes(res.id);

            return (
              <div
                key={res.id}
                id={`resource-card-${res.id}`}
                className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  {/* Top metadata badge row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-[#1A1A1A] bg-white text-[#FF6321]">
                      {res.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/20 bg-white text-[#27C93F]">
                        {res.freeStatus}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-serif font-bold text-[#1A1A1A]">
                        <Star className="w-3 h-3 fill-[#FF6321] text-[#FF6321]" />
                        <span>{res.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Provider */}
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] tracking-tight group-hover:text-[#FF6321] transition-colors">
                    {res.title}
                  </h3>
                  <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#888] mb-3">
                    by <span className="text-[#1A1A1A]">{res.provider}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#444] leading-relaxed mb-4">
                    {res.description}
                  </p>

                  {/* Key Highlights list */}
                  <div className="space-y-1.5 mb-4">
                    {res.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-[#555]">
                        <span className="text-[#FF6321] font-mono font-bold">/</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {res.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono font-bold px-2 py-0.5 bg-white text-[#666] border border-[#1A1A1A]/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleBookmark(res.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      isBookmarked
                        ? 'bg-[#1A1A1A] text-[#FF6321] border-[#1A1A1A]'
                        : 'bg-white text-[#666] border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F9F9F7]'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#FF6321]" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    <span>Visit Index</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

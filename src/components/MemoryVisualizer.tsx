import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Cpu, 
  Database, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MemoryScenario } from '../types';
import { MEMORY_SCENARIOS } from '../data/memoryScenarios';

export const MemoryVisualizer: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(MEMORY_SCENARIOS[0].id);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const scenario = MEMORY_SCENARIOS.find((s) => s.id === selectedScenarioId) || MEMORY_SCENARIOS[0];
  const frame = scenario.frames[currentFrameIndex] || scenario.frames[0];

  // Reset frame when scenario changes
  useEffect(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
  }, [selectedScenarioId]);

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev < scenario.frames.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scenario.frames.length]);

  const codeLines = scenario.code.split('\n');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              Memory & Pointer Architecture
            </h1>
          </div>
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#888]">
            Line-by-line inspection of Call Stack frames, Heap allocations, and Pointer dereferencing.
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MEMORY_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => setSelectedScenarioId(scen.id)}
              className={`px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap transition-all border ${
                selectedScenarioId === scen.id
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#666] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {scen.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Synchronized Code & Step Controller (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Code Viewer with Line Highlight */}
          <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden font-mono text-xs shadow-md">
            <div className="px-4 py-2.5 bg-[#141414] border-b border-[#2A2A2A] flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 font-mono text-[11px] text-[#888]">Source Code</span>
              </div>
              <span className="text-[10px] text-[#FF6321] font-mono font-bold">
                Line {frame.codeHighlightLine}
              </span>
            </div>

            <div className="p-4 space-y-1 overflow-x-auto">
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlight = lineNum === frame.codeHighlightLine;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-2.5 py-1 transition-colors ${
                      isHighlight
                        ? 'bg-[#FF6321]/20 text-white border-l-2 border-[#FF6321] font-bold'
                        : 'text-[#888]'
                    }`}
                  >
                    <span className="w-5 text-right text-[#555] select-none font-mono text-[10px]">{lineNum}</span>
                    <span className="whitespace-pre font-mono text-xs">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stepper Control Card */}
          <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888]">
                Execution Stepper
              </span>
              <span className="text-xs font-mono font-bold text-[#FF6321]">
                Step {currentFrameIndex + 1} / {scenario.frames.length}
              </span>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentFrameIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentFrameIndex === 0}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-[#F0F0ED] border border-[#1A1A1A] disabled:opacity-40 text-[#1A1A1A] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all border border-[#1A1A1A] ${
                  isPlaying
                    ? 'bg-[#FF6321] text-white'
                    : 'bg-[#1A1A1A] hover:bg-[#FF6321] text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => setCurrentFrameIndex((prev) => Math.min(scenario.frames.length - 1, prev + 1))}
                disabled={currentFrameIndex === scenario.frames.length - 1}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-[#F0F0ED] border border-[#1A1A1A] disabled:opacity-40 text-[#1A1A1A] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setCurrentFrameIndex(0);
                  setIsPlaying(false);
                }}
                title="Reset simulation"
                className="p-2.5 bg-white hover:bg-[#F0F0ED] border border-[#1A1A1A] text-[#1A1A1A] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step Explanation Card */}
            <div className="p-4 bg-white border border-[#1A1A1A] space-y-1">
              <div className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#FF6321] shrink-0" />
                <span>{frame.title}</span>
              </div>
              <p className="text-xs text-[#555] leading-relaxed">
                {frame.description}
              </p>
            </div>

            {/* Console Log Output */}
            {frame.terminalOutput && (
              <div className="p-3.5 bg-[#1A1A1A] border border-[#1A1A1A] font-mono text-xs text-[#27C93F]">
                <div className="text-[9px] text-[#888] uppercase font-black tracking-widest mb-1">
                  Runtime Terminal Output:
                </div>
                <div>{frame.terminalOutput}</div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Visual Memory Map (Stack vs Heap) (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Stack Memory Section */}
          <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-[#FF6321]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Call Stack Frame (Automatic Lifetime)</h3>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#888]">Grows downwards • Compiler managed</span>
                </div>
              </div>
              <span className="text-[9px] font-black font-mono uppercase tracking-widest px-2.5 py-0.5 border border-[#1A1A1A] bg-white text-[#1A1A1A]">
                Scope: main()
              </span>
            </div>

            {/* Stack Variables Grid */}
            {frame.stack.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#888] italic border border-dashed border-[#1A1A1A]/30 bg-white">
                Stack frame is currently empty.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {frame.stack.map((v, i) => (
                  <div
                    key={i}
                    className={`p-4 border font-mono text-xs transition-all bg-white ${
                      v.isPointer
                        ? 'border-[#FF6321] border-2 shadow-xs'
                        : v.isReference
                        ? 'border-[#1A1A1A] border-2'
                        : 'border-[#1A1A1A]'
                    }`}
                  >
                    {/* Address tag */}
                    <div className="flex items-center justify-between text-[10px] text-[#888] mb-2 font-mono">
                      <span>Address: <strong className="text-[#1A1A1A]">{v.address}</strong></span>
                      <span className="px-1.5 py-0.5 border border-[#1A1A1A]/20 bg-[#F0F0ED] text-[#1A1A1A] font-bold">
                        {v.type}
                      </span>
                    </div>

                    {/* Variable Name & Value */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A] text-sm">{v.name}</span>
                      <span className="text-[#888]">=</span>
                      <span className={`font-bold text-sm ${
                        v.isPointer
                          ? 'text-[#FF6321]'
                          : v.isReference
                          ? 'text-[#1A1A1A]'
                          : 'text-[#27C93F]'
                      }`}>
                        {v.value}
                      </span>
                    </div>

                    {/* Pointer / Reference indicators */}
                    {v.isPointer && v.pointsToAddress && (
                      <div className="mt-2.5 pt-2 border-t border-[#1A1A1A]/10 text-[11px] text-[#FF6321] flex items-center gap-1.5 font-sans font-medium">
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF6321]" />
                        <span>Points to address <strong className="font-mono text-[#1A1A1A]">{v.pointsToAddress}</strong></span>
                      </div>
                    )}

                    {v.isReference && v.refersToName && (
                      <div className="mt-2.5 pt-2 border-t border-[#1A1A1A]/10 text-[11px] text-[#1A1A1A] flex items-center gap-1.5 font-sans font-medium">
                        <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
                        <span>Alias for <strong className="font-mono text-[#FF6321]">{v.refersToName}</strong> (Same memory)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heap Memory Section */}
          <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-[#27C93F]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Heap Memory Store (Dynamic Memory)</h3>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#888]">Allocated with new • Persists until deleted</span>
                </div>
              </div>
              <span className="text-[9px] font-black font-mono uppercase tracking-widest px-2.5 py-0.5 border border-[#1A1A1A] bg-white text-[#1A1A1A]">
                Allocated Blocks: {frame.heap.length}
              </span>
            </div>

            {/* Heap Blocks */}
            {frame.heap.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#888] italic border border-dashed border-[#1A1A1A]/30 bg-white">
                No active heap allocations. Memory is clean.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {frame.heap.map((block, i) => (
                  <div
                    key={i}
                    className="p-4 border-2 border-[#1A1A1A] bg-white font-mono text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#888] mb-2 font-mono">
                      <span className="font-bold text-[#27C93F]">{block.address}</span>
                      <span className="px-1.5 py-0.5 border border-[#1A1A1A]/20 bg-[#F0F0ED] text-[#1A1A1A] font-bold">
                        {block.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A]">{block.name}</span>
                      <span className="text-[#888]">=</span>
                      <span className="font-bold text-[#27C93F] text-sm">{block.value}</span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#1A1A1A]/10 text-[10px] text-[#666] font-sans">
                      Allocated via <code className="text-[#1A1A1A] font-bold font-mono">new {block.type}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

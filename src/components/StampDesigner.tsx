import React, { useState, useRef } from 'react';
import { Stamp, StampEdge, StampAppearance } from '../types';
import { StampBorder } from './StampBorder';
import { Upload, ChevronLeft, Check } from 'lucide-react';
import { PRELOADED_STAMP_IMAGES } from '../utils/stampTemplates';
import { CraftKnifeIcon } from './CustomIcons';

interface StampDesignerProps {
  onSaveStamp: (stamp: Omit<Stamp, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

export const StampDesigner: React.FC<StampDesignerProps> = ({ onSaveStamp, onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string>(PRELOADED_STAMP_IMAGES[0].dataUrl);
  const [stampName, setStampName] = useState<string>('My Custom Stamp');
  const [paddingTopBottom, setPaddingTopBottom] = useState<number>(15);
  const [paddingLeftRight, setPaddingLeftRight] = useState<number>(15);
  const [edge, setEdge] = useState<StampEdge>('rough');
  const [appearance, setAppearance] = useState<StampAppearance>('vintage');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setSelectedImage(loadEvent.target.result as string);
          setStampName(file.name.split('.')[0].substring(0, 20) || 'Uploaded Stamp');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setSelectedImage(loadEvent.target.result as string);
          setStampName(file.name.split('.')[0].substring(0, 20) || 'Dropped Stamp');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    onSaveStamp({
      name: stampName,
      imageUrl: selectedImage,
      paddingTopBottom,
      paddingLeftRight,
      edge,
      appearance,
    });
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-160px)] bg-white rounded-3xl p-6 relative flex flex-col justify-start overflow-hidden">
      {/* Title block */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <div className="p-3 bg-[#e8dad5] rounded-2xl flex items-center justify-center shadow-xs">
          <CraftKnifeIcon className="w-8 h-8 text-neutral-800" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900" style={{ fontFamily: 'var(--font-sans)' }}>Stamp Designer</h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">Create Your Own Collectible Postal Stamps</p>
        </div>
      </div>

      {/* Floating Back Button */}
      <button
        onClick={onBack}
        id="btn-back-designer"
        className="absolute right-0 top-[40%] translate-x-1/2 bg-[#ebd9d4] hover:bg-[#dfcbca] text-neutral-800 px-5 py-3 rounded-full flex items-center gap-1.5 shadow-md transition-all active:scale-95 z-40 text-base border border-white"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <ChevronLeft className="w-5 h-5 shrink-0" />
        <span className="font-medium">Back</span>
      </button>

      {/* Content layout splitting Designer Form and Book Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 flex-1 overflow-y-auto pr-2 pb-2">
        
        {/* Left Side: Upload zone and settings */}
        <div className="flex flex-col gap-6 max-w-md">
          {/* File input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Combined preview + drop area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square w-full max-w-[280px] mx-auto rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer p-2 transition-all relative group overflow-hidden ${
              dragActive ? 'border-amber-500 bg-amber-50/20' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'
            }`}
          >
            {/* Stamp component showing current modifications in real time! */}
            <div className="transform scale-110">
              <StampBorder
                imageUrl={selectedImage}
                edge={edge}
                appearance={appearance}
                paddingTopBottom={paddingTopBottom}
                paddingLeftRight={paddingLeftRight}
                width={190}
                height={190}
                shadow={true}
              />
            </div>

            {/* Upload indicator overlap */}
            <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 rounded-2xl">
              <Upload className="w-8 h-8 animate-bounce" />
              <p className="text-sm font-semibold">Change Image</p>
              <p className="text-xs opacity-80 font-mono">PNG, JPG, SVG or Drag & Drop</p>
            </div>
          </div>

          {/* Stamp name field */}
          <div className="flex flex-col gap-1.5 px-2">
            <label className="text-xs uppercase font-mono text-neutral-400">Stamp Name</label>
            <input
              type="text"
              value={stampName}
              onChange={(e) => setStampName(e.target.value)}
              className="bg-transparent border-b border-neutral-300 focus:border-neutral-900 focus:outline-none py-1.5 px-0 text-xl text-neutral-800 transition-colors"
              placeholder="e.g. Vintage Rose"
            />
          </div>

          <button
            onClick={handleGenerate}
            id="btn-designer-generate"
            className="w-full bg-[#ebd9d4] hover:bg-[#e1cecb] text-neutral-800 font-semibold py-4 rounded-full text-lg shadow-sm active:scale-98 transition-all mt-4 border border-[#e1cecb]"
          >
            Generate
          </button>
        </div>

        {/* Right Side: Radio options and sliders matching Image 8 layout */}
        <div className="flex flex-col justify-start gap-8 border-l border-neutral-100 pl-8 lg:pl-12">
          {/* Section: Padding sliders */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'var(--font-sans)' }}>Padding</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm font-mono text-neutral-500 mb-1">
                  <span>Top, Bottom:</span>
                  <span>{paddingTopBottom}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={paddingTopBottom}
                  onChange={(e) => setPaddingTopBottom(parseInt(e.target.value))}
                  className="w-full accent-neutral-800 cursor-ew-resize"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-mono text-neutral-500 mb-1">
                  <span>Right, Left:</span>
                  <span>{paddingLeftRight}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={paddingLeftRight}
                  onChange={(e) => setPaddingLeftRight(parseInt(e.target.value))}
                  className="w-full accent-neutral-800 cursor-ew-resize"
                />
              </div>
            </div>
          </div>

          {/* Section: Edges */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-medium tracking-tight text-neutral-900">Edges</h3>
            <div className="flex flex-col gap-2.5">
              {(['rough', 'scalloped', 'wave'] as StampEdge[]).map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer select-none group text-neutral-700">
                  <div className="relative">
                    <input
                      type="radio"
                      name="stamp-edge"
                      checked={edge === opt}
                      onChange={() => setEdge(opt)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      edge === opt ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                    }`}>
                      {edge === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="capitalize text-lg" style={{ fontFamily: 'var(--font-sans)' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section: Appearance */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-medium tracking-tight text-neutral-900">Appearance</h3>
            <div className="flex flex-col gap-2.5">
              {(['vintage', 'white', 'gold', 'silver'] as StampAppearance[]).map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer select-none group text-neutral-700">
                  <div className="relative">
                    <input
                      type="radio"
                      name="stamp-appearance"
                      checked={appearance === opt}
                      onChange={() => setAppearance(opt)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      appearance === opt ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                    }`}>
                      {appearance === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="capitalize text-lg" style={{ fontFamily: 'var(--font-sans)' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Overlay Template presets */}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-xs uppercase font-mono text-neutral-400 mb-2">Or Choose a Beautiful Preset Template</p>
            <div className="grid grid-cols-6 gap-2">
              {PRELOADED_STAMP_IMAGES.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  title={preset.name}
                  onClick={() => {
                    setSelectedImage(preset.dataUrl);
                    setStampName(preset.name);
                  }}
                  className={`relative aspect-square rounded-lg border overflow-hidden p-0.5 transition-all hover:scale-105 ${
                    selectedImage === preset.dataUrl ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-neutral-200'
                  }`}
                >
                  <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  {selectedImage === preset.dataUrl && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white rounded-bl p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

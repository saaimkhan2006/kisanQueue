import React from 'react';

export default function VisualQueuePipeline({ tokens = [], currentServing = 'C-106' }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Live Token Sequence Pipeline
          </span>
          <span className="text-[10px] bg-secondary-container/20 text-secondary font-bold px-2 py-0.5 rounded-full uppercase">
            FIFO Buffer
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Currently Serving
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary-fixed"></span> You Are Here
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Pipeline */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-thin">
        {tokens.map((item, idx) => {
          const isServing = item.token === currentServing;
          const isUser = item.isUser;

          return (
            <React.Fragment key={item.token}>
              <div
                className={`shrink-0 flex flex-col items-center justify-center rounded-2xl p-3 min-w-[84px] transition-all relative ${
                  isUser
                    ? 'bg-primary text-on-primary ring-4 ring-primary-fixed shadow-lg scale-105'
                    : isServing
                    ? 'bg-secondary-container text-on-secondary-container ring-2 ring-secondary shadow-md animate-pulse'
                    : 'bg-surface-container-low text-on-surface border border-surface-container'
                }`}
              >
                {/* User Pin Tag */}
                {isUser && (
                  <span className="absolute -top-3 bg-secondary text-on-secondary text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider">
                    You Are Here
                  </span>
                )}

                {isServing && !isUser && (
                  <span className="absolute -top-3 bg-secondary text-on-secondary text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider">
                    Serving Now
                  </span>
                )}

                <span className="text-[10px] opacity-75 font-mono mb-0.5">
                  #{idx + 1}
                </span>
                <span className="font-headline font-bold text-base tracking-tight">
                  {item.token}
                </span>
              </div>

              {/* Arrow separator between tokens */}
              {idx < tokens.length - 1 && (
                <span className="text-on-surface-variant/40 shrink-0 select-none">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

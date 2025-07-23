import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";

// Configure Monaco Editor loader
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
  }
});

// Retro CRT-style themes
const editorThemes = {
  dark: {
    base: "vs-dark",
    themeName: "crt-dark",
    colors: {
      "editor.background": "#1a1a2e",
      "editor.foreground": "#c5e8c5",
      "editor.lineHighlightBackground": "#2a2a3e",
      "editorCursor.foreground": "#ff66cc",
      "editor.selectionBackground": "#3d3d5a",
      "editor.inactiveSelectionBackground": "#3a3a4a",
      "editor.lineNumbers": "#a0a0cc",
      "editorGutter.background": "#1a1a2e",
      "editor.selectionHighlightBorder": "#ff66cc",
      "editor.wordHighlightBackground": "#57575750",
      "editor.wordHighlightStrongBackground": "#57575750",
      "editor.findMatchBackground": "#515c6a",
      "editor.findMatchHighlightBackground": "#41516a",
      "editor.hoverHighlightBackground": "#3a3a4a",
      "editorIndentGuide.background": "#3a3a4a",
      "editorIndentGuide.activeBackground": "#4a4a5a",
      "editorBracketMatch.background": "#3a3a4a",
      "editorBracketMatch.border": "#888888",
      "scrollbarSlider.background": "#ff66cc80",
      "scrollbarSlider.hoverBackground": "#ff66cc",
      "scrollbarSlider.activeBackground": "#ff66ff",
    }
  },
  light: {
    base: "vs",
    themeName: "crt-light",
    colors: {
      "editor.background": "#fff0f5",
      "editor.foreground": "#5a5a8c",
      "editor.lineHighlightBackground": "#ffe6f2",
      "editorCursor.foreground": "#ff66cc",
      "editor.selectionBackground": "#ffccf9",
      "editor.inactiveSelectionBackground": "#f0d6e8",
      "editor.lineNumbers": "#b19cd9",
      "editorGutter.background": "#fff0f5",
      "editor.selectionHighlightBorder": "#ffccf9",
      "editor.wordHighlightBackground": "#d3d3d350",
      "editor.wordHighlightStrongBackground": "#d3d3d350",
      "editor.findMatchBackground": "#ffb6c180",
      "editor.findMatchHighlightBackground": "#ffcce680",
      "editor.hoverHighlightBackground": "#ffe6f2",
      "editorIndentGuide.background": "#e6d6ff",
      "editorIndentGuide.activeBackground": "#d5c2ff",
      "editorBracketMatch.background": "#e6d6ff",
      "editorBracketMatch.border": "#b19cd9",
      "scrollbarSlider.background": "#b19cd980",
      "scrollbarSlider.hoverBackground": "#b19cd9",
      "scrollbarSlider.activeBackground": "#9370db",
    }
  }
};

export default function SubmissionCodeEditor({
  initialCode,
  problemId,
  language = "cpp",
  onCodeChange,
}) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [code, setCode] = useState(initialCode || "");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Load code and listen for theme changes
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${problemId}-${language}`);
    if (savedCode) setCode(savedCode);

    const handleStorageChange = () => {
      const stored = localStorage.getItem('theme') || 'dark';
      setTheme(stored);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [problemId]);

  // Inject CRT effect styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .crt-effect::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          ),
          linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.06),
            rgba(0, 255, 0, 0.02),
            rgba(0, 0, 255, 0.06)
          );
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
        z-index: 10;
      }
      
      .crt-effect {
        position: relative;
        background: #1a1a2e;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 
          0 0 10px rgba(0, 255, 150, 0.1),
          0 0 20px rgba(0, 200, 255, 0.1) inset;
      }
      
      .crt-effect.light {
        background: #fff0f5;
        box-shadow: 
          0 0 10px rgba(255, 105, 180, 0.2),
          0 0 20px rgba(255, 182, 193, 0.3) inset;
      }
      
      .crt-effect::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.05);
        pointer-events: none;
        z-index: 10;
        animation: flicker 0.15s infinite;
      }
      
      @keyframes flicker {
        0% { opacity: 0.1; }
        20% { opacity: 0.1; }
        21% { opacity: 0.6; }
        22% { opacity: 0.1; }
        40% { opacity: 0.1; }
        41% { opacity: 0.3; }
        42% { opacity: 0.1; }
        60% { opacity: 0.1; }
        62% { opacity: 0.8; }
        63% { opacity: 0.1; }
        80% { opacity: 0.1; }
        81% { opacity: 0.4; }
        82% { opacity: 0.1; }
        100% { opacity: 0.1; }
      }
      
      /* Custom scrollbar for editor container */
      .crt-scrollbar::-webkit-scrollbar {
        width: 12px;
      }
      
      .crt-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
      
      .crt-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #ff66cc, #66ccff);
        border-radius: 10px;
        border: 2px solid rgba(0, 0, 0, 0.2);
      }
      
      .crt-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(45deg, #ff33cc, #33ccff);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);

    // Register themes
    Object.entries(editorThemes).forEach(([_, config]) => {
      monaco.editor.defineTheme(config.themeName, {
        base: config.base,
        inherit: true,
        rules: [
          { token: '', foreground: config.colors["editor.foreground"], background: config.colors["editor.background"] },
          { token: 'keyword', foreground: '#ff66cc' },
          { token: 'comment', foreground: '#b19cd9', fontStyle: 'italic' },
          { token: 'string', foreground: '#a0e7a0' },
          { token: 'number', foreground: '#66ccff' },
          { token: 'type', foreground: '#ffcc66' },
        ],
        colors: config.colors,
      });
    });
    monaco.editor.setTheme(editorThemes[theme].themeName);

    // Configure language defaults
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          ...(language === 'cpp' ? [
            {
              label: 'for loop',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'for (int ${1:i} = 0; $1 < ${2:count}; $1++) {\n\t${3}\n}',
              documentation: 'For loop snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            // ... other snippets
          ] : []),
        ];
        return { suggestions };
      }
    });

    // Retro editor options
    editor.updateOptions({
      cursorBlinking: "phase",
      cursorSmoothCaretAnimation: true,
      cursorStyle: "line",
      smoothScrolling: true,
      fontFamily: "'Courier New', monospace",
      fontSize: 15,
      lineHeight: 24,
      letterSpacing: 0.5,
      fontWeight: "bold",
    });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(`code-${problemId}-${language}`, newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  const containerClass = `crt-effect ${theme === 'light' ? 'light' : ''} crt-scrollbar rounded-xl overflow-hidden border height-full border-gray-700 shadow-xl transition-all duration-300`;
  const badgeClass = theme === 'dark' 
    ? "absolute bottom-4 right-4 text-xs font-mono font-medium text-pink-300 bg-black/50 px-3 py-1 rounded-full border border-pink-500 shadow-sm glow-text"
    : "absolute bottom-4 right-4 text-xs font-mono font-medium text-purple-700 bg-pink-100/80 px-3 py-1 rounded-full border border-purple-500 shadow-sm";

  return (
    <div className={containerClass}>
      <div className="relative h-full">
        <Editor
          height="75vh"
          language={language}
          value={code}
          theme={editorThemes[theme].themeName}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-pink-400">
                Loading Retro Editor...
              </div>
            </div>
          }
          options={{
            fontSize: 15,
            fontFamily: "'Courier New', Courier, monospace",
            lineHeight: 24,
            letterSpacing: 0.5,
            fontWeight: "bold",
            minimap: { enabled: true },
            automaticLayout: true,
            renderLineHighlight: "all",
            lineNumbersMinChars: 3,
            folding: true,
            bracketPairColorization: { 
              enabled: true, 
              independentColorPoolPerBracketType: true 
            },
            guides: {
              bracketPairs: "active",
              bracketPairsHorizontal: "active",
              highlightActiveBracketPair: true,
              highlightActiveIndentation: true,
            },
            mouseWheelZoom: true,
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            wordWrap: "on",
            scrollbar: { 
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              useShadows: false,
              handleMouseWheel: true
            },
            contextmenu: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            parameterHints: { enabled: true },
            hover: { enabled: true, delay: 300, sticky: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoIndent: "full",
            formatOnPaste: true,
            formatOnType: true,
            overviewRulerLanes: 3,
            overviewRulerBorder: false,
            renderValidationDecorations: "on",
          }}
        />
        {isEditorReady && (
          <div className={badgeClass}>
            {language.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
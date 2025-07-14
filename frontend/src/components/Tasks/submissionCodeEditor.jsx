import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";

// Configure Monaco Editor loader
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
  }
});

// Enhanced custom themes
const editorThemes = {
  dark: {
    base: "vs-dark",
    themeName: "code-dark-pro",
    colors: {
      "editor.background": "#1e1e2e",
      "editor.foreground": "#e0e0e0",
      "editor.lineHighlightBackground": "#2a2a3a",
      "editorCursor.foreground": "#f8f8f0",
      "editor.selectionBackground": "#3d3d5a",
      "editor.inactiveSelectionBackground": "#3a3a4a",
      "editor.lineNumbers": "#6c7086",
      "editorGutter.background": "#1e1e2e",
      "editor.selectionHighlightBorder": "#3d3d5a",
      "editor.wordHighlightBackground": "#57575750",
      "editor.wordHighlightStrongBackground": "#57575750",
      "editor.findMatchBackground": "#515c6a",
      "editor.findMatchHighlightBackground": "#41516a",
      "editor.hoverHighlightBackground": "#3a3a4a",
      "editorIndentGuide.background": "#3a3a4a",
      "editorIndentGuide.activeBackground": "#4a4a5a",
      "editorBracketMatch.background": "#3a3a4a",
      "editorBracketMatch.border": "#888888"
    }
  },
  light: {
    base: "vs",
    themeName: "code-light-pro",
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#333333",
      "editor.lineHighlightBackground": "#f5f5f5",
      "editorCursor.foreground": "#333333",
      "editor.selectionBackground": "#add6ff",
      "editor.inactiveSelectionBackground": "#e5e5e5",
      "editor.lineNumbers": "#999999",
      "editorGutter.background": "#ffffff",
      "editor.selectionHighlightBorder": "#add6ff",
      "editor.wordHighlightBackground": "#d3d3d350",
      "editor.wordHighlightStrongBackground": "#d3d3d350",
      "editor.findMatchBackground": "#a8c8e8",
      "editor.findMatchHighlightBackground": "#b8d8f8",
      "editor.hoverHighlightBackground": "#e5e5e5",
      "editorIndentGuide.background": "#e5e5e5",
      "editorIndentGuide.activeBackground": "#d5d5d5",
      "editorBracketMatch.background": "#e5e5e5",
      "editorBracketMatch.border": "#888888"
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

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);

    // Register themes
    Object.entries(editorThemes).forEach(([_, config]) => {
      monaco.editor.defineTheme(config.themeName, {
        base: config.base,
        inherit: true,
        rules: [],
        colors: config.colors,
      });
    });
    monaco.editor.setTheme(editorThemes[theme].themeName);

    // Configure language defaults for better suggestions
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          // C++ specific suggestions
          ...(language === 'cpp' ? [
            {
              label: 'for loop',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'for (int ${1:i} = 0; $1 < ${2:count}; $1++) {\n\t${3}\n}',
              documentation: 'For loop snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'if statement',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'if (${1:condition}) {\n\t${2}\n}',
              documentation: 'If statement snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '${1:int} ${2:functionName}(${3}) {\n\t${4}\n\treturn ${5};\n}',
              documentation: 'Function declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'main function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'int main() {\n\t${1}\n\treturn 0;\n}',
              documentation: 'Main function declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'vector',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'vector<int> ${1:vectorName};',
              documentation: 'Vector declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'pair',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'pair<int, int> ${1:pairName};',
              documentation: 'Pair declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'map',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'map<int, int> ${1:mapName};',
              documentation: 'Map declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'set',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'set<int> ${1:setName};',
              documentation: 'Set declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'queue',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'queue<int> ${1:queueName};',
              documentation: 'Queue declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },
            {
              label: 'stack',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'stack<int> ${1:stackName};',
              documentation: 'Stack declaration snippet',
              range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
            },

          ] : []),
          // Add more language-specific suggestions here
        ];
        return { suggestions };
      }
    });

    // Smooth typing effect
    editor.updateOptions({
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: true,
      cursorStyle: "line-thin",
      smoothScrolling: true,
      accessibilitySupport: "auto",
      scrollBeyondLastLine: true,
      minimap: {
        enabled: false,
      },
      lineNumbersMinChars: 3,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      glyphMargin: true,

    });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(`code-${problemId}-${language}`, newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  return (
    
    <div className="rounded-xl overflow-hidden border height-full  border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900 transition-all duration-300">
      
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
              <div className="animate-pulse text-gray-500 dark:text-gray-400">
                Loading advanced editor...
              </div>
            </div>
          }
          options={{
            fontSize: 15,
            automaticLayout: true,
            glyphMargin: true,
            fontFamily: "'JetBrains Mono', 'Menlo', monospace",
            fontLigatures: true,
            lineHeight: 24,
            letterSpacing: 0.3,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderWhitespace: "boundary",
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
              verticalScrollbarSize: 8, 
              horizontalScrollbarSize: 8, 
              useShadows: false,
              handleMouseWheel: true
            },
            contextmenu: true,
            quickSuggestions: { 
              other: true, 
              comments: false, 
              strings: true 
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            tabCompletion: "on",
            wordBasedSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true, delay: 300, sticky: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoIndent: "full",
            formatOnPaste: true,
            formatOnType: true,
            suggest: {
              preview: true,
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showKeywords: true,
              showWords: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showSnippets: true
            }
          }}
        />
        {isEditorReady && (
          <div className="absolute bottom-4 right-4 text-xs font-mono font-medium text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm">
            {language.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
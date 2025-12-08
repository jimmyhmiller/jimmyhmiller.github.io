import Head from 'next/head';
import Script from 'next/script';
import NextLink from 'next/link';

import { useState, useEffect, createContext, useContext } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import haskell from 'react-syntax-highlighter/dist/esm/languages/prism/haskell';
import clojure from 'react-syntax-highlighter/dist/esm/languages/prism/clojure';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import { solarizedlight } from 'react-syntax-highlighter/dist/styles/prism';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

import dynamic from 'next/dynamic'

const NoSsrWrapper = props => (
  <>{props.children}</>
)

const NoSsr = dynamic(() => Promise.resolve(NoSsrWrapper), {
  ssr: false
})

export const Link = NextLink;
// export const Image = (props) => <img {...props} ;
export const Image = ({ src }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const { isDark } = useTheme();
  const styles = !fullScreen ? {} : {position: "fixed", zIndex: 100, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80vw"}
  return (
    <>
    {fullScreen && <div onClick={_ => setFullScreen(false)} style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: isDark ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.8)"}} />}
    <div style={{...styles}}>{fullScreen && <img onClick={() => setFullScreen(x => !x)} style={{width: "100%"}}  src={src}  />}</div>
    <img onClick={() => setFullScreen(x => !x)} style={{width: "100%"}} src={src}  />
    </>
  )
}

// Super ugly hack to override prism languages
// I really should make a modern prism, but I will
// never find time to do that. Warning to future me
// this causes some weird stuff with hot reloading when changed.
const clojure2 = (Prism) => {
  clojure(Prism);
  Prism.languages.clojure = {
    ...Prism.languages.clojure,
    number: /\b-?(0x)?\d*\.?\d+\b/g,
    logicVariable: /(\?|!)[a-zA-Z][a-zA-Z0-9-]+/,
  }
}
clojure2.displayName = 'clojure'
clojure2.aliases = []

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('haskell', haskell);
SyntaxHighlighter.registerLanguage('clojure', clojure2);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('rust', rust);




export const AbsolutePosition = ({ children, right, top, left, buttom}) =>
   <div style={{ position: "absolute", right, left, top,left}}>
      {children}
   </div>

export const Padding = ({ children, top, left, right, bottom }) =>
   <div style={{
      paddingTop: top,
      paddingLeft: left,
      paddingRight: right,
      paddingBottom: bottom,
   }}>
      {children}
   </div>

export const Margin = ({ children, top, left, right, bottom }) =>
   <div style={{
      marginTop: top,
      marginLeft: left,
      marginRight: right,
      marginBottom: bottom,
   }}>
      {children}
   </div>

const removeFirst = (arr) => {
  if (arr.length > 1) {
    arr.shift();
  }
  return arr;
}

export const detectIndent = source =>
  /^ */.exec(source)[0].length

export const removeIndent = (source) => {
  const lines = removeFirst(source.split("\n"))
  const indent = detectIndent(lines[0])
  return lines
    .map(s => s.substring(indent, s.length))
    .join("\n")
}


export const formatCode = (source) => {
  return removeIndent(source)
}


export const modifiedSolarizedLight = {
  ...solarizedlight,
  "operator": {
    color: "#cb4b16"
  },
  "logicVariable": {
    color: "#2aa198"
  },
  "pre[class*=\"language-\"]": {
    ...solarizedlight["pre[class*=\"language-\"]"],
    backgroundColor: "#fff",
  },
}

export const darkTheme = {
  'code[class*="language-"]': {
    color: '#e2e8f0',
    background: '#2d3748',
    textShadow: 'none',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    fontSize: '1em',
    lineHeight: '1.5',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#e2e8f0',
    background: '#2d3748',
    textShadow: 'none',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    fontSize: '1em',
    lineHeight: '1.5',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': { color: '#718096' },
  'prolog': { color: '#718096' },
  'doctype': { color: '#718096' },
  'cdata': { color: '#718096' },
  'punctuation': { color: '#cbd5e0' },
  'property': { color: '#68d391' },
  'tag': { color: '#68d391' },
  'boolean': { color: '#fc8181' },
  'number': { color: '#fc8181' },
  'constant': { color: '#fc8181' },
  'symbol': { color: '#fc8181' },
  'deleted': { color: '#fc8181' },
  'selector': { color: '#b794f4' },
  'attr-name': { color: '#b794f4' },
  'string': { color: '#fbd38d' },
  'char': { color: '#fbd38d' },
  'builtin': { color: '#63b3ed' },
  'inserted': { color: '#68d391' },
  'operator': { color: '#c678dd' },
  'entity': { color: '#63b3ed' },
  'url': { color: '#63b3ed' },
  'variable': { color: '#e2e8f0' },
  'atrule': { color: '#fbd38d' },
  'attr-value': { color: '#fbd38d' },
  'function': { color: '#63b3ed' },
  'class-name': { color: '#fbd38d' },
  'keyword': { color: '#c678dd' },
  'regex': { color: '#fc8181' },
  'important': { color: '#fc8181', fontWeight: 'bold' },
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' },
  'logicVariable': { color: '#56b6c2' },
}

export const Code = ({ source, language, removeIndent=true }) => {
  const { isDark } = useTheme();
  return (
    <SyntaxHighlighter
      language={language}
      style={isDark ? darkTheme : modifiedSolarizedLight}
    >
      {removeIndent ? formatCode(source) : source}
    </SyntaxHighlighter>
  )
}

export const GenericCode = ({ children }) =>
  <Code
    source={children} />

export const Javascript = ({ children }) =>
  <Code
    language="javascript"
    source={children} />

export const Haskell = ({ children }) =>
  <Code
    language="haskell"
    source={children} />

export const Clojure = ({ children }) =>
  <Code
    language="clojure"
    source={children} />


export const Ruby = ({ children }) =>
  <Code
    language="ruby"
    source={children} />

const GlobalStyles = () => {
  const { isDark } = useTheme();
  const bgColor = isDark ? '#1a202c' : '#fff';
  const textColor = isDark ? '#e2e8f0' : '#333';
  const borderColor = isDark ? '#4a5568' : '#ddd';
  const tableBg = isDark ? '#2d3748' : '#f2f2f2';

  return (
   <style global jsx>
   {`
      .bit-table-wrapper {
          overflow-x: auto;
          max-width: 100%;
      }
      .bit-table-wrapper table {
          min-width: 700px; /* or however wide your tables are */
          border-collapse: collapse;
          text-align: center;
      }
      body {
        font-family: helvetica, sans-serif;
        color: ${textColor};
        background-color: ${bgColor};
        line-height: 1.5;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      a {
        color: ${textColor};
      }
      table {
        border-collapse: collapse;
        width: 100%;
        border: 1px solid ${borderColor};
      }
      th {
        background-color: ${tableBg};
      }
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid ${borderColor};
      }
   `}
   </style>
  )
}

const Container = ({children}) =>
   <div style={{
      margin: "0 auto",
      maxWidth: 700,
   }}>
      {children}
   </div>

const ListItem = ({ href, text, Elem, nested }) =>
  <li key={href}>
    <Elem>
      <Link href={href}>
        {text}
      </Link>
    </Elem>
    {nested && nested.length > 0 && (
      <ul style={{
        listStyleType: 'disc',
        paddingLeft: '2.5em',
        marginTop: '-0.5em',
        marginBottom: '0'
      }}>
        {nested.map(nestedItem => (
          <li key={nestedItem.href}>
            <p style={{ fontSize: '1.2em', margin: 0 }}>
              <Link href={nestedItem.href}>
                {nestedItem.text}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    )}
  </li>

export const LargeText = ({ children }) =>
  <p style={{fontSize: "1.5em", marginBottom: "18px"}}>
    {children}
  </p>

export const MediumText = ({ children }) =>
  <p style={{fontSize: "1.1em"}}>
    {children}
  </p>

export const LinkList = ({ items, Elem=LargeText, title, headingSize=1 }) =>
  <>
    <Heading size={headingSize} text={title} />
    <ul>
      {items.map(item => ListItem({...item, Elem}))}
    </ul>
  </>

export const Heading = ({ color, text, size=1 }) => {
  const { isDark } = useTheme();
  const sizeToElem = {1: "h1", 2: "h2", 3: "h3", 4: "h4"}
  const Elem = sizeToElem[size];
  if (!Elem) {
    throw new Error("Undefined Heading Size")
  }
  const defaultColor = color || (isDark ? "#f7fafc" : "#999");
  const headingStyle = {
    color: defaultColor,
    ...(isDark ? {
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      fontWeight: size === 1 ? '600' : '500',
    } : {})
  };
  return (
    <Elem style={headingStyle}>
      {text}
    </Elem>
  )
}

export const Term = ({children}) => {
  const { isDark } = useTheme();
  return (
    <code style={{
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(27,31,35,0.05)",
      padding: "0.2em 0.4em",
      borderRadius: 3,
      fontFamily: "Monaco, monospace",
      fontSize: 13,
      whiteSpace: "nowrap",
    }}>
      {children}
    </code>
  )
}

export const BlockQuote = ({children}) => {
  const { isDark } = useTheme();
  return (
    <blockquote style={{
      paddingLeft: 20,
      margin: 0,
      marginLeft: 20,
      borderLeft: isDark ? "0.25em solid #4a5568" : "0.25em solid #dfe2e5",
    }}>
      {children}
    </blockquote>
  )
}

const NoteTitle = () => (
  <p style={{padding:0, margin: 0, color: "#79b8ff"}}><strong>ⓘ Note</strong></p>
)


// Like what you get on github when you do > [!NOTE]
export const Note = ({children, Title=NoteTitle}) => {
  const { isDark } = useTheme();
  return (
    <div style={{
      backgroundColor: isDark ? "#1e3a5f" : "#f1f8ff",
      padding: 10,
      border: isDark ? "1px solid #2d5a8f" : "1px solid #c8e1ff",
      borderRadius: 3,
      borderLeft: "0.25em solid #79b8ff",
    }}>
      {Title && <Title />}
      {children}
    </div>
  )
}


export const Aside = ({children, title}) => {
  const { isDark } = useTheme();
  return (
    <details style={{color: isDark ? "#a0aec0" : "#999"}}>
      <summary>
        <span style={{padding:0, margin: 0, color: isDark ? "#a0aec0" : "#999"}}><strong>Aside {title}</strong></span>
      </summary>
      <div style={{
        backgroundColor: isDark ? "#2d3748" : "#f6f8fa",
        padding: 10,
        border: isDark ? "1px solid #4a5568" : "1px solid #e1e4e8",
        borderRadius: 6,
        color: isDark ? "#cbd5e0" : "#666",
      }}>
        <div style={{paddingLeft: 20}}>
          {children}
        </div>
      </div>
    </details>
  )
}

export const Attribution = ({children}) =>
  <p style={{
    fontSize: 13,
    color: "#666",
    marginTop: -14,
    marginLeft: 12,
    fontWeight: "light",
  }}>
    —{" "}
    <span style={{textDecoration: "underline"}}>{children}</span>
  </p>

export const Title = ({ text }) =>
  <>
    <Head>
      <title>{text}</title>
    </Head>
    <Heading text={text} size={1} />
  </>

export const RandomList = ({ items, Elem }) => {
  const [randomizedList, setRandomizedList] = useState([]);

  useEffect(() => {
    // Shuffle the list
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setRandomizedList(shuffled);
  }, [items]);

  return (
    <ul>
      {randomizedList.map((item, index) => (
        <li key={index}><Elem>{item.text}</Elem></li>
      ))}
    </ul>
  );
};

export const List = ({ items, Elem }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}><Elem>{item.text}</Elem></li>
      ))}
    </ul>
  );
};



const removeLeadingSlash = (str) => str.startsWith('/') ? str.slice(1) : str;

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const iconColor = isDark ? '#a0aec0' : '#999';

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        position: 'absolute',
        right: '-26px',
        top: '16px',
        opacity: 0.6,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'scale(1.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.6';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    } else if (savedTheme === 'light') {
      setIsDark(false);
    } else {
      // No saved preference, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      if (newValue) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      return newValue;
    });
  };

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const GlobalLayout = ({ children }) => {
  useEffect(() => {
    const urlPath = encodeURIComponent(removeLeadingSlash(window.location.pathname));

    fetch(`https://github-sites-simple-stats-jimmyhmiller.vercel.app/api/${window.location.pathname === "/" ? "index" : urlPath}`)
  }, [])

  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
        <meta name="author" content="Jimmy Miller" />
        <link rel="alternate" type="application/rss+xml" title="jimmyhmiller.github.io"  href="feed.xml" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html.dark-mode {
              background-color: #1a202c;
              color: #e2e8f0;
            }
            html.dark-mode body {
              background-color: #1a202c;
              color: #e2e8f0;
            }
          `
        }} />
      </Head>
      <Script
        id="theme-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark-mode');
                } else if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark-mode');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      <GlobalStyles />
      <Container>
        <div style={{position: "relative"}}>
            <AbsolutePosition right={0} top={0}>
              <div style={{position: 'relative'}}>
                <Link style={{textDecoration: "none"}} href="/">
                    <Heading
                       color="#999"
                       text="Jimmy Miller"/>
                </Link>
                <ThemeToggle />
              </div>
            </AbsolutePosition>
        </div>
        <Padding top={70} bottom={70}>
          {children}
        </Padding>
      </Container>
    </ThemeProvider>
  )
}



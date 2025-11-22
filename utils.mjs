import Head from 'next/head';
import NextLink from 'next/link';

import { useState, useEffect } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import haskell from 'react-syntax-highlighter/dist/esm/languages/prism/haskell';
import clojure from 'react-syntax-highlighter/dist/esm/languages/prism/clojure';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import { solarizedlight } from 'react-syntax-highlighter/dist/styles/prism';

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
  const styles = !fullScreen ? {} : {position: "fixed", zIndex: 100, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80vw"}
  return (
    <>
    {fullScreen && <div onClick={_ => setFullScreen(false)} style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgb(0,0,0,0.8)"}} />}
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

export const Code = ({ source, language, removeIndent=true }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={modifiedSolarizedLight}
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

const GlobalStyles = () =>
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
        color: #333;
        line-height: 1.5;
      }
      a {
        color: #333;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        border: 1px solid #ddd;
      }
      th {
        background-color: #f2f2f2;
      }
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
   `}
   </style>

const Container = ({children}) =>
   <div style={{
      margin: "0 auto",
      maxWidth: 700,
   }}>
      {children}
   </div>

const ListItem = ({ href, text, Elem }) =>
  <li key={href}>
    <Elem>
      <Link href={href}>
        {text}
      </Link>
    </Elem>
  </li>

export const LargeText = ({ children }) =>
  <p style={{fontSize: "1.5em"}}>
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
  const sizeToElem = {1: "h1", 2: "h2", 3: "h3", 4: "h4"}
  const Elem = sizeToElem[size];
  if (!Elem) {
    throw new Error("Undefined Heading Size")
  }
  return (
    <Elem style={{ color }}>
      {text}
    </Elem>
  )
}

export const Term = ({children}) =>
  <code style={{
    backgroundColor: "rgba(27,31,35,0.05)",
    padding: "0.2em 0.4em",
    borderRadius: 3,
    fontFamily: "Monaco, monospace",
    fontSize: 13,
    whiteSpace: "nowrap",
  }}>
    {children}
  </code>

export const BlockQuote = ({children}) =>
    <blockquote style={{
      paddingLeft: 20,
      margin: 0,
      marginLeft: 20,
      borderLeft: "0.25em solid #dfe2e5",
    }}>
      {children}
    </blockquote>

const NoteTitle = () => (
  <p style={{padding:0, margin: 0, color: "#79b8ff"}}><strong>ⓘ Note</strong></p>
)


// Like what you get on github when you do > [!NOTE]
export const Note = ({children, Title=NoteTitle}) =>
  <div style={{
    backgroundColor: "#f1f8ff",
    padding: 10,
    border: "1px solid #c8e1ff",
    borderRadius: 3,
    borderLeft: "0.25em solid #79b8ff",
  }}>
    {Title && <Title />}
    {children}
  </div>


export const Aside = ({children, title}) =>
<details style={{color: "#999"}}>
  <summary>
    <span style={{padding:0, margin: 0, color: "#999"}}><strong>Aside {title}</strong></span>
  </summary>
  <div style={{
    // Let's have a neutral gray background
      backgroundColor: "#f6f8fa",
      padding: 10,
      border: "1px solid #e1e4e8",
      borderRadius: 6,
      // borderLeft: "0.25em solid #999",
      color: "#666",
    }}>

      <div style={{paddingLeft: 20}}>
        {children}
      </div>

    </div>
</details>

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

export const GlobalLayout = ({ children }) => {
  useEffect(() => {
    const urlPath = encodeURIComponent(removeLeadingSlash(window.location.pathname));

    fetch(`https://github-sites-simple-stats-jimmyhmiller.vercel.app/api/${window.location.pathname === "/" ? "index" : urlPath}`)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
        <meta name="author" content="Jimmy Miller" />
        <link rel="alternate" type="application/rss+xml" title="jimmyhmiller.github.io"  href="feed.xml" />
      </Head>
      <GlobalStyles />
      <Container>
        <div style={{position: "relative"}}>
            <AbsolutePosition right={0} top={0}>
            <Link style={{textDecoration: "none"}} href="/">
                <Heading
                   color="#999"
                   text="Jimmy Miller"/>
             </Link>
            </AbsolutePosition>
        </div>
        <Padding top={70} bottom={70}>
          {children}
        </Padding>
      </Container>
    </>
  )
}



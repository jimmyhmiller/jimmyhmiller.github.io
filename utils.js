import Head from 'next/head';
import Link from 'next/link';


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

export const removeIndent = (source) => do {
  const lines = removeFirst(source.split("\n"))
  const indent = detectIndent(lines[0])
  lines
    .map(s => s.substring(indent, s.length))
    .join("\n")
}


export const formatCode = (source) => {
  return removeIndent(source)
}

import { solarizedlight } from 'react-syntax-highlighter/styles/prism';

export const modifiedSolarizedLight = {
  ...solarizedlight,
  "pre[class*=\"language-\"]": {
    ...solarizedlight["pre[class*=\"language-\"]"],
    backgroundColor: "#fff",
  },
}


import SyntaxHighlighter from 'react-syntax-highlighter/prism';

export const Code = ({ source, language }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={modifiedSolarizedLight}
    >
      {formatCode(source)}
    </SyntaxHighlighter>
  )
}

export const Javascript = ({ children }) => 
  <Code
    language="javascript"
    source={children} />

export const Haskell = ({ children }) => 
  <Code
    language="haskell"
    source={children} />

const GlobalStyles = () => 
   <style global jsx>
   {`
      body {
        font-family: helvetica, sans-serif;
        color: #333;
        line-height: 1.5;
      }
      a {
        color: #333;
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
      <Link href={href} as={href + "/"}>
        <a>{text}</a>
      </Link>
    </Elem>
  </li>

export const LargeText = ({ children }) => 
  <p style={{fontSize: "1.5em"}}>
    {children}
  </p>

export const LinkList = ({ items, Elem=LargeText, title }) =>
  <>
    <Heading text={title} />
    <ul>
      {items.map(item => ListItem({...item, Elem}))}
    </ul>
  </>

export const Heading = ({ color, text, size=1 }) => do {
  const sizeToElem = {1: "h1", 2: "h2", 3: "h3", "4": "h4"}
  const Elem = sizeToElem[size];
  <Elem style={{ color }}>
    {text}
  </Elem>
}

export const Term = ({children}) =>
  <code style={{
    backgroundColor: "rgba(27,31,35,0.05)",
    padding: "0.2em 0.4em",
    borderRadius: 3
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

export const Title = ({ text }) => 
  <>
    <Head>
      <title>{text}</title>
    </Head>
    <Heading text={text} size={1} />
  </>


export const GlobalLayout = ({ children }) =>
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
    </Head>
    <GlobalStyles />
    <Container>
      <div style={{position: "relative"}}>
          <AbsolutePosition right={0} top={0}>
          <a href="/" style={{textDecoration: "none"}}>
            <Heading
               color="#999"
               text="Jimmy Miller"/>
          </a>
          </AbsolutePosition>
      </div>
      <Padding top={70}>
        {children}
      </Padding>
    </Container>
  </>



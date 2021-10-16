import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import board from '../../public/board/contents.json'
import Link from 'next/link'

const findParents = (board, card) => {
  const currentLevel = card?.cards?.map(x => [x.document_id, card.id]) ?? [];
  const nextLevel = currentLevel.flatMap(([x, _]) => findParents(board, {...board.documents[x], id: x}))
  return currentLevel.concat(nextLevel)
}

const parents = Object.fromEntries(findParents(board, {...board.documents[board.root], id: board.root}));

const withParentLink = (Comp) => ({id, recurse, ...rest}) => {
  if (recurse !== 0 || board.root === id) {
    return <Comp id={id} recurse={recurse} {...rest} />
  }
  const parent = parents[id];
  return (
    <>
     <div style={{position: "absolute", right: 50, zIndex: 1000}}>
          <Link href={parent === board.root ? "/muse" : `/muse/${parent}`}>
            <a style={{textDecoration: "none"}}>↑ Parent</a>
          </Link>
        </div>
      <Comp id={id} recurse={recurse} {...rest} />
    </>
  )
}


const Image = withParentLink(({ original_file, recurse }) => {
  const size = recurse === 0 ? {} : {width: "100%", height: "100%"}
  return <img style={{position: "absolute", ...size}} src={`/board/files/${original_file}`} />
})

const Ink = withParentLink(({ ink_svg }) => {
  return <img style={{position: "absolute"}} src={`/board/files/${ink_svg}`} />
})

const Pdf = withParentLink(({ original_file, recurse }) => {
  const size = recurse === 0 ? {} : {width: "100%"}
  return <img style={{...size}} src={`/board/files/${original_file}-0.png`} />
})

const Text = withParentLink(({ original_file }) => {
  const [fileContent, setFileContent] = useState(null);
  useEffect(() => {
      fetch(`/board/files/${original_file}`).then(resp => {
        return resp.text()
      })
      .then(text => setFileContent(text))
    },
    [original_file]
  )
  return <div style={{fontSize: 18, lineHeight: 1.2, fontFamily: "helvetica"}}>{fileContent}</div>
})

const Card = withParentLink(({ type, document_id, position_x, position_y, size_height, size_width, recurse, z, ...rest }) => {
  const cardInfo = board.documents[document_id]
  const router = useRouter();
  const scale = cardInfo.snapshot_scale === 0 ? 0.1 : cardInfo.snapshot_scale;
  return (
    <div style={{
      position: "absolute",
      left: position_x, 
      top: position_y,
      width: size_width, 
      height: size_height,
      zIndex: z,
      cursor: cardInfo.type === "text" ? undefined : "pointer",
      }}>
      {cardInfo.type === "url" ? null :
        <div style={{color: "black", top: -20, position: "absolute", width: size_width - 20, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{cardInfo.label}</div>
      }
      <div
        style={cardInfo.type === "text" ? {} : {
          width: size_width, 
          height: size_height,
          borderRadius: 9,
          boxShadow: "rgb(206, 206, 205) 0px 0px 10px",
          backgroundColor: "#F0F0EE",
          overflow: "hidden"
        }}
      onClick={() => {
        // hacky way of only transitioning at top level
        if (recurse === 1) {
          // console.log(`transitioning  ${document_id}}`)
          router.push(`/muse/${document_id}`)
        }
      }}
      >
        {cardInfo.type !== "board" 
          ? <CardForType {...cardInfo} id={document_id} />
          :
          <div style={{position: "relative", transform: `scale(${scale})`, width: 0}}>
            {recurse <= 3 ? <Board {...cardInfo} id={document_id} recurse={recurse + 1} /> : null}
          </div>
        }
      </div>
    </div>
  )
})

const inkToArray = (ink_models) => {
  return Object.entries(ink_models || {})
    .filter(([k, v]) => v.ink_svg)
    .map(([k, v]) => v)
}


const Board = withParentLink(({ cards, ink_models, recurse, type, label, id, ...rest }) => {
  return <>
    {recurse !== 0 ? null : <div style={{color: "black", top: 20, position: "absolute", width: 200, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{label} </div>}
    {(cards || []).map(card => <Card key={card.document_id} {...card} recurse={recurse + 1} id={card.document_id} />)}
    {inkToArray(ink_models).map(ink => <Ink key={ink.ink_svg} {...ink} />)}
  </>
})


const Url = withParentLink(({url, title, label}) => {
  return (
    <div style={{padding: 10}}>
      <a style={{textDecoration: "none"}}
         href={url}
         title={title}>
        {label}
      </a>
    </div>
  )
})

const CardForType = ({ type, ...cardInfo }) => {
  if (type === "image") {
    return <Image {...cardInfo} />
  }
  if (type === "text") {
    return <Text {...cardInfo} />
  }
  if (type === "board") {
    return <Board {...cardInfo} />
  }
  if (type === "pdf") {
    return <Pdf {...cardInfo} />
  }
  if (type === "url") {
    return <Url {...cardInfo} />
  }
  return JSON.stringify({type, ...cardInfo}, null, 2)
}




const Muse = () => {
  const router = useRouter();
  const boardId = (router.query.id && router.query.id[0]) || board.root;
  const currentBoard = board.documents[boardId];

  return <>
    <style jsx global>{`
      body {
        background-color: #DFDFDE;
        font-family: sans-serif;
      }

    `}</style>

    <CardForType {...currentBoard} id={boardId} recurse={0}  />
  </>
}




export const getStaticProps = async () => {
  return {
    props: {}
  }
}

export const getStaticPaths = async () => {


  return {
    paths: Object.keys(board.documents).map(id => ({
      params: {id: [id]}
    })).concat([
      { params: {id: []} } // See the "paths" section below
    ]),
    fallback: false
  };
}


export default Muse
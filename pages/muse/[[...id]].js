import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import board from '../../public/board/contents.json'
// Need to narrow down the files





// Need to not set 100% if top level
const Image = ({ original_file, recurse }) => {
  const size = recurse === 0 ? {} : {width: "100%", height: "100%"}
  return <img style={{position: "absolute", ...size}} src={`/board/files/${original_file}`} />
} 

const Ink = ({ ink_svg }) => {
  return <img style={{position: "absolute"}} src={`/board/files/${ink_svg}`} />
} 

const Pdf = ({ original_file, recurse }) => {
  const size = recurse === 0 ? {} : {width: "100%"}
  return <img style={{...size}} src={`/board/files/${original_file}.jpeg`} />
} 

const Text = ({ original_file }) => {
  const [fileContent, setFileContent] = useState(null);
  useEffect(() => {
      fetch(`/board/files/${original_file}`).then(resp => {
        return resp.text()
      })
      .then(text => setFileContent(text))
    },
    [original_file]
  )
  return <div style={{padding: "10px 0 0 10px"}}>{fileContent}</div>
}

const Card = ({ type, document_id, position_x, position_y, size_height, size_width, recurse, z, ...rest }) => {
  const cardInfo = board.documents[document_id]
  const router = useRouter();
  return (
    <div style={{
      position: "absolute",
      left: position_x, 
      top: position_y,
      width: size_width, 
      height: size_height,
      zIndex: z,
      }}>
      <div style={{color: "black", top: -20, position: "absolute", width: size_width - 20, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{cardInfo.label}</div>
      <div
        style={{
          width: size_width, 
          height: size_height,
          borderRadius: 9,
          boxShadow: "0px 0px 20px rgba(0,0,0,0.2)",
          backgroundColor: "#F6F6F6",
          overflow: "hidden"
        }}
      onClick={() => {
        // hacky way of only transitioning at top level
        if (recurse === 0) {
          console.log(`transitioning  ${document_id}}`)
          router.push(`/muse/${document_id}`)
        }
      }}
      >
        {cardInfo.type !== "board" 
          ? <CardForType {...cardInfo} />
          :
          <div style={{position: "relative", transform: "scale(0.1)", width: 0}}>
            {recurse <= 1 ? <Board {...cardInfo} recurse={recurse + 1} /> : null}
          </div>
        }
      </div>
    </div>
  )
}

const inkToArray = (ink_models) => {
  return Object.entries(ink_models || {})
    .filter(([k, v]) => v.ink_svg)
    .map(([k, v]) => v)
}

const Board = ({ cards, ink_models, recurse, type, ...rest }) => {
  return <>
    {(cards || []).map(card => <Card key={card.document_id} {...card} recurse={recurse} />)}
    {inkToArray(ink_models).map(ink => <Ink key={ink.ink_svg} {...ink} />)}
  </>
}


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
    return <a href={cardInfo.url} title={cardInfo.title}>{cardInfo.label}</a>
  }
  return JSON.stringify({type, ...cardInfo}, null, 2)
}


const Muse = () => {
  const router = useRouter();
  const boardId = router.query.id && router.query.id[0];
  const currentBoard = board.documents[boardId || board.root];
  console.log(currentBoard)
  return <>
    <style jsx global>{`
      body {
        background-color: #DEDEDE;
        font-family: sans-serif;
      }

    `}</style>

    <CardForType {...currentBoard} recurse={0}  />
  </>
}

export default Muse
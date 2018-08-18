import { Lorem, Margin, Padding, AbsolutePosition } from '../utils.js';


const GlobalStyles = () => 
   <style global jsx>
   {`
      body {
        font-family: helvetica, sans-serif;
      }
   `}
   </style>

const Container = ({children}) =>
   <div style={{
      margin: "0 auto",
      width: 700,
   }}>
      {children}
   </div>

const Heading = ({ color, text }) =>
   <h1 style={{ color }}>
      {text}
   </h1>


export default () =>
   <>
      <GlobalStyles />
      <Container>
         <div style={{position: "relative"}}>
            <AbsolutePosition right={0} top={0}>
            <Heading
               color="#999"
               text="Jimmy Miller"/>
            </AbsolutePosition>
         </div>
         <Padding top={70}>
            <Heading
               text="Opinion" />
            <Lorem />
         </Padding>
      </Container>
   </>

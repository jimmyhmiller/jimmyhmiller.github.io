
import { Code, Heading, GlobalLayout, LinkList, Link, LargeText, MediumText, Title, RandomList } from "../../utils";

export const finishedPapers = [
    {
        text: "Dec 1: Elephant 2000",
        href: "/advent-of-papers/2024/dec-1-elephant-2000",
        mdx: true,
    },
    {
        text: "Dec 2: Software is an Abstract Artifact",
        href: "/advent-of-papers/2024/dec-2-abstract-artifact",
        mdx: true,
    },
    {
        text: "Dec 3: Google's Awful Paper on Technical Debt",
        href: "/advent-of-papers/2024/dec-3-awful-google-tech-debt",
        mdx: true,
    },
    {
        text: "Dec 4: Is the Brain a Computer?",
        href: "/advent-of-papers/2024/dec-4-brain-computer",
        mdx: true,
    },
    {
        text: "Dec 5: Worlds: Mutability with Control",
        href: "/advent-of-papers/2024/dec-5-worlds",
        mdx: true,
    }, 
    {
        text: "Dec 6: Intuition in Software Development",
        href: "/advent-of-papers/2024/dec-6-intuition",
        mdx: true,
    },
    {
        text: "Dec 7: Implementation is Semantic Interpretation",
        href: "/advent-of-papers/2024/dec-7-interpretation",
        mdx: true,
    },
    {
        text: "Dec 8: Beyond Being There: Making Remote Work Better",
        href: "/advent-of-papers/2024/dec-8-beyond-being-there",
        mdx: true,
    },
    {
        text: "Dec 9: What is a Game?",
        href: "/advent-of-papers/2024/dec-9-what-is-a-game",
        mdx: true,
    },
    {
        text: "Dec 10: Large Models of What?",
        href: "/advent-of-papers/2024/dec-10-large-models-of-what",
        mdx: true,
    },
    {
        text: "Dec 11: On Understanding Data Abstraction Revisited",
        href: "/advent-of-papers/2024/dec-11-data-abstraction",
        mdx: true,
    },
    {
        text: "Dec 12: Lazy Evaluation of Transactions in Database Systems",
        href: "/advent-of-papers/2024/dec-12-lazy-transactions",
        mdx: true,
    },
    {
        text: "Dec 13: What Knowledge Isn't",
        href: "/advent-of-papers/2024/dec-13-knowledge",
        mdx: true,
    },
    {
        text: "Dec 14: Bidrectional Type Checking",
        href: "/advent-of-papers/2024/dec-14-bidirectional-type-checking",
        mdx: true,
    },
    {
        text: "Dec 15: Programming Languages as Technical Artifacts",
        href: "/advent-of-papers/2024/dec-15-technical-artifacts",
        mdx: true,
    },
    {
        text: "Dec 16: Will Computers Ever Become Easy to Use?",
        href: "/advent-of-papers/2024/dec-16-computers-easy",
        mdx: true,
    },
]

const consideredPapers = [
    {text: "Computing with Uncertainty and Its Implications to Universality - Naya Nagy and Selim G. Akl"},
    {text: "Intrinsic Propensity for Vulnerability in Computers? Arbitrary Code Execution in the Universal Turing Machine - Pontus Johnson"},
    {text: "Adapting the Environment Instead of Oneself - David Kirsh"},
    {text: "The Cultural Part of Cognition - Roy Goodwin D’Andrade"},
    {text: "Abstraction in Computer Science - Timothy Colburn and Gary Shute"},
    {text: "50,000,000,000 Instructions Per Second: Design and Implementation of a 256-Core BrainFuck Computer - Sang-Woo Jun"},
    {text: "Everybody Clap Your Hands: The Cha-Cha Slide is Turing Complete - Harrison Goldstein"},
    {text: "Challenging the Computational Metaphor: Implications for How We Think - Lynn Andrea Stein"},
    {text: "On Reversible Subroutines and Computers That Run Backwards - E. D. Reilly, Jr. and F. D. Federighi"},
    {text: "Three Challenges to Chalmers on Computational Implementation - Mark Sprevak"},
    {text: "Content, Computation, and Externalism - Oron Shagrir"},
    {text: "Once More—A Computer Revolution - Joseph Weizenbaum"},
]

const Advent = () => (
    <GlobalLayout>
       <Title text="Advent of Papers (2024)" />
       <MediumText>
            I spend quite a bit of time talking about papers on the the <Link href="https://futureofcoding.org/episodes">Future of Coding</Link> podcast.
            But there are so much papers we will never get to. So I thought it might be fun to do an advent of papers. I'm largely inspired by {" "}
            <Link href="https://blog.acolyer.org/">The Morning Paper</Link>. But I don't expect to be covering similar ground. In fact, I've kind of
            kept the choice of papers here to weirder papers. I don't right now plan on covering any classics. Though perhaps the amount of time I have
            could convince me otherwise. Since I am doing these daily for advent and it's a rather busy time. I will keep them brief and mostly summarize
            and give you my opinion on the paper. In large part this is a personal challenge to see if I can write about these papers in a reasonably
            short amount of time and with reasonable clarity. Below are the papers I've written up and an unordered list of papers I'm considering.
        </MediumText>
        <LinkList headingSize={2} items={finishedPapers} title="Finished Papers" />
        <Heading size={2} text="Potential Future Papers (Random Order)" />
        <RandomList Elem={MediumText} items={consideredPapers} />
    </GlobalLayout>
)

export default Advent;
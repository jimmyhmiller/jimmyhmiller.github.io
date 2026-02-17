
import { Code, Heading, GlobalLayout, LinkList, Link, LargeText, MediumText, Title, RandomList, List } from "../../utils";

import Head from 'next/head';

export const finishedPapers = [
    {
        text: "Dec 1: Elephant 2000",
        href: "/advent-of-papers/2024/dec-1-elephant-2000",
        mdx: true,
        date: "2024-12-01",
    },
    {
        text: "Dec 2: Software is an Abstract Artifact",
        href: "/advent-of-papers/2024/dec-2-abstract-artifact",
        mdx: true,
        date: "2024-12-02",
    },
    {
        text: "Dec 3: Google's Awful Paper on Technical Debt",
        href: "/advent-of-papers/2024/dec-3-awful-google-tech-debt",
        mdx: true,
        date: "2024-12-03",
    },
    {
        text: "Dec 4: Is the Brain a Computer?",
        href: "/advent-of-papers/2024/dec-4-brain-computer",
        mdx: true,
        date: "2024-12-04",
    },
    {
        text: "Dec 5: Worlds: Mutability with Control",
        href: "/advent-of-papers/2024/dec-5-worlds",
        mdx: true,
        date: "2024-12-05",
    },
    {
        text: "Dec 6: Intuition in Software Development",
        href: "/advent-of-papers/2024/dec-6-intuition",
        mdx: true,
        date: "2024-12-06",
    },
    {
        text: "Dec 7: Implementation is Semantic Interpretation",
        href: "/advent-of-papers/2024/dec-7-interpretation",
        mdx: true,
        date: "2024-12-07",
    },
    {
        text: "Dec 8: Beyond Being There: Making Remote Work Better",
        href: "/advent-of-papers/2024/dec-8-beyond-being-there",
        mdx: true,
        date: "2024-12-08",
    },
    {
        text: "Dec 9: What is a Game?",
        href: "/advent-of-papers/2024/dec-9-what-is-a-game",
        mdx: true,
        date: "2024-12-09",
    },
    {
        text: "Dec 10: Large Models of What?",
        href: "/advent-of-papers/2024/dec-10-large-models-of-what",
        mdx: true,
        date: "2024-12-10",
    },
    {
        text: "Dec 11: On Understanding Data Abstraction Revisited",
        href: "/advent-of-papers/2024/dec-11-data-abstraction",
        mdx: true,
        date: "2024-12-11",
    },
    {
        text: "Dec 12: Lazy Evaluation of Transactions in Database Systems",
        href: "/advent-of-papers/2024/dec-12-lazy-transactions",
        mdx: true,
        date: "2024-12-12",
    },
    {
        text: "Dec 13: What Knowledge Isn't",
        href: "/advent-of-papers/2024/dec-13-knowledge",
        mdx: true,
        date: "2024-12-13",
    },
    {
        text: "Dec 14: Bidrectional Type Checking",
        href: "/advent-of-papers/2024/dec-14-bidirectional-type-checking",
        mdx: true,
        date: "2024-12-14",
    },
    {
        text: "Dec 15: Programming Languages as Technical Artifacts",
        href: "/advent-of-papers/2024/dec-15-technical-artifacts",
        mdx: true,
        date: "2024-12-15",
    },
    {
        text: "Dec 16: Will Computers Ever Become Easy to Use?",
        href: "/advent-of-papers/2024/dec-16-computers-easy",
        mdx: true,
        date: "2024-12-16",
    },
    {
        text: "Dec 17: The Cultural Part of Cognition",
        href: "/advent-of-papers/2024/dec-17-cultural-cognition",
        mdx: true,
        date: "2024-12-17",
    },
    {
        text: "Dec 18: The Structure and Legal Interpretation of Computer Programs",
        href: "/advent-of-papers/2024/dec-18-legal-interpretation",
        mdx: true,
        date: "2024-12-18",
    },
    {
        text: "Dec 19: Everybody Clap Your Hands",
        href: "/advent-of-papers/2024/dec-19-clap-your-hands",
        mdx: true,
        date: "2024-12-19",
    },
    {
        text: "Dec 20: Three Paradigms of Computer Science",
        href: "/advent-of-papers/2024/dec-20-three-paradigms",
        mdx: true,
        date: "2024-12-20",
    },
    {
        text: "Dec 21: What is Conceptual Engineering and What Should It Be?",
        href: "/advent-of-papers/2024/dec-21-conceptual-engineering",
        mdx: true,
        date: "2024-12-21",
    },
    {
        text: "Dec 22: Once More—A Computer Revolution",
        href: "/advent-of-papers/2024/dec-22-computer-revolution",
        mdx: true,
        date: "2024-12-22",
    },
    {
        text: "Dec 23: Do Artifacts Have Politics?",
        href: "/advent-of-papers/2024/dec-23-artifacts-politics",
        mdx: true,
        date: "2024-12-23",
    },
    {
        text: "Dec 24: Against a Universal Definition of 'type'",
        href: "/advent-of-papers/2024/dec-24-against-types",
        mdx: true,
        date: "2024-12-24",
    },
]

const consideredPapers = [
    {text: "Computing with Uncertainty and Its Implications to Universality - Naya Nagy and Selim G. Akl"},
    {text: "Intrinsic Propensity for Vulnerability in Computers? Arbitrary Code Execution in the Universal Turing Machine - Pontus Johnson"},
    {text: "Adapting the Environment Instead of Oneself - David Kirsh"},
    {text: "Abstraction in Computer Science - Timothy Colburn and Gary Shute"},
    {text: "50,000,000,000 Instructions Per Second: Design and Implementation of a 256-Core BrainFuck Computer - Sang-Woo Jun"},
    {text: "Challenging the Computational Metaphor: Implications for How We Think - Lynn Andrea Stein"},
    {text: "On Reversible Subroutines and Computers That Run Backwards - E. D. Reilly, Jr. and F. D. Federighi"},
    {text: "Three Challenges to Chalmers on Computational Implementation - Mark Sprevak"},
    {text: "Content, Computation, and Externalism - Oron Shagrir"},
]

const Advent = () => (
    <GlobalLayout>
       <Title text="Advent of Papers (2024)" />
       <Head>
        <meta
            name="og:description"
            content="Each day I read and summarize a weird or intersting paper related to computing."
        />
    </Head>
       <MediumText>
            I spend quite a bit of time talking about papers on the <Link href="https://feelingof.com/episodes">Feeling of Computer</Link> podcast.
            But there are so much papers we will never get to. So I thought it might be fun to do an advent of papers. I'm largely inspired by {" "}
            <Link href="https://blog.acolyer.org/">The Morning Paper</Link>. But I don't expect to be covering similar ground. In fact, I've kind of
            kept the choice of papers here to weirder papers. I don't right now plan on covering any classics. Though perhaps the amount of time I have
            could convince me otherwise. Since I am doing these daily for advent and it's a rather busy time. I will keep them brief and mostly summarize
            and give you my opinion on the paper. In large part this is a personal challenge to see if I can write about these papers in a reasonably
            short amount of time and with reasonable clarity. Below are the papers I've written up and an unordered list of papers I'm considering.
        </MediumText>
        <LinkList headingSize={2} items={finishedPapers} title="Finished Papers" />
        <Heading size={2} text="Papers considered, but didn't end up reading" />
        <List Elem={MediumText} items={consideredPapers} />
    </GlobalLayout>
)

export default Advent;
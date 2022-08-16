import { Heading, BlockQuote, Term, GlobalLayout, Title } from "../utils.js";

const SocialLanguageConstructs = () => {
    return (
        <GlobalLayout>
            <Title text="Social Programming Language Constructs"></Title>
            <p>
                As programmers, we love to act as if everything is cut and dry,
                unaffected by social circumstances. The mindless execution of
                our code makes us believe that all aspects of coding practice
                are equally mindless, equally free from social influence and
                opinion. Perhaps we don’t consciously think this, we aren’t
                completely naive. And yet, I think, many of us would admit to
                that proclivity, that default assumption that code issues are
                cut and dry.
            </p>
            <p>
                I want to call attention to one element of programming that is
                much more determined by our social situation than we generally
                recognize. A feature of programming that may feel set in stone
                that I believe is radically different depending on the social
                circumstances you find yourself in. These features of
                programming I want to dub “Social Programming Language
                Constructs”.
            </p>
            <p>
                Let’s begin with the Wikipedia definition of language
                constructs:
            </p>
            <BlockQuote>
                A language construct is a syntactically allowable part of a
                program that may be formed from one or more lexical tokens
                in accordance with the rules of a programming language.
            </BlockQuote>
            <p>
                Here we find that cut and dryness we love about programming. We
                have two constraints placed on what makes something a language
                construct. It must be “syntactically allowable”, and must be
                used “in accordance with the rules of the programming language”.
                Perhaps this definition is lacking in some regards because these
                two rules don’t precisely identify what does and doesn’t count.
                It gives necessary, but not sufficient criteria for what is and
                isn’t a language construct.
            </p>
            <p>
                And yet, I think most of us have a good grasp of this. Controls
                flow operators are language constructs. Classes (in java) are
                language constructs. Type Classes in Haskell are language
                constructs. As follows directly from the definition, what is and
                isn’t a language construct is language-dependent.
            </p>
            <Heading size="2" text="The Languages we use"></Heading>
            <p>
                My goal here is not to dispute this definition. Not in its
                wording nor even in spirit. There are of course these
                cut-and-dry language constructs, they are real. But what I want
                to call attention to is another notion of language construct
                that I think is equally real, and perhaps more impactful. The
                notion of a Social Language Construct. Simply put, it is the
                idea that what is and isn’t “syntactically allowable” depends
                not just on your compiler/interpreter, but on the social
                environment in which you write code.
            </p>
            <p>
                Perhaps this claim seems ridiculous, let’s start by making it
                seem less so. What is and isn’t syntactically allowable depends
                on your language's compiler/interpreter. But not just the
                language in general, but the concrete version you use. If you
                are programming in K&amp;R C, there are certain syntactic
                patterns that aren’t valid in more modern C implementations. If
                you are programming in plain vanilla, uncompiled javascript,
                what is and isn’t syntactically valid depends on what browsers
                you want to support.
            </p>
            <p>
                But in real systems, syntactically valid often becomes more
                strict than just what the compiler/interpreter allows. We add
                extra layers onto our syntactic validity checking via linting.
                Once we have added errors to our linter, we have not added
                additional constraints on what is syntactically valid.
            </p>
            <p>
                In other words, we have made a new language. If a programming
                language at a bare minimum decides what things are syntactically
                valid, our new restriction has made a new language that is a
                subset of our existing language. Now because it is a subset, it
                isn’t radically different. Hopefully, we have made the language
                simpler in some regards, eliminating certain foot guns.
            </p>
            <Heading
                size="2"
                text="What Counts as Syntactically Valid"
            ></Heading>
            <p>
                Hopefully, a linter defining a new meaning of syntactically
                valid doesn’t seem too radical. But in what way is a linter
                social? Well if the linter's rules were not decided by you, but
                instead by other people, through some social negotiation
                process, or perhaps through a power relation, those lint rules
                owe their existence to social factors. Or in other words, absent
                that particular social situation, what is syntactically valid
                for you would change.
            </p>
            <p>
                But are linter's the only way we can change what is
                “syntactically valid”? Is something only syntactically invalid
                if a process returns a non-zero exit value? Or can code review
                change what it means to be “syntactically valid”? If my code can
                never be merged to master, never be deployed because it doesn’t
                meet some check, is it meaningfully syntactically valid?
            </p>
            <p>
                Trying to make a meaningful difference between these things
                seems to be a waste of time. Absent an automated linter, if my
                code won’t ever be merged if, for example, I use{" "}
                <Term>goto</Term>, the language I’m working with does not
                meaningfully have <Term>goto</Term>. <Term>goto</Term> is no
                longer syntactically valid for me.
            </p>
            <Heading size="2" text="A Socially Defined Language"></Heading>
            <p>
                If social structures can merely limit what is syntactically
                valid, and therefore limit what counts as a programming language
                construct, they might not be that interesting. But it goes
                beyond that. Limitations were merely meant as a
                non-controversial way to introduce the concept. Is it not
                possible to add to our languages socially?
            </p>
            <p>
                Well, our rules can go beyond removal. Our social rules for our
                programming languages can make new features. Consider MVC. Most
                languages do not have a “Model” language construct. Yet in our
                codebases, we often have rules about what counts as a model. We
                can talk about models as if they are parts of our language. As
                if they are the building blocks we use.
            </p>
            <p>
                This goes further than mere abstractions like models though.
                Working in a codebase with dependency injection, you may find
                that you have your own module system. No longer do you use your
                language's <Term>import</Term> or <Term>require</Term> system.
                You have your own way of constructing modules. No one removed
                the module system from the languages compiler/interpreter. And
                yet when writing code in that codebase, it isn’t “syntactically
                valid” to require a “service” or a “module” because your code
                will not be merged.
            </p>
            <Heading
                size="3"
                text="Limitations of Socially Defined Languages"
            ></Heading>
            <p>
                Much like non-social language constructs, the limitations of
                social language construction are implementation-dependent.
                First-class functions might be a very attractive language
                construct, but if the implementation of them comes at a 10x cost
                in performance and memory, their value might not be worth the
                cost. But perhaps performance doesn’t matter for our use case?
                If so, a poor implementation can still be useful for our goals.
            </p>
            <p>
                Social language constructs are implemented in the social systems
                that regulate the codebase in question. The question of quality
                here becomes a bit fuzzier. Generally, as programmers, we can
                agree that more memory and worse performance are less desirable
                than their opposites. But in social structures, it is often hard
                to find such agreement on implementation values.
            </p>
            <p>
                Perhaps some members of a social structure value uniformity,
                then the implementation’s quality to them will be determined by
                its ability to ensure nothing is missed and the construct is
                applied consistently. Others may value plurality, here the
                perceived implementation quality may depend on the flexibility
                and ability to deviate if desired. These differences in values
                can often lead to conflict that leads the implementation to
                deviate over time.
            </p>
            <p>
                Given the complexity offered by social situations, social
                language constructs offer much less stability than those
                codified in the language. Of course, language choice is part of
                the social fabric, but generally, changing languages is a
                difficult process. Social situations, particularly in a work
                environment, are changeable through many external means. So,
                these social language constructs do not rest on solid footing.
                This means as time passes, we may lose understanding of the
                functions these constructs once played.
            </p>
            <Heading
                size="3"
                text="Benefits of Social Language Constructs"
            ></Heading>
            <p>
                How can we use Social Language Constructs for good? By focusing
                first on their implementation. How have we decided to implement
                our social language constructs? Is it via informed consensus?
                Via senior engineers deciding what is acceptable? Via deference
                to our code ancestors? Via hype and trend following?
            </p>
            <p>
                Once we honestly consider these structures, we can consider if
                they properly reflect the values we hold. Is our decision to
                enforce X based on a deeply held value, is it enforced in a
                manner that is consistent with our values, does it update as our
                values change over time?
            </p>
            <p>
                By going through this process we can end up with Social Language
                Constructs that not only reflect our values but help others see
                them more clearly and practice them themselves. Perhaps we have
                a construct involving code comments. If we have consciously
                thought about this construct and the way it fits into our
                values, we should find that by reading and writing these
                comments, people should feel the values we claim to hold.
            </p>
            <Heading
                size="2"
                text="Downsides of Social Language Constructs"
            ></Heading>
            <p>
                Social language constructs can be detrimental especially with
                they reflect the power structures of the social situation they
                are embedded in. For example, there may be a code in a codebase
                that cannot be changed. The author may be a very important more
                senior developer who doesn’t take kindly to people messing
                around in “their” section of the code. There may also be things
                not expressible simply because the valid means of expressing
                them have been deemed forbidden by a committee on code style.
            </p>
            <p>
                Those who do not have a voice in the social structures at large
                may now find themselves also marginalized in the code. This is I
                think one of the most ignored features of our codebases, how we
                assert social pressure and conformity. Codebases are not neutral
                repositories of code. Code style guides are not merely rules for
                what goes in text files. People exert control and social
                influence through the code they write.
            </p>
            <p>
                These forms of control are seemingly ignored by many. It is
                quite understandable. It is easy to mistake a “desire to not be
                controlled via social language constructs” with “I don’t want a
                linter, so I can write whatever code I want”. Without the
                conceptual framework offered above, how could anyone hear
                complaints about linters and style guides as anything other than
                that?
            </p>
            <Heading size="2" text="Conclusion"></Heading>
            <p>
                What should we think about these language constructs? Given the
                social circumstances we inherit from the culture surrounding us,
                I think we should be skeptical of them. It is incredibly easy to
                import existing power structures into our code bases. It is very
                easy to unknowingly exert social control through seemingly
                neutral code rules. So should we completely rid ourselves of
                these constructs? Is that even possible?
            </p>
            <p>
                I think it’s clear that we can’t rid ourselves of these
                features. We cannot take the &quot;view from nowhere&quot;,
                believing ourselves to be completely neutral. Instead, we ought
                to think consciously about them. We ought to see them as part of
                the culture we create. Our choices of social language constructs
                reflect our culture, but also reinforce it.
            </p>
            <p>
                I’d like to suggest an approach to this problem I rarely see in
                practice. A conscious focus on diversity and plurality of code
                values. This does not mean taking an “anything goes” approach.
                Instead, it means ensuring that the values we uphold align with
                the principles we hold dear. But at the same time, not limiting
                expression, nor limiting relative priority of the values held by
                those in our engineering org.
            </p>
            <p>
                We need differing values expressed in our codebases. Some may
                care about performance, others approachability, security,
                debuggability. Whatever values those on our engineering teams
                hold, we shouldn’t try and limit their expression. Instead, we
                should cultivate this plurality. By doing so we may find our
                codebases are a bit less uniform and a bit less predictable. But
                I claim the trade-off is worth it.
            </p>
        </GlobalLayout>
    );
};

export default SocialLanguageConstructs;
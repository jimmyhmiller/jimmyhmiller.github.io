import { Heading, GlobalLayout, Title, Term, Image } from "../utils.js";
import introImage from '../public/images/editor-intro.png';
import drawImage from '../public/images/editor-draw.png';
import httpImage from '../public/images/editor-http.png';
import actionPaneImage from '../public/images/action-pane.png';
import textSpaceImage from '../public/images/text-space.png';
import tokenPaneImage from '../public/images/token-pane.png';

const EditorExperience = () => (
    <GlobalLayout>
        <Title text="My Experience Building an Editor in Rust"></Title>
        <p>
            I've always wanted to build a text editor. I've played around before
            with trying to modify existing editors like codemirror. But
            ultimately those just felt incredibly unsatisfying. While I was able
            to make some fun little experiments with them, I was just gluing
            code together. As I started to play with Rust, it seemed like the
            perfect opportunity to go beyond glue code. To write a GUI text
            editor from &quot;scratch&quot;. Overall, I'd say it worked out
            pretty well. Here's a screenshot of where things are right now.
            (We'll explain what you see in a bit.)
        </p>
        <p>
            <Image alt="editor" src={introImage} />
        </p>
        <p>
            The question of course is, what does &quot;scratch&quot;. In my
            case, I decided that &quot;scratch&quot; was going to be defined as
            using sdl2 as my set of primitives. So I had a fairly high-level way
            of dealing with things like drawing to a screen and rendering fonts,
            but nothing text editor specific. This choice I think was pretty
            good for me to get stuff going. I have no experience with graphics
            APIs and had I started there, I might have just stayed there.{" "}
        </p>
        <p>
            From the other angle, sdl2 was also good in that it didn't do too
            many things for me. There were no text edit widgets I was trying to
            control, no framework, just a library for windowing, drawing, font
            rendering, and eventing.
        </p>
        <Heading size="2" text="Background and Goals and Building"></Heading>
        <p>
            Before we talk about the general path I took, let's talk about my
            goals. Initially, my goal was to just build an editor. I wanted
            color syntax, I wanted general editing capabilities, that was about
            it. As time grew on, my goals became less and less clear. What I
            discovered as I kept developing is that building a text editor was a
            bit more finicky than I had expected, but also way easier than I
            ever imagined.{" "}
        </p>
        <p>
            Rust is a really fast language. In my career, I've mostly worked in
            slow languages. I mostly worked on problems where speed was
            important, but not the most important. For this project I wanted
            performance. I use emacs to do my Clojure development and to be
            honest, it's terrible. I like paredit, I like my cider setup, but
            emacs freezes constantly. When I try to print data out in the repl,
            I can completely lock the editor. That wasn't something I'd allow my
            editor to do, so I thought I'd have to be super clever to make that
            happen. Turns out, I didn't.
        </p>
        <Heading size="3" text="Influences"></Heading>
        <Heading size="4" text="Casey Muratori"></Heading>
        <p>
            As I was looking to undertake this project, Casey Muratori had put
            out his perhaps{" "}
            <a href="https://www.youtube.com/watch?v=hxM8QmyZXtg">video</a>{" "}
            about building a fast terminal. He walks through how he made the
            rendering fast by default using a standard technique called a font
            atlas. So that's where I started. If you like me had never heard of
            a font atlas, it is a simple idea. Draw a picture of all the
            characters you need and as you are rendering, you just reference
            those characters. No need to render the font each time.{" "}
        </p>
        <p>
            In my case, I focused on ascii and just made a texture of all those
            characters. It was blazingly fast. Turning off vsync, I had 1000s of
            frames per second. I played around with manually adding some color
            and found that the performance held. Good sign. Now I had two things
            to figure out. 1) What data structure to use for editing. 2) How to
            do color syntax? Luckily for the first, there was some prior art
            that lead me down an unexpected path.
        </p>
        <Heading size="4" text="Jamie Brandon"></Heading>
        <p>
            After I started my project, I found out that Jamie had implemented a
            very similar idea but in zig. Because it was so similar though (used
            SDL, a font atlas, etc) I didn't want to look too closely at it and
            spoil the fun. But what I did do was read his blog posts on it and
            the one on{" "}
            <a href="https://www.scattered-thoughts.net/writing/focus-text/">
                text handling
            </a>{" "}
            was particularly interesting. In the article, he says he just kept
            the text as a string and it was fast enough. Given my simplification
            of only handling ascii, I decided to try a{" "}
            <Term>Vec&lt;u8&gt;</Term> and it turns out, that was incredibly
            fast.{" "}
        </p>
        <p>
            Modern computers are way faster than I think many of us realize. I
            was able to implement text editing operations just by using the Vec.
            When I insert text in the middle of a line, I insert it into the
            Vec, shifting the whole thing down. And yet, every file feels
            smooth. Didn't need to use a rope or any fancy data structure like
            that. Of course, those have other benefits, but in this case, I
            could keep focusing on my text editor.
        </p>
        <Heading size="3" text="Color Syntax"></Heading>
        <p>
            At this point, I had edit and display, but no color syntax. To
            figure out line breaks, I parsed the buffer and made a very
            inefficient line array of tuples with <Term>(start, end)</Term>. I
            think this is one of those choices I wish I had done differently,
            mostly just on how I wrote the code, but it worked. One thing it let
            me do was only render the visible lines, so my first instinct for
            color syntax was to take advantage of that. I knew that editors like
            sublime use a regex-based solution that only looks a line at a time.
            So I thought, maybe I should just use that approach and take
            something off the shelf.
        </p>
        <Heading size="3" text="Failed Attempts"></Heading>
        <Heading size="4" text="Syntect"></Heading>
        <p>
            I first looked at using{" "}
            <a href="https://github.com/trishume/syntect">Syntect</a> for my
            highlighting. It works with sublime syntax files, so I'd be able to
            support many languages out of the box. It was incredibly easy to add
            to my project and well documented. I was able to integrate it very
            quickly and very quickly learn it was much too slow for what I
            wanted to do.{" "}
        </p>
        <p>
            Now, this isn't to fault Syntect. The sublime syntax format is based
            on TextMate's format, which relies heavily on regex. Given the
            complexity and constraints of these formats, there is only so much
            you can do. But it wasn't cutting it for me. You see at this point
            in the project, I wanted to keep things as simple as possible.
            Syntect though would often completely miss the frame deadline. If I
            was in the middle of editing a file and needed to
            re-syntax-highlight it, it would kill the performance. So I had to
            look elsewhere.{" "}
        </p>
        <Heading size="4" text="Tree Sitter"></Heading>
        <p>
            <a href="https://tree-sitter.github.io/tree-sitter/">Tree Sitter</a>{" "}
            is a very interesting project out of Github. It does incremental
            parsing with really robust error handling of many languages. So, if
            I added tree-sitter to my editor, I should get syntax highlighting
            for cheap, but also, not have a performance issue as I'm editing. Or
            so I thought.
        </p>
        <p>
            First getting tree-sitter setup was far from straightforward. The
            packaging and build situation for tree-sitter was a bit weird. But
            once I got that going, I was actually quite sad to find out that the
            highlighting portion of tree-sitter{" "}
            <a href="https://github.com/tree-sitter/tree-sitter/issues/1540">
                was not incremental at all
            </a>
            . I looked for a little while at making my own custom integration
            and I knew it was possible, but also didn't sound like fun. So I
            took a different path building my own custom setup.
        </p>
        <Heading size="3" text="Tokenizing Every Frame"></Heading>
        <p>
            I started with the simplest possible thing I could do, make a custom
            tokenizer and tokenize on every single frame. So I did that, wrote a
            really terrible, representative tokenizer, and revamped my rendering
            to use it. Turns out, that was actually really fast and easy! Even
            with doing the incredibly naive thing of parsing every single frame,
            I was able to have the largest source files I could find on my
            machine open and editable in 60fps. Honestly, I was pretty blown
            away by how well that setup worked. Admittedly, my tokenizer is not
            very good now right. But as they say, that's just a matter of
            programming. I know that I can keep and even improve the performance
            while making it more feature-rich.
        </p>
        <Heading size="2" text="Moving Beyond the Traditional Editor"></Heading>
        <p>
            At this point, I had the basics and wanted to play. First question,
            since I'm a big fan of <a href="https://museapp.com/">Muse</a>, I
            thought what if my text editor was a canvas? Implementing that was
            very straightforward, if a bit finicky, and moved me directly into
            the more interesting things I now wanted to do.{" "}
        </p>
        <Heading size="3" text="Token Pane"></Heading>
        <p>
            <Image alt="" src={tokenPaneImage} />
        </p>
        <p>
            As I was working on my tokenizer, I wanted to be able to see the
            output of the tokens right in the app. So I created what I called
            the token pane. If there is a pane called <Term>token_pane</Term>{" "}
            Its contents are defined as the raw tokens of the active pane. So
            now I could see exactly what things were tokenizing into. Incredibly
            useful for debugging.
        </p>
        <Heading size="3" text="Action Pane"></Heading>
        <p>
            <Image alt="" src={actionPaneImage} />
            Next was the action pane. Quite a bit trickier. Here I would display
            every action that happened in the app. But, what about scrolling the
            action pane? Well, if I did that, then as I scrolled the action pane
            would constantly get new actions. The whole thing was a bit of a
            mess.{" "}
        </p>
        <p>
            The other hard part of this setup was that I originally didn't have
            a great way to refer to panes. My actions would be something like
            &quot;MoveActivePane&quot;. But what was the active pane, or more
            precisely, when? Well, if I was looking at the action
            <i>
                pane, it was the active pane, so now as I'm filtering out action
            </i>
            pane actions, I would filter out all active pane actions! Not what I
            wanted. So I had to set up a system where your actions resolve to
            ids.{" "}
        </p>
        <Heading size="3" text="Draw Panes"></Heading>
        <p>
            Ultimately what I want out of an editor more than anything was
            captured in this early blog post on{" "}
            <a href="http://lighttable.com/2012/05/21/the-future-is-specific/">
                LightTable.
            </a>
            . In it, they imagine an editor configurable in itself. But I wanted
            a different flavor. What if you could extend the editor in any
            language? I already had seen ways of seeing the internals of the
            editor and using panes as output. What if I could do the opposite,
            use panes as input? I later discovered a nice name for this,{" "}
            <a href="https://maryrosecook.notion.site/Afterburner-To-Dos-129f967a4d1343f390b78a56fc0fc7a0">
                afterburner rendering ala Mary Rose Cook
            </a>
            . Here's an example. What you can see here is some javascript that
            prints output like <Term>rect 4 10 100 100</Term>, that output is
            then parsed by the editor and drawn as rectangles to the screen.
        </p>
        <Image src={drawImage} />
        <Heading size="3" text="Text Space Drawing"></Heading>
        <p>
            Obviously, rectangles aren't the most useful thing to draw. But I
            also played with rendering in text space. For example, here is a
            quick proof of concept of underlining text mentioned in rust
            compiler output. On the right, you see some unused imports. On the
            left, a quick bash script for drawing that to the screen.
        </p>
        <p>
            <Image alt="" src={textSpaceImage} />
        </p>
        <p>
            The dream is that as things evolved, your editor could gain new
            powers simply by code you have running in panes. No need for an
            extension language. Simply output things to stdout and you can
            control and extend the editor. What I found with this experiment is
            that even with the most naive, unoptimized code doing things that
            way was entirely possible.
        </p>
        <Heading size="3" text="Accessing Pane Content"></Heading>
        <p>
            One fun experiment I played with was a way for any language to get
            the contents of a pane. Obviously, if a pane is backed by a file,
            you can read that file. But that wasn't good enough for me. I want
            you to be able to access the contents before changes have been
            saved. Further, you should be able to access it with just standard
            tools. So, I exposed the editor as an http service.
        </p>
        <p>
            <Image alt="" src={httpImage} />
        </p>
        <p>
            Honestly, as weird as it may seem, it was pretty easy to do, not
            expensive computationally, and made it easy to access the data.
            Ultimately, I'd love to even expose more things. Like being able to
            control the editor via http requests. Now, external programs can
            interact with the editor in a way I've never seen supported. Once we
            have that, it means we have the full Unix power accessible in our
            editor in a very first class way.{" "}
        </p>
        <Heading size="2" text="What Went Well"></Heading>
        <Heading size="3" text="Rust"></Heading>
        <p>
            Rust was a wonderful language to write this in. I've gotten past the
            learning curve where I basically can write Rust without thinking too
            much about it. With all of these features, I was just thinking about
            the problems and not the language. While of course, Rust's ownership
            model pushed me in one direction, it never felt like it limited me.{" "}
        </p>
        <p>
            One thing I really have grown to enjoy is rusts explicit clones.
            Without GC, clones can be expensive in a tight loop. Making them
            explicit lets me be able to easily spot my bottlenecks. Several
            times I could do a quick clone to get things working and then come
            back and move the code around to make the ownership clear and avoid
            the clone.
        </p>
        <Heading size="3" text="SDL"></Heading>
        <p>
            SDL2 was easy to get going on this project. From day one I had
            things drawing on the screen. The primitives SDL provides were just
            what I needed to focus on my task and not worry about the details.
        </p>
        <Heading
            size="3"
            text="My Willingness to Let the Code be Messy"
        ></Heading>
        <p>
            I often get to a point in projects where things just stall out
            because I want to clean up my code and I don't know exactly how I
            want things to be. I know that the path I'm on is not the right one
            and instead of forging ahead with working code, I stop and consider,
            then lose interest and stop working on it. I didn't do that here.
            The codebase is a mess. There is a lot of duplicated code. And as it
            stands right now, things are broken from unfinished experiments.
            But, I got a lot done with this spare time project. And even with
            all the duplicated and poorly designed code, I only have 3442 lines
            of code.
        </p>
        <Heading size="2" text="What Went Poorly"></Heading>
        <Heading size="3" text="My Messy Code"></Heading>
        <p>
            While my willingness to let the code get messy was definitely good.
            The actual messiness of the code did cause some quality issues. I
            never went back and changed my line parsing to take advantage of my
            tokenizing code. So I loop through each file twice per frame.
            Because I was doing things hacky from the beginning, it took me a
            while to get to the point where I could track changes and know if I
            need to do things like reparse a file. The code now has that
            ability, but hooking it up was a decent amount of work and I never
            did it.
        </p>
        <Heading
            size="3"
            text="Lack of Action Reification From the Beginning"
        ></Heading>
        <p>
            I spent a lot of time refactoring code to emit data when an action
            happened. This is something I should have done from the beginning.
            As I was looking to implement undo/redo, this lack of reification
            and centralization of event handling led to all sorts of issues that
            still exist in the codebase.
        </p>
        <Heading size="2" text="Areas I'd love to Explore More"></Heading>
        <Heading size="3" text="External Extensibility"></Heading>
        <p>
            I really had a blast making this. It went in entirely different
            directions than I expected. I think this idea of an editor
            extensible via its own pane contents is really interesting. Of
            course, emacs is perhaps the ultimate example of an extensible
            editor, but it is still via elisp. Admittedly, I am sure there are
            parts where keeping things external may become a bottleneck. If that
            became the case, it might be interesting to explore webassembly
            extension points. But what I would find more interesting is to try
            and continue down this path. Perhaps there is a nice binary format
            that makes these things not too slow. Could you for example
            implement a language server protocol library in the editor without
            it needing to be built in and without it needing to use an extension
            library?{" "}
        </p>
        <p>
            Focusing on external extensibility also means that these extensions
            could be used by other editors. Basically, this work would expose an
            editor IR. An idea I find incredibly interesting and perhaps
            incredibly powerful.
        </p>
        <Heading size="3" text="Non-Traditional Layout"></Heading>
        <p>
            I never took my canvas idea very far. I didn't even implement
            panning around on the canvas. But I found myself loving these
            layouts. I did some code live in the editor for things like Conway's
            game of life, and being able to move my panes around and resize
            panes based on my focus were very nice interactions. I always have
            been a bit of a messy worker and I find having positions for things
            helps me out tremendously.{" "}
        </p>
        <Heading size="2" text="Conclusion"></Heading>
        <p>
            I had a blast doing this. Rust was a great language. I tried out
            lots of interesting ideas and they worked pretty darn well. But I
            think my biggest takeaway is that there is so much opportunity here.
            Text editors have largely remained unchanged in terms of user
            experience. Now with language servers, they can offer better static
            analysis and refactoring tools, but the ways of interacting with
            them have largely not changed.
        </p>
        <p>
            There is so much potential here. Why haven't we explored new avenues
            for user interfaces in text editors? Why aren't there editors that
            let me work with them more flexibly? Is a column-based layout with
            some intellisense really the best there is? Will we never discover
            something better? In my view, there haven't been many serious
            attempts at this. Maybe there needs to be.
        </p>
    </GlobalLayout>
);

export default EditorExperience;
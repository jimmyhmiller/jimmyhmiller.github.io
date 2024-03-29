import {
    Heading,
    BlockQuote,
    Term,
    GlobalLayout,
    Title,
    Image,
    Ruby,
} from "../utils.js";

const YJit = () => (
    <GlobalLayout>
        <Title text="Things I've Learned about Ruby's Implementation" />

        <Heading size="2" text="ZSuper" />

        <p>
            There are special super calls in ruby called ZSuper. These happen
            with code like this.
        </p>

        <Ruby>
            {`
            def my_inherited_method(my, args, are, here)
                super
                do_my_stuff()
            end
        `}
        </Ruby>

        <p>
            All the args from my_inherited_method get passed to the super method
            without needing to specify them. What is a bit suprising to me is
            that these don't get compiled out when lowering to bytecode but
            actually stick around. I assume there are good reasons for this? Not
            sure. It is something that YJIT will have to deal with.
        </p>

        <Heading size="4" text="Update" />
        <p>
            I figured out why this is. You don't actually copy the args, you
            just change the method being called. Or at least that is what it
            seems (which kind of makes sense). Does that mean you can mutate
            args in the super? I guess I could try that out. Anyways, hoping to
            try my hand at implementing that soon so I should know more.
        </p>
    </GlobalLayout>
);

export default YJit;

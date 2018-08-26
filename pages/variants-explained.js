import { 
  Heading,
  Javascript,
  Haskell,
  BlockQuote,
  Term,
  GlobalLayout,
  Title,
} from "../utils.js";

export default () => (
  <GlobalLayout>
    <Title text="Variants Explained" />
    <p>
      Imagine you have the following request for a product you are building:
    </p>
    <BlockQuote>
      Users should be able to login using the following methods:
      <ul>
        <li>Username and Password</li>
        <li>Phone Number</li>
        <li>Facebook Login</li>
      </ul>
    </BlockQuote>

    <p>
      As you are building this application you have to think about how to
      represent these user credentials. It might look something like this:
    </p>

    <Javascript>
    {`
      // Username and Password auth
      userCredentials: {
        username: "test",
        password: "password"
      }

      // phoneNumber auth
      userCredentials: {
        phoneNumber: "555-867-5309"
      }

      // Facebook Login
      userCredentials: {
        token: "VGhpcyBpcyBzdXBlciBzZWNyZXQ=" 
      }
    `}
    </Javascript>
    <p>
      There is a problem with the above way of representing this scenario.
      Imagine we needed to write a function that uses these user credentials. We
      have to make sure to handle every single case.
    </p>

    <Javascript>
    {`
      function handleAuth(userCredentials) {
        if (userCredentials.username && userCredentials.password) {
        // do stuff with username login
        } else if (userCredentials.phoneNumber) {
            // do stuff with phone number login
        } else if (userCredentials.token) {
            // do stuff with facebook login
        } else {
            // handle unknown scenario
        }
      }
    `}
    </Javascript>

    <p>
      This code made seem good as far as it goes, in fact, it even handles
      malformed data gracefully. Now imagine that our requirements change, we
      now need to handle third party username and password requests as well. We
      decide to model this in the obvious way.
    </p>

    <Javascript>
    {`
        userCredentials: {
          username: "test",
          password: "password",
          thirdParty: "SomeOtherBusiness"
        }
    `}
    </Javascript>
    <p>
      Unfortuantely now our code breaks, but not by throwing a nice error, it
      breaks subtly. We will try to use third party usernames and passwords for
      our own login system and since they have a username and password we will
      mistake them for first party logins.
    </p>

    <p>
      In javascript, there aren't too many great solutions to this. One obvious
      one is to create a class for each of different userCredential type. Then
      for any function we want to implement on our different types we implement
      a method in that class. That is how a Java developer may have solved this
      problem. That approach has its upsides and downsides, but rather than dive
      into those, let's look at a different approach, one that isn't supported
      by javascript. Since it isn't supported by javascript we will have to
      choose some other language. But rather than choose an existing language,
      let's just make up our own and imagine what it might be like to solve this
      problem in it.
    </p>

    <Heading size={2} text="Variants: An Example" />

    <p>
      The essence of our requirements is that we need to support different
      methods of login. Users may login this way <em>or</em> that way <em>or</em> someother
      way. We need a way to represent <strong>or</strong> in our data model. Variants allow
      us to do exactly that. Let's first look at a simple example of a variant.
    </p>

    <Haskell>
    {`
      data Color = Green | Red | Blue
    `}
    </Haskell>

    <p>
      Here we have a variant with three choices of colors. In our world, a color
      can only be green, red, or blue. No other colors are available to us. What
      we need to do now is write a function which returns true if it is passed
      the <em>best</em> color.
    </p>

    <Javascript>
    {`
      fn bestColor {
        Green => true
        Red => false
        Blue => false
      }
      bestColor(Red)
      // false

      bestColor(Green)
      // true
    `}
    </Javascript>

    <p>
      This function is rather straight-forward. We pattern match on the argument
      of the function to determine what was passed in. This allows us to express
      in a very concise way each case and what its output should be. Variants
      combined with pattern matching allow for very expressive, explicit code.
    </p>

    <p>
      Simple variants like color are just like enums in other languages, but
      variants are much more useful when they can take arguments as well.
    </p>

    <Haskell>
      {`
      data UserCredentials = FirstParty(username, password)
                           | Phone(phoneNumber)
                           | Facebook(token)
                           | ThirdParty(username, password, thirdParty)
    `}
    </Haskell>

    <p>
      Here we have our login problem fully specified. Each case is represented
      as a data type and because of that we can write a much less error prone
      functions for dealing with each case.
    </p>

    <Javascript>
    {`
      fn handleAuth {
        FirstParty(username, password) => // do stuff with username login
        Phone(phoneNumber ) => // do stuff with phone number login
        Facebook(token) => // do stuff with facebook login
        ThirdParty(username, password, thirdparty) => // do stuff with thirdParty login
        otherwise => // handle unknown scenario
      }
    `}
    </Javascript>

    <p>
      Not only is our function less error prone, it is also much easier to
      understand. Variants allow our code to be self documenting. Each case is
      named and handle explicitly leading us to think precisely about each
      scenario. Since our imaginary language is dynamically typed, we do need to
      handle the <Term>otherwise</Term> case (imagine someone passed in a number
      instead), but if it were statically typed we could be guarantee that nothing
      other than those variants would be passed.
    </p>

    <Heading size={2} text="Using Variants to Solve Problems" />

    <p>
      Variants are not just limited to concrete scenarios like the login above. They
      can be quote a bit more generic and that can give us more power. Let's
      look at a few generic variants that can be used to tackle common and
      difficult problems in programming.
    </p>

    <Heading size={2} text="Nulls" />

    <p>
      Null (undefined as well) is one of the most frustating things to work
      with. Expressing nulls checks leads to verbose code. Code isn't actually
      about the problem we are trying to solve. Variants offer an alternative to
      nulls, called the Maybe type.
    </p>

    <Haskell>
    {`
      data Maybe = Nothing | Something(thing)
    `}
    </Haskell>

    <p>
      The definition above may seem a bit strange if this is your first time
      encountering it. What it says is that there are two cases we need to
      consider, when we have nothing (the null case) and when we have something
      (the non-null case). We can use this by pattern matching.
    </p>

    <Javascript>
    {`
      fn tryToGetUserId {
        Something(user) => Something(getId(user))
        Nothing => Nothing
      }
    `}
    </Javascript>

    <p>
      The tryToGetUserId handles the case when we don't have a user id by
      pattern matching on <Term>Nothing</Term> and returning{" "}
      <Term>Nothing</Term>. If however we get something (a user) then we get the
      id of that user and return <Term>Something</Term> which contains a user.
    </p>

    <p>
      The tryToGetUserId handles the case when we don't have a user id by
      pattern matching on <Term>Nothing</Term> and returning <Term>Nothing</Term>. If however we get
      something (a user) then we get the id of that user and return <Term>Something</Term>
      which contains a user.
    </p>

    <p>
      As it stands, this isn't that much better than null, but when combined
      with simple functions, this variant because infinitely more useful.
    </p>

    <Javascript>
    {`
      fn map {
        (f, Something(x)) => Something(f(x))
        (f, Nothing) => Nothing
      }
    `}
    </Javascript>

    <p>
      Here we have map. You may be familiar with map with it comes to lists and
      if so, map for <Term>Maybe</Term> is very similar. As you can see from the function
      definition, map applies f only if we have <Term>Something</Term>, if not it returns
      <Term>Nothing</Term>. Using map we can rewrite our tryToGetUserId function.
    </p>

    <Javascript>
    {`
      fn tryToGetUserId(maybeUser) {
        map(getId, maybeUser)
      }
    `}
    </Javascript>

    <p>
      Using map extracts out all the pattern matching and does it for us. This
      same pattern can work for other variants. <Term>map</Term> is much more general than
      just lists.
    </p>

    <Haskell>
    {`
      data Either = Error e | Success s
      data List = Nil | Cons x tail
      data Tree = Leaf | Node left x right
    `}
    </Haskell>

    <p>
      For each of these structures, there is a sensible map definition. <Term>Either</Term>
      allows us to handle errors and only apply the function if we are not in an
      error state, mapping over a <Term>List</Term> applies the function to each element,
      and mapping over a tree applies the function to each node, recursing
      through the tree.
    </p>

    <Heading size={2} text="Conclusion" />

    <p>
      Variants are an extremely expressive way to state the assumptions behind
      our code. They force us to be explicit and handle cases individual. Yet,
      they also give a means of abstraction, a point at which we can define
      common interfaces and ignored the particularities underneath. In future
      posts we will take up this notion in more depth, showing how <Term>protocols</Term>
      when combined with <Term>variants</Term> can bring our language even more power.
    </p>
  </GlobalLayout>
);

import {
  Code,
  Heading,
  GlobalLayout,
  LinkList
} from '../utils.js';

const links = [
  {
    text: "Protomorphism and the Sequence Abstraction",
    href: "/protomorphism",
  },
  {
    text: "The Power of Protocols and Variants",
    href: "/protocols-variants",
  },
  {
    text: "Variants Explained",
    href: "/variants-explained",
  },
]


export default () =>
  <GlobalLayout>
    <Heading text="Posts" />
    <LinkList
      Elem="h2"
      items={links}
    />
  </GlobalLayout>

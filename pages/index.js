import {
  Code,
  Heading,
  GlobalLayout,
  LinkList
} from '../utils.js';

const links = [
  {
    text: "Variants Explained",
    href: "/variants-explained",
  },
  {
    text: "Variants and Protocols",
    href: "/variants-and-protocols",
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

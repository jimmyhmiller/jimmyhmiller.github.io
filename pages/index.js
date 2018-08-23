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
]


export default () =>
  <GlobalLayout>
    <Heading text="Posts" />
    <LinkList
      Elem="h2"
      items={links}
    />
  </GlobalLayout>

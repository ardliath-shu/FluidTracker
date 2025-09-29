import Link from "next/link";
import Card from "@/app/components/Card";

// Meta Data
export const metadata = {
  title: "Generic Page",
  description:
    "Examples of a generic page layout with header, footer, and sidebar.",
};

export default function pageDemo() {
  // Random card colour
  const colours = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
  ];
  const randomIndex = Math.floor(Math.random() * colours.length);
  const randomColour = colours[randomIndex];
  // Random Icon
  const icons = [
    "fa-car",
    "fa-tree",
    "fa-heart",
    "fa-star",
    "fa-moon",
    "fa-sun",
    "fa-cloud",
    "fa-bicycle",
    "fa-bus",
    "fa-rocket",
    "fa-ship",
    "fa-plane",
    "fa-motorcycle",
    "fa-train",
    "fa-truck",
  ];
  const randomIconIndex = Math.floor(Math.random() * icons.length);
  const randomIcon = icons[randomIconIndex];

  return (
    <div>
      <h1>Generic Page Layout</h1>
      <hr />
      <p className="center">
        This is a generic page layout for the content area of the application.
      </p>
      <br />

      <Card colour={randomColour} icon={randomIcon} title="Card Title">
        <h3>Generic Page Layout Example</h3>
        <p>
          This is a generic page layout example. You can add your content here.
        </p>
        <br />
        <p>
          Reload the page to see different random colours and icons (and the
          generated example HTML).
        </p>
      </Card>

      <Card colour="orange" icon="fa-code" title="Code Reference">
        <div className="center">
          <p>
            <i className="fa fa-fw fa-info-circle blue"></i> Icons used are from
            FontAwesome and a reference for the free icons is{" "}
            <Link
              href="https://fontawesome.com/search?ic=free&o=r"
              target="_blank"
            >
              here
            </Link>
            .
          </p>
          <hr className="mini" />
          <p>
            Colours available for elements with class/className .card, .btn or
            &lt;i&gt; elements are (ask me for others):
          </p>
          <pre>
            <code>{`red, blue, green, yellow, purple, orange, pink`}</code>
          </pre>
        </div>
        <hr />
        <h4>Basic code for this /generic/page.js</h4>
        <pre>
          <code>{`import Card from '../components/Card';
                
// Meta Data
export const metadata = {
    title: 'Page Title',
    description: 'Description of the page.',
};

export default function pageDemo() {
    return (
        <div>
            <h1>Generic Page Layout</h1>
            <hr />
            <p className='center'>This is a generic page layout for the content area of the application.</p>
            <br/>
            <Card colour="${randomColour}" icon="${randomIcon}" title="Card Title">
                <h3>Generic Page Layout Example</h3>
                <p>This is a generic page layout example. You can add your content here.</p>
            </Card>
        </div>
    );
}
`}</code>
        </pre>
      </Card>
    </div>
  );
}

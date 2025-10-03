import { siteConfig } from "@/app/lib/site.config";
import Card from "./Card";

export default function ExtraMenu() {
  return (
    <aside className="extra">
      <Card title="Hourly Trend" icon="fas fa-fw fa-chart-line" colour="red">
        <p>
          Fluid Tracker is a sample application demonstrating a responsive
          layout using Next.js and React.
        </p>
      </Card>
      <Card title="Statistics" icon="fas fa-fw fa-percent" colour="orange">
        <p>
          Fluid Tracker is a sample application demonstrating a responsive
          layout using Next.js and React.
        </p>
      </Card>
      <Card title="People" icon="fas fa-fw fa-users" colour="yellow">
        <p>
          Fluid Tracker is a sample application demonstrating a responsive
          layout using Next.js and React.
        </p>
      </Card>
      <Card title="2  Column Card" icon="fas fa-fw fa-droplet" colour="purple">
        <div className="row">
          <div className="col">
            <p>
              Fluid Tracker is a sample application demonstrating a responsive
              layout using Next.js and React.
            </p>
          </div>
          <div className="col">
            <p>
              Fluid Tracker is a sample application demonstrating a responsive
              layout using Next.js and React.
            </p>
          </div>
        </div>
      </Card>
      <Card
        title={`About ${siteConfig.name}`}
        icon="fas fa-fw fa-droplet"
        colour="green"
      >
        <p>
          {siteConfig.name} is {siteConfig.description.toLowerCase()}.
        </p>
      </Card>
    </aside>
  );
}

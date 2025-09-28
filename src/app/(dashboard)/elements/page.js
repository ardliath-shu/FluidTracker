import Card from '@/app/components/Card';

// Meta Data
export const metadata = {
    title: 'Custom CSS Elements',
    description: 'Examples of custom CSS elements for layout and styling.',
};

export default function elementsDemo() {
    return (
        <div>
            <h1>Custom CSS Elements Examples</h1>

            <hr />
            <Card colour="" icon="fa-cubes" title="Layout Examples">
                <h3 className='center'>This page demonstrates some custom components and CSS elements for layout and styling.</h3>
            </Card>
            
            <Card colour="blue" icon="fa-columns" title="Row / Column Layout">
                <p className='center'>This card demonstrates the row/column layout using flexbox.</p>
                <div className="row">
                    <div className="col">
                        <h3>Code Example</h3>
                            <pre><code>{`<div className="row">
    <div className="col">Column 1</div>
    <div className="col">Column 2</div>
</div>`}</code></pre>
                    </div>
                    <div className="col">
                        <h3>Explanation</h3>
                        <p>Use the .row and .col classes to create a flexible two-column layout. The columns will adjust their width based on the available space.</p>
                        <p>This is useful for creating responsive designs that adapt to different screen sizes.</p>
                        <p>It is possible to add additional columns by simply adding more .col divs within the .row.</p>
                    </div>
                </div>
            </Card>

            <Card colour="green" icon="fa-th-large" title="Content Cards">
                <p className='center'>This card demonstrates the content card layout.</p>
                <div className="row">
                    <div className="col">
                        <h3>Component Example</h3>
                        <pre>
                            <code>
                                {`import Card from '../components/Card';

<Card colour="purple" icon="fa-star" title="Header">
    <p>Card Content</p>
</Card>`}
                            </code>
                        </pre>
                        <h3>Code Example</h3>
                        <pre>
                            <code>
                                {`<div className="card purple">
    <div className="card-header">
        <i className="fa fa-fw fa-star"></i> Header
    </div>
    <div className="card-body">
        <p>Card Content</p>
    </div>
</div>`}
                            </code>
                        </pre>
                    </div>
                    <div className="col">
                        <h3>Component Example</h3>
                        <Card colour="purple" icon="fa-star" title="Header">
                            <p>Card Content</p>
                        </Card>
                        <h3>Code Example</h3>
                        <div className="card purple">
                            <div className="card-header"><i className="fa fa-fw fa-star purple"></i> Header</div>
                            <div className="card-body"><p>Card Content</p></div>
                        </div>
                        
                    </div>
                </div>
            </Card>
    

        </div>
    );
}

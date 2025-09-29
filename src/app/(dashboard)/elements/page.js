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
                            <div className="card-header"><i className="fa fa-fw fa-star"></i> Header</div>
                            <div className="card-body"><p>Card Content</p></div>
                        </div>
                        
                    </div>
                </div>
            </Card>


            <Card colour="purple" icon="fa-pencil " title="Form Inputs and Buttons">
                <h3 className='center'>Form Input Styles</h3>
                <div className="row">
                    <div className="col">
                        <h3>Code Example</h3>
                        <pre>
                            <code>
                                {`<form>
    <label htmlFor="textInput">Text Input:</label>
    <input type="text" id="textInput" name="textInput" placeholder="Enter text" />
    <label htmlFor="selectInput">Select Input:</label>
    <select id="selectInput" name="selectInput">
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
    </select>
    <label htmlFor="checkboxInput">Checkbox Input:</label>
    <input type="checkbox" id="checkboxInput" name="checkboxInput" />
    <button type="submit" className="btn">Submit</button>
</form>`}
                            </code>
                        </pre>
                    </div>
                    <div className="col">
                        <h3>Rendered Example</h3>
                        <form>
                            <label htmlFor="textInput">Text Input:</label>
                            <input type="text" id="textInput" name="textInput" placeholder="Enter text" />
                            <label htmlFor="selectInput">Select Input:</label>
                            <select id="selectInput" name="selectInput">
                                <option value="">Select an option</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                            </select>
                            <label htmlFor="checkboxInput">Checkbox Input:</label>
                            <input type="checkbox" id="checkboxInput" name="checkboxInput" />
                            <button type="submit" className="btn">Submit</button>
                        </form>
                    </div>
                </div>
                <hr />
                <h3 className='center'>Floating Label Inputs</h3>
                <div className='row'>
                    <div className='col'>
                        <h3>Code Example</h3>
                        <pre>
                            <code>
                                {`<form>
    <div className="form-floating">
        <input type="text" id="Username" placeholder="Username" required />
        <label htmlFor="name">Username</label>
    </div>
    <div className="form-floating">
        <textarea id="bio" placeholder="Bio" required></textarea>
        <label htmlFor="bio">Bio</label>
    </div>  
    <button type="submit" className="btn">Submit</button>
</form>`}
                            </code>
                        </pre>
                    </div>
                    <div className='col'>
                        <h3>Rendered Example</h3>
                        <form>
                            <div className="form-floating">
                                <input type="text" id="Username" placeholder="Username" required />
                                <label htmlFor="name">Username</label>
                            </div>
                            <div className="form-floating">
                                <textarea id="bio" placeholder="Bio" required></textarea>
                                <label htmlFor="bio">Bio</label>
                            </div>  
                            <button type="submit" className="btn">Submit</button>
                        </form>
                    </div>
                </div>
                <hr />
                <h3 className='center'>Button Styles.</h3>
                <div className='row'>
                    <div className='col'>
                        <h3>Code Example</h3>
                        <pre>
                            <code>
                                {`<button className="btn">Button (.btn)</button>
<button className="btn red">Button (.btn.red)</button>
<button className="btn blue">Button (.btn.blue)</button>
<button className="btn green">Button (.btn.green)</button>
<button className="btn yellow">Button (.btn.yellow)</button>
<button className="btn purple">Button (.btn.purple)</button>
<button className="btn orange">Button (.btn.orange)</button>
<button className="btn pink">Button (.btn.pink)</button>`}
                            </code>
                        </pre>
                    </div>
                    <div className='col'>
                        <h3>Rendered Example</h3>
                        <button className="btn">Button (.btn)</button>
                        <button className="btn red">Button (.btn.red)</button>
                        <button className="btn blue">Button (.btn.blue)</button>
                        <button className="btn green">Button (.btn.green)</button>
                        <button className="btn yellow">Button (.btn.yellow)</button>
                        <button className="btn purple">Button (.btn.purple)</button>
                        <button className="btn orange">Button (.btn.orange)</button>
                        <button className="btn pink">Button (.btn.pink)</button>
                    </div>
                </div>


            </Card>
        </div>
    );
}

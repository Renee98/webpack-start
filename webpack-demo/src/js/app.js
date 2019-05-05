import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/app';
import '../css/app.scss';
export default class Main extends React.Component {
    render() {
        return (
            <div>
                <App />
                <h1 className='text'>react</h1>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('app'));
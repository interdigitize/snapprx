import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as MyScriptJS from 'myscript/src/myscript';
import 'myscript/dist/myscript.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'who',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendToDoc = this.sendToDoc.bind(this);
  }

  sendToDoc(recipient, rxdata) {
    const url = `/api/todoc?recipientEmail=${recipient}&data=${rxdata}`;
    // console.error('[App.js]', url);
    this.setState({ submitted: true }, () =>
      console.log('submitted updated', this.state.submitted)
    );
    return Promise.resolve(true)
      .then(() => {
        return Promise.resolve(fetch(url));
      })
      .then(data => {
        return true;
      })
      .catch(ex => {
        this.setState({ submitted: false });
        console.error('[App.js] parsing failed', ex);
      });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    // console.log(this.editor.exports);
    // console.log(this.editor.exports['text/plain']);
    this.editor.clear();
    this.sendToDoc(this.state.value, this.editor.exports['text/plain']);
    // alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    var defaultValue;

    return (
      <div className="App">
        {this.state.submitted ? (
          <div className="notification">The RX has been sent!</div>
        ) : (
          <span />
        )}
        <header id="header">
          <div>SnappRX</div>
          <div>Florence Nightingale</div>
        </header>
        <div id="editorStyle" ref="editor" />
        <footer>
          <form onSubmit={this.handleSubmit}>
            <label>
              <span style={{ marginRight: '1rem', marginLeft: '37px' }}>
                Select Doctor:
              </span>
              <select value={this.state.value} onChange={this.handleChange}>
                <option value="frank3562@gmail.com">Dr. Franklin</option>
                <option value="tom.pruim1@gmail.com">Dr Pruim</option>
                <option value="info@aenjoy.biz">Dr Domore</option>
                <option value="sm94010@gmail.com">Dr. Who</option>
              </select>
            </label>
            <button type="submit" style={{ marginLeft: '1rem' }}>
              Submit
            </button>
          </form>
        </footer>
      </div>
    );
  }
  componentDidMount() {
    this.editor = MyScriptJS.register(this.refs.editor, {
      recognitionParams: {
        type: 'TEXT',
        protocol: 'WEBSOCKET',
        apiVersion: 'V4',
        server: {
          scheme: 'https',
          host: 'webdemoapi.myscript.com',
          applicationKey: '24795c29-a481-4fe7-9af7-96a8e2aa1bd1',
          hmacKey: '9170da98-7d01-4c83-bdad-82b03dd52875'
        }
      }
    });
    window.addEventListener('resize', () => {
      this.editor.resize();
    });
  }
}

export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as MyScriptJS from 'myscript/src/myscript'
import 'myscript/dist/myscript.min.css';

const editorStyle = {
  'minWidth': '500px',
  'minHeight': '500px',
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'who'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  sendToDoc(recipient, rxdata) {
    const self = this;
    const url = `/api/todoc?recipientEmail=${recipient}&data=${rxdata}`;
    console.error('[App.js]', url);
    return Promise.resolve(true).then(() => {
      return Promise.resolve(fetch(url));
    }).then((response) => {
      return response.json();
    }).then((data) => {
      return true;
    }).catch((ex) => {
      console.error('[App.js] parsing failed', ex);
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log(this.editor.exports);
    console.log(this.editor.exports['text/plain']);
    this.editor.clear();
    this.sendToDoc(this.state.value, this.editor.exports['text/plain']);
    // alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    var defaultValue;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Select Doctor:
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="frank3562@gmail.com">Dr. Adams</option>
              <option value="tom.pruim1@gmail.com">Dr Pruim</option>
              <option value="sm94010@gmail.com">Dr. Who</option>
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div style={editorStyle} ref="editor">

        </div>
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
          hmacKey: '9170da98-7d01-4c83-bdad-82b03dd52875',
        },
      },
    });
    window.addEventListener("resize", () => {this.editor.resize()});
  }
}

export default App;

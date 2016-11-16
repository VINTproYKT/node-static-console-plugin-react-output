# static-console-plugin-react-output
Plugin for printing your [`static-console`](https://www.npmjs.com/package/static-console) messages in more declarative way using [React](https://www.npmjs.com/package/react).

[![Gitter](https://badges.gitter.im/VINTproYKT/node-static-console.svg)](https://gitter.im/VINTproYKT/node-static-console?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Install
```
$ npm install --save static-console-plugin-react-output
```

## API
### `ReactOutput`
```javascript
const c = require('static-console');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactOutput = require('static-console-plugin-react-output');

class MyLogComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(
            'div', this.props,
            ...this.props.messages
        );
    }
}

document.addEventListener('readystatechange', () => {
    if (document.readyState == 'complete') {
        c.outputs.myLog = new ReactOutput({
            onUpdate: messages => {
                ReactDOM.render(
                    React.createElement(
                        MyLogComponent,
                        { messages: messages, id: 'log', style: { whiteSpace: 'pre-wrap' } }
                    ),
                    document.querySelector('main')
                );
            }
        });
        c.routers.std.tasks.set(c.outputs.myLog, c.models.raw);// We add task for StdRouter bundled with StaticConsole to convert messages with RawModel

        c.info(`Starting log`);
        c.reset('react', `React`);
        c.log(`Thanks for using React!`);
        c.reset();
        c.log(`Third message`);
    }
});
```
Test in any browser environment bundled with Node.js.

1. First of all, create element `main` in your DOM. This can be done in HTML.

2. This code creates instance of `ReactOutput` right after DOM is complete.

   There you need to assign function to `onUpdate`.

3. In this function you call needed rendering functions.

   Cause `ReactOutput` doesn't have access to your React markup, you call `ReactDOM.render` with react element and root node.

4. Displaying messages in react element is possible with use of `messages` property, that used in rendering of `MyLogComponent`.

5. So, there you go: log some messages.

Element `main` must contain something like:
```html
<div id="log">
    <p class="message info">Starting log</p>
    <p class="message">[React] Thanks for using React!/p>
    <p class="message">Third message</p>
</div>
```
(as seen in inspector)

### `print(model)`
`model` is the object that should have descriptive properties:
 - `type` - message type name. If it is falsy, then `ReactOutput.regularType` will be used to mark message as regular.
 - `data` - string with message. It could be converted with RawModel.

### *`onUpdate`*
This option is required to print something. It must be callable function, where first argument is messages array, that are used in rendering of log component.

`onUpdate` is called when any message is printed and on first run.

### *`messageComponent`*
`React.Component` or string with tag name that is used to create message node in DOM. Default: `'p'`;

### *`messageProps`*
Object of properties' names as keys and their values (JavaScript equivalent of attributes in DOM). String values will be parsed in such way:

 - contents in square brackets gonna be removed if message type is falsy, brackets themselves are removed,
 - `$T` will be replaced with message type name.

Default: `{ className: 'message[ $T]' }`.

### *`regularType`*
Type name that is used as fallback for falsy type (i.e. `null` value). Default: `'regular'`.
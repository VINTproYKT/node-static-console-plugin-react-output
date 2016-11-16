const Output = require('static-console/output');
const React = require('react');

module.exports = class ReactOutput extends Output {
	constructor(options) {
		super(options);

		if (this._onUpdate === undefined) this.onUpdate = messages => { };
		if (this._messageComponent === undefined) this.messageComponent = 'p';
		if (this._messageProps === undefined) this.messageProps = { className: 'message[ $T]' };
		if (this._regularType === undefined) this.regularType = 'regular';
		this.messages = [];
		this.update();
	}

	get onUpdate() { return this._onUpdate; }
	set onUpdate(val) { this._onUpdate = val; }// React.Component/string val
	get messageComponent() { return this._messageComponent; }
	set messageComponent(val) { this._messageComponent = val; }// React.Component/string val
	get messageProps() { return this._messageProps; }
	set messageProps(val) { this._messageProps = val; }// object val
	get regularType() { return this._regularType; }
	set regularType(val) { this._regularType = val; }// string val

	print(model) {
		if (!this.enabled) return;
		var type = model.type || this.regularType;
		var props = Object.assign(this.convertMessageProps(type), {
			dangerouslySetInnerHTML: { __html: model.data }
		});
		this.messages.push(React.createElement(this.messageComponent, props));
		this.update();
	}

	convertMessageProps(type) {
		var props = {};
		for (let prop in this.messageProps) {
			var value = this.messageProps[prop];
			if (typeof value == 'string') {
				value = value.replace(/\[(.*?)\]/, type ? '$1' : '')
				value = value.replace(/\$T/, type || '');
			}
			props[prop] = value;
		}
		return props;
	}

	update() {
		this.onUpdate(this.messages);
	}
}
// @ts-nocheck
import {
	Ident,
	Number,
	Delim,
	Dimension,
	Function,
	LeftParenthesis,
	RightParenthesis,
	WhiteSpace
} from 'css-tree/tokenizer';

export const name = 'ContainerFeatureRange';
export const structure = {
	name: String,
	value: ['Identifier', 'Number', 'Comparison', 'Dimension', 'QueryCSSFunction', 'Ratio', null]
};

function lookup_non_WS_type_and_value(offset, type, referenceStr) {
	let current_type;

	do {
		current_type = this.lookupType(offset++);
		if (current_type !== WhiteSpace) {
			break;
		}
	} while (current_type !== 0); // NULL -> 0

	return current_type === type ? this.lookupValue(offset - 1, referenceStr) : false;
}

export function parse() {
	const children = this.createList();
	let child = null;

	this.eat(LeftParenthesis);
	this.skipSC();

	while (!this.eof && this.tokenType !== RightParenthesis) {
		switch (this.tokenType) {
			case Number:
				if (lookup_non_WS_type_and_value.call(this, 1, Delim, '/')) {
					child = this.Ratio();
				} else {
					child = this.Number();
				}
				break;

			case Delim:
				child = this.Comparison();
				break;

			case Dimension:
				child = this.Dimension();
				break;

			case Function:
				child = this.QueryCSSFunction();
				break;

			case Ident:
				child = this.Identifier();
				break;

			default:
				this.error('Number, dimension, comparison, ratio, function, or identifier is expected');
				break;
		}

		children.push(child);

		this.skipSC();
	}

	this.eat(RightParenthesis);

	return {
		type: 'ContainerFeatureRange',
		loc: this.getLocationFromList(children),
		children
	};
}

export function generate(node) {
	this.children(node);
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps {
	className?: string
	defaultValue?: string
	placeholder?: string
	onCtrlEnter?: (val: string, ref: AutoTextarea)=>void
	keydown?: (e: React.KeyboardEvent<HTMLTextAreaElement>, ref: AutoTextarea)=>void
};
interface IState {
	value: string
};

export class AutoTextarea extends React.Component<IProps, IState> {
	private inputRef: HTMLTextAreaElement | null = null;
	constructor(props: IProps) {
		super(props);
		this.state = {
			value: this.props.defaultValue?this.props.defaultValue:""
		};
		this.keydown = this.keydown.bind(this);
		this.resize = this.resize.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	keydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if ((e.keyCode==13) && e.ctrlKey) {
			this.props.onCtrlEnter && this.props.onCtrlEnter(this.state.value, this);
		}
	}
	onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		this.setState({
			value: e.target.value
		});
		setTimeout(this.resize, 0);
	}
	resize() {
		if (!this.inputRef) {
			return;
		}
		this.inputRef.style.height = "auto";
		this.inputRef.style.height = this.inputRef.scrollHeight+2+'px';
	}
	render() {
		return <textarea placeholder={this.props.placeholder} className={this.props.className} value={this.state.value}
		onKeyDown={this.props.keydown?(e)=>{
			this.props.keydown && this.props.keydown(e, this);
			this.resize();
		}:this.keydown} onChange={this.onChange} ref={r=>this.inputRef=r}/>;
	}
}
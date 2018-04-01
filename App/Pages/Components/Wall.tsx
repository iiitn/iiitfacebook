import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Div, Button } from 'classui/Components';
import { Dropdown, DItem } from 'classui/Components/Dropdown';
import { styled } from 'classui/Emotion';
import { IWallState } from 'App/State/Reducers/WallReducer';
import { connect } from 'react-redux';
import { IRootState } from 'App/State';
import { cardStyles } from 'classui/Components/BaseComponent';

interface IProps {
	className?: string
	wallid: string
};
interface IState {};

let EWall = styled('div')`
	${cardStyles["1"]};
	background-color: white;
	padding: 15px;
	margin-top: 20px;

	> .options {
		margin-top: 10px;
	}
	> .comments {
		display: none;
		margin-top: 10px;
		//background-color: grey;
	}
`;
let Content = styled('div')`
	margin-top: 10px;
	display: inline-flex;
	padding: 0px 5px;
	width: 100%;
	//background-color: aliceblue;
	min-height: 50px;
	align-items: center;
	line-height: 1.7;
	font-size: 13px;
	overflow-wrap: break-word;
	word-wrap: break-word;
	word-break: break-all;
`;
let Head = styled('div')`
	display: flex;
	align-items: center;
	> .image {
		width: 50px;
		height: 50px;
		margin-right: 15px;
		background-color: ${p=>p.theme.colorLight};
	}
	> .details {
		flex-grow: 1;
		> .posted_by {
			font-weight: 900;
			color: ${p=>p.theme.colorDark};
			cursor: pointer;
			&:hover {
				opacity: 0.7;
			}
		}
		> .time {
			color: #a8a8a8;
			font-size: 12px;
		}
	}
`;

export class _Wall extends React.Component<IProps & IWallState, IState> {
	render() {
		return <EWall className={this.props.className}>
			<Head>
				<div className="image"></div>
				<div className="details">
					<span className="posted_by">{this.props.postedBy}</span>
					<div className="time">{this.props.postedOn}</div>
				</div>
				<Dropdown button={<i className="fa fa-angle-double-down"></i>} btnProps={{className: "flat", style: {padding: "5px 7px"}}} push="left">
					<DItem>Report Abuse</DItem>
					<DItem disable>Edit</DItem>
					<DItem>Delete</DItem>
				</Dropdown>
			</Head>
			<Content>
				{this.props.content}
			</Content>
			<div className="options">
				<Button style={{display: "inline-block"}} className="flat">Like</Button>
			</div>
			<div className="comments">Comments...</div>
		</EWall>;

	}
}

export let Wall = connect((state: IRootState, ownProps: IProps)=>{
	return state.walls[ownProps.wallid]
})(_Wall);
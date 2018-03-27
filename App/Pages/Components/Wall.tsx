import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Div, Button } from 'classui/Components';
import { Dropdown, DItem } from 'classui/Components/Dropdown';
import { styled } from 'classui/Emotion';

interface IProps {
	className?: string
};
interface IState {};

let EWall = styled('div')`
	background-color: white;
	padding: 15px;

	> .options {
		margin-top: 10px;
	}
	> .comments {
		margin-top: 10px;
		background-color: grey;
	}
`;
let Content = styled('div')`
	margin-top: 10px;
	display: flex;
	width: 100%;
	background-color: aliceblue;
	min-height: 100px;
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
		}
		> .time {
			color: #a8a8a8;
			font-size: 12px;
		}
	}
`;

export class Wall extends React.Component<IProps, IState> {
	render() {
		return <EWall className={this.props.className}>
			<Head>
				<div className="image"></div>
				<div className="details">
					<div className="posted_by">Kishore</div>
					<div className="time">Just now.</div>
				</div>
				<Dropdown button={<i className="fa fa-angle-double-down"></i>} btnProps={{className: "flat", style: {padding: "5px 7px"}}} push="left">
					<DItem>Report Abuse</DItem>
					<DItem disable>Edit</DItem>
					<DItem>Delete</DItem>
				</Dropdown>
			</Head>
			<Content>
				HeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHey.
				This is very long text.
			</Content>
			<div className="options">
				<Button style={{display: "inline-block"}} className="flat">Like</Button>
			</div>
			<div className="comments">Comments...</div>
		</EWall>;

	}
}
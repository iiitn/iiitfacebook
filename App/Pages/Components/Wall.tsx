import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Div, Button } from 'classui/Components';
import { Dropdown, DItem } from 'classui/Components/Dropdown';

interface IProps {};
interface IState {};

export class Wall extends React.Component<IProps, IState> {
	render() {
		return <Div card="1" className="component_wall" style={{margin: 10}}>
			<div className="head">
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
			</div>
			<div className="content">HeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHeyHey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude Hey Dude </div>
			<div className="options">
				<Button style={{display: "inline-block"}} className="flat">Like</Button>
			</div>
			<div className="comments">Comments...</div>
		</Div>;

	}
}
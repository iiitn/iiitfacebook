import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI, NavBar, NavbarRemain} from 'classui/';
import {Button} from 'classui/Components/';

interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <ClassUI className="classbook" fullHeight EnableRouting>
			<NavBar width={1024} logo="Class-UI" className="navbar">
				<NavbarRemain />
				<Button>Logout</Button>
			</NavBar>
		</ClassUI>
	}
}
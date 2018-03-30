import * as React from 'react';
import { Flash } from "classui/Components";

export type IPassiveAction = {
	type: "PASSIVE_MESSAGE",
	from: string
};
export let PassiveAction = (action: IPassiveAction) =>{
	switch(action.type) {
		case "PASSIVE_MESSAGE": {
			Flash.flash(()=>{
				return <div style={{
					backgroundColor: "white",
					fontSize: 30
				}}>
					From {action.from} : Hello
				</div>;
			});
		}
	}
}
import * as React from 'react';
import { Overlay } from "classui/Overlay";

export type IPassiveAction = {
	type: "PASSIVE_MESSAGE",
	from: string
};
export let PassiveAction = (action: IPassiveAction) =>{
	switch(action.type) {
		case "PASSIVE_MESSAGE": {
			Overlay.flash({
				content: <div style={{
					backgroundColor: "white",
					fontSize: 30
				}}>
					From {action.from} : Hello
				</div>
			});
		}
	}
}
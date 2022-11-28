import React, { useEffect } from "react";
import { Route, Switch } from "react-router";
import bgImg from "../src/styles/img/bg.jpg";
import { socketService } from "./services/socket.service";
import { SearchBarFilterInput } from "./Components/SearchBarFilterInput";

export function RootCmp() {
	return (
			<main className='main-app-layout'>
				<img className="bgImg" src={bgImg} alt="bgImg"/>
				<SearchBarFilterInput/>
			</main>
	);
}

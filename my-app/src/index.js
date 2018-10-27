import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './index-1.css';
import './index-2.css';
import App from './App';
import Home from "./home/home";
import Detail from "./detail/Detail";
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter,Switch,Route} from 'react-router-dom';

ReactDOM.render(
	(<BrowserRouter>
		<Switch> 
		 <Route path="/detail/:detailid" component={Detail}/>
		 <Route path="/default" component={App}/>
		 <Route path="/" component={Home}/>
		</Switch> 
	</BrowserRouter>), document.getElementById('root'))
registerServiceWorker();

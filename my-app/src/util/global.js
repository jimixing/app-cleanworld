var RequestURL="http://localhost:8080/data/";
var	BrowserURL="http://localhost:3000/";

export default{

	
	API:{
		HOME:BrowserURL,
		DETAIL:BrowserURL+"detail/",
		SEARCH:RequestURL+"search",
		SAVE:RequestURL+"node",
		DELETE:RequestURL+"node/",
		CREATE:RequestURL+"node/new",
		UDATEID:RequestURL+"node",
	}



}
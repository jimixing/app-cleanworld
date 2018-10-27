import React, { Component } from 'react';
import {Button, Input,Pagination  } from 'antd';
import axios from "axios";
import gs from "../util/global";
const Search = Input.Search;


class Home extends Component {

	constructor(){
		super();
		this.state={
			result:[],
			keyword:'',
			totalCount:0,
			pageFlag:false
		};
		this.currentpage=1;

	}
	

	search(value){
		let self=this;
		if(this.state.keyword==='' || this.state.keyword!==value){
			this.currentpage=1;
		}
		axios.get(gs.API.SEARCH+"?keyword="+value+"&currentPage="+this.currentpage)
		.then(function(res){
			let data=res.data;
			if(data.code===200){
				if(data.sum>10){
					self.setState({result:data.res,keyword:value,totalCount:data.sum,pageFlag:true});
				}
				else{
					self.setState({result:data.res,keyword:value,totalCount:data.sum,pageFlag:false});
				}
			}
			
		}).catch(function(error){


		})


	}
	onSizeChange(current, pageSize){
		this.currentpage=current;
		this.search(this.state.keyword)
	}

	createWord(){

		let key=document.getElementsByClassName('ant-input')[0].value;
		axios.get(gs.API.CREATE+"?keyword="+key+"&isAttribute=false")
		.then(function(response){
			if(response.data.code===200){
				let id=response.data.res[0].id;
				window.location.href=gs.API.DETAIL+id;
			}

		}).catch(function(error){

		})
		
		
	}
	createAttribute(){
			let key=document.getElementsByClassName('ant-input')[0].value;
			axios.get(gs.API.CREATE+"?keyword="+key+"&isAttribute=true")
			.then(function(response){
			if(response.data.code===200){
				let id=response.data.res[0].id;
				window.location.href=gs.API.DETAIL+id;
			}

		}).catch(function(error){

		})


	}

	render(){
	
		let result=this.state.result;
		let keyword=this.state.keyword;
		return (<div style={{margin:'auto', marginTop:80, width:700}}>
		<div style={{marginBottom:20}}><b>Search: </b></div>
		<div style={{display:"flex"}}>
 		<Search placeholder="输入查找关键字" enterButton="查找" size="default"
     		 onSearch={this.search.bind(this)}/>
     	<Button type="primary" style={{marginLeft:20}} onClick={this.createWord.bind(this)}>创建抽象商品 </Button>
     	<Button type="primary" style={{marginLeft:20}} onClick={this.createAttribute.bind(this)}>创建抽象属性 </Button>
     	</div>
     	<br/>
     	<div className="search-result" style={{fontSize:26}}>
     		<ul>
     			{result.map(function(item){
     				let name=item.name;
     				let id=item.id;
     				let indexVal=name.indexOf(keyword);
     				let loc=gs.API.DETAIL+id;
     				return <div style={{marginTop:8}}><li><a href={loc} style={{textDecoration:'underline'}}>{name.substring(0,indexVal)}<span style={{color:"red"}}>{keyword}</span>{name.substring(indexVal+keyword.length)}</a></li>
     				</div>
 
     			})}

     		</ul>
     	</div>
     	<div style={{display:this.state.pageFlag?"block":"none", marginTop:40}}>
			<Pagination defaultCurrent={this.currentPage} onChange={this.onSizeChange.bind(this)} total={this.state.totalCount} />
		</div>	

		</div>)


	}



}
export default Home;
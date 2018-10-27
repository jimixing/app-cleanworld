import React, { Component } from 'react';
import {Modal,Input,Button,Radio,message} from "antd";
import gs from "../util/global";
import axios from "axios";

const RadioGroup=Radio.RadioGroup;
const Search = Input.Search;

class ValueModal  extends Component{

	constructor(props){
		super(props);
		this.state={
			id:this.props.id,
			visible:this.props.visible,
			name:this.props.name,
			selectedId:null,
			keyword:"",
			result:[]

		}

	}

	componentWillReceiveProps(nextProps){
		this.state.visible=nextProps.visible;
		this.state.name=nextProps.name;
		this.state.id=nextProps.id;
		if(this.state.name){
			this.search(this.state.name);
		}
		
	}

    clickOk(){

		
		if(this.state.selectedId){
			this.props.linkUpdate(this.state.id,this.state.selectedId);
		}else{
			message.error("Select one result!");
		}
		 this.setState({selectedId:null});

    	
    }
	
	clickCancel(){
		this.props.cancel();
		// this.setState({visible:false});
	}

	search(value){
		let self=this;
		let id=this.state.id;
		axios.get(gs.API.SEARCH+"?keyword="+value+"&currentPage=1")
		.then(function(res){
			let data=res.data;
			if(data.code===200){
				var tem=[];
				for(let i=0;i<data.res.length;i++){
					if(data.res[i].id!==id||data.res[i].isLink){
						tem.push(data.res[i]);
					}
				}
				self.setState({result:tem});
			}
			
		}).catch(function(error){


		})
	}
	
	selectCheck(id,e){
		
		this.setState({selectedId:id});
	
	}
	changeValue(e){
		this.setState({name:e.target.value});
	}
	render(){
		let self=this;
		let result=this.state.result;
		let keyword=this.state.keyword;
		let selectedId=this.state.selectedId;
		return(
				<div>
					<Modal  title="Set Attribute Link" onOk={this.clickOk.bind(this)} onCancel={this.clickCancel.bind(this)} visible={this.state.visible} closable={false} style={{width:600, height:900}}>
          					<div style={{marginBottom:20}}><b>Search: </b></div>
							<div style={{display:"flex"}}>
					 		<Search placeholder="input search text" enterButton="查找" size="default" value={this.state.name} 
					 		    onChange={this.changeValue.bind(this)}	 onSearch={this.search.bind(this)}/>
					        </div>
					      <div className="search-result" style={{fontSize:26}} >
					     
				     		<ul>
				     			{result.map(function(item){
				     				let name=item.name;
				     				let id=item.id;
				     				// if(id==self.state.id){
				     				// 	return;
				     				// }
				     				let indexVal=name.indexOf(keyword);
				     				let loc=gs.API.DETAIL+id;
				     				let selected=selectedId===id;
				     				return <div style={{marginTop:8}}><li><a style={{textDecoration:'underline'}}>{name.substring(0,indexVal)}<span style={{color:"red"}}>{keyword}</span>{name.substring(indexVal+keyword.length)}</a><input type="checkbox" onClick={self.selectCheck.bind(self,id)} style={{float:"right"}} value={id} checked={selected} ></input></li>
				     				</div>
				 
				     			})}
				     		</ul>
				
				     	 </div>
					</Modal>
				</div>
			)

	}



}

export default ValueModal;

import React, { Component } from 'react';
import { Button,Input} from 'antd';
import axios from "axios";
import gs from "../util/global";

class Accessor  extends Component{

	constructor(props){
		super(props);
		this.state={
			id:this.props.id,
			categorylist:[]

		}

	}
	addAccessor(){
		let value="名字";
		let id=0;
		let list=this.state.categorylist;
		list.push({id:id,name:value});
		this.setState({categorylist:list});
	}
	saveAccessor(){
		var node={};
		node.id=this.state.id;
		var list=this.state.categorylist;
		var self=this;
		node.accessories=[];
		for(var i=0;i<list.length;i++){
			var tem={};
			tem.id=list[i].id;
			tem.name=list[i].name;
			tem.isAttribute=true;
			node.accessories.push(tem);
		}
		axios.post(gs.API.SAVE,node)
		.then(function(res){
			if(res.data.code===200){
					var children=res.data.node.accessories;
					var list=[];
					for(let i=0;i<children.length;i++){
						var tem={id:children[i].id, name:children[i].name};
						list.push(tem);
					}
					self.setState({categorylist:list});

			}

			
		}).catch(function(error){
			console.log(error);
		})
	}
	changeAccessor(item,e){
		let value=e.target.value;
		let list=this.state.categorylist;
		for(var index in list){
			if(list[index]===item){
				list[index].name=value;
				break;
			}
		}
		this.setState({categorylist:list})
	}
	deleteAccessor(item){

		let list=this.state.categorylist;
		let self=this;
		let itemid=item.id;

		if(item.id===0){
			for(var index in list){
				if(list[index].name===item.name){
					delete list[index];
					list.length--;
					break;
				}
		   }
		   this.setState({categorylist:list})
	     }else{
	     	axios.delete(gs.API.DELETE+itemid)
			.then(function(response){
				if(response.data.code===200){
	    			for(var index in list){
	    				if(list[index].id===item.id){
	    				   delete list[index];
	    				   list.length--;
	    				   break;
	    				}
	    			}
	    			self.setState({categorylist:list});
	    		}
			}).catch(function(error){


			})
	     }
		



	}
	editAccessor(item){
		if(item.id===0){
			var node={};
			node.id=this.state.id;
			var list=this.state.categorylist;
			node.accessories=[];
			node.isAttribute=true;
			for(var i=0;i<list.length;i++){
				var tem={};
				tem.id=list[i].id;
				tem.name=list[i].name;
				tem.isAttribute=true;
				node.accessories.push(tem);
			}
			
			axios.post(gs.API.SAVE,node)
			.then(function(res){
				if(res.data.code===200){
					var data=res.data.node.accessories;
					let nodeid=0;
					for(let i=0;i<data.length;i++){
						if(data[i].name===item.name){
							nodeid=data[i].id;
							break;
						}
					}
					var url=gs.API.DETAIL+nodeid;
					window.location.href=url;
				}

				
			}).catch(function(error){
				console.log(error);
			})
		}else{
			var url=gs.API.DETAIL+item.id;
			window.location.href=url;
		}
		

	}
	componentDidMount(){
		let self=this;
		let id=this.state.id;
		axios.get(gs.API.SEARCH+"/"+id)
		.then(function(response){
			if(response.data.code===200){
				let data=response.data.res;
				if(data.length>0){
					let accessor=[];
					let children=data[0].accessories;
					for(let i=0;i<children.length;i++){
						 let tem={};
						 tem.id=children[i].id;
						 tem.name=children[i].name;
						 accessor.push(tem);
					}
					self.setState({categorylist:accessor})
				}
			}
			


		}).catch(function(error){


		})


	}

	render(){
		let self=this;
		let list=this.state.categorylist;
		return (<div>
					<div style={{marginTop:50}}>
				 		<div style={{marginLeft:-40}}>
			     			<Button  onClick={this.addAccessor.bind(this)} style={{marginLeft:40}}>增加分类</Button>
			      			<Button  onClick={this.saveAccessor.bind(this)} style={{marginLeft:40}}>保存</Button>
			     		</div>
			     		{list.map(function(item){
							return (<div style={{marginTop:10}}>
									<label>分类名称：</label>
									<Input value={item.name} onChange={self.changeAccessor.bind(self,item)} style={{width:230,marginLeft:30}}></Input>
									<Button style={{marginLeft:30}} onClick={self.deleteAccessor.bind(self,item)}>删除</Button>
									<Button style={{marginLeft:30}} onClick={self.editAccessor.bind(self,item)}>编辑</Button>
								</div>)
								})
						}
			     	</div>
			    </div>
			)

	}



}

export default Accessor
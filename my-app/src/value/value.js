import React, { Component } from 'react';
import { Button,Input, message,Modal,Select} from 'antd';
import axios from "axios";
import $ from 'jquery';
// import ValueModal from "../valueModal/valueModal";
import gs from "../util/global";
	
const Option=Select.Option;

class Value  extends Component{

	constructor(props){
		super(props);
		this.state={
			id:this.props.id,
			name:"",
			parentId:null,
			valuelist:[],
			 value2List:[]//[{id:100,name:"red"},{id:124,name:"blue"},{id:136,name:"white"},{id:234,name:"yellow"},{id:456,name:"black"}]

		}

	}
	addProp(){
		let value="";
		let id=0;
		let list=this.state.valuelist;
		list.push({id:id,name:value});
		this.setState({valuelist:list});

	}

	saveProp(){
		var node={};
		node.id=this.state.id;
		var list=this.state.valuelist;
		var self=this;
		node.children=[];
		for(var i=0;i<list.length;i++){
			var tem={};
			tem.id=list[i].id;
			tem.name=list[i].name;
			tem.children=list[i].children;
			node.children.push(tem);
		}
		axios.post(gs.API.SAVE,node)
		.then(function(response){
			if(response.data.code===200){
				let data=response.data.res[0];
				let name=data.name;
				let parentId=data.parentId;
				let prop=[];
				if(data.children.length>0){
					let children=data.children;
					for(let i=0;i<children.length;i++){
						 let tem={};
						 tem.id=children[i].id;
						 tem.name=children[i].name;
						 tem.children=children[i].children;
						 prop.push(tem);
					}
				}
				message.info("Save Successful!")
				self.setState({valuelist:prop,name:name,parentId:parentId})	

			}

			
		}).catch(function(error){
			console.log(error);
		})


	}

	componentWillReceiveProps(nextProps){
		if(this.state.parentId){
			var self=this;
			let url=gs.API.SEARCH+"/"+this.state.parentId
			$.ajax({ url:url,
					type:'GET',
					async:false,
					dataType:'json',
					success:function(res){
						let data=res.res[0];
						if(data.children.length>0){
							var arr=[];
							for(let i=0;i<data.children.length;i++){
									var tem={};
									tem.id=data.children[i].id;
									tem.name=data.children[i].name;
									arr.push(tem);

							}
							self.state.value2List=arr;
						}
					},
					error:function(error){

					}
					})

		}
		

	}

	changeProp(item,e){
		let value=e.target.value;
		let list=this.state.valuelist;
		for(var index in list){
			if(list[index]===item){
				list[index].name=value;
				break;
			}
		}
		this.setState({valuelist:list})

	}
	deleteProp(item,e){

		// let list=this.state.proplist;
		// let self=this;
		
		// if(item.id===0){
		// 	for(var index in list){
		// 		if(list[index].name===item.name){
		// 			delete list[index];
		// 			break;
		// 		}
		//    }
		//    this.setState({proplist:list})
	 //     }else{
	 //    	axios.delete(gs.API.DELETE+item.id)
	 //    	.then(function(res){
	 //    		if(res.data.code===200){
	 //    			for(var index in list){
	 //    				if(list[index].id===item.id){
	 //    				   delete list[index];
	 //    				   break;
	 //    				}
	 //    			}
	 //    			self.setState({proplist:list});
	 //    		}
	 //    	}).catch(function(error){

	 //    	})
		// }
			
	}


	componentDidMount(){
		let self=this;
		let id=this.state.id;
		axios.get(gs.API.SEARCH+"/"+id)
		.then(function(response){
			if(response.data.code===200){
				let data=response.data.res[0];
				let name=data.name;
				let parentId=data.parentId;
				let prop=[];
				if(data.children.length>0){

					let children=data.children;
					for(let i=0;i<children.length;i++){
						 let tem={};
						 tem.id=children[i].id;
						 tem.name=children[i].name;
						 tem.children=children[i].children;
						 prop.push(tem);
					}
				}
				self.setState({valuelist:prop,name:name,parentId:parentId})
			}
			


		}).catch(function(error){


		})


	}
	// linkProp(){
	// 	// let parentId=this.state.parentId;
	// 	this.setState({displayModal:true})

	// }
	selectChange(item,val1,val2){
		let arr=[];
		for(let i=0;i<val1.length;i++){
			var tem={};
			tem.id=val1[i];
			arr.push(tem);
		}


		item.children=arr;

	}
	renderChild(){


		let list2=this.state.value2List;
	
		return list2.map(function(item){

			return (<Option key={item.id}> {item.name}</Option>)
		})

	}

	render(){
		let list=this.state.valuelist;
		let self=this;
		 let parentShow=this.state.parentId===null?"none":"inline";

		// let displayModal =this.state.displayModal;
		return (<div style={{marginTop:50}}>
				 <div style={{marginLeft:-40}}>
			      <Button  onClick={this.addProp.bind(this)} style={{marginLeft:40}}>增加{this.state.name}</Button>
			      <Button  onClick={this.saveProp.bind(this)} style={{marginLeft:40}}>保存</Button>
			     </div>
					
				 {list.map(function(item){
				 		let val=[];
				 		if(item.children&&item.children.length){
				 				for(let i=0;i<item.children.length;i++){
				 				val.push(item.children[i].id);
				 			}
				 		}
				 	
				 		
						return (<div style={{marginTop:10}}>
									<label>{self.state.name}名称：</label>
									<Input value={item.name} onChange={self.changeProp.bind(self,item)} style={{width:230,marginLeft:30}}></Input>
									<Button style={{marginLeft:30}} onClick={self.deleteProp.bind(self,item)}>删除</Button>
									<div style={{display:parentShow}}>
										<Select mode="multiple" placeholder="Please Select" style={{width:'50%'}}
												defaultValue={val}	onChange={self.selectChange.bind(self,item)}>
											{self.renderChild()}
										</Select>
									</div>
								</div>)
					})
				 }
				
			    </div>
			)

	}



}

export default Value
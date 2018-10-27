
import React, { Component } from 'react';
import { Button,Input,message} from 'antd';
import axios from "axios";
import gs from "../util/global";
import LinkModal from "../linkModal/linkModal";


class Accessor  extends Component{

	constructor(props){
		super(props);
		this.state={
			id:this.props.id,
			accessorlist:[],
			linkModalShow:false,
			linkId:0,
			linkname:""
		}

	}
	addAccessor(){
		let value="名字";
		let id=0;
		let list=this.state.accessorlist;
		list.push({id:id,name:value});
		this.setState({accessorlist:list});
	}
	saveAccessor(){
		var node={};
		node.id=this.state.id;
		var list=this.state.accessorlist;
		var self=this;
		node.accessories=[];
		for(var i=0;i<list.length;i++){
			var tem={};
			tem.id=list[i].id;
			tem.name=list[i].name;
			node.accessories.push(tem);
		}
		axios.post(gs.API.SAVE,node)
		.then(function(res){
			if(res.data.code===200){
					var children=res.data.node.accessories;
					var list=[];
					for(let i=0;i<children.length;i++){
						var tem={id:children[i].id, name:children[i].name,islink:children[i].isLink};
						list.push(tem);
					}
					self.setState({accessorlist:list});

			}

			
		}).catch(function(error){
			console.log(error);
		})
	}
	changeAccessor(item,e){
		let value=e.target.value;
		let list=this.state.accessorlist;
		for(var index in list){
			if(list[index]===item){
				list[index].name=value;
				break;
			}
		}
		this.setState({accessorlist:list})
	}
	deleteAccessor(item){


		let list=this.state.accessorlist;
		let self=this;
		
		if(item.id===0){
			for(var index in list){
				if(list[index].name===item.name){
					delete list[index];
					list.length--;
					break;
				}
		   }
		   this.setState({accessorlist:list})
	     }else{
	    	axios.delete(gs.API.DELETE+item.id)
	    	.then(function(res){
	    		if(res.data.code===200){
	    			for(var index in list){
	    				if(list[index].id===item.id){
	    				   delete list[index];
	    				   list.length--;
	    				   break;
	    				}
	    			}
	    			self.setState({accessorlist:list});
	    		}
	    	}).catch(function(error){

	    	})
		}
			



	}
	editAccessor(item){
		//<!--<Button style={{marginLeft:30}} onClick={self.editAccessor.bind(self,item)}>编辑</Button>-->
		if(item.id===0){
			var node={};
			node.id=this.state.id;
			var list=this.state.accessorlist;
			node.accessories=[];
			for(var i=0;i<list.length;i++){
				var tem={};
				tem.id=list[i].id;
				tem.name=list[i].name;
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
						 tem.islink=children[i].isLink;
						 accessor.push(tem);
					}
					self.setState({accessorlist:accessor})
				}
			}
			


		}).catch(function(error){


		})


	}

	linkNewId(old_id,new_id){
		let self=this;
		var data={};
		data.oldId=old_id;
		data.newId=new_id;
		data.parentId=this.state.id;
		var url=gs.API.UDATEID;
		this.setState({linkModalShow:false})
		axios.put(url,data).
		then(function(res){
			if(res.data.code===200){
					var children=res.data.node.accessories;
					var list=[];
					for(let i=0;i<children.length;i++){
						var tem={id:children[i].id, name:children[i].name,islink:children[i].isLink};
						list.push(tem);
					}
					self.setState({accessorlist:list,linkModalShow:false});

			}
		}).catch(function(err){

		})
	}

	linkProp(item){
		if(item.id===0){
			message.info("please save it first!");
			return;
		}
		this.setState({linkModalShow:true,linkId:item.id,linkname:item.name});
	}
	addLink(item){
		if(item.islink){
			var	url=gs.API.DETAIL+item.id;
			var a = document.createElement("a");
       		 a.setAttribute("href", url);
       		 a.setAttribute("id", "camnpr");
       		 document.body.appendChild(a);
      		 a.click();
		}
		console.log("--------------------");
	}
	cancelLink(){
			this.setState({linkModalShow:false});
	}

	render(){
		let self=this;
		let list=this.state.accessorlist;
		return (<div>
					<div style={{marginTop:50}}>
				 		<div style={{marginLeft:-40}}>
			     			<Button  onClick={this.addAccessor.bind(this)} style={{marginLeft:40}}>增加零部件</Button>
			      			<Button  onClick={this.saveAccessor.bind(this)} style={{marginLeft:40}}>保存</Button>
			     		</div>
			     		{list.map(function(item){
								var decorate="none";
						 		if(item.islink){
						 			decorate="underline";
						 		}

							return (<div style={{marginTop:10}}>
									<label>属性名称：</label>
									<Input value={item.name} onChange={self.changeAccessor.bind(self,item)} onClick={self.addLink.bind(self,item)} style={{width:230,marginLeft:30,textDecoration:decorate}}></Input>
									<Button style={{marginLeft:30}} onClick={self.deleteAccessor.bind(self,item)}>删除</Button>
									<Button style={{marginLeft:30}} onClick={self.linkProp.bind(self,item)}>链接</Button>

								</div>)
								})
						}
						<LinkModal id={this.state.linkId}  visible={this.state.linkModalShow} linkUpdate={this.linkNewId.bind(this)} cancel={this.cancelLink.bind(this)} name={this.state.linkname}/>

			     	</div>
			    </div>
			)

	}



}

export default Accessor
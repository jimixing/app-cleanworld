import React, { Component } from 'react';
import { Button,Input, message} from 'antd';
import axios from "axios";
import gs from "../util/global";
import LinkModal from "../linkModal/linkModal";
	

class Property  extends Component{

	constructor(props){
		super(props);
		this.state={
			id:this.props.id,
			proplist:[],
			linkModalShow:false,
			linkId:0,
			linkname:""

		}

	}
	addProp(){
		let value="名字";
		let id=0;
		let list=this.state.proplist;
		list.push({id:id,name:value});
		this.setState({proplist:list});

	}

	saveProp(){
		var node={};
		node.id=this.state.id;
		var list=this.state.proplist;
		var self=this;
		node.children=[];
		for(var i=0;i<list.length;i++){
			var tem={};
			tem.id=list[i].id;
			tem.name=list[i].name;
			node.children.push(tem);
		}
		axios.post(gs.API.SAVE,node)
		.then(function(res){
			if(res.data.code===200){
					var children=res.data.node.children;
					var list=[];
					for(let i=0;i<children.length;i++){
						var tem={id:children[i].id, name:children[i].name,islink:children[i].isLink};
						list.push(tem);
					}
					message.info("Save Successfully");
					self.setState({proplist:list});

			}

			
		}).catch(function(error){
			console.log(error);
		})


	}
	changeProp(item,e){
		let value=e.target.value;
		let list=this.state.proplist;
		for(var index in list){
			if(list[index]===item){
				list[index].name=value;
				break;
			}
		}
		this.setState({proplist:list})

	}
	deleteProp(item,e){

		let list=this.state.proplist;
		let self=this;
		
		if(item.id===0){
			for(var index in list){
				if(list[index].name===item.name){
					delete list[index];
					list.length--;
					break;
				}
		   }
		   this.setState({proplist:list})
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
	    			self.setState({proplist:list});
	    		}
	    	}).catch(function(error){

	    	})
		}
			
		
	

	}

	cancelLink(){
			this.setState({linkModalShow:false});
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
					var children=res.data.node.children;
					var list=[];
					for(let i=0;i<children.length;i++){
						var tem={id:children[i].id, name:children[i].name,islink:children[i].isLink};
						list.push(tem);
					}
					self.setState({proplist:list,linkModalShow:false});

			}
		}).catch(function(err){

		})
		
	}

	componentDidMount(){
		let self=this;
		let id=this.state.id;
		axios.get(gs.API.SEARCH+"/"+id)
		.then(function(response){
			if(response.data.code===200){
				let data=response.data.res;
				if(data.length>0){
					let prop=[];
					let children=data[0].children;
					for(let i=0;i<children.length;i++){
						 let tem={};
						 tem.id=children[i].id;
						 tem.name=children[i].name;
						 tem.islink=children[i].isLink;
						 // if(children[i].linkNode){
						 // 		 tem.linkid=children[i].linkNode.id;
						 // }
					
						 prop.push(tem);
					}
					self.setState({proplist:prop})
				}
			}
			


		}).catch(function(error){


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

	// linkLook(item){
	// 	let id=item.linkid;
	// 	let newUrl=gs.API.DETAIL+id;
	// 	window.open(newUrl);
	//	<Button style={{display:item.islink?"inline-block":"none",marginLeft:30}} onClick={self.linkLook.bind(self,item)}>查看链接</Button>
	// }

	render(){
		let list=this.state.proplist;
		let self=this;
		let linkShow=this.state.linkModalShow?"block":"none";
		return (<div style={{marginTop:50}}>
				 <div style={{marginLeft:-40}}>
			      <Button  onClick={this.addProp.bind(this)} style={{marginLeft:40}}>增加属性</Button>
			      <Button  onClick={this.saveProp.bind(this)} style={{marginLeft:40}}>保存</Button>
			     </div>
					
				 {list.map(function(item){
				 		var decorate="none";
				 		if(item.islink){
				 			decorate="underline";
				 		}
						return (<div style={{marginTop:10}}>
									<label>属性名称：</label>
									<Input value={item.name} onChange={self.changeProp.bind(self,item)}
									 onClick={self.addLink.bind(self,item)} style={{width:230,marginLeft:30,textDecoration:decorate}}></Input>
									<Button style={{marginLeft:30}} onClick={self.deleteProp.bind(self,item)}>删除</Button>
									<Button style={{marginLeft:30}} onClick={self.linkProp.bind(self,item)}>链接</Button>
								
								</div>)
					})
				}
				<LinkModal id={this.state.linkId}  visible={this.state.linkModalShow} linkUpdate={this.linkNewId.bind(this)} cancel={this.cancelLink.bind(this)}name={this.state.linkname}/>
			    </div>
			)

	}



}

export default Property
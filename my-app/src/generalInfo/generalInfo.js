import React, { Component } from 'react';
import axios from "axios";
import gs from "../util/global";
import { Button,Input,Upload,Icon,message} from 'antd';

const { TextArea } = Input;

class GeneralInfo extends Component{
	constructor(props){
		super(props)
		this.state={
			id:props.id,
			name: "",
			description:"",
			img:false,
			parentId:""

		}


	}

	componentDidMount(){
		var self=this;
		axios.get(gs.API.SEARCH+"/"+this.state.id)
		.then(function(response){
			let data=response.data;
				if(data.code===200){
					self.setState({name:data.res[0].name, description:data.res[0].description,img:data.res[0].hasImg,
					parentId:data.res[0].parentId==null?"":data.res[0].parentId})

				}
		}).catch(function(error){

		})


	}
	saveGeneral(){
		var node={};
		let self=this;
		node.id=this.state.id;
		node.name=this.state.name;
		node.description=this.state.description;
		axios.post(gs.API.SAVE,node)
		.then(function(res){
			if(res.data.code===200){
					message.info("Save Successfully");
					var name=res.data.node.name;
					var desc=res.data.node.description;
					
					self.setState({name:name,description:desc});

			}

			
		}).catch(function(error){
			console.log(error);
		})


	}


	handleUploadDone(info){
		if (info.file.status === 'done') {
			let element=document.getElementsByClassName("ant-upload-list-item ant-upload-list-item-done");
				for(let i=0;i<element.length;i++){
					element[i].style.display="none";
				}
			this.setState({img:true})
				
		}
	}
	changeName(e){
		let value=e.target.value;
		this.setState({name:value});

	}

	changeDesc(e){
		let value=e.target.value;
		this.setState({description:value});
	}

	render(){
			let uploaddata={id:this.state.id};
			var imgurl="http://localhost/"+this.state.id+".jpg";
			var returnParent=this.state.parentId===""?false:true;
			var parentLink=null;
			if(returnParent){
				parentLink=gs.API.DETAIL+this.state.parentId;
			}
			
		return(
			<div style={{marginLeft:30}}>
						<a href={gs.API.HOME}>返回首页</a>
						<div style={{display:returnParent?"block":"none"}}>
							<a href={parentLink}>返回父节点</a>
						</div>
						<h4>名字：</h4>
						<Input value={this.state.name} onChange={this.changeName.bind(this)} style={{width:220}}></Input>
						<h4 style={{marginTop:30}}>描述：</h4>
						<TextArea value={this.state.description} onChange={this.changeDesc.bind(this)}  style={{width:220,marginBottom:20}} col={2}></TextArea>
						<Button  onClick={this.saveGeneral.bind(this)} >保存</Button>
						<h4 style={{marginTop:30}}>图标：</h4>
						<div style={{marginTop:20,display:this.state.img===true?"none":"block"}}>
								    	<Upload action="http://localhost:8080/data/node/upload" listType="picture"  data={uploaddata} onChange={this.handleUploadDone.bind(this)}>
			    							<Button>
			      								<Icon type="upload" /> Click to Upload
			    							</Button>
			  							</Upload>
							    		
						</div>
						<div style={{display:this.state.img?"block":"none"}}>
			    				<img src={imgurl} alt="SVG" style={{width:220,height:140,border:"1px solid #000"}} ></img>
			    		</div>
			</div>
	

		)

	}


}	
export default GeneralInfo;




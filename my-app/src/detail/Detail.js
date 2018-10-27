import React, { Component } from 'react';
import { Menu} from 'antd';
import axios from "axios";
import Accessor from "../component/accessor";
import Property from "../property/property";
import GeneralInfo from "../generalInfo/generalInfo";
import Value from "../value/value";
import Category from "../category/category";
import gs from "../util/global";




class Detail extends Component{
	constructor(props){
		super(props)
		this.state={
			detailid:this.props.match.params.detailid,
			detailName:"",
			select:"property",
			propshow:true,
			isProduct:true,
			menu:[]
		}
	}

	componentDidMount(){
		var self=this;
		axios.get(gs.API.SEARCH+"/"+this.state.detailid)
		.then(function(response){
			let data=response.data;
				if(data.code===200){
					if(!data.res[0].isAttribute){
						self.setState({menu:['属性','零部件'],isProduct:true})
					}else{
						self.setState({menu:['详情','分类'],isProduct:false})
					}
					// self.setState({detailName:data.res[0].name})

				}
		}).catch(function(error){

		})


	}


	changeMenu(value){
		if(value.key==="property"){
			this.setState({select:value.key,propshow:true})
		}else{
			this.setState({select:value.key,propshow:false})
		}
		
	}

	render(){
		
		return (
			<div>
			<div className="page-wrapper">
				<div className="main-wrapper">
			    <div className="ant-row">
			    	<div className="main-menu ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-5 ant-col-xxl-4">
			    		<GeneralInfo id={this.state.detailid}/>
			    	</div>
			    	<div className="main-container main-container-component ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-18 ant-col-xl-19 ant-col-xxl-20">
			    		<Menu defaultSelectedKeys={this.state.select} onClick={this.changeMenu.bind(this)} mode="horizontal" >
			    			<Menu.Item key="property" style={{width:350}}>{this.state.menu[0]}</Menu.Item>
			    			<Menu.Item key="component" style={{width:350}}>{this.state.menu[1]}</Menu.Item>
			    		</Menu>
			    		<div style={{display:this.state.isProduct?"block":"none"}}>
				    		<div style={{display:this.state.propshow?"block":"none"}}>
				    			<Property id={this.state.detailid}/>
				    		</div>
				    		<div style={{display:this.state.propshow?"none":"block"}}>
				    			<Accessor id={this.state.detailid}/>
				    		</div>
			    		</div>
			    		<div style={{display:this.state.isProduct?"none":"block"}}>
				    		<div style={{display:this.state.propshow?"block":"none"}}>
				    			<Value id={this.state.detailid}/>
				    		</div>
				    		<div style={{display:this.state.propshow?"none":"block"}}>
				    			<Category id={this.state.detailid}/>
				    		</div>
			    		</div>
			    	</div>
			    </div>
			    </div>
			    </div>
			 </div>
			)
	}

}
export default Detail
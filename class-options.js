'use strict'

const Dag=require('./dag')

class ClassOptions {
	constructor(data,columns) {
		this.data=data
		this._columns=columns
		this.update()
	}
	get columns() {
		return this._columns
	}
	set columns(columns) {
		this._columns=columns
		this.update()
	}
	// private:
	update() {
		const dagData={}
		for (let id in this.data) {
			dagData[id]=this.data[id].parents
		}
		const visibleNodes={}
		for (let id of this.columns) {
			visibleNodes[id]=true
		}
		this.dag=new Dag(dagData,visibleNodes)
	}
}

module.exports=ClassOptions

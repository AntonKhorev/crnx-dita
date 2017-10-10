'use strict'

const chai=require('chai')
const expect=chai.expect
const diagramLayoutWalk=require('../diagram-layout-walk')

describe("diagramLayoutWalk",()=>{
	it("walks the only element",()=>{
		const calls=[]
		diagramLayoutWalk([
			[{node:'a'}]
		],0,0,'n',(...args)=>{calls.push(['i',...args])},(...args)=>{calls.push(['o',...args])})
		expect(calls).to.have.deep.members([['i',0,0,'n']])
	})
	/*
	it("walks 2-element chain",()=>{
		assertDiagramLayout(
			[
				[{node:'a',b:true},{}],
				[{rt:true},{bl:true}],
				[{},{node:'b',t:true}],
			],
			['a','b'],{a:{},b:{a:true}}
		)
	})
	*/
})

'use strict'

const chai=require('chai')
const expect=chai.expect
const diagramLayoutWalk=require('../diagram-layout-walk')

const getWalkCalls=(layout,x,y,inDirection='n',inCallback=()=>0,outCallback=()=>0)=>{
	const calls=[]
	diagramLayoutWalk(
		layout,x,y,inDirection,
		(...args)=>{calls.push(['i',...args]); return inCallback(...args)},
		(...args)=>{calls.push(['o',...args]); return outCallback(...args)}
	)
	return calls
}

describe("diagramLayoutWalk",()=>{
	it("walks the only element",()=>{
		const calls=getWalkCalls([
			[{node:'a'}]
		],0,0)
		expect(calls).to.have.deep.members([
			['i',0,0,'n'],
		])
	})
	it("walks 2-element chain",()=>{
		const calls=getWalkCalls([
			[{node:'a',bn:true},{}],
			[{rt:true},{bl:true}],
			[{},{node:'b',nt:true}],
		],1,2)
		expect(calls).to.have.deep.members([
			['i',1,2,'n'],
			['o',1,2,'n','t'],
			['i',1,1,'b'],
			['o',1,1,'b','l'],
			['i',0,1,'r'],
			['o',0,1,'r','t'],
			['i',0,0,'b'],
			['o',0,0,'b','n'],
			['i',0,0,'n'],
		])
	})
	it("walks 3-element fork",()=>{
	const calls=getWalkCalls([
			[{node:'a',bn:true},{},{node:'b',bn:true}],
			[{rt:true},{bl:true,br:true},{lt:true}],
			[{},{node:'c',nt:true},{}],
		],1,2)
		expect(calls).to.have.deep.members([
			['i',1,2,'n'],
			['o',1,2,'n','t'],
			['i',1,1,'b'],
			['o',1,1,'b','l'], // fork left path
			['i',0,1,'r'],
			['o',0,1,'r','t'],
			['i',0,0,'b'],
			['o',0,0,'b','n'],
			['i',0,0,'n'],
			['o',1,1,'b','r'], // fork right path
			['i',2,1,'l'],
			['o',2,1,'l','t'],
			['i',2,0,'b'],
			['o',2,0,'b','n'],
			['i',2,0,'n'],
		])
	})
	it("walks 3-element chain",()=>{
		const calls=getWalkCalls([
			[{node:'a',bn:true},{},{}],
			[{rt:true},{bl:true},{}],
			[{},{node:'b',nt:true,bn:true},{}],
			[{},{rt:true},{bl:true}],
			[{},{},{node:'c',nt:true}],
		],2,4)
		expect(calls).to.have.deep.members([
			['i',2,4,'n'],
			['o',2,4,'n','t'],
			['i',2,3,'b'],
			['o',2,3,'b','l'],
			['i',1,3,'r'],
			['o',1,3,'r','t'],
			['i',1,2,'b'],
			['o',1,2,'b','n'],
			['i',1,2,'n'],
			['o',1,2,'n','t'],
			['i',1,1,'b'],
			['o',1,1,'b','l'],
			['i',0,1,'r'],
			['o',0,1,'r','t'],
			['i',0,0,'b'],
			['o',0,0,'b','n'],
			['i',0,0,'n'],
		])
	})
	it("walks 3-element chain with break at middle node",()=>{
		const calls=getWalkCalls([
			[{node:'a',bn:true},{},{}],
			[{rt:true},{bl:true},{}],
			[{},{node:'b',nt:true,bn:true},{}],
			[{},{rt:true},{bl:true}],
			[{},{},{node:'c',nt:true}],
		],2,4,'n',(x,y,d)=>(x==1&&y==2&&d=='n'))
		expect(calls).to.have.deep.members([
			['i',2,4,'n'],
			['o',2,4,'n','t'],
			['i',2,3,'b'],
			['o',2,3,'b','l'],
			['i',1,3,'r'],
			['o',1,3,'r','t'],
			['i',1,2,'b'],
			['o',1,2,'b','n'],
			['i',1,2,'n'],
		])
	})
})

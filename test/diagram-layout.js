'use strict'

const chai=require('chai')
const expect=chai.expect
const diagramLayout=require('../diagram-layout')
const diagramLayoutWalk=require('../diagram-layout-walk')

const assertDiagramLayout=(layout,columns,parents)=>{
	expect(layout).to.be.an('array')
	const n=columns.length
	const visitedNodes=[]
	const nodeHeights={}
	layout.forEach((row,iRow)=>{
		expect(row).to.be.an('array').with.lengthOf(n)
		row.forEach((cell,iColumn)=>{
			expect(cell).to.be.an('object')
			if (cell.node!=undefined) {
				expect(cell.node).to.equal(columns[iColumn])
				visitedNodes.push(cell.node)
				nodeHeights[cell.node]=iRow
			}
			if (cell.lr || cell.br || cell.lt) {
				expect(cell).not.to.have.any.keys('rl','bl','rt')
			}
			if (cell.rl || cell.bl || cell.rt) {
				expect(cell).not.to.have.any.keys('lr','br','lt')
			}
		})
	})
	expect(visitedNodes).to.have.members(columns,"expected to find the same nodes as in columns arg")
	columns.forEach((node,x)=>{
		const nodeParents=[]
		diagramLayoutWalk(layout,x,nodeHeights[node],'n',(x,y,d)=>{
			if (d=='n') {
				expect(layout[y][x].node).to.not.be.undefined
				if (layout[y][x].node!=node) {
					nodeParents.push(layout[y][x].node)
					return true
				}
			}
		})
		expect(nodeParents).to.have.members(Object.keys(parents[node]))
	})
}

const testDiagramLayout=(columns,parents)=>{
	const layout=diagramLayout(columns,parents)
	assertDiagramLayout(layout,columns,parents)
}

describe("assertDiagramLayout",()=>{
	it("validates correct path finding",()=>{
		assertDiagramLayout([
			[{node:'a',bn:true},{}],
			[{rt:true},{bl:true}],
			[{},{node:'b',nt:true}],
		],['a','b'],{a:{},b:{a:true}})
	})
	it("validates incorrect path finding",()=>{
		expect(()=>assertDiagramLayout([
			[{node:'a'},{node:'b'}],
		],['a','b'],{a:{},b:{a:true}})).to.throw()
	})
})

describe("diagramLayout",()=>{
	it("makes layout for 1 node",()=>{
		testDiagramLayout(['a'],{a:{}})
	})
	it("makes layout for diamond",()=>{
		testDiagramLayout(['b','a','d','c'],{a:{},b:{a:true},c:{a:true},d:{b:true,c:true}})
	})
})

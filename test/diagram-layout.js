'use strict'

const chai=require('chai')
const expect=chai.expect
const makeDiagramLayout=require('../diagram-layout')

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
		const nodeParents={}
		let y=nodeHeights[node]
		if (layout[y][x].t) {
			const rec=(y,x)=>{
				expect(y).to.be.at.least(0)
				expect(layout[y][x].to.have.any.keys('b','bl','br','bt'))
				if (layout[y][x].b) {
					expect(layout[y][x]).to.have.keys('node')
					nodeParents[layout[y][x].node]=true
				}
				if (layout[y][x].bl) {
					let x1=x
					do {
						x1--
						expect(x1).to.be.at.least(0)
						expect(layout[y][x1]).to.have.any.keys('lr','lt')
						if (layout[y][x1].lt) rec(y-1,x1)
					} while (layout[y][x1].lr)
				}
				if (layout[y][x].br) {
					let x1=x
					do {
						x1++
						expect(x1).to.be.below(n)
						expect(layout[y][x1]).to.have.any.keys('rl','rt')
						if (layout[y][x1].rt) rec(y-1,x1)
					} while (layout[y][x1].rl)
				}
				if (layout[y][x].bt) {
					rec(y-1,x)
				}
			}
			rec(y-1,x)
		}
		expect(nodeParents).to.have.keys(parents[node])
	})
}

const testDiagramLayout=(columns,parents)=>{
	const layout=makeDiagramLayout(columns,parents)
	assertDiagramLayout(layout,columns,parents)
}

describe("assertDiagramLayout",()=>{
	it("validates correct path finding",()=>{
		assertDiagramLayout(
			[
				[{node:'a',b:true},{}],
				[{rt:true},{bl:true}],
				[{},{node:'b',t:true}],
			],
			['a','b'],{a:{},b:{a:true}}
		)
	})
})

describe("makeDiagramLayout",()=>{
	it("makes layout for 1 node",()=>{
		testDiagramLayout(['a'],{a:{}})
	})
	it("makes layout for diamond",()=>{
		testDiagramLayout(['b','a','d','c'],{a:{},b:{a:true},c:{a:true},d:{b:true,c:true}})
	})
})

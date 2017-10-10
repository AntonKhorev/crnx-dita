'use strict'

const nd={b:'t',t:'b',l:'r',r:'l',n:'n'}
const dx={b:0,t:0,l:-1,r:+1,n:0}
const dy={b:+1,t:-1,l:0,r:0,n:0}

// layout as returned by diagram-layout.js
// int x,y
// inDirection {'n','b','l','r'}
// inCallback(x,y,inDirection) -> true to stop
// outCallback(x,y,inDirection,outDirection) -> true to stop
const diagramLayoutWalk=(layout,x,y,inDirection,inCallback=()=>0,outCallback=()=>0)=>{
	const visited=layout.map(row=>row.map(cell=>({})))
	const rec=(x,y,id)=>{
		if (layout[y][x][id]) return
		layout[y][x][id]=true
		if (inCallback(x,y,id)) return
		for (let od in nd) {
			if (
				od!=id &&
				layout[y][x][id+od] &&
				!outCallback(x,y,id,od)
			) {
				const x1=x+dx[od]
				const y1=y+dy[od]
				if (
					x1>=0 && x1<layout[y].length &&
					y1>=0 && y1<layout.length
				) {
					rec(x1,y1,nd[od])
				}
			}
		}
	}
	rec(x,y,inDirection)
}

module.exports=diagramLayoutWalk

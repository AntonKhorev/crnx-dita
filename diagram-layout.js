'use strict'

module.exports=(columns,parents)=>{
	const computeDepthNodes=()=>{
		const depthNodes=[]
		const nodeDepths={}
		const rec=(node)=>{
			const setDepth=depth=>{
				nodeDepths[node]=depth
				if (!depthNodes[depth]) depthNodes[depth]={}
				depthNodes[depth][node]=true
				return depth
			}
			if (node in nodeDepths) {
				return nodeDepths[node]
			}
			const parentList=Object.keys(parents[node]) // not doing this b/c want them in columns order
			//const parentList=columns.filter(parentNode=>parents[node][parentNode])
			if (parentList.length==0) {
				return setDepth(0)
			}
			return setDepth(1+Math.max(...parentList.map(parentNode=>rec(parentNode))))
		}
		columns.forEach((node)=>{
			rec(node)
		})
		return depthNodes
	}
	const computeNodeColumns=()=>{
		const nodeColumns={}
		columns.forEach((node,x)=>{
			nodeColumns[node]=x
		})
		return nodeColumns
	}
	const depthNodes=computeDepthNodes()
	const nodeColumns=computeNodeColumns()
	const layout=[]
	for (let layer of depthNodes) {
		//const layerArcRows=[] // TODO
		columns.forEach((childNode,childX)=>{
			if (!layer[childNode]) return
			let minParentX=columns.length
			let maxParentX=-1
			columns.forEach((parentNode,parentX)=>{
				if (parents[childNode][parentNode]) {
					if (minParentX>=columns.length) {
						minParentX=parentX
					}
					maxParentX=parentX
				}
			})
			if (maxParentX>=0) { // has parents
				const arcRow=columns.map((parentNode,x)=>{
					const cell={}
					if (parents[childNode][parentNode]) {
						if (x<childX) cell.rt=true
						if (x>childX) cell.lt=true
					}
					if (childX<minParentX) {
						if (x==childX) cell.br=true
						if (x>childX && x<maxParentX) cell.lr=true
					}
					if (childX>minParentX && childX<maxParentX) {
						if (x<childX && x>minParentX) cell.rl=true
						if (x==childX) { cell.bl=true; cell.br=true }
						if (x>childX && x<maxParentX) cell.lr=true
					}
					if (childX>maxParentX) {
						if (x<childX && x>minParentX) cell.rl=true
						if (x==childX) cell.bl=true
					}
					return cell
				})
				//layerArcRows.push(arcRow)
				layout.push(arcRow)
			}
		})
		layout.push(columns.map(node=>{
			if (layer[node]) {
				return {node}
			} else {
				return {}
			}
		}))
	}
	return layout
}

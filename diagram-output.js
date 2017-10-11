'use strict'

const diagramLayout=require('./diagram-layout')

class DiagramOutput {
	constructor(options) {
		const $output=$("<thead>")
		const update=()=>{
			const layout=diagramLayout(options.columns,options.dag.visibleParents)
			$output.empty().append(
				$("<tr>").append(
					options.columns.map((classId,i)=>$("<th>").append(
						$("<button>←</button>").click(function(){
							if (i<=0) return
							options.columns=options.columns.map((classId,j)=>(j!=i&&j!=i-1?classId:options.columns[i-(i==j)]))
							update()
						})
						," ",
						$("<button>delete</button>").click(function(){
							options.columns=options.columns.filter((classId,j)=>i!=j)
							update()
						})
						," ",
						$("<button>→</button>").click(function(){
							if (i>=options.columns.length-1) return
							options.columns=options.columns.map((classId,j)=>(j!=i&&j!=i+1?classId:options.columns[i+(i==j)]))
							update()
						})
					))
				),
				layout.map(row=>$("<tr>").addClass(
					row.some(cell=>cell.node!==undefined) ? 'nodes' : 'arcs'
				).append(
					row.map(cell=>{
						const $cell=$("<th>")
						if (cell.node!==undefined) {
							const classId=cell.node
							$cell.append(options.data[classId].name)
						}
						//$cell.append(JSON.stringify(cell))
						let $arcs
						for (let arc of ['bt','bl','br','lr','lt','rl','rt']) {
							if (cell[arc]) {
								if ($arcs===undefined) $arcs=$("<span class=arcs>")
								//$arcs.append(`<span class=${arc}>${arc}</span>`)
								$arcs.append(`<span class='arc ${arc}'>`)
							}
						}
						if ($arcs!==undefined) {
							$cell.append($arcs)
						}
						return $cell
					})
				))
			)
		}
		update()
		this.$output=$output
	}
}

module.exports=DiagramOutput

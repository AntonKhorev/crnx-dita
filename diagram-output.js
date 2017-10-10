'use strict'

const makeDiagramLayout=require('./diagram-layout')

class DiagramOutput {
	constructor(options) {
		const $output=$("<thead>")
		const update=()=>{
			const layout=makeDiagramLayout(options.columns,options.dag.visibleParents)
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
				options.dag.visibleDepthNodes.map(classIdSet=>$("<tr>").append(
					options.columns.map(classId=>classIdSet[classId]?`<th>${options.data[classId].name}</th>`:`<th></th>`)
				))
			)
		}
		update()
		this.$output=$output
	}
}

module.exports=DiagramOutput

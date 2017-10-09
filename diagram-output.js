'use strict'

class DiagramOutput {
	constructor(options) {
		const $output=$("<thead>")
		const update=()=>{
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
				$("<tr>").append(
					options.columns.map(classId=>`<th>${options.data[classId].name}</th>`)
				)
			)
		}
		update()
		this.$output=$output
	}
}

module.exports=DiagramOutput

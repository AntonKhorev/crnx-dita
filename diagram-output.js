'use strict'

class DiagramOutput {
	constructor(options) {
		const $output=$("<thead>")
		const update=()=>{
			$output.empty().append(
				$("<tr>").append(
					options.columns.map((classId,i)=>$("<th>").append(
						$("<button>delete</button>").click(function(){
							options.columns=options.columns.filter((classId,j)=>i!=j)
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

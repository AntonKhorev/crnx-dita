'use strict'

class DiagramOutput {
	constructor(options) {
		this.$output=$("<thead><tr><th>TODO</th></tr></thead>")
		this.$output=$("<thead>").append(
			$("<tr>").append(
				options.columns.map(classId=>`<th>${options.data[classId].name}</th>`)
			)
		)
	}
}

module.exports=DiagramOutput

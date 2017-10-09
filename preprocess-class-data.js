'use strict'

module.exports=rawClassData=>{
	const classData={}
	for (let classId in rawClassData) {
		const rawEntry=rawClassData[classId]
		const entry={}
		entry.parents={}
		if (typeof rawEntry.parents == 'string') {
			for (let parentId of rawEntry.parents.split(',')) {
				entry.parents[parentId]=true
			}
		}
		entry.name=classId.replace('_',' ')
		classData[classId]=entry
	}
	return classData
}

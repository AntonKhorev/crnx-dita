'use strict'

module.exports=rawClassData=>{
	const classData={}
	for (let classId in rawClassData) {
		const rawEntry=rawClassData[classId]
		const entry={}
		entry.name=classId.replace('_',' ')
		classData[classId]=entry
	}
	return classData
}

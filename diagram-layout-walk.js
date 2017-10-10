'use strict'

// layout as returned by diagram-layout.js
// int x,y
// inDirection {'n','b','l','r'}
// inCallback(x,y,inDirection) -> true to stop
// outCallback(x,y,inDirection,outDirection) -> true to stop
const diagramLayoutWalk=(layout,x,y,inDirection,inCallback=()=>0,outCallback=()=>0)=>{
	if (inCallback(x,y,inDirection)) return
}

module.exports=diagramLayoutWalk

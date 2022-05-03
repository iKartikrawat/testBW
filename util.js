module.exports={
     ifNull:(val,defVal)=>(val===null)?defVal:val,
     ifUndef:(val,defVal)=>(val===undefined)?defVal:val,
     ifNullOrUndef:(val,defVal)=>(val===null||val===undefined)?defVal:val  
};
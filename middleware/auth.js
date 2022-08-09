const jwt=require('jsonwebtoken');
const authenticate = (req,res,next)=>{
    const token = req.headers.authorization;
    if(token==null){
        return res.sendStatus(401)
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,id)=>{
        if(err) return res.sendStatus(403)
        req.id=id;
        next()
    })
}
module.exports=authenticate

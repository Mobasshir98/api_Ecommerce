const mongoose=require("mongoose");
const customerinfo=require("../models/CustomerTable")
const isvalid=async (Email)=>{
    const customer = await customerinfo.findOne({Email:Email});
    return customer==null;
}

module.exports=isvalid
const mongoose=require("mongoose");

const customer_table = new mongoose.Schema({
    Customer_id:{type:String,required:true},
    Customer_name:{type:String,required:true},
    Email: {type:String,required:true},
})

const customer_table_model = mongoose.model("Customer_table", customer_table);
module.exports=customer_table_model;
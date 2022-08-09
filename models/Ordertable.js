const mongoose=require("mongoose");

const Order_table = new mongoose.Schema({
    Customer_id:{type:String,required:true},
    Inventory_id:{type:String,required:true},
    Item_name: {type:String,required:true},
    Quantity:{type:Number,required:true}
})

const order_table_model = mongoose.model("Order_table", Order_table);
module.exports=order_table_model;
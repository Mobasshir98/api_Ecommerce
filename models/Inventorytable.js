const mongoose=require("mongoose");

const inventory_table = new mongoose.Schema({
    Inventory_id:{type:String,required:true},
    Inventory_type:{type:String,required:true},
    Item_name: {type:String,required:true},
    Available_quantity:{type:Number,required:true}
})

const inventory_table_model = mongoose.model("Inventory_table", inventory_table);
module.exports=inventory_table_model;
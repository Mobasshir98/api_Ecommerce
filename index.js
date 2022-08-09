require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const customerinfo = require("./models/CustomerTable");
const inventoryinfo = require("./models/Inventorytable");
const orderinfo = require("./models/Ordertable");
const isvalid = require("./utility/isvalid");
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth")
const inventoryroutes = require('./inventoryroutes/routes')
const path = require("path")


mongoose
  .connect("mongodb://localhost/api_web_tech_assignment")
  .then(() => console.log("Connected to DB"));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use("/inventory", inventoryroutes)
app.post("/inventory", (req, res) => {
  const { Inventory_id, Inventory_type, Item_name, Available_quantity } =
    req.body;
  inventoryinfo
    .create({
      Inventory_id,
      Inventory_type,
      Item_name,
      Available_quantity,
    })
    .then(() => res.status(200).send("Inventory Updated"))
    .catch(() =>
      res.status(400).send("An error Occured While Updating the Inventory")
    );
});


app.post("/customer",async (req,res)=>{
    try{
        const {Customer_id,Customer_name,Email}=req.body;
        if(await isvalid(Email)){

            const registercustomer=  new customerinfo({
                Customer_id,Customer_name,Email
            })
            const registered=await registercustomer.save();
            res.status(200).send(registered)
        }
        else{
            res.status(400).send("Email Already exists")
        }
    }
    catch{
        res.status(400).send("Some error occured while registering")
    }
})
app.get("/customer", (req, res) => {
    customerinfo.find({}, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        res.render("customer", { database: docs });
      }
    });
  });
app.post("/login",async (req,res)=>{
    try{
        const {Email}=req.body;
        const user = await customerinfo.findOne({Email});
        if(user){
                const token=jwt.sign({ Customer_id: user.Customer_id }, process.env.SECRET_KEY);
                res.status(200).send({authtoken:token})
        }
        else{
            res.status(200).send("Invalid Login Details")
        }
    }
    catch{
        res.status(400).send("Some error occured while logging")
    }
})

app.post ("/order",auth, async (req,res)=>{
    const Customer_id = req.id.Customer_id;
    console.log(Customer_id)
    const {Item_name,Quantity}=req.body;
    const item= await inventoryinfo.findOne({Item_name});
    console.log(item)
    if(item){
        if(item.Available_quantity<Quantity){
            res.status(200).send("Out Of Stock")
        }
        else{
            let available=item.Available_quantity-Quantity
            console.log(available)
            inventoryinfo.findOneAndUpdate({Item_name:Item_name},{Available_quantity:available}).then(()=>{
                console.log("inventory Updated")
            });
            orderinfo.create({
                Customer_id,Inventory_id:item.Inventory_id,Item_name,Quantity
            }).then(()=>{
                res.status(200).send("order Placed successfully")
            })
        }

    }
    else{
        res.status(400).send("Their is no such item with this name")
    }
})
app.get("/order", (req, res) => {
    orderinfo.find({}, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        res.render("order", { database: docs });
      }
    });
  });

app.get("/", (req, res) => {
  res.send("Backend");
});

app.listen(5000, () => {
  console.log("Server is Running");
});

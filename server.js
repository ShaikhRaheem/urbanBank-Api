const express=require("express") //1
const cors=require("cors")   
const mongoose=require("mongoose")
const acctypesModel=require("./model/acctypesModel")
const branchesModel=require("./model/branchesModel")
const navsmodel=require("./model/navsmodels")
const cardsModel=require("./model/cardsModel")
const loansModel=require("./model/loansModel")
const fundsModel=require("./model/fundsModel")
const benificiaryModel=require("./model/benificiaryModel")
const userModel=require("./model/userModel")  
const registerModel=require("./model/registerModel")
const transModel=require("./model/transModel")
const jwt=require("jsonwebtoken")


const {json}=require("express")



const app=express()
app.use(cors())
app.use(express.json())
const appsecrateid="urbanbank505511"

mongoose.connect("mongodb://127.0.0.1:27017/urbanbankdb")
.then(()=>{
    console.log("MongoDB is connected sucessfully")
})

app.get("/",(req,res)=>{
    res.send("Welcome to Urban Bank!")
})

app.get("/bu",(req,res)=>{
    res.send("This is Banking Unit...")
})

app.get("/acctype",async(req,res)=>{
    const result=await acctypesModel.find({})
    res.json(result)
})

app.post("/addacctype",async(req,res)=>{
    const newAccType= new acctypesModel(req.body)
    await newAccType.save()
    res.json("Successfully Added Account Type")
})

app.get("/branches",async(req,res)=>{
 const result=await branchesModel.find({})
 res.json(result)
})

app.post("/addbranch",async(req,res)=>{
    const newBranch= new branchesModel({...req.body,isActive:true})
    await newBranch.save();
    res.json("Successfully Added a Branch")
})

app.post("/branches",(req,res)=>{
    const newBranch=new branchesModel(req.body)
    newBranch.save()
    res.json("data Add Successfully")

})

app.get("/navs",async(req,res)=>{
    const result=await navsmodel.find({isActive:true})
    res.json(result)
})

// app.post("/addnavs",async(req,res)=>{
//     const newNav=new navsmodel(req.body)
//     await newNav.save()
//     res.json()
// })

// app.post("/addnavs",async(req,res)=>{
//    const newNav=new navsmodel.find(req.body) 
//    await newNav.save()
//    res.json("") 
// })
app.get("/cards",async(req,res)=>{
    const result= await cardsModel.find({})
    res.json(result)
})

app.get("/loans",async(req,res)=>{
    const result=await loansModel.find({})
    res.json(result)
})

app.get("/funds",async(req,res)=>{
    const result=await fundsModel.find({})
    res.json(result)
})

app.get("/benificiaries",async(req,res)=>{
    const result=await benificiaryModel.find({})
    res.json(result)
})

app.post("/addbenificiary",async(req,res)=>{
    const newBeni = new benificiaryModel(req.body)
       await   newBeni.save();
          res.json()
})

app.post("/addnavs",async(req,res)=>{
    const newNav= new navsmodel(req.body)
    await newNav.save()
    res.json()
})

app.post("/addcard",async(req,res)=>{
    const newCard= new cardsModel(req.body)
    await newCard.save();
    res.json("Card is addedd successfully !!!")
})

app.post("/addloans",async(req,res)=>{
    const newLoan=new loansModel(req.body)
    await newLoan.save();
    res.json()
});

app.post("/adduser",async(req,res)=>{
    const newUser=new userModel({...req.body,isActive:true})
    await newUser.save();
    res.json(`Congratulation ,${req.body.fname}${req.body.lname} for Registration`)
})
app.post("/login",async(req,res)=>{
const result=await userModel.find(req.body);
if(result.length>0){
    const {username,contact,email,fname,lname,accno}=result[0];
    const payload={fname,lname,username,contact,email,accno};
    const token=jwt.sign(payload,appsecrateid)
    res.json(token)
    // delete result.password;
    // res.json(result);
}else{
    res.status(401).json("Invalid user please check username or Password")
}
});

app.post("/register",async(req,res)=>{
    const newRegister=new registerModel({...req.body,isActive:true})
    await newRegister.save()
    res.json(`congratulation ,${req.body.fullname} for Registration`)
})


app.post("/addtrans",async(req,res)=>{
    const transdate= Date.now();
    const payload={...req.body,transdate}
    const newTrans=new transModel(payload)
    await newTrans.save()
    res.json("Transaction Added successfully")
})

// app.post("/debits",async(req,res)=>{
//     const payload= {...req.body("trans")}
//     const newdebit=new transModel(payload)
//     newdebit.save()
//      res.json("transaction complete")
// })

app.post("/alldebits",async(req,res)=>{
    const payload={...req.body,transtype:"Dr"}
    const result=await transModel.find(payload)
    const allamount=result.map(item=>item.amount);
    const totamount=allamount.reduce((acc,curr)=>acc+curr)
    res.json(totamount)
})

app.post("/allcredits",async(req,res)=>{
    const payload={...req.body,transtype:"Cr"}
    const result=await transModel.find(payload)
    const allamount= result.map(item=>item.amount)
    const totamount=allamount.reduce((acc,curr)=>acc+curr)
    res.json(totamount)
})



app.post("/balance",async(req,res)=>{
    const payload={...req.body}
    const result=await transModel.find(payload)
    const alldebits=result.filter(item=>item.transtype==="Dr").map(item=>item.amount).reduce((acc,curr)=>acc+curr)
    const allcredits=result.filter(item=>item.transtype==="Cr").map(item=>item.amount).reduce((acc,curr)=>acc+curr)
    const balance=allcredits-alldebits
    res.json(balance)
})

app.post("/alltrans",async(req,res)=>{
    const result=await transModel.find(req.body);
    res.json(result)

})

app.post("/lasttrans",async(req,res)=>{
    const last =await transModel.find(req.body)
    const lasttrans=last[last.length-1]
    res.json(lasttrans)
})

app.listen(2525,()=>{
console.log("Service is Running on PORT: 2525.....")
})
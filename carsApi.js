let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
 
  next();
});
var port = process.env.PORT || 2410
app.listen(port ,() => console.log(`Node app Listening on port ${port}!`))

let {carMaster, cars} = require("./carsData")


app.get("/cars/test" ,function(req,res){
    res.send("Test Data cars")
})

app.get("/cars" , function(req, res) {
    console.log("Get /cars", req.query);
    let fuel = req.query.fuel
    let type = req.query.type
    let maxprice = req.query.maxprice
    let minprice = req.query.minprice
    let sort = req.query.sort
    let arr1 = cars
    if(fuel)
      arr1 = arr1.filter(c => carMaster.find(mCar => mCar.model === c.model && mCar.fuel === fuel));
    if(type)
      arr1 = arr1.filter(c => carMaster.find(mCar => mCar.model === c.model && mCar.type === type));
    if(minprice)
      arr1 = arr1.filter(c => c.price >= minprice )
    if(maxprice)
      arr1 = arr1.filter(c => c.price <= maxprice )
    if(sort==="kms")
      arr1.sort((c1,c2) =>c1.kms - c2.kms)
    if(sort==="price")
      arr1.sort((c1,c2) =>c1.price - c2.price)
    if(sort==="year")
      arr1.sort((c1,c2) =>c1.year - c2.year)
    res.send(arr1)
})
app.get("/carMaster" , function(req, res) {
    res.send(carMaster)
})

app.get("/cars/:id", function(req,res) {
  let id = req.params.id
  let car = cars.find((s) => s.id=== id)
  if(car)
      res.send(car)
  else
      res.status(404).send("No car Found")
})

app.post("/cars", function(req,res){
  let body = req.body
  let newCar = {...body}
  cars.push(newCar)
  res.send(newCar)

})

app.put("/cars/:id", function(req,res) {
  let id = req.params.id;
  let body = req.body;
  let index = cars.findIndex((c) => c.id === id)
  if(index >= 0)
  {
      let updateCar = {id : id , ...body};
      cars[index] = updateCar;
      res.send(updateCar)
  }
  else
  {
      res.status(404).send("Car not Found")
  }
})



app.delete("/cars/:id" , function(req,res){
  let id = req.params.id
  let index = cars.findIndex((c) => c.id === id)
  if (index >= 0) {
    let deletedCar = cars.splice(index, 1)[0];
    res.send(deletedCar);
  } 
})


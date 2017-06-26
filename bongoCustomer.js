var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "x",
    database: "bongo"
});
var id;
var productName;
var updateValue;
var purchaseQuant;
var order;

 function x(){ connection.query("SELECT stock_quantity FROM products WHERE item_id = " + id +";", function(err, res){
      if (err) throw err;
      purchaseQuant = parseFloat(res[0].stock_quantity);
      //console.log(typeof purchaseQuant, purchaseQuant); 
      });

 };
connection.connect(function(err) {//initial DB  connection
  if (err) throw err;
  console.log("connected as id " + connection.threadId);







  connection.query("SELECT * FROM products",

    function(err, res) {
      if (err) throw err;
          orderProduct(res);//THIS is what's defined below - I pass the res from the connection into it to get it going.

      //console.log(res);

});//end init DB connect


// order("SELECT * FROM PRODUCTS");
//   connection.query(cmd, function(err, res) {

    
//     if (err) throw err;
//     console.log(res);

//     // connection always stays within the query function
//     //connection.destroy();




//       });

});


function orderProduct(res){

 inquirer.prompt([
    {
      name:"item",
      type:"rawlist",
      choices: function() {
        var choiceArr = [];
        for (var i = 0; i < res.length; i++) {
          choiceArr.push(res[i].product_name);
        }
        return choiceArr;
      },
      message:"Purchase Something?"
    }
  ]).then(function(answers){
    //console.log(res.product_name, res.stock_quantity);
    productName = answers.item;
    connection.query("SELECT item_id FROM products WHERE product_name = ?", productName, function(err, res) {
      //console.log(res[0].item_id);
      id = res[0].item_id;
    if (err) throw err;
    }); 
     setTimeout(x,25);//This will break at 2ms(yes I tested it), I gave 25ms for good measure.
    

    inquirer.prompt([
      {
        name: "number",
        type: "input",
        message:"\nHow many " + answers.item + "s would you like?"
      }]).then(function(answers){
       // connection.query("UPDATE products SET ? WHERE ?"), [{}]
       var orderQuant = parseFloat(answers.number); 

       if (purchaseQuant > orderQuant){
       //console.log(purchaseQuant - order);
       connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = '?'", [purchaseQuant-answers.number, id], function(err,res){
        if (err) throw err;
        

       });
     }//end if (stock > order)
     else if (purchaseQuant == orderQuant){ connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = '?'", [purchaseQuant-answers.number, id], function(err,res){
        if (err) throw err;
        console.log("Congratulations! You got the last " + productName + "(s) in our inventory!");

       });
     }  
     else {console.log("Sorry that order exceeds our stock. We can currently only support an order size of " + purchaseQuant + " " + productName +"s");

     };
      connection.query("SELECT stock_quantity from products where item_id = ?", id, function(err,res){console.log(res);})
       connection.query("SELECT price FROM products WHERE item_id = ?", id, function(err,res){
        var priceA = parseFloat(res[0].price);
        order = parseFloat(orderQuant);
        console.log((priceA*order));

       console.log("Grand Total for your order will be $" + (priceA*order));
      connection.end();
      })//end price query
      });//end update stockQuantity
     
    });//end query

}

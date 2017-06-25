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
      console.log(res[0].item_id);
      id = res[0].item_id;
    if (err) throw err;
    }); 
    function x(){ connection.query("SELECT stock_quantity FROM products WHERE item_id = " + id +";", function(err, res){
      purchaseQuant = parseFloat(res[0].stock_quantity);
      console.log(purchaseQuant); 
    });
    }
    setTimeout(x,25);//This will break at 2ms(yes I tested it), I gave 25ms for good measure.
    inquirer.prompt([
      {
        name: "number",
        type: "input",
        message:"How many " + answers.item + "s would you like?"
      }]).then(function(answers){
       // connection.query("UPDATE products SET ? WHERE ?"), [{}]
       console.log(purchaseQuant - parseFloat(answers.number));
       connection.query("UPDATE stock_quantity FROM products WHERE item_id = " + id + ";",function(err,res){
        if (err) throw err;
        console.log(res);
       });
       // console.log()
      
//       connection.query("UPDATE products SET stock_quantity = " + updateValue + " WHERE = "+ id + ";", function(err, res){ connection.query("UPDATE products SET stock_quantity = " + updateValue + " WHERE = " + id + ";", function(err, res){
//         if (err) throw err;
// })
//        });//end prompt for quantity
      });

    //end query

      });//end query

}

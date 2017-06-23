var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bongo"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  connection.query("SELECT * FROM products",

    function(err, res) {
      if (err) throw err;

      console.log(res);
          order(res);
});


// order("SELECT * FROM PRODUCTS");
//   connection.query(cmd, function(err, res) {

    
//     if (err) throw err;
//     console.log(res);

//     // connection always stays within the query function
//     //connection.destroy();




//       });

});


function order(res){
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
      message:"What would you like to buy?"
    }
  ]).then(function(answers){
    var query = "SELECT * FROM products '" + answers.item + "'";
    connection.query(query, function(err, res) {
    if (err) throw err;
    console.log(res);
    console.log("maybe")
    });//end query

      });//end query
 
}

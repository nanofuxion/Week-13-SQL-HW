require("dotenv").config(); 

var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table2');


var connection = require('./config');
connection.connect(function (err) {
    if (err) throw err;
    showProds();
});


function showProds() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log('\nItem ID: ' + res[i].id + " <|> " + 'Product: ' + 
            res[i].product + " <|> " + 'Department: ' + res[i].department +
            " <|> " + 'Price: 💲 ' + res[i].price.toString() + " <|> " + '📝 Stock:  ' + 
            res[i].stock.toString());
        }
        console.log("<~<>----------------------------------------------------------------<>~>");
        prodInfo();
    });
}


function prodInfo() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please type Item ID of the product you would like to buy?",
            name: "product",
            filter: Number
        },

        {
            type: "input",
            name: "quantity",
            message: "...And how many would you like to buy?",
            filter: Number
        }
    ]).then(function (res) {
        var item2 = res.product;
        var quant1 = res.quantity;

        connection.query("SELECT * FROM products WHERE ?", { id: item2 }, function (err, response) {
            if (err) throw err;

            if (response.length === 0) {
                console.log('ERROR: Select a valid Item ID from the Products list.');
                showProds();
            } else {

                var productRes = response[0];
                if (quant1 <= productRes.stock) {
                    console.log('Product in stock...\n' +
                        'Your order is being placed!');


                    var updateInventory = 'UPDATE products SET stock = ' + 
                    (productRes.stock - quant1) + ' WHERE id = ' + item2;

                    connection.query(updateInventory, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productRes.price * quant1 +
                        '\nThank you for Being the best part of the Bamazon family!\n' +
                        "<~<>----------------------------------------------------------------<>~>\n");
                        shopSomeMore();
                    })
                } else {
                    console.log("Sorry, item's not in stock to place your order.\n" +
                        "Please consider ordering an alternative brand/product.\n" +
                        "Your item was " + productRes.product + " and there are" + 
                        productRes.stock + " left in stock.");
                    shopSomeMore();
                }
            }
        })
    })
}


function shopSomeMore() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Please feel to view our other products, keep shoping?",
            name: "confirm"
        }
    ]).then(function (res) {
        if (res.confirm) {
            console.log("<~<>----------------------------------------------------------------<>~>");
            showProds();

        } else {
            console.log("Thanks for shopping Bamazon!\n" +
                "Motto: 'At least were not balmart!'");

            connection.end();
        }
    })
}
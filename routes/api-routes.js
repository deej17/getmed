// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.Customer.create({
      email: req.body.email,
      password: req.body.password,
      fname: req.body.fname,
      lname: req.body.lname,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      phone: req.body.phone,
      ccard: req.body.ccard,
      PharmacyId: req.body.PharmacyId

    })
      .then(function () {
        // res.send(dbCustomer);
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });
  ///inserting information of pharmacy
  app.post("/api/pharmacy", function (req, res) {
    db.Pharmacy.create({
      name: req.body.name,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state_abbr,
      zipcode: req.body.zipcode,
      phone: req.body.phone,
    }).then(function (dbPharma) {
      res.send(dbPharma);
    });

  });
  //route for driver
  app.post("/api/driver", function (req, res) {
    db.Driver.create({
      email: req.body.email,
      password: req.body.password,
      fname: req.body.fname,
      lname: req.body.lname,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      phone: req.body.phone,
      vehicle_plate: req.body.vehicle_plate,
      driver_license: req.body.driver_license
    }).then(function (dbDriver) {
      res.send(dbDriver);
    });

  });
  //route for order

  app.post("/api/order", function (req, res) {
    db.Order.create({
      //order_id: req.body.order_id,
      med_id: req.body.med_id,
      category: req.body.category,
      quantity: req.body.quantity,
      med_price: req.body.med_price,
      status: req.body.status,
      CustomerId: req.body.CustomerId,
      DriverId: req.body.DriverId,
      PharmacyId: req.body.PharmacyId

    }).then(function (dbPharma) {
      res.send(dbPharma);
    });
  });
  //Route for getting data
  app.get("/api/order/:customer_id", function (req, res) {
    // console.log(req.body);
    // console.log(res.json(req));
    // var querry={};
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // console.log("i m in post route");
      db.Order.findAll({
        where: {
          CustomerId: req.params.customer_id
        }
        // include:[db.Customer]
      }).then(function (dbOrder) {
        // console.log(dbOrder);
        // console.log(dbOrder.user);
        res.json(dbOrder);
      });
    }
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  // app.get("/api/order", function (req, res) {
  //   if (!req.user) {
  //     res.json({});
  //   } else {
  //     res.json({
  //       id: req.user.id
  //     });
  //   }
  // });

  app.get("/api/profile", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      // console.log("i m in post route");
      db.Customer.findOne({
        where: {
          id: req.user.id
        }
      })
        .then(function (dbCustomer) {
          res.json(dbCustomer);
        });
    }
  });

  app.put("/api/update", function (req, res) {
    // Add code here to update a post using the values in req.body, where the id is equal to
    // req.body.id and return the result to the user using res.json
    if (!req.user) {
      res.json({});
    } else {
      db.Customer.update({
        email: req.body.email,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        phone: req.body.phone,
        ccard: req.body.ccard,
        PharmacyId: req.body.PharmacyId
      }, {
        where: {
          id: req.user.id
        }
      }).then(function (dbPost) {
        res.json(dbPost);
      })
        .catch(function (err) {
          // Whenever a validation or flag fails, an error is thrown
          // We can "catch" the error to prevent it from being "thrown", which could crash our node app
          res.json(err);
        });
    }
  });
};

// New route to associate to current customer
app.get("/api/order", function (req, res) {
  if (!req.user) {
    res.json({});
  } else {
    // console.log("i m in post route");
    db.Customer.findOne({
      where: {
        id: req.user.id
      }
    })
      .then(function (dbCustomer) {
        res.json(dbCustomer);
      });
  }
});
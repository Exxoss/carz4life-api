
var firebase = require("firebase");
var validationHelper = require("../helpers/validation_helper")

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBzLJkg8UKJASiBkXTYLCfKXoVICD7BMNg",
  authDomain: "carz4life-89573.firebaseapp.com",
  databaseURL: "https://carz4life-89573.firebaseio.com",
  projectId: "carz4life-89573",
  storageBucket: "carz4life-89573.appspot.com",
  messagingSenderId: "661666432430"
};

var auctions = {}

firebase.initializeApp(config);

exports.observeAuctions = function(service) {
  firebase.database().ref('/auctions').on('value', function(snapshot) {
    console.log('! data is updated !')
    service.runAuctionProcess(snapshot.val())
    auctions = snapshot.val()
  });
}
//------------------------------------------------------------------------------------------------

exports.bid = function(auction_id, user_id, new_price) {
  var updates = {};
  updates['/auctions/' + auction_id + '/price'] = new_price
  updates['/auctions/' + auction_id + '/auction_winner_id'] = user_id

  firebase.database().ref().update(updates)
  console.log('Auction with ID : ', auction_id, ' has been bid for a new price of : CHF ', new_price, ' by (user id) : ', user_id)
}

exports.updateBidHistory = function(auction_id, user_id) {
  var bidHistory = []
  if (auctions[auction_id]['bid_history']) {
    bidHistory = auctions[auction_id]['bid_history']
  }
  if (validationHelper.contains.call(bidHistory, user_id) == false){
    bidHistory.push(user_id)
    var updates = {};
    updates['/auctions/' + auction_id + '/bid_history'] = bidHistory
    firebase.database().ref().update(updates)
    console.log('User id : ', user_id, ' has been added to the bid history of the auction with ID : ', auction_id)
  }
}

exports.updateEndAuctionDate = function(auction_id) {
  var dateNow = new Date(), updatedDate = new Date(dateNow)
  updatedDate.setMinutes(dateNow.getMinutes() + 15)

  var updatedDateIsoString = updatedDate.toISOString()

  var updates = {};
  updates['/auctions/' + auction_id + '/end_auction_date'] = updatedDateIsoString
  firebase.database().ref().update(updates)

  console.log('Auction with ID : ', auction_id, ' has a new closing date : ', updatedDateIsoString)
}

exports.setAuctionStatus = function(auction_id, status) {
  var updates = {};
  updates['/auctions/' + auction_id + '/auction_status'] = status

  firebase.database().ref().update(updates)

  console.log('Auction with ID : ', auction_id, ' is set to the auction status : ', status)
}
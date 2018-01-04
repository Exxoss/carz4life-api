var Timer = require('easytimer')
var db = require('../database/database')

var auctionsData = []

exports.runAuctionProcess = function(auctions) {
    //reset
    auctionsData = []

    updateAuctions(auctions)

    for (index in auctionsData) {
        if (auctionsData[index]['time_to_start'] > 0) {
            //Auction Pending
            if (auctionsData[index]['status'] == 0) {
                setStartAuctionTimer(auctionsData[index])
            } else {
                setAuctionPending(auctionsData[index]['id'])
                break
            }
            
        } else if (auctionsData[index]['time_to_end'] > 0) {
            //Auction Alive
            if (auctionsData[index]['status'] == 1) {
                setEndAuctionTimer(auctionsData[index])
            } else {
                setAuctionAlive(auctionsData[index]['id'])
                break
            }
        } else {
            //Auction Closed
            if (auctionsData[index]['status'] != 2){
                setAuctionClosed(auctionsData[index]['id'])
                break
            } 
        }
    }
    
}

//------------------------------------------------------------------------------------------------

function updateAuctions(auctions) {
    for (element in auctions) {
        var auctionData = {
            'id' : element,
            'status' : auctions[element]['auction_status'],
            'time_to_start': Math.trunc((new Date(auctions[element]['start_auction_date']) - new Date())/1000),
            'time_to_end' : Math.trunc((new Date(auctions[element]['end_auction_date']) - new Date())/1000),
            'ttos' : new Timer(),
            'ttoe' : new Timer()
        }
        auctionsData.push(auctionData)
    }
}

//------------------------------------------------------------------------------------------------

function setAuctionPending(auctionId) {
    db.setAuctionStatus(auctionId, 0)
}

function setStartAuctionTimer(auction) {
    auction['ttos'].start({countdown: true, startValues: {seconds: auction['time_to_start']}})
    console.log('Count down for ' + auction['time_to_start'] + ' seconds before auction start for auction with ID : ' + auction['id'])
    auction['ttos'].addEventListener('targetAchieved', function (e) {
        setAuctionAlive(auction['id'])
    });
} 

function setAuctionAlive(auctionId) {
    db.setAuctionStatus(auctionId, 1)
}

function setEndAuctionTimer(auction) {
    auction['ttoe'].start({countdown: true, startValues: {seconds:  auction['time_to_end']}})
    console.log('Count down for ' + auction['time_to_end'] + ' seconds before auction closed for auction with ID : ' + auction['id'])
    auction['ttoe'].addEventListener('targetAchieved', function (e) {
        setAuctionClosed(auction['id'])
    });
}

function setAuctionClosed(auctionId) {
    db.setAuctionStatus(auctionId, 2)
}
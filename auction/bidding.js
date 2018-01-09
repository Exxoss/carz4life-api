//bid on auction

exports.bid = function(db, auction_id, user_id, new_price) {
    db.updateBidHistory(auction_id, user_id)
    db.bid(auction_id, user_id, new_price)
    db.updateEndAuctionDate(auction_id)
    return true
}
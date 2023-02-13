module.exports = function generateDiscordMessage(listings, listingType) {
  let message = {};

  message.embeds = listings.map((listing) => {
    return {
      color: 7405538,
      title: `For ${listingType}: ${listing.address}`,
      url: listing.url,
      description: listing.headline,
      image: {
        url: listing.image,
      },
      footer: {
        text: `Listing ID: ${listing.id}\nPrice: ${listing.price}`,
      },
    };
  });

  return message;
};

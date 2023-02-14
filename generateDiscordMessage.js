module.exports = function generateDiscordMessage(listings, listingType) {
  let message = {};
  const color = listingType === "Sale" ? 15844367 : 15277667;

  message.embeds = listings.map((listing) => {
    return {
      color,
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

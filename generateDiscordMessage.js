module.exports = function generateDiscordMessage(listings) {
  let message = {};

  message.embeds = listings.map((listing) => {
    return {
      color: 7405538,
      title: `${listing.address}`,
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

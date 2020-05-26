const request = require("request-promise-native");

module.exports = async function filterAndMapListings(listings) {
  let result = [];
  let filteredListings = listings.filter((listing) => {
    return listing.listing.propertyDetails.street
      .toLowerCase()
      .includes("nandi");
  });

  if (filteredListings.length > 0) {
    for (const filteredListing of filteredListings) {
      let image = "";

      if (filteredListing.listing.media.length > 0) {
        let imageUrl = `${filteredListing.listing.media[0].url}/300x200`;
        let actualImageUrl = await request({
          uri: imageUrl,
          resolveWithFullResponse: true,
        });
        image = actualImageUrl.request.uri.href;
      }

      result.push({
        id: filteredListing.listing.id,
        address: filteredListing.listing.propertyDetails.displayableAddress,
        headline: filteredListing.listing.headline,
        image: image,
        url: `https://domain.com.au/${filteredListing.listing.listingSlug}`,
        price: filteredListing.listing.priceDetails.displayPrice,
      });
    }
  }

  return result;
};

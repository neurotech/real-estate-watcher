const db = require("./dynamo.js");
const request = require("request-promise-native");

module.exports = async function filterAndMapListings(allListings) {
  let result = [];
  let combinedListings = [];

  let projectListings = allListings.filter((listing) => {
    return listing.type === "Project";
  });

  projectListings.length > 0 &&
    projectListings.forEach((projectListing) => {
      projectListing &&
        projectListing.listings.length > 0 &&
        projectListing.listings.forEach((l) => combinedListings.push(l));
    });

  let propertyListings = allListings.filter((listing) => {
    return listing.type === "PropertyListing";
  });

  propertyListings.length > 0 &&
    propertyListings.forEach((propertyListing) => {
      combinedListings.push(propertyListing.listing);
    });

  let filteredListings = combinedListings.filter((listing) => {
    let containsNandiAve = listing.propertyDetails.street
      .toLowerCase()
      .includes("nandi av");

    let containsYoungStreet = listing.propertyDetails.street
      .toLowerCase()
      .includes("young st");

    let containsBenelongLane = listing.propertyDetails.street
      .toLowerCase()
      .includes("benelong l");

    let containsDalleyStreet = listing.propertyDetails.street
      .toLowerCase()
      .includes("dalley s");

    return (
      containsNandiAve ||
      containsYoungStreet ||
      containsBenelongLane ||
      containsDalleyStreet
    );
  });

  if (filteredListings.length > 0) {
    for (const filteredListing of filteredListings) {
      let seen = await db.getById(filteredListing.id);

      if (!seen.Item) {
        await db.addById(filteredListing.id);

        let image = "";

        if (filteredListing.media.length > 0) {
          let imageUrl = `${filteredListing.media[0].url}/300x200`;
          let actualImageUrl = await request({
            uri: imageUrl,
            resolveWithFullResponse: true,
          });
          image = actualImageUrl.request.uri.href;
        }

        result.push({
          id: filteredListing.id,
          address: filteredListing.propertyDetails.displayableAddress,
          headline: filteredListing.headline,
          image: image,
          url: `https://domain.com.au/${filteredListing.listingSlug}`,
          price: filteredListing.priceDetails.displayPrice,
        });
      }
    }
  }

  return result;
};

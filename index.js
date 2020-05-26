const request = require("request-promise-native");
const tiny = require("tiny-json-http");

const apiKey = process.env.REAL_ESTATE_WATCHER_DOMAIN_API_KEY;
const listingUrl = "https://api.domain.com.au/v1/listings/residential/_search";
const discordWebhookUrl = process.env.REAL_ESTATE_WATCHER_DISCORD_WEBHOOK_URL;
const searchBody = {
  pageSize: 200,
  listingType: "Sale",
  minBedrooms: 1,
  minBathrooms: 1,
  minCarspaces: 1,
  locations: [
    {
      state: "NSW",
      region: "",
      area: "",
      suburb: "Frenchs Forest",
      postCode: "",
      includeSurroundingSuburbs: false,
    },
  ],
};

let requestOptions = {
  url: listingUrl,
  headers: { "X-API-Key": apiKey },
  data: searchBody,
};

async function filterAndMapListings(listings) {
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
}

function generateDiscordMessage(listings) {
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
}

exports.handler = async () => {
  try {
    let response = await tiny.post(requestOptions);
    let listings = await filterAndMapListings(response.body);

    if (listings.length > 0) {
      let messages = generateDiscordMessage(listings);
      await tiny.post({ url: discordWebhookUrl, data: messages });

      return {
        statusCode: 200,
        body: JSON.stringify("OK"),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify("No listings found."),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

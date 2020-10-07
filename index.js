const dynamo = require("./dynamo.js");
const filterAndMapListings = require("./filterAndMapListings.js");
const generateDiscordMessage = require("./generateDiscordMessage.js");
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
    {
      state: "NSW",
      region: "",
      area: "",
      suburb: "Cremorne",
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

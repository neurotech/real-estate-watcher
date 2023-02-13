const dynamo = require("./dynamo.js");
const filterAndMapListings = require("./filterAndMapListings.js");
const generateDiscordMessage = require("./generateDiscordMessage.js");
const tiny = require("tiny-json-http");

const apiKey = process.env.REAL_ESTATE_WATCHER_DOMAIN_API_KEY;
const listingUrl = "https://api.domain.com.au/v1/listings/residential/_search";
const discordWebhookUrl = process.env.REAL_ESTATE_WATCHER_DISCORD_WEBHOOK_URL;
const locations = [
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
  {
    state: "NSW",
    region: "",
    area: "",
    suburb: "Queenscliff",
    postCode: "",
    includeSurroundingSuburbs: false,
  },
];

const checkForListings = async (listingType) => {
  const requestOptions = {
    url: listingUrl,
    headers: { "X-API-Key": apiKey },
    data: {
      pageSize: 200,
      listingType,
      minBedrooms: 1,
      minBathrooms: 1,
      locations,
    },
  };

  const response = await tiny.post(requestOptions);
  const listings = await filterAndMapListings(response.body);

  if (listings.length > 0) {
    const messages = generateDiscordMessage(listings, listingType);
    await tiny.post({ url: discordWebhookUrl, data: messages });
    return listings.length;
  } else {
    const body = JSON.stringify(`No ${listingType} listings found.`);
    console.log(body);
    return 0;
  }
};

exports.handler = async () => {
  try {
    const saleListings = await checkForListings("Sale");
    const rentListings = await checkForListings("Rent");
    const listings = saleListings + rentListings;

    if (listings > 0) {
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
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

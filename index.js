const { createLogger, format, transports } = require("winston");
const axios = require("axios");

const address = process.argv[2];

const datadogApiKey = process.env.DATADOG_API_KEY;

if (!datadogApiKey) {
  console.log("ERROR: $DATADOG_API_KEY is not set");
  process.exit(1);
}

const visualCrossingApiKey = process.env.VISUAL_CROSSING_API_KEY;

if (!visualCrossingApiKey) {
  console.log("ERROR: $VISUAL_CROSSING_API_KEY is not set");
  process.exit(1);
}

const logger = createLogger({
  level: "debug",
  exitOnError: false,
  format: format.json(),
  defaultMeta: { service: "nestlogger" },
  transports: [
    new transports.Http({
      host: "http-intake.logs.datadoghq.com",
      path: `/api/v2/logs?dd-api-key=${datadogApiKey}&ddsource=nodejs&service=nestlogger`,
      ssl: true,
      handleExceptions: true,
      handleRejections: true,
      level: "info",
    }),
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

function handleResponse(json) {
  console.log("got response: ", json);
  const conditions = json.currentConditions;
  logger.info({
    outsideTempF: conditions.temp,
    outsideFeelsLikeF: conditions.feelslike,
    outsideHumidity: conditions.humidity,
    outsideConditions: conditions.conditions,
    outsideWindMph: conditions.windspeed,
    outsideSolarRadiation: conditions.solarradiation,
    outsideSolarEnergy: conditions.solarenergy,
  });
}

const req = {
  method: "GET",
  timeout: 30_000,
  url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    address
  )}?unitGroup=us&include=current&key=${visualCrossingApiKey}&contentType=json`,
};

axios(req)
  .then((result) => {
    if (result.status == 200) {
      handleResponse(result.data);
    } else {
      console.error("Failed", result.status, result.statusText, result.data);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

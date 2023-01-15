# weather-logger

Log current weather conditions for a specific location, from visualcrossing.com, to Datadog

# Usage

```
export DATADOG_API_KEY=da39a3ee5e6b4b0d3255bfef95601890afd80709
export VISUALCROSSIG_API_KEY=da39a3ee5e6b4b0d3255bfef95601890afd80709
node index.js "New York, NY"
```

Sample log:

```json
{
  "level": "info",
  "message": {
    "outsideConditions": "Clear",
    "outsideFeelsLikeF": 35.1,
    "outsideHumidity": 55.6,
    "outsideSolarEnergy": 0.9,
    "outsideSolarRadiation": 263,
    "outsideTempF": 35.1,
    "outsideWindMph": 18.2
  },
  "service": "nestlogger"
}
```

## Datadog API key

Your Datadog API key can be generated via the website ([docs](https://docs.datadoghq.com/account_management/api-app-keys/))

## Visual Crossing API key

Your Visual Crossing weather API Key is shown at https://www.visualcrossing.com/account.

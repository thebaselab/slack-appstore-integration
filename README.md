# slack-appstore-integration
An App Store Connect API client to publish the latest app reviews to Slack every day. You can deploy it on GitHub Action by simply forking this repository.

![image](https://user-images.githubusercontent.com/38398443/208704950-a4e5230e-8c81-4047-80e8-c69f3653c79a.png)

To start, fork this repository and set these secrets in your GitHub Action's settings. Alternatively, you can paste them in a `.env` file.
```env
APP_ID= # The opaque resource ID that uniquely identifies the apps resource that represents your app
APPLE_KEY_ID= # The Key ID associated with your API Key.
APPLE_KEY_CONTENT= # The content of your API key
APPLE_ISSUER_ID= # Issuer ID
SLACK_WEBHOOK_URL= # Slack integration webhook url
```

- [Guide on generating App Store API keys](https://developer.apple.com/documentation/appstoreconnectapi/generating_tokens_for_api_requests)
- [Guide on creating a Slack webhook integration](https://api.slack.com/messaging/webhooks)

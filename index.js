require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
  APP_ID,
  APPLE_KEY_ID,
  APPLE_KEY_CONTENT,
  APPLE_ISSUER_ID,
  SLACK_WEBHOOK_URL,
} = process.env;

async function sendReviewToSlack(review) {
  const { rating, title, body, reviewerNickname, createdDate, territory } =
    review.attributes;

  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: `*${title} (${rating} stars)*\n>>>${body}\n\n_${reviewerNickname} - ${territory} - ${createdDate}_`,
    }),
  });
}

async function generateJWTToken() {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiration = issuedAt + 10 * 60;

  return jwt.sign(
    {
      iss: APPLE_ISSUER_ID,
      iat: issuedAt,
      exp: expiration,
      aud: "appstoreconnect-v1",
      scope: [`GET /v1/apps/${APP_ID}/customerReviews`],
    },
    APPLE_KEY_CONTENT,
    {
      algorithm: "ES256",
      header: {
        alg: "ES256",
        kid: APPLE_KEY_ID,
        typ: "JWT",
      },
    }
  );
}

async function fetchReviews(token) {
  const params = new URLSearchParams({
    sort: "-createdDate",
  });
  const response = await fetch(
    `https://api.appstoreconnect.apple.com/v1/apps/${APP_ID}/customerReviews?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}

async function main() {
  const token = await generateJWTToken();
  const data = await fetchReviews(token);

  const reviews = data.data.filter((review) => {
    const dayBeforeToday = new Date();
    dayBeforeToday.setDate(dayBeforeToday.getDate() - 1);
    const createdDate = new Date(review.attributes.createdDate);
    return createdDate > dayBeforeToday;
  });

  for (const review of reviews) {
    await sendReviewToSlack(review);
  }
}

main();

const axios = require("axios")
const { nanoid ***REMOVED*** = require("nanoid")
const oauthSignature = require("oauth-signature")

***REMOVED***

// Set up essential values
const secretData = {
  gfKey: process.env.CONSUMER_KEY,
  gfSecret: process.env.CONSUMER_SECRET,
***REMOVED***

// For those requests
// Update with correct origin when on production!
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
***REMOVED***

exports.handler = async event => {
  // Make sure we are dealing with a POST request
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200, // <-- Important for CORS
      headers,
      body: JSON.stringify({
        status: "notPost",
        message: "This was not a POST request!",
      ***REMOVED***),
    ***REMOVED***
  ***REMOVED***

  // Parse that post data body
  const data = JSON.parse(event.body)

  const apiUrl = data.baseUrl + "/submissions"

  // Check we have the required data
  if (!apiUrl) {
    return {
      statusCode: 424,
      headers,
      body: JSON.stringify({
        status: "missingApiData",
        message: "Required API data is missing",
      ***REMOVED***),
    ***REMOVED***
  ***REMOVED***

  // Now we can do the real work - Gravity Forms API stuff
  const authParams = new0AuthParameters(secretData.gfKey)
  const signature = oauthSignature.generate(
    "POST",
    apiUrl,
    authParams,
    secretData.gfSecret
  )

  let result

  try {
    result = await axios({
      method: "post",
      url: apiUrl,
      responseType: "json",
      params: {
        ...authParams,
        oauth_signature: signature,
    ***REMOVED***
      data: data.payload,
    ***REMOVED***)
  ***REMOVED*** catch (error) {
    // Check the function log for this!
    console.log("newGFEntry.js Error Data")
    console.log(error)

    const errorResponse = error.response.data

    // Here we know this is a Gravity Form Error
    if (errorResponse.is_valid === false) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({
          status: "gravityFormErrors",
          message: "Gravity Forms has flagged issues",
          validation_messages: errorResponse.validation_messages,
        ***REMOVED***),
      ***REMOVED***
    ***REMOVED*** else {
      // Unknown error
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: "unknown",
          message: "Something went wrong",
        ***REMOVED***),
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      status: "success",
      message: "Entry added to Gravity Forms",
      confirmation_message: result.data.confirmation_message,
    ***REMOVED***),
  ***REMOVED***
***REMOVED***

function getCurrentTimestamp() {
  return Math.round(new Date().getTime() / 1000)
***REMOVED***

function new0AuthParameters(consumerKey) {
  return {
    oauth_consumer_key: consumerKey,
    oauth_timestamp: getCurrentTimestamp(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_version: "1.0",
    oauth_nonce: nanoid(11),
  ***REMOVED***
***REMOVED***
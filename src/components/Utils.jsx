export default async function fetchWS(
  url,
  httpMethod,
  body = {},
  credentials = 'same-origin',
  headers = {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
) {
  let httpResponseDataToReturn;

  const httpRequestElements = {
    credentials: credentials,
    method: httpMethod,
    headers: headers,
  };
  if (httpMethod === 'POST') {
    httpRequestElements.body = JSON.stringify(body);
  }
  try {
    let response = await fetch(url, httpRequestElements);
    httpResponseDataToReturn = {
      httpResponseStatus: response.status,
    };
    let responseText = await response.text();
    httpResponseDataToReturn.responseData = responseText.length ? JSON.parse(responseText) : null;
  } catch (error) {
    httpResponseDataToReturn = {
      httpResponseStatus: 500,
      responseData: error,
    };
  }
  return httpResponseDataToReturn;
}

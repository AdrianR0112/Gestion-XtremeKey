function applyBetterAuthCookies(response, res) {
  const setCookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [];

  if (setCookies.length > 0) {
    res.setHeader('Set-Cookie', setCookies);
  }
}

async function relayBetterAuthResponse(response, res) {
  applyBetterAuthCookies(response, res);

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      return;
    }

    res.setHeader(key, value);
  });
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  res.status(response.status);
  if (contentType.includes('application/json')) {
    return res.json(body);
  }

  return res.send(body);
}

module.exports = { applyBetterAuthCookies, relayBetterAuthResponse };

// Allow parsing of .json5 files (with comments and all the good stuff)
require("json5/lib/register");

const config = require("./config.json5");

const express = require("express");
const app = express();

const fs = require("fs");

function readCreds() {
  const data = fs.readFileSync(config.credsFile, "utf-8");
  const lines = data.split(/\r?\n/);
  return {
    username: lines[0],
    password: lines[1],
  };
}

// Load the credentials into memory
const creds = readCreds();
// Import the assiduiteParser module by passing it the config and the creds
const assiduite = require("./assiduiteParser")(config, creds);

// Caching utility
let cacheList = {};
/// fn: callback/function to cache
/// uniqueID: a unique ID that identifies that function
/// cacheDelay: cache delay, in ms
async function cache({ uniqueID, cacheDelay, fn }) {
  if (uniqueID === undefined || !cacheDelay || !fn)
    throw new Error("Invalid or missing parameter(s)");

  if (!(uniqueID in cacheList) || Date.now() - cacheList[uniqueID].lastCacheTime >= cacheDelay) {
    // If cache never called or already exists but delay has expired
    cacheList[uniqueID] = {
      cacheData: await fn(),
      lastCacheTime: Date.now(),
    };
  }

  return cacheList[uniqueID].cacheData;
}

// Parses application/json
app.use(express.json());

app.get("/", (_, res) => {
  res.send(
    `<h1>Bienvenue sur l'API assiduite :)</h1>
    <p>En vrai go spam le service info pour faire une vraie API hein</p>`
  );
});

app.get("/courses", async (_, res) =>
  res.json(
    await cache({
      uniqueID: "courses",
      cacheDelay: 10000,
      fn: async () => await assiduite.listCourses(),
    })
  )
);

app.post("/check-in", async (req, res) => {
  if (!req.body.courseID || !req.body.username) {
    return res.json({
      success: false,
      error: "Missing parameters",
    });
  }

  res.json(await assiduite.checkIn(req.body.courseID, req.body.username));
});

app.listen(config.listenPort, () =>
  console.log(`Assiduite API running on port ${config.listenPort}! :)`)
);

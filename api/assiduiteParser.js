const axios = require("axios").default;
const cheerio = require("cheerio");

module.exports = function (config, creds) {
  return {
    listCourses: async function () {
      try {
        const response = await axios.get(config.url, {
          auth: {
            username: creds.username,
            password: creds.password,
          },
        });

        const $ = cheerio.load(response.data);
        let res = [];

        $("tr.click").each(function () {
          const row = $(this);
          const infos = row
            .children("td")
            .map((i, td) => $(td).text().trim())
            .toArray();

          const room = infos[7].match(/[A-Z][0-9]{3}/);

          res.push({
            id: row.attr("ide"),
            //uid: row.attr("uid"),
            date: infos[2],
            start: infos[3],
            end: infos[4],
            name: infos[5],
            room: room ? room[0] : undefined,
            prof: infos[8],
          });
        });

        return {
          success: true,
          courses: res,
        };
      } catch (error) {
        console.error(`Error catched in getUnvalidatedCourses(): ${error}`);
      }

      return { success: false };
    },

    checkIn: async function (courseID, username) {
      let success = false;

      try {
        let res = await axios.get(config.checkInUrl, {
          params: {
            idE: courseID,
            uid: username,
          },
          auth: {
            username: creds.username,
            password: creds.password,
          },
        });

        success = res.data.includes(courseID) && res.data.includes(username);
      } catch (error) {
        console.error(`Error catched in /check-in: ${error}`);
      }

      return { success: success };
    },
  };
};

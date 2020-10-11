const http = require("http");
const config = require("./config/config");
const twit = require("twit");
const T = twit(config);

const host = "localhost";
const port = process.env.PORT || 80;
const requestListener = (req, res) => {
  res.writeHead(200);
  res.end();
};
let app = http.createServer(requestListener);
app.listen(port, host, () =>
  console.log(`Server is running on http://${host}:${port}`)
);
console.log("Bot started - " + new Date());

retweet = () => {
  let params = {
    q: "fora bolsonaro",
    count: 100,
  };
  T.get("search/tweets", params, (err, data, response) => {
    if (!err) {
      try {
        const regex = /fora.bolsonaro|forabolsonaro|fora..bolsonaro/gim;
        for (let dat of data.statuses) {
          if (regex.exec(dat.text)) {
            let retweetId = dat.id_str;
            T.post("statuses/retweet/:id", { id: retweetId }, (err) => {
              err
                ? console.log(`Somenthing went wrong! => ${err}`)
                : console.log(`Retweeted ${retweetId}`);
            });
          }
        }
      } catch (error) {
        console.log("Error after data acquisition: ");
        throw error;
      }
    } else {
      throw new Error(err);
    }
  });
};
// Every 1.66 minutes it will run the retweet function
setInterval(retweet, 99600);

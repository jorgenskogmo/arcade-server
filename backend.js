/**
 * simple tickets and highscore backend for the aracade games
 *
 * ## Coupons
 *
 * GET /coupons/new            Show Create Coupons UI
 * GET /coupons/create?player={name}&count={10}&lives={3}&auth={sth}
 * GET /coupons-callback        (Future) Payment provider callback
 *
 *
 * ## Highscores
 * GET /highscores/list?game={gamename}
 * GET /highscores/add?game={gamename}&player={name}&score={score}
 */

const fs = require("node:fs");
const path = require("node:path");
const cors = require("cors");
const express = require("express");
const QRCode = require("qrcode");
import { format } from "date-fns";
import { uid } from "uid";

const app = express();
app.use(cors());
const port = 5555;

const known_games = ["speedclick"];

const dataroot = path.join(__dirname, "data");
const qrroot = path.join(__dirname, "qrs");

//
// Coupons

app.get("/coupons/create", (req, res) => {
  const player = req.query.player;
  const count = req.query.count | 5;
  const lives = req.query.lives | 3;
  // const auth = req.query.auth;

  const data = uid(); // length: 11, 'c92054d1dd6'
  const date = format(new Date(), "yyMMdd-Hms");
  const file_basename = `${date}_${player}_${lives}_${data}_0.png`;

  // for 0..count...
  const qr_files = [file_basename];

  const outfile = path.join(qrroot, file_basename);
  QRCode.toFile(
    outfile,
    data,
    {
      version: 4,
      margin: 1,
      scale: 8,
      errorCorrectionLevel: "H",
    },
    (err) => {
      if (err) {
        res.end(
          JSON.stringify({
            message: "Error generating QR codes:",
            data: err,
          })
        );
      } else {
        console.log("generated qrcode to", outfile);
        res.end(
          JSON.stringify({
            message: "Generated QR codes:",
            data: qr_files,
          })
        );
      }
    }
  );
});

//
// Highscores

app.get("/highscores/list", (req, res) => {
  const game = req.query.game;

  if (!checkValidGame(game)) {
    // print a helpful list of valid urls:
    res.send(
      JSON.stringify({
        message: `Game '${game}' unknow: try one of these:`,
        data: known_games.map(
          (g) => `localhost:${port}/highscores/list?game=${g}`
        ),
      })
    );
    return;
  }
  console.log("listing highscores for game", game);
  res.end(JSON.stringify(loadHighscores(game)));
});

app.get("/highscores/add", (req, res) => {
  const game = req.query.game;
  const player = req.query.player;
  const score = Number.parseInt(req.query.score);

  console.log(game, player, score);

  if ((game === undefined) | (player === undefined) | (score === undefined)) {
    res.end("Please provide $game, $player and $score");
    return;
  }

  if (!checkValidGame(game)) {
    // print a helpful list of valid urls:
    res.send(
      JSON.stringify(
        known_games.map((g) => `localhost:${port}/highscores/list?game=${g}`)
      )
    );
    return;
  }
  console.log("listing highscores for game", game);
  const data = loadHighscores(game);
  // fix: if the player has saved the same points, ignore
  // fix: or maybe: discard the old, save the new?
  data.push({ player, score });
  const ordered_data = orderHighscores(data);
  const place = ordered_data.findIndex(
    (entry) => entry.player === player && entry.score === score
  );
  saveHighscores(game, ordered_data);

  const entries = ordered_data.length - 1;
  let message = `Your placed: ${place + 1}${ordinal_suffix(place + 1)}`; // 1st, 2nd, 3rd, 4th.
  if (place === 0) {
    message = "You placed 1st! Woop!";
  }
  if (place === entries) {
    message = "You placed last... try again!";
  }

  const beaten_player = place < entries ? ordered_data[place + 1] : "";

  res.end(
    JSON.stringify({
      message,
      data: { entries, beaten_player },
    })
  );
});

//

const checkValidGame = (game) => {
  return known_games.includes(game);
};

const loadHighscores = (game) => {
  const data_file = path.join(dataroot, `${game}.json`);
  console.log("reading data from", data_file);

  let data = [];
  if (!fs.existsSync(data_file)) {
    console.log("creating data file for game", game, "at", data_file);
    fs.writeFileSync(data_file, JSON.stringify([]));
  } else {
    data = JSON.parse(fs.readFileSync(data_file).toString());
  }
  return data;
};

const saveHighscores = (game, data) => {
  const data_file = path.join(dataroot, `${game}.json`);
  console.log("reading data from", data_file);
  fs.writeFileSync(data_file, JSON.stringify(data));
};

const orderHighscores = (data) => {
  const key = "score";
  return data
    .sort((a, b) => {
      const x = a[key];
      const y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    })
    .reverse();
};

const ordinal_suffix = (n) =>
  ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";

//
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

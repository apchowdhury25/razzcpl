const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const root = __dirname;
const to = "hello@razzcpl.com";
const allowedInterest = ["Landowner", "Future resident", "Commercial client"];
const blocked = new Set([
  "/server.js",
  "/package.json",
  "/package-lock.json",
  "/readme.md"
]);

const app = express();
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

app.use((req, res, next) => {
  const pathname = decodeURIComponent(req.path || "/").toLowerCase();
  if (blocked.has(pathname) || pathname.startsWith("/scripts/") || pathname.startsWith("/node_modules/")) {
    res.status(404).type("text/plain").send("Not found");
    return;
  }
  next();
});

app.post("/contact.php", (req, res) => {
  if (field(req.body, "company_website", 200) !== "") {
    res.redirect(303, "/contact.html?sent=1");
    return;
  }

  const name = field(req.body, "name", 120);
  const email = field(req.body, "email", 160);
  const phone = field(req.body, "phone", 40);
  let interest = field(req.body, "interest", 40);
  const area = field(req.body, "area", 160);
  let message = req.body && req.body.message != null ? String(req.body.message).trim() : "";
  if (message.length > 4000) message = message.slice(0, 4000);
  if (!allowedInterest.includes(interest)) interest = "Enquiry";

  if (!name || !phone || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.redirect(303, "/contact.html?sent=0#form");
    return;
  }

  const subject = "Website enquiry - " + interest;
  const body = "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\nInterest: " + interest + "\nArea: " + area + "\n\n" + message + "\n";
  sendMail(subject, body, email)
    .then((ok) => {
      res.redirect(303, "/contact.html?" + (ok ? "sent=1" : "sent=0") + "#form");
    })
    .catch(() => {
      res.redirect(303, "/contact.html?sent=0#form");
    });
});

app.use(express.static(root, { index: "index.html", dotfiles: "ignore", extensions: ["html"] }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(root, "404.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("Razz site listening on " + port);
});

function field(body, key, max) {
  const source = body && body[key] != null ? String(body[key]) : "";
  const value = source.trim().replace(/[\r\n]/g, " ");
  return value.length > max ? value.slice(0, max) : value;
}

function sendMail(subject, body, replyTo) {
  return new Promise((resolve) => {
    const sendmail = spawn("sendmail", ["-t"], { stdio: ["pipe", "ignore", "ignore"] });
    let settled = false;
    const done = (ok) => {
      if (!settled) {
        settled = true;
        resolve(ok);
      }
    };
    sendmail.on("error", () => done(false));
    sendmail.on("close", (code) => done(code === 0));
    sendmail.stdin.end(
      [
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "From: Razz website <" + to + ">",
        "To: " + to,
        "Reply-To: " + replyTo,
        "Subject: " + subject,
        "",
        body
      ].join("\n")
    );
  });
}

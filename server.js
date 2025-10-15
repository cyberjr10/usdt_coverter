const app = require("./app");

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server + Activity Logger running at http://localhost:${PORT}`)
);

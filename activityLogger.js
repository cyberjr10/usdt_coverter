const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Database path
const dbPath = path.join(__dirname, "activity.db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
});

// Define Activity model
const Activity = sequelize.define("Activity", {
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Sync DB
(async () => {
  try {
    await sequelize.sync();
    console.log("✅ activity.db ready at:", dbPath);
  } catch (err) {
    console.error("❌ DB init failed:", err);
  }
})();

// Middleware
async function activityLogger(req, res, next) {
  try {
    const entry = await Activity.create({
      ip_address: req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || 'localhost',
      endpoint: req.originalUrl || 'unknown',
      method: req.method || 'GET',
    });
    console.log("📌 Logged activity:", entry.toJSON());
  } catch (err) {
    console.error("❌ Activity logging failed:", err);
  }
  next();
}

module.exports = activityLogger;

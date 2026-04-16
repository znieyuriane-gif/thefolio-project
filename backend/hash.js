const bcrypt = require("bcryptjs");
bcrypt.hash("Admin@1234", 10).then(console.log);

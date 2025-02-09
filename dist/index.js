"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const crypto = require('crypto');
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const lamda_route_1 = __importDefault(require("./routes/lamda.route"));
const app = (0, express_1.default)();
const database = new database_1.default();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', project_route_1.default);
app.use('/api', lamda_route_1.default);
database.connectToMongoDB().then(async (_) => {
    if (_ instanceof Error) {
        console.error(_.message);
        return;
    }
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
//# sourceMappingURL=index.js.map
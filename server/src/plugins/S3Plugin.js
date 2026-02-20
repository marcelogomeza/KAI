"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Plugin = void 0;
const StoragePlugin_1 = require("./StoragePlugin");
class S3Plugin {
    name = 'AWS S3';
    async listFiles() {
        return ['backup-2026-01-01.zip', 'user-upload-72.png'];
    }
    async uploadString(filename, content) {
        console.log(`[AWS S3] Uploaded ${filename} to bucket`);
        return true;
    }
    async downloadString(filename) {
        return `Simulated content from S3 object: ${filename}`;
    }
}
exports.S3Plugin = S3Plugin;
//# sourceMappingURL=S3Plugin.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneDrivePlugin = void 0;
class OneDrivePlugin {
    name = 'OneDrive';
    async listFiles() {
        return ['Project_Plan.docx', 'Budget.xlsx'];
    }
    async uploadString(filename, content) {
        console.log(`[OneDrive] Uploaded ${filename}`);
        return true;
    }
    async downloadString(filename) {
        return `Simulated content from OneDrive file: ${filename}`;
    }
}
exports.OneDrivePlugin = OneDrivePlugin;

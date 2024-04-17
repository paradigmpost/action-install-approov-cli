import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import makeDir from 'make-dir';
import { destination } from './destination';

async function run(): Promise<void> {
    try {
        let platform = "";
        switch (os.platform()) {
            case "linux":
                platform = "linux";
                break;
            case "darwin":
                platform = "darwin";
                break;
            case "win32":
                platform = "windows";
                break;
            default:
                core.setFailed("Unsupported operating system - Pulumi CLI is only released for Darwin, Linux and Windows");
                return;
        }

        const downloadUrl = `https://approov.io/downloads/approovcli.zip`;
        core.info(`Install destination is ${destination}`)

        const downloaded = await tc.downloadTool(downloadUrl);
        core.info(`successfully downloaded ${downloadUrl}`)

        let pathFolder = ""
    
        // The packages for Windows and *nix are structured differently - note the extraction paths for each.
        switch (platform) {
            case "windows":
                await tc.extractZip(downloaded, os.homedir());
                fs.renameSync(path.join(os.homedir(), "Approov"), destination);
                core.addPath(path.join(destination, "bin"));
                return;
            case "linux":
                pathFolder = "Linux"
                break;
            case "darwin":
                pathFolder = "MacOS"
                break;
        }

        const destinationPath = await makeDir(destination);
        core.info(`Successfully created ${destinationPath}`)
        const extractedPath = await tc.extractZip(downloaded, destination);
        const cliContents = path.join(extractedPath, "approovcli")
        core.info(`Successfully extracted ${downloaded} to ${cliContents}`)
        
        const oldPath = path.join(cliContents, pathFolder)
        const newPath = path.join(cliContents, "bin");
        fs.renameSync(oldPath, newPath);
        core.info(`Successfully renamed ${oldPath} to ${newPath}`)

        core.addPath(newPath);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

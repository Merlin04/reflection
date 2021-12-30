import { Command } from "@oclif/core";

export default class Build extends Command {
    static description = "Build a Reflectkit project";
    
    static args = [];
    
    static flags = {};
    
    async run() {
        this.log("hello world!");
    }
}
import { Command } from "@oclif/core";
import walk from "ignore-walk";
import { readdir, lstat, readFile, writeFile } from "fs/promises";
import path from "path";
import { Minimatch } from "minimatch";

export default class Pack extends Command {
    static description = "Pack an image from files";

    static examples = [
        `$ reflectkit image pack image.js
Wrote image to image.js`
    ];

    static args = [{
        name: "output",
        description: "Output file",
        required: true
    }];

    async run() {
        const { args } = await this.parse(Pack);

        // Have to do some hacky stuff to get the walker to ignore .git
        // https://github.com/npm/ignore-walk/issues/2
        const internal = "internal-" + Math.random().toString();
        const walker = new walk.WalkerSync({
            path: process.cwd(),
            ignoreFiles: [".gitignore", ".vercelignore", ".reflectkitignore", internal]
        });
        //@ts-ignore
        walker.ignoreRules[internal] = [
            new Minimatch(".git/*", {
                matchBase: true,
                dot: true,
                flipNegate: true,
                nocase: true
            })
        ];
        const res = walker.start().result;

        const image = `export default ${JSON.stringify(
            Object.fromEntries(
                await Promise.all(
                    [...res].map(async f => [f, 
                        (await readFile(path.join(process.cwd(), f))).toString()
                    ])
                )
            ), null, 4
        )};`;

        await writeFile(args.output, image);
        this.log(`Wrote image to ${args.output}`);
    }
}
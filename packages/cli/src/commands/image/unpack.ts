import { Command, Flags } from '@oclif/core'
import { writeFile, mkdir, lstat, readFile } from 'fs/promises';
import path from 'path';

export default class Unpack extends Command {
    static description = "Unpack an image into a directory";

    static examples = [
        `$ reflectkit image unpack image.js unpacked/
Unpacked image to unpacked/`
    ];

    static args = [{
        name: "input",
        description: "Input image file",
        required: true
    }, {
        name: "output",
        description: "Output directory",
        required: false,
        default: "."
    }];

    static flags = {
        overwrite: Flags.boolean({
            name: "overwrite",
            description: 'Overwrite existing files',
            default: false
        })
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Unpack);

        // Read the image file
        // We can't directly import it since it's an ES module and Node.js uses CommonJS
        // So we need to do some weird transforms on the text then create it as a new module
        const imageSrc = (await readFile(args.input, "utf8")).replace(/export default/, "module.exports =");
        //@ts-ignore
        const imageModule = new module.constructor();
        imageModule._compile(imageSrc, args.input);
        const image: Record<string, string> = imageModule.exports;

        if(!flags.overwrite) {
            const existing = [];
            for(const f in image) {
                if(await lstat(path.join(args.output, f)).catch(() => false)) {
                    existing.push(f);
                }
            }
            if(existing.length > 0) {
                throw new Error(`Unpacking image would overwrite existing files:${existing.map(f => `\n - ${f}`).join("")}
Use --overwrite to proceed anyway`);
            }
        }

        await Promise.all(
            Object.entries(image).map(async ([f, s]) => {
                // Make sure the file destination exists
                await mkdir(path.dirname(path.join(args.output, f)), { recursive: true });
                await writeFile(path.join(args.output, f), s);
            })
        );

        this.log(`Unpacked image to ${args.output}`);
    }
}

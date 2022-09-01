import extractJSPathsFromDir from './utils/extractJSPathsFromDir.js';
import validateSchema from './utils/validate-schema.js';

const commandSchema = {
  name: '',
  aliases: [''],
  async execute() {},
};

export default class {
  prefix;
  commands = new Map();

  async init(prefix, commandsDir) {
    this.prefix = prefix;

    const jsPaths = await extractJSPathsFromDir(commandsDir);
    let cmdQty = 0;

    for (const path of jsPaths) {
      const { default: module } = await import(path);

      if (!validateSchema(commandSchema, module)) continue;

      this.commands.set(module.name, module);
      module.aliases?.forEach((a) => this.commands.set(a, module));
      cmdQty++;

      const green = '\x1b[32m';
      const white = '\x1b[0m';

      console.log(green + 'Loaded ' + module.name + white);
    }

    console.log(`Loaded ${cmdQty} command (s).`);
  }

  async handle(msg) {
    const content = msg.content;

    if (!content.startsWith(this.prefix)) return;

    const cmdName = content
      .split(' ')[0]
      .slice(this.prefix.length)
      .toLocaleLowerCase();
    const args = content.split(' ').slice(1);

    const cmd = this.commands.get(cmdName);

    if (!cmd) {
      await msg.reply('⚠ Command not found.');
      return;
    }

    try {
      await cmd.execute(msg, args, this.prefix);
    } catch (err) {
      console.error(err);
      await msg.reply(
        "❌ We're very sorry but some technical error has occured (not your case).",
      );
    }
  }
}

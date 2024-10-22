#!/usr/bin/env -S deno run -A

// Usage :
// $ ./cli-lite-example.ts
// $ ./cli-lite-example.ts exec_date
// $ ./cli-lite-example.ts cat_grep
// $ ./cli-lite-example.ts readFile .gitignore
// $ ./cli-lite-example.ts --help
// Usage: <Tool file> [Options] [--] [command [command args]]
//
//
// Commands:
//   main            [default]
//   exec_date
//
//   readFile <path>
//
// Options:
//  -h, --help    Show this help [default: false]
//      --web-url               [default: "none"]

import {cliteRun} from "jsr:@jersou/clite@0.7.4";
import $ from "jsr:@david/dax@0.42.0";
import * as colors from "jsr:@std/fmt@1.0.2/colors";

class Tool {
  webUrl = "none";

  constructor() {
    $.cd(import.meta);
    $.setPrintCommand(true);
  }

  async main() {
    await this.exec_date();
    this.readFile();
  }

  async exec_date() {
    const output = await $`date`.text(); // exec command
    console.log(colors.bgBrightBlue(output), this); // colored log
  }

  async cat_grep() {
    const output = await $`cat /etc/passwd | grep /root`.text(); // exec command
    console.log(colors.bgBrightBlue(output)); // colored log
  }

  readFile(path = "./deno.json") {
    $.cd(import.meta); // change dir to the current script dir
    const content = $.path(path).readTextSync();
    $.logLight(content);
  }
}

// if the file is imported, do not execute this block
if (import.meta.main) {
  cliteRun(Tool);
}

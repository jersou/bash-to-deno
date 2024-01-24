#!/usr/bin/env -S deno run -A

// Usage :
// $ ./cli-lite-example.ts
// $ ./cli-lite-example.ts exec_date
// $ ./cli-lite-example.ts readFile .gitignore
// $ ./cli-lite-example.ts --help

import { cliteRun } from "https://deno.land/x/clite_parser@0.1.3/clite_parser.ts";
import $ from "https://deno.land/x/dax@0.36.0/mod.ts";
import "https://deno.land/x/dax_extras@2.3.2-0.36.0/mod.ts";
import * as colors from "https://deno.land/std@0.209.0/fmt/colors.ts";

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

  readFile(path = "./deno.json") {
    $.cd(import.meta); // change dir to the current script dir
    const content = $.path(path).readTextSync();
    $.logLight(content);
  }
}

// if the file is imported, do not execute this block
if (import.meta.main) {
  cliteRun(new Tool());
}

#!/usr/bin/env -S deno run -A
// use this shebang ↑ and add exec permission (chmod +x script.ts)
// to exec the script directly : ./script.ts

import $ from "https://deno.land/x/dax@0.36.0/mod.ts";
import { bgBrightBlue } from "https://deno.land/std@0.209.0/fmt/colors.ts";

const output = await $`date`.text(); // exec command
console.log(bgBrightBlue(output)); // colored log

$.cd(import.meta); // change dir to the current script dir
const content = $.path("./deno.json").readTextSync();
$.logLight(content);

// ------------------------------------------------------------
//                         OFFICIAL DOC
// ------------------------------------------------------------
//
// Dax $... : https://github.com/dsherret/dax
// Deno API : https://deno.land/api
// Deno Standard Library : https://deno.land/std?doc
// Deno Manual : https://docs.deno.com/runtime/manual
//
// ------------------------------------------------------------
//                         EXEMPLES
// ------------------------------------------------------------

// execute command, print output in console, wait command end
//   bash $ deno --version
await $`deno --version`;

// execute command, get output in a variable, wait command end
//   bash $ denoVersion=$(deno --version)
const denoVersion = await $`deno --version`.text();
console.log({ denoVersion });

// execute command, filter output
//   bash $ deno --version | grep typescript
(await $`deno --version`.lines())
  .filter((line) => line.includes("typescript"))
  .map((line) => console.log("filter result : ", line));

// execute command, parse json output
//   bash $ kubectl config view -o json  | jq '.apiVersion'
// Deno :
// > const kubeJson = await $`kubectl config view -o json`.json();
// > console.log({ apiVersion: kubeJson.apiVersion });

// execute command, with another as stdin
//   bash $ (date +%s.%N ; date +%s.%N) | xargs -n 1 echo line
const child = $`date +%s.%N ; date +%s.%N`.stdout("piped").spawn();
await $`deno eval 'for await (const chunk of Deno.stdin.readable) {  console.log("chunk", new TextDecoder().decode(chunk));}'`
  .stdin(child.stdout());

// execute command from another path
//   bash $ (cd .. && pwd)
await $`pwd`.cwd("..");

// execute command, print if before
//   bash $ (set -x; date)
await $`date`.printCommand();

// always print command before executing it
//   bash $ set -x
$.setPrintCommand(true);

// disable "always print command before executing it"
//   bash $ set +x
$.setPrintCommand(false);

// timeout a command
//   bash $ timeout 0.1s bash -c 'echo 1 && sleep 1 && echo 2'
// try {
//   await $`echo 1 && sleep 1 && echo 2`.timeout("0.1s");
// } catch (e) {
//   console.log(e);
// }

// kill command
//   bash $ (echo 1 && sleep 1 && echo 2) &
//   bash $ sleep 0.2
//   bash $ kill $$
// const childToStop = $`echo 1 && sleep 1 && echo 2`.spawn();
// await $.sleep("0.2s");
// childToStop.kill();

// sleep
//   bash $ sleep 0.1
await $.sleep(100); // ms
//   bash $ sleep 0.1s
await $.sleep("0.2s");

// Log
$.log("Hello!");
// log with the first word as bold green
$.logStep("Setting up", "local directory...");
// similar to $.logStep, but with red
$.logError("Error Some error message.");
// similar to $.logStep, but with yellow
$.logWarn("Warning Some warning message.");
// logs out text in gray
$.logLight("Some unimportant message.");

// colored log
console.log("%cHello World", "color: red");
console.log("%cHello World", "background-color: blue");
console.log("%cHello World", "text-decoration: underline");
console.log("%cHello World", "text-decoration: line-through");
console.log("%cHello World", "font-weight: bold");
console.log("%cHello World", "color: red; font-weight: bold");
console.log("%cHello %cWorld", "color: red", "color: blue");
console.log("%cHello World", "color: #FFC0CB");
console.log("%cHello World", "color: rgb(255, 192, 203)");

console.log(
  bgBrightBlue("bgBrightBlue log (import from deno.land/std/fmt/colors.ts"),
);

// prompt
//   bash $ read -s -p 'password : ' pass
// const pass = await $.prompt("password : ", { mask: true });
//
// confirm
// const confirm = await $.confirm({ message: "continue?", default: true });
//
// select
// const index = await $.select({
//   message: "What's your favourite colour?",
//   options: [
//     "Red",
//     "Green",
//     "Blue",
//   ],
// });
//
// multiSelect
// const indexes = await $.multiSelect({
//   message: "Which of the following are days of the week?",
//   options: [
//     "Monday",
//     {
//       text: "Wednesday",
//       selected: true, // defaults to false
//     },
//     "Blue",
//   ],
// });

// progress indicator indeterminate
const pb = $.progress("Updating");
await pb.with(async () => await $.sleep(1000));
const pb2 = $.progress("Updating 2");
await $`echo 111 && sleep 1 && echo 222`;
pb2.finish();

// progress indicator determinate
const items = [1, 2, 3, 4, 5];
const pb3 = $.progress("Processing Items", { length: items.length });
await pb3.with(async () => {
  for (const item of items) {
    await $`echo ${item} && sleep 0.4`;
    pb3.increment(); // or use pb.position(val)
  }
});
console.log();
console.log();
console.log();

// FS
console.log("/etc is dir : ", $.path("/etc").isDirSync());
console.log("/etc/passwd exist : ", $.path("/etc/passwd").existsSync());

// change dir to the current script dir
$.cd(import.meta);
const denoJsonText = $.path("./deno.json").readTextSync();
console.log(denoJsonText);
const denoJson = $.path("./deno.json").readJsonSync() as any;
console.log("deno task run : ", denoJson.tasks.run);

// get the path to deno executable
//   bash $ type deno
console.log(await $.which("deno"));

// Check if a command exists:
console.log("deno cmd exists : ", $.commandExistsSync("deno"));

try {
  await $.withRetries({
    count: 3,
    // you may also specify an iterator here which is useful for exponential backoff
    delay: "0.2s",
    action: async () => {
      await $`echo try && false`;
    },
  });
} catch (_) {
  //
}

// requests
//   bash $ curl https://raw.githubusercontent.com/denoland/deno/main/.dprint.json | jq .typescript
const data = await $.request(
  "https://raw.githubusercontent.com/denoland/deno/main/.dprint.json",
).json();
console.log("typescript from dprint", data.typescript);

// shell
// ; / && / ||
// cd / echo / exit / cp / mv / rm / mkdir / pwd / sleep / test / touch / unset / cat / printenv
// inline env var
// const result = await $`test=123 deno eval 'console.log(Deno.env.get('test'))'`;
// console.log(result.stdout); // 123

// if the file is imported, do not execute this block
//   bash $ if [[ $0 == "${BASH_SOURCE[0]}" ]]; then ... fi
if (import.meta.main) {
  console.log("main entrypoint");
}

// testing
// import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
// Deno.test("test name", () => {
//   assertEquals(...);
// });
// // $ deno test

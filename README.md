# Bash to Deno examples

Bash has a number of peculiarities, particularly when it comes to error
handling, and long Bash scripts can become complicated to maintain for teams
with little experience of the language.

Deno seems a good alternative, with Typescript for typing and a modern API for
accessing local resources (File System, I/O, Sub Process, ...).

This examples [bash-to-deno.ts](./bash-to-deno.ts) use
[Dax](https://github.com/dsherret/dax) library :

> Cross platform shell tools for Deno inspired by zx.

From https://github.com/google/zx :

> Bash is great, but when it comes to writing more complex scripts, many people
> prefer a more convenient programming language. JavaScript is a perfect choice,
> but the Node.js standard library requires additional hassle before using. The
> zx package provides useful wrappers around child_process, escapes arguments
> and gives sensible defaults.

→ [examples in bash-to-deno.ts](./bash-to-deno.ts)

→ [example with basic CLI in cli-lite-example.ts](./cli-lite-example.ts)

## Official Doc

- Dax : https://github.com/dsherret/dax
- Deno API : https://deno.land/api
- Deno Standard Library : https://deno.land/std?doc
- Deno Manual : https://docs.deno.com/runtime/manual
- CliteParser : https://github.com/jersou/clite-parser

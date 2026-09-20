---
title: "Privacy"
description: "What Quetoo collects, what it does not, and how to turn it off."
---

Quetoo collects a small amount of anonymous data so that we know how many people
play, what they play on, and how quickly they pick up a release. This page says
exactly what that is, and how to stop it.

---

## What the game sends

The game posts two small messages per session to `giblets.quetoo.org`: one when
it starts, and one when it exits.

The first carries your Quetoo version and build number, your operating system
and CPU architecture, your GPU name and graphics backend, your CPU core count,
and how much memory your machine has.

The second carries how long the session lasted, in seconds, and how many maps
were loaded.

Both carry a random session identifier, so the two halves can be matched, and a
player token described below.

## What it does not send

No player name. No email address. No map name, server address or IP address of
any server you played on. Nothing you typed. Nothing about who you played with.

We do not store your IP address, and our web server does not write it to its log
for these requests.

## The player token

The game does not send an identifier that follows you.

Your installation holds a random `guid`, which servers already use to attribute
your frags. That value never leaves your machine. Instead the game sends
`md5(guid + today's date in UTC)`, and our service hashes that again with a
secret before it is stored.

Because the date is part of it, the value is different every day. We can count
how many distinct people played on a given day. We cannot tell that a player on
Monday is the same person as a player on Tuesday, and neither can anyone who
obtains a copy of the data.

This has a consequence we want to be plain about: because nothing in the data
identifies you, we cannot find your records to delete them on request. There is
no key to look you up by. If that trade is not acceptable to you, turn the
feature off.

## How to turn it off

Open the Quetoo console with the `~` key and enter:

```
set cl_analyticsUrl 0
```

The setting is saved, so you only need to do this once. It takes effect
immediately: nothing further is sent, including the message at exit.

## How long we keep it

Indefinitely, at present. The records are anonymous and small. If that changes,
this page changes with it.

## Player statistics are separate

The [leaderboard](/stats/) is a different system. Frags and captures are
reported by **servers**, not by your game, and they do carry your player name so
that the leaderboard can show it. Your `guid` is hashed before it is stored
there, and raw values are never kept.

If you want your leaderboard records removed, ask on
[Discord](https://discord.gg/unb9U4b). That data can be looked up by name, so
that request can be honoured.

## This website

quetoo.org uses Google Analytics to measure page visits. That is separate from
the game, is governed by
[Google's privacy policy](https://policies.google.com/privacy), and your browser
settings or an ad blocker will stop it.

## Questions

Ask on [Discord](https://discord.gg/unb9U4b), or open an issue on
[GitHub](https://github.com/jdolan/quetoo).

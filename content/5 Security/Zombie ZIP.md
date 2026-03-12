---
title: Zombie ZIP
tags:
  - security
  - malware
  - evasion
  - zip
date: 2026-03-10
---

A malware smuggling technique that exploits ambiguity in the ZIP file format to slip past security scanners undetected. Tracked as **CVE-2026-0866** and **VU#976247**, published March 10, 2026 by Chris Aziz of Bombadil Systems.

Tested against 66–67 VirusTotal engines: **98% evasion rate** (1/66 detections vs. 55/67 for a valid ZIP with the same payload).

## How It Works

A Zombie ZIP is a deliberately malformed archive with three mismatched fields:

1. **Compression Method** field is set to `0` (STORED — uncompressed).
2. **Actual bytes** are DEFLATE-compressed data.
3. **CRC-32** matches the *uncompressed* payload, not the raw stored bytes.

This is called **method field desynchronization**:

- **Security scanners** trust the declared method (`0 = STORED`) and scan the raw bytes, which look like opaque compressed noise — no signatures match.
- **A custom loader** ignores the declaration and decompresses as DEFLATE, recovering the original payload byte-for-byte.

## Attack Flow

1. Attacker packages malware into a Zombie ZIP.
2. Archive crosses security boundaries (email gateways, network scanners, endpoint AV) — all report clean.
3. A custom loader (shipped separately or embedded in a dropper) decompresses the payload.
4. Payload executes.

## Detection

Only **Kingsoft AV** detected the malformed archive in VirusTotal testing. All major engines — Microsoft Defender, Avast, Bitdefender, ESET, Kaspersky, McAfee, Sophos, TrendMicro — missed it.

## Historical Context

Not an entirely new class of bug. Similar issues go back to **CVE-2004-0935** (ESET bypass via malformed ZIP headers) and **VU#968818** (CERT/CC, 2004). Zombie ZIP formalizes the technique with a specific primitive and demonstrates it still works against modern AV in 2026.

## Sources

- [bombadil-systems/zombie-zip](https://github.com/bombadil-systems/zombie-zip) — PoC repository
- [New Zombie ZIP technique lets malware slip past security tools](https://www.bleepingcomputer.com/news/security/new-zombie-zip-technique-lets-malware-slip-past-security-tools/) — BleepingComputer

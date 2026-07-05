---
title: Specification-Based Fault Localization in LLM-Based Multi-Agent Systems
tags:
  - research
  - ai
  - agents
  - llm
date: 2026-06-24
---

My bachelor's thesis at TU Delft (defended June 2026). It asks a deceptively simple question: when a team of LLM agents fails at a task, **which agent — at which step — actually caused the failure**, and can we find that out automatically?

> [!abstract] TL;DR
> A six-stage pipeline extracts behavioral **specifications** from multi-agent execution traces, checks them for violations, and uses those violation logs to attribute the fault. On the annotated **MAST Multi-Agent Debate** dataset it reaches **33.3% strict** and **50.0% strict-family** accuracy — substantially better than the baselines. The finding that surprised me most: it's the _content_ of the constraints, not their syntactic structure, that drives diagnostic quality.

## The problem

LLM-based multi-agent systems fail in messy, diffuse ways. A debate stalls, an agent hallucinates a premise, a hand-off drops context — and by the time the final answer is wrong, the root cause is buried somewhere in a long, heterogeneous execution trace. Manually reading those traces to assign blame doesn't scale, and generic "ask an LLM what went wrong" attribution is noisy and hard to trust.

The thesis investigates whether **specification-based** reasoning — turning implicit expectations about agent behavior into explicit, checkable constraints — can localize these failures more reliably.

## Approach

A six-stage pipeline that turns a raw trace into a defensible attribution:

- **Trace normalization** — custom normalizers for **6 heterogeneous log formats**, so downstream stages see one consistent representation regardless of how each framework logs its runs.
- **Specification extraction** — pull behavioral expectations out of the trace as candidate constraints.
- **Dynamic constraint generation** — specialize those constraints to the concrete run being analyzed.
- **Violation checking** — evaluate the constraints against the trace and emit a **structured validation log** that records exactly what held and what broke.
- **LLM-as-a-judge attribution** — use that validation log as _evidence_ to attribute the failure to a specific agent and step, rather than asking the model to guess from the raw trace.

The structured validation log is the crux: it forces the final judgment to be grounded in observed constraint violations instead of free-form speculation.

## Results

Evaluated on the annotated **MAST Multi-Agent Debate** dataset:

- **33.3%** strict-mode accuracy and **50.0%** strict-family accuracy.
- Substantially outperforms the baseline attribution methods.
- Ablations point to **constraint content** — not syntactic structure — as the dominant driver of diagnostic effectiveness.

## Details

- **Author:** Mete Aksoy
- **Supervisors:** B. Özkan, A. Panichella, Z. Seyedghorban
- **Programme:** BSc Computer Science & Engineering, TU Delft
- **Defended:** 24 June 2026

Full thesis (open access): [TU Delft Repository](https://resolver.tudelft.nl/uuid:a36c8e5c-59d8-439f-9155-bef21bf807ab)

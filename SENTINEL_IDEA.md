# Sentinel — Idea Overview

## What Is It?

Sentinel is a multi-agent business intelligence system that monitors the blind spots every company has but no one is actively watching. Instead of hiring an analyst or manually googling vendors and regulations every week, Sentinel runs three specialized AI agents in parallel and delivers a structured risk digest on demand.

> *"Your business has blind spots. Sentinel watches all of them so you don't have to."*

Built on Google ADK with real external integrations — Brave Search API and Google Drive MCP — not mocked data or static reports.

---

## The 3 Features

### 1. Vendor Risk Monitor
Tracks your key suppliers and tech vendors for signals that could disrupt your business before you find out the hard way. For each vendor, Sentinel searches for recent news, hiring or layoff patterns, and outage or incident reports — then surfaces a severity-scored finding with a plain-English impact statement.

**Why it matters:** If your payment processor is quietly laying off its reliability team, or your cloud provider had three incidents this month, you should know now — not when your service goes down.

---

### 2. Regulatory Radar
Watches for compliance and regulatory changes relevant to your industry and region. Sentinel searches authoritative sources for new laws, policy updates, and enforcement changes — and tells you what your company needs to do about it, not just that something changed.

**Why it matters:** Regulatory changes are public information but nobody reads them. Companies get fined or scramble to comply at the last minute because no one was watching. Sentinel closes that gap automatically.

---

### 3. Knowledge Health Audit
Connects directly to your company's Google Drive via MCP and audits your internal documentation. It flags documents that haven't been updated in over 90 days, identifies missing SOPs in critical categories (onboarding, incident response, security policy), and samples recent docs to assess overall knowledge quality.

**Why it matters:** Stale or missing internal docs are a silent operational risk — new hires get bad information, incidents get handled inconsistently, and institutional knowledge lives in people's heads. Sentinel makes the invisible visible.

---

## How It All Comes Together

A Manager Agent coordinates all three monitors in parallel and synthesizes the findings into a single digest with an executive summary and overall risk scores. The output streams in real time to a clean React UI — color-coded by severity, readable by anyone in the company, not just technical staff.

One run. Three monitors. Zero manual research.

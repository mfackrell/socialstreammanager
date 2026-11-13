# SSM 2.0 — Build Contract (working baseline)

Status: foundation branch; implementation and production cutover not yet accepted.
Date: 2026-11-13.
Owner: SSM project owner. This document does not override later explicit owner decisions.

## Product scope

SSM includes four independently operable products:
1. Content Kinetics — brand-specific topic selection, platform-specific text/images/reels, schedules, and publishing.
2. TalkStack — audio/video/RSS-to-written content workflows and configured delivery.
3. PostStack — social/blog/feed-to-newsletter workflows and configured delivery.
4. QuickAsset — digital assets, Stripe Connect checkout, and verified fulfillment.

**Feature preservation rule:** Existing live and historically required functions, brand configurations, creative recipes, schedules, formats, and integrations may not be removed or materially changed without explicit owner approval. Marketing claims and historical code features need independent verification; neither alone proves production functionality.

## Locked platform decisions

- Internal SSM Control Center: Next.js on Vercel, access-restricted.
- Data and authentication: a dedicated Supabase environment, with tenant isolation and audit records.
- GPU-intensive image/video media: RunPod, retaining qualified FFmpeg/Python paths.
- Social publishing: Zapier remains the posting provider.
- Workflow generation/orchestration: SSM-owned cloud application code with durable jobs, explicit statuses, retry and recovery logic.
- Google Cloud: existing legacy services remain untouched until migrated workflows pass parity tests; no required Google Cloud dependencies in the accepted target.
- All infrastructure cloud-hosted; no locally operated or owned hardware.
- Katie's Developer Orchestrator and OpenAI Agents API are **not dependencies** of SSM.

## First implementation milestone: internal Control Center and one verified publishing workflow

1. Set up a separate development/staging environment; preserve the existing production site and pipelines.
2. Build the restricted Control Center shell and authentication.
3. Model workspaces, brands, social-profile connections (without storing platform passwords), content recipes, schedules, jobs, and publication attempts in Supabase.
4. Implement one deterministic, persisted workflow for a legacy static-content recipe, from topic through asset and caption generation to Zapier handoff.
5. Capture distinct statuses for generated, delivered-to-Zapier, and verified-published, without treating webhook HTTP success as proof of a social publication.
6. Perform approved end-to-end testing with a controlled social profile; prevent unintended public posts.
7. Expand to additional legacy recipes only after QA verifies the first vertical slice.

## Acceptance requirements

- No premature changes to legacy production configurations, Zapier Zaps, Stripe checkout, or cloud services.
- All changes on a reviewable branch and tested before merge.
- No unapproved paid provisioning or production publishing.
- No secrets committed to GitHub or returned in client-side bundles.
- No unverified claims of successful publication.
- Recorded job and publishing IDs support idempotency and safe failure recovery.
- Security, multi-tenant isolation, and business-critical feature parity independently tested.
- Migration of each legacy recipe is reversible until owner-authorized cutover.

## Initial read-only account findings (2026-11-13)

- The existing `socialstreammanager` repository contains primarily static HTML product pages with selected payment/upload APIs, rather than a unified internal administration application.
- The connected Vercel account returned no project matching searches for `ssm` or `socialstream` (this does not establish that no differently named project exists).
- The connected Supabase account lists SFM Newsletter, SBS Portal, and Katie; no dedicated SSM project was identified.
- Historical GitHub workflows remain a critical source of accepted requirements. Zapier configurations and live cloud inventory have not yet been independently inspected here.

## Unresolved prerequisite decisions

- Provisioning and any associated charges for a dedicated SSM Supabase project.
- Choice of deployment/project organization on Vercel and appropriate domain.
- Read-only or exported access to the historical Zapier configurations for exact publishing contracts.
- Final approved atomic feature-parity register and safe first test destinations.

## Immediate next development task

Create the internal Control Center application under `apps/control-center` on this non-production branch, using the current Next.js/Supabase SSR security guidance; do not deploy or connect production accounts before prerequisites are approved.

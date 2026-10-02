# Manhattan surgical edit verification

Task: https://admin.gomega.ai/tasks/4ac56c9b-60ef-43d7-82f8-4c84b15ef5a0

Implementation: https://github.com/Landing-Pages-Websites/grindhouse-gym/commit/d48f1ff2e51f4ee6ba697b46cc589a727681d37e

The implementation changes only the first hero trust label from `Ice Baths & Cold Plunge` to `Sauna, Cold Plunge`. The original contact form was present in both immutable pre-edit source and production before the edit; preserve it, do not invent a replacement.

Verification on 2026-10-02:
- Live Manhattan HTML equals c9675c6 with only that literal label replacement.
- The shared JavaScript and CSS are byte-identical to c9675c6.
- The existing form retains first_name, last_name, email, phone and reason, and the Book 3 Day Trial CTAs still target #contact.
- Empty click: zero submit events and zero lead requests.
- Five rapid clicks: one native submit and one HTTP 200 lead request; original success state shown.
- Test lead 9da8119e-b1ec-4bfa-b80c-4137a90efa10 persisted with separate fields and auto_is_test=true. Test email qatest+1790958690@gomega.ai; customer notification not sent.
- Desktop 1440x900 and mobile 390x844 rendered without horizontal overflow.

This document provides retrospective review evidence for the implementation, which a prior run incorrectly pushed directly to main. Reviewers should inspect the linked implementation diff explicitly as well as this document. Future edits must go through the LP Ship Rule review-before-merge path.

# Vehicle environment web implementation

The vehicle-control screens from the supplied presentation (pages 29–32 / screen IDs 23–26) are implemented as a separate `#vehicle` route, using the application's existing React/TypeScript components, night palette and original cabin/vehicle assets. The latest user-provided dashboard reference informed the mobile vehicle hero, compact battery/range readouts and round quick actions. Vehicle environment is the fifth primary bottom navigation item after Sky, Solar system, Journey and Memories, with the compact visible label “차량” / “Vehicle” and a full translated accessible name. The previous header entry has been removed. The desktop parked-status area and roof toolbar retain their contextual entries, and the vehicle page returns to the context from which it was opened.

## Scope and source of values

This is an explicitly labeled **browser simulation**, with no physical vehicle query or control. Initial battery 85%, estimated range 420 km, cabin sensor 21.5°C and target climate 22°C are example values. Starting the control demo enables simulated requests; simply opening the page does not actuate anything. Values are not estimates of the user's car or an assurance of available camping/return-trip time.

| Area | Implemented behavior |
| --- | --- |
| Care | Example battery/range, lock state, cabin sensor and front target temperature; lock/unlock acknowledgement and readback; refresh example timestamp; separately stored self-reported condition; shortcuts to climate and roof viewing. CO₂/CO sensors remain unconnected. |
| Windows | Choose any of four windows; vent toward 25% open, close toward 0%, stop pending/moving requests and retain the current opening. The percentage/illustration reflects simulated movement rather than only a button notification. |
| Climate | Front/rear zones; separate draft temperature, fan, fresh-air/recirculation and power values; apply, pending state and observed demo readback; independent zone settings. |
| Lighting | On/off and brightness draft; apply and readback; a cabin-light preview changes with the applied brightness. This is separate from app screen brightness. |
| Seats | Four selectable positions; backrest and fore/aft draft; apply/reset with a corresponding seat diagram. No real seat-motion units or safe limits are claimed. |

The simulation uses 16–28°C in 0.5°C steps, fan 0–5, lighting 0–100%, seat recline 10–45° and fore/aft position 0–100%. Those are explicit example capabilities and are not official Pleos ranges. No sunroof, charging, driving-mode, vehicle-power shutdown, automatic driving or automatic SOS feature is added.

## State and control adapter

`vehicleControlTypes.ts` defines application interfaces. `vehicleControls.ts` is the current in-memory demo implementation. It checks active demo state, availability, parked state and the selected feature's capability before accepting a command. Values change only after the simulated acknowledgement. Failed and timed-out requests retain the previous applied values. Windows have actual simulated progress, cancellation and a stop action. Status/permission/capability loss cancels pending work and stops motion; returning to a valid state does not silently resume motion.

Read-only value observation, requested settings and applied state are distinct. The current source is always `demo`. Immutable snapshots and request IDs prevent stale callbacks or caller mutation from changing a later operation. No networking, SDK request or background upload is performed by this adapter. A future native adapter must be implemented and verified separately; see `VEHICLE_SDK_REVIEW.md`.

The hidden `#developer` page supplies data availability, one-shot reject/timeout, feature-support and parked/driving-state tests. Those switches are kept out of normal product flows. Unavailable or stale observations are shown as unavailable, with controls disabled and a reason. An app timer stops narration/BGM and returns from viewing; it does not change climate, lights or vehicle power. The timer continues while the user visits vehicle environment from roof mode.

## Persistence and shared viewing

Demo vehicle settings remain within the current page session; refreshing initializes the example vehicle rather than pretending to restore physical vehicle state. The selected tab and manually chosen condition are stored in this browser. They are not synced or uploaded. The condition selector is self-report, not a diagnosis. Object selection and existing playback remain intact while entering/leaving the vehicle page; users can continue or pause from the mini player.

Korean/English resources are separate in `vehicleStrings.ts`. Five tabs support arrow/Home/End navigation, controls have meaningful names and readback, and the page reflows for mobile and large text. Decorative horizontal rules were avoided following the user's latest preference. Actual assistive-technology user testing remains separate from implementation checks.

## Verification

Service state/cancellation checks are reproducible with `node .qa/vehicle-adapter.mjs`. Browser flows and limits are recorded in `VEHICLE_QA.md`. Successful web checks do not establish SDK permissions, native execution, vehicle capability, physical movement or safety certification.

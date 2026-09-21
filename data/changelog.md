# Proof — Release Notes

All notable changes to Proof are documented here. Newest releases first.

## 0.9.2

**New**

- **Develop is available on Mac.** Open Develop beside Grid, Loupe, and Survey, with non-destructive edits saved as part of the catalog workflow.
- **RAW and camera-rendered companions work together.** RAF/JPEG and RAF/HEIC-style pairs stay coupled for review and Develop camera-match previews, with a context-menu option to decouple a pair when you want separate files.
- **iPad controls are more complete.** The iPad interface keeps gaining native culling, filtering, and command-surface refinements while preserving touch-first workflows.

**Improvements**

- **The toolbar is cleaner.** Publish, Export, Add Folder, Import, Fuji-X-Raw, Info, Metadata, and Preferences are arranged more consistently, while bug reporting and update checks live in the Proof menu.
- **Import starts from one place.** Cameras and SD cards share a single Import entry point with a source picker and progress handoff.
- **Develop masks and curve controls are easier to use.** Linear, radial, and brush mask overlays draw above the image, brush strokes are visible while painting, tone-curve points drag freely, and sharpening avoids the grid artifact seen in the first Develop proof.

**Reliability**

- Preview/export parity, Develop render-contract documentation, RAW companion stacking, and desktop/iPad capability handling include the latest validation work from the 0.9.2 cycle.

## 0.9.1

**Improvements**

- **Mac menus feel native.** File commands now live in the macOS menu bar, with Edit, View, Window, Focus Mode, and export actions alongside the existing Proof app menu.
- **Survey comparisons get more room.** Shift+F opens a chrome-free Focus Mode for the selected Survey set, and each comparison image has a small remove button for dropping it from the set.
- **Loupe filmstrip clicks stay put.** Clicking a thumbnail no longer recenters the filmstrip; only edge thumbnails nudge the strip by one image.
- **Info customization moved to Preferences.** The toolbar keeps the compact Info toggle while overlay customization now lives in Preferences.
- **Fuji recipe import is more forgiving.** Imported recipe text handles more real-world formats before camera preview or conversion.

**Reliability**

- Camera conversion, folder/reconnect evidence, indexing, cache cleanup, and removable-card handling include the latest safety refinements from the 0.9.1 cycle.

## 0.9.0

**Improvements**

- **File commands are easier to find.** A new desktop File menu sits beside the catalog controls and exposes familiar commands for opening catalogs, adding folders, reconnecting and rescanning folders, revealing or renaming folders, moving photos to the Trash, renaming photos, and exporting selected photos or whole folders.
- **The Filter Bar is visible by default.** Rating, flag, label, keyword, date, camera, lens, and file-type filters are ready when Proof opens, without changing the iPad filter sheet.
- **Startup updates ask first.** Automatic update checks now show the available version, release notes, and clear **Update now** or **Later** choices before downloading. Installation still waits for catalog work, imports, exports, and unsaved edits to finish.
- **Beta opt-in no longer misses stable releases.** Proof now checks the beta feed first, then falls back to the stable updater feed so stable releases are still offered when no newer beta is available.

**Reliability**

- Proof 0.9.0 includes the 0.8.9 responsiveness and safety work for large imports, reconnects, rescans, Finder Trash deletes, card-import finalization, ordered thumbnail building, safer reconnect proposals, catalog-bound background work, sharper Survey previews, retryable Develop saves, and clearer export results.

## 0.8.9

**Fixes**

- **Oldest photos become ready first.** Desktop folder imports enter the catalog in capture-date order, and background thumbnails build oldest first without overlapping passes. Import counters advance consistently within each stage.
- **Image info is easier to scan.** The Info overlay control is now one compact button with mode dots, and image labels appear in the top-left of the photo frame.
- **Safer deletion on slow drives.** Finder Trash requests and file checks run on background workers. Network and permission errors no longer make Proof treat a photo as already deleted, and filesystem watching waits for a Proof deletion to finish.
- **Card-import progress stays steady.** The import window now keeps catalog finalization as its own stage, rejects stale progress events, and cleans up native listeners when the dialog closes.
- **Develop previews draw correctly from the first frame.** Opening a photo or changing its tone curve no longer briefly replaces the image with a red gradient.
- **Reconnect proposals stay safe.** Proof detects changed folders or photos before applying a suggested reconnect and keeps folder-picker operations tied to their original catalog.
- **Reconnect overlapping folders safely.** Moving a parent folder now reconnects its separately cataloged child folders together, preserving edits and stacks without creating duplicate photos. A conflicting destination leaves all affected catalog paths unchanged.
- **Survey returns to Fit reliably.** Returning from a zoomed comparison immediately restores the whole photograph while retaining its sharp preview.
- **Safer catalog switching.** Background thumbnails and People scans no longer apply results to a different or reopened catalog.
- **Responsive catalog loading.** Reopening and migrating the last-used catalog runs in the background while Proof waits for it to become available.
- **Retry failed reconnects.** When some suggested folders fail to reconnect, retry just those folders without repeating successful moves.
- **Export results stay accessible.** Open Activity Monitor after export finishes to review failures and retry them, even when no background task is running.
- **Rapid ratings stay consistent.** An older failed rating save no longer reverses a newer rating.

- Failed Develop saves retain your latest edits and offer Retry instead of discarding them.
- Folder operations and exports retain their originating catalog; protected catalog work prevents switching catalogs or installing updates mid-operation.
- Update checks show clearer outcomes and download progress, with a shared installation safety check for stable and beta updates.
- Survey retains sharp previews when changing comparisons and offers retry after preview loading failures.
- Export activity reports completed, failed, and skipped photos, preserves individual errors, and can retry only failed photos.
- Folder progress stays open through library refresh and reports recoverable errors without leaving a stuck progress dialog.

## 0.8.8

**Fixes**

- **Updates are checked reliably at startup.** Proof waits for the app to come online, retries transient feed failures, and provides a manual Check for updates control when you want to look immediately.

## 0.8.7

**Improvements**

- **Large folder work stays responsive.** Importing, reconnecting, and rescanning now run in the background with a persistent progress dialog showing the current stage, elapsed time, and file being processed.
- **Reconnect moved folders together.** After locating one folder on a moved drive, Proof can find nearby offline folders with matching stored files and reconnect the verified matches after confirmation.
- **See the metadata you need while culling.** The Metadata inspector is clearly separated from two configurable Info overlays that can show filenames, exposure, camera, lens, capture time, dimensions, and other key details in Grid, Loupe, and Survey.
- **Survey stays sharp.** Comparison photos load larger previews immediately and keep them at Fit, with a thumbnail row for changing the comparison set.

**Fixes**

- **Selections no longer leak between photos.** Loupe thumbnail clicks follow the same selection rules as Grid, and arrow keys cycle only through an active multi-selection without applying ratings or labels to stale photos.
- **Loupe navigation recovers after app switching.** Temporary pan and drag state resets when Proof loses focus, preventing stuck gestures and confusing thumbnail highlights.

## 0.8.6

**Improvements**

- **See each photograph while it imports.** Keep the SD-card import window open to see the photograph currently being copied, together with its filename and overall progress. Minimized imports continue quietly in the background without competing with the card for preview reads.
- **Move through the loupe without loading-message flicker.** Fast next/previous navigation now stays visually quiet. “Loading preview…” appears only when a photograph genuinely takes longer to render, while errors still appear immediately.

## 0.8.6-beta.1

**New**

- **Develop photographs non-destructively.** The opt-in Mac beta now has a dedicated Develop workspace for exposure, contrast, highlights, shadows, whites, blacks, white balance, vibrance, saturation, clarity, and sharpening. Every edit is stored as a reversible recipe rather than changing the original file.
- **Compare, inspect, and reuse a look.** Develop includes before/after comparison, a live histogram, undo and redo, built-in Clean, Punch, and Monochrome presets, and versioned copy/paste for carrying adjustments between photographs.
- **Export the finished photograph.** Edited RAW photographs render through the same color pipeline used by the preview and export through Proof's standard export window. Edited badges identify photographs with saved adjustments in the Grid, filmstrip, and Survey views.

**Fixes and beta safeguards**

- **Contrast changes tone without adding a colour cast.** Contrast is now applied to luminance around a true perceptual middle-grey pivot, so increasing it deepens shadows and lifts highlights without pulling saturated colours green or magenta.
- **RAW preview and export use one colour contract.** GPU previews and full-resolution Rust exports now share explicit D65-to-D50 adaptation and linear working-space transforms, with regression coverage for neutral grey and achromatic controls.
- **Fuji HEIC decoder failures can no longer look successful.** When macOS returns a blank image for a Fuji HEIC, Proof rejects it and uses the camera's embedded preview for browsing and Develop preview. Full-resolution edited HEIC export stops with an explanation rather than writing a blank or silently downscaled result; paired RAF files retain the full-resolution workflow.
- **Advanced tools are labelled honestly.** Tone Curve, HSL, Colour Grading, and Masks remain experimental while the core Develop workflow is exercised through the beta channel.

## 0.8.5

**New**

- **A complete workspace for each person.** Open someone to move between confirmed photos, strong matches, and possible matches; review one face or a batch with Yes, No, or Not Sure; and undo the last review. The loupe now keeps the selected face and its box in sync while you inspect or correct a result.
- **People is controllable from first scan to final export.** Choose the current album, the entire library, or Not Now during setup; pause, resume, rebuild, or reset the index in Preferences; search, sort, mark VIPs, hide people, review likely duplicate names with undo, save a live People search, and export or share selected people into collision-safe folders.
- **Import Fuji recipes and preview them on the camera.** Paste structured JSON or ordinary setting lists from ChatGPT, Gemini, a recipe website, or your own notes. Proof extracts the settings locally, preserves an optional source link, shows parser and camera-compatibility notes, and hands the recipe directly to the connected camera preview before conversion.

**Improvements**

- **People matching is broader without becoming careless.** Quality-weighted face prototypes retain useful differences in angle, age, and lighting, while crop sharpness and match margins keep ambiguous results in the review queue. Confirmed identities and durable rejections survive the required reprocessing pass.
- **Fuji X-Raw explains exactly what is ready.** The full-screen workspace identifies the RAF, camera, firmware, and verified or experimental profile; decodes supported as-shot values; groups related controls; explains D Range Priority dependencies; and labels Compare results so a rendered look can be promoted back into Develop with one click.
- **Imported Fuji settings are filtered safely at the camera boundary.** Unsupported controls and Dynamic Range values unavailable to the selected RAF are reported and omitted from preview, compare, and conversion calls without deleting the complete saved recipe.
- **Choose stable or beta Mac updates.** Preferences → General now includes an opt-in **Receive beta updates** switch. Stable remains the default; opting in checks a separate signed prerelease feed, and every downloaded beta is still verified with Proof's embedded updater key before installation.
- **Shared Library sync has an opt-in beta foundation.** A Mac and iPad can now keep one logical library's ratings, pick/reject flags, color labels, keywords, collections, develop adjustments, corrected capture times, and delete/restore state in sync while each device keeps its own local catalog. Sync objects and bootstrap snapshots are encrypted before they enter a user-selected iCloud Drive, Google Drive, Dropbox, or other Files/Finder folder; self-hosted Nextcloud and compatible WebDAV servers are available as an advanced option. This is user-owned storage, not a production Proof Cloud service.
- **Joining, recovery, and device trust are explicit.** Creating a shared library produces a recovery code that must be saved before continuing. A second device joins an empty catalog with that code, while staged protocol-v2 enrollment adds human-readable device names, pending owner approval, and owner-signed chained membership epochs for future-key distribution. Removing a device excludes it from future epoch-key envelopes; historical ciphertext is not re-encrypted, so its provider access must also be removed.
- **Encrypted transport moves can resume safely.** On desktop, Proof can copy immutable encrypted objects to another folder or WebDAV destination, resume an interrupted copy, and verify every destination hash. The current transport stays active until an explicit cutover, and the previous transport and its objects remain in place afterward.
- **Browse from an encrypted smart preview when an original is offline.** Proof can prepare bounded 2560-pixel JPEG previews, encrypt them before upload, and fetch only the photographs being viewed. Originals are never uploaded, smart previews can be disabled independently of metadata sync, and People and face data remain device-local.
- **Sync support is easier to diagnose safely.** Proof retains local run history for at most the newest 100 runs and 30 days, shows a recent subset with stable provider guidance, and exports a smaller redacted diagnostics subset that excludes paths, filenames, credentials, recovery codes, object keys, and metadata payloads.
- **Filter by file type.** The filter bar has a new File type dropdown listing the formats in your library (JPEG, HEIC, RAF, DNG…), so you can narrow a folder to just the RAWs, just the JPEGs, or any one format.
- **Imported photos show up as they land.** During an SD-card import into an existing library folder, photos now appear in the grid as each one is copied, instead of the whole batch only showing up once the import finishes.
- **Import starts in the folder you're looking at.** The import window's destination now defaults to the folder (and subfolder) you currently have open in the library, rather than always the first folder in the list.
- **Star ratings are easier to see in the loupe filmstrip.** The stars on filmstrip thumbnails are larger with a stronger dark outline, so they stay readable over light, bright images.
- **Filmstrip thumbnails show their real orientation.** Portrait shots in the loupe filmstrip now display upright at their true proportions instead of being cropped into a landscape frame.
- **Long jobs run in the background.** Publishing, batch exports, and camera imports now hand off to the background instead of holding a dialog open — click the action and keep working while it runs. (SD-card import already did this.)
- **A clickable activity monitor.** Click the progress area in the status bar to open a panel listing everything running in the background — publishes, exports, imports, thumbnail and preview building, face scans — each with its progress. Publishes, exports, and imports can be cancelled from there, and a minimized import can be reopened with Show. On iPad, a minimized camera import shows as a live chip in the top bar you can tap to reopen.
- **Deselect a range during import.** In the import window you could shift-click to select a run of photos; now shift-click also deselects a run. Click one photo off, then shift-click another, and everything between them clears in one action — handy for trimming a big selection.
- **See where a photo is published.** Click the cloud badge on a published photo (or open the Info panel) to see a "Published to" list — the service, account, album, and date for each place it went, with an "edited since" note when the photo has changed since it was last published. New publishes now also record which album they landed in.

## 0.7.5

**Improvements**

- **Keep using Proof while an SD-card import runs.** Once copying starts, the full-screen import window can be minimized while a live progress bar stays in the status bar. The library remains fully usable, and one click on Show reopens the import to check details or cancel.
- **See which photos have already been published.** Published photos now show a small cloud in the bottom-right corner of their Grid thumbnails, including collapsed RAW+JPEG pairs when either file has been published.
- **Preferences are easier to navigate.** Settings are now grouped into focused tabs for General, Culling, Files & Cache, Publishing, and Diagnostics, with a persistent scrollbar in every tab's content area.

**Fixes**

- **Imported photos appear immediately.** Finishing an SD-card import into the folder already open in the library now refreshes that folder automatically instead of leaving it blank until you click away and back.
- **The shared export renderer builds for iPad again.** Cache writes and performance timing used by both platforms are no longer accidentally hidden behind desktop-only compile guards.
- **Face-model loading is hardened.** Proof now uses the patched tract ONNX runtime line, removing newly disclosed model-parser and transitive denial-of-service vulnerabilities while preserving bundled YuNet and SFace inference.

## 0.7.4

**New**

- **People works like a focused photo search.** Switch the People gallery between the current album and the whole library, combine up to four people to find photos they all appear in, and review likely matches one at a time before anything is filed under a name. A person's result view now also lets you choose a cover, remove a mistaken match, create a collection from every visible result, or export/share the complete result set.
- **Build a film recipe without a photo or a camera.** Fuji X-Raw now opens straight into the recipe editor whether or not a RAF is selected, so you can read a published recipe's settings and type them in — film simulation, tone, white balance, grain, colour chrome — then save it under its own name. Selecting a RAF and connecting a camera is still what's needed to actually develop with it.
- **Set White Balance mode in Camera Develop.** The tethered Camera Develop dialog now has a White Balance section with a mode dropdown (Auto, Daylight, Shade, Fluorescent 1–3, Incandescent, Underwater, Color Temperature, Ambience Priority) alongside the existing WB Shift controls. Choosing Color Temperature enables a Kelvin selector (2500K–10000K) for dialing in an exact colour temperature.
- **D Range Priority is now adjustable in Camera Develop.** A new Off/Weak/Strong control sits next to Dynamic Range, matching the camera's own D Range Priority setting.
- **The full Grain Effect range.** Grain offered only Off; it now has Weak and Strong in both Small and Large, matching the camera's own two-part Grain Effect menu.
- **Publish to five more photo services.** Google Photos, SmugMug, Flickr, Dropbox, and OneDrive now join Immich and Apple Photos. Proof signs in through the system browser, keeps account credentials in the OS keychain, loads existing albums or folders, and can create a destination without leaving the publish dialog.
- **Put publish destinations in your preferred order.** Preferences ▸ Publishing now has up/down controls, and the chosen order is used by the Publish dialog.

**Fixes**

- **Highlight and Shadow Tone now match the camera's own range.** Both ran from -4 to +4 in whole steps, but Fujifilm cameras use -2 to +4 in halves. Values outside that range were sent to the camera and quietly ignored, so tone adjustments could appear to do nothing. Both controls now offer exactly the settings the camera accepts, and a half step such as +2.5 now reaches the camera instead of failing the preview.

- **Dynamic Range now offers only what the photograph can actually do.** DR200 and DR400 work by underexposing as the shot is taken and lifting it back during processing, so the room to do it has to be in the file already — it can't be added afterwards. Asking for more than a photograph holds gave a heavy green cast; Proof now greys out the settings that particular frame can't reach, the same way the camera's own software does.
- **A slow conversion no longer freezes Proof.** Waiting on the camera blocked everything else, so an unusually slow frame could lock the whole app up for a minute. Conversions now wait out of the way and the rest of Proof stays responsive.
- **Exposure shows its value again.** The readout is now written in thirds the way the camera writes it — +1/3, -1 2/3 — instead of a decimal that was too wide for the space and got cut off, which made the slider look like it wasn't doing anything.

**Improvements**

- **Fuji X-Raw is one name throughout.** The toolbar button and the window it opens now match, and the window fills the screen so the preview and every control are visible at once. The reset buttons beside each tone slider no longer crowd their values.

## 0.7.3

**Improvements**

- **Find a person in the current album or the whole library.** Opening a named person from a folder or collection now starts with that album and offers a one-click Library search, so a broad face match no longer pulls unrelated shoots into a focused cull.
- **Fuji RAW is clearer before you start.** The Camera Develop toolbar action is now labelled Fuji RAW, and explains that a RAF must be selected and a compatible Fujifilm camera connected in USB RAW conversion mode.

**Fixes**

- **Dropping a photo back onto the grid no longer traps Proof in a bare image view.** An accidental thumbnail drag released over the grid is now a safe no-op instead of letting the webview replace the library with the original image.

## 0.7.2

**New**

- **Choose an Immich album while publishing.** The publish dialog now loads existing albums into a dropdown with photo counts, or lets you create a new album without leaving Proof.
- **Browse an SD card by day.** The import window now fills the screen and groups photographs under Today, Yesterday, weekday, or full-date headings, making large cards much faster to scan.

**Fixes**

- **HEIC originals keep their correct shape in Immich.** Proof no longer converts an unedited HEIC master to JPEG while labeling it as HEIC, which could squeeze portraits into landscape proportions (and vice versa). Rendered fallbacks now advertise their real file type, and affected photos can be republished even when “Skip already published” is enabled.
- **Command-click selection behaves consistently.** Removing one photo from a multi-selection no longer unexpectedly changes which other photos are selected.

## 0.7.1

**New**

- **Save and compare Fuji camera-develop looks.** In the tethered Camera Develop dialog, save any combination of film simulation and tone settings as a named recipe you can reapply to future shoots with one click. A new Compare mode renders up to four recipes side by side on the same photo — straight from the camera's own processor, so what you see is exactly what a real export would look like, not a preview approximation.
- **Publish keeps your originals by default.** The publish dialog now leads with **Original**, which sends each file exactly as it sits on disk rather than re-encoding it — so publishing to Immich is a real backup, not a downsized copy. RAW files are converted to full-quality JPEG (no photo service can display a RAF or CR3), and a new **Also upload the RAW file** tickbox sends the untouched master alongside it. Choosing JPEG, PNG, TIFF or WebP brings back the quality and size controls as before.

**Improvements**

- **People finds far more photos of someone you've named.** Once you put a name to a face, Proof now recognises that person from everything you've confirmed rather than from a single photo — so the same face in different light, at a different angle, or years apart is matched instead of quietly left out. On a real catalogue this recovered around a third more photos of the people already named, without mixing anyone up. "Find Photos of This Person" gets the same treatment: searching from a face you've already named now finds essentially every other photo of them.
- **Label suggested faces in one click.** Each suggested person now shows quick buttons for the people you photograph most, so filing a suggestion under an existing name no longer needs the naming dialog — click the name and it's done. Filing a suggestion also re-checks the rest of your library, so if that stronger match picks up more photos of the same person, Proof tells you how many.

**Fixes**

- **The People gallery scrolls.** With more than a screenful of people the Suggested section simply couldn't be reached.
- **People moved to the top of the sidebar**, above Collections and set off by a divider.
- **Publishing to Immich no longer fails on every photo.** Immich rejected every upload with a validation error because Proof sent capture dates without a timezone. Photos now publish, and land on the right day in the Immich timeline.

**New**

- **Proof now knows who's who.** A new **People** entry in the sidebar collects everyone Proof has found in your photographs. Faces it's confident belong together appear as suggestions — give one a name and it becomes a person you can open any time to see every photo they're in. Type a name you've already used and the two are merged, which is exactly what you want when the same person turns up as several suggestions (a profile here, glasses there, ten years apart). Nothing is filed under a name until you say so, and anything you'd rather not see again can be dismissed for good. Opening People for the first time starts a scan of your whole catalogue; the gallery fills in as it goes, so a large library is browsable long before it's finished. As ever, this all happens on your Mac — no photographs and no face data leave your machine.
- **Person search now covers the whole catalogue.** "Find Photos of This Person" is no longer limited to the folder you're standing in, and the best matches come first, so the strongest likenesses are at the top rather than scattered through the results. In a group shot Proof asks which face you meant instead of guessing at the biggest one. Results start appearing while the scan is still running.
- **Tag someone straight from the photo.** Right-click a photo and use **This is ▸** to file its face under an existing person, or start a new one — handy for the shot Proof didn't group on its own.
- **See where Proof found each face.** A new Preferences option, "Show face boxes in the loupe," draws a box around every face Proof has detected on the photo you're viewing — off by default, so it stays out of the way until you want it.
- **Resize and adjust quality on export.** The export dialog now has a Size row (Original or a long-edge preset — 2048, 3072, 4096px, or a custom size) and a quality slider for JPEG and WebP, so an export can be sized for email or a website instead of always coming out full resolution.
- **Publish straight to Immich or Apple Photos.** Right-click a selection and choose "Publish to…" to render and send photos to a self-hosted Immich server or straight into Apple Photos, with the same size and quality controls as export, an optional album, and a running progress bar that stays in the status bar even if you close the dialog. Proof remembers what's already been published and can skip it automatically, or flag it if you've edited the photo since. Add an Immich server in Preferences ▸ Publishing — the API key is stored in the macOS Keychain, never in a plain settings file. Apple Photos needs no setup; the first publish asks for permission to control Photos.

**Improvements**

- **The Info panel now shares the window instead of covering it.** Opening photo info narrows the grid or loupe to make room, rather than floating on top of your photos.

**Fixes**

- **A clearer message when a person has no photographs left.** Opening a person whose photos had all been moved or deleted claimed they were hidden by a filter, which was never true — that view has no filters of its own.

## 0.6.2

**Improvements**

- **Subfolders now have the same right-click actions as folders.** Right-clicking a subfolder in the sidebar gives you the full set — Reveal in Finder, Rename Folder…, Copy Folder Path, Rescan, New Collection from Folder…, Export All in Folder…, and Rebuild Folder Thumbnails — each scoped to that subfolder. Renaming works even when the subfolder has photos in it. And removing a subfolder now clears it from the sidebar only: it's removed from the catalogue, never deleted from disk.

## 0.6.1

**New**

- **Send feedback in one click.** A small bug icon next to Add Folder opens the feedback page in your browser, so reporting a problem or an idea doesn't mean hunting down an email address.
- **Fix a wrong camera clock or timezone.** Right-click one or more photos and choose "Adjust Date & Time…" (also on the Info panel) to correct when they were taken. Shift a whole shoot by a set number of hours when the camera was on the wrong timezone, type an exact date and time, or just set the timezone. A live preview shows the result before you apply, and RAW+JPEG pairs move together. The change is written into the photo's actual metadata — so exports and other apps see the corrected time too — with the original safely backed up alongside it.
- **More right-click actions on folders.** Right-click a folder in the sidebar for a fuller set of options. **Rename Folder…** renames the folder on disk — your photos and all their ratings and edits stay intact. **Copy Folder Path** puts the folder's location on the clipboard. **New Collection from Folder…** gathers everything in the folder (subfolders included) into a fresh collection. And **Export All in Folder…** opens the export dialog pre-loaded with the whole folder.

## 0.6.0

**New**

- **Import from an SD card.** Slot in a card and Proof opens an import dialog: preview the photos and pick the ones you want (shift-click to select a whole range at once), with shots it already has quietly set aside as suspected duplicates. Choose an existing folder or create a new one, drop everything in together or sort it into dated folders, and rename files on the way in with a live preview. You can give the whole batch a star rating or colour label as it lands, keep a second copy on a backup drive, and have Proof eject the card when it's done — with an off-by-default option to clear the card only once every file has been copied and verified.
- **Find every photo of a person.** Right-click a photo and choose "Find Photos of This Person" to narrow the folder to the shots that include them — handy for pulling one child out of a family session, or every frame of the bride. Clear the match from the bar above the grid when you're done. The first search in a folder scans it for faces in the background (you'll see the progress in the status bar); after that, photos you add later are picked up automatically. It all happens on your Mac — no photos or face data ever leave your machine.

**Improvements**

- **Folder counts show what's inside vs. tucked away.** A folder's number in the sidebar is now the photos actually in that folder, with a small **+N** beside it for how many more live in its subfolders. So France reading "579 +60" tells you at a glance there are 579 shots in France itself and 60 more down in its subfolders — no more wondering whether the count includes things you can't see.

**Fixes**

- **Photos you just imported can be deleted right away.** Importing into a folder that Proof hadn't yet confirmed on this Mac could leave the new photos stuck — trying to delete one gave a "refusing to delete" message, and its thumbnail wouldn't load. Importing now confirms the destination folder automatically, so it just works. Any older folders still in that state are now flagged in the sidebar with a **Reconnect…** button (and a clearer message when you open the catalogue) — one click restores them.

## 0.5.2

**New**

- **A folder now shows only its own photos.** Opening a folder shows the photos directly inside it, not everything buried in its subfolders — the way the Finder shows a folder. An "Include subfolders" button in the top bar (shown when a folder has subfolders) flips back to seeing everything at once. This means you can clear out a folder without a subfolder's keepers getting swept up in a Select All, or a Delete Rejected, that you thought only touched what was in front of you.
- **Empty folders stay put.** A subfolder no longer disappears the moment you move or delete the last photo out of it. It stays in the sidebar until you remove it yourself — right-click it and choose Remove Folder (only available once it's empty). This makes it safe to empty a folder as a staging step without losing the folder itself.
- **Choose where a new folder goes.** Dragging photos onto "New folder…" used to always tuck the folder inside whatever you were viewing. Now the dialog shows the destination and lets you pick a different one — including a brand-new location anywhere on disk, which gets added to Proof automatically.

**Fixes**

- **Delete Rejected now respects the folder you're in.** Deleting rejected photos while inside a subfolder used to quietly sweep rejects from the entire parent folder. It now trashes only the rejects in the view you're actually looking at.

**Under the hood**

- Subfolders are now tracked in the catalog rather than inferred from where photos happen to sit. Existing catalogs are backfilled on first open, so nothing changes in your sidebar — it's the groundwork for folders that stay put when emptied and can be created anywhere.

## 0.5.1

**Improvements**

- **Deleting a lot of photos is dramatically faster.** Culling a large selection used to lock the app up — 600 photos took nearly two minutes, far longer than doing the same thing in the Finder. Photos are now sent to the Trash in batches instead of one at a time, which takes a few seconds for the same 600.
- **Deletes now show progress.** A big delete reports how far along it is in the status bar, so a long cull no longer looks like the app has frozen.
- **No more thumbnail flash in the loupe.** Opening a photo used to show its small grid thumbnail for a moment, which then jumped up in size as the full preview appeared. The loupe now shows the full-size image directly, with no size jump.
- **The delete prompt now warns about rated photos.** When a delete would include photos you've given stars to, the confirmation says how many. It also spells out that pulling files back out of the Trash restores the images but not their ratings — so a delete you didn't quite mean is now something you can catch before it happens, not after.
- **Select All says when it's only selecting part of the library.** With a filter active, Select All picks the photos you can see, not the whole folder — easy to forget when the next keystroke is Delete. It now confirms how many photos it selected and how many of those are rated.
- **Proof reopens the folder you were last in.** Launching no longer drops you back at the top of the library — it returns to the folder, subfolder, or collection you were working in. Each catalog remembers its own place, and if that folder has since been removed you land back at All Photos.
- **Zoom now sticks as you move between photos.** Zoom to 100% to check focus and the next photo opens at 100% too, and the one after that — so checking sharpness across a run of frames no longer means re-zooming every single time. Each photo is centred as it opens, and one click back to Fit still applies to everything that follows.
- **The filter row starts collapsed.** Proof always opens with the filter row closed rather than reopening it because it happened to be down when you last quit.
- **Scroll to pan a zoomed photo.** When you're zoomed in on a photo, a two-finger trackpad scroll now moves around the image, so you can check different corners without reaching for the hand tool or holding space.

- **Photos put back from the Trash keep their ratings.** Deleting a photo used to throw away everything you'd done to it, so recovering the file from the Trash gave you back the image as an unrated stranger. Now the stars, flag, colour label and develop edits come back with it — the photo returns to the library as the one you'd already worked on. This survives the Trash renaming a file on its way in, which macOS does whenever the name is already taken.

**Under the hood**

- Deleting a photo no longer discards its catalog entry. The row is kept and marked deleted, then re-matched to the file if it comes back — by its previous location, or by capture time and file size when the name has changed. When two deleted photos are genuinely indistinguishable, Proof imports fresh rather than risk attaching your edits to the wrong frame.

## 0.5.0

**New**

- **Split filter bar.** The library chrome is now two bars: an indicator bar that always shows the current photo's state (flag, stars, colour label), and a separate filter row you can collapse when you don't need it. The Filter chip fills solid whenever filters are active, so a narrowed library is obvious at a glance instead of hiding behind a small dot.

**Under the hood**

- Groundwork for the Windows and Linux port: per-platform Tauri config overlays, a portable "reveal in file manager" that no longer shells out to Finder, per-OS approved-root lists, and per-OS log locations. macOS behaviour is unchanged.
- The dev server no longer binds IPv6-only, and webview devtools can be enabled opt-in for debugging.

## 0.4.1

**Fixes**

- **Sony HEIC orientation.** Sony HEIC files that record their rotation in `CameraOrientation` rather than the standard EXIF tag no longer appear sideways. Affected photos already in your catalog are corrected on next scan.

**New**

- **Rotate buttons in the crop tool.** Rotate a photo left or right directly from the crop UI.
- **Startup splash screen.** Launching Proof now shows a splash while the catalog opens, and long-running background work (scans, backfills) reports progress in the status bar instead of running invisibly.

## 0.4.0

**New**

- **RAW+JPEG capture stacks.** A RAW file and its same-name JPG shot together now appear as one capture: a single grid tile with a RAW+JPG badge, one entry in every count, and a RAW/JPG switch in the loupe bar to inspect either original. Flags, stars, color labels, keywords, and collections apply to the whole capture; moving, renaming, dragging out, or deleting a capture handles both files together (moves are all-or-nothing, so a pair can never be split across folders). Existing catalogs are paired automatically on first launch, adopting any ratings or flags you had already set. The Duplicates view still shows individual files for file-level cleanup.

**Improvements**

- **Higher-quality RAW exports.** Exports now use full-quality demosaicing (AHD, with X-Trans-aware processing for Fuji sensors) instead of the faster preview-grade interpolation. Interactive previews stay as fast as before.
- **Sturdier Develop caches.** Decoded RAW/HEIF frames are now written atomically, validated before use, and versioned so a future decoder change can never serve stale pixels; obsolete frames from earlier versions are cleaned up automatically.
- **Bounded export memory.** Batch exports run the memory-heavy full-resolution pipeline one photo at a time, preventing memory spikes when queuing many RAW exports.

## 0.3.9

**Fixes**

- **Fast relaunch.** Re-opening the app no longer re-reads metadata for every photo in the catalog. Unchanged files are skipped (a quick size/date check), so launch-time folder scans that used to take minutes on large catalogs now finish in about a second. New, changed, and reconnected files are still picked up exactly as before.
- **Film simulation now shows for JPEGs.** Catalogs created by older versions were missing the film-sim badge on Fuji JPEGs. On first launch, Proof backfills it for all existing photos in the background — including ACROS and other B&W modes, which are now labelled too.
- **No more `""` clutter in the Info panel.** Some Fuji files carry empty placeholder values in their metadata; these no longer show up as runs of quote marks in the metadata inspector. Cached metadata summaries refresh automatically.
- **Cleaner camera info for new imports.** Cameras that write a trailing empty value in their EXIF fields (e.g. the X half) no longer produce mangled entries like `FUJIFILM",` in the catalog.

**Under the hood**

- SQLite now runs with `synchronous=NORMAL` (safe with the existing WAL journal) and a 5-second busy timeout, reducing lock stalls between the folder watcher and the UI.
- Folder rescans log their duration and scanned/skipped counts to `~/Library/Logs/Proof/proof.log`.

## 0.3.8

**Improvements**

- **Instant Loupe.** Opening a photo no longer waits on a full RAW/HEIF decode. RAW previews now come from the camera's embedded SOOC JPEG (film simulation baked in), so culling through a shoot is immediate; the full-quality develop pass only loads when you open Develop or the photo has saved edits.
- **True 1:1 zoom.** Zooming past 100% now shows a sharp, full-resolution overlay instead of an upscaled preview.
- **Photo metadata inspector.** A new panel (Info button or `I` key) shows full EXIF and Fuji recipe/maker-note details for the selected photo.

## 0.3.3

**Improvements**

- **Opens maximized.** Proof now launches filling the screen, like Lightroom, instead of a small centered window.
- **Loupe layout fix.** Scrolling the filmstrip no longer drags the sidebar and toolbar off-screen; the filmstrip scrolls on its own.

**Reliability & safety**

- **Safer file deletion.** Trash and cache-cleanup operations now verify a file lives inside a known catalog folder before touching it, so a corrupt or shared catalog can't cause unrelated files to be removed.
- **Hardened folder operations.** Moving photos and creating subfolders now reject path names that try to escape the target folder.
- **Correct thumbnail refresh.** Switching catalogs or filters no longer leaves some thumbnails permanently blank.

**Under the hood**

- Cleared all Clippy lints so the continuous-integration gate passes.
- Removed developer-only Camera Develop / Probe controls from the shipping UI.

## 0.3.2

**Stability & reliability**

- **Recover from graphics context loss.** If macOS reclaims the GPU (common under memory pressure while scrubbing large RAW files), the Develop/loupe view now rebuilds itself and re-loads the current image instead of freezing on a dead canvas.
- **No more white-screen crashes.** A top-level error boundary catches unexpected UI errors and offers a reload, keeping your catalog safe (it lives in the database, so a reload never loses work).
- **Persistent logs.** Proof now writes a diagnostic log to `~/Library/Logs/Proof/proof.log`, including any crash details, so problems can be diagnosed after the fact.
- **Sturdier internals.** Removed lock-poisoning failure modes that could cascade one error into repeated failures, and the folder watcher no longer aborts startup if the OS is under resource pressure.

**Fixes**

- **Drag-to-move now works with camera-locked files.** Files carrying the macOS immutable (`uchg`) flag — set by some cameras and backup tools — could fail to move with "Operation not permitted (os error 1)". Proof now clears the flag and retries, so the move completes.
- **Drag preview is the right size.** Dragging photos onto a sidebar folder now shows a small thumbnail under the cursor instead of a full-size image, and internal drops register reliably (the drag state is now cleared when the drag actually ends, not when it starts).
- **Consistent moves on failure.** If a file move can't be committed to the catalog, the moved files are reverted so disk and catalog never disagree.

**Under the hood**

- Continuous integration: every change now runs the Rust test suite, Clippy, and a frontend build automatically.

## 0.3.1

- Auto-updater points at the public releases feed so existing owners update automatically.

## 0.3.0

- Signing, notarization, and auto-updater support for a shippable, Gatekeeper-approved app.
- Loupe cache and Survey/loupe UX improvements.
- Selection-based Survey comparison with synced zoom.

## 0.2.x and earlier

- RAW + high-bit-depth HEIF develop (linear-ProPhoto pixel engine).
- Non-destructive offline/missing folder handling with a live folder watcher.
- Cataloging overhaul for culling speed and scale; folder tree, file moves, rename, drag-to-folder.
- Color grading, masks, star ratings, filtering, multi-format export.
- Preferences, context menus, full-screen loupe, hold-Space to pan.
- New "P" logo and cream accent rebrand.

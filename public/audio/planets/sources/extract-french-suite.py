#!/usr/bin/env python3
"""Extract identified movements of the freely redistributable Sankey MIDI.

The canonical note sequence is crosschecked against a separately archived MIDI
whose meter changes identify the individual movements. Performance timing and
pitch-bend/channel states come only from the Sankey archive version.
"""
import collections
import hashlib
import importlib.util
import itertools
import json
from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'french-suite-2'
OUTPUT.mkdir(exist_ok=True)
spec = importlib.util.spec_from_file_location('midi_renderer', ROOT / 'b/render-midi.py')
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)
division, events = renderer.read_midi(ROOT / 'bwv813-sankey.mid')
reference_division, reference = renderer.read_midi(ROOT / 'bwv813-laura.mid')

def note_ons(events):
    return [(tick, status & 15, data[0], data[1]) for tick, _, category, status, data in events
            if category == 'channel' and status >> 4 == 9 and data[1]]

def canonical_pitch_sequence(notes):
    return [pitch for _, group in itertools.groupby(notes, key=lambda n: n[0])
            for pitch in sorted(n[2] for n in group)]

def vlq(value):
    result = [value & 127]
    value >>= 7
    while value:
        result.insert(0, (value & 127) | 128)
        value >>= 7
    return bytes(result)

def track(encoded_events):
    data = bytearray()
    previous = 0
    for tick, event in sorted(encoded_events, key=lambda x: x[0]):
        data.extend(vlq(tick - previous))
        data.extend(event)
        previous = tick
    data.extend(b'\x00\xff\x2f\x00')
    return b'MTrk' + struct.pack('>I', len(data)) + data

def meta(kind, content):
    if isinstance(content, str):
        content = content.encode()
    return bytes([255, kind]) + vlq(len(content)) + content

source_notes = note_ons(events)
reference_notes = note_ons(reference)
assert len(source_notes) == len(reference_notes) == 2451
results = []
for title, lower, upper, meter in [('Allemande', 0, 498, (4, 2)), ('Sarabande', 976, 1350, (3, 2))]:
    selected_notes = source_notes[lower:upper]
    assert canonical_pitch_sequence(selected_notes) == canonical_pitch_sequence(reference_notes[lower:upper])
    start_tick = selected_notes[0][0]
    selected_note_events = []
    queues = collections.defaultdict(collections.deque)
    note_index = 0
    note_off_count = 0
    # Pair note offs across movement boundaries: a held cadence may overlap the
    # next movement. Keep its full release without including the next movement.
    for tick, _, category, status, data in events:
        if category != 'channel':
            continue
        kind = status >> 4
        channel = status & 15
        if kind == 9 and data[1]:
            selected = lower <= note_index < upper
            queues[(channel, data[0])].append(selected)
            note_index += 1
            if selected:
                selected_note_events.append((tick - start_tick, bytes([status, *data])))
        elif kind == 8 or (kind == 9 and not data[1]):
            queue = queues[(channel, data[0])]
            if not queue:
                raise ValueError('Unpaired source MIDI note off')
            if queue.popleft():
                selected_note_events.append((tick - start_tick, bytes([status, *data])))
                note_off_count += 1
    assert note_off_count == upper - lower
    # Carry original GM program, tuning bends and controllers into the excerpt.
    setup = [(0, bytes([status, *data])) for tick, _, category, status, data in events
             if category == 'channel' and tick == 0 and status >> 4 not in (8, 9)]
    title_text = f'J. S. Bach BWV 813 {title}; MIDI performance John Sankey'
    tempo = next(payload for tick, _, kind, status, payload in events if kind == 'meta' and status == 81)
    metadata = [(0, meta(3, title_text)), (0, meta(2, 'MIDI performance copyright John Sankey. See accompanying John-Sankey-PERMISSION.txt.')),
                (0, meta(81, tempo)), (0, meta(88, bytes([*meter, 24, 8])))]
    midi = b'MThd' + struct.pack('>IHHH', 6, 1, 2, division) + track(metadata) + track(setup + selected_note_events)
    path = OUTPUT / f'bwv813-{title.lower()}-sankey.mid'
    path.write_bytes(midi)
    results.append({'movement': title, 'midi': str(path), 'sourceNoteIndexRange': [lower, upper],
                    'sourceStartTick': start_tick, 'sourceStartSeconds': start_tick / division * .5,
                    'sourceLastNoteOffTick': start_tick + selected_note_events[-1][0],
                    'noteOnCount': upper - lower, 'noteOffCount': note_off_count,
                    'sourceMidiSha256': hashlib.sha256((ROOT / 'bwv813-sankey.mid').read_bytes()).hexdigest(),
                    'extractedMidiSha256': hashlib.sha256(midi).hexdigest(),
                    'canonicalPitchSequenceMatchesMeterAnnotatedReference': True,
                    'performanceTiming': 'Original inter-event timing, channels, tuning bends, all note lengths and encoded repeats preserved. Leading pre-roll and other movements removed.',
                    'referenceOnly': 'Laura MIDI meter changes mark I Allemande at 0, II Courante at 29184, III Sarabande at 61440, IV Air at 90240. Canonical simultaneous-chord pitch sequence exactly matches original for the extracted movement.'})
(OUTPUT / 'extraction.json').write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))

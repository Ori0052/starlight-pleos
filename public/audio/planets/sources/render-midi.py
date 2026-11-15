#!/usr/bin/env python3
"""Render a licensed MIDI score with an explicitly credited sampled instrument.

No notes are composed or substituted. Original encoded repeats are preserved as
encoded (this tool does not infer/unfold score repeat signs). Tempo may be scaled
uniformly, with the chosen interpretation recorded in JSON. No real performer is
claimed. Requires the existing libfluidsynth shared library and an authorized SF2.
"""
import argparse
import ctypes as C
import ctypes.util
import hashlib
import json
import math
from pathlib import Path
import struct
import wave


def read_midi(path):
    data = path.read_bytes()
    if data[:4] != b'MThd':
        raise ValueError('Not a MIDI file')
    header_size = int.from_bytes(data[4:8], 'big')
    midi_format, tracks, division = struct.unpack('>HHH', data[8:14])
    if midi_format not in (0, 1) or division & 0x8000:
        raise ValueError('Only metrical format 0/1 MIDI is supported')
    offset = 8 + header_size
    result = []
    for track_number in range(tracks):
        if data[offset:offset + 4] != b'MTrk':
            raise ValueError('Missing MIDI track')
        length = int.from_bytes(data[offset + 4:offset + 8], 'big')
        track = data[offset + 8:offset + 8 + length]
        offset += 8 + length
        position = 0
        tick = 0
        running = None
        def variable_length():
            nonlocal position
            value = 0
            while True:
                byte = track[position]
                position += 1
                value = (value << 7) | (byte & 127)
                if not byte & 128:
                    return value
        while position < len(track):
            tick += variable_length()
            status = track[position]
            if status < 128:
                if running is None:
                    raise ValueError('MIDI running status missing')
                status = running
            else:
                position += 1
                if status < 240:
                    running = status
            if status == 255:
                kind = track[position]
                position += 1
                size = variable_length()
                payload = track[position:position + size]
                position += size
                result.append((tick, track_number, 'meta', kind, payload))
            elif status in (240, 247):
                size = variable_length()
                position += size
            else:
                size = 1 if status >> 4 in (12, 13) else 2
                payload = list(track[position:position + size])
                position += size
                result.append((tick, track_number, 'channel', status, payload))
    return division, sorted(result, key=lambda event: (event[0], event[1]))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('midi', type=Path)
    parser.add_argument('soundfont', type=Path)
    parser.add_argument('wav', type=Path)
    parser.add_argument('--bpm', type=float)
    parser.add_argument('--program', type=int)
    parser.add_argument('--gain', type=float, default=.35)
    parser.add_argument('--tail', type=float, default=3)
    args = parser.parse_args()
    if args.bpm is not None and not 10 <= args.bpm <= 240:
        parser.error('BPM must be in 10–240')
    if args.program is not None and not 0 <= args.program <= 127:
        parser.error('GM program is zero-based, 0–127')
    division, events = read_midi(args.midi)
    first_tempo = next((int.from_bytes(e[4], 'big') for e in events if e[2] == 'meta' and e[3] == 81), 500000)
    original_bpm = 60000000 / first_tempo
    tempo_scale = original_bpm / args.bpm if args.bpm else 1
    tempo = 500000
    last_tick = 0
    second = 0
    timeline = []
    for tick, track, category, status, payload in events:
        second += (tick - last_tick) / division * tempo / 1000000 * tempo_scale
        last_tick = tick
        if category == 'meta' and status == 81:
            tempo = int.from_bytes(payload, 'big')
        elif category == 'channel':
            timeline.append((second, status, payload))
    lib = C.CDLL(ctypes.util.find_library('fluidsynth'))
    def function(name, result, *arguments):
        call = getattr(lib, name)
        call.restype = result
        call.argtypes = arguments
        return call
    ptr = C.c_void_p
    settings = function('new_fluid_settings', ptr)()
    set_num = function('fluid_settings_setnum', C.c_int, ptr, C.c_char_p, C.c_double)
    set_int = function('fluid_settings_setint', C.c_int, ptr, C.c_char_p, C.c_int)
    set_num(settings, b'synth.sample-rate', 44100)
    set_num(settings, b'synth.gain', args.gain)
    set_int(settings, b'synth.polyphony', 128)
    set_int(settings, b'synth.chorus.active', 0)
    set_int(settings, b'synth.reverb.active', 1)
    set_num(settings, b'synth.reverb.room-size', .55)
    set_num(settings, b'synth.reverb.damp', .45)
    set_num(settings, b'synth.reverb.width', 35)
    set_num(settings, b'synth.reverb.level', .16)
    synth = function('new_fluid_synth', ptr, ptr)(settings)
    soundfont_id = function('fluid_synth_sfload', C.c_int, ptr, C.c_char_p, C.c_int)(synth, str(args.soundfont).encode(), 1)
    if soundfont_id < 0:
        raise RuntimeError('SoundFont failed to load')
    program = function('fluid_synth_program_select', C.c_int, ptr, C.c_int, C.c_int, C.c_int, C.c_int)
    note_on = function('fluid_synth_noteon', C.c_int, ptr, C.c_int, C.c_int, C.c_int)
    note_off = function('fluid_synth_noteoff', C.c_int, ptr, C.c_int, C.c_int)
    control = function('fluid_synth_cc', C.c_int, ptr, C.c_int, C.c_int, C.c_int)
    program_change = function('fluid_synth_program_change', C.c_int, ptr, C.c_int, C.c_int)
    pitch_bend = function('fluid_synth_pitch_bend', C.c_int, ptr, C.c_int, C.c_int)
    write_audio = function('fluid_synth_write_s16', C.c_int, ptr, C.c_int, ptr, C.c_int, C.c_int, ptr, C.c_int, C.c_int)
    channels = sorted({status & 15 for _, status, _ in timeline})
    if args.program is not None:
        for channel in channels:
            program(synth, channel, soundfont_id, 0, args.program)
    rate = 44100
    args.wav.parent.mkdir(parents=True, exist_ok=True)
    current_frame = 0
    with wave.open(str(args.wav), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        def render_until(target):
            nonlocal current_frame
            while current_frame < target:
                frames = min(2048, target - current_frame)
                buffer = (C.c_short * (frames * 2))()
                if write_audio(synth, frames, buffer, 0, 2, buffer, 1, 2) < 0:
                    raise RuntimeError('FluidSynth rendering failed')
                wav.writeframesraw(bytes(buffer))
                current_frame += frames
        for when, status, payload in timeline:
            render_until(round(when * rate))
            kind = status >> 4
            channel = status & 15
            if kind == 9 and payload[1]:
                note_on(synth, channel, *payload)
            elif kind == 8 or (kind == 9 and not payload[1]):
                note_off(synth, channel, payload[0])
            elif kind == 11:
                control(synth, channel, *payload)
            elif kind == 12 and args.program is None:
                program_change(synth, channel, payload[0])
            elif kind == 14:
                pitch_bend(synth, channel, payload[0] | payload[1] << 7)
        render_until(math.ceil((second + args.tail) * rate))
    function('delete_fluid_synth', None, ptr)(synth)
    function('delete_fluid_settings', None, ptr)(settings)
    metadata = {
        'performance': 'Score-based digital performance; not a human instrumentalist recording',
        'inputMidi': str(args.midi),
        'inputSha256': hashlib.sha256(args.midi.read_bytes()).hexdigest(),
        'soundfont': str(args.soundfont),
        'soundfontSha256': hashlib.sha256(args.soundfont.read_bytes()).hexdigest(),
        'originalBpm': original_bpm, 'renderedBpm': args.bpm or original_bpm,
        'tempoScaling': tempo_scale, 'ticksPerQuarter': division,
        'sourceQuarterBeats': last_tick / division,
        'noteOnCount': sum(status >> 4 == 9 and payload[1] > 0 for _, status, payload in timeline),
        'noteOffCount': sum(status >> 4 == 8 or (status >> 4 == 9 and payload[1] == 0) for _, status, payload in timeline),
        'gmProgramOverrideZeroBased': args.program, 'channels': channels,
        'encodedRepeats': 'Preserved as encoded; no repeat signs inferred or unfolded',
        'sampleRate': rate, 'gain': args.gain, 'tailSeconds': args.tail,
        'reverb': {'roomSize': .55, 'damp': .45, 'width': 35, 'level': .16},
        'chorus': False, 'durationSeconds': current_frame / rate,
        'wavSha256': hashlib.sha256(args.wav.read_bytes()).hexdigest(),
    }
    args.wav.with_suffix('.render.json').write_text(json.dumps(metadata, indent=2))
    print(json.dumps(metadata, indent=2))


if __name__ == '__main__':
    main()

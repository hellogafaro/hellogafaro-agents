#!/usr/bin/env python3
import argparse
import base64
import binascii
from pathlib import Path
import struct
import sys

parser = argparse.ArgumentParser(description="Validate a runtime-supplied single Ed25519 public key; never print key material.")
parser.add_argument("public_key_file")
args = parser.parse_args()
try:
    text = Path(args.public_key_file).read_text(encoding="utf-8").strip()
    fields = text.split()
    if "\n" in text or "\r" in text or len(fields) < 2 or fields[0] != "ssh-ed25519":
        raise ValueError()
    wire = base64.b64decode(fields[1], validate=True)
    algorithm = b"ssh-ed25519"
    expected_header = struct.pack(">I", len(algorithm)) + algorithm + struct.pack(">I", 32)
    if len(wire) != len(expected_header) + 32 or not wire.startswith(expected_header):
        raise ValueError()
except (OSError, UnicodeError, ValueError, binascii.Error):
    print("validate-public-key.py: supply one valid Ed25519 public key without authorized-key options", file=sys.stderr)
    sys.exit(1)
print("Ed25519 public-key format valid; verify its fingerprint with the owner before installation.")

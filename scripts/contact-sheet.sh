#!/usr/bin/env bash
# Fügt Testbilder zu einer Übersicht zusammen: scripts/contact-sheet.sh "out/frames/t01*.png" out/sheet.png 2x3
set -e
ffmpeg -y -loglevel error -pattern_type glob -i "$1" -filter_complex "scale=960:-1,tile=${3:-2x4}:padding=6:color=0x333333" -frames:v 1 "$2"

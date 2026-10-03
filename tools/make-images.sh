#!/bin/sh
# Turns one screenshot into the responsive WebP sizes the pages expect.
#
#   tools/make-images.sh ~/Desktop/checkout.png assets/img/work/jar-garments/checkout
#   -> checkout-800.webp, checkout-1200.webp, checkout-1600.webp
#
# Pass a third argument to change the sizes, e.g. "800 1200 1600 2400".
# Needs macOS `sips` and `cwebp` (brew install webp).
set -eu

if [ $# -lt 2 ]; then
  echo "usage: $0 <source image> <output path without size or extension> [sizes]" >&2
  exit 1
fi

src=$1
out=$2
sizes=${3:-"800 1200 1600"}
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$(dirname "$out")"

for width in $sizes; do
  sips --resampleWidth "$width" "$src" --out "$tmp/$width.png" >/dev/null
  cwebp -quiet -q 80 -m 6 -sharp_yuv "$tmp/$width.png" -o "$out-$width.webp"
  echo "$out-$width.webp"
done

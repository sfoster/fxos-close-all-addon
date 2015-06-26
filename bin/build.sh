#!/bin/bash
scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
name="close-all-addon"
tmpdir=`mktemp -d` && cd $dir

cd "$scriptdir/.."
cp -R . $tmpdir
[ -e "$tmpdir/dist/${name}.zip" ] && rm "$tmpdir/dist/${name}.zip"
[ -d "$tmpdir/bin" ] && rm -R "$tmpdir/bin"

zip -R "${name}.zip" *
mv "${name}.zip" "$scriptdir/../dist/"

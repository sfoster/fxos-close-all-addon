#!/bin/bash
scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
name="close-all-addon"
tmpdir=`mktemp -d` && cd $dir
trap "rm -rf $tmpdir" EXIT

cd "$scriptdir/.."
cp -R . $tmpdir

zip -r "${name}.zip" . -x .git\* dist\* bin\*
mv "${name}.zip" "$scriptdir/../dist/"

#!/bin/bash
scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
name="close-all-addon"
tmpdir=`mktemp -d` && cd $dir
trap "rm -rf $tmpdir" EXIT

cd "$scriptdir/.."
cp -R . $tmpdir

zip -R "${name}.zip" * -x .git\* dist\* dir\*
mv "${name}.zip" "$scriptdir/../dist/"

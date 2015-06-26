#!/bin/bash
scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
name="close-all-addon"
tmpdir=`mktemp -d` && cd $dir
trap "rm -rf $tmpdir" EXIT

cd "$scriptdir/../src"
cp -R . $tmpdir

zip -r "${name}.zip" . -x .git\*
cd "$scriptdir/../dist/"
rm -R ./*
mv "$tmpdir/${name}.zip" ./
unzip "${name}.zip"

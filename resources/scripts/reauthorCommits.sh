#!/bin/bash

CURDIR=$(pwd)
BASEDIR=$(dirname $0)

cd $BASEDIR/../..
git filter-branch --env-filter '
WRONG_EMAIL="github.user-at-576386355408"
NEW_NAME="Brandon Cooke"
NEW_EMAIL="brandoncookedev@gmail.com"

if [ "$GIT_COMMITTER_EMAIL" = "$WRONG_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$NEW_NAME"
    export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$WRONG_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$NEW_NAME"
    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
cd $CURDIR
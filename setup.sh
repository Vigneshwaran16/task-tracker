#!/bin/bash

#echo "export CURRENT_TASKIT_DIR=$1" >> ~/.zshrc

arg_supplied=0

if [ $# -eq 0 ]
  then
    echo "No Path supplied. Exiting..."
    arg_supplied=1
fi

if [[ $arg_supplied -eq 0 ]]; then
    echo "export CURRENT_TASKIT_DIR=$1" >> ~/.zshrc
    source ~/.zshrc
fi

